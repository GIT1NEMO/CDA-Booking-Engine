import axios from 'axios';
import { 
  HostsResponse, 
  HostDetailsResponse, 
  ToursResponse,
  AvailabilityRangeItem,
  AvailabilityRangeResponse,
  TourExtrasResponse,
  PriceRangeItem,
  PriceRangeResponse
} from '../types/api';

const SANDBOX_URL = 'https://ron2-sandbox.respax.com';
const PRODUCTION_URL = 'https://ron2.respax.com';

interface ApiConfig {
  username: string;
  password: string;
  environment: 'sandbox' | 'production';
}

export const createApiClient = (config: ApiConfig) => {
  const baseURL = config.environment === 'sandbox' ? SANDBOX_URL : PRODUCTION_URL;
  
  const client = axios.create({
    baseURL,
    auth: {
      username: config.username,
      password: config.password,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return {
    ping: async () => {
      const response = await client.post('/ping.json');
      return response.data;
    },

    readHosts: async () => {
      const response = await client.post<HostsResponse>('/read-hosts.json');
      return response.data;
    },

    readHostDetails: async (hostId: string) => {
      const response = await client.post<HostDetailsResponse>(
        `/read-host-details-${hostId}.json`,
        null,
        { params: { mode: 'live' } }
      );
      return response.data;
    },

    readTours: async (hostId: string, distributorId?: string) => {
      const response = await client.post<ToursResponse>(
        `/read-tours-${hostId}.json`,
        null,
        { 
          params: { 
            mode: 'live',
            distributor_id: distributorId || ''
          } 
        }
      );
      return response.data;
    },

    readSpecificTour: async (hostId: string, tourCode: string, distributorId?: string) => {
      const response = await client.post<ToursResponse>(
        `/read-tours-${hostId}.json`,
        null,
        { 
          params: { 
            mode: 'live',
            distributor_id: distributorId || '',
            tour_code: tourCode
          } 
        }
      );
      return response.data;
    },

    readAvailabilityRange: async (items: AvailabilityRangeItem[], distributorId?: string) => {
      const response = await client.post<AvailabilityRangeResponse>(
        '/read-availability-range.json',
        items,
        {
          params: {
            config: 'live',
            distributor_id: distributorId || ''
          }
        }
      );
      return response.data;
    },

    readPriceRange: async (items: PriceRangeItem[], distributorId?: string) => {
      const response = await client.post<PriceRangeResponse>(
        '/read-price-range.json',
        items,
        {
          params: {
            mode: 'live',
            distributor_id: distributorId || ''
          }
        }
      );
      return response.data;
    },

    readExtras: async (
      hostId: string,
      tourCode: string,
      basisId: number,
      subbasisId: number,
      timeId: number,
      distributorId?: string
    ) => {
      const response = await client.post<TourExtrasResponse>(
        `/read-extras-${hostId}-${tourCode}-${basisId}-${subbasisId}-${timeId}.json`,
        null,
        {
          params: {
            mode: 'live',
            distributor_id: distributorId || ''
          }
        }
      );
      return response.data;
    },

    checkReservation: async (hostId: string, requestBody: any) => {
      const response = await client.post(
        `/check-reservation-${hostId}.json`,
        requestBody,
        {
          params: { mode: 'live' }
        }
      );
      return response.data;
    }
  };
};