import { TourExtra } from '../types/api';

export const formatPriceData = (prices: any[], extras: TourExtra[]): Record<number, any> => {
  const priceMap: Record<number, any> = {};
  
  prices.forEach((price, index) => {
    const extra = extras[index];
    if (extra) {
      priceMap[extra.extra_id] = {
        adult_tour_sell: Number(price.adult_tour_sell) || 0,
        child_tour_sell: Number(price.child_tour_sell) || 0,
        infant_tour_sell: Number(price.infant_tour_sell) || 0,
        currency_symbol: String(price.currency_symbol || '$'),
        currency_code: String(price.currency_code || 'USD')
      };
    }
  });

  return priceMap;
};

export const formatCurrency = (amount: number, symbol: string = '$'): string => {
  return `${symbol}${amount.toFixed(2)}`;
};