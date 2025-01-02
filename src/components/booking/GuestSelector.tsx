import React from 'react';
import { Users, Baby, UserPlus } from 'lucide-react';

interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  families: number;
}

interface GuestSelectorProps {
  guestCounts: GuestCounts;
  onChange: (counts: GuestCounts) => void;
}

export function GuestSelector({ guestCounts, onChange }: GuestSelectorProps) {
  const updateCount = (type: keyof GuestCounts, value: number) => {
    onChange({
      ...guestCounts,
      [type]: Math.max(0, value)
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Users className="h-5 w-5 text-blue-500" />
        Number of Guests
      </h3>

      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-700">Adults</p>
            <p className="text-sm text-gray-500">Age 13+</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateCount('adults', guestCounts.adults - 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
            >
              -
            </button>
            <span className="w-8 text-center font-medium">{guestCounts.adults}</span>
            <button
              onClick={() => updateCount('adults', guestCounts.adults + 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-700">Children</p>
            <p className="text-sm text-gray-500">Age 2-12</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateCount('children', guestCounts.children - 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
            >
              -
            </button>
            <span className="w-8 text-center font-medium">{guestCounts.children}</span>
            <button
              onClick={() => updateCount('children', guestCounts.children + 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-700">Infants</p>
            <p className="text-sm text-gray-500">Under 2</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateCount('infants', guestCounts.infants - 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
            >
              -
            </button>
            <span className="w-8 text-center font-medium">{guestCounts.infants}</span>
            <button
              onClick={() => updateCount('infants', guestCounts.infants + 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-700">Family Package</p>
            <p className="text-sm text-gray-500">2 Adults + 2 Children</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateCount('families', guestCounts.families - 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
            >
              -
            </button>
            <span className="w-8 text-center font-medium">{guestCounts.families}</span>
            <button
              onClick={() => updateCount('families', guestCounts.families + 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}