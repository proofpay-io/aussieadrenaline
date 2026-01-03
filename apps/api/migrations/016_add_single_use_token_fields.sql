-- Migration 016: Add single-use token fields to receipt_shares
-- This migration adds fields to support single-use QR tokens for enhanced security

-- Add single_use boolean field (default false for backward compatibility)
ALTER TABLE receipt_shares
ADD COLUMN IF NOT EXISTS single_use BOOLEAN NOT NULL DEFAULT FALSE;

-- Add used_at timestamp field (nullable)
ALTER TABLE receipt_shares
ADD COLUMN IF NOT EXISTS used_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster queries on single_use tokens
CREATE INDEX IF NOT EXISTS idx_receipt_shares_single_use ON receipt_shares(single_use);
CREATE INDEX IF NOT EXISTS idx_receipt_shares_used_at ON receipt_shares(used_at);

-- Add comments for documentation
COMMENT ON COLUMN receipt_shares.single_use IS 'If true, this token can only be used once. After first use, verification will return INVALID.';
COMMENT ON COLUMN receipt_shares.used_at IS 'Timestamp when a single-use token was first used. Null if not yet used or if single_use is false.';

