# Fix Vercel Deployment - Show Vehicles on Deployed App

## Current Issue
The deployed app at `https://go-kigali.vercel.app` is not showing vehicles in the "Nearby Vehicles" panel.

## Root Cause
The `REACT_APP_API_URL` environment variable might be set in Vercel, causing the frontend to make incorrect API calls.

## Solution

### Step 1: Check Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `go-kigali` project
3. Go to **Settings** → **Environment Variables**
4. Look for `REACT_APP_API_URL`

### Step 2: Remove or Clear REACT_APP_API_URL

**Option A: Remove it completely (Recommended)**
- If `REACT_APP_API_URL` exists, **delete it**

**Option B: Set it to empty string**
- Set `REACT_APP_API_URL` to an empty value (no text)

### Step 3: Redeploy

After changing the environment variable:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click the **⋯** (three dots) menu
4. Select **Redeploy**

OR simply push a new commit:

```bash
git add .
git commit -m "Update frontend environment configuration"
git push origin main
```

Vercel will automatically redeploy.

### Step 4: Test

Once the deployment completes:

1. Open `https://go-kigali.vercel.app`
2. The "Nearby Vehicles" panel should now show vehicles
3. No more connection errors!

## Why This Works

Your Vercel project has both frontend and backend in the same deployment:

```
vercel.json rewrites:
/api/* → backend (Python)
/*     → frontend (React)
```

When `REACT_APP_API_URL` is **not set** or **empty**:
- Frontend makes requests to `/api/v1/realtime/vehicles/realtime`
- Vercel rewrites this to the backend automatically
- Everything works! ✅

When `REACT_APP_API_URL` is set to `https://go-kigali.vercel.app`:
- Frontend makes requests to `https://go-kigali.vercel.app/api/v1/realtime/vehicles/realtime`
- This works, but it's unnecessary and can cause CORS issues
- Better to use relative URLs

## Summary

| Environment | REACT_APP_API_URL Value |
|-------------|------------------------|
| **Vercel Deployment** | *(not set)* or empty |
| **Local Dev → Vercel Backend** | `https://go-kigali.vercel.app` |
| **Local Dev → Local Backend** | `http://localhost:5000` |

## Quick Check

After redeployment, open your browser console on `https://go-kigali.vercel.app` and check the Network tab:

✅ **Good:** Requests go to `/api/v1/realtime/vehicles/realtime` (relative URL)
❌ **Bad:** Requests go to `https://go-kigali.vercel.app/api/v1/realtime/vehicles/realtime` (absolute URL)
