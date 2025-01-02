import React from 'react';
import { PriceResult } from '../types/api';
import { DollarSign, Users } from 'lucide-react';

interface PriceDisplayProps {
  price: PriceResult;
}

export function PriceDisplay({ price }: PriceDisplayProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-green-600" />
        Pricing Information
      </h4>

      <div className="grid gap-4">
        {price.adult_assoc && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">Adult</span>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900">
                {price.currency_symbol}{price.adult_tour_sell}
              </div>
              {price.adult_commission > 0 && (
                <div className="text-sm text-green-600">
                  {price.adult_commission}% commission
                </div>
              )}
            </div>
          </div>
        )}

        {price.child_assoc && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">Child</span>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900">
                {price.currency_symbol}{price.child_tour_sell}
              </div>
              {price.child_commission > 0 && (
                <div className="text-sm text-green-600">
                  {price.child_commission}% commission
                </div>
              )}
            </div>
          </div>
        )}

        {price.infant_assoc && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">Infant</span>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900">
                {price.currency_symbol}{price.infant_tour_sell}
              </div>
              {price.infant_commission > 0 && (
                <div className="text-sm text-green-600">
                  {price.infant_commission}% commission
                </div>
              )}
            </div>
          </div>
        )}

        {price.foc_assoc && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">FOC</span>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900">
                {price.currency_symbol}{price.foc_tour_sell}
              </div>
              {price.foc_commission > 0 && (
                <div className="text-sm text-green-600">
                  {price.foc_commission}% commission
                </div>
              )}
            </div>
          </div>
        )}

        {price.non_per_pax_sell > 0 && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <span className="text-gray-700">Fixed Tour Price</span>
            <div className="font-medium text-gray-900">
              {price.currency_symbol}{price.non_per_pax_sell}
            </div>
          </div>
        )}

        <div className="text-sm text-gray-500 mt-2">
          Payment Option: {price.payment_option}
        </div>
      </div>
    </div>
  );
}