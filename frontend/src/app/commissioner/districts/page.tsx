"use client";
import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

const districts = [
  { name: "Coimbatore", schools: 93, students: 84350, attendance: 87, pass10: 87, pass12: 83, rank: 1 },
  { name: "Chennai", schools: 210, students: 198000, attendance: 89, pass10: 91, pass12: 88, rank: 2 },
  { name: "Madurai", schools: 125, students: 112000, attendance: 85, pass10: 84, pass12: 79, rank: 3 },
  { name: "Salem", schools: 98, students: 87000, attendance: 83, pass10: 81, pass12: 76, rank: 4 },
  { name: "Trichy", schools: 115, students: 103000, attendance: 84, pass10: 83, pass12: 78, rank: 5 },
  { name: "Tirunelveli", schools: 88, students: 78000, attendance: 82, pass10: 79, pass12: 73, rank: 6 },
];

export default function CommissionerDistrictsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = districts.find(d => d.name === selected);

  return (
    <PortalLayout title="District Comparisons" subtitle="Commissioner · State Operations" avatarLetter="C" avatarColor="#06b6d4" themeClass="theme-commissioner" accentColor="#06b6d4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Monitored Districts", value: "38", icon: "🗺️", color: "text-cyan-400" },
          { label: "State Schools", value: "48,000+", icon: "🏫", color: "text-violet-400" },
          { label: "State Students", value: "1.2 Cr", icon: "👨‍🎓", color: "text-emerald-400" },
          { label: "State Avg Attendance", value: "85%", icon: "📅", color: "text-amber-400" },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="text-2xl mb-2">{k.icon}</div>
            <div className={`text-2xl font-extrabold ${k.color} mb-1`}>{k.value}</div>
            <div className="text-xs text-slate-500 font-semibold">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-base font-semibold text-white mb-4">🗺️ District Performance Comparison</h2>
          <table className="data-table">
            <thead><tr><th>Rank</th><th>District</th><th>Schools</th><th>Students</th><th>Attendance</th><th>10th %</th><th>12th %</th><th>Detail</th></tr></thead>
            <tbody>
              {districts.map(d => (
                <tr key={d.name} className={selected === d.name ? "bg-cyan-500/10" : ""}>
                  <td><span className={`badge ${d.rank === 1 ? "badge-green" : d.rank <= 3 ? "badge-blue" : "badge-yellow"}`}>#{d.rank}</span></td>
                  <td className="font-bold text-white text-xs">{d.name}</td>
                  <td>{d.schools}</td>
                  <td>{d.students.toLocaleString()}</td>
                  <td><span className={`badge ${d.attendance >= 88 ? "badge-green" : d.attendance >= 84 ? "badge-yellow" : "badge-red"}`}>{d.attendance}%</span></td>
                  <td className="text-slate-300">{d.pass10}%</td>
                  <td className="text-cyan-400 font-semibold">{d.pass12}%</td>
                  <td><button onClick={() => setSelected(selected === d.name ? null : d.name)} className="text-xs text-cyan-400 hover:text-cyan-300 font-bold">View →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-sm font-semibold text-white mb-4">📋 District Detail</h2>
          {sel ? (
            <div className="space-y-3">
              <div className="text-cyan-400 font-bold text-sm">{sel.name} District</div>
              {[
                { label: "Schools", value: sel.schools }, { label: "Students", value: sel.students.toLocaleString() },
                { label: "Attendance", value: `${sel.attendance}%` }, { label: "10th Pass %", value: `${sel.pass10}%` },
                { label: "12th Pass %", value: `${sel.pass12}%` }, { label: "State Rank", value: `#${sel.rank}` },
              ].map(r => (
                <div key={r.label} className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-400">{r.label}</span>
                  <span className="text-xs text-white font-bold">{r.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-600 text-xs mt-10">← Click a district row to see details</div>
          )}
          <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
            <p className="text-[10px] text-cyan-300">🤖 AI: Chennai leads state in pass rates. Tirunelveli needs targeted intervention for attendance improvement.</p>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
