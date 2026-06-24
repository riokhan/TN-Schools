"use client";

import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";
import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000";

interface Team {
  name: string;
  role: string;
  icon: string;
  color: string;
  match: string;
  date: string;
}

interface FitnessStat {
  label: string;
  value: string;
  score: number;
  icon: string;
  color: string;
}

interface Event {
  title: string;
  date: string;
  type: string;
  icon: string;
}

interface HealthLog {
  date: string;
  activity: string;
  duration: string;
  calories: number;
  intensity: string;
}

interface SportsData {
  teams: Team[];
  stats: FitnessStat[];
  events: Event[];
  logs: HealthLog[];
}

export default function SportsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState<SportsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSportsData() {
      try {
        const res = await fetch(`${API_BASE}/api/sports/demo-student`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch sports data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSportsData();
  }, []);

  if (isLoading) {
    return (
      <PortalLayout title="Sports & Athletics" subtitle="Loading your physical assessment..." themeClass="theme-student">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PortalLayout>
    );
  }

  if (!data) {
    return (
      <PortalLayout title="Sports & Athletics" subtitle="Data not found." themeClass="theme-student">
        <div className="text-center text-slate-400 mt-20">Could not load sports data.</div>
      </PortalLayout>
    );
  }

  const { teams: myTeams, stats: fitnessStats, events: upcomingEvents, logs: healthLog } = data;

  return (
    <PortalLayout
      title="Sports & Athletics"
      subtitle="Track your physical fitness, team events, and health metrics."
      avatarLetter="A"
      avatarColor="#06b6d4"
      themeClass="theme-student"
      accentColor="#06b6d4"
    >
      {/* Top Navigation / Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700/50 w-fit mb-6">
         <button 
           onClick={() => setActiveTab("overview")}
           className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === "overview" ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" : "text-black dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400"}`}
         >
           My Overview
         </button>
         <button 
           onClick={() => setActiveTab("teams")}
           className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === "teams" ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" : "text-black dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400"}`}
         >
           Teams & Clubs
         </button>
         <button 
           onClick={() => setActiveTab("leaderboard")}
           className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === "leaderboard" ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" : "text-black dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400"}`}
         >
           School Leaderboard
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Spans 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Fitness Radar / Stats Grid */}
          <div className="glass rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 relative overflow-hidden bg-white dark:bg-transparent">
             <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full"></div>
             <h2 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-2 relative z-10">
               <span className="text-2xl">📊</span> Physical Assessment Profile
             </h2>
             
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
               {fitnessStats.map((stat, idx) => (
                 <div key={idx} className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col items-center justify-center text-center group hover:border-cyan-500/50 transition-colors">
                    <div className="relative w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                       <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-slate-300 dark:text-slate-700"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          />
                          <path
                            className={`${stat.color.replace('bg-', 'text-')}`}
                            strokeDasharray={`${stat.score}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          />
                       </svg>
                       <span className="text-2xl relative z-10">{stat.icon}</span>
                    </div>
                    <span className="text-lg font-black text-black dark:text-white leading-none mb-1">{stat.value}</span>
                    <span className="text-[10px] uppercase font-bold text-black dark:text-slate-400 tracking-wider">{stat.label}</span>
                 </div>
               ))}
             </div>
          </div>

          {/* Activity Log */}
          <div className="glass rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-transparent">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
                  <span className="text-xl">🔥</span> Activity Log
                </h2>
                <button className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300">Sync with Smartwatch →</button>
             </div>

             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b border-slate-200 dark:border-slate-700/50">
                     <th className="py-3 px-4 text-xs font-bold text-black dark:text-white uppercase tracking-wider">Date</th>
                     <th className="py-3 px-4 text-xs font-bold text-black dark:text-white uppercase tracking-wider">Activity</th>
                     <th className="py-3 px-4 text-xs font-bold text-black dark:text-white uppercase tracking-wider">Duration</th>
                     <th className="py-3 px-4 text-xs font-bold text-black dark:text-white uppercase tracking-wider">Intensity</th>
                     <th className="py-3 px-4 text-xs font-bold text-black dark:text-white uppercase tracking-wider text-right">Calories</th>
                   </tr>
                 </thead>
                 <tbody>
                   {healthLog.map((log, idx) => (
                     <tr key={idx} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                       <td className="py-4 px-4 text-sm text-black dark:text-slate-400 font-medium">{log.date}</td>
                       <td className="py-4 px-4 text-sm font-bold text-black dark:text-white">{log.activity}</td>
                       <td className="py-4 px-4 text-sm text-black dark:text-slate-300">{log.duration}</td>
                       <td className="py-4 px-4">
                         <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded border 
                           ${log.intensity === 'High' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' : 
                             log.intensity === 'Maximum' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' : 
                             'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'}`}
                         >
                           {log.intensity}
                         </span>
                       </td>
                       <td className="py-4 px-4 text-sm font-bold text-cyan-600 dark:text-cyan-400 text-right">{log.calories} kcal</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* My Teams */}
          <div className="glass rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-transparent">
            <h2 className="text-lg font-bold text-black dark:text-white mb-6 flex items-center gap-2">
              <span className="text-xl">🏆</span> My Teams
            </h2>
            <div className="space-y-4">
              {myTeams.map((team, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 relative overflow-hidden group hover:border-slate-400 dark:hover:border-slate-500 transition-colors cursor-pointer">
                   <div className={`absolute inset-0 bg-gradient-to-r ${team.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                   <div className="flex items-center gap-3 mb-3">
                     <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${team.color} flex items-center justify-center text-xl shadow-lg`}>
                       {team.icon}
                     </div>
                     <div>
                       <h3 className="font-bold text-black dark:text-white text-sm leading-tight">{team.name}</h3>
                       <p className="text-[10px] font-bold text-black dark:text-slate-400 uppercase tracking-wider">{team.role}</p>
                     </div>
                   </div>
                   <div className="bg-white dark:bg-slate-800/80 rounded-lg p-2.5 border border-slate-200 dark:border-slate-700">
                     <p className="text-xs font-bold text-black dark:text-slate-300 truncate mb-1">Up Next: {team.match}</p>
                     <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium">📅 {team.date}</p>
                   </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-3 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-sm font-bold text-black dark:text-slate-400 hover:text-cyan-600 dark:hover:text-white hover:border-cyan-400 dark:hover:border-slate-400 transition-colors">
              Explore More Sports
            </button>
          </div>

          {/* Upcoming Events Calendar */}
          <div className="glass rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-transparent">
            <h2 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
              <span className="text-xl">📅</span> Upcoming Events
            </h2>
            <div className="space-y-0">
              {upcomingEvents.map((event, idx) => (
                <div key={idx} className="relative flex gap-4 pb-4">
                  {idx !== upcomingEvents.length - 1 && (
                    <div className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-slate-200 dark:bg-slate-800"></div>
                  )}
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 z-10 text-sm">
                    {event.icon}
                  </div>
                  <div className="pt-1.5">
                    <h4 className="text-sm font-bold text-black dark:text-white leading-none mb-1">{event.title}</h4>
                    <p className="text-xs text-black dark:text-slate-400 flex items-center gap-2">
                      <span>{event.date}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600"></span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-medium">{event.type}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Report Injury / Health Concern */}
          <div className="glass rounded-3xl p-6 border border-rose-500/30 bg-gradient-to-br from-rose-50 to-white dark:from-rose-900/20 dark:to-transparent">
             <div className="flex items-center gap-4 mb-3">
               <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center text-2xl border border-rose-500/30">
                 🚑
               </div>
               <div>
                 <h3 className="font-bold text-black dark:text-white">Report Injury</h3>
                 <p className="text-xs text-black dark:text-slate-400">Notify the school nurse & coach.</p>
               </div>
             </div>
             <button className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-rose-500/20">
               Fill Form
             </button>
          </div>

        </div>

      </div>
    </PortalLayout>
  );
}