-- Migration 009: Add receipts_enabled setting to bank_settings
-- This migration adds a receipts_enabled setting to control receipt visibility
-- It works alongside confidence_threshold to determine if receipts are shown

-- Insert receipts_enabled setting (default: true)
INSERT INTO bank_settings (key, value, description)
VALUES (
  'receipts_enabled',
  '{"enabled": true}'::jsonb,
  'Master toggle to enable/disable receipt viewing. When disabled, all receipts are hidden from customers regardless of confidence threshold.'
)
ON CONFLICT (key) DO NOTHING;

-- Add comment
COMMENT ON COLUMN bank_settings.value IS 'JSONB value containing setting data (e.g., {"enabled": true} for receipts_enabled, {"threshold": 85} for confidence_threshold)';

