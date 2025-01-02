import { supabase } from '../config/supabase';

beforeAll(async () => {
  // Clean up test data before running tests
  await supabase.from('saved_tours').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('tour_bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
});

afterAll(async () => {
  // Clean up test data after running tests
  await supabase.from('saved_tours').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('tour_bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
});