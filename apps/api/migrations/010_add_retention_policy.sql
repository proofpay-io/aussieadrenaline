-- Migration 010: Add receipt retention policy setting
-- This migration adds a data retention policy setting to bank_settings

-- Insert receipt_retention_days setting (default: 90 days)
INSERT INTO bank_settings (key, value, description)
VALUES (
  'receipt_retention_days',
  '{"days": 90}'::jsonb,
  'Number of days to retain receipt data. Receipts older than this period may be archived or deleted according to bank policy.'
)
ON CONFLICT (key) DO NOTHING;

-- Add comment
COMMENT ON COLUMN bank_settings.value IS 'JSONB value containing setting data (e.g., {"days": 90} for receipt_retention_days)';

