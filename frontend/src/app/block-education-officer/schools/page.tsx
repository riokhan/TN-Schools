"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface SchoolComparison {
  rank: number;
  name: string;
  students: number;
  attendance: number;
  exam10: number;
  exam12: number;
}

export default function SchoolComparisonsPage() {
  const [schools, setSchools] = useState<SchoolComparison[]>([
    { name: "GHS Coimbatore", students: 1247, attendance: 96, exam10: 94, exam12: 89, rank: 1 },
    { name: "GHS Singanallur", students: 980, attendance: 92, exam10: 88, exam12: 82, rank: 2 },
    { name: "GHSS Ganapathy", students: 1120, attendance: 90, exam10: 85, exam12: 79, rank: 3 },
    { name: "GHS RS Puram", students: 876, attendance: 87, exam10: 81, exam12: 75, rank: 4 },
    { name: "GHS Peelamedu", students: 1050, attendance: 85, exam10: 78, exam12: 70, rank: 5 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form Fields
  const [newName, setNewName] = useState("");
  const [newStudents, setNewStudents] = useState("500");
  const [newAttendance, setNewAttendance] = useState("90");
  const [newExam10, setNewExam10] = useState("85");
  const [newExam12, setNewExam12] = useState("80");

  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const newSchool: SchoolComparison = {
      name: newName,
      students: Number(newStudents),
      attendance: Number(newAttendance),
      exam10: Number(newExam10),
      exam12: Number(newExam12),
      rank: schools.length + 1,
    };

    // Recalculate ranks based on pass % composite
    const updatedSchools = [...schools, newSchool].sort(
      (a, b) => (b.exam10 + b.exam12) / 2 - (a.exam10 + a.exam12) / 2
    );
    updatedSchools.forEach((s, idx) => {
      s.rank = idx + 1;
    });

    setSchools(updatedSchools);
    setNewName("");
    setIsModalOpen(false);
    setToast(`🎉 School '${newSchool.name}' successfully added and ranked.`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleExcelSimulate = () => {
    setIsUploading(true);
    setTimeout(() => {
      const excelSchools: SchoolComparison[] = [
        { name: "GHS Ramanathapuram", students: 720, attendance: 94, exam10: 89, exam12: 83, rank: 0 },
        { name: "GHS Peelamedu Boys", students: 610, attendance: 91, exam10: 84, exam12: 78, rank: 0 },
      ];

      const updatedSchools = [...schools, ...excelSchools].sort(
        (a, b) => (b.exam10 + b.exam12) / 2 - (a.exam10 + a.exam12) / 2
      );
      updatedSchools.forEach((s, idx) => {
        s.rank = idx + 1;
      });

      setSchools(updatedSchools);
      setIsUploading(false);
      setIsModalOpen(false);
      setToast("📊 School roster spreadsheet successfully parsed! 2 new schools ranked in block database.");
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  const filteredSchools = schools.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PortalLayout
      title="School Comparisons & Rankings"
      subtitle="Mr. Murugesan P. · Coimbatore South Block"
      avatarLetter="M"
      avatarColor="#8b5cf6"
      themeClass="theme-beo"
      accentColor="#8b5cf6"
    >
      {/* BEO Block Summaries */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in">
        {[
          { label: "Total Block Schools", value: "24", icon: "🏫", color: "text-violet-400", sub: "Under observation" },
          { label: "Total Student Cohort", value: "22,450", icon: "👨‍🎓", color: "text-emerald-400", sub: "Active enrollment" },
          { label: "Block Mean Attendance", value: "91%", icon: "📅", color: "text-amber-400", sub: "Weekly average" },
          { label: "Target High Performers", value: schools.filter(s => (s.exam10 + s.exam12)/2 >= 85).length.toString(), icon: "🏆", color: "text-cyan-400", sub: "Composite > 85%" },
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

      {/* Directory Card */}
      <div className="glass rounded-2xl p-6 border border-slate-800 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-semibold text-white">🏆 School Comparisons Index</h2>
            <p className="text-xs text-slate-500 leading-relaxed">Comparative performance registry based on attendance rates and SSLC/HSC board outcomes.</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search school name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition-all shadow-md whitespace-nowrap"
            >
              + Register School
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Block Rank</th>
                <th>School Name</th>
                <th>Enrolled Students</th>
                <th>Mean Attendance</th>
                <th>10th Pass %</th>
                <th>12th Pass %</th>
                <th className="text-right">Detail View</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchools.map((s) => (
                <tr key={s.name}>
                  <td>
                    <span className={`badge ${s.rank === 1 ? "badge-green" : s.rank <= 3 ? "badge-blue" : "badge-yellow"}`}>
                      #{s.rank}
                    </span>
                  </td>
                  <td className="font-bold text-white text-xs">{s.name}</td>
                  <td>{s.students.toLocaleString()} students</td>
                  <td>
                    <span className={`badge ${s.attendance >= 93 ? "badge-green" : s.attendance >= 88 ? "badge-yellow" : "badge-red"}`}>
                      {s.attendance}%
                    </span>
                  </td>
                  <td className="text-slate-300">{s.exam10}%</td>
                  <td className="text-blue-400 font-semibold">{s.exam12}%</td>
                  <td className="text-right">
                    <button
                      onClick={() => alert(`Navigating to school audit page for ${s.name}...`)}
                      className="text-xs text-violet-400 hover:text-violet-300 font-bold"
                    >
                      Audit Reports →
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSchools.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500 italic">No matching schools found.</td>
                </tr>
              )}
            </tbody>
          </table>
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
              <h3 className="text-sm font-bold text-white">🏫 Register New School & Metrics</h3>
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
                <div className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-2">Manual Registration</div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">School Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. GHS Ramanathapuram"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Students</label>
                    <input
                      type="number"
                      required
                      value={newStudents}
                      onChange={(e) => setNewStudents(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Attendance %</label>
                    <input
                      type="number"
                      required
                      value={newAttendance}
                      onChange={(e) => setNewAttendance(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">10th Pass %</label>
                    <input
                      type="number"
                      required
                      value={newExam10}
                      onChange={(e) => setNewExam10(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">12th Pass %</label>
                    <input
                      type="number"
                      required
                      value={newExam12}
                      onChange={(e) => setNewExam12(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md mt-2"
                >
                  Register & Rank
                </button>
              </form>

              {/* Excel Import */}
              <div className="border-l border-slate-800 pl-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Excel Import</div>
                  <div
                    onClick={handleExcelSimulate}
                    className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-900/40 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 min-h-[180px]"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                        <span className="text-[10px] text-slate-400">Parsing spreadsheet...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-3xl">📊</span>
                        <span className="text-xs font-bold text-white">Import School List</span>
                        <span className="text-[9px] text-slate-500 leading-normal">
                          Click to simulate dragging <strong>block_school_roster.xlsx</strong> into this dropzone
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 italic leading-relaxed pt-4">
                  * Integrates school codes, DISE parameters and block rankings.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
