"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PortalLayout from "@/components/PortalLayout";
import Swal from "sweetalert2";

const syllabusOptions = ["TN State Board (Samacheer Kalvi)", "CBSE", "ICSE"];
const grades = ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const subjects = ["Mathematics", "Science", "Social Science", "English", "Tamil"];

const steps = [
  "Fetching TN School Syllabus guidelines...",
  "Framing learning objectives (LO) and cognitive levels...",
  "Structuring pedagogical activities (Hook, Core, Evaluation)...",
  "Translating complex definitions for bilingual students...",
  "Finalizing evaluation materials and exit tickets...",
];

interface LessonPlan {
  id: string;
  syllabus: string;
  grade: string;
  subject: string;
  topic: string;
  duration: string;
  planData: {
    objectives: string[];
    timeline: { time: string; activity: string; description: string }[];
    bilingual: { english: string; tamil: string; pronunciation: string }[];
    exitTickets: { question: string; options: string[]; answer: string; rationale: string }[];
  };
}

export default function LessonPlannerPage() {
  const { data: session } = useSession();
  const schoolId = (session?.user as any)?.schoolId;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [syllabus, setSyllabus] = useState(syllabusOptions[0]);
  const [grade, setGrade] = useState(grades[4]); // Grade 10
  const [subject, setSubject] = useState(subjects[0]); // Maths
  const [topic, setTopic] = useState("Pythagoras Theorem & Trigonometry");
  const [duration, setDuration] = useState("45 Minutes");

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState<"outline" | "bilingual" | "assessment">("outline");

  // DB-driven lesson plans state
  const [savedPlans, setSavedPlans] = useState<LessonPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<LessonPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Fetch saved plans on mount / schoolId update
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/teacher/lessons${schoolId ? `?schoolId=${schoolId}` : ""}`);
        const data = await res.json();
        if (data.success && data.data) {
          // Parse JSON if needed (Express/Prisma maps JSON type automatically)
          setSavedPlans(data.data);
          if (data.data.length > 0) {
            setCurrentPlan(data.data[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching lesson plans", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [schoolId, API_URL]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setIsGenerating(false);
            
            // Create a mock generated plan object
            const mockGenerated: Omit<LessonPlan, "id"> = {
              syllabus,
              grade,
              subject,
              topic,
              duration,
              planData: {
                objectives: [
                  `Understand the core concept of ${topic} aligned to ${syllabus}.`,
                  `Identify variables and verify statements in real-world scenarios.`,
                  `Apply solving techniques in curriculum exam problems.`,
                ],
                timeline: [
                  { time: "00-05 Mins", activity: "The Hook (Introduction)", description: `Draw a contextual scenario for ${topic} on the board. Engage student curiosity.` },
                  { time: "05-25 Mins", activity: "Core Instruction & Theory", description: `Present key definitions and break down standard examples. Walk through formulas.` },
                  { time: "25-40 Mins", activity: "Guided Pair Practice", description: "Distribute short exercises. Pair students to collaborate on solutions." },
                  { time: "40-45 Mins", activity: "Exit Ticket Check", description: "Collect individual answers to exit ticket MCQs for visual feedback." },
                ],
                bilingual: [
                  { english: "Right-Angled Triangle", tamil: "செங்கோண முக்கோணம்", pronunciation: "Sengoana Mukkoanam" },
                  { english: "Hypotenuse", tamil: "கர்ணம்", pronunciation: "Karnam" },
                  { english: "Theorem / Proof", tamil: "தேற்றம் / நிரூபணம்", pronunciation: "Thetram / Niroobanam" },
                  { english: "Perpendicular", tamil: "செங்குத்து", pronunciation: "Sengkuthu" },
                ],
                exitTickets: [
                  {
                    question: `Which of the following describes the key relationship for ${topic}?`,
                    options: ["A) a + b = c", "B) a² + b² = c²", "C) a * b = c", "D) None of the above"],
                    answer: "B) a² + b² = c²",
                    rationale: "Standard mathematical relationship represented by Pythagoras theorem.",
                  },
                  {
                    question: `In a right triangle, if base = 3 cm and height = 4 cm, the hypotenuse is:`,
                    options: ["A) 5 cm", "B) 7 cm", "C) 12 cm", "D) 6 cm"],
                    answer: "A) 5 cm",
                    rationale: "Using the theorem: 3² + 4² = 9 + 16 = 25. Sqrt(25) = 5 cm.",
                  }
                ]
              }
            };
            
            // Put it into currentPlan state (with a temp ID, so they can hit save to write to PostgreSQL)
            setCurrentPlan({
              id: "temp-unsaved",
              ...mockGenerated
            });
            return 0;
          }
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isGenerating, syllabus, grade, subject, topic, duration]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setIsGenerating(true);
    setCurrentPlan(null);
    setCurrentStep(0);
  };

  const handleSave = async () => {
    if (!currentPlan) return;
    try {
      setSaveStatus("Saving...");
      const res = await fetch(`${API_URL}/api/teacher/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          syllabus: currentPlan.syllabus,
          grade: currentPlan.grade,
          subject: currentPlan.subject,
          topic: currentPlan.topic,
          duration: currentPlan.duration,
          planData: currentPlan.planData,
          schoolId,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSavedPlans([data.data, ...savedPlans.filter((p) => p.id !== "temp-unsaved")]);
        setCurrentPlan(data.data);
        setSaveStatus("Saved successfully!");
        Swal.fire({
          icon: "success",
          title: "Saved!",
          text: "Lesson plan saved successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Save Failed",
          text: data.error || "Failed to save lesson plan.",
          confirmButtonColor: "#ef4444",
        });
        setSaveStatus("Error saving.");
      }
    } catch (err) {
      console.error("Error saving lesson plan", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred while saving.",
        confirmButtonColor: "#ef4444",
      });
      setSaveStatus("Error saving.");
    }
  };

  const handleDelete = async (id: string) => {
    if (id === "temp-unsaved") {
      setCurrentPlan(null);
      return;
    }

    const result = await Swal.fire({
      title: "Delete Lesson Plan?",
      text: "Are you sure you want to permanently delete this lesson plan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/api/teacher/lessons/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        const filtered = savedPlans.filter((p) => p.id !== id);
        setSavedPlans(filtered);
        if (currentPlan?.id === id) {
          setCurrentPlan(filtered.length > 0 ? filtered[0] : null);
        }
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Lesson plan has been deleted.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Failed to delete lesson plan.",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (err) {
      console.error("Error deleting lesson plan", err);
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
      title="AI Lesson Planner"
      subtitle="Generate interactive syllabus-aligned lesson plans in seconds"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Input Form & History */}
        <div className="space-y-6">
          <div className="theme-card p-6 h-fit">
            <h2 className="text-[var(--text-heading)] font-semibold text-sm mb-4">📋 Configure Lesson Plan</h2>
            
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">Syllabus Standard</label>
                <select
                  value={syllabus}
                  onChange={(e) => setSyllabus(e.target.value)}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)]"
                >
                  {syllabusOptions.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">Grade / Class</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)]"
                  >
                    {grades.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)]"
                  >
                    {subjects.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">Topic / Chapter</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Newton's Laws of Motion"
                  className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-heading)] placeholder-slate-600 focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)]"
                >
                  <option>30 Minutes</option>
                  <option>45 Minutes</option>
                  <option>60 Minutes</option>
                  <option>90 Minutes</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full mt-2 py-3 rounded-xl bg-[var(--primary)] hover:bg-amber-600 disabled:bg-amber-800 text-xs font-bold text-white transition-colors flex items-center justify-center gap-2"
              >
                {isGenerating ? "Generating..." : "⚡ Generate AI Lesson Plan"}
              </button>
            </form>
          </div>

          {/* History / Saved Plans List */}
          <div className="theme-card p-6 h-fit space-y-4">
            <h2 className="text-[var(--text-heading)] font-semibold text-sm">📁 Saved Lesson Plans</h2>
            {loading ? (
              <div className="text-xs text-[var(--text-muted)]">Loading plans...</div>
            ) : savedPlans.length === 0 ? (
              <div className="text-xs text-[var(--text-muted)]">No lesson plans saved yet.</div>
            ) : (
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                {savedPlans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setCurrentPlan(plan)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${
                      currentPlan?.id === plan.id
                        ? "border-[var(--primary)] bg-[var(--primary)]/5"
                        : "border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--primary)]"
                    }`}
                  >
                    <div className="truncate">
                      <span className="font-semibold text-[var(--text-heading)] block truncate">{plan.topic}</span>
                      <span className="text-[10px] text-[var(--text-muted)]">{plan.grade} · {plan.subject}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(plan.id);
                      }}
                      className="text-red-500 hover:text-red-400 font-bold px-1 text-[11px]"
                      title="Delete plan"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Results Area */}
        <div className="lg:col-span-2 flex flex-col min-h-[450px]">
          {/* Initial State */}
          {!isGenerating && !currentPlan && (
            <div className="theme-card p-8 flex-1 flex flex-col items-center justify-center text-center border border-dashed border-[var(--border)]">
              <span className="text-4xl mb-4">📋</span>
              <h3 className="text-[var(--text-heading)] font-semibold text-sm">No Plan Selected</h3>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mt-1">
                Configure your grade, subject, and chapter standards, then trigger the AI engine to generate a comprehensive lesson planner outline, or load a saved plan from your history.
              </p>
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="theme-card p-8 flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full border-4 border-[var(--primary)]/20 border-t-amber-500 animate-spin mb-6" />
              <h3 className="text-[var(--text-heading)] font-semibold text-sm mb-2">AI Planner Synthesizing</h3>
              
              <div className="space-y-2 w-full max-w-xs mt-3">
                {steps.map((stepText, idx) => {
                  let status = "text-slate-600";
                  if (idx < currentStep) status = "text-emerald-400 font-medium";
                  else if (idx === currentStep) status = "text-amber-400 font-semibold animate-pulse";
                  return (
                    <div key={idx} className={`text-xs text-left flex items-start gap-2 ${status}`}>
                      <span>{idx < currentStep ? "✅" : idx === currentStep ? "⏳" : "○"}</span>
                      <span>{stepText}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Result Plan Panel */}
          {currentPlan && !isGenerating && (
            <div className="theme-card overflow-hidden border border-[var(--border)] flex-1 flex flex-col">
              {/* Header Info */}
              <div className="p-6 border-b border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] flex justify-between items-start gap-4">
                <div>
                  <span className="badge badge-yellow mb-2">{currentPlan.grade} · {currentPlan.subject}</span>
                  <h3 className="text-[var(--text-heading)] font-bold text-base leading-snug">{currentPlan.topic}</h3>
                  <p className="text-xs text-slate-550 mt-1">{currentPlan.syllabus} · Standard Curriculum</p>
                </div>
                <div className="flex gap-2 items-center">
                  {saveStatus && <span className="text-[10px] text-amber-500 font-semibold">{saveStatus}</span>}
                  {currentPlan.id === "temp-unsaved" ? (
                    <button
                      onClick={handleSave}
                      className="px-3 py-1.5 rounded-lg bg-[var(--primary)] hover:bg-amber-600 text-xs font-bold text-white shadow-none"
                    >
                      💾 Save Lesson Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDelete(currentPlan.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-950/30 text-red-400 border border-red-500/20 text-xs font-semibold hover:bg-red-950/50"
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Tabs Menu */}
              <div className="flex border-b border-[var(--border)] px-6 bg-[var(--bg-main)]/20">
                {(["outline", "bilingual", "assessment"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 px-4 text-xs font-semibold border-b-2 capitalize transition-all ${
                      activeTab === tab
                        ? "border-[var(--primary)] text-amber-550"
                        : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                    }`}
                  >
                    {tab === "outline" ? "🗺️ Lesson Outline" : tab === "bilingual" ? "🌐 Bilingual Glossary" : "✍️ Exit Tickets"}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="p-6 overflow-y-auto flex-1 max-h-[400px]">
                {activeTab === "outline" && (
                  <div className="space-y-5 text-xs text-[var(--text-main)]">
                    <div>
                      <h4 className="text-[var(--text-heading)] font-semibold text-xs mb-1.5">🎯 Core Objectives</h4>
                      <ul className="list-disc list-inside space-y-1 text-[var(--text-muted)]">
                        {currentPlan.planData?.objectives?.map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </div>

                    <hr className="border-[var(--border)]" />

                    <div>
                      <h4 className="text-[var(--text-heading)] font-semibold text-xs mb-3">⏰ Timeline & Flow ({currentPlan.duration})</h4>
                      <div className="space-y-3">
                        {currentPlan.planData?.timeline?.map((item, i) => (
                          <div key={i} className="flex gap-4">
                            <span className="font-mono text-amber-400 font-bold w-14 flex-shrink-0">{item.time}</span>
                            <div>
                              <span className="text-[var(--text-heading)] font-semibold block">{item.activity}</span>
                              <span className="text-[var(--text-muted)]">{item.description}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "bilingual" && (
                  <div className="space-y-4 text-xs">
                    <div className="bg-[var(--primary)]/5 p-3 rounded-xl border border-amber-550/15 mb-4">
                      <p className="text-amber-400 font-medium leading-relaxed">
                        📢 **Teacher Tip**: Use these Tamil equivalent terms in lecture transitions to assist students from regional media backgrounds.
                      </p>
                    </div>

                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>English Term</th>
                          <th>Tamil Equivalent</th>
                          <th>Phonetic / Pronunciation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPlan.planData?.bilingual?.map((item, i) => (
                          <tr key={i}>
                            <td className="font-semibold text-[var(--text-heading)]">{item.english}</td>
                            <td className="text-amber-400 font-semibold font-tamil">{item.tamil}</td>
                            <td>{item.pronunciation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === "assessment" && (
                  <div className="space-y-4 text-xs text-slate-350">
                    <h4 className="text-[var(--text-heading)] font-semibold text-xs mb-2">🎯 Exit Ticket MCQs & Answers</h4>

                    <div className="space-y-3.5">
                      {currentPlan.planData?.exitTickets?.map((ticket, i) => (
                        <div key={i} className="p-3.5 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] rounded-xl border border-[var(--border)]">
                          <div className="font-semibold text-[var(--text-heading)]">Question {i + 1}: {ticket.question}</div>
                          <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px] text-[var(--text-muted)]">
                            {ticket.options?.map((opt, oIdx) => (
                              <div key={oIdx}>{opt}</div>
                            ))}
                          </div>
                          <div className="mt-2 text-emerald-400 font-semibold text-[11px]">
                            Correct Answer: {ticket.answer}. Explanation: {ticket.rationale}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}

