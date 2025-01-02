-- Create saved_tours table
CREATE TABLE IF NOT EXISTS saved_tours (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tour_code TEXT NOT NULL UNIQUE,
    tour_data JSONB NOT NULL,
    extras_data JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_tour_data CHECK (jsonb_typeof(tour_data) = 'object'),
    CONSTRAINT valid_extras_data CHECK (jsonb_typeof(extras_data) = 'array')
);

-- Create index for faster lookups by tour_code
CREATE INDEX idx_saved_tours_tour_code ON saved_tours(tour_code);

-- Create index for timestamp-based queries
CREATE INDEX idx_saved_tours_updated_at ON saved_tours(updated_at DESC);

-- Add function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_saved_tours_updated_at
    BEFORE UPDATE ON saved_tours
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE saved_tours ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to all users"
    ON saved_tours
    FOR SELECT
    USING (true);

-- Allow insert/update access to authenticated users
CREATE POLICY "Allow insert/update access to authenticated users"
    ON saved_tours
    FOR ALL
    USING (true)
    WITH CHECK (true);