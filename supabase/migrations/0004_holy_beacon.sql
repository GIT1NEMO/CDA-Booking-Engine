/*
  # Set up authentication

  1. Enable email auth
  2. Create admin role and policies
  3. Create initial admin user table
*/

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    is_super_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin users can view own data" 
    ON admin_users
    FOR SELECT
    USING (auth.uid() = id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();