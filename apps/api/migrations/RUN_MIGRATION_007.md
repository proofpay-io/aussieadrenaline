# Running Migration 007: Add Confidence Threshold Setting

## Overview

This migration adds a confidence threshold setting to the `bank_settings` table:
- `key`: `confidence_threshold`
- `value`: `{"threshold": 85}` (default)
- `description`: Explanation of what the threshold does

## Steps

### 1. Open Supabase SQL Editor

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

### 2. Run the Migration

1. Open the file: `apps/api/migrations/007_add_confidence_threshold.sql`
2. Copy the entire contents
3. Paste into the SQL Editor
4. Click **Run** to execute the migration

### 3. Verify Migration

1. Go to **Table Editor** in the left sidebar
2. Click on the `bank_settings` table
3. Verify a new row exists with:
   - `key`: `confidence_threshold`
   - `value`: `{"threshold": 85}`
   - `description`: Contains explanation text

## What This Migration Does

1. **Inserts confidence threshold setting** into `bank_settings` table
2. **Sets default value** to 85 (0-100 scale)
3. **Adds description** explaining the purpose

## After Migration

The bank admin dashboard (`/bank-admin`) will:
- Display the current confidence threshold
- Allow adjusting the threshold via slider (0-100)
- Save changes to Supabase
- Show explanation: "Only receipts at or above this threshold are shown to customers."

## Testing

1. Visit `/bank-admin` dashboard
2. You should see the "Confidence Threshold" panel
3. Adjust the slider or input field
4. The value should save automatically
5. Refresh the page - the saved value should persist

## Troubleshooting

### Setting not appearing in dashboard
- Verify the migration ran successfully
- Check that `bank_settings` table has a row with `key = 'confidence_threshold'`
- Check browser console for API errors

### Value not saving
- Check API server logs for errors
- Verify Supabase connection is working
- Check that `bank_settings` table has proper RLS policies

