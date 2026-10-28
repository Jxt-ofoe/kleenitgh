import { handleCreateBooking, handleTrackWhatsApp } from './handlers/bookings.js';
import { handleLogin, handleLogout, handleMe } from './handlers/auth.js';
import { handleListBookings, handleGetBooking, handleUpdateStatus, handleGetStats } from './handlers/admin.js';
import { sendJson } from './helpers.js';

/**
 * Universal API request dispatcher for local Vite development server and Node servers
 */
export async function apiRouter(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const pathname = url.pathname.replace(/\/+$/, '') || '/';

  // Security Headers
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // 1. Public Booking Submission
  if (pathname === '/api/bookings') {
    if (req.method === 'POST') {
      return handleCreateBooking(req, res);
    }
    return sendJson(res, 405, { success: false, error: 'Method Not Allowed' });
  }

  // 2. Track WhatsApp Handoff
  if (pathname === '/api/bookings/track-whatsapp') {
    if (req.method === 'POST') {
      return handleTrackWhatsApp(req, res);
    }
    return sendJson(res, 405, { success: false, error: 'Method Not Allowed' });
  }

  // 3. Admin Authentication
  if (pathname === '/api/auth/login') {
    return handleLogin(req, res);
  }

  if (pathname === '/api/auth/logout') {
    return handleLogout(req, res);
  }

  if (pathname === '/api/auth/me') {
    return handleMe(req, res);
  }

  // 4. Admin Stats
  if (pathname === '/api/admin/stats') {
    return handleGetStats(req, res);
  }

  // 5. Admin Bookings Collection
  if (pathname === '/api/admin/bookings') {
    return handleListBookings(req, res);
  }

  // 6. Admin Booking by ID (/api/admin/bookings/:id)
  const bookingIdMatch = pathname.match(/^\/api\/admin\/bookings\/([^/]+)$/);
  if (bookingIdMatch) {
    const bookingId = decodeURIComponent(bookingIdMatch[1]);
    if (req.method === 'GET') {
      return handleGetBooking(req, res, bookingId);
    }
    if (req.method === 'PATCH' || req.method === 'POST') {
      return handleUpdateStatus(req, res, bookingId);
    }
    return sendJson(res, 405, { success: false, error: 'Method Not Allowed' });
  }

  // Fallback 404 for unknown /api routes
  return sendJson(res, 404, { success: false, error: `API route not found: ${pathname}` });
}
