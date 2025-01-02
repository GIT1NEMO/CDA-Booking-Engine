import { createApiClient } from './api';
import { TourExtra } from '../types/api';

interface ApiCredentials {
  username: string;
  password: string;
  environment: 'sandbox' | 'production';
}

export interface ExtraPricing {
  price: number;
  currency: string;
}

export interface ExtrasPricingResponse {
  pricing: Record<string, ExtraPricing>;
  rawResponse: any;
}

export const fetchExtrasPricing = async (
  extras: TourExtra[],
  tourDate: string,
  credentials: ApiCredentials
): Promise<ExtrasPricingResponse> => {
  // Validate inputs
  if (!extras?.length || !tourDate || !credentials) {
    console.warn('Invalid inputs for fetchExtrasPricing:', { 
      hasExtras: Boolean(extras?.length), 
      hasTourDate: Boolean(tourDate), 
      hasCredentials: Boolean(credentials) 
    });
    return { pricing: {}, rawResponse: null };
  }

  try {
    const api = createApiClient(credentials);
    
    // Prepare request data
    const requests = extras.map(extra => ({
      host_id: extra.host_id || 'SALES',
      tour_code: extra.code,
      basis_id: extra.basis_id,
      subbasis_id: extra.subbasis_id,
      tour_date: tourDate,
      tour_time_id: extra.time_id
    }));

    // Make API call
    const response = await api.readPriceRange(requests);

    // Validate response
    if (!response?.prices) {
      console.warn('Invalid price range response:', response);
      return { pricing: {}, rawResponse: response };
    }

    // Process pricing data
    const pricing: Record<string, ExtraPricing> = {};
    extras.forEach((extra, index) => {
      const price = response.prices[index];
      if (price) {
        pricing[extra.extra_id.toString()] = {
          price: Number(price.adult_tour_sell) || 0,
          currency: price.currency_symbol || '$'
        };
      }
    });

    return {
      pricing,
      rawResponse: response
    };
  } catch (error) {
    // Log detailed error information
    console.error('Failed to fetch extras pricing:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      extras: extras.length,
      tourDate
    });

    return {
      pricing: {},
      rawResponse: null
    };
  }
}