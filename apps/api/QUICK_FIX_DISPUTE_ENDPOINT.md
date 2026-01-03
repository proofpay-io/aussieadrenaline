# Quick Fix: Dispute Endpoint Not Working

## Problem

No events/data appearing in `disputes` and `dispute_items` tables in Supabase.

## Most Common Causes

### 1. Tables Don't Exist (Most Likely)

**Check:**
- Go to Supabase Dashboard → Table Editor
- Look for `disputes` and `dispute_items` tables

**If missing:**
1. Go to Supabase SQL Editor
2. Run Migration 003: `apps/api/migrations/003_add_audit_and_disputes_tables.sql`
3. Verify tables appear in Table Editor

### 2. API Endpoint Not Added

**Fixed!** The endpoint has been added to:
- ✅ `apps/api/app.js` (local development)
- ✅ `apps/api/api/index.js` (Vercel deployment)

**Restart your API server:**
```bash
cd apps/api
npm run dev
```

### 3. No Receipts/Items to Dispute

**Check:**
```bash
cd apps/api
npm run check-receipts
```

**If no receipts:**
1. Go to: http://localhost:3000/demo-store
2. Click "🎭 Simulate Purchase"
3. Get receipt ID from Supabase

### 4. Endpoint Not Being Called

**Test the endpoint directly:**
```bash
# First, get a receipt ID and item ID from Supabase
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

**Check API logs for:**
- `📝 Creating dispute`
- `✅ Dispute created`
- Any error messages

## Quick Test Script

Run this to diagnose everything:
```bash
cd apps/api
npm run test-dispute
```

This will:
- ✅ Check if tables exist
- ✅ Find receipts and items
- ✅ Test creating a dispute
- ✅ Show you what's working and what's not

## Expected Result

After creating a dispute, you should see:

1. **In `disputes` table:**
   - New row with `status = 'submitted'`
   - `receipt_id` linked to your receipt
   - `reason_code` and optional `notes`

2. **In `dispute_items` table:**
   - Rows for each selected item
   - `dispute_id` linked to the dispute
   - `receipt_item_id` linked to the receipt item
   - `quantity` and `amount_cents`

3. **In `receipt_events` table:**
   - New event with `event_type = 'dispute_created'`
   - Metadata with dispute details

## Still Not Working?

1. **Check API server is running:**
   ```bash
   curl http://localhost:4000/health
   ```

2. **Check API logs** when calling the endpoint

3. **Verify environment variables:**
   - `SUPABASE_URL` is set
   - `SUPABASE_SERVICE_ROLE_KEY` is set

4. **See full troubleshooting guide:**
   - `apps/api/DISPUTE_TROUBLESHOOTING.md`

