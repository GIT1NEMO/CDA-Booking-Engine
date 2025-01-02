import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Configure Supabase client for WebContainer environment
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // Disable session persistence in WebContainer
    autoRefreshToken: true,
    detectSessionInUrl: false // Disable URL session detection in WebContainer
  },
  db: {
    schema: 'public'
  },
  global: {
    fetch: fetch.bind(globalThis) // Explicitly bind fetch to global context
  }
});

// Enhanced connection check with detailed error reporting
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('saved_tours').select('count');
    
    if (error) {
      console.error('Supabase connection error:', {
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Supabase connection error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      error
    });
    return false;
  }
};