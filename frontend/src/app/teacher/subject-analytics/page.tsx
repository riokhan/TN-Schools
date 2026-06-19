"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface Chapter {
  id: number;
  name: string;
  category: "Physics" | "Chemistry" | "Biology";
  progress: number;
  avgScore: number;
  status: "Completed" | "In Progress" | "Not Started";
}

export default function SubjectAnalyticsPage() {
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: 1, name: "Laws of Motion & Gravitation", category: "Physics", progress: 100, avgScore: 82, status: "Completed" },
    { id: 2, name: "Optics & Light Phenomena", category: "Physics", progress: 100, avgScore: 78, status: "Completed" },
    { id: 3, name: "Atoms and Molecules", category: "Chemistry", progress: 85, avgScore: 71, status: "In Progress" },
    { id: 4, name: "Periodic Classification of Elements", category: "Chemistry", progress: 60, avgScore: 68, status: "In Progress" },
    { id: 5, name: "Structural Organization of Life", category: "Biology", progress: 30, avgScore: 75, status: "In Progress" },
    { id: 6, name: "Genetics and Evolution", category: "Biology", progress: 0, avgScore: 0, status: "Not Started" },
  ]);

  const [activeCategory, setActiveCategory] = useState<"All" | "Physics" | "Chemistry" | "Biology">("All");

  // AI Projection states
  const [isProjecting, setIsProjecting] = useState(false);
  const [projectionResult, setProjectionResult] = useState<string | null>(null);

  const filteredChapters = chapters.filter(c => activeCategory === "All" || c.category === activeCategory);

  const handlePredictCompletion = () => {
    setIsProjecting(true);
    setProjectionResult(null);
    setTimeout(() => {
      setIsProjecting(false);
      setProjectionResult(
        "Based on current velocity (approx. 2.1 lessons/week) and upcoming holidays, the Science syllabus is projected to be fully completed by November 21, 2026. This is 6 days ahead of the state-mandated deadline! 🎉"
      );
    }, 1500);
  };

  return (
    <PortalLayout title="Subject Analytics" subtitle="Syllabus coverage progress, exam scores, and learning gaps analysis.">
      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in">
        {[
          { label: "Syllabus Progress", value: "62.5%", icon: "📖", color: "text-amber-400", sub: "Goal: 100% by Dec" },
          { label: "Class Average", value: "74.8%", icon: "📈", color: "text-emerald-400", sub: "State Avg: 68%" },
          { label: "Chapters Taught", value: "4 / 6", icon: "🔬", color: "text-blue-400", sub: "2 remaining" },
          { label: "Syllabus Status", value: "On Track", icon: "✅", color: "text-cyan-400", sub: "Velocity healthy" },
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
        {/* Chapters and Syllabus progress */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-base font-semibold text-white">📚 Chapter Coverage Directory</h2>
            
            {/* Category tabs filters */}
            <div className="flex gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
              {(["All", "Physics", "Chemistry", "Biology"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeCategory === cat
                      ? "bg-amber-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredChapters.map((chapter) => (
              <div key={chapter.id} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{chapter.category}</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{chapter.name}</h3>
                  </div>
                  <span className={`badge ${
                    chapter.status === "Completed"
                      ? "badge-green"
                      : chapter.status === "In Progress"
                      ? "badge-yellow"
                      : "badge-gray"
                  }`}>
                    {chapter.status}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 progress-bar">
                    <div
                      className="progress-fill bg-gradient-to-r from-amber-500 to-orange-500"
                      style={{ width: `${chapter.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-300 w-10 text-right">{chapter.progress}%</span>
                </div>

                {chapter.progress > 0 && (
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
                    <span>Class Performance Average:</span>
                    <span className="font-bold text-emerald-400 text-xs">{chapter.avgScore}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Prediction and Performance distribution */}
        <div className="space-y-6">
          {/* AI Syllabus Planner Assistant */}
          <div className="glass rounded-2xl p-6 border border-slate-800">
            <h2 className="text-base font-semibold text-white mb-3">🤖 AI Syllabus Deadline Predictor</h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Calculates syllabus completion schedules by correlating class progress trends against public holidays, exam breaks, and revision requirements.
            </p>
            <button
              onClick={handlePredictCompletion}
              disabled={isProjecting}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
            >
              {isProjecting ? "Analyzing Teaching Velocity..." : "⚡ Run AI Deadline Analysis"}
            </button>

            {isProjecting && (
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 p-3 bg-slate-900/60 rounded-xl border border-slate-800 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                Calculating predictive schedule models...
              </div>
            )}

            {projectionResult && (
              <div className="mt-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-xs text-slate-300 leading-relaxed">
                {projectionResult}
              </div>
            )}
          </div>

          {/* Score distribution visual report */}
          <div className="glass rounded-2xl p-6 border border-slate-800">
            <h2 className="text-base font-semibold text-white mb-4">📊 Grade Distribution — Science</h2>
            <div className="space-y-3.5">
              {[
                { grade: "A+ (90-100)", count: 24, percent: 35, color: "from-emerald-500 to-teal-500" },
                { grade: "A (80-89)", count: 32, percent: 45, color: "from-blue-500 to-cyan-500" },
                { grade: "B (70-79)", count: 18, percent: 25, color: "from-indigo-500 to-purple-500" },
                { grade: "C (60-69)", count: 12, percent: 18, color: "from-amber-500 to-orange-500" },
                { grade: "F (<60)", count: 4, percent: 6, color: "from-red-500 to-pink-500" },
              ].map((item) => (
                <div key={item.grade} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">{item.grade}</span>
                    <span className="text-slate-200">{item.count} students ({item.percent}%)</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill bg-gradient-to-r ${item.color}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
