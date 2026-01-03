-- Migration 011: Add policy_updated event type to receipt_events
-- This migration updates the event_type check constraint to include policy_updated

-- Drop the existing constraint if it exists
ALTER TABLE receipt_events
DROP CONSTRAINT IF EXISTS receipt_events_event_type_check;

-- Add the new constraint with policy_updated
ALTER TABLE receipt_events
ADD CONSTRAINT receipt_events_event_type_check
CHECK (event_type IN ('receipt_created', 'receipt_viewed', 'dispute_created', 'receipt_view_blocked', 'policy_updated'));

