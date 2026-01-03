# 🔍 Finding Square Permissions/Scopes

## Different Locations to Check

OAuth scopes might be in different places depending on your Square application type. Here are all the places to check:

### Location 1: Application Settings → OAuth

1. Go to: https://developer.squareup.com/apps
2. Click on your application
3. Look in the left sidebar for:
   - **"Settings"** → **"OAuth"**
   - **"Configuration"** → **"OAuth"**
   - **"OAuth Settings"**

### Location 2: Application Overview → Permissions

1. In your application dashboard
2. Look for tabs at the top:
   - **"Overview"**
   - **"Credentials"**
   - **"Permissions"** ← Check here!
   - **"Webhooks"**
   - **"OAuth"**

### Location 3: Credentials Page

1. Go to **Credentials** → **Sandbox**
2. Look for a link or button that says:
   - **"Manage Permissions"**
   - **"OAuth Scopes"**
   - **"API Permissions"**
   - **"Application Permissions"**

### Location 4: Application Type Matters

Square has different application types:

#### **OAuth Application** (uses scopes)
- If you created an "OAuth" application
- Scopes should be in **OAuth** → **Scopes**

#### **API Application** (might not use scopes)
- If you created an "API" application
- Permissions might be automatic or in a different location
- Check **Settings** → **API Permissions**

#### **Sandbox Application** (simpler permissions)
- Sandbox applications might have all permissions enabled by default
- Check if your token works without configuring scopes

## Alternative: Check Token Permissions Directly

Instead of looking for scopes, you can test what your token can actually do:

### Test 1: Try Creating an Order

```bash
cd apps/web
node -e "require('dotenv').config({ path: '.env.local' }); const { SquareClient, SquareEnvironment } = require('square'); const client = new SquareClient({ accessToken: process.env.SQUARE_ACCESS_TOKEN, environment: SquareEnvironment.Sandbox }); client.orders.create({ idempotencyKey: 'test', order: { locationId: process.env.SQUARE_LOCATION_ID, lineItems: [] } }).then(r => console.log('✅ Orders work!')).catch(e => console.log('❌ Orders error:', e.errors?.[0]?.code || e.message));"
```

### Test 2: Check What Permissions Your Token Has

Square might show token permissions in:
- **Credentials** → **Sandbox** → Click on your token → **"View Permissions"**
- Or hover over the token to see a tooltip

## If You Can't Find OAuth Scopes

### Option 1: Sandbox Tokens Might Have All Permissions

For **Sandbox** (testing) tokens, Square might grant all permissions by default. The authentication error might be due to:
- Invalid/expired token (not permissions)
- Wrong environment setting
- Token format issue

### Option 2: Check Application Type

1. In your application dashboard
2. Look at the application **type** or **category**
3. Different types have different permission models:
   - **OAuth App** → Uses scopes
   - **API App** → Might use different permissions
   - **Sandbox App** → Might have default permissions

### Option 3: Create a New Application

If you can't find permissions, try:
1. Create a **new** Square application
2. Choose **"OAuth"** as the application type
3. This should show OAuth scopes clearly

### Option 4: Contact Square Support

If you still can't find it:
1. Go to: https://developer.squareup.com/support
2. Ask: "Where do I configure OAuth scopes for my application?"
3. They can guide you to the exact location

## Quick Check: Is It Really a Permissions Issue?

The authentication error might NOT be about scopes. Let's verify:

### Test Your Token

Run this to see the exact error:

```bash
cd apps/web
npm run verify-token
```

If you see:
- **"Token is invalid"** → Token issue, not permissions
- **"UNAUTHORIZED"** → Could be permissions OR invalid token
- **"Token is VALID!"** → Permissions are fine!

## What to Look For in Dashboard

When you're in the Square Developer Dashboard, look for:

1. **Left Sidebar Menu Items:**
   - OAuth
   - Permissions
   - API Settings
   - Application Settings
   - Configuration

2. **Top Tabs:**
   - Overview
   - Credentials
   - Permissions ← Check here!
   - Webhooks
   - OAuth

3. **Buttons/Links:**
   - "Manage Permissions"
   - "OAuth Scopes"
   - "API Permissions"
   - "Edit Scopes"

4. **Token Details:**
   - Click on your access token
   - Look for "Permissions" or "Scopes" section
   - Might show what permissions the token has

## Screenshot Checklist

If you can take a screenshot, look for:
- [ ] Left sidebar with menu items
- [ ] Top navigation tabs
- [ ] Any section labeled "Permissions", "OAuth", or "Scopes"
- [ ] Token details page (when you click on a token)

## Next Steps

1. **Check all locations** listed above
2. **Test your token** to see if it's actually a permissions issue
3. **Try creating a new OAuth application** if you can't find scopes
4. **Contact Square support** if still stuck

The authentication error might be due to an invalid token rather than missing permissions!

