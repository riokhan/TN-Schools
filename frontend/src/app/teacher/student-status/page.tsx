"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface RosterStudent {
  id: string;
  name: string;
  class: string;
  engagement: "High" | "Medium" | "Low";
  badges: string[];
}

export default function StudentStatusPage() {
  const [students, setStudents] = useState<RosterStudent[]>([
    { id: "S01", name: "Arjun Kumar", class: "10A", engagement: "High", badges: ["🔬 Star Scientist", "📝 Homework Pro"] },
    { id: "S02", name: "Murugan S.", class: "10A", engagement: "Low", badges: ["💬 Active Speaker"] },
    { id: "S03", name: "Kavitha R.", class: "9B", engagement: "Medium", badges: ["📝 Homework Pro"] },
    { id: "S04", name: "Senthil K.", class: "8A", engagement: "High", badges: ["🔬 Star Scientist"] },
  ]);

  // Award badge state
  const [targetStudentId, setTargetStudentId] = useState("S01");
  const [selectedBadge, setSelectedBadge] = useState("🔬 Star Scientist");
  const [customComment, setCustomComment] = useState("");
  const [awardNotification, setAwardNotification] = useState<string | null>(null);

  const availableBadges = [
    { label: "🔬 Star Scientist", desc: "Awarded for exceptional scientific work" },
    { label: "📝 Homework Pro", desc: "Awarded for 100% homework submission" },
    { label: "💬 Active Speaker", desc: "Awarded for healthy class discussions" },
    { label: "🌟 Mentor Star", desc: "Awarded for helping peers in studies" },
  ];

  const handleAwardBadge = () => {
    const studentObj = students.find((s) => s.id === targetStudentId);
    if (!studentObj) return;

    // Check if student already has this badge
    if (studentObj.badges.includes(selectedBadge)) {
      setAwardNotification(`⚠️ ${studentObj.name} already has the "${selectedBadge}" badge.`);
      return;
    }

    // Add badge
    setStudents(
      students.map((s) =>
        s.id === targetStudentId ? { ...s, badges: [...s.badges, selectedBadge] } : s
      )
    );

    setAwardNotification(
      `🎉 Successfully awarded "${selectedBadge}" to ${studentObj.name}! Custom remark: "${customComment || "Great work!"}"`
    );

    // Clear alert after 4 seconds
    setTimeout(() => {
      setAwardNotification(null);
    }, 4000);

    setCustomComment("");
  };

  return (
    <PortalLayout title="Student Status & Engagement" subtitle="Award virtual badges and monitor student classroom participation metrics.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Engagement status board */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-base font-semibold text-white mb-5">📈 Student Engagement & Badges Roster</h2>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Engagement</th>
                  <th>Badges Awarded</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="font-medium text-white">{student.name}</td>
                    <td>{student.class}</td>
                    <td>
                      <span className={`badge ${
                        student.engagement === "High"
                          ? "badge-green"
                          : student.engagement === "Medium"
                          ? "badge-blue"
                          : "badge-red"
                      }`}>
                        {student.engagement} Engagement
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1.5 max-w-[250px]">
                        {student.badges.length > 0 ? (
                          student.badges.map((badge, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg shrink-0 whitespace-nowrap"
                            >
                              {badge}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">No badges awarded</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Badge dispatch workspace */}
        <div className="glass rounded-2xl p-6 border border-slate-800 space-y-5">
          <div>
            <h2 className="text-base font-semibold text-white mb-1">🏅 Award Virtual Badges</h2>
            <p className="text-xs text-slate-500">Reward student achievements. Awarded badges appear directly on the student portal.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Select Student</label>
              <select
                value={targetStudentId}
                onChange={(e) => setTargetStudentId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.class})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Select Badge</label>
              <select
                value={selectedBadge}
                onChange={(e) => setSelectedBadge(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                {availableBadges.map((badge, idx) => (
                  <option key={idx} value={badge.label}>
                    {badge.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Custom Remark</label>
              <textarea
                value={customComment}
                onChange={(e) => setCustomComment(e.target.value)}
                rows={2}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
                placeholder="Write a warm note..."
              />
            </div>

            <button
              onClick={handleAwardBadge}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
            >
              🏅 Award & Dispatch Badge
            </button>
          </div>

          {awardNotification && (
            <div className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
              awardNotification.startsWith("⚠️")
                ? "bg-red-500/10 border-red-500/20 text-red-300"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
            }`}>
              {awardNotification}
            </div>
          )}
        </div>
      </div>

      {/* Badge descriptions registry */}
      <div className="glass rounded-2xl p-6 border border-slate-800">
        <h2 className="text-base font-semibold text-white mb-4">🏆 Badge Directory definitions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {availableBadges.map((b, idx) => (
            <div key={idx} className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl">
              <div className="text-lg font-bold text-white mb-1.5">{b.label}</div>
              <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
