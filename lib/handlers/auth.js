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

    // Environment credentials are used only to create the initial admin account.
    await syncEnvAdminIfConfigured(db);

    // Query admin using parameterized SQL
    const result = await db.execute({
      sql: 'SELECT id, username, password_hash, name, role FROM admins WHERE username = ?',
      args: [username]
    });

    let passwordValid = false;
    let admin = result.rows[0];

    if (!admin) {
      // User not found: execute dummy comparison so timing is indistinguishable.
      await verifyPassword(password, DUMMY_HASH);
    } else {
      passwordValid = await verifyPassword(password, admin.password_hash);
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
 * Change the authenticated administrator's password
 */
export async function handleChangePassword(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { success: false, error: 'Method Not Allowed' });
  }

  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return sendJson(res, 401, { success: false, error: 'Unauthorized' });
  }

  if (!checkRateLimit(req, res, { keyPrefix: 'admin_password_change', limit: 5, windowMs: 60 * 1000 })) {
    return;
  }

  const body = await readJsonBody(req);
  if (!body || typeof body.currentPassword !== 'string' || typeof body.newPassword !== 'string') {
    return sendJson(res, 400, { success: false, error: 'Current and new passwords are required.' });
  }

  if (body.newPassword.length < 8) {
    return sendJson(res, 400, { success: false, error: 'New password must be at least 8 characters long.' });
  }

  if (Buffer.byteLength(body.newPassword, 'utf8') > 72) {
    return sendJson(res, 400, { success: false, error: 'New password must be 72 bytes or fewer.' });
  }

  if (body.currentPassword === body.newPassword) {
    return sendJson(res, 400, { success: false, error: 'New password must be different from the current password.' });
  }

  let passwordChangeStage = 'load-admin';
  try {
    const db = getDb();
    const result = await db.execute({
      sql: 'SELECT password_hash FROM admins WHERE id = ? AND role = ?',
      args: [user.id, 'admin']
    });

    if (result.rows.length === 0) {
      return sendJson(res, 401, { success: false, error: 'Administrator account not found.' });
    }

    const admin = result.rows[0];
    if (!await verifyPassword(body.currentPassword, admin.password_hash)) {
      return sendJson(res, 400, { success: false, error: 'Current password is incorrect.' });
    }

    passwordChangeStage = 'hash-new-password';
    const passwordHash = await hashPassword(body.newPassword, 12);
    passwordChangeStage = 'save-new-password';
    const updateResult = await db.execute({
      sql: 'UPDATE admins SET password_hash = ? WHERE id = ?',
      args: [passwordHash, user.id]
    });

    if (updateResult.rowsAffected !== 1) {
      console.error('[Admin Password Change Error]:', {
        message: 'Expected one administrator password row to be updated.',
        rowsAffected: updateResult.rowsAffected,
        stage: passwordChangeStage
      });
      return sendJson(res, 500, { success: false, error: 'Failed to change password.' });
    }

    return sendJson(res, 200, { success: true, message: 'Password changed successfully.' });
  } catch (err) {
    console.error('[Admin Password Change Error]:', {
      message: err.message,
      code: err.code,
      stage: passwordChangeStage
    });
    return sendJson(res, 500, { success: false, error: 'Failed to change password.' });
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
