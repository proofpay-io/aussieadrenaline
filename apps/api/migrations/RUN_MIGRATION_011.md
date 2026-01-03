# Migration 011: Add policy_updated Event Type

## Overview

This migration updates the `receipt_events` table to allow `policy_updated` as a valid event type for logging policy changes.

## Purpose

- Enables logging of policy changes (retention policy, confidence threshold, etc.)
- Provides audit trail for administrative actions
- Supports compliance and governance requirements

## SQL Migration

Run the following SQL in your Supabase SQL Editor:

```sql
-- Migration 011: Add policy_updated event type to receipt_events
-- This migration updates the event_type check constraint to include policy_updated

-- Drop the existing constraint if it exists
ALTER TABLE receipt_events
DROP CONSTRAINT IF EXISTS receipt_events_event_type_check;

-- Add the new constraint with policy_updated
ALTER TABLE receipt_events
ADD CONSTRAINT receipt_events_event_type_check
CHECK (event_type IN ('receipt_created', 'receipt_viewed', 'dispute_created', 'receipt_view_blocked', 'policy_updated'));
```

## Steps to Run

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor**
4. Click **New Query**
5. Copy and paste the SQL from `apps/api/migrations/011_add_policy_updated_event_type.sql`
6. Click **Run** (or press `Ctrl+Enter`)
7. Verify the migration succeeded

## Verification

After running the migration, verify the constraint allows `policy_updated`:

```sql
-- Check constraint
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'receipt_events_event_type_check';
```

Expected result should include `policy_updated` in the check clause.

## Usage

The `policy_updated` event type is used when:

1. **Retention Policy Changes:**
   - When admin updates `receipt_retention_days`
   - Logs old/new values in metadata

2. **Event Metadata:**
   ```json
   {
     "policy_type": "receipt_retention_days",
     "old_value": 90,
     "new_value": 180,
     "changed_by": "user-agent-string"
   }
   ```

3. **Viewing Events:**
   - Filter by `event_type = 'policy_updated'` in `/bank-admin/usage`
   - Shows policy change history

## Notes

- Policy updates are logged automatically
- Events include old/new values for audit trail
- No receipt_id is associated (policy changes are system-wide)

