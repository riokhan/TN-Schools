"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface BlockGrievance {
  id: number;
  topic: string;
  raisedBy: string;
  schoolName: string;
  priority: "High" | "Medium" | "Low";
  status: "Under Review" | "Approved" | "Resolved";
}

export default function GrievancesPage() {
  const [grievances, setGrievances] = useState<BlockGrievance[]>([
    { id: 1, topic: "Transport facility delays in Zone B", raisedBy: "12 parents", schoolName: "GHS Coimbatore", priority: "High", status: "Under Review" },
    { id: 2, topic: "Request for extra special classes for 10th", raisedBy: "PTA Committee", schoolName: "GHS Singanallur", priority: "Medium", status: "Resolved" },
    { id: 3, topic: "RO Water filter service required in block C", raisedBy: "Class 7 Rep", schoolName: "GHS Coimbatore", priority: "High", status: "Resolved" },
    { id: 4, topic: "Physics syllabus coverage lagging behind schedules", raisedBy: "Parents Council", schoolName: "GHS Peelamedu", priority: "Medium", status: "Under Review" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [raisedBy, setRaisedBy] = useState("Parents Association");
  const [school, setSchool] = useState("GHS Coimbatore");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");

  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    const newGrievance: BlockGrievance = {
      id: Date.now(),
      topic,
      raisedBy,
      schoolName: school,
      priority,
      status: "Under Review",
    };

    setGrievances(prev => [newGrievance, ...prev]);
    setTopic("");
    setIsModalOpen(false);
    setToast(`🎉 Grievance regarding '${newGrievance.topic}' registered successfully.`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleExcelSimulate = () => {
    setIsUploading(true);
    setTimeout(() => {
      const excelGrievances: BlockGrievance[] = [
        { id: 5, topic: "Smart classroom panel software crash", raisedBy: "Computer Teacher", schoolName: "GHS RS Puram", priority: "High", status: "Under Review" },
        { id: 6, topic: "Sanitation block cleaning supply deficit", raisedBy: "HM Office", schoolName: "GHS Peelamedu", priority: "Low", status: "Under Review" },
      ];
      setGrievances(prev => [...excelGrievances, ...prev]);
      setIsUploading(false);
      setIsModalOpen(false);
      setToast("📊 Grievance tickets spreadsheet parsed successfully! 2 new logs filed.");
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  return (
    <PortalLayout
      title="Grievance Redressal Board"
      subtitle="Mr. Murugesan P. · Coimbatore South Block"
      avatarLetter="M"
      avatarColor="#8b5cf6"
      themeClass="theme-beo"
      accentColor="#8b5cf6"
    >
      {/* Redressal counter */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Filed Logs</span>
          <div className="text-2xl font-black text-white mt-2">
            {grievances.length} Tickets
          </div>
          <span className="text-[10px] text-slate-500 font-bold block mt-1">DISE block synced</span>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Under Active Review</span>
          <div className="text-2xl font-black text-yellow-450 mt-2">
            {grievances.filter((g) => g.status === "Under Review").length} Tickets
          </div>
          <span className="text-[10px] text-slate-500 font-bold block mt-1">Audit in progress</span>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Resolved Cases</span>
          <div className="text-2xl font-black text-emerald-400 mt-2">
            {grievances.filter((g) => g.status === "Resolved").length} Resolved
          </div>
          <span className="text-[10px] text-slate-500 font-bold block mt-1">98% resolution rate</span>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">High Priority Cases</span>
          <div className="text-2xl font-black text-rose-500 mt-2">
            {grievances.filter((g) => g.priority === "High" && g.status !== "Resolved").length} Critical
          </div>
          <span className="text-[10px] text-slate-500 font-bold block mt-1">Immediate intervention</span>
        </div>
      </div>

      {toast && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* Roster ledger */}
      <div className="glass rounded-2xl p-6 border border-slate-800 mb-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-base font-semibold text-white">⚖️ Grievances Roster & Action Board</h2>
            <p className="text-xs text-slate-500 leading-relaxed">PTA concerns, infrastructure deficits, and educational logistics disputes logged under the block.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition-all shadow-md"
          >
            + File New Grievance
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Grievance Topic</th>
                <th>Raised By</th>
                <th>School Origin</th>
                <th>Priority</th>
                <th>Resolution Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {grievances.map((g) => (
                <tr key={g.id}>
                  <td className="font-bold text-white text-xs max-w-xs truncate">{g.topic}</td>
                  <td>{g.raisedBy}</td>
                  <td className="text-slate-450">{g.schoolName}</td>
                  <td>
                    <span className={`badge ${
                      g.priority === "High"
                        ? "badge-red"
                        : g.priority === "Medium"
                        ? "badge-yellow"
                        : "badge-blue"
                    }`}>
                      {g.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      g.status === "Resolved"
                        ? "badge-green"
                        : g.status === "Approved"
                        ? "badge-blue"
                        : "badge-yellow"
                    }`}>
                      {g.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => {
                        setGrievances(prev =>
                          prev.map(item =>
                            item.id === g.id ? { ...item, status: "Resolved" } : item
                          )
                        );
                        alert(`✓ Marked grievance ticket regarding '${g.topic}' as Resolved!`);
                      }}
                      disabled={g.status === "Resolved"}
                      className="px-2.5 py-1 bg-violet-500/10 hover:bg-violet-500/20 disabled:bg-slate-800 disabled:text-slate-650 text-violet-400 border border-violet-500/20 rounded-md font-bold text-[10px] transition-all"
                    >
                      ✓ Resolve
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
              <h3 className="text-sm font-bold text-white">⚖️ Register Parent/School Grievance</h3>
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
                <div className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-2">Manual Roster</div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Grievance Topic</label>
                  <input
                    type="text"
                    required
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Roof leakages in Block B"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Select Origin School</label>
                    <select
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                    >
                      <option value="GHS Coimbatore">GHS Coimbatore</option>
                      <option value="GHS Peelamedu">GHS Peelamedu</option>
                      <option value="GHS RS Puram">GHS RS Puram</option>
                      <option value="GHS Singanallur">GHS Singanallur</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Raised By Group</label>
                  <input
                    type="text"
                    required
                    value={raisedBy}
                    onChange={(e) => setRaisedBy(e.target.value)}
                    placeholder="e.g. Class 10 Parents Alliance"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md mt-2"
                >
                  Post Grievance Ticket
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
                        <span className="text-xs font-bold text-white">Import Grievances Roster</span>
                        <span className="text-[9px] text-slate-500 leading-normal">
                          Click to simulate dragging <strong>grievance_tickets.xlsx</strong> into this dropzone
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 italic leading-relaxed pt-4">
                  * Dynamic parsing will auto-flag to respective block counselor officers.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
