import http from 'http';
import { apiRouter } from '../lib/router.js';
import { getDb } from '../lib/db.js';
import { signToken } from '../lib/auth.js';

let server;
let baseUrl;

function startTestServer() {
  return new Promise((resolve) => {
    server = http.createServer(async (req, res) => {
      try {
        await apiRouter(req, res);
      } catch (err) {
        console.error('Server error in test:', err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      }
    });

    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
}

function stopTestServer() {
  return new Promise((resolve) => {
    server.close(resolve);
  });
}

async function request(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, headers: res.headers, data };
}

async function runTests() {
  console.log('🧪 Starting Kleenit Ghana Integration Test Suite...\n');
  await startTestServer();

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    const db = getDb();

    // 1. Test Valid Booking Submission
    console.log('\n--- 1. Testing Valid Booking Submission ---');
    const validBookingPayload = {
      customer_name: 'Ama Serwaa',
      customer_phone: '0544026418',
      customer_email: 'ama.serwaa@example.com',
      service: 'Deep Cleaning',
      booking_date: '2026-11-05',
      booking_time: 'Morning (8:00 AM - 12:00 PM)',
      message: 'Need deep cleaning for 3 bedroom apartment.'
    };

    const submitRes = await request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(validBookingPayload)
    });

    assert(submitRes.status === 201, 'Booking submission returns HTTP 201 Created');
    assert(submitRes.data?.success === true, 'Response reports success: true');
    assert(typeof submitRes.data?.booking_reference === 'string', 'Unique booking reference generated');
    assert(submitRes.data?.booking_reference.startsWith('KG-'), 'Booking reference follows KG-XXXXXX format');
    assert(submitRes.data?.booking?.booking_source === 'website', 'Booking source automatically set to "website"');
    assert(submitRes.data?.booking?.status === 'new', 'Initial booking status defaults to "new"');

    const createdRef = submitRes.data?.booking_reference;
    const createdId = submitRes.data?.booking?.id;

    // Verify in Turso database directly
    const dbCheck = await db.execute({
      sql: 'SELECT * FROM bookings WHERE booking_reference = ?',
      args: [createdRef]
    });
    assert(dbCheck.rows.length === 1, 'Booking record exists in Turso database');
    assert(dbCheck.rows[0].customer_name === 'Ama Serwaa', 'Customer name matches database record');
    assert(dbCheck.rows[0].booking_source === 'website', 'Database record has booking_source="website"');

    // 2. Test WhatsApp Handoff Tracking
    console.log('\n--- 2. Testing WhatsApp Handoff Tracking ---');
    const trackRes = await request('/api/bookings/track-whatsapp', {
      method: 'POST',
      body: JSON.stringify({ booking_reference: createdRef })
    });
    assert(trackRes.status === 200, 'Track WhatsApp endpoint returns HTTP 200 OK');
    assert(trackRes.data?.success === true, 'WhatsApp track reports success');

    const dbCheckWa = await db.execute({
      sql: 'SELECT whatsapp_opened_at FROM bookings WHERE booking_reference = ?',
      args: [createdRef]
    });
    assert(dbCheckWa.rows[0].whatsapp_opened_at !== null, 'whatsapp_opened_at timestamp recorded in Turso');

    // 3. Test Invalid Request Rejection
    console.log('\n--- 3. Testing Input Validation ---');
    const missingNameRes = await request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        customer_phone: '0544026418',
        service: 'Window Cleaning'
      })
    });
    assert(missingNameRes.status === 422, 'Rejects missing customer name with HTTP 422');

    const invalidPhoneRes = await request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        customer_name: 'Kwame',
        customer_phone: '123', // too short
        service: 'Window Cleaning'
      })
    });
    assert(invalidPhoneRes.status === 422, 'Rejects invalid phone number with HTTP 422');

    const missingServiceRes = await request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        customer_name: 'Kwame Mensah',
        customer_phone: '0241234567'
      })
    });
    assert(missingServiceRes.status === 422, 'Rejects missing service with HTTP 422');

    // 4. Test Unauthenticated Access to Protected Endpoints
    console.log('\n--- 4. Testing Protected API Security ---');
    const unauthBookingsRes = await request('/api/admin/bookings');
    assert(unauthBookingsRes.status === 401, 'Unauthenticated user rejected from listing bookings (HTTP 401)');

    const unauthStatsRes = await request('/api/admin/stats');
    assert(unauthStatsRes.status === 401, 'Unauthenticated user rejected from dashboard stats (HTTP 401)');

    const unauthUpdateRes = await request(`/api/admin/bookings/${createdId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'confirmed' })
    });
    assert(unauthUpdateRes.status === 401, 'Unauthenticated user rejected from updating booking status (HTTP 401)');

    // 5. Test Admin Login and Session
    console.log('\n--- 5. Testing Administrator Authentication ---');
    // Test invalid login credentials
    const badLoginRes = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'admin@kleenitgh.com', password: 'WrongPassword123' })
    });
    assert(badLoginRes.status === 401, 'Invalid password rejected with HTTP 401');

    // Test valid login
    const goodLoginRes = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'admin@kleenitgh.com', password: 'AdminSecure2026!' })
    });
    assert(goodLoginRes.status === 200, 'Valid admin login succeeds with HTTP 200');
    assert(typeof goodLoginRes.data?.token === 'string', 'JWT authentication token returned');
    const adminToken = goodLoginRes.data?.token;

    // Test session verification
    const meRes = await request('/api/auth/me', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(meRes.status === 200, '/api/auth/me verifies valid token with HTTP 200');
    assert(meRes.data?.user?.username === 'admin@kleenitgh.com', 'Returns authenticated admin details');

    // 6. Test Authorized Admin Access & Features
    console.log('\n--- 6. Testing Authorized Admin Management ---');
    const listRes = await request('/api/admin/bookings', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(listRes.status === 200, 'Authorized admin can list bookings');
    assert(Array.isArray(listRes.data?.bookings), 'Returns array of bookings');
    assert(listRes.data?.pagination?.total >= 1, 'Pagination reflects stored bookings');

    // Test search filter
    const searchRes = await request(`/api/admin/bookings?search=${encodeURIComponent('Ama Serwaa')}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(searchRes.data?.bookings.length >= 1, 'Search by customer name works correctly');

    // Test status update
    const updateRes = await request(`/api/admin/bookings/${createdId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'confirmed' })
    });
    assert(updateRes.status === 200, 'Admin can update booking status to confirmed');
    assert(updateRes.data?.booking?.status === 'confirmed', 'Updated booking returns status="confirmed"');

    // Test status validation
    const badStatusRes = await request(`/api/admin/bookings/${createdId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'invalid_status_xyz' })
    });
    assert(badStatusRes.status === 400, 'Rejects invalid status update with HTTP 400');

    // 7. Test Dashboard Stats
    console.log('\n--- 7. Testing Dashboard Statistics ---');
    const statsRes = await request('/api/admin/stats', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(statsRes.status === 200, 'Authorized admin can fetch dashboard stats');
    assert(typeof statsRes.data?.stats?.total === 'number', 'Total stat is a valid number');
    assert(statsRes.data?.stats?.total >= 1, 'Total stat matches database records');
    assert(statsRes.data?.stats?.confirmed >= 1, 'Confirmed stat reflects updated booking');
    assert(statsRes.data?.stats?.website >= 1, 'Website source stat reflects website submissions');

  } catch (err) {
    console.error('Test suite runtime error:', err);
    failed++;
  } finally {
    await stopTestServer();
  }

  console.log(`\n====================================================`);
  console.log(`Integration Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`====================================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
