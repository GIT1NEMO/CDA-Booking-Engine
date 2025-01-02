import { describe, expect, test, beforeEach } from '@jest/globals';
import { tourService } from '../../services/database/tourService';
import { supabase } from '../../config/supabase';

const mockTour = {
  tour_code: 'TEST001',
  name: 'Test Tour',
  operator: 'TEST_OP',
  description: 'Test tour description',
  bases: [],
  times: []
};

const mockExtras = [
  {
    id: '1',
    name: 'Extra 1',
    price: 100
  }
];

describe('Tour Service', () => {
  beforeEach(async () => {
    // Clean up before each test
    await supabase.from('saved_tours').delete().eq('tour_code', mockTour.tour_code);
  });

  test('should save a tour with extras', async () => {
    const result = await tourService.saveTour(mockTour, mockExtras);
    expect(result).toBeTruthy();

    const saved = await tourService.getSavedTour(mockTour.tour_code);
    expect(saved.tour_data.tour_code).toBe(mockTour.tour_code);
    expect(saved.extras_data).toHaveLength(1);
  });

  test('should update existing tour', async () => {
    await tourService.saveTour(mockTour, mockExtras);
    
    const updatedTour = {
      ...mockTour,
      name: 'Updated Tour Name'
    };
    
    await tourService.saveTour(updatedTour, mockExtras);
    const saved = await tourService.getSavedTour(mockTour.tour_code);
    expect(saved.tour_data.name).toBe('Updated Tour Name');
  });

  test('should get all saved tours', async () => {
    await tourService.saveTour(mockTour, mockExtras);
    
    const tours = await tourService.getAllSavedTours();
    expect(tours.length).toBeGreaterThan(0);
    expect(tours[0].tour_code).toBe(mockTour.tour_code);
  });

  test('should delete saved tour', async () => {
    await tourService.saveTour(mockTour, mockExtras);
    await tourService.deleteSavedTour(mockTour.tour_code);
    
    const saved = await tourService.getSavedTour(mockTour.tour_code);
    expect(saved).toBeNull();
  });
});