import React from 'react';
import { Calendar, Clock, Users, Package, Info } from 'lucide-react';

interface BookingSummaryProps {
  date: string;
  tourOptions: {
    basisId: number;
    subbasisId: number;
    timeId: number;
  };
  guestCounts: {
    adults: number;
    children: number;
    infants: number;
    families: number;
  };
  tour: {
    bases: Array<{
      id: number;
      short_desc: string;
      subbases: Array<{
        id: number;
        description: string;
      }>;
    }>;
    times: Array<{
      id: number;
      time: string;
    }>;
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
}

export function BookingSummary({
  date,
  tourOptions,
  guestCounts,
  tour,
  selectedExtras,
  availableExtras
}: BookingSummaryProps) {
  const selectedBasis = tour.bases.find(b => b.id === tourOptions.basisId);
  const selectedSubbasis = selectedBasis?.subbases.find(sb => sb.id === tourOptions.subbasisId);
  const selectedTime = tour.times.find(t => t.id === tourOptions.timeId);

  const totalGuests = 
    guestCounts.adults + 
    guestCounts.children + 
    guestCounts.infants + 
    (guestCounts.families * 4);

  const activeExtras = selectedExtras
    .filter(s => s.extraId)
    .map(s => {
      const extra = availableExtras.find(e => e.code === s.extraId);
      return {
        adultId: s.adultId,
        name: extra?.name || 'Unknown Extra',
        price: extra?.pricing?.adult_tour_sell || 0,
        currency: extra?.pricing?.currency_symbol || '$'
      };
    });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <Info className="h-6 w-6 text-blue-500" />
        <h3 className="text-xl font-semibold text-gray-900">Booking Summary</h3>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <span className="text-gray-700 font-medium">Date:</span>
              <span className="ml-2 text-gray-900">
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-gray-400" />
            <div>
              <span className="text-gray-700 font-medium">Time:</span>
              <span className="ml-2 text-gray-900">
                {selectedTime?.time || 'Not selected'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-gray-400" />
            <div className="space-y-1">
              <div>
                <span className="text-gray-700 font-medium">Guests:</span>
                <span className="ml-2 text-gray-900">{totalGuests} total</span>
              </div>
              <div className="text-sm text-gray-600 space-x-2">
                {guestCounts.adults > 0 && (
                  <span>{guestCounts.adults} adults</span>
                )}
                {guestCounts.children > 0 && (
                  <span>{guestCounts.children} children</span>
                )}
                {guestCounts.infants > 0 && (
                  <span>{guestCounts.infants} infants</span>
                )}
                {guestCounts.families > 0 && (
                  <span>{guestCounts.families} families</span>
                )}
              </div>
            </div>
          </div>

          {selectedBasis && (
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-gray-400" />
              <div className="space-y-1">
                <div>
                  <span className="text-gray-700 font-medium">Package:</span>
                  <span className="ml-2 text-gray-900">{selectedBasis.short_desc}</span>
                </div>
                {selectedSubbasis && (
                  <div className="text-sm text-gray-600">
                    {selectedSubbasis.description}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {activeExtras.length > 0 && (
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Selected Extras:</h4>
            <div className="space-y-3">
              {activeExtras.map((extra, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-start bg-gray-50 p-3 rounded-md"
                >
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-900">
                      Adult {extra.adultId}
                    </span>
                    <p className="text-sm text-gray-600">{extra.name}</p>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    {extra.currency}{extra.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}