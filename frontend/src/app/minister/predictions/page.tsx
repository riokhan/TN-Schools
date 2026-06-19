"use client";
import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

const predictions = [
  {
    id: 1,
    category: "Academic Performance",
    title: "10th Board Pass Rate — 2025 Forecast",
    prediction: "87.2%",
    confidence: 91,
    trend: "UP",
    detail: "Based on mid-year mock exam data from 48K schools, current attendance trends, and teacher deployment analytics.",
    recommendations: ["Deploy 400 additional Mathematics tutors to Tirunelveli & Salem", "Launch AI-based remedial modules for 85K at-risk students", "Ensure 100% completion of school syllabus by Feb 2025"],
    color: "text-emerald-400",
  },
  {
    id: 2,
    category: "Dropout Risk",
    title: "Annual Dropout Prediction — 2024-25",
    prediction: "61,200 students",
    confidence: 87,
    trend: "DOWN",
    detail: "Predictive model trained on 5 years of data flags 61,200 students at high risk of dropping out. Economic reasons (42%), migration (28%), early marriage (18%).",
    recommendations: ["Intensify intervention in Annur, Mettupalayam, and Dharmapuri blocks", "Activate emergency scholarship disbursement for 24K economic-risk students", "Deploy mobile counselling teams to 12 high-risk taluks"],
    color: "text-red-400",
  },
  {
    id: 3,
    category: "Infrastructure",
    title: "Schools Needing Critical Repair — FY2025-26",
    prediction: "4,820 schools",
    confidence: 94,
    trend: "UP",
    detail: "AI analysis of infrastructure audit data and age-of-building records predicts 4,820 schools will require urgent structural attention in the next financial year.",
    recommendations: ["Allocate ₹2,800 Cr in FY2025-26 budget for school infrastructure", "Prioritize 1,200 schools in flood-prone coastal districts", "Initiate PPP model for fast-tracking construction in 500 schools"],
    color: "text-amber-400",
  },
  {
    id: 4,
    category: "Teacher Supply",
    title: "Teacher Shortage Projection — 2026",
    prediction: "18,400 vacancies",
    confidence: 83,
    trend: "UP",
    detail: "With 14,200 teachers retiring by 2026 and current recruitment pace, the state faces a projected shortage of 18,400 positions by 2026.",
    recommendations: ["Fast-track TRB (Teacher Recruitment Board) examinations", "Increase direct recruitment quota by 40% in FY2025-26", "Introduce guest-teacher scheme for Science and Mathematics"],
    color: "text-violet-400",
  },
];

export default function MinisterPredictionsPage() {
  const [active, setActive] = useState<number>(1);
  const sel = predictions.find(p => p.id === active)!;

  return (
    <PortalLayout title="AI Predictions" subtitle="Minister · Executive Command Center" avatarLetter="M" avatarColor="#ef4444" themeClass="theme-minister" accentColor="#ef4444">
      <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
        <p className="text-xs text-red-300">🤖 <strong>AI Intelligence Engine</strong> — Powered by 5 years of state education data, 48,000 school feeds, and predictive ML models. Confidence intervals shown.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {predictions.map(p => (
          <div
            key={p.id}
            onClick={() => setActive(p.id)}
            className={`kpi-card cursor-pointer transition-all ${active === p.id ? "ring-2 ring-red-500/40 bg-red-500/5" : "hover:scale-[1.02]"}`}
          >
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">{p.category}</div>
            <div className={`text-xl font-extrabold ${p.color} mb-2`}>{p.prediction}</div>
            <div className="text-[10px] text-slate-400 leading-tight mb-3">{p.title}</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full"><div className="h-1.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500" style={{ width: `${p.confidence}%` }} /></div>
              <span className="text-[10px] text-red-400 font-bold">{p.confidence}%</span>
            </div>
            <div className="text-[9px] text-slate-600 mt-1">Confidence</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">AI Analysis:</span>
          <h2 className="text-base font-semibold text-white">{sel.title}</h2>
          <span className={`badge ml-auto ${sel.trend === "UP" ? "badge-red" : "badge-green"}`}>{sel.trend === "UP" ? "📈 Rising" : "📉 Declining"}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 mb-4">
              <div className="text-[10px] text-slate-500 mb-1">Predicted Value</div>
              <div className={`text-3xl font-extrabold ${sel.color}`}>{sel.prediction}</div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-[10px] text-slate-400">Confidence:</span>
                <div className="flex-1 h-2 bg-slate-800 rounded-full"><div className="h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500" style={{ width: `${sel.confidence}%` }} /></div>
                <span className="text-xs font-bold text-red-400">{sel.confidence}%</span>
              </div>
            </div>
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-500 mb-2 font-bold">AI ANALYSIS</div>
              <p className="text-xs text-slate-300 leading-relaxed">{sel.detail}</p>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-3">Ministerial Action Recommendations</div>
            <div className="space-y-3">
              {sel.recommendations.map((r, i) => (
                <div key={i} className="flex gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-red-500/20 transition-all">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{r}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => alert("Action plan exported and dispatched to relevant departments.")}
              className="mt-4 w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-all"
            >
              🚀 Dispatch Action Plan to Departments
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
