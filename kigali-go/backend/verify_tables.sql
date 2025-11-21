-- Quick verification query to check if all required tables exist
-- Run this in Supabase SQL Editor to verify your tables

SELECT 
    table_name,
    (SELECT COUNT(*) 
     FROM information_schema.columns 
     WHERE table_name = t.table_name 
     AND table_schema = 'public') as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
    AND table_name IN (
        'users', 
        'email_verification_tokens', 
        'password_reset_tokens',
        'token_blocklist',
        'reports',
        'vehicles',
        'zones',
        'stops',
        'trips',
        'fare_rules'
    )
ORDER BY table_name;

-- Check users table structure specifically
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'users'
ORDER BY ordinal_position;











