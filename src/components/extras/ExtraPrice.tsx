import React from 'react';
import { DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/priceFormatters';

interface ExtraPriceProps {
  pricing: {
    adult_tour_sell: number;
    child_tour_sell: number;
    infant_tour_sell: number;
    currency_symbol: string;
  };
  allowedTypes: {
    adult: boolean;
    child: boolean;
    infant: boolean;
  };
}

export function ExtraPrice({ pricing, allowedTypes }: ExtraPriceProps) {
  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-green-500" />
        <div className="text-sm space-x-2">
          {allowedTypes.adult && pricing.adult_tour_sell > 0 && (
            <span className="text-gray-900">
              Adult: {formatCurrency(pricing.adult_tour_sell, pricing.currency_symbol)}
            </span>
          )}
          {allowedTypes.child && pricing.child_tour_sell > 0 && (
            <span className="text-gray-900">
              Child: {formatCurrency(pricing.child_tour_sell, pricing.currency_symbol)}
            </span>
          )}
          {allowedTypes.infant && pricing.infant_tour_sell > 0 && (
            <span className="text-gray-900">
              Infant: {formatCurrency(pricing.infant_tour_sell, pricing.currency_symbol)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}