import { supabase, checkSupabaseConnection } from '../../config/supabase';
import { Tour } from '../../types/api';

export const tourService = {
  saveTour: async (tour: Tour, extras: any[] = []) => {
    try {
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        throw new Error('Unable to connect to database');
      }

      const { data, error } = await supabase
        .from('saved_tours')
        .upsert({
          tour_code: tour.tour_code,
          tour_data: tour,
          extras_data: extras,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'tour_code'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving tour:', error);
      throw error;
    }
  },

  getPublishedTours: async (): Promise<Tour[]> => {
    try {
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        throw new Error('Unable to connect to database');
      }

      const { data, error } = await supabase
        .from('saved_tours')
        .select('tour_data')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      // Handle case where data is null or empty
      if (!data || data.length === 0) {
        return [];
      }

      // Transform and validate the data
      const tours = data
        .filter(item => item.tour_data) // Filter out any null or undefined tour_data
        .map(item => item.tour_data as Tour);

      return tours;
    } catch (error) {
      console.error('Error getting published tours:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to load published tours');
    }
  },

  getSavedTour: async (tourCode: string) => {
    try {
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        throw new Error('Unable to connect to database');
      }

      const { data, error } = await supabase
        .from('saved_tours')
        .select('*')
        .eq('tour_code', tourCode)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting saved tour:', error);
      throw error;
    }
  },

  deletePublishedTour: async (tourCode: string): Promise<boolean> => {
    try {
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        throw new Error('Unable to connect to database');
      }

      const { error } = await supabase
        .from('saved_tours')
        .delete()
        .eq('tour_code', tourCode);

      if (error) {
        console.error('Database error:', {
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`Database error: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting tour:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        error
      });
      throw error;
    }
  }
};