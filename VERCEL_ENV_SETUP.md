# Vercel Environment Variables - Quick Setup

## Required Environment Variable

Add this to your Vercel project to fix the connection pool issue:

```bash
SQLALCHEMY_POOL_CLASS=NullPool
```

## How to Add in Vercel

1. Go to https://vercel.com/dashboard
2. Select your `go-kigali` project
3. Click **Settings** → **Environment Variables**
4. Add new variable:
   - **Name**: `SQLALCHEMY_POOL_CLASS`
   - **Value**: `NullPool`
   - **Environment**: Production, Preview, Development (select all)
5. Click **Save**
6. Go to **Deployments** → Click **Redeploy** on latest deployment

## Alternative Configuration (If NullPool Doesn't Work)

If for some reason NullPool causes issues, use minimal pooling instead:

```bash
SQLALCHEMY_POOL_CLASS=QueuePool
SQL_POOL_SIZE=1
SQL_MAX_OVERFLOW=0
SQL_POOL_TIMEOUT=5
```

## Existing Environment Variables

Make sure you also have these set (you probably already do):

```bash
DATABASE_URL=postgresql://...
FLASK_ENV=production
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
```

## Verification

After adding the variable and redeploying:

1. Check logs: `vercel logs --follow`
2. Look for: No "QueuePool limit" errors
3. Test API: `curl https://go-kigali.vercel.app/api/v1/realtime/vehicles/realtime?lat=-1.9441&lng=30.0619&radius=5`

## That's It!

The code changes are already in place. Just add the environment variable and redeploy.
