# ✅ ProofPay Setup Complete!

## What's Been Done

✅ **API deployed to Vercel**: `https://aussieadrenaline-api.vercel.app`  
✅ **Environment variables configured**  
✅ **Square webhook URL updated**  
✅ **Health endpoint working**  

## Current Status

**API URL**: `https://aussieadrenaline-api.vercel.app`  
**Health Endpoint**: `https://aussieadrenaline-api.vercel.app/health`  
**Webhook Endpoint**: `https://aussieadrenaline-api.vercel.app/v1/webhooks/square`  
**Square Webhook URL**: Updated to point to your Vercel API  

## How It Works Now

1. **Square Payment Created** → Square sends webhook to your API
2. **API Receives Webhook** → Processes `payment.created` event
3. **API Fetches Payment Details** → Gets payment info from Square API
4. **API Fetches Order Details** → Gets order/line items if available
5. **API Creates Receipt** → Saves to Supabase `receipts` table
6. **API Creates Receipt Items** → Saves line items to `receipt_items` table

## Testing Your Setup

### Option 1: Create a Test Payment in Square

1. **Use Square's test payment flow:**
   - Go to your Square dashboard
   - Create a test payment
   - Square will automatically send a webhook

2. **Check Vercel logs:**
   - Go to: https://vercel.com/dashboard
   - Select your project → **Deployments** → Latest deployment
   - Click on it → **Functions** tab
   - Look for logs showing:
     - `🔔 Square webhook endpoint hit`
     - `✅ Processing payment.created event`
     - `✅ Receipt created successfully`

3. **Check Supabase:**
   - Go to your Supabase dashboard
   - Navigate to **Table Editor**
   - Check the `receipts` table for new entries
   - Check the `receipt_items` table for line items

### Option 2: Use Square Webhook Simulator

1. Go to: https://developer.squareup.com/apps
2. Select your app
3. Go to **Webhooks** → **Webhook Simulator** (if available)
4. Send a test `payment.created` event
5. Check Vercel logs and Supabase

## Verify Everything Works

### Check 1: Health Endpoint
```powershell
curl https://aussieadrenaline-api.vercel.app/health
```
**Expected**: `{"status":"ok","service":"proofpay-api"}`

### Check 2: Webhook Endpoint
```powershell
curl -X POST https://aussieadrenaline-api.vercel.app/v1/webhooks/square `
  -H "Content-Type: application/json" `
  -d '{\"type\":\"payment.created\",\"event_id\":\"test\"}'
```
**Expected**: HTTP 200 with JSON response

### Check 3: Square Webhook Delivery
- Go to Square Developer Dashboard
- Check **Webhooks** → **Event Logs** or **Delivery Status**
- Look for successful deliveries (HTTP 200)

### Check 4: Receipts in Supabase
- Go to Supabase Dashboard
- **Table Editor** → `receipts` table
- Should see new rows after payments

## Monitoring

### Vercel Logs
- **Real-time logs**: Vercel Dashboard → Project → Deployments → Latest → Functions
- Look for:
  - `🔔 Square webhook endpoint hit` - Webhook received
  - `✅ Payment processed successfully` - Receipt created
  - `❌ Error` - Something went wrong

### Square Webhook Logs
- **Square Dashboard**: Webhooks → Event Logs
- Check delivery status and response codes

### Supabase Data
- **Table Editor**: View `receipts` and `receipt_items` tables
- **SQL Editor**: Run queries to check data

## Troubleshooting

### Webhook Not Received
- Verify Square webhook URL is correct
- Check Square webhook delivery logs
- Verify API is deployed and running

### Receipts Not Created
- Check Vercel function logs for errors
- Verify environment variables are set
- Check Supabase connection in logs
- Verify Square API credentials

### 404 Errors
- Verify webhook URL: `https://aussieadrenaline-api.vercel.app/v1/webhooks/square`
- Check `vercel.json` routes configuration
- Verify deployment was successful

## Next Steps

1. ✅ Test with a real Square payment
2. ✅ Monitor Vercel logs for webhook processing
3. ✅ Verify receipts in Supabase
4. ✅ Check Square webhook delivery status

## Your Setup Summary

**GitHub**: https://github.com/proofpay-io/aussieadrenaline  
**Vercel**: https://aussieadrenaline-api.vercel.app  
**Square Webhook**: Configured and pointing to Vercel  
**Supabase**: Connected and ready to receive receipts  

---

**🎉 Your ProofPay API is fully set up and ready to process payments!**

When you create a test payment in Square, it will automatically:
1. Send a webhook to your API
2. Create a receipt in Supabase
3. Store receipt items if available

Let me know if you want help testing or if you encounter any issues!

