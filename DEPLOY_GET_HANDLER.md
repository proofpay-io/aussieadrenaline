# Deploy the GET Handler Update

## What Happened

I've added a GET handler to the webhook endpoint, but it needs to be deployed to Vercel.

## Option 1: Push to GitHub (Auto-Deploy)

Vercel will automatically deploy when you push to GitHub:

1. **Push to GitHub:**
   ```powershell
   cd "C:\Users\user\ProofPay Cursor"
   git push
   ```
   
   If you get authentication errors, you may need to use your GitHub token again or use GitHub CLI.

2. **Wait for Vercel to auto-deploy** (usually 1-2 minutes)

3. **Test the endpoint:**
   - Visit: `https://aussieadrenaline-api.vercel.app/v1/webhooks/square`
   - You should now see a helpful message instead of 404

## Option 2: Manual Redeploy in Vercel

If you can't push to GitHub right now:

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Select your project

2. **Redeploy:**
   - Go to **Deployments** tab
   - Click the **three dots (⋯)** on the latest deployment
   - Click **"Redeploy"**
   - **Note:** This will redeploy the current code from GitHub (without the GET handler)

   **OR** you can:
   - Download the updated files locally
   - Upload them via Vercel's dashboard (if that option is available)

## Option 3: Use GitHub CLI (Easiest)

```powershell
# Login to GitHub (if not already)
gh auth login

# Push the changes
cd "C:\Users\user\ProofPay Cursor"
git push
```

## What the GET Handler Does

After deployment, when you visit the webhook URL in a browser, you'll see:

```json
{
  "message": "Square webhook endpoint is active",
  "method": "This endpoint accepts POST requests only",
  "webhookUrl": "https://aussieadrenaline-api.vercel.app/v1/webhooks/square",
  "instructions": "Square will send POST requests to this URL when payment events occur",
  "status": "ready"
}
```

This confirms the endpoint is active and ready to receive webhooks from Square.

## Current Status

- ✅ Code updated locally
- ✅ Changes committed to Git
- ⏳ Needs to be pushed to GitHub
- ⏳ Vercel will auto-deploy after push

---

**Recommendation:** Use Option 3 (GitHub CLI) to push, then Vercel will automatically deploy the update.

