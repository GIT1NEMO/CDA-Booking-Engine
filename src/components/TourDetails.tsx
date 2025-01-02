import React, { useState } from 'react';
import { Tour, AvailabilityResult, PriceResult } from '../types/api';
import { 
  MapPin, Clock, Calendar, Phone, Mail, AlertCircle, 
  Save, Share2, Package, X, Pencil 
} from 'lucide-react';
import { AvailabilityChecker } from './AvailabilityChecker';
import { ExtrasChecker } from './extras/ExtrasChecker';
import { Link } from 'react-router-dom';
import { tourService } from '../services/database/tourService';
import { LoadingOverlay } from './common/LoadingOverlay';

interface TourDetailsProps {
  tour: Tour;
  onClose: () => void;
  onCheckAvailability: (tourDate: string, basisId: number, subbasisId: number, timeId: number) => Promise<AvailabilityResult | null>;
  onCheckPrices: (tourDate: string, basisId: number, subbasisId: number, timeId: number) => Promise<PriceResult | null>;
  onEdit: () => void;
}

export function TourDetails({ 
  tour, 
  onClose, 
  onCheckAvailability,
  onCheckPrices,
  onEdit
}: TourDetailsProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [savedExtras, setSavedExtras] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await tourService.saveTour(tour, savedExtras);
      setIsSaved(true);
    } catch (err) {
      setError('Failed to save tour data');
      console.error('Failed to save tour:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await tourService.saveTour(tour, savedExtras);
      setIsPublished(true);
    } catch (err) {
      setError('Failed to publish tour data');
      console.error('Failed to publish tour:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExtrasUpdate = (extras: any[]) => {
    setSavedExtras(extras);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {loading && <LoadingOverlay />}

      {/* Header Section */}
      <div className="border-b border-gray-200">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{tour.name}</h3>
              <p className="mt-1 text-sm text-gray-500">Tour Code: {tour.tour_code}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-md
                ${isSaved 
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'}
                transition-colors
              `}
            >
              <Save className="h-5 w-5" />
              {isSaved ? 'Saved' : 'Save Tour'}
            </button>
            <button
              onClick={handlePublish}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-md
                ${isPublished
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'}
                transition-colors
              `}
            >
              <Share2 className="h-5 w-5" />
              {isPublished ? 'Published' : 'Publish Tour'}
            </button>
          </div>
          
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            <Pencil className="h-5 w-5" />
            Edit Tour
          </button>
        </div>
      </div>

      {error && (
        <div className="m-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Success Message for Published Tour */}
      {isPublished && (
        <div className="m-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-green-800">Tour Published Successfully!</h4>
              <p className="text-sm text-green-600">The tour is now available for customer bookings.</p>
            </div>
            <Link
              to={`/booking?tour=${tour.tour_code}`}
              className="flex items-center gap-1 px-3 py-1.5 bg-white text-green-600 rounded-md border border-green-200 hover:bg-green-50"
            >
              <Share2 className="h-4 w-4" />
              View Booking Page
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6">
        <div className="grid gap-6">
          {/* Tour Basic Info */}
          <div className="grid gap-4">
            {tour.web_details?.catch_phrase && (
              <p className="text-gray-600 italic">{tour.web_details.catch_phrase}</p>
            )}

            <div className="flex flex-wrap gap-4">
              {typeof tour.latitude === 'number' && typeof tour.longitude === 'number' && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">
                    {tour.latitude}, {tour.longitude}
                  </span>
                </div>
              )}
              
              {Array.isArray(tour.times) && tour.times.length > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">
                    Available times: {tour.times.map(t => t.time).join(', ')}
                  </span>
                </div>
              )}
              
              {tour.tour_duration && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">Duration: {tour.tour_duration}</span>
                </div>
              )}
            </div>
          </div>

          {/* Availability Checker */}
          <AvailabilityChecker
            tour={tour}
            onCheckAvailability={onCheckAvailability}
            onCheckPrices={onCheckPrices}
          />

          {/* Extras Checker */}
          <ExtrasChecker 
            tour={tour} 
            onExtrasUpdate={handleExtrasUpdate}
            savedExtras={savedExtras}
          />

          {/* Description Section */}
          {tour.description && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Description</h4>
              <p className="text-gray-700">{tour.description}</p>
            </div>
          )}

          {/* Travel Terms Section */}
          {tour.travel_terms && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Travel Terms</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700 mb-4">{tour.travel_terms.travel_terms_description}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{tour.travel_terms.organisation_phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{tour.travel_terms.organisation_email}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Notes Section */}
          {(tour.ticket_comment || tour.tour_comment) && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Additional Notes</h4>
              {tour.ticket_comment && (
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-500 mt-1" />
                  <p className="text-gray-700">{tour.ticket_comment}</p>
                </div>
              )}
              {tour.tour_comment && (
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-500 mt-1" />
                  <p className="text-gray-700">{tour.tour_comment}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}