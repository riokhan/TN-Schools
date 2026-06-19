"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface SchoolAttendance {
  id: number;
  schoolName: string;
  studentAttendance: number;
  staffAttendance: number;
  status: "Good" | "Needs Attention" | "Critical Alert";
}

export default function AttendanceAnalyticsPage() {
  const [schools, setSchools] = useState<SchoolAttendance[]>([
    { id: 1, schoolName: "GHS Coimbatore", studentAttendance: 96, staffAttendance: 98, status: "Good" },
    { id: 2, schoolName: "GHS Singanallur", studentAttendance: 92, staffAttendance: 96, status: "Good" },
    { id: 3, schoolName: "GHSS Ganapathy", studentAttendance: 90, staffAttendance: 94, status: "Good" },
    { id: 4, schoolName: "GHS RS Puram", studentAttendance: 87, staffAttendance: 92, status: "Needs Attention" },
    { id: 5, schoolName: "GHS Peelamedu", studentAttendance: 85, staffAttendance: 89, status: "Critical Alert" },
  ]);

  // Form State
  const [targetSchoolId, setTargetSchoolId] = useState(5);
  const [smsTemplate, setSmsTemplate] = useState("DISE attendance logs indicate student attendance is below 85% for Class 10. Directives suggest emergency parent calls.");
  const [smsToast, setSmsToast] = useState<string | null>(null);

  const handleSendWarning = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = schools.find((s) => s.id === targetSchoolId);
    if (matched) {
      setSmsToast(`✓ Administrative Warning SMS dispatched to HM of ${matched.schoolName}!`);
      setTimeout(() => setSmsToast(null), 4000);
    }
  };

  return (
    <PortalLayout
      title="Attendance Analytics & Alerts"
      subtitle="Mr. Murugesan P. · Coimbatore South Block"
      avatarLetter="M"
      avatarColor="#8b5cf6"
      themeClass="theme-beo"
      accentColor="#8b5cf6"
    >
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 fade-in">
        <div className="glass rounded-2xl p-5 border border-slate-800">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-2">Block Student Attendance</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">91.2%</span>
            <span className="text-[10px] text-emerald-500 font-bold">Block Mean</span>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full mt-3 overflow-hidden border border-slate-850">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: "91.2%" }} />
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-slate-800">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-2">Block Teaching Staff Attendance</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-400">95.8%</span>
            <span className="text-[10px] text-blue-500 font-bold">Top Cohort</span>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full mt-3 overflow-hidden border border-slate-850">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: "95.8%" }} />
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-slate-800">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-2">Schools Awaiting Intervention</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-500">2 Schools</span>
            <span className="text-[10px] text-rose-450 font-bold">Below 88%</span>
          </div>
          <div className="text-[10px] text-slate-500 font-semibold mt-2.5">
            Warning triggers dispatched.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Attendance Index Table */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-base font-semibold text-white mb-2">📅 School Attendance Leaderboard</h2>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">Cross-referenced records detailing pupil presence ratios versus logged staff rosters.</p>

          <div className="space-y-4">
            {schools.map((s) => (
              <div
                key={s.id}
                className="p-4 bg-slate-900/60 rounded-xl border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{s.schoolName}</h3>
                  <div className="text-xs text-slate-400">
                    Student Presence: <strong className="text-slate-300">{s.studentAttendance}%</strong> · Staff Rate: <span className="text-blue-400 font-semibold">{s.staffAttendance}%</span>
                  </div>
                </div>

                <div>
                  <span className={`badge ${
                    s.status === "Good"
                      ? "badge-green"
                      : s.status === "Needs Attention"
                      ? "badge-yellow"
                      : "badge-red"
                  }`}>
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warning console */}
        <div className="glass rounded-2xl p-6 border border-slate-800 h-fit">
          <h2 className="text-base font-semibold text-white mb-2">🚨 Dispatch Low Attendance Directive</h2>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Send high-priority warning SMS and EMIS notifications directly to the Headmaster of critical-level schools.
          </p>

          <form onSubmit={handleSendWarning} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Select Underperforming School</label>
              <select
                value={targetSchoolId}
                onChange={(e) => setTargetSchoolId(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
              >
                {schools
                  .filter((s) => s.status !== "Good")
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.schoolName} ({s.studentAttendance}% attendance)
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-semibold">SMS Directive Message</label>
              <textarea
                value={smsTemplate}
                onChange={(e) => setSmsTemplate(e.target.value)}
                rows={4}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-violet-500 transition-colors resize-none leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Dispatch Warning SMS
            </button>
          </form>

          {smsToast && (
            <div className="mt-4 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl leading-relaxed">
              {smsToast}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
