import { AvailabilityResult } from '../types/api';

export const getMonthDates = (date: Date): string[] => {
  const dates = [];
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    dates.push(currentDate.toISOString().split('T')[0]);
  }

  return dates;
};

export const getMonthKey = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth() + 1}`;
};

export const getAvailabilityStyle = (availability: AvailabilityResult | undefined) => {
  if (!availability || !availability.operational || availability.expired) {
    return {
      circle: 'bg-red-500 text-white',
      text: 'text-red-500',
      count: '0'
    };
  }

  if (availability.availability === 0) {
    return {
      circle: 'bg-red-500 text-white',
      text: 'text-red-500',
      count: '0'
    };
  }

  if (availability.availability < 15) {
    return {
      circle: 'bg-orange-500 text-white',
      text: 'text-orange-500',
      count: availability.availability.toString()
    };
  }

  return {
    circle: 'bg-green-500 text-white',
    text: 'text-green-500',
    count: availability.availability.toString()
  };
};