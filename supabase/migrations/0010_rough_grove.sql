-- Reset and properly configure auth schema
DO $$ 
DECLARE 
    new_user_id UUID;
BEGIN
    -- Ensure auth schema exists and has proper permissions
    CREATE SCHEMA IF NOT EXISTS auth;
    GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
    GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, anon, authenticated, service_role;
    GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO postgres, anon, authenticated, service_role;
    GRANT ALL ON ALL FUNCTIONS IN SCHEMA auth TO postgres, anon, authenticated, service_role;

    -- Ensure required extensions
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    -- Delete existing admin user to start fresh
    DELETE FROM auth.users WHERE email = 'admin@example.com';
    DELETE FROM admin_users WHERE email = 'admin@example.com';

    -- Create new admin user with complete required fields
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        role,
        aud,
        confirmation_token,
        recovery_token,
        email_change_token_current,
        email_change_token_new,
        last_sign_in_at,
        confirmation_sent_at,
        invited_at,
        phone,
        phone_confirmed_at,
        phone_change,
        phone_change_token,
        phone_change_sent_at,
        email_change,
        email_change_sent_at,
        banned_until,
        reauthentication_token,
        reauthentication_sent_at,
        is_sso_user,
        deleted_at
    ) VALUES (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000000',
        'admin@example.com',
        crypt('admin123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        TRUE,
        'authenticated',
        'authenticated',
        '',
        '',
        '',
        '',
        NOW(),
        NOW(),
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        FALSE,
        NULL
    )
    RETURNING id INTO new_user_id;

    -- Create admin user record
    INSERT INTO admin_users (
        id,
        email,
        is_super_admin,
        created_at,
        updated_at
    ) VALUES (
        new_user_id,
        'admin@example.com',
        TRUE,
        NOW(),
        NOW()
    );

    -- Set up RLS policies for admin_users
    ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Admin users can view own data" ON admin_users;
    CREATE POLICY "Admin users can view own data" 
        ON admin_users
        FOR SELECT
        USING (auth.uid() = id);

    DROP POLICY IF EXISTS "Admin users can update own data" ON admin_users;
    CREATE POLICY "Admin users can update own data"
        ON admin_users
        FOR UPDATE
        USING (auth.uid() = id)
        WITH CHECK (auth.uid() = id);
END $$;