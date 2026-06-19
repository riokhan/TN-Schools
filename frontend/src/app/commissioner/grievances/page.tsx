"use client";
import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface Grievance { id: number; petitioner: string; district: string; category: string; filed: string; status: string; escalation: string; }

const initialGrievances: Grievance[] = [
  { id: 1, petitioner: "Parent Association, Tirunelveli", district: "Tirunelveli", category: "Infrastructure Neglect", filed: "2024-10-01", status: "Resolved", escalation: "Low" },
  { id: 2, petitioner: "Teacher Union, Salem", district: "Salem", category: "Transfer Irregularities", filed: "2024-10-12", status: "Under Review", escalation: "High" },
  { id: 3, petitioner: "DEO Office, Dharmapuri", district: "Dharmapuri", category: "Scholarship Disbursement Delay", filed: "2024-10-25", status: "Pending", escalation: "Medium" },
  { id: 4, petitioner: "Headmaster Association, Madurai", district: "Madurai", category: "Resource Shortage", filed: "2024-11-02", status: "Under Review", escalation: "High" },
  { id: 5, petitioner: "Student Rights Forum", district: "Coimbatore", category: "Exam Scheduling Conflict", filed: "2024-11-05", status: "Resolved", escalation: "Low" },
];

export default function CommissionerGrievancesPage() {
  const [grievances, setGrievances] = useState<Grievance[]>(initialGrievances);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({ petitioner: "", district: "", category: "Infrastructure Neglect", filed: "", status: "Pending", escalation: "Medium" });

  const handleResolve = (id: number) => {
    setGrievances(p => p.map(g => g.id === id ? { ...g, status: "Resolved" } : g));
    setToast("✅ Grievance resolved at Commissioner level.");
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGrievances(p => [...p, { ...form, id: p.length + 1 }]);
    setIsModalOpen(false);
    setToast(`⚖️ State-level grievance from '${form.petitioner}' registered.`);
    setTimeout(() => setToast(null), 4000);
  };

  const simulateExcel = () => {
    setIsUploading(true);
    setTimeout(() => {
      setGrievances(p => [...p,
        { id: p.length + 1, petitioner: "NGO Watch India, Chennai", district: "Chennai", category: "Mid-Day Meal Quality", filed: "2024-11-10", status: "Pending", escalation: "High" },
      ]);
      setIsUploading(false);
      setIsModalOpen(false);
      setToast("📊 Grievance register imported! 1 new record added.");
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  return (
    <PortalLayout title="Grievances Redressal" subtitle="Commissioner · State Operations" avatarLetter="C" avatarColor="#06b6d4" themeClass="theme-commissioner" accentColor="#06b6d4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Grievances", value: grievances.length.toString(), icon: "⚖️", color: "text-cyan-400" },
          { label: "Resolved", value: grievances.filter(g => g.status === "Resolved").length.toString(), icon: "✅", color: "text-emerald-400" },
          { label: "High Escalation", value: grievances.filter(g => g.escalation === "High").length.toString(), icon: "🔴", color: "text-red-400" },
          { label: "Pending Action", value: grievances.filter(g => g.status === "Pending").length.toString(), icon: "⏳", color: "text-amber-400" },
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
          <h2 className="text-base font-semibold text-white">⚖️ State Grievances Redressal Board</h2>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl">+ Log Grievance</button>
        </div>
        <table className="data-table">
          <thead><tr><th>Petitioner</th><th>District</th><th>Category</th><th>Filed</th><th>Escalation</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {grievances.map(g => (
              <tr key={g.id}>
                <td className="font-bold text-white text-xs">{g.petitioner}</td>
                <td className="text-xs text-slate-400">{g.district}</td>
                <td className="text-xs text-cyan-400">{g.category}</td>
                <td className="text-xs text-slate-500">{g.filed}</td>
                <td><span className={`badge ${g.escalation === "High" ? "badge-red" : g.escalation === "Medium" ? "badge-yellow" : "badge-green"}`}>{g.escalation}</span></td>
                <td><span className={`badge ${g.status === "Resolved" ? "badge-green" : g.status === "Pending" ? "badge-red" : "badge-yellow"}`}>{g.status}</span></td>
                <td>
                  {g.status !== "Resolved" && (
                    <button onClick={() => handleResolve(g.id)} className="text-xs text-emerald-400 hover:text-emerald-300 font-bold">Resolve</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl p-6 space-y-6" style={{ background: "#090d16", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 20px 50px rgba(0,0,0,0.95)" }}>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">⚖️ Register State Grievance</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs">✕ Close</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Manual Entry</div>
                {[{ label: "Petitioner/Organization", key: "petitioner", type: "text" }, { label: "District", key: "district", type: "text" }, { label: "Date Filed", key: "filed", type: "date" }].map(f => (
                  <div key={f.key}>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">{f.label}</label>
                    <input type={f.type} required value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                    {["Infrastructure Neglect", "Transfer Irregularities", "Scholarship Disbursement Delay", "Resource Shortage", "Exam Scheduling Conflict", "Mid-Day Meal Quality", "Teacher Misconduct", "Other"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Escalation Level</label>
                  <select value={form.escalation} onChange={e => setForm(p => ({ ...p, escalation: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                    {["High", "Medium", "Low"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs">Register Grievance</button>
              </form>
              <div className="border-l border-slate-800 pl-6 flex flex-col justify-center">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">Excel Import</div>
                <div onClick={simulateExcel} className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-900/40 rounded-2xl p-6 text-center cursor-pointer min-h-[160px] flex flex-col items-center justify-center space-y-3">
                  {isUploading ? (<><div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" /><span className="text-[10px] text-slate-400">Parsing...</span></>) : (<><span className="text-3xl">⚖️</span><span className="text-xs font-bold text-white">Import Grievance Register</span><span className="text-[9px] text-slate-500">state_grievances.xlsx</span></>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
