"use client";

import PortalLayout from "@/components/PortalLayout";
import { useState } from "react";

const announcements = [
  { 
    id: 1, 
    type: "Urgent", 
    title: "School Closure Notice - Heavy Rain", 
    date: "Today, 6:00 AM", 
    author: "District Collector", 
    content: "Due to continuous heavy rainfall and waterlogging across the district, all schools will remain closed today (June 19, 2026). Please stay safely indoors. Online assignments have been paused.",
    icon: "⛈️",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/30",
    isUnread: true
  },
  { 
    id: 2, 
    type: "Academic", 
    title: "Quarterly Exam Timetable Released", 
    date: "Yesterday, 4:30 PM", 
    author: "Headmaster's Office", 
    content: "The official timetable for the upcoming Quarterly Examinations has been published. Exams will commence on July 15th. Please check the 'Board Prep' or 'Exams' section of your dashboard for the detailed schedule.",
    icon: "📅",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/30",
    isUnread: true
  },
  { 
    id: 3, 
    type: "Event", 
    title: "Annual Science Fair 2026 Registrations Open", 
    date: "June 15, 2026", 
    author: "Science Department", 
    content: "Registrations are now open for the State-level Annual Science Fair. Students from classes 6 to 12 can submit their project proposals through the Extracurricular Activities portal. Last date for submission is June 30th.",
    icon: "🔬",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    isUnread: false
  },
  { 
    id: 4, 
    type: "General", 
    title: "New Books Added to Digital Library", 
    date: "June 10, 2026", 
    author: "Librarian", 
    content: "Over 500 new interactive storybooks and reference materials have been added to the Digital Library. This includes the new 'Tamil Heritage' comic series and advanced competitive exam prep books.",
    icon: "📚",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30",
    isUnread: false
  },
];

export default function AnnouncementsPage() {
  const [filter, setFilter] = useState("All");

  const filteredAnnouncements = announcements.filter(a => {
    if (filter === "All") return true;
    if (filter === "Unread") return a.isUnread;
    return a.type === filter;
  });

  return (
    <PortalLayout
      title="School Announcements"
      subtitle="Stay updated with the latest notices, exam schedules, and important alerts."
      avatarLetter="A"
      avatarColor="#f59e0b"
      themeClass="theme-student"
      accentColor="#f59e0b"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Filters & Summary */}
        <div className="lg:col-span-1 space-y-6">
           <div className="glass rounded-3xl p-6 border border-slate-700/50">
              <h3 className="font-bold text-white mb-4">Filter By</h3>
              <div className="space-y-2">
                 {["All", "Unread", "Urgent", "Academic", "Event", "General"].map((cat) => (
                   <button 
                     key={cat}
                     onClick={() => setFilter(cat)}
                     className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-colors flex justify-between items-center ${
                       filter === cat 
                         ? "bg-slate-800 text-white border border-slate-600" 
                         : "text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent"
                     }`}
                   >
                     <span>{cat}</span>
                     {cat === "Unread" && <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full">2</span>}
                   </button>
                 ))}
              </div>
           </div>

           <div className="glass rounded-3xl p-6 border border-amber-500/30 bg-gradient-to-b from-amber-900/20 to-transparent">
              <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                <span>🔔</span> Push Notifications
              </h3>
              <p className="text-xs text-slate-400 mb-4">Never miss an urgent update. Enable SMS or WhatsApp alerts for school closures and exam notices.</p>
              <button className="w-full py-2 bg-amber-600 hover:bg-amber-500 rounded-xl text-white text-sm font-bold shadow-lg shadow-amber-500/20 transition-all">
                Manage Alerts
              </button>
           </div>
        </div>

        {/* Right Column: Announcements List */}
        <div className="lg:col-span-3">
           <div className="glass rounded-3xl p-6 border border-slate-700/50 min-h-[600px]">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6 pb-4 border-b border-slate-800">
                 <h2 className="text-xl font-bold text-white flex items-center gap-2">
                   <span>📢</span> {filter === "All" ? "All Announcements" : `${filter} Announcements`}
                 </h2>
                 <button className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                   <span>✓</span> Mark All as Read
                 </button>
              </div>

              <div className="space-y-4">
                 {filteredAnnouncements.map((announcement) => (
                   <div 
                     key={announcement.id} 
                     className={`relative bg-slate-900/60 p-6 rounded-2xl border transition-all hover:-translate-y-1 cursor-pointer ${
                       announcement.isUnread ? announcement.bg : "border-slate-700/50 hover:border-slate-500"
                     }`}
                   >
                      {announcement.isUnread && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                      )}
                      
                      <div className="flex items-start gap-4">
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 bg-slate-800 border ${announcement.isUnread ? announcement.color : "text-slate-500 border-slate-700"}`}>
                            {announcement.icon}
                         </div>
                         <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                               <div className="flex flex-wrap items-center gap-2">
                                  <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded border ${announcement.isUnread ? announcement.color + " border-current" : "text-slate-500 border-slate-600"}`}>
                                    {announcement.type}
                                  </span>
                                  <h3 className={`text-lg font-bold ${announcement.isUnread ? "text-white" : "text-slate-300"}`}>
                                    {announcement.title}
                                  </h3>
                               </div>
                               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                 {announcement.date}
                               </span>
                            </div>
                            
                            <p className="text-sm text-slate-400 leading-relaxed mb-3">
                               {announcement.content}
                            </p>
                            
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                               <span>✍️ Posted by:</span>
                               <span className="text-slate-300">{announcement.author}</span>
                           </div>
                         </div>
                      </div>
                   </div>
                 ))}

                 {filteredAnnouncements.length === 0 && (
                    <div className="text-center py-20">
                       <div className="text-5xl mb-4 opacity-50">📭</div>
                       <h3 className="text-lg text-white font-bold mb-1">You're all caught up!</h3>
                       <p className="text-slate-400 text-sm">No {filter.toLowerCase()} announcements right now.</p>
                    </div>
                 )}
              </div>

           </div>
        </div>

      </div>
    </PortalLayout>
  );
}
