# Environment Variables for Demo Store

## Required Variables

Add these to `.env.local` in the `apps/web/` directory:

```env
SQUARE_ACCESS_TOKEN=your_sandbox_access_token_here
SQUARE_LOCATION_ID=your_square_location_id_here
SQUARE_ENVIRONMENT=sandbox
```

## How to Get SQUARE_LOCATION_ID

### Method 1: Square Developer Dashboard

1. Go to: https://developer.squareup.com/apps
2. Sign in and select your app
3. Navigate to **Locations** in the left sidebar
4. You'll see your location(s) listed
5. Copy the **Location ID** (looks like: `LXXXXXXXXXXXXX`)

### Method 2: Square API

```bash
curl https://connect.squareupsandbox.com/v2/locations \
  -H "Authorization: Bearer YOUR_SQUARE_ACCESS_TOKEN" \
  -H "Square-Version: 2024-01-18"
```

Response will include:
```json
{
  "locations": [
    {
      "id": "LXXXXXXXXXXXXX",
      "name": "Main Location",
      ...
    }
  ]
}
```

### Method 3: Square Sandbox Test Location

If you're using Square Sandbox, you can use the default test location ID:
- The location ID is typically shown in your Square Developer Dashboard
- Or use the API method above to list all locations

## Current Values

Based on your existing setup:

```env
SQUARE_ACCESS_TOKEN=EAAAl9i9lm_bXoTLiGOjieXY7utChHfQqQ51bbz104oROWoAoByp4fDwxhFxsIQi
SQUARE_ENVIRONMENT=sandbox
SQUARE_LOCATION_ID=YOUR_LOCATION_ID_HERE  # ← You need to add this
```

## File Location

Create or update: `apps/web/.env.local`

```
apps/web/
  .env.local  ← Create this file
```

## Verification

After adding the variables, restart your Next.js dev server:

```bash
cd apps/web
npm run dev
```

The API route will check for these variables and show an error if they're missing.

