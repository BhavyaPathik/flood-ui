"use client";

const items = [
  "Overview",
  "Active Alerts",
  "Flood History",
  "Safe Zones",
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-5">
      <h1 className="text-xl font-bold mb-6 text-blue-600">
        Flood Hub
      </h1>

      <nav className="space-y-2">
        {items.map(item => (
          <button
            key={item}
            className="w-full text-left px-4 py-2 rounded-lg
                       hover:bg-blue-50 transition"
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}
