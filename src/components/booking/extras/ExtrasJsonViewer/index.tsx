import React from 'react';
import { Package, DollarSign, Users } from 'lucide-react';
import { ExtrasDataSection } from './ExtrasDataSection';

interface ExtrasJsonViewerProps {
  extras: Array<{
    name: string;
    code: string;
    pricing?: {
      adult_tour_sell: number;
      currency_symbol: string;
    };
    availability?: {
      availability: number;
      operational: boolean;
      expired: boolean;
    };
  }>;
}

export function ExtrasJsonViewer({ extras }: ExtrasJsonViewerProps) {
  const sections = [
    {
      title: 'Extras Details',
      data: extras.map(({ name, code }) => ({ name, code })),
      icon: <Package className="h-5 w-5 text-blue-500" />
    },
    {
      title: 'Pricing Information',
      data: extras.map(({ name, code, pricing }) => ({
        name,
        code,
        pricing
      })),
      icon: <DollarSign className="h-5 w-5 text-green-500" />
    },
    {
      title: 'Availability Status',
      data: extras.map(({ name, code, availability }) => ({
        name,
        code,
        availability
      })),
      icon: <Users className="h-5 w-5 text-orange-500" />
    }
  ];

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Package className="h-6 w-6 text-blue-500" />
        Extras Raw Data
      </h3>

      <div className="grid gap-4">
        {sections.map((section) => (
          <ExtrasDataSection
            key={section.title}
            title={section.title}
            data={section.data}
            icon={section.icon}
          />
        ))}
      </div>
    </div>
  );
}