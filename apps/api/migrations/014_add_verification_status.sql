-- Migration 014: Add verification status to receipt_shares
-- This migration adds merchant verification state tracking to prevent fake or reused QR codes

-- Add status column to receipt_shares
ALTER TABLE receipt_shares
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active' 
  CHECK (status IN ('active', 'verified', 'used', 'voided', 'expired'));

-- Add verification tracking columns
ALTER TABLE receipt_shares
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE receipt_shares
ADD COLUMN IF NOT EXISTS verified_by TEXT; -- Optional merchant identifier

ALTER TABLE receipt_shares
ADD COLUMN IF NOT EXISTS verification_attempts INTEGER DEFAULT 0 NOT NULL;

-- Create index for status queries
CREATE INDEX IF NOT EXISTS idx_receipt_shares_status ON receipt_shares(status);
CREATE INDEX IF NOT EXISTS idx_receipt_shares_verified_at ON receipt_shares(verified_at);

-- Add comments for documentation
COMMENT ON COLUMN receipt_shares.status IS 'Verification status: active (unverified), verified (merchant confirmed), used (consumed), voided (invalidated), expired (time expired)';
COMMENT ON COLUMN receipt_shares.verified_at IS 'Timestamp when merchant verified this receipt';
COMMENT ON COLUMN receipt_shares.verified_by IS 'Optional merchant identifier who verified this receipt';
COMMENT ON COLUMN receipt_shares.verification_attempts IS 'Number of times verification was attempted';

-- Update existing shares to have 'active' status
UPDATE receipt_shares
SET status = 'active'
WHERE status IS NULL;

