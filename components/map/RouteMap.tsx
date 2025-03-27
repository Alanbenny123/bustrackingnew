"use client";

import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { icon, type LatLngExpression } from "leaflet";
import { useTheme } from "next-themes";
import { useDeviceLocation } from "@/hooks/useDeviceLocation";
import { useEffect, useState } from "react";

export interface MarkerData {
  position: LatLngExpression;
  title: string;
  type: 'start' | 'end';
}

interface RouteMapProps {
  coordinates: number[][];
  markers?: MarkerData[];
}

const busIcon = icon({
  iconUrl: "/bus.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const userIcon = icon({
  iconUrl: "/student.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

const startIcon = icon({
  iconUrl: "/start-marker.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const endIcon = icon({
  iconUrl: "/end-marker.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

export default function RouteMap({ coordinates, markers }: RouteMapProps) {
  const { theme } = useTheme();
  const { latitude, longitude } = useDeviceLocation({
    enableHighAccuracy: true,
    maximumAge: 1000,
    timeout: 5000
  });
  const [currentBusLocation, setCurrentBusLocation] = useState(coordinates[0]);

  useEffect(() => {
    let position = 1;
    const timer = setInterval(() => {
      if (position >= coordinates.length) {
        clearInterval(timer);
        return
      }
      setCurrentBusLocation(coordinates[position]);
      position++;
    }, 500);

    return () => clearInterval(timer);
  }, [coordinates])

  const center = coordinates[0] || [10.0261, 76.3125];
  const isDark = theme === "dark";

  return (
    <MapContainer
      center={{lat: center[0], lng: center[1]}}
      zoom={13}
      style={{
        height: "100%",
        width: "100%",
        background: isDark ? "#1a1b1e" : "#ffffff",
      }}
    >
      <TileLayer
        url={
          isDark
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        }
      />
      <Polyline
        positions={coordinates.map(coord => ({lat: coord[0], lng: coord[1]}))}
        pathOptions={{
          color: isDark ? "#60a5fa" : "#3b82f6",
          opacity: isDark ? 0.7 : 1,
        }}
      />
        <Marker position={{lat: currentBusLocation[0], lng: currentBusLocation[1]}} icon={busIcon}>
          <Popup>
            <div className={isDark ? "text-white" : "text-gray-900"}>
              Bus Location
              <br />
              <span className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </Popup>
        </Marker>
      {latitude && longitude && (
        <Marker position={[latitude, longitude]} icon={userIcon}>
          <Popup>
            <div className={isDark ? "text-white" : "text-gray-900"}>
              Your Location
              <br />
              <span className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
              <br />
              <span className="text-xs text-gray-400">
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </span>
            </div>
          </Popup>
        </Marker>
      )}
      {/* Render markers */}
      {markers?.map((marker, index) => (
        <Marker
          key={`${marker.type}-${index}`}
          position={marker.position}
          icon={marker.type === 'start' ? startIcon : endIcon}
        >
          <Popup>
            <div className={isDark ? "text-white" : "text-gray-900"}>
              {marker.title}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
