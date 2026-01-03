# Quick Start: Push to GitHub

## ✅ Everything is Ready!

Your project is configured and ready to push. Here's what to do:

## Step 1: Authenticate with GitHub

**Easiest method - Use GitHub CLI:**

```powershell
# Install GitHub CLI (if needed)
winget install --id GitHub.cli

# Login
gh auth login
# Choose: GitHub.com → HTTPS → Login with web browser

# Then push
cd "C:\Users\user\ProofPay Cursor"
git push -u origin main
```

**Alternative - Use Personal Access Token:**

1. Create token: https://github.com/settings/tokens
2. Generate new token (classic) with `repo` scope
3. Copy the token
4. Run: `git push -u origin main`
5. Username: `proofpay-io`
6. Password: **paste your token** (not your GitHub password)

## Step 2: Verify

Visit: https://github.com/proofpay-io/aussieadrenaline

You should see all your files!

## Step 3: Deploy to Vercel

1. Go to: https://vercel.com/dashboard
2. Click "Add New Project"
3. Import: `proofpay-io/aussieadrenaline`
4. Root Directory: `apps/api`
5. Add environment variables
6. Deploy!

---

**Your repository is ready at:** https://github.com/proofpay-io/aussieadrenaline.git

