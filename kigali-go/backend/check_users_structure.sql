-- Check users table structure
-- Run this in Supabase SQL Editor to verify the table structure matches the code

SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'users'
ORDER BY ordinal_position;

-- Also check if we can insert a test user (then delete it)
-- This will help identify any constraint issues
BEGIN;
    INSERT INTO users (name, email, password_hash, uuid)
    VALUES ('Test User', 'test@example.com', 'test_hash', gen_random_uuid()::text)
    ON CONFLICT (email) DO NOTHING;
    
    SELECT * FROM users WHERE email = 'test@example.com';
    
    DELETE FROM users WHERE email = 'test@example.com';
COMMIT;









