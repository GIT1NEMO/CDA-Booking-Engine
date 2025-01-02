import React, { useState } from 'react';
import { Tour, AvailabilityResult, PriceResult } from '../types/api';
import { Calendar, Clock, Users } from 'lucide-react';
import { PriceDisplay } from './PriceDisplay';

interface AvailabilityCheckerProps {
  tour: Tour;
  onCheckAvailability: (tourDate: string, basisId: number, subbasisId: number, timeId: number) => Promise<AvailabilityResult | null>;
  onCheckPrices: (tourDate: string, basisId: number, subbasisId: number, timeId: number) => Promise<PriceResult | null>;
}

export function AvailabilityChecker({ 
  tour, 
  onCheckAvailability,
  onCheckPrices 
}: AvailabilityCheckerProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedBasis, setSelectedBasis] = useState<number | null>(null);
  const [selectedSubBasis, setSelectedSubBasis] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [availability, setAvailability] = useState<AvailabilityResult | null>(null);
  const [price, setPrice] = useState<PriceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!selectedDate || !selectedBasis || !selectedSubBasis || !selectedTime) {
      setError('Please select all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    setPrice(null);
    
    try {
      const [availabilityResult, priceResult] = await Promise.all([
        onCheckAvailability(
          selectedDate,
          selectedBasis,
          selectedSubBasis,
          selectedTime
        ),
        onCheckPrices(
          selectedDate,
          selectedBasis,
          selectedSubBasis,
          selectedTime
        )
      ]);

      setAvailability(availabilityResult);
      setPrice(priceResult);
    } catch (err) {
      setError('Failed to check availability and pricing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Check Availability & Pricing</h3>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Basis
          </label>
          <select
            value={selectedBasis || ''}
            onChange={(e) => {
              setSelectedBasis(Number(e.target.value));
              setSelectedSubBasis(null);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select basis</option>
            {tour.bases.map((basis) => (
              <option key={basis.id} value={basis.id}>
                {basis.short_desc}
              </option>
            ))}
          </select>
        </div>

        {selectedBasis && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sub-basis
            </label>
            <select
              value={selectedSubBasis || ''}
              onChange={(e) => setSelectedSubBasis(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select sub-basis</option>
              {tour.bases
                .find((b) => b.id === selectedBasis)
                ?.subbases.map((subbasis) => (
                  <option key={subbasis.id} value={subbasis.id}>
                    {subbasis.description}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <select
            value={selectedTime || ''}
            onChange={(e) => setSelectedTime(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select time</option>
            {tour.times.map((time) => (
              <option key={time.id} value={time.id}>
                {time.time}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCheck}
          disabled={loading || !selectedDate || !selectedBasis || !selectedSubBasis || !selectedTime}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Checking...' : 'Check Availability & Pricing'}
        </button>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {availability && (
          <div className="p-4 bg-gray-50 rounded-md space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700">{availability.tour_date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700">
                {tour.times.find((t) => t.id === availability.tour_time_id)?.time}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700">
                {availability.availability} seats available
                {availability.threshold && ' (minimum)'}
              </span>
            </div>
            {!availability.operational && (
              <div className="text-amber-600">
                Tour is not operational on this date
              </div>
            )}
            {availability.expired && (
              <div className="text-red-600">
                Availability has expired
              </div>
            )}
          </div>
        )}

        {price && <PriceDisplay price={price} />}
      </div>
    </div>
  );
}