/*
  # Fix Admin User Policies

  1. Changes
    - Drops all existing policies to avoid conflicts
    - Creates new standardized policies with unique names
    - Ensures RLS is enabled
    
  2. Policies Created
    - admin_select_policy: For reading own data
    - admin_update_policy: For updating own data
    - admin_delete_policy: For deleting own data
*/

DO $$ 
BEGIN
    -- Drop ALL existing policies to avoid conflicts
    DROP POLICY IF EXISTS "Admin users can view own data" ON admin_users;
    DROP POLICY IF EXISTS "Admin users can read own data" ON admin_users;
    DROP POLICY IF EXISTS "Admin users can update own data" ON admin_users;
    DROP POLICY IF EXISTS "Admin users can delete own data" ON admin_users;
    DROP POLICY IF EXISTS "admin_read_own" ON admin_users;
    DROP POLICY IF EXISTS "admin_update_own" ON admin_users;
    DROP POLICY IF EXISTS "admin_delete_own" ON admin_users;
    
    -- Create new policies with unique names
    CREATE POLICY "admin_select_policy" 
        ON admin_users
        FOR SELECT
        TO authenticated
        USING (auth.uid() = id);

    CREATE POLICY "admin_update_policy"
        ON admin_users
        FOR UPDATE
        TO authenticated
        USING (auth.uid() = id)
        WITH CHECK (auth.uid() = id);

    CREATE POLICY "admin_delete_policy"
        ON admin_users
        FOR DELETE
        TO authenticated
        USING (auth.uid() = id);

    -- Ensure RLS is enabled
    ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
END $$;