# ✅ Vercel Deployment Complete!

## Your Deployment URL

**Production URL**: `https://aussieadrenaline-api.vercel.app`

## ✅ Step 1: Test Health Endpoint

Test that your API is working:

```powershell
curl https://aussieadrenaline-api.vercel.app/health
```

**Expected response:**
```json
{"status":"ok","service":"proofpay-api"}
```

## ✅ Step 2: Verify Environment Variables

Make sure you've added all environment variables in Vercel:

1. Go to: https://vercel.com/dashboard
2. Select your project: `aussieadrenaline-api`
3. Go to **Settings** → **Environment Variables**
4. Verify these are set:
   - ✅ `SUPABASE_URL`
   - ✅ `SUPABASE_SERVICE_ROLE_KEY`
   - ✅ `SQUARE_ACCESS_TOKEN`
   - ✅ `SQUARE_ENVIRONMENT`

**If you haven't added them yet**, see `VERCEL_ENV_VARIABLES.md` for the values.

**Important:** After adding environment variables, you must **Redeploy** your project!

## ✅ Step 3: Update Square Webhook URL

1. **Go to Square Developer Dashboard:**
   - Visit: https://developer.squareup.com/apps
   - Select your app

2. **Navigate to Webhooks:**
   - Click **Webhooks** → **Subscriptions**
   - Find your webhook subscription (or create a new one)

3. **Update Notification URL:**
   - **Notification URL**: `https://aussieadrenaline-api.vercel.app/v1/webhooks/square`
   - Make sure it's exactly: `/v1/webhooks/square` (not just `/v1/webhooks`)

4. **Save the changes**

## ✅ Step 4: Test Webhook Endpoint

Test that Square can reach your webhook:

```powershell
# Test webhook endpoint
curl -X POST https://aussieadrenaline-api.vercel.app/v1/webhooks/square `
  -H "Content-Type: application/json" `
  -d '{\"type\":\"payment.created\",\"event_id\":\"test-123\"}'
```

**Expected response:** HTTP 200 with JSON response

## ✅ Step 5: Test with Real Square Payment

1. **Create a test payment in Square:**
   - Use Square's test payment flow
   - Or use Square's webhook simulator

2. **Check Vercel logs:**
   - Go to your Vercel project → **Deployments** → Click on latest deployment → **Functions** tab
   - Look for webhook logs showing receipt creation

3. **Check Supabase:**
   - Go to your Supabase dashboard
   - Check the `receipts` table for new entries
   - Check the `receipt_items` table if order had line items

## Quick Reference

**API Health Check:**
```
https://aussieadrenaline-api.vercel.app/health
```

**Square Webhook URL:**
```
https://aussieadrenaline-api.vercel.app/v1/webhooks/square
```

**GitHub Repository:**
```
https://github.com/proofpay-io/aussieadrenaline
```

## Troubleshooting

### Health endpoint doesn't work
- Check Vercel deployment logs
- Verify the deployment succeeded
- Check for build errors

### Webhook returns 404
- Verify URL is exactly: `https://aussieadrenaline-api.vercel.app/v1/webhooks/square`
- Check `vercel.json` routes configuration
- Verify deployment includes `api/index.js`

### Receipts not created
- Check environment variables are set correctly
- Check Vercel function logs for errors
- Verify Supabase connection in logs
- Check Square webhook delivery status in Square dashboard

## Next Steps

1. ✅ Test health endpoint
2. ✅ Add environment variables (if not done)
3. ✅ Update Square webhook URL
4. ✅ Test webhook with Square
5. ✅ Verify receipts in Supabase

---

**Your ProofPay API is now live at:** `https://aussieadrenaline-api.vercel.app` 🚀

