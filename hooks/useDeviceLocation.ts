import { useState, useEffect } from 'react';

interface LocationState {
  latitude: number;
  longitude: number;
  error: string | null;
  timestamp: number;
}

export function useDeviceLocation(options: PositionOptions = {}) {
  const [location, setLocation] = useState<LocationState>({
    latitude: 0,
    longitude: 0,
    error: null,
    timestamp: 0
  });

  useEffect(() => {
    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 5000,
      ...options
    };

    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        error: "Geolocation is not supported by your browser"
      }));
      return;
    }

    // Success handler
    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        timestamp: position.timestamp
      });
    };

    // Error handler
    const handleError = (error: GeolocationPositionError) => {
      setLocation(prev => ({
        ...prev,
        error: error.message
      }));
    };

    // Start watching position
    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      defaultOptions
    );

    // Cleanup
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [options]);

  return location;
} 