"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";

interface StaffMember {
  name: string;
  subject: string;
  attendance: number;
  performance: string;
  leave: number;
}

export default function HeadmasterDashboard() {
  const [staff, setStaff] = useState<StaffMember[]>([
    { name: "Mrs. Sumathi Devi", subject: "Mathematics", attendance: 96, performance: "Excellent", leave: 1 },
    { name: "Mr. Rajan K.", subject: "Science", attendance: 92, performance: "Good", leave: 0 },
    { name: "Mrs. Kavitha S.", subject: "Tamil", attendance: 98, performance: "Excellent", leave: 0 },
    { name: "Mr. Prakash R.", subject: "Social Science", attendance: 88, performance: "Average", leave: 3 },
    { name: "Ms. Deepa N.", subject: "English", attendance: 94, performance: "Good", leave: 1 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSubject, setNewSubject] = useState("Science");
  
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
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
    setIsModalOpen(false);
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
      setIsModalOpen(false);
      setToast("📊 Staff Excel directory successfully imported! 2 teachers added to registry.");
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  return (
    <PortalLayout>
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in">
        {[
          { label: "Total Enrollment", value: "1,247", icon: "👨‍🎓", color: "text-blue-400", sub: "Classes 6–12" },
          { label: "Today's Attendance", value: "96.2%", icon: "📅", color: "text-emerald-400", sub: "1,199 present" },
          { label: "Teaching Staff", value: staff.length.toString(), icon: "👩‍🏫", color: "text-amber-400", sub: `${staff.length} present today` },
          { label: "Dropout Risk", value: "8", icon: "⚠️", color: "text-red-400", sub: "Needs intervention" },
        ].map((kpi) => (
          <div key={kpi.label} className="kpi-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{kpi.icon}</span>
              <span className={`text-xs font-medium ${kpi.color}`}>{kpi.sub}</span>
            </div>
            <div className={`text-3xl font-bold ${kpi.color} mb-1`}>{kpi.value}</div>
            <div className="text-xs text-slate-500">{kpi.label}</div>
          </div>
        ))}
      </div>

      {toast && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Staff Table */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 fade-in-2 border border-slate-800">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">👩‍🏫 Staff Performance</h2>
            <Link
              href="/headmaster/staff"
              id="headmaster-add-staff"
              className="text-xs text-blue-400 hover:text-blue-300 font-bold bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg transition-all"
            >
              + Add Staff
            </Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Subject</th>
                <th>Attendance</th>
                <th>Performance</th>
                <th>Leave Days</th>
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
                    <span className={`badge ${s.performance === "Excellent" ? "badge-green" : s.performance === "Good" ? "badge-blue" : "badge-yellow"}`}>{s.performance}</span>
                  </td>
                  <td className={s.leave >= 3 ? "text-red-400" : "text-slate-400"}>{s.leave}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* School Resources */}
        <div className="glass rounded-2xl p-6 fade-in-3 border border-slate-800">
          <h2 className="text-base font-semibold text-white mb-4">🏗️ School Resources</h2>
          <div className="space-y-3">
            {[
              { label: "Smart Classrooms", value: "8/12", icon: "🖥️", status: "good" },
              { label: "Computer Lab", value: "48 systems", icon: "💻", status: "good" },
              { label: "Library Books", value: "4,200", icon: "📚", status: "good" },
              { label: "Sports Equipment", value: "Needs Repair", icon: "⚽", status: "warn" },
              { label: "Mid-Day Meal Stock", value: "12 days left", icon: "🍛", status: "warn" },
              { label: "Sanitation Blocks", value: "4/4 functional", icon: "🚻", status: "good" },
            ].map((res) => (
              <div key={res.label} className="flex items-center justify-between py-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span>{res.icon}</span>
                  <span className="text-sm text-slate-300">{res.label}</span>
                </div>
                <span className={`text-xs font-medium ${res.status === "good" ? "text-emerald-400" : "text-amber-400"}`}>{res.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mid-Day Meal & Scholarship */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-in-4">
        <div className="glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-base font-semibold text-white mb-4">🍛 Mid-Day Meal Today</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Students Served", value: "1,180", color: "text-emerald-400" },
              { label: "Food Stock (kg)", value: "245", color: "text-blue-400" },
              { label: "Menu", value: "Rice + Sambar", color: "text-amber-400" },
              { label: "Waste %", value: "3.2%", color: "text-slate-400" },
            ].map((m) => (
              <div key={m.label} className="bg-slate-900/60 rounded-xl p-3 border border-slate-850">
                <div className={`text-lg font-bold ${m.color}`}>{m.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-base font-semibold text-white mb-4">🎓 Scholarship Status</h2>
          <div className="space-y-3">
            {[
              { scheme: "BC/MBC Scholarship", eligible: 340, approved: 312, pending: 28 },
              { scheme: "SC/ST Scholarship", eligible: 210, approved: 205, pending: 5 },
              { scheme: "Minority Scholarship", eligible: 45, approved: 38, pending: 7 },
            ].map((sc) => (
              <div key={sc.scheme} className="p-3 bg-slate-900/60 rounded-xl border border-slate-850">
                <div className="text-xs font-semibold text-blue-300 mb-2">{sc.scheme}</div>
                <div className="flex gap-4 text-xs text-slate-400">
                  <span>Eligible: <strong className="text-white">{sc.eligible}</strong></span>
                  <span>Approved: <strong className="text-emerald-400">{sc.approved}</strong></span>
                  <span>Pending: <strong className="text-amber-400">{sc.pending}</strong></span>
                </div>
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
              <h3 className="text-sm font-bold text-white">👩‍🏫 Register New Staff Roster</h3>
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
                  <label className="block text-[10px] text-slate-400 mb-1.5 font-medium">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Mrs. Mala S."
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
                  Register Staff
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
                        <span className="text-xs font-bold text-white">Import Staff Roster</span>
                        <span className="text-[9px] text-slate-500 leading-normal">
                          Click to simulate dragging <strong>staff_roster.xlsx</strong> into this dropzone
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 italic leading-relaxed pt-4">
                  * Dynamic parsing will update active teaching stats.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
