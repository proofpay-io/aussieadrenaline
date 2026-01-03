# How to Run Migration 018: Add QR Verification Settings

This migration adds QR verification settings to the `bank_settings` table.

## Steps

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `018_add_qr_verification_settings.sql`
4. Paste into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)
6. Verify the migration succeeded:
   - Check that no errors were returned
   - Verify the settings exist by running:
     ```sql
     SELECT key, value FROM bank_settings 
     WHERE key IN ('enable_qr_verification', 'qr_single_use_enabled', 'qr_token_expiry_minutes');
     ```

## Expected Result

You should see three new rows in `bank_settings`:
- `enable_qr_verification` with value `{"enabled": true}`
- `qr_single_use_enabled` with value `{"enabled": false}`
- `qr_token_expiry_minutes` with value `{"minutes": null}`

## Notes

- Default values:
  - QR verification: **enabled** (true)
  - Single-use tokens: **disabled** (false)
  - Token expiry: **never** (null)
- These settings can be changed via the Bank Admin Console UI
- Changes are logged as `policy_updated` events

