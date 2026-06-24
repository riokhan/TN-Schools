"use client";
import { useEffect, useState, useCallback } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useSession } from "next-auth/react";
import { getApiBase } from "@/lib/useParentChildren";

interface PTAMeeting {
  id: string;
  title: string;
  description: string | null;
  meetingDate: string;
  venue: string;
  status: "Upcoming" | "Completed" | "Cancelled";
  agenda: string[];
  createdAt: string;
}

export default function PtaMeetingsPage() {
  const { data: session } = useSession();
  const schoolId = (session?.user as any)?.schoolId as string | undefined;

  const [meetings, setMeetings]   = useState<PTAMeeting[]>([]);
  const [loading, setLoading]     = useState(true);
  const [rsvpStatus, setRsvpStatus] = useState<Record<string, "Accept" | "Decline" | "Tentative">>({});
  const [preSubmittedQuestions, setPreSubmittedQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState("");

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const qs = schoolId ? `?schoolId=${schoolId}` : "";
      const res  = await fetch(`${getApiBase()}/api/parent/pta-meetings${qs}`);
      const json = await res.json();
      if (json.success) setMeetings(json.data);
    } catch {/* offline */}
    finally { setLoading(false); }
  }, [schoolId]);

  useEffect(() => { fetchMeetings(); }, [fetchMeetings]);

  const handleRsvp = (meetingId: string, status: "Accept" | "Decline" | "Tentative") => {
    setRsvpStatus(prev => ({ ...prev, [meetingId]: status }));
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setPreSubmittedQuestions(prev => [...prev, newQuestion.trim()]);
    setNewQuestion("");
  };

  const upcoming  = meetings.filter(m => m.status === "Upcoming");
  const completed = meetings.filter(m => m.status === "Completed");
  const nextMeeting = upcoming[0];

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const fmtTime = (d: string) =>
    new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

  return (
    <PortalLayout
      title="Parent-Teacher Meetings"
      subtitle="Verify upcoming PTA agendas, RSVP status, and submit topics for classroom discussions"
    >
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in">
        {[
          { label: "Upcoming",  value: String(upcoming.length),  icon: "📅", color: "text-emerald-400" },
          { label: "Completed", value: String(completed.length), icon: "✅", color: "text-blue-400" },
          { label: "My Questions", value: String(preSubmittedQuestions.length), icon: "✍️", color: "text-amber-400" },
          { label: "Total Meetings", value: String(meetings.length), icon: "🤝", color: "text-purple-400" },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{k.icon}</span>
            </div>
            {loading
              ? <div className="h-8 w-12 bg-slate-700 rounded animate-pulse mb-1" />
              : <div className={`text-3xl font-bold ${k.color} mb-1`}>{k.value}</div>
            }
            <div className="text-xs text-slate-500">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Next PTA Meeting Card */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 fade-in flex flex-col justify-between">
          {loading ? (
            <div className="space-y-4">
              <div className="h-6 w-48 bg-slate-700 rounded animate-pulse" />
              <div className="h-4 w-64 bg-slate-700 rounded animate-pulse" />
              <div className="h-4 w-56 bg-slate-700 rounded animate-pulse" />
              <div className="h-32 bg-slate-800 rounded-xl animate-pulse" />
            </div>
          ) : nextMeeting ? (
            <div>
              <div className="flex justify-between items-start gap-4 mb-4">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/10 rounded-full">
                    Upcoming Meeting
                  </span>
                  <h2 className="text-base font-semibold text-white mt-1.5">{nextMeeting.title}</h2>
                  <p className="text-sm text-slate-300 mt-0.5">{fmtDate(nextMeeting.meetingDate)}</p>
                </div>
                <span className="badge badge-green">{nextMeeting.status}</span>
              </div>

              <div className="space-y-3.5 mb-6 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">⏰ Time:</span>
                  <strong className="text-white">{fmtTime(nextMeeting.meetingDate)}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">📍 Venue:</span>
                  <strong className="text-white">{nextMeeting.venue}</strong>
                </div>
                {nextMeeting.description && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">📝 Note:</span>
                    <strong className="text-white">{nextMeeting.description}</strong>
                  </div>
                )}
              </div>

              {nextMeeting.agenda.length > 0 && (
                <div className="border-t border-slate-800/80 pt-4">
                  <h3 className="text-xs font-bold text-slate-400 mb-2.5">📋 Agenda Points:</h3>
                  <ul className="space-y-2 text-xs text-slate-300 leading-normal pl-4 list-decimal">
                    {nextMeeting.agenda.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* RSVP Selector */}
              <div className="border-t border-slate-800/80 pt-5 mt-6">
                <h4 className="text-xs font-semibold text-slate-400 mb-3">Will you attend this meeting?</h4>
                <div className="flex flex-wrap gap-3 items-center">
                  {(["Accept", "Decline", "Tentative"] as const).map(status => {
                    const current = rsvpStatus[nextMeeting.id];
                    const colors = status === "Accept"
                      ? current === status ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20" : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                      : status === "Tentative"
                      ? current === status ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20" : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                      : current === status ? "bg-red-500 text-slate-950 shadow-lg shadow-red-500/20" : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white";
                    const icon = status === "Accept" ? "✓" : status === "Tentative" ? "?" : "✕";
                    return (
                      <button key={status} onClick={() => handleRsvp(nextMeeting.id, status)}
                        className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${colors}`}>
                        {icon} {status}
                      </button>
                    );
                  })}
                </div>
                {rsvpStatus[nextMeeting.id] && (
                  <p className="text-xs font-medium text-emerald-400 mt-3">
                    ✅ RSVP status saved: &quot;{rsvpStatus[nextMeeting.id]}&quot;. The class advisor has been notified.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-white font-semibold mb-2">No Upcoming PTA Meetings</h3>
              <p className="text-slate-400 text-sm">
                The Headmaster has not scheduled any upcoming meetings yet.
                Check back later or contact the school office.
              </p>
            </div>
          )}
        </div>

        {/* Submit Question for Discussion Form */}
        <div className="glass rounded-2xl p-6 flex flex-col justify-between fade-in-2">
          <div>
            <h2 className="text-base font-semibold text-white mb-1.5">✍️ Pre-submit Questions</h2>
            <p className="text-xs text-slate-500 mb-4 leading-normal">
              Submit concerns or topics you want discussed during the meeting. Agenda reviews will incorporate these items.
            </p>

            <form onSubmit={handleQuestionSubmit} className="space-y-4">
              <div>
                <label htmlFor="agenda-question" className="block text-xs font-semibold text-slate-400 mb-1.5">Your Question</label>
                <textarea
                  id="agenda-question"
                  rows={4}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Ask about revision tests, extra coaching, or portal features..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                id="agenda-submit-btn"
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-semibold transition-all cursor-pointer"
              >
                Submit Topic
              </button>
            </form>
          </div>

          {preSubmittedQuestions.length > 0 && (
            <div className="mt-5 border-t border-slate-800 pt-4">
              <h4 className="text-xs font-bold text-slate-400 mb-2">Submitted Topics:</h4>
              <ul className="space-y-2">
                {preSubmittedQuestions.map((q, idx) => (
                  <li key={idx} className="text-xs bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl text-slate-300 leading-normal">
                    • {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Other Upcoming Meetings (if more than 1) */}
      {upcoming.length > 1 && (
        <div className="glass rounded-2xl p-6 mb-6 fade-in-3">
          <h2 className="text-base font-semibold text-white mb-4">📅 Other Upcoming Meetings</h2>
          <div className="space-y-3">
            {upcoming.slice(1).map(m => (
              <div key={m.id} className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">{m.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{fmtDate(m.meetingDate)} at {fmtTime(m.meetingDate)}</p>
                    <p className="text-xs text-slate-500 mt-0.5">📍 {m.venue}</p>
                  </div>
                  <span className="badge badge-green text-xs">{m.status}</span>
                </div>
                {m.agenda.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-emerald-500/10">
                    <p className="text-xs text-slate-400">{m.agenda.length} agenda point{m.agenda.length > 1 ? "s" : ""}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past PTA Meetings Log */}
      <div className="glass rounded-2xl p-6 fade-in-3">
        <h2 className="text-base font-semibold text-white mb-4">🤝 Past Meetings History & Minutes</h2>
        {completed.length === 0 && !loading ? (
          <div className="text-center py-8 text-slate-500 text-sm">No past meetings on record yet.</div>
        ) : (
          <div className="space-y-4">
            {completed.map((meet) => (
              <div key={meet.id} className="bg-slate-900/40 rounded-2xl p-4 border border-slate-800/80 hover:border-slate-700/80 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1.5 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      Completed
                    </span>
                    <h4 className="text-xs font-bold text-white">{meet.title}</h4>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">{fmtDate(meet.meetingDate)}</span>
                </div>
                {meet.description && (
                  <p className="text-xs text-slate-400 leading-relaxed">{meet.description}</p>
                )}
                {meet.agenda.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-700/50">
                    <p className="text-xs text-slate-500">📋 Discussed: {meet.agenda.join(" · ")}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
