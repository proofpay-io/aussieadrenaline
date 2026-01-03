# Setup .env.local File

## Create Environment Variables File

Create a file named `.env.local` in the `apps/web/` directory with the following content:

```env
SQUARE_ACCESS_TOKEN=EAAAl9i9lm_bXoTLiGOjieXY7utChHfQqQ51bbz104oROWoAoByp4fDwxhFxsIQi
SQUARE_LOCATION_ID=LNA1P32A2G8MH
SQUARE_ENVIRONMENT=sandbox
```

## Quick Setup

**File Location:** `apps/web/.env.local`

**File Contents:**
```
SQUARE_ACCESS_TOKEN=EAAAl9i9lm_bXoTLiGOjieXY7utChHfQqQ51bbz104oROWoAoByp4fDwxhFxsIQi
SQUARE_LOCATION_ID=LNA1P32A2G8MH
SQUARE_ENVIRONMENT=sandbox
```

## After Creating the File

1. **Restart your Next.js dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   cd apps/web
   npm run dev
   ```

2. **Test the API:**
   - Visit: `http://localhost:3000/demo-store`
   - Add items to cart
   - Click "Generate Sandbox Sale"

## Verification

The API route will check for these variables on startup. If they're missing, you'll see an error message.

---

**Note:** The `.env.local` file is gitignored for security, so you need to create it manually.

