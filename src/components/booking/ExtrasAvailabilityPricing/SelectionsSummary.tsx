import React, { useState, useMemo } from 'react';
import { Code, ChevronDown, ChevronUp, DollarSign } from 'lucide-react';

interface SelectionsSummaryProps {
  selections: Array<{
    adultId: number;
    extraId: string | null;
  }>;
  availableExtras: Array<{
    id: string;
    code: string;
    name: string;
    pricing?: {
      adult_tour_sell: number;
      currency_symbol: string;
    };
  }>;
  loading?: boolean;
}

export function SelectionsSummary({ selections, availableExtras, loading = false }: SelectionsSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(true); // Start expanded by default

  const summary = useMemo(() => {
    const activeSelections = selections.filter(s => s.extraId !== null);
    const total = activeSelections.reduce((sum, selection) => {
      const extra = availableExtras.find(e => e.code === selection.extraId);
      return sum + (extra?.pricing?.adult_tour_sell || 0);
    }, 0);

    const currency = availableExtras[0]?.pricing?.currency_symbol || '$';

    return {
      activeCount: activeSelections.length,
      total,
      currency,
      details: activeSelections.map(selection => {
        const extra = availableExtras.find(e => e.code === selection.extraId);
        return {
          adultId: selection.adultId,
          extraName: extra?.name || 'Unknown Extra',
          price: extra?.pricing?.adult_tour_sell || 0,
          extraCode: extra?.code || ''
        };
      })
    };
  }, [selections, availableExtras]);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
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
          {summary.activeCount > 0 && (
            <span className="text-sm text-blue-600">
              ({summary.activeCount} selected)
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
        <div className="divide-y divide-gray-100">
          {/* JSON View */}
          <div className="p-4 bg-gray-900">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs text-gray-400">Raw Selection Data:</span>
            </div>
            <pre className="text-sm text-gray-100 whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify({
                selections: selections.filter(s => s.extraId !== null).map(s => ({
                  adultId: s.adultId,
                  extraId: s.extraId,
                  extraDetails: availableExtras.find(e => e.code === s.extraId)
                })),
                totalPrice: summary.total,
                currency: summary.currency
              }, null, 2)}
            </pre>
          </div>

          {/* Summary View */}
          {summary.activeCount > 0 ? (
            <div className="p-4 bg-white">
              <div className="space-y-3">
                {summary.details.map((detail, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div className="space-y-1">
                      <span className="text-gray-600">
                        Adult {detail.adultId}
                      </span>
                      <div>
                        <p className="text-gray-900">{detail.extraName}</p>
                        <p className="text-xs text-gray-500">Code: {detail.extraCode}</p>
                      </div>
                    </div>
                    <span className="font-medium text-gray-900">
                      {summary.currency}{detail.price.toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-medium text-gray-700">Total</span>
                  <div className="flex items-center gap-1 text-green-600 font-bold">
                    <DollarSign className="h-4 w-4" />
                    <span>{summary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-gray-500 text-center">
              No extras selected
            </div>
          )}
        </div>
      )}
    </div>
  );
}