"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface CircularItem {
  id: number;
  refCode: string;
  title: string;
  category: "Welfare Scheme" | "Exam Policy" | "Hygiene & Audit" | "General Admin";
  date: string;
  targetAudience: string;
}

export default function CircularsPage() {
  const [circulars, setCirculars] = useState<CircularItem[]>([
    { id: 1, refCode: "BEO-2026-0812", title: "Welfare cycle stock verification directive", category: "Welfare Scheme", date: "June 18, 2026", targetAudience: "Headmasters only" },
    { id: 2, refCode: "BEO-2026-0798", title: "SSLC remedial mock exams guidelines", category: "Exam Policy", date: "June 14, 2026", targetAudience: "HMs & Teachers" },
    { id: 3, refCode: "BEO-2026-0755", title: "Sanitation & hygiene compliance reports", category: "Hygiene & Audit", date: "June 02, 2026", targetAudience: "All Portals" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [refCode, setRefCode] = useState("BEO-2026-0820");
  const [category, setCategory] = useState<"Welfare Scheme" | "Exam Policy" | "Hygiene & Audit" | "General Admin">("General Admin");
  const [targetAudience, setTargetAudience] = useState("All Portals");

  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !refCode) return;

    const newCircular: CircularItem = {
      id: Date.now(),
      refCode,
      title,
      category,
      date: "Today",
      targetAudience,
    };

    setCirculars(prev => [newCircular, ...prev]);
    setTitle("");
    setIsModalOpen(false);
    setToast(`🎉 Circular '${newCircular.title}' published successfully.`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleExcelSimulate = () => {
    setIsUploading(true);
    setTimeout(() => {
      const excelCirculars: CircularItem[] = [
        { id: 4, refCode: "BEO-2026-0824", title: "Model Exam seating guidelines draft", category: "Exam Policy", date: "Today (Excel)", targetAudience: "HMs & Teachers" },
        { id: 5, refCode: "BEO-2026-0830", title: "PTA meeting schedule adjustments", category: "General Admin", date: "Today (Excel)", targetAudience: "All Portals" },
      ];
      setCirculars(prev => [...excelCirculars, ...prev]);
      setIsUploading(false);
      setIsModalOpen(false);
      setToast("📊 Circular directives spreadsheet parsed successfully! 2 new announcements published.");
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  return (
    <PortalLayout
      title="Official Circulars & Notifications"
      subtitle="Mr. Murugesan P. · Coimbatore South Block"
      avatarLetter="M"
      avatarColor="#8b5cf6"
      themeClass="theme-beo"
      accentColor="#8b5cf6"
    >
      {/* Counters Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Published</span>
          <div className="text-2xl font-black text-white mt-2">
            {circulars.length} Circulars
          </div>
          <span className="text-[10px] text-slate-500 font-bold block mt-1">EMIS database synced</span>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Mapped to School Portals</span>
          <div className="text-2xl font-black text-emerald-450 mt-2">
            All Synced
          </div>
          <span className="text-[10px] text-slate-500 font-bold block mt-1">Live broadcast active</span>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Recent Directives</span>
          <div className="text-2xl font-black text-blue-400 mt-2">
            {circulars.filter(c => c.category === "Welfare Scheme" || c.category === "Exam Policy").length} Directives
          </div>
          <span className="text-[10px] text-slate-500 font-bold block mt-1">Class 10 & 12 priority</span>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Read Receipt Mean</span>
          <div className="text-2xl font-black text-white mt-2">
            92.8%
          </div>
          <span className="text-[10px] text-slate-500 font-bold block mt-1">HM portals tracked</span>
        </div>
      </div>

      {toast && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* Circulars register */}
      <div className="glass rounded-2xl p-6 border border-slate-800 mb-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-base font-semibold text-white">📢 Circular Directives Feed</h2>
            <p className="text-xs text-slate-500 leading-relaxed">Official mandates, board alerts, and general administrative orders published to the block.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition-all shadow-md"
          >
            + Publish Circular
          </button>
        </div>

        <div className="space-y-4">
          {circulars.map((c) => (
            <div
              key={c.id}
              className="p-4 bg-slate-900/60 rounded-xl border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-md">
                    {c.category}
                  </span>
                  <span className="text-[10px] text-slate-550 font-bold">Ref: {c.refCode}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">📅 {c.date}</span>
                </div>
                <h3 className="text-sm font-bold text-white leading-tight">{c.title}</h3>
                <div className="text-[11px] text-slate-455">
                  Target Audience: <strong className="text-slate-350">{c.targetAudience}</strong>
                </div>
              </div>

              <div className="text-right">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Simulating PDF download for ${c.refCode}...`);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors border border-slate-700"
                >
                  ⬇ PDF
                </a>
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
              <h3 className="text-sm font-bold text-white">📢 Publish Administrative Circular Directive</h3>
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
                <div className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-2">Manual Directive</div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Circular Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Welfare cycle stock checks"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Reference Code</label>
                    <input
                      type="text"
                      required
                      value={refCode}
                      onChange={(e) => setRefCode(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Target Audience</label>
                    <select
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                    >
                      <option value="All Portals">All Portals</option>
                      <option value="Headmasters only">Headmasters only</option>
                      <option value="HMs & Teachers">HMs & Teachers</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Circular Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="General Admin">General Admin</option>
                    <option value="Welfare Scheme">Welfare Scheme</option>
                    <option value="Exam Policy">Exam Policy</option>
                    <option value="Hygiene & Audit">Hygiene & Audit</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md mt-2"
                >
                  Publish Directive
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
                        <span className="text-xs font-bold text-white">Import Circulars List</span>
                        <span className="text-[9px] text-slate-500 leading-normal">
                          Click to simulate dragging <strong>announcements_directives.xlsx</strong> into this dropzone
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 italic leading-relaxed pt-4">
                  * Live synchronization broadcasts circular details to school dashboard panels.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
