import crypto from 'crypto';
import { getDb } from '../db.js';
import { readJsonBody, sendJson, normalizeGhanaPhone, sanitize } from '../helpers.js';
import { checkRateLimit } from '../rateLimit.js';

/**
 * Handle new booking creation from the website form
 */
export async function handleCreateBooking(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { success: false, error: 'Method Not Allowed' });
  }

  // Abuse protection: max 10 submissions per minute per IP
  if (!checkRateLimit(req, res, { keyPrefix: 'booking_submit', limit: 10, windowMs: 60 * 1000 })) {
    return;
  }

  const body = await readJsonBody(req);
  if (!body) {
    return sendJson(res, 400, { success: false, error: 'Invalid or missing JSON payload' });
  }

  if (sanitize(body.website, 200)) {
    return sendJson(res, 422, { success: false, error: 'Unable to process this booking.' });
  }

  // Extract and sanitize fields
  const customerName = sanitize(body.customer_name || body.name, 100);
  const submittedPhone = sanitize(body.customer_phone || body.phone, 30);
  const customerPhone = normalizeGhanaPhone(submittedPhone);
  const customerEmail = sanitize(body.customer_email || body.email, 120);
  const service = sanitize(body.service, 120);
  const city = sanitize(body.city || body.location, 120);
  const bookingDate = sanitize(body.booking_date || body.date, 30);
  const bookingTime = sanitize(body.booking_time || body.time, 50);
  const message = sanitize(body.message, 1000);

  // Field validations
  if (!customerName || customerName.length < 2) {
    return sendJson(res, 422, {
      success: false,
      error: 'Please provide your full name (at least 2 characters).'
    });
  }

  if (!customerPhone) {
    return sendJson(res, 422, {
      success: false,
      error: 'Please provide a valid Ghanaian phone number.'
    });
  }

  if (!service || service.length < 2) {
    return sendJson(res, 422, {
      success: false,
      error: 'Please select or specify the cleaning service requested.'
    });
  }

  if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    return sendJson(res, 422, {
      success: false,
      error: 'The email address provided is invalid. Please check or leave empty.'
    });
  }

  if (bookingDate) {
    const parsedDate = new Date(`${bookingDate}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(bookingDate)
      || Number.isNaN(parsedDate.getTime())
      || parsedDate.toISOString().slice(0, 10) !== bookingDate) {
      return sendJson(res, 422, { success: false, error: 'Please provide a valid preferred date.' });
    }
  }

  // Prepare database record
  const id = crypto.randomUUID();
  const bookingSource = 'website'; // Automatically enforce 'website'
  const status = 'new';           // Automatically set to 'new'
  const now = new Date().toISOString();
  let bookingReferenceAllocated = false;

  try {
    const db = getDb();
    const counterResult = await db.execute({
      sql: `INSERT INTO booking_reference_counters (counter_name, last_value)
            VALUES ('bookings', 1)
            ON CONFLICT(counter_name) DO UPDATE SET last_value = last_value + 1
            RETURNING last_value`
    });
    const bookingReference = `KLN-${String(counterResult.rows[0].last_value).padStart(4, '0')}`;
    bookingReferenceAllocated = true;

    // Parameterized SQL query
    await db.execute({
      sql: `INSERT INTO bookings (
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
        booking_source,
        status,
        whatsapp_opened_at,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)`,
      args: [
        id,
        bookingReference,
        customerName,
        customerPhone,
        customerEmail || null,
        service,
        city || null,
        bookingDate || null,
        bookingTime || null,
        message || null,
        bookingSource,
        status,
        now,
        now
      ]
    });

    // Return success only after the database confirms the save
    return sendJson(res, 201, {
      success: true,
      message: 'Booking request saved successfully.',
      booking_reference: bookingReference,
      booking: {
        id,
        booking_reference: bookingReference,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || null,
        service,
        city: city || null,
        booking_date: bookingDate || null,
        booking_time: bookingTime || null,
        message: message || null,
        booking_source: bookingSource,
        status,
        created_at: now
      }
    });
  } catch (err) {
    console.error('[Create Booking Error]:', {
      message: err.message,
      code: err.code,
      stage: bookingReferenceAllocated ? 'insert-booking' : 'allocate-reference'
    });
    return sendJson(res, 500, {
      success: false,
      error: 'Booking could not be saved. Please try again.'
    });
  }
}

/**
 * Record WhatsApp handoff attempt
 */
export async function handleTrackWhatsApp(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { success: false, error: 'Method Not Allowed' });
  }

  const body = await readJsonBody(req);
  const bookingReference = sanitize(body?.booking_reference || body?.reference, 50);
  const bookingId = sanitize(body?.id, 100);

  if (!bookingReference && !bookingId) {
    return sendJson(res, 400, {
      success: false,
      error: 'booking_reference or id is required to track WhatsApp handoff'
    });
  }

  const now = new Date().toISOString();

  try {
    const db = getDb();
    const result = await db.execute({
      sql: `UPDATE bookings 
            SET whatsapp_opened_at = ?, updated_at = ? 
            WHERE booking_reference = ? OR id = ?`,
      args: [now, now, bookingReference || '', bookingId || '']
    });

    if (result.rowsAffected === 0) {
      return sendJson(res, 404, {
        success: false,
        error: 'Booking not found.'
      });
    }

    return sendJson(res, 200, {
      success: true,
      message: 'WhatsApp handoff recorded.',
      whatsapp_opened_at: now
    });
  } catch (err) {
    console.error('[Track WhatsApp Error]:', err.message);
    return sendJson(res, 500, {
      success: false,
      error: 'Failed to record WhatsApp handoff event.'
    });
  }
}
