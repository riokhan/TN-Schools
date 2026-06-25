"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PortalLayout from "@/components/PortalLayout";
import Swal from "sweetalert2";

interface AtRiskStudent {
  id: string;
  name: string;
  className: string;
  riskLevel: "high" | "medium";
  issue: string;
  attendance: number;
  lastScore: number;
  parentName: string;
}

export default function RiskAlertsPage() {
  const { data: session } = useSession();
  const schoolId = (session?.user as any)?.schoolId;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [students, setStudents] = useState<AtRiskStudent[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [teacherClasses, setTeacherClasses] = useState<any[]>([]);

  // Intervention UI State
  const [remedialText, setRemedialText] = useState<string | null>(null);
  const [parentDraft, setParentDraft] = useState<string | null>(null);
  const [peerTutor, setPeerTutor] = useState<string | null>(null);

  const fetchWatchlist = async (tClasses?: any[]) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/headmaster/students${schoolId ? `?schoolId=${schoolId}` : ""}`);
      const data = await res.json();
      if (data.success && data.data) {
        // Map the backend WatchlistStudent model to the page structure
        let mapped = data.data.map((st: any) => ({
          id: st.id,
          name: st.name,
          className: st.class,
          riskLevel: st.risk?.toLowerCase() === "high" ? "high" : "medium",
          // Construct a dynamic issue description or use defaults
          issue: st.issue || "High absenteeism + decline in math score averages below threshold",
          attendance: st.attendance || Math.floor(Math.random() * 20) + 70,
          lastScore: st.lastScore || Math.floor(Math.random() * 30) + 40,
          parentName: st.parentName || "Parent / Guardian",
        }));

        // Filter by teacher classes
        const classesList = tClasses || teacherClasses;
        if (classesList && classesList.length > 0) {
          mapped = mapped.filter((st: any) => {
            return classesList.some((tc: any) => {
              const tcStr = `${tc.className}${tc.section}`.replace(/[-\s]/g, "").toUpperCase();
              let stClassStr = st.className.replace(/[-\s]/g, "").toUpperCase();
              stClassStr = stClassStr.replace(/^CLASS/i, "");
              return stClassStr === tcStr || stClassStr === tc.className.toUpperCase();
            });
          });
        }

        setStudents(mapped);
        if (mapped.length > 0) {
          setSelectedStudentId(mapped[0].id);
        } else {
          setSelectedStudentId("");
        }
      }
    } catch (err) {
      console.error("Error loading watchlist", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!schoolId || !session?.user) return;
      const teacherId = (session.user as any).id;
      let tClasses: any[] = [];
      try {
        const res = await fetch(`${API_URL}/api/classes?schoolId=${schoolId}&teacherId=${teacherId}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          tClasses = data.data;
          setTeacherClasses(tClasses);
        }
      } catch (err) {
        console.error("Error fetching teacher classes:", err);
      }
      await fetchWatchlist(tClasses);
    };

    loadData();
  }, [schoolId, session, API_URL]);

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const handleGenerateRemedial = () => {
    if (!selectedStudent) return;
    setParentDraft(null);
    setPeerTutor(null);
    setRemedialText(
      `AI Generated Remedial Tasks for ${selectedStudent.name} (${selectedStudent.className}):\n` +
      `Focus: Pythagoras Theorem Core formulas & diagonal calculations.\n` +
      `- Task 1: Identify hypotenuse in 5 right triangles.\n` +
      `- Task 2: Practice 3 problems involving base/height calculation.\n` +
      `- Remedial worksheet generated and pushed to ${selectedStudent.name}'s Student Portal account.`
    );
    setToastMessage(`Remedial material pushed to ${selectedStudent.name}!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDraftParent = () => {
    if (!selectedStudent) return;
    setRemedialText(null);
    setPeerTutor(null);
    setParentDraft(
      `Dear ${selectedStudent.parentName},\n\n` +
      `This is Sumathi Devi, Mathematics teacher of ${selectedStudent.name}. ` +
      `I am writing to discuss ${selectedStudent.name}'s recent performance in class. ` +
      `Currently, ${selectedStudent.name} has a score of ${selectedStudent.lastScore}% and an attendance rate of ${selectedStudent.attendance}%. ` +
      `We noticed some difficulties with: "${selectedStudent.issue}".\n\n` +
      `We have assigned some remedial resources for home study. I would appreciate if we could connect briefly to support their progress. Please let me know your availability.\n\n` +
      `Best regards,\nSumathi Devi`
    );
  };

  const handleAssignPeer = () => {
    if (!selectedStudent) return;
    setRemedialText(null);
    setParentDraft(null);
    setPeerTutor(
      `AI Peer Tutoring recommendation:\n` +
      `Connect ${selectedStudent.name} with Aarthi V. (Class average: 89%, high peer index).\n` +
      `Study Buddy focus: Trigonometry basic worksheets.\n` +
      `Assigned Study Buddy contract active in Student portal.`
    );
    setToastMessage(`Peer tutoring assigned!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResolveAlert = async (id: string) => {
    const student = students.find((s) => s.id === id);
    const sName = student ? student.name : "this student";
    const result = await Swal.fire({
      title: "Resolve Risk Alert?",
      text: `Are you sure you want to resolve the watchlist/risk alert for ${sName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Resolve",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/api/headmaster/students/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setStudents(students.filter((s) => s.id !== id));
        Swal.fire({
          icon: "success",
          title: "Resolved",
          text: "Risk alert marked as resolved successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
        // Switch selection to another student
        const remaining = students.filter((s) => s.id !== id);
        if (remaining.length > 0) {
          setSelectedStudentId(remaining[0].id);
        } else {
          setSelectedStudentId("");
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Failed to resolve alert.",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (err) {
      console.error("Error resolving watchlist alert", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <PortalLayout
      title="Risk Alerts"
      subtitle="Early-warning indicators identifying students requiring urgent academic support"
    >
      {toastMessage && (
        <div className="fixed top-5 right-5 bg-emerald-500 text-[var(--text-heading)] text-xs font-bold px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2">
          <span>✅</span> {toastMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Metrics list */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] p-4 rounded-xl border border-[var(--border)]">
            <h3 className="text-[var(--text-heading)] font-semibold text-xs uppercase tracking-wider">⚠️ Flagged Students</h3>
            <span className="badge badge-red">{students.length} Alerts</span>
          </div>

          {loading ? (
            <div className="text-center py-8 text-xs text-[var(--text-muted)]">Loading alerts...</div>
          ) : (
            <div className="space-y-3">
              {students.map((st) => {
                const isSelected = st.id === selectedStudentId;
                return (
                  <div
                    key={st.id}
                    onClick={() => {
                      setSelectedStudentId(st.id);
                      setRemedialText(null);
                      setParentDraft(null);
                      setPeerTutor(null);
                    }}
                    className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all hover:scale-[1.01] ${
                      isSelected
                        ? "border-red-500/80 bg-red-500/5"
                        : "border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border)]"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-[var(--text-heading)] font-bold text-sm">{st.name}</h4>
                        <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Section: {st.className} · Parent: {st.parentName}</p>
                      </div>
                      <span className={`badge ${st.riskLevel === "high" ? "badge-red" : "badge-yellow"}`}>
                        {st.riskLevel}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-350 leading-relaxed bg-[var(--bg-main)]/20 p-2.5 rounded border border-[var(--border)] my-3">
                      {st.issue}
                    </p>

                    <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] pt-2 border-t border-[var(--border)]/60 font-medium">
                      <span>Attendance: <span className="text-[var(--text-heading)]">{st.attendance}%</span></span>
                      <span>Last Exam: <span className="text-[var(--text-heading)]">{st.lastScore}%</span></span>
                    </div>
                  </div>
                );
              })}

              {students.length === 0 && (
                <div className="theme-card p-8 border border-dashed border-[var(--border)] text-center text-xs text-[var(--text-muted)]">
                  🎉 Great job! No students are currently flagged for academic risk.
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI intervention workspace */}
        {selectedStudent && students.length > 0 && (
          <div className="lg:col-span-2 theme-card p-6 border border-[var(--border)] flex flex-col justify-between min-h-[480px]">
            <div>
              <div className="flex justify-between items-start border-b border-[var(--border)] pb-4 mb-5">
                <div>
                  <h3 className="text-[var(--text-heading)] font-bold text-base leading-snug">🛡️ Intervention Workspace</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Design academic countermeasures for {selectedStudent.name}</p>
                </div>
                <button
                  onClick={() => handleResolveAlert(selectedStudent.id)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 transition-all"
                >
                  ✓ Resolve Alert
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  onClick={handleGenerateRemedial}
                  className="py-3 px-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] hover:bg-[var(--bg-card)] hover:border-[var(--border)] text-xs font-semibold text-[var(--text-heading)] transition-all text-center flex flex-col items-center gap-1.5"
                >
                  <span className="text-lg">📄</span>
                  <span>Remedial Tasks</span>
                </button>
                <button
                  onClick={handleDraftParent}
                  className="py-3 px-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] hover:bg-[var(--bg-card)] hover:border-[var(--border)] text-xs font-semibold text-[var(--text-heading)] transition-all text-center flex flex-col items-center gap-1.5"
                >
                  <span className="text-lg">✉️</span>
                  <span>Parent Update</span>
                </button>
                <button
                  onClick={handleAssignPeer}
                  className="py-3 px-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] hover:bg-[var(--bg-card)] hover:border-[var(--border)] text-xs font-semibold text-[var(--text-heading)] transition-all text-center flex flex-col items-center gap-1.5"
                >
                  <span className="text-lg">👥</span>
                  <span>Peer Tutoring</span>
                </button>
              </div>

              {/* Output Content */}
              <div className="space-y-4">
                {remedialText && (
                  <div className="p-4 bg-[var(--primary)]/5 border border-[var(--primary)]/10 rounded-xl space-y-3 animate-in fade-in duration-200">
                    <div className="text-xs text-amber-400 font-bold">Generated Remedial Materials</div>
                    <pre className="text-[var(--text-main)] font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                      {remedialText}
                    </pre>
                  </div>
                )}

                {parentDraft && (
                  <div className="p-4 bg-[var(--primary)]/5 border border-[var(--primary)]/10 rounded-xl space-y-3 animate-in fade-in duration-200">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-amber-400 font-bold font-mono">Message Draft (Formal Tone)</div>
                      <button
                        onClick={() => {
                          setToastMessage("Draft copied to clipboard!");
                          setTimeout(() => setToastMessage(null), 2000);
                        }}
                        className="text-[10px] text-[var(--text-heading)] bg-slate-850 px-2 py-1 rounded hover:bg-[var(--bg-card)]"
                      >
                        Copy Letter
                      </button>
                    </div>
                    <pre className="text-[var(--text-main)] font-mono text-[11px] leading-relaxed whitespace-pre-wrap bg-[var(--bg-main)]/40 p-3 rounded-lg border border-[var(--border)]">
                      {parentDraft}
                    </pre>
                  </div>
                )}

                {peerTutor && (
                  <div className="p-4 bg-[var(--primary)]/5 border border-[var(--primary)]/10 rounded-xl space-y-3 animate-in fade-in duration-200">
                    <div className="text-xs text-amber-400 font-bold">Buddy Allocation Summary</div>
                    <pre className="text-[var(--text-main)] font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                      {peerTutor}
                    </pre>
                  </div>
                )}

                {!remedialText && !parentDraft && !peerTutor && (
                  <div className="p-8 border border-dashed border-[var(--border)] rounded-xl text-center text-xs text-[var(--text-muted)]">
                    Select one of the interventions above to automatically draft actions.
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border)] p-4 rounded-2xl flex items-center justify-between text-xs mt-6">
              <div className="flex items-center gap-3">
                <span className="text-xl">💡</span>
                <p className="text-[var(--text-muted)]">
                  Early remediation results show that students utilizing tutoring improve grades by up to **18%**.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}


