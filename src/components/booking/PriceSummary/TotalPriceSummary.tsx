import React from 'react';
import { DollarSign } from 'lucide-react';
import { BasePriceSummary } from './BasePriceSummary';
import { ExtrasSummary } from './ExtrasSummary';

interface TotalPriceSummaryProps {
  basePrice: {
    adult: number;
    child: number;
    family: number;
  };
  guestCounts: {
    adults: number;
    children: number;
    families: number;
  };
  selectedExtras: Array<{
    adultId: number;
    extraId: string | null;
  }>;
  availableExtras: Array<{
    id: string;
    code: string;
    name: string;
    pricing?: {
      adult_tour_sell: number;
      currency_symbol: string;
    };
  }>;
  currencySymbol?: string;
}

export function TotalPriceSummary({
  basePrice,
  guestCounts,
  selectedExtras,
  availableExtras,
  currencySymbol = '$'
}: TotalPriceSummaryProps) {
  const baseTotalPrice = 
    guestCounts.adults * basePrice.adult +
    guestCounts.children * basePrice.child +
    guestCounts.families * basePrice.family;

  const extrasTotalPrice = selectedExtras
    .filter(selection => selection.extraId)
    .reduce((total, selection) => {
      const extra = availableExtras.find(e => e.code === selection.extraId);
      return total + (extra?.pricing?.adult_tour_sell || 0);
    }, 0);

  const totalPrice = baseTotalPrice + extrasTotalPrice;

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-8">
        <DollarSign className="h-7 w-7 text-green-600" />
        Price Summary
      </h3>

      <div className="space-y-8">
        <BasePriceSummary
          basePrice={basePrice}
          guestCounts={guestCounts}
          currencySymbol={currencySymbol}
        />

        <ExtrasSummary
          selectedExtras={selectedExtras}
          availableExtras={availableExtras}
          currencySymbol={currencySymbol}
        />

        <div className="pt-6 border-t-2 border-gray-100">
          <div className="flex justify-between items-center bg-blue-50 p-6 rounded-xl">
            <span className="text-xl font-bold text-gray-900">Total Price</span>
            <div className="text-3xl font-bold text-green-600 flex items-center gap-1">
              <DollarSign className="h-8 w-8" />
              <span>{totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 text-center">
            All prices are in Australian Dollars (AUD) and include GST
          </p>
        </div>
      </div>
    </div>
  );
}