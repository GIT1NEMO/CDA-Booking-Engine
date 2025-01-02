import React from 'react';
import { Package, Users } from 'lucide-react';

interface ExtrasSummaryProps {
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

export function ExtrasSummary({ selectedExtras, availableExtras, currencySymbol = '$' }: ExtrasSummaryProps) {
  const validExtras = selectedExtras.filter(selection => selection.extraId !== null);
  
  if (validExtras.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5 text-blue-500" />
        <h4 className="font-semibold text-gray-900">Selected Extras</h4>
      </div>

      <div className="divide-y divide-gray-100">
        {validExtras.map((selection) => {
          const extra = availableExtras.find(e => e.code === selection.extraId);
          if (!extra?.pricing) return null;

          return (
            <div 
              key={`${selection.adultId}-${selection.extraId}`}
              className="py-3 first:pt-0 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">Adult {selection.adultId}</span>
                  </div>
                  <p className="text-gray-900">{extra.name}</p>
                  <p className="text-sm text-gray-500">Code: {extra.code}</p>
                </div>
                <span className="font-semibold text-gray-900">
                  {currencySymbol}{extra.pricing.adult_tour_sell.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Extras Total</span>
          <span className="font-semibold text-gray-900">
            {currencySymbol}
            {validExtras.reduce((total, selection) => {
              const extra = availableExtras.find(e => e.code === selection.extraId);
              return total + (extra?.pricing?.adult_tour_sell || 0);
            }, 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}