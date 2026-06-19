"use client";
import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface Teacher { id: number; name: string; district: string; subject: string; vacancies: number; filled: number; pending: number; }

const initialData: Teacher[] = [
  { id: 1, name: "Mathematics", district: "State-wide", subject: "Mathematics", vacancies: 4200, filled: 3850, pending: 350 },
  { id: 2, name: "Science", district: "State-wide", subject: "Science (Physics/Chemistry/Biology)", vacancies: 3800, filled: 3400, pending: 400 },
  { id: 3, name: "Tamil", district: "State-wide", subject: "Tamil Language", vacancies: 5100, filled: 5050, pending: 50 },
  { id: 4, name: "English", district: "State-wide", subject: "English", vacancies: 3200, filled: 2950, pending: 250 },
  { id: 5, name: "Social Science", district: "State-wide", subject: "History/Geography/Civics", vacancies: 2800, filled: 2600, pending: 200 },
];

const districtShortages = [
  { district: "Tirunelveli", subject: "Mathematics", short: 142 },
  { district: "Salem", subject: "Science", short: 118 },
  { district: "Dharmapuri", subject: "English", short: 98 },
  { district: "Namakkal", subject: "Mathematics", short: 87 },
  { district: "Villupuram", subject: "Science", short: 76 },
];

export default function CommissionerTeachersPage() {
  const [activeTab, setActiveTab] = useState<"subject" | "district">("subject");

  return (
    <PortalLayout title="Teacher Deployment" subtitle="Commissioner · State Operations" avatarLetter="C" avatarColor="#06b6d4" themeClass="theme-commissioner" accentColor="#06b6d4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Teacher Posts", value: "2,84,000", icon: "👩‍🏫", color: "text-cyan-400" },
          { label: "Filled Posts", value: "2,82,850", icon: "✅", color: "text-emerald-400" },
          { label: "Vacant Posts", value: "1,250", icon: "⚠️", color: "text-red-400" },
          { label: "State PTR Ratio", value: "1:28", icon: "📊", color: "text-amber-400" },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="text-2xl mb-2">{k.icon}</div>
            <div className={`text-2xl font-extrabold ${k.color} mb-1`}>{k.value}</div>
            <div className="text-xs text-slate-500 font-semibold">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setActiveTab("subject")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "subject" ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>Subject-wise</button>
        <button onClick={() => setActiveTab("district")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "district" ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>District Shortages</button>
      </div>

      {activeTab === "subject" ? (
        <div className="glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-base font-semibold text-white mb-4">👩‍🏫 Subject-wise Deployment (State)</h2>
          <div className="space-y-4">
            {initialData.map(d => {
              const pct = Math.round((d.filled / d.vacancies) * 100);
              return (
                <div key={d.id} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-xs font-bold text-white">{d.subject}</div>
                      <div className="text-[10px] text-slate-500">State-wide deployment</div>
                    </div>
                    <div className="text-right">
                      <span className="text-cyan-400 font-bold text-xs">{d.filled.toLocaleString()} filled</span>
                      <span className="text-red-400 text-[10px] ml-2">({d.pending} pending)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-800 rounded-full">
                      <div className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className={`text-xs font-bold ${pct >= 95 ? "text-emerald-400" : pct >= 88 ? "text-amber-400" : "text-red-400"}`}>{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-base font-semibold text-white mb-4">⚠️ Top District Shortages</h2>
          <table className="data-table">
            <thead><tr><th>District</th><th>Subject</th><th>Shortage</th><th>Action</th></tr></thead>
            <tbody>
              {districtShortages.map(d => (
                <tr key={`${d.district}-${d.subject}`}>
                  <td className="font-bold text-white text-xs">{d.district}</td>
                  <td className="text-xs text-cyan-400">{d.subject}</td>
                  <td><span className="badge badge-red">{d.short} posts</span></td>
                  <td>
                    <button onClick={() => alert(`Transfer order raised for ${d.subject} teachers to ${d.district}.`)} className="text-xs text-cyan-400 hover:text-cyan-300 font-bold">Issue Transfer →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <p className="text-[10px] text-amber-300">🤖 AI: Transfer 200 excess Mathematics teachers from Chennai to deficit districts. Estimated impact: +3% pass rate in 5 districts.</p>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
