"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface TempStaffMember {
  name: string;
  role: string;
  agency: string;
  joined: string;
  status: string;
}

export default function TemporaryStaffPage() {
  const [temps, setTemps] = useState<TempStaffMember[]>([
    { name: "Mr. Karthick M.", role: "Guest Teacher (Math)", agency: "Direct Contract", joined: "Jan 2026", status: "Active" },
    { name: "Mrs. Revathi P.", role: "Cleaning Staff", agency: "TN Outsourcing Ltd", joined: "Aug 2025", status: "Active" },
    { name: "Mr. Selvam T.", role: "Night Watchman", agency: "Direct Contract", joined: "May 2024", status: "Active" },
    { name: "Ms. Anitha K.", role: "Data Entry Operator", agency: "Govt Scheme Contract", joined: "Feb 2026", status: "Active" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("Guest Teacher (Science)");
  const [newAgency, setNewAgency] = useState("Direct Contract");
  const [newJoined, setNewJoined] = useState("June 2026");

  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const newStaff: TempStaffMember = {
      name: newName,
      role: newRole,
      agency: newAgency,
      joined: newJoined,
      status: "Active",
    };

    setTemps(prev => [...prev, newStaff]);
    setNewName("");
    setIsModalOpen(false);
    setToast(`🎉 Contract staff ${newStaff.name} registered successfully!`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleExcelSimulate = () => {
    setIsUploading(true);
    setTimeout(() => {
      const excelStaff: TempStaffMember[] = [
        { name: "Mrs. Kalaivani A.", role: "Security Officer", agency: "TN Outsourcing Ltd", joined: "Today (Excel)", status: "Active" },
        { name: "Mr. Srinivasan K.", role: "Lab Assistant", agency: "Direct Contract", joined: "Today (Excel)", status: "Active" },
      ];
      setTemps(prev => [...prev, ...excelStaff]);
      setIsUploading(false);
      setIsModalOpen(false);
      setToast("📊 Excel roster parsed successfully! 2 new contract staff records appended to database.");
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  return (
    <PortalLayout
      title="Temporary & Contract Staff"
      subtitle="Mr. Venkatesh R. · GHS Coimbatore · DISE: 33012345"
      avatarLetter="V"
      avatarColor="#3b82f6"
      themeClass="theme-headmaster"
      accentColor="#3b82f6"
    >
      {/* Metric summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 fade-in">
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <div className="text-slate-400 text-sm mb-2 font-medium">Total Temporary Staff</div>
          <div className="text-3xl font-extrabold text-blue-400">{temps.length} staff</div>
        </div>
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <div className="text-slate-400 text-sm mb-2 font-medium">Agency Outsourced</div>
          <div className="text-3xl font-extrabold text-emerald-400">
            {temps.filter((t) => t.agency.includes("Outsourcing") || t.agency.includes("Scheme")).length} staff
          </div>
        </div>
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <div className="text-slate-400 text-sm mb-2 font-medium">Pending Contract Renewals</div>
          <div className="text-3xl font-extrabold text-amber-400">2 contracts</div>
        </div>
      </div>

      {toast && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* Directory Table */}
      <div className="glass rounded-2xl p-6 border border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base font-semibold text-white">📋 Contract Staff Directory</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md"
          >
            + Add Contract Staff
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Designated Role</th>
              <th>Source / Agency</th>
              <th>Joined Date</th>
              <th>Contract Status</th>
            </tr>
          </thead>
          <tbody>
            {temps.map((t, i) => (
              <tr key={i}>
                <td className="font-bold text-white text-xs">{t.name}</td>
                <td>{t.role}</td>
                <td>{t.agency}</td>
                <td>{t.joined}</td>
                <td>
                  <span className="badge badge-green">{t.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
              <h3 className="text-sm font-bold text-white">🤝 Register Temporary & Contract Staff</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form Side */}
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Manual Entry</div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Mr. Rajesh P."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Role</label>
                  <input
                    type="text"
                    required
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Guest Teacher"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Agency / Source</label>
                  <select
                    value={newAgency}
                    onChange={(e) => setNewAgency(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="Direct Contract">Direct Contract</option>
                    <option value="TN Outsourcing Ltd">TN Outsourcing Ltd</option>
                    <option value="Govt Scheme Contract">Govt Scheme Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Joined Date</label>
                  <input
                    type="text"
                    required
                    value={newJoined}
                    onChange={(e) => setNewJoined(e.target.value)}
                    placeholder="e.g. June 2026"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md mt-2"
                >
                  Save Contract Record
                </button>
              </form>

              {/* Excel Upload Side */}
              <div className="border-l border-slate-800 pl-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Excel Import</div>
                  
                  {/* Dropzone simulator */}
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
                          Click to simulate dragging <strong>staff_roster.xlsx</strong> into this dropzone
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 italic leading-relaxed pt-4">
                  * Upload template matches EMIS standard schema (Columns: Name, Role, Source, Date).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
