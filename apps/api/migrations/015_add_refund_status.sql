-- Migration 015: Add refund status to receipts table
-- This migration adds fields to track refund status for receipts

-- Add refund tracking columns
ALTER TABLE receipts
ADD COLUMN IF NOT EXISTS refunded BOOLEAN DEFAULT FALSE NOT NULL;

ALTER TABLE receipts
ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE receipts
ADD COLUMN IF NOT EXISTS refund_amount NUMERIC(10, 2);

-- Create index for refunded queries
CREATE INDEX IF NOT EXISTS idx_receipts_refunded ON receipts(refunded);

-- Add comments for documentation
COMMENT ON COLUMN receipts.refunded IS 'Whether this receipt has been refunded';
COMMENT ON COLUMN receipts.refunded_at IS 'Timestamp when the receipt was refunded';
COMMENT ON COLUMN receipts.refund_amount IS 'Amount refunded (may be partial refund)';

