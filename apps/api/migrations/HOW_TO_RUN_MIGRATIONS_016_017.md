# How to Run Migrations 016 and 017 in Supabase

This guide provides step-by-step instructions for running the token anti-forgery migrations.

## Prerequisites

- Access to your Supabase project dashboard
- SQL Editor permissions

## Step-by-Step Instructions

### Step 1: Open Supabase Dashboard

1. Go to **https://app.supabase.com**
2. Sign in to your account
3. Select your ProofPay project from the project list

### Step 2: Open SQL Editor

1. In the left sidebar, click **SQL Editor**
2. Click the **New Query** button (top right) to create a new SQL query

### Step 3: Run Migration 016 (Single-Use Token Fields)

1. Copy the entire contents of `016_add_single_use_token_fields.sql`:

```sql
-- Migration 016: Add single-use token fields to receipt_shares
-- This migration adds fields to support single-use QR tokens for enhanced security

-- Add single_use boolean field (default false for backward compatibility)
ALTER TABLE receipt_shares
ADD COLUMN IF NOT EXISTS single_use BOOLEAN NOT NULL DEFAULT FALSE;

-- Add used_at timestamp field (nullable)
ALTER TABLE receipt_shares
ADD COLUMN IF NOT EXISTS used_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster queries on single_use tokens
CREATE INDEX IF NOT EXISTS idx_receipt_shares_single_use ON receipt_shares(single_use);
CREATE INDEX IF NOT EXISTS idx_receipt_shares_used_at ON receipt_shares(used_at);

-- Add comments for documentation
COMMENT ON COLUMN receipt_shares.single_use IS 'If true, this token can only be used once. After first use, verification will return INVALID.';
COMMENT ON COLUMN receipt_shares.used_at IS 'Timestamp when a single-use token was first used. Null if not yet used or if single_use is false.';
```

2. Paste it into the SQL Editor
3. Click the **Run** button (or press `Ctrl+Enter` / `Cmd+Enter`)
4. Wait for the success message: "Success. No rows returned"

### Step 4: Verify Migration 016

1. In the left sidebar, click **Table Editor**
2. Find and click on the `receipt_shares` table
3. Verify you can see the new columns:
   - `single_use` (boolean, default: false)
   - `used_at` (timestamp with time zone, nullable)

Alternatively, run this verification query in SQL Editor:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'receipt_shares'
AND column_name IN ('single_use', 'used_at')
ORDER BY column_name;
```

You should see 2 rows returned.

### Step 5: Run Migration 017 (Verification Event Types)

1. In SQL Editor, click **New Query** again (or clear the previous query)
2. Copy the entire contents of `017_add_verification_event_types.sql`:

```sql
-- Migration 017: Add verification event types to receipt_events
-- This migration updates the CHECK constraint on the event_type column
-- in the receipt_events table to include verification event types.

-- Drop the existing constraint if it exists
ALTER TABLE receipt_events
DROP CONSTRAINT IF EXISTS receipt_events_event_type_check;

-- Add the new constraint with verification event types
ALTER TABLE receipt_events
ADD CONSTRAINT receipt_events_event_type_check
CHECK (event_type IN (
  'receipt_created', 
  'receipt_viewed', 
  'dispute_created', 
  'receipt_view_blocked', 
  'policy_updated', 
  'receipt_share_created', 
  'receipt_share_viewed',
  'receipt_verified',
  'receipt_verification_failed'
));
```

3. Paste it into the SQL Editor
4. Click the **Run** button (or press `Ctrl+Enter` / `Cmd+Enter`)
5. Wait for the success message: "Success. No rows returned"

### Step 6: Verify Migration 017

Run this verification query in SQL Editor:

```sql
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'receipt_events_event_type_check';
```

You should see the constraint includes:
- `receipt_verified`
- `receipt_verification_failed`

### Step 7: Test the Migration

You can test that the new event types work by running this test query:

```sql
-- This should succeed (valid event type)
INSERT INTO receipt_events (event_type, receipt_id, metadata)
VALUES ('receipt_verified', NULL, '{"test": true}'::jsonb);

-- This should also succeed
INSERT INTO receipt_events (event_type, receipt_id, metadata)
VALUES ('receipt_verification_failed', NULL, '{"test": true}'::jsonb);

-- Clean up test data
DELETE FROM receipt_events WHERE metadata->>'test' = 'true';
```

If all queries succeed, the migrations are working correctly!

## Troubleshooting

### Error: "relation receipt_shares does not exist"
- **Solution**: Run migration 012 first to create the `receipt_shares` table

### Error: "relation receipt_events does not exist"
- **Solution**: Run migration 003 first to create the `receipt_events` table

### Error: "constraint already exists"
- **Solution**: This is normal if you've run the migration before. The migration uses `DROP CONSTRAINT IF EXISTS` so it's safe to run multiple times.

### Error: "column already exists"
- **Solution**: This is normal if you've run the migration before. The migration uses `ADD COLUMN IF NOT EXISTS` so it's safe to run multiple times.

## What These Migrations Do

### Migration 016
- Adds `single_use` field to allow tokens to be marked as single-use
- Adds `used_at` field to track when a single-use token was first used
- Creates indexes for performance

### Migration 017
- Adds two new event types to track verification attempts:
  - `receipt_verified`: Logged when verification succeeds
  - `receipt_verification_failed`: Logged when verification fails

## After Running Migrations

Once both migrations are complete:
- ✅ Single-use tokens will be automatically marked as used after first verification
- ✅ All verification attempts will be logged to `receipt_events`
- ✅ The system will prevent reuse of single-use tokens

## Next Steps

After running the migrations, you can:
1. Test QR code verification to see events being logged
2. Check the `receipt_events` table for `receipt_verified` and `receipt_verification_failed` events
3. Optionally set `single_use=true` when creating new share tokens for enhanced security

