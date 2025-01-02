import React from 'react';
import { Tour } from '../types/api';
import { MapPin, Clock, Calendar, Info } from 'lucide-react';

interface TourListProps {
  tours: Tour[];
  onTourSelect: (tour: Tour) => void;
}

export function TourList({ tours, onTourSelect }: TourListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">Available Tours</h3>
      <div className="grid gap-4">
        {tours.map((tour) => (
          <div
            key={tour.tour_code}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 cursor-pointer transition-colors"
            onClick={() => onTourSelect(tour)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{tour.name}</h4>
                <p className="text-sm text-gray-500">Code: {tour.tour_code}</p>
              </div>
              {tour.message && (
                <div className="flex items-center text-blue-600">
                  <Info className="h-5 w-5" />
                </div>
              )}
            </div>
            
            <div className="mt-3 space-y-2">
              {tour.web_details?.catch_phrase && (
                <p className="text-sm text-gray-600">{tour.web_details.catch_phrase}</p>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {typeof tour.latitude === 'number' && typeof tour.longitude === 'number' && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{tour.latitude.toFixed(4)}, {tour.longitude.toFixed(4)}</span>
                  </div>
                )}
                
                {Array.isArray(tour.times) && tour.times.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{tour.times.map(t => t.time).join(', ')}</span>
                  </div>
                )}
                
                {tour.tour_duration && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{tour.tour_duration}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}