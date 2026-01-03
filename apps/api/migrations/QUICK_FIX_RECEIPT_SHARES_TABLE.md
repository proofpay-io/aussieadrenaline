# Quick Fix: Missing receipt_shares Table

## Error
```
Failed to create share token: Could not find the table 'public.receipt_shares' in the schema cache
```

## Solution

You need to run **3 migrations** in Supabase to enable QR code sharing:

1. **Migration 012** - Creates the `receipt_shares` table
2. **Migration 014** - Adds verification status fields (status, verified_at, verified_by, verification_attempts)
3. **Migration 015** - Adds refund status fields to receipts table (refunded, refunded_at, refund_amount)

## Steps

### 1. Open Supabase SQL Editor

1. Go to https://app.supabase.com
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### 2. Run Migration 012

Copy and paste this SQL:

```sql
-- Migration 012: Add receipt_shares table for QR code verification tokens
CREATE TABLE IF NOT EXISTS receipt_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id UUID NOT NULL REFERENCES receipts(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0 NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_receipt_shares_receipt_id ON receipt_shares(receipt_id);
CREATE INDEX IF NOT EXISTS idx_receipt_shares_token ON receipt_shares(token);
CREATE INDEX IF NOT EXISTS idx_receipt_shares_expires_at ON receipt_shares(expires_at);

-- Enable Row Level Security (RLS)
ALTER TABLE receipt_shares ENABLE ROW LEVEL SECURITY;

-- Policy for service role to manage receipt_shares
CREATE POLICY "Service role can manage receipt_shares" ON receipt_shares
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

Click **Run**.

### 3. Run Migration 014

Copy and paste this SQL:

```sql
-- Migration 014: Add verification status fields to receipt_shares table
ALTER TABLE receipt_shares
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'verified', 'used', 'voided', 'expired'));

ALTER TABLE receipt_shares
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE receipt_shares
ADD COLUMN IF NOT EXISTS verified_by TEXT;

ALTER TABLE receipt_shares
ADD COLUMN IF NOT EXISTS verification_attempts INTEGER NOT NULL DEFAULT 0;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_receipt_shares_status ON receipt_shares(status);
CREATE INDEX IF NOT EXISTS idx_receipt_shares_verified_at ON receipt_shares(verified_at);
```

Click **Run**.

### 4. Run Migration 015

Copy and paste this SQL:

```sql
-- Migration 015: Add refund status fields to receipts table
ALTER TABLE receipts
ADD COLUMN IF NOT EXISTS refunded BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE receipts
ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE receipts
ADD COLUMN IF NOT EXISTS refund_amount NUMERIC(10, 2);

-- Add index for faster queries on refunded status
CREATE INDEX IF NOT EXISTS idx_receipts_refunded ON receipts(refunded);
```

Click **Run**.

### 5. Verify

Run this query to verify the table exists:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'receipt_shares'
ORDER BY ordinal_position;
```

You should see these columns:
- `id` (uuid)
- `receipt_id` (uuid)
- `token` (text)
- `created_at` (timestamp with time zone)
- `expires_at` (timestamp with time zone, nullable)
- `view_count` (integer)
- `status` (text)
- `verified_at` (timestamp with time zone, nullable)
- `verified_by` (text, nullable)
- `verification_attempts` (integer)

## After Running Migrations

1. Refresh your receipt detail page
2. Try generating the QR code again
3. It should work now!

## Notes

- These migrations are safe to run multiple times (they use `IF NOT EXISTS` and `ADD COLUMN IF NOT EXISTS`)
- The `status` column defaults to `'active'` for new shares
- The `refunded` column defaults to `FALSE` for existing receipts

