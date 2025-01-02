import React, { useMemo } from 'react';
import { DollarSign, Package, Users } from 'lucide-react';
import { PricingBreakdown } from './PricingBreakdown';
import { useTourPricing } from '../../hooks/useTourPricing';

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
  // Memoize the basePrices object to prevent unnecessary recalculations
  const basePrices = useMemo(() => ({
    adult_tour_sell: basePrice.adult,
    child_tour_sell: basePrice.child,
    non_per_pax_sell: basePrice.family,
    currency_symbol: currencySymbol
  }), [basePrice.adult, basePrice.child, basePrice.family, currencySymbol]);

  const { totalPrice, breakdown } = useTourPricing(
    basePrices,
    guestCounts,
    selectedExtras,
    availableExtras
  );

  // Filter out selections with no extraId
  const validExtras = selectedExtras.filter(selection => selection.extraId !== null);

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-8">
        <DollarSign className="h-7 w-7 text-green-600" />
        Price Summary
      </h3>

      <div className="space-y-6">
        {/* Base Price Section */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-4">Base Tour Prices</h4>
          <div className="space-y-4">
            {guestCounts.adults > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">
                  Adults ({guestCounts.adults} × {currencySymbol}{basePrice.adult.toFixed(2)})
                </span>
                <span className="font-medium text-gray-900">
                  {currencySymbol}{(guestCounts.adults * basePrice.adult).toFixed(2)}
                </span>
              </div>
            )}
            
            {guestCounts.children > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">
                  Children ({guestCounts.children} × {currencySymbol}{basePrice.child.toFixed(2)})
                </span>
                <span className="font-medium text-gray-900">
                  {currencySymbol}{(guestCounts.children * basePrice.child).toFixed(2)}
                </span>
              </div>
            )}

            {guestCounts.families > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">
                  Family Packages ({guestCounts.families} × {currencySymbol}{basePrice.family.toFixed(2)})
                </span>
                <span className="font-medium text-gray-900">
                  {currencySymbol}{(guestCounts.families * basePrice.family).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Selected Extras Section */}
        {validExtras.length > 0 && (
          <div className="bg-gray-50 p-6 rounded-xl space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-500" />
              Selected Extras
            </h4>

            <div className="divide-y divide-gray-200">
              {validExtras.map((selection) => {
                const extra = availableExtras.find(e => e.code === selection.extraId);
                if (!extra?.pricing) return null;

                return (
                  <div 
                    key={`${selection.adultId}-${selection.extraId}`}
                    className="py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700 font-medium">Adult {selection.adultId}</span>
                        </div>
                        <div>
                          <p className="text-gray-900">{extra.name}</p>
                          <p className="text-sm text-gray-500">Code: {extra.code}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {currencySymbol}{extra.pricing.adult_tour_sell.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Extras Total</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {currencySymbol}{breakdown.extrasCost.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Final Price Breakdown */}
        <PricingBreakdown 
          breakdown={breakdown}
          totalPrice={totalPrice}
        />

        <p className="mt-4 text-sm text-gray-500 text-center">
          All prices are in Australian Dollars (AUD) and include GST
        </p>
      </div>
    </div>
  );
}