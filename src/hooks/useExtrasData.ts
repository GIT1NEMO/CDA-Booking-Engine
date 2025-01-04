import { useState, useEffect, useCallback } from 'react';
import { createApiClient } from '../services/api';
import { storageService } from '../services/storage';
import { fetchExtraPrice } from '../services/priceService';
import { ExtraOption, ProcessedExtra } from '../types/extras';

interface UseExtrasDataProps {
  extras: ExtraOption[];
  selectedDate: string;
  numberOfAdults: number;
  onSelectionsChange: (selections: Array<{ adultId: number; extraId: string | null }>) => void;
}

export function useExtrasData({
  extras,
  selectedDate,
  numberOfAdults,
  onSelectionsChange
}: UseExtrasDataProps) {
  const [processedData, setProcessedData] = useState<ProcessedExtra[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adultSelections, setAdultSelections] = useState<Array<{ adultId: number; extraId: string | null }>>([]);
  const [expandedAdultId, setExpandedAdultId] = useState<number>(1);

  // Initialize adult selections when numberOfAdults changes
  useEffect(() => {
    const newSelections = Array.from({ length: numberOfAdults }, (_, index) => ({
      adultId: index + 1,
      extraId: null
    }));
    setAdultSelections(newSelections);
  }, [numberOfAdults]);

  // Notify parent of selection changes
  useEffect(() => {
    onSelectionsChange(adultSelections);
  }, [adultSelections, onSelectionsChange]);

  // Process extras data
  useEffect(() => {
    const processExtras = async () => {
      if (!extras.length || !selectedDate) return;
      
      setLoading(true);
      setError(null);

      try {
        const credentials = storageService.getCredentials();
        if (!credentials) throw new Error('API credentials not found');

        const processed = await Promise.all(
          extras.map(async (extra) => {
            try {
              const price = await fetchExtraPrice({
                hostId: extra.hostId,
                tourCode: extra.code,
                date: selectedDate,
                extraId: extra.extra_id,
                basisId: extra.extraOptions.basisId,
                subbasisId: extra.extraOptions.subbasisId,
                timeId: extra.extraOptions.timeId
              }, credentials);

              return {
                ...extra,
                pricing: {
                  adult_tour_sell: price || 0,
                  currency_symbol: '$'
                }
              };
            } catch (err) {
              console.error(`Error processing extra ${extra.code}:`, err);
              return extra;
            }
          })
        );

        setProcessedData(processed);
      } catch (err) {
        console.error('Error processing extras:', err);
        setError('Failed to load extras data');
      } finally {
        setLoading(false);
      }
    };

    processExtras();
  }, [extras, selectedDate]);

  const handleExtraSelection = useCallback((adultId: number, extraId: string | null) => {
    setAdultSelections(prev => 
      prev.map(selection => 
        selection.adultId === adultId
          ? { ...selection, extraId }
          : selection
      )
    );
  }, []);

  return {
    processedData,
    loading,
    error,
    adultSelections,
    handleExtraSelection,
    expandedAdultId,
    setExpandedAdultId
  };
}