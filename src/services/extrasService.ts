import { createApiClient } from './api';
import { ProcessedExtra, ExtrasResponse } from '../types/extras';
import { sanitizeApiResponse } from '../utils/apiUtils';

interface ExtrasServiceParams {
  hostId: string;
  tourCode: string;
  basisId: number;
  subbasisId: number;
  timeId: number;
  tourDate: string;
}

interface ApiCredentials {
  username: string;
  password: string;
  environment: 'sandbox' | 'production';
}

export const fetchTourExtras = async (
  params: ExtrasServiceParams,
  credentials: ApiCredentials
): Promise<{ extras: ProcessedExtra[]; rawData: any; error?: string }> => {
  try {
    const api = createApiClient(credentials);

    // Fetch extras
    const extrasResponse = await api.readExtras(
      params.hostId,
      params.tourCode,
      params.basisId,
      params.subbasisId,
      params.timeId
    );

    // Sanitize the response
    const sanitizedResponse = sanitizeApiResponse(extrasResponse);
    
    // Check if we have a valid response with extras
    if (!sanitizedResponse || !Array.isArray(sanitizedResponse.extras)) {
      console.warn('Invalid extras response:', sanitizedResponse);
      return { 
        extras: [], 
        rawData: sanitizedResponse,
        error: 'Invalid extras response' 
      };
    }

    // Process extras and fetch prices
    const priceRequests = sanitizedResponse.extras.map(extra => ({
      host_id: params.hostId,
      tour_code: extra.code,
      basis_id: params.basisId,
      subbasis_id: params.subbasisId,
      tour_date: params.tourDate,
      tour_time_id: params.timeId
    }));

    // Fetch prices for all extras
    const pricesResponse = await api.readPriceRange(priceRequests);

    // Process and combine extras with their prices
    const processedExtras = sanitizedResponse.extras.map((extra, index) => ({
      ...extra,
      host_id: params.hostId,
      pricing: pricesResponse.prices[index],
      basis_id: params.basisId,
      subbasis_id: params.subbasisId,
      time_id: params.timeId
    }));

    return {
      extras: processedExtras,
      rawData: {
        extras: sanitizedResponse.extras,
        prices: pricesResponse.prices
      }
    };
  } catch (error) {
    console.error('Failed to fetch tour extras:', error);
    return {
      extras: [],
      rawData: null,
      error: error instanceof Error ? error.message : 'Failed to fetch tour extras'
    };
  }
};