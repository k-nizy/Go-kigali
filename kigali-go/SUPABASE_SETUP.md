# Supabase Database Setup Guide

## Quick Setup Instructions

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard/project/uritamepdeesfmdebixi/database/tables

2. **Open the SQL Editor**: Click on "SQL Editor" in the left sidebar

3. **Run the Setup Script**: Copy and paste the contents of `backend/supabase_setup.sql` into the SQL Editor and click "Run"

4. **Verify Tables**: After running, check the "Tables" section to confirm all tables were created:
   - `users`
   - `email_verification_tokens`
   - `password_reset_tokens`
   - `token_blocklist`
   - `reports`
   - `vehicles`
   - `zones`
   - `stops`
   - `trips`
   - `fare_rules`

## What the Script Does

- Creates all required database tables
- Sets up proper indexes for performance
- Creates foreign key relationships
- Sets up automatic `updated_at` timestamp triggers
- Grants necessary permissions

## Troubleshooting

If you get errors:

1. **"relation already exists"**: Some tables might already exist. The script uses `CREATE TABLE IF NOT EXISTS` so it should be safe, but you can drop existing tables first if needed.

2. **Permission errors**: Make sure you're running as the `postgres` user or have proper permissions.

3. **Extension errors**: The script tries to enable UUID extension. If it fails, you can skip that line as Supabase might already have it enabled.

## After Setup

Once tables are created, your Vercel deployment should be able to connect and create users. Test by:

1. Going to https://go-kigali.vercel.app/signup
2. Try creating an account
3. Check Vercel function logs if there are still errors

## Manual Table Creation (Alternative)

If the script doesn't work, you can create tables manually through the Supabase dashboard:

1. Go to "Table Editor"
2. Click "New Table"
3. Create each table with the columns specified in the SQL script

