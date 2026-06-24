"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PortalLayout from "@/components/PortalLayout";
import Swal from "sweetalert2";

interface AttendanceStudent {
  id: string;
  name: string;
  rollNo: string;
  status: "Present" | "Absent" | "Late";
}

export default function AttendancePage() {
  const { data: session } = useSession();
  const schoolId = (session?.user as any)?.schoolId;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [selectedClass, setSelectedClass] = useState("10A");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<AttendanceStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const fetchStudents = async () => {
    if (!schoolId) return;
    try {
      setLoading(true);
      // parse class and section
      const clsNum = selectedClass.replace(/\D/g, "");
      const secLetter = selectedClass.replace(/\d/g, "").toUpperCase();

      const res = await fetch(`${API_URL}/api/students?schoolId=${schoolId}&class=${clsNum}&section=${secLetter}`);
      const result = await res.json();
      if (result.success && result.data) {
        const studentList = result.data.map((s: any, idx: number) => ({
          id: s.id,
          name: s.user?.name || `Student ${idx + 1}`,
          rollNo: s.rollNumber || `${clsNum}${secLetter}${String(idx + 1).padStart(2, '0')}`,
          status: "Present" as const, // default
        }));
        setStudents(studentList);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error("Error loading students:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [schoolId, selectedClass]);

  const handleStatusChange = (id: string, newStatus: AttendanceStudent["status"]) => {
    setStudents(
      students.map((student) =>
        student.id === id ? { ...student, status: newStatus } : student
      )
    );
  };

  const markAllPresent = () => {
    setStudents(students.map((student) => ({ ...student, status: "Present" })));
  };

  const handleSaveAttendance = async () => {
    if (students.length === 0 || !schoolId) return;

    const presentCount = students.filter((s) => s.status === "Present").length;
    const absentCount = students.filter((s) => s.status === "Absent").length;
    const lateCount = students.filter((s) => s.status === "Late").length;
    const attendancePercentage = Math.round((presentCount / students.length) * 100);

    const records = students.map((s) => ({
      studentId: s.id,
      schoolId: schoolId,
      date: new Date(selectedDate),
      status: s.status.toUpperCase(), // PRESENT, ABSENT, LATE
      method: "Manual",
    }));

    try {
      const res = await fetch(`${API_URL}/api/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records }),
      });
      const result = await res.json();
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Attendance Saved!",
          text: `Attendance for Class ${selectedClass} on ${selectedDate} has been saved! Present: ${presentCount}, Absent: ${absentCount}, Late: ${lateCount} (${attendancePercentage}%). Parent notifications dispatched.`,
          confirmButtonColor: "#10b981",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error Saving",
          text: result.error || "Failed to save attendance record.",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (err) {
      console.error("Error saving attendance:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected network error occurred.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const presentCount = students.filter((s) => s.status === "Present").length;
  const absentCount = students.filter((s) => s.status === "Absent").length;
  const lateCount = students.filter((s) => s.status === "Late").length;
  const attendanceRate = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0;

  return (
    <PortalLayout title="Daily Attendance Tracker" subtitle="Mark student attendance and dispatch instant parental absence alerts.">
      {/* Top Filter and Actions Row */}
      <div className="theme-card p-5 mb-6 border border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4 fade-in">
        <div className="flex gap-4 items-center w-full md:w-auto">
          <div>
            <label className="block text-[10px] text-[var(--text-muted)] font-extrabold uppercase mb-1">Class Section</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)] transition-colors"
            >
              <option value="10A">Class 10A</option>
              <option value="9B">Class 9B</option>
              <option value="8A">Class 8A</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-[var(--text-muted)] font-extrabold uppercase mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-3 py-1.5 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto justify-end">
          <button
            onClick={markAllPresent}
            className="px-4 py-2 bg-[var(--bg-card)] hover:bg-slate-700 border border-[var(--border)] text-[var(--text-heading)] text-xs font-semibold rounded-xl transition-colors"
          >
            Mark All Present
          </button>
          <button
            onClick={handleSaveAttendance}
            className="px-4 py-2 bg-[var(--primary)] hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-colors"
          >
            💾 Save Attendance Sheet
          </button>
        </div>
      </div>

      {/* Realtime Attendance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Students", value: students.length, color: "text-[var(--text-heading)]", icon: "👥" },
          { label: "Present Today", value: presentCount, color: "text-emerald-400", icon: "🟢" },
          { label: "Absent Today", value: absentCount, color: "text-red-400", icon: "🔴" },
          { label: "Attendance Rate", value: `${attendanceRate}%`, color: "text-amber-400", icon: "📈" },
        ].map((stat, i) => (
          <div key={i} className="bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] rounded-xl p-4 border border-[var(--border)] text-center">
            <span className="text-xl block mb-1">{stat.icon}</span>
            <div className={`text-2xl font-black ${stat.color} mb-0.5`}>{stat.value}</div>
            <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Roster Table */}
      <div className="theme-card p-6 border border-[var(--border)]">
        <h2 className="text-base font-semibold text-[var(--text-heading)] mb-5">📋 Roster Checklist</h2>

        {toast && (
          <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl leading-relaxed">
            {toast}
          </div>
        )}

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-xs text-[var(--text-muted)]">Loading roster checklist...</div>
          ) : students.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th className="text-center">Present</th>
                  <th className="text-center">Absent</th>
                  <th className="text-center">Late</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="text-[var(--text-muted)] font-bold text-xs">{student.rollNo}</td>
                    <td className="font-medium text-[var(--text-heading)]">{student.name}</td>
                    <td className="text-center">
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        checked={student.status === "Present"}
                        onChange={() => handleStatusChange(student.id, "Present")}
                        className="accent-emerald-500 scale-125 cursor-pointer"
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        checked={student.status === "Absent"}
                        onChange={() => handleStatusChange(student.id, "Absent")}
                        className="accent-red-500 scale-125 cursor-pointer"
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        checked={student.status === "Late"}
                        onChange={() => handleStatusChange(student.id, "Late")}
                        className="accent-amber-500 scale-125 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-xs text-[var(--text-muted)] italic">
              No students found in Class {selectedClass} for this school.
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
