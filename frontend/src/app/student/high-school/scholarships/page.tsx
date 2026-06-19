"use client";

import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";
import { useState } from "react";

const scholarships = [
  { id: 1, name: "National Means-cum-Merit Scholarship (NMMS)", amount: "₹12,000 / year", type: "Merit + Means", eligible: true, icon: "🇮🇳", desc: "Awarded to meritorious students of economically weaker sections." },
  { id: 2, name: "State Govt Merit Scholarship", amount: "₹5,000 / year", type: "Merit Based", eligible: true, icon: "🏛️", desc: "For students scoring above 80% in previous academic year." },
  { id: 3, name: "Pudhumai Penn Scheme", amount: "₹1,000 / month", type: "Girls Only", eligible: false, icon: "👩🏽‍🎓", desc: "Financial assistance for girls pursuing higher education after completing schooling in Govt schools." },
  { id: 4, name: "Pre-Matric Scholarship for Minorities", amount: "Varies", type: "Category Based", eligible: null, icon: "🤝", desc: "For students belonging to minority communities." },
];

export default function HighSchoolScholarshipsPage() {
  const [checkingId, setCheckingId] = useState<number | null>(null);

  const handleCheckEligibility = (id: number) => {
    setCheckingId(id);
    setTimeout(() => {
      setCheckingId(null);
      // In a real app, this would update the state.
      // For demo, we just show a simulated loading state.
      alert("Eligibility check complete based on your EMIS profile data!");
    }, 1500);
  };

  return (
    <PortalLayout
      title="Scholarships Hub"
      subtitle="Discover scholarships you might be eligible for and prepare for your future."
      avatarLetter="A"
      avatarColor="#ef4444"
      themeClass="theme-student"
      accentColor="#ef4444"
    >
      <div className="mb-6">
        <Link href="/student/high-school" className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors w-fit">
          <span>←</span> Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: EMIS Profile Summary */}
        <div className="lg:col-span-1 space-y-6">
           <div className="glass rounded-3xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-xl">👤</span> Your EMIS Data
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                We automatically use your verified EMIS profile data to check if you are eligible for state and national scholarships.
              </p>
              
              <div className="space-y-3">
                 <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Class</span>
                    <span className="text-sm font-bold text-white">10th Std</span>
                 </div>
                 <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Previous Year %</span>
                    <span className="text-sm font-bold text-emerald-400">88.5%</span>
                 </div>
                 <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Category</span>
                    <span className="text-sm font-bold text-white">OBC</span>
                 </div>
                 <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Annual Income</span>
                    <span className="text-sm font-bold text-white">₹1.2L</span>
                 </div>
              </div>
              
              <button className="w-full mt-4 py-2 border border-slate-600 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors">
                 Update Income Details
              </button>
           </div>
        </div>

        {/* Right Column: Scholarship List */}
        <div className="lg:col-span-2">
           <div className="glass rounded-3xl p-6 border border-slate-700/50 min-h-full">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">🎓</span> Scholarships Overview
              </h2>
              
              <div className="space-y-4">
                 {scholarships.map((scholarship) => (
                   <div key={scholarship.id} className="bg-slate-900/40 p-5 rounded-2xl border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-red-500/30 transition-colors">
                      <div className="flex gap-4 items-start">
                         <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl shrink-0 border border-slate-700">
                            {scholarship.icon}
                         </div>
                         <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                               <h3 className="font-bold text-white text-base">{scholarship.name}</h3>
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                                 {scholarship.type}
                               </span>
                            </div>
                            <p className="text-sm font-black text-amber-400 mb-2">{scholarship.amount}</p>
                            <p className="text-xs text-slate-400 max-w-md">{scholarship.desc}</p>
                         </div>
                      </div>
                      
                      <div className="shrink-0 md:text-right">
                         {scholarship.eligible === true ? (
                           <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold">
                             <span>✓</span> You Are Eligible
                           </div>
                         ) : scholarship.eligible === false ? (
                           <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-500 border border-slate-700 rounded-xl text-xs font-bold">
                             <span>✕</span> Not Eligible
                           </div>
                         ) : (
                           <button 
                             onClick={() => handleCheckEligibility(scholarship.id)}
                             disabled={checkingId === scholarship.id}
                             className="inline-flex justify-center items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all min-w-[140px]"
                           >
                             {checkingId === scholarship.id ? "Checking..." : "Check Eligibility"}
                           </button>
                         )}
                      </div>
                   </div>
                 ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-4">
                 <span className="text-2xl">ℹ️</span>
                 <p className="text-sm text-slate-300 leading-relaxed">
                   In Class 9 and 10, your focus should be on maintaining good grades. High marks in your SSLC Board Exams will open up many more scholarship opportunities for Higher Secondary and College!
                 </p>
              </div>

           </div>
        </div>

      </div>
    </PortalLayout>
  );
}
