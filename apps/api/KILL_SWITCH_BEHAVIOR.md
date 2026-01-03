# Kill Switch Behavior

## Overview

The ProofPay kill switch allows bank administrators to disable receipt viewing for customers while maintaining receipt ingestion capabilities.

## Behavior

### When Kill Switch is ON (enabled = true)

1. **Customer UI Blocked:**
   - `/receipts` page shows "Receipts Unavailable" message
   - `/receipts/[id]` page shows "Receipts Unavailable" message
   - API endpoints `GET /api/receipts` and `GET /api/receipts/:id` return 503 Service Unavailable

2. **Receipt Ingestion Continues:**
   - Webhook endpoints (`POST /v1/webhooks/square`) continue to work
   - Receipt creation still occurs and is logged
   - `receipt_created` events are still logged
   - Simulated purchases still create receipts

3. **Admin Access:**
   - Bank admin console (`/bank-admin`) remains accessible
   - Dashboard shows current kill switch state
   - Kill switch can be toggled on/off

### When Kill Switch is OFF (enabled = false)

- All functionality operates normally
- Customers can view receipts
- Receipt ingestion continues as normal

## Implementation

### Storage

Kill switch status is stored in:
- **Primary:** `bank_settings` table (key: `kill_switch`, value: `{"enabled": true/false}`)
- **Fallback:** Environment variable `KILL_SWITCH_ENABLED=true/false`

### API Endpoints

**Check Kill Switch:**
```
GET /api/bank-admin/kill-switch
```

**Update Kill Switch:**
```
PUT /api/bank-admin/kill-switch
Body: { "enabled": true/false }
```

**Protected Endpoints (blocked when kill switch ON):**
- `GET /api/receipts` - Returns 503 if kill switch enabled
- `GET /api/receipts/:id` - Returns 503 if kill switch enabled

**Unprotected Endpoints (always work):**
- `POST /v1/webhooks/square` - Receipt ingestion continues
- `POST /api/demo/create-sale` - Simulated purchases continue
- All `/api/bank-admin/*` endpoints - Admin access always available

### Frontend Behavior

The customer-facing receipt pages check kill switch status on load:
1. Call `GET /api/bank-admin/kill-switch` (no auth required for public check)
2. If enabled, show "Receipts Unavailable" message
3. If disabled, fetch and display receipts normally

## Testing

### Test Kill Switch Toggle

1. **Enable Kill Switch:**
   ```bash
   curl -X PUT http://localhost:4000/api/bank-admin/kill-switch \
     -H "Content-Type: application/json" \
     -d '{"enabled": true}'
   ```

2. **Verify Customer UI:**
   - Visit `http://localhost:3000/receipts`
   - Should see "Receipts Unavailable" message

3. **Verify Receipt Ingestion Still Works:**
   - Create a simulated purchase via `/demo-store`
   - Receipt should still be created in database
   - Check Supabase `receipts` table

4. **Disable Kill Switch:**
   ```bash
   curl -X PUT http://localhost:4000/api/bank-admin/kill-switch \
     -H "Content-Type: application/json" \
     -d '{"enabled": false}'
   ```

5. **Verify Customer UI:**
   - Refresh `http://localhost:3000/receipts`
   - Should now show receipts normally

### Verify Admin Dashboard

1. Visit `http://localhost:3000/bank-admin`
2. Kill switch toggle should reflect current state
3. Toggle should update immediately

## Database Schema

The `bank_settings` table structure:
```sql
CREATE TABLE bank_settings (
  id UUID PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

Default kill switch entry:
```json
{
  "key": "kill_switch",
  "value": {"enabled": false},
  "description": "Master kill switch to disable all ProofPay functionality"
}
```

## Security Considerations

1. **Public Kill Switch Check:**
   - `GET /api/bank-admin/kill-switch` is publicly accessible (no auth)
   - This is intentional - customers need to check status
   - Only the toggle endpoint requires admin auth

2. **Fail-Open Behavior:**
   - If kill switch check fails (DB error, etc.), system assumes operational
   - This prevents accidental service disruption

3. **Admin Authentication:**
   - Kill switch toggle requires admin authentication
   - See `BANK_ADMIN_SETUP.md` for auth details

## Future Enhancements

- Add kill switch status to API health endpoint
- Add kill switch status indicator to customer UI header
- Add scheduled kill switch (time-based enable/disable)
- Add kill switch audit logging
- Add granular kill switch controls (disable specific features)

