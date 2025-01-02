import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  return (
    <div className={`bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2 ${className}`}>
      <AlertTriangle className="h-5 w-5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}