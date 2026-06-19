"use client";
import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface Scheme { id: number; name: string; budget: string; beneficiaries: string; districts: number; progress: number; status: string; }

const initialSchemes: Scheme[] = [
  { id: 1, name: "Midday Meal Scheme", budget: "₹4,200 Cr", beneficiaries: "1.24 Cr students", districts: 38, progress: 98, status: "Active" },
  { id: 2, name: "Chief Minister's Free Education", budget: "₹8,500 Cr", beneficiaries: "All students", districts: 38, progress: 100, status: "Active" },
  { id: 3, name: "SC/ST Scholarship Program", budget: "₹1,800 Cr", beneficiaries: "3.8L students", districts: 38, progress: 92, status: "Active" },
  { id: 4, name: "Digital Classroom Initiative", budget: "₹3,200 Cr", beneficiaries: "48K schools", districts: 38, progress: 74, status: "Active" },
  { id: 5, name: "Girl Child Education Mission", budget: "₹900 Cr", beneficiaries: "62L girl students", districts: 38, progress: 88, status: "Active" },
  { id: 6, name: "Smart School Infrastructure", budget: "₹5,500 Cr", beneficiaries: "15K rural schools", districts: 38, progress: 61, status: "Ongoing" },
  { id: 7, name: "AI Learning Labs", budget: "₹450 Cr", beneficiaries: "500 schools (Phase 1)", districts: 12, progress: 35, status: "Rollout" },
];

export default function CommissionerSchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>(initialSchemes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({ name: "", budget: "₹100 Cr", beneficiaries: "", districts: "38", progress: "10", status: "Rollout" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSchemes(p => [...p, { ...form, id: p.length + 1, districts: Number(form.districts), progress: Number(form.progress) }]);
    setIsModalOpen(false);
    setToast(`📜 Scheme '${form.name}' added to state overview.`);
    setTimeout(() => setToast(null), 4000);
  };

  const simulateExcel = () => {
    setIsUploading(true);
    setTimeout(() => {
      setSchemes(p => [...p,
        { id: p.length + 1, name: "Rural School Transport Scheme", budget: "₹280 Cr", beneficiaries: "2.1L rural students", districts: 38, progress: 20, status: "Rollout" },
      ]);
      setIsUploading(false);
      setIsModalOpen(false);
      setToast("📊 Schemes register imported! 1 new scheme added.");
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  return (
    <PortalLayout title="Schemes Overview" subtitle="Commissioner · State Operations" avatarLetter="C" avatarColor="#06b6d4" themeClass="theme-commissioner" accentColor="#06b6d4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active Schemes", value: schemes.filter(s => s.status === "Active").length.toString(), icon: "📜", color: "text-cyan-400" },
          { label: "Total Budget", value: "₹24,630 Cr", icon: "💰", color: "text-emerald-400" },
          { label: "Beneficiaries", value: "1.5 Cr+", icon: "👨‍🎓", color: "text-amber-400" },
          { label: "Avg Progress", value: `${Math.round(schemes.reduce((s, x) => s + x.progress, 0) / schemes.length)}%`, icon: "📊", color: "text-violet-400" },
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
          <h2 className="text-base font-semibold text-white">📜 State Education Schemes</h2>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl">+ Add Scheme</button>
        </div>
        <div className="space-y-3">
          {schemes.map(s => (
            <div key={s.id} className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-all">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`badge text-[9px] ${s.status === "Active" ? "badge-green" : s.status === "Rollout" ? "badge-blue" : "badge-yellow"}`}>{s.status}</span>
                  <span className="text-[10px] text-slate-500">{s.districts} districts · {s.beneficiaries}</span>
                </div>
                <div className="text-xs font-bold text-white">{s.name}</div>
                <div className="text-[10px] text-cyan-400 font-bold">{s.budget}</div>
              </div>
              <div className="text-right ml-4 w-24">
                <div className={`text-sm font-bold ${s.progress >= 90 ? "text-emerald-400" : s.progress >= 70 ? "text-amber-400" : "text-red-400"}`}>{s.progress}%</div>
                <div className="text-[10px] text-slate-500">Progress</div>
                <div className="h-1.5 bg-slate-800 rounded-full mt-1"><div className="h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500" style={{ width: `${s.progress}%` }} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl p-6 space-y-6" style={{ background: "#090d16", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 20px 50px rgba(0,0,0,0.95)" }}>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">📜 Add State Scheme</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs">✕ Close</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Manual Entry</div>
                {[{ label: "Scheme Name", key: "name", type: "text" }, { label: "Budget Allocation", key: "budget", type: "text" }, { label: "Beneficiaries", key: "beneficiaries", type: "text" }, { label: "Districts", key: "districts", type: "number" }, { label: "Progress %", key: "progress", type: "number" }].map(f => (
                  <div key={f.key}>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">{f.label}</label>
                    <input type={f.type} required value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500" />
                  </div>
                ))}
                <button type="submit" className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs">Add Scheme</button>
              </form>
              <div className="border-l border-slate-800 pl-6 flex flex-col justify-center">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">Excel Import</div>
                <div onClick={simulateExcel} className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-900/40 rounded-2xl p-6 text-center cursor-pointer min-h-[160px] flex flex-col items-center justify-center space-y-3">
                  {isUploading ? (<><div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" /><span className="text-[10px] text-slate-400">Parsing...</span></>) : (<><span className="text-3xl">📜</span><span className="text-xs font-bold text-white">Import Schemes Data</span><span className="text-[9px] text-slate-500">state_schemes.xlsx</span></>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
