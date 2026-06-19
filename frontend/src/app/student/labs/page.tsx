"use client";

import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";
import { useState } from "react";

const featuredLabs = [
  { id: 1, title: "Ohm's Law Verification", subject: "Physics", duration: "25 mins", level: "Class 10", icon: "⚡", color: "from-blue-500 to-cyan-500", image: "circuit.png" },
  { id: 2, title: "Acid-Base Titration", subject: "Chemistry", duration: "30 mins", level: "Class 11", icon: "🧪", color: "from-emerald-500 to-teal-500", image: "flask.png" },
  { id: 3, title: "Human Heart Dissection (3D)", subject: "Biology", duration: "45 mins", level: "Class 12", icon: "🫀", color: "from-rose-500 to-pink-500", image: "heart.png" },
];

const completedLabs = [
  { title: "Photosynthesis Simulation", date: "June 15, 2026", score: "95%" },
  { title: "Simple Pendulum", date: "June 10, 2026", score: "100%" },
];

export default function VirtualLabsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <PortalLayout
      title="Virtual Science Labs"
      subtitle="Perform safe, interactive 3D experiments from anywhere."
      avatarLetter="A"
      avatarColor="#06b6d4"
      themeClass="theme-student"
      accentColor="#06b6d4"
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-700/50 w-fit overflow-x-auto">
           {["All", "Physics", "Chemistry", "Biology", "Computer Science"].map(cat => (
             <button 
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeCategory === cat ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/20" : "text-slate-400 hover:text-white"}`}
             >
               {cat}
             </button>
           ))}
        </div>
        
        <button className="px-4 py-2 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 rounded-xl text-sm font-bold transition-colors flex items-center gap-2">
           <span>🥽</span> Launch AR Mode
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recommended & AR */}
        <div className="lg:col-span-2 space-y-6">
           
           <div className="glass rounded-3xl p-6 border border-slate-700/50">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">✨</span> Recommended for You
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {featuredLabs.filter(lab => activeCategory === "All" || lab.subject === activeCategory).map((lab) => (
                   <div key={lab.id} className="bg-slate-900/40 rounded-2xl border border-slate-700/50 overflow-hidden hover:-translate-y-1 hover:border-cyan-500/50 transition-all group flex flex-col cursor-pointer">
                      <div className={`h-32 bg-gradient-to-br ${lab.color} relative flex items-center justify-center text-6xl group-hover:scale-105 transition-transform origin-bottom`}>
                         <div className="absolute inset-0 bg-black/20"></div>
                         <div className="relative z-10 drop-shadow-xl">{lab.icon}</div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                         <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{lab.subject}</span>
                            <span className="text-[10px] text-slate-500 font-bold">{lab.level}</span>
                         </div>
                         <h3 className="font-bold text-white text-base leading-tight mb-4 group-hover:text-cyan-300 transition-colors">{lab.title}</h3>
                         
                         <div className="mt-auto flex items-center justify-between">
                            <span className="text-xs text-slate-400 flex items-center gap-1">⏱️ {lab.duration}</span>
                            <button className="px-3 py-1.5 bg-slate-800 hover:bg-cyan-600 text-white rounded-lg text-xs font-bold transition-colors">
                              Start Lab
                            </button>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Interactive Demo Teaser */}
           <div className="glass rounded-3xl p-8 border border-cyan-500/30 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="absolute top-1/2 -translate-y-1/2 right-0 w-64 h-64 bg-cyan-500/20 blur-3xl rounded-full"></div>
              
              <div className="relative z-10">
                 <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-widest rounded-full mb-3 border border-cyan-500/30">New Feature</span>
                 <h2 className="text-2xl font-black text-white mb-2">Build Your Own Circuit</h2>
                 <p className="text-sm text-slate-300 max-w-md leading-relaxed mb-4">
                   Drag and drop resistors, batteries, and LEDs on the virtual breadboard to see how electricity flows in real-time. If it short-circuits, it safely sparks!
                 </p>
                 <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all">
                   Try Sandbox Mode
                 </button>
              </div>
              
              <div className="text-8xl relative z-10 animate-[bounce_3s_infinite]">💡</div>
           </div>

        </div>

        {/* Right Column: Progress & Hardware */}
        <div className="lg:col-span-1 space-y-6">
           
           <div className="glass rounded-3xl p-6 border border-slate-700/50">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-xl">📊</span> Lab Report Card
              </h3>
              
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700 text-center mb-6">
                 <span className="block text-4xl font-black text-emerald-400 mb-1">12</span>
                 <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Experiments Completed</span>
              </div>

              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Recent Evaluations</h4>
              <div className="space-y-3">
                 {completedLabs.map((lab, idx) => (
                   <div key={idx} className="bg-slate-900/40 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
                      <div>
                         <h5 className="text-sm font-bold text-slate-300 mb-0.5">{lab.title}</h5>
                         <span className="text-[10px] text-slate-500">{lab.date}</span>
                      </div>
                      <div className="text-emerald-400 font-black text-sm bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                         {lab.score}
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass rounded-3xl p-6 border border-slate-700/50 bg-slate-800/30">
              <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-xl">📦</span> School Hardware Kit
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Did you know you can request a physical Arduino or Robotics kit from your school's Tinkering Lab to take home for the weekend?
              </p>
              <button className="w-full py-2 border border-slate-600 hover:bg-slate-700 rounded-xl text-xs font-bold text-white transition-colors">
                 Check Kit Availability
              </button>
           </div>

        </div>

      </div>
    </PortalLayout>
  );
}
