import React from 'react';
import { Users, Baby, UserPlus, Info } from 'lucide-react';
import { GuestCounter } from './GuestCounter';

interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  families: number;
}

interface Prices {
  adult: number;
  child: number;
  infant: number;
  family: number;
}

interface GuestTypeSelectorProps {
  guestCounts: GuestCounts;
  prices: Prices | null;
  onChange: (counts: GuestCounts) => void;
  currencySymbol?: string;
  loading?: boolean;
  maxAvailability?: number;
}

export function GuestTypeSelector({ 
  guestCounts, 
  prices, 
  onChange,
  currencySymbol = '$',
  loading = false,
  maxAvailability = 0
}: GuestTypeSelectorProps) {
  const hasAdultOrFamily = guestCounts.adults > 0 || guestCounts.families > 0;
  const totalGuests = guestCounts.adults + guestCounts.children + (guestCounts.families * 4);

  const updateCount = (type: keyof GuestCounts, increment: boolean) => {
    const currentValue = guestCounts[type];
    let newValue = increment ? currentValue + 1 : Math.max(0, currentValue - 1);
    
    // Calculate how many spots this change will take
    let spotChange = 1;
    if (type === 'families') {
      spotChange = 4; // Each family takes 4 spots
    }

    // Check if we're incrementing and would exceed availability
    if (increment) {
      const newTotal = totalGuests + spotChange;
      if (newTotal > maxAvailability) {
        return; // Don't allow exceeding max availability
      }
    }

    // Special handling for removing adults/families
    if (!increment && (type === 'adults' || type === 'families')) {
      if (guestCounts.adults === 0 || (type === 'adults' && guestCounts.families === 0)) {
        onChange({
          ...guestCounts,
          [type]: newValue,
          children: 0,
          infants: 0
        });
        return;
      }
    }

    onChange({
      ...guestCounts,
      [type]: newValue
    });
  };

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return '---';
    return price.toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="h-7 w-7 text-blue-500" />
          Select Guests
        </h3>
        {maxAvailability > 0 && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Info className="h-4 w-4" />
            <span>{maxAvailability} spots available</span>
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {/* Adults */}
        <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <UserPlus className="h-6 w-6 text-blue-500" />
                <span className="text-lg font-semibold text-gray-900">Adults</span>
              </div>
              <p className="text-sm text-gray-500">Age 13+</p>
              {prices?.adult && (
                <p className="text-lg font-semibold text-green-600">
                  {currencySymbol}{formatPrice(prices.adult)}
                </p>
              )}
            </div>
            <GuestCounter
              value={guestCounts.adults}
              maxValue={Math.min(10, maxAvailability)}
              onIncrement={() => updateCount('adults', true)}
              onDecrement={() => updateCount('adults', false)}
              disabled={loading}
            />
          </div>
        </div>

        {/* Children */}
        <div className={`bg-white rounded-xl p-6 shadow-md border-2 ${!hasAdultOrFamily ? 'border-gray-100 opacity-60' : 'border-gray-100'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-500" />
                <span className="text-lg font-semibold text-gray-900">Children</span>
              </div>
              <p className="text-sm text-gray-500">Age 2-12</p>
              {prices?.child && (
                <p className="text-lg font-semibold text-green-600">
                  {currencySymbol}{formatPrice(prices.child)}
                </p>
              )}
              {!hasAdultOrFamily && (
                <p className="text-sm text-amber-600 flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  Requires at least one adult
                </p>
              )}
            </div>
            <GuestCounter
              value={guestCounts.children}
              maxValue={Math.min(10, maxAvailability - totalGuests + guestCounts.children)}
              onIncrement={() => updateCount('children', true)}
              onDecrement={() => updateCount('children', false)}
              disabled={!hasAdultOrFamily || loading}
            />
          </div>
        </div>

        {/* Infants */}
        <div className={`bg-white rounded-xl p-6 shadow-md border-2 ${!hasAdultOrFamily ? 'border-gray-100 opacity-60' : 'border-gray-100'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Baby className="h-6 w-6 text-blue-500" />
                <span className="text-lg font-semibold text-gray-900">Infants</span>
              </div>
              <p className="text-sm text-gray-500">Under 2</p>
              {prices?.infant && (
                <p className="text-lg font-semibold text-green-600">
                  {currencySymbol}{formatPrice(prices.infant)}
                </p>
              )}
              {!hasAdultOrFamily && (
                <p className="text-sm text-amber-600 flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  Requires at least one adult
                </p>
              )}
            </div>
            <GuestCounter
              value={guestCounts.infants}
              maxValue={Math.min(5, maxAvailability - totalGuests + guestCounts.infants)}
              onIncrement={() => updateCount('infants', true)}
              onDecrement={() => updateCount('infants', false)}
              disabled={!hasAdultOrFamily || loading}
            />
          </div>
        </div>

        {/* Family Package */}
        <div className="border-t-2 border-gray-100 pt-4">
          <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-500" />
                  <span className="text-lg font-semibold text-gray-900">Family Package</span>
                </div>
                <p className="text-sm text-gray-500">2 Adults + 2 Children</p>
                {prices?.family && (
                  <p className="text-lg font-semibold text-green-600">
                    {currencySymbol}{formatPrice(prices.family)}
                  </p>
                )}
              </div>
              <GuestCounter
                value={guestCounts.families}
                maxValue={Math.min(5, Math.floor((maxAvailability - totalGuests + (guestCounts.families * 4)) / 4))}
                onIncrement={() => updateCount('families', true)}
                onDecrement={() => updateCount('families', false)}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>

      {totalGuests > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-base font-medium text-blue-700 text-center">
            Total Guests: {totalGuests} / {maxAvailability}
          </p>
        </div>
      )}
    </div>
  );
}