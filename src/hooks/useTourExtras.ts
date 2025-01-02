import { useState, useEffect } from 'react';
import { fetchTourExtras } from '../services/extrasService';
import { ProcessedExtra } from '../types/extras';
import { storageService } from '../services/storage';

interface UseTourExtrasParams {
  hostId: string;
  tourCode: string;
  basisId: number;
  subbasisId: number;
  timeId: number;
  tourDate: string;
}

interface UseTourExtrasResult {
  extras: ProcessedExtra[];
  loading: boolean;
  error: string | null;
  rawData: any;
}

export const useTourExtras = (params: UseTourExtrasParams): UseTourExtrasResult => {
  const [state, setState] = useState<UseTourExtrasResult>({
    extras: [],
    loading: true,
    error: null,
    rawData: null
  });

  useEffect(() => {
    let mounted = true;

    const loadExtras = async () => {
      // Validate required parameters
      if (!params.tourDate || !params.hostId || !params.tourCode || 
          !params.basisId || !params.subbasisId || !params.timeId) {
        setState(prev => ({ 
          ...prev, 
          loading: false,
          error: 'Missing required parameters for loading extras'
        }));
        return;
      }

      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const credentials = storageService.getCredentials();
        if (!credentials) {
          throw new Error('API credentials not found');
        }

        console.log('Fetching extras with params:', {
          hostId: params.hostId,
          tourCode: params.tourCode,
          basisId: params.basisId,
          subbasisId: params.subbasisId,
          timeId: params.timeId,
          tourDate: params.tourDate
        });

        const { extras, rawData, error } = await fetchTourExtras(params, credentials);
        
        if (!mounted) return;

        if (error) {
          setState({
            extras: [],
            loading: false,
            error,
            rawData: null
          });
          return;
        }

        if (!extras || !Array.isArray(extras)) {
          setState({
            extras: [],
            loading: false,
            error: 'Invalid extras data received',
            rawData
          });
          return;
        }

        setState({
          extras,
          loading: false,
          error: null,
          rawData
        });
      } catch (err) {
        if (!mounted) return;
        console.error('Error loading extras:', err);
        setState({
          extras: [],
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load extras',
          rawData: null
        });
      }
    };

    loadExtras();

    return () => {
      mounted = false;
    };
  }, [
    params.hostId,
    params.tourCode,
    params.basisId,
    params.subbasisId,
    params.timeId,
    params.tourDate
  ]);

  return state;
};