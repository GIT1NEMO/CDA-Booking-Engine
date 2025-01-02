import { supabase } from '../../config/supabase';

export const bookingService = {
  createBooking: async (
    tourCode: string,
    bookingData: any,
    customerData: any
  ) => {
    try {
      const { data, error } = await supabase
        .from('tour_bookings')
        .insert({
          tour_code: tourCode,
          booking_data: bookingData,
          customer_data: customerData,
          status: 'pending'
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  getBooking: async (bookingId: string) => {
    try {
      const { data, error } = await supabase
        .from('tour_bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting booking:', error);
      throw error;
    }
  },

  updateBookingStatus: async (bookingId: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      const { data, error } = await supabase
        .from('tour_bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  getTourBookings: async (tourCode: string) => {
    try {
      const { data, error } = await supabase
        .from('tour_bookings')
        .select('*')
        .eq('tour_code', tourCode)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting tour bookings:', error);
      throw error;
    }
  }
};