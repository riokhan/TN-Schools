"use client";
import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface Announcement { id: number; title: string; body: string; target: string; date: string; priority: string; }

const initialAnnouncements: Announcement[] = [
  { id: 1, title: "SSLC Board Exam Date Sheet Released", body: "The SSLC Board Examinations for 2024-25 will commence from March 10, 2025. All district offices must ensure preparation is complete by February 15.", target: "All Districts", date: "2024-11-01", priority: "High" },
  { id: 2, title: "Mid-Day Meal Menu Revision", body: "New nutritional menu guidelines to take effect from December 1, 2024. All schools must implement revised menu with egg provision 4 days a week.", target: "All Schools", date: "2024-10-20", priority: "High" },
  { id: 3, title: "Annual Teacher Training Program", body: "The state-level teacher training program will be held from November 15-30 at designated regional centers. Attendance mandatory.", target: "All Teachers", date: "2024-10-15", priority: "Medium" },
  { id: 4, title: "Digital Classroom Rollout Phase 3", body: "Phase 3 of the Digital Classroom Initiative will cover 8,000 additional schools. Equipment delivery begins December 2024.", target: "Selected Districts", date: "2024-10-10", priority: "Medium" },
];

export default function CommissionerAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", body: "", target: "All Districts", date: "", priority: "Medium" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAnnouncements(p => [{ ...form, id: p.length + 1 }, ...p]);
    setIsModalOpen(false);
    setToast(`📢 Announcement '${form.title}' broadcast to ${form.target}.`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <PortalLayout title="Announcements" subtitle="Commissioner · State Operations" avatarLetter="C" avatarColor="#06b6d4" themeClass="theme-commissioner" accentColor="#06b6d4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Announcements", value: announcements.length.toString(), icon: "📢", color: "text-cyan-400" },
          { label: "High Priority", value: announcements.filter(a => a.priority === "High").length.toString(), icon: "🔴", color: "text-red-400" },
          { label: "Target: All Districts", value: announcements.filter(a => a.target === "All Districts").length.toString(), icon: "🗺️", color: "text-violet-400" },
          { label: "This Month", value: announcements.filter(a => a.date.startsWith("2024-11")).length.toString(), icon: "📅", color: "text-emerald-400" },
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
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-base font-semibold text-white">📢 Commissioner's Announcements</h2>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl">+ Issue Announcement</button>
        </div>
        <div className="space-y-4">
          {announcements.map(a => (
            <div key={a.id} className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition-all">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className={`badge text-[9px] ${a.priority === "High" ? "badge-red" : "badge-yellow"}`}>{a.priority}</span>
                  <span className="badge badge-blue text-[9px]">{a.target}</span>
                  <span className="text-[10px] text-slate-500">{a.date}</span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{a.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{a.body}</p>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl p-6 space-y-5" style={{ background: "#090d16", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 20px 50px rgba(0,0,0,0.95)" }}>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">📢 Issue New Announcement</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs">✕ Close</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Announcement Title</label>
                <input type="text" required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Body / Details</label>
                <textarea rows={3} required value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Target</label>
                  <select value={form.target} onChange={e => setForm(p => ({ ...p, target: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                    {["All Districts", "All Schools", "All Teachers", "Selected Districts", "DEO Offices"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Priority</label>
                  <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                    {["High", "Medium", "Low"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Date</label>
                  <input type="date" required value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500" />
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs mt-2">Broadcast Announcement</button>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
