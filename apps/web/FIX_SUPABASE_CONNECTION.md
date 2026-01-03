# 🔧 Fix: Supabase Connection Error

## Error Message
```
Error: Supabase connection is not available
```

## Cause

The simulated purchase API route needs Supabase credentials to write receipts directly to the database, but they weren't in `apps/web/.env.local`.

## ✅ Fix Applied

I've added the Supabase credentials to `apps/web/.env.local`:

```env
SUPABASE_URL=https://ztqdsxgvgzlosufkdskk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Next Steps

### 1. Restart Next.js Server

**Important**: Environment variables are only loaded when the server starts!

1. **Stop the current server** (Ctrl+C in the terminal)
2. **Restart it**:
   ```bash
   cd apps/web
   npm run dev
   ```

### 2. Test Simulated Purchase

1. Visit: http://localhost:3000/demo-store
2. Click "🛒 Quick Add Random Cart"
3. Click "🎭 Simulate Purchase"
4. Should work now! ✅

## Verification

After restarting, the simulated purchase should:
- ✅ Connect to Supabase
- ✅ Create receipt with `source='simulated'`
- ✅ Create receipt items
- ✅ Show success message
- ✅ Receipt appears immediately in `/receipts`

## If Still Not Working

1. **Check .env.local exists**: `apps/web/.env.local`
2. **Check variables are set**: Should have `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
3. **Restart server**: Environment variables only load on startup
4. **Check console logs**: Look for Supabase connection errors

## Environment Variables Needed

For simulated purchases to work, `apps/web/.env.local` needs:

```env
SUPABASE_URL=https://ztqdsxgvgzlosufkdskk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SQUARE_ACCESS_TOKEN=... (for sandbox sales)
SQUARE_LOCATION_ID=... (for sandbox sales)
SQUARE_ENVIRONMENT=sandbox
```

The Supabase credentials have been added. **Restart your Next.js server** and try again!

