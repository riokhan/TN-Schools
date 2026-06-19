"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface StaffMember {
  name: string;
  subject: string;
  attendance: number;
  performance: "Excellent" | "Good" | "Average";
  leave: number;
}

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<StaffMember[]>([
    { name: "Mrs. Sumathi Devi", subject: "Mathematics", attendance: 96, performance: "Excellent", leave: 1 },
    { name: "Mr. Rajan K.", subject: "Science", attendance: 92, performance: "Good", leave: 0 },
    { name: "Mrs. Kavitha S.", subject: "Tamil", attendance: 98, performance: "Excellent", leave: 0 },
    { name: "Mr. Prakash R.", subject: "Social Science", attendance: 88, performance: "Average", leave: 3 },
    { name: "Ms. Deepa N.", subject: "English", attendance: 94, performance: "Good", leave: 1 },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSubject, setNewSubject] = useState("Science");
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const newTeacher: StaffMember = {
      name: newName,
      subject: newSubject,
      attendance: 100,
      performance: "Good",
      leave: 0,
    };

    setStaff(prev => [...prev, newTeacher]);
    setNewName("");
    setIsAddModalOpen(false);
    setToast(`🎉 ${newTeacher.name} successfully registered to teaching staff registry.`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleExcelSimulate = () => {
    setIsUploading(true);
    setTimeout(() => {
      const excelTeachers: StaffMember[] = [
        { name: "Mrs. Aarthi R.", subject: "English", attendance: 100, performance: "Excellent", leave: 0 },
        { name: "Mr. Vijayakumar S.", subject: "Mathematics", attendance: 97, performance: "Good", leave: 1 },
      ];
      setStaff(prev => [...prev, ...excelTeachers]);
      setIsUploading(false);
      setIsAddModalOpen(false);
      setToast("📊 Staff Excel directory successfully imported! 2 teachers added to registry.");
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  return (
    <PortalLayout
      title="Staff Management"
      subtitle="Mr. Venkatesh R. · GHS Coimbatore · DISE: 33012345"
      avatarLetter="V"
      avatarColor="#3b82f6"
      themeClass="theme-headmaster"
      accentColor="#3b82f6"
    >
      {/* Staff Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in">
        {[
          { label: "Total Teaching Staff", value: staff.length, icon: "👩‍🏫", color: "text-blue-400", sub: "Permanent" },
          { label: "Staff Present Today", value: staff.filter((s) => s.attendance >= 90).length, icon: "🟢", color: "text-emerald-400", sub: "Healthy attendance" },
          { label: "Total Leave Days", value: staff.reduce((acc, curr) => acc + curr.leave, 0), icon: "📄", color: "text-amber-400", sub: "This term cumulative" },
          { label: "Vacancy Status", value: "0", icon: "🏫", color: "text-cyan-400", sub: "All positions filled" },
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

      {/* Main Table */}
      <div className="glass rounded-2xl p-6 border border-slate-800 mb-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-base font-semibold text-white">👩‍🏫 Teaching Staff Directory</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md"
          >
            + Add Teacher
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Teacher Name</th>
                <th>Subject Speciality</th>
                <th>Attendance Rate</th>
                <th>Performance Index</th>
                <th>Leave Balance Used</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.name}>
                  <td className="font-bold text-white text-xs">{s.name}</td>
                  <td>{s.subject}</td>
                  <td>
                    <span className={`badge ${s.attendance >= 95 ? "badge-green" : s.attendance >= 90 ? "badge-yellow" : "badge-red"}`}>{s.attendance}%</span>
                  </td>
                  <td>
                    <span className={`badge ${
                      s.performance === "Excellent"
                        ? "badge-green"
                        : s.performance === "Good"
                        ? "badge-blue"
                        : "badge-yellow"
                    }`}>
                      {s.performance}
                    </span>
                  </td>
                  <td className={s.leave >= 2 ? "text-red-400 font-bold" : "text-slate-400"}>{s.leave} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add teacher modal */}
      {isAddModalOpen && (
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
              <h3 className="text-sm font-bold text-white">👩‍🏫 Register New Teaching Faculty</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form Input */}
              <form onSubmit={handleAddStaff} className="space-y-4">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Manual Entry</div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1.5 font-medium">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Mr. Vignesh K."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1.5 font-medium">Subject Specialty</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Social Science">Social Science</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md mt-2"
                >
                  Register Teacher
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
                        <span className="text-xs font-bold text-white">Import Excel Sheet</span>
                        <span className="text-[9px] text-slate-500 leading-normal">
                          Click to simulate dragging <strong>teacher_roster.xlsx</strong> into this dropzone
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 italic leading-relaxed pt-4">
                  * Auto-sync will map subjects to vacancy checklists.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
