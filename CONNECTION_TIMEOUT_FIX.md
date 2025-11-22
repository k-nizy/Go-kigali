# Connection Timeout Troubleshooting Guide

## Current Error

```
connection to server at "aws-1-eu-central-1.pooler.supabase.com" (3.71.225.44), port 5432 failed: timeout expired
```

## Root Cause

This is a **connection timeout** issue, not a pool exhaustion issue. The database connection is timing out before it can be established.

## Checklist to Fix

### ✅ Step 1: Verify Environment Variable is Set

1. Go to https://vercel.com/dashboard
2. Select your `go-kigali` project
3. Click **Settings** → **Environment Variables**
4. Check if `SQLALCHEMY_POOL_CLASS=NullPool` exists
5. If NOT, add it now and redeploy

### ✅ Step 2: Check Your Database URL

Your connection string should use the **transaction pooler** (port 6543), not a direct connection (port 5432).

**Current (from logs):** `aws-1-eu-central-1.pooler.supabase.com:5432`  
**Should be:** `aws-1-eu-central-1.pooler.supabase.com:6543`

#### How to Fix:

1. Go to Supabase Dashboard → Project Settings → Database
2. Find "Connection Pooling" section
3. Copy the **Transaction** mode connection string
4. Update `DATABASE_URL` in Vercel environment variables
5. Redeploy

Example connection string:
```
postgresql://postgres.[PROJECT]:[PASSWORD]@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### ✅ Step 3: Check Supabase Connection Limits

1. Go to Supabase Dashboard
2. Click on your project
3. Go to **Database** → **Connection Pooling**
4. Check "Pool Mode" - should be **Transaction**
5. Check "Pool Size" - should be at least 15
6. Check "Active Connections" - if it's maxed out, you need to wait or upgrade

### ✅ Step 4: Restart/Pause Supabase Database (If Overwhelmed)

If your database is overwhelmed from previous connection attempts:

1. Go to Supabase Dashboard → Project Settings
2. Click **Pause Project**
3. Wait 30 seconds
4. Click **Restore Project**
5. This will clear all stuck connections

### ✅ Step 5: Deploy Latest Code

The latest code includes:
- Increased connection timeout (30 seconds)
- TCP keepalive settings
- Better connection handling

```bash
cd c:\Users\Qevin\OneDrive\Documents\Go-kigali
git add kigali-go/backend/app/config.py
git commit -m "Fix: Increase connection timeout and add keepalive settings"
git push origin main
```

## Verification

After deploying, test with:

```bash
curl "https://go-kigali.vercel.app/api/v1/realtime/vehicles/realtime?lat=-1.9441&lng=30.0619&radius=5"
```

## If Still Failing

### Option A: Use Direct Connection (Temporary)

If the pooler is having issues, temporarily use direct connection:

1. In Supabase, copy the **Direct Connection** string
2. Update `DATABASE_URL` in Vercel
3. Keep `SQLALCHEMY_POOL_CLASS=NullPool`
4. Redeploy

### Option B: Check Vercel Region

Vercel might be deploying to a region far from your Supabase database (eu-central-1).

1. Go to Vercel → Project Settings → General
2. Check "Function Region"
3. If it's not `fra1` (Frankfurt, closest to eu-central-1), change it
4. Redeploy

### Option C: Increase Supabase Plan

If you're on the free tier and hitting limits:

1. Supabase free tier: 60 connections max
2. Consider upgrading to Pro: 200 connections
3. Or use Supabase's connection pooler more effectively

## Summary

**Most Likely Fix:**
1. Change DATABASE_URL to use port **6543** (transaction pooler)
2. Ensure `SQLALCHEMY_POOL_CLASS=NullPool` is set
3. Deploy latest code with increased timeout
4. Redeploy

**Quick Command:**
```bash
# After updating environment variables in Vercel dashboard
git add .
git commit -m "Fix: Connection timeout with increased timeout and keepalive"
git push origin main
```

## Need Help?

If none of these work, please share:
1. Your current `DATABASE_URL` format (hide the password)
2. Screenshot of Vercel environment variables
3. Screenshot of Supabase connection pooling settings
