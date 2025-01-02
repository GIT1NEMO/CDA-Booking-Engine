import React, { useState, useEffect } from 'react';
import { Tour, TourExtra } from '../../types/api';
import { Package } from 'lucide-react';
import { createApiClient } from '../../services/api';
import { storageService } from '../../services/storage';
import { TourOptionsForm } from './TourOptionsForm';
import { ExtraOptionsForm } from './ExtraOptionsForm';
import { SavedExtrasViewer } from './SavedExtrasViewer';
import { JsonViewer } from '../common/JsonViewer';

interface ExtrasCheckerProps {
  tour: Tour;
  onExtrasUpdate: (extras: any[]) => void;
  savedExtras: any[];
}

export function ExtrasChecker({ tour, onExtrasUpdate, savedExtras: initialSavedExtras }: ExtrasCheckerProps) {
  const [tourOptions, setTourOptions] = useState({
    date: new Date().toISOString().split('T')[0],
    basisId: 0,
    subbasisId: 0,
    timeId: 0
  });

  const [extraOptions, setExtraOptions] = useState({
    extraCode: '',
    extraBasisId: 0,
    extraSubbasisId: 0,
    extraTimeId: 0
  });

  const [extras, setExtras] = useState<TourExtra[]>([]);
  const [loadingExtras, setLoadingExtras] = useState(false);
  const [extrasError, setExtrasError] = useState<string | null>(null);
  const [currentExtraDetails, setCurrentExtraDetails] = useState<any>(null);
  const [savedExtras, setSavedExtras] = useState<any[]>(initialSavedExtras);

  const handleCheckAvailability = async () => {
    if (!extraOptions.extraCode) {
      return;
    }

    try {
      const credentials = storageService.getCredentials();
      if (!credentials) {
        throw new Error('API credentials not found');
      }

      const api = createApiClient(credentials);
      
      // Check availability
      const availabilityResponse = await api.readAvailabilityRange([{
        host_id: tour.operator,
        tour_code: extraOptions.extraCode,
        basis_id: extraOptions.extraBasisId,
        subbasis_id: extraOptions.extraSubbasisId,
        tour_date: tourOptions.date,
        tour_time_id: extraOptions.extraTimeId
      }]);

      // Check pricing
      const priceResponse = await api.readPriceRange([{
        host_id: tour.operator,
        tour_code: extraOptions.extraCode,
        basis_id: extraOptions.extraBasisId,
        subbasis_id: extraOptions.extraSubbasisId,
        tour_date: tourOptions.date,
        tour_time_id: extraOptions.extraTimeId
      }]);

      const selectedExtra = extras.find(e => e.code === extraOptions.extraCode);
      
      setCurrentExtraDetails({
        id: `${Date.now()}`,
        name: selectedExtra?.name || '',
        code: extraOptions.extraCode,
        hostId: tour.operator,
        extra_id: selectedExtra?.extra_id, // Include extra_id here
        date: tourOptions.date,
        pricing: priceResponse.prices[0],
        availability: availabilityResponse.availabilities[0],
        tourOptions: {
          basisId: tourOptions.basisId,
          subbasisId: tourOptions.subbasisId,
          timeId: tourOptions.timeId
        },
        extraOptions: {
          basisId: extraOptions.extraBasisId,
          subbasisId: extraOptions.extraSubbasisId,
          timeId: extraOptions.extraTimeId
        }
      });

    } catch (err) {
      console.error('Failed to check availability and pricing:', err);
      setExtrasError('Failed to check availability and pricing');
    }
  };

  useEffect(() => {
    const fetchExtras = async () => {
      if (!tourOptions.basisId || !tourOptions.subbasisId || !tourOptions.timeId) {
        return;
      }

      setLoadingExtras(true);
      setExtrasError(null);

      try {
        const credentials = storageService.getCredentials();
        if (!credentials) {
          throw new Error('API credentials not found');
        }

        const api = createApiClient(credentials);
        const response = await api.readExtras(
          tour.operator,
          tour.tour_code,
          tourOptions.basisId,
          tourOptions.subbasisId,
          tourOptions.timeId
        );

        setExtras(response.extras || []);
      } catch (err) {
        setExtrasError('Failed to load extras data');
        console.error('Error loading extras:', err);
      } finally {
        setLoadingExtras(false);
      }
    };

    fetchExtras();
  }, [tour, tourOptions.basisId, tourOptions.subbasisId, tourOptions.timeId]);

  const handleSaveExtra = (extra: any) => {
    const updatedExtras = [...savedExtras, extra];
    setSavedExtras(updatedExtras);
    setCurrentExtraDetails(null);
    onExtrasUpdate(updatedExtras);
  };

  const handleDeleteExtra = (extraId: string) => {
    const updatedExtras = savedExtras.filter(extra => extra.id !== extraId);
    setSavedExtras(updatedExtras);
    onExtrasUpdate(updatedExtras);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-6">
          <Package className="h-6 w-6 text-blue-500" />
          <h3 className="text-xl font-semibold text-gray-900">Check Extras and Pricing</h3>
        </div>

        <div className="grid gap-6">
          <TourOptionsForm
            tour={tour}
            options={tourOptions}
            onChange={(newOptions) => setTourOptions({ ...tourOptions, ...newOptions })}
          />

          <ExtraOptionsForm
            options={extraOptions}
            onChange={(newOptions) => setExtraOptions({ ...extraOptions, ...newOptions })}
            extras={extras}
            loading={loadingExtras}
          />

          <button
            onClick={handleCheckAvailability}
            disabled={!extraOptions.extraCode || loadingExtras}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check Availability & Pricing
          </button>

          {extrasError && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
              {extrasError}
            </div>
          )}
        </div>
      </div>

      <SavedExtrasViewer
        currentExtra={currentExtraDetails}
        savedExtras={savedExtras}
        onSave={handleSaveExtra}
        onDelete={handleDeleteExtra}
      />

      <JsonViewer
        data={currentExtraDetails}
        title="Extra Details"
        loading={loadingExtras}
        error={extrasError}
      />
    </div>
  );
}