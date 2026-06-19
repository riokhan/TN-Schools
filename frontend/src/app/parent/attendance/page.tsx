"use client";
import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

// Attendance records by month
interface MonthAttendance {
  name: string;
  year: number;
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  daysData: { day: number; status: "present" | "absent" | "late" | "weekend" | "holiday"; remark?: string }[];
}

const attendanceMonths: MonthAttendance[] = [
  {
    name: "June",
    year: 2025,
    totalDays: 20,
    present: 17,
    absent: 2,
    late: 1,
    daysData: [
      { day: 1, status: "weekend" },
      { day: 2, status: "present" },
      { day: 3, status: "present" },
      { day: 4, status: "present" },
      { day: 5, status: "present" },
      { day: 6, status: "present" },
      { day: 7, status: "weekend" },
      { day: 8, status: "weekend" },
      { day: 9, status: "present" },
      { day: 10, status: "absent", remark: "Fever" },
      { day: 11, status: "absent", remark: "Doctor Consultation" },
      { day: 12, status: "present" },
      { day: 13, status: "present" },
      { day: 14, status: "weekend" },
      { day: 15, status: "weekend" },
      { day: 16, status: "present" },
      { day: 17, status: "late", remark: "Heavy school bus traffic delay" },
      { day: 18, status: "present" },
      { day: 19, status: "present" },
      { day: 20, status: "present" },
      { day: 21, status: "weekend" },
      { day: 22, status: "weekend" },
      { day: 23, status: "present" },
      { day: 24, status: "present" },
      { day: 25, status: "present" },
      { day: 26, status: "present" },
      { day: 27, status: "present" },
      { day: 28, status: "weekend" },
      { day: 29, status: "weekend" },
      { day: 30, status: "present" },
    ]
  },
  {
    name: "May",
    year: 2025,
    totalDays: 12,
    present: 11,
    absent: 1,
    late: 0,
    daysData: [
      { day: 1, status: "holiday", remark: "May Day" },
      { day: 2, status: "present" },
      { day: 3, status: "weekend" },
      { day: 4, status: "weekend" },
      { day: 5, status: "present" },
      { day: 6, status: "present" },
      { day: 7, status: "present" },
      { day: 8, status: "present" },
      { day: 9, status: "present" },
      { day: 10, status: "weekend" },
      { day: 11, status: "weekend" },
      { day: 12, status: "present" },
      { day: 13, status: "present" },
      { day: 14, status: "present" },
      { day: 15, status: "present" },
      { day: 16, status: "absent", remark: "Family Wedding" },
      { day: 17, status: "weekend" },
      { day: 18, status: "weekend" },
      { day: 19, status: "holiday", remark: "Summer Vacation Starts" },
      { day: 20, status: "holiday" },
      { day: 21, status: "holiday" },
      { day: 22, status: "holiday" },
      { day: 23, status: "holiday" },
      { day: 24, status: "weekend" },
      { day: 25, status: "weekend" },
      { day: 26, status: "holiday" },
      { day: 27, status: "holiday" },
      { day: 28, status: "holiday" },
      { day: 29, status: "holiday" },
      { day: 30, status: "holiday" },
      { day: 31, status: "weekend" },
    ]
  }
];

interface LeaveRequest {
  id: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "Approved" | "Pending" | "Rejected";
  submittedOn: string;
}

export default function AttendancePage() {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: 101,
      leaveType: "Sick Leave",
      startDate: "2025-06-10",
      endDate: "2025-06-11",
      reason: "High fever and viral cold. Under medication.",
      status: "Approved",
      submittedOn: "2025-06-09"
    },
    {
      id: 102,
      leaveType: "Casual Leave",
      startDate: "2025-05-16",
      endDate: "2025-05-16",
      reason: "Attending maternal uncle's wedding ceremony in Madurai.",
      status: "Approved",
      submittedOn: "2025-05-14"
    }
  ]);

  // Form State
  const [leaveType, setLeaveType] = useState("Sick Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [formFeedback, setFormFeedback] = useState("");

  const activeMonth = attendanceMonths[selectedMonthIndex];

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) {
      setFormFeedback("❌ Please fill out all standard fields.");
      return;
    }

    const newLeave: LeaveRequest = {
      id: Date.now(),
      leaveType,
      startDate,
      endDate,
      reason,
      status: "Pending",
      submittedOn: new Date().toISOString().split("T")[0]
    };

    setLeaveRequests([newLeave, ...leaveRequests]);
    setLeaveType("Sick Leave");
    setStartDate("");
    setEndDate("");
    setReason("");
    setFormFeedback("✅ Leave request submitted successfully to Class Teacher!");
    
    // Clear success message after 4 seconds
    setTimeout(() => setFormFeedback(""), 4000);
  };

  const nextMonth = () => {
    if (selectedMonthIndex > 0) {
      setSelectedMonthIndex(selectedMonthIndex - 1);
    }
  };

  const prevMonth = () => {
    if (selectedMonthIndex < attendanceMonths.length - 1) {
      setSelectedMonthIndex(selectedMonthIndex + 1);
    }
  };

  // Color mappings for calendar days
  const getDayClass = (status: string) => {
    switch (status) {
      case "present":
        return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
      case "absent":
        return "bg-red-500/10 border-red-500/30 text-red-400 font-bold";
      case "late":
        return "bg-amber-500/10 border-amber-500/30 text-amber-400";
      case "weekend":
        return "bg-slate-800/20 border-slate-700/20 text-slate-600";
      case "holiday":
        return "bg-blue-500/10 border-blue-500/25 text-blue-400";
      default:
        return "bg-slate-800/40 border-slate-800 text-slate-400";
    }
  };

  const getDayIcon = (status: string) => {
    switch (status) {
      case "present":
        return "✓";
      case "absent":
        return "✗";
      case "late":
        return "⚠";
      case "holiday":
        return "H";
      default:
        return "";
    }
  };

  // Calculate stats
  const totalWorkingDays = activeMonth.totalDays;
  const attendanceRate = totalWorkingDays > 0 
    ? Math.round((activeMonth.present / totalWorkingDays) * 100) 
    : 0;

  return (
    <PortalLayout
      title="Attendance & Leave Manager"
      subtitle="Track daily attendance details and submit digital leave applications for Priya"
    >
      {/* TODO: Connect with EMIS Attendance API for real-time syncing of student swipe logs */}
      
      {/* KPIs Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in">
        {[
          { label: "Attendance Rate", value: `${attendanceRate}%`, icon: "📅", color: "text-emerald-400", sub: `Target: 85%+` },
          { label: "Days Present", value: `${activeMonth.present} / ${totalWorkingDays}`, icon: "✅", color: "text-blue-400", sub: "Actual working days" },
          { label: "Days Absent", value: activeMonth.absent, icon: "❌", color: "text-red-400", sub: "Requires approval" },
          { label: "Late Attendance", value: activeMonth.late, icon: "⏰", color: "text-amber-400", sub: "Arrived after 8:45 AM" }
        ].map((kpi, i) => (
          <div key={i} className="kpi-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl">{kpi.icon}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">{kpi.sub}</span>
            </div>
            <div className={`text-3xl font-bold ${kpi.color} mb-1`}>{kpi.value}</div>
            <div className="text-xs text-slate-400 font-semibold">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Monthly Attendance Calendar */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 fade-in-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-base font-semibold text-white">🗓️ Attendance Sheet</h2>
                <p className="text-xs text-slate-500">Day-by-day attendance tracking grid</p>
              </div>
              
              {/* Calendar Month Navigation */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={prevMonth} 
                  disabled={selectedMonthIndex === attendanceMonths.length - 1}
                  className="p-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                >
                  ←
                </button>
                <span className="text-xs font-bold text-white w-20 text-center select-none">
                  {activeMonth.name} {activeMonth.year}
                </span>
                <button 
                  onClick={nextMonth} 
                  disabled={selectedMonthIndex === 0}
                  className="p-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                >
                  →
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-7 gap-2.5 mb-6">
              {activeMonth.daysData.map((d) => (
                <div
                  key={d.day}
                  className={`border rounded-xl p-2.5 flex flex-col items-center justify-between min-h-[60px] relative transition-all duration-200 group cursor-default hover:scale-[1.03] ${getDayClass(d.status)}`}
                >
                  <span className="text-[10px] text-slate-400 absolute top-1.5 left-2 font-medium">{d.day}</span>
                  <span className="text-sm font-extrabold mt-3.5">{getDayIcon(d.status)}</span>
                  <span className="text-[8px] opacity-75 font-semibold uppercase">{d.status}</span>
                  
                  {/* Tooltip on hover */}
                  {d.remark && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-40 bg-slate-950 border border-slate-700 text-slate-200 text-[10px] p-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 leading-normal">
                      <strong>Remark:</strong> {d.remark}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Color Legend */}
          <div className="flex flex-wrap gap-4 border-t border-slate-800/80 pt-4 text-[10px] justify-center">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded"></span>
              <span className="text-slate-400">Present</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-red-500/20 border border-red-500/40 rounded"></span>
              <span className="text-slate-400">Absent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-amber-500/20 border border-amber-500/40 rounded"></span>
              <span className="text-slate-400">Late Arrival</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-blue-500/20 border border-blue-500/40 rounded"></span>
              <span className="text-slate-400">Holiday</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-slate-800/20 border border-slate-700/20 rounded"></span>
              <span className="text-slate-400">Weekend</span>
            </div>
          </div>
        </div>

        {/* Leave Request Form */}
        <div className="glass rounded-2xl p-6 fade-in-3">
          <h2 className="text-base font-semibold text-white mb-1">✍️ Apply for Leave</h2>
          <p className="text-xs text-slate-500 mb-4">Direct digital submission to class teacher</p>

          <form onSubmit={handleApplyLeave} className="space-y-4">
            <div>
              <label htmlFor="leave-type" className="block text-xs font-semibold text-slate-400 mb-1.5">Leave Type</label>
              <select
                id="leave-type"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Family Event">Family Event</option>
                <option value="Medical Emergency">Medical Emergency</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="start-date" className="block text-xs font-semibold text-slate-400 mb-1.5">Start Date</label>
                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="end-date" className="block text-xs font-semibold text-slate-400 mb-1.5">End Date</label>
                <input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="leave-reason" className="block text-xs font-semibold text-slate-400 mb-1.5">Reason for Absence</label>
              <textarea
                id="leave-reason"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain the reason clearly..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              id="leave-submit-btn"
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-slate-950 transition-all"
            >
              Submit Application
            </button>

            {formFeedback && (
              <p className="text-xs font-medium mt-2 text-center" id="leave-form-feedback">
                {formFeedback}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Recent Leave Requests */}
      <div className="glass rounded-2xl p-6 fade-in-4">
        <h2 className="text-base font-semibold text-white mb-4">📝 Recent Leave Applications</h2>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference ID</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Submitted On</th>
                <th>Approval Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((req) => (
                <tr key={req.id}>
                  <td className="font-semibold text-xs text-slate-400">#{req.id}</td>
                  <td className="text-xs text-white font-medium">{req.leaveType}</td>
                  <td className="text-xs text-slate-300 font-medium">
                    {req.startDate} to {req.endDate}
                  </td>
                  <td className="text-xs text-slate-400 max-w-sm leading-relaxed">{req.reason}</td>
                  <td className="text-xs text-slate-500">{req.submittedOn}</td>
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
      </div>
    </PortalLayout>
  );
}
