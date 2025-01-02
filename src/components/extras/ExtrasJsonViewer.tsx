import React, { useState, useMemo } from 'react';
import { Code, ChevronDown, ChevronUp } from 'lucide-react';

interface ExtrasJsonViewerProps {
  data: any;
  loading?: boolean;
}

export function ExtrasJsonViewer({ data, loading = false }: ExtrasJsonViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedJson = useMemo(() => {
    if (!data) return '';
    try {
      // Remove any circular references or non-serializable data
      const sanitizedData = JSON.parse(JSON.stringify(data));
      return JSON.stringify(sanitizedData, null, 2);
    } catch (error) {
      console.error('Failed to format JSON:', error);
      return 'Error formatting data';
    }
  }, [data]);

  return (
    <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-gray-700">Raw Extras Data</span>
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
          {loading ? (
            <div className="text-gray-400 p-4">Loading data...</div>
          ) : formattedJson ? (
            <pre className="text-sm text-gray-100 whitespace-pre-wrap">
              {formattedJson}
            </pre>
          ) : (
            <div className="text-gray-400 p-4">No data available</div>
          )}
        </div>
      )}
    </div>
  );
}