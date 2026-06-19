"use client";
import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";


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

const initialRiskStudents: AtRiskStudent[] = [
  { id: "risk-1", name: "Murugan S.", className: "10B", riskLevel: "high", issue: "3 consecutive absences + Homework submission < 60%", attendance: 78, lastScore: 52, parentName: "Selvam S." },
  { id: "risk-2", name: "Kavitha R.", className: "10A", riskLevel: "medium", issue: "Failed last unit test + Homework submission rate is 48%", attendance: 85, lastScore: 48, parentName: "Ramesh R." },
  { id: "risk-3", name: "Senthil K.", className: "10B", riskLevel: "high", issue: "Declined score in last 3 weeks + Math average is 41%", attendance: 82, lastScore: 41, parentName: "Kuppusamy K." },
  { id: "risk-4", name: "Deepa M.", className: "9A", riskLevel: "medium", issue: "High score drop (-20%) in algebra and trigonometry", attendance: 88, lastScore: 58, parentName: "Mani M." },
];

export default function RiskAlertsPage() {
  const [students, setStudents] = useState<AtRiskStudent[]>(initialRiskStudents);
  const [selectedStudentId, setSelectedStudentId] = useState("risk-1");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Intervention UI State
  const [remedialText, setRemedialText] = useState<string | null>(null);
  const [parentDraft, setParentDraft] = useState<string | null>(null);
  const [peerTutor, setPeerTutor] = useState<string | null>(null);

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const handleGenerateRemedial = () => {
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
    setRemedialText(null);
    setPeerTutor(null);
    setParentDraft(
      `Dear ${selectedStudent.parentName},\n\n` +
      `This is Sumathi Devi, Mathematics teacher of ${selectedStudent.name} at GHS Coimbatore. ` +
      `I am writing to discuss ${selectedStudent.name}'s recent performance in class. ` +
      `Currently, ${selectedStudent.name} has a score of ${selectedStudent.lastScore}% and an attendance rate of ${selectedStudent.attendance}%. ` +
      `We noticed some difficulties with: "${selectedStudent.issue}".\n\n` +
      `We have assigned some remedial resources for home study. I would appreciate if we could connect briefly to support their progress. Please let me know your availability.\n\n` +
      `Best regards,\nSumathi Devi`
    );
  };

  const handleAssignPeer = () => {
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

  const handleResolveAlert = (id: string) => {
    setStudents(students.filter((s) => s.id !== id));
    setToastMessage("Risk alert marked as resolved!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <PortalLayout
      title="Risk Alerts"
      subtitle="Early-warning indicators identifying students requiring urgent academic support"
    >
      {toastMessage && (
        <div className="fixed top-5 right-5 bg-emerald-500 text-[var(--text-heading)] text-xs font-bold px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2">
          <span>âœ…</span> {toastMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Metrics list */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] p-4 rounded-xl border border-[var(--border)]">
            <h3 className="text-[var(--text-heading)] font-semibold text-xs uppercase tracking-wider">âš ï¸ Flagged Students</h3>
            <span className="badge badge-red">{students.length} Alerts</span>
          </div>

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
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Section: {st.className} Â· Parent: {st.parentName}</p>
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
                ðŸŽ‰ Great job! No students are currently flagged for academic risk.
              </div>
            )}
          </div>
        </div>

        {/* AI intervention workspace */}
        {selectedStudent && students.length > 0 && (
          <div className="lg:col-span-2 theme-card p-6 border border-[var(--border)] flex flex-col justify-between min-h-[480px]">
            <div>
              <div className="flex justify-between items-start border-b border-[var(--border)] pb-4 mb-5">
                <div>
                  <h3 className="text-[var(--text-heading)] font-bold text-base leading-snug">ðŸ›¡ï¸ Intervention Workspace</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Design academic countermeasures for {selectedStudent.name}</p>
                </div>
                <button
                  onClick={() => handleResolveAlert(selectedStudent.id)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 transition-all"
                >
                  âœ“ Resolve Alert
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  onClick={handleGenerateRemedial}
                  className="py-3 px-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] hover:bg-[var(--bg-card)] hover:border-[var(--border)] text-xs font-semibold text-[var(--text-heading)] transition-all text-center flex flex-col items-center gap-1.5"
                >
                  <span className="text-lg">ðŸ“„</span>
                  <span>Remedial Tasks</span>
                </button>
                <button
                  onClick={handleDraftParent}
                  className="py-3 px-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] hover:bg-[var(--bg-card)] hover:border-[var(--border)] text-xs font-semibold text-[var(--text-heading)] transition-all text-center flex flex-col items-center gap-1.5"
                >
                  <span className="text-lg">âœ‰ï¸</span>
                  <span>Parent Update</span>
                </button>
                <button
                  onClick={handleAssignPeer}
                  className="py-3 px-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] hover:bg-[var(--bg-card)] hover:border-[var(--border)] text-xs font-semibold text-[var(--text-heading)] transition-all text-center flex flex-col items-center gap-1.5"
                >
                  <span className="text-lg">ðŸ‘¥</span>
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
                      <div className="text-xs text-amber-400 font-bold font-mono">Bilingual Message Draft (Formal Tone)</div>
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
                <span className="text-xl">ðŸ’¡</span>
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

