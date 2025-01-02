import React from 'react';
import { Users, Package } from 'lucide-react';
import { ProcessedExtra } from '../../../types/extras';

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
  const selectedExtra = processedData.find(extra => extra.code === selection.extraId);
  const selectId = `adult-${selection.adultId}-extra`;
  const selectName = `adult-${selection.adultId}-extra`;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onSelect(selection.adultId, value === '' ? null : value);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          <span className="font-medium text-gray-900">Adult {selection.adultId}</span>
        </div>

        <div className="space-y-2">
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
            Select Extra
          </label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              id={selectId}
              name={selectName}
              value={selection.extraId || ''}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-label={`Select extra for Adult ${selection.adultId}`}
            >
              <option value="">No extra selected</option>
              {processedData.map((extra) => (
                <option key={extra.code} value={extra.code}>
                  {extra.name} ({extra.pricing?.currency_symbol}
                  {extra.pricing?.adult_tour_sell.toFixed(2)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedExtra && (
          <div className="mt-2 p-3 bg-gray-50 rounded-md">
            <div className="text-sm space-y-1">
              <p className="text-gray-900 font-medium">{selectedExtra.name}</p>
              <p className="text-gray-500">Code: {selectedExtra.code}</p>
              <p className="text-green-600 font-medium">
                Price: {selectedExtra.pricing?.currency_symbol}
                {selectedExtra.pricing?.adult_tour_sell.toFixed(2)}
              </p>
              {selectedExtra.conditions && (
                <p className="text-gray-600 text-sm mt-2">{selectedExtra.conditions}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}