"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface SchemeWelfare {
  id: number;
  name: string;
  targetGroup: string;
  benefit: string;
  totalEligible: number;
  distributedCount: number;
  status: "Fully Covered" | "In Progress" | "Pending Stock Verification";
}

export default function GovSchemesPage() {
  const [schemes, setSchemes] = useState<SchemeWelfare[]>([
    { id: 1, name: "Pudhumai Penn Scheme", targetGroup: "Class 12 Girls (College Aspirants)", benefit: "₹1,000 / month incentive", totalEligible: 48, distributedCount: 48, status: "Fully Covered" },
    { id: 2, name: "Tamil Puthalvan Scheme", targetGroup: "Class 12 Boys (College Aspirants)", benefit: "₹1,000 / month incentive", totalEligible: 42, distributedCount: 39, status: "In Progress" },
    { id: 3, name: "Free Bicycle Scheme", targetGroup: "Class 11 Students", benefit: "High-grade road bicycle", totalEligible: 88, distributedCount: 88, status: "Fully Covered" },
    { id: 4, name: "Free Laptops Scheme", targetGroup: "Class 12 Students", benefit: "Core computing laptop", totalEligible: 112, distributedCount: 95, status: "In Progress" },
    { id: 5, name: "Free Uniforms & Textbooks", targetGroup: "Classes 6 to 8", benefit: "4 sets & textbooks combo", totalEligible: 156, distributedCount: 120, status: "In Progress" },
    { id: 6, name: "Free Shoes & Socks", targetGroup: "Classes 6 to 10", benefit: "1 pair school shoes", totalEligible: 280, distributedCount: 0, status: "Pending Stock Verification" },
  ]);

  // Distribution update Form State
  const [selectedSchemeId, setSelectedSchemeId] = useState(2);
  const [addDistributedCount, setAddDistributedCount] = useState("3");
  const [distToast, setDistToast] = useState<string | null>(null);

  const handleUpdateDistribution = (e: React.FormEvent) => {
    e.preventDefault();
    const addCount = Number(addDistributedCount);
    const matchedScheme = schemes.find(s => s.id === selectedSchemeId);
    
    if (matchedScheme) {
      const newCount = Math.min(matchedScheme.distributedCount + addCount, matchedScheme.totalEligible);
      const newStatus = newCount === matchedScheme.totalEligible ? "Fully Covered" : "In Progress";
      
      setSchemes(prev =>
        prev.map(s =>
          s.id === selectedSchemeId
            ? { ...s, distributedCount: newCount, status: newStatus }
            : s
        )
      );

      setDistToast(
        `✓ Distribution log posted! Added ${addCount} units to ${matchedScheme.name}. Total now: ${newCount}/${matchedScheme.totalEligible}.`
      );
      setTimeout(() => setDistToast(null), 4000);
    }
  };

  return (
    <PortalLayout
      title="Government Welfare & Incentives Tracker"
      subtitle="Mr. Venkatesh R. · GHS Coimbatore · DISE: 33012345"
      avatarLetter="V"
      avatarColor="#3b82f6"
      themeClass="theme-headmaster"
      accentColor="#3b82f6"
    >
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Overall Scheme Coverage</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-emerald-400">82.3%</span>
            <span className="text-[10px] text-slate-400 font-bold">Matched</span>
          </div>
          <div className="text-[11px] text-slate-550 mt-2 font-semibold">
            Bicycle & Girl Child schemes at 100%.
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pudhumai Penn Registry</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">48 Girls</span>
            <span className="text-[10px] text-emerald-400 font-bold">100% Synced</span>
          </div>
          <div className="text-[11px] text-slate-550 mt-2 font-semibold">
            Bank account mappings verified via EMIS.
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Tamil Puthalvan Registry</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-blue-400">39 / 42 Boys</span>
            <span className="text-[10px] text-slate-400 font-bold">Enrolled</span>
          </div>
          <div className="text-[11px] text-slate-550 mt-2 font-semibold">
            3 boys pending bank Aadhaar mapping.
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Bicycle Quota</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">88 Cycles</span>
            <span className="text-[10px] text-emerald-400 font-bold">Disbursed</span>
          </div>
          <div className="text-[11px] text-slate-550 mt-2 font-semibold">
            Class 11 cycle allocation finished.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Welfare schemes coverage board */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-base font-semibold text-white mb-1">🏛️ Government Welfare Distribution Ledger</h2>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">Direct benefits monitoring board mapping inventory counts with student registers.</p>

          <div className="space-y-4">
            {schemes.map((sc) => {
              const percentage = sc.totalEligible > 0 ? Math.round((sc.distributedCount / sc.totalEligible) * 100) : 0;
              return (
                <div
                  key={sc.id}
                  className="p-4 bg-slate-900/60 rounded-xl border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-md">
                        {sc.targetGroup}
                      </span>
                      <span className={`badge ${
                        sc.status === "Fully Covered"
                          ? "badge-green"
                          : sc.status === "In Progress"
                          ? "badge-blue"
                          : "badge-yellow"
                      }`}>
                        {sc.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-0.5">{sc.name}</h3>
                    <div className="text-xs text-slate-400 mb-2">Benefit focus: {sc.benefit}</div>
                    
                    {/* Progress Bar */}
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full transition-all duration-350"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-550 font-bold whitespace-nowrap">{percentage}% ({sc.distributedCount}/{sc.totalEligible})</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Distribution dispatch workstation */}
        <div className="glass rounded-2xl p-6 border border-slate-800 h-fit">
          <h2 className="text-base font-semibold text-white mb-2">📦 Log Stock Distribution</h2>
          <p className="text-xs text-slate-500 leading-relaxed mb-4 font-medium">
            Post laptop serial assignments, bicycle framesets issued, or uniform packs delivered to clear current stock backlog.
          </p>

          <form onSubmit={handleUpdateDistribution} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Select Welfare Scheme</label>
              <select
                value={selectedSchemeId}
                onChange={(e) => setSelectedSchemeId(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                {schemes
                  .filter((sc) => sc.status !== "Fully Covered" && sc.status !== "Pending Stock Verification")
                  .map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Units Distributed (Today)</label>
              <input
                type="number"
                min="1"
                value={addDistributedCount}
                onChange={(e) => setAddDistributedCount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Post Welfare Dispatch Log
            </button>
          </form>

          {distToast && (
            <div className="mt-4 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl leading-relaxed">
              {distToast}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
