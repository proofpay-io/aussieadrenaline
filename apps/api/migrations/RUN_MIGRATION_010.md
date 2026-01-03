# Migration 010: Add Receipt Retention Policy

## Overview

This migration adds a `receipt_retention_days` setting to the `bank_settings` table to configure data retention policy.

## Purpose

- Provides configurable data retention period for receipts
- Default: 90 days
- Allows banks to set retention policy per deployment
- Display-only for now (no automatic deletion)

## SQL Migration

Run the following SQL in your Supabase SQL Editor:

```sql
-- Migration 010: Add receipt retention policy setting
-- This migration adds a data retention policy setting to bank_settings

-- Insert receipt_retention_days setting (default: 90 days)
INSERT INTO bank_settings (key, value, description)
VALUES (
  'receipt_retention_days',
  '{"days": 90}'::jsonb,
  'Number of days to retain receipt data. Receipts older than this period may be archived or deleted according to bank policy.'
)
ON CONFLICT (key) DO NOTHING;

-- Add comment
COMMENT ON COLUMN bank_settings.value IS 'JSONB value containing setting data (e.g., {"days": 90} for receipt_retention_days)';
```

## Steps to Run

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor**
4. Click **New Query**
5. Copy and paste the SQL from `apps/api/migrations/010_add_retention_policy.sql`
6. Click **Run** (or press `Ctrl+Enter`)
7. Verify the migration succeeded

## Verification

After running the migration, verify the setting exists:

```sql
SELECT * FROM bank_settings WHERE key = 'receipt_retention_days';
```

Expected result:
- `key`: `receipt_retention_days`
- `value`: `{"days": 90}`
- `description`: Contains description text

## Usage

The `receipt_retention_days` setting is used by:

1. **API Endpoints:**
   - `GET /api/bank-admin/retention-policy` - Get current retention period
   - `PUT /api/bank-admin/retention-policy` - Update retention period

2. **Frontend:**
   - `/bank-admin` Policy card shows retention period dropdown
   - `/bank-admin/usage` header displays retention period

3. **Event Logging:**
   - Policy changes are logged as `policy_updated` events
   - Includes old/new values in metadata

## Default Behavior

- **Default value:** `days: 90` (90 days retention)
- **If setting doesn't exist:** System assumes 90 days
- **Options:** 30, 90, or 180 days (configurable via dropdown)

## Notes

- This is display-only for now (no automatic deletion)
- Policy changes are logged as `policy_updated` events
- Retention period is visible in admin UI

