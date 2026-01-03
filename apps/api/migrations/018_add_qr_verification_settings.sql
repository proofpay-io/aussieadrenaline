-- Migration 018: Add QR verification settings to bank_settings
-- This migration adds settings to control QR code verification behavior

-- Add enable_qr_verification setting (default: true)
INSERT INTO bank_settings (key, value, description)
VALUES (
  'enable_qr_verification',
  '{"enabled": true}'::jsonb,
  'Master toggle to enable or disable QR code verification functionality.'
)
ON CONFLICT (key) DO NOTHING;

-- Add qr_single_use_enabled setting (default: false)
INSERT INTO bank_settings (key, value, description)
VALUES (
  'qr_single_use_enabled',
  '{"enabled": false}'::jsonb,
  'If enabled, all new QR tokens will be single-use (can only be verified once).'
)
ON CONFLICT (key) DO NOTHING;

-- Add qr_token_expiry_minutes setting (default: never/null)
INSERT INTO bank_settings (key, value, description)
VALUES (
  'qr_token_expiry_minutes',
  '{"minutes": null}'::jsonb,
  'Number of minutes until QR tokens expire. Options: 5, 15, 60, or null (never expire).'
)
ON CONFLICT (key) DO NOTHING;

