"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface CommitteeMember {
  name: string;
  role: string;
  phone: string;
}

interface Grievance {
  topic: string;
  raisedBy: string;
  status: "Under Review" | "Approved" | "Resolved";
  border: string;
  bg: string;
}

export default function ParentsPage() {
  const [committee, setCommittee] = useState<CommitteeMember[]>([
    { name: "Mr. R. Kumar", role: "President (Parent)", phone: "+91 98765 43210" },
    { name: "Mrs. N. Lakshmi", role: "Vice President (Parent)", phone: "+91 98765 43211" },
    { name: "Mr. Venkatesh R.", role: "Secretary (Headmaster)", phone: "School Office" },
  ]);

  const [grievances, setGrievances] = useState<Grievance[]>([
    { topic: "Transport facility delays in Zone B", raisedBy: "12 parents", status: "Under Review", border: "border-amber-500/20", bg: "bg-amber-500/10 text-amber-400" },
    { topic: "Request for extra special classes for 10th", raisedBy: "PTA Committee", status: "Approved", border: "border-emerald-500/20", bg: "bg-emerald-500/10 text-emerald-400" },
    { topic: "RO Water filter service required in block C", raisedBy: "Class 7 Representative", status: "Resolved", border: "border-blue-500/20", bg: "bg-blue-500/10 text-blue-400" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("Committee Member (Parent)");
  const [newPhone, setNewPhone] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const newMember: CommitteeMember = {
      name: newName,
      role: newRole,
      phone: newPhone,
    };

    setCommittee(prev => [...prev, newMember]);
    setNewName("");
    setNewPhone("");
    setIsModalOpen(false);
    setToast(`🎉 PTA Officer ${newMember.name} successfully registered to committee.`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleExcelSimulate = () => {
    setIsUploading(true);
    setTimeout(() => {
      const excelMembers: CommitteeMember[] = [
        { name: "Mrs. Chitra J.", role: "Joint Secretary (Parent)", phone: "+91 98765 43212" },
        { name: "Mr. Nagarajan P.", role: "Treasurer (Parent)", phone: "+91 98765 43213" },
      ];
      setCommittee(prev => [...prev, ...excelMembers]);
      setIsUploading(false);
      setIsModalOpen(false);
      setToast("📊 PTA roster parsed successfully! 2 parent officer records appended to committee database.");
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  return (
    <PortalLayout
      title="Parents & PTA Committee"
      subtitle="Mr. Venkatesh R. · GHS Coimbatore · DISE: 33012345"
      avatarLetter="V"
      avatarColor="#3b82f6"
      themeClass="theme-headmaster"
      accentColor="#3b82f6"
    >
      <div className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Parents Teachers Association (PTA)</h2>
          <p className="text-xs text-slate-400">View active committee members, meeting records and address parental grievances.</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">Next PTA Meeting</div>
          <div className="text-sm font-bold text-amber-400 mt-1">July 24, 2026 · 4:30 PM</div>
        </div>
      </div>

      {toast && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Core committee */}
        <div className="glass rounded-2xl p-6 border border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white">PTA Core Committee Officers</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-xl transition-all shadow-md"
            >
              + Register PTA Officer
            </button>
          </div>
          <div className="space-y-3">
            {committee.map((p, i) => (
              <div key={i} className="flex justify-between items-center p-3.5 border border-slate-800 rounded-xl bg-slate-900/60">
                <div>
                  <div className="font-bold text-white text-xs">{p.name}</div>
                  <div className="text-[10px] text-blue-400 font-semibold mt-0.5">{p.role}</div>
                </div>
                <div className="text-xs text-slate-500 font-semibold">{p.phone}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Grievances list */}
        <div className="glass rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-4">Recent Parental Grievances & Status</h3>
          <div className="space-y-3">
            {grievances.map((g, i) => (
              <div key={i} className={`p-3.5 border-l-2 ${g.border} bg-slate-900/60 rounded-r-xl`}>
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <h4 className="text-xs font-bold text-white leading-relaxed">{g.topic}</h4>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${g.bg}`}>
                    {g.status}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">Raised by: {g.raisedBy}</div>
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
              <h3 className="text-sm font-bold text-white">👪 Register PTA Committee Member</h3>
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
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Parent Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Mr. Karthikeyan"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Designated Committee Role</label>
                  <input
                    type="text"
                    required
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Joint Secretary (Parent)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43212"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md mt-2"
                >
                  Save Officer Roster
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
                        <span className="text-xs font-bold text-white">Import PTA Roster</span>
                        <span className="text-[9px] text-slate-500 leading-normal">
                          Click to simulate dragging <strong>pta_committee.xlsx</strong> into this dropzone
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 italic leading-relaxed pt-4">
                  * Integrates with parent phone lists for instant event SMS reminders.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
