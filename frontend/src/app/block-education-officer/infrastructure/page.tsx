"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface DeficitItem {
  id: number;
  schoolName: string;
  assetType: string;
  count: string;
  criticality: "Critical" | "Maintenance Required" | "Resolved";
  reportedDate: string;
}

export default function InfrastructurePage() {
  const [deficits, setDeficits] = useState<DeficitItem[]>([
    { id: 1, schoolName: "GHS Peelamedu", assetType: "Classroom Roof Seepage", count: "1 room", criticality: "Critical", reportedDate: "June 10, 2026" },
    { id: 2, schoolName: "GHS RS Puram", assetType: "Computer Lab Terminals", count: "12 terminals offline", criticality: "Maintenance Required", reportedDate: "June 12, 2026" },
    { id: 3, schoolName: "GHSS Ganapathy", assetType: "RO Water Purifier", count: "1 block", criticality: "Critical", reportedDate: "June 14, 2026" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetSchool, setTargetSchool] = useState("GHS Coimbatore");
  const [assetType, setAssetType] = useState("Smart Board");
  const [defCount, setDefCount] = useState("2 boards");
  const [severity, setSeverity] = useState<"Critical" | "Maintenance Required">("Critical");

  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: DeficitItem = {
      id: Date.now(),
      schoolName: targetSchool,
      assetType: assetType,
      count: defCount,
      criticality: severity,
      reportedDate: "Today",
    };

    setDeficits(prev => [newItem, ...prev]);
    setIsModalOpen(false);
    setToast(`🎉 Deficit ticket raised for ${newItem.schoolName} regarding ${newItem.assetType}.`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleExcelSimulate = () => {
    setIsUploading(true);
    setTimeout(() => {
      const excelDeficits: DeficitItem[] = [
        { id: 4, schoolName: "GHS RS Puram", assetType: "Sanitation water taps leaking", count: "5 taps", criticality: "Maintenance Required", reportedDate: "Today (Excel)" },
        { id: 5, schoolName: "GHS Singanallur", assetType: "Classroom Smart Boards", count: "5 boards", criticality: "Critical", reportedDate: "Today (Excel)" },
      ];
      setDeficits(prev => [...excelDeficits, ...prev]);
      setIsUploading(false);
      setIsModalOpen(false);
      setToast("📊 Infrastructure audit spreadsheet parsed successfully! 2 new deficit records filed.");
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  return (
    <PortalLayout
      title="Infrastructure & Audits"
      subtitle="Mr. Murugesan P. · Coimbatore South Block"
      avatarLetter="M"
      avatarColor="#8b5cf6"
      themeClass="theme-beo"
      accentColor="#8b5cf6"
    >
      {/* Infrastructure summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Smart Classrooms</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">18 / 24</span>
            <span className="text-[10px] text-violet-400 font-bold">75% coverage</span>
          </div>
          <div className="w-full bg-slate-900 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-violet-500 h-full rounded-full" style={{ width: "75%" }} />
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Computer Labs</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">22 / 24</span>
            <span className="text-[10px] text-violet-400 font-bold">91% coverage</span>
          </div>
          <div className="w-full bg-slate-900 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-violet-500 h-full rounded-full" style={{ width: "91%" }} />
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Sanitation Index</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-emerald-400">100%</span>
            <span className="text-[10px] text-emerald-500 font-bold">Compliant</span>
          </div>
          <div className="w-full bg-slate-900 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: "100%" }} />
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Critical Repairs</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-rose-500">{deficits.filter(d => d.criticality === "Critical").length} Schools</span>
            <span className="text-[10px] text-rose-450 font-bold">Needs Budget</span>
          </div>
          <div className="text-[11px] text-slate-550 mt-2 font-semibold">
            Rehabilitation plans submitted.
          </div>
        </div>
      </div>

      {toast && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* Deficits registry */}
      <div className="glass rounded-2xl p-6 border border-slate-800 mb-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-base font-semibold text-white">🏗️ Deficits & Repair Registry</h2>
            <p className="text-xs text-slate-500 leading-relaxed">Logged requirements waiting for capital grant releases.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition-all shadow-md"
          >
            + Report Audit Deficit
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>School Name</th>
                <th>Asset Category</th>
                <th>Deficit Scale</th>
                <th>Audited Date</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {deficits.map((d) => (
                <tr key={d.id}>
                  <td className="font-bold text-white text-xs">{d.schoolName}</td>
                  <td>{d.assetType}</td>
                  <td className="text-blue-400 font-semibold">{d.count}</td>
                  <td className="text-slate-500 font-medium">{d.reportedDate}</td>
                  <td>
                    <span className={`badge ${
                      d.criticality === "Critical"
                        ? "badge-red"
                        : d.criticality === "Maintenance Required"
                        ? "badge-yellow"
                        : "badge-green"
                    }`}>
                      {d.criticality}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => {
                        setDeficits(prev =>
                          prev.map(item =>
                            item.id === d.id ? { ...item, criticality: "Resolved" } : item
                          )
                        );
                        alert(`✓ Marked deficit in ${d.schoolName} as Resolved!`);
                      }}
                      className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-450 border border-emerald-500/20 rounded-md font-bold text-[10px] transition-all"
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
              <h3 className="text-sm font-bold text-white">🏗️ Log Physical Deficit / Asset Audit</h3>
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
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Select School</label>
                  <select
                    value={targetSchool}
                    onChange={(e) => setTargetSchool(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="GHS Coimbatore">GHS Coimbatore</option>
                    <option value="GHS Singanallur">GHS Singanallur</option>
                    <option value="GHSS Ganapathy">GHSS Ganapathy</option>
                    <option value="GHS RS Puram">GHS RS Puram</option>
                    <option value="GHS Peelamedu">GHS Peelamedu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Asset Type</label>
                  <select
                    value={assetType}
                    onChange={(e) => setAssetType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="Smart Board">Smart Board</option>
                    <option value="Computer Terminals">Computer Terminals</option>
                    <option value="Sanitation Block fittings">Sanitation Block fittings</option>
                    <option value="Water Purifier/Filters">Water Purifier/Filters</option>
                    <option value="Building Roof Leakage">Building Roof Leakage</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Deficit Scale</label>
                    <input
                      type="text"
                      required
                      value={defCount}
                      onChange={(e) => setDefCount(e.target.value)}
                      placeholder="e.g. 3 terminals"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Criticality</label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                    >
                      <option value="Critical">Critical</option>
                      <option value="Maintenance Required">Maintenance</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md mt-2"
                >
                  Save Deficit Log
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
                        <span className="text-xs font-bold text-white">Import Audit Sheet</span>
                        <span className="text-[9px] text-slate-500 leading-normal">
                          Click to simulate dragging <strong>block_deficit_audit.xlsx</strong> into this dropzone
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 italic leading-relaxed pt-4">
                  * Triggers fund allocations inside block financial rosters.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
