"use client";
import { useState, useEffect } from "react";
import PortalLayout from "@/components/PortalLayout";



interface Question {
  id: number;
  type: "mcq" | "short" | "long";
  text: string;
  options?: string[];
  answer: string;
  marks: number;
}

const mockQuestionsData: Record<string, Question[]> = {
  easy: [
    { id: 1, type: "mcq", text: "What is the formula of Pythagoras theorem in a right triangle with legs a, b and hypotenuse c?", options: ["A) a² + c² = b²", "B) a² + b² = c²", "C) a + b = c", "D) b² + c² = a²"], answer: "B) a² + b² = c²", marks: 1 },
    { id: 2, type: "mcq", text: "If sides of a triangle are 3 cm, 4 cm, and 5 cm, is it a right-angled triangle?", options: ["A) Yes", "B) No", "C) Cannot be determined", "D) Only in Euclidean geometry"], answer: "A) Yes (3² + 4² = 9 + 16 = 25 = 5²)", marks: 1 },
    { id: 3, type: "short", text: "State the definition of Hypotenuse in a right-angled triangle.", answer: "The hypotenuse is the longest side of a right-angled triangle, opposite the right angle (90 degrees).", marks: 2 },
  ],
  medium: [
    { id: 1, type: "mcq", text: "A ladder 13m long reaches a window 12m above the ground. How far is the foot of the ladder from the base of the wall?", options: ["A) 5m", "B) 7m", "C) 10m", "D) 6m"], answer: "A) 5m (By Pythagoras theorem: 13² - 12² = 169 - 144 = 25 = 5²)", marks: 1 },
    { id: 2, type: "short", text: "A boy goes 24m due East and then 10m due North. Find his distance from the starting point.", answer: "Starting point distance = √(24² + 10²) = √(576 + 100) = √676 = 26 meters.", marks: 3 },
    { id: 3, type: "long", text: "Prove that in a right triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides.", answer: "Draw perpendicular BD to hypotenuse AC. By similarity of triangles ABC and ADB, AB/AC = AD/AB => AB² = AC * AD. Similarly, BC² = AC * CD. Adding both: AB² + BC² = AC(AD + CD) = AC * AC = AC².", marks: 5 },
  ],
  hard: [
    { id: 1, type: "short", text: "In an equilateral triangle ABC, AD is perpendicular to BC. Prove that 3 AB² = 4 AD².", answer: "In triangle ABD (right-angled at D), AB² = AD² + BD². Since BD = BC/2 = AB/2, AB² = AD² + (AB/2)² => AB² = AD² + AB²/4 => 3/4 AB² = AD² => 3 AB² = 4 AD².", marks: 3 },
    { id: 2, type: "long", text: "An airplane leaves an airport and flies due north at a speed of 1000 km/h. At the same time, another airplane leaves the same airport and flies due west at a speed of 1200 km/h. How far apart will the two planes be after 1.5 hours?", answer: "North distance = 1000 * 1.5 = 1500 km. West distance = 1200 * 1.5 = 1800 km. Distance apart = √(1500² + 1800²) = √(2,250,000 + 3,240,000) = √5,490,000 = 300√61 ≈ 2343 km.", marks: 5 },
  ]
};

export default function QuestionGeneratorPage() {
  const [grade, setGrade] = useState("Grade 10");
  const [subject, setSubject] = useState("Mathematics");
  const [topic, setTopic] = useState("Pythagoras Theorem");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [mcqCount, setMcqCount] = useState(3);
  const [shortCount, setShortCount] = useState(2);
  const [longCount, setLongCount] = useState(1);

  const [isGenerating, setIsGenerating] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setShowQuestions(false);
    
    setTimeout(() => {
      // Fetch matching mock questions based on difficulty
      const pool = mockQuestionsData[difficulty];
      setQuestions(pool);
      setIsGenerating(false);
      setShowQuestions(true);
    }, 1200);
  };

  const handleEdit = (q: Question) => {
    setEditingId(q.id);
    setEditingText(q.text);
  };

  const handleSaveEdit = (id: number) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, text: editingText } : q)));
    setEditingId(null);
  };

  const handleRegenerateItem = (id: number) => {
    // Simulate regenerating a single question
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            text: `[Regenerated] Alternative formulation: A right-angled triangle has vertices at coordinates...`,
            answer: "Alternative coordinates proof follows basic hypotenuse definition.",
          };
        }
        return q;
      })
    );
  };

  return (
    <PortalLayout
      title="Question Generator"
      subtitle="Create high-quality exam and quiz questions using AI"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Column */}
        <div className="theme-card p-6 h-fit">
          <h2 className="text-[var(--text-heading)] font-semibold text-sm mb-4">⚙️ Generator Configuration</h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">Class / Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option>Grade 8</option>
                <option>Grade 9</option>
                <option>Grade 10</option>
                <option>Grade 11</option>
                <option>Grade 12</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option>Mathematics</option>
                <option>Science</option>
                <option>English</option>
                <option>Social Science</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">Topic / Concept</label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Algebra, Trigonometry"
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">Difficulty Level</label>
              <div className="grid grid-cols-3 gap-2">
                {(["easy", "medium", "hard"] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                      difficulty === diff
                        ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-sm"
                        : "bg-[var(--bg-main)] border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-[var(--border)] my-2" />

            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-2">Question Breakdown</label>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center bg-[var(--bg-main)] p-2 rounded-xl border border-[var(--border)]">
                  <span className="text-[var(--text-muted)] font-medium">Multiple Choice (MCQ)</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setMcqCount(Math.max(0, mcqCount - 1))} className="px-2 py-0.5 bg-[var(--bg-card)] border border-[var(--border)] rounded text-[var(--text-heading)]">-</button>
                    <span className="w-5 text-center text-[var(--text-heading)] font-semibold">{mcqCount}</span>
                    <button type="button" onClick={() => setMcqCount(mcqCount + 1)} className="px-2 py-0.5 bg-[var(--bg-card)] border border-[var(--border)] rounded text-[var(--text-heading)]">+</button>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-[var(--bg-main)] p-2 rounded-xl border border-[var(--border)]">
                  <span className="text-[var(--text-muted)] font-medium">Short Answer</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setShortCount(Math.max(0, shortCount - 1))} className="px-2 py-0.5 bg-[var(--bg-card)] border border-[var(--border)] rounded text-[var(--text-heading)]">-</button>
                    <span className="w-5 text-center text-[var(--text-heading)] font-semibold">{shortCount}</span>
                    <button type="button" onClick={() => setShortCount(shortCount + 1)} className="px-2 py-0.5 bg-[var(--bg-card)] border border-[var(--border)] rounded text-[var(--text-heading)]">+</button>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-[var(--bg-main)] p-2 rounded-xl border border-[var(--border)]">
                  <span className="text-[var(--text-muted)] font-medium">Long Answer</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setLongCount(Math.max(0, longCount - 1))} className="px-2 py-0.5 bg-[var(--bg-card)] border border-[var(--border)] rounded text-[var(--text-heading)]">-</button>
                    <span className="w-5 text-center text-[var(--text-heading)] font-semibold">{longCount}</span>
                    <button type="button" onClick={() => setLongCount(longCount + 1)} className="px-2 py-0.5 bg-[var(--bg-card)] border border-[var(--border)] rounded text-[var(--text-heading)]">+</button>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full mt-2 py-3 rounded-xl bg-[var(--primary)] hover:opacity-90 disabled:opacity-50 text-xs font-semibold text-white shadow-sm transition-opacity flex items-center justify-center gap-2"
            >
              {isGenerating ? "Synthesizing Questions..." : "⚡ Generate Questions"}
            </button>
          </form>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-2 flex flex-col min-h-[400px]">
          {!isGenerating && !showQuestions && (
            <div className="theme-card p-8 flex-1 flex flex-col items-center justify-center text-center border-dashed">
              <span className="text-4xl mb-4">❓</span>
              <h3 className="text-[var(--text-heading)] font-semibold text-sm">No Questions Generated</h3>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mt-1">
                Configure your grade, subject, and question distribution metrics, then trigger the generator to construct exam content.
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="theme-card p-8 flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full border-4 border-[var(--primary)]/20 border-t-[var(--primary)] animate-spin mb-6" />
              <h3 className="text-[var(--text-heading)] font-semibold text-sm mb-2">Analyzing Topic Syllabus...</h3>
              <p className="text-xs text-[var(--text-muted)] max-w-xs">
                Generating questions according to cognitive level taxonomy.
              </p>
            </div>
          )}

          {showQuestions && !isGenerating && (
            <div className="space-y-4 flex-1 flex flex-col">
              {/* Toolbar */}
              <div className="theme-card p-4 flex justify-between items-center bg-[var(--bg-main)]">
                <div className="text-xs text-[var(--text-muted)]">
                  Total Questions: <span className="text-[var(--text-heading)] font-semibold">{questions.length}</span> · Difficulty: <span className="text-[var(--primary)] font-bold capitalize">{difficulty}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAnswers(!showAnswers)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      showAnswers ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 dark:text-emerald-400" : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                    }`}
                  >
                    {showAnswers ? "Hide Answers" : "Show Answers"}
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-xs font-semibold text-[var(--text-heading)] border border-[var(--border)] shadow-sm">
                    📋 Copy Test Paper
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4 overflow-y-auto max-h-[500px]">
                {questions.map((q, idx) => (
                  <div key={q.id} className="theme-card p-5 space-y-3 relative group">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <span className="badge badge-blue text-[10px]">
                        Q{idx + 1} · {q.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] font-medium">{q.marks} Mark{q.marks > 1 ? "s" : ""}</span>
                    </div>

                    {/* Question Content */}
                    {editingId === q.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl p-3 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)] min-h-[80px]"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2.5 py-1 rounded bg-[var(--bg-card)] border border-[var(--border)] text-[10px] text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(q.id)}
                            className="px-2.5 py-1 rounded bg-[var(--primary)] text-[10px] text-white shadow-sm hover:opacity-90"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-[var(--text-heading)] font-medium leading-relaxed">{q.text}</div>
                    )}

                    {/* Options (if MCQ) */}
                    {q.type === "mcq" && q.options && (
                      <div className="grid grid-cols-2 gap-2 pl-2">
                        {q.options.map((opt) => (
                          <div key={opt} className="text-xs text-[var(--text-muted)] font-mono">
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Answer Key */}
                    {showAnswers && (
                      <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl mt-3 text-xs">
                        <span className="text-emerald-500 dark:text-emerald-400 font-bold block mb-1">Answer / Solved:</span>
                        <span className="text-[var(--text-main)] leading-relaxed font-mono">{q.answer}</span>
                      </div>
                    )}

                    {/* Actions Bar (Hover) */}
                    {editingId !== q.id && (
                      <div className="flex gap-3 justify-end pt-2 border-t border-[var(--border-light)] opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(q)}
                          className="text-[10px] font-semibold text-[var(--text-muted)] hover:text-[var(--primary)] flex items-center gap-1"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleRegenerateItem(q.id)}
                          className="text-[10px] font-semibold text-[var(--text-muted)] hover:text-[var(--primary)] flex items-center gap-1"
                        >
                          🔄 Regenerate
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
