# 📚 Square OAuth Scopes - Complete Guide

## What Are OAuth Scopes?

**OAuth scopes** are permissions that define what your application can do with the Square API. Think of them as a list of "permissions" your app requests from Square.

When you create an access token, it only has the permissions (scopes) that you've enabled in your Square Developer Dashboard. If your token tries to do something that requires a scope you haven't enabled, Square will return an authentication error.

## Why This Matters

If your access token doesn't have the required scopes, you'll get errors like:
- `❌ Error: This request could not be authorized`
- `401 UNAUTHORIZED`
- `AUTHENTICATION_ERROR`

Even if your token is valid, it won't work if it doesn't have the right permissions!

## Required Scopes for ProofPay

For the demo store to work, your Square access token needs these scopes:

### 1. `ORDERS_WRITE`
- **What it does**: Allows your app to create and update orders
- **Why you need it**: The demo store creates Square Orders when you click "Generate Sandbox Sale"
- **Without it**: You'll get an error when trying to create orders

### 2. `PAYMENTS_WRITE`
- **What it does**: Allows your app to create payments
- **Why you need it**: The demo store creates Square Payments for each sale
- **Without it**: You'll get an error when trying to create payments

### 3. `ORDERS_READ`
- **What it does**: Allows your app to read/retrieve order information
- **Why you need it**: The webhook handler fetches order details to get line items
- **Without it**: You can create orders but can't read their details

### 4. `PAYMENTS_READ`
- **What it does**: Allows your app to read payment information
- **Why you need it**: The webhook handler fetches payment details
- **Without it**: You can create payments but can't read their details

### 5. `LOCATIONS_READ`
- **What it does**: Allows your app to read location information
- **Why you need it**: The app needs to verify your location ID is valid
- **Without it**: You might get errors when verifying your location

## How to Check and Enable OAuth Scopes

### Step 1: Go to Your Square Application

1. Visit: https://developer.squareup.com/apps
2. Sign in to your Square Developer account
3. Click on your application (or create one if you don't have one)

### Step 2: Navigate to OAuth Settings

1. In the left sidebar, look for **"OAuth"** or **"Permissions"**
2. Click on it to expand
3. Click on **"Scopes"** or **"OAuth Scopes"**

You should see a page that looks like this:

```
OAuth Scopes
─────────────

☐ ORDERS_WRITE          - Create and update orders
☐ PAYMENTS_WRITE        - Create payments
☐ ORDERS_READ           - Read order information
☐ PAYMENTS_READ         - Read payment information
☐ LOCATIONS_READ        - Read location information
... (many more scopes)
```

### Step 3: Enable Required Scopes

1. Find each of the required scopes in the list
2. Check the box next to each one:
   - ✅ `ORDERS_WRITE`
   - ✅ `PAYMENTS_WRITE`
   - ✅ `ORDERS_READ`
   - ✅ `PAYMENTS_READ`
   - ✅ `LOCATIONS_READ`

3. Click **"Save"** or **"Update"** at the bottom of the page

### Step 4: Regenerate Your Access Token

**IMPORTANT**: After enabling scopes, you MUST generate a new access token!

Old tokens don't automatically get the new permissions. You need to:

1. Go to **Credentials** → **Sandbox**
2. Click **"Revoke"** next to your current access token
3. Wait a few seconds
4. Click **"Generate"** to create a new token
5. **Immediately copy** the new token (it's only shown once!)
6. Update your `.env.local` file with the new token

## Visual Guide

Here's what the OAuth Scopes page typically looks like:

```
┌─────────────────────────────────────────────────┐
│ Square Developer Dashboard                       │
├─────────────────────────────────────────────────┤
│                                                  │
│  OAuth Scopes                                    │
│  ───────────                                     │
│                                                  │
│  ☑ ORDERS_WRITE                                  │
│     Create and update orders                     │
│                                                  │
│  ☑ PAYMENTS_WRITE                                │
│     Create payments                              │
│                                                  │
│  ☑ ORDERS_READ                                   │
│     Read order information                       │
│                                                  │
│  ☑ PAYMENTS_READ                                 │
│     Read payment information                     │
│                                                  │
│  ☑ LOCATIONS_READ                                │
│     Read location information                    │
│                                                  │
│  ☐ INVENTORY_READ                                │
│  ☐ CUSTOMERS_READ                                │
│  ... (more scopes)                               │
│                                                  │
│  [Save Changes]                                  │
└─────────────────────────────────────────────────┘
```

## Common Issues

### Issue 1: "I enabled the scopes but it still doesn't work"

**Solution**: You need to generate a NEW access token after enabling scopes. Old tokens don't get the new permissions automatically.

### Issue 2: "I can't find the OAuth Scopes page"

**Possible locations**:
- Left sidebar: **OAuth** → **Scopes**
- Left sidebar: **Permissions** → **OAuth Scopes**
- Settings: **OAuth Settings** → **Scopes**
- Application Settings: **OAuth** tab

If you still can't find it, your Square application might be using a different permission model. Check Square's documentation for your application type.

### Issue 3: "Some scopes are grayed out or disabled"

**Possible reasons**:
- Your Square account type doesn't support those scopes
- You need to upgrade your Square Developer account
- The scopes require additional verification

Contact Square support if you need help with this.

## Testing Your Scopes

After enabling scopes and generating a new token, test it:

```bash
cd apps/web
npm run verify-token
```

If the token is valid AND has the right scopes, you should see:
```
✅ Token is VALID!
📍 Found X location(s):
   - Location Name (Location ID)
      ✅ This matches your SQUARE_LOCATION_ID
```

## Summary

1. **OAuth scopes = permissions** for your Square access token
2. **Enable 5 required scopes**: ORDERS_WRITE, PAYMENTS_WRITE, ORDERS_READ, PAYMENTS_READ, LOCATIONS_READ
3. **Generate a NEW token** after enabling scopes (old tokens don't get new permissions)
4. **Update your `.env.local`** with the new token
5. **Test the token** to verify it works

Without the right scopes, your token will be rejected even if it's technically valid!

