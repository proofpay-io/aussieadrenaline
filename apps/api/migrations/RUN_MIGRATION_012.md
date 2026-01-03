# Running Migration 012: Add receipt_shares table

This migration creates the `receipt_shares` table for storing shareable verification tokens used in QR codes.

## Steps

1. Open your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `012_add_receipt_shares.sql`
4. Click "Run" to execute the migration
5. Verify the table was created:
   - Go to Table Editor
   - Look for `receipt_shares` table
   - Verify it has the following columns:
     - `id` (uuid, primary key)
     - `receipt_id` (uuid, foreign key to receipts)
     - `token` (text, unique)
     - `created_at` (timestamptz)
     - `expires_at` (timestamptz, nullable)
     - `view_count` (integer, default 0)

## Verification

After running the migration, you can verify it worked by:

```sql
SELECT * FROM receipt_shares LIMIT 1;
```

This should return an empty result set (no error means the table exists).

## Notes

- The `token` column is unique to prevent collisions
- The `expires_at` column is nullable (no expiry by default for demo)
- The table has RLS enabled with a policy allowing service role access

