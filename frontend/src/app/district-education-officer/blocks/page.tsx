"use client";
import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

const beos = [
  { name: "Mr. Murugesan P.", block: "CBE South", schools: 24, students: 22450, attendance: 91, pass: 90, rank: 1 },
  { name: "Mrs. Padma K.", block: "CBE North", schools: 21, students: 19800, attendance: 89, pass: 86, rank: 2 },
  { name: "Mr. Rajan S.", block: "Pollachi", schools: 18, students: 16200, attendance: 87, pass: 83, rank: 3 },
  { name: "Mr. Arumugam T.", block: "Mettupalayam", schools: 16, students: 14100, attendance: 85, pass: 79, rank: 4 },
  { name: "Mrs. Selvi M.", block: "Annur", schools: 14, students: 11800, attendance: 83, pass: 74, rank: 5 },
];

export default function BlockComparisonsPage() {
  return (
    <PortalLayout title="Block Comparisons" subtitle="DEO Officer · Coimbatore District" avatarLetter="D" avatarColor="#ec4899" themeClass="theme-deo" accentColor="#ec4899">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {beos.map(b => (
          <div key={b.block} className="kpi-card">
            <div className="text-xl mb-2">🗺️</div>
            <div className="text-pink-400 font-bold text-sm mb-1">{b.block}</div>
            <div className="text-xs text-slate-500">{b.schools} Schools</div>
            <div className="text-xs text-slate-500">{b.students.toLocaleString()} Students</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 border border-slate-800 mb-6">
        <h2 className="text-base font-semibold text-white mb-4">📊 Block-wise Comparative Table</h2>
        <table className="data-table">
          <thead><tr><th>Rank</th><th>Block</th><th>BEO Name</th><th>Schools</th><th>Students</th><th>Attendance</th><th>Pass Rate</th></tr></thead>
          <tbody>
            {beos.map(b => (
              <tr key={b.block}>
                <td><span className={`badge ${b.rank === 1 ? "badge-green" : b.rank <= 3 ? "badge-blue" : "badge-yellow"}`}>#{b.rank}</span></td>
                <td className="font-bold text-white text-xs">{b.block}</td>
                <td className="text-xs text-slate-400">{b.name}</td>
                <td>{b.schools}</td>
                <td>{b.students.toLocaleString()}</td>
                <td><span className={`badge ${b.attendance >= 90 ? "badge-green" : b.attendance >= 85 ? "badge-yellow" : "badge-red"}`}>{b.attendance}%</span></td>
                <td className={`font-bold text-sm ${b.pass >= 88 ? "text-emerald-400" : b.pass >= 82 ? "text-amber-400" : "text-red-400"}`}>{b.pass}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attendance comparison bars */}
        <div className="glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-sm font-semibold text-white mb-4">📅 Attendance Comparison</h2>
          {beos.map(b => (
            <div key={b.block} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">{b.block}</span>
                <span className="text-white font-bold">{b.attendance}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full">
                <div className="h-2 rounded-full transition-all bg-gradient-to-r from-pink-500 to-rose-500" style={{ width: `${b.attendance}%` }} />
              </div>
            </div>
          ))}
        </div>
        {/* Pass rate comparison */}
        <div className="glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-sm font-semibold text-white mb-4">📊 Pass Rate Comparison</h2>
          {beos.map(b => (
            <div key={b.block} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">{b.block}</span>
                <span className="text-white font-bold">{b.pass}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full">
                <div className="h-2 rounded-full transition-all bg-gradient-to-r from-violet-500 to-purple-500" style={{ width: `${b.pass}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
