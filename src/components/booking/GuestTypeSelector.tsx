import React from 'react';
import { Users, Baby, UserPlus, Minus, Plus, AlertCircle, Loader2 } from 'lucide-react';

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
}

export function GuestTypeSelector({ 
  guestCounts, 
  prices, 
  onChange,
  currencySymbol = '$',
  loading = false
}: GuestTypeSelectorProps) {
  const hasAdultOrFamily = guestCounts.adults > 0 || guestCounts.families > 0;

  const handleChange = (type: keyof GuestCounts, increment: boolean) => {
    const currentValue = guestCounts[type];
    const maxValue = type === 'families' ? 5 : 10;
    let newValue = increment 
      ? Math.min(currentValue + 1, maxValue)
      : Math.max(0, currentValue - 1);

    if ((type === 'adults' || type === 'families') && newValue === 0 && guestCounts[type] > 0) {
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

  const GuestTypeButton = ({ 
    type,
    label,
    description,
    icon: Icon,
    price,
    value,
    maxValue = 10,
    disabled = false
  }: {
    type: keyof GuestCounts;
    label: string;
    description: string;
    icon: React.ElementType;
    price: number | null | undefined;
    value: number;
    maxValue?: number;
    disabled?: boolean;
  }) => (
    <div className={`
      bg-white rounded-xl p-6 shadow-md border-2 transition-all duration-200
      ${disabled 
        ? 'border-gray-100 opacity-60' 
        : value > 0
          ? 'border-blue-500 shadow-blue-100'
          : 'border-gray-100 hover:border-blue-200'}
    `}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Icon className="h-6 w-6 text-blue-500" />
            <span className="text-lg font-semibold text-gray-900">{label}</span>
          </div>
          <p className="text-sm text-gray-500">{description}</p>
          <div className="flex items-center gap-1 mt-1">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                <span className="text-gray-400">Loading price...</span>
              </div>
            ) : (
              <span className="text-lg font-semibold text-green-600">
                {currencySymbol}{formatPrice(price)}
              </span>
            )}
          </div>
          {disabled && (
            <div className="flex items-center gap-1 mt-1 text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Requires at least one adult or family package</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleChange(type, false)}
              disabled={value === 0 || disabled}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all
                ${value === 0 || disabled
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-110'}
              `}
            >
              <Minus className="h-5 w-5" />
            </button>

            <span className="w-8 text-center font-bold text-xl text-gray-900">
              {value}
            </span>

            <button
              onClick={() => handleChange(type, true)}
              disabled={value === maxValue || disabled}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all
                ${value === maxValue || disabled
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-110'}
              `}
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <Users className="h-7 w-7 text-blue-500" />
        Select Guests
      </h3>

      <div className="grid gap-4">
        <GuestTypeButton
          type="adults"
          label="Adults"
          description="Age 13+"
          icon={UserPlus}
          price={prices?.adult}
          value={guestCounts.adults}
        />

        <GuestTypeButton
          type="children"
          label="Children"
          description="Age 2-12"
          icon={Users}
          price={prices?.child}
          value={guestCounts.children}
          disabled={!hasAdultOrFamily}
        />

        <GuestTypeButton
          type="infants"
          label="Infants"
          description="Under 2"
          icon={Baby}
          price={prices?.infant}
          value={guestCounts.infants}
          disabled={!hasAdultOrFamily}
        />

        <div className="border-t-2 border-gray-100 pt-4">
          <GuestTypeButton
            type="families"
            label="Family Package"
            description="2 Adults + 2 Children"
            icon={Users}
            price={prices?.family}
            value={guestCounts.families}
            maxValue={5}
          />
        </div>
      </div>

      {(guestCounts.adults > 0 || guestCounts.children > 0 || guestCounts.families > 0) && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-base font-medium text-blue-700 text-center">
            Total Guests: {guestCounts.adults + guestCounts.children + guestCounts.infants + (guestCounts.families * 4)}
          </p>
        </div>
      )}
    </div>
  );
}