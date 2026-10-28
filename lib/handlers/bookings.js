import crypto from 'crypto';
import { getDb } from '../db.js';
import { readJsonBody, sendJson, generateBookingReference, sanitize } from '../helpers.js';
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

  // Extract and sanitize fields
  const customerName = sanitize(body.customer_name || body.name, 100);
  const customerPhone = sanitize(body.customer_phone || body.phone, 30);
  const customerEmail = sanitize(body.customer_email || body.email, 120);
  const service = sanitize(body.service, 120);
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

  if (!customerPhone || customerPhone.replace(/\D/g, '').length < 7) {
    return sendJson(res, 422, {
      success: false,
      error: 'Please provide a valid phone number with at least 7 digits.'
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

  // Prepare database record
  const id = crypto.randomUUID();
  const bookingReference = generateBookingReference();
  const bookingSource = 'website'; // Automatically enforce 'website'
  const status = 'new';           // Automatically set to 'new'
  const now = new Date().toISOString();

  try {
    const db = getDb();

    // Parameterized SQL query
    await db.execute({
      sql: `INSERT INTO bookings (
        id,
        booking_reference,
        customer_name,
        customer_phone,
        customer_email,
        service,
        booking_date,
        booking_time,
        message,
        booking_source,
        status,
        whatsapp_opened_at,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)`,
      args: [
        id,
        bookingReference,
        customerName,
        customerPhone,
        customerEmail || null,
        service,
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
        booking_date: bookingDate || null,
        booking_time: bookingTime || null,
        message: message || null,
        booking_source: bookingSource,
        status,
        created_at: now
      }
    });
  } catch (err) {
    console.error('[Create Booking Error]:', err.message);
    return sendJson(res, 500, {
      success: false,
      error: 'Unable to save your booking due to a database connection error. Please try again.'
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
