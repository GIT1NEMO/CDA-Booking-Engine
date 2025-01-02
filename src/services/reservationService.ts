import { createApiClient } from './api';
import { Tour } from '../types/api';

interface ReservationCheckResponse {
  prices: {
    tour_sell: number;
    extra: number;
    promo: {
      valid_promo: boolean;
      discount_info: string[];
    };
    transfer: number;
    tour_levy: number;
    currency: string;
    discount: number;
    total: number;
  };
  errors?: string[];
}

interface ReservationTicket {
  tour_code: string;
  basis_id: number;
  subbasis_id: number;
  tour_date: string;
  tour_time_id: number;
  pax_mix: {
    adult?: number;
    child?: number;
    infant?: number;
    family?: number;
  };
  extras?: Array<{
    extra_id: number;
    qty: number;
  }>;
}

export const reservationService = {
  checkReservation: async (
    tour: Tour,
    date: string,
    options: {
      basisId: number;
      subbasisId: number;
      timeId: number;
    },
    guestCounts: {
      adults: number;
      children: number;
      infants: number;
      families: number;
    },
    selectedExtras: Array<{
      adultId: number;
      extraId: string | null;
    }>,
    credentials: {
      username: string;
      password: string;
      environment: 'sandbox' | 'production';
    }
  ): Promise<ReservationCheckResponse> => {
    if (!tour?.operator || !tour.tour_code) {
      throw new Error('Invalid tour data');
    }

    if (!date || !options.basisId || !options.subbasisId || !options.timeId) {
      throw new Error('Missing required booking options');
    }

    try {
      const api = createApiClient(credentials);

      // Prepare extras data
      const extrasMap = new Map<number, number>();
      selectedExtras.forEach(selection => {
        if (selection.extraId) {
          const count = extrasMap.get(Number(selection.extraId)) || 0;
          extrasMap.set(Number(selection.extraId), count + 1);
        }
      });

      const extras = Array.from(extrasMap.entries()).map(([extraId, qty]) => ({
        extra_id: extraId,
        qty
      }));

      // Create the ticket object
      const ticket: ReservationTicket = {
        tour_code: tour.tour_code,
        basis_id: options.basisId,
        subbasis_id: options.subbasisId,
        tour_date: date,
        tour_time_id: options.timeId,
        pax_mix: {
          ...(guestCounts.adults > 0 && { adult: guestCounts.adults }),
          ...(guestCounts.children > 0 && { child: guestCounts.children }),
          ...(guestCounts.infants > 0 && { infant: guestCounts.infants }),
          ...(guestCounts.families > 0 && { family: guestCounts.families })
        }
      };

      // Only add extras if there are any
      if (extras.length > 0) {
        ticket.extras = extras;
      }

      const requestBody = {
        prices: true,
        payment_option: "comm-agent/bal-pob",
        tickets: [ticket]
      };

      console.log('Sending reservation check request:', {
        hostId: tour.operator,
        requestBody
      });

      const response = await api.checkReservation(tour.operator, requestBody);

      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response from reservation check');
      }

      return response;
    } catch (error) {
      console.error('Reservation check failed:', error);
      throw new Error(
        error instanceof Error 
          ? `Failed to check reservation: ${error.message}`
          : 'Failed to check reservation'
      );
    }
  }
};