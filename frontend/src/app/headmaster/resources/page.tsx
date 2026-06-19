"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface ResourceItem {
  id: number;
  name: string;
  category: "Classroom" | "Lab" | "Sanitation" | "Facility";
  status: "Excellent" | "Operational" | "Maintenance Required" | "Critical Repair";
  capacity: string;
  smartEnabled: boolean;
  lastAudited: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<ResourceItem[]>([
    { id: 1, name: "Smart Classroom 10A", category: "Classroom", status: "Excellent", capacity: "45 Students", smartEnabled: true, lastAudited: "May 10, 2026" },
    { id: 2, name: "Physics & Chemistry Combo Lab", category: "Lab", status: "Operational", capacity: "30 Slots", smartEnabled: true, lastAudited: "June 02, 2026" },
    { id: 3, name: "Computer Laboratory", category: "Lab", status: "Maintenance Required", capacity: "40 Terminals", smartEnabled: true, lastAudited: "May 15, 2026" },
    { id: 4, name: "Sanitation Block (Boys & Girls)", category: "Sanitation", status: "Operational", capacity: "12 Cubicles", smartEnabled: false, lastAudited: "June 14, 2026" },
    { id: 5, name: "School Library & Reading Room", category: "Facility", status: "Excellent", capacity: "50 Seats", smartEnabled: false, lastAudited: "April 28, 2026" },
    { id: 6, name: "Classroom 8A (Block B)", category: "Classroom", status: "Critical Repair", capacity: "40 Students", smartEnabled: false, lastAudited: "March 11, 2026" },
  ]);

  const [filterCategory, setFilterCategory] = useState<"All" | "Classroom" | "Lab" | "Sanitation" | "Facility">("All");

  // Repair Request State
  const [requestItem, setRequestItem] = useState("Computer Laboratory");
  const [issueType, setIssueType] = useState("Electrical & Wiring Fault");
  const [comments, setComments] = useState("");
  const [repairToast, setRepairToast] = useState<string | null>(null);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRepairToast(`✓ Maintenance ticket raised! Request filed for '${requestItem}' regarding '${issueType}'. Notifications sent to Block Admin.`);
    setComments("");
    setTimeout(() => setRepairToast(null), 4000);
  };

  const filteredResources = resources.filter(
    (r) => filterCategory === "All" || r.category === filterCategory
  );

  return (
    <PortalLayout
      title="School Infrastructure & Resource Audits"
      subtitle="Mr. Venkatesh R. · GHS Coimbatore · DISE: 33012345"
      avatarLetter="V"
      avatarColor="#3b82f6"
      themeClass="theme-headmaster"
      accentColor="#3b82f6"
    >
      {/* Infrastructure summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Smart Classrooms</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">4 / 6</span>
            <span className="text-[10px] text-blue-400 font-bold">Enabled</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-semibold">
            Targeting 100% smart classrooms by 2027.
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Sanitation Index</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-emerald-400">92%</span>
            <span className="text-[10px] text-emerald-500 font-bold">Excellent</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-semibold">
            Fresh water supply audit passed.
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Library Books</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-amber-400">4,820</span>
            <span className="text-[10px] text-slate-400 font-bold">Volumes</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-semibold">
            +120 new Tamil textbooks cataloged.
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pending Repairs</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-rose-500">2</span>
            <span className="text-[10px] text-rose-400 font-bold">Flagged</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-semibold">
            1 Critical (Roof water leakage).
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Resource inventory register */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-semibold text-white">🏗️ Resource Register & Safety Audit</h2>
              <p className="text-xs text-slate-500 leading-relaxed">Status of general purpose assets and instructional spaces.</p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
              {(["All", "Classroom", "Lab", "Sanitation", "Facility"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    filterCategory === cat
                      ? "bg-blue-600 text-white font-extrabold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="p-4 bg-slate-900/60 rounded-xl border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-md">
                      {res.category}
                    </span>
                    {res.smartEnabled && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
                        🖥️ Smart Screen
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-0.5">{res.name}</h3>
                  <div className="text-xs text-slate-400">
                    Capacity: <span className="text-slate-300">{res.capacity}</span> · Last Audit: <span className="text-slate-500 font-semibold">{res.lastAudited}</span>
                  </div>
                </div>

                <div>
                  <span className={`badge ${
                    res.status === "Excellent"
                      ? "badge-green"
                      : res.status === "Operational"
                      ? "badge-green"
                      : res.status === "Maintenance Required"
                      ? "badge-yellow"
                      : "badge-red"
                  }`}>
                    {res.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Repair reporting desk */}
        <div className="glass rounded-2xl p-6 border border-slate-800 h-fit">
          <h2 className="text-base font-semibold text-white mb-2">🔧 Raise Maintenance Audit Ticket</h2>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">Request physical rehabilitation, plumbing fixes, or terminal updates directly from block administrative funds.</p>

          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Select Infrastructure Unit</label>
              <select
                value={requestItem}
                onChange={(e) => setRequestItem(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                {resources.map((res) => (
                  <option key={res.id} value={res.name}>
                    {res.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Incident/Issue Category</label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="Electrical & Wiring Fault">Electrical & Wiring Fault</option>
                <option value="Roof Leakage / Structural Seepage">Roof Leakage / Structural Seepage</option>
                <option value="Sanitation Fittings Repair">Sanitation Fittings Repair</option>
                <option value="Smart Board Screen Malfunction">Smart Board Screen Malfunction</option>
                <option value="Furniture Replacement Required">Furniture Replacement Required</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Description & Severity Details</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="E.g., Roof tiles broken near Section B rows. Risk of rainfall interruption."
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Submit Maintenance Request
            </button>
          </form>

          {repairToast && (
            <div className="mt-4 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl leading-relaxed">
              {repairToast}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
