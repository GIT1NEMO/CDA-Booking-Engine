import React from 'react';
import { DollarSign, Users, Package } from 'lucide-react';

interface AdultExtra {
  adultId: number;
  extraId: string | null;
}

interface ExtraOption {
  id: string;
  name: string;
  code: string;
  hostId: string;
  extra_id: number;
  pricing?: {
    adult: number;
    currency: string;
  };
}

interface PriceSummaryProps {
  basePrice: number;
  currencySymbol?: string;
  selectedExtras?: AdultExtra[];
  availableExtras?: ExtraOption[];
}

export function PriceSummary({ 
  basePrice, 
  currencySymbol = '$',
  selectedExtras = [],
  availableExtras = []
}: PriceSummaryProps) {
  const getExtraPrice = (extraId: string | null) => {
    if (!extraId) return 0;
    const extra = availableExtras.find(e => e.code === extraId);
    return extra?.pricing?.adult || 0;
  };

  const calculateExtrasTotal = () => {
    return selectedExtras.reduce((total, selection) => {
      return total + getExtraPrice(selection.extraId);
    }, 0);
  };

  const extrasTotal = calculateExtrasTotal();
  const totalPrice = basePrice + extrasTotal;

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-8">
        <DollarSign className="h-7 w-7 text-green-600" />
        Price Summary
      </h3>

      <div className="space-y-6">
        {/* Base Price Section */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-700">Base Tour Price</span>
            <span className="text-xl font-bold text-gray-900">
              {currencySymbol}{basePrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Selected Extras Section */}
        {selectedExtras.length > 0 && (
          <div className="bg-gray-50 p-6 rounded-xl space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-500" />
              Selected Extras
            </h4>
            
            <div className="divide-y divide-gray-200">
              {selectedExtras.map((selection) => {
                const extra = selection.extraId 
                  ? availableExtras.find(e => e.code === selection.extraId)
                  : null;
                const price = getExtraPrice(selection.extraId);

                if (!extra || !price) return null;

                return (
                  <div 
                    key={selection.adultId}
                    className="py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            Adult {selection.adultId}
                          </span>
                        </div>
                        <div>
                          <p className="text-gray-700">{extra.name}</p>
                          <p className="text-sm text-gray-500">Code: {extra.code}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {currencySymbol}{price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {extrasTotal > 0 && (
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="font-medium text-gray-700">Extras Total</span>
                <span className="text-lg font-semibold text-gray-900">
                  {currencySymbol}{extrasTotal.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Total Section */}
        <div className="mt-8 pt-6 border-t-2 border-gray-100">
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