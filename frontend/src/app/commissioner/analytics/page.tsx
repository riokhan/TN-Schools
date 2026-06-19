"use client";
import React from "react";
import PortalLayout from "@/components/PortalLayout";

const stateKPIs = [
  { label: "Total Schools", value: "48,251", trend: "+1.2%", icon: "🏫", color: "text-cyan-400", sub: "vs last year" },
  { label: "Total Students", value: "1.24 Cr", trend: "+2.4%", icon: "👨‍🎓", color: "text-emerald-400", sub: "enrolled" },
  { label: "State Attendance", value: "85.2%", trend: "+0.8%", icon: "📅", color: "text-amber-400", sub: "monthly avg" },
  { label: "State 10th Pass %", value: "85.4%", trend: "+1.6%", icon: "📊", color: "text-violet-400", sub: "this year" },
  { label: "State Dropout Rate", value: "1.45%", trend: "-0.3%", icon: "📉", color: "text-red-400", sub: "improvement" },
  { label: "Teacher Count", value: "2.84L", trend: "+0.5%", icon: "👩‍🏫", color: "text-pink-400", sub: "state total" },
];

const blockTrends = [
  { year: "2020", students: 108, attendance: 81, pass: 79 },
  { year: "2021", students: 112, attendance: 82, pass: 81 },
  { year: "2022", students: 116, attendance: 83, pass: 83 },
  { year: "2023", students: 120, attendance: 84, pass: 84 },
  { year: "2024", students: 124, attendance: 85, pass: 85 },
];

export default function CommissionerAnalyticsPage() {
  return (
    <PortalLayout title="State Analytics" subtitle="Commissioner · State Operations" avatarLetter="C" avatarColor="#06b6d4" themeClass="theme-commissioner" accentColor="#06b6d4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stateKPIs.map(k => (
          <div key={k.label} className="kpi-card">
            <div className="flex justify-between items-start mb-3">
              <span className="text-2xl">{k.icon}</span>
              <span className={`text-[10px] font-bold ${k.trend.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>{k.trend} {k.sub}</span>
            </div>
            <div className={`text-2xl font-extrabold ${k.color} mb-1`}>{k.value}</div>
            <div className="text-xs text-slate-500 font-semibold">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-base font-semibold text-white mb-4">📈 5-Year State Trend Analysis</h2>
          <div className="space-y-4">
            {blockTrends.map(t => (
              <div key={t.year} className="flex items-center gap-4">
                <span className="text-xs text-slate-500 font-bold w-10">{t.year}</span>
                <div className="flex-1 space-y-1">
                  <div>
                    <div className="flex justify-between text-[9px] text-slate-500 mb-0.5"><span>Students (Lakh)</span><span>{t.students}L</span></div>
                    <div className="h-1.5 bg-slate-800 rounded-full"><div className="h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500" style={{ width: `${(t.students / 130) * 100}%` }} /></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[9px] text-slate-500 mb-0.5"><span>Attendance</span><span>{t.attendance}%</span></div>
                    <div className="h-1.5 bg-slate-800 rounded-full"><div className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${t.attendance}%` }} /></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[9px] text-slate-500 mb-0.5"><span>10th Pass %</span><span>{t.pass}%</span></div>
                    <div className="h-1.5 bg-slate-800 rounded-full"><div className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" style={{ width: `${t.pass}%` }} /></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-base font-semibold text-white mb-4">🤖 AI State Insights</h2>
          <div className="space-y-3">
            {[
              { icon: "📈", text: "Student enrollment grew by 14.8% over 5 years. Positive demographic trend.", severity: "green" },
              { icon: "🎯", text: "10th pass rate improved from 79% to 85.4%. On track to reach 90% by 2027.", severity: "green" },
              { icon: "⚠️", text: "Rural districts still lag by 8-12% in pass rates. Targeted tuition programs needed.", severity: "amber" },
              { icon: "🏗️", text: "Digital classroom penetration at 74%. Full coverage needed for 48K schools.", severity: "amber" },
              { icon: "🔴", text: "Salem and Tirunelveli districts show dropout rates above 2%. Immediate intervention required.", severity: "red" },
              { icon: "💡", text: "AI predicts state pass rate will cross 87% if current trajectory maintained.", severity: "green" },
            ].map((ins, i) => (
              <div key={i} className={`flex gap-2 p-2.5 rounded-xl border ${ins.severity === "green" ? "bg-emerald-500/5 border-emerald-500/15" : ins.severity === "amber" ? "bg-amber-500/5 border-amber-500/15" : "bg-red-500/5 border-red-500/15"}`}>
                <span className="text-xs">{ins.icon}</span>
                <p className={`text-[10px] leading-relaxed ${ins.severity === "green" ? "text-emerald-300" : ins.severity === "amber" ? "text-amber-300" : "text-red-300"}`}>{ins.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
