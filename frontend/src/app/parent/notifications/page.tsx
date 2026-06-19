"use client";
import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface SystemNotification {
  id: string;
  category: "alert" | "pta" | "academic" | "admin";
  type: "warning" | "success" | "info" | "danger";
  icon: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  details?: string;
}

const initialNotifications: SystemNotification[] = [
  {
    id: "notif-01",
    category: "alert",
    type: "warning",
    icon: "⚠️",
    title: "Attendance Threshold Warning",
    message: "Priya's cumulative attendance has dropped to 91% due to recent sick leaves.",
    time: "2 hours ago",
    isRead: false,
    details: "Tamil Nadu education board policy recommends maintaining at least 85% attendance. Priya has taken 2 days of excused medical leave and 1 day of late arrival. If attendance drops below 85%, special verification from the Headmaster will be needed for final exams. Please verify she attends regularly this week.",
  },
  {
    id: "notif-02",
    category: "pta",
    type: "info",
    icon: "📢",
    title: "Class 9B Parent-Teacher Meeting",
    message: "PTA Meeting scheduled for June 25, 2025 at 10:00 AM at the School Assembly Hall.",
    time: "Yesterday",
    isRead: false,
    details: "Agenda: \n1. Discussion of Midterm exam performance. \n2. Review of student discipline and EMIS profiling. \n3. Feedback on the AI Smart Learning Ecosystem. \n\nAll parents are requested to attend. If you cannot attend in person, please RSVP through the PTA portal to request an online video link.",
  },
  {
    id: "notif-03",
    category: "academic",
    type: "success",
    icon: "🏆",
    title: "Academic Excellence Achievement",
    message: "Priya scored 92% in the Mathematics unit test (Grade A+).",
    time: "2 days ago",
    isRead: true,
    details: "Priya scored 92/100, placing her in the top 5% of Class 9B. Her math teacher, Mrs. Sumathi Devi, noted: 'Priya shows outstanding capacity in algebraic equations. She completed the practice test 10 minutes early.' Keep up the support at home!",
  },
  {
    id: "notif-04",
    category: "admin",
    type: "danger",
    icon: "💰",
    title: "Scholarship Submission Deadline",
    message: "National Means-cum-Merit Scholarship (NMMS) applications close in 3 days.",
    time: "3 days ago",
    isRead: true,
    details: "The deadline for uploading income certificates and caste declarations is June 30, 2025. Failure to submit on time will automatically disqualify the candidate. Please review the Scholarship section on the sidebar to check if all files are uploaded and correct.",
  },
  {
    id: "notif-05",
    category: "academic",
    type: "info",
    icon: "📝",
    title: "Revision Timetable Published",
    message: "Class 9 revision assessment schedule for June 28 - July 3 has been released.",
    time: "4 days ago",
    isRead: false,
    details: "Timetable:\n- June 28: Tamil (Paper 1)\n- June 30: English (Paper 1)\n- July 1: Mathematics\n- July 2: Science\n- July 3: Social Science\n\nAll tests will happen between 9:30 AM and 12:30 PM. Syllabuses are available on the student AI tutor portal.",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<SystemNotification[]>(initialNotifications);
  const [activeCategory, setActiveCategory] = useState<"all" | "alert" | "pta" | "academic" | "admin">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleToggleRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const handleCardClick = (id: string) => {
    // Expand or collapse
    setExpandedId(expandedId === id ? null : id);
    // Auto-mark as read when clicked
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // Filter
  const filteredNotifications = notifications.filter(
    (n) => activeCategory === "all" || n.category === activeCategory
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <PortalLayout
      title="Notifications & Alerts Hub"
      subtitle="Stay up to date with school announcements, PTA invitations, and performance alerts"
    >
      {/* TODO: Connect backend WebSocket / SSE to fetch real-time broadcast alerts */}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-800 pb-5 fade-in">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔔</span>
          <div>
            <h2 className="text-base font-semibold text-white">System Messages</h2>
            <p className="text-xs text-slate-500">
              You have <strong className="text-emerald-400 font-bold">{unreadCount} unread</strong> notifications
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              id="notif-mark-all-btn"
              onClick={handleMarkAllRead}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold rounded-xl transition-all"
            >
              ✓ Mark All as Read
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex bg-slate-950/60 border border-slate-800 p-1 rounded-xl gap-1 overflow-x-auto mb-6 fade-in-2">
        {(["all", "alert", "pta", "academic", "admin"] as const).map((cat) => (
          <button
            key={cat}
            id={`notif-cat-${cat}`}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap ${
              activeCategory === cat
                ? "bg-emerald-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {cat === "all" ? "All Notices" : cat === "pta" ? "PTA Meetings" : cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3.5 fade-in-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => {
            const isExpanded = expandedId === notif.id;
            
            // Map type colors
            const getBorderColor = (type: string) => {
              switch (type) {
                case "warning": return "border-amber-500/30 hover:border-amber-500/50 bg-amber-500/5";
                case "success": return "border-emerald-500/30 hover:border-emerald-500/50 bg-emerald-500/5";
                case "danger": return "border-red-500/30 hover:border-red-500/50 bg-red-500/5";
                default: return "border-blue-500/30 hover:border-blue-500/50 bg-blue-500/5";
              }
            };

            return (
              <div
                key={notif.id}
                onClick={() => handleCardClick(notif.id)}
                className={`border rounded-2xl p-4.5 transition-all duration-150 cursor-pointer relative ${getBorderColor(
                  notif.type
                )} ${!notif.isRead ? "shadow-md shadow-slate-900/50" : "opacity-80 hover:opacity-100"}`}
              >
                {/* Unread dot indicator */}
                {!notif.isRead && (
                  <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                )}

                <div className="flex gap-4 items-start pr-6">
                  {/* Category icon container */}
                  <div className="text-xl bg-slate-950/60 p-2.5 rounded-xl flex-shrink-0">
                    {notif.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h3 className="text-sm font-semibold text-white truncate pr-4">
                        {notif.title}
                      </h3>
                      <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
                        {notif.time}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-snug">{notif.message}</p>

                    {/* Expandable details content */}
                    {isExpanded && notif.details && (
                      <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400 leading-relaxed fade-in">
                        <div className="bg-slate-950/40 rounded-xl p-4 border border-slate-900/80 font-normal whitespace-pre-line text-slate-300">
                          {notif.details}
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-[10px] text-slate-500">ID: {notif.id}</span>
                          <button
                            onClick={(e) => handleToggleRead(notif.id, e)}
                            className="text-[10px] font-semibold text-slate-400 hover:text-emerald-400 cursor-pointer"
                          >
                            Mark as {notif.isRead ? "Unread" : "Read"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="glass rounded-2xl p-12 text-center text-slate-500">
            <span className="text-2xl mb-2 block">🔔</span>
            <p className="text-xs">No notifications found in this category.</p>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
