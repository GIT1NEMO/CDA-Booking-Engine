import { createApiClient } from './api';
import { Tour, AvailabilityResult } from '../types/api';

const BATCH_SIZE = 7;

interface ApiCredentials {
  username: string;
  password: string;
  environment: 'sandbox' | 'production';
}

interface TourDetails {
  hostId: string;
  tourCode: string;
  basisId: number;
  subbasisId: number;
  timeId: number;
}

const checkAvailabilityBatch = async (
  dates: string[],
  credentials: ApiCredentials,
  tourDetails: TourDetails
): Promise<AvailabilityResult[]> => {
  // Create a new API client for each batch request
  const api = createApiClient(credentials);
  
  const availabilityRequests = dates.map(date => ({
    host_id: tourDetails.hostId,
    tour_code: tourDetails.tourCode,
    basis_id: tourDetails.basisId,
    subbasis_id: tourDetails.subbasisId,
    tour_date: date,
    tour_time_id: tourDetails.timeId
  }));

  try {
    const response = await api.readAvailabilityRange(availabilityRequests);
    return response.availabilities;
  } catch (error) {
    console.error('Failed to check availability batch:', error);
    return [];
  }
};

export const checkMonthAvailability = async (
  dates: string[],
  tour: Tour,
  credentials: ApiCredentials
): Promise<Record<string, AvailabilityResult>> => {
  const basis = tour.bases[0];
  const subbasis = basis.subbases[0];
  const time = tour.times[0];

  const tourDetails = {
    hostId: tour.operator,
    tourCode: tour.tour_code,
    basisId: basis.id,
    subbasisId: subbasis.id,
    timeId: time.id
  };

  // Process dates in batches
  const batches = [];
  for (let i = 0; i < dates.length; i += BATCH_SIZE) {
    batches.push(dates.slice(i, i + BATCH_SIZE));
  }

  try {
    const results = await Promise.all(
      batches.map(batch => checkAvailabilityBatch(batch, credentials, tourDetails))
    );

    const availabilityData: Record<string, AvailabilityResult> = {};
    results.flat().forEach(availability => {
      if (availability) {
        availabilityData[availability.tour_date] = availability;
      }
    });

    return availabilityData;
  } catch (error) {
    console.error('Failed to check month availability:', error);
    return {};
  }
};