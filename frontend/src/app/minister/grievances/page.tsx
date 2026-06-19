"use client";
import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface Grievance { id: number; petitioner: string; district: string; category: string; filed: string; status: string; escalation: string; ministerAction: string; }

const initialGrievances: Grievance[] = [
  { id: 1, petitioner: "Parent Forum, Tirunelveli", district: "Tirunelveli", category: "School Closure Threat", filed: "2024-10-01", status: "Resolved", escalation: "High", ministerAction: "Direct intervention ordered" },
  { id: 2, petitioner: "Teacher Federation, TN State", district: "State-wide", category: "Pay Revision Pending (7th CPC)", filed: "2024-10-10", status: "Under Review", escalation: "Critical", ministerAction: "Finance Dept consulted" },
  { id: 3, petitioner: "Civil Society NGO", district: "Dharmapuri", category: "Child Labour in Schools", filed: "2024-10-18", status: "Pending", escalation: "Critical", ministerAction: "None yet" },
  { id: 4, petitioner: "Student Parliament, Chennai", district: "Chennai", category: "Digital Access Gap", filed: "2024-10-25", status: "Under Review", escalation: "Medium", ministerAction: "IT Dept alerted" },
  { id: 5, petitioner: "Commissioner of Education", district: "Salem", category: "Infrastructure Emergency (Roof Collapse Risk)", filed: "2024-11-01", status: "Resolved", escalation: "High", ministerAction: "PWD immediate repair ordered" },
];

export default function MinisterGrievancesPage() {
  const [grievances, setGrievances] = useState<Grievance[]>(initialGrievances);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({ petitioner: "", district: "", category: "Policy Implementation", filed: "", status: "Pending", escalation: "High", ministerAction: "Under assessment" });

  const handleResolve = (id: number) => {
    setGrievances(p => p.map(g => g.id === id ? { ...g, status: "Resolved", ministerAction: "Minister's office resolved" } : g));
    setToast("✅ Grievance resolved at Ministerial level. All stakeholders notified.");
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGrievances(p => [...p, { ...form, id: p.length + 1 }]);
    setIsModalOpen(false);
    setToast(`⚖️ Public grievance from '${form.petitioner}' registered at Minister level.`);
    setTimeout(() => setToast(null), 4000);
  };

  const simulateExcel = () => {
    setIsUploading(true);
    setTimeout(() => {
      setGrievances(p => [...p,
        { id: p.length + 1, petitioner: "RTI Activists, Coimbatore", district: "Coimbatore", category: "Scholarship Transparency", filed: "2024-11-08", status: "Pending", escalation: "Medium", ministerAction: "None yet" },
      ]);
      setIsUploading(false);
      setIsModalOpen(false);
      setToast("📊 Grievances register imported! 1 new case added.");
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  return (
    <PortalLayout title="Public Grievances" subtitle="Minister · Executive Command Center" avatarLetter="M" avatarColor="#ef4444" themeClass="theme-minister" accentColor="#ef4444">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Grievances", value: grievances.length.toString(), icon: "⚖️", color: "text-red-400" },
          { label: "Critical Escalation", value: grievances.filter(g => g.escalation === "Critical").length.toString(), icon: "🔴", color: "text-red-400" },
          { label: "Resolved", value: grievances.filter(g => g.status === "Resolved").length.toString(), icon: "✅", color: "text-emerald-400" },
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
          <h2 className="text-base font-semibold text-white">⚖️ Minister's Public Grievances Register</h2>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl">+ Log Grievance</button>
        </div>
        <div className="space-y-3">
          {grievances.map(g => (
            <div key={g.id} className={`p-4 rounded-xl border transition-all ${g.escalation === "Critical" && g.status !== "Resolved" ? "border-red-500/30 bg-red-500/5" : "border-slate-800 bg-slate-900/60"}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge text-[9px] ${g.escalation === "Critical" ? "badge-red" : g.escalation === "High" ? "badge-yellow" : "badge-blue"}`}>{g.escalation}</span>
                    <span className={`badge text-[9px] ${g.status === "Resolved" ? "badge-green" : g.status === "Pending" ? "badge-red" : "badge-yellow"}`}>{g.status}</span>
                    <span className="text-[10px] text-slate-500">{g.filed}</span>
                  </div>
                  <div className="text-xs font-bold text-white">{g.petitioner}</div>
                  <div className="text-[10px] text-slate-400">{g.category} · {g.district}</div>
                  <div className="text-[10px] text-amber-400 mt-1">🏛️ Ministerial Action: {g.ministerAction}</div>
                </div>
                {g.status !== "Resolved" && (
                  <button onClick={() => handleResolve(g.id)} className="ml-4 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-xl transition-all">Resolve →</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl p-6 space-y-6" style={{ background: "#090d16", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 20px 50px rgba(0,0,0,0.95)" }}>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">⚖️ Register Public Grievance</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs">✕ Close</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="text-xs font-bold text-red-400 uppercase tracking-wider">Manual Entry</div>
                {[{ label: "Petitioner / Organization", key: "petitioner", type: "text" }, { label: "District", key: "district", type: "text" }, { label: "Date Filed", key: "filed", type: "date" }, { label: "Initial Ministerial Action", key: "ministerAction", type: "text" }].map(f => (
                  <div key={f.key}>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">{f.label}</label>
                    <input type={f.type} required value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Escalation Level</label>
                  <select value={form.escalation} onChange={e => setForm(p => ({ ...p, escalation: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                    {["Critical", "High", "Medium", "Low"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs">Register Grievance</button>
              </form>
              <div className="border-l border-slate-800 pl-6 flex flex-col justify-center">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">Bulk Import</div>
                <div onClick={simulateExcel} className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-900/40 rounded-2xl p-6 text-center cursor-pointer min-h-[160px] flex flex-col items-center justify-center space-y-3">
                  {isUploading ? (<><div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" /><span className="text-[10px] text-slate-400">Parsing...</span></>) : (<><span className="text-3xl">⚖️</span><span className="text-xs font-bold text-white">Import Grievances</span><span className="text-[9px] text-slate-500">public_grievances.xlsx</span></>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
