import React, { useMemo } from 'react';
import { DollarSign } from 'lucide-react';
import { BasePriceSummary } from './PriceSummary/BasePriceSummary';
import { ExtrasSummary } from './PriceSummary/ExtrasSummary';
import { CommissionDisplay } from './CommissionDisplay';
import { calculateTotalCommission } from '../../utils/commissionCalculator';

interface TotalPriceSummaryProps {
  basePrice: {
    adult: number;
    child: number;
    family: number;
    infant: number;
  };
  guestCounts: {
    adults: number;
    children: number;
    families: number;
    infants: number;
  };
  selectedExtras: Array<{
    adultId: number;
    extraId: string | null;
  }>;
  availableExtras: Array<{
    id: string;
    code: string;
    name: string;
    pricing?: {
      adult_tour_sell: number;
      currency_symbol: string;
    };
  }>;
  currencySymbol?: string;
  commissionRates?: {
    adult?: number;
    child?: number;
    family?: number;
    infant?: number;
  };
}

export function TotalPriceSummary({
  basePrice,
  guestCounts,
  selectedExtras,
  availableExtras,
  currencySymbol = '$',
  commissionRates = {
    infant: 10 // Default commission rate
  }
}: TotalPriceSummaryProps) {
  // Ensure all price values are numbers with defaults of 0
  const sanitizedPrices = useMemo(() => ({
    adult: Number(basePrice.adult) || 0,
    child: Number(basePrice.child) || 0,
    family: Number(basePrice.family) || 0,
    infant: Number(basePrice.infant) || 0
  }), [basePrice]);

  // Ensure all guest counts are numbers with defaults of 0
  const sanitizedCounts = useMemo(() => ({
    adults: Number(guestCounts.adults) || 0,
    children: Number(guestCounts.children) || 0,
    families: Number(guestCounts.families) || 0,
    infants: Number(guestCounts.infants) || 0
  }), [guestCounts]);

  // Calculate extras total with validation
  const extrasTotal = useMemo(() => {
    return selectedExtras.reduce((total, selection) => {
      if (!selection.extraId) return total;
      const extra = availableExtras.find(e => e.code === selection.extraId);
      const extraPrice = Number(extra?.pricing?.adult_tour_sell) || 0;
      return total + extraPrice;
    }, 0);
  }, [selectedExtras, availableExtras]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    const baseTotal = 
      sanitizedCounts.adults * sanitizedPrices.adult +
      sanitizedCounts.children * sanitizedPrices.child +
      sanitizedCounts.families * sanitizedPrices.family +
      sanitizedCounts.infants * sanitizedPrices.infant;
    
    return baseTotal + extrasTotal;
  }, [sanitizedCounts, sanitizedPrices, extrasTotal]);

  // Calculate commission on total price including extras
  const totalCommissionAmount = useMemo(() => {
    return calculateTotalCommission(
      commissionRates,
      sanitizedCounts,
      sanitizedPrices,
      extrasTotal
    );
  }, [commissionRates, sanitizedCounts, sanitizedPrices, extrasTotal]);

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-8">
        <DollarSign className="h-7 w-7 text-green-600" />
        Price Summary
      </h3>

      <div className="space-y-6">
        <BasePriceSummary
          basePrice={sanitizedPrices}
          guestCounts={sanitizedCounts}
          currencySymbol={currencySymbol}
        />

        {selectedExtras.length > 0 && (
          <ExtrasSummary
            selectedExtras={selectedExtras}
            availableExtras={availableExtras}
            currencySymbol={currencySymbol}
          />
        )}

        <div className="mt-8 pt-6 border-t-2 border-gray-100">
          <div className="flex justify-between items-center bg-blue-50 p-6 rounded-xl">
            <span className="text-xl font-bold text-gray-900">Total Price</span>
            <div className="text-3xl font-bold text-green-600 flex items-center gap-1">
              <DollarSign className="h-8 w-8" />
              <span>{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <CommissionDisplay
            commission={{
              rate: commissionRates.infant || 0
            }}
            totalCommissionAmount={totalCommissionAmount}
            currencySymbol={currencySymbol}
          />

          <p className="mt-4 text-sm text-gray-500 text-center">
            All prices are in Australian Dollars (AUD) and include GST
          </p>
        </div>
      </div>
    </div>
  );
}