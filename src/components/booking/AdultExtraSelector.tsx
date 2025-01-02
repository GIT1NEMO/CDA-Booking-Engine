import React from 'react';
import { Package, Users } from 'lucide-react';
import { ProcessedExtra } from '../../types/extras';

interface AdultExtraSelectorProps {
  selection: {
    adultId: number;
    extraId: string | null;
  };
  processedData: ProcessedExtra[];
  onSelect: (adultId: number, extraId: string | null) => void;
}

export function AdultExtraSelector({
  selection,
  processedData,
  onSelect
}: AdultExtraSelectorProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          <span className="font-medium text-gray-900">Adult {selection.adultId}</span>
        </div>

        <div className="grid gap-4">
          {processedData.map((extra) => (
            <label
              key={extra.code}
              className={`
                flex items-center justify-between p-4 rounded-lg border-2 
                ${selection.extraId === extra.code
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'}
              `}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name={`extra-${selection.adultId}`}
                  value={extra.code}
                  checked={selection.extraId === extra.code}
                  onChange={() => onSelect(selection.adultId, extra.code)}
                  className="h-4 w-4 text-blue-600"
                />
                <div>
                  <p className="font-medium text-gray-900">{extra.name}</p>
                  <p className="text-sm text-gray-500">Code: {extra.code}</p>
                </div>
              </div>
              {extra.pricing && (
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    {extra.pricing.currency_symbol}
                    {extra.pricing.adult_tour_sell.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {extra.availability?.available || 0} available
                  </p>
                </div>
              )}
            </label>
          ))}

          <button
            onClick={() => onSelect(selection.adultId, null)}
            className={`
              p-4 rounded-lg border-2 text-left
              ${!selection.extraId
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-200'}
            `}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name={`extra-${selection.adultId}`}
                checked={!selection.extraId}
                onChange={() => onSelect(selection.adultId, null)}
                className="h-4 w-4 text-blue-600"
              />
              <span className="font-medium text-gray-900">No extra selected</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}