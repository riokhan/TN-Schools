"use client";
import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";



interface AnalyticsStudent {
  rollNo: string;
  name: string;
  attendance: number;
  homeworkRate: number;
  avgScore: number;
  weakTopics: string[];
  status: "Good" | "Average" | "Risk";
}

const classAnalyticsData: Record<string, {
  summary: { avgScore: number; attendance: number; hwRate: number; riskCount: number };
  mastery: { topic: string; score: number; status: "mastered" | "developing" | "critical" }[];
  distribution: { grade: string; count: number; height: string }[];
  students: AnalyticsStudent[];
}> = {
  "10a": {
    summary: { avgScore: 76, attendance: 94, hwRate: 88, riskCount: 2 },
    mastery: [
      { topic: "Real Numbers", score: 88, status: "mastered" },
      { topic: "Polynomials", score: 79, status: "developing" },
      { topic: "Pair of Linear Equations", score: 75, status: "developing" },
      { topic: "Quadratic Equations", score: 62, status: "developing" },
      { topic: "Arithmetic Progressions", score: 81, status: "mastered" },
      { topic: "Trigonometry Basics", score: 54, status: "critical" },
    ],
    distribution: [
      { grade: "A (90%+)", count: 12, height: "80%" },
      { grade: "B (80-89%)", count: 15, height: "100%" },
      { grade: "C (70-79%)", count: 8, height: "55%" },
      { grade: "D (60-69%)", count: 5, height: "35%" },
      { grade: "E/F (<60%)", count: 2, height: "15%" },
    ],
    students: [
      { rollNo: "10A01", name: "Aarthi V.", attendance: 98, homeworkRate: 95, avgScore: 89, weakTopics: ["Trigonometry Basics"], status: "Good" },
      { rollNo: "10A02", name: "Balaji R.", attendance: 92, homeworkRate: 88, avgScore: 74, weakTopics: ["Quadratic Equations", "Trigonometry Basics"], status: "Average" },
      { rollNo: "10A03", name: "Kavitha R.", attendance: 85, homeworkRate: 48, avgScore: 48, weakTopics: ["Polynomials", "Quadratic Equations", "Trigonometry Basics"], status: "Risk" },
      { rollNo: "10A04", name: "Manoj K.", attendance: 96, homeworkRate: 94, avgScore: 92, weakTopics: [], status: "Good" },
      { rollNo: "10A05", name: "Priya S.", attendance: 94, homeworkRate: 90, avgScore: 81, weakTopics: ["Trigonometry Basics"], status: "Good" },
      { rollNo: "10A06", name: "Rajesh M.", attendance: 89, homeworkRate: 80, avgScore: 62, weakTopics: ["Quadratic Equations"], status: "Average" },
    ]
  },
  "10b": {
    summary: { avgScore: 71, attendance: 89, hwRate: 82, riskCount: 4 },
    mastery: [
      { topic: "Real Numbers", score: 82, status: "mastered" },
      { topic: "Polynomials", score: 71, status: "developing" },
      { topic: "Pair of Linear Equations", score: 68, status: "developing" },
      { topic: "Quadratic Equations", score: 55, status: "critical" },
      { topic: "Arithmetic Progressions", score: 74, status: "developing" },
      { topic: "Trigonometry Basics", score: 48, status: "critical" },
    ],
    distribution: [
      { grade: "A (90%+)", count: 5, height: "45%" },
      { grade: "B (80-89%)", count: 11, height: "85%" },
      { grade: "C (70-79%)", count: 14, height: "100%" },
      { grade: "D (60-69%)", count: 6, height: "50%" },
      { grade: "E/F (<60%)", count: 4, height: "35%" },
    ],
    students: [
      { rollNo: "10B01", name: "Dinesh K.", attendance: 91, homeworkRate: 85, avgScore: 70, weakTopics: ["Quadratic Equations", "Trigonometry Basics"], status: "Average" },
      { rollNo: "10B02", name: "Murugan S.", attendance: 78, homeworkRate: 60, avgScore: 52, weakTopics: ["Polynomials", "Quadratic Equations", "Trigonometry Basics"], status: "Risk" },
      { rollNo: "10B03", name: "Nalini P.", attendance: 95, homeworkRate: 90, avgScore: 88, weakTopics: ["Trigonometry Basics"], status: "Good" },
      { rollNo: "10B04", name: "Senthil K.", attendance: 82, homeworkRate: 40, avgScore: 41, weakTopics: ["Linear Equations", "Quadratic Equations", "Trigonometry Basics"], status: "Risk" },
      { rollNo: "10B05", name: "Uma G.", attendance: 90, homeworkRate: 82, avgScore: 76, weakTopics: ["Quadratic Equations"], status: "Average" },
    ]
  }
};

export default function AnalyticsPage() {
  const [selectedClassId, setSelectedClassId] = useState("10a");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Good" | "Average" | "Risk">("All");

  const activeAnalytics = classAnalyticsData[selectedClassId] || classAnalyticsData["10a"];
  const summary = activeAnalytics.summary;

  const filteredStudents = activeAnalytics.students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.rollNo.includes(searchQuery);
    const matchesStatus = statusFilter === "All" || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <PortalLayout
      title="Student Analytics"
      subtitle="Examine section score performance, lesson completions, and learning breakdowns"
    >
      <div className="flex flex-col gap-6">
        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedClassId("10a")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedClassId === "10a" ? "bg-amber-500 text-white" : "bg-slate-900 text-slate-400 hover:bg-slate-850"
              }`}
            >
              Class 10A - Maths
            </button>
            <button
              onClick={() => setSelectedClassId("10b")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedClassId === "10b" ? "bg-amber-500 text-white" : "bg-slate-900 text-slate-400 hover:bg-slate-850"
              }`}
            >
              Class 10B - Maths
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Data sync: <span className="text-emerald-400">Live (5 minutes ago)</span>
          </div>
        </div>

        {/* KPI Summaries Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Class Average Score", value: `${summary.avgScore}%`, icon: "📈", color: "text-amber-400", desc: "Term average" },
            { label: "Mean Attendance", value: `${summary.attendance}%`, icon: "📅", color: "text-emerald-400", desc: "This semester" },
            { label: "Homework Completes", value: `${summary.hwRate}%`, icon: "📝", color: "text-blue-400", desc: "Last 5 tasks" },
            { label: "Interventions Flashed", value: `${summary.riskCount}`, icon: "⚠️", color: "text-red-400", desc: "Action required" },
          ].map((kpi) => (
            <div key={kpi.label} className="kpi-card">
              <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
                <span>{kpi.label}</span>
                <span className="text-lg">{kpi.icon}</span>
              </div>
              <div className={`text-2xl font-bold ${kpi.color} mb-1`}>{kpi.value}</div>
              <div className="text-[10px] text-slate-500">{kpi.desc}</div>
            </div>
          ))}
        </div>

        {/* Charts & Mastery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grade Distribution Chart */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-white font-semibold text-xs mb-6 uppercase tracking-wider">📊 Grade Distribution</h3>
            
            <div className="flex items-end justify-between h-40 gap-3 px-2">
              {activeAnalytics.distribution.map((d) => (
                <div key={d.grade} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="text-[10px] text-amber-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.count}
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-amber-600/70 to-amber-400 rounded-t-lg transition-all group-hover:scale-x-105"
                    style={{ height: d.height }}
                  />
                  <div className="text-[10px] text-slate-500 font-mono text-center truncate w-full mt-1">
                    {d.grade.split(" ")[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Mastery checklist */}
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <h3 className="text-white font-semibold text-xs mb-5 uppercase tracking-wider">🎯 Concept Mastery Index</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeAnalytics.mastery.map((m) => (
                <div
                  key={m.topic}
                  className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-850 flex justify-between items-center"
                >
                  <div>
                    <div className="text-xs text-white font-semibold">{m.topic}</div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="progress-bar w-24">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${m.score}%`,
                            background: m.status === "mastered" ? "#10b981" : m.status === "developing" ? "#f59e0b" : "#ef4444",
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500">{m.score}%</span>
                    </div>
                  </div>
                  <span className={`badge ${
                    m.status === "mastered" ? "badge-green" : m.status === "developing" ? "badge-yellow" : "badge-red"
                  } text-[9px]`}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Students Detailed performance table */}
        <div className="glass rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-white font-semibold text-sm">📋 Student Diagnostics Directory</h3>
              <p className="text-xs text-slate-550">Review performance details and key concept gaps of each pupil.</p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <input
                type="text"
                placeholder="Search name/roll..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-amber-500"
              />

              <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                {(["All", "Good", "Average", "Risk"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setStatusFilter(opt)}
                    className={`px-3 py-1 rounded-md text-[10px] font-semibold transition-all ${
                      statusFilter === opt ? "bg-amber-500 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Attendance</th>
                  <th>Homework submissions</th>
                  <th>Exam Average</th>
                  <th>Identified Concept Gaps</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((st) => (
                  <tr key={st.rollNo}>
                    <td className="font-mono text-xs">{st.rollNo}</td>
                    <td className="font-semibold text-white">{st.name}</td>
                    <td>
                      <span className={`font-semibold ${st.attendance >= 90 ? "text-emerald-400" : "text-amber-400"}`}>
                        {st.attendance}%
                      </span>
                    </td>
                    <td>{st.homeworkRate}%</td>
                    <td className="font-bold text-white">{st.avgScore}%</td>
                    <td>
                      {st.weakTopics.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {st.weakTopics.map((topic) => (
                            <span key={topic} className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-medium">
                              {topic}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-medium">No active gaps found</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${
                        st.status === "Good" ? "badge-green" : st.status === "Average" ? "badge-yellow" : "badge-red"
                      }`}>
                        {st.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-slate-500 text-xs py-8">
                      No student records match your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
