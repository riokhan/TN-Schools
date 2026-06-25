"use client";

import PortalLayout from "@/components/PortalLayout";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Announcement {
  id: string;
  title: string;
  body: string;
  target: string;
  date: string;
  sender: string;
  pinned: boolean;
  createdAt: string;
}

// Map DB announcements to display config
function getAnnouncementStyle(sender: string, title: string) {
  const t = title.toLowerCase();

  // Urgent
  if (
    t.includes("urgent") || t.includes("closure") || t.includes("emergency") ||
    t.includes("closed") || t.includes("holiday") || t.includes("heavy rain") ||
    t.includes("bus route") || t.includes("water supply") || t.includes("parent meeting")
  ) {
    return { type: "Urgent", icon: "⛈️", color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10 border-red-500/30" };
  }

  // Academic
  if (
    t.includes("exam") || t.includes("timetable") || t.includes("test") ||
    t.includes("homework") || t.includes("quiz") || t.includes("practical") ||
    t.includes("study") || t.includes("material") || t.includes("progress") ||
    t.includes("report") || t.includes("library") || t.includes("scholarship") ||
    t.includes("workshop") || t.includes("submission") || t.includes("chapter") ||
    t.includes("mathematics") || t.includes("science") || t.includes("coaching")
  ) {
    return { type: "Academic", icon: "📅", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" };
  }

  // Event
  if (
    t.includes("fair") || t.includes("event") || t.includes("cultural") ||
    t.includes("sports") || t.includes("competition") || t.includes("celebration") ||
    t.includes("audition") || t.includes("plantation") || t.includes("independence") ||
    t.includes("teachers") || t.includes("dance") || t.includes("music") ||
    t.includes("drawing") || t.includes("speech") || t.includes("campaign") ||
    t.includes("annual") || t.includes("day")
  ) {
    return { type: "Event", icon: "🔬", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" };
  }

  // General (fallback)
  return { type: "General", icon: "📢", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" };
}

export default function AnnouncementsPage() {
  const { data: session } = useSession();
    // 👇 ADD THIS HERE
  useEffect(() => {
    console.log("Student Session:", session?.user);
  }, [session]);
  const schoolId = (session?.user as any)?.schoolId;
  const studentClass = (session?.user as any)?.class; // e.g. "10A"
  const section = (session?.user as any)?.section;  // ← add this line
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
  if (!schoolId || !studentClass) return;

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/api/students/announcements?schoolId=${schoolId}&class=${studentClass}&section=${section || ''}`  // ← add &section=...
      );
      const result = await res.json();
      if (result.success) {
        setAnnouncements(result.data);
      }
    } catch (err) {
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchAnnouncements();
}, [schoolId, studentClass, section]);  // ← add section to dependency array

  const unreadCount = announcements.filter(a => !readIds.has(a.id)).length;

  const filteredAnnouncements = announcements.filter(a => {
    const style = getAnnouncementStyle(a.sender, a.title);
    const isUnread = !readIds.has(a.id);
    if (filter === "All") return true;
    if (filter === "Unread") return isUnread;
    if (filter === "Pinned") return a.pinned;
    return style.type === filter;
  });

  const markAllRead = () => {
    setReadIds(new Set(announcements.map(a => a.id)));
  };

  return (
    <PortalLayout
      title="School Announcements"
      subtitle={`Showing announcements for Class ${studentClass || "..."}`}
      avatarLetter="A"
      avatarColor="#f59e0b"
      themeClass="theme-student"
      accentColor="#f59e0b"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-transparent">
            <h3 className="font-bold text-black dark:text-white mb-4">Filter By</h3>
            <div className="space-y-2">
              {["All", "Unread", "Pinned", "Urgent", "Academic", "Event", "General"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-colors flex justify-between items-center ${
                    filter === cat
                      ? "bg-slate-100 dark:bg-slate-800 text-black dark:text-white border border-slate-300 dark:border-slate-600"
                      : "text-black dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-amber-600 dark:hover:text-amber-400 border border-transparent"
                  }`}
                >
                  <span>{cat}</span>
                  {cat === "Unread" && unreadCount > 0 && (
                    <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl p-6 border border-amber-500/30 bg-gradient-to-b from-amber-50 to-white dark:from-amber-900/20 dark:to-transparent">
            <h3 className="font-bold text-black dark:text-white mb-2 flex items-center gap-2">
              <span>🔔</span> Push Notifications
            </h3>
            <p className="text-xs text-black dark:text-white mb-4">
              Enable SMS or WhatsApp alerts for school closures and exam notices.
            </p>
            <button className="w-full py-2 bg-amber-600 hover:bg-amber-500 rounded-xl text-white text-sm font-bold shadow-lg shadow-amber-500/20 transition-all">
              Manage Alerts
            </button>
          </div>
        </div>

        {/* Announcement List */}
        <div className="lg:col-span-3">
          <div className="glass rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 min-h-[600px] bg-white dark:bg-transparent">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                <span>📢</span>
                {filter === "All" ? "All Announcements" : `${filter} Announcements`}
              </h2>
              <button
                onClick={markAllRead}
                className="text-xs font-bold text-black dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1"
              >
                <span>✓</span> Mark All as Read
              </button>
            </div>

            {loading ? (
              <div className="text-center py-20 text-sm text-slate-500">Loading announcements...</div>
            ) : (
              <div className="space-y-4">
                {filteredAnnouncements.map((ann) => {
                  const style = getAnnouncementStyle(ann.sender, ann.title);
                  const isUnread = !readIds.has(ann.id);

                  return (
                    <div
                      key={ann.id}
                      onClick={() => setReadIds(prev => new Set([...prev, ann.id]))}
                      className={`relative p-6 rounded-2xl border transition-all hover:-translate-y-1 cursor-pointer bg-slate-50 dark:bg-slate-900/60 ${
                        isUnread ? style.bg : "border-slate-200 dark:border-slate-700/50 hover:border-slate-400"
                      }`}
                    >
                      {ann.pinned && (
                        <span className="absolute top-3 right-3 text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                          📌 Pinned
                        </span>
                      )}
                      {isUnread && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                      )}

                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 bg-slate-100 dark:bg-slate-800 border ${
                          isUnread ? `${style.color} border-current` : "text-black dark:text-white border-slate-200 dark:border-slate-700"
                        }`}>
                          {style.icon}
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded border ${
                                isUnread ? `${style.color} border-current` : "text-black dark:text-white border-slate-300 dark:border-slate-600"
                              }`}>
                                {style.type}
                              </span>
                              <h3 className="text-lg font-bold text-black dark:text-white">{ann.title}</h3>
                            </div>
                            <span className="text-[10px] font-bold text-black dark:text-white uppercase tracking-wider whitespace-nowrap">
                              {ann.date || new Date(ann.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-sm text-black dark:text-white leading-relaxed mb-3">{ann.body}</p>

                          <div className="flex items-center gap-2 text-xs font-bold text-black dark:text-white">
                            <span>✍️ Posted by:</span>
                            <span>{ann.sender}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredAnnouncements.length === 0 && !loading && (
                  <div className="text-center py-20">
                    <div className="text-5xl mb-4 opacity-50">📭</div>
                    <h3 className="text-lg text-black dark:text-white font-bold mb-1">You're all caught up!</h3>
                    <p className="text-black dark:text-white text-sm">No {filter.toLowerCase()} announcements for Class {studentClass}.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}