"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface SchemeDispatch {
  id: number;
  schemeName: string;
  targetSchool: string;
  quantity: number;
  status: "Dispatched" | "In Transit" | "Awaiting stock";
  date: string;
}

export default function SchemesUpdatePage() {
  const [dispatches, setDispatches] = useState<SchemeDispatch[]>([
    { id: 1, schemeName: "Free Bicycle Scheme", targetSchool: "GHS Coimbatore", quantity: 88, status: "Dispatched", date: "June 08, 2026" },
    { id: 2, schemeName: "Free Laptops Scheme", targetSchool: "GHS RS Puram", quantity: 55, status: "In Transit", date: "June 16, 2026" },
    { id: 3, schemeName: "Pudhumai Penn Welfare Fund", targetSchool: "GHSS Ganapathy", quantity: 64, status: "Dispatched", date: "June 11, 2026" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetSchool, setTargetSchool] = useState("GHS Singanallur");
  const [schemeName, setSchemeName] = useState("Free Bicycle Scheme");
  const [quantity, setQuantity] = useState("45");
  const [status, setStatus] = useState<"Dispatched" | "In Transit">("Dispatched");

  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDispatch: SchemeDispatch = {
      id: Date.now(),
      schemeName,
      targetSchool,
      quantity: Number(quantity),
      status,
      date: "Today",
    };

    setDispatches(prev => [newDispatch, ...prev]);
    setIsModalOpen(false);
    setToast(`🎉 Dispatch log for ${newDispatch.schemeName} to ${newDispatch.targetSchool} saved.`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleExcelSimulate = () => {
    setIsUploading(true);
    setTimeout(() => {
      const excelDispatches: SchemeDispatch[] = [
        { id: 4, schemeName: "Free Bicycle Scheme", targetSchool: "GHS Singanallur", quantity: 42, status: "Dispatched", date: "Today (Excel)" },
        { id: 5, schemeName: "Free Laptops Scheme", targetSchool: "GHS Peelamedu", quantity: 30, status: "Dispatched", date: "Today (Excel)" },
      ];
      setDispatches(prev => [...excelDispatches, ...prev]);
      setIsUploading(false);
      setIsModalOpen(false);
      setToast("📊 Welfare distributions spreadsheet parsed successfully! 2 new dispatch records added.");
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  return (
    <PortalLayout
      title="Government Welfare Schemes Tracker"
      subtitle="Mr. Murugesan P. · Coimbatore South Block"
      avatarLetter="M"
      avatarColor="#8b5cf6"
      themeClass="theme-beo"
      accentColor="#8b5cf6"
    >
      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Overall Block Coverage</span>
          <div className="text-2xl font-black text-emerald-400 mt-2">84.5%</div>
          <span className="text-[10px] text-slate-500 font-bold block mt-1">State target: 80%</span>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Free Bicycle Scheme</span>
          <div className="text-2xl font-black text-white mt-2">1,280 distributed</div>
          <span className="text-[10px] text-slate-500 font-bold block mt-1">Class 11 cohort</span>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Free Laptop Scheme</span>
          <div className="text-2xl font-black text-blue-400 mt-2">412 laptops</div>
          <span className="text-[10px] text-slate-500 font-bold block mt-1">Class 12 cohort</span>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Scholarship Disbursals</span>
          <div className="text-2xl font-black text-white mt-2">₹12.4 Lakhs</div>
          <span className="text-[10px] text-slate-550 font-bold block mt-1">Community funds sync</span>
        </div>
      </div>

      {toast && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* Dispatches ledger */}
      <div className="glass rounded-2xl p-6 border border-slate-800 mb-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-base font-semibold text-white">📜 Welfare Dispatches Ledger</h2>
            <p className="text-xs text-slate-500 leading-relaxed">Distribution batches dispatched to schools under block control.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition-all shadow-md"
          >
            + Update Dispatch Logs
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Scheme Name</th>
                <th>Target School</th>
                <th>Quantity Distributed</th>
                <th>Log Date</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {dispatches.map((d) => (
                <tr key={d.id}>
                  <td className="font-bold text-white text-xs">{d.schemeName}</td>
                  <td>{d.targetSchool}</td>
                  <td className="text-blue-400 font-semibold">{d.quantity} units</td>
                  <td className="text-slate-550 font-semibold">{d.date}</td>
                  <td>
                    <span className={`badge ${
                      d.status === "Dispatched"
                        ? "badge-green"
                        : d.status === "In Transit"
                        ? "badge-blue"
                        : "badge-yellow"
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => {
                        setDispatches(prev =>
                          prev.map(item =>
                            item.id === d.id ? { ...item, status: "Dispatched" } : item
                          )
                        );
                        alert(`✓ Marked dispatch to ${d.targetSchool} as fully received!`);
                      }}
                      disabled={d.status === "Dispatched"}
                      className="px-2.5 py-1 bg-violet-500/10 hover:bg-violet-500/20 disabled:bg-slate-800 disabled:text-slate-650 text-violet-400 border border-violet-500/20 rounded-md font-bold text-[10px] transition-all"
                    >
                      ✓ Mark Received
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
              <h3 className="text-sm font-bold text-white">🏛️ Dispatch Welfare Scheme Allocations</h3>
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
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Select Scheme</label>
                  <select
                    value={schemeName}
                    onChange={(e) => setSchemeName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="Free Bicycle Scheme">Free Bicycle Scheme</option>
                    <option value="Free Laptops Scheme">Free Laptops Scheme</option>
                    <option value="Pudhumai Penn Welfare Fund">Pudhumai Penn Welfare Fund</option>
                    <option value="Tamil Puthalvan Welfare Fund">Tamil Puthalvan Welfare Fund</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Target School</label>
                  <select
                    value={targetSchool}
                    onChange={(e) => setTargetSchool(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="GHS Coimbatore">GHS Coimbatore</option>
                    <option value="GHS Peelamedu">GHS Peelamedu</option>
                    <option value="GHS RS Puram">GHS RS Puram</option>
                    <option value="GHS Singanallur">GHS Singanallur</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Quantity</label>
                    <input
                      type="number"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Dispatch Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                    >
                      <option value="Dispatched">Dispatched</option>
                      <option value="In Transit">In Transit</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md mt-2"
                >
                  Save Dispatch Log
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
                        <span className="text-xs font-bold text-white">Import Dispatches</span>
                        <span className="text-[9px] text-slate-500 leading-normal">
                          Click to simulate dragging <strong>welfare_allocations.xlsx</strong> into this dropzone
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 italic leading-relaxed pt-4">
                  * Integrates allocation lists directly with school store registries.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
