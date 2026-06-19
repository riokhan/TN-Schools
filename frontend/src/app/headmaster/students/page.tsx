"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface ClassStat {
  grade: string;
  enrolled: number;
  attendance: number;
  averageScore: number;
}

interface WatchlistStudent {
  name: string;
  class: string;
  risk: "High" | "Medium";
  reason: string;
}

export default function StudentsMonitoringPage() {
  const [classStats, setClassStats] = useState<ClassStat[]>([
    { grade: "Class 6", enrolled: 180, attendance: 95, averageScore: 78 },
    { grade: "Class 7", enrolled: 175, attendance: 94, averageScore: 76 },
    { grade: "Class 8", enrolled: 192, attendance: 96, averageScore: 81 },
    { grade: "Class 9", enrolled: 188, attendance: 92, averageScore: 74 },
    { grade: "Class 10", enrolled: 198, attendance: 91, averageScore: 72 },
    { grade: "Class 11", enrolled: 154, attendance: 93, averageScore: 79 },
    { grade: "Class 12", enrolled: 160, attendance: 95, averageScore: 83 },
  ]);

  const [watchlist, setWatchlist] = useState<WatchlistStudent[]>([
    { name: "Murugan S.", class: "Class 10A", risk: "High", reason: "Persistent absences (12 days this month)" },
    { name: "Senthil K.", class: "Class 8A", risk: "High", reason: "Syllabus test scores dropped below 30%" },
    { name: "Kavitha R.", class: "Class 9B", risk: "Medium", reason: "Missing practical lab submissions" },
    { name: "Vijay A.", class: "Class 11C", risk: "Medium", reason: "Unexcused consecutive weekly absences" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newClass, setNewClass] = useState("Class 10A");
  const [newRisk, setNewRisk] = useState<"High" | "Medium">("Medium");
  const [newReason, setNewReason] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const newStudent: WatchlistStudent = {
      name: newName,
      class: newClass,
      risk: newRisk,
      reason: newReason || "Flagged for periodic monitoring by class teacher.",
    };

    setWatchlist(prev => [newStudent, ...prev]);
    setNewName("");
    setNewReason("");
    setIsModalOpen(false);
    setToast(`🎉 Student ${newStudent.name} successfully appended to dropout watchlist.`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleExcelSimulate = () => {
    setIsUploading(true);
    setTimeout(() => {
      const excelStudents: WatchlistStudent[] = [
        { name: "Mani K.", class: "Class 10B", risk: "High", reason: "Missed final revision modules (Excel)" },
        { name: "Deepika S.", class: "Class 12A", risk: "Medium", reason: "Medical leave for 15 consecutive days (Excel)" },
      ];
      setWatchlist(prev => [...excelStudents, ...prev]);
      setIsUploading(false);
      setIsModalOpen(false);
      setToast("📊 Student roster parsed successfully! 2 students added to dropout watchlist.");
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  const highRiskCount = watchlist.filter(s => s.risk === "High").length;
  const mediumRiskCount = watchlist.filter(s => s.risk === "Medium").length;

  return (
    <PortalLayout
      title="Student Monitoring & Watchlist"
      subtitle="Mr. Venkatesh R. · GHS Coimbatore · DISE: 33012345"
      avatarLetter="V"
      avatarColor="#3b82f6"
      themeClass="theme-headmaster"
      accentColor="#3b82f6"
    >
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in">
        {[
          { label: "Total Enrollment", value: "1,247", icon: "👨‍🎓", color: "text-blue-400", sub: "Classes 6–12" },
          { label: "Average Attendance", value: "96.2%", icon: "📅", color: "text-emerald-400", sub: "1,199 present today" },
          { label: "High Risk Count", value: highRiskCount.toString(), icon: "⚠️", color: "text-red-400", sub: "Needs urgent action" },
          { label: "Medium Risk Count", value: mediumRiskCount.toString(), icon: "📊", color: "text-amber-400", sub: "Under observation" },
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

      {toast && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Class summaries */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-slate-800">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-base font-semibold text-white">🏫 Grade-wise Performance Index</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md"
            >
              + Add Student / Roster
            </button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Grade</th>
                <th>Enrolled</th>
                <th>Attendance</th>
                <th>Average Score</th>
              </tr>
            </thead>
            <tbody>
              {classStats.map((c) => (
                <tr key={c.grade}>
                  <td className="font-medium text-white">{c.grade}</td>
                  <td>{c.enrolled} students</td>
                  <td>
                    <span className={`badge ${c.attendance >= 94 ? "badge-green" : "badge-yellow"}`}>{c.attendance}%</span>
                  </td>
                  <td className="text-blue-400 font-semibold">{c.averageScore}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Watchlist */}
        <div className="glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-base font-semibold text-white mb-4">⚠️ Student Dropout Watchlist</h2>
          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
            {watchlist.map((s, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs ${
                  s.risk === "High" ? "border-red-500/20 bg-red-500/5" : "border-amber-500/20 bg-amber-500/5"
                }`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <div>
                    <h4 className="font-bold text-white text-sm">{s.name}</h4>
                    <span className="text-[10px] text-slate-500 font-semibold">{s.class}</span>
                  </div>
                  <span className={`badge ${s.risk === "High" ? "badge-red" : "badge-yellow"}`}>{s.risk} Risk</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">{s.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="w-full max-w-lg rounded-3xl p-6 space-y-6 relative"
            style={{
              background: "#090d16",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.95)"
            }}
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">🎓 Register New Student & Flag Risks</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form Input */}
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Manual Entry</div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Senthil Kumar"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Class & Section</label>
                  <input
                    type="text"
                    required
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    placeholder="e.g. Class 10A"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Dropout Risk Rating</label>
                    <select
                      value={newRisk}
                      onChange={(e) => setNewRisk(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="Medium">Medium Risk</option>
                      <option value="High">High Risk</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Risk Reason / Note</label>
                  <textarea
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    placeholder="Absent details, poor math marks..."
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md mt-2"
                >
                  Save Student Record
                </button>
              </form>

              {/* Excel Import */}
              <div className="border-l border-slate-800 pl-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Excel Import</div>
                  <div
                    onClick={handleExcelSimulate}
                    className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-900/40 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 min-h-[160px]"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                        <span className="text-[10px] text-slate-400">Parsing spreadsheet...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-3xl">📊</span>
                        <span className="text-xs font-bold text-white">Import Student Roster</span>
                        <span className="text-[9px] text-slate-500 leading-normal">
                          Click to simulate dragging <strong>student_roster.xlsx</strong> into this dropzone
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 italic leading-relaxed pt-4">
                  * Integrates directly into EMIS database to verify community welfare claims.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
