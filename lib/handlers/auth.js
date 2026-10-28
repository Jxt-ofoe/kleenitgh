import crypto from 'crypto';
import { getDb } from '../db.js';
import { readJsonBody, sendJson, sanitize } from '../helpers.js';
import { verifyPassword, hashPassword, signToken, getAuthenticatedUser } from '../auth.js';
import { checkRateLimit, checkLoginBruteForce, recordFailedLogin, clearFailedLogin } from '../rateLimit.js';

// Precomputed dummy bcrypt hash to protect against timing attacks and username enumeration
const DUMMY_HASH = '$2a$12$K1zW40w2W1bK0y8n0UeB.OU2M6XF7q4e0XW1e7Z.k9R1o3U6E4Mvy';

/**
 * Synchronize administrator from environment variables if configured
 */
async function syncEnvAdminIfConfigured(db) {
  const envUsername = (process.env.ADMIN_USERNAME || process.env.INITIAL_ADMIN_USERNAME || '').trim().toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD || process.env.INITIAL_ADMIN_PASSWORD || '';
  const envName = process.env.ADMIN_NAME || 'Kleenit Administrator';

  if (!envUsername || !envPassword || envPassword.length < 8) {
    return null;
  }

  try {
    const existing = await db.execute({
      sql: 'SELECT id, username, password_hash, name, role FROM admins WHERE username = ?',
      args: [envUsername]
    });

    if (existing.rows.length === 0) {
      const id = crypto.randomUUID();
      const hash = await hashPassword(envPassword, 12);
      const now = new Date().toISOString();
      await db.execute({
        sql: `INSERT INTO admins (id, username, password_hash, name, role, created_at)
              VALUES (?, ?, ?, ?, 'admin', ?)`,
        args: [id, envUsername, hash, envName, now]
      });
      console.log(`[Auth]: Initialized admin account "${envUsername}" from environment variables.`);
      return { id, username: envUsername, name: envName, role: 'admin' };
    }
  } catch (err) {
    console.warn('[Auth]: Could not sync admin from environment variables:', err.message);
  }
  return null;
}

/**
 * Handle Administrator Login with timing-attack and brute-force protection
 */
export async function handleLogin(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { success: false, error: 'Method Not Allowed' });
  }

  // 1. Check IP Lockout from repeated failed logins
  if (!checkLoginBruteForce(req, res)) {
    return;
  }

  // 2. Normal per-minute rate limiting: max 5 requests per minute per IP
  if (!checkRateLimit(req, res, { keyPrefix: 'admin_login', limit: 5, windowMs: 60 * 1000 })) {
    return;
  }

  const body = await readJsonBody(req);
  if (!body) {
    recordFailedLogin(req);
    return sendJson(res, 400, { success: false, error: 'Invalid login payload' });
  }

  const username = sanitize(body.username, 100).toLowerCase();
  const password = body.password ? String(body.password) : '';

  if (!username || !password) {
    recordFailedLogin(req);
    return sendJson(res, 400, {
      success: false,
      error: 'Username and password are required.'
    });
  }

  try {
    const db = getDb();

    // Check if administrator is configured via Vercel / .env environment variables
    await syncEnvAdminIfConfigured(db);

    const envUsername = (process.env.ADMIN_USERNAME || process.env.INITIAL_ADMIN_USERNAME || '').trim().toLowerCase();
    const envPassword = process.env.ADMIN_PASSWORD || process.env.INITIAL_ADMIN_PASSWORD || '';

    // Query admin using parameterized SQL
    const result = await db.execute({
      sql: 'SELECT id, username, password_hash, name, role FROM admins WHERE username = ?',
      args: [username]
    });

    let passwordValid = false;
    let admin = result.rows[0];

    if (!admin) {
      // Check if credentials match env admin directly
      if (envUsername && username === envUsername && password === envPassword) {
        const id = crypto.randomUUID();
        const hash = await hashPassword(password, 12);
        const now = new Date().toISOString();
        const name = process.env.ADMIN_NAME || 'Kleenit Administrator';
        await db.execute({
          sql: `INSERT INTO admins (id, username, password_hash, name, role, created_at) VALUES (?, ?, ?, ?, 'admin', ?)`,
          args: [id, username, hash, name, now]
        });
        admin = { id, username, name, role: 'admin' };
        passwordValid = true;
      } else {
        // User not found: execute dummy comparison so timing is indistinguishable
        await verifyPassword(password, DUMMY_HASH);
      }
    } else {
      // Check bcrypt hash from database
      passwordValid = await verifyPassword(password, admin.password_hash);

      // If database hash check failed, check if environment variable password was updated
      if (!passwordValid && envUsername && username === envUsername && password === envPassword) {
        const newHash = await hashPassword(password, 12);
        await db.execute({
          sql: 'UPDATE admins SET password_hash = ? WHERE id = ?',
          args: [newHash, admin.id]
        });
        passwordValid = true;
      }
    }

    if (!passwordValid || !admin) {
      recordFailedLogin(req);
      return sendJson(res, 401, {
        success: false,
        error: 'Invalid username or password.'
      });
    }

    // Login successful: reset failed attempt counter for this IP
    clearFailedLogin(req);

    const now = new Date().toISOString();
    await db.execute({
      sql: 'UPDATE admins SET last_login_at = ? WHERE id = ?',
      args: [now, admin.id]
    });

    const userPayload = {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      role: admin.role
    };

    const token = signToken(userPayload);
    const isProd = process.env.NODE_ENV === 'production';
    const secureFlag = isProd ? '; Secure' : '';

    // Set HttpOnly, SameSite=Strict cookie with 12 hour expiry
    const cookieHeader = `admin_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=43200${secureFlag}`;

    return sendJson(res, 200, {
      success: true,
      token,
      user: userPayload
    }, {
      'Set-Cookie': cookieHeader
    });
  } catch (err) {
    console.error('[Admin Login Error]:', err.message);
    return sendJson(res, 500, {
      success: false,
      error: 'An internal error occurred during authentication.'
    });
  }
}

/**
 * Handle Administrator Logout
 */
export async function handleLogout(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { success: false, error: 'Method Not Allowed' });
  }

  const isProd = process.env.NODE_ENV === 'production';
  const secureFlag = isProd ? '; Secure' : '';
  const clearCookie = `admin_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secureFlag}`;

  return sendJson(res, 200, {
    success: true,
    message: 'Logged out successfully.'
  }, {
    'Set-Cookie': clearCookie
  });
}

/**
 * Verify current admin session
 */
export async function handleMe(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { success: false, error: 'Method Not Allowed' });
  }

  const user = getAuthenticatedUser(req);
  if (!user) {
    return sendJson(res, 401, {
      authenticated: false,
      error: 'Not authenticated'
    });
  }

  try {
    const db = getDb();
    const result = await db.execute({
      sql: 'SELECT id, username, name, role, last_login_at FROM admins WHERE id = ?',
      args: [user.id]
    });

    if (result.rows.length === 0) {
      return sendJson(res, 401, {
        authenticated: false,
        error: 'Administrator record not found'
      });
    }

    const admin = result.rows[0];
    return sendJson(res, 200, {
      authenticated: true,
      user: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
        last_login_at: admin.last_login_at
      }
    });
  } catch (err) {
    console.error('[Admin Me Error]:', err.message);
    return sendJson(res, 500, {
      authenticated: false,
      error: 'Database error'
    });
  }
}
