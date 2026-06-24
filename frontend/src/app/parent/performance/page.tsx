"use client";
import { useEffect, useState, useCallback } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useParentChildren, getApiBase, Child } from "@/lib/useParentChildren";

interface SubjectMark {
  subject: string;
  [examType: string]: string | number;
}

interface RawMark {
  id: string;
  subject: string;
  examType: string;
  maxMarks: number;
  scored: number;
  grade: string | null;
  academicYear: string;
}

const COLORS = ["#6366f1","#10b981","#f59e0b","#3b82f6","#ec4899","#14b8a6","#f97316","#8b5cf6"];

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

function ScoreBar({ scored, maxMarks, color }: { scored: number; maxMarks: number; color: string }) {
  const pct = Math.round((scored / maxMarks) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold text-slate-300 w-10 text-right">{pct}%</span>
    </div>
  );
}

export default function PerformancePage() {
  const { parentId, children, activeChild, setActiveChild, childrenLoading } = useParentChildren();

  const [subjects, setSubjects]   = useState<SubjectMark[]>([]);
  const [rawMarks, setRawMarks]   = useState<RawMark[]>([]);
  const [years, setYears]         = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [examTypes, setExamTypes] = useState<string[]>([]);
  const [loading, setLoading]     = useState(false);

  const fetchPerformance = useCallback(async (child: Child, year?: string) => {
    if (!parentId) return;
    setLoading(true);
    try {
      const url = `${getApiBase()}/api/parent/${parentId}/child/${child.studentId}/performance${year ? `?academicYear=${year}` : ""}`;
      const res  = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setSubjects(json.data.subjects);
        setRawMarks(json.data.rawMarks);
        setYears(json.data.availableYears);
        if (!year && json.data.availableYears.length > 0) {
          setSelectedYear(json.data.availableYears[json.data.availableYears.length - 1]);
        }
        if (json.data.subjects.length > 0) {
          setExamTypes(Object.keys(json.data.subjects[0]).filter(k => k !== "subject"));
        }
      }
    } catch {/* offline */}
    finally { setLoading(false); }
  }, [parentId]);

  useEffect(() => { if (activeChild) fetchPerformance(activeChild); }, [activeChild, fetchPerformance]);

  const avgPct = rawMarks.length > 0
    ? Math.round(rawMarks.reduce((s, m) => s + (m.scored / m.maxMarks) * 100, 0) / rawMarks.length)
    : 0;
  const topSubject = subjects.reduce((best, s) => {
    const avg = examTypes.reduce((sum, et) => sum + (Number(s[et]) || 0), 0) / (examTypes.length || 1);
    const bestAvg = examTypes.reduce((sum, et) => sum + (Number((best as any)[et]) || 0), 0) / (examTypes.length || 1);
    return avg > bestAvg ? s : best;
  }, subjects[0] ?? {});
  const lowestSubject = subjects.reduce((low, s) => {
    const avg = examTypes.reduce((sum, et) => sum + (Number(s[et]) || 0), 0) / (examTypes.length || 1);
    const lowAvg = examTypes.reduce((sum, et) => sum + (Number((low as any)[et]) || 0), 0) / (examTypes.length || 1);
    return avg < lowAvg ? s : low;
  }, subjects[0] ?? {});

  return (
    <PortalLayout>
      <ChildSwitcher childList={children} active={activeChild} onChange={setActiveChild} />

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in">
        {[
          { label: "Overall Average", value: `${avgPct}%`,      icon: "📊", color: "text-emerald-400" },
          { label: "Grade",           value: avgPct >= 90 ? "A+" : avgPct >= 75 ? "A" : avgPct >= 60 ? "B" : avgPct >= 50 ? "C" : "D",
            icon: "⭐", color: "text-amber-400" },
          { label: "Best Subject",    value: (topSubject as any)?.subject?.split(" ")[0] ?? "—", icon: "🏆", color: "text-blue-400" },
          { label: "Needs Attention", value: (lowestSubject as any)?.subject?.split(" ")[0] ?? "—", icon: "⚠️", color: "text-red-400" },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{k.icon}</span>
            </div>
            {loading || childrenLoading
              ? <div className="h-8 w-20 bg-slate-700 rounded animate-pulse mb-1" />
              : <div className={`text-2xl font-bold ${k.color} mb-1 truncate`}>{k.value}</div>
            }
            <div className="text-xs text-slate-500">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Year Selector */}
      {years.length > 1 && (
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs text-slate-400">Academic Year:</span>
          {years.map(y => (
            <button key={y} onClick={() => { setSelectedYear(y); if (activeChild) fetchPerformance(activeChild, y); }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${selectedYear === y ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>
              {y}
            </button>
          ))}
        </div>
      )}

      {/* Subject Marks Table */}
      <div className="glass rounded-2xl p-6 mb-6 fade-in-2">
        <h2 className="text-base font-semibold text-white mb-5">📋 Subject-wise Mark Sheet</h2>
        {loading ? (
          <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-slate-800 rounded-xl animate-pulse" />)}</div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm">
            No marks recorded yet{activeChild ? ` for ${activeChild.name}` : ""}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-40">Subject</th>
                  {examTypes.map(et => <th key={et}>{et}</th>)}
                  <th>Avg %</th>
                  <th>Progress</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((s, idx) => {
                  const color = COLORS[idx % COLORS.length];
                  const vals = examTypes.map(et => Number(s[et]) || 0);
                  const avg = vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
                  const last = vals[vals.length - 1] ?? 0;
                  const prev = vals[vals.length - 2] ?? last;
                  return (
                    <tr key={s.subject}>
                      <td className="font-semibold text-white" style={{ borderLeft: `3px solid ${color}` }}>
                        <span className="pl-2">{s.subject}</span>
                      </td>
                      {examTypes.map(et => (
                        <td key={et}>
                          <span className={`font-bold ${Number(s[et]) >= 75 ? "text-emerald-400" : Number(s[et]) >= 50 ? "text-amber-400" : "text-red-400"}`}>
                            {s[et] ?? "—"}
                          </span>
                        </td>
                      ))}
                      <td className="font-bold text-blue-400">{avg}%</td>
                      <td className="w-32"><ScoreBar scored={avg} maxMarks={100} color={color} /></td>
                      <td>
                        <span className={`badge ${last >= prev ? "badge-green" : "badge-red"}`}>
                          {last >= prev ? "↑ Up" : "↓ Down"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detailed Raw Marks */}
      {rawMarks.length > 0 && (
        <div className="glass rounded-2xl p-6 fade-in-4">
          <h2 className="text-base font-semibold text-white mb-4">📝 Detailed Mark Records</h2>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Subject</th><th>Exam Type</th><th>Scored</th><th>Max</th><th>%</th><th>Grade</th><th>Year</th></tr>
              </thead>
              <tbody>
                {rawMarks.map(m => {
                  const pct = Math.round((m.scored / m.maxMarks) * 100);
                  return (
                    <tr key={m.id}>
                      <td className="font-medium text-white">{m.subject}</td>
                      <td><span className="badge badge-blue">{m.examType}</span></td>
                      <td className="font-bold text-emerald-400">{m.scored}</td>
                      <td className="text-slate-400">{m.maxMarks}</td>
                      <td className={`font-bold ${pct >= 75 ? "text-emerald-400" : pct >= 50 ? "text-amber-400" : "text-red-400"}`}>{pct}%</td>
                      <td><span className="badge badge-green">{m.grade ?? "—"}</span></td>
                      <td className="text-slate-400 text-xs">{m.academicYear}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
