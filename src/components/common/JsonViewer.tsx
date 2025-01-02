import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Code } from 'lucide-react';

interface JsonViewerProps {
  data: any;
  title?: string;
  loading?: boolean;
  error?: string | null;
}

export function JsonViewer({ data, title = 'JSON Data', loading = false, error = null }: JsonViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-gray-700">{title}</span>
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
            <div className="text-gray-400 p-4">Loading data...</div>
          ) : data ? (
            <pre className="text-sm text-gray-100">
              {JSON.stringify(data, null, 2)}
            </pre>
          ) : (
            <div className="text-gray-400 p-4">No data available</div>
          )}
        </div>
      )}
    </div>
  );
}