# Run Migration 002 - Add Simulation Fields

## Purpose

This migration adds fields to support simulated receipts:
- `source` - Identifies receipt origin (simulated, square, etc.)
- `merchant_name` - Display name for the merchant/store

## How to Run

### Option 1: Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click **SQL Editor** in the left sidebar
   - Click **New Query** button

3. **Run the Migration**
   - Copy the entire contents of `apps/api/migrations/002_add_simulation_fields.sql`
   - Paste it into the SQL Editor
   - Click **Run** (or press Ctrl+Enter)

4. **Verify Success**
   - You should see: "Success. No rows returned"
   - This means the migration ran successfully

### Option 2: Using Migration Script

```bash
cd apps/api
npm run migrate
```

Note: You may need to update the migration script to run migration 002.

## What This Migration Does

1. Adds `source` column to `receipts` table (default: 'square')
2. Adds `merchant_name` column to `receipts` table (optional)
3. Creates index on `source` for filtering
4. Updates existing receipts to have `source = 'square'`

## Verification

After running the migration, verify it worked:

```bash
cd apps/api
npm run verify-tables
```

Or check in Supabase Dashboard:
1. Go to **Table Editor**
2. Click on `receipts` table
3. Check that `source` and `merchant_name` columns exist

## Compatibility

- Existing receipts will have `source = 'square'` (default)
- New simulated receipts will have `source = 'simulated'`
- The `merchant_name` field is optional and can be null
- All existing functionality continues to work

