"use client";
import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface PressItem { id: number; type: "Press Release" | "Media Coverage" | "Interview" | "Event"; title: string; outlet: string; date: string; sentiment: string; reach: string; }

const initialPress: PressItem[] = [
  { id: 1, type: "Press Release", title: "TN Records Highest 10th Pass Rate in 5 Years", outlet: "Education Ministry", date: "2024-11-05", sentiment: "Positive", reach: "1.2 Cr readers" },
  { id: 2, type: "Media Coverage", title: "Digital Classroom Initiative Reaches 36,000 Schools", outlet: "The Hindu", date: "2024-10-28", sentiment: "Positive", reach: "45L readers" },
  { id: 3, type: "Interview", title: "Minister Speaks on Zero Dropout Mission 2025", outlet: "Sun TV", date: "2024-10-20", sentiment: "Positive", reach: "82L viewers" },
  { id: 4, type: "Media Coverage", title: "Critics Question Pace of Digital Rollout", outlet: "Tamil Deccan Herald", date: "2024-10-15", sentiment: "Negative", reach: "12L readers" },
  { id: 5, type: "Event", title: "Annual Education Excellence Awards 2024", outlet: "State Function", date: "2024-10-10", sentiment: "Positive", reach: "State-wide" },
  { id: 6, type: "Press Release", title: "₹8,500 Cr Free Education Scheme Benefiting 1.24 Cr Students", outlet: "Education Ministry", date: "2024-09-30", sentiment: "Positive", reach: "2.1 Cr readers" },
];

export default function MinisterMediaPage() {
  const [press, setPress] = useState<PressItem[]>(initialPress);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("All");
  const [form, setForm] = useState({ type: "Press Release" as PressItem["type"], title: "", outlet: "", date: "", sentiment: "Positive", reach: "" });

  const types = ["All", "Press Release", "Media Coverage", "Interview", "Event"];
  const filtered = press.filter(p => filterType === "All" || p.type === filterType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPress(p => [{ ...form, id: p.length + 1 }, ...p]);
    setIsModalOpen(false);
    setToast(`📰 Media record '${form.title}' added to press registry.`);
    setTimeout(() => setToast(null), 4000);
  };

  const typeIcons: Record<string, string> = { "Press Release": "📋", "Media Coverage": "📰", "Interview": "🎙️", "Event": "🎉" };

  return (
    <PortalLayout title="Press & Media" subtitle="Minister · Executive Command Center" avatarLetter="M" avatarColor="#ef4444" themeClass="theme-minister" accentColor="#ef4444">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Media Items", value: press.length.toString(), icon: "📰", color: "text-red-400" },
          { label: "Positive Coverage", value: press.filter(p => p.sentiment === "Positive").length.toString(), icon: "✅", color: "text-emerald-400" },
          { label: "Negative Coverage", value: press.filter(p => p.sentiment === "Negative").length.toString(), icon: "⚠️", color: "text-red-400" },
          { label: "Total Reach", value: "5 Cr+", icon: "👁️", color: "text-amber-400" },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="text-2xl mb-2">{k.icon}</div>
            <div className={`text-2xl font-extrabold ${k.color} mb-1`}>{k.value}</div>
            <div className="text-xs text-slate-500 font-semibold">{k.label}</div>
          </div>
        ))}
      </div>
      {toast && <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl">{toast}</div>}

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {types.map(t => (
          <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterType === t ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
            {t !== "All" && typeIcons[t]} {t}
          </button>
        ))}
        <button onClick={() => setIsModalOpen(true)} className="ml-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl">+ Add Media Record</button>
      </div>

      <div className="glass rounded-2xl p-6 border border-slate-800">
        <h2 className="text-base font-semibold text-white mb-4">📰 Minister's Press & Media Registry</h2>
        <div className="space-y-3">
          {filtered.map(p => (
            <div key={p.id} className={`flex items-start justify-between p-4 rounded-xl border transition-all hover:border-red-500/20 ${p.sentiment === "Negative" ? "border-red-500/20 bg-red-500/5" : "border-slate-800 bg-slate-900/60"}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{typeIcons[p.type]}</span>
                  <span className="badge badge-blue text-[9px]">{p.type}</span>
                  <span className={`badge text-[9px] ${p.sentiment === "Positive" ? "badge-green" : "badge-red"}`}>{p.sentiment}</span>
                  <span className="text-[10px] text-slate-500">{p.date}</span>
                </div>
                <div className="text-xs font-bold text-white">{p.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{p.outlet} · Reach: {p.reach}</div>
              </div>
              {p.sentiment === "Negative" && (
                <button onClick={() => alert(`Counter-narrative briefing drafted for: ${p.title}`)} className="ml-4 px-3 py-1.5 bg-red-600/30 hover:bg-red-600/60 text-red-300 text-[10px] font-bold rounded-xl border border-red-500/30 transition-all whitespace-nowrap">
                  📋 Draft Response
                </button>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-slate-600 text-xs py-8">No media items for this filter.</div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl p-6 space-y-5" style={{ background: "#090d16", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 20px 50px rgba(0,0,0,0.95)" }}>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">📰 Add Media Record</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs">✕ Close</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              {[{ label: "Title / Headline", key: "title", type: "text" }, { label: "Outlet / Source", key: "outlet", type: "text" }, { label: "Date", key: "date", type: "date" }, { label: "Estimated Reach", key: "reach", type: "text" }].map(f => (
                <div key={f.key}>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">{f.label}</label>
                  <input type={f.type} required value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Type</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as PressItem["type"] }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                    {["Press Release", "Media Coverage", "Interview", "Event"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Sentiment</label>
                  <select value={form.sentiment} onChange={e => setForm(p => ({ ...p, sentiment: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                    {["Positive", "Negative", "Neutral"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs mt-2">Add Record</button>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
