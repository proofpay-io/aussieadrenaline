# How to Run Migration 019: Add Demo Flags to Receipts

This migration adds demo flags to the `receipts` table for simulating different verification states.

## Steps

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `019_add_demo_flags.sql`
4. Paste into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)
6. Verify the migration succeeded:
   - Check that no errors were returned
   - Verify the columns exist by running:
     ```sql
     SELECT column_name, data_type, column_default 
     FROM information_schema.columns 
     WHERE table_name = 'receipts' 
     AND column_name IN ('demo_refunded', 'demo_disputed', 'demo_expired_qr');
     ```

## Expected Result

You should see three new boolean columns in the `receipts` table:
- `demo_refunded` (default: false)
- `demo_disputed` (default: false)
- `demo_expired_qr` (default: false)

## Notes

- These flags only affect simulated receipts (`source = 'simulated'`)
- Default verification state for simulated receipts is **VALID**
- Demo flags take precedence over real receipt status for simulated receipts
- Used for demo/testing purposes to simulate different verification states

