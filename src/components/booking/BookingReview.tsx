import React from 'react';
import { CheckCircle, Calendar, Users, Package, DollarSign } from 'lucide-react';

interface BookingReviewProps {
  bookingDetails: {
    date: string;
    tourName: string;
    guestCounts: {
      adults: number;
      children: number;
      infants: number;
      families: number;
    };
    selectedExtras: Array<{
      name: string;
      price: number;
    }>;
    prices: {
      tour_sell: number;
      extra: number;
      transfer: number;
      tour_levy: number;
      currency: string;
      discount: number;
      total: number;
    };
  };
  onConfirm: () => void;
  onBack: () => void;
}

export function BookingReview({ bookingDetails, onConfirm, onBack }: BookingReviewProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-8">
        <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Review Your Booking</h2>
            <p className="text-gray-600">Please review the details before confirming</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-blue-500 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900">Tour Details</h3>
              <p className="text-gray-600">{bookingDetails.tourName}</p>
              <p className="text-gray-600">{formatDate(bookingDetails.date)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-blue-500 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900">Guest Details</h3>
              <div className="space-y-1 text-gray-600">
                {bookingDetails.guestCounts.adults > 0 && (
                  <p>{bookingDetails.guestCounts.adults} Adults</p>
                )}
                {bookingDetails.guestCounts.children > 0 && (
                  <p>{bookingDetails.guestCounts.children} Children</p>
                )}
                {bookingDetails.guestCounts.infants > 0 && (
                  <p>{bookingDetails.guestCounts.infants} Infants</p>
                )}
                {bookingDetails.guestCounts.families > 0 && (
                  <p>{bookingDetails.guestCounts.families} Family Packages</p>
                )}
              </div>
            </div>
          </div>

          {bookingDetails.selectedExtras.length > 0 && (
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-blue-500 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Selected Extras</h3>
                <div className="space-y-2">
                  {bookingDetails.selectedExtras.map((extra, index) => (
                    <div key={index} className="flex justify-between text-gray-600">
                      <span>{extra.name}</span>
                      <span>{bookingDetails.prices.currency} {extra.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-green-500 mt-1" />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Price Breakdown</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Tour Price</span>
                  <span>{bookingDetails.prices.currency} {bookingDetails.prices.tour_sell.toFixed(2)}</span>
                </div>
                {bookingDetails.prices.extra > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Extras</span>
                    <span>{bookingDetails.prices.currency} {bookingDetails.prices.extra.toFixed(2)}</span>
                  </div>
                )}
                {bookingDetails.prices.transfer > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Transfer</span>
                    <span>{bookingDetails.prices.currency} {bookingDetails.prices.transfer.toFixed(2)}</span>
                  </div>
                )}
                {bookingDetails.prices.tour_levy > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tour Levy</span>
                    <span>{bookingDetails.prices.currency} {bookingDetails.prices.tour_levy.toFixed(2)}</span>
                  </div>
                )}
                {bookingDetails.prices.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{bookingDetails.prices.currency} {bookingDetails.prices.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{bookingDetails.prices.currency} {bookingDetails.prices.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            onClick={onBack}
            className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Back
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}