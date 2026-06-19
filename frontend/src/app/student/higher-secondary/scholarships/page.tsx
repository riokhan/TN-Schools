"use client";

import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";
import { useState } from "react";

const activeApplications = [
  { id: 1, name: "Moovalur Ramamirtham Ammaiyar Higher Education Assurance Scheme (Pudhumai Penn)", status: "Pending Verification", step: 2, totalSteps: 4, date: "June 10, 2026", color: "text-amber-400" },
  { id: 2, name: "Post Matric Scholarship for SC/ST", status: "Approved", step: 4, totalSteps: 4, date: "May 25, 2026", color: "text-emerald-400" },
];

const discoveredScholarships = [
  { id: 101, name: "Central Sector Scheme of Scholarships for College", amount: "₹12,000 / year", deadline: "Aug 31, 2026", tags: ["National", "Merit Based"] },
  { id: 102, name: "Chief Minister's Merit Award", amount: "₹3,000 / year", deadline: "Sep 15, 2026", tags: ["State", "Toppers"] },
  { id: 103, name: "AICTE Pragati Scholarship for Girls", amount: "₹50,000 / year", deadline: "Oct 30, 2026", tags: ["Technical Edu", "Girls"] },
];

export default function HigherSecondaryScholarshipsPage() {
  const [activeTab, setActiveTab] = useState("tracking");

  return (
    <PortalLayout
      title="Scholarship Application & Tracking Center"
      subtitle="Discover scholarships, manage your documents, and track your applications."
      avatarLetter="A"
      avatarColor="#8b5cf6"
      themeClass="theme-student"
      accentColor="#8b5cf6"
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link href="/student/higher-secondary" className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors w-fit">
          <span>←</span> Back to Dashboard
        </Link>
        
        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-700/50 w-fit">
           <button 
             onClick={() => setActiveTab("tracking")}
             className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === "tracking" ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20" : "text-slate-400 hover:text-white"}`}
           >
             Active Applications
           </button>
           <button 
             onClick={() => setActiveTab("discovery")}
             className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === "discovery" ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20" : "text-slate-400 hover:text-white"}`}
           >
             Discover & Apply
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Digital Locker / Docs */}
        <div className="lg:col-span-1 space-y-6">
           
           <div className="glass rounded-3xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-xl">📁</span> e-Sanad Locker
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Your verified documents linked from the e-Sevai/e-Sanad portal. Used for 1-click scholarship applications.
              </p>
              
              <div className="space-y-3">
                 <div className="bg-slate-900/60 p-3 rounded-xl border border-emerald-500/30 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <span className="text-emerald-400">✓</span>
                       <span className="text-sm font-bold text-slate-300">Community Cert.</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Verified</span>
                 </div>
                 <div className="bg-slate-900/60 p-3 rounded-xl border border-emerald-500/30 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <span className="text-emerald-400">✓</span>
                       <span className="text-sm font-bold text-slate-300">Income Cert.</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Verified</span>
                 </div>
                 <div className="bg-slate-900/60 p-3 rounded-xl border border-emerald-500/30 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <span className="text-emerald-400">✓</span>
                       <span className="text-sm font-bold text-slate-300">Aadhaar Linked</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Verified</span>
                 </div>
                 <div className="bg-slate-900/60 p-3 rounded-xl border border-red-500/30 flex justify-between items-center group cursor-pointer hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-2">
                       <span className="text-red-400">✕</span>
                       <span className="text-sm font-bold text-slate-300">Bank Passbook</span>
                    </div>
                    <span className="text-[10px] text-red-400 group-hover:underline">Upload</span>
                 </div>
              </div>
           </div>

           <div className="glass rounded-3xl p-6 border border-purple-500/30 bg-gradient-to-b from-purple-900/20 to-transparent">
              <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                <span>🤖</span> AI Form Autofill
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Since your EMIS profile and e-Sanad Locker are connected, our AI can autofill 90% of scholarship forms automatically.
              </p>
           </div>

        </div>

        {/* Right Column: Tracking / Discovery */}
        <div className="lg:col-span-2">
           <div className="glass rounded-3xl p-6 border border-slate-700/50 min-h-full">
              
              {activeTab === "tracking" ? (
                <>
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="text-2xl">📡</span> Application Tracker
                  </h2>
                  
                  <div className="space-y-6">
                     {activeApplications.map((app) => (
                       <div key={app.id} className="bg-slate-900/40 p-5 rounded-2xl border border-slate-700/50">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                             <h3 className="font-bold text-white text-base max-w-sm leading-tight">{app.name}</h3>
                             <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded border bg-slate-900 ${app.color} ${app.status === 'Approved' ? 'border-emerald-500/30' : 'border-amber-500/30'}`}>
                               {app.status}
                             </span>
                          </div>
                          
                          {/* Progress Stepper */}
                          <div className="relative mt-8 mb-4">
                             <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-slate-800 rounded-full"></div>
                             <div 
                               className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full transition-all duration-1000"
                               style={{ width: `${((app.step - 1) / (app.totalSteps - 1)) * 100}%` }}
                             ></div>
                             
                             <div className="relative flex justify-between z-10">
                                {["Submitted", "Verification", "Sanction", "Disbursed"].map((stepName, i) => {
                                   const isCompleted = i < app.step;
                                   const isCurrent = i === app.step - 1;
                                   return (
                                     <div key={i} className="flex flex-col items-center gap-2">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                          ${isCompleted ? 'bg-purple-500 border-purple-500 text-white text-[10px]' : 
                                            isCurrent ? 'bg-slate-900 border-amber-500 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 
                                            'bg-slate-900 border-slate-700'}`}
                                        >
                                           {isCompleted && "✓"}
                                        </div>
                                        <span className={`text-[10px] font-bold ${isCurrent ? 'text-white' : 'text-slate-500'}`}>{stepName}</span>
                                     </div>
                                   )
                                })}
                             </div>
                          </div>
                          
                          <p className="text-[10px] text-slate-500 text-right mt-4">Last Updated: {app.date}</p>
                       </div>
                     ))}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="text-2xl">🔍</span> Eligible Scholarships
                  </h2>
                  <p className="text-sm text-slate-400 mb-6">Based on your academic stream (Biology) and demographic data, you are eligible to apply for the following:</p>
                  
                  <div className="space-y-4">
                     {discoveredScholarships.map((scholarship) => (
                       <div key={scholarship.id} className="bg-slate-900/40 p-5 rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                             <h3 className="font-bold text-white text-base mb-2">{scholarship.name}</h3>
                             <div className="flex items-center gap-4 mb-3">
                                <span className="text-sm font-black text-amber-400">{scholarship.amount}</span>
                                <span className="text-xs text-red-400 font-bold flex items-center gap-1"><span>⏰</span> Ends {scholarship.deadline}</span>
                             </div>
                             <div className="flex flex-wrap gap-2">
                               {scholarship.tags.map((tag, tidx) => (
                                 <span key={tidx} className="text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md">
                                   {tag}
                                 </span>
                               ))}
                             </div>
                          </div>
                          
                          <button className="shrink-0 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20 transition-colors w-full md:w-auto">
                             1-Click Apply
                          </button>
                       </div>
                     ))}
                  </div>
                </>
              )}

           </div>
        </div>

      </div>
    </PortalLayout>
  );
}
