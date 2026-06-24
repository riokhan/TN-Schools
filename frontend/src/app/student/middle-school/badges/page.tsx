// "use client";

// import PortalLayout from "@/components/PortalLayout";
// import Link from "next/link";
// import { useState } from "react";

// const earnedBadges = [
//   { name: "Science Whiz", icon: "🔬", date: "Oct 18, 2026", description: "Scored 100% on 5 Science quizzes.", color: "from-blue-500 to-indigo-600", rarity: "Epic" },
//   { name: "7-Day Streak", icon: "🔥", date: "Oct 17, 2026", description: "Logged in and learned for 7 days straight.", color: "from-amber-500 to-orange-600", rarity: "Rare" },
//   { name: "Math Ninja", icon: "🥷", date: "Oct 10, 2026", description: "Completed the Fractions Mastery module.", color: "from-emerald-500 to-teal-600", rarity: "Common" },
//   { name: "First Steps", icon: "🌱", date: "Sep 01, 2026", description: "Joined the TN Schools Portal.", color: "from-emerald-500 to-emerald-600", rarity: "Common" },
//   { name: "Helpful Hand", icon: "🤝", date: "Sep 25, 2026", description: "Answered a peer's question in the forum.", color: "from-purple-500 to-fuchsia-600", rarity: "Rare" },
// ];

// const lockedBadges = [
//   { name: "30-Day Streak", icon: "⚡", description: "Log in for 30 consecutive days.", progress: "12/30", percent: 40, color: "text-amber-400" },
//   { name: "Bookworm", icon: "📚", description: "Read 10 books in the Digital Library.", progress: "6/10", percent: 60, color: "text-blue-400" },
//   { name: "Perfect Term", icon: "👑", description: "Get A+ in all subjects this term.", progress: "0/1", percent: 0, color: "text-rose-400" },
// ];

// export default function BadgesPage() {
//   const [filter, setFilter] = useState("all");

//   return (
//     <PortalLayout
//       title="My Trophy Room"
//       subtitle="View your achievements, show off your badges, and see what to unlock next!"
//       avatarLetter="A"
//       avatarColor="#10b981"
//       themeClass="theme-student"
//       accentColor="#10b981"
//     >
//       <div className="mb-6 flex items-center justify-between">
//          <Link href="/student/middle-school" className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
//             <span>←</span> Back to Dashboard
//          </Link>
         
//          <div className="bg-slate-900/80 border border-emerald-500/30 px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg shadow-emerald-500/10">
//             <span className="text-2xl">🏆</span>
//             <div>
//                <span className="block text-[10px] uppercase font-bold text-emerald-500 leading-none">Total Badges</span>
//                <span className="block text-lg font-black text-white leading-none mt-1">5</span>
//             </div>
//          </div>
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
//         {/* Left/Main Column: Earned Badges */}
//         <div className="xl:col-span-2 space-y-6">
           
//            <div className="glass rounded-3xl p-6 border border-slate-700/50 min-h-[600px] relative overflow-hidden">
//              {/* Sparkles Background Effect */}
//              <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #10b981 1px, transparent 1px), radial-gradient(circle at 80% 40%, #8b5cf6 1px, transparent 1px), radial-gradient(circle at 40% 80%, #f59e0b 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
             
//              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
//                 <h2 className="text-2xl font-black text-white flex items-center gap-2">
//                   <span className="text-3xl">🏅</span> Earned Badges
//                 </h2>
                
//                 <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-700/50 w-fit">
//                    <button 
//                      onClick={() => setFilter("all")}
//                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${filter === "all" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
//                    >
//                      All
//                    </button>
//                    <button 
//                      onClick={() => setFilter("Epic")}
//                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${filter === "Epic" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"}`}
//                    >
//                      Epic
//                    </button>
//                    <button 
//                      onClick={() => setFilter("Rare")}
//                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${filter === "Rare" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
//                    >
//                      Rare
//                    </button>
//                 </div>
//              </div>

//              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
//                 {earnedBadges
//                   .filter(b => filter === "all" ? true : b.rarity === filter)
//                   .map((badge, idx) => (
//                   <div key={idx} className="bg-slate-900/60 p-5 rounded-2xl border border-slate-700/50 text-center flex flex-col items-center group cursor-pointer hover:border-emerald-500/50 transition-all hover:-translate-y-2 relative">
                     
//                      {/* Badge Rarity Glow */}
//                      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${badge.color}`}></div>
                     
//                      <div className="w-full flex justify-between items-start mb-2">
//                         <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border 
//                           ${badge.rarity === 'Epic' ? 'text-purple-400 border-purple-500/30 bg-purple-500/10' : 
//                             badge.rarity === 'Rare' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' : 
//                             'text-slate-400 border-slate-500/30 bg-slate-500/10'}`}>
//                           {badge.rarity}
//                         </span>
//                      </div>

//                      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-4xl shadow-lg mb-4 border-4 border-slate-800 relative`}>
//                         <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
//                         <span className="group-hover:scale-110 transition-transform">{badge.icon}</span>
//                      </div>
                     
//                      <h3 className="font-bold text-white mb-1">{badge.name}</h3>
//                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-2">Earned: {badge.date}</p>
//                      <p className="text-xs text-slate-400 leading-tight">{badge.description}</p>
//                   </div>
//                 ))}
//              </div>

//              {earnedBadges.filter(b => filter === "all" ? true : b.rarity === filter).length === 0 && (
//                 <div className="text-center py-20 relative z-10">
//                    <div className="text-6xl mb-4 opacity-50">👻</div>
//                    <h3 className="text-xl text-white font-bold mb-2">No badges found</h3>
//                    <p className="text-slate-400">Keep learning to earn more {filter} badges!</p>
//                 </div>
//              )}
//            </div>

//         </div>

//         {/* Right Column: Locked Badges & Leaderboard */}
//         <div className="space-y-6">
           
//            {/* In Progress / Locked Badges */}
//            <div className="glass rounded-3xl p-6 border border-slate-700/50 relative overflow-hidden">
//              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full"></div>
             
//              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10">
//                <span className="text-xl">🔒</span> Locked Badges
//              </h2>
             
//              <div className="space-y-4 relative z-10">
//                 {lockedBadges.map((badge, idx) => (
//                   <div key={idx} className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 flex gap-4 opacity-80 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
//                      <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-2xl shrink-0 shadow-inner">
//                         {badge.icon}
//                      </div>
//                      <div className="flex-1">
//                         <div className="flex justify-between items-start mb-1">
//                            <h3 className="font-bold text-white text-sm">{badge.name}</h3>
//                            <span className={`text-[10px] font-black ${badge.color}`}>{badge.progress}</span>
//                         </div>
//                         <p className="text-[10px] text-slate-400 leading-tight mb-2">{badge.description}</p>
                        
//                         <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
//                            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300" style={{ width: `${badge.percent}%` }}></div>
//                         </div>
//                      </div>
//                   </div>
//                 ))}
//              </div>
//            </div>

//            {/* Secret Badge Hint */}
//            <div className="glass rounded-3xl p-6 border border-indigo-500/30 bg-gradient-to-br from-indigo-900/30 to-transparent text-center">
//               <div className="w-16 h-16 mx-auto bg-slate-900 rounded-full border border-indigo-500/50 flex items-center justify-center text-3xl mb-3 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
//                  ❓
//               </div>
//               <h3 className="font-bold text-white mb-2">Secret Badge Discovered!</h3>
//               <p className="text-xs text-slate-400 mb-4 leading-relaxed">Hint: Try reading articles from 3 different subjects in a single day to unlock a hidden achievement...</p>
//            </div>

//         </div>

//       </div>
//     </PortalLayout>
//   );
// }

"use client";

import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";
import { useState } from "react";

const earnedBadges = [
  { name: "Science Whiz", icon: "🔬", date: "Oct 18, 2026", description: "Scored 100% on 5 Science quizzes.", color: "from-blue-500 to-indigo-600", rarity: "Epic" },
  { name: "7-Day Streak", icon: "🔥", date: "Oct 17, 2026", description: "Logged in and learned for 7 days straight.", color: "from-amber-500 to-orange-600", rarity: "Rare" },
  { name: "Math Ninja", icon: "🧮", date: "Oct 10, 2026", description: "Completed the Fractions Mastery module.", color: "from-emerald-500 to-teal-600", rarity: "Common" },
  { name: "First Steps", icon: "🌱", date: "Sep 01, 2026", description: "Joined the TN Schools Portal.", color: "from-emerald-500 to-emerald-600", rarity: "Common" },
  { name: "Helpful Hand", icon: "🤝", date: "Sep 25, 2026", description: "Answered a peer's question in the forum.", color: "from-purple-500 to-fuchsia-600", rarity: "Rare" },
];

const lockedBadges = [
  { name: "30-Day Streak", icon: "⚡", description: "Log in for 30 consecutive days.", progress: "12/30", percent: 40, color: "text-amber-600 dark:text-amber-400" },
  { name: "Bookworm", icon: "📚", description: "Read 10 books in the Digital Library.", progress: "6/10", percent: 60, color: "text-blue-600 dark:text-blue-400" },
  { name: "Perfect Term", icon: "👑", description: "Get A+ in all subjects this term.", progress: "0/1", percent: 0, color: "text-rose-600 dark:text-rose-400" },
];

export default function BadgesPage() {
  const [filter, setFilter] = useState("all");

  return (
    <PortalLayout
      title="My Trophy Room"
      subtitle="View your achievements, show off your badges, and see what to unlock next!"
      avatarLetter="A"
      avatarColor="#10b981"
      themeClass="theme-student"
      accentColor="#10b981"
    >
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
         <Link href="/student/middle-school" className="text-sm font-bold text-black dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-2 transition-colors">
            <span>←</span> Back to Dashboard
         </Link>
         
         <div className="w-full sm:w-auto bg-white dark:bg-slate-900/80 border border-emerald-500/30 px-4 py-2 rounded-xl flex items-center justify-between sm:justify-start gap-3 shadow-lg shadow-emerald-500/10">
            <span className="text-2xl">🏆</span>
            <div className="text-right sm:text-left">
               <span className="block text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-500 leading-none">Total Badges</span>
               <span className="block text-lg font-black text-black dark:text-white leading-none mt-1">5</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left/Main Column: Earned Badges */}
        <div className="xl:col-span-2 space-y-6">
           
           <div className="glass rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 min-h-[600px] relative overflow-hidden bg-white dark:bg-transparent">
             {/* Sparkles Background Effect */}
             <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #10b981 1px, transparent 1px), radial-gradient(circle at 80% 40%, #8b5cf6 1px, transparent 1px), radial-gradient(circle at 40% 80%, #f59e0b 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
             
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
                <h2 className="text-2xl font-black text-black dark:text-white flex items-center gap-2">
                  <span className="text-3xl">🏅</span> Earned Badges
                </h2>
                
                <div className="flex flex-wrap bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700/50 w-full sm:w-fit">
                   <button 
                     onClick={() => setFilter("all")}
                     className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${filter === "all" ? "bg-slate-700 text-white" : "text-black dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400"}`}
                   >
                     All
                   </button>
                   <button 
                     onClick={() => setFilter("Epic")}
                     className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${filter === "Epic" ? "bg-purple-600 text-white" : "text-black dark:text-white hover:text-purple-600 dark:hover:text-purple-400"}`}
                   >
                     Epic
                   </button>
                   <button 
                     onClick={() => setFilter("Rare")}
                     className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${filter === "Rare" ? "bg-blue-600 text-white" : "text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400"}`}
                   >
                     Rare
                   </button>
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                {earnedBadges
                  .filter(b => filter === "all" ? true : b.rarity === filter)
                  .map((badge, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 text-center flex flex-col items-center group cursor-pointer hover:border-emerald-500/50 transition-all hover:-translate-y-2 relative">
                     
                     {/* Badge Rarity Glow */}
                     <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${badge.color}`}></div>
                     
                     <div className="w-full flex justify-between items-start mb-2">
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border 
                          ${badge.rarity === 'Epic' ? 'text-purple-600 dark:text-purple-400 border-purple-500/30 bg-purple-500/10' : 
                            badge.rarity === 'Rare' ? 'text-blue-600 dark:text-blue-400 border-blue-500/30 bg-blue-500/10' : 
                            'text-black dark:text-white border-slate-500/30 bg-slate-500/10'}`}>
                          {badge.rarity}
                        </span>
                     </div>

                     <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-4xl shadow-lg mb-4 border-4 border-white dark:border-slate-800 relative`}>
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                        <span className="group-hover:scale-110 transition-transform">{badge.icon}</span>
                     </div>
                     
                     <h3 className="font-bold text-black dark:text-white mb-1">{badge.name}</h3>
                     <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-2">Earned: {badge.date}</p>
                     <p className="text-xs text-black dark:text-white leading-tight">{badge.description}</p>
                  </div>
                ))}
             </div>

             {earnedBadges.filter(b => filter === "all" ? true : b.rarity === filter).length === 0 && (
                <div className="text-center py-20 relative z-10">
                   <div className="text-6xl mb-4 opacity-50">👻</div>
                   <h3 className="text-xl text-black dark:text-white font-bold mb-2">No badges found</h3>
                   <p className="text-black dark:text-white">Keep learning to earn more {filter} badges!</p>
                </div>
             )}
           </div>

        </div>

        {/* Right Column: Locked Badges & Leaderboard */}
        <div className="space-y-6">
           
           {/* In Progress / Locked Badges */}
           <div className="glass rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 relative overflow-hidden bg-white dark:bg-transparent">
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full"></div>
             
             <h2 className="text-lg font-bold text-black dark:text-white mb-6 flex items-center gap-2 relative z-10">
               <span className="text-xl">🔒</span> Locked Badges
             </h2>
             
             <div className="space-y-4 relative z-10">
                {lockedBadges.map((badge, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 flex gap-4 opacity-80 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                     <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                        {badge.icon}
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                           <h3 className="font-bold text-black dark:text-white text-sm">{badge.name}</h3>
                           <span className={`text-[10px] font-black ${badge.color}`}>{badge.progress}</span>
                        </div>
                        <p className="text-[10px] text-black dark:text-white leading-tight mb-2">{badge.description}</p>
                        
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300" style={{ width: `${badge.percent}%` }}></div>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           </div>

           {/* Secret Badge Hint */}
           <div className="glass rounded-3xl p-6 border border-indigo-500/30 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/30 dark:to-transparent text-center">
              <div className="w-16 h-16 mx-auto bg-white dark:bg-slate-900 rounded-full border border-indigo-500/50 flex items-center justify-center text-3xl mb-3 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                 ❓
              </div>
              <h3 className="font-bold text-black dark:text-white mb-2">Secret Badge Discovered!</h3>
              <p className="text-xs text-black dark:text-white mb-4 leading-relaxed">Hint: Try reading articles from 3 different subjects in a single day to unlock a hidden achievement...</p>
           </div>

        </div>

      </div>
    </PortalLayout>
  );
}
