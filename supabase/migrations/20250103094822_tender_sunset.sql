-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow read access to all users" ON tour_commissions;
DROP POLICY IF EXISTS "Allow insert/update access to authenticated users" ON tour_commissions;

-- Create new, more specific policies
CREATE POLICY "Enable read access for all users"
    ON tour_commissions FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON tour_commissions FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
    ON tour_commissions FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users"
    ON tour_commissions FOR DELETE
    TO authenticated
    USING (true);

-- Grant necessary permissions
GRANT ALL ON tour_commissions TO authenticated;
GRANT SELECT ON tour_commissions TO anon;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_tour_commissions_updated_at 
    ON tour_commissions(updated_at DESC);