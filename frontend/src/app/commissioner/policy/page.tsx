"use client";
import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface Policy { id: number; name: string; category: string; launched: string; districts: number; compliance: number; status: string; }

const initialPolicies: Policy[] = [
  { id: 1, name: "RTE Full Compliance Drive 2024", category: "Rights", launched: "2024-04-01", districts: 38, compliance: 92, status: "Active" },
  { id: 2, name: "Digital Classrooms Initiative", category: "Technology", launched: "2024-06-01", districts: 38, compliance: 74, status: "Active" },
  { id: 3, name: "Teacher Rationalization Policy", category: "HR", launched: "2024-07-15", districts: 38, compliance: 88, status: "Active" },
  { id: 4, name: "Gender-Balanced Enrollment", category: "Inclusion", launched: "2024-08-01", districts: 35, compliance: 81, status: "Active" },
  { id: 5, name: "Zero Dropout Mission 2025", category: "Dropout", launched: "2024-09-01", districts: 38, compliance: 65, status: "Under Review" },
  { id: 6, name: "Smart Library Program", category: "Resources", launched: "2024-10-01", districts: 20, compliance: 45, status: "Rollout" },
];

export default function CommissionerPolicyPage() {
  const [policies, setPolicies] = useState<Policy[]>(initialPolicies);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Technology", launched: "", districts: "38", compliance: "50", status: "Rollout" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPolicies(p => [...p, { ...form, id: p.length + 1, districts: Number(form.districts), compliance: Number(form.compliance) }]);
    setIsModalOpen(false);
    setToast(`⚖️ Policy '${form.name}' launched across ${form.districts} districts.`);
    setTimeout(() => setToast(null), 4000);
  };

  const simulateExcel = () => {
    setIsUploading(true);
    setTimeout(() => {
      setPolicies(p => [...p,
        { id: p.length + 1, name: "Early Childhood Care Policy", category: "Welfare", launched: "2024-11-01", districts: 38, compliance: 30, status: "Rollout" },
      ]);
      setIsUploading(false);
      setIsModalOpen(false);
      setToast("📊 Policy register imported! 1 new policy added.");
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  return (
    <PortalLayout title="Policy Monitoring" subtitle="Commissioner · State Operations" avatarLetter="C" avatarColor="#06b6d4" themeClass="theme-commissioner" accentColor="#06b6d4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active Policies", value: policies.filter(p => p.status === "Active").length.toString(), icon: "⚖️", color: "text-cyan-400" },
          { label: "State Avg Compliance", value: `${Math.round(policies.reduce((s, p) => s + p.compliance, 0) / policies.length)}%`, icon: "📊", color: "text-emerald-400" },
          { label: "Under Review", value: policies.filter(p => p.status === "Under Review").length.toString(), icon: "🔍", color: "text-amber-400" },
          { label: "In Rollout", value: policies.filter(p => p.status === "Rollout").length.toString(), icon: "🚀", color: "text-violet-400" },
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
          <h2 className="text-base font-semibold text-white">⚖️ State Policy Monitor</h2>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl">+ Add Policy</button>
        </div>
        <div className="space-y-3">
          {policies.map(p => (
            <div key={p.id} className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-all">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`badge text-[9px] ${p.status === "Active" ? "badge-green" : p.status === "Rollout" ? "badge-blue" : "badge-yellow"}`}>{p.status}</span>
                  <span className="badge badge-pink text-[9px]">{p.category}</span>
                </div>
                <div className="text-xs font-bold text-white">{p.name}</div>
                <div className="text-[10px] text-slate-500">Launched: {p.launched} · {p.districts} districts</div>
              </div>
              <div className="text-right ml-4 w-24">
                <div className={`text-sm font-bold ${p.compliance >= 85 ? "text-emerald-400" : p.compliance >= 70 ? "text-amber-400" : "text-red-400"}`}>{p.compliance}%</div>
                <div className="text-[10px] text-slate-500">Compliance</div>
                <div className="h-1.5 bg-slate-800 rounded-full mt-1"><div className="h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500" style={{ width: `${p.compliance}%` }} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl p-6 space-y-6" style={{ background: "#090d16", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 20px 50px rgba(0,0,0,0.95)" }}>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">⚖️ Launch New Policy</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs">✕ Close</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Manual Entry</div>
                {[{ label: "Policy Name", key: "name", type: "text" }, { label: "Launch Date", key: "launched", type: "date" }, { label: "Districts Covered", key: "districts", type: "number" }, { label: "Initial Compliance %", key: "compliance", type: "number" }].map(f => (
                  <div key={f.key}>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">{f.label}</label>
                    <input type={f.type} required value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500">
                    {["Technology", "Rights", "HR", "Inclusion", "Dropout", "Resources", "Welfare"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs">Launch Policy</button>
              </form>
              <div className="border-l border-slate-800 pl-6 flex flex-col justify-center">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">Excel Import</div>
                <div onClick={simulateExcel} className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-900/40 rounded-2xl p-6 text-center cursor-pointer min-h-[160px] flex flex-col items-center justify-center space-y-3">
                  {isUploading ? (<><div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" /><span className="text-[10px] text-slate-400">Parsing...</span></>) : (<><span className="text-3xl">⚖️</span><span className="text-xs font-bold text-white">Import Policy Register</span><span className="text-[9px] text-slate-500">state_policy_register.xlsx</span></>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
