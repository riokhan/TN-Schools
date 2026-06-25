"use client";

import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Map badge label → icon & style
const BADGE_META: Record<string, { icon: string; color: string; rarity: string }> = {
  "🔬 Star Scientist":  { icon: "🔬", color: "from-blue-500 to-indigo-600",   rarity: "Epic" },
  "📝 Homework Pro":   { icon: "📝", color: "from-amber-500 to-orange-600",   rarity: "Rare" },
  "💬 Active Speaker": { icon: "💬", color: "from-emerald-500 to-teal-600",   rarity: "Rare" },
  "🌟 Mentor Star":    { icon: "🌟", color: "from-purple-500 to-fuchsia-600", rarity: "Epic" },
};

const lockedBadges = [
  { name: "30-Day Streak",  icon: "⚡", description: "Log in for 30 consecutive days.",      progress: "12/30", percent: 40, color: "text-amber-600 dark:text-amber-400" },
  { name: "Bookworm",       icon: "📚", description: "Read 10 books in the Digital Library.", progress: "6/10",  percent: 60, color: "text-blue-600 dark:text-blue-400" },
  { name: "Perfect Term",   icon: "👑", description: "Get A+ in all subjects this term.",     progress: "0/1",   percent: 0,  color: "text-rose-600 dark:text-rose-400" },
];

export default function BadgesPage() {
  const { data: session, status } = useSession();
  const [filter, setFilter] = useState("all");
  const [earnedBadges, setEarnedBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    fetchBadges();
  }, [session, status]);

  const fetchBadges = async () => {
    try {
      setLoading(true);

      // 1. Get the student record for the logged-in user
      let studentId: string | null = null;
      if (session?.user) {
        const sRes = await fetch(`${API}/api/students`);
        const sJson = await sRes.json();
        if (sJson.success) {
          const me = sJson.data.find((s: any) => s.userId === (session.user as any).id);
          if (me) studentId = me.id;
        }
      }

      // 2. Fetch badges — filtered by this student's ID if we have one
      const schoolId = (session?.user as any)?.schoolId;
      const url = schoolId
        ? `${API}/api/teacher/badges?schoolId=${schoolId}`
        : `${API}/api/teacher/badges`;

      const bRes = await fetch(url);
      const bJson = await bRes.json();

      if (bJson.success) {
        const allBadges: any[] = bJson.data;
        // If we found the student, show only their badges; otherwise show all
        const filtered = studentId
          ? allBadges.filter((b) => b.studentId === studentId)
          : allBadges;

        // Shape them into displayable cards
        const shaped = filtered.map((b: any) => {
          const meta = BADGE_META[b.badge] || {
            icon: "🏅",
            color: "from-slate-500 to-slate-700",
            rarity: "Common",
          };
          const date = new Date(b.createdAt || Date.now()).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          });
          return {
            id: b.id,
            name: b.badge,
            icon: meta.icon,
            date,
            description: b.remark || meta.icon + " Awarded by your teacher",
            color: meta.color,
            rarity: meta.rarity,
          };
        });
        setEarnedBadges(shaped);
      }
    } catch (err) {
      console.error("Failed to fetch badges", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBadges = earnedBadges.filter(
    (b) => filter === "all" || b.rarity === filter
  );

  return (
    <PortalLayout
      title="My Trophy Room"
      subtitle="View your achievements, show off your badges, and see what to unlock next!"
      avatarLetter="A"
      avatarColor="#10b981"
      themeClass="theme-student"
      accentColor="#10b981"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <Link href="/student/middle-school" className="text-sm font-bold text-black dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-2 transition-colors">
          <span>←</span> Back to Dashboard
        </Link>

        <div className="w-full sm:w-auto bg-white dark:bg-slate-900/80 border border-emerald-500/30 px-4 py-2 rounded-xl flex items-center justify-between sm:justify-start gap-3 shadow-lg shadow-emerald-500/10">
          <span className="text-2xl">🏆</span>
          <div className="text-right sm:text-left">
            <span className="block text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-500 leading-none">Total Badges</span>
            <span className="block text-lg font-black text-black dark:text-white leading-none mt-1">
              {loading ? "…" : earnedBadges.length}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left: Earned Badges */}
        <div className="xl:col-span-2 space-y-6">
          <div className="glass rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 min-h-[400px] relative overflow-hidden bg-white dark:bg-transparent">
            {/* Sparkle bg */}
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #10b981 1px, transparent 1px), radial-gradient(circle at 80% 40%, #8b5cf6 1px, transparent 1px), radial-gradient(circle at 40% 80%, #f59e0b 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
              <h2 className="text-2xl font-black text-black dark:text-white flex items-center gap-2">
                <span className="text-3xl">🏅</span> Earned Badges
              </h2>

              <div className="flex flex-wrap bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700/50 w-full sm:w-fit">
                {["all", "Epic", "Rare", "Common"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                      filter === f ? "bg-slate-700 text-white" : "text-black dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Badge Grid */}
            {loading ? (
              <div className="flex justify-center py-20 relative z-10">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredBadges.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                {filteredBadges.map((badge) => (
                  <div key={badge.id} className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 text-center flex flex-col items-center group cursor-pointer hover:border-emerald-500/50 transition-all hover:-translate-y-2 relative">
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${badge.color}`}></div>

                    <div className="w-full flex justify-between items-start mb-2">
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border ${
                        badge.rarity === "Epic"   ? "text-purple-600 dark:text-purple-400 border-purple-500/30 bg-purple-500/10" :
                        badge.rarity === "Rare"   ? "text-blue-600 dark:text-blue-400 border-blue-500/30 bg-blue-500/10" :
                                                    "text-slate-600 dark:text-slate-400 border-slate-500/30 bg-slate-500/10"
                      }`}>{badge.rarity}</span>
                    </div>

                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-4xl shadow-lg mb-4 border-4 border-white dark:border-slate-800 relative`}>
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                      <span className="group-hover:scale-110 transition-transform">{badge.icon}</span>
                    </div>

                    <h3 className="font-bold text-black dark:text-white mb-1">{badge.name}</h3>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-2">Earned: {badge.date}</p>
                    <p className="text-xs text-black dark:text-slate-300 leading-tight">{badge.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 relative z-10">
                <div className="text-6xl mb-4 opacity-50">🎖️</div>
                <h3 className="text-xl text-black dark:text-white font-bold mb-2">
                  {earnedBadges.length === 0 ? "No badges yet!" : "No badges in this category"}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {earnedBadges.length === 0
                    ? "Your teacher will award badges for outstanding performance!"
                    : `Try selecting a different filter.`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Locked + Secret */}
        <div className="space-y-6">
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
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mb-2">{badge.description}</p>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300" style={{ width: `${badge.percent}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl p-6 border border-indigo-500/30 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/30 dark:to-transparent text-center">
            <div className="w-16 h-16 mx-auto bg-white dark:bg-slate-900 rounded-full border border-indigo-500/50 flex items-center justify-center text-3xl mb-3 shadow-[0_0_15px_rgba(99,102,241,0.5)]">❓</div>
            <h3 className="font-bold text-black dark:text-white mb-2">Secret Badge Discovered!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">Hint: Try reading articles from 3 different subjects in a single day to unlock a hidden achievement...</p>
          </div>
        </div>

      </div>
    </PortalLayout>
  );
}
