/*
  # Fix Admin Policies

  1. Policy Cleanup
    - Drops all existing admin policies to avoid conflicts
    - Re-creates policies with consistent names and permissions
    
  2. Changes
    - Standardizes policy names
    - Ensures proper TO clauses
    - Adds proper USING and WITH CHECK clauses
*/

DO $$ 
BEGIN
    -- Drop ALL existing policies to start fresh
    DROP POLICY IF EXISTS "Admin users can view own data" ON admin_users;
    DROP POLICY IF EXISTS "Admin users can read own data" ON admin_users;
    DROP POLICY IF EXISTS "Admin users can update own data" ON admin_users;
    DROP POLICY IF EXISTS "Admin users can delete own data" ON admin_users;
    
    -- Create standardized policies
    CREATE POLICY "admin_read_own" 
        ON admin_users
        FOR SELECT
        TO authenticated
        USING (auth.uid() = id);

    CREATE POLICY "admin_update_own"
        ON admin_users
        FOR UPDATE
        TO authenticated
        USING (auth.uid() = id)
        WITH CHECK (auth.uid() = id);

    CREATE POLICY "admin_delete_own"
        ON admin_users
        FOR DELETE
        TO authenticated
        USING (auth.uid() = id);

    -- Ensure RLS is enabled
    ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
END $$;