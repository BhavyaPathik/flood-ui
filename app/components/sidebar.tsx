"use client";

const items = [
  "Overview",
  "Active Waterlogging",
  "Historical Data",
  "Drainage Map",
  "Safe Routes"
];

export default function Sidebar() {
  return (
    <aside className="w-60 bg-white border-r border-[var(--border)] px-5 py-6">
      <h1 className="text-xl font-semibold text-[var(--primary)] mb-8">
        Tabs
      </h1>

      <nav className="space-y-2">
        {items.map(item => (
          <button
            key={item}
            className="w-full text-left px-3 py-2 rounded-md text-sm
                       text-slate-700 hover:bg-blue-50 hover:text-[var(--primary)]
                       transition"
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}
