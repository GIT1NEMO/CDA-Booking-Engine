import React from 'react';
import { Package, Users, AlertCircle } from 'lucide-react';
import { TourExtra } from '../../types/api';

interface ExtraCardProps {
  extra: TourExtra;
  pricing?: { price: number; currency: string };
  loading?: boolean;
}

export function ExtraCard({ extra, pricing, loading = false }: ExtraCardProps) {
  const getAllowedPaxTypes = () => {
    const types = [];
    if (extra.allow_adult) types.push('Adults');
    if (extra.allow_child) types.push('Children');
    if (extra.allow_infant) types.push('Infants');
    return types.join(', ');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-500" />
            <h4 className="font-medium text-gray-900">{extra.name}</h4>
          </div>
          
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4 text-gray-400" />
              <span>Available for: {getAllowedPaxTypes()}</span>
            </div>

            {extra.conditions && (
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <AlertCircle className="h-4 w-4 text-gray-400 mt-0.5" />
                <span>{extra.conditions}</span>
              </div>
            )}

            {loading ? (
              <div className="animate-pulse mt-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ) : pricing && (
              <div className="mt-2 text-sm font-medium text-gray-900">
                Price: {pricing.currency}{pricing.price.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Code: {extra.code}
        </div>
      </div>
    </div>
  );
}