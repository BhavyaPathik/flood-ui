"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
} from "react-leaflet";
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

type FloodSpot = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
};

export default function MapView({
  spots,
  onSelect,
}: {
  spots: FloodSpot[];
  onSelect: (spot: FloodSpot) => void;
}) {
  return (
    <MapContainer
      center={[28.6139, 77.209]}
      zoom={11}
      className="h-[420px] rounded-xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {spots.map(spot => (
        <Marker
          key={spot.id}
          position={[spot.lat, spot.lng]}
          eventHandlers={{ click: () => onSelect(spot) }}
        >
          <Circle
            center={[spot.lat, spot.lng]}
            radius={
              spot.riskLevel === "HIGH"
                ? 1200
                : spot.riskLevel === "MEDIUM"
                ? 700
                : 400
            }
            pathOptions={{
              color:
                spot.riskLevel === "HIGH"
                  ? "#dc2626"
                  : spot.riskLevel === "MEDIUM"
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
