"use client";

import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";
import { useState } from "react";

const subjects = [
  { name: "Physics", progress: 75, target: "95+", color: "text-blue-400", bgBorder: "border-blue-500/30", gradient: "from-blue-600 to-indigo-600",
    topics: [
      { name: "Electrostatics", status: "Mastered", weightage: "8%" },
      { name: "Optics", status: "Needs Review", weightage: "12%" },
      { name: "Modern Physics", status: "In Progress", weightage: "15%" },
    ]
  },
  { name: "Chemistry", progress: 82, target: "98+", color: "text-emerald-400", bgBorder: "border-emerald-500/30", gradient: "from-emerald-600 to-teal-600",
    topics: [
      { name: "Solid State", status: "Mastered", weightage: "10%" },
      { name: "P-Block Elements", status: "Needs Review", weightage: "18%" },
      { name: "Biomolecules", status: "Not Started", weightage: "6%" },
    ]
  },
  { name: "Biology", progress: 90, target: "100", color: "text-pink-400", bgBorder: "border-pink-500/30", gradient: "from-pink-600 to-rose-600",
    topics: [
      { name: "Reproduction", status: "Mastered", weightage: "14%" },
      { name: "Genetics", status: "Mastered", weightage: "18%" },
      { name: "Ecology", status: "In Progress", weightage: "12%" },
    ]
  },
];

const importantMaterials = [
  { title: "Last 10 Years PYQs", type: "PDF Bundle", icon: "📚", color: "text-amber-400", bg: "bg-amber-500/10" },
  { title: "Important Derivations", type: "Quick Notes", icon: "✍️", color: "text-blue-400", bg: "bg-blue-500/10" },
  { title: "Organic Name Reactions", type: "Flashcards", icon: "🧪", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { title: "Biology Diagrams", type: "Visual Guide", icon: "🖼️", color: "text-pink-400", bg: "bg-pink-500/10" },
];

export default function BoardPrepPage() {
  const [activeSubject, setActiveSubject] = useState(0);

  return (
    <PortalLayout
      title="HSC Board Preparation"
      subtitle="Your ultimate command center for scoring 95%+ in the Class 12 State Board Exams."
      avatarLetter="A"
      avatarColor="#8b5cf6"
      themeClass="theme-student"
      accentColor="#8b5cf6"
    >
      <div className="mb-6 flex items-center justify-between">
         <Link href="/student/higher-secondary" className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
            <span>←</span> Back to Dashboard
         </Link>
         
         {/* Live Exam Countdown */}
         <div className="bg-slate-900/60 border border-purple-500/30 px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg shadow-purple-500/10">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </span>
            <span className="text-xs text-slate-300 font-bold uppercase tracking-wider">Exam Starts In:</span>
            <span className="font-black text-white font-mono text-sm tracking-widest text-purple-300">62:14:35:10</span>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: AI Strategy & Materials */}
        <div className="lg:col-span-1 space-y-6">
           
           {/* AI Board Strategy */}
           <div className="glass rounded-3xl p-6 border border-slate-700/50 bg-gradient-to-b from-purple-900/20 to-transparent relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full"></div>
             <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 relative z-10">
               <span className="text-xl">🤖</span> AI Board Strategy
             </h2>
             <p className="text-xs text-slate-300 leading-relaxed mb-4 relative z-10">
               Based on historical state board trends, <span className="font-bold text-white text-purple-300">Optics</span> and <span className="font-bold text-white text-purple-300">P-Block Elements</span> carry the highest weightage. You need to review them before attempting your next full mock.
             </p>
             <button className="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-white text-sm font-bold shadow-lg shadow-purple-500/20 transition-all relative z-10">
               Generate Custom Revision Plan
             </button>
           </div>

           {/* High-Yield Materials */}
           <div className="glass rounded-3xl p-6 border border-slate-700/50">
             <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
               <span className="text-xl">🔥</span> High-Yield Materials
             </h2>
             <div className="space-y-3">
               {importantMaterials.map((item, idx) => (
                 <div key={idx} className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50 flex items-center justify-between hover:border-slate-500 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                       <div className={`w-10 h-10 rounded-lg ${item.bg} ${item.color} flex items-center justify-center text-lg`}>
                         {item.icon}
                       </div>
                       <div>
                         <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">{item.title}</h4>
                         <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{item.type}</p>
                       </div>
                    </div>
                    <div className="text-slate-600 group-hover:text-white transition-colors">
                      ↓
                    </div>
                 </div>
               ))}
             </div>
           </div>

        </div>

        {/* Right Column: Subject Tracking */}
        <div className="lg:col-span-2 space-y-6">
           
           {/* Overall Progress */}
           <div className="glass rounded-3xl p-6 border border-slate-700/50 flex flex-col sm:flex-row gap-6 items-center">
              <div className="relative w-32 h-32 shrink-0">
                 <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="text-purple-500"
                      strokeDasharray="83, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">83%</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Completion</span>
                 </div>
              </div>
              <div className="flex-1">
                 <h2 className="text-2xl font-black text-white mb-2">Overall HSC Syllabus</h2>
                 <p className="text-sm text-slate-400 leading-relaxed mb-4">
                   You are on track to complete the entire syllabus 45 days before the board exams. Keep up the momentum to allow ample time for full-length mock tests and PYQs.
                 </p>
                 <div className="flex gap-4">
                    <div className="bg-slate-900/50 border border-slate-700 px-4 py-2 rounded-lg">
                       <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Target Score</span>
                       <span className="text-lg font-black text-amber-400">580/600</span>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-700 px-4 py-2 rounded-lg">
                       <span className="text-xs text-slate-500 uppercase font-bold block mb-1">State Rank Goal</span>
                       <span className="text-lg font-black text-emerald-400">Top 100</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Subject Deep Dive */}
           <div className="glass rounded-3xl p-6 border border-slate-700/50 min-h-[400px]">
              
              {/* Subject Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                 {subjects.map((sub, idx) => (
                   <button 
                     key={idx}
                     onClick={() => setActiveSubject(idx)}
                     className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                       activeSubject === idx 
                         ? `bg-slate-800 ${sub.bgBorder} ${sub.color}` 
                         : 'bg-slate-900/40 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:text-white'
                     }`}
                   >
                     {sub.name}
                   </button>
                 ))}
              </div>

              {/* Subject Content */}
              {subjects.map((sub, idx) => (
                <div key={idx} className={`${activeSubject === idx ? 'block' : 'hidden'} animate-fade-in`}>
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-8 rounded-full bg-gradient-to-b ${sub.gradient}`}></div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{sub.name} Masterclass</h3>
                          <p className="text-xs text-slate-400">Current Progress: {sub.progress}% • Target: {sub.target}</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-white border border-slate-600 transition-colors">
                        View Full Syllabus
                      </button>
                   </div>
                   
                   {/* Topics List */}
                   <div className="space-y-3 mt-6">
                     <div className="grid grid-cols-12 text-[10px] uppercase font-bold text-slate-500 tracking-wider px-4 pb-2 border-b border-slate-800">
                        <div className="col-span-6">Topic / Chapter</div>
                        <div className="col-span-3 text-center">Weightage</div>
                        <div className="col-span-3 text-right">Status</div>
                     </div>
                     {sub.topics.map((topic, tidx) => (
                       <div key={tidx} className="grid grid-cols-12 items-center bg-slate-900/40 border border-slate-800 rounded-xl p-4 hover:border-slate-600 transition-colors">
                          <div className="col-span-6 font-bold text-white text-sm">{topic.name}</div>
                          <div className="col-span-3 text-center text-sm font-black text-amber-400">{topic.weightage}</div>
                          <div className="col-span-3 text-right">
                             <span className={`text-[10px] uppercase font-black tracking-wider px-2 py-1 rounded 
                               ${topic.status === 'Mastered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                 topic.status === 'Needs Review' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                                 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}
                             >
                               {topic.status}
                             </span>
                          </div>
                       </div>
                     ))}
                   </div>
                </div>
              ))}

           </div>

        </div>
      </div>
    </PortalLayout>
  );
}
