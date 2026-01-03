# Running Migration 014: Add verification status to receipt_shares

This migration adds merchant verification state tracking to prevent fake or reused QR codes.

## Steps

1. Open your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `014_add_verification_status.sql`
4. Click "Run" to execute the migration
5. Verify the columns were added:
   - Go to Table Editor
   - Select `receipt_shares` table
   - Verify it has the following new columns:
     - `status` (text, default 'active', check constraint)
     - `verified_at` (timestamptz, nullable)
     - `verified_by` (text, nullable)
     - `verification_attempts` (integer, default 0)

## Verification

After running the migration, you can verify it worked by:

```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'receipt_shares' 
AND column_name IN ('status', 'verified_at', 'verified_by', 'verification_attempts');
```

This should return all four new columns.

## Status Values

The `status` column accepts these values:
- `active` - Token is active and unverified
- `verified` - Token has been verified by a merchant
- `used` - Token has been used/consumed
- `voided` - Token has been invalidated
- `expired` - Token has expired

## Notes

- Existing shares will be set to `active` status
- The `verified_by` field is optional and can store a merchant identifier
- `verification_attempts` tracks how many times verification was attempted
- `verified_at` is set when a merchant verifies the token

