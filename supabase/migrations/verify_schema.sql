-- ============================================================================
-- GENESIS - SUPABASE SCHEMA VERIFICATION QUERIES
-- Run these in Supabase SQL Editor to verify everything is set up correctly
-- ============================================================================

-- 1. Check all tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Expected output:
-- credit_transactions
-- profiles
-- projects
-- user_env_vars

-- ============================================================================

-- 2. Check RLS is enabled on all tables
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'credit_transactions', 'projects', 'user_env_vars');

-- Expected: All should show rowsecurity = true

-- ============================================================================

-- 3. Check all indexes were created
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'credit_transactions', 'projects', 'user_env_vars')
ORDER BY tablename, indexname;

-- Expected indexes:
-- idx_credit_transactions_created_at
-- idx_credit_transactions_user_id
-- idx_profiles_email
-- idx_projects_created_at
-- idx_projects_user_id
-- idx_user_env_vars_key
-- idx_user_env_vars_user_id

-- ============================================================================

-- 4. Check all triggers were created
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Expected triggers:
-- on_auth_user_created (on auth.users)
-- update_profiles_updated_at (on profiles)
-- update_projects_updated_at (on projects)
-- update_user_env_vars_updated_at (on user_env_vars)

-- ============================================================================

-- 5. Check all functions were created
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('handle_new_user', 'update_updated_at_column');

-- Expected functions:
-- handle_new_user
-- update_updated_at_column

-- ============================================================================

-- 6. Check RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Expected policies per table:
-- profiles: 2 policies (view, update)
-- credit_transactions: 1 policy (view)
-- projects: 4 policies (view, insert, update, delete)
-- user_env_vars: 4 policies (view, insert, update, delete)

-- ============================================================================

-- 7. Test profile auto-creation (DO NOT RUN - just for reference)
-- When a user signs up via auth, a profile should be auto-created
-- You can verify this after your first user signup

-- ============================================================================

-- 8. Check table structures (columns and types)
-- profiles table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- credit_transactions table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'credit_transactions'
ORDER BY ordinal_position;

-- projects table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'projects'
ORDER BY ordinal_position;

-- user_env_vars table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'user_env_vars'
ORDER BY ordinal_position;

-- ============================================================================
-- ✅ If all queries return expected results, your schema is correctly set up!
-- ============================================================================
