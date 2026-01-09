"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Sidebar from "./components/sidebar";

const MapView = dynamic(() => import("./components/MapView"), { ssr: false });

type WaterLogSpot = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  severity: "LOW" | "MEDIUM" | "HIGH";
};

export default function Home() {
  const [spots, setSpots] = useState<WaterLogSpot[]>([]);
  const [active, setActive] = useState<WaterLogSpot | null>(null);

  useEffect(() => {
    fetch("/data/water_logging_spots.json")
      .then(res => res.json())
      .then(setSpots);
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-2 text-[var(--primary)]">
          Water Logging Monitoring Dashboard
        </h2>

        <p className="text-sm text-[var(--muted)] mb-4">
          Real-time urban water accumulation assessment
        </p>

        <div className="flex gap-3 mb-4">
          {["High Severity", "Medium Severity", "Low Severity"].map(tag => (
            <span
              key={tag}
              className="px-3 py-1 text-xs rounded-full border
                         bg-white text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="rounded-xl overflow-hidden border bg-white">
          <MapView spots={spots} onSelect={setActive} />
        </div>

        <div className="mt-5">
          {!active && (
            <div className="bg-white border rounded-lg p-4 text-sm text-slate-500">
              Select a marked zone to view water logging details
            </div>
          )}

          {active && (
            <div className="bg-white border rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {active.name}
                </h3>

                <span
                  className={`px-2 py-1 text-xs rounded-full text-white
                    ${
                      active.severity === "HIGH"
                        ? "bg-red-600"
                        : active.severity === "MEDIUM"
                        ? "bg-orange-500"
                        : "bg-green-600"
                    }`}
                >
                  {active.severity}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
                <div>
                  <span className="block text-xs text-slate-500">
                    Average Water Depth
                  </span>
                  25–60 cm
                </div>

                <div>
                  <span className="block text-xs text-slate-500">
                    Drainage Status
                  </span>
                  Partially Blocked
                </div>

                <div>
                  <span className="block text-xs text-slate-500">
                    Report Frequency
                  </span>
                  High during monsoon
                </div>

                <div>
                  <span className="block text-xs text-slate-500">
                    Last Incident
                  </span>
                  3 days ago
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
