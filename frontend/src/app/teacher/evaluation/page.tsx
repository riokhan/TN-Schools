"use client";
import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";



interface Submission {
  id: string;
  studentName: string;
  rollNo: string;
  status: "pending" | "graded";
  score: number | null;
  totalMarks: number;
  submittedAt: string;
  ocrContent: {
    questionText: string;
    studentAnswer: string;
    aiScore: number;
    maxScore: number;
    aiRationale: string;
  }[];
}

const initialSubmissions: Submission[] = [
  {
    id: "sub-1",
    studentName: "Kavitha R.",
    rollNo: "10A03",
    status: "pending",
    score: null,
    totalMarks: 10,
    submittedAt: "Yesterday, 4:15 PM",
    ocrContent: [
      {
        questionText: "Q1: State Pythagoras Theorem and verify if sides 6, 8, 10 form a right-angled triangle. (3 Marks)",
        studentAnswer: "Pythagoras theorem is a2 + b2 = c2. If a=6, b=8, then c=10. 6*6 is 36. 8*8 is 64. 36+64 is 100. 10*10 is 100. So 100 = 100. It is a right triangle.",
        aiScore: 3,
        maxScore: 3,
        aiRationale: "Perfect answer. Formula stated correctly and mathematical verification is accurate.",
      },
      {
        questionText: "Q2: A boy walks 24m East and 10m North. Find his distance from start. (3 Marks)",
        studentAnswer: "East side is 24. North side is 10. Distance is 24 + 10 = 34 meters.",
        aiScore: 1,
        maxScore: 3,
        aiRationale: "Incorrect application of distance formula. The student simply summed the walking distances rather than applying the right-angle diagonal distance: √(24² + 10²) = 26m. Awarded 1 mark for identifying the two perpendicular side values.",
      },
      {
        questionText: "Q3: Prove that in a right-angled triangle, the hypotenuse is the longest side. (4 Marks)",
        studentAnswer: "In a right triangle, we have one angle which is 90 degrees. All other angles are smaller because total sum is 180. The side opposite to the largest angle is always the longest side. So hypotenuse is the longest.",
        aiScore: 3.5,
        maxScore: 4,
        aiRationale: "Good geometric reasoning based on angle-side relationships. Missed formal naming or naming vertices, but conceptual logic is solid. Deducted 0.5 for lack of rigorous notation.",
      }
    ]
  },
  {
    id: "sub-2",
    studentName: "Murugan S.",
    rollNo: "10B02",
    status: "graded",
    score: 5.5,
    totalMarks: 10,
    submittedAt: "2 days ago",
    ocrContent: [
      {
        questionText: "Q1: State Pythagoras Theorem and verify if sides 6, 8, 10 form a right-angled triangle. (3 Marks)",
        studentAnswer: "Theorem says that side sq is equal to sum of other two side sq. For 6, 8, 10: 6^2 + 8^2 = 36 + 64 = 100. It matches 10^2.",
        aiScore: 2.5,
        maxScore: 3,
        aiRationale: "Correct math but the theorem formulation is slightly informal. Missing label names.",
      },
      {
        questionText: "Q2: A boy walks 24m East and 10m North. Find his distance from start. (3 Marks)",
        studentAnswer: "Distance = 24^2 + 10^2 = 576 + 100 = 676. Then square root of 676 is 26.",
        aiScore: 3,
        maxScore: 3,
        aiRationale: "Perfect. Step-by-step calculations and final answer are correct.",
      },
      {
        questionText: "Q3: Prove that in a right-angled triangle, the hypotenuse is the longest side. (4 Marks)",
        studentAnswer: "Hypotenuse is the side opposite to 90 degrees. It is long.",
        aiScore: 0,
        maxScore: 4,
        aiRationale: "No proof attempted. Simple statement of definition does not satisfy proof requirements.",
      }
    ]
  },
  {
    id: "sub-3",
    studentName: "Senthil K.",
    rollNo: "10B04",
    status: "pending",
    score: null,
    totalMarks: 10,
    submittedAt: "Yesterday, 5:30 PM",
    ocrContent: [
      {
        questionText: "Q1: State Pythagoras Theorem and verify if sides 6, 8, 10 form a right-angled triangle. (3 Marks)",
        studentAnswer: "a^2 + b^2 = c^2. 36 + 64 = 100. √100 = 10.",
        aiScore: 2,
        maxScore: 3,
        aiRationale: "Math is correct but student did not explicitly state the theorem in sentence form or label which side is the hypotenuse.",
      },
      {
        questionText: "Q2: A boy walks 24m East and 10m North. Find his distance from start. (3 Marks)",
        studentAnswer: "Start to end = square root of (24 squared + 10 squared) = sqrt(576 + 100) = sqrt(676) = 26m.",
        aiScore: 3,
        maxScore: 3,
        aiRationale: "Perfect calculation and formulation.",
      },
      {
        questionText: "Q3: Prove that in a right-angled triangle, the hypotenuse is the longest side. (4 Marks)",
        studentAnswer: "We use angle theory. Largest angle has largest side opposite. 90 deg is largest angle.",
        aiScore: 2,
        maxScore: 4,
        aiRationale: "Logic is present but highly informal and lacks structure of a mathematical proof.",
      }
    ]
  }
];

export default function EvaluationPage() {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [selectedSubId, setSelectedSubId] = useState("sub-1");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedSub = submissions.find((s) => s.id === selectedSubId) || submissions[0];

  // Grade Edit Form State
  const [manualOverrideScores, setManualOverrideScores] = useState<Record<string, number>>({});
  const [commentOverrides, setCommentOverrides] = useState<Record<string, string>>({});

  const getQuestionScore = (subId: string, qIdx: number, defaultScore: number) => {
    const key = `${subId}-${qIdx}`;
    return manualOverrideScores[key] !== undefined ? manualOverrideScores[key] : defaultScore;
  };

  const handleScoreChange = (qIdx: number, val: string) => {
    const scoreVal = parseFloat(val) || 0;
    setManualOverrideScores({
      ...manualOverrideScores,
      [`${selectedSub.id}-${qIdx}`]: scoreVal,
    });
  };

  const handleCommentChange = (qIdx: number, val: string) => {
    setCommentOverrides({
      ...commentOverrides,
      [`${selectedSub.id}-${qIdx}`]: val,
    });
  };

  const calculateTotal = () => {
    let sum = 0;
    selectedSub.ocrContent.forEach((q, idx) => {
      sum += getQuestionScore(selectedSub.id, idx, q.aiScore);
    });
    return sum;
  };

  const handleSubmitEvaluation = () => {
    const finalScore = calculateTotal();
    setSubmissions(
      submissions.map((sub) => {
        if (sub.id === selectedSub.id) {
          return {
            ...sub,
            status: "graded" as const,
            score: finalScore,
          };
        }
        return sub;
      })
    );

    setToastMessage(`Grading submitted successfully for ${selectedSub.studentName}! Final Score: ${finalScore}/${selectedSub.totalMarks}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <PortalLayout
      title="AI Evaluation"
      subtitle="Verify OCR-digitized student papers and leverage AI-assisted grading"
    >
      {toastMessage && (
        <div className="fixed top-5 right-5 bg-emerald-500 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <span>✅</span> {toastMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Submissions List Panel */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="glass rounded-2xl p-4">
            <h3 className="text-white font-semibold text-xs mb-3 uppercase tracking-wider">📄 Submissions</h3>
            
            <div className="flex flex-col gap-2">
              {submissions.map((sub) => {
                const isSelected = sub.id === selectedSubId;
                const total = sub.score !== null ? sub.score : "—";
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubId(sub.id);
                    }}
                    className={`text-left p-3 rounded-xl border transition-all text-xs ${
                      isSelected
                        ? "border-amber-500/80 bg-amber-500/5"
                        : "border-slate-800 hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-white">{sub.studentName}</span>
                      <span className={`badge ${sub.status === "graded" ? "badge-green" : "badge-yellow"}`}>
                        {sub.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">Roll No: {sub.rollNo}</div>
                    <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-850/60 text-[10px]">
                      <span className="text-slate-500">{sub.submittedAt}</span>
                      <span className="text-white font-semibold">
                        Grade: {total} / {sub.totalMarks}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Evaluation Desk */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Answer Sheet (Digitized) */}
          <div className="glass rounded-2xl p-5 flex flex-col h-[500px]">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
              <span className="text-lg">📝</span>
              <div>
                <h3 className="text-white font-semibold text-xs">Digitized Answer Paper</h3>
                <p className="text-[10px] text-slate-500">Auto-extracted OCR handwriting transcript</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs text-slate-350">
              {selectedSub.ocrContent.map((q, idx) => (
                <div key={idx} className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 space-y-2">
                  <div className="text-white font-bold text-[11px]">{q.questionText}</div>
                  <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-lg text-slate-300 font-mono text-[11px] leading-relaxed italic">
                    &quot;{q.studentAnswer}&quot;
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI grading & override panel */}
          <div className="glass rounded-2xl p-5 flex flex-col h-[500px] justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🤖</span>
                  <div>
                    <h3 className="text-white font-semibold text-xs">AI Feedback Workspace</h3>
                    <p className="text-[10px] text-slate-500">Edit scores and insert diagnostic remarks</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-550 text-[10px] block">Sum Score</span>
                  <span className="text-white font-bold text-base">{calculateTotal()} / {selectedSub.totalMarks}</span>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[340px] space-y-4 pr-1">
                {selectedSub.ocrContent.map((q, idx) => {
                  const currentScore = getQuestionScore(selectedSub.id, idx, q.aiScore);
                  const currentComment = commentOverrides[`${selectedSub.id}-${idx}`] || "";
                  return (
                    <div key={idx} className="p-4 bg-slate-900/30 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-amber-500 text-[10px]">QUESTION {idx + 1} ASSESSMENT</span>
                        
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-slate-500 text-[10px]">Points:</span>
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max={q.maxScore}
                            value={currentScore}
                            onChange={(e) => handleScoreChange(idx, e.target.value)}
                            className="w-12 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-center text-white font-bold"
                          />
                          <span className="text-slate-500 text-[10px]">/ {q.maxScore}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-450 leading-relaxed bg-slate-950/40 p-2.5 rounded border border-slate-850">
                        <span className="text-amber-400 font-bold block mb-0.5 text-[9px] uppercase">AI Rationale:</span>
                        {q.aiRationale}
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="Add teacher override comment (optional)..."
                          value={currentComment}
                          onChange={(e) => handleCommentChange(idx, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-750 rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none focus:border-amber-500 placeholder-slate-700"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex gap-3">
              <button className="flex-1 py-2.5 rounded-xl border border-slate-750 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-850 transition-colors">
                🔄 Reset AI Grades
              </button>
              <button
                onClick={handleSubmitEvaluation}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-xs font-semibold text-white transition-colors"
              >
                💾 Submit Evaluation
              </button>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
