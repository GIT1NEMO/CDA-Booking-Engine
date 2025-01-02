import { Tour } from '../types/api';
import { supabase } from '../config/supabase';

interface ApiCredentials {
  username: string;
  password: string;
  environment: 'sandbox' | 'production';
}

export const storageService = {
  getPublishedTour: async (tourCode: string): Promise<Tour | null> => {
    try {
      // First try localStorage as primary storage in WebContainer
      const published = localStorage.getItem('published_tours');
      if (published) {
        const tours = JSON.parse(published);
        const tour = tours.find((t: Tour) => t.tour_code === tourCode);
        if (tour) return tour;
      }

      // Try Supabase as secondary storage
      try {
        const { data, error } = await supabase
          .from('saved_tours')
          .select('tour_data')
          .eq('tour_code', tourCode)
          .single();

        if (!error && data?.tour_data) {
          // Cache the result in localStorage
          const tours = published ? JSON.parse(published) : [];
          tours.push(data.tour_data);
          localStorage.setItem('published_tours', JSON.stringify(tours));
          return data.tour_data;
        }
      } catch (supabaseError) {
        console.warn('Supabase fetch failed, using localStorage only:', supabaseError);
      }

      return null;
    } catch (error) {
      console.error('Error getting published tour:', error);
      return null;
    }
  },

  getTourExtras: async (tourCode: string): Promise<any[]> => {
    try {
      // First check localStorage
      const saved = localStorage.getItem('tour_extras');
      if (saved) {
        const allExtras = JSON.parse(saved);
        const extras = allExtras[tourCode];
        if (extras) return extras;
      }

      // Try Supabase as backup
      try {
        const { data, error } = await supabase
          .from('saved_tours')
          .select('extras_data')
          .eq('tour_code', tourCode)
          .single();

        if (!error && data?.extras_data) {
          // Cache in localStorage
          const allExtras = saved ? JSON.parse(saved) : {};
          allExtras[tourCode] = data.extras_data;
          localStorage.setItem('tour_extras', JSON.stringify(allExtras));
          return data.extras_data;
        }
      } catch (supabaseError) {
        console.warn('Supabase fetch failed, using localStorage only:', supabaseError);
      }

      return [];
    } catch (error) {
      console.error('Error getting tour extras:', error);
      return [];
    }
  },

  getCredentials: (): ApiCredentials | null => {
    try {
      const saved = localStorage.getItem('api_credentials');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error getting credentials:', error);
      return null;
    }
  },

  saveCredentials: (credentials: ApiCredentials): void => {
    try {
      localStorage.setItem('api_credentials', JSON.stringify(credentials));
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  },

  // New method to save tour data to both localStorage and Supabase
  saveTourData: async (tourCode: string, tourData: Tour, extrasData: any[] = []): Promise<void> => {
    try {
      // Save to localStorage first
      const tours = JSON.parse(localStorage.getItem('published_tours') || '[]');
      const tourIndex = tours.findIndex((t: Tour) => t.tour_code === tourCode);
      if (tourIndex >= 0) {
        tours[tourIndex] = tourData;
      } else {
        tours.push(tourData);
      }
      localStorage.setItem('published_tours', JSON.stringify(tours));

      const allExtras = JSON.parse(localStorage.getItem('tour_extras') || '{}');
      allExtras[tourCode] = extrasData;
      localStorage.setItem('tour_extras', JSON.stringify(allExtras));

      // Try to save to Supabase if available
      try {
        await supabase
          .from('saved_tours')
          .upsert({
            tour_code: tourCode,
            tour_data: tourData,
            extras_data: extrasData,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'tour_code'
          });
      } catch (supabaseError) {
        console.warn('Supabase save failed, data saved to localStorage only:', supabaseError);
      }
    } catch (error) {
      console.error('Error saving tour data:', error);
      throw error;
    }
  }
};