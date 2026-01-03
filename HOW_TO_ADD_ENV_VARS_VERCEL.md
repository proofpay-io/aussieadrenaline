# How to Add Environment Variables in Vercel

## Step-by-Step Instructions

### Step 1: Go to Your Project Settings

1. **Open Vercel Dashboard:**
   - Go to: https://vercel.com/dashboard
   - You should see your project: `aussieadrenaline-api` (or similar)

2. **Click on your project** to open it

3. **Go to Settings:**
   - Look for a **"Settings"** tab at the top of the page
   - Click on it

### Step 2: Navigate to Environment Variables

1. **In the Settings menu** (left sidebar), look for:
   - **"Environment Variables"** or **"Variables"**
   - Click on it

### Step 3: Add Each Environment Variable

You need to add **4 variables**. For each one:

1. **Click "Add New"** or **"Add Environment Variable"** button

2. **Fill in the form:**
   - **Name**: Enter the variable name (e.g., `SUPABASE_URL`)
   - **Value**: Paste the value (see below)
   - **Environment**: Select all three:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development

3. **Click "Save"**

4. **Repeat for all 4 variables**

### Step 4: The 4 Variables to Add

#### Variable 1: SUPABASE_URL
- **Name**: `SUPABASE_URL`
- **Value**: `https://ztqdsxgvgzlosufkdskk.supabase.co`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### Variable 2: SUPABASE_SERVICE_ROLE_KEY
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0cWRzeGd2Z3psb3N1Zmtkc2trIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA0Nzg1MywiZXhwIjoyMDgyNjIzODUzfQ.pqcBcdKngMnmnniEquy_-twmL8cQO-FQfxmM3Iqat8M`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### Variable 3: SQUARE_ACCESS_TOKEN
- **Name**: `SQUARE_ACCESS_TOKEN`
- **Value**: `EAAAl9i9lm_bXoTLiGOjieXY7utChHfQqQ51bbz104oROWoAoByp4fDwxhFxsIQi`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### Variable 4: SQUARE_ENVIRONMENT
- **Name**: `SQUARE_ENVIRONMENT`
- **Value**: `sandbox`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

### Step 5: Redeploy Your Project

**IMPORTANT:** After adding environment variables, you must redeploy!

1. **Go to the "Deployments" tab** (at the top of your project page)

2. **Find the latest deployment** (the most recent one)

3. **Click the three dots (⋯)** next to it

4. **Click "Redeploy"**

5. **Confirm the redeploy**

**OR** you can:
- Go to **Deployments** tab
- Click **"Redeploy"** button (usually at the top)
- Select the latest deployment
- Click **"Redeploy"**

## Visual Guide

The page should look something like this:

```
Settings
├── General
├── Environment Variables  ← Click here
│   ├── [Add New] button
│   └── List of variables (empty at first)
├── Domains
└── ...
```

When adding a variable, you'll see a form like:

```
┌─────────────────────────────────────┐
│ Name: [SUPABASE_URL            ]    │
│ Value: [https://...            ]    │
│                                     │
│ Environments:                       │
│ ☑ Production                        │
│ ☑ Preview                           │
│ ☑ Development                       │
│                                     │
│ [Cancel]  [Save]                   │
└─────────────────────────────────────┘
```

## Verify Variables Are Added

After adding all 4, you should see a list like:

```
Environment Variables (4)
├── SUPABASE_URL
├── SUPABASE_SERVICE_ROLE_KEY
├── SQUARE_ACCESS_TOKEN
└── SQUARE_ENVIRONMENT
```

## After Redeploying

1. Wait for the redeployment to complete (usually 1-2 minutes)
2. Test your API again:
   ```powershell
   curl https://aussieadrenaline-api.vercel.app/health
   ```
3. The API should now be able to connect to Supabase and Square

## Troubleshooting

### Can't find "Environment Variables" option
- Make sure you're in **Settings** (not Overview or Deployments)
- Look in the left sidebar menu
- It might be under a submenu like "Configuration"

### Variables not working after adding
- Make sure you **redeployed** after adding variables
- Check that all three environments are selected (Production, Preview, Development)
- Verify the variable names are exactly correct (case-sensitive)

### Still getting errors
- Check the Vercel deployment logs for specific error messages
- Verify the values are correct (no extra spaces)
- Make sure you saved each variable before moving to the next

---

**Need help?** If you get stuck at any step, let me know what you see on your screen!

