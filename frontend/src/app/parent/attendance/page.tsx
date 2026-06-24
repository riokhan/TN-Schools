"use client";
import { useEffect, useState, useCallback } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useParentChildren, getApiBase, Child } from "@/lib/useParentChildren";

interface MonthData {
  month: string;
  total: number;
  present: number;
  late: number;
  absent: number;
  leave: number;
  percentage: number;
}

interface DayRecord {
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "LEAVE";
  method: string | null;
}

const STATUS_STYLE: Record<string, { label: string; cls: string; dot: string }> = {
  PRESENT: { label: "Present",  cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-400" },
  LATE:    { label: "Late",     cls: "text-amber-400   bg-amber-500/10   border-amber-500/20",   dot: "bg-amber-400"   },
  ABSENT:  { label: "Absent",   cls: "text-red-400     bg-red-500/10     border-red-500/20",     dot: "bg-red-400"     },
  LEAVE:   { label: "Leave",    cls: "text-blue-400    bg-blue-500/10    border-blue-500/20",    dot: "bg-blue-400"    },
};

function ChildSwitcher({ childList, active, onChange }: { childList: Child[]; active: Child | null; onChange: (c: Child) => void }) {
  if (childList.length <= 1) return null;
  return (
    <div className="flex items-center gap-3 mb-5 p-3 glass rounded-2xl flex-wrap">
      <span className="text-xs text-slate-400 font-semibold">👶 Viewing:</span>
      {childList.map(c => (
        <button key={c.studentId} onClick={() => onChange(c)}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            active?.studentId === c.studentId ? "bg-emerald-600 text-white shadow-md" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}>
          {c.name.split(" ")[0]} · Class {c.class}{c.section}
        </button>
      ))}
    </div>
  );
}

export default function AttendancePage() {
  const { parentId, children, activeChild, setActiveChild, childrenLoading } = useParentChildren();

  const [monthly, setMonthly]   = useState<MonthData[]>([]);
  const [recent, setRecent]     = useState<DayRecord[]>([]);
  const [loading, setLoading]   = useState(false);

  const fetchAttendance = useCallback(async (child: Child) => {
    if (!parentId) return;
    setLoading(true);
    try {
      const res  = await fetch(`${getApiBase()}/api/parent/${parentId}/child/${child.studentId}/attendance`);
      const json = await res.json();
      if (json.success) {
        setMonthly(json.data.monthly);
        setRecent(json.data.recentRecords);
      }
    } catch {/* offline */}
    finally { setLoading(false); }
  }, [parentId]);

  useEffect(() => { if (activeChild) fetchAttendance(activeChild); }, [activeChild, fetchAttendance]);

  const currentMonth = monthly[monthly.length - 1];
  const totalPresent = monthly.reduce((s, m) => s + m.present + m.late, 0);
  const totalDays    = monthly.reduce((s, m) => s + m.total, 0);
  const overallPct   = totalDays > 0 ? Math.round((totalPresent / totalDays) * 100) : 0;

  return (
    <PortalLayout>
      <ChildSwitcher childList={children} active={activeChild} onChange={setActiveChild} />

      {/* Header KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in">
        {[
          { label: "This Month",    value: currentMonth ? `${currentMonth.percentage}%` : "—", icon: "📅", color: "text-emerald-400", sub: currentMonth?.month ?? "" },
          { label: "Present Days",  value: currentMonth ? String(currentMonth.present) : "—",  icon: "✅", color: "text-green-400",   sub: "This month" },
          { label: "Absent Days",   value: currentMonth ? String(currentMonth.absent)  : "—",  icon: "❌", color: "text-red-400",     sub: "This month" },
          { label: "Overall (6M)",  value: `${overallPct}%`,                                    icon: "📊", color: "text-blue-400",   sub: "Last 6 months" },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{k.icon}</span>
              <span className={`text-xs font-medium ${k.color}`}>{k.sub}</span>
            </div>
            {loading || childrenLoading
              ? <div className="h-8 w-16 bg-slate-700 rounded animate-pulse mb-1" />
              : <div className={`text-3xl font-bold ${k.color} mb-1`}>{k.value}</div>
            }
            <div className="text-xs text-slate-500">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* 6-Month Bar Chart */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 fade-in-2">
          <h2 className="text-base font-semibold text-white mb-5">📊 Monthly Attendance (Last 6 Months)</h2>
          {loading ? (
            <div className="space-y-3">{[1,2,3,4,5,6].map(i => <div key={i} className="h-12 bg-slate-800 rounded-xl animate-pulse" />)}</div>
          ) : monthly.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">No attendance records found.</div>
          ) : (
            <div className="space-y-3">
              {monthly.map(m => (
                <div key={m.month} className="flex items-center gap-4">
                  <div className="w-24 text-xs text-slate-400 font-medium shrink-0">{m.month}</div>
                  <div className="flex-1 relative h-8 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${m.percentage}%`,
                        background: m.percentage >= 90
                          ? "linear-gradient(90deg, #10b981, #059669)"
                          : m.percentage >= 75
                          ? "linear-gradient(90deg, #f59e0b, #d97706)"
                          : "linear-gradient(90deg, #ef4444, #dc2626)",
                      }}
                    />
                  </div>
                  <div className={`w-12 text-right text-sm font-bold ${
                    m.percentage >= 90 ? "text-emerald-400" : m.percentage >= 75 ? "text-amber-400" : "text-red-400"
                  }`}>{m.percentage}%</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Breakdown */}
        <div className="glass rounded-2xl p-6 fade-in-3">
          <h2 className="text-base font-semibold text-white mb-4">📋 This Month Breakdown</h2>
          {loading ? (
            <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-14 bg-slate-800 rounded-xl animate-pulse" />)}</div>
          ) : currentMonth ? (
            <div className="space-y-3">
              {(["PRESENT","LATE","ABSENT","LEAVE"] as const).map(s => {
                const style = STATUS_STYLE[s];
                const count = s === "PRESENT" ? currentMonth.present
                            : s === "LATE" ? currentMonth.late
                            : s === "ABSENT" ? currentMonth.absent
                            : currentMonth.leave;
                const pct = currentMonth.total > 0 ? Math.round((count / currentMonth.total) * 100) : 0;
                return (
                  <div key={s} className={`p-3 rounded-xl border flex items-center justify-between ${style.cls}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                      <span className="text-sm font-semibold">{style.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{count}</div>
                      <div className="text-xs opacity-70">{pct}%</div>
                    </div>
                  </div>
                );
              })}
              <div className="text-center text-xs text-slate-500 pt-2">Total school days: {currentMonth.total}</div>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500 text-sm">No data available.</div>
          )}
        </div>
      </div>

      {/* Recent Daily Log */}
      <div className="glass rounded-2xl p-6 fade-in-4">
        <h2 className="text-base font-semibold text-white mb-4">📝 Recent Attendance Log (This Month)</h2>
        {loading ? (
          <div className="space-y-2">{[1,2,3,4,5].map(i => <div key={i} className="h-10 bg-slate-800 rounded-xl animate-pulse" />)}</div>
        ) : recent.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-sm">No records for this month yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Date</th><th>Status</th><th>Method</th></tr>
              </thead>
              <tbody>
                {recent.map((r, i) => {
                  const style = STATUS_STYLE[r.status] ?? STATUS_STYLE["PRESENT"];
                  return (
                    <tr key={i}>
                      <td className="font-medium text-white">
                        {new Date(r.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                      </td>
                      <td>
                        <span className={`badge px-2.5 py-0.5 rounded-full text-xs font-bold border ${style.cls}`}>
                          {style.label}
                        </span>
                      </td>
                      <td className="text-slate-400">{r.method ?? "Manual"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
