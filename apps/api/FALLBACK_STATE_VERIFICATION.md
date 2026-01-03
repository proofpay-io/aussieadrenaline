# Fallback State Implementation Verification

## Overview

The fallback state for below-threshold receipts has been fully implemented. This document verifies all components are working correctly.

## ✅ Implementation Status

### 1. Receipt List Page (`/receipts`)

**File:** `apps/web/app/receipts/page.tsx`

**Behavior:**
- ✅ Shows receipt row for below-threshold receipts
- ✅ Displays "Receipt not available" status message
- ✅ Hides item count (doesn't show "X items")
- ✅ API returns empty `receipt_items` array for below-threshold receipts

**Code Location:**
- Lines 204-212: Conditional rendering based on `receipt.below_threshold`

### 2. Receipt Detail Page (`/receipts/[id]`)

**File:** `apps/web/app/receipts/[id]/page.tsx`

**Behavior:**
- ✅ Shows clean fallback panel instead of items
- ✅ Displays "Receipt Not Available" heading
- ✅ Shows message: "An itemised receipt is not available for this transaction."
- ✅ Includes "Back to Receipts" link
- ✅ Bank-grade design (consistent styling)

**Code Location:**
- Lines 307-324: Fallback panel for below-threshold receipts

### 3. API Endpoints

**Files:** `apps/api/app.js` and `apps/api/api/index.js`

#### GET /api/receipts (List)
- ✅ Marks receipts as `below_threshold: true` if confidence score < threshold
- ✅ Returns empty `receipt_items: []` for below-threshold receipts
- ✅ HIGH confidence receipts always shown (bypass threshold)

#### GET /api/receipts/:id (Detail)
- ✅ Checks if receipt is below threshold
- ✅ Logs `receipt_view_blocked` event when viewing below-threshold receipt
- ✅ Returns receipt with `below_threshold: true` and empty `receipt_items: []`

### 4. Event Logging

**File:** `apps/api/lib/events.js`

- ✅ `logReceiptViewBlocked()` function exists
- ✅ Logs to `receipt_events` table with `event_type: 'receipt_view_blocked'`
- ✅ Includes metadata: `confidence_score`, `threshold`, `path`, `method`
- ✅ Non-blocking (errors don't break the response)

## Verification Steps

### Step 1: Verify Receipt List Behavior

1. Go to `/receipts` page
2. Look for receipts with "Receipt not available" status
3. Verify:
   - ✅ Receipt row is visible
   - ✅ Shows "Receipt not available" message
   - ✅ Does NOT show item count
   - ✅ Amount and merchant name are still visible

### Step 2: Verify Receipt Detail Behavior

1. Click on a below-threshold receipt from the list
2. Verify:
   - ✅ Shows fallback panel (not itemized receipt)
   - ✅ Heading: "Receipt Not Available"
   - ✅ Message: "An itemised receipt is not available for this transaction."
   - ✅ "Back to Receipts" link is present and functional

### Step 3: Verify Event Logging

1. View a below-threshold receipt detail page
2. Check `receipt_events` table in Supabase:
   ```sql
   SELECT * FROM receipt_events 
   WHERE event_type = 'receipt_view_blocked' 
   ORDER BY created_at DESC 
   LIMIT 10;
   ```
3. Verify:
   - ✅ Event is logged
   - ✅ `receipt_id` matches the viewed receipt
   - ✅ `metadata` contains `confidence_score` and `threshold`

### Step 4: Test Threshold Changes

#### Test 1: Set Threshold to 99
1. Go to `/bank-admin` dashboard
2. Set confidence threshold to 99
3. Go to `/receipts`
4. Verify:
   - ✅ Receipts with confidence < 99 show "Receipt not available"
   - ✅ HIGH confidence receipts (92-99) are still shown

#### Test 2: Set Threshold to 50
1. Go to `/bank-admin` dashboard
2. Set confidence threshold to 50
3. Go to `/receipts`
4. Verify:
   - ✅ All receipts with confidence >= 50 are shown normally
   - ✅ Only receipts with confidence < 50 show "Receipt not available"

## Code Locations

### Frontend
- **Receipt List:** `apps/web/app/receipts/page.tsx` (lines 204-212)
- **Receipt Detail:** `apps/web/app/receipts/[id]/page.tsx` (lines 307-324)

### Backend
- **List Endpoint:** `apps/api/app.js` (lines 86-105)
- **Detail Endpoint:** `apps/api/app.js` (lines 400-440)
- **Event Logging:** `apps/api/lib/events.js` (lines 117-124)

## Expected Behavior

### Receipt List (`/receipts`)
```
┌─────────────────────────────────────┐
│ Merchant Name        $XX.XX         │
│ Date: Jan 1, 2024                   │
│ Receipt not available  ← Status     │
└─────────────────────────────────────┘
```

### Receipt Detail (`/receipts/[id]`)
```
┌─────────────────────────────────────┐
│         ⚠️ Icon                     │
│   Receipt Not Available              │
│                                      │
│ An itemised receipt is not          │
│ available for this transaction.     │
│                                      │
│   [Back to Receipts]                 │
└─────────────────────────────────────┘
```

## Troubleshooting

### Issue: Receipts not showing "Receipt not available"

**Check:**
1. Threshold is set in `bank_settings` table
2. Receipts have `confidence_score` values
3. API is returning `below_threshold: true` for low-confidence receipts

**Solution:**
```bash
# Check API response
curl http://localhost:4000/api/receipts

# Verify threshold
curl http://localhost:4000/api/bank-admin/confidence-threshold
```

### Issue: Events not being logged

**Check:**
1. Migration 003 has been run (creates `receipt_events` table)
2. Migration 008 has been run (adds `receipt_view_blocked` to event types)
3. API server logs show no errors

**Solution:**
```sql
-- Check if table exists
SELECT * FROM receipt_events LIMIT 1;

-- Check if event type is allowed
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name LIKE '%event_type%';
```

### Issue: Fallback panel not showing

**Check:**
1. Receipt has `below_threshold: true` in API response
2. Browser console for errors
3. React component is receiving correct data

**Solution:**
1. Check browser console
2. Verify API response includes `below_threshold: true`
3. Check React component state

## Summary

✅ **Receipt list** shows "Receipt not available" for below-threshold receipts  
✅ **Receipt detail** shows fallback panel with proper message  
✅ **Event logging** captures `receipt_view_blocked` events  
✅ **API** returns empty items array for below-threshold receipts  
✅ **Design** is consistent and bank-grade  

All fallback state requirements have been implemented and are ready for use.

