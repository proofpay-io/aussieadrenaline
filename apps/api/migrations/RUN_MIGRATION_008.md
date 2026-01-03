# Running Migration 008: Update receipt_events Check Constraint

## Overview

This migration updates the `receipt_events` table to allow `receipt_view_blocked` as a valid event type.

## Steps

### 1. Open Supabase SQL Editor

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

### 2. Run the Migration

1. Open the file: `apps/api/migrations/008_update_receipt_events_check.sql`
2. Copy the entire contents
3. Paste into the SQL Editor
4. Click **Run** to execute the migration

### 3. Verify Migration

1. Go to **Table Editor** in the left sidebar
2. Click on the `receipt_events` table
3. The constraint should now allow `receipt_view_blocked` as a valid event type

## What This Migration Does

1. **Drops the old constraint** that only allowed `receipt_created`, `receipt_viewed`, `dispute_created`
2. **Adds a new constraint** that includes `receipt_view_blocked` as a valid event type

## After Migration

The system will now log `receipt_view_blocked` events when:
- A user attempts to view a receipt that is below the confidence threshold
- The event includes metadata: `confidence_score`, `threshold`, `path`

## Troubleshooting

### Error: Constraint does not exist
If you see "constraint does not exist" errors, the constraint may have a different name. Check the table structure in Supabase and adjust the migration if needed.

### Error: Constraint violation
If you see constraint violation errors after running the migration, verify that:
- The new constraint includes all four event types
- No existing events have invalid event_type values

