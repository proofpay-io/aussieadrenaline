# Database Migrations

This directory contains SQL migration files for creating and updating the Supabase database schema.

## Running Migrations

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `001_create_receipts_tables.sql`
5. Click **Run** to execute the migration
6. Verify tables were created by going to **Table Editor**

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
supabase db push
```

### Option 3: Using the API (Programmatic)

You can also run migrations programmatically through the API, but the Supabase Dashboard is the recommended approach for initial setup.

## Migration Files

- `001_create_receipts_tables.sql` - Creates the receipts and receipt_items tables with all necessary indexes, triggers, and RLS policies.
- `002_add_simulation_fields.sql` - Adds optional fields for simulated receipts (source, merchant_name, purchase_time).
- `003_add_audit_and_disputes_tables.sql` - Creates receipt_events, disputes, and dispute_items tables for auditability and dispute management.
- `004_add_dispute_total_amount.sql` - Adds total_amount_cents field to disputes table for easy viewing of disputed amounts.
- `005_add_bank_settings.sql` - Creates bank_settings table for admin controls (kill switch, etc.).
- `006_add_confidence_fields.sql` - Adds confidence scoring fields (confidence_score, confidence_label, confidence_reasons) to receipts table. For simulated receipts, sets defaults: confidence_score 92-99 (random), confidence_label "HIGH", confidence_reasons ["SOURCE_POS", "TOTAL_EXACT", "TIME_EXACT"]. Backfills existing receipts with HIGH confidence.
- `007_add_confidence_threshold.sql` - Adds confidence threshold setting to bank_settings table (default: 85).
- `008_update_receipt_events_check.sql` - Updates receipt_events check constraint to include receipt_view_blocked event type.

## Table Structure

### receipts
- `id` (UUID, Primary Key) - Auto-generated unique identifier
- `payment_id` (TEXT, Unique) - External payment identifier
- `amount` (NUMERIC) - Payment amount (2 decimal places)
- `currency` (TEXT) - Currency code (default: 'USD')
- `created_at` (TIMESTAMP) - Record creation timestamp
- `updated_at` (TIMESTAMP) - Record last update timestamp

### receipt_items
- `id` (UUID, Primary Key) - Auto-generated unique identifier
- `receipt_id` (UUID, Foreign Key) - References receipts.id
- `item_name` (TEXT) - Name/description of the item
- `item_price` (NUMERIC) - Price per item (2 decimal places)
- `quantity` (INTEGER) - Quantity of items (default: 1)
- `created_at` (TIMESTAMP) - Record creation timestamp
- `updated_at` (TIMESTAMP) - Record last update timestamp

### receipt_events (Migration 003)
- `id` (UUID, Primary Key) - Auto-generated unique identifier
- `created_at` (TIMESTAMP) - Event timestamp
- `event_type` (TEXT) - Type: `receipt_created`, `receipt_viewed`, `dispute_created`
- `receipt_id` (UUID, Foreign Key, Nullable) - References receipts.id
- `metadata` (JSONB) - Additional event data

### disputes (Migration 003)
- `id` (UUID, Primary Key) - Auto-generated unique identifier
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp
- `receipt_id` (UUID, Foreign Key) - References receipts.id
- `status` (TEXT) - Status: `submitted`, `in_review`, `resolved`, `rejected`
- `reason_code` (TEXT) - Reason code for the dispute
- `notes` (TEXT, Nullable) - Optional notes

### dispute_items (Migration 003)
- `id` (UUID, Primary Key) - Auto-generated unique identifier
- `dispute_id` (UUID, Foreign Key) - References disputes.id
- `receipt_item_id` (UUID, Foreign Key) - References receipt_items.id
- `quantity` (NUMERIC) - Quantity being disputed
- `amount_cents` (INTEGER, Nullable) - Disputed amount in cents

## Verification

After running the migration, verify the tables exist:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see both `receipts` and `receipt_items` tables
3. Check that the columns match the structure above
4. Verify foreign key relationship between receipt_items.receipt_id and receipts.id

