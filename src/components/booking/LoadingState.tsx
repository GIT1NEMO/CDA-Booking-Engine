import React from 'react';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600">Loading booking information...</p>
    </div>
  );
}