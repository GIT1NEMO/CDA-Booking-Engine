import React, { useState, useEffect } from 'react';
import { Code, ChevronDown, ChevronUp } from 'lucide-react';
import { createApiClient } from '../../services/api';
import { storageService } from '../../services/storage';

interface ExtrasViewerProps {
  hostId: string;
  tourCode: string;
  basisId: number;
  subbasisId: number;
  timeId: number;
}

export function ExtrasViewer({
  hostId,
  tourCode,
  basisId,
  subbasisId,
  timeId
}: ExtrasViewerProps) {
  const [extrasData, setExtrasData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExtras = async () => {
      const credentials = storageService.getCredentials();
      if (!credentials) {
        setError('API credentials not found');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const api = createApiClient(credentials);
        const response = await api.readExtras(
          hostId,
          tourCode,
          basisId,
          subbasisId,
          timeId
        );
        setExtrasData(response);
      } catch (err) {
        setError('Failed to load extras data');
        console.error('Error loading extras:', err);
      } finally {
        setLoading(false);
      }
    };

    if (hostId && tourCode && basisId && subbasisId && timeId) {
      fetchExtras();
    }
  }, [hostId, tourCode, basisId, subbasisId, timeId]);

  return (
    <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-gray-700">Available Extras Data</span>
          {loading && (
            <span className="text-sm text-gray-500">(Loading...)</span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 bg-gray-900 overflow-x-auto">
          {error ? (
            <div className="text-red-400 p-4">{error}</div>
          ) : loading ? (
            <div className="text-gray-400 p-4">Loading extras data...</div>
          ) : extrasData ? (
            <pre className="text-sm text-gray-100">
              {JSON.stringify(extrasData, null, 2)}
            </pre>
          ) : (
            <div className="text-gray-400 p-4">No extras data available</div>
          )}
        </div>
      )}
    </div>
  );
}