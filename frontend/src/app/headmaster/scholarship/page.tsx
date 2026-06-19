"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface ScholarshipApp {
  id: number;
  studentName: string;
  classSection: string;
  schemeName: "BC/MBC Welfare Grant" | "SC/ST Special Scholarship" | "Minority Educational Aid" | "National Merit Scholarship";
  amount: number;
  status: "Disbursed" | "Approved" | "Pending Verification" | "Rejected";
  emisId: string;
}

export default function ScholarshipPage() {
  const [applications, setApplications] = useState<ScholarshipApp[]>([
    { id: 1, studentName: "Praveen Kumar S.", classSection: "10A", schemeName: "BC/MBC Welfare Grant", amount: 2500, status: "Disbursed", emisId: "330123456711" },
    { id: 2, studentName: "Shalini K.", classSection: "12A", schemeName: "SC/ST Special Scholarship", amount: 4500, status: "Disbursed", emisId: "330123456715" },
    { id: 3, studentName: "Imran Khan J.", classSection: "9B", schemeName: "Minority Educational Aid", amount: 3000, status: "Approved", emisId: "330123456719" },
    { id: 4, studentName: "Nivedha M.", classSection: "10B", schemeName: "National Merit Scholarship", amount: 10000, status: "Pending Verification", emisId: "330123456722" },
    { id: 5, studentName: "Ajith Kumar R.", classSection: "11C", schemeName: "BC/MBC Welfare Grant", amount: 2500, status: "Approved", emisId: "330123456726" },
    { id: 6, studentName: "Fathima R.", classSection: "12B", schemeName: "Minority Educational Aid", amount: 3000, status: "Pending Verification", emisId: "330123456730" },
  ]);

  const [activeFilter, setActiveFilter] = useState<"All" | "Disbursed" | "Approved" | "Pending Verification">("All");

  // Verification Form State
  const [selectedAppId, setSelectedAppId] = useState(4);
  const [verificationCode, setVerificationCode] = useState("EMIS-VERIFY-2026");
  const [verifyToast, setVerifyToast] = useState<string | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedApp = applications.find(a => a.id === selectedAppId);
    if (matchedApp) {
      setApplications(prev =>
        prev.map(app =>
          app.id === selectedAppId ? { ...app, status: "Approved" } : app
        )
      );
      setVerifyToast(`✓ Application for ${matchedApp.studentName} verified and state treasury release approved!`);
      setTimeout(() => setVerifyToast(null), 4000);
    }
  };

  const filteredApps = applications.filter(
    (app) => activeFilter === "All" || app.status === activeFilter
  );

  return (
    <PortalLayout
      title="Scholarship Distribution & Verification Desk"
      subtitle="Mr. Venkatesh R. · GHS Coimbatore · DISE: 33012345"
      avatarLetter="V"
      avatarColor="#3b82f6"
      themeClass="theme-headmaster"
      accentColor="#3b82f6"
    >
      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Disbursed Funds</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">₹25,500</span>
            <span className="text-[10px] text-emerald-400 font-bold">Processed</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-semibold">
            Credited direct to Aadhaar linked accounts.
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Approved Batches</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-blue-400">3 Apps</span>
            <span className="text-[10px] text-slate-400 font-bold">Awaiting release</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-semibold">
            Ready for Treasury officer authorization.
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pending EMIS Audits</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-amber-500">2 Apps</span>
            <span className="text-[10px] text-amber-400 font-bold">Needs headmaster signoff</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-semibold">
            Verify academic records & community tags.
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Target Conversion</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-emerald-400">100%</span>
            <span className="text-[10px] text-emerald-500 font-bold">Goal</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-semibold">
            Active mapping for eligible students.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Application Directory */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-semibold text-white">🎓 Community Scholarship Register</h2>
              <p className="text-xs text-slate-500 leading-relaxed">Applicants flagged for social welfare bursary allocations.</p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
              {(["All", "Disbursed", "Approved", "Pending Verification"] as const).map((filterVal) => (
                <button
                  key={filterVal}
                  onClick={() => setActiveFilter(filterVal)}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    activeFilter === filterVal
                      ? "bg-blue-600 text-white font-extrabold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {filterVal === "Pending Verification" ? "Pending" : filterVal}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="p-4 bg-slate-900/60 rounded-xl border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-slate-800 text-slate-350 border border-slate-700 rounded-md">
                      {app.schemeName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">EMIS: {app.emisId}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-0.5">{app.studentName}</h3>
                  <div className="text-xs text-slate-400">
                    Grade: <strong className="text-slate-300">{app.classSection}</strong> · Amount: <span className="text-emerald-400 font-bold">₹{app.amount}</span>
                  </div>
                </div>

                <div>
                  <span className={`badge ${
                    app.status === "Disbursed"
                      ? "badge-green"
                      : app.status === "Approved"
                      ? "badge-blue"
                      : "badge-yellow"
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
            {filteredApps.length === 0 && (
              <div className="py-6 text-center text-slate-500 italic">
                No matching applications found.
              </div>
            )}
          </div>
        </div>

        {/* Verification workspace */}
        <div className="glass rounded-2xl p-6 border border-slate-800 h-fit">
          <h2 className="text-base font-semibold text-white mb-2">✅ Verify Candidate Data</h2>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Perform EMIS Community Cert audits and clear pending scholarship grants for processing.
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Select Student</label>
              <select
                value={selectedAppId}
                onChange={(e) => setSelectedAppId(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                {applications
                  .filter((app) => app.status === "Pending Verification")
                  .map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.studentName} ({app.classSection})
                    </option>
                  ))}
                {applications.filter((app) => app.status === "Pending Verification").length === 0 && (
                  <option value="">No pending audits remaining</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-semibold">EMIS Verification Key</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
                required
              />
            </div>

            <button
              type="submit"
              disabled={applications.filter((app) => app.status === "Pending Verification").length === 0}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Verify Communities Cert & Approve
            </button>
          </form>

          {verifyToast && (
            <div className="mt-4 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl leading-relaxed">
              {verifyToast}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
