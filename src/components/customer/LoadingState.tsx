import React from 'react';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Globe } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <Globe className="h-12 w-12 text-blue-500 animate-pulse" />
          <LoadingSpinner size="lg" />
          <p className="text-lg text-gray-600">Loading tour information...</p>
        </div>
      </div>
    </div>
  );
}