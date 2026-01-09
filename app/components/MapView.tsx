"use client";

import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Spot = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  severity: "LOW" | "MEDIUM" | "HIGH";
};

export default function MapView({
  spots,
  onSelect,
}: {
  spots: Spot[];
  onSelect: (s: Spot) => void;
}) {
  return (
    <MapContainer
      center={[28.6139, 77.209]}
      zoom={11}
      style={{ height: "420px", width: "100%" }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {spots.map(s => (
        <Circle
          key={s.id}
          center={[s.lat, s.lng]}
          radius={
            s.severity === "HIGH" ? 900 :
            s.severity === "MEDIUM" ? 600 : 350
          }
          pathOptions={{
            color:
              s.severity === "HIGH"
                ? "#dc2626"
                : s.severity === "MEDIUM"
                ? "#ea580c"
                : "#16a34a",
            fillOpacity: 0.45,
          }}
          eventHandlers={{
            click: () => onSelect(s),
          }}
        />
      ))}
    </MapContainer>
  );
}
