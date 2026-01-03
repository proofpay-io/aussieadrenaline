# Run Migration 004: Add Total Amount to Disputes

This migration adds a `total_amount_cents` field to the `disputes` table so you can easily see the total disputed amount in Supabase.

## Step 1: Open Supabase SQL Editor

1. Go to: https://app.supabase.com
2. Sign in and select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query** button

## Step 2: Run the Migration

1. Open the file: `apps/api/migrations/004_add_dispute_total_amount.sql`
2. Copy the **entire contents** of the file
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)

## Step 3: Verify Success

You should see: **"Success. No rows returned"**

This means the column was added successfully.

## Step 4: Verify Column Exists

1. Go to **Table Editor** in Supabase Dashboard
2. Click on the `disputes` table
3. You should see a new column: `total_amount_cents`

## What This Migration Does

- ✅ Adds `total_amount_cents` column to `disputes` table
- ✅ Creates an index for better query performance
- ✅ Updates existing disputes to calculate their total from `dispute_items`
- ✅ Adds documentation comment

## After Running Migration

New disputes will automatically include the `total_amount_cents` field.

To see the amount in dollars in Supabase:
- `total_amount_cents` shows the amount in cents (e.g., 12999 = $129.99)
- Divide by 100 to get dollars

## Next Steps

After running this migration:
1. ✅ New disputes will show total amount
2. ✅ Existing disputes will have their totals calculated
3. ✅ You can easily see disputed amounts in Supabase Table Editor

