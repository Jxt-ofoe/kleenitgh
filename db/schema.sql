-- ==============================================================================
-- KLEENIT GHANA LIMITED - TURSO DATABASE SCHEMA
-- ==============================================================================

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  booking_reference TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  service TEXT NOT NULL,
  booking_date TEXT,
  booking_time TEXT,
  message TEXT,
  booking_source TEXT NOT NULL DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'new', -- 'new', 'contacted', 'confirmed', 'completed', 'cancelled'
  whatsapp_opened_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Indexes for fast filtering, searching, and sorting
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings (booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_phone ON bookings (customer_phone);
CREATE INDEX IF NOT EXISTS idx_bookings_source ON bookings (booking_source);
CREATE INDEX IF NOT EXISTS idx_bookings_service ON bookings (service);

-- Administrators table
CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TEXT NOT NULL,
  last_login_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_admins_username ON admins (username);
