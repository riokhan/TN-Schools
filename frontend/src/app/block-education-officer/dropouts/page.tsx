"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface DropoutStudent {
  id: number;
  name: string;
  schoolName: string;
  grade: string;
  risk: "High" | "Medium" | "Resolved";
  reason: string;
}

export default function DropoutsPage() {
  const [students, setStudents] = useState<DropoutStudent[]>([
    { id: 1, name: "Murugan S.", schoolName: "GHS Coimbatore", grade: "Class 10A", risk: "High", reason: "Persistent absences (12 days this month)" },
    { id: 2, name: "Senthil K.", schoolName: "GHS Coimbatore", grade: "Class 8A", risk: "High", reason: "Syllabus test scores dropped below 30%" },
    { id: 3, name: "Kavitha R.", schoolName: "GHS Coimbatore", grade: "Class 9B", risk: "Resolved", reason: "Missing practical lab submissions solved" },
    { id: 4, name: "Vijay A.", schoolName: "GHS Coimbatore", grade: "Class 11C", risk: "Medium", reason: "Unexcused consecutive weekly absences" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [school, setSchool] = useState("GHS Coimbatore");
  const [grade, setGrade] = useState("Class 10A");
  const [risk, setRisk] = useState<"High" | "Medium">("High");
  const [reason, setReason] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName) return;

    const newStudent: DropoutStudent = {
      id: Date.now(),
      name: studentName,
      schoolName: school,
      grade,
      risk,
      reason,
    };

    setStudents(prev => [newStudent, ...prev]);
    setStudentName("");
    setReason("");
    setIsModalOpen(false);
    setToast(`🎉 Student ${newStudent.name} registered on dropout watchlist.`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleExcelSimulate = () => {
    setIsUploading(true);
    setTimeout(() => {
      const excelStudents: DropoutStudent[] = [
        { id: 5, name: "Kumaran V.", schoolName: "GHS Peelamedu", grade: "Class 10B", risk: "High", reason: "Working in local brick kilns (Excel)" },
        { id: 6, name: "Akil S.", schoolName: "GHS RS Puram", grade: "Class 9A", risk: "Medium", reason: "Migrated family location (Excel)" },
      ];
      setStudents(prev => [...excelStudents, ...prev]);
      setIsUploading(false);
      setIsModalOpen(false);
      setToast("📊 Dropout risk spreadsheet parsed successfully! 2 new students flagged for counseling.");
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  return (
    <PortalLayout
      title="Dropouts Tracking & Counseling"
      subtitle="Mr. Murugesan P. · Coimbatore South Block"
      avatarLetter="M"
      avatarColor="#8b5cf6"
      themeClass="theme-beo"
      accentColor="#8b5cf6"
    >
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">High Risk Cases</span>
          <div className="text-2xl font-black text-rose-500 mt-2">
            {students.filter((s) => s.risk === "High").length} Students
          </div>
          <span className="text-[10px] text-slate-500 font-bold block mt-1">Immediate action needed</span>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Medium Risk Cases</span>
          <div className="text-2xl font-black text-amber-500 mt-2">
            {students.filter((s) => s.risk === "Medium").length} Students
          </div>
          <span className="text-[10px] text-slate-500 font-bold block mt-1">Periodic counseling</span>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Counseled / Resolved</span>
          <div className="text-2xl font-black text-emerald-400 mt-2">
            {students.filter((s) => s.risk === "Resolved").length} Students
          </div>
          <span className="text-[10px] text-slate-500 font-bold block mt-1">Returned to classrooms</span>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Block Cases</span>
          <div className="text-2xl font-black text-white mt-2">
            {students.length} Cases
          </div>
          <span className="text-[10px] text-slate-500 font-bold block mt-1">DISE block registries</span>
        </div>
      </div>

      {toast && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* Directory Table */}
      <div className="glass rounded-2xl p-6 border border-slate-800 mb-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-base font-semibold text-white">📉 Dropout Risk & Counseling Watchlist</h2>
            <p className="text-xs text-slate-500 leading-relaxed">Students flagged for chronic absenteeism or risk indices under observation.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition-all shadow-md"
          >
            + Flag Dropout Student
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>School name</th>
                <th>Grade Section</th>
                <th>Primary Risk Factors</th>
                <th>Risk Rating</th>
                <th className="text-right">Counseling Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="font-bold text-white text-xs">{s.name}</td>
                  <td>{s.schoolName}</td>
                  <td className="text-slate-400">{s.grade}</td>
                  <td className="text-xs text-slate-350 max-w-sm leading-relaxed">{s.reason}</td>
                  <td>
                    <span className={`badge ${
                      s.risk === "High"
                        ? "badge-red"
                        : s.risk === "Medium"
                        ? "badge-yellow"
                        : "badge-green"
                    }`}>
                      {s.risk} Risk
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => {
                        setStudents(prev =>
                          prev.map(item =>
                            item.id === s.id ? { ...item, risk: "Resolved" } : item
                          )
                        );
                        alert(`✓ Marked student ${s.name} as Counseled/Resolved!`);
                      }}
                      disabled={s.risk === "Resolved"}
                      className="px-2 py-1 bg-violet-500/10 hover:bg-violet-500/20 disabled:bg-slate-800 disabled:text-slate-600 text-violet-400 border border-violet-500/20 rounded-md font-bold text-[10px] transition-all"
                    >
                      ✓ Resolve Case
                    </button>
                  </td>
                </tr>
              ))}
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
              <h3 className="text-sm font-bold text-white">📉 Flag Dropout Student & Counseling Order</h3>
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
                <div className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-2">Manual Entry</div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Student Name</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Mani K."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Select School</label>
                    <select
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                    >
                      <option value="GHS Coimbatore">GHS Coimbatore</option>
                      <option value="GHS Peelamedu">GHS Peelamedu</option>
                      <option value="GHS RS Puram">GHS RS Puram</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Grade</label>
                    <input
                      type="text"
                      required
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="Class 10A"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Risk Rating</label>
                  <select
                    value={risk}
                    onChange={(e) => setRisk(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="High">High Risk</option>
                    <option value="Medium">Medium Risk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Primary Risk Reason</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Describe main factors..."
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md mt-2"
                >
                  Post Watchlist
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
                        <span className="text-xs font-bold text-white">Import Student Risks</span>
                        <span className="text-[9px] text-slate-500 leading-normal">
                          Click to simulate dragging <strong>block_dropouts_roster.xlsx</strong> into this dropzone
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 italic leading-relaxed pt-4">
                  * Dynamic parsing maps to block counselor allocations.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
