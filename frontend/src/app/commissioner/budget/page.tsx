"use client";
import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface BudgetItem { id: number; scheme: string; category: string; allocated: number; utilized: number; districts: number; }

const initialBudget: BudgetItem[] = [
  { id: 1, scheme: "Mid-Day Meal Scheme", category: "Nutrition", allocated: 4500, utilized: 4200, districts: 38 },
  { id: 2, scheme: "SC/ST Scholarship Fund", category: "Scholarship", allocated: 1800, utilized: 1650, districts: 38 },
  { id: 3, scheme: "Digital Classroom Rollout", category: "Technology", allocated: 3200, utilized: 2100, districts: 25 },
  { id: 4, scheme: "Teacher Salary & Allowances", category: "HR", allocated: 12000, utilized: 11800, districts: 38 },
  { id: 5, scheme: "Infrastructure Construction", category: "Infrastructure", allocated: 5500, utilized: 3900, districts: 38 },
  { id: 6, scheme: "Girls' Education Mission", category: "Inclusion", allocated: 900, utilized: 720, districts: 38 },
];

export default function CommissionerBudgetPage() {
  const [budget, setBudget] = useState<BudgetItem[]>(initialBudget);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({ scheme: "", category: "Technology", allocated: "1000", utilized: "500", districts: "38" });

  const totalAlloc = budget.reduce((s, b) => s + b.allocated, 0);
  const totalUtil = budget.reduce((s, b) => s + b.utilized, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBudget(p => [...p, { ...form, id: p.length + 1, allocated: Number(form.allocated), utilized: Number(form.utilized), districts: Number(form.districts) }]);
    setIsModalOpen(false);
    setToast(`💰 Budget allocation for '${form.scheme}' added to state tracker.`);
    setTimeout(() => setToast(null), 4000);
  };

  const simulateExcel = () => {
    setIsUploading(true);
    setTimeout(() => {
      setBudget(p => [...p,
        { id: p.length + 1, scheme: "Smart Classroom Phase 2", category: "Technology", allocated: 2800, utilized: 400, districts: 15 },
      ]);
      setIsUploading(false);
      setIsModalOpen(false);
      setToast("📊 Budget spreadsheet parsed! 1 new allocation added.");
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  return (
    <PortalLayout title="Budget Utilization" subtitle="Commissioner · State Operations" avatarLetter="C" avatarColor="#06b6d4" themeClass="theme-commissioner" accentColor="#06b6d4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Allocated", value: `₹${(totalAlloc / 100).toFixed(1)}Cr`, icon: "💰", color: "text-cyan-400" },
          { label: "Total Utilized", value: `₹${(totalUtil / 100).toFixed(1)}Cr`, icon: "✅", color: "text-emerald-400" },
          { label: "Utilization Rate", value: `${Math.round((totalUtil / totalAlloc) * 100)}%`, icon: "📊", color: "text-amber-400" },
          { label: "Unspent Balance", value: `₹${((totalAlloc - totalUtil) / 100).toFixed(1)}Cr`, icon: "⏳", color: "text-red-400" },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="text-2xl mb-2">{k.icon}</div>
            <div className={`text-2xl font-extrabold ${k.color} mb-1`}>{k.value}</div>
            <div className="text-xs text-slate-500 font-semibold">{k.label}</div>
          </div>
        ))}
      </div>
      {toast && <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl">{toast}</div>}

      <div className="glass rounded-2xl p-6 border border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-white">💰 State Budget Utilization Tracker</h2>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl">+ Add Allocation</button>
        </div>
        <div className="space-y-3">
          {budget.map(b => {
            const pct = Math.round((b.utilized / b.allocated) * 100);
            return (
              <div key={b.id} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-xs font-bold text-white">{b.scheme}</div>
                    <div className="text-[10px] text-slate-500">{b.category} · {b.districts} districts</div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold text-xs">₹{b.utilized}L</span>
                    <span className="text-slate-500 text-[10px]"> / ₹{b.allocated}L</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-800 rounded-full">
                    <div className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className={`text-xs font-bold ${pct >= 90 ? "text-emerald-400" : pct >= 70 ? "text-amber-400" : "text-red-400"}`}>{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl p-6 space-y-6" style={{ background: "#090d16", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 20px 50px rgba(0,0,0,0.95)" }}>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">💰 Add Budget Allocation</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs">✕ Close</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Manual Entry</div>
                {[{ label: "Scheme Name", key: "scheme", type: "text" }, { label: "Allocated (Lakhs)", key: "allocated", type: "number" }, { label: "Utilized (Lakhs)", key: "utilized", type: "number" }, { label: "Districts Covered", key: "districts", type: "number" }].map(f => (
                  <div key={f.key}>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">{f.label}</label>
                    <input type={f.type} required value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                    {["Nutrition", "Scholarship", "Technology", "HR", "Infrastructure", "Inclusion", "Welfare"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs">Add Allocation</button>
              </form>
              <div className="border-l border-slate-800 pl-6 flex flex-col justify-center">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">Excel Import</div>
                <div onClick={simulateExcel} className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-900/40 rounded-2xl p-6 text-center cursor-pointer min-h-[160px] flex flex-col items-center justify-center space-y-3">
                  {isUploading ? (<><div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" /><span className="text-[10px] text-slate-400">Parsing...</span></>) : (<><span className="text-3xl">💰</span><span className="text-xs font-bold text-white">Import Budget Data</span><span className="text-[9px] text-slate-500">state_budget_utilization.xlsx</span></>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
