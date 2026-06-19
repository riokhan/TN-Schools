"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface BlockGrant {
  id: number;
  grantName: string;
  targetSchool: string;
  amount: number;
  budgetCode: string;
  status: "Disbursed" | "Approved" | "Pending Verification";
}

export default function FinancialReportsPage() {
  const [grants, setGrants] = useState<BlockGrant[]>([
    { id: 1, grantName: "Smart Classroom setup grant", targetSchool: "GHS Coimbatore", amount: 850000, budgetCode: "BE-SC-101", status: "Dispatched" } as any, // fallback status mapping
    { id: 2, grantName: "RO Filter repair grant", targetSchool: "GHS Coimbatore", amount: 50000, budgetCode: "BE-RO-402", status: "Approved" },
    { id: 3, grantName: "Science Lab chemicals refit", targetSchool: "GHS Singanallur", amount: 120000, budgetCode: "BE-LB-992", status: "Disbursed" },
    { id: 4, grantName: "Classroom structural repairs", targetSchool: "GHS Peelamedu", amount: 450000, budgetCode: "BE-ST-881", status: "Pending Verification" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [grantName, setGrantName] = useState("");
  const [targetSchool, setTargetSchool] = useState("GHS Coimbatore");
  const [amount, setAmount] = useState("100000");
  const [budgetCode, setBudgetCode] = useState("BE-GEN-2026");
  const [status, setStatus] = useState<"Approved" | "Pending Verification">("Approved");

  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantName || !amount) return;

    const newGrant: BlockGrant = {
      id: Date.now(),
      grantName,
      targetSchool,
      amount: Number(amount),
      budgetCode,
      status,
    };

    setGrants(prev => [...prev, newGrant]);
    setGrantName("");
    setAmount("");
    setIsModalOpen(false);
    setToast(`🎉 Grant of ₹${newGrant.amount.toLocaleString()} allocated for ${newGrant.targetSchool}.`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleExcelSimulate = () => {
    setIsUploading(true);
    setTimeout(() => {
      const excelGrants: BlockGrant[] = [
        { id: 5, grantName: "New library textbook quota", targetSchool: "GHS Singanallur", amount: 150000, budgetCode: "BE-LB-2026", status: "Disbursed" },
        { id: 6, grantName: "Outsourced contract staff budget", targetSchool: "GHS Peelamedu", amount: 300000, budgetCode: "BE-CS-2026", status: "Approved" },
      ];
      setGrants(prev => [...prev, ...excelGrants]);
      setIsUploading(false);
      setIsModalOpen(false);
      setToast("📊 Financial grants spreadsheet parsed successfully! 2 new budget allocations registered.");
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  const totalSpent = grants.reduce((sum, item) => sum + item.amount, 0);

  return (
    <PortalLayout
      title="Financial Budgets & School Grants"
      subtitle="Mr. Murugesan P. · Coimbatore South Block"
      avatarLetter="M"
      avatarColor="#8b5cf6"
      themeClass="theme-beo"
      accentColor="#8b5cf6"
    >
      {/* Overview Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Block Budget</span>
          <div className="text-2xl font-black text-white mt-2">₹45.0 Lakhs</div>
          <span className="text-[10px] text-slate-500 font-bold block mt-1">Coimbatore South block</span>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Spent & Committed</span>
          <div className="text-2xl font-black text-emerald-400 mt-2">
            ₹{(totalSpent / 100000).toFixed(2)} Lakhs
          </div>
          <span className="text-[10px] text-slate-500 font-bold block mt-1">Directly allocated</span>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Budget Balance</span>
          <div className="text-2xl font-black text-blue-400 mt-2">
            ₹{((4500000 - totalSpent) / 100000).toFixed(2)} Lakhs
          </div>
          <span className="text-[10px] text-slate-500 font-bold block mt-1">Available for deficits</span>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pending EMIS Verifications</span>
          <div className="text-2xl font-black text-rose-500 mt-2">
            {grants.filter(g => g.status === "Pending Verification").length} Audits
          </div>
          <span className="text-[10px] text-slate-550 font-bold block mt-1">HM signoff needed</span>
        </div>
      </div>

      {toast && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* Roster list */}
      <div className="glass rounded-2xl p-6 border border-slate-800 mb-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-base font-semibold text-white">💰 Direct Benefit School Grants Ledger</h2>
            <p className="text-xs text-slate-500 leading-relaxed">Budget allocation ledger cross-referenced with Smart education assets and repair audits.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition-all shadow-md"
          >
            + Allocate School Grant
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Allocation Scheme</th>
                <th>Target School</th>
                <th>Funds Disbursed</th>
                <th>DISE Budget Code</th>
                <th>Grant Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {grants.map((g) => (
                <tr key={g.id}>
                  <td className="font-bold text-white text-xs">{g.grantName}</td>
                  <td>{g.targetSchool}</td>
                  <td className="text-emerald-400 font-bold">₹{g.amount.toLocaleString()}</td>
                  <td className="font-mono text-slate-450">{g.budgetCode}</td>
                  <td>
                    <span className={`badge ${
                      g.status === "Disbursed" || (g.status as any) === "Dispatched"
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
                        setGrants(prev =>
                          prev.map(item =>
                            item.id === g.id ? { ...item, status: "Disbursed" } : item
                          )
                        );
                        alert(`✓ Budget funds disbursed for ${g.grantName}!`);
                      }}
                      disabled={g.status === "Disbursed" || (g.status as any) === "Dispatched"}
                      className="px-2.5 py-1 bg-violet-500/10 hover:bg-violet-500/20 disabled:bg-slate-800 disabled:text-slate-650 text-violet-400 border border-violet-500/20 rounded-md font-bold text-[10px] transition-all"
                    >
                      ✓ Disburse
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
              <h3 className="text-sm font-bold text-white">💰 Allocate Direct School Grant</h3>
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
                <div className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-2">Manual Grant</div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Allocation Scheme Name</label>
                  <input
                    type="text"
                    required
                    value={grantName}
                    onChange={(e) => setGrantName(e.target.value)}
                    placeholder="e.g. Science Lab expansion"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
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
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Amount (₹)</label>
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Budget Code</label>
                    <input
                      type="text"
                      required
                      value={budgetCode}
                      onChange={(e) => setBudgetCode(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Verify Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Pending Verification">Pending Verification</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md mt-2"
                >
                  Post Allocation
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
                        <span className="text-xs font-bold text-white">Import Budgets Sheet</span>
                        <span className="text-[9px] text-slate-500 leading-normal">
                          Click to simulate dragging <strong>block_grants_budget.xlsx</strong> into this dropzone
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 italic leading-relaxed pt-4">
                  * Dynamic ledger audit releases funds from state treasury accounts.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
