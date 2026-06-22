"use client";

import React, { useState, useRef } from "react";
import PortalLayout from "@/components/PortalLayout";
import * as XLSX from "xlsx";

interface ParsedPreviewStudent {
  id: number;
  name: string;
  class: string;
  risk: "High" | "Medium";
  reason: string;
  isValid: boolean;
  validationError?: string;
}

interface ExcelStudentRow {
  "Student Name"?: string;
  "Class & Section"?: string;
  "Risk Level"?: string;
  "Reason / Note"?: string;
}

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
  const [previewStudents, setPreviewStudents] = useState<ParsedPreviewStudent[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadExcelTemplate = () => {
    const headers = ["Student Name", "Class & Section", "Risk Level", "Reason / Note"];
    const sampleData = [
      {
        "Student Name": "Arun Kumar",
        "Class & Section": "Class 10A",
        "Risk Level": "High",
        "Reason / Note": "Absent for 10 consecutive days"
      },
      {
        "Student Name": "Priya S.",
        "Class & Section": "Class 9B",
        "Risk Level": "Medium",
        "Reason / Note": "Consistently low marks in mathematics"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Template");
    XLSX.writeFile(workbook, "student_import_template.xlsx");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) parseFile(file);
  };

  const parseFile = (file: File) => {
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json<ExcelStudentRow>(sheet);

        const validated: ParsedPreviewStudent[] = parsedData.map((row, idx) => {
          const name = row["Student Name"]?.toString().trim() || "";
          const classSection = row["Class & Section"]?.toString().trim() || "";
          const rawRisk = row["Risk Level"]?.toString().trim() || "";
          const reason = row["Reason / Note"]?.toString().trim() || "";

          let risk: "High" | "Medium" = "Medium";
          if (rawRisk.toLowerCase() === "high") {
            risk = "High";
          }

          const isValid = name !== "";

          return {
            id: idx,
            name,
            class: classSection || "Not Specified",
            risk,
            reason: reason || "Flagged for periodic monitoring.",
            isValid,
            validationError: !name ? "Name is missing" : undefined
          };
        });

        setPreviewStudents(validated);
        setToast(`📊 Loaded ${validated.length} students. Review preview in the modal.`);
        setTimeout(() => setToast(null), 4000);
      } catch (err) {
        console.error(err);
        setToast("❌ Failed to parse file. Make sure it is a valid Excel or CSV sheet.");
        setTimeout(() => setToast(null), 4000);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleConfirmImport = () => {
    const validStudents = previewStudents.filter(s => s.isValid);
    if (validStudents.length === 0) {
      setToast("⚠️ No valid students to import.");
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const studentsToAppend: WatchlistStudent[] = validStudents.map(s => ({
      name: s.name,
      class: s.class,
      risk: s.risk,
      reason: s.reason
    }));

    setWatchlist(prev => [...studentsToAppend, ...prev]);
    setToast(`🎉 Successfully imported ${validStudents.length} students into watchlist!`);
    setTimeout(() => setToast(null), 4000);

    setPreviewStudents([]);
    setIsModalOpen(false);
  };

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
    setToast(`🎉 Student ${newStudent.name} successfully appended to student watchlist.`);
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
      setToast("📊 Student roster parsed successfully! 2 students added to student watchlist.");
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
          <h2 className="text-base font-semibold text-white mb-4">⚠️ Student List</h2>
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
            className={`w-full ${previewStudents.length > 0 ? "max-w-2xl" : "max-w-lg"} rounded-3xl p-6 space-y-6 relative transition-all duration-300`}
            style={{
              background: "#090d16",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.95)"
            }}
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                {previewStudents.length > 0 ? "📋 Preview Roster Import" : "🎓 Register New Student & Flag Risks"}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setPreviewStudents([]);
                }}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            {previewStudents.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <div className="font-bold text-emerald-400 uppercase tracking-wider">
                    Parsed {previewStudents.length} Students
                  </div>
                  <div className="text-slate-400 font-semibold">
                    {previewStudents.filter(s => !s.isValid).length} invalid rows found
                  </div>
                </div>

                <div className="max-h-[300px] overflow-y-auto border border-slate-800 rounded-xl bg-slate-950/50">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/60 sticky top-0">
                        <th className="p-3 text-slate-400 font-semibold">Student Name</th>
                        <th className="p-3 text-slate-400 font-semibold">Class</th>
                        <th className="p-3 text-slate-400 font-semibold">Risk Level</th>
                        <th className="p-3 text-slate-400 font-semibold">Reason</th>
                        <th className="p-3 text-slate-400 font-semibold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {previewStudents.map((s) => (
                        <tr 
                          key={s.id} 
                          className={s.isValid ? "hover:bg-slate-900/30" : "bg-red-950/20 hover:bg-red-950/30"}
                        >
                          <td className="p-3 font-semibold text-white">
                            {s.name || <span className="text-red-400 italic">Name Missing</span>}
                          </td>
                          <td className="p-3 text-slate-300">{s.class}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              s.risk === "High" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}>
                              {s.risk}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400 max-w-[150px] truncate" title={s.reason}>
                            {s.reason}
                          </td>
                          <td className="p-3 text-right">
                            {s.isValid ? (
                              <span className="text-emerald-400 font-medium">✓ Ready</span>
                            ) : (
                              <span className="text-red-400 font-semibold" title={s.validationError}>
                                ⚠️ Invalid
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={handleConfirmImport}
                    disabled={previewStudents.filter(s => s.isValid).length === 0}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-colors shadow-md flex items-center justify-center space-x-2"
                  >
                    <span>Confirm Import ({previewStudents.filter(s => s.isValid).length} Students)</span>
                  </button>
                  <button
                    onClick={() => setPreviewStudents([])}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors border border-slate-700"
                  >
                    Discard
                  </button>
                </div>
              </div>
            ) : (
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
                      <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Risk Rating</label>
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
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex justify-between items-center">
                      <span>Excel Import</span>
                      <button
                        onClick={downloadExcelTemplate}
                        type="button"
                        className="text-[10px] text-blue-400 hover:text-blue-300 font-bold underline cursor-pointer"
                      >
                        📥 Get Template
                      </button>
                    </div>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 min-h-[160px] ${
                        isDragging 
                          ? "border-emerald-500 bg-emerald-500/5" 
                          : "border-slate-700 hover:border-emerald-500/50 bg-slate-900/40"
                      }`}
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
                            Drag & drop Excel or click to upload
                          </span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) parseFile(file);
                      }}
                      accept=".xlsx,.xls,.csv"
                      className="hidden"
                    />
                  </div>

                  <div className="text-[10px] text-slate-500 italic leading-relaxed pt-4">
                    * Integrates directly into EMIS database to verify community welfare claims.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
