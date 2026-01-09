"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Sidebar from "./components/sidebar";

const MapView = dynamic(() => import("./components/MapView"), { ssr: false });

type Zone = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  severity: "LOW" | "MEDIUM" | "HIGH";
};

type Tab = "home" | "report" | "history";

export default function Home() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [activeZone, setActiveZone] = useState<Zone | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("home");

  const [wards, setWards] = useState<string[]>([]);
  const [wardQuery, setWardQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [severity, setSeverity] = useState<"LOW" | "MEDIUM" | "HIGH">("LOW");
  const [description, setDescription] = useState("");

  const [reports, setReports] = useState<
    { ward: string; severity: string; description: string; status: string }[]
  >([]);

  useEffect(() => {
    fetch("/data/water_logging_spots.json")
      .then(res => res.json())
      .then(setZones);

    fetch("/data/delhi_wards.json")
      .then(res => res.json())
      .then(setWards);
  }, []);

  const filteredWards = wards.filter(w =>
    w.toLowerCase().includes(wardQuery.toLowerCase())
  );

  const submitReport = () => {
    if (!wardQuery || !description) return;

    setReports(prev => [
      {
        ward: wardQuery,
        severity,
        description,
        status: "Pending",
      },
      ...prev,
    ]);

    setWardQuery("");
    setDescription("");
    setSeverity("LOW");
    setShowSuggestions(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar activeTab={activeTab} onChange={setActiveTab} />

      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-semibold">
          Urban Waterlogging Dashboard
        </h1>

        {(activeTab === "home" || activeTab === "history") && (
          <div className="rounded-xl overflow-hidden border bg-white">
            <MapView zones={zones} onSelect={setActiveZone} />
          </div>
        )}

        {activeZone && activeTab !== "report" && (
          <div className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold mb-3">{activeZone.name}</h2>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Severity</p>
                <p>{activeZone.severity}</p>
              </div>
              <div>
                <p className="text-slate-500">Latitude</p>
                <p>{activeZone.lat}</p>
              </div>
              <div>
                <p className="text-slate-500">Longitude</p>
                <p>{activeZone.lng}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "home" && (
          <div className="rounded-xl border bg-white p-5 text-slate-700">
            This portal allows citizens to report urban waterlogging, track
            active complaints, and review historical waterlogging patterns
            across Delhi wards.
          </div>
        )}

        {activeTab === "report" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border bg-white p-6 space-y-4">
              <h2 className="font-semibold">Submit Waterlogging Report</h2>

              <div className="relative">
                <input
                  value={wardQuery}
                  onChange={e => {
                    setWardQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search ward"
                  className="w-full border rounded-md px-3 py-2"
                />

                {showSuggestions && filteredWards.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-md max-h-40 overflow-auto">
                    {filteredWards.map(w => (
                      <div
                        key={w}
                        className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                        onClick={() => {
                          setWardQuery(w);
                          setShowSuggestions(false);
                        }}
                      >
                        {w}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <select
                value={severity}
                onChange={e =>
                  setSeverity(e.target.value as "LOW" | "MEDIUM" | "HIGH")
                }
                className="w-full border rounded-md px-3 py-2"
              >
                <option>LOW</option>
                <option>MEDIUM</option>
                <option>HIGH</option>
              </select>

              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the waterlogging situation"
                className="w-full border rounded-md px-3 py-2"
              />

              <button
                onClick={submitReport}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Submit
              </button>
            </div>

            <div className="rounded-xl border bg-white p-6">
              <h2 className="font-semibold mb-4">Active Reports</h2>

              {reports.length === 0 && (
                <p className="text-slate-500 text-sm">
                  No active reports submitted yet.
                </p>
              )}

              <div className="space-y-3">
                {reports.map((r, i) => (
                  <div
                    key={i}
                    className="border rounded-md p-3 text-sm"
                  >
                    <p className="font-medium">{r.ward}</p>
                    <p className="text-slate-600">{r.description}</p>
                    <p className="text-orange-600 mt-1">
                      Status: {r.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="rounded-xl border bg-white p-5 text-sm text-slate-700">
            Historical waterlogging incidents recorded during previous monsoon
            seasons across the city.
          </div>
        )}
      </main>
    </div>
  );
}
