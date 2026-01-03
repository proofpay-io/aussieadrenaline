# 🔧 Fix: Website Not Loading

## Issue

The website isn't loading after restarting the server.

## Common Causes

### 1. Port 3000 Already in Use
- Another Node process is using port 3000
- Old server instance still running

### 2. Server Still Starting
- Next.js can take 10-30 seconds to fully start
- Look for "Ready" message in terminal

### 3. Build/Compilation Errors
- TypeScript errors
- Missing dependencies
- Syntax errors in code

## ✅ Fix Applied

I've stopped all Node processes and started a fresh server. The server should be starting now.

## What to Check

### 1. Check Terminal Output

Look at the terminal where `npm run dev` is running. You should see:
- `✓ Ready in X seconds`
- `○ Compiling / ...`
- `✓ Compiled / ...`
- `▲ Next.js X.X.X`
- `- Local: http://localhost:3000`

### 2. Check for Errors

If you see errors in the terminal:
- **TypeScript errors**: Fix the code issues
- **Module not found**: Run `npm install`
- **Port in use**: Kill the process using port 3000

### 3. Wait for Server to Start

Next.js can take time to:
- Compile TypeScript
- Load environment variables
- Start the dev server

**Wait 10-30 seconds** after running `npm run dev`.

## Manual Restart Steps

If the server still isn't working:

1. **Stop all Node processes**:
   ```powershell
   Get-Process -Name node | Stop-Process -Force
   ```

2. **Wait 5 seconds**

3. **Start server**:
   ```bash
   cd apps/web
   npm run dev
   ```

4. **Wait for "Ready" message**

5. **Visit**: http://localhost:3000

## Verify Server is Running

Check if port 3000 is listening:
```powershell
netstat -ano | findstr ":3000"
```

You should see `LISTENING` status.

## If Still Not Working

1. **Check for syntax errors**:
   ```bash
   cd apps/web
   npm run lint
   ```

2. **Check dependencies**:
   ```bash
   cd apps/web
   npm install
   ```

3. **Check .env.local**:
   - File exists: `apps/web/.env.local`
   - Has Supabase credentials
   - Has Square credentials (if using sandbox sales)

4. **Try different port**:
   ```bash
   PORT=3001 npm run dev
   ```
   Then visit: http://localhost:3001

The server is restarting fresh now. Wait for it to fully start and try again!

