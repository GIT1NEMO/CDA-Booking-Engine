import React from 'react';
import { Package, AlertCircle } from 'lucide-react';
import { AdultExtraSelector } from './AdultExtraSelector';
import { SelectionsSummary } from './SelectionsSummary';
import { LoadingState } from '../common/LoadingState';
import { useExtrasData } from '../../hooks/useExtrasData';
import { ExtraOption } from '../../types/extras';

interface ExtrasAvailabilityPricingProps {
  extras: ExtraOption[];
  selectedDate: string;
  numberOfAdults: number;
  onSelectionsChange: (selections: Array<{ adultId: number; extraId: string | null }>) => void;
}

export function ExtrasAvailabilityPricing({ 
  extras, 
  selectedDate,
  numberOfAdults,
  onSelectionsChange
}: ExtrasAvailabilityPricingProps) {
  const {
    processedData,
    loading,
    error,
    adultSelections,
    handleExtraSelection,
    expandedAdultId,
    setExpandedAdultId
  } = useExtrasData({
    extras,
    selectedDate,
    numberOfAdults,
    onSelectionsChange
  });

  if (!extras.length || numberOfAdults === 0) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div className="flex items-center gap-2">
        <Package className="h-6 w-6 text-blue-500" />
        <h3 className="text-xl font-semibold text-gray-900">Optional Extras</h3>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <LoadingState message="Loading extras..." />
      ) : (
        <div className="space-y-6">
          {adultSelections.map((selection) => (
            <AdultExtraSelector
              key={selection.adultId}
              selection={selection}
              processedData={processedData}
              onSelect={handleExtraSelection}
            />
          ))}

          <SelectionsSummary 
            selections={adultSelections}
            availableExtras={processedData}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}