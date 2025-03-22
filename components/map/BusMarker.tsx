import { BusLocation } from "@/lib/map/types";
import { MapMarker } from "./MapMarker";

export function BusMarker({ bus }: { bus: BusLocation }) {
  return (
    <MapMarker position={bus.position} title={bus.number}>
      <div className="p-2">
        <h3 className="font-medium text-gray-900">{bus.number}</h3>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-600">Route: {bus.route}</p>
          <p className="text-sm text-gray-600">
            Status:{" "}
            <span
              className={
                bus.status === "On Time" ? "text-green-600" : "text-red-600"
              }
            >
              {bus.status}
            </span>
          </p>
          <p className="text-sm text-gray-600">Speed: {bus.speed}</p>
          <p className="text-sm text-gray-600">Last Update: {bus.lastUpdate}</p>
        </div>
      </div>
    </MapMarker>
  );
}
