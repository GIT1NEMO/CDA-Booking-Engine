import React from 'react';
import { Package } from 'lucide-react';
import { ExtrasList } from './ExtrasList';
import { ExtrasJsonViewer } from './ExtrasJsonViewer';
import { useTourExtras } from '../../hooks/useTourExtras';

interface ExtrasSectionProps {
  hostId: string;
  tourCode: string;
  basisId: number;
  subbasisId: number;
  timeId: number;
  selectedDate: string;
}

export function ExtrasSection({ 
  hostId,
  tourCode,
  basisId,
  subbasisId,
  timeId,
  selectedDate
}: ExtrasSectionProps) {
  // Validate props before using them
  const hasValidProps = Boolean(
    hostId &&
    tourCode &&
    basisId &&
    subbasisId &&
    timeId &&
    selectedDate
  );

  const { 
    extras,
    loading,
    error,
    rawData
  } = useTourExtras({
    hostId,
    tourCode,
    basisId,
    subbasisId,
    timeId,
    tourDate: selectedDate
  });

  if (!hasValidProps) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-blue-500" />
          <h3 className="text-xl font-semibold text-gray-900">Tour Extras</h3>
        </div>
        <div className="bg-amber-50 text-amber-700 p-4 rounded-lg">
          Please select all tour options to view available extras
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Package className="h-6 w-6 text-blue-500" />
        <h3 className="text-xl font-semibold text-gray-900">Tour Extras</h3>
      </div>

      <ExtrasList 
        extras={extras}
        loading={loading}
        error={error}
      />

      <ExtrasJsonViewer 
        data={rawData}
        loading={loading}
      />
    </div>
  );
}