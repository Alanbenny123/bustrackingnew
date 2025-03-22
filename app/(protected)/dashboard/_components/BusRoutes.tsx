"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { busRoutes } from "@/lib/map/utils";
import io from "socket.io-client";

// Dynamically import the map component to avoid SSR issues
const RouteMap = dynamic(() => import("@/components/map/RouteMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
    </div>
  ),
});

interface BusRoute {
  id: string;
  number: string;
  route: string;
  time: string;
  status: "On Time" | "Delayed";
}

const busRoutesData: BusRoute[] = [
  {
    id: "1",
    number: "College Bus 101",
    route: "North Campus → Adi Shankara College",
    time: "8:00 AM",
    status: "On Time",
  },
  {
    id: "2",
    number: "College Bus 102",
    route: "CP → Adi Shankara College",
    time: "8:15 AM",
    status: "Delayed",
  },
];

const SOCKET_UPDATE_INTERVAL = 5000; // 5 seconds

export default function BusRoutes() {
  const [selectedBus, setSelectedBus] = useState<BusRoute | null>(null);
  const [busLocations, setBusLocations] = useState<
    Record<string, { latitude: number; longitude: number }>
  >({});

  // Socket connection for real-time updates
  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      transports: ["websocket"],
      upgrade: false,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    let locationUpdates: Record<
      string,
      { latitude: number; longitude: number }
    > = {};
    let updateTimeout: NodeJS.Timeout;

    // Batch location updates
    const processLocationUpdates = () => {
      if (Object.keys(locationUpdates).length > 0) {
        setBusLocations((prev) => ({ ...prev, ...locationUpdates }));
        locationUpdates = {};
      }
      updateTimeout = setTimeout(
        processLocationUpdates,
        SOCKET_UPDATE_INTERVAL
      );
    };

    newSocket.on(
      "receiveLocation",
      (data: { id: string; latitude: number; longitude: number }) => {
        locationUpdates[data.id] = {
          latitude: data.latitude,
          longitude: data.longitude,
        };
      }
    );

    newSocket.on("connect_error", (error: Error) => {
      console.error("Socket connection error:", error);
    });

    updateTimeout = setTimeout(processLocationUpdates, SOCKET_UPDATE_INTERVAL);

    return () => {
      clearTimeout(updateTimeout);
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Bus Routes
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Today&apos;s schedule and status
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Bus List */}
          <div className="lg:col-span-1 space-y-3">
            {busRoutesData.map((route) => (
              <button
                key={route.id}
                onClick={() =>
                  setSelectedBus(selectedBus?.id === route.id ? null : route)
                }
                className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-colors ${
                  selectedBus?.id === route.id
                    ? "bg-indigo-50 dark:bg-indigo-900"
                    : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
              >
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v8zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {route.number}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {route.route}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {route.time}
                  </p>
                  {busLocations[route.id] && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Last update: {new Date().toLocaleTimeString()}
                    </p>
                  )}
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    route.status === "On Time"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {route.status}
                </div>
              </button>
            ))}
          </div>

          {/* Map */}
          <div className="lg:col-span-2 h-[500px] rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700">
            {selectedBus?.number === "College Bus 101" ? (
              <>
                <div className="p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedBus.number} Route Map
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedBus.route} • {selectedBus.time}
                  </p>
                </div>
                <div className="h-[440px]">
                  <RouteMap
                    coordinates={busRoutes["College Bus 101"].coordinates}
                    currentLocation={busLocations[selectedBus.id]}
                  />
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-4 text-center">
                <svg
                  className="h-12 w-12 mb-4 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                {selectedBus
                  ? "Route map is not available for this bus"
                  : "Select a bus to view its route"}
                <button
                  onClick={() => setSelectedBus(busRoutesData[0])}
                  className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                >
                  View College Bus 101 Route
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
