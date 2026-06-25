"use client";

import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ClubDetailsPage({ params }: { params: { id: string } }) {
  const [club, setClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClub() {
      try {
        const res = await fetch(`http://localhost:5000/api/activities/club/${params.id}`);
        const json = await res.json();
        if (json.success) {
          setClub(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchClub();
  }, [params.id]);

  if (loading) {
    return (
      <PortalLayout title="Loading..." subtitle="" avatarLetter="A">
         <div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>
      </PortalLayout>
    );
  }

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
      avatarColor="#8b5cf6"
      themeClass="theme-student"
      accentColor="#8b5cf6"
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
              <div className={`absolute -top-10 -right-10 w-40 h-40 blur-3xl opacity-20 rounded-full ${club.themeBg?.split(' ')[0] || 'bg-purple-500'}`}></div>
              
              <div className={`w-24 h-24 mx-auto rounded-3xl ${club.themeBg?.split(' ')[0] || 'bg-purple-500'} flex items-center justify-center text-5xl shadow-lg shadow-black/20 mb-6 rotate-3 relative z-10 hover:rotate-0 transition-transform`}>
                 {club.icon}
              </div>
              
              <h2 className="text-2xl font-black text-white mb-2 relative z-10">{club.name}</h2>
              <p className={`text-xs uppercase font-black tracking-widest mb-6 ${club.themeColor || 'text-purple-400'} relative z-10`}>{club.category} Club</p>
              
              <button className={`w-full py-3 ${club.themeTagBg || 'bg-purple-500/20'} rounded-xl text-white font-bold shadow-lg shadow-black/20 hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-2 relative z-10`}>
                 <span>👋</span> Apply to Join
              </button>
           </div>

           <div className="glass rounded-3xl p-6 border border-slate-700/50 space-y-4">
              <div>
                 <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Faculty Sponsor</span>
                 <p className="text-sm font-bold text-white flex items-center gap-2"><span>👩‍🏫</span> {club.sponsor || "TBD"}</p>
              </div>
              <div className="w-full h-px bg-slate-800"></div>
              <div>
                 <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Meeting Time</span>
                 <p className="text-sm font-bold text-white flex items-center gap-2"><span>⏰</span> {club.meetingTime || "TBD"}</p>
              </div>
              <div className="w-full h-px bg-slate-800"></div>
              <div>
                 <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Active Members</span>
                 <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white flex items-center gap-2"><span>👥</span> {club._count?.members || 0} Students</p>
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
                {club.description}
              </p>
           </div>

           <div className="glass rounded-3xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-xl">🗓️</span> Upcoming Club Events
              </h3>
              <div className="space-y-3">
                 {club.events && club.events.length > 0 ? club.events.map((event: any) => {
                   const date = new Date(event.eventDate);
                   return (
                     <div key={event.id} className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-lg bg-slate-800 flex flex-col items-center justify-center border border-slate-700">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                              <span className="text-lg font-black text-white leading-none">{date.toLocaleDateString('en-US', { day: '2-digit' })}</span>
                           </div>
                           <div>
                              <h4 className="font-bold text-white text-sm mb-1">{event.title} {event.icon}</h4>
                              <p className="text-xs text-slate-400">{event.type}</p>
                           </div>
                        </div>
                        <button className="px-4 py-2 border border-slate-600 rounded-lg text-xs font-bold text-white hover:bg-slate-800 transition-colors">
                          RSVP
                        </button>
                     </div>
                   );
                 }) : (
                   <p className="text-sm text-slate-500">No upcoming events.</p>
                 )}
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
