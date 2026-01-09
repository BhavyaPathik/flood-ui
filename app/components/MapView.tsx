"use client";

import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Zone = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  severity: "LOW" | "MEDIUM" | "HIGH";
};

export default function MapView({
  zones,
  onSelect,
}: {
  zones: Zone[];
  onSelect: (z: Zone) => void;
}) {
  return (
    <MapContainer
      center={[28.6139, 77.209]}
      zoom={11}
      style={{ height: "420px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {zones.map(z => (
        <Marker
          key={z.id}
          position={[z.lat, z.lng]}
          eventHandlers={{ click: () => onSelect(z) }}
        >
          <Circle
            center={[z.lat, z.lng]}
            radius={
              z.severity === "HIGH" ? 900 : z.severity === "MEDIUM" ? 600 : 350
            }
            pathOptions={{
              color:
                z.severity === "HIGH"
                  ? "#dc2626"
                  : z.severity === "MEDIUM"
                  ? "#f59e0b"
                  : "#16a34a",
              fillOpacity: 0.35,
            }}
          />
        </Marker>
      ))}
    </MapContainer>
  );
}
