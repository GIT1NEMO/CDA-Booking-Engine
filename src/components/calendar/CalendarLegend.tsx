import React from 'react';

export function CalendarLegend() {
  return (
    <div className="p-3 md:p-4 bg-gray-50 border-t border-gray-200">
      <div className="flex flex-wrap justify-center md:justify-between gap-3 text-xs md:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-600">15+ Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-gray-600">1-14 Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-600">Sold Out</span>
        </div>
      </div>
    </div>
  );
}