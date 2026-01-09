"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Sidebar from "./components/sidebar";

const MapView = dynamic(() => import("./components/MapView"), {
  ssr: false,
});

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
  const [selectedWard, setSelectedWard] = useState("");

  const [severity, setSeverity] = useState("LOW");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch("/data/water_logging_spots.json")
      .then((res) => res.json())
      .then(setZones);

    fetch("/data/delhi_wards.json")
      .then((res) => res.json())
      .then(setWards);
  }, []);

  const filteredWards = wards.filter((w) =>
    w.toLowerCase().includes(wardQuery.toLowerCase())
  );

  const submitReport = () => {
    if (!selectedWard || !description) return;
    alert("Report submitted successfully");
    setSelectedWard("");
    setWardQuery("");
    setSeverity("LOW");
    setDescription("");
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar activeTab={activeTab} onChange={setActiveTab} />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">
          Urban Waterlogging Dashboard
        </h1>

        {activeTab === "home" && (
          <>
            <div className="rounded-xl bg-white p-4 mb-6">
              This portal allows citizens to report urban waterlogging, track
              complaints, and review historical waterlogging patterns across
              Delhi wards.
            </div>

            <div className="rounded-xl overflow-hidden border bg-white mb-4">
              <MapView zones={zones} onSelect={setActiveZone} />
            </div>

            {activeZone && (
              <div className="rounded-xl border bg-white p-5 text-sm">
                <div className="text-lg font-semibold mb-2">
                  {activeZone.name}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-slate-500">Severity</div>
                    <div className="font-medium">{activeZone.severity}</div>
                  </div>

                  <div>
                    <div className="text-slate-500">Coordinates</div>
                    <div className="font-medium">
                      {activeZone.lat}, {activeZone.lng}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "report" && (
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-xl bg-white p-5">
              <h2 className="font-semibold text-lg mb-4">
                Submit Waterlogging Report
              </h2>

              <input
                value={wardQuery}
                onChange={(e) => {
                  setWardQuery(e.target.value);
                  setSelectedWard("");
                }}
                placeholder="Search ward"
                className="w-full border rounded-md px-3 py-2 mb-2"
              />

              {wardQuery && (
                <div className="border rounded-md mb-3 max-h-40 overflow-y-auto">
                  {filteredWards.map((ward) => (
                    <div
                      key={ward}
                      onClick={() => {
                        setSelectedWard(ward);
                        setWardQuery(ward);
                      }}
                      className="px-3 py-2 cursor-pointer hover:bg-slate-100"
                    >
                      {ward}
                    </div>
                  ))}
                </div>
              )}

              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full border rounded-md px-3 py-2 mb-3"
              >
                <option>LOW</option>
                <option>MEDIUM</option>
                <option>HIGH</option>
              </select>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the waterlogging situation"
                className="w-full border rounded-md px-3 py-2 mb-4"
              />

              <button
                onClick={submitReport}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Submit
              </button>
            </div>

            <div className="rounded-xl bg-white p-5">
              <h2 className="font-semibold text-lg mb-2">Active Reports</h2>
              <p className="text-sm text-slate-600">
                No active reports submitted yet.
              </p>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <>
            <div className="rounded-xl overflow-hidden border bg-white mb-4">
              <MapView zones={zones} onSelect={setActiveZone} />
            </div>

            {activeZone && (
              <div className="rounded-xl border bg-white p-5 text-sm">
                <div className="text-lg font-semibold mb-2">
                  {activeZone.name}
                </div>
                <div className="text-slate-600">
                  Historical waterlogging severity: {activeZone.severity}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
