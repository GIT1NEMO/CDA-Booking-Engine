import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleJsonViewProps {
  data: any;
}

export function CollapsibleJsonView({ data }: CollapsibleJsonViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="text-sm text-gray-600">
          {isExpanded ? 'Hide' : 'Show'} Raw Data
        </span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="p-3 bg-gray-900 overflow-x-auto">
          <pre className="text-xs text-gray-100 whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}