-- Migration 004: Add total_amount_cents to disputes table
-- This migration adds a field to store the total disputed amount for easy viewing

-- Add total_amount_cents column to disputes table
ALTER TABLE disputes 
ADD COLUMN IF NOT EXISTS total_amount_cents INTEGER;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_disputes_total_amount_cents ON disputes(total_amount_cents);

-- Add comment for documentation
COMMENT ON COLUMN disputes.total_amount_cents IS 'Total disputed amount in cents (sum of all dispute_items.amount_cents)';

-- Update existing disputes to calculate their total from dispute_items
UPDATE disputes d
SET total_amount_cents = (
  SELECT COALESCE(SUM(di.amount_cents), 0)
  FROM dispute_items di
  WHERE di.dispute_id = d.id
)
WHERE total_amount_cents IS NULL;

