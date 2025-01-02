import React from 'react';
import { Package, Calendar, Clock, Users, Save, Trash2 } from 'lucide-react';

interface SavedExtra {
  id: string;
  name: string;
  code: string;
  hostId: string;
  extra_id: number; // Add extra_id here
  date: string;
  pricing: {
    adult_tour_sell: number;
    child_tour_sell: number;
    infant_tour_sell: number;
    currency_symbol: string;
  };
  availability: {
    availability: number;
    operational: boolean;
    expired: boolean;
  };
  tourOptions: {
    basisId: number;
    subbasisId: number;
    timeId: number;
  };
  extraOptions: {
    basisId: number;
    subbasisId: number;
    timeId: number;
  };
}

interface SavedExtrasViewerProps {
  currentExtra: SavedExtra | null;
  savedExtras: SavedExtra[];
  onSave: (extra: SavedExtra) => void;
  onDelete: (extraId: string) => void;
}

export function SavedExtrasViewer({
  currentExtra,
  savedExtras,
  onSave,
  onDelete
}: SavedExtrasViewerProps) {
  const formatPrice = (amount: number, currency: string) => 
    `${currency}${amount.toFixed(2)}`;

  const renderExtraCard = (extra: SavedExtra, isCurrent: boolean = false) => (
    <div 
      key={extra.id}
      className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
    >
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-500" />
            <h4 className="font-medium text-gray-900">{extra.name}</h4>
          </div>
          <div className="flex items-center gap-2">
            {isCurrent ? (
              <button
                onClick={() => onSave(extra)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                Save Extra
              </button>
            ) : (
              <button
                onClick={() => onDelete(extra.id)}
                className="flex items-center gap-1 px-2 py-1 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div className="mt-1 space-y-1">
          <p className="text-sm text-gray-500">Code: {extra.code}</p>
          <p className="text-sm text-gray-500">Host ID: {extra.hostId}</p>
          <p className="text-sm text-gray-500">Extra ID: {extra.extra_id}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-gray-700">
              {new Date(extra.date).toLocaleDateString()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Tour Options:</p>
              <ul className="space-y-1 text-gray-700">
                <li>Basis ID: {extra.tourOptions.basisId}</li>
                <li>Sub-basis ID: {extra.tourOptions.subbasisId}</li>
                <li>Time ID: {extra.tourOptions.timeId}</li>
              </ul>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Extra Options:</p>
              <ul className="space-y-1 text-gray-700">
                <li>Basis ID: {extra.extraOptions.basisId}</li>
                <li>Sub-basis ID: {extra.extraOptions.subbasisId}</li>
                <li>Time ID: {extra.extraOptions.timeId}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-gray-400" />
          <div>
            {extra.availability.operational ? (
              extra.availability.expired ? (
                <span className="text-red-600">Availability expired</span>
              ) : (
                <span className={`${
                  extra.availability.availability > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {extra.availability.availability} spots available
                </span>
              )
            ) : (
              <span className="text-amber-600">Not operational on this date</span>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          {extra.pricing.adult_tour_sell > 0 && (
            <div className="text-center p-2 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-500 mb-1">Adult</p>
              <p className="font-medium text-gray-900">
                {formatPrice(extra.pricing.adult_tour_sell, extra.pricing.currency_symbol)}
              </p>
            </div>
          )}
          {extra.pricing.child_tour_sell > 0 && (
            <div className="text-center p-2 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-500 mb-1">Child</p>
              <p className="font-medium text-gray-900">
                {formatPrice(extra.pricing.child_tour_sell, extra.pricing.currency_symbol)}
              </p>
            </div>
          )}
          {extra.pricing.infant_tour_sell > 0 && (
            <div className="text-center p-2 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-500 mb-1">Infant</p>
              <p className="font-medium text-gray-900">
                {formatPrice(extra.pricing.infant_tour_sell, extra.pricing.currency_symbol)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {currentExtra && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Current Extra</h4>
          {renderExtraCard(currentExtra, true)}
        </div>
      )}

      {savedExtras.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Saved Extras</h4>
          <div className="grid gap-4">
            {savedExtras.map(extra => renderExtraCard(extra))}
          </div>
        </div>
      )}
    </div>
  );
}