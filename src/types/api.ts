// Add or update the ExtraPriceResult interface
export interface ExtraPriceResult {
  adult_tour_sell: number;
  child_tour_sell: number;
  infant_tour_sell: number;
  currency_symbol: string;
  currency_code: string;
}

// Update the TourExtra interface to ensure host_id is included
export interface TourExtra {
  group: number;
  name: string;
  extra_id: number;
  basis_id: number;
  time_id: number;
  code: string;
  offset: number;
  conditions: string;
  subbasis_id: number;
  allow_udef1: boolean;
  allow_foc: boolean;
  allow_adult: boolean;
  allow_infant: boolean;
  allow_child: boolean;
  host_id: string;
}