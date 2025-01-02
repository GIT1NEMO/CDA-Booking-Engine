-- Drop and recreate auth schema properly
CREATE SCHEMA IF NOT EXISTS auth;

-- Ensure auth.users table exists with correct structure
CREATE TABLE IF NOT EXISTS auth.users (
    id uuid NOT NULL PRIMARY KEY,
    email text,
    encrypted_password text,
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token text,
    confirmation_sent_at timestamp with time zone,
    recovery_token text,
    recovery_sent_at timestamp with time zone,
    email_change_token_new text,
    email_change text,
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text,
    phone_confirmed_at timestamp with time zone,
    phone_change text,
    phone_change_token text,
    phone_change_sent_at timestamp with time zone,
    email_change_token_current text,
    email_change_confirm_status smallint,
    banned_until timestamp with time zone,
    reauthentication_token text,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false,
    deleted_at timestamp with time zone,
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_phone_key UNIQUE (phone)
);

-- Create auth.refresh_tokens table
CREATE TABLE IF NOT EXISTS auth.refresh_tokens (
    id bigint NOT NULL,
    token text,
    user_id uuid REFERENCES auth.users(id),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent text,
    session_id uuid
);

-- Create necessary indexes
CREATE INDEX IF NOT EXISTS refresh_tokens_token_idx ON auth.refresh_tokens (token);
CREATE INDEX IF NOT EXISTS refresh_tokens_user_id_idx ON auth.refresh_tokens (user_id);
CREATE INDEX IF NOT EXISTS users_email_idx ON auth.users (email);
CREATE INDEX IF NOT EXISTS users_instance_id_idx ON auth.users (id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA auth TO postgres, anon, authenticated, service_role;

-- Create initial admin user if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@example.com') THEN
        INSERT INTO auth.users (
            id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin
        ) VALUES (
            gen_random_uuid(),
            'admin@example.com',
            crypt('admin123', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider":"email","providers":["email"]}',
            '{"is_admin":true}',
            true
        );
    END IF;
END $$;