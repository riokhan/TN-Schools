"use client";
import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface DropoutRecord { id: number; studentName: string; school: string; block: string; class: string; reason: string; date: string; status: string; }

const initialRecords: DropoutRecord[] = [
  { id: 1, studentName: "Muthu K.", school: "GHS Annur", block: "Annur", class: "8th", reason: "Economic", date: "2024-08-15", status: "Intervention Pending" },
  { id: 2, studentName: "Selvi R.", school: "GHS Mettupalayam", block: "Mettupalayam", class: "9th", reason: "Migration", date: "2024-09-02", status: "Dropped" },
  { id: 3, studentName: "Arumugam S.", school: "GHS Pollachi", block: "Pollachi", class: "10th", reason: "Marriage", date: "2024-09-18", status: "Counselled" },
  { id: 4, studentName: "Kavitha P.", school: "GHS Annur", block: "Annur", class: "7th", reason: "Economic", date: "2024-10-05", status: "Re-enrolled" },
  { id: 5, studentName: "Dinesh M.", school: "GHS Mettupalayam", block: "Mettupalayam", class: "8th", reason: "Child Labor", date: "2024-10-20", status: "Intervention Pending" },
];

const blockRisk = [
  { name: "Annur", count: 58, risk: "HIGH" },
  { name: "Mettupalayam", count: 42, risk: "HIGH" },
  { name: "Pollachi", count: 31, risk: "MEDIUM" },
  { name: "Coimbatore North", count: 23, risk: "MEDIUM" },
  { name: "Coimbatore South", count: 17, risk: "LOW" },
];

export default function DropoutHeatmapPage() {
  const [records, setRecords] = useState<DropoutRecord[]>(initialRecords);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({ studentName: "", school: "", block: "", class: "8th", reason: "Economic", date: "", status: "Intervention Pending" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecords(p => [...p, { ...form, id: p.length + 1 }]);
    setIsModalOpen(false);
    setToast(`⚠️ Dropout record for '${form.studentName}' logged. Intervention team notified.`);
    setTimeout(() => setToast(null), 4000);
  };

  const simulateExcel = () => {
    setIsUploading(true);
    setTimeout(() => {
      setRecords(p => [...p,
        { id: p.length + 1, studentName: "Rajan A.", school: "GHS Annur", block: "Annur", class: "9th", reason: "Economic", date: "2024-11-10", status: "Intervention Pending" },
        { id: p.length + 2, studentName: "Meena S.", school: "GHS Pollachi", block: "Pollachi", class: "7th", reason: "Migration", date: "2024-11-12", status: "Dropped" },
      ]);
      setIsUploading(false);
      setIsModalOpen(false);
      setToast("📋 Dropout register spreadsheet imported! 2 new cases logged.");
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  return (
    <PortalLayout title="Dropout Heatmap" subtitle="DEO Officer · Coimbatore District" avatarLetter="D" avatarColor="#ec4899" themeClass="theme-deo" accentColor="#ec4899">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Dropouts", value: records.length.toString(), icon: "📉", color: "text-red-400" },
          { label: "Pending Intervention", value: records.filter(r => r.status === "Intervention Pending").length.toString(), icon: "⚠️", color: "text-amber-400" },
          { label: "Re-enrolled", value: records.filter(r => r.status === "Re-enrolled").length.toString(), icon: "✅", color: "text-emerald-400" },
          { label: "High Risk Blocks", value: "2", icon: "🔴", color: "text-red-400" },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="text-2xl mb-2">{k.icon}</div>
            <div className={`text-2xl font-extrabold ${k.color} mb-1`}>{k.value}</div>
            <div className="text-xs text-slate-500 font-semibold">{k.label}</div>
          </div>
        ))}
      </div>
      {toast && <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl">{toast}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-sm font-semibold text-white mb-4">🔴 Dropout Risk Heatmap</h2>
          <div className="space-y-3">
            {blockRisk.map(b => (
              <div key={b.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{b.name}</span>
                  <span className={`font-bold ${b.risk === "HIGH" ? "text-red-400" : b.risk === "MEDIUM" ? "text-amber-400" : "text-emerald-400"}`}>{b.count} students</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${Math.min((b.count / 60) * 100, 100)}%`, background: b.risk === "HIGH" ? "linear-gradient(90deg,#ef4444,#dc2626)" : b.risk === "MEDIUM" ? "linear-gradient(90deg,#f59e0b,#d97706)" : "linear-gradient(90deg,#10b981,#059669)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold text-white">📋 Dropout Register</h2>
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl">+ Log Dropout</button>
          </div>
          <table className="data-table">
            <thead><tr><th>Student</th><th>School</th><th>Block</th><th>Class</th><th>Reason</th><th>Status</th></tr></thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id}>
                  <td className="font-bold text-white text-xs">{r.studentName}</td>
                  <td className="text-slate-400 text-xs">{r.school}</td>
                  <td className="text-xs">{r.block}</td>
                  <td className="text-xs">{r.class}</td>
                  <td className="text-xs text-amber-400">{r.reason}</td>
                  <td><span className={`badge ${r.status === "Re-enrolled" ? "badge-green" : r.status === "Dropped" ? "badge-red" : "badge-yellow"}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl p-6 space-y-6" style={{ background: "#090d16", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 20px 50px rgba(0,0,0,0.95)" }}>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">📋 Log Dropout Record</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs">✕ Close</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="text-xs font-bold text-pink-400 uppercase tracking-wider">Manual Entry</div>
                {[{ label: "Student Name", key: "studentName", type: "text" }, { label: "School", key: "school", type: "text" }, { label: "Block", key: "block", type: "text" }, { label: "Date", key: "date", type: "date" }].map(f => (
                  <div key={f.key}>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">{f.label}</label>
                    <input type={f.type} required value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Reason</label>
                  <select value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500">
                    {["Economic", "Migration", "Marriage", "Child Labor", "Health", "Other"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-xs">Log Record</button>
              </form>
              <div className="border-l border-slate-800 pl-6 flex flex-col justify-center">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">Excel Import</div>
                <div onClick={simulateExcel} className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-900/40 rounded-2xl p-6 text-center cursor-pointer min-h-[160px] flex flex-col items-center justify-center space-y-3">
                  {isUploading ? (<><div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" /><span className="text-[10px] text-slate-400">Parsing...</span></>) : (<><span className="text-3xl">📋</span><span className="text-xs font-bold text-white">Import Dropout Register</span><span className="text-[9px] text-slate-500">dropout_register.xlsx</span></>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
