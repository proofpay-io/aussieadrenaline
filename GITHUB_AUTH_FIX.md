# GitHub Authentication Issue - Fix

## Issue

The personal access token might be associated with a different GitHub account, or the repository permissions need to be checked.

## Solutions

### Option 1: Verify Token Permissions

1. Go to: https://github.com/settings/tokens
2. Find your token (or create a new one)
3. Make sure it has:
   - ✅ `repo` scope (full control of private repositories)
   - ✅ `workflow` scope (if using GitHub Actions)

### Option 2: Use Your Personal GitHub Username

If the token is for your personal account (not the `proofpay-io` organization), you might need to:

1. **Check which account the token belongs to:**
   - The token should be created by the account that has access to the repository

2. **If you're a member of the `proofpay-io` organization:**
   - Make sure your personal account has write access to the repository
   - Go to: https://github.com/proofpay-io/aussieadrenaline/settings/access
   - Verify your account has write permissions

### Option 3: Use GitHub CLI (Easiest)

```powershell
# Install GitHub CLI
winget install --id GitHub.cli

# Login (this handles authentication automatically)
gh auth login

# Then push
cd "C:\Users\user\ProofPay Cursor"
git push -u origin main
```

### Option 4: Manual Push with Credential Helper

1. **Remove token from URL** (for security):
   ```powershell
   git remote set-url origin https://github.com/proofpay-io/aussieadrenaline.git
   ```

2. **Push and enter credentials when prompted:**
   ```powershell
   git push -u origin main
   ```
   - Username: Your GitHub username (not `proofpay-io`)
   - Password: Your personal access token

### Option 5: Create New Token with Correct Permissions

1. Go to: https://github.com/settings/tokens/new
2. Name: "ProofPay Development"
3. Expiration: Choose your preference
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Generate token
6. Copy the new token
7. Use it when prompted for password during `git push`

## Security Note

⚠️ **Important**: The token in the remote URL should be removed after pushing for security. Run:

```powershell
git remote set-url origin https://github.com/proofpay-io/aussieadrenaline.git
```

This removes the token from the URL (it's stored in Git credential manager instead).

## Recommended: Use GitHub CLI

The easiest and most secure method is GitHub CLI:

```powershell
gh auth login
git push -u origin main
```

This handles authentication securely without exposing tokens.

