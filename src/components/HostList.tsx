import React from 'react';
import { Host } from '../types/api';
import { Server, Shield, Globe, AlertTriangle } from 'lucide-react';

interface HostListProps {
  hosts: Host[];
  onHostSelect: (hostId: string) => void;
}

export function HostList({ hosts, onHostSelect }: HostListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">Available Hosts</h3>
      <div className="grid gap-4">
        {hosts.map((host) => (
          <div
            key={host.host_id}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 cursor-pointer transition-colors"
            onClick={() => onHostSelect(host.host_id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{host.host_name}</h4>
                <p className="text-sm text-gray-500">ID: {host.host_id}</p>
              </div>
              {host.error && (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
            </div>
            
            <div className="mt-3 flex gap-4">
              <div className="flex items-center gap-1">
                <Server className={`h-4 w-4 ${host.server_up ? 'text-green-500' : 'text-gray-400'}`} />
                <span className="text-sm text-gray-600">Server</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className={`h-4 w-4 ${host.secure ? 'text-green-500' : 'text-gray-400'}`} />
                <span className="text-sm text-gray-600">Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className={`h-4 w-4 ${host.online ? 'text-green-500' : 'text-gray-400'}`} />
                <span className="text-sm text-gray-600">Online</span>
              </div>
            </div>
            
            {host.message && (
              <p className="mt-2 text-sm text-red-600">{host.message}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}