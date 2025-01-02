import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { Tour, AvailabilityResult } from '../../types/api';
import { getMonthDates, getAvailabilityStyle, getMonthKey } from '../../utils/dateUtils';
import { CalendarHeader } from '../calendar/CalendarHeader';
import { CalendarLegend } from '../calendar/CalendarLegend';

interface BookingCalendarProps {
  tour: Tour;
  onDateSelect: (date: string) => void;
  availabilityData?: Record<string, AvailabilityResult>;
  onMonthChange: (dates: string[], monthKey: string) => void;
}

export function BookingCalendar({ 
  tour, 
  onDateSelect, 
  availabilityData = {},
  onMonthChange 
}: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const dates = getMonthDates(currentDate);
    const monthKey = getMonthKey(currentDate);
    onMonthChange(dates, monthKey);
  }, [currentDate, onMonthChange]);

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = date.toISOString().split('T')[0];
    setSelectedDate(dateString);
    onDateSelect(dateString);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();

    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div 
          key={`empty-${i}`} 
          className="h-24 md:h-28 bg-white border border-gray-100" 
        />
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const isToday = date.getTime() === today.getTime();
      const isPast = date < today;
      const isSelected = dateString === selectedDate;
      const availability = availabilityData[dateString];
      const availabilityStyle = getAvailabilityStyle(availability);

      days.push(
        <div
          key={day}
          className={`
            relative h-24 md:h-28 bg-white border border-gray-100 p-2
            ${isSelected ? 'ring-2 ring-blue-600' : ''}
            ${isPast ? 'opacity-50' : 'hover:bg-gray-50'}
            transition-all duration-200 cursor-pointer
          `}
          onClick={() => !isPast && handleDateClick(day)}
        >
          <div className="flex justify-between items-start">
            <span className={`
              text-base md:text-lg font-bold 
              ${isToday ? 'text-blue-600' : 'text-gray-900'}
            `}>
              {day}
            </span>
            <button className="text-gray-400 hover:text-gray-600 hidden md:block">
              <Info className="h-3 w-3 md:h-4 md:w-4" />
            </button>
          </div>
          
          <div className="absolute inset-x-0 bottom-0 p-1 md:p-2">
            <div className="flex flex-col items-center">
              <div className={`
                w-8 h-8 md:w-12 md:h-12 rounded-full 
                flex items-center justify-center
                ${availabilityStyle.circle}
                font-bold text-sm md:text-lg
                transform transition-transform hover:scale-105
              `}>
                {availabilityStyle.count}
              </div>
              <span className={`
                text-xs mt-0.5 md:mt-1 
                ${availabilityStyle.text}
                hidden md:block
              `}>
                tickets left
              </span>
            </div>
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-200">
        <CalendarHeader
          currentDate={currentDate}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="bg-gray-50 py-2 text-center">
              <span className="text-xs md:text-sm font-medium text-blue-500">
                {day}
              </span>
            </div>
          ))}
          {renderCalendarDays()}
        </div>
      </div>

      <CalendarLegend />
    </div>
  );
}