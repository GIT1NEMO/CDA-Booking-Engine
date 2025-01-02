import React, { useState } from 'react';
import { User, Mail, Phone, Loader2 } from 'lucide-react';
import { reservationService } from '../../services/reservationService';
import { storageService } from '../../services/storage';
import { BookingConfirmation } from '../booking/BookingConfirmation';
import { BookingReview } from '../booking/BookingReview';

interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface CustomerFormProps {
  tour: any;
  selectedDate: string;
  tourOptions: any;
  guestCounts: any;
  selectedExtras: any[];
  onBack: () => void;
}

export function CustomerForm({ 
  tour,
  selectedDate,
  tourOptions,
  guestCounts,
  selectedExtras,
  onBack
}: CustomerFormProps) {
  const [details, setDetails] = useState<CustomerDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservationCheck, setReservationCheck] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const credentials = storageService.getCredentials();
      if (!credentials) {
        throw new Error('API credentials not found');
      }

      const response = await reservationService.checkReservation(
        tour,
        selectedDate,
        tourOptions,
        guestCounts,
        selectedExtras,
        credentials
      );

      if (response.errors && response.errors.length > 0) {
        setError(response.errors.join(', '));
        setShowConfirmation(true);
        return;
      }

      setReservationCheck(response);
      setShowReview(true);
    } catch (err) {
      setError('Failed to check reservation. Please try again.');
      setShowConfirmation(true);
    } finally {
      setLoading(false);
    }
  };

  if (showReview && reservationCheck) {
    return (
      <BookingReview
        bookingDetails={{
          date: selectedDate,
          tourName: tour.name,
          guestCounts,
          selectedExtras: selectedExtras.map(extra => ({
            name: extra.name,
            price: extra.price || 0
          })),
          prices: reservationCheck.prices
        }}
        onConfirm={() => {
          // Handle final booking confirmation
          setShowConfirmation(true);
        }}
        onBack={() => setShowReview(false)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      {showConfirmation && (
        <BookingConfirmation
          success={!error}
          message={error || 'Your booking has been confirmed!'}
          onClose={() => setShowConfirmation(false)}
        />
      )}

      <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Details</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={details.firstName}
              onChange={(e) => setDetails({ ...details, firstName: e.target.value })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={details.lastName}
              onChange={(e) => setDetails({ ...details, lastName: e.target.value })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="email"
            value={details.email}
            onChange={(e) => setDetails({ ...details, email: e.target.value })}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="tel"
            value={details.phone}
            onChange={(e) => setDetails({ ...details, phone: e.target.value })}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Checking...</span>
            </div>
          ) : (
            'Continue to Booking'
          )}
        </button>
      </div>
    </form>
  );
}