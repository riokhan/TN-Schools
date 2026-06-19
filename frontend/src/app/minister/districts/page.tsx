"use client";
import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

const districts = [
  { name: "Chennai", schools: 210, students: 198000, attendance: 89, pass10: 91, pass12: 88, dropout: 0.8, infra: 90, score: 92, zone: "North" },
  { name: "Coimbatore", schools: 93, students: 84350, attendance: 87, pass10: 87, pass12: 83, dropout: 1.2, infra: 86, score: 88, zone: "West" },
  { name: "Trichy", schools: 115, students: 103000, attendance: 84, pass10: 83, pass12: 78, dropout: 1.5, infra: 83, score: 84, zone: "Central" },
  { name: "Madurai", schools: 125, students: 112000, attendance: 85, pass10: 84, pass12: 79, dropout: 1.3, infra: 80, score: 83, zone: "South" },
  { name: "Salem", schools: 98, students: 87000, attendance: 83, pass10: 81, pass12: 76, dropout: 1.8, infra: 76, score: 80, zone: "Central" },
  { name: "Tirunelveli", schools: 88, students: 78000, attendance: 82, pass10: 79, pass12: 73, dropout: 2.1, infra: 72, score: 77, zone: "South" },
  { name: "Vellore", schools: 76, students: 67000, attendance: 85, pass10: 82, pass12: 77, dropout: 1.4, infra: 78, score: 81, zone: "North" },
  { name: "Thanjavur", schools: 84, students: 74000, attendance: 86, pass10: 83, pass12: 78, dropout: 1.3, infra: 80, score: 82, zone: "Delta" },
];

export default function MinisterDistrictsPage() {
  const [selectedZone, setSelectedZone] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("score");

  const zones = ["All", "North", "South", "Central", "West", "Delta"];
  const filtered = districts
    .filter(d => selectedZone === "All" || d.zone === selectedZone)
    .sort((a, b) => (b as any)[sortBy] - (a as any)[sortBy]);

  return (
    <PortalLayout title="District Reports" subtitle="Minister · Executive Command Center" avatarLetter="M" avatarColor="#ef4444" themeClass="theme-minister" accentColor="#ef4444">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Reporting Districts", value: "38", icon: "🗺️", color: "text-red-400" },
          { label: "Top Score", value: Math.max(...districts.map(d => d.score)) + "/100", icon: "🥇", color: "text-yellow-400" },
          { label: "Below Avg", value: districts.filter(d => d.score < 83).length.toString(), icon: "⚠️", color: "text-amber-400" },
          { label: "State Avg Score", value: Math.round(districts.reduce((s, d) => s + d.score, 0) / districts.length) + "/100", icon: "📊", color: "text-cyan-400" },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="text-2xl mb-2">{k.icon}</div>
            <div className={`text-2xl font-extrabold ${k.color} mb-1`}>{k.value}</div>
            <div className="text-xs text-slate-500 font-semibold">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="flex gap-2">
          {zones.map(z => (
            <button key={z} onClick={() => setSelectedZone(z)} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedZone === z ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>{z}</button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-500">Sort by:</span>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500">
            <option value="score">Overall Score</option>
            <option value="attendance">Attendance</option>
            <option value="pass10">10th Pass %</option>
            <option value="dropout">Dropout Rate</option>
          </select>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 border border-slate-800 mb-6">
        <h2 className="text-base font-semibold text-white mb-4">🗺️ Ministerial District Report — {selectedZone} Zone</h2>
        <table className="data-table">
          <thead>
            <tr><th>Rank</th><th>District</th><th>Zone</th><th>Schools</th><th>Students</th><th>Attendance</th><th>10th %</th><th>Dropout %</th><th>Infra</th><th>Score</th></tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => (
              <tr key={d.name}>
                <td><span className={`badge ${i === 0 ? "badge-green" : i <= 2 ? "badge-blue" : i >= filtered.length - 2 ? "badge-red" : "badge-yellow"}`}>#{i + 1}</span></td>
                <td className="font-bold text-white text-xs">{d.name}</td>
                <td className="text-xs text-slate-400">{d.zone}</td>
                <td>{d.schools}</td>
                <td>{d.students.toLocaleString()}</td>
                <td><span className={`badge ${d.attendance >= 87 ? "badge-green" : d.attendance >= 84 ? "badge-yellow" : "badge-red"}`}>{d.attendance}%</span></td>
                <td className="text-slate-300">{d.pass10}%</td>
                <td><span className={`badge ${d.dropout <= 1.0 ? "badge-green" : d.dropout <= 1.5 ? "badge-yellow" : "badge-red"}`}>{d.dropout}%</span></td>
                <td>{d.infra}/100</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 bg-slate-800 rounded-full w-10"><div className="h-1.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500" style={{ width: `${d.score}%` }} /></div>
                    <span className={`text-xs font-bold ${d.score >= 88 ? "text-emerald-400" : d.score >= 82 ? "text-amber-400" : "text-red-400"}`}>{d.score}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-sm font-semibold text-white mb-4">🏆 Top Performers</h2>
          {[...districts].sort((a, b) => b.score - a.score).slice(0, 3).map((d, i) => (
            <div key={d.name} className="flex items-center justify-between py-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className={`text-lg ${i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}`}>{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</span>
                <div>
                  <div className="text-xs font-bold text-white">{d.name}</div>
                  <div className="text-[10px] text-slate-500">{d.zone} Zone</div>
                </div>
              </div>
              <span className="text-emerald-400 font-bold text-sm">{d.score}/100</span>
            </div>
          ))}
        </div>
        <div className="glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-sm font-semibold text-white mb-4">🚨 Needs Attention</h2>
          {[...districts].sort((a, b) => a.score - b.score).slice(0, 3).map(d => (
            <div key={d.name} className="flex items-center justify-between py-3 border-b border-slate-800">
              <div>
                <div className="text-xs font-bold text-white">{d.name}</div>
                <div className="text-[10px] text-red-400">Dropout: {d.dropout}% · Infra: {d.infra}/100</div>
              </div>
              <span className="text-red-400 font-bold text-sm">{d.score}/100</span>
            </div>
          ))}
          <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-[10px] text-red-300">⚠️ Minister's attention recommended for lowest-scoring districts.</p>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
