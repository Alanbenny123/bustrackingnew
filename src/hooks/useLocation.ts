import { useState, useCallback } from "react";

export function useLocation() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleLocationError = (error: GeolocationPositionError) => {
    let errorMessage = "";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage =
          "Location access denied. Please enable location services in your browser settings.";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage =
          "Location information is unavailable. Please try again later.";
        break;
      case error.TIMEOUT:
        errorMessage =
          "Location request timed out. Please check your connection and try again.";
        break;
      default:
        errorMessage = "An unknown error occurred while getting your location.";
    }
    setLocationError(errorMessage);
    console.error("Geolocation error:", errorMessage);
  };

  const requestLocation = useCallback(() => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos: [number, number] = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        setUserLocation(userPos);
        setLocationError(null);
      },
      handleLocationError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return { userLocation, locationError, requestLocation };
}
