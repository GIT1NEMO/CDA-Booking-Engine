import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Pencil, Trash2, Share2 } from 'lucide-react';
import { Tour } from '../../types/api';
import { tourService } from '../../services/database/tourService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { generateTourUrl } from '../../utils/urlUtils';

export function PublishedTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingTourCode, setDeletingTourCode] = useState<string | null>(null);

  useEffect(() => {
    loadPublishedTours();
  }, []);

  const loadPublishedTours = async () => {
    try {
      setLoading(true);
      setError(null);
      const publishedTours = await tourService.getPublishedTours();
      setTours(publishedTours);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load published tours';
      setError(errorMessage);
      console.error('Error loading published tours:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tourCode: string) => {
    if (!confirm('Are you sure you want to delete this published tour?')) {
      return;
    }

    try {
      setDeletingTourCode(tourCode);
      setError(null);
      
      await tourService.deletePublishedTour(tourCode);
      setTours(prevTours => prevTours.filter(tour => tour.tour_code !== tourCode));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete tour';
      setError(errorMessage);
      console.error('Error deleting tour:', err);
    } finally {
      setDeletingTourCode(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900">Published Tours</h2>
        </div>
      </div>

      <div className="p-6">
        {tours.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No published tours found
          </div>
        ) : (
          <div className="grid gap-4">
            {tours.map((tour) => (
              <div
                key={tour.tour_code}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {tour.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Code: {tour.tour_code}
                    </p>
                    {tour.web_details?.catch_phrase && (
                      <p className="text-sm text-gray-600 mt-1">
                        {tour.web_details.catch_phrase}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={generateTourUrl(tour)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Booking Page"
                    >
                      <Share2 className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(tour.tour_code)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete Tour"
                      disabled={deletingTourCode === tour.tour_code}
                    >
                      {deletingTourCode === tour.tour_code ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                    <Link
                      to={`/admin/tours/${tour.tour_code}/edit`}
                      className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Edit Tour"
                    >
                      <Pencil className="h-5 w-5" />
                    </Link>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  {tour.tour_duration && (
                    <div className="text-gray-600">
                      Duration: {tour.tour_duration}
                    </div>
                  )}
                  {tour.bases?.length > 0 && (
                    <div className="text-gray-600">
                      Bases: {tour.bases.length}
                    </div>
                  )}
                  {tour.times?.length > 0 && (
                    <div className="text-gray-600">
                      Available Times: {tour.times.length}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}