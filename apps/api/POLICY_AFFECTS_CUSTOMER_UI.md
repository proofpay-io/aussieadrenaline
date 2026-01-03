# Policy Affects Customer UI - Implementation Guide

## Overview

The unified policy controls (`receipts_enabled` and `confidence_threshold`) now consistently affect the customer-facing receipt experience with proper event logging.

## Implementation Details

### 1. Event Logging with Reasons

#### When `receipts_enabled=false` blocks viewing:
- **Event Type:** `receipt_view_blocked`
- **Reason:** `FEATURE_DISABLED`
- **Metadata includes:**
  - `reason: 'FEATURE_DISABLED'`
  - `path`: Request URL
  - `method`: HTTP method
  - `user_agent`: User agent string
  - `receipt_id`: Receipt ID (if viewing specific receipt, null for list page)

#### When threshold blocks viewing:
- **Event Type:** `receipt_view_blocked`
- **Reason:** `BELOW_THRESHOLD`
- **Metadata includes:**
  - `reason: 'BELOW_THRESHOLD'`
  - `confidence_score`: Receipt confidence score
  - `confidence_label`: Receipt confidence label
  - `threshold`: Current confidence threshold
  - `path`: Request URL
  - `method`: HTTP method
  - `user_agent`: User agent string

### 2. API Endpoints Updated

#### GET /api/receipts
- Checks `receipts_enabled` first
- If disabled, logs `receipt_view_blocked` with `FEATURE_DISABLED` reason
- Returns 503 Service Unavailable

#### GET /api/receipts/:id
- Checks `receipts_enabled` first
- If disabled, logs `receipt_view_blocked` with `FEATURE_DISABLED` reason
- If enabled, checks confidence threshold
- If below threshold, logs `receipt_view_blocked` with `BELOW_THRESHOLD` reason
- Returns appropriate response

### 3. Frontend Behavior

#### When `receipts_enabled=false`:
- **List Page (`/receipts`):**
  - Shows "Receipts unavailable" message
  - Clean disabled state with icon
  - No receipt list displayed

- **Detail Page (`/receipts/[id]`):**
  - Shows "Receipts Unavailable" message
  - Message: "Receipt viewing is currently unavailable. Please try again later."
  - "Return to Receipts" link

#### When `receipts_enabled=true` but confidence < threshold:
- **List Page (`/receipts`):**
  - Shows receipt row with "Receipt not available" status
  - Hides item count

- **Detail Page (`/receipts/[id]`):**
  - Shows fallback panel: "Receipt Not Available"
  - Message: "An itemised receipt is not available for this transaction."
  - "Back to Receipts" link

### 4. Admin Usage View

The `/bank-admin/usage` page now:
- Shows `receipt_view_blocked` events in the filter dropdown
- Displays reason prominently for blocked events:
  - Shows "Reason: FEATURE_DISABLED" or "Reason: BELOW_THRESHOLD"
  - Uses amber badge color for blocked events
- Full metadata available in JSON format

## Code Changes

### Backend (`apps/api/`)

1. **`app.js` and `api/index.js`:**
   - Updated `/api/receipts` to log `FEATURE_DISABLED` when receipts are disabled
   - Updated `/api/receipts/:id` to log `FEATURE_DISABLED` when receipts are disabled
   - Updated threshold blocking to log `BELOW_THRESHOLD` reason

2. **Event Logging:**
   - All `logReceiptViewBlocked()` calls now include `reason` in metadata
   - Reasons: `FEATURE_DISABLED` or `BELOW_THRESHOLD`

### Frontend (`apps/web/`)

1. **`app/receipts/page.tsx`:**
   - Handles 503 errors by showing disabled state
   - Checks kill switch status on load

2. **`app/receipts/[id]/page.tsx`:**
   - Handles 503 errors by showing disabled state
   - Checks kill switch status on load

3. **`app/bank-admin/usage/page.tsx`:**
   - Added `receipt_view_blocked` to event type filter
   - Displays reason prominently for blocked events
   - Uses amber badge color for blocked events

## Verification Steps

### Test 1: Feature Disabled Blocks Viewing
1. Go to `/bank-admin`
2. Set "Receipts Enabled" to Disabled
3. Navigate to `/receipts`
4. **Verify:**
   - ✅ Shows "Receipts unavailable" message
   - ✅ No receipt list displayed
5. Navigate to `/bank-admin/usage`
6. **Verify:**
   - ✅ `receipt_view_blocked` event is logged
   - ✅ Reason shows "FEATURE_DISABLED"
   - ✅ Event appears in the list

### Test 2: Threshold Blocks Viewing
1. Go to `/bank-admin`
2. Set "Receipts Enabled" to Enabled
3. Set "Confidence Threshold" to 99
4. Navigate to `/receipts`
5. Click on a receipt with confidence < 99
6. **Verify:**
   - ✅ Shows "Receipt Not Available" fallback panel
   - ✅ Message: "An itemised receipt is not available for this transaction."
7. Navigate to `/bank-admin/usage`
8. **Verify:**
   - ✅ `receipt_view_blocked` event is logged
   - ✅ Reason shows "BELOW_THRESHOLD"
   - ✅ Metadata includes `confidence_score` and `threshold`
   - ✅ Event appears in the list

### Test 3: Admin Usage View Shows Reasons
1. Generate both types of blocked events (disabled and below threshold)
2. Navigate to `/bank-admin/usage`
3. Filter by "Receipt View Blocked"
4. **Verify:**
   - ✅ All blocked events are shown
   - ✅ Reason is displayed prominently
   - ✅ Metadata JSON shows full details
   - ✅ Events are color-coded (amber badge)

## Event Metadata Examples

### FEATURE_DISABLED Event
```json
{
  "reason": "FEATURE_DISABLED",
  "path": "/api/receipts",
  "method": "GET",
  "user_agent": "Mozilla/5.0..."
}
```

### BELOW_THRESHOLD Event
```json
{
  "reason": "BELOW_THRESHOLD",
  "confidence_score": 65,
  "confidence_label": "MEDIUM",
  "threshold": 85,
  "path": "/api/receipts/abc123",
  "method": "GET",
  "user_agent": "Mozilla/5.0..."
}
```

## Summary

✅ **Feature disabled** blocks viewing and logs `FEATURE_DISABLED` reason  
✅ **Threshold blocks** viewing and logs `BELOW_THRESHOLD` reason  
✅ **Customer UI** shows clean disabled state when feature is disabled  
✅ **Customer UI** shows fallback state when below threshold  
✅ **Admin usage view** displays blocked events with reasons  
✅ **Event logging** captures all necessary metadata  

All policy controls now consistently affect the customer-facing receipt experience with proper event logging and visibility in the admin console.

