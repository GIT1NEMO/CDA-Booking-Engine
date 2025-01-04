/*
  # Create Tour Commissions Table

  1. New Tables
    - `tour_commissions`
      - `tour_code` (text, primary key)
      - `adult_rate` (decimal)
      - `child_rate` (decimal)
      - `family_rate` (decimal)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `tour_commissions` table
    - Add policies for authenticated users to read/write commission data
*/

-- Create tour_commissions table
CREATE TABLE IF NOT EXISTS tour_commissions (
    tour_code TEXT PRIMARY KEY REFERENCES saved_tours(tour_code) ON DELETE CASCADE,
    adult_rate DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (adult_rate >= 0 AND adult_rate <= 100),
    child_rate DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (child_rate >= 0 AND child_rate <= 100),
    family_rate DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (family_rate >= 0 AND family_rate <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_tour_commissions_tour_code ON tour_commissions(tour_code);

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_tour_commissions_updated_at
    BEFORE UPDATE ON tour_commissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE tour_commissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to all users"
    ON tour_commissions
    FOR SELECT
    USING (true);

CREATE POLICY "Allow insert/update access to authenticated users"
    ON tour_commissions
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Add function to get commission rates
CREATE OR REPLACE FUNCTION get_tour_commission_rates(p_tour_code TEXT)
RETURNS TABLE (
    adult_rate DECIMAL,
    child_rate DECIMAL,
    family_rate DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tc.adult_rate,
        tc.child_rate,
        tc.family_rate
    FROM tour_commissions tc
    WHERE tc.tour_code = p_tour_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;