# Running Migration 017: Add verification event types

This migration updates the `receipt_events` table to include new event types for verification tracking.

## Steps

1. Open your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `017_add_verification_event_types.sql`
4. Click "Run" to execute the migration
5. Verify the constraint was updated:
   - The `event_type` column should now accept:
     - `receipt_verified`
     - `receipt_verification_failed`

## Verification

After running the migration, you can verify it worked by:

```sql
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'receipt_events_event_type_check';
```

This should show the constraint includes the new event types.

## Notes

- This migration adds two new event types for tracking verification attempts
- `receipt_verified`: Logged when a token verification succeeds (VALID state)
- `receipt_verification_failed`: Logged when a token verification fails (INVALID, EXPIRED, REFUNDED, DISPUTED states)

