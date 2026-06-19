"use client";

import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";
import { useState } from "react";

const myClubs = [
  { name: "Robotics Club", role: "Member", icon: "🤖", color: "from-blue-500 to-indigo-600", nextEvent: "Build Session - Friday 4 PM" },
  { name: "Debate Society", role: "Vice President", icon: "🎙️", color: "from-rose-500 to-pink-600", nextEvent: "Mock UN - Saturday 10 AM" },
];

const discoverClubs = [
  { name: "Eco Warriors", category: "Environment", members: 45, icon: "🌱", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", tagBg: "bg-emerald-500/20" },
  { name: "Drama Troupe", category: "Arts", members: 32, icon: "🎭", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", tagBg: "bg-purple-500/20" },
  { name: "Math Olympiad", category: "Academics", members: 28, icon: "♾️", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", tagBg: "bg-blue-500/20" },
  { name: "Creative Writing", category: "Literature", members: 50, icon: "✍️", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", tagBg: "bg-amber-500/20" },
  { name: "Photography", category: "Arts", members: 65, icon: "📸", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20", tagBg: "bg-cyan-500/20" },
  { name: "Astronomy Club", category: "Science", members: 40, icon: "🔭", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20", tagBg: "bg-indigo-500/20" },
];

const upcomingEvents = [
  { title: "Annual Science Fair", date: "Oct 15, 2026", type: "School-wide", icon: "🔬", color: "text-emerald-400" },
  { title: "Inter-school Debate", date: "Oct 22, 2026", type: "Competition", icon: "🏆", color: "text-amber-400" },
  { title: "Autumn Art Exhibition", date: "Nov 05, 2026", type: "Showcase", icon: "🎨", color: "text-purple-400" },
];

export default function ExtracurricularsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredClubs = activeTab === "all" 
    ? discoverClubs 
    : discoverClubs.filter(club => club.category.toLowerCase() === activeTab);

  return (
    <PortalLayout
      title="Extracurricular Activities"
      subtitle="Discover your passions, build new skills, and connect with peers outside the classroom."
      avatarLetter="A"
      avatarColor="#8b5cf6"
      themeClass="theme-student"
      accentColor="#8b5cf6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: My Clubs & Events */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* My Clubs */}
          <div className="glass rounded-3xl p-6 border border-slate-700/50">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">⭐</span> My Clubs
            </h2>
            <div className="space-y-4">
              {myClubs.map((club, idx) => (
                <div key={idx} className="relative overflow-hidden rounded-2xl p-4 border border-slate-700/50 group cursor-pointer hover:border-slate-500 transition-colors">
                  <div className={`absolute inset-0 bg-gradient-to-r ${club.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="text-3xl">{club.icon}</div>
                    <div>
                      <h3 className="font-bold text-white mb-1">{club.name}</h3>
                      <span className="text-[10px] uppercase font-black tracking-wider px-2 py-1 bg-slate-800 rounded-md text-slate-300">{club.role}</span>
                      <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                        <span>📅</span> {club.nextEvent}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/student/activities/directory" className="block text-center w-full mt-4 py-3 border border-dashed border-slate-600 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:border-slate-400 transition-colors">
              + Join another club
            </Link>
          </div>

          {/* Upcoming Events Calendar */}
          <div className="glass rounded-3xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-lg font-bold text-white flex items-center gap-2">
                 <span className="text-xl">🗓️</span> Upcoming Events
               </h2>
               <Link href="#" className="text-xs text-purple-400 hover:text-purple-300 font-bold">View Calendar</Link>
            </div>
            
            <ul className="space-y-0">
              {upcomingEvents.map((event, idx) => (
                <li key={idx} className="relative flex gap-4 pb-4">
                  {/* Timeline line */}
                  {idx !== upcomingEvents.length - 1 && (
                    <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-slate-800"></div>
                  )}
                  <div className={`w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center shrink-0 z-10 text-[10px]`}>
                    {event.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{event.title}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                      <span>{event.date}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                      <span className={event.color}>{event.type}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Activity Portfolio Shortcut */}
          <div className="glass rounded-3xl p-6 border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-transparent">
             <div className="flex items-center gap-4 mb-3">
               <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl text-purple-400 border border-purple-500/30">
                 🏆
               </div>
               <div>
                 <h3 className="font-bold text-white">Activity Portfolio</h3>
                 <p className="text-xs text-slate-400">Track your extracurricular achievements.</p>
               </div>
             </div>
             <Link href="/student/middle-school/portfolio" className="block text-center w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-purple-500/20">
               View Portfolio
             </Link>
          </div>

        </div>

        {/* Right Column: Discover Clubs Grid */}
        <div className="lg:col-span-2">
          <div className="glass rounded-3xl p-6 border border-slate-700/50 min-h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">🔍</span> Discover Clubs & Societies
              </h2>
              
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search clubs..." 
                  className="w-full sm:w-64 bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2 pl-10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔎</span>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['all', 'arts', 'science', 'environment', 'academics', 'literature'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${
                    activeTab === tab 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Clubs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredClubs.map((club, idx) => (
                <div key={idx} className={`rounded-2xl p-5 border ${club.bg} transition-all hover:-translate-y-1 cursor-pointer group`}>
                  <div className="flex justify-between items-start mb-4">
                     <div className="text-4xl bg-slate-900/50 w-14 h-14 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                       {club.icon}
                     </div>
                     <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${club.tagBg} ${club.color}`}>
                       {club.category}
                     </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{club.name}</h3>
                  <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                    <span>👥</span> {club.members} Active Members
                  </p>
                  <Link 
                    href={`/student/activities/${club.name.toLowerCase().replace(" ", "-")}`}
                    className={`block text-center w-full py-2 rounded-xl text-sm font-bold bg-slate-900/50 hover:bg-slate-800 border border-slate-700/50 transition-colors ${club.color}`}
                  >
                    Learn More & Join
                  </Link>
                </div>
              ))}
              
              {filteredClubs.length === 0 && (
                <div className="col-span-full text-center py-12">
                   <div className="text-4xl mb-3">👻</div>
                   <h3 className="text-white font-bold mb-1">No clubs found</h3>
                   <p className="text-sm text-slate-400">Try selecting a different category.</p>
                </div>
              )}
            </div>

            {/* Create Club Banner */}
            <div className="mt-8 rounded-2xl bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-purple-500/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full"></div>
               <div className="relative z-10">
                 <h3 className="text-lg font-bold text-white mb-1">Can't find what you're looking for?</h3>
                 <p className="text-sm text-slate-300">You can start your own club! Gather 5 students and a faculty sponsor to apply.</p>
               </div>
               <button className="relative z-10 shrink-0 px-6 py-3 bg-white text-purple-900 rounded-xl font-bold shadow-lg hover:bg-slate-200 transition-colors">
                 Start a Club
               </button>
            </div>

          </div>
        </div>
        
      </div>
    </PortalLayout>
  );
}
