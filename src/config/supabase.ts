import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Configure Supabase client with retry logic
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: true,
    detectSessionInUrl: false
  },
  db: {
    schema: 'public'
  },
  global: {
    fetch: (...args) => {
      return fetch(...args).catch(err => {
        console.warn('Supabase fetch failed:', err);
        throw new Error('Unable to connect to database. Please check your connection and try again.');
      });
    }
  }
});

// Enhanced connection check with retries
export const checkSupabaseConnection = async (retries = 3): Promise<boolean> => {
  for (let i = 0; i < retries; i++) {
    try {
      const { data, error } = await supabase.from('saved_tours').select('count');
      
      if (error) {
        console.warn('Supabase connection attempt failed:', {
          attempt: i + 1,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        if (i === retries - 1) {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        continue;
      }
      
      return true;
    } catch (error) {
      if (i === retries - 1) {
        console.error('Supabase connection failed after retries:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          error
        });
        return false;
      }
    }
  }
  
  return false;
};