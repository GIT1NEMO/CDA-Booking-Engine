import React from 'react';
import { Users } from 'lucide-react';

interface BasePriceSummaryProps {
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
  currencySymbol?: string;
}

export function BasePriceSummary({ basePrice, guestCounts, currencySymbol = '$' }: BasePriceSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-blue-500" />
        <h4 className="font-semibold text-gray-900">Base Tour Prices</h4>
      </div>

      <div className="space-y-3">
        {guestCounts.adults > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-700">
              Adults ({guestCounts.adults} × {currencySymbol}{basePrice.adult.toFixed(2)})
            </span>
            <span className="font-semibold text-gray-900">
              {currencySymbol}{(guestCounts.adults * basePrice.adult).toFixed(2)}
            </span>
          </div>
        )}
        
        {guestCounts.children > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-700">
              Children ({guestCounts.children} × {currencySymbol}{basePrice.child.toFixed(2)})
            </span>
            <span className="font-semibold text-gray-900">
              {currencySymbol}{(guestCounts.children * basePrice.child).toFixed(2)}
            </span>
          </div>
        )}

        {guestCounts.families > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-700">
              Family Packages ({guestCounts.families} × {currencySymbol}{basePrice.family.toFixed(2)})
            </span>
            <span className="font-semibold text-gray-900">
              {currencySymbol}{(guestCounts.families * basePrice.family).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Base Total</span>
          <span className="font-semibold text-gray-900">
            {currencySymbol}
            {(
              guestCounts.adults * basePrice.adult +
              guestCounts.children * basePrice.child +
              guestCounts.families * basePrice.family
            ).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}