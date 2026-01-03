# ⚠️ Token Still Invalid - Troubleshooting Guide

## Current Situation

We've tried multiple Square access tokens and they're all showing as invalid. This suggests a deeper issue than just an expired token.

## Possible Root Causes

### 1. Square Application Status

Your Square application might be:
- **Inactive** or **Suspended**
- **Not approved** for API access
- **Missing required setup** steps

**Check this:**
1. Go to: https://developer.squareup.com/apps
2. Look at your application status
3. Check for any warnings or error messages
4. Verify the application shows as "Active"

### 2. Square Account Issues

Your Square Developer account might:
- Need verification
- Have restrictions
- Be missing required permissions

**Check this:**
1. Go to your Square Developer account settings
2. Look for any verification requirements
3. Check account status

### 3. Token Generation Issue

The tokens might not be generating correctly:
- Token might be getting truncated
- Copy/paste might be adding extra characters
- Token might need to be activated

**Try this:**
1. Generate a new token
2. Copy it **immediately** (don't wait)
3. Paste it into a text editor first to verify it's complete
4. Then copy from the text editor to `.env.local`

### 4. Environment Mismatch

Make sure:
- Token is from **Sandbox** (not Production)
- `SQUARE_ENVIRONMENT=sandbox` in `.env.local`
- You're using the **Sandbox** access token

## Step-by-Step Fix

### Step 1: Verify Application Status

1. Go to: https://developer.squareup.com/apps
2. Click on your application
3. Check the **Overview** page for:
   - Application status (should be "Active")
   - Any warnings or errors
   - Required setup steps

### Step 2: Check Application Type

In your application dashboard, check:
- What **type** of application it is (OAuth, API, etc.)
- If it's the right type for your use case
- If you need to create a different type

### Step 3: Generate Token Carefully

1. Go to **Credentials** → **Sandbox**
2. If there's an existing token, click **Revoke**
3. Wait 5-10 seconds
4. Click **Generate**
5. **Immediately** copy the entire token
6. Paste it into a text editor to verify:
   - It's 64 characters long
   - No extra spaces
   - Complete token
7. Then copy from text editor to `.env.local`

### Step 4: Verify Token Format

Your `.env.local` should look exactly like this:

```env
SQUARE_ACCESS_TOKEN=EAAAl_OCWfFbc0wAKpodbgJKqKk0F_XEDtaPoRdzkw0jR0hOPSKB8MM2jv8yivUj
SQUARE_LOCATION_ID=LNA1P32A2G8MH
SQUARE_ENVIRONMENT=sandbox
```

**Important:**
- No spaces around `=`
- No quotes
- No trailing spaces
- Each variable on its own line

### Step 5: Test Token Manually

You can test the token directly using curl:

```bash
curl -X GET "https://connect.squareupsandbox.com/v2/locations" -H "Square-Version: 2024-01-18" -H "Authorization: Bearer EAAAl_OCWfFbc0wAKpodbgJKqKk0F_XEDtaPoRdzkw0jR0hOPSKB8MM2jv8yivUj"
```

Replace the token with your actual token.

If this returns a 401, the token is definitely invalid.

## Alternative: Use Square Webhook Simulator

If tokens keep failing, you might want to:
1. Use Square's webhook simulator to test webhooks
2. Manually create test payments in Square Dashboard
3. Focus on the webhook receiving side first

## Contact Square Support

If tokens continue to fail:
1. Go to: https://developer.squareup.com/support
2. Explain: "My sandbox access tokens are all returning 401 UNAUTHORIZED"
3. Include:
   - Your application ID
   - Screenshot of your application status
   - The error message you're seeing

## Quick Checklist

- [ ] Application is Active (not suspended)
- [ ] Token is from Sandbox (not Production)
- [ ] Token is exactly 64 characters
- [ ] No extra spaces in `.env.local`
- [ ] `SQUARE_ENVIRONMENT=sandbox` is set
- [ ] Token was copied immediately after generation
- [ ] Application has required permissions enabled

## Next Steps

1. **Check application status** in Square Dashboard
2. **Verify token format** in `.env.local`
3. **Generate a fresh token** if needed
4. **Test with curl** to confirm token validity
5. **Contact Square support** if still failing

The issue is likely with the Square application setup, not the code!

