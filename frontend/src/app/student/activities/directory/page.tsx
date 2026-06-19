"use client";

import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";
import { useState } from "react";

const allClubs = [
  { name: "Eco Warriors", category: "Environment", members: 45, icon: "🌱", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", tagBg: "bg-emerald-500/20" },
  { name: "Drama Troupe", category: "Arts", members: 32, icon: "🎭", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", tagBg: "bg-purple-500/20" },
  { name: "Math Olympiad", category: "Academics", members: 28, icon: "♾️", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", tagBg: "bg-blue-500/20" },
  { name: "Creative Writing", category: "Literature", members: 50, icon: "✍️", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", tagBg: "bg-amber-500/20" },
  { name: "Photography", category: "Arts", members: 65, icon: "📸", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20", tagBg: "bg-cyan-500/20" },
  { name: "Astronomy Club", category: "Science", members: 40, icon: "🔭", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20", tagBg: "bg-indigo-500/20" },
  { name: "Chess Masters", category: "Sports", members: 85, icon: "♟️", color: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/20", tagBg: "bg-slate-500/20" },
  { name: "Coding Club", category: "Technology", members: 110, icon: "💻", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20", tagBg: "bg-rose-500/20" },
];

export default function ClubsDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredClubs = allClubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || club.category.toLowerCase() === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PortalLayout
      title="Clubs & Societies Directory"
      subtitle="Browse the complete directory of student organizations at TN Schools."
      avatarLetter="A"
      avatarColor="#8b5cf6"
      themeClass="theme-student"
      accentColor="#8b5cf6"
    >
      <div className="mb-6">
        <Link href="/student/activities" className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors w-fit">
          <span>←</span> Back to Activities Hub
        </Link>
      </div>

      <div className="glass rounded-3xl p-6 border border-slate-700/50 min-h-screen">
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
           <div className="relative w-full md:w-96">
             <input 
               type="text" 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               placeholder="Search all clubs..." 
               className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 pl-12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors shadow-inner"
             />
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">🔎</span>
           </div>

           <div className="flex overflow-x-auto w-full md:w-auto pb-2 md:pb-0 gap-2 hide-scrollbar">
              {['all', 'academics', 'arts', 'environment', 'literature', 'science', 'sports', 'technology'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveCategory(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${
                    activeCategory === tab 
                      ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
           </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {filteredClubs.map((club, idx) => (
             <div key={idx} className={`rounded-2xl p-6 border ${club.bg} transition-all hover:-translate-y-2 cursor-pointer group flex flex-col h-full`}>
                <div className="flex justify-between items-start mb-6">
                   <div className="text-5xl bg-slate-900/50 w-20 h-20 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all">
                     {club.icon}
                   </div>
                   <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${club.tagBg} ${club.color}`}>
                     {club.category}
                   </span>
                </div>
                
                <div className="mt-auto">
                   <h3 className="text-xl font-bold text-white mb-2">{club.name}</h3>
                   <div className="flex items-center gap-2 mb-6">
                      <div className="flex -space-x-2">
                         <div className="w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-900"></div>
                         <div className="w-6 h-6 rounded-full bg-slate-600 border-2 border-slate-900"></div>
                         <div className="w-6 h-6 rounded-full bg-slate-500 border-2 border-slate-900"></div>
                      </div>
                      <p className="text-xs text-slate-400 font-bold">
                        {club.members} Members
                      </p>
                   </div>
                   <Link 
                     href={`/student/activities/${club.name.toLowerCase().replace(" ", "-")}`}
                     className={`block text-center w-full py-3 rounded-xl text-sm font-bold bg-slate-900/50 hover:bg-slate-800 border border-slate-700/50 transition-colors ${club.color}`}
                   >
                     View Club Details →
                   </Link>
                </div>
             </div>
           ))}
        </div>

        {filteredClubs.length === 0 && (
           <div className="text-center py-20">
              <div className="text-6xl mb-4">👻</div>
              <h3 className="text-xl text-white font-bold mb-2">No clubs found</h3>
              <p className="text-slate-400">Try adjusting your search or filters.</p>
           </div>
        )}

      </div>
    </PortalLayout>
  );
}
