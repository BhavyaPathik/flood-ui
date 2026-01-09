"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./components/MapView"), {
  ssr: false,
});

type FloodSpot = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
};

type FloodData = {
  location: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  waterDepthCm: number;
  rainfallMm: number;
  alert: string;
};

export default function Home() {
  const [spots, setSpots] = useState<FloodSpot[]>([]);
  const [activeSpot, setActiveSpot] = useState<FloodSpot | null>(null);
  const [data, setData] = useState<FloodData | null>(null);

  useEffect(() => {
    fetch("/data/flood_spots.json")
      .then(res => res.json())
      .then(setSpots);

    fetch("/data/flood_riskdata.json")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <main className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <h1 className="text-3xl font-bold mb-4">
          Flood Risk Dashboard
        </h1>

        <MapView
          spots={spots}
          onSelect={setActiveSpot}
        />
      </div>

      <aside className="bg-zinc-900 rounded-lg p-4">
        {!activeSpot && <p>Select a location on the map</p>}

        {activeSpot && data && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">
              {activeSpot.name}
            </h2>
            <p><b>Risk Level:</b> {activeSpot.riskLevel}</p>
            <p><b>Water Depth:</b> {data.waterDepthCm} cm</p>
            <p><b>Rainfall:</b> {data.rainfallMm} mm</p>
            <p className="text-red-500 font-semibold">
              {data.alert}
            </p>
          </div>
        )}
      </aside>
    </main>
  );
}
