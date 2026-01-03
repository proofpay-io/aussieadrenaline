-- Migration 007: Add confidence threshold setting to bank_settings
-- This migration adds a confidence threshold setting for controlling which receipts are shown to customers

-- Insert confidence threshold setting (default: 85)
INSERT INTO bank_settings (key, value, description)
VALUES (
  'confidence_threshold',
  '{"threshold": 85}'::jsonb,
  'Minimum confidence score (0-100) required for receipts to be shown to customers. Receipts below this threshold are hidden.'
)
ON CONFLICT (key) DO NOTHING;

-- Add comment
COMMENT ON COLUMN bank_settings.value IS 'JSONB value containing setting data (e.g., {"threshold": 85} for confidence_threshold)';

