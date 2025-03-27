"use client";

import { useState, useCallback } from "react";
import BusRoute from "./_components/BusRoute";
import { bus102Route } from "@/lib/map/routes/bus102";
import { bus101Route } from "@/lib/map/routes/bus101";
import type { MarkerData } from "@/components/map/RouteMap";
import { bus103Route } from "@/lib/map/routes/bus103";
import dynamic from "next/dynamic";

// Dynamic imports to avoid SSR issues
const RouteMap = dynamic(() => import("@/components/map/RouteMap"), {
  ssr: false,
});

const busRoutes = [
  {
    id: "1",
    number: "College Bus 1",
    route: "North Campus → Adi Shankara Collage",
    time: "8:00 AM",
    status: "On Time",
    routes: bus101Route,
    markers: [
      {
        title: "North Campus",
        position: {
          lat: bus101Route[0][0],
          lng: bus101Route[0][1],
        },
        type: "start" as const,
      },
      {
        position: {
          lat: bus101Route[bus101Route.length - 1][0],
          lng: bus101Route[bus101Route.length - 1][1],
        },
        title: "Adi Shankara College",
        type: "end" as const,
      },
    ] as MarkerData[],
  },
  {
    id: "2",
    number: "College Bus 2",
    route: "south Campus → Adi Shankara Collage",
    time: "8:00 AM",
    status: "On Time",
    routes: bus102Route,
    markers: [
      {
        title: "North Campus",
        position: {
          lat: bus102Route[0][0],
          lng: bus102Route[0][1],
        },
        type: "start" as const,
      },
      {
        position: {
          lat: bus102Route[bus102Route.length - 1][0],
          lng: bus102Route[bus102Route.length - 1][1],
        },
        title: "Adi Shankara College",
        type: "end" as const,
      },
    ] as MarkerData[],
  },
  {
    id: "3",
    number: "College Bus 3",
    route: "west Campus → Adi Shankara Collage",
    time: "8:00 AM",
    status: "On Time",
    routes: bus103Route,
    markers: [
      {
        title: "North Campus",
        position: {
          lat: bus103Route[0][0],
          lng: bus103Route[0][1],
        },
        type: "start" as const,
      },
      {
        position: {
          lat: bus103Route[bus103Route.length - 1][0],
          lng: bus103Route[bus103Route.length - 1][1],
        },
        title: "Adi Shankara College",
        type: "end" as const,
      },
    ] as MarkerData[],
  },
];

export type BusRoute = (typeof busRoutes)[number];

export default function DashboardPage() {
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Memoized handler for bus selection
  const handleBusSelect = useCallback(async (busId: string) => {
    setIsLoading(true);
    try {
      // If clicking the same bus, deselect it
      setSelectedBus((current) => (current === busId ? null : busId));
    } finally {
      // Short delay to prevent rapid toggling
      setTimeout(() => setIsLoading(false), 300);
    }
  }, []);

  // Get the coordinates for the selected bus route
  const coordinates = busRoutes.find((bus) => bus.id === selectedBus)
    ?.routes ?? [[10.1777434, 76.4299632]];

  // Get the markers for the selected bus
  const markers = busRoutes.find((bus) => bus.id === selectedBus)?.markers;

  // Convert marker position to required format
  // const getCurrentLocation = useCallback((position: [number, number] | undefined) => {
  //   if (!position) return undefined;
  //   return {
  //     latitude: position[0],
  //     longitude: position[1]
  //   };
  // }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Bus Tracking Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          {busRoutes.map((route) => (
            <div
              key={route.id}
              role="button"
              tabIndex={0}
              className={`transition-opacity duration-300 ${
                isLoading ? "opacity-50 pointer-events-none" : ""
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleBusSelect(route.id);
                }
              }}
            >
              <BusRoute
                isSelected={selectedBus === route.id}
                onSelect={() => handleBusSelect(route.id)}
                details={route}
              />
            </div>
          ))}
        </div>

        {selectedBus ? (
          <div className="md:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden h-[600px]">
            <RouteMap
              coordinates={coordinates}
              markers={markers}
              // currentLocation={getCurrentLocation(
              //   selectedBus === "101" ? bus101Markers.start.position :
              //   selectedBus === "102" ? bus102Markers.start.position :
              //   undefined
              // )}
            />
          </div>
        ) : (
          <p>Select a bus</p>
        )}
      </div>
    </div>
  );
}
