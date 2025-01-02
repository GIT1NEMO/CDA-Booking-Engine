import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export function CalendarHeader({ currentDate, onPreviousMonth, onNextMonth }: CalendarHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 space-y-2 md:space-y-0">
      <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
        <CalendarIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
        Choose Date
      </h2>
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={onPreviousMonth}
          className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </button>
        <span className="text-base md:text-lg font-medium text-gray-900">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <button
          onClick={onNextMonth}
          className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-gray-900"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      </div>
    </div>
  );
}