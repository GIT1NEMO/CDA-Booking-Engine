import React from 'react';
import { DollarSign, Percent } from 'lucide-react';

interface CommissionDisplayProps {
  commission: {
    rate: number;
  };
  totalCommissionAmount: number;
  currencySymbol?: string;
}

export function CommissionDisplay({ 
  commission, 
  totalCommissionAmount,
  currencySymbol = '$'
}: CommissionDisplayProps) {
  if (!commission.rate) return null;

  return (
    <div className="mt-4 p-4 bg-green-50 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Percent className="h-5 w-5 text-green-600" />
        <h4 className="font-medium text-green-800">Commission Details</h4>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-green-700">Commission Rate</span>
          <span className="text-green-700">{commission.rate}%</span>
        </div>
        
        <div className="pt-2 border-t border-green-200 mt-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-green-800">Total Commission</span>
            <div className="flex items-center gap-1 font-bold text-green-700">
              <DollarSign className="h-4 w-4" />
              <span>{totalCommissionAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}