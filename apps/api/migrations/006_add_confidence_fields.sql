-- Migration 006: Add confidence scoring fields to receipts table
-- This migration adds confidence scoring mechanism for receipt verification

-- Add confidence_score column (0-100, nullable)
ALTER TABLE receipts
ADD COLUMN IF NOT EXISTS confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100);

-- Add confidence_label column (HIGH/MEDIUM/LOW, nullable)
ALTER TABLE receipts
ADD COLUMN IF NOT EXISTS confidence_label TEXT CHECK (confidence_label IN ('HIGH', 'MEDIUM', 'LOW'));

-- Add confidence_reasons column (jsonb array, nullable)
ALTER TABLE receipts
ADD COLUMN IF NOT EXISTS confidence_reasons JSONB DEFAULT '[]'::jsonb;

-- Add comments for documentation
COMMENT ON COLUMN receipts.confidence_score IS 'Confidence score from 0-100 indicating receipt verification confidence';
COMMENT ON COLUMN receipts.confidence_label IS 'Confidence label: HIGH (80-100), MEDIUM (50-79), LOW (0-49)';
COMMENT ON COLUMN receipts.confidence_reasons IS 'Array of confidence reason codes (e.g., SOURCE_POS, TOTAL_EXACT, TIME_EXACT)';

-- Backfill existing receipts with HIGH confidence for demo purposes
-- This ensures existing receipts have a confidence value
UPDATE receipts
SET 
  confidence_score = 95,
  confidence_label = 'HIGH',
  confidence_reasons = '["SOURCE_POS", "TOTAL_EXACT", "TIME_EXACT"]'::jsonb
WHERE confidence_score IS NULL;

-- Create index for faster queries on confidence_score
CREATE INDEX IF NOT EXISTS idx_receipts_confidence_score ON receipts(confidence_score);
CREATE INDEX IF NOT EXISTS idx_receipts_confidence_label ON receipts(confidence_label);

