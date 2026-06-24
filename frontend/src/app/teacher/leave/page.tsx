"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PortalLayout from "@/components/PortalLayout";

interface LeaveRequest {
  id: string;
  type: string;
  duration: string;
  reason: string;
  studentName: string;
  status: "Approved" | "Pending" | "Rejected";
}

interface Staff {
  id: string;
  name: string;
  subject: string;
}

export default function LeaveRequestsPage() {
  const { data: session } = useSession();
  const schoolId = (session?.user as any)?.schoolId;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  const [quotas, setQuotas] = useState([
    { label: "Casual Leave", remaining: 4, total: 12, color: "text-amber-400" },
    { label: "Medical Leave", remaining: 8, total: 15, color: "text-blue-400" },
    { label: "Earned Leave", remaining: 18, total: 20, color: "text-emerald-400" },
  ]);

  // Form State
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [studentName, setStudentName] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Leave Requests
        const leaveRes = await fetch(`${API_URL}/api/teacher/leave${schoolId ? `?schoolId=${schoolId}` : ""}`);
        const leaveData = await leaveRes.json();
        if (leaveData.success && leaveData.data) {
          setRequests(leaveData.data);
          
          // Calculate remaining quotas based on approved requests
          let casualCount = 0;
          let medicalCount = 0;
          let earnedCount = 0;

          leaveData.data.forEach((r: LeaveRequest) => {
            if (r.status === "Approved") {
              const daysMatch = r.duration.match(/(\d+)\s*Day/i);
              const days = daysMatch ? parseInt(daysMatch[1]) : 1;
              if (r.type === "Casual Leave") casualCount += days;
              if (r.type === "Medical Leave") medicalCount += days;
              if (r.type === "Earned Leave") earnedCount += days;
            }
          });

          setQuotas([
            { label: "Casual Leave", remaining: Math.max(0, 12 - casualCount), total: 12, color: "text-amber-400" },
            { label: "Medical Leave", remaining: Math.max(0, 15 - medicalCount), total: 15, color: "text-blue-400" },
            { label: "Earned Leave", remaining: Math.max(0, 20 - earnedCount), total: 20, color: "text-emerald-400" },
          ]);
        }

        // Fetch Students for Leave Selection
        const studentRes = await fetch(`${API_URL}/api/students${schoolId ? `?schoolId=${schoolId}` : ""}`);
        const studentData = await studentRes.json();
        if (studentData.success && studentData.data) {
          const mappedStudents = studentData.data.map((s: any) => ({
            id: s.id,
            name: s.user?.name || "Unknown Student",
            subject: `Class ${s.class}${s.section}`
          }));
          setStaffList(mappedStudents);
          if (mappedStudents.length > 0) {
            setStudentName(`${mappedStudents[0].name} (${mappedStudents[0].subject})`);
          } else {
            setStudentName("Select Student");
          }
        }
      } catch (err) {
        console.error("Error loading leave page data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [schoolId, API_URL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !reason) return;

    const durationStr = startDate === endDate || !endDate
      ? `${startDate} (1 Day)`
      : `${startDate} to ${endDate}`;

    try {
      const res = await fetch(`${API_URL}/api/teacher/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: leaveType,
          duration: durationStr,
          reason,
          studentName,
          schoolId,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setRequests([data.data, ...requests]);
        setReason("");
        setStartDate("");
        setEndDate("");
        setToast("✓ Leave request submitted successfully! Parent and Headmaster notified.");
        setTimeout(() => {
          setToast(null);
        }, 4500);
      }
    } catch (err) {
      console.error("Error submitting leave request", err);
    }
  };

  return (
    <PortalLayout title="Student Leave Management" subtitle="Track and request absences for students in your school.">
      {/* Leave Quota Allowances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 fade-in">
        {quotas.map((q) => {
          const pct = Math.round((q.remaining / q.total) * 100);
          return (
            <div key={q.label} className="bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] rounded-2xl p-5 border border-[var(--border)] flex flex-col justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-[var(--text-muted)] tracking-wider">{q.label}</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className={`text-3xl font-black ${q.color}`}>{q.remaining}</span>
                  <span className="text-[var(--text-muted)] text-xs font-semibold">/ {q.total} Days Left</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="progress-bar">
                  <div className="progress-fill bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
                  <span>Used: {q.total - q.remaining} days</span>
                  <span>{pct}% Remaining</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Leave application form */}
        <div className="theme-card p-6 border border-[var(--border)] h-fit">
          <h2 className="text-base font-semibold text-[var(--text-heading)] mb-4">📄 Request Leave</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">Leave Category</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              >
                <option value="Casual Leave">Casual Leave</option>
                <option value="Medical Leave">Medical Leave</option>
                <option value="Earned Leave">Earned Leave</option>
                <option value="Duty Leave (OD)">Duty Leave (OD)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">Start Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-3 py-1.5 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-3 py-1.5 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">Student Name</label>
              <select
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              >
                {staffList.length > 0 ? (
                  staffList.map((st) => (
                    <option key={st.id} value={`${st.name} (${st.subject})`}>
                      {st.name} ({st.subject})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Select Student">No students found</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">Reason for Absence</label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain the reason briefly..."
                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[var(--primary)] hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
            >
              Submit Leave Request
            </button>
          </form>
        </div>

        {/* History Panel */}
        <div className="lg:col-span-2 theme-card p-6 border border-[var(--border)] space-y-5">
          <h2 className="text-base font-semibold text-[var(--text-heading)]">📋 Previous Request History</h2>

          {toast && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl">
              {toast}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8 text-xs text-[var(--text-muted)]">Loading leave history...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8 text-xs text-[var(--text-muted)]">No leave requests found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Leave Type</th>
                    <th>Period Details</th>
                    <th>Reason</th>
                    <th>Student Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id}>
                      <td className="font-bold text-[var(--text-heading)] text-xs">{req.type}</td>
                      <td>{req.duration}</td>
                      <td className="text-[var(--text-muted)] text-xs max-w-[150px] truncate">{req.reason}</td>
                      <td>{req.studentName}</td>
                      <td>
                        <span
                          className={`badge ${
                            req.status === "Approved"
                              ? "badge-green"
                              : req.status === "Pending"
                              ? "badge-yellow"
                              : "badge-red"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}

