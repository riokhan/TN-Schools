"use client";
import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";


interface Assignment {
  id: string;
  title: string;
  className: string;
  dueDate: string;
  submittedCount: number;
  totalStudents: number;
  status: "active" | "draft" | "completed";
  description: string;
}

const initialAssignments: Assignment[] = [
  { id: "hw-1", title: "Pythagoras Theorem - Practice Set 1", className: "10A - Mathematics", dueDate: "June 22, 2026", submittedCount: 36, totalStudents: 42, status: "active", description: "Solve textbook problems 1 to 5 on Page 44. Show steps for full marks." },
  { id: "hw-2", title: "Introduction to Trigonometric Ratios", className: "10B - Mathematics", dueDate: "June 24, 2026", submittedCount: 18, totalStudents: 40, status: "active", description: "Define Sin, Cos and Tan ratios. Calculate hypotenuse lengths on given worksheet." },
  { id: "hw-3", title: "Quadratic Equations Diagnostic quiz", className: "10A - Mathematics", dueDate: "June 15, 2026", submittedCount: 42, totalStudents: 42, status: "completed", description: "Diagnostic assessment on quadratic formula application." },
  { id: "hw-4", title: "Algebraic identities draft homework", className: "9A - Mathematics", dueDate: "June 28, 2026", submittedCount: 0, totalStudents: 45, status: "draft", description: "Simplify linear and quadratic identity forms." }
];

const mockSubmissions = [
  { rollNo: "10A01", name: "Aarthi V.", status: "submitted", score: "9/10", date: "Today, 8:40 AM" },
  { rollNo: "10A02", name: "Balaji R.", status: "submitted", score: "7/10", date: "Yesterday, 3:15 PM" },
  { rollNo: "10A03", name: "Kavitha R.", status: "pending", score: "â€”", date: "â€”" },
  { rollNo: "10A04", name: "Manoj K.", status: "submitted", score: "10/10", date: "Today, 9:02 AM" },
  { rollNo: "10A05", name: "Priya S.", status: "submitted", score: "8/10", date: "Yesterday, 6:00 PM" },
  { rollNo: "10A06", name: "Rajesh M.", status: "pending", score: "â€”", date: "â€”" },
];

export default function HomeworkPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [activeTab, setActiveTab] = useState<"active" | "draft" | "completed">("active");
  const [selectedHwId, setSelectedHwId] = useState("hw-1");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Homework Form State
  const [newTitle, setNewTitle] = useState("");
  const [newClass, setNewClass] = useState("10A - Mathematics");
  const [newDueDate, setNewDueDate] = useState("June 25, 2026");
  const [newDesc, setNewDesc] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const activeAssignments = assignments.filter((a) => a.status === activeTab);
  const selectedHw = assignments.find((a) => a.id === selectedHwId) || assignments[0];

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newHw: Assignment = {
      id: `hw-${assignments.length + 1}`,
      title: newTitle,
      className: newClass,
      dueDate: newDueDate,
      submittedCount: 0,
      totalStudents: 40,
      status: "active",
      description: newDesc,
    };

    setAssignments([newHw, ...assignments]);
    setSelectedHwId(newHw.id);
    setShowCreateModal(false);
    setNewTitle("");
    setNewDesc("");
    setToastMessage(`New assignment "${newTitle}" assigned successfully!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const triggerAIRecipes = () => {
    if (!newTitle.trim()) {
      alert("Please enter a homework title/topic first.");
      return;
    }
    setIsGeneratingAI(true);
    setTimeout(() => {
      setNewDesc(
        `AI Generated Homework Prompt:\n1) In a right triangle, verify if sides (5cm, 12cm, 13cm) follow Pythagoras formula.\n2) If the diagonal of a rectangle is 25cm and the width is 7cm, find the length.\n3) Explain in your own words why hypotenuse is always the longest side.`
      );
      setIsGeneratingAI(false);
    }, 1000);
  };

  const handleSendReminder = () => {
    setToastMessage(`Push alerts and WhatsApp reminders sent to parents of pending students in ${selectedHw.className}!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <PortalLayout
      title="Homework Manager"
      subtitle="Track submissions, send automated parent reminders, and generate AI homework exercises"
    >
      {toastMessage && (
        <div className="fixed top-5 right-5 bg-emerald-500 text-[var(--text-heading)] text-xs font-bold px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2">
          <span>âœ…</span> {toastMessage}
        </div>
      )}

      <div className="flex flex-col gap-6">
        {/* Header Toolbar */}
        <div className="flex justify-between items-center bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] p-4 rounded-2xl border border-[var(--border)]">
          <div className="flex bg-[var(--bg-main)] border border-[var(--border)] rounded-lg p-0.5">
            {(["active", "draft", "completed"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  // Auto-switch selected homework to avoid stale view
                  const firstHwOfTab = assignments.find((a) => a.status === tab);
                  if (firstHwOfTab) setSelectedHwId(firstHwOfTab.id);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  activeTab === tab ? "bg-[var(--primary)] text-[var(--text-heading)]" : "text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-heading)] bg-[var(--primary)] hover:bg-amber-600 transition-colors"
          >
            âž• Create Assignment
          </button>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Homework Cards List */}
          <div className="space-y-4">
            <h3 className="text-[var(--text-heading)] font-semibold text-xs uppercase tracking-wider mb-1">
              ðŸ“ Assignments ({activeAssignments.length})
            </h3>
            
            {activeAssignments.map((hw) => {
              const isSelected = hw.id === selectedHwId;
              const percent = Math.round((hw.submittedCount / hw.totalStudents) * 100) || 0;
              return (
                <div
                  key={hw.id}
                  onClick={() => setSelectedHwId(hw.id)}
                  className={`theme-card p-4 border text-left cursor-pointer transition-all hover:scale-[1.01] ${
                    isSelected ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)] hover:border-[var(--border)]"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-[var(--text-heading)] font-bold text-xs truncate max-w-[180px]">{hw.title}</h4>
                    <span className="text-[10px] text-slate-550">{hw.dueDate}</span>
                  </div>

                  <div className="text-[10px] text-[var(--text-muted)]">{hw.className}</div>
                  
                  {hw.status !== "draft" && (
                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between items-center text-[9px] text-[var(--text-muted)]">
                        <span>Submissions Progress</span>
                        <span className="font-semibold text-[var(--text-heading)]">{hw.submittedCount}/{hw.totalStudents} ({percent}%)</span>
                      </div>
                      <div className="progress-bar w-full">
                        <div className="progress-fill" style={{ width: `${percent}%`, background: "#f59e0b" }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {activeAssignments.length === 0 && (
              <div className="theme-card p-8 border border-dashed border-[var(--border)] text-center text-xs text-[var(--text-muted)]">
                No assignments found in this status category.
              </div>
            )}
          </div>

          {/* Detailed Assignment Submissions Panel */}
          {selectedHw && (
            <div className="lg:col-span-2 space-y-6">
              {/* Info panel */}
              <div className="theme-card p-6 border border-[var(--border)]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-[var(--text-heading)] font-bold text-base leading-snug">{selectedHw.title}</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{selectedHw.className} Â· Due on {selectedHw.dueDate}</p>
                  </div>
                  
                  {selectedHw.status === "active" && (
                    <button
                      onClick={handleSendReminder}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-amber-400 border border-[var(--primary)]/20 hover:bg-[var(--primary)]/10 transition-all flex items-center gap-1.5"
                    >
                      <span>ðŸ””</span> Send Parent Reminders
                    </button>
                  )}
                </div>

                <div className="p-4 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border)] rounded-xl text-xs text-slate-350 leading-relaxed">
                  <span className="font-semibold text-[var(--text-heading)] block mb-1">Homework Guidelines:</span>
                  {selectedHw.description}
                </div>
              </div>

              {/* Roster & submissions checklist */}
              {selectedHw.status !== "draft" && (
                <div className="theme-card p-6 border border-[var(--border)]">
                  <h3 className="text-[var(--text-heading)] font-semibold text-xs uppercase tracking-wider mb-4">
                    ðŸ“‹ Submission Roster
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Roll No</th>
                          <th>Student Name</th>
                          <th>Status</th>
                          <th>Turned In</th>
                          <th>Score</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockSubmissions.map((sub) => (
                          <tr key={sub.rollNo}>
                            <td className="font-mono text-xs">{sub.rollNo}</td>
                            <td className="font-medium text-[var(--text-heading)]">{sub.name}</td>
                            <td>
                              <span className={`badge ${sub.status === "submitted" ? "badge-green" : "badge-yellow"}`}>
                                {sub.status}
                              </span>
                            </td>
                            <td>{sub.date}</td>
                            <td className="font-bold font-mono text-[var(--text-heading)]">{sub.score}</td>
                            <td>
                              {sub.status === "submitted" ? (
                                <button className="text-xs text-amber-400 hover:underline">Grade Sheet</button>
                              ) : (
                                <button className="text-xs text-[var(--text-muted)] hover:text-[var(--text-heading)]">Poke Parent</button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Homework Dialog */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="theme-card w-full max-w-lg border border-[var(--border)] overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-[var(--border)] flex justify-between items-center">
              <h3 className="text-[var(--text-heading)] font-semibold text-base">âž• Assign Homework</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-550 hover:text-[var(--text-heading)] text-lg">âœ•</button>
            </div>

            <form onSubmit={handleCreateHomework} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">Homework Topic / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pythagoras Theorem Homework 1"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-heading)] placeholder-slate-650 focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">Class Section</label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)]"
                  >
                    <option>10A - Mathematics</option>
                    <option>10B - Mathematics</option>
                    <option>9A - Mathematics</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">Due Date</label>
                  <input
                    type="text"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Assignment Content / Prompts</label>
                  <button
                    type="button"
                    onClick={triggerAIRecipes}
                    disabled={isGeneratingAI}
                    className="text-[10px] text-amber-400 hover:text-amber-350 flex items-center gap-1 font-semibold"
                  >
                    <span>âš¡</span> {isGeneratingAI ? "Drafting..." : "Draft Homework with AI"}
                  </button>
                </div>

                <textarea
                  required
                  placeholder="Enter questions or guidelines for students..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl p-3 text-xs text-[var(--text-heading)] placeholder-slate-650 focus:outline-none focus:border-[var(--primary)] min-h-[120px]"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-slate-850"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-amber-600 text-xs font-semibold text-[var(--text-heading)]"
                >
                  Assign to Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}

