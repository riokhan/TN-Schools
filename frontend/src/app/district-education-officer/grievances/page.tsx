"use client";
import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface Grievance { id: number; petitioner: string; school: string; block: string; category: string; filed: string; status: string; }

const initialGrievances: Grievance[] = [
  { id: 1, petitioner: "Mr. Suresh P. (Parent)", school: "GHS Coimbatore", block: "CBE South", category: "Scholarship Delay", filed: "2024-10-02", status: "Resolved" },
  { id: 2, petitioner: "Mrs. Lakshmi K. (Teacher)", school: "GHS Annur", block: "Annur", category: "Transfer Issue", filed: "2024-10-15", status: "Under Review" },
  { id: 3, petitioner: "Mr. Rajan M. (Parent)", school: "GHS Mettupalayam", block: "Mettupalayam", category: "Infrastructure Complaint", filed: "2024-10-22", status: "Pending" },
  { id: 4, petitioner: "Mrs. Kavitha S. (Student)", school: "GHSS Ganapathy", block: "CBE South", category: "Exam Results Issue", filed: "2024-11-01", status: "Resolved" },
  { id: 5, petitioner: "Mr. Murugan T. (Parent)", school: "GHS Pollachi", block: "Pollachi", category: "Fee Irregularity", filed: "2024-11-05", status: "Pending" },
];

export default function DEOGrievancesPage() {
  const [grievances, setGrievances] = useState<Grievance[]>(initialGrievances);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({ petitioner: "", school: "", block: "", category: "Scholarship Delay", filed: "", status: "Pending" });

  const handleResolve = (id: number) => {
    setGrievances(p => p.map(g => g.id === id ? { ...g, status: "Resolved" } : g));
    setToast("✅ Grievance marked as resolved.");
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGrievances(p => [...p, { ...form, id: p.length + 1 }]);
    setIsModalOpen(false);
    setToast(`⚖️ Grievance from '${form.petitioner}' logged for review.`);
    setTimeout(() => setToast(null), 4000);
  };

  const simulateExcel = () => {
    setIsUploading(true);
    setTimeout(() => {
      setGrievances(p => [...p,
        { id: p.length + 1, petitioner: "Mr. Arjun V. (Parent)", school: "GHS Singanallur", block: "CBE North", category: "Mid-Day Meal Complaint", filed: "2024-11-08", status: "Pending" },
      ]);
      setIsUploading(false);
      setIsModalOpen(false);
      setToast("📊 Grievance register imported! 1 new record added.");
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  return (
    <PortalLayout title="Grievances" subtitle="DEO Officer · Coimbatore District" avatarLetter="D" avatarColor="#ec4899" themeClass="theme-deo" accentColor="#ec4899">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Grievances", value: grievances.length.toString(), icon: "⚖️", color: "text-pink-400" },
          { label: "Resolved", value: grievances.filter(g => g.status === "Resolved").length.toString(), icon: "✅", color: "text-emerald-400" },
          { label: "Pending", value: grievances.filter(g => g.status === "Pending").length.toString(), icon: "⏳", color: "text-red-400" },
          { label: "Under Review", value: grievances.filter(g => g.status === "Under Review").length.toString(), icon: "🔍", color: "text-amber-400" },
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
          <h2 className="text-base font-semibold text-white">⚖️ District Grievance Register</h2>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl">+ File Grievance</button>
        </div>
        <table className="data-table">
          <thead><tr><th>Petitioner</th><th>School</th><th>Block</th><th>Category</th><th>Filed</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {grievances.map(g => (
              <tr key={g.id}>
                <td className="font-bold text-white text-xs">{g.petitioner}</td>
                <td className="text-xs text-slate-400">{g.school}</td>
                <td className="text-xs">{g.block}</td>
                <td className="text-xs text-pink-400">{g.category}</td>
                <td className="text-xs text-slate-500">{g.filed}</td>
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
              <h3 className="text-sm font-bold text-white">⚖️ File New Grievance</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs">✕ Close</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="text-xs font-bold text-pink-400 uppercase tracking-wider">Manual Entry</div>
                {[{ label: "Petitioner Name", key: "petitioner", type: "text" }, { label: "School", key: "school", type: "text" }, { label: "Block", key: "block", type: "text" }, { label: "Date Filed", key: "filed", type: "date" }].map(f => (
                  <div key={f.key}>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">{f.label}</label>
                    <input type={f.type} required value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500">
                    {["Scholarship Delay", "Transfer Issue", "Infrastructure Complaint", "Exam Results Issue", "Fee Irregularity", "Mid-Day Meal Complaint", "Teacher Misconduct", "Other"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-xs">File Grievance</button>
              </form>
              <div className="border-l border-slate-800 pl-6 flex flex-col justify-center">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">Excel Import</div>
                <div onClick={simulateExcel} className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-900/40 rounded-2xl p-6 text-center cursor-pointer min-h-[160px] flex flex-col items-center justify-center space-y-3">
                  {isUploading ? (<><div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" /><span className="text-[10px] text-slate-400">Parsing...</span></>) : (<><span className="text-3xl">⚖️</span><span className="text-xs font-bold text-white">Import Grievance Register</span><span className="text-[9px] text-slate-500">grievances_district.xlsx</span></>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
