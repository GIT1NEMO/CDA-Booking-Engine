import React, { useState } from 'react';
import { Tour } from '../../types/api';
import { Save, Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';

interface TourFormProps {
  initialTour?: Tour;
  onSave: (tour: Partial<Tour>) => void;
}

export function TourForm({ initialTour, onSave }: TourFormProps) {
  const [tour, setTour] = useState<Partial<Tour>>(initialTour || {
    name: '',
    tour_code: '',
    description: '',
    tour_duration: '',
    latitude: undefined,
    longitude: undefined,
    bases: [],
    times: [],
    web_details: {
      catch_phrase: '',
      additional: '',
      title: '',
    },
    travel_terms: {
      travel_terms_description: '',
      organisation_email: '',
      organisation_phone: '',
      organisation_name: '',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(tour);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Existing form content remains exactly the same */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Tour Details</h2>
          
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tour Name
                </label>
                <input
                  type="text"
                  value={tour.name}
                  onChange={(e) => setTour({ ...tour, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tour Code
                </label>
                <input
                  type="text"
                  value={tour.tour_code}
                  onChange={(e) => setTour({ ...tour, tour_code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={tour.description}
                onChange={(e) => setTour({ ...tour, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={tour.tour_duration}
                  onChange={(e) => setTour({ ...tour, tour_duration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., 4 hours"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={tour.latitude}
                  onChange={(e) => setTour({ ...tour, latitude: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={tour.longitude}
                  onChange={(e) => setTour({ ...tour, longitude: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Web Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catch Phrase
              </label>
              <input
                type="text"
                value={tour.web_details?.catch_phrase}
                onChange={(e) => setTour({
                  ...tour,
                  web_details: { ...tour.web_details, catch_phrase: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Information
              </label>
              <textarea
                value={tour.web_details?.additional}
                onChange={(e) => setTour({
                  ...tour,
                  web_details: { ...tour.web_details, additional: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={4}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Travel Terms</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Terms Description
              </label>
              <textarea
                value={tour.travel_terms?.travel_terms_description}
                onChange={(e) => setTour({
                  ...tour,
                  travel_terms: { ...tour.travel_terms, travel_terms_description: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Email
                </label>
                <input
                  type="email"
                  value={tour.travel_terms?.organisation_email}
                  onChange={(e) => setTour({
                    ...tour,
                    travel_terms: { ...tour.travel_terms, organisation_email: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Phone
                </label>
                <input
                  type="tel"
                  value={tour.travel_terms?.organisation_phone}
                  onChange={(e) => setTour({
                    ...tour,
                    travel_terms: { ...tour.travel_terms, organisation_phone: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Save className="h-5 w-5" />
          Save Tour
        </button>
      </form>

      {/* Add link to customer booking interface */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">View Customer Booking Interface</h3>
            <p className="text-sm text-gray-500">Preview how customers will see and book this tour</p>
          </div>
          <a
            href="/booking"
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-md border border-blue-200 hover:bg-blue-50 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Open Booking Page
          </a>
        </div>
      </div>
    </div>
  );
}