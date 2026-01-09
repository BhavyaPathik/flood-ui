"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./components/MapView"), {
  ssr: false,
});

type FloodZone = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  waterDepthCm?: number;
  rainfallMm?: number;
  alert?: string;
};

export default function Home() {
  const [zones, setZones] = useState<FloodZone[]>([]);
  const [active, setActive] = useState<FloodZone | null>(null);

  useEffect(() => {
    fetch("/data/flood_risk_spots.json")
      .then(res => res.json())
      .then(setZones);
  }, []);
  <div className="bg-blue-500 text-white p-10 text-3xl">
  Tailwind OK
  </div>

  return (
    <div className="flex h-screen">
      
      <aside className="w-64 bg-white border-r p-4 space-y-2">
        <h1 className="text-xl font-bold mb-4">Flood Hub</h1>

        {["Overview", "Active Alerts", "Flood History", "Safe Zones"].map(tag => (
          <button
            key={tag}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 transition"
          >
            {tag}
          </button>
        ))}
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">
          Flood Risk Dashboard
        </h2>

        <div className="rounded-xl overflow-hidden shadow bg-white">
          <MapView spots={zones} onSelect={setActive} />
        </div>

        <div className="mt-6 bg-white rounded-xl shadow p-4">
          {!active && (
            <p className="text-slate-500">
              Click a flood zone on the map to view details
            </p>
          )}

          {active && (
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{active.name}</h3>

              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold
                  ${
                    active.riskLevel === "HIGH"
                      ? "bg-red-100 text-red-700"
                      : active.riskLevel === "MEDIUM"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-green-100 text-green-700"
                  }`}
              >
                {active.riskLevel} RISK
              </span>

              <p><b>Water Depth:</b> {active.waterDepthCm ?? "—"} cm</p>
              <p><b>Rainfall:</b> {active.rainfallMm ?? "—"} mm</p>

              {active.alert && (
                <p className="text-red-600 font-semibold">
                  {active.alert}
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
