# How to Find Your Vercel Deployment URL

## Step-by-Step Instructions

### Method 1: From the Deployment Page

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click on your project** (should be named something like "aussieadrenaline" or "proofpay-api")
3. **Look at the top of the page** - you'll see:
   - **Production URL**: `https://your-project-name.vercel.app`
   - Or check the **Domains** section

### Method 2: From the Project Overview

1. On your project page, look for:
   - A section labeled **"Domains"** or **"Deployments"**
   - The URL will be displayed prominently
   - It usually looks like: `https://aussieadrenaline.vercel.app` or `https://proofpay-api-xxxxx.vercel.app`

### Method 3: From Recent Deployments

1. On the dashboard, you'll see a list of **"Recent Deployments"**
2. Click on the most recent one (the one that just succeeded)
3. The URL is shown at the top of that deployment page

### Method 4: Check the Congratulations Message

The congratulations message you saw might have included a link or URL. Look for:
- A button that says "Visit" or "View Deployment"
- A URL displayed in the message
- A link to your live site

## What the URL Looks Like

Your URL will be one of these formats:
- `https://aussieadrenaline.vercel.app`
- `https://aussieadrenaline-xxxxx.vercel.app`
- `https://proofpay-api.vercel.app`
- `https://proofpay-api-xxxxx.vercel.app`

## Once You Have the URL

**Please share it here** and I'll help you:
1. ✅ Test the health endpoint
2. ✅ Verify the deployment works
3. ✅ Update your Square webhook URL
4. ✅ Test the webhook endpoint
5. ✅ Verify everything is connected

## Quick Test

Once you have the URL, you can test it yourself:

```powershell
# Replace YOUR_URL with your actual Vercel URL
curl https://YOUR_URL.vercel.app/health
```

Should return: `{"status":"ok","service":"proofpay-api"}`

---

**Can't find it?** Take a screenshot of your Vercel dashboard and I can help you locate it!

