# ✅ Next.js Server Restarted

## Status

✅ **Server restart initiated**

The Next.js dev server has been restarted with the new environment variables.

## What Happened

1. ✅ Stopped any running Node processes
2. ✅ Started Next.js dev server in `apps/web/`
3. ✅ Environment variables from `.env.local` are now loaded

## Server URLs

Once the server finishes starting, you can access:

- **Home:** http://localhost:3000
- **Demo Store:** http://localhost:3000/demo-store
- **Receipts:** http://localhost:3000/receipts
- **API Route:** http://localhost:3000/api/demo/create-sale

## Environment Variables Loaded

The server now has access to:
- ✅ `SQUARE_ACCESS_TOKEN`
- ✅ `SQUARE_LOCATION_ID` = `LNA1P32A2G8MH`
- ✅ `SQUARE_ENVIRONMENT` = `sandbox`

## Test the API

1. **Visit Demo Store:**
   - Go to: http://localhost:3000/demo-store

2. **Add Items to Cart:**
   - Select sizes (for shoes/apparel)
   - Click "Add to Cart"

3. **Generate Sandbox Sale:**
   - Click "Generate Sandbox Sale" button
   - Check console for logs
   - Should see success with order_id and payment_id

## Expected Console Logs

When you click "Generate Sandbox Sale", you should see:

```
🛒 [CREATE-SALE] Request received
📦 [CREATE-SALE] Processing X items
📍 [CREATE-SALE] Using location: LNA1P32A2G8MH
💰 [CREATE-SALE] Total amount: $XX.XX
📋 [CREATE-SALE] Created X line items
🔑 [CREATE-SALE] Order idempotency key: xxx
📝 [CREATE-SALE] Creating Square Order...
✅ [CREATE-SALE] Order created: order-xxx
🔑 [CREATE-SALE] Payment idempotency key: xxx
💳 [CREATE-SALE] Creating Square Payment...
✅ [CREATE-SALE] Payment created: payment-xxx
🎉 [CREATE-SALE] Sale completed successfully
```

## Success Response

You should see an alert with:
- ✅ Order ID
- ✅ Payment ID
- ✅ Total amount
- ✅ Message about receipt creation

---

**Server is restarting!** Wait a few seconds for it to fully start, then test the demo store.

