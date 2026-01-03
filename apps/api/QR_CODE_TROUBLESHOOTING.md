# QR Code Troubleshooting Guide

## Error: "Failed to generate share token"

This error typically occurs when the database tables required for QR code functionality haven't been created yet.

### Solution: Run Required Migrations

You need to run the following migrations in Supabase:

1. **Migration 012**: Creates the `receipt_shares` table
   - File: `apps/api/migrations/012_add_receipt_shares.sql`
   - Instructions: `apps/api/migrations/RUN_MIGRATION_012.md`

2. **Migration 014**: Adds verification status columns
   - File: `apps/api/migrations/014_add_verification_status.sql`
   - Instructions: `apps/api/migrations/RUN_MIGRATION_014.md`

### Quick Steps:

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run Migration 012:
   - Copy contents of `012_add_receipt_shares.sql`
   - Paste into SQL Editor
   - Click **Run**
4. Run Migration 014:
   - Copy contents of `014_add_verification_status.sql`
   - Paste into SQL Editor
   - Click **Run**

### Verify Tables Exist:

Run this query in Supabase SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'receipt_shares';
```

If the query returns a row, the table exists. If not, run the migrations.

### Check Table Structure:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'receipt_shares'
ORDER BY ordinal_position;
```

You should see these columns:
- `id` (uuid)
- `receipt_id` (uuid)
- `token` (text)
- `created_at` (timestamptz)
- `expires_at` (timestamptz, nullable)
- `view_count` (integer)
- `status` (text) - from migration 014
- `verified_at` (timestamptz, nullable) - from migration 014
- `verified_by` (text, nullable) - from migration 014
- `verification_attempts` (integer) - from migration 014

### Common Error Messages:

1. **"Database table receipt_shares does not exist"**
   - Solution: Run migration 012

2. **"column 'status' does not exist"**
   - Solution: Run migration 014

3. **"relation 'receipt_shares' does not exist"**
   - Solution: Run migration 012

### After Running Migrations:

1. Refresh the receipt detail page
2. The QR code should generate automatically
3. If you still see an error, check the browser console for the specific error message

### Testing:

After running migrations, you can test the endpoint directly:

```bash
curl -X POST http://localhost:4000/api/receipts/[RECEIPT_ID]/share
```

Replace `[RECEIPT_ID]` with an actual receipt ID from your database.

