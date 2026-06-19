"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface ClassPeriod {
  classSection: string;
  subject: string;
  teacher: string;
  room: string;
}

export default function TimetablePage() {
  const [activeDay, setActiveDay] = useState<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday">("Monday");

  // Timetable records by day
  const [timetable] = useState<Record<string, Record<string, ClassPeriod>>>({
    Monday: {
      "Period 1 (9:30-10:15)": { classSection: "Class 10A", subject: "Mathematics", teacher: "Mrs. Sumathi Devi", room: "Room 101" },
      "Period 2 (10:15-11:00)": { classSection: "Class 9B", subject: "Science", teacher: "Mr. Rajan K.", room: "Room 102" },
      "Period 3 (11:15-12:00)": { classSection: "Class 8A", subject: "Tamil", teacher: "Mrs. Kavitha S.", room: "Room 201" },
      "Period 4 (12:00-12:45)": { classSection: "Class 11C", subject: "English", teacher: "Ms. Deepa N.", room: "Room 205" },
      "Period 5 (1:30-2:15)": { classSection: "Class 12B", subject: "Social Science", teacher: "Mr. Prakash R.", room: "Room 301" },
    },
    Tuesday: {
      "Period 1 (9:30-10:15)": { classSection: "Class 9B", subject: "Mathematics", teacher: "Mrs. Sumathi Devi", room: "Room 102" },
      "Period 2 (10:15-11:00)": { classSection: "Class 10A", subject: "Science", teacher: "Mr. Ramesh", room: "Room 101" },
      "Period 3 (11:15-12:00)": { classSection: "Class 12B", subject: "English", teacher: "Ms. Deepa N.", room: "Room 301" },
      "Period 4 (12:00-12:45)": { classSection: "Class 8A", subject: "Social Science", teacher: "Mr. Prakash R.", room: "Room 201" },
      "Period 5 (1:30-2:15)": { classSection: "Class 11C", subject: "Tamil", teacher: "Mrs. Kavitha S.", room: "Room 205" },
    },
    Wednesday: {
      "Period 1 (9:30-10:15)": { classSection: "Class 8A", subject: "Mathematics", teacher: "Mrs. Sumathi Devi", room: "Room 201" },
      "Period 2 (10:15-11:00)": { classSection: "Class 11C", subject: "Science", teacher: "Mr. Rajan K.", room: "Room 205" },
      "Period 3 (11:15-12:00)": { classSection: "Class 10A", subject: "Tamil", teacher: "Mrs. Kavitha S.", room: "Room 101" },
      "Period 4 (12:00-12:45)": { classSection: "Class 12B", subject: "English", teacher: "Ms. Deepa N.", room: "Room 301" },
      "Period 5 (1:30-2:15)": { classSection: "Class 9B", subject: "Social Science", teacher: "Mr. Prakash R.", room: "Room 102" },
    },
    Thursday: {
      "Period 1 (9:30-10:15)": { classSection: "Class 11C", subject: "Mathematics", teacher: "Mrs. Sumathi Devi", room: "Room 205" },
      "Period 2 (10:15-11:00)": { classSection: "Class 12B", subject: "Science", teacher: "Mr. Rajan K.", room: "Room 301" },
      "Period 3 (11:15-12:00)": { classSection: "Class 9B", subject: "Tamil", teacher: "Mrs. Kavitha S.", room: "Room 102" },
      "Period 4 (12:00-12:45)": { classSection: "Class 10A", subject: "Social Science", teacher: "Mr. Prakash R.", room: "Room 101" },
      "Period 5 (1:30-2:15)": { classSection: "Class 8A", subject: "English", teacher: "Ms. Deepa N.", room: "Room 201" },
    },
    Friday: {
      "Period 1 (9:30-10:15)": { classSection: "Class 12B", subject: "Mathematics", teacher: "Mrs. Sumathi Devi", room: "Room 301" },
      "Period 2 (10:15-11:00)": { classSection: "Class 8A", subject: "Science", teacher: "Mr. Ramesh", room: "Room 201" },
      "Period 3 (11:15-12:00)": { classSection: "Class 11C", subject: "Tamil", teacher: "Mrs. Kavitha S.", room: "Room 205" },
      "Period 4 (12:00-12:45)": { classSection: "Class 9B", subject: "English", teacher: "Ms. Deepa N.", room: "Room 102" },
      "Period 5 (1:30-2:15)": { classSection: "Class 10A", subject: "Social Science", teacher: "Mr. Prakash R.", room: "Room 101" },
    },
  });

  // Proxy state
  const [absentTeacher, setAbsentTeacher] = useState("Mr. Ramesh (Science)");
  const [proxyTeacher, setProxyTeacher] = useState("Mrs. Sumathi Devi (Math)");
  const [proxyNotification, setProxyNotification] = useState<string | null>(null);

  const handleAssignProxy = (e: React.FormEvent) => {
    e.preventDefault();
    setProxyNotification(
      `✓ Proxy Assignment Confirmed! ${proxyTeacher} will cover period sessions for ${absentTeacher} today.`
    );
    setTimeout(() => setProxyNotification(null), 4000);
  };

  const dayTimetable = timetable[activeDay];

  return (
    <PortalLayout
      title="Master Timetable & Proxies"
      subtitle="Mr. Venkatesh R. · GHS Coimbatore · DISE: 33012345"
      avatarLetter="V"
      avatarColor="#3b82f6"
      themeClass="theme-headmaster"
      accentColor="#3b82f6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Visual schedule grid */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-base font-semibold text-white">🗓️ Daily master period maps</h2>
            
            {/* Days Selector */}
            <div className="flex flex-wrap gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
              {(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const).map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeDay === day
                      ? "bg-blue-500 text-white font-extrabold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(dayTimetable).map(([period, details]) => (
              <div key={period} className="p-4 bg-slate-900/60 rounded-xl border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">{period}</span>
                  <h3 className="text-sm font-bold text-white mt-1">{details.subject}</h3>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Class: <strong className="text-slate-300">{details.classSection}</strong> · Room: <span className="text-slate-500 font-semibold">{details.room}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg inline-block">
                    👩‍🏫 {details.teacher}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Proxy assignment desk */}
        <div className="glass rounded-2xl p-6 border border-slate-800 h-fit">
          <h2 className="text-base font-semibold text-white mb-2">🤝 Assign Teacher Proxy</h2>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">Arrange class period substitutions for absent staff in real-time.</p>

          <form onSubmit={handleAssignProxy} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium font-semibold">Absent Staff</label>
              <select
                value={absentTeacher}
                onChange={(e) => setAbsentTeacher(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="Mr. Ramesh (Science)">Mr. Ramesh (Science)</option>
                <option value="Mr. Prakash R. (Social Science)">Mr. Prakash R. (Social Science)</option>
                <option value="Ms. Deepa N. (English)">Ms. Deepa N. (English)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium font-semibold">Substitute Staff Proxy</label>
              <select
                value={proxyTeacher}
                onChange={(e) => setProxyTeacher(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="Mrs. Sumathi Devi (Math)">Mrs. Sumathi Devi (Math)</option>
                <option value="Mrs. Kavitha S. (Tamil)">Mrs. Kavitha S. (Tamil)</option>
                <option value="Mr. Rajan K. (Science)">Mr. Rajan K. (Science)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Assign Proxy Substitution
            </button>
          </form>

          {proxyNotification && (
            <div className="mt-4 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl leading-relaxed">
              {proxyNotification}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
