import React, { useEffect } from 'react';
import { Clock, Users, Calendar } from 'lucide-react';
import { Tour } from '../../types/api';

interface TourOptions {
  basisId: number;
  subbasisId: number;
  timeId: number;
}

interface TourOptionsSelectorProps {
  tour: Tour;
  selectedDate: string;
  options: TourOptions;
  onChange: (options: TourOptions) => void;
}

export function TourOptionsSelector({ 
  tour, 
  selectedDate,
  options,
  onChange 
}: TourOptionsSelectorProps) {
  // Find default selections from tour data
  useEffect(() => {
    const defaultBasis = tour.bases.find(b => b.default);
    const defaultSubbasis = defaultBasis?.subbases.find(sb => sb.default);
    const defaultTime = tour.times.find(t => t.default);

    // If we have defaults and no current selections, set them
    if (!options.basisId && defaultBasis) {
      onChange({
        basisId: defaultBasis.id,
        subbasisId: defaultSubbasis?.id || defaultBasis.subbases[0]?.id || 0,
        timeId: defaultTime?.id || tour.times[0]?.id || 0
      });
    }
  }, [tour, options.basisId, onChange]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-6">
        <Calendar className="h-6 w-6 text-blue-500" />
        Tour Options
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={options.timeId}
              onChange={(e) => onChange({ ...options, timeId: Number(e.target.value) })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select time</option>
              {tour.times.map((time) => (
                <option 
                  key={time.id} 
                  value={time.id}
                >
                  {time.time} {time.default ? '(Default)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Basis
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={options.basisId}
              onChange={(e) => {
                const basisId = Number(e.target.value);
                const basis = tour.bases.find(b => b.id === basisId);
                const defaultSubbasis = basis?.subbases.find(sb => sb.default);
                onChange({ 
                  ...options, 
                  basisId,
                  subbasisId: defaultSubbasis?.id || basis?.subbases[0]?.id || 0
                });
              }}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select basis</option>
              {tour.bases.map((basis) => (
                <option 
                  key={basis.id} 
                  value={basis.id}
                >
                  {basis.short_desc} {basis.default ? '(Default)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {options.basisId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sub-basis
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={options.subbasisId}
                onChange={(e) => onChange({ ...options, subbasisId: Number(e.target.value) })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select sub-basis</option>
                {tour.bases
                  .find(b => b.id === options.basisId)
                  ?.subbases.map((subbasis) => (
                    <option 
                      key={subbasis.id} 
                      value={subbasis.id}
                    >
                      {subbasis.description} {subbasis.default ? '(Default)' : ''}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}