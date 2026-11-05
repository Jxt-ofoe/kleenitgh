import { getDb } from '../db.js';
import { readJsonBody, sendJson, sanitize } from '../helpers.js';
import { getAuthenticatedUser } from '../auth.js';

const ALLOWED_STATUSES = ['new', 'contacted', 'confirmed', 'completed', 'cancelled'];

/**
 * List bookings with filtering, search, and pagination (Protected)
 */
export async function handleListBookings(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { success: false, error: 'Method Not Allowed' });
  }

  const user = getAuthenticatedUser(req);
  if (!user) {
    return sendJson(res, 401, { success: false, error: 'Unauthorized' });
  }

  // Parse URL search parameters
  const url = new URL(req.url, 'http://localhost');
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '15', 10)));
  const offset = (page - 1) * limit;

  const status = sanitize(url.searchParams.get('status') || '', 30).toLowerCase();
  const service = sanitize(url.searchParams.get('service') || '', 100);
  const search = sanitize(url.searchParams.get('search') || '', 100);
  const date = sanitize(url.searchParams.get('date') || '', 30);

  const whereConditions = [];
  const queryArgs = [];

  if (status && status !== 'all' && ALLOWED_STATUSES.includes(status)) {
    whereConditions.push('status = ?');
    queryArgs.push(status);
  }

  if (service && service !== 'all') {
    whereConditions.push('service LIKE ?');
    queryArgs.push(`%${service}%`);
  }

  if (date) {
    whereConditions.push('(booking_date = ? OR created_at LIKE ?)');
    queryArgs.push(date, `${date}%`);
  }

  if (search) {
    const digits = search.replace(/\D/g, '');
    let phonePattern = `%${search}%`;
    if (/^0\d{1,10}$/.test(digits)) {
      phonePattern = `%+233${digits.slice(1)}%`;
    } else if (digits.startsWith('233')) {
      phonePattern = `%+${digits}%`;
    }
    whereConditions.push(
      '(booking_reference LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ? OR customer_email LIKE ?)'
    );
    const pattern = `%${search}%`;
    queryArgs.push(pattern, pattern, phonePattern, pattern);
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  try {
    const db = getDb();

    // Count total matching records
    const countSql = `SELECT COUNT(*) as total FROM bookings ${whereClause}`;
    const countResult = await db.execute({
      sql: countSql,
      args: [...queryArgs]
    });
    const total = Number(countResult.rows[0]?.total || 0);
    const totalPages = Math.ceil(total / limit) || 1;

    // Fetch page of records
    const selectSql = `
      SELECT 
        id,
        booking_reference,
        customer_name,
        customer_phone,
        customer_email,
        service,
        city,
        booking_date,
        booking_time,
        message,
        internal_notes,
        booking_source,
        status,
        whatsapp_opened_at,
        created_at,
        updated_at
      FROM bookings
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const bookingsResult = await db.execute({
      sql: selectSql,
      args: [...queryArgs, limit, offset]
    });

    return sendJson(res, 200, {
      success: true,
      bookings: bookingsResult.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    });
  } catch (err) {
    console.error('[List Bookings Error]:', err.message);
    return sendJson(res, 500, {
      success: false,
      error: 'Failed to retrieve bookings.'
    });
  }
}

/**
 * Get individual booking details (Protected)
 */
export async function handleGetBooking(req, res, bookingId) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { success: false, error: 'Method Not Allowed' });
  }

  const user = getAuthenticatedUser(req);
  if (!user) {
    return sendJson(res, 401, { success: false, error: 'Unauthorized' });
  }

  if (!bookingId) {
    return sendJson(res, 400, { success: false, error: 'Booking identifier required' });
  }

  try {
    const db = getDb();
    const result = await db.execute({
      sql: `SELECT * FROM bookings WHERE id = ? OR booking_reference = ? LIMIT 1`,
      args: [bookingId, bookingId]
    });

    if (result.rows.length === 0) {
      return sendJson(res, 404, { success: false, error: 'Booking not found' });
    }

    return sendJson(res, 200, {
      success: true,
      booking: result.rows[0]
    });
  } catch (err) {
    console.error('[Get Booking Error]:', err.message);
    return sendJson(res, 500, { success: false, error: 'Failed to retrieve booking.' });
  }
}

/**
 * Update booking status (Protected)
 */
export async function handleUpdateStatus(req, res, bookingId) {
  if (req.method !== 'PATCH' && req.method !== 'POST') {
    return sendJson(res, 405, { success: false, error: 'Method Not Allowed' });
  }

  const user = getAuthenticatedUser(req);
  if (!user) {
    return sendJson(res, 401, { success: false, error: 'Unauthorized' });
  }

  const body = await readJsonBody(req);
  if (!body || (body.status === undefined && body.internal_notes === undefined)) {
    return sendJson(res, 400, { success: false, error: 'A status or internal notes update is required.' });
  }

  const updates = [];
  const args = [];

  if (body.status !== undefined) {
    const newStatus = sanitize(body.status, 30).toLowerCase();
    if (!ALLOWED_STATUSES.includes(newStatus)) {
      return sendJson(res, 400, {
        success: false,
        error: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(', ')}`
      });
    }
    updates.push('status = ?');
    args.push(newStatus);
  }

  if (body.internal_notes !== undefined) {
    if (typeof body.internal_notes !== 'string' || body.internal_notes.length > 5000) {
      return sendJson(res, 400, { success: false, error: 'Internal notes must be 5000 characters or fewer.' });
    }
    updates.push('internal_notes = ?');
    args.push(sanitize(body.internal_notes, 5000));
  }

  if (updates.length === 0) {
    return sendJson(res, 400, {
      success: false, error: 'No valid booking changes were provided.'
    });
  }

  const now = new Date().toISOString();
  updates.push('updated_at = ?');
  args.push(now, bookingId, bookingId);

  try {
    const db = getDb();
    const updateResult = await db.execute({
      sql: `UPDATE bookings SET ${updates.join(', ')} WHERE id = ? OR booking_reference = ?`,
      args
    });

    if (updateResult.rowsAffected === 0) {
      return sendJson(res, 404, { success: false, error: 'Booking not found' });
    }

    const fetched = await db.execute({
      sql: `SELECT * FROM bookings WHERE id = ? OR booking_reference = ? LIMIT 1`,
      args: [bookingId, bookingId]
    });

    return sendJson(res, 200, {
      success: true,
      message: 'Booking updated.',
      booking: fetched.rows[0]
    });
  } catch (err) {
    console.error('[Update Status Error]:', err.message);
    return sendJson(res, 500, { success: false, error: 'Failed to update booking status.' });
  }
}

/**
 * Retrieve dashboard overview statistics (Protected)
 */
export async function handleGetStats(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { success: false, error: 'Method Not Allowed' });
  }

  const user = getAuthenticatedUser(req);
  if (!user) {
    return sendJson(res, 401, { success: false, error: 'Unauthorized' });
  }

  try {
    const db = getDb();

    // Query aggregated statistics in a single performant query
    const result = await db.execute(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_count,
        SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contacted_count,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_count,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_count,
        SUM(CASE WHEN booking_source = 'website' THEN 1 ELSE 0 END) as website_count,
        SUM(CASE WHEN whatsapp_opened_at IS NOT NULL THEN 1 ELSE 0 END) as whatsapp_opened_count
      FROM bookings
    `);

    const row = result.rows[0] || {};

    const stats = {
      total: Number(row.total || 0),
      new: Number(row.new_count || 0),
      contacted: Number(row.contacted_count || 0),
      confirmed: Number(row.confirmed_count || 0),
      completed: Number(row.completed_count || 0),
      cancelled: Number(row.cancelled_count || 0),
      website: Number(row.website_count || 0),
      whatsapp_opened: Number(row.whatsapp_opened_count || 0),
    };

    return sendJson(res, 200, {
      success: true,
      stats
    });
  } catch (err) {
    console.error('[Dashboard Stats Error]:', err.message);
    return sendJson(res, 500, { success: false, error: 'Failed to retrieve dashboard statistics.' });
  }
}
