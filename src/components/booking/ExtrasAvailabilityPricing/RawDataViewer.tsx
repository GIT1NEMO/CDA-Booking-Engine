import React, { useState } from 'react';
import { JsonViewer } from '../../common/JsonViewer';

interface RawDataViewerProps {
  rawData: {
    availability: any;
    pricing: any;
  };
  loading: boolean;
}

export function RawDataViewer({ rawData, loading }: RawDataViewerProps) {
  const [showRawData, setShowRawData] = useState(false);

  return (
    <div className="pt-4 border-t border-gray-200">
      <button
        onClick={() => setShowRawData(!showRawData)}
        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
      >
        {showRawData ? 'Hide' : 'Show'} Raw API Data
      </button>
      
      {showRawData && (
        <div className="mt-4 space-y-4">
          <JsonViewer
            data={rawData.availability}
            title="Raw Availability Data"
            loading={loading}
          />
          <JsonViewer
            data={rawData.pricing}
            title="Raw Pricing Data"
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}