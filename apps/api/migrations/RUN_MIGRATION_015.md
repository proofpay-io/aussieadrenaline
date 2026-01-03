# Running Migration 015: Add refund status to receipts

This migration adds fields to track refund status for receipts, enabling verification state determination.

## Steps

1. Open your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `015_add_refund_status.sql`
4. Click "Run" to execute the migration
5. Verify the columns were added:
   - Go to Table Editor
   - Select `receipts` table
   - Verify it has the following new columns:
     - `refunded` (boolean, default false)
     - `refunded_at` (timestamptz, nullable)
     - `refund_amount` (numeric, nullable)

## Verification

After running the migration, you can verify it worked by:

```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'receipts' 
AND column_name IN ('refunded', 'refunded_at', 'refund_amount');
```

This should return all three new columns.

## Notes

- `refunded` defaults to `false` for existing receipts
- `refunded_at` is set when a receipt is refunded
- `refund_amount` allows for partial refunds (if amount is less than receipt total)
- These fields are used by the verification state logic to determine if a receipt is REFUNDED

