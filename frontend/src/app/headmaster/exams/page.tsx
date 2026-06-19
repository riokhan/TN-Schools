"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface ExamCalendar {
  id: number;
  name: string;
  classSection: string;
  subject: string;
  date: string;
  status: "Scheduled" | "In Progress" | "Completed";
}

export default function HeadmasterExamsPage() {
  const [exams] = useState<ExamCalendar[]>([
    { id: 1, name: "Matriculation Mock Public Exam", classSection: "Class 10 (All)", subject: "Science (Theory)", date: "June 25, 2026", status: "Scheduled" },
    { id: 2, name: "Revision test - I", classSection: "Class 12 (Biology)", subject: "Physics", date: "June 28, 2026", status: "Scheduled" },
    { id: 3, name: "Practical Lab Evaluations", classSection: "Class 10A & 10B", subject: "Chemistry Practicals", date: "June 22, 2026", status: "In Progress" },
    { id: 4, name: "Diagnostic Aptitude evaluation", classSection: "Class 8 (All)", subject: "Basic Math & Literacy", date: "June 12, 2026", status: "Completed" },
  ]);

  // Seating state
  const [targetHall, setTargetHall] = useState("Block A - Hall 1");
  const [targetGrades, setTargetGrades] = useState("Class 10");
  const [seatingToast, setSeatingToast] = useState<string | null>(null);

  const handleSeatAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    setSeatingToast(`✓ Seating arrangements allocated in ${targetHall} for ${targetGrades} exams. Seating layout synced to teachers & student portals.`);
    setTimeout(() => setSeatingToast(null), 4000);
  };

  return (
    <PortalLayout
      title="Exam Scheduling & Seating"
      subtitle="Mr. Venkatesh R. · GHS Coimbatore · DISE: 33012345"
      avatarLetter="V"
      avatarColor="#3b82f6"
      themeClass="theme-headmaster"
      accentColor="#3b82f6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Exam schedules calendar */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-slate-800">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-base font-semibold text-white">📋 Upcoming Examination Calendar</h2>
            <button className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors border border-slate-700">
              Publish Exam Date Sheet
            </button>
          </div>

          <div className="space-y-4">
            {exams.map((ex) => (
              <div
                key={ex.id}
                className="p-4 bg-slate-900/60 rounded-xl border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex gap-2 items-center mb-1.5 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
                      {ex.classSection}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">{ex.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-0.5">{ex.name}</h3>
                  <div className="text-xs text-slate-400 font-semibold">Subject focus: {ex.subject}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`badge ${
                    ex.status === "Scheduled"
                      ? "badge-blue"
                      : ex.status === "In Progress"
                      ? "badge-yellow"
                      : "badge-green"
                  }`}>
                    {ex.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hall allocation workspace */}
        <div className="glass rounded-2xl p-6 border border-slate-800 h-fit">
          <h2 className="text-base font-semibold text-white mb-2">🏫 Allocate Exam Seating</h2>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">Digitally partition classroom desks for upcoming board revision sessions.</p>

          <form onSubmit={handleSeatAllocation} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium font-semibold">Select Exam Hall</label>
              <select
                value={targetHall}
                onChange={(e) => setTargetHall(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="Block A - Hall 1">Block A - Hall 1 (80 desks)</option>
                <option value="Block A - Hall 2">Block A - Hall 2 (80 desks)</option>
                <option value="Main Auditorium">Main Auditorium (250 desks)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium font-semibold">Select Grades</label>
              <select
                value={targetGrades}
                onChange={(e) => setTargetGrades(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="Class 10">Class 10 Matriculation</option>
                <option value="Class 12">Class 12 Biological Stream</option>
                <option value="Class 8">Class 8 Support Evaluation</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Allocate Seating Chart
            </button>
          </form>

          {seatingToast && (
            <div className="mt-4 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl leading-relaxed">
              {seatingToast}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
