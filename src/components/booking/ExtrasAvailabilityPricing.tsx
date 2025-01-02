import React, { useState, useEffect } from 'react';
import { createApiClient } from '../../services/api';
import { storageService } from '../../services/storage';
import { JsonViewer } from '../common/JsonViewer';
import { fetchExtraPrice } from '../../services/priceService';
import { AlertCircle, Package, Users, ChevronDown, ChevronUp } from 'lucide-react';

interface ExtraOption {
  id: string;
  name: string;
  code: string;
  hostId: string;
  extra_id: number;
  tourOptions: {
    basisId: number;
    subbasisId: number;
    timeId: number;
  };
  extraOptions: {
    basisId: number;
    subbasisId: number;
    timeId: number;
  };
}

interface ExtrasAvailabilityPricingProps {
  extras: ExtraOption[];
  selectedDate: string;
  numberOfAdults: number; // Add this prop
}

interface AdultExtra {
  adultId: number;
  extraId: string | null;
}

interface ProcessedExtra {
  name: string;
  code: string;
  extra_id: number;
  availability: {
    available: number;
    operational: boolean;
    expired: boolean;
  };
  pricing: {
    adult: number;
    child: number;
    infant: number;
    currency: string;
  };
}

export function ExtrasAvailabilityPricing({ 
  extras, 
  selectedDate,
  numberOfAdults 
}: ExtrasAvailabilityPricingProps) {
  const [processedData, setProcessedData] = useState<ProcessedExtra[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRawData, setShowRawData] = useState(false);
  const [rawData, setRawData] = useState({ availability: null, pricing: null });
  const [adultSelections, setAdultSelections] = useState<AdultExtra[]>([]);
  const [expandedAdult, setExpandedAdult] = useState<number | null>(null);

  // Update adult selections when numberOfAdults changes
  useEffect(() => {
    setAdultSelections(prevSelections => {
      // Create array of length numberOfAdults
      const newSelections = Array.from({ length: numberOfAdults }, (_, index) => ({
        adultId: index + 1,
        extraId: null
      }));

      // Preserve existing selections for adults that are still present
      newSelections.forEach((selection, index) => {
        const existingSelection = prevSelections.find(s => s.adultId === selection.adultId);
        if (existingSelection) {
          newSelections[index] = existingSelection;
        }
      });

      return newSelections;
    });
  }, [numberOfAdults]);

  useEffect(() => {
    const checkExtrasAvailabilityAndPricing = async () => {
      if (!extras.length || !selectedDate) return;

      setLoading(true);
      setError(null);

      try {
        const credentials = storageService.getCredentials();
        if (!credentials) {
          throw new Error('API credentials not found');
        }

        const api = createApiClient(credentials);

        // Create requests array for availability
        const availabilityRequests = extras.map(extra => ({
          host_id: extra.hostId,
          tour_code: extra.code,
          basis_id: extra.extraOptions.basisId,
          subbasis_id: extra.extraOptions.subbasisId,
          tour_date: selectedDate,
          tour_time_id: extra.extraOptions.timeId,
          extra_id: extra.extra_id
        }));

        // Get availability data
        const availabilityResponse = await api.readAvailabilityRange(availabilityRequests);

        // Get pricing data using the cached price service
        const pricePromises = extras.map(extra => 
          fetchExtraPrice({
            hostId: extra.hostId,
            tourCode: extra.code,
            date: selectedDate,
            extraId: extra.extra_id,
            basisId: extra.extraOptions.basisId,
            subbasisId: extra.extraOptions.subbasisId,
            timeId: extra.extraOptions.timeId
          }, credentials)
        );

        const prices = await Promise.all(pricePromises);

        setRawData({
          availability: availabilityResponse,
          pricing: prices
        });

        const processed = extras.map((extra, index) => {
          const availability = availabilityResponse.availabilities[index] || {
            availability: 0,
            operational: false,
            expired: false
          };

          const price = prices[index] || 0;

          return {
            name: extra.name,
            code: extra.code,
            extra_id: extra.extra_id,
            availability: {
              available: availability.availability,
              operational: availability.operational,
              expired: availability.expired
            },
            pricing: {
              adult: price,
              child: price * 0.8,
              infant: 0,
              currency: '$'
            }
          };
        });

        setProcessedData(processed);
      } catch (err) {
        console.error('Error fetching extras data:', err);
        setError('Failed to fetch extras availability and pricing');
      } finally {
        setLoading(false);
      }
    };

    checkExtrasAvailabilityAndPricing();
  }, [extras, selectedDate]);

  const handleExtraSelection = (adultId: number, extraId: string | null) => {
    setAdultSelections(prev => {
      const updated = prev.map(selection =>
        selection.adultId === adultId
          ? { ...selection, extraId }
          : selection
      );
      return updated;
    });
  };

  if (!extras.length || numberOfAdults === 0) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Package className="h-6 w-6 text-blue-500" />
        Real-time Extras Availability & Pricing
      </h3>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="p-4 text-center text-gray-500">
          Loading real-time data...
        </div>
      ) : (
        <div className="space-y-6">
          {adultSelections.map((selection) => (
            <div key={selection.adultId} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setExpandedAdult(
                  expandedAdult === selection.adultId ? null : selection.adultId
                )}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="font-medium text-gray-900">
                    Adult {selection.adultId}
                  </span>
                </div>
                {expandedAdult === selection.adultId ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>

              {expandedAdult === selection.adultId && (
                <div className="p-4 border-t border-gray-200">
                  <div className="grid gap-4">
                    {processedData.map((extra) => (
                      <label
                        key={extra.extra_id}
                        className={`
                          flex items-center justify-between p-4 rounded-lg border-2 
                          ${selection.extraId === extra.code
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-200'}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name={`extra-${selection.adultId}`}
                            value={extra.code}
                            checked={selection.extraId === extra.code}
                            onChange={() => handleExtraSelection(selection.adultId, extra.code)}
                            className="h-4 w-4 text-blue-600"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{extra.name}</p>
                            <p className="text-sm text-gray-500">Code: {extra.code}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            {extra.pricing.currency}{extra.pricing.adult.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {extra.availability.available} available
                          </p>
                        </div>
                      </label>
                    ))}
                    <button
                      onClick={() => handleExtraSelection(selection.adultId, null)}
                      className={`
                        p-4 rounded-lg border-2 text-left
                        ${!selection.extraId
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-200'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={`extra-${selection.adultId}`}
                          checked={!selection.extraId}
                          onChange={() => handleExtraSelection(selection.adultId, null)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="font-medium text-gray-900">No extra selected</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowRawData(!showRawData)}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              {showRawData ? 'Hide' : 'Show'} Raw API Data
            </button>
            
            {showRawData && (
              <div className="mt-4 space-y-4">
                <JsonViewer
                  data={rawData.availability}
                  title="Raw Availability Data"
                  loading={loading}
                />
                <JsonViewer
                  data={rawData.pricing}
                  title="Raw Pricing Data"
                  loading={loading}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}