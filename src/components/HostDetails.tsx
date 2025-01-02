import React from 'react';
import { HostDetails as HostDetailsType } from '../types/api';
import { Phone, Mail, MapPin, Building } from 'lucide-react';

interface HostDetailsProps {
  details: HostDetailsType;
  onClose: () => void;
}

export function HostDetails({ details, onClose }: HostDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-bold text-gray-900">{details.name}</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-400" />
            <span className="text-gray-700">{details.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-gray-400" />
            <span className="text-gray-700">Organization ID: {details.org_id}</span>
          </div>
        </div>

        <div className="grid gap-4">
          <h4 className="font-semibold text-gray-900">Reservations</h4>
          <div className="ml-4 space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">{details.reservation_phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">{details.reservation_email}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <h4 className="font-semibold text-gray-900">Technical Support</h4>
          <div className="ml-4 space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">{details.technical_phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">{details.technical_email}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <h4 className="font-semibold text-gray-900">Configuration</h4>
          <div className="ml-4 grid grid-cols-2 gap-2 text-sm">
            <div>Type: <span className="text-gray-700">{details.type}</span></div>
            <div>Mode: <span className="text-gray-700">{details.config_mode}</span></div>
            <div>Status: <span className="text-gray-700">{details.status ? 'Active' : 'Inactive'}</span></div>
            <div>Online: <span className="text-gray-700">{details.online ? 'Yes' : 'No'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}