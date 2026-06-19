"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface StudentProfile {
  id: string;
  name: string;
  class: string;
  emis: string;
  parentContact: string;
  avgGrade: string;
  attendance: number;
  strengths: string[];
  weaknesses: string[];
  gradesHistory: { exam: string; score: string }[];
}

export default function StudentProfilesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  const [students] = useState<StudentProfile[]>([
    {
      id: "S01",
      name: "Arjun Kumar",
      class: "10A",
      emis: "3301234567",
      parentContact: "+91 98765 43210",
      avgGrade: "A+",
      attendance: 98,
      strengths: ["Logical Deduction", "Practical Physics experiments", "Highly attentive"],
      weaknesses: ["Handwriting speed", "Advanced organic chemical formulas"],
      gradesHistory: [
        { exam: "Unit Test I", score: "94/100" },
        { exam: "Quarterly Exam", score: "96/100" },
        { exam: "Half-Yearly Exam", score: "92/100" },
      ],
    },
    {
      id: "S02",
      name: "Murugan S.",
      class: "10A",
      emis: "3301234568",
      parentContact: "+91 98765 43211",
      avgGrade: "C+",
      attendance: 84,
      strengths: ["Active participant in discussions", "Strong physical coordination"],
      weaknesses: ["Consistently late homework", "Core chemical bonding concepts"],
      gradesHistory: [
        { exam: "Unit Test I", score: "54/100" },
        { exam: "Quarterly Exam", score: "62/100" },
        { exam: "Half-Yearly Exam", score: "60/100" },
      ],
    },
    {
      id: "S03",
      name: "Kavitha R.",
      class: "9B",
      emis: "3301234599",
      parentContact: "+91 98765 43222",
      avgGrade: "B",
      attendance: 89,
      strengths: ["Exceptional biology diagrams", "Hardworking in assignments"],
      weaknesses: ["Physics numerical questions", "Hesitant to ask clarifying questions"],
      gradesHistory: [
        { exam: "Unit Test I", score: "72/100" },
        { exam: "Quarterly Exam", score: "76/100" },
        { exam: "Half-Yearly Exam", score: "74/100" },
      ],
    },
    {
      id: "S04",
      name: "Senthil K.",
      class: "8A",
      emis: "3301234512",
      parentContact: "+91 98765 43255",
      avgGrade: "B+",
      attendance: 96,
      strengths: ["Curious learner", "Excellent project models"],
      weaknesses: ["Spelling errors in scientific terms", "Distracted in team lab activities"],
      gradesHistory: [
        { exam: "Unit Test I", score: "82/100" },
        { exam: "Quarterly Exam", score: "85/100" },
        { exam: "Half-Yearly Exam", score: "80/100" },
      ],
    },
  ]);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.emis.includes(searchTerm);
    const matchesClass = selectedClass === "All" || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <PortalLayout title="Student Profiles" subtitle="View and search comprehensive records, EMIS profiles, and performance details.">
      {/* Search and Filters */}
      <div className="theme-card p-5 mb-6 border border-[var(--border)] flex flex-col md:flex-row gap-4 justify-between items-center fade-in">
        <div className="flex-1 w-full flex gap-3">
          <input
            type="text"
            placeholder="Search by student name or EMIS ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)] transition-colors w-28"
          >
            <option value="All">All Classes</option>
            <option value="10A">Class 10A</option>
            <option value="9B">Class 9B</option>
            <option value="8A">Class 8A</option>
          </select>
        </div>
        <div className="text-xs text-[var(--text-muted)] font-semibold self-end md:self-auto shrink-0">
          Showing {filteredStudents.length} students
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="theme-card p-5 border border-[var(--border)] flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl transition-all"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-sm font-extrabold text-amber-400">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-heading)] leading-tight">{student.name}</h3>
                  <span className="text-[10px] text-[var(--text-muted)] font-semibold">EMIS: {student.emis}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Class Section:</span>
                  <span className="text-[var(--text-heading)] font-bold">{student.class}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Average Grade:</span>
                  <span className="text-emerald-400 font-extrabold">{student.avgGrade}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Attendance:</span>
                  <span className={`font-bold ${student.attendance >= 90 ? "text-emerald-400" : "text-amber-400"}`}>
                    {student.attendance}%
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedStudent(student)}
              className="w-full py-2 bg-[var(--bg-card)] hover:bg-slate-700 text-[var(--text-heading)] hover:text-[var(--text-heading)] font-bold rounded-xl text-xs transition-colors border border-[var(--border)]"
            >
              ðŸ” View Full Profile
            </button>
          </div>
        ))}
      </div>

      {/* Profile Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[var(--bg-main)] border border-[var(--border)] rounded-3xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-heading)] text-lg p-2"
            >
              âœ•
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 border-b border-[var(--border)] pb-5">
              <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 border border-[var(--primary)]/30 flex items-center justify-center text-lg font-black text-amber-400">
                {selectedStudent.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--text-heading)]">{selectedStudent.name}</h2>
                <div className="text-xs text-[var(--text-muted)] flex gap-3 mt-1 font-semibold">
                  <span>Class: {selectedStudent.class}</span>
                  <span>Â·</span>
                  <span>EMIS ID: {selectedStudent.emis}</span>
                </div>
              </div>
            </div>

            {/* Profile Content Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Stats & Contact */}
              <div className="space-y-5">
                <div className="p-4 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] rounded-2xl border border-[var(--border)] space-y-3">
                  <h3 className="text-xs uppercase font-extrabold text-amber-400">Academic & Contact</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Average Grade:</span>
                      <strong className="text-emerald-400">{selectedStudent.avgGrade}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Attendance Rate:</span>
                      <strong className="text-[var(--text-heading)]">{selectedStudent.attendance}%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Parent Contact:</span>
                      <strong className="text-[var(--text-heading)]">{selectedStudent.parentContact}</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] rounded-2xl border border-[var(--border)] space-y-3">
                  <h3 className="text-xs uppercase font-extrabold text-emerald-400">Strengths</h3>
                  <ul className="list-disc pl-4 text-xs text-[var(--text-main)] space-y-1">
                    {selectedStudent.strengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column: Improvement Areas & History */}
              <div className="space-y-5">
                <div className="p-4 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] rounded-2xl border border-[var(--border)] space-y-3">
                  <h3 className="text-xs uppercase font-extrabold text-red-400">Key Areas for Growth</h3>
                  <ul className="list-disc pl-4 text-xs text-[var(--text-main)] space-y-1">
                    {selectedStudent.weaknesses.map((weak, i) => (
                      <li key={i}>{weak}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] rounded-2xl border border-[var(--border)] space-y-3">
                  <h3 className="text-xs uppercase font-extrabold text-blue-400">Exam History Log</h3>
                  <table className="w-full text-xs">
                    <tbody>
                      {selectedStudent.gradesHistory.map((item, i) => (
                        <tr key={i} className="border-b border-[var(--border)] last:border-b-0">
                          <td className="py-1.5 text-[var(--text-muted)] font-medium">{item.exam}</td>
                          <td className="py-1.5 text-right font-bold text-[var(--text-heading)]">{item.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Message Action */}
            <div className="pt-4 border-t border-[var(--border)] flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2.5 bg-[var(--bg-card)] hover:bg-slate-700 text-[var(--text-heading)] rounded-xl text-xs font-semibold mr-3 transition-colors"
              >
                Close Profile
              </button>
              <button className="px-5 py-2.5 bg-[var(--primary)] hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-colors">
                ðŸ’¬ Message Parent
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}

