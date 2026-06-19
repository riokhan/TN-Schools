"use client";
import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface PolicyBrief { id: number; title: string; status: string; priority: string; impact: string; districts: number; since: string; aiScore: number; }

const policies: PolicyBrief[] = [
  { id: 1, title: "Zero Dropout Mission 2025", status: "Under Review", priority: "Critical", impact: "61,200 at-risk students", districts: 38, since: "Sep 2024", aiScore: 87 },
  { id: 2, title: "Digital Classroom Full Coverage", status: "Approved", priority: "High", impact: "48,000 schools", districts: 38, since: "Jun 2024", aiScore: 74 },
  { id: 3, title: "Teacher Recruitment Acceleration", status: "Approved", priority: "High", impact: "18,400 projected vacancies", districts: 38, since: "Apr 2024", aiScore: 83 },
  { id: 4, title: "Science Lab Modernization", status: "In Draft", priority: "Medium", impact: "8,400 lab-deficient schools", districts: 30, since: "Nov 2024", aiScore: 65 },
  { id: 5, title: "Girl Child Education Mission Phase 2", status: "Approved", priority: "High", impact: "62L girl students", districts: 38, since: "Aug 2024", aiScore: 91 },
  { id: 6, title: "Rural School Transport Scheme", status: "In Draft", priority: "Medium", impact: "2.1L rural students", districts: 28, since: "Nov 2024", aiScore: 78 },
];

const intelligenceReports = [
  { title: "Comparative Analysis: TN vs National Average", finding: "TN's 10th pass rate (85.4%) exceeds national avg (82.1%) by 3.3%. However, rural-urban gap remains at 8.2% — highest in 5 years.", action: "Targeted rural scheme required." },
  { title: "Early Warning: Dropout Surge in 12 Districts", finding: "AI model identifies 12 districts showing 3-month rolling dropout increase. Primarily driven by economic pressures post-monsoon.", action: "Emergency scholarship disbursement recommended." },
  { title: "Infrastructure ROI Analysis", finding: "Schools that received infrastructure upgrades in 2022-23 show 4.7% improvement in pass rates vs non-upgraded peers. High ROI demonstrated.", action: "Accelerate Phase 3 construction." },
];

export default function MinisterPolicyPage() {
  const [active, setActive] = useState<number | null>(null);
  const sel = policies.find(p => p.id === active);

  return (
    <PortalLayout title="Policy Intelligence" subtitle="Minister · Executive Command Center" avatarLetter="M" avatarColor="#ef4444" themeClass="theme-minister" accentColor="#ef4444">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Policies", value: policies.length.toString(), icon: "💡", color: "text-red-400" },
          { label: "Approved", value: policies.filter(p => p.status === "Approved").length.toString(), icon: "✅", color: "text-emerald-400" },
          { label: "Critical Priority", value: policies.filter(p => p.priority === "Critical").length.toString(), icon: "🔴", color: "text-red-400" },
          { label: "Avg AI Score", value: `${Math.round(policies.reduce((s, p) => s + p.aiScore, 0) / policies.length)}/100`, icon: "🤖", color: "text-violet-400" },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="text-2xl mb-2">{k.icon}</div>
            <div className={`text-2xl font-extrabold ${k.color} mb-1`}>{k.value}</div>
            <div className="text-xs text-slate-500 font-semibold">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-base font-semibold text-white mb-4">💡 Active Policy Intelligence Board</h2>
          <div className="space-y-3">
            {policies.map(p => (
              <div
                key={p.id}
                onClick={() => setActive(active === p.id ? null : p.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${active === p.id ? "border-red-500/40 bg-red-500/5" : "border-slate-800 bg-slate-900/60 hover:border-red-500/20"}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge text-[9px] ${p.status === "Approved" ? "badge-green" : p.status === "In Draft" ? "badge-blue" : "badge-yellow"}`}>{p.status}</span>
                      <span className={`badge text-[9px] ${p.priority === "Critical" ? "badge-red" : p.priority === "High" ? "badge-yellow" : "badge-green"}`}>{p.priority}</span>
                    </div>
                    <div className="text-xs font-bold text-white">{p.title}</div>
                    <div className="text-[10px] text-slate-500">Impact: {p.impact} · {p.districts} districts · Since {p.since}</div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-[10px] text-slate-500 mb-1">AI Readiness</div>
                    <div className={`text-sm font-bold ${p.aiScore >= 85 ? "text-emerald-400" : p.aiScore >= 72 ? "text-amber-400" : "text-red-400"}`}>{p.aiScore}/100</div>
                  </div>
                </div>
                {active === p.id && (
                  <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 gap-3">
                    <button onClick={e => { e.stopPropagation(); alert(`Policy brief exported for: ${p.title}`); }} className="py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all">Export Brief</button>
                    <button onClick={e => { e.stopPropagation(); alert(`Escalation notice sent for: ${p.title}`); }} className="py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition-all">Escalate to Cabinet</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-sm font-semibold text-white mb-4">🤖 Intelligence Reports</h2>
          <div className="space-y-4">
            {intelligenceReports.map((r, i) => (
              <div key={i} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-[10px] font-bold text-red-400 mb-1">{r.title}</div>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-2">{r.finding}</p>
                <div className="text-[9px] font-bold text-amber-400">💡 {r.action}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
