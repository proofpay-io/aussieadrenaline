# Migration 009: Add receipts_enabled Setting

## Overview

This migration adds a `receipts_enabled` setting to the `bank_settings` table. This setting works alongside `confidence_threshold` to control receipt visibility.

## Purpose

- Provides a unified way to enable/disable receipt viewing
- Works in combination with confidence threshold to determine if receipts are shown
- Defaults to `enabled: true` (receipts are enabled by default)

## SQL Migration

Run the following SQL in your Supabase SQL Editor:

```sql
-- Migration 009: Add receipts_enabled setting to bank_settings
-- This migration adds a receipts_enabled setting to control receipt visibility
-- It works alongside confidence_threshold to determine if receipts are shown

-- Insert receipts_enabled setting (default: true)
INSERT INTO bank_settings (key, value, description)
VALUES (
  'receipts_enabled',
  '{"enabled": true}'::jsonb,
  'Master toggle to enable/disable receipt viewing. When disabled, all receipts are hidden from customers regardless of confidence threshold.'
)
ON CONFLICT (key) DO NOTHING;

-- Add comment
COMMENT ON COLUMN bank_settings.value IS 'JSONB value containing setting data (e.g., {"enabled": true} for receipts_enabled, {"threshold": 85} for confidence_threshold)';
```

## Steps to Run

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor**
4. Click **New Query**
5. Copy and paste the SQL from `apps/api/migrations/009_add_receipts_enabled_setting.sql`
6. Click **Run** (or press `Ctrl+Enter`)
7. Verify the migration succeeded

## Verification

After running the migration, verify the setting exists:

```sql
SELECT * FROM bank_settings WHERE key = 'receipts_enabled';
```

Expected result:
- `key`: `receipts_enabled`
- `value`: `{"enabled": true}`
- `description`: Contains description text

## Usage

The `receipts_enabled` setting is used by:

1. **API Endpoints:**
   - `GET /api/bank-admin/receipts-enabled` - Get current status
   - `PUT /api/bank-admin/receipts-enabled` - Update status

2. **Receipt Viewing Logic:**
   - If `receipts_enabled` is `false`, all receipts are hidden (503 error)
   - If `receipts_enabled` is `true`, receipts are shown based on confidence threshold

3. **Frontend:**
   - `/bank-admin` dashboard shows unified Policy card
   - Toggle controls receipt visibility

## Default Behavior

- **Default value:** `enabled: true` (receipts are enabled)
- **If setting doesn't exist:** System assumes receipts are enabled (fail open)

## Notes

- This setting works alongside `confidence_threshold`
- When `receipts_enabled` is `false`, confidence threshold is ignored (all receipts hidden)
- When `receipts_enabled` is `true`, confidence threshold determines which receipts are shown

