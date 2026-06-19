"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface DeploymentOrder {
  id: number;
  teacherName: string;
  subject: string;
  sourceSchool: string;
  targetSchool: string;
  status: "Completed" | "Pending Approval" | "Cancelled";
  date: string;
}

export default function TeacherDeploymentPage() {
  const [orders, setOrders] = useState<DeploymentOrder[]>([
    { id: 1, teacherName: "Mrs. Kalaivani R.", subject: "Mathematics", sourceSchool: "GHS Peelamedu", targetSchool: "GHS Coimbatore", status: "Completed", date: "June 05, 2026" },
    { id: 2, teacherName: "Mr. Rajendran M.", subject: "Science", sourceSchool: "GHS RS Puram", targetSchool: "GHSS Ganapathy", status: "Pending Approval", date: "June 14, 2026" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teacherName, setTeacherName] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [source, setSource] = useState("GHS Peelamedu");
  const [target, setTarget] = useState("GHS Coimbatore");

  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName) return;

    const newOrder: DeploymentOrder = {
      id: Date.now(),
      teacherName,
      subject,
      sourceSchool: source,
      targetSchool: target,
      status: "Pending Approval",
      date: "Today",
    };

    setOrders(prev => [newOrder, ...prev]);
    setTeacherName("");
    setIsModalOpen(false);
    setToast(`🎉 Transfer directive for ${newOrder.teacherName} logged successfully!`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleExcelSimulate = () => {
    setIsUploading(true);
    setTimeout(() => {
      const excelOrders: DeploymentOrder[] = [
        { id: 3, teacherName: "Mrs. Deepa K.", subject: "Tamil", sourceSchool: "GHS Peelamedu", targetSchool: "GHS Coimbatore", status: "Completed", date: "Today (Excel)" },
        { id: 4, teacherName: "Mr. Selvaraj V.", subject: "English", sourceSchool: "GHS RS Puram", targetSchool: "GHS Singanallur", status: "Completed", date: "Today (Excel)" },
      ];
      setOrders(prev => [...excelOrders, ...prev]);
      setIsUploading(false);
      setIsModalOpen(false);
      setToast("📊 Transfer directives roster parsed successfully! 2 new deployments executed.");
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  return (
    <PortalLayout
      title="Teacher Deployment & Vacancies"
      subtitle="Mr. Murugesan P. · Coimbatore South Block"
      avatarLetter="M"
      avatarColor="#8b5cf6"
      themeClass="theme-beo"
      accentColor="#8b5cf6"
    >
      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">Mathematics</span>
          <div className="text-xl font-bold text-white">44 / 48 Deployed</div>
          <span className="badge badge-yellow mt-2">-4 Shortage</span>
        </div>
        <div className="glass p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">Science</span>
          <div className="text-xl font-bold text-white">35 / 36 Deployed</div>
          <span className="badge badge-yellow mt-2">-1 Shortage</span>
        </div>
        <div className="glass p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">English</span>
          <div className="text-xl font-bold text-white">27 / 30 Deployed</div>
          <span className="badge badge-yellow mt-2">-3 Shortage</span>
        </div>
        <div className="glass p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">Tamil & Langs</span>
          <div className="text-xl font-bold text-white">36 / 36 Deployed</div>
          <span className="badge badge-green mt-2">Fully Deployed</span>
        </div>
      </div>

      {toast && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* Orders log table */}
      <div className="glass rounded-2xl p-6 border border-slate-800 mb-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-base font-semibold text-white">📋 Teacher Transfer & Deployment Log</h2>
            <p className="text-xs text-slate-500 leading-relaxed">Official directives issued for balancing pupil-teacher ratios.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition-all shadow-md font-medium"
          >
            + Deploy / Transfer Teacher
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Teacher Name</th>
                <th>Subject Speciality</th>
                <th>Source School</th>
                <th>Target School</th>
                <th>Audit Date</th>
                <th>Status</th>
                <th className="text-right">Order Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="font-bold text-white text-xs">{o.teacherName}</td>
                  <td>{o.subject}</td>
                  <td className="text-slate-450">{o.sourceSchool}</td>
                  <td className="text-blue-400 font-semibold">{o.targetSchool}</td>
                  <td className="text-slate-500 font-medium">{o.date}</td>
                  <td>
                    <span className={`badge ${
                      o.status === "Completed"
                        ? "badge-green"
                        : o.status === "Pending Approval"
                        ? "badge-yellow"
                        : "badge-red"
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => {
                        setOrders(prev =>
                          prev.map(item =>
                            item.id === o.id ? { ...item, status: "Completed" } : item
                          )
                        );
                        alert(`✓ Transfer directive for ${o.teacherName} approved! Mapped to DISE portals.`);
                      }}
                      disabled={o.status === "Completed"}
                      className="px-2.5 py-1 bg-violet-500/10 hover:bg-violet-500/20 disabled:bg-slate-800 disabled:text-slate-600 text-violet-400 border border-violet-500/20 rounded-md font-bold text-[10px] transition-all"
                    >
                      ✓ Approve
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
              <h3 className="text-sm font-bold text-white">👩‍🏫 Deploy & Transfer Faculty</h3>
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
                <div className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-2">Manual Directives</div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Teacher Name</label>
                  <input
                    type="text"
                    required
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="e.g. Mrs. Aarthi R."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Subject Specialty</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Social Science">Social Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Source School</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="GHS Peelamedu">GHS Peelamedu</option>
                    <option value="GHS RS Puram">GHS RS Puram</option>
                    <option value="GHS Singanallur">GHS Singanallur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Target School</label>
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="GHS Coimbatore">GHS Coimbatore</option>
                    <option value="GHSS Ganapathy">GHSS Ganapathy</option>
                    <option value="GHS Singanallur">GHS Singanallur</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md mt-2"
                >
                  Post Directives
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
                        <span className="text-xs font-bold text-white">Import Deployments</span>
                        <span className="text-[9px] text-slate-500 leading-normal">
                          Click to simulate dragging <strong>teacher_transfers.xlsx</strong> into this dropzone
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 italic leading-relaxed pt-4">
                  * Automatic transfer allocations will sync to pupil-teacher registries.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
