"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface ScholarshipRecord {
  id: string;
  name: string;
  class: string;
  scheme: string;
  status: "Approved" | "Pending Bank Info" | "Applied" | "Needs Verification";
  amount: number;
}

export default function ScholarshipsPage() {
  const [records, setRecords] = useState<ScholarshipRecord[]>([
    { id: "S01", name: "Priya Murugan", class: "10A", scheme: "Pudhumai Penn Scheme", status: "Approved", amount: 1000 },
    { id: "S02", name: "Arun V.", class: "10A", scheme: "Tamil Puthalvan Scheme", status: "Needs Verification", amount: 1000 },
    { id: "S03", name: "Deepika R.", class: "9B", scheme: "NMMS Merit Scholarship", status: "Pending Bank Info", amount: 500 },
    { id: "S04", name: "Karthik S.", class: "8A", scheme: "Free Cycle Scheme", status: "Approved", amount: 0 },
    { id: "S05", name: "Suresh P.", class: "10A", scheme: "Tamil Puthalvan Scheme", status: "Applied", amount: 1000 },
  ]);

  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleVerify = (id: string) => {
    setVerifyingId(id);
    setTimeout(() => {
      setRecords(
        records.map((rec) =>
          rec.id === id ? { ...rec, status: "Approved" } : rec
        )
      );
      const studentName = records.find((rec) => rec.id === id)?.name;
      setVerifyingId(null);
      setToastMessage(`âœ“ ${studentName}'s EMIS profile and Bank Details successfully verified! Status updated to Approved.`);
      setTimeout(() => {
        setToastMessage(null);
      }, 4000);
    }, 1500);
  };

  return (
    <PortalLayout title="Scholarship & Govt Schemes" subtitle="Verify candidate records and monitor disbursal statuses.">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in">
        {[
          { label: "Eligible Students", value: "32", icon: "ðŸ‘¨â€ðŸŽ“", color: "text-amber-400", sub: "Across all classes" },
          { label: "Approved Grants", value: "24", icon: "âœ…", color: "text-emerald-400", sub: "Disbursals active" },
          { label: "Action Needed", value: "8", icon: "âš ï¸", color: "text-red-400", sub: "Pending verifications" },
          { label: "Fund Value Rate", value: "â‚¹24,000", icon: "ðŸ’°", color: "text-cyan-400", sub: "Estimated Monthly" },
        ].map((kpi) => (
          <div key={kpi.label} className="kpi-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{kpi.icon}</span>
              <span className={`text-[10px] font-bold ${kpi.color}`}>{kpi.sub}</span>
            </div>
            <div className={`text-2xl font-extrabold ${kpi.color} mb-1`}>{kpi.value}</div>
            <div className="text-xs text-[var(--text-muted)] font-semibold">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Main content table */}
      <div className="theme-card p-6 border border-[var(--border)] mb-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-base font-semibold text-[var(--text-heading)]">ðŸ“‹ Scheme Applicants & Verifications</h2>
          <button className="px-3.5 py-1.5 bg-[var(--bg-card)] hover:bg-slate-700 text-[var(--text-heading)] rounded-lg text-xs font-semibold transition-colors">
            Export Roster Details
          </button>
        </div>

        {toastMessage && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl">
            {toastMessage}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Class</th>
                <th>Government Scheme</th>
                <th>Disbursal Amount</th>
                <th>EMIS Verification Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec) => (
                <tr key={rec.id}>
                  <td className="font-medium text-[var(--text-heading)]">{rec.name}</td>
                  <td>{rec.class}</td>
                  <td>
                    <span className="text-[var(--text-main)] font-semibold text-xs">{rec.scheme}</span>
                  </td>
                  <td>
                    <span className="text-[var(--text-heading)] font-semibold text-xs">
                      {rec.amount > 0 ? `â‚¹${rec.amount}/mo` : "Material Distribution"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      rec.status === "Approved"
                        ? "badge-green"
                        : rec.status === "Needs Verification"
                        ? "badge-red"
                        : rec.status === "Pending Bank Info"
                        ? "badge-yellow"
                        : "badge-blue"
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                  <td>
                    {rec.status === "Needs Verification" || rec.status === "Pending Bank Info" ? (
                      <button
                        onClick={() => handleVerify(rec.id)}
                        disabled={verifyingId === rec.id}
                        className="px-2.5 py-1 bg-[var(--primary)] hover:bg-amber-600 disabled:bg-[var(--bg-card)] disabled:text-[var(--text-muted)] text-slate-950 font-bold rounded-lg text-[10px] transition-colors"
                      >
                        {verifyingId === rec.id ? "Checking EMIS..." : "Verify EMIS"}
                      </button>
                    ) : (
                      <span className="text-[10px] text-[var(--text-muted)] italic">Verified âœ“</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guidelines details */}
      <div className="theme-card p-6 border border-[var(--border)]">
        <h2 className="text-base font-semibold text-[var(--text-heading)] mb-3 font-semibold">ðŸ›ï¸ Tamil Nadu Government Scheme Notes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-[var(--text-muted)]">
          <div className="p-4 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] rounded-xl border border-[var(--border)]">
            <h4 className="text-sm font-bold text-[var(--text-heading)] mb-1">Pudhumai Penn Scheme</h4>
            <p className="leading-relaxed">Eligible for all girl students who studied classes 6-12 in govt schools, providing â‚¹1,000/month upon entering higher education.</p>
          </div>
          <div className="p-4 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] rounded-xl border border-[var(--border)]">
            <h4 className="text-sm font-bold text-[var(--text-heading)] mb-1">Tamil Puthalvan Scheme</h4>
            <p className="leading-relaxed">Financial assistance of â‚¹1,000/month for boy students from government schools enrolling in higher education courses.</p>
          </div>
          <div className="p-4 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] rounded-xl border border-[var(--border)]">
            <h4 className="text-sm font-bold text-[var(--text-heading)] mb-1">NMMS Scholarship</h4>
            <p className="leading-relaxed">National Means-cum-Merit Scholarship providing financial help of â‚¹6,000/annum for selected students from Class 9.</p>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

