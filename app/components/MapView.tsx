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
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type FloodSpot = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
};

type Props = {
  spots: FloodSpot[];
  onSelect: (spot: FloodSpot) => void;
};

export default function MapView({ spots, onSelect }: Props) {
  return (
    <MapContainer
      center={[28.6139, 77.209]}
      zoom={11}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
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
              spot.riskLevel === "HIGH" ? 1000 :
              spot.riskLevel === "MEDIUM" ? 600 : 300
            }
            pathOptions={{
              color:
                spot.riskLevel === "HIGH" ? "red" :
                spot.riskLevel === "MEDIUM" ? "orange" : "green",
              fillOpacity: 0.35,
            }}
          />
        </Marker>
      ))}
    </MapContainer>
  );
}
