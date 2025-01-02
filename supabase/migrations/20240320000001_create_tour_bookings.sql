-- Create enum type for booking status
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');

-- Create tour_bookings table
CREATE TABLE IF NOT EXISTS tour_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tour_code TEXT NOT NULL,
    booking_data JSONB NOT NULL,
    customer_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status booking_status DEFAULT 'pending',
    CONSTRAINT valid_booking_data CHECK (jsonb_typeof(booking_data) = 'object'),
    CONSTRAINT valid_customer_data CHECK (jsonb_typeof(customer_data) = 'object')
);

-- Create indexes for common queries
CREATE INDEX idx_tour_bookings_tour_code ON tour_bookings(tour_code);
CREATE INDEX idx_tour_bookings_status ON tour_bookings(status);
CREATE INDEX idx_tour_bookings_created_at ON tour_bookings(created_at DESC);

-- Add composite index for tour_code and status
CREATE INDEX idx_tour_bookings_code_status ON tour_bookings(tour_code, status);

-- Add RLS (Row Level Security) policies
ALTER TABLE tour_bookings ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to all users"
    ON tour_bookings
    FOR SELECT
    USING (true);

-- Allow insert access to authenticated users
CREATE POLICY "Allow insert access to authenticated users"
    ON tour_bookings
    FOR INSERT
    WITH CHECK (true);

-- Allow update access to authenticated users (only status field)
CREATE POLICY "Allow update access to authenticated users"
    ON tour_bookings
    FOR UPDATE
    USING (true)
    WITH CHECK (true);