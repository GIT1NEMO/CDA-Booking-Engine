import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LoadingState } from '../components/customer/LoadingState';
import { ErrorState } from '../components/customer/ErrorState';
import { BookingForm } from '../components/customer/BookingForm';
import { Tour } from '../types/api';
import { storageService } from '../services/storage';

export function CustomerBooking() {
  const { tourCode } = useParams();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTourData = async () => {
      if (!tourCode) {
        setError('No tour code provided');
        setLoading(false);
        return;
      }

      try {
        const tourData = await storageService.getPublishedTour(tourCode);
        if (!tourData) {
          setError('Tour not found');
          return;
        }

        setTour(tourData);
      } catch (err) {
        console.error('Error loading tour data:', err);
        setError('Failed to load tour data');
      } finally {
        setLoading(false);
      }
    };

    loadTourData();
  }, [tourCode]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !tour) {
    return <ErrorState message={error || 'Tour not found'} />;
  }

  return <BookingForm tour={tour} />;
}