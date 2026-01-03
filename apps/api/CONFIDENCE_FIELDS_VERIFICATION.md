# Confidence Fields Verification

## Overview

The confidence scoring mechanism has been implemented for receipts. This document verifies that all components are in place and working correctly.

## ✅ Implementation Status

### 1. Database Schema (Migration 006)

**File:** `apps/api/migrations/006_add_confidence_fields.sql`

The migration adds three columns to the `receipts` table:

- ✅ `confidence_score` (INTEGER, 0-100, nullable)
- ✅ `confidence_label` (TEXT: HIGH/MEDIUM/LOW, nullable)
- ✅ `confidence_reasons` (JSONB array, nullable)

**Backfill:** Existing receipts are automatically backfilled with:
- `confidence_score`: 95
- `confidence_label`: 'HIGH'
- `confidence_reasons`: ["SOURCE_POS", "TOTAL_EXACT", "TIME_EXACT"]

### 2. Simulated Receipts

**File:** `apps/web/app/api/demo/simulate-purchase/route.ts`

Simulated receipts automatically set confidence fields on creation:

#### Normal Receipts (default):
- ✅ `confidence_score`: Random integer between 92-99
- ✅ `confidence_label`: "HIGH"
- ✅ `confidence_reasons`: ["SOURCE_POS", "TOTAL_EXACT", "TIME_EXACT"]

#### Low Confidence Receipts (when `low_confidence: true`):
- ✅ `confidence_score`: Random integer between 40-70
- ✅ `confidence_label`: "LOW" (if score < 55) or "MEDIUM" (if score >= 55)
- ✅ `confidence_reasons`: ["DESCRIPTOR_WEAK", "TIME_WINDOW_WIDE"]

### 3. Migration Documentation

**File:** `apps/api/migrations/RUN_MIGRATION_006.md`

Complete instructions for running the migration in Supabase.

## Verification Steps

### Step 1: Verify Migration Has Been Run

1. Go to Supabase Dashboard → Table Editor → `receipts` table
2. Verify these columns exist:
   - `confidence_score` (integer)
   - `confidence_label` (text)
   - `confidence_reasons` (jsonb)

### Step 2: Verify Simulated Receipts

Run the verification script:

```bash
cd apps/api
npm run verify-confidence
```

Or manually check:

1. Create a simulated receipt via `/demo-store`
2. Check the receipt in Supabase or via `/api/receipts`
3. Verify it has:
   - `confidence_score`: 92-99
   - `confidence_label`: "HIGH"
   - `confidence_reasons`: ["SOURCE_POS", "TOTAL_EXACT", "TIME_EXACT"]

### Step 3: Verify Existing Receipts

After running migration 006, all existing receipts should have:
- `confidence_score`: 95
- `confidence_label`: "HIGH"
- `confidence_reasons`: ["SOURCE_POS", "TOTAL_EXACT", "TIME_EXACT"]

## Code Locations

### Migration
- **SQL:** `apps/api/migrations/006_add_confidence_fields.sql`
- **Instructions:** `apps/api/migrations/RUN_MIGRATION_006.md`

### Simulated Purchase Endpoint
- **File:** `apps/web/app/api/demo/simulate-purchase/route.ts`
- **Lines:** 135-153 (normal receipts), 140-145 (low confidence receipts)

### Verification Script
- **File:** `apps/api/scripts/verify-confidence-fields.js`
- **Command:** `npm run verify-confidence`

## Expected Behavior

### New Simulated Receipts

When creating a simulated purchase via `/demo-store`:

1. **Normal receipt** (default):
   ```json
   {
     "confidence_score": 92-99,  // Random
     "confidence_label": "HIGH",
     "confidence_reasons": ["SOURCE_POS", "TOTAL_EXACT", "TIME_EXACT"]
   }
   ```

2. **Low confidence receipt** (when toggle is enabled):
   ```json
   {
     "confidence_score": 40-70,  // Random
     "confidence_label": "LOW" or "MEDIUM",
     "confidence_reasons": ["DESCRIPTOR_WEAK", "TIME_WINDOW_WIDE"]
   }
   ```

### Existing Receipts

After migration 006:
- All existing receipts are backfilled with HIGH confidence (score: 95)
- This ensures backward compatibility

## Troubleshooting

### Issue: Columns don't exist

**Solution:** Run migration 006:
1. See `apps/api/migrations/RUN_MIGRATION_006.md`
2. Copy SQL from `apps/api/migrations/006_add_confidence_fields.sql`
3. Run in Supabase SQL Editor

### Issue: Simulated receipts missing confidence fields

**Solution:** 
1. Check that migration 006 has been run
2. Verify the simulate-purchase route is using the latest code
3. Check server logs for errors when creating receipts

### Issue: Existing receipts not backfilled

**Solution:** Manually run the backfill:
```sql
UPDATE receipts
SET 
  confidence_score = 95,
  confidence_label = 'HIGH',
  confidence_reasons = '["SOURCE_POS", "TOTAL_EXACT", "TIME_EXACT"]'::jsonb
WHERE confidence_score IS NULL;
```

## Summary

✅ **Migration exists** and is documented  
✅ **Simulated receipts** automatically set confidence fields  
✅ **Existing receipts** are backfilled with HIGH confidence  
✅ **Verification script** available for testing  

All confidence field requirements have been implemented and are ready for use.

