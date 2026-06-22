"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface LeaveRequest {
  id: number;
  type: string;
  duration: string;
  reason: string;
  proxy: string;
  status: "Approved" | "Pending" | "Rejected";
}

export default function LeaveRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([
    { id: 1, type: "Casual Leave", duration: "June 25, 2026 (1 Day)", reason: "Personal family function in Madurai", proxy: "Mrs. Kavitha S. (Tamil)", status: "Approved" },
    { id: 2, type: "Medical Leave", duration: "May 12 - May 14, 2026 (3 Days)", reason: "Severe viral fever", proxy: "Mr. Rajan K. (Science)", status: "Approved" },
  ]);

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
  const [proxy, setProxy] = useState("Mrs. Kavitha S. (Tamil)");
  const [toast, setToast] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !reason) return;

    const durationStr = startDate === endDate || !endDate
      ? `${startDate} (1 Day)`
      : `${startDate} to ${endDate}`;

    const newRequest: LeaveRequest = {
      id: Date.now(),
      type: leaveType,
      duration: durationStr,
      reason,
      proxy,
      status: "Pending",
    };

    setRequests([newRequest, ...requests]);
    setReason("");
    setStartDate("");
    setEndDate("");
    setToast("✓ Leave request submitted successfully! Proxy teacher and Headmaster notified.");
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  return (
    <PortalLayout title="Teacher Leave Management" subtitle="Track leave allowances, request absences, and assign proxy teachers.">
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
                  <div className={`progress-fill bg-gradient-to-r from-amber-500 to-orange-500`} style={{ width: `${pct}%` }} />
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
              <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">Proxy Teacher Assignment</label>
              <select
                value={proxy}
                onChange={(e) => setProxy(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              >
                <option value="Mrs. Kavitha S. (Tamil)">Mrs. Kavitha S. (Tamil)</option>
                <option value="Mr. Rajan K. (Science)">Mr. Rajan K. (Science)</option>
                <option value="Mr. Prakash R. (Social Science)">Mr. Prakash R. (Social Science)</option>
                <option value="Ms. Deepa N. (English)">Ms. Deepa N. (English)</option>
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

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>Period Details</th>
                  <th>Reason</th>
                  <th>Proxy Teacher</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td className="font-bold text-[var(--text-heading)] text-xs">{req.type}</td>
                    <td>{req.duration}</td>
                    <td className="text-[var(--text-muted)] text-xs max-w-[150px] truncate">{req.reason}</td>
                    <td>{req.proxy}</td>
                    <td>
                      <span className={`badge ${
                        req.status === "Approved"
                          ? "badge-green"
                          : req.status === "Pending"
                          ? "badge-yellow"
                          : "badge-red"
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

