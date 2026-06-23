"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface MealMenu {
  day: string;
  menuItem: string;
  eggServed: boolean;
  specialAccompaniment: string;
}

interface GroceryStock {
  id: number;
  item: string;
  quantity: string;
  unit: string;
  status: "Adequate" | "Low Stock" | "Reorder Placed";
  lastRefilled: string;
}

export default function MiddayMealPage() {
  const [weeklyMenu] = useState<MealMenu[]>([
    { day: "Monday", menuItem: "Sambar Rice + Boiled Egg / Banana", eggServed: true, specialAccompaniment: "Potato Fry" },
    { day: "Tuesday", menuItem: "Mixed Vegetable Rice + Boiled Egg / Banana", eggServed: true, specialAccompaniment: "Black Bengal Gram Sundal" },
    { day: "Wednesday", menuItem: "Vegetable Pulav + Boiled Egg / Banana", eggServed: true, specialAccompaniment: "Boiled Potatoes" },
    { day: "Thursday", menuItem: "Lemon Rice + Boiled Egg / Banana", eggServed: true, specialAccompaniment: "Fried Potatoes" },
    { day: "Friday", menuItem: "Curry Leaf Rice + Boiled Egg / Banana", eggServed: true, specialAccompaniment: "Fried Bengal Gram" },
  ]);

  const [stocks, setStocks] = useState<GroceryStock[]>([
    { id: 1, item: "Fine Rice", quantity: "340", unit: "kg", status: "Adequate", lastRefilled: "June 05, 2026" },
    { id: 2, item: "Toor Dal", quantity: "85", unit: "kg", status: "Adequate", lastRefilled: "June 05, 2026" },
    { id: 3, item: "Double Fortified Salt", quantity: "15", unit: "kg", status: "Low Stock", lastRefilled: "May 20, 2026" },
    { id: 4, item: "Fortified Palm Oil", quantity: "45", unit: "liters", status: "Adequate", lastRefilled: "June 05, 2026" },
    { id: 5, item: "Fresh Eggs", quantity: "180", unit: "pieces", status: "Low Stock", lastRefilled: "June 16, 2026" },
    { id: 6, item: "Bengal Gram / Dal grains", quantity: "110", unit: "kg", status: "Adequate", lastRefilled: "June 05, 2026" },
  ]);

  // Daily reporting Form State
  const [studentsFed, setStudentsFed] = useState("245");
  const [eggsDistributed, setEggsDistributed] = useState("240");
  const [bananasDistributed, setBananasDistributed] = useState("5");
  const [logToast, setLogToast] = useState<string | null>(null);

  const handleLogMeal = (e: React.FormEvent) => {
    e.preventDefault();
    setLogToast(
      `✓ Daily Mid-day meal report registered on EMIS! Total Fed: ${studentsFed} students. Eggs: ${eggsDistributed}, Bananas: ${bananasDistributed}.`
    );
    setTimeout(() => setLogToast(null), 4000);
  };

  return (
    <PortalLayout
      title="Mid-Day Meal Welfare Management"
      subtitle="Mr. Venkatesh R. · GHS Coimbatore · DISE: 33012345"
      avatarLetter="V"
      avatarColor="#3b82f6"
      themeClass="theme-headmaster"
      accentColor="#3b82f6"
    >
      {/* Overview KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Students Fed Today</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">{studentsFed}</span>
            <span className="text-[10px] text-emerald-400 font-bold">100% Coverage</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-semibold">
            Attendance aligned: 245 present.
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Rice Stock Status</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-emerald-400">340 kg</span>
            <span className="text-[10px] text-slate-400 font-bold">Good for 12 days</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-semibold">
            Next block quota expected: June 30.
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Nutritional Eggs</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-amber-400">180 pcs</span>
            <span className="text-[10px] text-amber-500 font-bold">Refill Required</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-semibold">
            Fresh shipment scheduled for tomorrow.
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Kitchen Health Index</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-blue-400">95%</span>
            <span className="text-[10px] text-blue-400 font-bold">Satisfactory</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-semibold">
            Gas cylinder & water audit clear.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Weekly Government Menu Schedule */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-base font-semibold text-white mb-1">🍛 Government Sanctioned Weekly Menu</h2>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">Mandated nutritional guidelines to include high-protein grains and eggs/bananas for all classes.</p>

          <div className="space-y-4">
            {weeklyMenu.map((m) => (
              <div
                key={m.day}
                className="p-4 bg-slate-900/60 rounded-xl border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h3 className="text-sm font-bold text-white mb-0.5">{m.day}</h3>
                  <div className="text-xs text-slate-400">{m.menuItem}</div>
                  <div className="text-[10px] text-slate-500 font-semibold mt-1">
                    Side Accompaniment: <strong className="text-slate-350">{m.specialAccompaniment}</strong>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                    🥚 Eggs / 🍌 Bananas Sync
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily lunch register card */}
        <div className="glass rounded-2xl p-6 border border-slate-800 h-fit">
          <h2 className="text-base font-semibold text-white mb-2">📝 Log Daily Meal Distribution</h2>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">Confirm meal count data directly to the Tamil Nadu Mid-day Meal Monitoring Portal.</p>

          <form onSubmit={handleLogMeal} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Total Students Served Today</label>
              <input
                type="number"
                value={studentsFed}
                onChange={(e) => setStudentsFed(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Eggs Distributed</label>
                <input
                  type="number"
                  value={eggsDistributed}
                  onChange={(e) => setEggsDistributed(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Bananas Distributed</label>
                <input
                  type="number"
                  value={bananasDistributed}
                  onChange={(e) => setBananasDistributed(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Post Serving Log
            </button>
          </form>

          {logToast && (
            <div className="mt-4 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl leading-relaxed">
              {logToast}
            </div>
          )}
        </div>
      </div>

      {/* Stock Inventory */}
      <div className="glass rounded-2xl p-6 border border-slate-800 mb-6">
        <h2 className="text-base font-semibold text-white mb-1">📦 Kitchen Grocery Stock Level</h2>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">Daily updated measurements of grocery materials in the school storeroom.</p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-850 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="pb-3 pl-2">Grocery Item</th>
                <th className="pb-3">Current Quantity</th>
                <th className="pb-3">Measurement Unit</th>
                <th className="pb-3">Last Refill Date</th>
                <th className="pb-3 text-right pr-2">Stock Alert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {stocks.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 pl-2 font-bold text-white">{st.item}</td>
                  <td className="py-3.5 text-blue-400 font-bold">{st.quantity}</td>
                  <td className="py-3.5 text-slate-400">{st.unit}</td>
                  <td className="py-3.5 text-slate-500 font-medium">{st.lastRefilled}</td>
                  <td className="py-3.5 text-right pr-2">
                    <span className={`badge ${
                      st.status === "Adequate"
                        ? "badge-green"
                        : "badge-yellow"
                    }`}>
                      {st.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PortalLayout>
  );
}
