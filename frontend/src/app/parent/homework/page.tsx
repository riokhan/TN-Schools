"use client";
import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface Assignment {
  id: string;
  subject: string;
  topic: string;
  desc: string;
  assignedOn: string;
  dueOn: string;
  status: "pending" | "submitted" | "evaluated";
  grade?: string;
  score?: string;
  teacherFeedback?: string;
  parentSigned?: boolean;
  signedOn?: string;
}

const initialAssignments: Assignment[] = [
  {
    id: "hw-01",
    subject: "Mathematics",
    topic: "Quadratic Equations Ex 4.2",
    desc: "Solve questions 1 through 10 on finding roots using the quadratic formula. Write out all intermediate steps clearly.",
    assignedOn: "2025-06-18",
    dueOn: "2025-06-20",
    status: "pending",
    parentSigned: false,
  },
  {
    id: "hw-02",
    subject: "Science",
    topic: "Human Digestive System Diagram",
    desc: "Draw and label a neat diagram of the digestive system in the science practical notebook. List functions of salivary glands.",
    assignedOn: "2025-06-17",
    dueOn: "2025-06-19",
    status: "pending",
    parentSigned: false,
  },
  {
    id: "hw-03",
    subject: "English",
    topic: "Formal Letter Writing Exercise",
    desc: "Write a letter to the local municipal commissioner highlighting garbage accumulation issues in the neighborhood (150 words).",
    assignedOn: "2025-06-15",
    dueOn: "2025-06-17",
    status: "submitted",
    parentSigned: true,
    signedOn: "2025-06-16",
  },
  {
    id: "hw-04",
    subject: "Tamil",
    topic: "Thirukkural Explanation",
    desc: "Memorize and write the meanings of Thirukkural verses 121 to 130 on self-control (Adhigaaram 13: Adakkam Udaimai).",
    assignedOn: "2025-06-14",
    dueOn: "2025-06-16",
    status: "evaluated",
    grade: "O",
    score: "10/10",
    teacherFeedback: "Flawless writing. Handwriting is very neat and readable. Excellent spelling!",
    parentSigned: true,
    signedOn: "2025-06-15",
  },
  {
    id: "hw-05",
    subject: "Social Science",
    topic: "Indian National Movement Mapwork",
    desc: "On an outline map of India, mark key locations: Champaran, Dandi, Jallianwala Bagh, and Chauri Chaura.",
    assignedOn: "2025-06-12",
    dueOn: "2025-06-15",
    status: "evaluated",
    grade: "B+",
    score: "7.5/10",
    teacherFeedback: "Map points are correct, but labels should be more legible. Map border needs alignment.",
    parentSigned: true,
    signedOn: "2025-06-13",
  },
];

export default function HomeworkPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "submitted" | "evaluated">("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");

  const subjectsList = ["All", "Mathematics", "Science", "Tamil", "English", "Social Science"];

  const handleSignAssignment = (id: string) => {
    setAssignments((prev) =>
      prev.map((hw) => {
        if (hw.id === id) {
          const currentSignState = hw.parentSigned;
          return {
            ...hw,
            parentSigned: !currentSignState,
            signedOn: !currentSignState ? new Date().toISOString().split("T")[0] : undefined,
          };
        }
        return hw;
      })
    );
  };

  // Filter assignments
  const filteredAssignments = assignments.filter((hw) => {
    const matchesTab = activeTab === "all" || hw.status === activeTab;
    const matchesSubject = selectedSubject === "All" || hw.subject === selectedSubject;
    return matchesTab && matchesSubject;
  });

  // Calculate statistics
  const total = assignments.length;
  const pendingCount = assignments.filter((hw) => hw.status === "pending").length;
  const submittedCount = assignments.filter((hw) => hw.status === "submitted").length;
  const evaluatedCount = assignments.filter((hw) => hw.status === "evaluated").length;
  const completionRate = total > 0 ? Math.round(((submittedCount + evaluatedCount) / total) * 100) : 0;

  return (
    <PortalLayout
      title="Homework Status Portal"
      subtitle="Monitor Priya&apos;s daily homework tasks, review grading remarks, and co-sign completed assignments"
    >
      {/* TODO: Connect backend APIs to sync student submissions and evaluate feedback triggers */}
      
      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in">
        {[
          { label: "Completion Rate", value: `${completionRate}%`, icon: "📈", color: "text-emerald-400", sub: "Goal: 95%+" },
          { label: "Pending Tasks", value: pendingCount, icon: "⏳", color: "text-amber-400", sub: "Needs supervision" },
          { label: "Submitted Today", value: submittedCount, icon: "📤", color: "text-blue-400", sub: "Awaiting teacher review" },
          { label: "Evaluated Tasks", value: evaluatedCount, icon: "🏆", color: "text-purple-400", sub: "Contains grades & remarks" },
        ].map((kpi, i) => (
          <div key={i} className="kpi-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl">{kpi.icon}</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase">{kpi.sub}</span>
            </div>
            <div className={`text-3xl font-bold ${kpi.color} mb-1`}>{kpi.value}</div>
            <div className="text-xs text-slate-400 font-semibold">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Filter and Tab Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 glass rounded-2xl p-4 fade-in-2">
        {/* Status Tabs */}
        <div className="flex bg-slate-950/60 border border-slate-800 p-1 rounded-xl gap-1 overflow-x-auto w-full sm:w-auto">
          {(["all", "pending", "submitted", "evaluated"] as const).map((tab) => (
            <button
              key={tab}
              id={`hw-tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-emerald-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab === "all" ? "All Homework" : tab}
            </button>
          ))}
        </div>

        {/* Subject Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <label htmlFor="hw-subject-filter" className="text-xs font-semibold text-slate-400">Subject:</label>
          <select
            id="hw-subject-filter"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {subjectsList.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Homework Cards List */}
      <div className="space-y-4 fade-in-3">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((hw) => {
            const isPending = hw.status === "pending";
            const isEvaluated = hw.status === "evaluated";
            const isSubmitted = hw.status === "submitted";

            return (
              <div
                key={hw.id}
                className={`glass rounded-2xl p-6 border transition-all duration-200 hover:scale-[1.005] ${
                  isPending
                    ? "border-l-4 border-l-amber-500"
                    : isSubmitted
                    ? "border-l-4 border-l-blue-500"
                    : "border-l-4 border-l-emerald-500"
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/10">
                        {hw.subject}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">ID: {hw.id}</span>
                    </div>
                    <h3 className="text-base font-semibold text-white">{hw.topic}</h3>
                  </div>

                  {/* Status Badge & Grades */}
                  <div className="flex items-center gap-3">
                    {isEvaluated && (
                      <div className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-xl">
                        <span className="text-[10px] text-purple-400 font-bold uppercase">Grade</span>
                        <span className="text-xs text-white font-extrabold">{hw.grade} ({hw.score})</span>
                      </div>
                    )}
                    <span
                      className={`badge ${
                        isPending
                          ? "badge-yellow"
                          : isSubmitted
                          ? "badge-blue"
                          : "badge-green"
                      }`}
                    >
                      {hw.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-5 leading-relaxed">{hw.desc}</p>

                {/* Teacher Feedback section */}
                {isEvaluated && hw.teacherFeedback && (
                  <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 mb-5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs">💬</span>
                      <span className="text-xs font-bold text-slate-400">Teacher Evaluation Feedback:</span>
                    </div>
                    <p className="text-xs text-emerald-300 italic font-medium leading-normal">&quot;{hw.teacherFeedback}&quot;</p>
                  </div>
                )}

                {/* Actions and dates footer */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-800/80">
                  <div className="flex gap-4 text-[10px] text-slate-500">
                    <div>
                      Assigned On: <strong className="text-slate-400">{hw.assignedOn}</strong>
                    </div>
                    <div>
                      Due Date: <strong className={isPending ? "text-amber-400 font-bold" : "text-slate-400"}>{hw.dueOn}</strong>
                    </div>
                  </div>

                  {/* Co-Signature Feature */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    {hw.parentSigned ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/5 px-3 py-1.5 rounded-xl border border-emerald-500/10">
                        <span>✍️</span>
                        <span>Co-signed by Parent ({hw.signedOn})</span>
                        <button
                          onClick={() => handleSignAssignment(hw.id)}
                          className="text-[10px] text-slate-500 hover:text-red-400 ml-1 bg-none border-none outline-none cursor-pointer"
                          title="Revoke Signature"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        id={`hw-sign-btn-${hw.id}`}
                        onClick={() => handleSignAssignment(hw.id)}
                        className={`text-[11px] font-semibold px-4.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          isPending 
                            ? "bg-slate-850 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
                            : "bg-emerald-500 hover:bg-emerald-600 text-slate-950 border-transparent"
                        }`}
                      >
                        ✍️ Add Parent Digital Signature
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="glass rounded-2xl p-12 text-center text-slate-500">
            <span className="text-2xl mb-2 block">📝</span>
            <p className="text-xs">No assignments match your active filters.</p>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
