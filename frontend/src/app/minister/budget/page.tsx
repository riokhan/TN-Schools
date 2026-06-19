"use client";
import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface BudgetAlloc { id: number; head: string; category: string; approved: number; released: number; utilized: number; fy: string; }

const allocations: BudgetAlloc[] = [
  { id: 1, head: "Mid-Day Meal Scheme", category: "Nutrition", approved: 4200, released: 4200, utilized: 4050, fy: "2024-25" },
  { id: 2, head: "Free Education (Tuition, Books, Uniform)", category: "Universal Access", approved: 8500, released: 8500, utilized: 8490, fy: "2024-25" },
  { id: 3, head: "SC/ST Scholarship", category: "Scholarship", approved: 1800, released: 1650, utilized: 1520, fy: "2024-25" },
  { id: 4, head: "Teacher Salaries & DA", category: "HR", approved: 28000, released: 28000, utilized: 27850, fy: "2024-25" },
  { id: 5, head: "Infrastructure & Construction", category: "Capital", approved: 5500, released: 3800, utilized: 2900, fy: "2024-25" },
  { id: 6, head: "Digital Classroom Initiative", category: "Technology", approved: 3200, released: 2400, utilized: 1800, fy: "2024-25" },
  { id: 7, head: "Girls' Education Mission", category: "Inclusion", approved: 900, released: 750, utilized: 680, fy: "2024-25" },
  { id: 8, head: "Sport & Youth Affairs", category: "Extracurricular", approved: 320, released: 280, utilized: 210, fy: "2024-25" },
];

export default function MinisterBudgetPage() {
  const totalApproved = allocations.reduce((s, a) => s + a.approved, 0);
  const totalReleased = allocations.reduce((s, a) => s + a.released, 0);
  const totalUtilized = allocations.reduce((s, a) => s + a.utilized, 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({ head: "", category: "Capital", approved: "1000", released: "500", utilized: "200", fy: "2024-25" });
  const [data, setData] = useState(allocations);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setData(p => [...p, { ...form, id: p.length + 1, approved: Number(form.approved), released: Number(form.released), utilized: Number(form.utilized) }]);
    setIsModalOpen(false);
    setToast(`💰 Budget head '${form.head}' added to FY${form.fy} overview.`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <PortalLayout title="Budget Overview" subtitle="Minister · Executive Command Center" avatarLetter="M" avatarColor="#ef4444" themeClass="theme-minister" accentColor="#ef4444">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Approved", value: `₹${(totalApproved / 100).toFixed(0)} Cr`, icon: "💰", color: "text-red-400" },
          { label: "Released to Depts", value: `₹${(totalReleased / 100).toFixed(0)} Cr`, icon: "✅", color: "text-cyan-400" },
          { label: "Utilized", value: `₹${(totalUtilized / 100).toFixed(0)} Cr`, icon: "📊", color: "text-emerald-400" },
          { label: "Utilization Rate", value: `${Math.round((totalUtilized / totalApproved) * 100)}%`, icon: "📈", color: "text-amber-400" },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="text-2xl mb-2">{k.icon}</div>
            <div className={`text-2xl font-extrabold ${k.color} mb-1`}>{k.value}</div>
            <div className="text-xs text-slate-500 font-semibold">{k.label}</div>
          </div>
        ))}
      </div>
      {toast && <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl">{toast}</div>}

      <div className="glass rounded-2xl p-6 border border-slate-800 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-base font-semibold text-white">💰 FY 2024-25 — Education Budget Overview</h2>
            <p className="text-xs text-slate-500 mt-1">Total Approved Budget: ₹{(totalApproved / 100).toFixed(0)} Crore</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl">+ Add Budget Head</button>
        </div>
        <div className="space-y-3">
          {data.map(a => {
            const relPct = Math.round((a.released / a.approved) * 100);
            const utilPct = Math.round((a.utilized / a.approved) * 100);
            return (
              <div key={a.id} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-xs font-bold text-white">{a.head}</div>
                    <div className="text-[10px] text-slate-500">{a.category} · FY {a.fy}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-red-400 font-bold text-xs">₹{a.approved}L approved</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] text-slate-500 w-16">Released</span>
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full"><div className="h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500" style={{ width: `${relPct}%` }} /></div>
                    <span className="text-[10px] text-cyan-400 font-bold w-10 text-right">{relPct}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] text-slate-500 w-16">Utilized</span>
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full"><div className={`h-1.5 rounded-full bg-gradient-to-r ${utilPct >= 85 ? "from-emerald-500 to-teal-500" : utilPct >= 65 ? "from-amber-500 to-yellow-500" : "from-red-500 to-orange-500"}`} style={{ width: `${utilPct}%` }} /></div>
                    <span className={`text-[10px] font-bold w-10 text-right ${utilPct >= 85 ? "text-emerald-400" : utilPct >= 65 ? "text-amber-400" : "text-red-400"}`}>{utilPct}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl p-6 space-y-5" style={{ background: "#090d16", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 20px 50px rgba(0,0,0,0.95)" }}>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">💰 Add Budget Head</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs">✕ Close</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              {[{ label: "Budget Head Name", key: "head", type: "text" }, { label: "Approved (Lakhs)", key: "approved", type: "number" }, { label: "Released (Lakhs)", key: "released", type: "number" }, { label: "Utilized (Lakhs)", key: "utilized", type: "number" }].map(f => (
                <div key={f.key}>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">{f.label}</label>
                  <input type={f.type} required value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500" />
                </div>
              ))}
              <div>
                <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                  {["Nutrition", "Universal Access", "Scholarship", "HR", "Capital", "Technology", "Inclusion", "Extracurricular"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs mt-2">Add Budget Head</button>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
