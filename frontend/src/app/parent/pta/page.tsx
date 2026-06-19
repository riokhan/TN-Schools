"use client";
import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface PtaMeeting {
  id: string;
  date: string;
  time: string;
  mode: "Offline" | "Online";
  location: string;
  agenda: string[];
  organizer: string;
}

const upcomingMeeting: PtaMeeting = {
  id: "pta-meet-105",
  date: "Wednesday, June 25, 2025",
  time: "10:00 AM - 11:30 AM",
  mode: "Offline",
  location: "School Assembly Hall, GHS Coimbatore",
  organizer: "Mrs. Sumathi Devi (Class 9B Advisor)",
  agenda: [
    "Discussion of Midterm examination grades and subject-wise averages",
    "Student safety, attendance tracking policies, and leave submissions",
    "Implementation feedback for the AI Smart Learning Ecosystem modules",
    "Discussion on Class 9 revision tests schedule (June 28 to July 3)"
  ]
};

const pastMeetings = [
  {
    id: "pta-meet-104",
    date: "March 15, 2025",
    type: "Term 2 Review",
    summary: "Reviewed Term 2 performance, discussed smart classroom projector installation, and finalized the dietary tracking system in mid-day school meals."
  },
  {
    id: "pta-meet-103",
    date: "January 10, 2025",
    type: "New Year Planning",
    summary: "Discussed winter unit assessment results, coordinated distribution of free school uniform sets, and announced winter athletic meet dates."
  }
];

export default function PtaMeetingsPage() {
  const [rsvpStatus, setRsvpStatus] = useState<"Accept" | "Decline" | "Tentative" | null>(null);
  const [rsvpFeedback, setRsvpFeedback] = useState("");
  const [preSubmittedQuestions, setPreSubmittedQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState("");

  const handleRsvp = (status: "Accept" | "Decline" | "Tentative") => {
    setRsvpStatus(status);
    setRsvpFeedback(`✅ RSVP status saved: "${status}". The class advisor has been notified.`);
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setPreSubmittedQuestions([...preSubmittedQuestions, newQuestion.trim()]);
    setNewQuestion("");
  };

  return (
    <PortalLayout
      title="Parent-Teacher Meetings"
      subtitle="Verify upcoming PTA agendas, RSVP status, and submit topics for classroom discussions"
    >
      {/* TODO: Connect backend calendar integrations (Google Calendar / Microsoft Teams for online meets) */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Next PTA meeting card */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 fade-in flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-4 mb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/10 rounded-full">
                  Upcoming Meeting
                </span>
                <h2 className="text-base font-semibold text-white mt-1.5">{upcomingMeeting.date}</h2>
              </div>
              <span className="badge badge-green">{upcomingMeeting.mode}</span>
            </div>

            <div className="space-y-3.5 mb-6 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">⏰ Time:</span>
                <strong className="text-white">{upcomingMeeting.time}</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">📍 Venue:</span>
                <strong className="text-white">{upcomingMeeting.location}</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">👤 Organizer:</span>
                <strong className="text-white">{upcomingMeeting.organizer}</strong>
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-4">
              <h3 className="text-xs font-bold text-slate-400 mb-2.5">📋 Agenda Points:</h3>
              <ul className="space-y-2 text-xs text-slate-300 leading-normal pl-4 list-decimal">
                {upcomingMeeting.agenda.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* RSVP Selector */}
          <div className="border-t border-slate-800/80 pt-5 mt-6">
            <h4 className="text-xs font-semibold text-slate-400 mb-3">Will you attend this meeting?</h4>
            <div className="flex flex-wrap gap-3 items-center">
              <button
                id="pta-rsvp-accept"
                onClick={() => handleRsvp("Accept")}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  rsvpStatus === "Accept"
                    ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                ✓ Accept
              </button>
              <button
                id="pta-rsvp-tentative"
                onClick={() => handleRsvp("Tentative")}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  rsvpStatus === "Tentative"
                    ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                ? Tentative
              </button>
              <button
                id="pta-rsvp-decline"
                onClick={() => handleRsvp("Decline")}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  rsvpStatus === "Decline"
                    ? "bg-red-500 text-slate-950 shadow-lg shadow-red-500/20"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                ✕ Decline
              </button>
            </div>
            {rsvpFeedback && (
              <p className="text-xs font-medium text-emerald-450 mt-3" id="pta-rsvp-feedback">
                {rsvpFeedback}
              </p>
            )}
          </div>
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

          {/* User Submitted Questions */}
          {preSubmittedQuestions.length > 0 && (
            <div className="mt-5 border-t border-slate-800 pt-4" id="pta-submitted-questions">
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

      {/* Past PTA Meetings Log */}
      <div className="glass rounded-2xl p-6 fade-in-3">
        <h2 className="text-base font-semibold text-white mb-4">🤝 Past Meetings History & Minutes</h2>
        <div className="space-y-4">
          {pastMeetings.map((meet) => (
            <div key={meet.id} className="bg-slate-900/40 rounded-2xl p-4.5 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700/80 transition-colors">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1.5 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {meet.id}
                  </span>
                  <h4 className="text-xs font-bold text-white">{meet.type}</h4>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold">{meet.date}</span>
              </div>
              <p className="text-xs text-slate-350 leading-relaxed">{meet.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
