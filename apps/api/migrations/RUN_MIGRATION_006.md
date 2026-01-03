# Running Migration 006: Add Confidence Fields

## Overview

This migration adds confidence scoring fields to the `receipts` table:
- `confidence_score` (integer 0-100, nullable)
- `confidence_label` (text: HIGH/MEDIUM/LOW, nullable)
- `confidence_reasons` (jsonb array, nullable)

## Steps

### 1. Open Supabase SQL Editor

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

### 2. Run the Migration

1. Open the file: `apps/api/migrations/006_add_confidence_fields.sql`
2. Copy the entire contents
3. Paste into the SQL Editor
4. Click **Run** to execute the migration

### 3. Verify Migration

1. Go to **Table Editor** in the left sidebar
2. Click on the `receipts` table
3. Verify the new columns exist:
   - `confidence_score` (integer)
   - `confidence_label` (text)
   - `confidence_reasons` (jsonb)

### 4. Check Existing Receipts

Existing receipts should have been backfilled with:
- `confidence_score`: 95
- `confidence_label`: 'HIGH'
- `confidence_reasons`: ["SOURCE_POS", "TOTAL_EXACT", "TIME_EXACT"]

## What This Migration Does

1. **Adds three new columns** to the `receipts` table
2. **Adds check constraints** to ensure valid values:
   - `confidence_score` must be between 0-100
   - `confidence_label` must be HIGH, MEDIUM, or LOW
3. **Backfills existing receipts** with HIGH confidence for demo purposes
4. **Creates indexes** for faster queries on confidence fields
5. **Adds documentation** via column comments

## After Migration

New simulated receipts will automatically have:
- `confidence_score`: Random value between 92-99
- `confidence_label`: 'HIGH'
- `confidence_reasons`: ["SOURCE_POS", "TOTAL_EXACT", "TIME_EXACT"]

## Troubleshooting

### Error: Column already exists
If you see "column already exists" errors, the migration has already been run. This is safe to ignore.

### Error: Check constraint violation
If you see check constraint errors, verify that:
- `confidence_score` values are between 0-100
- `confidence_label` values are HIGH, MEDIUM, or LOW

### Existing receipts not updated
If existing receipts don't have confidence values after running the migration:
1. Check the UPDATE statement in the migration ran successfully
2. Manually update if needed:
   ```sql
   UPDATE receipts
   SET 
     confidence_score = 95,
     confidence_label = 'HIGH',
     confidence_reasons = '["SOURCE_POS", "TOTAL_EXACT", "TIME_EXACT"]'::jsonb
   WHERE confidence_score IS NULL;
   ```

