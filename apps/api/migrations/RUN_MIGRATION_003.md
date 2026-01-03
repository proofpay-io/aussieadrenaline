# Run Migration 003: Add Auditability and Disputes Tables

This migration adds three new tables for auditability and dispute management:
- `receipt_events` - Immutable event log
- `disputes` - Dispute records
- `dispute_items` - Individual items being disputed

## Step 1: Open Supabase SQL Editor

1. Go to: https://app.supabase.com
2. Sign in and select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query** button

## Step 2: Run the Migration

1. Open the file: `apps/api/migrations/003_add_audit_and_disputes_tables.sql`
2. Copy the **entire contents** of the file
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)

## Step 3: Verify Success

You should see: **"Success. No rows returned"**

This means the tables were created successfully.

## Step 4: Verify Tables Exist

### Option A: Using Supabase Dashboard

1. Click **Table Editor** in the left sidebar
2. You should see three new tables:
   - `receipt_events`
   - `disputes`
   - `dispute_items`

### Option B: Using Verification Script

```bash
cd apps/api
npm run verify-tables
```

## Table Structures

### receipt_events
- `id` (UUID) - Primary key
- `created_at` (TIMESTAMP) - Event timestamp
- `event_type` (TEXT) - Type: `receipt_created`, `receipt_viewed`, `dispute_created`
- `receipt_id` (UUID) - Foreign key to receipts (nullable)
- `metadata` (JSONB) - Additional event data

### disputes
- `id` (UUID) - Primary key
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp
- `receipt_id` (UUID) - Foreign key to receipts
- `status` (TEXT) - Status: `submitted`, `in_review`, `resolved`, `rejected`
- `reason_code` (TEXT) - Reason code for the dispute
- `notes` (TEXT) - Optional notes

### dispute_items
- `id` (UUID) - Primary key
- `dispute_id` (UUID) - Foreign key to disputes
- `receipt_item_id` (UUID) - Foreign key to receipt_items
- `quantity` (NUMERIC) - Quantity being disputed
- `amount_cents` (INTEGER) - Disputed amount in cents (nullable)

## Features Included

✅ Foreign key relationships with CASCADE delete  
✅ Indexes for performance (including GIN index for JSONB)  
✅ Check constraints for valid enum values  
✅ Automatic timestamps (created_at, updated_at)  
✅ Auto-update triggers for updated_at  
✅ Row Level Security (RLS) enabled  
✅ Service role policies for full access  

## Troubleshooting

### Error: "relation already exists"
- The tables may have been created already
- Check Table Editor to see if they exist
- If they exist, the migration was successful

### Error: "function update_updated_at_column does not exist"
- Run migration 001 first: `001_create_receipts_tables.sql`
- This function is created in the first migration

### Error: "relation receipts does not exist"
- Run migration 001 first: `001_create_receipts_tables.sql`
- The disputes tables depend on the receipts table

## Next Steps

After running this migration:
1. ✅ Tables are ready for use
2. ✅ You can start logging receipt events
3. ✅ You can create disputes and dispute items
4. ✅ All foreign keys and indexes are in place

