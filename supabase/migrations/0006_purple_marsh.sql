/*
  # Update admin user
  
  This migration ensures the admin user exists with proper credentials.
  
  1. Updates existing admin user if found
  2. Creates new admin user if not found
*/

DO $$ 
DECLARE 
    existing_user_id UUID;
    new_user_id UUID;
BEGIN
    -- Check if admin user exists
    SELECT id INTO existing_user_id 
    FROM auth.users 
    WHERE email = 'admin@example.com';

    IF existing_user_id IS NOT NULL THEN
        -- Update existing user
        UPDATE auth.users
        SET 
            encrypted_password = crypt('admin123', gen_salt('bf')),
            email_confirmed_at = NOW(),
            updated_at = NOW(),
            raw_app_meta_data = jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
            is_super_admin = TRUE,
            role = 'authenticated'
        WHERE id = existing_user_id;

        -- Ensure admin user record exists
        INSERT INTO admin_users (id, email, is_super_admin)
        VALUES (existing_user_id, 'admin@example.com', TRUE)
        ON CONFLICT (email) 
        DO UPDATE SET is_super_admin = TRUE;
    ELSE
        -- Create new user if doesn't exist
        new_user_id := uuid_generate_v4();
        
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
            role,
            aud,
            confirmation_token
        ) VALUES (
            new_user_id,
            'admin@example.com',
            crypt('admin123', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
            '{}',
            TRUE,
            'authenticated',
            'authenticated',
            ''
        );

        -- Create admin user record
        INSERT INTO admin_users (id, email, is_super_admin)
        VALUES (new_user_id, 'admin@example.com', TRUE);
    END IF;
END $$;