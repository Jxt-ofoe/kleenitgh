import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'kleenit_dev_secret_change_in_production_12345';

/**
 * Compare plaintext password with bcrypt hash
 */
export async function verifyPassword(plainPassword, passwordHash) {
  return bcrypt.compare(plainPassword, passwordHash);
}

/**
 * Hash plaintext password using bcrypt with salt rounds
 */
export async function hashPassword(plainPassword, saltRounds = 12) {
  return bcrypt.hash(plainPassword, saltRounds);
}

/**
 * Sign JWT token for authenticated administrator
 */
export function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role || 'admin',
    },
    JWT_SECRET,
    { expiresIn: '12h' }
  );
}

/**
 * Verify JWT token and return decoded payload
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Extract auth token from Authorization header or cookie
 */
export function extractToken(req) {
  // Check Authorization header
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // Check Cookie header
  const cookieHeader = req.headers?.cookie;
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith('admin_token=')) {
        return cookie.substring('admin_token='.length).trim();
      }
    }
  }

  return null;
}

/**
 * Verify administrator authentication from request
 */
export function getAuthenticatedUser(req) {
  const token = extractToken(req);
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Higher-order function to protect API routes
 */
export function requireAdmin(handler) {
  return async (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: false,
        error: 'Unauthorized. Administrator authentication required.'
      }));
      return;
    }

    req.user = user;
    return handler(req, res);
  };
}
