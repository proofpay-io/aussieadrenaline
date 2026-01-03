-- Add fields to support simulated receipts
-- This migration adds optional fields that allow receipts to be marked as simulated
-- while maintaining compatibility with real Square receipts

-- Add source field to identify receipt origin (simulated, square, etc.)
ALTER TABLE receipts 
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'square';

-- Add merchant_name field for display purposes
ALTER TABLE receipts 
ADD COLUMN IF NOT EXISTS merchant_name TEXT;

-- Add index on source for filtering
CREATE INDEX IF NOT EXISTS idx_receipts_source ON receipts(source);

-- Update existing receipts to have source = 'square' if null
UPDATE receipts SET source = 'square' WHERE source IS NULL;

-- Add comment to document the fields
COMMENT ON COLUMN receipts.source IS 'Source of the receipt: simulated, square, etc.';
COMMENT ON COLUMN receipts.merchant_name IS 'Display name of the merchant/store';

