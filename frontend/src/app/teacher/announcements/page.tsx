"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface Announcement {
  id: number;
  title: string;
  body: string;
  target: string;
  date: string;
  sender: string;
  readReceipts?: string;
  pinned: boolean;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 1,
      title: "Science Practical Exam Schedule - Term I",
      body: "The Science Practical examinations for Class 10A will be held on Monday, June 22nd. Please ensure all student lab records are signed and submitted beforehand.",
      target: "Class 10A Parents",
      date: "Today, 10:00 AM",
      sender: "You (Science Specialist)",
      readReceipts: "38/42 read",
      pinned: true,
    },
    {
      id: 2,
      title: "Holiday Announcement - Krishna Jayanthi",
      body: "All school departments and classes will remain closed on the occasion of Krishna Jayanthi. Classes will resume regular timings on the following day.",
      target: "All Parents & Staff",
      date: "Yesterday, 2:30 PM",
      sender: "School Headmaster Office",
      pinned: false,
    },
    {
      id: 3,
      title: "Special Remedial Session for Biology Unit 2",
      body: "A supportive biology revision session will be conducted this Saturday from 9:30 AM to 11:00 AM in the Hi-Tech science lab. Attendance is recommended for flagged profiles.",
      target: "Class 9B Flagged Students",
      date: "June 16, 2026",
      sender: "You (Science Specialist)",
      readReceipts: "12/15 read",
      pinned: false,
    },
  ]);

  // Form State
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [target, setTarget] = useState("Class 10A Parents");
  const [pinToTop, setPinToTop] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;

    const newAnnouncement: Announcement = {
      id: Date.now(),
      title,
      body,
      target,
      date: "Just Now",
      sender: "You (Science Specialist)",
      readReceipts: "0/40 read",
      pinned: pinToTop,
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setTitle("");
    setBody("");
    setPinToTop(false);
    setToast("ðŸŽ‰ Announcement broadcasted! Parent notification feeds updated.");
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleDelete = (id: number) => {
    setAnnouncements(announcements.filter((ann) => ann.id !== id));
  };

  return (
    <PortalLayout title="Announcements & Circulars" subtitle="Broadcast updates to classes or review administration circulars.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Broadcast Form */}
        <div className="theme-card p-6 border border-[var(--border)] h-fit">
          <h2 className="text-base font-semibold text-[var(--text-heading)] mb-4">ðŸ“¢ Compose Announcement</h2>
          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">Topic / Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Science Fair Submission Rules"
                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">Target Audience</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              >
                <option value="Class 10A Parents">Class 10A Parents</option>
                <option value="Class 9B Parents">Class 9B Parents</option>
                <option value="Class 8A Parents">Class 8A Parents</option>
                <option value="All Parents taught by me">All Parents taught by me</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">Message Body</label>
              <textarea
                required
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Provide detailed instructions..."
                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pin-announcement"
                checked={pinToTop}
                onChange={(e) => setPinToTop(e.target.checked)}
                className="accent-amber-500 cursor-pointer"
              />
              <label htmlFor="pin-announcement" className="text-xs text-[var(--text-muted)] cursor-pointer select-none">
                Pin to the top of the dashboard
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[var(--primary)] hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
            >
              ðŸ“¢ Broadcast Announcement
            </button>
          </form>
        </div>

        {/* Board feed */}
        <div className="lg:col-span-2 theme-card p-6 border border-[var(--border)] space-y-5">
          <h2 className="text-base font-semibold text-[var(--text-heading)]">ðŸ“‹ Active Announcement Board</h2>

          {toast && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl">
              {toast}
            </div>
          )}

          <div className="space-y-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className={`p-4 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] rounded-xl border flex flex-col justify-between gap-3 relative ${
                  ann.pinned ? "border-[var(--primary)]/30" : "border-[var(--border)]"
                }`}
              >
                {ann.pinned && (
                  <span className="absolute top-3 right-3 text-[10px] bg-[var(--primary)]/10 text-amber-400 border border-[var(--primary)]/20 px-2 py-0.5 rounded-full font-bold">
                    ðŸ“Œ Pinned
                  </span>
                )}

                <div>
                  <div className="flex gap-2 items-center flex-wrap mb-1.5">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
                      {ann.target}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] font-semibold">{ann.date}</span>
                    <span className="text-[10px] text-slate-600 font-semibold">Â· By {ann.sender}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[var(--text-heading)] mb-2">{ann.title}</h3>
                  <p className="text-xs text-[var(--text-main)] leading-relaxed">{ann.body}</p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-[var(--border)] text-[11px] text-[var(--text-muted)]">
                  <span>{ann.readReceipts ? `Read receipts: ${ann.readReceipts}` : "Received"}</span>
                  {ann.sender.startsWith("You") && (
                    <button
                      onClick={() => handleDelete(ann.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

