"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PortalLayout from "@/components/PortalLayout";

interface ClassInfo {
  id: string;
  name: string;
  subject: string;
  studentsCount: number;
  attendance: number;
  homeworkRate: number;
  avgScore: number;
  riskCount: number;
  syllabus: string;
  classNameNum: string;
  sectionLetter: string;
}

interface Student {
  rollNo: string;
  name: string;
  attendance: number;
  grade: number;
  status: "Good" | "Average" | "Risk";
}

export default function ClassesPage() {
  const { data: session } = useSession();
  const schoolId = (session?.user as any)?.schoolId;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [classesList, setClassesList] = useState<ClassInfo[]>([]);
  const [studentsData, setStudentsData] = useState<Record<string, Student[]>>({});
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchClassesAndStudents = async () => {
    if (!schoolId) return;
    try {
      setLoading(true);

      // Fetch all students in school
      const res = await fetch(`${API_URL}/api/students?schoolId=${schoolId}`);
      const studentsResult = await res.json();

      // Fetch watchlist students to check risk count
      const watchlistRes = await fetch(`${API_URL}/api/headmaster/students?schoolId=${schoolId}`);
      const watchlistResult = await watchlistRes.json();
      const watchlist = watchlistResult.success ? watchlistResult.data : [];

      if (studentsResult.success && studentsResult.data) {
        const rawStudents = studentsResult.data;

        // Group by class and section
        const groups: Record<string, typeof rawStudents> = {};
        rawStudents.forEach((student: any) => {
          const key = `${student.class}${student.section}`.toLowerCase();
          if (!groups[key]) groups[key] = [];
          groups[key].push(student);
        });

        const list: ClassInfo[] = [];
        const rosterData: Record<string, Student[]> = {};

        Object.keys(groups).forEach((key) => {
          const firstSt = groups[key][0];
          const classStudents = groups[key];
          
          // count watchlist students in this class/section
          const classRiskCount = watchlist.filter(
            (w: any) => w.class === `${firstSt.class}${firstSt.section}`
          ).length;

          list.push({
            id: key,
            name: `Class ${firstSt.class}${firstSt.section}`,
            subject: "Science & Mathematics",
            studentsCount: classStudents.length,
            attendance: 92, // default summary
            homeworkRate: 85,
            avgScore: 75,
            riskCount: classRiskCount,
            syllabus: "TN Board (Samacheer Kalvi)",
            classNameNum: firstSt.class,
            sectionLetter: firstSt.section,
          });

          rosterData[key] = classStudents.map((cs: any, idx: number) => {
            const hasRisk = watchlist.some((w: any) => w.rollNumber === cs.rollNumber);
            return {
              rollNo: cs.rollNumber || `${firstSt.class}${firstSt.section}${String(idx + 1).padStart(2, '0')}`,
              name: cs.user?.name || "N/A",
              attendance: 90 + (idx % 11),
              grade: 65 + (idx % 35),
              status: hasRisk ? ("Risk" as const) : (idx % 5 === 0 ? ("Average" as const) : ("Good" as const)),
            };
          });
        });

        setClassesList(list);
        setStudentsData(rosterData);
        if (list.length > 0 && !selectedClassId) {
          setSelectedClassId(list[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching class roster:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassesAndStudents();
  }, [schoolId]);

  const selectedClass = classesList.find((c) => c.id === selectedClassId) || classesList[0];
  const students = selectedClass ? (studentsData[selectedClass.id] || []) : [];

  return (
    <PortalLayout title="My Classes" subtitle="Manage your sections, student rosters, and schedules">
      <div className="flex flex-col gap-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] p-4 rounded-2xl border border-[var(--border)]">
          <div>
            <h2 className="text-[var(--text-heading)] font-semibold text-sm">Class Directory</h2>
            <p className="text-xs text-[var(--text-muted)]">Select a class to view its active student roster and analytics summary.</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-xs text-[var(--text-muted)]">Loading class roster...</div>
        ) : classesList.length > 0 ? (
          <>
            {/* Classes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {classesList.map((c) => {
                const isSelected = c.id === selectedClassId;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedClassId(c.id)}
                    className={`theme-card p-5 border text-left cursor-pointer transition-all hover:scale-[1.01] ${
                      isSelected ? "border-[var(--primary)]/80 bg-[var(--primary)]/5 shadow-lg shadow-amber-500/5" : "border-[var(--border)] hover:border-[var(--border)]"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-[var(--text-heading)] font-bold text-base">{c.name}</h3>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">{c.subject}</p>
                      </div>
                      <span className="badge badge-blue text-[10px]">{c.syllabus.split(" ")[0]}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-[var(--border)]/60 text-xs">
                      <div>
                        <span className="text-[var(--text-muted)] block">Students</span>
                        <span className="text-[var(--text-heading)] font-semibold">{c.studentsCount}</span>
                      </div>
                      <div>
                        <span className="text-[var(--text-muted)] block">Attendance</span>
                        <span className={`font-semibold ${c.attendance >= 90 ? "text-emerald-400" : "text-amber-400"}`}>
                          {c.attendance}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[var(--text-muted)] block">Avg Score</span>
                        <span className="text-[var(--text-heading)] font-semibold">{c.avgScore}%</span>
                      </div>
                      <div>
                        <span className="text-[var(--text-muted)] block">At Risk</span>
                        <span className={`font-semibold ${c.riskCount > 2 ? "text-red-400" : c.riskCount > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                          {c.riskCount} students
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Class Details and Roster */}
            {selectedClass && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Student Roster */}
                <div className="lg:col-span-2 theme-card p-6">
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h3 className="text-[var(--text-heading)] font-semibold text-sm">📋 Student Roster - {selectedClass.name}</h3>
                      <p className="text-xs text-[var(--text-muted)]">List of students registered in this section.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Roll No</th>
                          <th>Student Name</th>
                          <th>Attendance</th>
                          <th>Avg Grade</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.rollNo}>
                            <td className="font-mono text-xs">{student.rollNo}</td>
                            <td className="font-medium text-[var(--text-heading)]">{student.name}</td>
                            <td>{student.attendance}%</td>
                            <td>{student.grade}%</td>
                            <td>
                              <span className={`badge ${
                                student.status === "Good" ? "badge-green" : student.status === "Average" ? "badge-yellow" : "badge-red"
                              }`}>
                                {student.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Class Stats & Highlights */}
                <div className="theme-card p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[var(--text-heading)] font-semibold text-sm mb-4">🏫 Section Details</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] p-3.5 rounded-xl border border-[var(--border)]">
                        <div className="text-xs text-[var(--text-muted)]">Syllabus Curriculum</div>
                        <div className="text-xs text-[var(--text-heading)] font-semibold mt-1">{selectedClass.syllabus}</div>
                      </div>

                      <div className="bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] p-3.5 rounded-xl border border-[var(--border)]">
                        <div className="text-xs text-[var(--text-muted)]">Active Syllabus Progress</div>
                        <div className="flex items-center justify-between text-xs text-[var(--text-heading)] mt-1 mb-1.5 font-semibold">
                          <span>Term 1 Curriculum</span>
                          <span>68% Complete</span>
                        </div>
                        <div className="progress-bar w-full">
                          <div className="progress-fill" style={{ width: "68%", background: "#f59e0b" }}></div>
                        </div>
                      </div>

                      <div className="bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] p-3.5 rounded-xl border border-[var(--border)]">
                        <div className="text-xs text-[var(--text-muted)]">Homework Submissions Rate</div>
                        <div className="text-xs text-[var(--text-heading)] font-semibold mt-1">{selectedClass.homeworkRate}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-xs text-[var(--text-muted)] italic">
            No student classes found for this school in the PostgreSQL database.
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
