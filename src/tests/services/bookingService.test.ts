import { describe, expect, test, beforeEach } from '@jest/globals';
import { bookingService } from '../../services/database/bookingService';
import { supabase } from '../../config/supabase';

const mockBookingData = {
  tour_code: 'TEST001',
  booking_data: {
    date: '2024-03-20',
    adults: 2,
    children: 1,
    total_price: 299.99
  },
  customer_data: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890'
  }
};

describe('Booking Service', () => {
  beforeEach(async () => {
    // Clean up before each test
    await supabase
      .from('tour_bookings')
      .delete()
      .eq('tour_code', mockBookingData.tour_code);
  });

  test('should create a new booking', async () => {
    const result = await bookingService.createBooking(
      mockBookingData.tour_code,
      mockBookingData.booking_data,
      mockBookingData.customer_data
    );
    
    expect(result).toBeTruthy();
    expect(result[0].status).toBe('pending');
  });

  test('should get booking by ID', async () => {
    const created = await bookingService.createBooking(
      mockBookingData.tour_code,
      mockBookingData.booking_data,
      mockBookingData.customer_data
    );
    
    const booking = await bookingService.getBooking(created[0].id);
    expect(booking.tour_code).toBe(mockBookingData.tour_code);
    expect(booking.status).toBe('pending');
  });

  test('should update booking status', async () => {
    const created = await bookingService.createBooking(
      mockBookingData.tour_code,
      mockBookingData.booking_data,
      mockBookingData.customer_data
    );
    
    await bookingService.updateBookingStatus(created[0].id, 'confirmed');
    const updated = await bookingService.getBooking(created[0].id);
    expect(updated.status).toBe('confirmed');
  });

  test('should get all bookings for a tour', async () => {
    await bookingService.createBooking(
      mockBookingData.tour_code,
      mockBookingData.booking_data,
      mockBookingData.customer_data
    );
    
    const bookings = await bookingService.getTourBookings(mockBookingData.tour_code);
    expect(bookings.length).toBeGreaterThan(0);
    expect(bookings[0].tour_code).toBe(mockBookingData.tour_code);
  });
});