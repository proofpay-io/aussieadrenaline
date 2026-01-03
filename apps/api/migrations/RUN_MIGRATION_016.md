# Running Migration 016: Add single-use token fields

This migration adds `single_use` and `used_at` fields to the `receipt_shares` table for enhanced QR token security.

## Steps

1. Open your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `016_add_single_use_token_fields.sql`
4. Click "Run" to execute the migration
5. Verify the columns were added:
   - Go to Table Editor
   - Look for `receipt_shares` table
   - Verify it has the following new columns:
     - `single_use` (boolean, default false)
     - `used_at` (timestamp with time zone, nullable)

## Verification

After running the migration, you can verify it worked by:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'receipt_shares'
AND column_name IN ('single_use', 'used_at');
```

This should return two rows showing the new columns.

## Notes

- `single_use` defaults to `false` for backward compatibility
- `used_at` is nullable and only set when a single-use token is first used
- When `single_use=true` and `used_at` exists, verification will return `INVALID`

