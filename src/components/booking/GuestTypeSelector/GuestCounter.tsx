import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface GuestCounterProps {
  value: number;
  maxValue: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
}

export function GuestCounter({ 
  value, 
  maxValue, 
  onIncrement, 
  onDecrement, 
  disabled = false 
}: GuestCounterProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onDecrement}
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
        onClick={onIncrement}
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
  );
}