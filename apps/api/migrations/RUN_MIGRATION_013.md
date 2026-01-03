# Running Migration 013: Add share event types

This migration updates the `receipt_events` table to include new event types for receipt sharing.

## Steps

1. Open your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `013_add_share_event_types.sql`
4. Click "Run" to execute the migration
5. Verify the constraint was updated:
   - The `event_type` column should now accept:
     - `receipt_created`
     - `receipt_viewed`
     - `dispute_created`
     - `receipt_view_blocked`
     - `policy_updated`
     - `receipt_share_created` (new)
     - `receipt_share_viewed` (new)

## Verification

After running the migration, you can verify it worked by:

```sql
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'receipt_events_event_type_check';
```

This should show the updated constraint with all event types.

## Notes

- This migration drops and recreates the check constraint
- Existing events are not affected
- The new event types are used for logging QR code share creation and viewing

