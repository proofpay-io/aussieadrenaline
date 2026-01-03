-- Migration 019: Add demo flags to receipts table for verification state simulation
-- This migration adds boolean flags to simulate different verification states for demo purposes

-- Add demo flags for simulated receipts
ALTER TABLE receipts
ADD COLUMN IF NOT EXISTS demo_refunded BOOLEAN DEFAULT FALSE NOT NULL;

ALTER TABLE receipts
ADD COLUMN IF NOT EXISTS demo_disputed BOOLEAN DEFAULT FALSE NOT NULL;

ALTER TABLE receipts
ADD COLUMN IF NOT EXISTS demo_expired_qr BOOLEAN DEFAULT FALSE NOT NULL;

-- Create indexes for demo flags (optional, for faster queries)
CREATE INDEX IF NOT EXISTS idx_receipts_demo_refunded ON receipts(demo_refunded) WHERE demo_refunded = true;
CREATE INDEX IF NOT EXISTS idx_receipts_demo_disputed ON receipts(demo_disputed) WHERE demo_disputed = true;
CREATE INDEX IF NOT EXISTS idx_receipts_demo_expired_qr ON receipts(demo_expired_qr) WHERE demo_expired_qr = true;

-- Add comments for documentation
COMMENT ON COLUMN receipts.demo_refunded IS 'Demo flag: If true, simulates a refunded receipt for verification state (simulated receipts only)';
COMMENT ON COLUMN receipts.demo_disputed IS 'Demo flag: If true, simulates a disputed receipt for verification state (simulated receipts only)';
COMMENT ON COLUMN receipts.demo_expired_qr IS 'Demo flag: If true, simulates an expired QR token for verification state (simulated receipts only)';

