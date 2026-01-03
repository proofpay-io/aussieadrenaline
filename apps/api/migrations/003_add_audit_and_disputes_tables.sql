-- Migration 003: Add auditability and disputes tables
-- This migration creates tables for tracking receipt events and managing disputes

-- ============================================================================
-- receipt_events: Immutable event log for auditability
-- ============================================================================
CREATE TABLE IF NOT EXISTS receipt_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('receipt_created', 'receipt_viewed', 'dispute_created', 'receipt_view_blocked')),
  receipt_id UUID REFERENCES receipts(id) ON DELETE CASCADE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for receipt_events
CREATE INDEX IF NOT EXISTS idx_receipt_events_receipt_id ON receipt_events(receipt_id);
CREATE INDEX IF NOT EXISTS idx_receipt_events_event_type ON receipt_events(event_type);
CREATE INDEX IF NOT EXISTS idx_receipt_events_created_at ON receipt_events(created_at);
CREATE INDEX IF NOT EXISTS idx_receipt_events_metadata ON receipt_events USING GIN(metadata);

-- ============================================================================
-- disputes: Dispute records
-- ============================================================================
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  receipt_id UUID NOT NULL REFERENCES receipts(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'in_review', 'resolved', 'rejected')),
  reason_code TEXT NOT NULL,
  notes TEXT
);

-- Indexes for disputes
CREATE INDEX IF NOT EXISTS idx_disputes_receipt_id ON disputes(receipt_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);
CREATE INDEX IF NOT EXISTS idx_disputes_created_at ON disputes(created_at);
CREATE INDEX IF NOT EXISTS idx_disputes_updated_at ON disputes(updated_at);

-- ============================================================================
-- dispute_items: Individual items being disputed
-- ============================================================================
CREATE TABLE IF NOT EXISTS dispute_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
  receipt_item_id UUID NOT NULL REFERENCES receipt_items(id) ON DELETE CASCADE,
  quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
  amount_cents INTEGER
);

-- Indexes for dispute_items
CREATE INDEX IF NOT EXISTS idx_dispute_items_dispute_id ON dispute_items(dispute_id);
CREATE INDEX IF NOT EXISTS idx_dispute_items_receipt_item_id ON dispute_items(receipt_item_id);

-- ============================================================================
-- Triggers: Auto-update updated_at for disputes
-- ============================================================================
-- Use the existing update_updated_at_column function from migration 001
CREATE TRIGGER update_disputes_updated_at 
  BEFORE UPDATE ON disputes 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================
-- Enable RLS on all new tables
ALTER TABLE receipt_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_items ENABLE ROW LEVEL SECURITY;

-- Service role can manage all audit and dispute data
CREATE POLICY "Service role can manage receipt_events" ON receipt_events
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage disputes" ON disputes
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage dispute_items" ON dispute_items
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- Comments for documentation
-- ============================================================================
COMMENT ON TABLE receipt_events IS 'Immutable event log for tracking receipt-related events (auditability)';
COMMENT ON TABLE disputes IS 'Dispute records linked to receipts';
COMMENT ON TABLE dispute_items IS 'Individual receipt items being disputed';

COMMENT ON COLUMN receipt_events.event_type IS 'Type of event: receipt_created, receipt_viewed, dispute_created';
COMMENT ON COLUMN receipt_events.metadata IS 'Additional event data in JSON format';
COMMENT ON COLUMN disputes.status IS 'Current status: submitted, in_review, resolved, rejected';
COMMENT ON COLUMN disputes.reason_code IS 'Reason code for the dispute';
COMMENT ON COLUMN dispute_items.quantity IS 'Quantity of the item being disputed';
COMMENT ON COLUMN dispute_items.amount_cents IS 'Disputed amount in cents (nullable)';

