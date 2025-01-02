import { renderHook, act } from '@testing-library/react-hooks';
import { useSupabaseStorage } from '../../hooks/useSupabaseStorage';
import { tourService } from '../../services/database/tourService';

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

jest.mock('../../services/database/tourService');

describe('useSupabaseStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should load tour data when tourCode is provided', async () => {
    (tourService.getSavedTour as jest.Mock).mockResolvedValue({
      tour_data: mockTour,
      extras_data: mockExtras
    });

    const { result, waitForNextUpdate } = renderHook(() => 
      useSupabaseStorage('TEST001')
    );

    expect(result.current.loading).toBe(true);
    await waitForNextUpdate();

    expect(result.current.tour).toEqual(mockTour);
    expect(result.current.extras).toEqual(mockExtras);
    expect(result.current.loading).toBe(false);
  });

  test('should save tour data', async () => {
    (tourService.saveTour as jest.Mock).mockResolvedValue({
      tour_data: mockTour,
      extras_data: mockExtras
    });

    const { result } = renderHook(() => useSupabaseStorage());

    await act(async () => {
      await result.current.saveTourData(mockTour, mockExtras);
    });

    expect(tourService.saveTour).toHaveBeenCalledWith(mockTour, mockExtras);
    expect(result.current.tour).toEqual(mockTour);
    expect(result.current.extras).toEqual(mockExtras);
  });

  test('should handle errors when loading tour data', async () => {
    const error = new Error('Failed to load tour');
    (tourService.getSavedTour as jest.Mock).mockRejectedValue(error);

    const { result, waitForNextUpdate } = renderHook(() => 
      useSupabaseStorage('TEST001')
    );

    await waitForNextUpdate();

    expect(result.current.error).toBe('Failed to load tour data');
    expect(result.current.loading).toBe(false);
  });
});