# Connect Local Backend to Production Database

## Problem
You are currently running the backend locally, which by default uses a local **SQLite** database (`kigali_go_dev.db`).
The deployed Vercel app uses a **Supabase (PostgreSQL)** database.

Because they are using different databases, vehicles you create or simulate locally **will not appear** on the deployed app.

## Solution
To see your local simulations on the deployed app, you need to connect your local backend to the **same Supabase database** that the production app uses.

## Steps to Fix

### 1. Get your Supabase Connection String
You can find this in your Vercel project settings or Supabase dashboard.
It looks like this:
`postgres://postgres.xxxx:password@aws-0-region.pooler.supabase.com:6543/postgres?sslmode=require`

### 2. Configure Local Backend
Create or edit the file `kigali-go/backend/.env`:

```bash
# kigali-go/backend/.env

# Paste your Supabase URL here
DATABASE_URL=postgres://postgres.xxxx:password@aws-0-region.pooler.supabase.com:6543/postgres?sslmode=require

# Optional: Set other secrets if needed
SECRET_KEY=dev-secret-key-change-in-production
JWT_SECRET_KEY=jwt-secret-key-change-in-production
```

### 3. Restart Local Backend
Stop your local backend (Ctrl+C) and start it again:

```bash
cd kigali-go/backend
# If using venv
venv\Scripts\activate
python run.py
```

### 4. Run Simulation
Now that your local backend is connected to Supabase, any data you generate will be saved to the cloud.

You can trigger the simulation via the API or by running the simulation script if you have one.
If you are using the frontend to trigger it (if that feature exists), ensure your local frontend is connected to your local backend (which is now connected to Supabase).

### 5. Verify on Deployed App
Open `https://go-kigali.vercel.app`.
You should now see the vehicles moving!

## Important Notes
- **Latency**: Connecting to a cloud database from your local machine will be slower than SQLite. This is normal.
- **Data Safety**: You are now writing to the **production database**. Be careful not to delete important data.
- **Frontend Config**: Your local frontend (`.env.local`) can point to either your local backend (`http://localhost:5000`) or the Vercel backend (`https://go-kigali.vercel.app`).
    - If pointing to **Local Backend**: You can trigger simulations locally and see them in Prod.
    - If pointing to **Vercel Backend**: You cannot trigger "local" simulations because the Vercel backend is read-only (or doesn't have the simulation running continuously).
