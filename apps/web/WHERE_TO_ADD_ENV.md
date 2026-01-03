# Where to Add .env.local File

## File Location

**Create the file here:**
```
apps/web/.env.local
```

**Full path:**
```
C:\Users\user\ProofPay Cursor\apps\web\.env.local
```

## How to Create It

### Option 1: Using File Explorer
1. Navigate to: `C:\Users\user\ProofPay Cursor\apps\web\`
2. Right-click in the folder
3. Select "New" → "Text Document"
4. Name it: `.env.local` (including the dot at the start)
5. Open it and paste the contents below
6. Save the file

### Option 2: Using VS Code / Cursor
1. In Cursor, navigate to `apps/web/` folder
2. Right-click in the file explorer
3. Select "New File"
4. Name it: `.env.local`
5. Paste the contents below
6. Save (Ctrl+S)

### Option 3: Using PowerShell (Already Done)
The file should already be created! Check if it exists.

## File Contents

**Important:** Each variable must be on its own line!

```env
SQUARE_ACCESS_TOKEN=EAAAl9i9lm_bXoTLiGOjieXY7utChHfQqQ51bbz104oROWoAoByp4fDwxhFxsIQi
SQUARE_LOCATION_ID=LNA1P32A2G8MH
SQUARE_ENVIRONMENT=sandbox
```

## Verify File Was Created

Run this command to check:
```powershell
cd "C:\Users\user\ProofPay Cursor\apps\web"
Get-Content .env.local
```

You should see all three variables listed.

## After Creating

1. **Restart your Next.js dev server:**
   - Stop it (Ctrl+C)
   - Start it again: `npm run dev`

2. **Test the API:**
   - Visit: `http://localhost:3000/demo-store`
   - Add items to cart
   - Click "Generate Sandbox Sale"

---

**The file should already be created!** Check if it exists in `apps/web/.env.local`

