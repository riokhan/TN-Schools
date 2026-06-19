"use client";
import React from "react";
import PortalLayout from "@/components/PortalLayout";

const districts = [
  { name: "Chennai", pass10: 91, pass12: 88, attendance: 89, dropout: 0.8, score: 92 },
  { name: "Coimbatore", pass10: 87, pass12: 83, attendance: 87, dropout: 1.2, score: 88 },
  { name: "Trichy", pass10: 83, pass12: 78, attendance: 84, dropout: 1.5, score: 84 },
  { name: "Madurai", pass10: 84, pass12: 79, attendance: 85, dropout: 1.3, score: 83 },
  { name: "Salem", pass10: 81, pass12: 76, attendance: 83, dropout: 1.8, score: 80 },
  { name: "Tirunelveli", pass10: 79, pass12: 73, attendance: 82, dropout: 2.1, score: 77 },
];

const metrics = [
  { key: "pass10", label: "10th Pass %", color: "from-cyan-500 to-sky-500" },
  { key: "pass12", label: "12th Pass %", color: "from-violet-500 to-purple-500" },
  { key: "attendance", label: "Attendance %", color: "from-emerald-500 to-teal-500" },
];

export default function CommissionerPerformancePage() {
  return (
    <PortalLayout title="School Performance" subtitle="Commissioner · State Operations" avatarLetter="C" avatarColor="#06b6d4" themeClass="theme-commissioner" accentColor="#06b6d4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "State 10th Pass %", value: "85.4%", icon: "📊", color: "text-cyan-400" },
          { label: "State 12th Pass %", value: "80.9%", icon: "🎓", color: "text-violet-400" },
          { label: "State Avg Attendance", value: "85%", icon: "📅", color: "text-emerald-400" },
          { label: "State Dropout Rate", value: "1.45%", icon: "📉", color: "text-red-400" },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="text-2xl mb-2">{k.icon}</div>
            <div className={`text-2xl font-extrabold ${k.color} mb-1`}>{k.value}</div>
            <div className="text-xs text-slate-500 font-semibold">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 border border-slate-800 mb-6">
        <h2 className="text-base font-semibold text-white mb-4">📊 District Performance Scores</h2>
        <table className="data-table">
          <thead><tr><th>District</th><th>10th Pass %</th><th>12th Pass %</th><th>Attendance</th><th>Dropout %</th><th>Performance Score</th></tr></thead>
          <tbody>
            {districts.sort((a, b) => b.score - a.score).map((d, i) => (
              <tr key={d.name}>
                <td className="font-bold text-white text-xs">
                  <span className={`badge mr-2 ${i === 0 ? "badge-green" : i <= 2 ? "badge-blue" : "badge-yellow"}`}>#{i + 1}</span>
                  {d.name}
                </td>
                <td>{d.pass10}%</td>
                <td>{d.pass12}%</td>
                <td><span className={`badge ${d.attendance >= 88 ? "badge-green" : "badge-yellow"}`}>{d.attendance}%</span></td>
                <td><span className={`badge ${d.dropout <= 1.0 ? "badge-green" : d.dropout <= 1.5 ? "badge-yellow" : "badge-red"}`}>{d.dropout}%</span></td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="h-2 bg-slate-800 rounded-full w-16"><div className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500" style={{ width: `${d.score}%` }} /></div>
                    <span className={`text-sm font-bold ${d.score >= 88 ? "text-emerald-400" : d.score >= 82 ? "text-amber-400" : "text-red-400"}`}>{d.score}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map(m => (
          <div key={m.key} className="glass rounded-2xl p-6 border border-slate-800">
            <h2 className="text-sm font-semibold text-white mb-4">📈 {m.label}</h2>
            {districts.sort((a, b) => (b as any)[m.key] - (a as any)[m.key]).map(d => (
              <div key={d.name} className="mb-2">
                <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">{d.name}</span><span className="text-white font-bold">{(d as any)[m.key]}%</span></div>
                <div className="h-1.5 bg-slate-800 rounded-full"><div className={`h-1.5 rounded-full bg-gradient-to-r ${m.color}`} style={{ width: `${(d as any)[m.key]}%` }} /></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </PortalLayout>
  );
}
