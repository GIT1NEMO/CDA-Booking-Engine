import React from 'react';
import { ProcessedExtra } from '../../types/extras';
import { Package, AlertCircle, Users } from 'lucide-react';
import { formatPrice } from '../../utils/apiUtils';

interface ExtrasListProps {
  extras: ProcessedExtra[];
  loading: boolean;
  error: string | null;
}

export function ExtrasList({ extras, loading, error }: ExtrasListProps) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        <span>{error}</span>
      </div>
    );
  }

  if (!extras.length) {
    return (
      <div className="bg-amber-50 text-amber-700 p-4 rounded-lg flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        <span>No extras available for this tour</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {extras.map((extra) => (
        <div
          key={extra.extra_id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-500" />
                <h4 className="font-medium text-gray-900">{extra.name}</h4>
              </div>
              
              {extra.conditions && (
                <p className="text-sm text-gray-600">{extra.conditions}</p>
              )}

              <div className="flex flex-wrap gap-4">
                {extra.pricing && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600 font-medium">
                      {formatPrice(extra.pricing.adult_tour_sell, extra.pricing.currency_symbol)}
                    </span>
                    {extra.pricing.adult_commission > 0 && (
                      <span className="text-blue-600">
                        ({extra.pricing.adult_commission}% commission)
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>
                    Available for: {[
                      extra.allow_adult && 'Adults',
                      extra.allow_child && 'Children',
                      extra.allow_infant && 'Infants'
                    ].filter(Boolean).join(', ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Code: {extra.code}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}