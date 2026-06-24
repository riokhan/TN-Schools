"use client";
import { useEffect, useState, useCallback } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useParentChildren, getApiBase, Child } from "@/lib/useParentChildren";

interface Scholarship {
  id: string;
  scheme: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "DISBURSED";
  appliedDate: string;
  approvedDate: string | null;
  disbursedDate: string | null;
  remarks: string | null;
  createdAt: string;
}

const STATUS_META: Record<string, { label: string; cls: string; icon: string }> = {
  PENDING:   { label: "Pending",   cls: "text-amber-400  bg-amber-500/10  border-amber-500/20",  icon: "⏳" },
  APPROVED:  { label: "Approved",  cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: "✅" },
  REJECTED:  { label: "Rejected",  cls: "text-red-400    bg-red-500/10    border-red-500/20",    icon: "❌" },
  DISBURSED: { label: "Disbursed", cls: "text-blue-400   bg-blue-500/10   border-blue-500/20",   icon: "💰" },
};

function ChildSwitcher({ children, active, onChange }: { children: Child[]; active: Child | null; onChange: (c: Child) => void }) {
  if (children.length <= 1) return null;
  return (
    <div className="flex items-center gap-3 mb-5 p-3 glass rounded-2xl flex-wrap">
      <span className="text-xs text-slate-400 font-semibold">👶 Viewing:</span>
      {children.map(c => (
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

export default function ScholarshipPage() {
  const { parentId, children, activeChild, setActiveChild, childrenLoading } = useParentChildren();

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading]           = useState(false);

  const fetchScholarships = useCallback(async (child: Child) => {
    if (!parentId) return;
    setLoading(true);
    try {
      const res  = await fetch(`${getApiBase()}/api/parent/${parentId}/child/${child.studentId}/scholarship`);
      const json = await res.json();
      if (json.success) setScholarships(json.data);
    } catch {/* offline */}
    finally { setLoading(false); }
  }, [parentId]);

  useEffect(() => { if (activeChild) fetchScholarships(activeChild); }, [activeChild, fetchScholarships]);

  const totalAmount    = scholarships.filter(s => s.status === "DISBURSED").reduce((sum, s) => sum + s.amount, 0);
  const approvedAmount = scholarships.filter(s => s.status === "APPROVED" || s.status === "DISBURSED").reduce((sum, s) => sum + s.amount, 0);
  const pending        = scholarships.filter(s => s.status === "PENDING").length;

  const formatINR = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  const fmtDate   = (d: string | null) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <PortalLayout>
      <ChildSwitcher children={children} active={activeChild} onChange={setActiveChild} />

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in">
        {[
          { label: "Total Disbursed", value: formatINR(totalAmount),    icon: "💰", color: "text-emerald-400" },
          { label: "Total Approved",  value: formatINR(approvedAmount), icon: "✅", color: "text-blue-400" },
          { label: "Pending Review",  value: String(pending),           icon: "⏳", color: "text-amber-400" },
          { label: "Total Schemes",   value: String(scholarships.length), icon: "🎓", color: "text-purple-400" },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{k.icon}</span>
            </div>
            {loading || childrenLoading
              ? <div className="h-8 w-24 bg-slate-700 rounded animate-pulse mb-1" />
              : <div className={`text-xl font-bold ${k.color} mb-1 truncate`}>{k.value}</div>
            }
            <div className="text-xs text-slate-500">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Scholarship Cards */}
      <div className="glass rounded-2xl p-6 fade-in-2">
        <h2 className="text-base font-semibold text-white mb-5">🎓 Scholarship Applications</h2>

        {loading ? (
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-36 bg-slate-800 rounded-2xl animate-pulse" />)}</div>
        ) : scholarships.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="text-white font-semibold mb-2">No Scholarship Applications</h3>
            <p className="text-slate-400 text-sm">
              {activeChild ? `${activeChild.name} has no scholarship records yet.` : "Select a child to view scholarship status."}
            </p>
            <div className="mt-4 p-4 bg-slate-800/60 rounded-xl text-left max-w-sm mx-auto">
              <p className="text-xs text-slate-400 font-semibold mb-2">📋 Available Scholarship Schemes:</p>
              {["BC/MBC Scholarship", "SC/ST Scholarship", "Minority Community Scholarship", "Moovalur Ramamirtham Ammaiyar Scholarship"].map(s => (
                <div key={s} className="text-xs text-slate-500 py-1 border-b border-slate-700/50 last:border-0">{s}</div>
              ))}
              <p className="text-xs text-slate-500 mt-2">Contact the school for eligibility & application details.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scholarships.map(s => {
              const meta = STATUS_META[s.status] ?? STATUS_META["PENDING"];
              return (
                <div key={s.id} className={`p-5 rounded-2xl border ${meta.cls}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-base font-bold text-white mb-1">{s.scheme}</div>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${meta.cls}`}>
                        {meta.icon} {meta.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">{formatINR(s.amount)}</div>
                      <div className="text-xs text-slate-500">Amount</div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-1.5 mt-4 border-t border-white/10 pt-3">
                    {[
                      { label: "Applied",   date: s.appliedDate },
                      { label: "Approved",  date: s.approvedDate },
                      { label: "Disbursed", date: s.disbursedDate },
                    ].map(({ label, date }) => (
                      <div key={label} className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">{label}:</span>
                        <span className={date ? "text-slate-200 font-semibold" : "text-slate-600"}>{fmtDate(date)}</span>
                      </div>
                    ))}
                    {s.remarks && (
                      <div className="mt-2 pt-2 border-t border-white/10 text-xs text-slate-400 italic">
                        💬 {s.remarks}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
