import React, { useState } from 'react';
import { HostList } from './HostList';
import { HostDetails } from './HostDetails';
import { TourList } from './TourList';
import { TourDetails } from './TourDetails';
import { createApiClient } from '../services/api';
import { Host, HostDetails as HostDetailsType, Tour, AvailabilityResult, TourExtra, PriceResult } from '../types/api';
import { storageService } from '../services/storage';

interface ApiResponse {
  status: 'idle' | 'loading' | 'success' | 'error';
  data?: any;
  error?: string;
}

export function ApiTester() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    environment: 'sandbox' as const
  });

  const [response, setResponse] = useState<ApiResponse>({ status: 'idle' });
  const [hosts, setHosts] = useState<Host[]>([]);
  const [selectedHostId, setSelectedHostId] = useState<string | null>(null);
  const [hostDetails, setHostDetails] = useState<HostDetailsType | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  const handleConnect = async () => {
    setResponse({ status: 'loading' });
    try {
      const api = createApiClient(credentials);
      const pingResponse = await api.ping();
      const hostsResponse = await api.readHosts();
      setHosts(hostsResponse.hosts);
      setResponse({ status: 'success', data: pingResponse });
      storageService.saveCredentials(credentials);
    } catch (error) {
      setResponse({ status: 'error', error: 'Failed to connect to API' });
    }
  };

  const handleHostSelect = async (hostId: string) => {
    setSelectedHostId(hostId);
    setResponse({ status: 'loading' });
    try {
      const api = createApiClient(credentials);
      const [detailsResponse, toursResponse] = await Promise.all([
        api.readHostDetails(hostId),
        api.readTours(hostId)
      ]);
      setHostDetails(detailsResponse.host_details);
      setTours(toursResponse.tours);
      setResponse({ status: 'success' });
    } catch (error) {
      setResponse({ status: 'error', error: 'Failed to load host details' });
    }
  };

  const handleTourSelect = (tour: Tour) => {
    setSelectedTour(tour);
  };

  const handleCheckAvailability = async (
    tourDate: string,
    basisId: number,
    subbasisId: number,
    timeId: number
  ): Promise<AvailabilityResult | null> => {
    if (!selectedTour) return null;

    try {
      const api = createApiClient(credentials);
      const response = await api.readAvailabilityRange([{
        host_id: selectedTour.operator,
        tour_code: selectedTour.tour_code,
        basis_id: basisId,
        subbasis_id: subbasisId,
        tour_date: tourDate,
        tour_time_id: timeId
      }]);

      return response.availabilities[0] || null;
    } catch (error) {
      console.error('Failed to check availability:', error);
      return null;
    }
  };

  const handleCheckExtras = async (
    basisId: number,
    subbasisId: number,
    timeId: number
  ): Promise<TourExtra[]> => {
    if (!selectedTour) return [];

    try {
      const api = createApiClient(credentials);
      const response = await api.readExtras(
        selectedTour.operator,
        selectedTour.tour_code,
        basisId,
        subbasisId,
        timeId
      );

      return response.extras;
    } catch (error) {
      console.error('Failed to check extras:', error);
      return [];
    }
  };

  const handleCheckPrices = async (
    tourDate: string,
    basisId: number,
    subbasisId: number,
    timeId: number
  ): Promise<PriceResult | null> => {
    if (!selectedTour) return null;

    try {
      const api = createApiClient(credentials);
      const response = await api.readPriceRange([{
        host_id: selectedTour.operator,
        tour_code: selectedTour.tour_code,
        basis_id: basisId,
        subbasis_id: subbasisId,
        tour_date: tourDate,
        tour_time_id: timeId
      }]);

      return response.prices[0] || null;
    } catch (error) {
      console.error('Failed to check prices:', error);
      return null;
    }
  };

  return (
    <div className="max-w-4xl w-full space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">ResPax API Tester</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Environment
            </label>
            <select
              value={credentials.environment}
              onChange={(e) => setCredentials({
                ...credentials,
                environment: e.target.value as 'sandbox' | 'production'
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="sandbox">Sandbox</option>
              <option value="production">Production</option>
            </select>
          </div>

          <button
            onClick={handleConnect}
            disabled={!credentials.username || !credentials.password}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {response.status === 'loading' ? 'Connecting...' : 'Connect'}
          </button>

          {response.status === 'error' && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
              {response.error}
            </div>
          )}
        </div>
      </div>

      {response.status === 'success' && (
        <div className="space-y-8">
          {hosts.length > 0 && (
            <HostList
              hosts={hosts}
              onHostSelect={handleHostSelect}
            />
          )}

          {hostDetails && (
            <HostDetails
              details={hostDetails}
              onClose={() => setHostDetails(null)}
            />
          )}

          {tours.length > 0 && (
            <TourList
              tours={tours}
              onTourSelect={handleTourSelect}
            />
          )}

          {selectedTour && (
            <TourDetails
              tour={selectedTour}
              onClose={() => setSelectedTour(null)}
              onCheckAvailability={handleCheckAvailability}
              onCheckExtras={handleCheckExtras}
              onCheckPrices={handleCheckPrices}
              onEdit={() => {}}
            />
          )}
        </div>
      )}
    </div>
  );
}