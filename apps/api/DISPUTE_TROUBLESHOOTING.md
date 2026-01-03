# Dispute Endpoint Troubleshooting

## Problem: No events in disputes and dispute_items tables

If you're not seeing data in the `disputes` and `dispute_items` tables, follow these steps:

## Step 1: Check if Tables Exist

**Option A: Using Supabase Dashboard**
1. Go to: https://app.supabase.com
2. Click **Table Editor** in the left sidebar
3. Look for these tables:
   - `disputes` ✅
   - `dispute_items` ✅
   - `receipt_events` ✅

**Option B: Using Command Line**
```bash
cd apps/api
npm run check-events-table
```

**If tables don't exist:**
- Run Migration 003: `apps/api/migrations/003_add_audit_and_disputes_tables.sql`
- See: `apps/api/migrations/RUN_MIGRATION_003.md`

## Step 2: Check if API Endpoint is Running

**Test the endpoint directly:**

```bash
# Get a receipt ID and item ID first
# Then test:
curl -X POST http://localhost:4000/api/disputes \
  -H "Content-Type: application/json" \
  -d '{
    "receipt_id": "YOUR_RECEIPT_ID",
    "selected_items": [
      {
        "receipt_item_id": "YOUR_ITEM_ID",
        "quantity": 1
      }
    ],
    "reason_code": "item_not_received"
  }'
```

**Check API logs:**
- Look for: `📝 Creating dispute`
- Look for: `✅ Dispute created`
- Look for any error messages

## Step 3: Verify You Have Receipts and Items

**Check receipts:**
```bash
cd apps/api
npm run check-receipts
```

**Or in Supabase SQL Editor:**
```sql
SELECT id, payment_id, amount FROM receipts LIMIT 5;
SELECT id, receipt_id, item_name, item_price FROM receipt_items LIMIT 5;
```

## Step 4: Test Dispute Creation

**Run the test script:**
```bash
cd apps/api
npm run test-dispute
```

This will:
- Check if tables exist
- Find a receipt with items
- Create a test dispute
- Show you exactly what's happening

## Step 5: Check Common Issues

### Issue 1: Tables Don't Exist
**Symptom:** Error "relation does not exist" or tables not visible in Supabase

**Fix:**
1. Run Migration 003 in Supabase SQL Editor
2. Verify tables appear in Table Editor
3. Try again

### Issue 2: No Receipts/Items
**Symptom:** "Receipt not found" or "No items found"

**Fix:**
1. Create a simulated purchase: http://localhost:3000/demo-store
2. Click "🎭 Simulate Purchase"
3. Get the receipt ID from Supabase
4. Try creating dispute again

### Issue 3: API Not Running
**Symptom:** Connection refused or 404 error

**Fix:**
1. Start API server: `cd apps/api && npm run dev`
2. Verify it's running: `curl http://localhost:4000/health`
3. Try dispute endpoint again

### Issue 4: Validation Errors
**Symptom:** 400 Bad Request with validation error

**Check:**
- `receipt_id` is a valid UUID
- `selected_items` is an array with at least one item
- Each item has `receipt_item_id` (valid UUID)
- `reason_code` is provided

### Issue 5: Database Errors
**Symptom:** 500 Internal Server Error

**Check API logs for:**
- Database connection errors
- Foreign key constraint errors
- Missing columns

## Step 6: Manual Test in Supabase

If the API isn't working, test directly in Supabase:

1. **Get a receipt ID:**
   ```sql
   SELECT id FROM receipts LIMIT 1;
   ```

2. **Get an item ID:**
   ```sql
   SELECT id, item_price FROM receipt_items 
   WHERE receipt_id = 'YOUR_RECEIPT_ID' 
   LIMIT 1;
   ```

3. **Create dispute manually:**
   ```sql
   INSERT INTO disputes (receipt_id, status, reason_code, notes)
   VALUES ('YOUR_RECEIPT_ID', 'submitted', 'item_not_received', 'Manual test')
   RETURNING id;
   ```

4. **Create dispute item:**
   ```sql
   INSERT INTO dispute_items (dispute_id, receipt_item_id, quantity, amount_cents)
   VALUES ('DISPUTE_ID_FROM_STEP_3', 'YOUR_ITEM_ID', 1, 1000)
   RETURNING id;
   ```

5. **Check if it worked:**
   ```sql
   SELECT * FROM disputes WHERE id = 'DISPUTE_ID';
   SELECT * FROM dispute_items WHERE dispute_id = 'DISPUTE_ID';
   ```

## Step 7: Check Event Logging

**Check if events are being logged:**
```sql
SELECT * FROM receipt_events 
WHERE event_type = 'dispute_created' 
ORDER BY created_at DESC 
LIMIT 5;
```

**If no events:**
- Event logging is non-blocking, so disputes can be created even if events fail
- Check API logs for event logging warnings
- Verify `receipt_events` table exists

## Quick Diagnostic Commands

```bash
# Check tables exist
cd apps/api
npm run check-events-table

# Check receipts exist
npm run check-receipts

# Test dispute endpoint
npm run test-dispute
```

## Still Not Working?

1. **Check API server logs** - Look for errors when calling the endpoint
2. **Check Supabase logs** - Go to Logs → API Logs in Supabase Dashboard
3. **Verify environment variables** - Ensure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
4. **Test with curl** - Use the curl command above to test directly
5. **Check browser console** - If calling from UI, check for JavaScript errors

## Expected Behavior

When a dispute is created successfully:
1. ✅ Row appears in `disputes` table with `status = 'submitted'`
2. ✅ Rows appear in `dispute_items` table (one per selected item)
3. ✅ Event appears in `receipt_events` table with `event_type = 'dispute_created'`
4. ✅ API returns `{ success: true, dispute_id: "...", status: "submitted" }`

If any of these are missing, use the steps above to diagnose.

