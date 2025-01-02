-- Function to get all bookings for a tour
CREATE OR REPLACE FUNCTION get_tour_bookings(p_tour_code TEXT)
RETURNS TABLE (
    id UUID,
    tour_code TEXT,
    booking_data JSONB,
    customer_data JSONB,
    created_at TIMESTAMPTZ,
    status booking_status
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tour_bookings.id,
        tour_bookings.tour_code,
        tour_bookings.booking_data,
        tour_bookings.customer_data,
        tour_bookings.created_at,
        tour_bookings.status
    FROM tour_bookings
    WHERE tour_bookings.tour_code = p_tour_code
    ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update booking status
CREATE OR REPLACE FUNCTION update_booking_status(
    p_booking_id UUID,
    p_status booking_status
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE tour_bookings
    SET status = p_status
    WHERE id = p_booking_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get saved tour with extras
CREATE OR REPLACE FUNCTION get_saved_tour_with_extras(p_tour_code TEXT)
RETURNS TABLE (
    id UUID,
    tour_code TEXT,
    tour_data JSONB,
    extras_data JSONB,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        saved_tours.id,
        saved_tours.tour_code,
        saved_tours.tour_data,
        saved_tours.extras_data,
        saved_tours.updated_at
    FROM saved_tours
    WHERE saved_tours.tour_code = p_tour_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;