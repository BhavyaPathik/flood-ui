"use client";

import { useEffect, useState } from "react";
import MapView from "./components/MapView";



type FloodData = {
  location: string;
  riskLevel: string;
  waterDepthCm: number;
  rainfallMm: number;
  alert: string;
};

export default function Home() {
  const [data, setData] = useState<FloodData | null>(null); 

  const handleSelect = (lat: number, lng: number) => {
  console.log("Clicked:", lat, lng);
  };

  useEffect(() => {
    fetch("/data/flood_riskdata.json")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Flood Risk Dashboard</h1>
      <MapView onSelect={handleSelect} />

      {!data && <p className="mt-4">Loading data...</p>}

      {data && (
        <div className="mt-4 space-y-2">
          <p><b>Location:</b> {data.location}</p>
          <p><b>Risk Level:</b> {data.riskLevel}</p>
          <p><b>Water Depth:</b> {data.waterDepthCm} cm</p>
          <p><b>Rainfall:</b> {data.rainfallMm} mm</p>
          <p className="text-red-500"><b>Alert:</b> {data.alert}</p>
        </div>
      )}
    </main>
  );
}
