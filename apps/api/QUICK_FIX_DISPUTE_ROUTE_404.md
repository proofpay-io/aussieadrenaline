# Quick Fix: POST /api/disputes Route Not Found

## Problem

Getting error: "Route POST:/api/disputes not found"

## Solution

The route exists in the code, but the API server needs to be restarted to pick it up.

### Step 1: Restart API Server

**Stop the current API server:**
- Press `Ctrl+C` in the terminal where `npm run dev` is running

**Start it again:**
```bash
cd apps/api
npm run dev
```

### Step 2: Verify Route is Registered

Wait for the server to start, then test:
```bash
curl http://localhost:4000/health
```

You should see: `{"status":"ok","service":"proofpay-api"}`

### Step 3: Test Dispute Endpoint

```bash
# First, get a receipt ID and item ID from Supabase
# Then test:
curl -X POST http://localhost:4000/api/disputes \
  -H "Content-Type: application/json" \
  -d '{
    "receipt_id": "YOUR_RECEIPT_ID",
    "selected_items": [
      {
        "receipt_item_id": "YOUR_ITEM_ID",
        "quantity": 1
      }
    ],
    "reason_code": "item_not_received"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "dispute_id": "uuid-here",
  "status": "submitted"
}
```

### Step 4: Check API Logs

When you call the endpoint, you should see in the API server logs:
```
📝 Creating dispute
💾 Creating dispute
✅ Dispute created
🎉 Dispute created successfully
```

## Common Issues

### Issue 1: API Server Not Running

**Check:**
```bash
curl http://localhost:4000/health
```

**If connection refused:**
- Start API server: `cd apps/api && npm run dev`
- Wait for "Server listening" message

### Issue 2: Route Not in Code

**Verify route exists:**
```bash
# Check app.js
grep -i "POST.*disputes" apps/api/app.js

# Check api/index.js (for Vercel)
grep -i "POST.*disputes" apps/api/api/index.js
```

**If not found:**
- The route needs to be added (it should already be there)

### Issue 3: Route Registered After Server Start

**Solution:**
- Restart the API server after adding routes
- Fastify needs to register routes on startup

### Issue 4: Wrong API URL

**Check the web app is calling the right URL:**
- Local dev: Should call `http://localhost:4000/api/disputes`
- Production: Should call `https://aussieadrenaline-api.vercel.app/api/disputes`

**Verify in browser console:**
- Open DevTools → Network tab
- Submit a dispute
- Check the request URL

## Verification Checklist

- [ ] API server is running (`npm run dev` in `apps/api`)
- [ ] Server shows "Server listening" message
- [ ] `/health` endpoint works
- [ ] Route exists in `app.js` (line ~83)
- [ ] Route exists in `api/index.js` (line ~25)
- [ ] API server was restarted after route was added
- [ ] Web app is calling correct API URL

## Still Not Working?

1. **Check API server logs** for any errors
2. **Verify route registration order** - routes should be registered before server starts
3. **Test with curl directly** to isolate if it's a frontend or backend issue
4. **Check for typos** in route path (`/api/disputes` not `/api/dispute`)

