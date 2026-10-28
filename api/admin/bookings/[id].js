import { handleGetBooking, handleUpdateStatus } from '../../../lib/handlers/admin.js';
import { sendJson } from '../../../lib/helpers.js';

export default async function handler(req, res) {
  let bookingId = req.query?.id;
  if (!bookingId) {
    const url = new URL(req.url, 'http://localhost');
    const parts = url.pathname.split('/').filter(Boolean);
    bookingId = parts[parts.length - 1];
  }

  if (req.method === 'GET') {
    return handleGetBooking(req, res, bookingId);
  }

  if (req.method === 'PATCH' || req.method === 'POST') {
    return handleUpdateStatus(req, res, bookingId);
  }

  return sendJson(res, 405, { success: false, error: 'Method Not Allowed' });
}
