"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface GradeAttendance {
  grade: string;
  total: number;
  present: number;
  absent: number;
  percent: number;
}

interface AbsenteeWarning {
  name: string;
  class: string;
  days: number;
  contact: string;
}

export default function HeadmasterAttendancePage() {
  const [grades] = useState<GradeAttendance[]>(
    [
      { grade: "Class 6", total: 180, present: 174, absent: 6, percent: 96.6 },
      { grade: "Class 7", total: 175, present: 168, absent: 7, percent: 96.0 },
      { grade: "Class 8", total: 192, present: 186, absent: 6, percent: 96.8 },
      { grade: "Class 9", total: 188, present: 178, absent: 10, percent: 94.6 },
      { grade: "Class 10", total: 198, present: 188, absent: 10, percent: 94.9 },
      { grade: "Class 11", total: 154, present: 148, absent: 6, percent: 96.1 },
      { grade: "Class 12", enrolled: 160, total: 160, present: 157, absent: 3, percent: 98.1 } as any,
    ]
  );

  const [warnings] = useState<AbsenteeWarning[]>([
    { name: "Murugan S.", class: "Class 10A", days: 5, contact: "+91 98765 43211" },
    { name: "Suresh K.", class: "Class 9B", days: 3, contact: "+91 98765 43200" },
    { name: "Nandhini P.", class: "Class 8C", days: 4, contact: "+91 98765 43299" },
  ]);

  const [remindedId, setRemindedId] = useState<string | null>(null);

  const handleSendReminder = (name: string) => {
    setRemindedId(name);
    setTimeout(() => {
      setRemindedId(null);
      alert(`✓ SMS absence notification sent to ${name}'s parents.`);
    }, 1000);
  };

  return (
    <PortalLayout
      title="Daily Attendance Analytics"
      subtitle="Mr. Venkatesh R. · GHS Coimbatore · DISE: 33012345"
      avatarLetter="V"
      avatarColor="#3b82f6"
      themeClass="theme-headmaster"
      accentColor="#3b82f6"
    >
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in">
        {[
          { label: "Overall Attendance", value: "96.2%", icon: "📊", color: "text-blue-400", sub: "1,199 / 1,247 present" },
          { label: "Absent Students", value: "48", icon: "🔴", color: "text-red-400", sub: "Notifications sent" },
          { label: "Staff Attendance", value: "90.4%", icon: "👩‍🏫", color: "text-emerald-400", sub: "38 / 42 permanent" },
          { label: "Term Average", value: "94.6%", icon: "📈", color: "text-cyan-400", sub: "Academic year average" },
        ].map((kpi) => (
          <div key={kpi.label} className="kpi-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{kpi.icon}</span>
              <span className={`text-[10px] font-bold ${kpi.color}`}>{kpi.sub}</span>
            </div>
            <div className={`text-2xl font-extrabold ${kpi.color} mb-1`}>{kpi.value}</div>
            <div className="text-xs text-slate-500 font-semibold">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Class summary table */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-base font-semibold text-white mb-5">🏫 Attendance breakdown by Grade</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Grade Level</th>
                <th>Total Students</th>
                <th>Present Count</th>
                <th>Absent Count</th>
                <th>Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g) => (
                <tr key={g.grade}>
                  <td className="font-bold text-white text-xs">{g.grade}</td>
                  <td>{g.total} students</td>
                  <td>{g.present}</td>
                  <td className="text-red-400 font-bold">{g.absent}</td>
                  <td>
                    <span className={`badge ${g.percent >= 96 ? "badge-green" : "badge-yellow"}`}>{g.percent}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Warning checklist */}
        <div className="glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-base font-semibold text-white mb-4">⚠️ High Absence Warnings</h2>
          <div className="space-y-4">
            {warnings.map((s, idx) => (
              <div key={idx} className="p-3.5 border border-red-500/20 bg-red-500/5 rounded-xl text-xs space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-sm">{s.name}</h4>
                    <span className="text-[10px] text-slate-500 font-semibold">{s.class}</span>
                  </div>
                  <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-bold">
                    {s.days} Days Absent
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-900">
                  <span className="text-[10px] text-slate-500">{s.contact}</span>
                  <button
                    onClick={() => handleSendReminder(s.name)}
                    disabled={remindedId === s.name}
                    className="px-2 py-1 bg-amber-500 text-slate-950 font-bold rounded text-[9px] hover:bg-amber-600 transition-colors"
                  >
                    {remindedId === s.name ? "Sending..." : "Send Reminder"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
