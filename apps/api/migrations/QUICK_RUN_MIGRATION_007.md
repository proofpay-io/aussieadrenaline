# Quick Guide: Run Migration 007

## Problem
The `confidence_threshold` setting is missing from the `bank_settings` table in Supabase.

## Solution
Run Migration 007 to add the setting.

## Steps

### 1. Open Supabase SQL Editor
1. Go to https://app.supabase.com
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### 2. Copy and Paste This SQL

```sql
-- Migration 007: Add confidence threshold setting to bank_settings
-- This migration adds a confidence threshold setting for controlling which receipts are shown to customers

-- Insert confidence threshold setting (default: 85)
INSERT INTO bank_settings (key, value, description)
VALUES (
  'confidence_threshold',
  '{"threshold": 85}'::jsonb,
  'Minimum confidence score (0-100) required for receipts to be shown to customers. Receipts below this threshold are hidden.'
)
ON CONFLICT (key) DO NOTHING;

-- Add comment
COMMENT ON COLUMN bank_settings.value IS 'JSONB value containing setting data (e.g., {"threshold": 85} for confidence_threshold)';
```

### 3. Run the Query
1. Click the **Run** button (or press Ctrl+Enter)
2. You should see "Success. No rows returned" or similar success message

### 4. Verify It Worked
1. Go to **Table Editor** → `bank_settings` table
2. You should see a row with:
   - `key`: `confidence_threshold`
   - `value`: `{"threshold": 85}`
   - `description`: Contains explanation text

### 5. Test in Dashboard
1. Go to `/bank-admin` dashboard
2. You should see the "Confidence Threshold" panel
3. It should show threshold: 85

## Troubleshooting

### Error: "relation bank_settings does not exist"
**Solution:** Run Migration 005 first to create the `bank_settings` table.
- See: `apps/api/migrations/005_add_bank_settings.sql`

### Error: "duplicate key value violates unique constraint"
**Solution:** The setting already exists. This is safe to ignore - the migration uses `ON CONFLICT DO NOTHING`.

### Setting not appearing after migration
**Solution:**
1. Refresh the `/bank-admin` page
2. Check browser console for errors
3. Verify the row exists in Supabase Table Editor

