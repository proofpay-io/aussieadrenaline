-- Migration 012: Add receipt_shares table for QR code verification tokens
-- This migration adds a table to store shareable verification tokens for receipts

-- Create receipt_shares table
CREATE TABLE IF NOT EXISTS receipt_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id UUID NOT NULL REFERENCES receipts(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0 NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_receipt_shares_receipt_id ON receipt_shares(receipt_id);
CREATE INDEX IF NOT EXISTS idx_receipt_shares_token ON receipt_shares(token);
CREATE INDEX IF NOT EXISTS idx_receipt_shares_expires_at ON receipt_shares(expires_at);

-- Enable Row Level Security (RLS)
ALTER TABLE receipt_shares ENABLE ROW LEVEL SECURITY;

-- Policy for service role to manage receipt_shares
CREATE POLICY "Service role can manage receipt_shares" ON receipt_shares
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add comment for documentation
COMMENT ON TABLE receipt_shares IS 'Stores shareable verification tokens for receipts. Tokens are used in QR codes for proof-of-purchase references.';
COMMENT ON COLUMN receipt_shares.token IS 'Short random string token used in verification URLs. Must be unique and unguessable.';
COMMENT ON COLUMN receipt_shares.view_count IS 'Number of times the verification page has been accessed using this token.';

