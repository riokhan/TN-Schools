"use client";
import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

const outcomes = [
  { block: "Coimbatore South", literacy: 95, numeracy: 93, science: 91, overall: 93.0 },
  { block: "Coimbatore North", literacy: 92, numeracy: 89, science: 87, overall: 89.3 },
  { block: "Pollachi", literacy: 89, numeracy: 86, science: 83, overall: 86.0 },
  { block: "Mettupalayam", literacy: 86, numeracy: 82, science: 79, overall: 82.3 },
  { block: "Annur", literacy: 82, numeracy: 78, science: 74, overall: 78.0 },
];

const trendData = [
  { year: "2020", pass10: 78, pass12: 72 },
  { year: "2021", pass10: 81, pass12: 75 },
  { year: "2022", pass10: 84, pass12: 78 },
  { year: "2023", pass10: 86, pass12: 81 },
  { year: "2024", pass10: 87, pass12: 83 },
];

export default function LearningOutcomesPage() {
  const [activeBlock, setActiveBlock] = useState("Coimbatore South");
  const sel = outcomes.find(o => o.block === activeBlock)!;

  return (
    <PortalLayout title="Learning Outcomes" subtitle="DEO Officer · Coimbatore District" avatarLetter="D" avatarColor="#ec4899" themeClass="theme-deo" accentColor="#ec4899">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "District Literacy Rate", value: "89%", icon: "📖", color: "text-pink-400" },
          { label: "Numeracy Rate", value: "86%", icon: "🔢", color: "text-violet-400" },
          { label: "10th Pass % (2024)", value: "87%", icon: "📊", color: "text-emerald-400" },
          { label: "12th Pass % (2024)", value: "83%", icon: "🎓", color: "text-amber-400" },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="text-2xl mb-2">{k.icon}</div>
            <div className={`text-2xl font-extrabold ${k.color} mb-1`}>{k.value}</div>
            <div className="text-xs text-slate-500 font-semibold">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-base font-semibold text-white mb-4">📈 Block-wise Learning Outcomes</h2>
          <div className="space-y-2 mb-4">
            {outcomes.map(o => (
              <button key={o.block} onClick={() => setActiveBlock(o.block)} className={`w-full flex justify-between items-center p-2 rounded-xl text-xs transition-all ${activeBlock === o.block ? "bg-pink-500/20 border border-pink-500/30" : "hover:bg-slate-800"}`}>
                <span className="text-slate-300 font-semibold">{o.block}</span>
                <span className={`font-bold ${o.overall >= 90 ? "text-emerald-400" : o.overall >= 85 ? "text-amber-400" : "text-red-400"}`}>{o.overall}%</span>
              </button>
            ))}
          </div>
          {sel && (
            <div className="mt-4 p-4 bg-slate-900/60 rounded-xl border border-slate-800">
              <div className="text-pink-400 font-bold text-xs mb-3">{sel.block} — Competency Breakdown</div>
              {[{ label: "Literacy", val: sel.literacy }, { label: "Numeracy", val: sel.numeracy }, { label: "Science", val: sel.science }].map(m => (
                <div key={m.label} className="mb-2">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1"><span>{m.label}</span><span className="font-bold text-white">{m.val}%</span></div>
                  <div className="h-1.5 bg-slate-800 rounded-full"><div className="h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500" style={{ width: `${m.val}%` }} /></div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-base font-semibold text-white mb-4">📊 5-Year Performance Trend</h2>
          <div className="space-y-3">
            {trendData.map(t => (
              <div key={t.year} className="flex items-center gap-3">
                <div className="w-10 text-xs text-slate-500 font-bold">{t.year}</div>
                <div className="flex-1">
                  <div className="flex gap-1 mb-1">
                    <div className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500" style={{ width: `${t.pass10}%` }} />
                  </div>
                  <div className="flex gap-1">
                    <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" style={{ width: `${t.pass12}%` }} />
                  </div>
                </div>
                <div className="text-right text-[10px]">
                  <div className="text-pink-400 font-bold">{t.pass10}%</div>
                  <div className="text-violet-400">{t.pass12}%</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-1.5"><div className="w-3 h-1.5 rounded bg-pink-500" /><span className="text-[10px] text-slate-400">10th Pass %</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-1.5 rounded bg-violet-500" /><span className="text-[10px] text-slate-400">12th Pass %</span></div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
