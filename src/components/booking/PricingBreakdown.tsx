import React from 'react';
import { DollarSign } from 'lucide-react';

interface PricingBreakdownProps {
  breakdown: {
    baseCost: number;
    extrasCost: number;
    currency: string;
  };
  totalPrice: number;
}

export function PricingBreakdown({ breakdown, totalPrice }: PricingBreakdownProps) {
  return (
    <div className="mt-8 pt-6 border-t-2 border-gray-100">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Base Cost</span>
            <span className="font-medium text-gray-900">
              {breakdown.currency}{breakdown.baseCost.toFixed(2)}
            </span>
          </div>
          {breakdown.extrasCost > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Extras Cost</span>
              <span className="font-medium text-gray-900">
                {breakdown.currency}{breakdown.extrasCost.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center bg-blue-50 p-6 rounded-xl">
        <span className="text-xl font-bold text-gray-900">Total Price</span>
        <div className="text-3xl font-bold text-green-600 flex items-center gap-1">
          <DollarSign className="h-8 w-8" />
          <span>{totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}