# Event Logging Verification Guide

This guide helps you verify that receipt events are being logged correctly.

## Prerequisites

1. **Migration 003 must be run** - The `receipt_events` table must exist
   - See: `apps/api/migrations/RUN_MIGRATION_003.md`
   - Verify in Supabase: Table Editor → `receipt_events` table exists

## Event Types

The system logs two types of events:

1. **`receipt_created`** - When a receipt is created (simulated purchase)
2. **`receipt_viewed`** - When a receipt detail page is viewed

## Verification Steps

### Step 1: Verify receipt_created Events

1. **Create a simulated purchase:**
   - Go to: http://localhost:3000/demo-store
   - Click "Quick Add Random Cart"
   - Click "🎭 Simulate Purchase"

2. **Check the event was logged:**
   - Go to Supabase Dashboard → Table Editor
   - Open the `receipt_events` table
   - Look for a row with:
     - `event_type` = `receipt_created`
     - `receipt_id` = (the UUID of the created receipt)
     - `metadata` contains: `source`, `total`, `total_cents`, `item_count`, `payment_id`, `order_id`

3. **Verify metadata:**
   - Click on the `metadata` column
   - Should see JSON like:
     ```json
     {
       "source": "simulated",
       "total": 129.99,
       "total_cents": 12999,
       "item_count": 3,
       "payment_id": "sim_pay_...",
       "order_id": "sim_ord_..."
     }
     ```

### Step 2: Verify receipt_viewed Events

1. **View a receipt:**
   - Go to: http://localhost:3000/receipts
   - Click on any receipt to view details
   - Or directly visit: http://localhost:3000/receipts/[receipt-id]

2. **Check the event was logged:**
   - Go to Supabase Dashboard → Table Editor
   - Open the `receipt_events` table
   - Look for a new row with:
     - `event_type` = `receipt_viewed`
     - `receipt_id` = (the UUID of the viewed receipt)
     - `metadata` contains: `path`, `method`, `user_agent`

3. **Verify metadata:**
   - Click on the `metadata` column
   - Should see JSON like:
     ```json
     {
       "path": "/api/receipts/123e4567-e89b-12d3-a456-426614174000",
       "method": "GET",
       "user_agent": "Mozilla/5.0..."
     }
     ```

## Using SQL to Query Events

You can also query events directly in Supabase SQL Editor:

```sql
-- View all receipt_created events
SELECT 
  id,
  created_at,
  event_type,
  receipt_id,
  metadata
FROM receipt_events
WHERE event_type = 'receipt_created'
ORDER BY created_at DESC
LIMIT 10;

-- View all receipt_viewed events
SELECT 
  id,
  created_at,
  event_type,
  receipt_id,
  metadata->>'path' as path,
  metadata->>'method' as method
FROM receipt_events
WHERE event_type = 'receipt_viewed'
ORDER BY created_at DESC
LIMIT 10;

-- Count events by type
SELECT 
  event_type,
  COUNT(*) as count
FROM receipt_events
GROUP BY event_type;

-- View events for a specific receipt
SELECT 
  id,
  created_at,
  event_type,
  metadata
FROM receipt_events
WHERE receipt_id = 'YOUR_RECEIPT_ID_HERE'
ORDER BY created_at ASC;
```

## Troubleshooting

### No events are being logged

1. **Check if table exists:**
   ```sql
   SELECT * FROM receipt_events LIMIT 1;
   ```
   - If error: "relation does not exist" → Run migration 003

2. **Check API logs:**
   - Look for warnings like: "receipt_events table does not exist"
   - This means migration 003 hasn't been run

3. **Check Supabase connection:**
   - Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
   - Test connection: `cd apps/api && npm run verify-tables`

### Events are logged but metadata is empty

- This is normal if the metadata object is empty `{}`
- Check that the code is passing metadata correctly
- Verify the insert statement includes metadata

### Events fail to log but don't break the flow

- This is **expected behavior** - event logging is non-blocking
- Check console/API logs for warnings
- Events will fail gracefully if:
  - Table doesn't exist (migration not run)
  - Supabase connection issues
  - Invalid event type

## Expected Behavior

✅ **Events should be logged:**
- After every simulated purchase
- Every time a receipt detail page is viewed

✅ **Events should NOT break the user flow:**
- If event logging fails, the receipt creation/viewing should still work
- Errors are logged but don't throw exceptions

✅ **Events are append-only:**
- Once created, events are never updated
- Each event has a unique `id` and `created_at` timestamp

## Next Steps

After verifying events are logged:
1. ✅ Events are being captured
2. ✅ Metadata is stored correctly
3. ✅ Events don't break user flows
4. ✅ Ready for dispute creation events (next feature)

