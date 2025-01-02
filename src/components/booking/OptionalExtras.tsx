import React from 'react';
import { Package, Users } from 'lucide-react';
import { CollapsibleSection } from '../common/CollapsibleSection';

interface ExtraOption {
  id: string;
  name: string;
  code: string;
  hostId: string;
  extra_id: number;
  pricing: {
    currency_symbol: string;
    adult_tour_sell: number;
  };
  availability: {
    availability: number;
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

interface OptionalExtrasProps {
  extras: ExtraOption[];
}

export function OptionalExtras({ extras }: OptionalExtrasProps) {
  if (!extras.length) return null;

  return (
    <CollapsibleSection
      title="Optional Extras"
      icon={Package}
      defaultOpen={true}
    >
      <div className="grid gap-4">
        {extras.map(extra => (
          <ExtraCard key={extra.id} extra={extra} />
        ))}
      </div>
    </CollapsibleSection>
  );
}

function ExtraCard({ extra }: { extra: ExtraOption }) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-900">{extra.name}</h4>
          <div className="space-y-1 mt-1">
            <p className="text-sm text-gray-500">Code: {extra.code}</p>
            <p className="text-sm text-gray-500">Host ID: {extra.hostId}</p>
            <p className="text-sm text-gray-500">Extra ID: {extra.extra_id}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium text-gray-900">
            {extra.pricing.currency_symbol}{extra.pricing.adult_tour_sell}
          </p>
          <p className="text-sm text-gray-500">
            {extra.availability.availability} available
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <OptionsSection
          title="Tour Options"
          icon={Package}
          options={extra.tourOptions}
        />
        <OptionsSection
          title="Extra Options"
          icon={Users}
          options={extra.extraOptions}
        />
      </div>
    </div>
  );
}

interface OptionsSectionProps {
  title: string;
  icon: React.ElementType;
  options: {
    basisId: number;
    subbasisId: number;
    timeId: number;
  };
}

function OptionsSection({ title, icon: Icon, options }: OptionsSectionProps) {
  return (
    <div>
      <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
        <Icon className="h-4 w-4 text-gray-400" />
        {title}
      </h5>
      <div className="space-y-1 text-sm text-gray-600">
        <p>Basis ID: {options.basisId}</p>
        <p>Sub-basis ID: {options.subbasisId}</p>
        <p>Time ID: {options.timeId}</p>
      </div>
    </div>
  );
}