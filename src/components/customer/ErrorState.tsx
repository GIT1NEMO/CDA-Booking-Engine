import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900">Unable to Load Tour</h2>
          <p className="text-gray-600">{message}</p>
          <Link 
            to="/"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}