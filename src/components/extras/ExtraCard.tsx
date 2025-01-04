import React from 'react';
import { Package, Users, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { TourExtra } from '../../types/api';

interface ExtraCardProps {
  extra: TourExtra;
  pricing?: { price: number; currency: string };
  availability?: {
    availability: number;
    operational: boolean;
    expired: boolean;
  };
  loading?: boolean;
}

export function ExtraCard({ extra, pricing, availability, loading = false }: ExtraCardProps) {
  const getAllowedPaxTypes = () => {
    const types = [];
    if (extra.allow_adult) types.push('Adults');
    if (extra.allow_child) types.push('Children');
    if (extra.allow_infant) types.push('Infants');
    return types.join(', ');
  };

  const getAvailabilityDisplay = () => {
    if (!availability) return null;
    
    if (!availability.operational) {
      return (
        <div className="flex items-center gap-2 text-amber-600">
          <AlertCircle className="h-4 w-4" />
          <span>Not operational</span>
        </div>
      );
    }

    if (availability.expired) {
      return (
        <div className="flex items-center gap-2 text-red-600">
          <XCircle className="h-4 w-4" />
          <span>Availability expired</span>
        </div>
      );
    }

    const availabilityColor = availability.availability > 15 
      ? 'text-green-600' 
      : availability.availability > 0 
        ? 'text-orange-600' 
        : 'text-red-600';

    return (
      <div className={`flex items-center gap-2 ${availabilityColor}`}>
        <CheckCircle className="h-4 w-4" />
        <span>{availability.availability} spots available</span>
      </div>
    );
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

            {getAvailabilityDisplay()}
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Code: {extra.code}
        </div>
      </div>
    </div>
  );
}