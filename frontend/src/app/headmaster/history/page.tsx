"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface Milestone {
  id: number;
  year: string;
  title: string;
  details: string;
  icon: string;
}

export default function HistoryPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: 1, year: "1955", title: "School Founding Year", details: "GHS Coimbatore established in a single-room thatch roof hut with 15 students and 1 teacher.", icon: "🏫" },
    { id: 2, year: "1972", title: "High School Roster Status", details: "Formally recognized by Tamil Nadu State Education Department as a government High School (Class 6-10).", icon: "📐" },
    { id: 3, year: "1991", title: "Science Lab Wing Built", details: "First brick-and-mortar wing built for laboratory experimentation with basic glassware.", icon: "🔬" },
    { id: 4, year: "2011", title: "Computer Lab Center", details: "Inaugurated our first computer laboratory with 15 donated desktops and basic typing tutor sessions.", icon: "💻" },
    { id: 5, year: "2022", title: "AI Smart Classrooms Setup", details: "Installation of the first smart screen boards and tablets for interactive digital learning models.", icon: "🤖" },
  ]);

  // Milestone Form State
  const [newYear, setNewYear] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDetails, setNewDetails] = useState("");
  const [historyToast, setHistoryToast] = useState<string | null>(null);

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYear || !newTitle || !newDetails) return;

    const newMilestone: Milestone = {
      id: Date.now(),
      year: newYear,
      title: newTitle,
      details: newDetails,
      icon: "📜"
    };

    // Sort milestones chronologically after adding
    setMilestones(prev => [...prev, newMilestone].sort((a, b) => Number(a.year) - Number(b.year)));
    setHistoryToast(`✓ Historical milestone for year ${newYear} logged and sorted into school archive!`);
    
    // Reset Form
    setNewYear("");
    setNewTitle("");
    setNewDetails("");

    setTimeout(() => setHistoryToast(null), 4000);
  };

  return (
    <PortalLayout
      title="School History & Archival Timeline"
      subtitle="Mr. Venkatesh R. · GHS Coimbatore · DISE: 33012345"
      avatarLetter="V"
      avatarColor="#3b82f6"
      themeClass="theme-headmaster"
      accentColor="#3b82f6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Timeline Visual Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-2xl p-6 border border-slate-800">
            <h2 className="text-base font-semibold text-white mb-1">📜 Milestone Timeline (Since 1955)</h2>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Historical evolution of school infrastructure, enrollment benchmarks, and major academic milestones.
            </p>
          </div>

          <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-8">
            {milestones.map((ms) => (
              <div key={ms.id} className="relative group">
                {/* Timeline Dot */}
                <span className="absolute -left-[35px] top-0.5 w-6 h-6 rounded-full bg-slate-900 border-2 border-blue-500 flex items-center justify-center text-xs group-hover:scale-110 transition-transform">
                  {ms.icon}
                </span>

                <div className="glass rounded-2xl p-5 border border-slate-800 hover:border-slate-750 transition-colors">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
                    {ms.year}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-2 mb-1">{ms.title}</h3>
                  <p className="text-xs text-slate-450 leading-relaxed">{ms.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Archival entry workspace */}
        <div className="glass rounded-2xl p-6 border border-slate-800 h-fit">
          <h2 className="text-base font-semibold text-white mb-2">📜 Document Campus Milestone</h2>
          <p className="text-xs text-slate-500 leading-relaxed mb-4 font-medium">
            Log construction expansions, national honors, or notable alumni visits to GHS Coimbatore's permanent history books.
          </p>

          <form onSubmit={handleAddMilestone} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Calendar Year</label>
              <input
                type="number"
                min="1900"
                max="2100"
                placeholder="E.g., 2018"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Milestone Event Title</label>
              <input
                type="text"
                placeholder="E.g., Opening of Library Block"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Description / Historical Context</label>
              <textarea
                value={newDetails}
                onChange={(e) => setNewDetails(e.target.value)}
                placeholder="Detailed summary of the expansion, donation amount, or key figures..."
                rows={4}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Add to School Archives
            </button>
          </form>

          {historyToast && (
            <div className="mt-4 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl leading-relaxed">
              {historyToast}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
