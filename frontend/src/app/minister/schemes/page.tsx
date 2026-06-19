"use client";
import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

const schemes = [
  { id: 1, name: "Zero Dropout Mission 2025", ministry: "School Edu Dept", budget: "₹2,400 Cr", beneficiaries: "61,200 students", progress: 65, phase: "Phase 2", status: "Active" },
  { id: 2, name: "Chief Minister's Free Education", ministry: "Finance + Edu", budget: "₹8,500 Cr", beneficiaries: "1.24 Cr students", progress: 100, phase: "Ongoing", status: "Active" },
  { id: 3, name: "Digital Classroom Initiative", ministry: "IT + Edu Dept", budget: "₹3,200 Cr", beneficiaries: "48,000 schools", progress: 74, phase: "Phase 3", status: "Active" },
  { id: 4, name: "SC/ST Scholarship Program", ministry: "BC Welfare + Edu", budget: "₹1,800 Cr", beneficiaries: "3.8L students", progress: 88, phase: "Ongoing", status: "Active" },
  { id: 5, name: "Girl Child Education Mission", ministry: "WCDSC + Edu", budget: "₹900 Cr", beneficiaries: "62L girl students", progress: 91, phase: "Phase 2", status: "Active" },
  { id: 6, name: "Smart School Infrastructure", ministry: "PWD + Edu", budget: "₹5,500 Cr", beneficiaries: "15K rural schools", progress: 61, phase: "Phase 2", status: "Active" },
  { id: 7, name: "AI Learning Labs Pilot", ministry: "DST + Edu", budget: "₹450 Cr", beneficiaries: "500 schools (Phase 1)", progress: 35, phase: "Phase 1", status: "Pilot" },
  { id: 8, name: "Midday Meal Nutritional Upgrade", ministry: "Social Welfare", budget: "₹4,200 Cr", beneficiaries: "1.24 Cr students", progress: 96, phase: "Ongoing", status: "Active" },
];

export default function MinisterSchemesPage() {
  const [filter, setFilter] = useState<string>("All");

  const filters = ["All", "Active", "Pilot"];
  const filtered = schemes.filter(s => filter === "All" || s.status === filter);

  const avgProgress = Math.round(schemes.reduce((s, x) => s + x.progress, 0) / schemes.length);

  return (
    <PortalLayout title="Schemes Progress" subtitle="Minister · Executive Command Center" avatarLetter="M" avatarColor="#ef4444" themeClass="theme-minister" accentColor="#ef4444">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Flagship Schemes", value: schemes.length.toString(), icon: "📜", color: "text-red-400" },
          { label: "Avg Progress", value: `${avgProgress}%`, icon: "📊", color: "text-amber-400" },
          { label: "Fully Deployed", value: schemes.filter(s => s.progress === 100).length.toString(), icon: "✅", color: "text-emerald-400" },
          { label: "Total Beneficiaries", value: "1.5 Cr+", icon: "👨‍🎓", color: "text-violet-400" },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="text-2xl mb-2">{k.icon}</div>
            <div className={`text-2xl font-extrabold ${k.color} mb-1`}>{k.value}</div>
            <div className="text-xs text-slate-500 font-semibold">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-4 flex gap-2">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === f ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>{f}</button>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 border border-slate-800">
        <h2 className="text-base font-semibold text-white mb-5">📜 Ministerial Flagship Schemes — Progress Tracker</h2>
        <div className="space-y-4">
          {filtered.map(s => (
            <div key={s.id} className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-red-500/20 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge text-[9px] ${s.status === "Active" ? "badge-green" : "badge-blue"}`}>{s.status}</span>
                    <span className="badge badge-pink text-[9px]">{s.phase}</span>
                    <span className="text-[10px] text-slate-500">{s.ministry}</span>
                  </div>
                  <div className="text-sm font-bold text-white">{s.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Budget: <span className="text-red-400 font-bold">{s.budget}</span> · Beneficiaries: {s.beneficiaries}</div>
                </div>
                <div className="text-right ml-4">
                  <div className={`text-2xl font-extrabold ${s.progress >= 90 ? "text-emerald-400" : s.progress >= 70 ? "text-amber-400" : "text-red-400"}`}>{s.progress}%</div>
                  <div className="text-[9px] text-slate-500">progress</div>
                </div>
              </div>
              <div className="h-2.5 bg-slate-800 rounded-full">
                <div
                  className={`h-2.5 rounded-full bg-gradient-to-r transition-all ${s.progress >= 90 ? "from-emerald-500 to-teal-500" : s.progress >= 70 ? "from-amber-500 to-yellow-500" : "from-red-500 to-orange-500"}`}
                  style={{ width: `${s.progress}%` }}
                />
              </div>
              {s.progress < 70 && (
                <div className="mt-2 flex justify-end">
                  <button onClick={() => alert(`Fast-track order issued for: ${s.name}`)} className="text-[10px] text-red-400 hover:text-red-300 font-bold">⚡ Issue Fast-Track Order →</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
