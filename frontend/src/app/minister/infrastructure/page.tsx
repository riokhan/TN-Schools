"use client";
import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface Project { id: number; name: string; district: string; type: string; budget: string; completion: number; deadline: string; status: string; }

const projects: Project[] = [
  { id: 1, name: "Smart School Complex — Coimbatore", district: "Coimbatore", type: "New Construction", budget: "₹42 Cr", completion: 78, deadline: "Mar 2025", status: "On Track" },
  { id: 2, name: "Digital Lab Rollout — Salem 200 Schools", district: "Salem", type: "Technology", budget: "₹18 Cr", completion: 55, deadline: "Dec 2024", status: "Delayed" },
  { id: 3, name: "Boundary Wall & Security — Tirunelveli", district: "Tirunelveli", type: "Safety", budget: "₹8 Cr", completion: 90, deadline: "Nov 2024", status: "Near Complete" },
  { id: 4, name: "Science Lab Renovation — Madurai 50 Schools", district: "Madurai", type: "Renovation", budget: "₹12 Cr", completion: 40, deadline: "Feb 2025", status: "On Track" },
  { id: 5, name: "Girls' Hostel Construction — Trichy", district: "Trichy", type: "New Construction", budget: "₹25 Cr", completion: 62, deadline: "Mar 2025", status: "On Track" },
  { id: 6, name: "Toilet Block Upgrade — State-wide Phase 3", district: "State-wide", type: "Sanitation", budget: "₹65 Cr", completion: 83, deadline: "Jan 2025", status: "Near Complete" },
  { id: 7, name: "Solar Panel Installation — 500 Schools", district: "Multiple", type: "Green Energy", budget: "₹30 Cr", completion: 28, deadline: "Jun 2025", status: "On Track" },
];

export default function MinisterInfrastructurePage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [data, setData] = useState(projects);
  const [form, setForm] = useState({ name: "", district: "", type: "New Construction", budget: "₹10 Cr", completion: "0", deadline: "2025-06-30", status: "On Track" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setData(p => [...p, { ...form, id: p.length + 1, completion: Number(form.completion) }]);
    setIsModalOpen(false);
    setToast(`🏗️ Infrastructure project '${form.name}' added to ministerial tracker.`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <PortalLayout title="Infrastructure Projects" subtitle="Minister · Executive Command Center" avatarLetter="M" avatarColor="#ef4444" themeClass="theme-minister" accentColor="#ef4444">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Projects", value: data.length.toString(), icon: "🏗️", color: "text-red-400" },
          { label: "Near Complete", value: data.filter(p => p.status === "Near Complete").length.toString(), icon: "✅", color: "text-emerald-400" },
          { label: "Delayed", value: data.filter(p => p.status === "Delayed").length.toString(), icon: "⚠️", color: "text-amber-400" },
          { label: "Avg Completion", value: `${Math.round(data.reduce((s, p) => s + p.completion, 0) / data.length)}%`, icon: "📊", color: "text-cyan-400" },
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
          <h2 className="text-base font-semibold text-white">🏗️ Ministerial Infrastructure Projects Tracker</h2>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl">+ Add Project</button>
        </div>
        <div className="space-y-3">
          {data.map(p => (
            <div
              key={p.id}
              onClick={() => setSelected(selected === p.id ? null : p.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${selected === p.id ? "border-red-500/40 bg-red-500/5" : "border-slate-800 bg-slate-900/60 hover:border-red-500/20"}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge text-[9px] ${p.status === "On Track" ? "badge-green" : p.status === "Near Complete" ? "badge-blue" : "badge-red"}`}>{p.status}</span>
                    <span className="badge badge-yellow text-[9px]">{p.type}</span>
                    <span className="text-[10px] text-slate-500">{p.district} · Due: {p.deadline}</span>
                  </div>
                  <div className="text-xs font-bold text-white">{p.name}</div>
                  <div className="text-[10px] text-red-400 font-bold">{p.budget}</div>
                </div>
                <div className={`text-xl font-extrabold ml-4 ${p.completion >= 80 ? "text-emerald-400" : p.completion >= 60 ? "text-amber-400" : "text-red-400"}`}>{p.completion}%</div>
              </div>
              <div className="h-2 bg-slate-800 rounded-full">
                <div className={`h-2 rounded-full bg-gradient-to-r transition-all ${p.completion >= 80 ? "from-emerald-500 to-teal-500" : p.completion >= 60 ? "from-amber-500 to-yellow-500" : "from-red-500 to-orange-500"}`} style={{ width: `${p.completion}%` }} />
              </div>
              {selected === p.id && p.status === "Delayed" && (
                <div className="mt-3 pt-3 border-t border-slate-800 flex gap-3">
                  <button onClick={e => { e.stopPropagation(); alert(`Urgent directive issued for: ${p.name}. PWD notified.`); }} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-xl">🚨 Issue Urgent Directive</button>
                  <button onClick={e => { e.stopPropagation(); alert(`Inspection team dispatched for: ${p.name}.`); }} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-bold rounded-xl">🔍 Dispatch Inspection Team</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl p-6 space-y-5" style={{ background: "#090d16", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 20px 50px rgba(0,0,0,0.95)" }}>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">🏗️ Add Infrastructure Project</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs">✕ Close</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              {[{ label: "Project Name", key: "name", type: "text" }, { label: "District", key: "district", type: "text" }, { label: "Budget", key: "budget", type: "text" }, { label: "Completion %", key: "completion", type: "number" }, { label: "Deadline", key: "deadline", type: "date" }].map(f => (
                <div key={f.key}>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">{f.label}</label>
                  <input type={f.type} required value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500" />
                </div>
              ))}
              <div>
                <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Project Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                  {["New Construction", "Renovation", "Technology", "Safety", "Sanitation", "Green Energy"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs mt-2">Add Project</button>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
