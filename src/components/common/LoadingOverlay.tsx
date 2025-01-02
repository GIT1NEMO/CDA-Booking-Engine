import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Checking availability...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4 flex flex-col items-center">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        <p className="mt-4 text-gray-700 font-medium text-center">{message}</p>
      </div>
    </div>
  );
}