# Quick Fix: receipt_events Table Not Visible

## Problem

The `receipt_events` table is not visible in Supabase because **Migration 003 hasn't been run yet**.

## Solution: Run Migration 003

### Step 1: Check if Table Exists

Run this command to check:
```bash
cd apps/api
npm run check-events-table
```

If you see "❌ receipt_events table does NOT exist", continue to Step 2.

### Step 2: Run Migration 003 in Supabase

1. **Open Supabase Dashboard:**
   - Go to: https://app.supabase.com
   - Sign in and select your project

2. **Open SQL Editor:**
   - Click **SQL Editor** in the left sidebar
   - Click **New Query** button

3. **Copy the Migration SQL:**
   - Open the file: `apps/api/migrations/003_add_audit_and_disputes_tables.sql`
   - Copy the **entire contents** of the file (Ctrl+A, Ctrl+C)

4. **Paste and Run:**
   - Paste into the SQL Editor
   - Click **Run** (or press Ctrl+Enter)

5. **Verify Success:**
   - You should see: **"Success. No rows returned"**
   - This means the tables were created successfully

### Step 3: Verify Tables Were Created

**Option A: Using Supabase Dashboard**
1. Click **Table Editor** in the left sidebar
2. You should now see three new tables:
   - `receipt_events` ✅
   - `disputes` ✅
   - `dispute_items` ✅

**Option B: Using Command Line**
```bash
cd apps/api
npm run check-events-table
```

You should see:
```
✅ receipt_events table exists!
📊 Total events: 0
```

### Step 4: Test Event Logging

After the table is created, events will be logged automatically:

1. **Test receipt_created event:**
   - Go to: http://localhost:3000/demo-store
   - Click "🎭 Simulate Purchase"
   - Check Supabase → `receipt_events` table
   - You should see a `receipt_created` event

2. **Test receipt_viewed event:**
   - Go to: http://localhost:3000/receipts
   - Click on any receipt
   - Check Supabase → `receipt_events` table
   - You should see a `receipt_viewed` event

## What Migration 003 Creates

Migration 003 creates three tables:

1. **`receipt_events`** - Immutable event log for auditability
   - Tracks: `receipt_created`, `receipt_viewed`, `dispute_created` events
   - Stores metadata as JSONB

2. **`disputes`** - Dispute records
   - Links to receipts
   - Tracks dispute status and reason codes

3. **`dispute_items`** - Individual items being disputed
   - Links disputes to specific receipt items

## Troubleshooting

### "relation does not exist" Error

If you get this error when running the migration:
- Make sure you copied the **entire** SQL file
- Check that migration 001 was run first (creates `receipts` table)
- The `receipt_events` table depends on the `receipts` table

### Tables Still Not Visible

1. **Refresh Supabase Dashboard:**
   - Sometimes tables don't appear immediately
   - Try refreshing the page (F5)

2. **Check SQL Editor History:**
   - Go to SQL Editor → History
   - Verify the migration ran successfully

3. **Check for Errors:**
   - Look for red error messages in SQL Editor
   - Common issues: syntax errors, missing dependencies

### Events Not Being Logged

Even after creating the table, if events aren't being logged:

1. **Check API logs:**
   - Look for warnings: "receipt_events table does not exist"
   - This means the table wasn't created properly

2. **Verify Supabase connection:**
   ```bash
   cd apps/api
   npm run verify-tables
   ```

3. **Check environment variables:**
   - Ensure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
   - In `apps/api/.env` file

## Next Steps

Once the table is created:
- ✅ Events will be logged automatically
- ✅ No code changes needed
- ✅ Events are non-blocking (won't break user flows)
- ✅ Ready for dispute creation events

See: `apps/api/EVENT_LOGGING_VERIFICATION.md` for detailed verification steps.

