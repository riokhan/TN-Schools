"use client";
import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

const blocks = [
  { name: "Coimbatore South", schools: 24, students: 22450, teachers: 312, attendance: 91, pass10: 93, pass12: 88 },
  { name: "Coimbatore North", schools: 21, students: 19800, teachers: 278, attendance: 89, pass10: 88, pass12: 82 },
  { name: "Pollachi", schools: 18, students: 16200, teachers: 241, attendance: 87, pass10: 85, pass12: 78 },
  { name: "Mettupalayam", schools: 16, students: 14100, teachers: 210, attendance: 85, pass10: 81, pass12: 74 },
  { name: "Annur", schools: 14, students: 11800, teachers: 185, attendance: 83, pass10: 77, pass12: 70 },
];

export default function DEOOverviewPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = blocks.find(b => b.name === selected);

  return (
    <PortalLayout
      title="District Overview"
      subtitle="DEO Officer · Coimbatore District"
      avatarLetter="D"
      avatarColor="#ec4899"
      themeClass="theme-deo"
      accentColor="#ec4899"
    >
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6 fade-in">
        {[
          { label: "Total Blocks", value: "5", icon: "🗺️", color: "text-pink-400" },
          { label: "Total Schools", value: "93", icon: "🏫", color: "text-violet-400" },
          { label: "Total Students", value: "84,350", icon: "👨‍🎓", color: "text-emerald-400" },
          { label: "Total Teachers", value: "1,226", icon: "👩‍🏫", color: "text-amber-400" },
          { label: "District GPA", value: "87.1%", icon: "📊", color: "text-cyan-400" },
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
          <h2 className="text-base font-semibold text-white mb-5">🗺️ Block-wise District Overview</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Block</th><th>Schools</th><th>Students</th><th>Teachers</th>
                <th>Attendance</th><th>10th %</th><th>12th %</th><th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {blocks.map(b => (
                <tr key={b.name} className={selected === b.name ? "bg-pink-500/10" : ""}>
                  <td className="font-bold text-white text-xs">{b.name}</td>
                  <td>{b.schools}</td>
                  <td>{b.students.toLocaleString()}</td>
                  <td>{b.teachers}</td>
                  <td><span className={`badge ${b.attendance >= 90 ? "badge-green" : b.attendance >= 85 ? "badge-yellow" : "badge-red"}`}>{b.attendance}%</span></td>
                  <td className="text-slate-300">{b.pass10}%</td>
                  <td className="text-pink-400 font-semibold">{b.pass12}%</td>
                  <td><button onClick={() => setSelected(selected === b.name ? null : b.name)} className="text-xs text-pink-400 hover:text-pink-300 font-bold">View →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-sm font-semibold text-white mb-4">📋 Block Detail View</h2>
          {sel ? (
            <div className="space-y-3">
              <div className="text-pink-400 font-bold text-sm">{sel.name}</div>
              {[
                { label: "Schools", value: sel.schools },
                { label: "Students", value: sel.students.toLocaleString() },
                { label: "Teachers", value: sel.teachers },
                { label: "Attendance", value: `${sel.attendance}%` },
                { label: "10th Pass %", value: `${sel.pass10}%` },
                { label: "12th Pass %", value: `${sel.pass12}%` },
              ].map(r => (
                <div key={r.label} className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-400">{r.label}</span>
                  <span className="text-xs text-white font-bold">{r.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-600 text-xs mt-10">← Click a block row to see details</div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
