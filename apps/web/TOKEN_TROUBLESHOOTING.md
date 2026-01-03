# 🔍 Square Token Troubleshooting

## Current Issue

The Square access token is still showing as invalid after multiple attempts.

## Token Details

- **Token Length**: 64 characters ✅
- **Environment**: sandbox ✅
- **Location ID**: LNA1P32A2G8MH ✅
- **Status**: ❌ Authentication Error

## Possible Causes

### 1. Token Not Activated
- The token might need to be activated in the Square Developer Dashboard
- Check if there are any pending activation steps

### 2. Application Not Active
- Your Square application might be suspended or inactive
- Check the application status in the dashboard

### 3. Missing Permissions/Scopes
- The token might not have the required OAuth scopes
- Required scopes:
  - `ORDERS_WRITE`
  - `PAYMENTS_WRITE`
  - `ORDERS_READ`
  - `PAYMENTS_READ`
  - `LOCATIONS_READ`

### 4. Token Format Issue
- There might be hidden characters or encoding issues
- Try copying the token directly from the dashboard (not from a saved file)

### 5. Wrong Application
- Make sure you're using the token from the correct Square application
- Verify the application ID matches

## Step-by-Step Fix

### Step 1: Verify Token in Square Dashboard

1. Go to: https://developer.squareup.com/apps
2. Sign in
3. Select your application
4. Go to **Credentials** → **Sandbox**
5. Look for any warnings or errors
6. Check if the token shows as "Active"

### Step 2: Check Application Status

1. In the Square Developer Dashboard
2. Check the application overview page
3. Look for any status indicators (Active, Suspended, etc.)
4. If suspended, follow the instructions to reactivate

### Step 3: Verify OAuth Scopes

1. Go to **OAuth** → **Scopes** in your application
2. Ensure these scopes are checked:
   - ✅ `ORDERS_WRITE`
   - ✅ `PAYMENTS_WRITE`
   - ✅ `ORDERS_READ`
   - ✅ `PAYMENTS_READ`
   - ✅ `LOCATIONS_READ`

### Step 4: Generate Fresh Token

1. In **Credentials** → **Sandbox**
2. Click **Revoke** on the current token
3. Wait a few seconds
4. Click **Generate** to create a new token
5. **Immediately copy** the token (it's only shown once)
6. Make sure you copy the **entire** token (64 characters)

### Step 5: Test Token Manually

You can test the token directly using curl:

```bash
curl -X GET \
  'https://connect.squareupsandbox.com/v2/locations' \
  -H 'Square-Version: 2024-01-18' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

Replace `YOUR_TOKEN_HERE` with your actual token.

If this returns a 401 error, the token is definitely invalid.

## Alternative: Use API Token

If the web app token continues to fail, you can try using the same token that works in `apps/api/.env`:

1. Check if `apps/api/.env` has a working `SQUARE_ACCESS_TOKEN`
2. If it works there, copy that token to `apps/web/.env.local`
3. This will help determine if it's a token issue or a configuration issue

## Next Steps

1. **Verify the token is active** in Square Developer Dashboard
2. **Check application status** - make sure it's not suspended
3. **Verify OAuth scopes** are enabled
4. **Generate a completely new token** if needed
5. **Test the token manually** using curl to confirm it works

If the token still fails after all these steps, there may be an issue with your Square Developer account or application setup that needs to be resolved through Square support.

