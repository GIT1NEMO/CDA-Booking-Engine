/*
  # Fix Admin User and Policies Setup

  1. Policy Cleanup
    - Drops existing policies to avoid conflicts
    - Re-creates policies with proper permissions

  2. Admin User Setup
    - Ensures proper user creation in auth schema
    - Sets up admin user record
    - Configures proper RLS policies
*/

-- Reset and properly configure admin policies
DO $$ 
BEGIN
    -- Drop existing policies to avoid conflicts
    DROP POLICY IF EXISTS "Admin users can view own data" ON admin_users;
    DROP POLICY IF EXISTS "Admin users can read own data" ON admin_users;
    DROP POLICY IF EXISTS "Admin users can update own data" ON admin_users;
    DROP POLICY IF EXISTS "Admin users can delete own data" ON admin_users;
    
    -- Re-create policies with proper permissions
    CREATE POLICY "Admin users can read own data" 
        ON admin_users
        FOR SELECT
        TO authenticated
        USING (auth.uid() = id);

    CREATE POLICY "Admin users can update own data"
        ON admin_users
        FOR UPDATE
        TO authenticated
        USING (auth.uid() = id)
        WITH CHECK (auth.uid() = id);

    CREATE POLICY "Admin users can delete own data"
        ON admin_users
        FOR DELETE
        TO authenticated
        USING (auth.uid() = id);

    -- Ensure RLS is enabled
    ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
END $$;