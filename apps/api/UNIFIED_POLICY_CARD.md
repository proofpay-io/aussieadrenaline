# Unified Policy Card Implementation

## Overview

The unified Policy card combines the kill switch (receipts enabled/disabled) and confidence threshold controls into a single, cohesive UI component on the `/bank-admin` dashboard.

## Features

### 1. Receipts Enabled Toggle
- **Setting Key:** `receipts_enabled`
- **Type:** Boolean
- **Default:** `true` (receipts are enabled)
- **Behavior:** When disabled, all receipts are hidden from customers regardless of confidence threshold

### 2. Confidence Threshold
- **Setting Key:** `confidence_threshold`
- **Type:** Integer (0-100)
- **Default:** `85`
- **Behavior:** Only receipts at or above this threshold are shown to customers (when receipts are enabled)

### 3. Customer-Facing Result Preview
The Policy card shows a preview of what customers will see:
- **Receipts Disabled:** "Receipts temporarily unavailable" (Feature is disabled)
- **Receipts Enabled + Below Threshold:** "Receipt not available" (Below confidence threshold)

## Database Schema

### Migration 009
Run `apps/api/migrations/009_add_receipts_enabled_setting.sql` in Supabase:

```sql
INSERT INTO bank_settings (key, value, description)
VALUES (
  'receipts_enabled',
  '{"enabled": true}'::jsonb,
  'Master toggle to enable/disable receipt viewing. When disabled, all receipts are hidden from customers regardless of confidence threshold.'
)
ON CONFLICT (key) DO NOTHING;
```

## API Endpoints

### GET /api/bank-admin/receipts-enabled
Returns the current `receipts_enabled` status.

**Response:**
```json
{
  "enabled": true
}
```

### PUT /api/bank-admin/receipts-enabled
Updates the `receipts_enabled` status.

**Request Body:**
```json
{
  "enabled": true
}
```

**Response:**
```json
{
  "enabled": true
}
```

## Frontend Implementation

### Policy Card Location
`apps/web/app/bank-admin/page.tsx`

### Components
1. **Receipts Enabled Toggle:** Switch control to enable/disable receipts
2. **Confidence Threshold:** Slider and number input (0-100)
3. **Customer-Facing Result Preview:** Shows what customers will see based on current settings

### State Management
- `receiptsEnabled`: Current receipts enabled status
- `confidenceThreshold`: Current confidence threshold value
- `updatingReceiptsEnabled`: Loading state for toggle updates
- `updatingThreshold`: Loading state for threshold updates

## Logic Flow

### Receipt Visibility Decision Tree

```
1. Is receipts_enabled = true?
   ├─ NO → Show "Receipts temporarily unavailable" (503 error)
   └─ YES → Continue to step 2

2. Is confidence_label = 'HIGH'?
   ├─ YES → Show receipt (always shown)
   └─ NO → Continue to step 3

3. Does receipt have confidence_score?
   ├─ NO → Show receipt (fail open)
   └─ YES → Continue to step 4

4. Is confidence_score >= confidence_threshold?
   ├─ YES → Show receipt
   └─ NO → Show "Receipt not available" (fallback state)
```

## Backend Changes

### Updated Files
1. **`apps/api/lib/kill-switch.js`**
   - Added `isReceiptsEnabled()` function
   - Updated `isKillSwitchEnabled()` to check `receipts_enabled` first

2. **`apps/api/app.js`** and **`apps/api/api/index.js`**
   - Updated `/api/receipts` to use `isReceiptsEnabled()`
   - Updated `/api/receipts/:id` to use `isReceiptsEnabled()`
   - Added `/api/bank-admin/receipts-enabled` endpoints

3. **`apps/web/lib/kill-switch.ts`**
   - Updated `checkKillSwitch()` to check `receipts_enabled` first, fallback to `kill_switch`

## Verification Steps

### 1. Run Migration
```sql
-- In Supabase SQL Editor
-- Run apps/api/migrations/009_add_receipts_enabled_setting.sql
```

### 2. Test Policy Card
1. Navigate to `/bank-admin`
2. Verify Policy card is visible
3. Verify both controls are present:
   - Receipts Enabled toggle
   - Confidence Threshold slider/input
4. Verify customer-facing result preview shows correct message

### 3. Test Toggle Persistence
1. Toggle "Receipts Enabled" to Disabled
2. Refresh the page
3. Verify toggle remains Disabled
4. Toggle back to Enabled
5. Refresh the page
6. Verify toggle remains Enabled

### 4. Test Threshold Persistence
1. Change confidence threshold to 99
2. Refresh the page
3. Verify threshold remains 99
4. Change threshold to 50
5. Refresh the page
6. Verify threshold remains 50

### 5. Test Customer-Facing Behavior
1. Set receipts_enabled to Disabled
2. Navigate to `/receipts`
3. Verify "Receipts unavailable" message appears
4. Set receipts_enabled to Enabled
5. Set confidence_threshold to 99
6. Navigate to `/receipts`
7. Verify receipts with confidence < 99 show "Receipt not available"

## Customer-Facing Messages

### When Receipts Are Disabled
- **List Page:** "Receipts unavailable"
- **Detail Page:** "Receipts temporarily unavailable. Please try again later."
- **API Response:** 503 Service Unavailable

### When Receipts Are Enabled But Below Threshold
- **List Page:** "Receipt not available" (status badge)
- **Detail Page:** "Receipt Not Available" with message "An itemised receipt is not available for this transaction."
- **API Response:** 200 OK with `below_threshold: true` and empty `receipt_items: []`

## Migration Notes

- Migration 009 is **non-destructive** (uses `ON CONFLICT DO NOTHING`)
- Existing `kill_switch` setting remains for backward compatibility
- System checks `receipts_enabled` first, falls back to `kill_switch` if not found
- Default behavior: receipts are enabled (fail open)

## Troubleshooting

### Issue: Policy card not showing
**Check:**
- Migration 009 has been run
- `receipts_enabled` setting exists in `bank_settings` table
- API endpoints are accessible

### Issue: Toggle not persisting
**Check:**
- API endpoint `/api/bank-admin/receipts-enabled` is working
- Database write permissions
- Browser console for errors

### Issue: Customer-facing preview incorrect
**Check:**
- Both `receiptsEnabled` and `confidenceThreshold` state are loaded
- Preview logic matches actual API behavior

## Summary

✅ Unified Policy card combines both controls  
✅ Customer-facing result preview shows correct message  
✅ Settings persist after refresh  
✅ Backward compatible with legacy `kill_switch` setting  
✅ Migration 009 creates `receipts_enabled` with default `true`

