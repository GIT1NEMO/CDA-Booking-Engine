import { TourExtra } from './api';

export interface ExtraPrice {
  adult_tour_sell: number;
  child_tour_sell: number;
  infant_tour_sell: number;
  currency_symbol: string;
  adult_commission: number;
  child_commission: number;
  infant_commission: number;
}

export interface ProcessedExtra extends TourExtra {
  pricing?: ExtraPrice;
}

export interface ExtrasResponse {
  extras: ProcessedExtra[];
  error?: string;
}