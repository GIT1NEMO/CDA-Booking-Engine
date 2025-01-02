import React from 'react';
import { Package, Users, DollarSign } from 'lucide-react';
import { ProcessedExtra } from '../../types/extras';

interface SelectionsSummaryProps {
  selections: Array<{
    adultId: number;
    extraId: string | null;
  }>;
  availableExtras: ProcessedExtra[];
  loading?: boolean;
}

export function SelectionsSummary({ 
  selections, 
  availableExtras, 
  loading = false 
}: SelectionsSummaryProps) {
  // Filter out selections with no extras
  const activeSelections = selections.filter(s => s.extraId !== null);
  
  // Calculate total price
  const totalPrice = activeSelections.reduce((sum, selection) => {
    const extra = availableExtras.find(e => e.code === selection.extraId);
    return sum + (extra?.pricing?.adult_tour_sell || 0);
  }, 0);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (activeSelections.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-gray-500">
          <Package className="h-5 w-5" />
          <span>No extras selected</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-4">
        <Package className="h-5 w-5 text-blue-500" />
        Selected Extras Summary
      </h4>

      <div className="space-y-4">
        {activeSelections.map((selection) => {
          const extra = availableExtras.find(e => e.code === selection.extraId);
          if (!extra?.pricing) return null;

          return (
            <div 
              key={`${selection.adultId}-${selection.extraId}`}
              className="flex justify-between items-start p-3 bg-gray-50 rounded-md"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">Adult {selection.adultId}</span>
                </div>
                <p className="text-gray-900">{extra.name}</p>
                <p className="text-sm text-gray-500">Code: {extra.code}</p>
              </div>
              <span className="font-medium text-gray-900">
                {extra.pricing.currency_symbol}
                {extra.pricing.adult_tour_sell.toFixed(2)}
              </span>
            </div>
          );
        })}

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">Total</span>
            <div className="flex items-center gap-1 text-green-600 font-bold">
              <DollarSign className="h-4 w-4" />
              <span>{totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}