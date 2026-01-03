# Vercel Environment Variables

Copy and paste these into your Vercel project settings:

## Environment Variables to Add

### 1. SUPABASE_URL
```
https://ztqdsxgvgzlosufkdskk.supabase.co
```

### 2. SUPABASE_SERVICE_ROLE_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0cWRzeGd2Z3psb3N1Zmtkc2trIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA0Nzg1MywiZXhwIjoyMDgyNjIzODUzfQ.pqcBcdKngMnmnniEquy_-twmL8cQO-FQfxmM3Iqat8M
```

### 3. SQUARE_ACCESS_TOKEN
```
EAAAl9i9lm_bXoTLiGOjieXY7utChHfQqQ51bbz104oROWoAoByp4fDwxhFxsIQi
```

### 4. SQUARE_ENVIRONMENT
```
sandbox
```

## How to Add in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. For each variable:
   - Click **Add New**
   - Enter the **Name** (e.g., `SUPABASE_URL`)
   - Enter the **Value** (copy from above)
   - Select all environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

## Quick Copy Format

**SUPABASE_URL:**
```
https://ztqdsxgvgzlosufkdskk.supabase.co
```

**SUPABASE_SERVICE_ROLE_KEY:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0cWRzeGd2Z3psb3N1Zmtkc2trIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA0Nzg1MywiZXhwIjoyMDgyNjIzODUzfQ.pqcBcdKngMnmnniEquy_-twmL8cQO-FQfxmM3Iqat8M
```

**SQUARE_ACCESS_TOKEN:**
```
EAAAl9i9lm_bXoTLiGOjieXY7utChHfQqQ51bbz104oROWoAoByp4fDwxhFxsIQi
```

**SQUARE_ENVIRONMENT:**
```
sandbox
```

---

**Important:** After adding environment variables, you need to **redeploy** your project for them to take effect!

