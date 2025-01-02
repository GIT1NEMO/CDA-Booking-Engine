import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface BookingConfirmationProps {
  success: boolean;
  message: string;
  onClose: () => void;
}

export function BookingConfirmation({ success, message, onClose }: BookingConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
        <div className="flex flex-col items-center text-center">
          {success ? (
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
          ) : (
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          )}
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {success ? 'Booking Confirmed' : 'Booking Error'}
          </h3>
          
          <p className="text-gray-600 mb-6">{message}</p>
          
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {success ? 'Continue' : 'Try Again'}
          </button>
        </div>
      </div>
    </div>
  );
}