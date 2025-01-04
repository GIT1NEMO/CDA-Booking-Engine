export interface ExtraPrice {
  adult_tour_sell: number;
  child_tour_sell: number;
  infant_tour_sell: number;
  currency_symbol: string;
  adult_commission: number;
  child_commission: number;
  infant_commission: number;
}

export interface ExtraAvailability {
  availability: number;
  operational: boolean;
  expired: boolean;
}

export interface ProcessedExtra {
  name: string;
  code: string;
  extra_id: number;
  availability?: ExtraAvailability;
  pricing?: ExtraPrice;
  allow_adult: boolean;
  allow_child: boolean;
  allow_infant: boolean;
  conditions?: string;
}

export interface ExtrasResponse {
  extras: ProcessedExtra[];
  error?: string;
}