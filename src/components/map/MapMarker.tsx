import { Icon } from "leaflet";
import { Marker, Popup } from "react-leaflet";

export const icon = new Icon({
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapMarkerProps {
  position: [number, number];
  title: string;
  children?: React.ReactNode;
}

export function MapMarker({ position, title, children }: MapMarkerProps) {
  return (
    <Marker position={position} icon={icon}>
      <Popup>{children || title}</Popup>
    </Marker>
  );
}
