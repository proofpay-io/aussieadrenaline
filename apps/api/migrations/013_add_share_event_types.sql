-- Migration 013: Add share event types to receipt_events
-- This migration updates the CHECK constraint on the event_type column
-- in the receipt_events table to include 'receipt_share_created' and 'receipt_share_viewed'.

-- Drop the existing constraint if it exists
ALTER TABLE receipt_events
DROP CONSTRAINT IF EXISTS receipt_events_event_type_check;

-- Add the new constraint with share event types
ALTER TABLE receipt_events
ADD CONSTRAINT receipt_events_event_type_check
CHECK (event_type IN (
  'receipt_created',
  'receipt_viewed',
  'dispute_created',
  'receipt_view_blocked',
  'policy_updated',
  'receipt_share_created',
  'receipt_share_viewed'
));

