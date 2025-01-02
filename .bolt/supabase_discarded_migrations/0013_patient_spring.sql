-- Reset and properly configure admin authentication
DO $$ 
BEGIN
    -- Drop existing policies first to avoid conflicts
    DROP POLICY IF EXISTS "admin_select_policy" ON admin_users;
    DROP POLICY IF EXISTS "admin_update_policy" ON admin_users;
    DROP POLICY IF EXISTS "admin_delete_policy" ON admin_users;

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

    -- Create or update admin user record
    WITH new_user AS (
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            recovery_token,
            email_change_token_current,
            email_change_token_new,
            invited_at,
            confirmation_sent_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'admin@example.com',
            crypt('admin123', gen_salt('bf')),
            NOW(),
            NOW(),
            '{"provider":"email","providers":["email"]}',
            '{"is_admin":true}',
            NOW(),
            NOW(),
            '',
            '',
            '',
            '',
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
    )
    INSERT INTO admin_users (
        id,
        email,
        is_super_admin,
        created_at,
        updated_at
    )
    SELECT 
        id,
        'admin@example.com',
        TRUE,
        NOW(),
        NOW()
    FROM new_user
    ON CONFLICT (id) DO UPDATE
    SET 
        is_super_admin = TRUE,
        updated_at = NOW();

END $$;