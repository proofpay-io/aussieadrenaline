# Bank Admin Console Setup

## Overview

The Bank Admin Console provides three pages for managing ProofPay:
- **Dashboard** (`/bank-admin`) - Metrics and kill switch
- **Usage** (`/bank-admin/usage`) - Event log with filters and CSV export
- **Disputes** (`/bank-admin/disputes`) - Dispute management

## Prerequisites

### 1. Run Migrations

**Migration 003** - Creates `receipt_events`, `disputes`, `dispute_items` tables:
```bash
# Run in Supabase SQL Editor
apps/api/migrations/003_add_audit_and_disputes_tables.sql
```

**Migration 004** - Adds `total_amount_cents` to disputes:
```bash
# Run in Supabase SQL Editor
apps/api/migrations/004_add_dispute_total_amount.sql
```

**Migration 005** - Creates `bank_settings` table for kill switch:
```bash
# Run in Supabase SQL Editor
apps/api/migrations/005_add_bank_settings.sql
```

### 2. Environment Variables (Optional)

For production, set authentication secret:
```bash
# In apps/api/.env
BANK_ADMIN_SECRET=your-secure-secret-here

# In apps/web/.env.local (if needed)
NEXT_PUBLIC_BANK_ADMIN_SECRET=your-secure-secret-here
```

**Note:** In development, authentication is disabled by default.

## Accessing the Admin Console

### Development (No Auth Required)
```
http://localhost:3000/bank-admin
```

### Production (With Auth)
```
https://your-domain.com/bank-admin?secret=your-secure-secret-here
```

Or set `BANK_ADMIN_SECRET` environment variable and use header:
```
X-Bank-Admin-Secret: your-secure-secret-here
```

## Pages

### 1. Dashboard (`/bank-admin`)

**Features:**
- Total receipts created (7/30 days)
- Total receipt views (7/30 days)
- Total disputes submitted (7/30 days)
- Daily metrics table (last 30 days)
- Kill switch toggle

**API Endpoint:**
- `GET /api/bank-admin/dashboard`
- `GET /api/bank-admin/kill-switch`
- `PUT /api/bank-admin/kill-switch`

### 2. Usage (`/bank-admin/usage`)

**Features:**
- Paginated list of receipt events
- Filters: event_type, start_date, end_date
- CSV export button
- Shows: date, event type, receipt ID, metadata

**API Endpoint:**
- `GET /api/bank-admin/usage?page=1&page_size=50&event_type=&start_date=&end_date=`

### 3. Disputes (`/bank-admin/disputes`)

**Features:**
- Paginated list of disputes
- Shows: created date, status, receipt ID, reason, item count, total amount
- Click "View Details" to see dispute items
- Dispute detail modal shows:
  - Dispute information
  - Receipt information
  - Disputed items list

**API Endpoints:**
- `GET /api/bank-admin/disputes?page=1&page_size=50`
- `GET /api/bank-admin/disputes/:id`

## Authentication (Prototype)

Current implementation uses simple secret-based auth:

1. **Query Parameter:** `?secret=your-secret`
2. **Header:** `X-Bank-Admin-Secret: your-secret`
3. **Environment Variable:** `BANK_ADMIN_SECRET`

**⚠️ Important:** This is a prototype. In production, replace with:
- Proper bank authentication system
- OAuth/SAML integration
- Role-based access control
- Session management

## Kill Switch

The kill switch allows disabling all ProofPay functionality:

1. **Storage:** Stored in `bank_settings` table (key: `kill_switch`)
2. **Fallback:** If table doesn't exist, uses `KILL_SWITCH_ENABLED` env var
3. **Toggle:** Available on dashboard page
4. **Future Use:** Can be checked by API endpoints to disable functionality

## CSV Export

The Usage page includes a CSV export feature:
- Exports current filtered view
- Includes: ID, Created At, Event Type, Receipt ID, Metadata
- Downloads as: `proofpay-events-YYYY-MM-DD.csv`

## Testing

### Test Dashboard
```bash
curl http://localhost:4000/api/bank-admin/dashboard
```

### Test Usage
```bash
curl "http://localhost:4000/api/bank-admin/usage?page=1&page_size=10"
```

### Test Disputes
```bash
curl http://localhost:4000/api/bank-admin/disputes?page=1
```

### Test Kill Switch
```bash
# Get status
curl http://localhost:4000/api/bank-admin/kill-switch

# Update status
curl -X PUT http://localhost:4000/api/bank-admin/kill-switch \
  -H "Content-Type: application/json" \
  -d '{"enabled": true}'
```

## Next Steps

1. ✅ Run migrations 003, 004, 005
2. ✅ Restart API server to register new routes
3. ✅ Visit `/bank-admin` in browser
4. ✅ Test all three pages
5. ✅ Verify CSV export works
6. ✅ Test kill switch toggle

## Production Considerations

- Replace prototype authentication with proper bank auth
- Add rate limiting to admin endpoints
- Add audit logging for admin actions
- Implement proper error handling
- Add monitoring and alerts
- Set up proper session management

