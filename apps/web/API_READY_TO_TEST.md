# ✅ Create Sale API - Ready to Test

## Configuration Complete

✅ **Square Location ID Added:** `LNA1P32A2G8MH`

Environment variables are now configured in `apps/web/.env.local`:
- ✅ `SQUARE_ACCESS_TOKEN` - Set
- ✅ `SQUARE_LOCATION_ID` - LNA1P32A2G8MH
- ✅ `SQUARE_ENVIRONMENT` - sandbox

## Next Steps

### 1. Restart Next.js Dev Server

The environment variables are loaded when the server starts, so restart it:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd apps/web
npm run dev
```

### 2. Test the API Route

**Option A: Via Demo Store UI**
1. Visit: `http://localhost:3000/demo-store`
2. Add items to cart
3. Click "Generate Sandbox Sale"
4. Check console for logs
5. Verify success message with order_id and payment_id

**Option B: Direct API Test**

```powershell
$body = @{
    items = @(
        @{
            product_id = "nike-001"
            name = "Air Max 90"
            sku = "NK-AM90-001"
            quantity = 1
            unit_price_cents = 12999
            variation = "10"
        }
    )
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Uri "http://localhost:3000/api/demo/create-sale" -Method POST -Body $body -ContentType "application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "order_id": "order-xxx",
  "payment_id": "payment-xxx",
  "total_cents": 12999
}
```

## What Happens Next

1. ✅ API creates Square Order with line items
2. ✅ API creates Square Payment with test nonce
3. ✅ Square sends `payment.created` webhook to your API
4. ✅ Webhook handler creates receipt in Supabase
5. ✅ Receipt appears in `/receipts` page

## Verification

After testing, check:

- ✅ Console logs show successful order/payment creation
- ✅ Response includes order_id and payment_id
- ✅ Square webhook is received (check Vercel logs)
- ✅ Receipt is created in Supabase
- ✅ Receipt appears in `/receipts` page

## Troubleshooting

### "Square not configured" error
- ✅ Check `.env.local` exists in `apps/web/`
- ✅ Verify all three variables are set
- ✅ Restart the dev server

### "Location ID not found" error
- ✅ Verify `SQUARE_LOCATION_ID=LNA1P32A2G8MH` in `.env.local`
- ✅ Check the location exists in your Square account

### Payment creation fails
- ✅ Verify Square access token is valid
- ✅ Check you're using sandbox environment
- ✅ Ensure location ID matches your Square account

---

**Ready to test!** Restart your dev server and try generating a sandbox sale.

