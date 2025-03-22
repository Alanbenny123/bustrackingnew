"use client";

import { MapContainer, TileLayer, ZoomControl, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect, useMemo } from "react";
import {
  KERALA_CENTER,
  KERALA_BOUNDS,
  ADI_SHANKARA_POSITION,
  TILE_LAYERS,
  API_KEY,
} from "@/lib/map/constants";
import { MapMarker } from "@/components/map/MapMarker";
import { BusMarker } from "@/components/map/BusMarker";
import { useLocation } from "@/hooks/useLocation";
import { useBusTracking } from "@/hooks/useBusTracking";
import { Button } from "./Button";
import { ErrorMessage } from "./ErrorMessage";
import { decodePolyline } from "@/lib/map/utils";

export default function Map() {
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>(
    []
  );
  const { userLocation, locationError, requestLocation } = useLocation();
  const buses = useBusTracking();

  // Fetch user location on mount
  useEffect(() => {
    setIsMounted(true);
    requestLocation();
  }, [requestLocation]);

  // Fetch route when user location changes
  useEffect(() => {
    if (userLocation) {
      fetchRoute(userLocation);
    }
  }, [userLocation]);

  // Memoize tile layer configuration
  const tileLayer = useMemo(
    () => (isDarkMode ? TILE_LAYERS.dark : TILE_LAYERS.light),
    [isDarkMode]
  );

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    localStorage.setItem("darkMode", JSON.stringify(!isDarkMode));
  };

  // Set dark mode based on system preference or localStorage
  useEffect(() => {
    const savedDarkMode = JSON.parse(
      localStorage.getItem("darkMode") || "null"
    );
    const systemDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(savedDarkMode ?? systemDarkMode);
  }, []);

  const fetchRoute = async (userPos: [number, number]) => {
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            Accept:
              "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            coordinates: [
              [userPos[1], userPos[0]],
              [ADI_SHANKARA_POSITION[1], ADI_SHANKARA_POSITION[0]],
            ],
          }),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (!data.routes?.[0]?.geometry) throw new Error("No route found");

      const coordinates = decodePolyline(data.routes[0].geometry);
      setRouteCoordinates(coordinates);
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={userLocation || KERALA_CENTER}
        zoom={8}
        minZoom={7}
        maxZoom={18}
        maxBounds={KERALA_BOUNDS as L.LatLngBoundsExpression}
        maxBoundsViscosity={1.0}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <TileLayer {...tileLayer} />

        <MapMarker position={ADI_SHANKARA_POSITION} title="Adi Shankara" />

        {userLocation && (
          <MapMarker position={userLocation} title="Your Location" />
        )}

        {routeCoordinates.length > 0 && (
          <Polyline
            positions={routeCoordinates}
            color="blue"
            weight={4}
            opacity={0.7}
          />
        )}

        {buses.map((bus) => (
          <BusMarker key={bus.id} bus={bus} />
        ))}
      </MapContainer>

      <Button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 z-[1000]"
      >
        {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </Button>

      {locationError && (
        <ErrorMessage
          message={locationError}
          onRetry={requestLocation}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000]"
        />
      )}
    </div>
  );
}
