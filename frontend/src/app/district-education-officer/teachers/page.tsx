"use client";
import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface Teacher { id: number; name: string; subject: string; school: string; block: string; experience: number; status: string; }

const initialTeachers: Teacher[] = [
  { id: 1, name: "Mrs. Sumathi Devi", subject: "Mathematics", school: "GHS Coimbatore", block: "CBE South", experience: 12, status: "Active" },
  { id: 2, name: "Mr. Rajan K.", subject: "Science", school: "GHS Singanallur", block: "CBE North", experience: 8, status: "Active" },
  { id: 3, name: "Mrs. Kavitha P.", subject: "Tamil", school: "GHS Pollachi", block: "Pollachi", experience: 15, status: "On Leave" },
  { id: 4, name: "Mr. Venkat S.", subject: "English", school: "GHS Annur", block: "Annur", experience: 5, status: "Active" },
  { id: 5, name: "Mrs. Meena R.", subject: "History", school: "GHS Mettupalayam", block: "Mettupalayam", experience: 10, status: "Transfer Pending" },
];

export default function TeacherAnalyticsPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({ name: "", subject: "", school: "", block: "", experience: "5", status: "Active" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTeachers(p => [...p, { ...form, id: p.length + 1, experience: Number(form.experience) }]);
    setIsModalOpen(false);
    setToast(`👩‍🏫 Teacher '${form.name}' added to district roster.`);
    setTimeout(() => setToast(null), 4000);
  };

  const simulateExcel = () => {
    setIsUploading(true);
    setTimeout(() => {
      setTeachers(p => [...p,
        { id: p.length + 1, name: "Mr. Arumugam T.", subject: "Physics", school: "GHSS Ganapathy", block: "CBE South", experience: 7, status: "Active" },
        { id: p.length + 2, name: "Mrs. Selvi M.", subject: "Chemistry", school: "GHS RS Puram", block: "CBE South", experience: 9, status: "Active" },
      ]);
      setIsUploading(false);
      setIsModalOpen(false);
      setToast("📊 Teacher deployment spreadsheet parsed! 2 teachers added.");
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  const vacancies = [
    { block: "Annur", subject: "Mathematics", schools: 3 },
    { block: "Mettupalayam", subject: "Science", schools: 2 },
    { block: "Pollachi", subject: "English", schools: 2 },
  ];

  return (
    <PortalLayout title="Teacher Analytics" subtitle="DEO Officer · Coimbatore District" avatarLetter="D" avatarColor="#ec4899" themeClass="theme-deo" accentColor="#ec4899">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Teachers", value: teachers.length.toString(), icon: "👩‍🏫", color: "text-pink-400" },
          { label: "Active", value: teachers.filter(t => t.status === "Active").length.toString(), icon: "✅", color: "text-emerald-400" },
          { label: "On Leave", value: teachers.filter(t => t.status === "On Leave").length.toString(), icon: "🟡", color: "text-amber-400" },
          { label: "Transfer Pending", value: teachers.filter(t => t.status === "Transfer Pending").length.toString(), icon: "🔄", color: "text-blue-400" },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="text-2xl mb-2">{k.icon}</div>
            <div className={`text-2xl font-extrabold ${k.color} mb-1`}>{k.value}</div>
            <div className="text-xs text-slate-500 font-semibold">{k.label}</div>
          </div>
        ))}
      </div>
      {toast && <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl">{toast}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold text-white">👩‍🏫 District Teacher Roster</h2>
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl">+ Add Teacher</button>
          </div>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Subject</th><th>School</th><th>Block</th><th>Exp (Yrs)</th><th>Status</th></tr></thead>
            <tbody>
              {teachers.map(t => (
                <tr key={t.id}>
                  <td className="font-bold text-white text-xs">{t.name}</td>
                  <td className="text-xs text-pink-400">{t.subject}</td>
                  <td className="text-xs text-slate-400">{t.school}</td>
                  <td className="text-xs">{t.block}</td>
                  <td>{t.experience} yrs</td>
                  <td><span className={`badge ${t.status === "Active" ? "badge-green" : t.status === "On Leave" ? "badge-yellow" : "badge-blue"}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-sm font-semibold text-white mb-4">⚠️ Teacher Vacancies</h2>
          <div className="space-y-3">
            {vacancies.map(v => (
              <div key={`${v.block}-${v.subject}`} className="flex justify-between items-center py-3 border-b border-slate-800">
                <div>
                  <div className="text-xs text-white font-bold">{v.block}</div>
                  <div className="text-[10px] text-slate-500">{v.subject}</div>
                </div>
                <span className="badge badge-red">{v.schools} schools</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <p className="text-[10px] text-amber-300">🤖 AI suggests: Prioritize Annur block for Mathematics deployment. 3 schools flagged as understaffed.</p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl p-6 space-y-6" style={{ background: "#090d16", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 20px 50px rgba(0,0,0,0.95)" }}>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">👩‍🏫 Add Teacher to District</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs">✕ Close</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="text-xs font-bold text-pink-400 uppercase tracking-wider">Manual Entry</div>
                {[{ label: "Full Name", key: "name", type: "text" }, { label: "Subject", key: "subject", type: "text" }, { label: "School", key: "school", type: "text" }, { label: "Block", key: "block", type: "text" }, { label: "Experience (years)", key: "experience", type: "number" }].map(f => (
                  <div key={f.key}>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">{f.label}</label>
                    <input type={f.type} required value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500" />
                  </div>
                ))}
                <button type="submit" className="w-full py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-xs">Add Teacher</button>
              </form>
              <div className="border-l border-slate-800 pl-6 flex flex-col justify-center">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">Excel Import</div>
                <div onClick={simulateExcel} className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-900/40 rounded-2xl p-6 text-center cursor-pointer min-h-[160px] flex flex-col items-center justify-center space-y-3">
                  {isUploading ? (<><div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" /><span className="text-[10px] text-slate-400">Parsing...</span></>) : (<><span className="text-3xl">👩‍🏫</span><span className="text-xs font-bold text-white">Import Teacher Data</span><span className="text-[9px] text-slate-500">teacher_district_roster.xlsx</span></>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
