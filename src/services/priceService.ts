import { createApiClient } from './api';
import { Tour, PriceResult } from '../types/api';
import { apiCache, getPriceCacheKey } from '../utils/cache';

interface ApiCredentials {
  username: string;
  password: string;
  environment: 'sandbox' | 'production';
}

interface TourOptions {
  basisId: number;
  subbasisId: number;
  timeId: number;
}

interface PriceRequest {
  hostId: string;
  tourCode: string;
  date: string;
  extraId: number;
  basisId: number;
  subbasisId: number;
  timeId: number;
}

export const fetchTourPrices = async (
  tour: Tour,
  date: string,
  options: TourOptions,
  credentials: ApiCredentials
): Promise<PriceResult | null> => {
  try {
    const api = createApiClient(credentials);
    const response = await api.readPriceRange([{
      host_id: tour.operator,
      tour_code: tour.tour_code,
      basis_id: options.basisId,
      subbasis_id: options.subbasisId,
      tour_date: date,
      tour_time_id: options.timeId
    }]);

    if (!response.prices.length) {
      console.warn('No prices returned for tour');
      return null;
    }

    return response.prices[0];
  } catch (error) {
    console.error('Failed to fetch tour prices:', error);
    throw error;
  }
};

export const fetchExtraPrice = async (
  request: PriceRequest,
  credentials: ApiCredentials
): Promise<number | null> => {
  const cacheKey = getPriceCacheKey(
    request.hostId,
    request.tourCode,
    request.date,
    request.extraId
  );

  // Check cache first
  const cachedPrice = apiCache.get(cacheKey);
  if (cachedPrice !== undefined) {
    return cachedPrice as number;
  }

  try {
    const api = createApiClient(credentials);
    const response = await api.readPriceRange([{
      host_id: request.hostId,
      tour_code: request.tourCode,
      basis_id: request.basisId,
      subbasis_id: request.subbasisId,
      tour_date: request.date,
      tour_time_id: request.timeId
    }]);

    if (!response.prices?.[0]) {
      return null;
    }

    const price = response.prices[0].adult_tour_sell;
    
    // Cache the result
    apiCache.set(cacheKey, price);
    
    return price;
  } catch (error) {
    console.error('Failed to fetch extra price:', error);
    return null;
  }
};