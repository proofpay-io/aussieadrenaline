# 🔍 Where to Find Square OAuth Scopes

## Important: Sandbox Tokens Might Not Need Scopes!

For **Sandbox** (testing) tokens, Square often grants **all permissions by default**. The authentication error you're seeing might **NOT** be about missing scopes - it could be an invalid token.

## Where to Look for OAuth Scopes

### Location 1: OAuth Tab (Left Sidebar)

1. Go to: https://developer.squareup.com/apps
2. Click on your application
3. In the **left sidebar**, look for **"OAuth"**
4. Click on it
5. You should see:
   - **Redirect URL** settings
   - **Permissions** or **Scopes** section

If you see the OAuth page but no permissions/scopes, it might mean:
- Your application type doesn't use OAuth scopes
- Sandbox tokens have all permissions by default
- You need to be the account owner to see/edit scopes

### Location 2: Top Navigation Tabs

When you're in your application, look at the **top tabs**:
- Overview
- Credentials
- **Permissions** ← Check here!
- Webhooks
- OAuth

### Location 3: Application Type Matters

Square has different application types:

#### If you created an "OAuth Application":
- Should have OAuth tab with scopes
- If you don't see scopes, you might not be the account owner

#### If you created an "API Application":
- Might not use OAuth scopes
- Permissions might be automatic
- Check **Settings** → **API Permissions**

#### If you're using Sandbox:
- **Sandbox tokens often have ALL permissions by default**
- You might not need to configure scopes at all!

## The Real Question: Is It Actually a Permissions Issue?

Let's test if your token works despite the error. The authentication error might be because:
1. **Token is invalid/expired** (most likely)
2. **Wrong environment** (using production token in sandbox)
3. **Token format issue** (extra spaces, wrong copy)

## Test Your Token Directly

Instead of looking for scopes, let's test if your token actually works:

### Quick Test Script

I'll create a test script that tries different Square API calls to see what works.

## If You Can't Find Scopes

### Option 1: Sandbox Tokens Have All Permissions

For **Sandbox testing**, Square often grants all permissions automatically. The authentication error is likely because:
- The token is invalid/expired
- The token format is wrong
- You're using the wrong environment

**Solution**: Generate a fresh token and make sure it's copied correctly.

### Option 2: Check Your Account Permissions

Only the **account owner** or **administrators** can see/edit OAuth scopes. If you're not the owner:
- Ask the account owner to check/configure scopes
- Or ask them to make you an administrator

### Option 3: Create a New OAuth Application

1. Create a **new** application
2. Choose **"OAuth"** as the type
3. This should clearly show OAuth scopes

### Option 4: The Token Might Just Be Invalid

The most likely issue is that your token is simply **invalid or expired**, not that it's missing permissions. Try:
1. Generate a **completely new** token
2. Make sure you copy it **exactly** (no extra spaces)
3. Test it again

## What to Do Right Now

1. **Don't worry about scopes yet** - test if your token is valid first
2. **Generate a fresh token** from Square Dashboard
3. **Update your `.env.local`** with the new token
4. **Test it** with `npm run verify-token`

If the token is valid, it should work even without explicitly configuring scopes (for sandbox).

## Summary

- OAuth scopes might be in: **OAuth tab** → **Permissions/Scopes section**
- **Sandbox tokens often have all permissions by default**
- The authentication error is **more likely** an invalid token than missing permissions
- **Test your token first** before worrying about scopes

Let's focus on getting a valid token first, then we can check permissions if needed!

