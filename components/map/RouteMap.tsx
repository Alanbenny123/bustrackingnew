"use client";

import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

// Fix for default marker icons in Next.js
const defaultIcon = L.icon({
  iconUrl: "/images/marker-icon.png",
  iconRetinaUrl: "/images/marker-icon-2x.png",
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

interface RouteMapProps {
  coordinates: [number, number][];
  currentLocation?: { latitude: number; longitude: number };
}

export default function RouteMap({
  coordinates,
  currentLocation,
}: RouteMapProps) {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const center = coordinates[0] || [10.1777434, 76.4299632];

  // Dark mode map style
  const mapStyle =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const mapAttribution =
    theme === "dark"
      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  useEffect(() => {
    const loadMap = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Simulate map loading time
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          return;
        }
        setError("Failed to load map. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadMap();
  }, []);

  if (isLoading) {
    return (
      <div className="h-[400px] w-full bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[400px] w-full bg-red-50 dark:bg-red-900 rounded-lg flex items-center justify-center">
        <div className="text-red-600 dark:text-red-200">{error}</div>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
      className={theme === "dark" ? "map-dark" : ""}
    >
      <TileLayer url={mapStyle} attribution={mapAttribution} />
      <Polyline
        positions={coordinates}
        color={theme === "dark" ? "#818cf8" : "#4F46E5"}
        weight={4}
        opacity={0.8}
      />
      {currentLocation && (
        <Marker
          position={[currentLocation.latitude, currentLocation.longitude]}
        >
          <Popup>
            <div className={theme === "dark" ? "text-white" : "text-gray-900"}>
              Current Bus Location
              <br />
              <span className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
