import React, { useState, useCallback, useEffect } from 'react';
import { Tour, AvailabilityResult } from '../../types/api';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { LoadingOverlay } from '../booking/LoadingOverlay';
import { BookingCalendar } from './BookingCalendar';
import { DateConfirmation } from '../booking/DateConfirmation';
import { GuestTypeSelector } from '../booking/GuestTypeSelector/GuestTypeSelector';
import { TourOptionsSelector } from '../booking/TourOptionsSelector';
import { ExtrasAvailabilityPricing } from '../booking/ExtrasAvailabilityPricing';
import { TotalPriceSummary } from '../booking/TotalPriceSummary';
import { CustomerForm } from './CustomerForm';
import { BookingSummary } from '../booking/BookingSummary';
import { storageService } from '../../services/storage';
import { checkMonthAvailability } from '../../services/availabilityService';
import { fetchTourPrices } from '../../services/priceService';

interface BookingFormProps {
  tour: Tour;
}

export function BookingForm({ tour }: BookingFormProps) {
  const [loading, setLoading] = useState(false);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availabilityData, setAvailabilityData] = useState<Record<string, AvailabilityResult>>({});
  const [prices, setPrices] = useState<any>(null);
  const [tourExtras, setTourExtras] = useState<any[]>([]);
  const [guestCounts, setGuestCounts] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    families: 0
  });
  const [tourOptions, setTourOptions] = useState({
    basisId: 0,
    subbasisId: 0,
    timeId: 0
  });
  const [selectedExtras, setSelectedExtras] = useState<Array<{ adultId: number; extraId: string | null }>>([]);

  // Load tour extras
  useEffect(() => {
    const loadExtras = async () => {
      try {
        const extras = await storageService.getTourExtras(tour.tour_code);
        setTourExtras(extras || []);
      } catch (err) {
        console.error('Failed to load tour extras:', err);
      }
    };

    loadExtras();
  }, [tour.tour_code]);

  const handleMonthChange = useCallback(async (dates: string[], monthKey: string) => {
    if (!tour) return;

    setCheckingAvailability(true);
    setError(null);

    try {
      const credentials = storageService.getCredentials();
      if (!credentials) {
        throw new Error('API credentials not found');
      }

      const monthData = await checkMonthAvailability(dates, tour, credentials);
      setAvailabilityData(monthData);
    } catch (err) {
      setError('Failed to check availability');
      console.error('Availability check failed:', err);
    } finally {
      setCheckingAvailability(false);
    }
  }, [tour]);

  const handleDateSelect = async (date: string) => {
    setSelectedDate(date);
    if (!tourOptions.basisId || !tourOptions.subbasisId || !tourOptions.timeId) return;

    setLoadingPrices(true);
    try {
      const credentials = storageService.getCredentials();
      if (!credentials) {
        throw new Error('API credentials not found');
      }

      const priceData = await fetchTourPrices(tour, date, tourOptions, credentials);
      setPrices(priceData);
    } catch (err) {
      console.error('Failed to fetch prices:', err);
      setError('Failed to load pricing information');
    } finally {
      setLoadingPrices(false);
    }
  };

  const currentAvailability = selectedDate ? availabilityData[selectedDate]?.availability || 0 : 0;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {loading && <LoadingOverlay message="Loading tour information..." />}
      {loadingPrices && <LoadingOverlay message="Loading prices..." />}
      {checkingAvailability && <LoadingOverlay message="Checking availability..." />}
      
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">{tour.name}</h1>
      
      <div className="space-y-8">
        <BookingCalendar
          tour={tour}
          onDateSelect={handleDateSelect}
          availabilityData={availabilityData}
          onMonthChange={handleMonthChange}
        />

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {selectedDate && !loading && !error && availabilityData[selectedDate] && (
          <DateConfirmation 
            selectedDate={selectedDate}
            availability={availabilityData[selectedDate]?.availability}
          />
        )}

        <TourOptionsSelector
          tour={tour}
          selectedDate={selectedDate}
          options={tourOptions}
          onChange={setTourOptions}
        />

        <GuestTypeSelector
          guestCounts={guestCounts}
          prices={prices ? {
            adult: prices.adult_tour_sell,
            child: prices.child_tour_sell,
            infant: prices.infant_tour_sell,
            family: prices.non_per_pax_sell
          } : null}
          onChange={setGuestCounts}
          currencySymbol={prices?.currency_symbol}
          loading={loadingPrices}
          maxAvailability={currentAvailability}
        />

        {selectedDate && guestCounts.adults > 0 && tourExtras.length > 0 && (
          <ExtrasAvailabilityPricing
            extras={tourExtras}
            selectedDate={selectedDate}
            numberOfAdults={guestCounts.adults}
            onSelectionsChange={setSelectedExtras}
          />
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <BookingSummary
            date={selectedDate}
            tourOptions={tourOptions}
            guestCounts={guestCounts}
            tour={tour}
            selectedExtras={selectedExtras}
            availableExtras={tourExtras}
          />

          <TotalPriceSummary
            basePrice={{
              adult: prices?.adult_tour_sell || 0,
              child: prices?.child_tour_sell || 0,
              family: prices?.non_per_pax_sell || 0
            }}
            guestCounts={guestCounts}
            selectedExtras={selectedExtras}
            availableExtras={tourExtras}
            currencySymbol={prices?.currency_symbol}
          />
        </div>

        {selectedDate && guestCounts.adults > 0 && (
          <CustomerForm
            tour={tour}
            selectedDate={selectedDate}
            tourOptions={tourOptions}
            guestCounts={guestCounts}
            selectedExtras={selectedExtras}
            onBack={() => {}}
          />
        )}
      </div>
    </div>
  );
}