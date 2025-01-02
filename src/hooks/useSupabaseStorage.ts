import { useState, useEffect } from 'react';
import { tourService } from '../services/database/tourService';
import { Tour } from '../types/api';

export function useSupabaseStorage(tourCode?: string) {
  const [tour, setTour] = useState<Tour | null>(null);
  const [extras, setExtras] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tourCode) return;

    const loadTourData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await tourService.getSavedTour(tourCode);
        if (data) {
          setTour(data.tour_data);
          setExtras(data.extras_data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tour data');
      } finally {
        setLoading(false);
      }
    };

    loadTourData();
  }, [tourCode]);

  const saveTourData = async (tourData: Tour, extrasData: any[] = []) => {
    setLoading(true);
    setError(null);
    try {
      await tourService.saveTour(tourData, extrasData);
      setTour(tourData);
      setExtras(extrasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save tour data');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    tour,
    extras,
    loading,
    error,
    saveTourData
  };
}