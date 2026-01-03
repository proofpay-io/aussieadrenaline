# Square Authentication Error Fix

## Error Message
```
❌ Error: This request could not be authorized.
```

## Possible Causes

1. **Invalid or Expired Access Token**
   - The Square access token in `.env.local` may be incorrect or expired
   - Check your Square Developer Dashboard for the current token

2. **Missing Permissions/Scopes**
   - The token may not have the required permissions for creating orders and payments
   - Required scopes: `ORDERS_WRITE`, `PAYMENTS_WRITE`

3. **Environment Mismatch**
   - Token is for production but environment is set to sandbox (or vice versa)
   - Verify `SQUARE_ENVIRONMENT=sandbox` matches your token type

## How to Fix

### Step 1: Verify Your Square Access Token

1. Go to: https://developer.squareup.com/apps
2. Sign in to your Square Developer account
3. Select your application
4. Go to **Credentials** → **Sandbox**
5. Copy the **Access Token**
6. Verify it matches the token in `apps/web/.env.local`

### Step 2: Check Token Permissions

1. In Square Developer Dashboard, go to **OAuth** → **Scopes**
2. Ensure these scopes are enabled:
   - ✅ `ORDERS_WRITE` - Required for creating orders
   - ✅ `PAYMENTS_WRITE` - Required for creating payments
   - ✅ `ORDERS_READ` - Required for reading orders
   - ✅ `PAYMENTS_READ` - Required for reading payments

### Step 3: Update `.env.local`

Make sure `apps/web/.env.local` contains:

```env
SQUARE_ACCESS_TOKEN=your_sandbox_access_token_here
SQUARE_LOCATION_ID=LNA1P32A2G8MH
SQUARE_ENVIRONMENT=sandbox
```

### Step 4: Restart Next.js Server

After updating the token:
1. Stop the Next.js dev server (Ctrl+C)
2. Restart it: `cd apps/web && npm run dev`
3. Try generating a sandbox sale again

## Verify Token Works

You can test if your token is valid by running:

```bash
cd apps/web
node -e "require('dotenv').config({ path: '.env.local' }); const { SquareClient, SquareEnvironment } = require('square'); const client = new SquareClient({ accessToken: process.env.SQUARE_ACCESS_TOKEN, environment: SquareEnvironment.Sandbox }); client.locationsApi.listLocations().then(r => console.log('✅ Token is valid! Locations:', r.result.locations?.length || 0)).catch(e => console.log('❌ Token error:', e.errors?.[0]?.detail || e.message));"
```

If this succeeds, your token is valid. If it fails, you need to get a new token from Square.

## Still Having Issues?

1. **Check Square Developer Dashboard** for any warnings or errors
2. **Verify the token hasn't been revoked** - Generate a new one if needed
3. **Ensure you're using a Sandbox token** (starts with `EAAA...` or `sandbox-...`)
4. **Check that your Square application is active** in the dashboard

