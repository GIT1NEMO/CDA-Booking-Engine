import { useState, useEffect } from 'react';

interface PriceResult {
  adult_tour_sell: number;
  child_tour_sell: number;
  non_per_pax_sell: number;
  currency_symbol: string;
}

interface GuestCounts {
  adults: number;
  children: number;
  families: number;
}

interface AdultExtra {
  adultId: number;
  extraId: string | null;
}

interface ExtraOption {
  id: string;
  code: string;
  name: string;
  pricing?: {
    adult_tour_sell: number;
    currency_symbol: string;
  };
}

interface PriceBreakdown {
  baseCost: number;
  extrasCost: number;
  currency: string;
}

export function useTourPricing(
  basePrices: PriceResult | null,
  guestCounts: GuestCounts,
  selectedExtras: AdultExtra[],
  availableExtras: ExtraOption[]
) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [breakdown, setBreakdown] = useState<PriceBreakdown>({
    baseCost: 0,
    extrasCost: 0,
    currency: basePrices?.currency_symbol || '$'
  });

  useEffect(() => {
    if (!basePrices) return;

    // Calculate base costs
    const adultsCost = guestCounts.adults * (basePrices.adult_tour_sell || 0);
    const childrenCost = guestCounts.children * (basePrices.child_tour_sell || 0);
    const familiesCost = guestCounts.families * (basePrices.non_per_pax_sell || 0);
    const baseCost = adultsCost + childrenCost + familiesCost;

    // Calculate extras cost
    const extrasCost = selectedExtras.reduce((total, selection) => {
      if (!selection.extraId) return total;
      
      const extra = availableExtras.find(e => e.code === selection.extraId);
      const extraPrice = extra?.pricing?.adult_tour_sell || 0;
      
      return total + extraPrice;
    }, 0);

    const newBreakdown = {
      baseCost,
      extrasCost,
      currency: basePrices.currency_symbol
    };

    setBreakdown(newBreakdown);
    setTotalPrice(baseCost + extrasCost);
  }, [basePrices, guestCounts, selectedExtras, availableExtras]);

  return {
    totalPrice,
    breakdown,
    currency: basePrices?.currency_symbol || '$'
  };
}