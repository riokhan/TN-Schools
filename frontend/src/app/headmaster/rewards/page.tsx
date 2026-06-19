"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface HonorRecord {
  id: number;
  title: string;
  recipient: string;
  category: "School Award" | "Student Medal" | "Teacher Recognition";
  date: string;
  citation: string;
}

export default function RewardsPage() {
  const [honors, setHonors] = useState<HonorRecord[]>([
    { id: 1, title: "Clean School Campus State Award (Swachh Vidyalaya)", recipient: "GHS Coimbatore", category: "School Award", date: "2025", citation: "Awarded by the School Education Department for excellence in hygiene, fresh water supply, and garbage segregation." },
    { id: 2, title: "State Science Congress Gold Medalist", recipient: "Arjun Kumar (Class 10A)", category: "Student Medal", date: "2026", citation: "For building the AI-driven water distribution prototype under the guidance of Mr. Rajan." },
    { id: 3, title: "Best Science Educator State Citation", recipient: "Mr. Rajan K. (Science)", category: "Teacher Recognition", date: "2026", citation: "Recognized at Chennai HQ for pioneering virtual laboratory worksheets and mentoring 5 state science winners." },
    { id: 4, title: "District Athletics Hurdles Champion", recipient: "Shalini S. (Class 11)", category: "Student Medal", date: "2026", citation: "Gold medal winner in the 100m hurdles representing GHS Coimbatore." },
    { id: 5, title: "DISE Enrollment Growth Trophy", recipient: "GHS Coimbatore", category: "School Award", date: "2025", citation: "Given to schools achieving +15% student retention rate year-on-year." },
  ]);

  // Honor register Form State
  const [honorTitle, setHonorTitle] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [honorCat, setHonorCat] = useState<"School Award" | "Student Medal" | "Teacher Recognition">("Student Medal");
  const [citationText, setCitationText] = useState("");
  const [rewardToast, setRewardToast] = useState<string | null>(null);

  const handlePostHonor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!honorTitle || !recipientName) return;

    const newRecord: HonorRecord = {
      id: Date.now(),
      title: honorTitle,
      recipient: recipientName,
      category: honorCat,
      date: "2026",
      citation: citationText || "Honored for outstanding contributions to the institution's community goals."
    };

    setHonors(prev => [newRecord, ...prev]);
    setRewardToast(`✓ New Honor cataloged! '${honorTitle}' added under ${honorCat} roster.`);
    
    // Reset Form
    setHonorTitle("");
    setRecipientName("");
    setCitationText("");

    setTimeout(() => setRewardToast(null), 4000);
  };

  return (
    <PortalLayout
      title="Rewards, Honors & Citations Board"
      subtitle="Mr. Venkatesh R. · GHS Coimbatore · DISE: 33012345"
      avatarLetter="V"
      avatarColor="#3b82f6"
      themeClass="theme-headmaster"
      accentColor="#3b82f6"
    >
      {/* Honors counter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">State Recognitions</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-amber-400">3 Awards</span>
            <span className="text-[10px] text-amber-500 font-bold">State Level</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-semibold">
            Highest ranking in block cohort.
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Student Medals</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">12 Medals</span>
            <span className="text-[10px] text-blue-400 font-bold">District Heats</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-semibold">
            Including 4 sports athletic Golds.
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Teacher Citations</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-emerald-400">4 Staff</span>
            <span className="text-[10px] text-emerald-500 font-bold">Commended</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-semibold">
            Recognized for ICT & Lab innovations.
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">DISE School Rank</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">Grade A+</span>
            <span className="text-[10px] text-emerald-400 font-bold">Top 5%</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-semibold">
            Infrastructure & results composite.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Honors Listing Board */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-base font-semibold text-white mb-1">🏆 School Honors Ledger</h2>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">Official registry of awards won by students, faculty, and school operations.</p>

          <div className="space-y-4">
            {honors.map((hn) => (
              <div
                key={hn.id}
                className="p-4 bg-slate-900/60 rounded-xl border border-slate-850 flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md">
                      🏅 {hn.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">Year: {hn.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight">{hn.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{hn.citation}</p>
                  <div className="text-[11px] text-slate-500">
                    Recipient: <strong className="text-slate-350">{hn.recipient}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Honor Entry form */}
        <div className="glass rounded-2xl p-6 border border-slate-800 h-fit">
          <h2 className="text-base font-semibold text-white mb-2">🏅 Record New Citation</h2>
          <p className="text-xs text-slate-500 leading-relaxed mb-4 font-medium">
            Register certificates, science fair recognitions, or sports medals won by pupils or teaching staff.
          </p>

          <form onSubmit={handlePostHonor} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Award / Certificate Title</label>
              <input
                type="text"
                placeholder="E.g., District Chess Runner-up"
                value={honorTitle}
                onChange={(e) => setHonorTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Recipient Name</label>
              <input
                type="text"
                placeholder="E.g., Priya S. (Class 10B)"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Award Category</label>
              <select
                value={honorCat}
                onChange={(e) => setHonorCat(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="School Award">School Award</option>
                <option value="Student Medal">Student Medal</option>
                <option value="Teacher Recognition">Teacher Recognition</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Citation Details</label>
              <textarea
                value={citationText}
                onChange={(e) => setCitationText(e.target.value)}
                placeholder="Details of the award achievement, jury decision..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Post Citation Record
            </button>
          </form>

          {rewardToast && (
            <div className="mt-4 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl leading-relaxed">
              {rewardToast}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
