-- Migration 005: Add bank_settings table for admin controls
-- This migration creates a table to store bank admin settings like kill switches

-- Create bank_settings table
CREATE TABLE IF NOT EXISTS bank_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Index for key lookups
CREATE INDEX IF NOT EXISTS idx_bank_settings_key ON bank_settings(key);

-- Insert default kill switch setting
INSERT INTO bank_settings (key, value, description)
VALUES (
  'kill_switch',
  '{"enabled": false}'::jsonb,
  'Master kill switch to disable all ProofPay functionality'
)
ON CONFLICT (key) DO NOTHING;

-- Create trigger to update updated_at
CREATE TRIGGER update_bank_settings_updated_at 
  BEFORE UPDATE ON bank_settings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE bank_settings ENABLE ROW LEVEL SECURITY;

-- Service role can manage bank settings
CREATE POLICY "Service role can manage bank_settings" ON bank_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add comments
COMMENT ON TABLE bank_settings IS 'Bank admin settings and configuration';
COMMENT ON COLUMN bank_settings.key IS 'Setting key (e.g., kill_switch)';
COMMENT ON COLUMN bank_settings.value IS 'Setting value as JSON (e.g., {"enabled": false})';

