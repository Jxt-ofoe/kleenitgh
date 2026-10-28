// Advanced rate limiter and brute-force protection for Kleenit Ghana
const hits = new Map();
const failedLoginAttempts = new Map();

// Periodic cleanup of stale records every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of hits.entries()) {
    if (now > record.resetTime) {
      hits.delete(key);
    }
  }
  for (const [ip, record] of failedLoginAttempts.entries()) {
    if (now > record.lockedUntil && now > record.windowReset) {
      failedLoginAttempts.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref?.();

/**
 * Get client IP address from request headers
 */
export function getClientIp(req) {
  const forwarded = req.headers?.['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers?.['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1';
}

/**
 * General rate limit checker
 */
export function checkRateLimit(req, res, { keyPrefix = 'global', limit = 10, windowMs = 60 * 1000 }) {
  const ip = getClientIp(req);
  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();

  const record = hits.get(key) || { count: 0, resetTime: now + windowMs };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
  } else {
    record.count += 1;
  }

  hits.set(key, record);

  if (record.count > limit) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    res.statusCode = 429;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Retry-After', retryAfter.toString());
    res.end(JSON.stringify({
      success: false,
      error: `Too many requests. Please try again in ${retryAfter} seconds.`,
      retryAfter,
    }));
    return false;
  }

  return true;
}

/**
 * Check if IP is currently locked out from login due to repeated failures
 */
export function checkLoginBruteForce(req, res) {
  const ip = getClientIp(req);
  const now = Date.now();
  const record = failedLoginAttempts.get(ip);

  if (record && record.lockedUntil && now < record.lockedUntil) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    const minutes = Math.ceil(remainingSeconds / 60);
    res.statusCode = 429;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Retry-After', remainingSeconds.toString());
    res.end(JSON.stringify({
      success: false,
      error: `Security Alert: Too many failed login attempts. Access temporarily locked for ${minutes} minute(s) to protect against unauthorized access.`,
      retryAfter: remainingSeconds,
    }));
    return false;
  }

  return true;
}

/**
 * Record a failed login attempt; trigger 15-minute IP lockout after 5 failures
 */
export function recordFailedLogin(req) {
  const ip = getClientIp(req);
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minute tracking window
  const lockoutMs = 15 * 60 * 1000; // 15 minute lockout
  const maxFailures = 5;

  const record = failedLoginAttempts.get(ip) || { count: 0, windowReset: now + windowMs, lockedUntil: null };

  if (now > record.windowReset) {
    record.count = 1;
    record.windowReset = now + windowMs;
    record.lockedUntil = null;
  } else {
    record.count += 1;
  }

  if (record.count >= maxFailures) {
    record.lockedUntil = now + lockoutMs;
    console.warn(`[Security Alert]: IP ${ip} has been locked out for 15 minutes due to ${record.count} consecutive failed login attempts.`);
  }

  failedLoginAttempts.set(ip, record);
}

/**
 * Clear failed attempts after successful login
 */
export function clearFailedLogin(req) {
  const ip = getClientIp(req);
  failedLoginAttempts.delete(ip);
}
