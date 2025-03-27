"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useLocation } from '@/hooks/useLocation';

// Dynamic imports to avoid SSR issues
const RouteMap = dynamic(() => import("@/components/map/RouteMap"), { ssr: false });

export default function TestLocationPage() {
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const { userLocation, locationError, requestLocation, isLoading } = useLocation();
  const [locationTrail, setLocationTrail] = useState<[number, number][]>([]);

  // Reset trail when tracking is disabled
  const handleTrackingToggle = () => {
    if (trackingEnabled) {
      // If turning off tracking, reset the trail
      setLocationTrail([]);
    }
    setTrackingEnabled(!trackingEnabled);
  };

  // Clear trail without stopping tracking
  const handleClearTrail = () => {
    setLocationTrail([]);
  };

  // Start location tracking when enabled
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let mounted = true;
    
    if (trackingEnabled) {
      // Initial location request
      requestLocation();
      
      // Set up periodic location updates
      intervalId = setInterval(() => {
        if (mounted) {
          requestLocation();
        }
      }, 5000); // Update every 5 seconds
    }

    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [trackingEnabled, requestLocation]);

  // Update trail when location changes
  useEffect(() => {
    let mounted = true;

    if (trackingEnabled && userLocation && mounted) {
      setLocationTrail(prev => {
        // Only add if it's a new location
        if (prev.length === 0 || 
            prev[prev.length - 1][0] !== userLocation[0] || 
            prev[prev.length - 1][1] !== userLocation[1]) {
          return [...prev, userLocation];
        }
        return prev;
      });
    }

    return () => {
      mounted = false;
    };
  }, [trackingEnabled, userLocation]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Location Testing</h1>
        <div className="flex gap-4">
          {locationTrail.length > 0 && (
            <button
              onClick={handleClearTrail}
              className="px-4 py-2 rounded-lg font-medium bg-yellow-500 hover:bg-yellow-600 text-white transition-all"
            >
              Clear Trail
            </button>
          )}
          <button
            onClick={handleTrackingToggle}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed'
                : trackingEnabled
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isLoading 
              ? 'Getting Location...' 
              : trackingEnabled 
                ? 'Stop Tracking' 
                : 'Start Tracking'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Current Location</h2>
          {locationError ? (
            <div className="text-red-500">{locationError}</div>
          ) : userLocation ? (
            <div>
              <p>Latitude: {userLocation[0].toFixed(6)}</p>
              <p>Longitude: {userLocation[1].toFixed(6)}</p>
              <p className="text-sm text-gray-500">
                Last Updated: {new Date().toLocaleTimeString()}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Points in trail: {locationTrail.length}
              </p>
            </div>
          ) : (
            <div className="text-gray-500">
              No location data available. Click quot;Start Trackingquot; to begin.
            </div>
          )}
        </div>

        <div className="md:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden h-[600px]">
          <RouteMap
            coordinates={locationTrail.length > 0 ? locationTrail : [[10.1777434, 76.4299632]]}
          />
        </div>
      </div>
    </div>
  );
} 