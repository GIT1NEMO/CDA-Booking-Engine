import { supabase, checkSupabaseConnection } from '../../config/supabase';
import { Tour } from '../../types/api';

export const tourService = {
  getPublishedTours: async (): Promise<Tour[]> => {
    try {
      // Try to get data from localStorage first
      const cachedData = localStorage.getItem('published_tours');
      if (cachedData) {
        const tours = JSON.parse(cachedData);
        if (Array.isArray(tours) && tours.length > 0) {
          return tours;
        }
      }

      // Check Supabase connection with retries
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        console.warn('Using empty tours list due to connection issues');
        return [];
      }

      const { data, error } = await supabase
        .from('saved_tours')
        .select('tour_data')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        return [];
      }

      // Handle case where data is null or empty
      if (!data || data.length === 0) {
        return [];
      }

      // Transform and validate the data
      const tours = data
        .filter(item => item.tour_data)
        .map(item => item.tour_data as Tour);

      // Cache the results
      localStorage.setItem('published_tours', JSON.stringify(tours));

      return tours;
    } catch (error) {
      console.error('Error getting published tours:', error);
      // Return empty array instead of throwing to prevent UI breaks
      return [];
    }
  },

  // ... rest of the service methods remain the same
};