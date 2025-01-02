import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { Tour } from '../../types/api';

interface TourOptionsFormProps {
  tour: Tour;
  options: {
    date: string;
    basisId: number;
    subbasisId: number;
    timeId: number;
  };
  onChange: (options: Partial<TourOptionsFormProps['options']>) => void;
}

export function TourOptionsForm({ tour, options, onChange }: TourOptionsFormProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Tour Options</h4>
      
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={options.date}
              onChange={(e) => onChange({ date: e.target.value })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            />
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
                onChange({
                  basisId,
                  subbasisId: basis?.subbases[0]?.id || 0
                });
              }}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select basis</option>
              {tour.bases.map((basis) => (
                <option key={basis.id} value={basis.id}>
                  {basis.short_desc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {options.basisId > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sub-basis
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={options.subbasisId}
                onChange={(e) => onChange({ subbasisId: Number(e.target.value) })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select sub-basis</option>
                {tour.bases
                  .find(b => b.id === options.basisId)
                  ?.subbases.map((subbasis) => (
                    <option key={subbasis.id} value={subbasis.id}>
                      {subbasis.description}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={options.timeId}
              onChange={(e) => onChange({ timeId: Number(e.target.value) })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select time</option>
              {tour.times.map((time) => (
                <option key={time.id} value={time.id}>
                  {time.time}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}