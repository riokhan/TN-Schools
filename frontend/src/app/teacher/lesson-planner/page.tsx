"use client";
import { useState, useEffect } from "react";
import PortalLayout from "@/components/PortalLayout";



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

export default function LessonPlannerPage() {
  const [syllabus, setSyllabus] = useState(syllabusOptions[0]);
  const [grade, setGrade] = useState(grades[4]); // Grade 10
  const [subject, setSubject] = useState(subjects[0]); // Maths
  const [topic, setTopic] = useState("Pythagoras Theorem & Trigonometry");
  const [duration, setDuration] = useState("45 Minutes");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPlan, setShowPlan] = useState(false);
  const [activeTab, setActiveTab] = useState<"outline" | "bilingual" | "assessment">("outline");

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
            setShowPlan(true);
            return 0;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setIsGenerating(true);
    setShowPlan(false);
    setCurrentStep(0);
  };

  return (
    <PortalLayout
      title="AI Lesson Planner"
      subtitle="Generate interactive syllabus-aligned lesson plans in seconds"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Input Form */}
        <div className="theme-card p-6 h-fit">
          <h2 className="text-[var(--text-heading)] font-semibold text-sm mb-4">ðŸ“‹ Configure Lesson Plan</h2>
          
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
              className="w-full mt-2 py-3 rounded-xl bg-[var(--primary)] hover:bg-amber-600 disabled:bg-amber-800 text-xs font-semibold text-[var(--text-heading)] transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? "Generating..." : "âš¡ Generate AI Lesson Plan"}
            </button>
          </form>
        </div>

        {/* Right Column - Results Area */}
        <div className="lg:col-span-2 flex flex-col min-h-[450px]">
          {/* Initial State */}
          {!isGenerating && !showPlan && (
            <div className="theme-card p-8 flex-1 flex flex-col items-center justify-center text-center border border-dashed border-[var(--border)]">
              <span className="text-4xl mb-4">ðŸ“‹</span>
              <h3 className="text-[var(--text-heading)] font-semibold text-sm">No Plan Generated</h3>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mt-1">
                Configure your grade, subject, and chapter standards, then trigger the AI engine to generate a comprehensive lesson planner outline.
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
                      <span>{idx < currentStep ? "âœ…" : idx === currentStep ? "â³" : "â—‹"}</span>
                      <span>{stepText}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Result Plan Panel */}
          {showPlan && !isGenerating && (
            <div className="theme-card overflow-hidden border border-[var(--border)] flex-1 flex flex-col">
              {/* Header Info */}
              <div className="p-6 border-b border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] flex justify-between items-start gap-4">
                <div>
                  <span className="badge badge-yellow mb-2">{grade} Â· {subject}</span>
                  <h3 className="text-[var(--text-heading)] font-bold text-base leading-snug">{topic}</h3>
                  <p className="text-xs text-slate-550 mt-1">{syllabus} Â· Standard Curriculum</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-heading)] border border-[var(--border)]/50">
                    ðŸ“‚ Export PDF
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-[var(--primary)] hover:bg-amber-600 text-xs font-semibold text-[var(--text-heading)]">
                    ðŸ’¾ Save
                  </button>
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
                    {tab === "outline" ? "ðŸ—ºï¸ Lesson Outline" : tab === "bilingual" ? "ðŸŒ Bilingual Glossary" : "âœï¸ Exit Tickets"}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="p-6 overflow-y-auto flex-1 max-h-[400px]">
                {activeTab === "outline" && (
                  <div className="space-y-5 text-xs text-[var(--text-main)]">
                    <div>
                      <h4 className="text-[var(--text-heading)] font-semibold text-xs mb-1.5">ðŸŽ¯ Core Objectives</h4>
                      <ul className="list-disc list-inside space-y-1 text-[var(--text-muted)]">
                        <li>Understand the mathematical rationale behind Pythagoras theorem: aÂ² + bÂ² = cÂ²</li>
                        <li>Learn to identify Right-angled triangles from coordinate geometry problems.</li>
                        <li>Apply calculations in real-world scenarios like building measurements.</li>
                      </ul>
                    </div>

                    <hr className="border-[var(--border)]" />

                    <div>
                      <h4 className="text-[var(--text-heading)] font-semibold text-xs mb-3">â° Timeline & Flow ({duration})</h4>
                      <div className="space-y-3">
                        <div className="flex gap-4">
                          <span className="font-mono text-amber-400 font-bold w-14 flex-shrink-0">00-05 Mins</span>
                          <div>
                            <span className="text-[var(--text-heading)] font-semibold block">The Hook (Introduction)</span>
                            <span className="text-[var(--text-muted)]">Draw a standard triangle on the board. Ask students how builders ensure walls are perpendicular (90 degrees) using 3-4-5 rope method.</span>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <span className="font-mono text-amber-400 font-bold w-14 flex-shrink-0">05-25 Mins</span>
                          <div>
                            <span className="text-[var(--text-heading)] font-semibold block">Core Instruction & Proof</span>
                            <span className="text-[var(--text-muted)]">Graphically demonstrate the squares on the three sides. Explain terms: Hypotenuse, Perpendicular, and Base. Solve 2 examples step-by-step.</span>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <span className="font-mono text-amber-400 font-bold w-14 flex-shrink-0">25-40 Mins</span>
                          <div>
                            <span className="text-[var(--text-heading)] font-semibold block">Guided Pair Practice</span>
                            <span className="text-[var(--text-muted)]">Distribute sample worksheet with 3 triangle scenarios. Students pair up to solve, focusing on side ratios.</span>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <span className="font-mono text-amber-400 font-bold w-14 flex-shrink-0">40-45 Mins</span>
                          <div>
                            <span className="text-[var(--text-heading)] font-semibold block">Exit Ticket Check</span>
                            <span className="text-[var(--text-muted)]">Individual student answers 1 quick conceptual question to submit before leaving class.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "bilingual" && (
                  <div className="space-y-4 text-xs">
                    <div className="bg-[var(--primary)]/5 p-3 rounded-xl border border-amber-550/15 mb-4">
                      <p className="text-amber-400 font-medium leading-relaxed">
                        ðŸ“¢ **Teacher Tip**: Use these Tamil equivalent terms in lecture transitions to assist students from regional media backgrounds in adapting to the math formulas.
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
                        <tr>
                          <td className="font-semibold text-[var(--text-heading)]">Right-Angled Triangle</td>
                          <td className="text-amber-400 font-semibold font-tamil">à®šà¯†à®™à¯à®•à¯‹à®£ à®®à¯à®•à¯à®•à¯‹à®£à®®à¯</td>
                          <td>Sengoana Mukkoanam</td>
                        </tr>
                        <tr>
                          <td className="font-semibold text-[var(--text-heading)]">Hypotenuse</td>
                          <td className="text-amber-400 font-semibold font-tamil">à®•à®°à¯à®£à®®à¯</td>
                          <td>Karnam</td>
                        </tr>
                        <tr>
                          <td className="font-semibold text-[var(--text-heading)]">Perpendicular side</td>
                          <td className="text-amber-400 font-semibold font-tamil">à®šà¯†à®™à¯à®•à¯à®¤à¯à®¤à¯à®ªà¯à®ªà®•à¯à®•à®®à¯</td>
                          <td>Sengkuthu Pakkam</td>
                        </tr>
                        <tr>
                          <td className="font-semibold text-[var(--text-heading)]">Adjacent side</td>
                          <td className="text-amber-400 font-semibold font-tamil">à®…à®Ÿà¯à®¤à¯à®¤à¯à®³à¯à®³ à®ªà®•à¯à®•à®®à¯</td>
                          <td>Adhuthulla Pakkam</td>
                        </tr>
                        <tr>
                          <td className="font-semibold text-[var(--text-heading)]">Theorem / Proof</td>
                          <td className="text-amber-400 font-semibold font-tamil">à®¤à¯‡à®±à¯à®±à®®à¯ / à®¨à®¿à®°à¯‚à®ªà®£à®®à¯</td>
                          <td>Thetram / Niroobanam</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === "assessment" && (
                  <div className="space-y-4 text-xs text-slate-350">
                    <h4 className="text-[var(--text-heading)] font-semibold text-xs mb-2">ðŸŽ¯ Exit Ticket MCQs & Answers</h4>

                    <div className="space-y-3.5">
                      <div className="p-3.5 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] rounded-xl border border-[var(--border)]">
                        <div className="font-semibold text-[var(--text-heading)]">Question 1: In a right-angled triangle, if base = 6 cm and height = 8 cm, what is the length of the hypotenuse?</div>
                        <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px] text-[var(--text-muted)]">
                          <div>A) 10 cm</div>
                          <div>B) 14 cm</div>
                          <div>C) 12 cm</div>
                          <div>D) 15 cm</div>
                        </div>
                        <div className="mt-2 text-emerald-400 font-semibold text-[11px]">Correct Answer: A (10 cm). Explanation: 6Â² + 8Â² = 36 + 64 = 100. âˆš100 = 10.</div>
                      </div>

                      <div className="p-3.5 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] rounded-xl border border-[var(--border)]">
                        <div className="font-semibold text-[var(--text-heading)]">Question 2: Who proved the relationship of sides in right-angled triangles in standard Indian maths texts beforehand?</div>
                        <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px] text-[var(--text-muted)]">
                          <div>A) Aryabhata</div>
                          <div>B) Baudhayana Sulba Sutras</div>
                          <div>C) Bhaskara</div>
                          <div>D) Ramanujan</div>
                        </div>
                        <div className="mt-2 text-emerald-400 font-semibold text-[11px]">Correct Answer: B (Baudhayana Sulba Sutras). Contextual integration included.</div>
                      </div>
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

