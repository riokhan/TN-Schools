"use client";

import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";

const allClubs: Record<string, any> = {
  "eco-warriors": { name: "Eco Warriors", category: "Environment", members: 45, icon: "🌱", color: "#10b981", themeClass: "text-emerald-400", bgClass: "from-emerald-600 to-teal-500", meeting: "Every Wednesday, 3:30 PM", sponsor: "Mrs. Anjali (Science Dept)" },
  "drama-troupe": { name: "Drama Troupe", category: "Arts", members: 32, icon: "🎭", color: "#a855f7", themeClass: "text-purple-400", bgClass: "from-purple-600 to-fuchsia-500", meeting: "Every Tuesday, 4:00 PM", sponsor: "Mr. Thomas (English Dept)" },
  "math-olympiad": { name: "Math Olympiad", category: "Academics", members: 28, icon: "♾️", color: "#3b82f6", themeClass: "text-blue-400", bgClass: "from-blue-600 to-cyan-500", meeting: "Every Thursday, 3:00 PM", sponsor: "Mr. Raman (Math Dept)" },
  "creative-writing": { name: "Creative Writing", category: "Literature", members: 50, icon: "✍️", color: "#f59e0b", themeClass: "text-amber-400", bgClass: "from-amber-500 to-orange-500", meeting: "Every Monday, 4:00 PM", sponsor: "Ms. Lakshmi (Literature Dept)" },
  "photography": { name: "Photography", category: "Arts", members: 65, icon: "📸", color: "#06b6d4", themeClass: "text-cyan-400", bgClass: "from-cyan-500 to-blue-500", meeting: "Bi-weekly Fridays, 3:30 PM", sponsor: "Mr. John (Arts Dept)" },
  "astronomy-club": { name: "Astronomy Club", category: "Science", members: 40, icon: "🔭", color: "#6366f1", themeClass: "text-indigo-400", bgClass: "from-indigo-600 to-violet-500", meeting: "Last Friday of the month, 7:00 PM", sponsor: "Dr. Subramani (Physics Dept)" },
};

export default function ClubDetailsPage({ params }: { params: { slug: string } }) {
  const club = allClubs[params.slug];

  if (!club) {
    return (
      <PortalLayout title="Club Not Found" subtitle="" avatarLetter="A">
         <div className="text-white">The club details you are looking for do not exist.</div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout
      title={`${club.name} Workspace`}
      subtitle={`Welcome to the ${club.name} club hub.`}
      avatarLetter="A"
      avatarColor={club.color}
      themeClass="theme-student"
      accentColor={club.color}
    >
      <div className="mb-6">
        <Link href="/student/activities" className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors w-fit">
          <span>←</span> Back to Activities Hub
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Hero & Action */}
        <div className="lg:col-span-1 space-y-6">
           
           <div className="glass rounded-3xl p-6 border border-slate-700/50 text-center relative overflow-hidden">
              <div className={`absolute -top-10 -right-10 w-40 h-40 blur-3xl opacity-20 rounded-full bg-gradient-to-br ${club.bgClass}`}></div>
              
              <div className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${club.bgClass} flex items-center justify-center text-5xl shadow-lg shadow-black/20 mb-6 rotate-3 relative z-10 hover:rotate-0 transition-transform`}>
                 {club.icon}
              </div>
              
              <h2 className="text-2xl font-black text-white mb-2 relative z-10">{club.name}</h2>
              <p className={`text-xs uppercase font-black tracking-widest mb-6 ${club.themeClass} relative z-10`}>{club.category} Club</p>
              
              <button className={`w-full py-3 bg-gradient-to-r ${club.bgClass} rounded-xl text-white font-bold shadow-lg shadow-black/20 hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-2 relative z-10`}>
                 <span>👋</span> Apply to Join
              </button>
           </div>

           <div className="glass rounded-3xl p-6 border border-slate-700/50 space-y-4">
              <div>
                 <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Faculty Sponsor</span>
                 <p className="text-sm font-bold text-white flex items-center gap-2"><span>👩‍🏫</span> {club.sponsor}</p>
              </div>
              <div className="w-full h-px bg-slate-800"></div>
              <div>
                 <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Meeting Time</span>
                 <p className="text-sm font-bold text-white flex items-center gap-2"><span>⏰</span> {club.meeting}</p>
              </div>
              <div className="w-full h-px bg-slate-800"></div>
              <div>
                 <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Active Members</span>
                 <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white flex items-center gap-2"><span>👥</span> {club.members} Students</p>
                    <div className="flex -space-x-2 ml-auto">
                       <div className="w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-900"></div>
                       <div className="w-6 h-6 rounded-full bg-slate-600 border-2 border-slate-900"></div>
                       <div className="w-6 h-6 rounded-full bg-slate-500 border-2 border-slate-900 flex items-center justify-center text-[8px] text-white">+{club.members - 2}</div>
                    </div>
                 </div>
              </div>
           </div>

        </div>

        {/* Right Column: About & Gallery */}
        <div className="lg:col-span-2 space-y-6">
           
           <div className="glass rounded-3xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-xl">📖</span> About the Club
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                The {club.name} is a student-led organization dedicated to fostering a community of passionate individuals. We organize weekly meetings, hands-on workshops, and collaborative projects that go beyond the standard curriculum.
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                Whether you are a beginner looking to learn the ropes or an expert wanting to share your knowledge, there's a place for you here. Join us to build your portfolio, make lifelong friends, and develop critical leadership skills!
              </p>
           </div>

           <div className="glass rounded-3xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-xl">🗓️</span> Upcoming Club Events
              </h3>
              <div className="space-y-3">
                 <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-lg bg-slate-800 flex flex-col items-center justify-center border border-slate-700">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Oct</span>
                          <span className="text-lg font-black text-white leading-none">24</span>
                       </div>
                       <div>
                          <h4 className="font-bold text-white text-sm mb-1">New Member Orientation</h4>
                          <p className="text-xs text-slate-400">Main Auditorium • 3:30 PM</p>
                       </div>
                    </div>
                    <button className="px-4 py-2 border border-slate-600 rounded-lg text-xs font-bold text-white hover:bg-slate-800 transition-colors">
                      RSVP
                    </button>
                 </div>
                 <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-lg bg-slate-800 flex flex-col items-center justify-center border border-slate-700">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Nov</span>
                          <span className="text-lg font-black text-white leading-none">02</span>
                       </div>
                       <div>
                          <h4 className="font-bold text-white text-sm mb-1">Guest Speaker Session</h4>
                          <p className="text-xs text-slate-400">Virtual Meet • 5:00 PM</p>
                       </div>
                    </div>
                    <button className="px-4 py-2 border border-slate-600 rounded-lg text-xs font-bold text-white hover:bg-slate-800 transition-colors">
                      RSVP
                    </button>
                 </div>
              </div>
           </div>

           <div className="glass rounded-3xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-xl">🖼️</span> Activity Gallery
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                 <div className="aspect-square bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center text-2xl hover:scale-105 transition-transform cursor-pointer">📸</div>
                 <div className="aspect-square bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center text-2xl hover:scale-105 transition-transform cursor-pointer">🎨</div>
                 <div className="aspect-square bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center text-2xl hover:scale-105 transition-transform cursor-pointer">🏆</div>
              </div>
           </div>

        </div>

      </div>
    </PortalLayout>
  );
}
