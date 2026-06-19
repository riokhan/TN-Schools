"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface AlumniRecord {
  name: string;
  batch: string;
  contribution: string;
  role: string;
}

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<AlumniRecord[]>([
    { name: "Dr. S. Ramakrishnan", batch: "1994", contribution: "Donated 20 computers to the new science lab", role: "Software Architect, USA" },
    { name: "Mrs. K. Meena", batch: "1988", contribution: "Sponsored yearly higher ed scholarships for 5 girls", role: "IAS Officer" },
    { name: "Mr. T. Arul", batch: "2001", contribution: "Built the new RO water purification plant in Block C", role: "Local Business Owner" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBatch, setNewBatch] = useState("2005");
  const [newContribution, setNewContribution] = useState("");
  const [newRole, setNewRole] = useState("Alumni Member");

  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newContribution) return;

    const newAlumni: AlumniRecord = {
      name: newName,
      batch: newBatch,
      contribution: newContribution,
      role: newRole,
    };

    setAlumni(prev => [...prev, newAlumni]);
    setNewName("");
    setNewContribution("");
    setIsModalOpen(false);
    setToast(`🎉 Alumni record for ${newAlumni.name} successfully registered.`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleExcelSimulate = () => {
    setIsUploading(true);
    setTimeout(() => {
      const excelAlumni: AlumniRecord[] = [
        { name: "Dr. M. Senthil Kumar", batch: "1996", contribution: "Sponsored laboratory glassware worth ₹1 Lakh", role: "Senior Research Fellow" },
        { name: "Mrs. Subha R.", batch: "2003", contribution: "Donated 100 library science volumes", role: "High School Principal" },
      ];
      setAlumni(prev => [...prev, ...excelAlumni]);
      setIsUploading(false);
      setIsModalOpen(false);
      setToast("📊 Alumni contributions Excel roster parsed successfully! 2 records added.");
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  return (
    <PortalLayout
      title="School Alumni Network"
      subtitle="Mr. Venkatesh R. · GHS Coimbatore · DISE: 33012345"
      avatarLetter="V"
      avatarColor="#3b82f6"
      themeClass="theme-headmaster"
      accentColor="#3b82f6"
    >
      {/* Metric totals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 fade-in">
        <div className="glass rounded-2xl p-6 text-center border border-slate-800">
          <div className="text-3xl mb-2">🎓</div>
          <div className="text-2xl font-black text-white mb-0.5">1,840</div>
          <div className="text-[10px] text-slate-500 font-extrabold uppercase">Registered Alumni</div>
        </div>
        <div className="glass rounded-2xl p-6 text-center border border-slate-800">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-2xl font-black text-emerald-400 mb-0.5">₹12.5 Lakhs</div>
          <div className="text-[10px] text-slate-500 font-extrabold uppercase">Donations Received (This Year)</div>
        </div>
        <div className="glass rounded-2xl p-6 text-center border border-slate-800">
          <div className="text-3xl mb-2">🏗️</div>
          <div className="text-2xl font-black text-blue-400 mb-0.5">4</div>
          <div className="text-[10px] text-slate-500 font-extrabold uppercase">Projects Fully Funded</div>
        </div>
      </div>

      {toast && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* Main Directory panel */}
      <div className="glass rounded-2xl p-6 border border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base font-semibold text-white">🏆 Notable Alumni Contributions</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md"
          >
            + Register Alumni Contribution
          </button>
        </div>
        <div className="space-y-4">
          {alumni.map((al, i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-900/60 border border-slate-850 rounded-xl gap-4">
              <div>
                <div className="font-bold text-blue-400 text-xs mb-1">
                  {al.name} <span className="text-[10px] text-slate-500 font-normal ml-2">Batch of {al.batch}</span>
                </div>
                <div className="text-xs text-white leading-relaxed">{al.contribution}</div>
              </div>
              <div className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-lg whitespace-nowrap self-start md:self-auto">
                {al.role}
              </div>
            </div>
          ))}
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
              <h3 className="text-sm font-bold text-white">🎓 Register Alumni Contribution</h3>
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
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Alumni Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Dr. Ramakrishnan"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Batch Year</label>
                    <input
                      type="text"
                      required
                      value={newBatch}
                      onChange={(e) => setNewBatch(e.target.value)}
                      placeholder="e.g. 1994"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Current Role</label>
                    <input
                      type="text"
                      required
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      placeholder="e.g. IAS Officer"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Contribution Details</label>
                  <textarea
                    value={newContribution}
                    onChange={(e) => setNewContribution(e.target.value)}
                    placeholder="e.g. Donated 20 desktop terminals..."
                    rows={3}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md mt-2"
                >
                  Save Contribution
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
                        <span className="text-xs font-bold text-white">Import Alumni Roster</span>
                        <span className="text-[9px] text-slate-500 leading-normal">
                          Click to simulate dragging <strong>alumni_contributions.xlsx</strong> into this dropzone
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 italic leading-relaxed pt-4">
                  * Keeps permanent archives of school endowments.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
