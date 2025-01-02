-- Reset and recreate admin user properly
DO $$ 
DECLARE 
    new_user_id UUID;
BEGIN
    -- Delete existing admin user if present
    DELETE FROM auth.users WHERE email = 'admin@example.com';
    DELETE FROM admin_users WHERE email = 'admin@example.com';

    -- Create new admin user
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
        aud
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
        'authenticated'
    )
    RETURNING id INTO new_user_id;

    -- Create admin user record
    INSERT INTO admin_users (
        id,
        email,
        is_super_admin
    ) VALUES (
        new_user_id,
        'admin@example.com',
        TRUE
    );
END $$;