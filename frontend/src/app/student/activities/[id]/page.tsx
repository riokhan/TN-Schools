"use client";

import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const API = "http://localhost:5000";

export default function ClubDetailsPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [club, setClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [joining, setJoining] = useState(false);
  const [memberRole, setMemberRole] = useState<string | null>(null);

  // Fetch club details
  useEffect(() => {
    async function fetchClub() {
      try {
        const res = await fetch(`${API}/api/activities/club/${params.id}`);
        const json = await res.json();
        if (json.success) setClub(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchClub();
  }, [params.id]);

  // Fetch student ID from session, then check membership
  useEffect(() => {
    if (!session?.user || !params.id) return;
    async function fetchStudentAndMembership() {
      try {
        const res = await fetch(`${API}/api/students`);
        const json = await res.json();
        if (json.success) {
          const me = json.data.find((s: any) => s.userId === (session!.user as any).id);
          if (me) {
            setStudentId(me.id);
            // Check membership
            const mRes = await fetch(`${API}/api/activities/club/${params.id}/membership/${me.id}`);
            const mJson = await mRes.json();
            if (mJson.success) {
              setIsMember(mJson.isMember);
              if (mJson.data) setMemberRole(mJson.data.role);
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchStudentAndMembership();
  }, [session, params.id]);

  const handleJoin = async () => {
    if (!studentId) return;
    setJoining(true);
    try {
      const res = await fetch(`${API}/api/activities/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubId: params.id, studentId }),
      });
      const json = await res.json();
      if (json.success) {
        setIsMember(true);
        setMemberRole("Member");
        // Update member count
        setClub((prev: any) => ({
          ...prev,
          _count: { ...prev._count, members: (prev._count?.members || 0) + 1 }
        }));
      } else {
        alert(json.error || "Failed to join club.");
      }
    } catch (err) {
      alert("Failed to join club.");
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!studentId) return;
    if (!confirm("Are you sure you want to leave this club?")) return;
    setJoining(true);
    try {
      const res = await fetch(`${API}/api/activities/leave`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubId: params.id, studentId }),
      });
      const json = await res.json();
      if (json.success) {
        setIsMember(false);
        setMemberRole(null);
        setClub((prev: any) => ({
          ...prev,
          _count: { ...prev._count, members: Math.max(0, (prev._count?.members || 1) - 1) }
        }));
      }
    } catch (err) {
      alert("Failed to leave club.");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <PortalLayout title="Loading..." subtitle="" avatarLetter="A">
        <div className="flex justify-center p-8">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
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

        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">

          {/* Hero Card */}
          <div className="glass rounded-3xl p-6 border border-slate-700/50 text-center relative overflow-hidden">
            <div className={`absolute -top-10 -right-10 w-40 h-40 blur-3xl opacity-20 rounded-full ${club.themeBg?.split(' ')[0] || 'bg-purple-500'}`}></div>

            <div className={`w-24 h-24 mx-auto rounded-3xl ${club.themeBg?.split(' ')[0] || 'bg-purple-500'} flex items-center justify-center text-5xl shadow-lg shadow-black/20 mb-6 rotate-3 relative z-10 hover:rotate-0 transition-transform`}>
              {club.icon}
            </div>

            <h2 className="text-2xl font-black text-white mb-2 relative z-10">{club.name}</h2>
            <p className={`text-xs uppercase font-black tracking-widest mb-4 ${club.themeColor || 'text-purple-400'} relative z-10`}>{club.category} Club</p>

            {/* Member Badge */}
            {isMember && (
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold relative z-10">
                <span>✅</span> {memberRole || "Member"}
              </div>
            )}

            {/* Join / Leave Button */}
            {isMember ? (
              <button
                onClick={handleLeave}
                disabled={joining}
                className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-xl text-red-400 font-bold transition-all active:scale-95 flex items-center justify-center gap-2 relative z-10"
              >
                {joining ? "⏳ Leaving..." : "🚪 Leave Club"}
              </button>
            ) : (
              <button
                onClick={handleJoin}
                disabled={joining || !studentId}
                className={`w-full py-3 ${club.themeTagBg || 'bg-purple-500/20'} rounded-xl text-white font-bold shadow-lg shadow-black/20 hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-2 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {joining ? "⏳ Joining..." : "👋 Apply to Join"}
              </button>
            )}
            {!studentId && !isMember && (
              <p className="text-[10px] text-slate-500 mt-2 relative z-10">Log in as a student to join</p>
            )}
          </div>

          {/* Info Card */}
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
              <p className="text-sm font-bold text-white flex items-center gap-2">
                <span>👥</span> {club._count?.members || 0} Students
              </p>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* About */}
          <div className="glass rounded-3xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">📖</span> About the Club
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">{club.description}</p>
          </div>

          {/* Events */}
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
                      <div className="w-12 h-12 rounded-lg bg-slate-800 flex flex-col items-center justify-center border border-slate-700 shrink-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                        <span className="text-lg font-black text-white leading-none">{date.toLocaleDateString('en-US', { day: '2-digit' })}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm mb-1">{event.title} {event.icon}</h4>
                        <p className="text-xs text-slate-400">{event.type}</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-slate-600 rounded-lg text-xs font-bold text-white hover:bg-slate-800 transition-colors shrink-0">
                      RSVP
                    </button>
                  </div>
                );
              }) : (
                <p className="text-sm text-slate-500">No upcoming events scheduled yet.</p>
              )}
            </div>
          </div>

          {/* Gallery */}
          <div className="glass rounded-3xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">🖼️</span> Activity Gallery
            </h3>
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
