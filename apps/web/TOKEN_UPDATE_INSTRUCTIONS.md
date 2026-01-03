# ⚠️ Token Still Invalid

## Current Status

The Square access token you provided is still showing as invalid when verified.

## Possible Issues

1. **Token Format**: The token might have extra spaces or characters
2. **Token Expired**: The token may have expired or been revoked
3. **Wrong Environment**: The token might be for Production instead of Sandbox
4. **Missing Permissions**: The token might not have the required scopes

## Manual Update Steps

Since the token verification is still failing, please manually update the token:

### Step 1: Open `.env.local`

Open the file: `apps/web/.env.local`

### Step 2: Update the Token

Make sure the file contains exactly:

```env
SQUARE_ACCESS_TOKEN=EAAAl9i9lm_bXoTLiGOjieXY7utChHfQqQ51bbz104oROWoAoByp4fDwxhFxsIQi
SQUARE_LOCATION_ID=LNA1P32A2G8MH
SQUARE_ENVIRONMENT=sandbox
```

**Important:**
- No spaces around the `=` sign
- No quotes around the token
- No trailing spaces
- Make sure there's a newline at the end of the file

### Step 3: Verify Token in Square Dashboard

1. Go to: https://developer.squareup.com/apps
2. Select your application
3. Go to **Credentials** → **Sandbox**
4. Click **Show** next to the Access Token
5. Copy the **entire** token (it should be 64 characters)
6. Make sure you're copying from the **Sandbox** tab, not Production

### Step 4: Check Token Permissions

In Square Developer Dashboard:
1. Go to **OAuth** → **Scopes**
2. Ensure these scopes are enabled:
   - ✅ `ORDERS_WRITE`
   - ✅ `PAYMENTS_WRITE`
   - ✅ `ORDERS_READ`
   - ✅ `PAYMENTS_READ`

### Step 5: Generate a New Token (if needed)

If the token is still invalid:
1. In Square Developer Dashboard, go to **Credentials** → **Sandbox**
2. Click **Revoke** next to the current token
3. Click **Generate** to create a new token
4. Copy the new token immediately (it's only shown once)
5. Update `.env.local` with the new token

### Step 6: Restart Server

After updating:
```bash
cd apps/web
npm run dev
```

### Step 7: Verify Again

```bash
cd apps/web
npm run verify-token
```

You should see: **✅ Token is VALID!**

## If Token Still Fails

If the token is still invalid after these steps:
1. Double-check you're using a **Sandbox** token (not Production)
2. Verify the token hasn't been revoked in the dashboard
3. Check that your Square application is **active** (not suspended)
4. Try generating a completely new token

