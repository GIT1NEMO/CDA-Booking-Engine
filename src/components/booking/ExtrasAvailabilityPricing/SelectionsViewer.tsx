import React, { useState } from 'react';
import { Code, ChevronDown, ChevronUp } from 'lucide-react';

interface SelectionsViewerProps {
  selections: Array<{
    adultId: number;
    extraId: string | null;
  }>;
  loading?: boolean;
}

export function SelectionsViewer({ selections, loading = false }: SelectionsViewerProps) {
  const [isExpanded, setIsExpanded] = useState(true); // Start expanded by default

  // Filter out selections with no extraId for a cleaner view
  const activeSelections = selections.filter(s => s.extraId !== null);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-blue-500" />
          <span className="font-medium text-gray-700">Current Selections</span>
          {loading && (
            <span className="text-sm text-gray-500">(Loading...)</span>
          )}
          {activeSelections.length > 0 && (
            <span className="text-sm text-blue-600">
              ({activeSelections.length} active)
            </span>
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
            <div className="text-gray-400 p-4">Loading selections...</div>
          ) : activeSelections.length > 0 ? (
            <pre className="text-sm text-gray-100 whitespace-pre-wrap">
              {JSON.stringify(activeSelections, null, 2)}
            </pre>
          ) : (
            <div className="text-gray-400 p-4">No extras selected yet</div>
          )}
        </div>
      )}
    </div>
  );
}