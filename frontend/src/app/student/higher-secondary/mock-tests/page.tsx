"use client";

import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";
import { useState } from "react";

const testHistory = [
  { id: "T-104", name: "NEET Part Test: Human Physiology", date: "Oct 18, 2026", score: 280, total: 360, accuracy: "82%", percentile: 94, rank: 142, totalStudents: 4500, timeTaken: "52m", status: "Analyzed" },
  { id: "T-103", name: "HSC Half-Yearly Mock: Physics", date: "Oct 10, 2026", score: 70, total: 100, accuracy: "75%", percentile: 88, rank: 530, totalStudents: 6200, timeTaken: "2h 45m", status: "Analyzed" },
  { id: "T-102", name: "HSC Half-Yearly Mock: Chemistry", date: "Oct 05, 2026", score: 88, total: 100, accuracy: "90%", percentile: 98, rank: 45, totalStudents: 6200, timeTaken: "2h 30m", status: "Analyzed" },
  { id: "T-101", name: "NEET Full Syllabus Mock 3", date: "Sep 28, 2026", score: 580, total: 720, accuracy: "85%", percentile: 92, rank: 850, totalStudents: 12000, timeTaken: "2h 55m", status: "Analyzed" },
];

const upcomingTests = [
  { name: "NEET Full Syllabus Mock 4", date: "Oct 25, 2026", time: "10:00 AM", duration: "3 Hours", syllabus: "Full 11th & 12th Syllabus", type: "State-wide Mock", color: "from-amber-500 to-orange-600" },
  { name: "HSC Model Exam: Biology", date: "Oct 28, 2026", time: "09:00 AM", duration: "3 Hours", syllabus: "Chapters 1-8", type: "School Level", color: "from-pink-500 to-rose-600" },
];

const weakTopics = [
  { topic: "Thermodynamics", subject: "Physics", accuracy: "45%", impact: "High" },
  { topic: "Chemical Equilibrium", subject: "Chemistry", accuracy: "55%", impact: "Medium" },
  { topic: "Plant Anatomy", subject: "Biology", accuracy: "60%", impact: "Medium" },
];

export default function MockTestsPage() {
  const [filter, setFilter] = useState("all");

  return (
    <PortalLayout
      title="Mock Tests & Analytics"
      subtitle="Evaluate your exam readiness, track your rank progression, and analyze your mistakes."
      avatarLetter="A"
      avatarColor="#f59e0b"
      themeClass="theme-student"
      accentColor="#f59e0b"
    >
      <div className="mb-6 flex items-center gap-4">
         <Link href="/student/higher-secondary" className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
            <span>←</span> Back to Dashboard
         </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Upcoming & Analytics */}
        <div className="lg:col-span-1 space-y-6">
           
           {/* Upcoming Tests Banner */}
           <div className="glass rounded-3xl p-6 border border-slate-700/50 bg-slate-900/40 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full"></div>
             <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 relative z-10">
               <span className="text-xl">⏰</span> Upcoming Tests
             </h2>
             
             <div className="space-y-4 relative z-10">
               {upcomingTests.map((test, idx) => (
                 <div key={idx} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 relative overflow-hidden group hover:border-slate-500 transition-colors">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${test.color}`}></div>
                    <div className="pl-3">
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1 block">{test.type}</span>
                       <h3 className="font-bold text-white text-sm mb-2">{test.name}</h3>
                       <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                         <div className="flex items-center gap-1"><span>📅</span> {test.date}</div>
                         <div className="flex items-center gap-1"><span>⏱️</span> {test.time}</div>
                       </div>
                       <p className="text-xs text-slate-500 mt-2">Syllabus: {test.syllabus}</p>
                    </div>
                 </div>
               ))}
             </div>
             
             <button className="w-full mt-4 py-3 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 rounded-xl text-white text-sm font-bold shadow-lg transition-all active:scale-95">
               Register for New Mock
             </button>
           </div>

           {/* AI Performance Analysis */}
           <div className="glass rounded-3xl p-6 border border-slate-700/50">
             <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
               <span className="text-xl">🤖</span> AI Error Analysis
             </h2>
             <p className="text-xs text-slate-400 leading-relaxed mb-4">Based on your last 5 mock tests, I have identified patterns in the questions you get wrong. Focus on these areas to improve your score.</p>
             
             <div className="space-y-3">
               {weakTopics.map((topic, idx) => (
                 <div key={idx} className="bg-slate-900/60 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white mb-0.5">{topic.topic}</h4>
                      <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">{topic.subject} • {topic.impact} Impact</p>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs font-black text-red-400">{topic.accuracy}</span>
                      <span className="text-[10px] text-slate-500">Accuracy</span>
                    </div>
                 </div>
               ))}
             </div>
             
             <button className="w-full mt-4 py-2 border border-slate-600 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
               Generate Remedial Practice →
             </button>
           </div>

        </div>

        {/* Right Column: Test History & Leaderboard */}
        <div className="lg:col-span-2">
           <div className="glass rounded-3xl p-6 border border-slate-700/50 h-full flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">📈</span> Mock Test History
                </h2>
                
                <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-700/50 w-fit">
                   <button 
                     onClick={() => setFilter("all")}
                     className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${filter === "all" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
                   >
                     All Tests
                   </button>
                   <button 
                     onClick={() => setFilter("neet")}
                     className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${filter === "neet" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
                   >
                     NEET Only
                   </button>
                   <button 
                     onClick={() => setFilter("hsc")}
                     className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${filter === "hsc" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
                   >
                     HSC Board
                   </button>
                </div>
              </div>

              {/* Progress Chart Placeholder */}
              <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 mb-6 flex items-end justify-between gap-2 h-48 relative overflow-hidden group">
                 {/* Fake Chart Bars */}
                 <div className="absolute inset-0 flex items-end justify-around px-4 pb-8 pt-12">
                   {[40, 55, 48, 65, 75, 70, 85, 92].map((height, i) => (
                     <div key={i} className="w-[8%] bg-gradient-to-t from-amber-600/80 to-amber-400 rounded-t-sm relative group/bar hover:brightness-125 transition-all cursor-pointer" style={{ height: `${height}%` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                          {height}%ile
                        </div>
                     </div>
                   ))}
                 </div>
                 <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                   Percentile Trend (Last 8 Tests)
                 </div>
              </div>

              {/* History List */}
              <div className="flex-1 overflow-auto pr-2 space-y-3">
                 {testHistory
                    .filter(t => filter === "all" ? true : filter === "neet" ? t.name.includes("NEET") : t.name.includes("HSC"))
                    .map((test, idx) => (
                   <div key={idx} className="bg-slate-800/40 hover:bg-slate-800 p-4 rounded-xl border border-slate-700/50 transition-colors cursor-pointer group">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                         
                         {/* Test Info */}
                         <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                               <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">{test.id}</span>
                               <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">{test.status}</span>
                            </div>
                            <h3 className="text-sm font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">{test.name}</h3>
                            <p className="text-xs text-slate-400 flex gap-3">
                              <span>📅 {test.date}</span>
                              <span>⏱️ {test.timeTaken}</span>
                            </p>
                         </div>

                         {/* Score & Rank */}
                         <div className="flex items-center gap-6 md:border-l border-slate-700 md:pl-6">
                            <div className="text-center">
                              <span className="block text-lg font-black text-white leading-none">{test.score}<span className="text-sm text-slate-500">/{test.total}</span></span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">Score</span>
                            </div>
                            <div className="text-center">
                              <span className="block text-lg font-black text-amber-400 leading-none">{test.percentile}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">Percentile</span>
                            </div>
                            <div className="text-center hidden sm:block">
                              <span className="block text-lg font-black text-white leading-none">#{test.rank}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">of {test.totalStudents}</span>
                            </div>
                            <div>
                               <button className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white hover:bg-amber-500 transition-colors">
                                 →
                               </button>
                            </div>
                         </div>
                         
                      </div>
                   </div>
                 ))}
                 
                 {testHistory.filter(t => filter === "all" ? true : filter === "neet" ? t.name.includes("NEET") : t.name.includes("HSC")).length === 0 && (
                   <div className="text-center py-8">
                      <div className="text-4xl mb-2">📭</div>
                      <p className="text-slate-400 text-sm">No tests found for this filter.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>

      </div>
    </PortalLayout>
  );
}
