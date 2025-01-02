-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert initial admin user
DO $$
DECLARE
    user_id UUID;
BEGIN
    -- First create the user in auth.users
    INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        role
    ) VALUES (
        uuid_generate_v4(),
        'admin@example.com',
        crypt('admin123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        true,
        'authenticated'
    )
    RETURNING id INTO user_id;

    -- Then add them to admin_users
    INSERT INTO admin_users (
        id,
        email,
        is_super_admin
    ) VALUES (
        user_id,
        'admin@example.com',
        true
    );
END $$;