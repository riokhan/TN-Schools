"use client";

import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";
import { useState } from "react";

const projects = [
  { title: "Smart City Traffic Model", category: "Science Fair", date: "Oct 2026", image: "🏙️", tags: ["IoT", "Physics", "Arduino"], description: "Built a working model of automated traffic lights using Arduino to reduce congestion." },
  { title: "Tamil Poetry Anthology", category: "Literature", date: "Aug 2026", image: "📜", tags: ["Creative Writing", "Tamil"], description: "A collection of 15 original poems exploring the themes of nature and modern society." },
  { title: "Local Biodiversity Survey", category: "Ecology Project", date: "May 2026", image: "🌿", tags: ["Biology", "Field Work"], description: "Cataloged over 50 native plant species in the school's surrounding district." },
];

const achievements = [
  { title: "1st Place - State Science Exhibition", year: "2026", icon: "🏆", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  { title: "Distinction in Mathematics Olympiad", year: "2025", icon: "🥇", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { title: "Best Debater - Inter-School Fest", year: "2025", icon: "🎙️", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
];

const skills = [
  { name: "Public Speaking", level: 90, color: "from-rose-500 to-pink-500" },
  { name: "Python Programming", level: 75, color: "from-blue-500 to-cyan-500" },
  { name: "Creative Writing", level: 85, color: "from-amber-500 to-orange-500" },
  { name: "Data Analysis", level: 60, color: "from-emerald-500 to-teal-500" },
];

export default function DigitalPortfolioPage() {
  const [activeTab, setActiveTab] = useState("projects");

  return (
    <PortalLayout
      title="Digital Portfolio"
      subtitle="A curated collection of your best work, projects, and achievements."
      avatarLetter="A"
      avatarColor="#6366f1"
      themeClass="theme-student"
      accentColor="#6366f1"
    >
      {/* Action Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-700/50 w-fit">
           <button 
             onClick={() => setActiveTab("projects")}
             className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === "projects" ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400 hover:text-white"}`}
           >
             Projects & Work
           </button>
           <button 
             onClick={() => setActiveTab("resume")}
             className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === "resume" ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400 hover:text-white"}`}
           >
             Interactive Resume
           </button>
        </div>

        <div className="flex gap-3">
           <button className="px-4 py-2 border border-slate-600 hover:bg-slate-800 rounded-xl text-sm font-bold text-white transition-colors flex items-center gap-2">
             <span>🔗</span> Share Link
           </button>
           <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold text-white transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-2">
             <span>⬇️</span> Download PDF
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card & Skills */}
        <div className="lg:col-span-1 space-y-6">
           
           {/* Profile Card */}
           <div className="glass rounded-3xl p-6 border border-slate-700/50 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"></div>
              
              <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-700 mx-auto overflow-hidden mb-4 relative z-10">
                 <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-4xl">👦🏽</div>
              </div>
              
              <h2 className="text-2xl font-black text-white mb-1 relative z-10">Arjun Kumar</h2>
              <p className="text-sm text-indigo-400 font-bold mb-4 relative z-10">Class 10A • Science Stream Explorer</p>
              
              <p className="text-xs text-slate-300 leading-relaxed mb-6 relative z-10 text-justify">
                "I am a passionate learner with a strong interest in applied sciences and literature. My goal is to use technology to solve local environmental challenges while maintaining a deep connection to my cultural roots."
              </p>

              <div className="flex justify-center gap-4 relative z-10">
                 <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700 w-full">
                    <span className="block text-xl font-black text-white">14</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Projects</span>
                 </div>
                 <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700 w-full">
                    <span className="block text-xl font-black text-white">8</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Awards</span>
                 </div>
              </div>
           </div>

           {/* Skills Matrix */}
           <div className="glass rounded-3xl p-6 border border-slate-700/50">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold text-white flex items-center gap-2">
                 <span className="text-xl">⚡</span> Skill Matrix
               </h3>
               <button className="text-slate-400 hover:text-white text-sm">✎</button>
             </div>
             
             <div className="space-y-4">
                {skills.map((skill, idx) => (
                  <div key={idx}>
                     <div className="flex justify-between items-end mb-1">
                        <span className="text-sm font-bold text-white">{skill.name}</span>
                        <span className="text-[10px] text-slate-400 font-black">{skill.level}%</span>
                     </div>
                     <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${skill.color}`} style={{ width: `${skill.level}%` }}></div>
                     </div>
                  </div>
                ))}
             </div>
           </div>

        </div>

        {/* Right Column: Projects & Timeline */}
        <div className="lg:col-span-2 space-y-6">
           
           {/* Featured Projects */}
           <div className="glass rounded-3xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-bold text-white flex items-center gap-2">
                   <span className="text-2xl">📁</span> Featured Projects
                 </h2>
                 <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                   <span>+</span> Add New
                 </button>
              </div>

              <div className="space-y-4">
                 {projects.map((project, idx) => (
                   <div key={idx} className="bg-slate-900/40 p-5 rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 transition-colors group cursor-pointer flex flex-col sm:flex-row gap-5">
                      <div className="w-full sm:w-32 h-32 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-5xl shrink-0 group-hover:scale-105 transition-transform">
                         {project.image}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">{project.category}</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase">{project.date}</span>
                         </div>
                         <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{project.title}</h3>
                         <p className="text-sm text-slate-400 leading-relaxed mb-4">{project.description}</p>
                         
                         <div className="flex flex-wrap gap-2">
                           {project.tags.map((tag, tidx) => (
                             <span key={tidx} className="text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-1 rounded-md">
                               {tag}
                             </span>
                           ))}
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Honors & Achievements */}
           <div className="glass rounded-3xl p-6 border border-slate-700/50">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">🎖️</span> Honors & Achievements
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 {achievements.map((ach, idx) => (
                   <div key={idx} className={`p-4 rounded-xl border ${ach.bg} flex flex-col items-center text-center hover:-translate-y-1 transition-transform`}>
                      <div className="text-4xl mb-3">{ach.icon}</div>
                      <h4 className="font-bold text-white text-sm mb-1">{ach.title}</h4>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${ach.color}`}>{ach.year}</span>
                   </div>
                 ))}
              </div>
           </div>

        </div>

      </div>
    </PortalLayout>
  );
}
