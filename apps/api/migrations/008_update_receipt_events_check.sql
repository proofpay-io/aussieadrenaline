-- Migration 008: Update receipt_events check constraint to include receipt_view_blocked
-- This migration updates the event_type check constraint to allow receipt_view_blocked events

-- Drop the old constraint
ALTER TABLE receipt_events
DROP CONSTRAINT IF EXISTS receipt_events_event_type_check;

-- Add the new constraint with receipt_view_blocked
ALTER TABLE receipt_events
ADD CONSTRAINT receipt_events_event_type_check 
CHECK (event_type IN ('receipt_created', 'receipt_viewed', 'dispute_created', 'receipt_view_blocked'));

