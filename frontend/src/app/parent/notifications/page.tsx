"use client";
import { useEffect, useState, useCallback } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useSession } from "next-auth/react";
import { getApiBase } from "@/lib/useParentChildren";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  studentId: string | null;
  createdAt: string;
}

const TYPE_META: Record<string, { icon: string; cls: string; label: string }> = {
  attendance:  { icon: "📅", cls: "border-amber-500/30 bg-amber-500/5",   label: "Attendance" },
  marks:       { icon: "📊", cls: "border-emerald-500/30 bg-emerald-500/5", label: "Marks" },
  homework:    { icon: "📝", cls: "border-blue-500/30 bg-blue-500/5",       label: "Homework" },
  pta:         { icon: "🤝", cls: "border-purple-500/30 bg-purple-500/5",   label: "PTA" },
  scholarship: { icon: "🎓", cls: "border-cyan-500/30 bg-cyan-500/5",       label: "Scholarship" },
  general:     { icon: "📢", cls: "border-slate-600/50 bg-slate-800/40",    label: "General" },
};

const FILTER_OPTIONS = ["all", "attendance", "marks", "homework", "pta", "scholarship", "general"] as const;
type FilterType = typeof FILTER_OPTIONS[number];

export default function NotificationsPage() {
  const { data: session } = useSession();
  const parentId = (session?.user as any)?.id as string | undefined;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [filter, setFilter]               = useState<FilterType>("all");
  const [loading, setLoading]             = useState(true);
  const [markingAll, setMarkingAll]       = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!parentId) return;
    setLoading(true);
    try {
      const res  = await fetch(`${getApiBase()}/api/parent/${parentId}/notifications`);
      const json = await res.json();
      if (json.success) {
        setNotifications(json.data);
        setUnreadCount(json.unreadCount);
      }
    } catch {/* offline */}
    finally { setLoading(false); }
  }, [parentId]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`${getApiBase()}/api/parent/${parentId}/notifications/${id}/read`, { method: "PUT" });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {/* offline */}
  };

  const markAllRead = async () => {
    if (!parentId) return;
    setMarkingAll(true);
    try {
      await fetch(`${getApiBase()}/api/parent/${parentId}/notifications/read-all`, { method: "PUT" });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {/* offline */}
    finally { setMarkingAll(false); }
  };

  const filtered = notifications.filter(n => filter === "all" ? true : n.type === filter);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <PortalLayout>
      {/* Header */}
      <div className="glass rounded-2xl p-5 mb-6 flex items-center justify-between flex-wrap gap-4 fade-in">
        <div>
          <h2 className="text-lg font-bold text-white">🔔 Notifications</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            disabled={markingAll}
            className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {markingAll && <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
            ✓ Mark All Read
          </button>
        )}
      </div>

      {/* Type Summary Chips */}
      <div className="flex flex-wrap gap-2 mb-5 fade-in-2">
        {FILTER_OPTIONS.map(f => {
          const count = f === "all"
            ? notifications.length
            : notifications.filter(n => n.type === f).length;
          if (f !== "all" && count === 0) return null;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all flex items-center gap-1.5 ${
                filter === f ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {f !== "all" && TYPE_META[f]?.icon}
              {f === "all" ? "All" : TYPE_META[f]?.label}
              <span className="bg-white/10 px-1.5 py-0.5 rounded-full text-[10px]">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="space-y-3 fade-in-3">
        {loading ? (
          [1,2,3,4,5,6].map(i => (
            <div key={i} className="h-20 bg-slate-800/60 rounded-2xl animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-white font-semibold mb-2">No notifications</h3>
            <p className="text-slate-500 text-sm">
              {filter === "all" ? "You have no notifications yet." : `No ${filter} notifications.`}
            </p>
          </div>
        ) : (
          filtered.map(n => {
            const meta = TYPE_META[n.type] ?? TYPE_META["general"];
            return (
              <div
                key={n.id}
                onClick={() => !n.isRead && markAsRead(n.id)}
                className={`p-4 rounded-2xl border flex items-start gap-4 transition-all cursor-pointer hover:brightness-110 ${meta.cls} ${
                  !n.isRead ? "ring-1 ring-white/10" : "opacity-75"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                  !n.isRead ? "bg-white/10" : "bg-white/5"
                }`}>
                  {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold leading-snug ${!n.isRead ? "text-white" : "text-slate-400"}`}>
                      {n.title}
                    </p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                      )}
                      <span className="text-[10px] text-slate-500">{timeAgo(n.createdAt)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${meta.cls} border`}>
                      {meta.label}
                    </span>
                    {!n.isRead && (
                      <span className="text-[10px] text-slate-500">Click to mark as read</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </PortalLayout>
  );
}
