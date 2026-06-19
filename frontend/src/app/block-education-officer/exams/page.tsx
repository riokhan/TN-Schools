"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface ExamStat {
  schoolName: string;
  pass10th: number;
  pass12th: number;
  candidates: number;
  averageScore: number;
}

export default function ExamAnalyticsPage() {
  const [examStats, setExamStats] = useState<ExamStat[]>([
    { schoolName: "GHS Coimbatore", pass10th: 94, pass12th: 89, candidates: 257, averageScore: 412 },
    { schoolName: "GHS Singanallur", pass10th: 88, pass12th: 82, candidates: 198, averageScore: 388 },
    { schoolName: "GHSS Ganapathy", pass10th: 85, pass12th: 79, candidates: 230, averageScore: 375 },
    { schoolName: "GHS RS Puram", pass10th: 81, pass12th: 75, candidates: 165, averageScore: 360 },
    { schoolName: "GHS Peelamedu", pass10th: 78, pass12th: 70, candidates: 190, averageScore: 342 },
  ]);

  // Form State
  const [target10th, setTarget10th] = useState(90);
  const [target12th, setTarget12th] = useState(85);
  const [coachingPlan, setCoachingPlan] = useState("Weekly Saturday Special Mock Exams for Class 10 & 12 underperforming students");
  const [directiveToast, setDirectiveToast] = useState<string | null>(null);

  const handlePublishDirective = (e: React.FormEvent) => {
    e.preventDefault();
    setDirectiveToast(`✓ Board Coaching Directive published to all ${examStats.length} schools in the block! Target set to SSLC ${target10th}% and HSC ${target12th}%.`);
    setTimeout(() => setDirectiveToast(null), 4000);
  };

  return (
    <PortalLayout
      title="Board Examination Analytics"
      subtitle="Mr. Murugesan P. · Coimbatore South Block"
      avatarLetter="M"
      avatarColor="#8b5cf6"
      themeClass="theme-beo"
      accentColor="#8b5cf6"
    >
      {/* Board Result KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in">
        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">SSLC Pass Mean</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">85.2%</span>
            <span className="text-[10px] text-emerald-400 font-bold">State target: 82%</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-semibold">
            Based on recent block revision cycles.
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">HSC Pass Mean</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-blue-400">79.0%</span>
            <span className="text-[10px] text-slate-400 font-bold">Awaiting improvement</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-semibold">
            Peelamedu & RS Puram flagged below average.
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Candidates Registered</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-amber-450">1,040 Students</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-semibold">
            DISE database verified list.
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Mean Score Index</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-emerald-400">375.4</span>
            <span className="text-[10px] text-slate-400 font-bold">/500 SSLC</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-semibold">
            +18.2 point growth this cycle.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Performance roster */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-base font-semibold text-white mb-2">📋 School-wise Exam Score Index</h2>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">Breakdown of pass rates for the 10th and 12th board exams across Coimbatore South Block.</p>

          <div className="space-y-4">
            {examStats.map((s, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-900/60 rounded-xl border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{s.schoolName}</h3>
                  <div className="text-xs text-slate-450">
                    Candidates: <strong className="text-slate-350">{s.candidates}</strong> · Mean Score: <span className="text-emerald-400 font-bold">{s.averageScore}/500</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-slate-550 block">10th Pass</span>
                    <span className={`text-xs font-bold ${s.pass10th >= 85 ? "text-emerald-400" : "text-yellow-400"}`}>{s.pass10th}%</span>
                  </div>
                  <div className="text-right border-l border-slate-800 pl-4">
                    <span className="text-[9px] uppercase font-bold text-slate-550 block">12th Pass</span>
                    <span className={`text-xs font-bold ${s.pass12th >= 80 ? "text-blue-400" : "text-yellow-400"}`}>{s.pass12th}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Board */}
        <div className="glass rounded-2xl p-6 border border-slate-800 h-fit">
          <h2 className="text-base font-semibold text-white mb-2">🎯 Set Block-level Goals</h2>
          <p className="text-xs text-slate-500 leading-relaxed mb-4 font-medium">
            Define pass rate thresholds and publish mandatory coaching/remedial directives to all HMs.
          </p>

          <form onSubmit={handlePublishDirective} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-semibold">10th Target %</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={target10th}
                  onChange={(e) => setTarget10th(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-semibold">12th Target %</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={target12th}
                  onChange={(e) => setTarget12th(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Mandated Remedial Action Plan</label>
              <textarea
                value={coachingPlan}
                onChange={(e) => setCoachingPlan(e.target.value)}
                rows={4}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-violet-500 transition-colors resize-none leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Publish Board Target Directive
            </button>
          </form>

          {directiveToast && (
            <div className="mt-4 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl leading-relaxed">
              {directiveToast}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
