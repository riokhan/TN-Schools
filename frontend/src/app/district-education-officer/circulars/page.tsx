"use client";
import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface Circular { id: number; title: string; issuedBy: string; date: string; priority: string; category: string; acknowledged: number; total: number; }

const initialCirculars: Circular[] = [
  { id: 1, title: "SSLC Board Exam 2025 Schedule", issuedBy: "State Board", date: "2024-11-01", priority: "High", category: "Exam", acknowledged: 89, total: 93 },
  { id: 2, title: "Mid-Day Meal Scheme Q4 Guidelines", issuedBy: "TNMGR Dept.", date: "2024-10-20", priority: "Medium", category: "Nutrition", acknowledged: 93, total: 93 },
  { id: 3, title: "Annual Sports Day Planning", issuedBy: "DEO Office", date: "2024-10-15", priority: "Low", category: "Events", acknowledged: 75, total: 93 },
  { id: 4, title: "Teacher Increment Processing", issuedBy: "Finance Dept.", date: "2024-10-05", priority: "High", category: "Finance", acknowledged: 91, total: 93 },
  { id: 5, title: "RTE Compliance Audit 2024", issuedBy: "State Education Dept.", date: "2024-09-28", priority: "High", category: "Compliance", acknowledged: 93, total: 93 },
];

export default function DEOCircularsPage() {
  const [circulars, setCirculars] = useState<Circular[]>(initialCirculars);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({ title: "", issuedBy: "", date: "", priority: "Medium", category: "General" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCirculars(p => [...p, { ...form, id: p.length + 1, acknowledged: 0, total: 93 }]);
    setIsModalOpen(false);
    setToast(`📢 Circular '${form.title}' issued to all 93 schools.`);
    setTimeout(() => setToast(null), 4000);
  };

  const simulateExcel = () => {
    setIsUploading(true);
    setTimeout(() => {
      setCirculars(p => [...p,
        { id: p.length + 1, title: "New Health Policy 2025", issuedBy: "Health Dept.", date: "2024-11-10", priority: "Medium", category: "Health", acknowledged: 0, total: 93 },
      ]);
      setIsUploading(false);
      setIsModalOpen(false);
      setToast("📊 Circular list imported! 1 new circular added.");
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  return (
    <PortalLayout title="Circulars" subtitle="DEO Officer · Coimbatore District" avatarLetter="D" avatarColor="#ec4899" themeClass="theme-deo" accentColor="#ec4899">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Circulars", value: circulars.length.toString(), icon: "📢", color: "text-pink-400" },
          { label: "High Priority", value: circulars.filter(c => c.priority === "High").length.toString(), icon: "🔴", color: "text-red-400" },
          { label: "Full Acknowledgment", value: circulars.filter(c => c.acknowledged === c.total).length.toString(), icon: "✅", color: "text-emerald-400" },
          { label: "Pending Ack.", value: circulars.filter(c => c.acknowledged < c.total).length.toString(), icon: "⏳", color: "text-amber-400" },
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
          <h2 className="text-base font-semibold text-white">📢 District Circulars Board</h2>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl">+ Issue Circular</button>
        </div>
        <div className="space-y-3">
          {circulars.map(c => (
            <div key={c.id} className="flex items-start justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-pink-500/30 transition-all">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`badge text-[9px] ${c.priority === "High" ? "badge-red" : c.priority === "Medium" ? "badge-yellow" : "badge-green"}`}>{c.priority}</span>
                  <span className="badge badge-blue text-[9px]">{c.category}</span>
                  <span className="text-[10px] text-slate-500">{c.date}</span>
                </div>
                <div className="text-xs font-bold text-white mb-1">{c.title}</div>
                <div className="text-[10px] text-slate-500">Issued by: {c.issuedBy}</div>
              </div>
              <div className="text-right ml-4">
                <div className="text-[10px] text-slate-400 mb-1">Acknowledged</div>
                <div className={`text-sm font-bold ${c.acknowledged === c.total ? "text-emerald-400" : "text-amber-400"}`}>{c.acknowledged}/{c.total}</div>
                <div className="h-1 bg-slate-800 rounded-full mt-1 w-16">
                  <div className="h-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${(c.acknowledged / c.total) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl p-6 space-y-6" style={{ background: "#090d16", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 20px 50px rgba(0,0,0,0.95)" }}>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">📢 Issue New Circular</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs">✕ Close</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="text-xs font-bold text-pink-400 uppercase tracking-wider">Manual Entry</div>
                {[{ label: "Circular Title", key: "title", type: "text" }, { label: "Issued By", key: "issuedBy", type: "text" }, { label: "Date", key: "date", type: "date" }].map(f => (
                  <div key={f.key}>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">{f.label}</label>
                    <input type={f.type} required value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Priority</label>
                  <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                    {["High", "Medium", "Low"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                    {["General", "Exam", "Finance", "Health", "Compliance", "Events", "Nutrition"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-xs">Issue Circular</button>
              </form>
              <div className="border-l border-slate-800 pl-6 flex flex-col justify-center">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">Excel Import</div>
                <div onClick={simulateExcel} className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-900/40 rounded-2xl p-6 text-center cursor-pointer min-h-[160px] flex flex-col items-center justify-center space-y-3">
                  {isUploading ? (<><div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" /><span className="text-[10px] text-slate-400">Parsing...</span></>) : (<><span className="text-3xl">📢</span><span className="text-xs font-bold text-white">Import Circulars List</span><span className="text-[9px] text-slate-500">district_circulars.xlsx</span></>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
