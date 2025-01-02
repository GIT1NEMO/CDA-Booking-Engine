import React from 'react';
import { Package, Clock, Users } from 'lucide-react';
import { TourExtra } from '../../types/api';

interface ExtraOptionsFormProps {
  options: {
    extraCode: string;
    extraBasisId: number;
    extraSubbasisId: number;
    extraTimeId: number;
  };
  onChange: (options: Partial<ExtraOptionsFormProps['options']>) => void;
  extras: TourExtra[];
  loading?: boolean;
}

export function ExtraOptionsForm({ options, onChange, extras, loading = false }: ExtraOptionsFormProps) {
  const selectedExtra = extras.find(extra => extra.code === options.extraCode);

  // Create a unique key for each extra
  const getExtraKey = (extra: TourExtra) => `${extra.code}-${extra.extra_id}`;

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Extra Options</h4>
      
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Extra Code
          </label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={options.extraCode}
              onChange={(e) => {
                const code = e.target.value;
                const extra = extras.find(ex => ex.code === code);
                onChange({
                  extraCode: code,
                  extraBasisId: extra?.basis_id || 0,
                  extraSubbasisId: extra?.subbasis_id || 0,
                  extraTimeId: extra?.time_id || 0
                });
              }}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              disabled={loading || !extras.length}
            >
              <option value="">
                {loading ? 'Loading extras...' : extras.length ? 'Select extra' : 'No extras available'}
              </option>
              {extras.map((extra) => (
                <option key={getExtraKey(extra)} value={extra.code}>
                  {extra.name} ({extra.code}) - ID: {extra.extra_id}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedExtra && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Basis ID
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={options.extraBasisId}
                  onChange={(e) => onChange({ extraBasisId: Number(e.target.value) })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub-basis ID
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={options.extraSubbasisId}
                  onChange={(e) => onChange({ extraSubbasisId: Number(e.target.value) })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time ID
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={options.extraTimeId}
                  onChange={(e) => onChange({ extraTimeId: Number(e.target.value) })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  disabled={loading}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}