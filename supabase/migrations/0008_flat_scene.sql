-- Reset and recreate admin user with proper schema setup
DO $$ 
DECLARE 
    new_user_id UUID;
BEGIN
    -- Delete existing admin user if present to start fresh
    DELETE FROM auth.users WHERE email = 'admin@example.com';
    DELETE FROM admin_users WHERE email = 'admin@example.com';

    -- Create new admin user with all required fields
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
        confirmation_sent_at
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
        NOW()
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

    -- Grant necessary permissions
    GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
    GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, anon, authenticated, service_role;
    GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO postgres, anon, authenticated, service_role;
    GRANT ALL ON ALL FUNCTIONS IN SCHEMA auth TO postgres, anon, authenticated, service_role;
END $$;