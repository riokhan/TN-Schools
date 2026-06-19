"use client";
import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

// Interface for subject grades and analytics
interface SubjectDetail {
  subject: string;
  teacher: string;
  unit1: number;
  unit2: number;
  midterm: number;
  halfyearly: number;
  grade: string;
  classAverage: number;
  remarks: string;
  attendance: string;
}

// Simulated database response
const performanceData: SubjectDetail[] = [
  {
    subject: "Mathematics",
    teacher: "Mrs. Sumathi Devi",
    unit1: 88,
    unit2: 92,
    midterm: 85,
    halfyearly: 94,
    grade: "A+",
    classAverage: 71,
    remarks: "Excellent logical skills. Eager participant in solving classroom problems.",
    attendance: "98%"
  },
  {
    subject: "Science",
    teacher: "Mr. Rajendran K.",
    unit1: 75,
    unit2: 78,
    midterm: 72,
    halfyearly: 81,
    grade: "A",
    classAverage: 65,
    remarks: "Good understanding of concepts. Can improve in experimental diagrams.",
    attendance: "92%"
  },
  {
    subject: "Tamil",
    teacher: "Mrs. Thenmozhi M.",
    unit1: 90,
    unit2: 88,
    midterm: 91,
    halfyearly: 93,
    grade: "O (Outstanding)",
    classAverage: 78,
    remarks: "Exceptional language command. Creative writing and grammar skills are top-notch.",
    attendance: "96%"
  },
  {
    subject: "English",
    teacher: "Mr. Christopher J.",
    unit1: 82,
    unit2: 84,
    midterm: 80,
    halfyearly: 86,
    grade: "A+",
    classAverage: 70,
    remarks: "Very active in reading exercises. Needs to focus slightly more on spelling consistency.",
    attendance: "94%"
  },
  {
    subject: "Social Science",
    teacher: "Mrs. Malarvizhi S.",
    unit1: 70,
    unit2: 74,
    midterm: 68,
    halfyearly: 76,
    grade: "B+",
    classAverage: 62,
    remarks: "Shows interest in historical topics. Needs more preparation for map drawing exercises.",
    attendance: "90%"
  }
];

export default function ChildPerformance() {
  const [activeTerm, setActiveTerm] = useState<"unit1" | "unit2" | "midterm" | "halfyearly">("halfyearly");
  const [selectedSubject, setSelectedSubject] = useState<string>("Mathematics");

  const termLabels = {
    unit1: "Unit Test 1",
    unit2: "Unit Test 2",
    midterm: "Midterm Exam",
    halfyearly: "Half-Yearly Exam",
  };

  // Get marks for active subject to show in trend chart
  const activeSubjectData = performanceData.find((s) => s.subject === selectedSubject);

  // SVG Chart Dimensions
  const chartWidth = 500;
  const chartHeight = 200;
  const padding = 30;

  // Convert mark to Y coordinate (0 - 100 mark mapped to chartHeight)
  const getX = (index: number) => padding + (index * (chartWidth - padding * 2)) / 3;
  const getY = (mark: number) => chartHeight - padding - (mark * (chartHeight - padding * 2)) / 100;

  // Points for SVG path
  const studentTrendPoints = activeSubjectData
    ? [
        { label: "Unit 1", x: getX(0), y: getY(activeSubjectData.unit1), val: activeSubjectData.unit1 },
        { label: "Unit 2", x: getX(1), y: getY(activeSubjectData.unit2), val: activeSubjectData.unit2 },
        { label: "Midterm", x: getX(2), y: getY(activeSubjectData.midterm), val: activeSubjectData.midterm },
        { label: "Half Yearly", x: getX(3), y: getY(activeSubjectData.halfyearly), val: activeSubjectData.halfyearly },
      ]
    : [];

  const classAvgTrendPoints = activeSubjectData
    ? [
        { x: getX(0), y: getY(activeSubjectData.classAverage - 5) }, // estimated unit averages
        { x: getX(1), y: getY(activeSubjectData.classAverage + 2) },
        { x: getX(2), y: getY(activeSubjectData.classAverage) },
        { x: getX(3), y: getY(activeSubjectData.classAverage + 3) },
      ]
    : [];

  const makePath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return "";
    return `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ");
  };

  const makeAreaPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return "";
    const linePath = makePath(points);
    return `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;
  };

  return (
    <PortalLayout
      title="Child Performance Tracker"
      subtitle="Comprehensive Academic Analytics & Progress Reports for Priya"
    >
      {/* TODO: Connect backend APIs to fetch actual student performance record by EMIS ID */}
      {/* Example API Hook Placeholder:
          useEffect(() => {
            fetchPerformanceData(emisId).then(data => setData(data));
          }, [emisId]);
      */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Academic Overview Chart */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-base font-semibold text-white">📈 Performance Trend Chart</h2>
              <p className="text-xs text-slate-500">Visual trend comparing Priya&apos;s score with the class average</p>
            </div>
            {/* Subject Selector */}
            <div className="relative">
              <select
                id="perf-subject-selector"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {performanceData.map((s) => (
                  <option key={s.subject} value={s.subject}>
                    {s.subject}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="relative flex justify-center py-4 bg-slate-950/40 rounded-2xl border border-slate-800/80">
            {activeSubjectData ? (
              <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="max-w-full">
                <defs>
                  {/* Glowing effects */}
                  <linearGradient id="studentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y-axis guidelines */}
                {[0, 25, 50, 75, 100].map((level) => (
                  <g key={level}>
                    <line
                      x1={padding}
                      y1={getY(level)}
                      x2={chartWidth - padding}
                      y2={getY(level)}
                      stroke="#1e293b"
                      strokeWidth="1"
                      strokeDasharray={level === 0 || level === 100 ? "0" : "4 4"}
                    />
                    <text
                      x={padding - 5}
                      y={getY(level) + 4}
                      fill="#64748b"
                      fontSize="9"
                      textAnchor="end"
                    >
                      {level}
                    </text>
                  </g>
                ))}

                {/* Area under Student Line */}
                <path d={makeAreaPath(studentTrendPoints)} fill="url(#studentGrad)" />

                {/* Class Average Line (Dashed) */}
                <path
                  d={makePath(classAvgTrendPoints)}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />

                {/* Student Mark Line */}
                <path
                  d={makePath(studentTrendPoints)}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                />

                {/* Data Points */}
                {studentTrendPoints.map((pt, i) => (
                  <g key={i}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="5"
                      fill="#10b981"
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      fill="#fff"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {pt.val}%
                    </text>
                    <text
                      x={pt.x}
                      y={chartHeight - 8}
                      fill="#64748b"
                      fontSize="9"
                      textAnchor="middle"
                    >
                      {pt.label}
                    </text>
                  </g>
                ))}
              </svg>
            ) : (
              <div className="text-xs text-slate-500">No subject selected</div>
            )}
          </div>
          <div className="flex justify-center gap-6 mt-4 text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-emerald-500 rounded-full"></span>
              <span className="text-slate-400">Priya&apos;s Marks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-red-500 border border-dashed rounded-full"></span>
              <span className="text-slate-400">Class Average</span>
            </div>
          </div>
        </div>

        {/* Quick Highlights Card */}
        <div className="glass rounded-2xl p-6 fade-in-2 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-white mb-4">🏆 Quick Highlights</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-xl bg-emerald-500/10 p-2 rounded-xl text-emerald-400">🚀</span>
                <div>
                  <h4 className="text-xs font-semibold text-white">Strength Area</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Top performing in <strong>Mathematics</strong> &amp; <strong>Tamil</strong> (exceeding 90% in both).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl bg-amber-500/10 p-2 rounded-xl text-amber-400">📈</span>
                <div>
                  <h4 className="text-xs font-semibold text-white">Improvement Area</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Showed a 5% gain in <strong>Science</strong> from Midterm (72%) to Half-Yearly (81%).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl bg-blue-500/10 p-2 rounded-xl text-blue-400">💡</span>
                <div>
                  <h4 className="text-xs font-semibold text-white">Class Position</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Currently holds <strong>Rank #5</strong> out of 42 students based on Class 9B composite score.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-4 mt-4">
            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Upcoming Assessment</div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Class 9B Revision Test</span>
                <span className="text-amber-400 font-semibold">June 28, 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Marks breakdown and exam view */}
      <div className="glass rounded-2xl p-6 mb-6 fade-in-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-800 pb-5">
          <div>
            <h2 className="text-base font-semibold text-white">📊 Mark Distribution & Teacher Feedback</h2>
            <p className="text-xs text-slate-500">Change terms to view marks and specific teacher feedback</p>
          </div>
          {/* Term Selector Tabs */}
          <div className="flex bg-slate-950/60 border border-slate-800 p-1.5 rounded-xl gap-1">
            {(["unit1", "unit2", "midterm", "halfyearly"] as const).map((term) => (
              <button
                key={term}
                id={`term-tab-${term}`}
                onClick={() => setActiveTerm(term)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTerm === term
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-700/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {termLabels[term]}
              </button>
            ))}
          </div>
        </div>

        {/* Marks Table */}
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Subject Teacher</th>
                <th className="text-center">Score Obtained</th>
                <th className="text-center">Class Average</th>
                <th>Remarks & Suggested Actions</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((s) => {
                const score = s[activeTerm];
                const passing = score >= 40;
                return (
                  <tr key={s.subject} className="group">
                    <td className="font-semibold text-white">{s.subject}</td>
                    <td className="text-slate-400 text-xs">{s.teacher}</td>
                    <td className="text-center font-bold">
                      <span className={`text-base ${score >= 85 ? "text-emerald-400" : score >= 75 ? "text-blue-400" : score >= 50 ? "text-amber-400" : "text-red-400"}`}>
                        {score}
                      </span>
                      <span className="text-slate-600 text-xs font-normal"> / 100</span>
                    </td>
                    <td className="text-center font-medium text-slate-400 text-xs">
                      {s.classAverage}%
                    </td>
                    <td className="max-w-xs text-xs text-slate-300 leading-relaxed truncate group-hover:whitespace-normal group-hover:overflow-visible">
                      {s.remarks}
                    </td>
                    <td>
                      <span className={`badge ${parseInt(s.attendance) >= 92 ? "badge-green" : "badge-yellow"}`}>
                        {s.attendance}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Skills Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-in-4">
        {/* Core Strengths */}
        <div className="glass rounded-2xl p-6 border-l-4 border-l-emerald-500">
          <h3 className="text-sm font-semibold text-white mb-3">🌟 Priya&apos;s Core Strengths</h3>
          <ul className="space-y-3">
            {[
              { title: "Mathematical Thinking", desc: "Solves linear equations and algebra problems very fast. Shows strong abstract reasoning." },
              { title: "Verbal Command", desc: "Fluent reading comprehension in both Tamil and English. Displays solid vocabulary retention." },
              { title: "Class Engagement", desc: "Highly cooperative, asks meaningful questions during classroom teaching, and coordinates well in team sessions." }
            ].map((strength) => (
              <li key={strength.title} className="bg-slate-900/40 rounded-xl p-3 border border-slate-800">
                <div className="text-xs font-bold text-emerald-400 mb-0.5">{strength.title}</div>
                <p className="text-xs text-slate-400">{strength.desc}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Focus Areas */}
        <div className="glass rounded-2xl p-6 border-l-4 border-l-amber-500">
          <h3 className="text-sm font-semibold text-white mb-3">⚠️ Recommended Focus Areas</h3>
          <ul className="space-y-3">
            {[
              { title: "Scientific Illustration", desc: "Needs practice in biological and physical system diagrams (labeling plants, electric circuits)." },
              { title: "Conceptual Social Science", desc: "Geography map markings and chronological historical timelines need additional practice." },
              { title: "Calculative Speed under pressure", desc: "Tends to perform silly operational mistakes during exam timed-pressure. Suggesting daily practice." }
            ].map((focus) => (
              <li key={focus.title} className="bg-slate-900/40 rounded-xl p-3 border border-slate-800">
                <div className="text-xs font-bold text-amber-400 mb-0.5">{focus.title}</div>
                <p className="text-xs text-slate-400">{focus.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PortalLayout>
  );
}
