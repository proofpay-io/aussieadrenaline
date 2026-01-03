# ✅ Environment Variables Added - Next Steps

## Step 1: Verify Redeployment

**Did you redeploy after adding the environment variables?**

If not, you need to:
1. Go to **Deployments** tab in Vercel
2. Click the **three dots (⋯)** on the latest deployment
3. Click **"Redeploy"**
4. Wait for it to complete (1-2 minutes)

**Why?** Environment variables only take effect after a redeploy!

## Step 2: Test Your API

Once redeployed, test that everything works:

```powershell
curl https://aussieadrenaline-api.vercel.app/health
```

Should return: `{"status":"ok","service":"proofpay-api"}`

## Step 3: Update Square Webhook URL

Now that your API is live, update Square to send webhooks to it:

1. **Go to Square Developer Dashboard:**
   - Visit: https://developer.squareup.com/apps
   - Sign in and select your app

2. **Navigate to Webhooks:**
   - Click **"Webhooks"** in the left menu
   - Click **"Subscriptions"** or **"Webhook Subscriptions"**

3. **Edit or Create Webhook:**
   - If you have an existing webhook, click **"Edit"**
   - If not, click **"Create Subscription"** or **"Add Webhook"**

4. **Set the Notification URL:**
   - **Notification URL**: `https://aussieadrenaline-api.vercel.app/v1/webhooks/square`
   - Make sure it's exactly this URL (with `/v1/webhooks/square` at the end)

5. **Select Events:**
   - Make sure **"payment.created"** is selected/checked
   - You can select other events if needed, but we only process `payment.created`

6. **Save the webhook**

## Step 4: Test the Webhook Endpoint

Test that your webhook endpoint is accessible:

```powershell
curl -X POST https://aussieadrenaline-api.vercel.app/v1/webhooks/square `
  -H "Content-Type: application/json" `
  -d '{\"type\":\"payment.created\",\"event_id\":\"test-123\",\"merchant_id\":\"test\"}'
```

**Expected response:** HTTP 200 with JSON response

## Step 5: Test with Real Square Payment

1. **Create a test payment in Square:**
   - Use Square's payment form or test payment flow
   - Or use Square's webhook simulator (if available)

2. **Check Vercel logs:**
   - Go to your Vercel project → **Deployments** → Latest deployment
   - Click on it → **Functions** tab
   - Look for logs showing webhook received and receipt creation

3. **Check Supabase:**
   - Go to your Supabase dashboard
   - Navigate to **Table Editor**
   - Check the `receipts` table for new entries
   - Check the `receipt_items` table if the order had line items

## Quick Checklist

- ✅ Environment variables added in Vercel
- ⏳ Redeploy completed (did you do this?)
- ⏳ Square webhook URL updated
- ⏳ Webhook endpoint tested
- ⏳ Test payment created
- ⏳ Receipts verified in Supabase

## Troubleshooting

### API not connecting to Supabase
- Verify environment variables are set correctly
- Check that you redeployed after adding variables
- Check Vercel function logs for connection errors

### Square webhook returns 404
- Verify URL is exactly: `https://aussieadrenaline-api.vercel.app/v1/webhooks/square`
- Check that deployment was successful
- Verify `vercel.json` routes are correct

### Receipts not created
- Check Vercel logs for webhook processing errors
- Verify Supabase credentials are correct
- Check Square webhook delivery status in Square dashboard

---

**Let me know:**
1. Did you redeploy after adding the environment variables?
2. Do you want help updating the Square webhook URL?
3. Should I test the webhook endpoint for you?

