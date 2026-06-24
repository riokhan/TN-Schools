"use client";

import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";
import { useState } from "react";

// Mock data updated to include "Units"
const subjectDetails: Record<string, any> = {
  "mathematics": {
    name: "Mathematics",
    teacher: "Mrs. Revathi",
    progress: 78,
    color: "#6366f1",
    bgClass: "from-indigo-600 to-indigo-400",
    icon: "📐",
    units: [
      { 
        id: "u1",
        title: "Unit 1: Algebraic Expressions", 
        status: "Completed", 
        score: "92%",
        summary: "This unit covers the fundamentals of algebraic expressions, focusing on identifying terms, coefficients, and operations.",
        materials: [
          { type: "pdf", name: "Syllabus Extract - Algebra", icon: "📄" },
          { type: "video", name: "Algebra Basics Intro", icon: "🎥" }
        ]
      },
      { 
        id: "u2",
        title: "Unit 2: Linear Equations", 
        status: "Completed", 
        score: "88%",
        summary: "Learn how to solve one-variable and two-variable linear equations and plot them on graphs.",
        materials: [
          { type: "pdf", name: "Linear Equations Notes", icon: "📄" },
          { type: "quiz", name: "Equations Practice Quiz", icon: "📝" }
        ]
      },
      { 
        id: "u3",
        title: "Unit 3: Understanding Quadrilaterals", 
        status: "In Progress", 
        score: "-",
        summary: "Dive into geometry to understand different types of quadrilaterals, their properties, and angle sum properties.",
        materials: [
          { type: "pdf", name: "Geometry Handout", icon: "📄" },
          { type: "video", name: "Visualizing Quadrilaterals", icon: "🎥" }
        ]
      },
      { 
        id: "u4",
        title: "Unit 4: Data Handling", 
        status: "Not Started", 
        score: "-",
        summary: "Learn how to organize, interpret, and represent data visually using pie charts, bar graphs, and histograms.",
        materials: [
          { type: "pdf", name: "Data Collection Primer", icon: "📄" }
        ]
      },
    ],
    assignments: [
      { title: "Algebra Worksheet", due: "Today, 11:59 PM", status: "Pending" },
      { title: "Chapter 2 Quiz Prep", due: "Tomorrow, 08:00 AM", status: "Pending" },
    ]
  },
  // Add other subjects as fallback
  "default": {
    name: "Subject Overview",
    teacher: "Assigned Teacher",
    progress: 45,
    color: "#8b5cf6",
    bgClass: "from-purple-600 to-purple-400",
    icon: "📚",
    units: [
      { 
        id: "u1",
        title: "Unit 1: Introduction", 
        status: "In Progress", 
        score: "-",
        summary: "An introduction to the fundamental concepts of this subject.",
        materials: [
          { type: "pdf", name: "Introductory Chapter", icon: "📄" }
        ]
      }
    ],
    assignments: []
  }
};

export default function SubjectDetailPage({ params }: { params: { slug: string } }) {
  const subjectKey = Object.keys(subjectDetails).includes(params.slug) ? params.slug : "default";
  const subject = subjectDetails[subjectKey];
  if (subjectKey === "default") {
    subject.name = params.slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }

  const [expandedUnit, setExpandedUnit] = useState<string | null>("u3"); // Default expand the 'In Progress' unit

  const toggleUnit = (id: string) => {
    if (expandedUnit === id) setExpandedUnit(null);
    else setExpandedUnit(id);
  };

  return (
    <PortalLayout
      title={`${subject.name} Workspace`}
      subtitle={`Teacher: ${subject.teacher}`}
      avatarLetter="A"
      avatarColor={subject.color}
      themeClass="theme-student"
      accentColor={subject.color}
    >
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/student/subjects" className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white flex items-center gap-2 text-sm font-semibold transition-colors w-fit">
          <span>←</span> Back to All Subjects
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Progress & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Header Card */}
          <div className="glass rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 relative overflow-hidden bg-white dark:bg-transparent">
             <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${subject.bgClass} opacity-10 dark:opacity-20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2`}></div>
             
             <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${subject.bgClass} flex items-center justify-center text-3xl shadow-lg`}>
                  {subject.icon}
                </div>
                <div>
                   <h2 className="text-2xl font-black text-black dark:text-white">{subject.name}</h2>
                   <p className="text-sm text-slate-500 dark:text-slate-400">{subject.progress}% Syllabus Completed</p>
                </div>
             </div>

             <div className="h-2 bg-slate-200 dark:bg-slate-800/80 rounded-full overflow-hidden shadow-inner mb-6">
                <div 
                  className="h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${subject.progress}%`, background: `linear-gradient(90deg, ${subject.color}, ${subject.color}dd)` }}
                ></div>
             </div>
             
             <button className="w-full mb-3 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-black dark:text-white font-bold transition-colors flex items-center justify-center gap-2 shadow-sm">
                <span className="text-xl">📄</span> Download Full Syllabus
             </button>

             <button className="w-full py-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700 dark:border-slate-600 rounded-xl text-white font-bold transition-colors flex items-center justify-center gap-2 shadow-sm">
                <span className="text-xl">🤖</span> Ask General AI Tutor
             </button>
          </div>

          {/* Pending Assignments */}
          <div className="glass rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-transparent">
             <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
               <span className="text-xl">📝</span> Pending Tasks
             </h3>
             
             {subject.assignments.length === 0 ? (
               <div className="text-center py-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-emerald-500/20">
                  <span className="text-3xl block mb-2">🎉</span>
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">All caught up!</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">No pending assignments.</p>
               </div>
             ) : (
               <ul className="space-y-3">
                 {subject.assignments.map((task: any, idx: number) => (
                   <li key={idx} className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-colors group cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white transition-colors">{task.title}</h4>
                        <span className="text-[10px] font-black uppercase px-2 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-md">Pending</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1"><span>⏳</span> Due: {task.due}</p>
                   </li>
                 ))}
               </ul>
             )}
          </div>
          
        </div>

        {/* Right Column: Units & Content */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="glass rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-transparent">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-black text-black dark:text-white flex items-center gap-2">
                 <span className="text-2xl">📖</span> Syllabus Units
               </h3>
             </div>

             <div className="space-y-4">
               {subject.units.map((unit: any, idx: number) => {
                 const isExpanded = expandedUnit === unit.id;
                 return (
                   <div key={unit.id} className={`bg-slate-50 dark:bg-slate-900/40 rounded-2xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-indigo-500/50 shadow-lg' : 'border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                      {/* Unit Header (Clickable) */}
                      <button 
                        onClick={() => toggleUnit(unit.id)}
                        className="w-full p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left focus:outline-none hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shrink-0 transition-colors
                             ${unit.status === 'Completed' ? `bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400` : 
                               unit.status === 'In Progress' ? `bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400` : 
                               `bg-slate-200 dark:bg-slate-800 text-slate-500`}`}
                           >
                             {idx + 1}
                           </div>
                           <div>
                              <h4 className={`text-base font-bold ${unit.status === 'Completed' ? 'text-black dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                {unit.title}
                              </h4>
                              <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-2">
                                Status: <span className={
                                  unit.status === 'Completed' ? 'text-emerald-600 dark:text-emerald-400' : 
                                  unit.status === 'In Progress' ? 'text-indigo-600 dark:text-indigo-400' : ''
                                }>{unit.status}</span>
                              </p>
                           </div>
                        </div>
                        
                        <div className="flex items-center gap-4 sm:ml-auto">
                           {unit.status === 'Completed' && (
                             <div className="text-right mr-2 hidden sm:block">
                                <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Unit Score</span>
                                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{unit.score}</span>
                             </div>
                           )}
                           <div className={`text-2xl text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                             ↓
                           </div>
                        </div>
                      </button>

                      {/* Unit Expanded Content (Materials & AI) */}
                      {isExpanded && (
                        <div className="p-5 border-t border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 animate-in slide-in-from-top-2 duration-200">
                           <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                             <strong className="text-black dark:text-white mr-2">AI Summary:</strong>
                             {unit.summary}
                           </p>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Materials Section */}
                              <div>
                                <h5 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-3 flex items-center gap-2">
                                  <span>📁</span> Unit Materials
                                </h5>
                                <div className="space-y-2">
                                  {unit.materials.map((mat: any, mIdx: number) => (
                                    <Link key={mIdx} href="#" className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all group">
                                      <span className="text-xl group-hover:scale-110 transition-transform">{mat.icon}</span>
                                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{mat.name}</span>
                                    </Link>
                                  ))}
                                </div>
                              </div>

                              {/* Interactive Section */}
                              <div>
                                <h5 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-3 flex items-center gap-2">
                                  <span>⚡</span> Quick Actions
                                </h5>
                                <div className="space-y-3">
                                  <button className="w-full flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors text-left group">
                                    <div className="flex items-center gap-3">
                                      <span className="text-xl">🤖</span>
                                      <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">Explain this Unit</span>
                                    </div>
                                    <span className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                  </button>
                                  <button className="w-full flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors text-left group">
                                    <div className="flex items-center gap-3">
                                      <span className="text-xl">📝</span>
                                      <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Take Unit Quiz</span>
                                    </div>
                                    <span className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                  </button>
                                </div>
                              </div>
                           </div>
                        </div>
                      )}
                   </div>
                 );
               })}
             </div>
          </div>

        </div>
      </div>
    </PortalLayout>
  );
}
