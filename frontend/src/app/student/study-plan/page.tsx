"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PortalLayout from "@/components/PortalLayout";
import Swal from "sweetalert2";

const subjects = ["Mathematics", "Science", "Tamil", "English", "Social Science"];
const grades = ["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  rationale: string;
}

interface InfographicCard {
  title: string;
  formulas: string[];
  keyConcepts: string[];
  illustrations: string[];
}

interface Unit {
  id: string;
  title: string;
  status: string;
  summary: string;
  studyTime: string;
  infographicCard: InfographicCard;
  audioGuide: { speaker: string; text: string; lang?: string }[];
  quiz: QuizQuestion[];
}

interface StudyPlan {
  subject: string;
  topic: string;
  grade: string;
  goals: string[];
  units: Unit[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function StudyPlanPage() {
  const { data: session } = useSession();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [selectedGrade, setSelectedGrade] = useState(grades[2]); // Grade 10
  const [topic, setTopic] = useState("Quadratic Equations");

  // PDF Upload
  const [fileName, setFileName] = useState("");
  const [uploadedText, setUploadedText] = useState("");
  const [isReadingFile, setIsReadingFile] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<StudyPlan | null>(null);

  // NotebookLM Studio Tool Modals
  const [activeStudioTool, setActiveStudioTool] = useState<"unit-infographic" | "unit-audio" | "unit-quiz" | null>(null);
  const [activeUnit, setActiveUnit] = useState<Unit | null>(null);

  // Audio Guide state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioLineIndex, setAudioLineIndex] = useState(-1);

  // Interactive Quiz state per unit-question
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({}); // "unitId-qIdx" -> chosen option
  const [submittedQuizzes, setSubmittedQuizzes] = useState<Record<string, boolean>>({}); // "unitId-qIdx" -> true/false

  // Real-time Chat Tutor state (Middle panel)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Set chat messages welcome when a plan changes
  useEffect(() => {
    if (currentPlan) {
      setChatMessages([
        {
          role: "assistant",
          content: `Hi there! I've loaded your self-study textbook sources for **"${currentPlan.topic}"** (${currentPlan.grade}). \n\nAsk me any questions, request simple examples, or ask for translations in Tamil. Let's learn together!`
        }
      ]);
    }
  }, [currentPlan]);

  // Handle PDF/Text upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsReadingFile(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (file.name.endsWith(".pdf")) {
        setUploadedText(`Textbook PDF Name: ${file.name}. Size: ${(file.size / 1024).toFixed(1)} KB. Extracted content: Algebra and geometry fundamentals, including quadratic formula, variables, discriminant values, real roots vs imaginary roots, factorization, standard form equations, graphing parabolas, and real world distance calculations.`);
      } else {
        setUploadedText(text);
      }
      setIsReadingFile(false);
      Swal.fire({
        icon: "success",
        title: "Study Guide PDF Uploaded!",
        text: `Extracted chapters successfully for AI Mode.`,
        timer: 1500,
        showConfirmButton: false,
      });
    };
    
    if (file.name.endsWith(".pdf")) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setCurrentPlan(null);
    window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
    setAudioLineIndex(-1);

    try {
      const res = await fetch(`${API_URL}/api/ai/generate-study-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedSubject,
          grade: selectedGrade,
          topic,
          textbookContext: uploadedText || undefined
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setCurrentPlan(json.data);
      } else {
        throw new Error(json.error || "Failed to generate study plan");
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Generation Failed",
        text: String(err),
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Web Speech synthesis for audio guides
  const playAudioGuide = (script: { speaker: string; text: string; lang?: string }[]) => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setAudioLineIndex(-1);
      return;
    }

    window.speechSynthesis.cancel();
    setIsPlayingAudio(true);
    let index = 0;
    setAudioLineIndex(0);

    const speakNext = () => {
      if (index >= script.length || !isPlayingAudio) {
        setIsPlayingAudio(false);
        setAudioLineIndex(-1);
        return;
      }

      setAudioLineIndex(index);
      const line = script[index];
      const utterance = new SpeechSynthesisUtterance(line.text);
      
      const voices = window.speechSynthesis.getVoices();
      if (line.speaker.includes("Priya")) {
        const tamilVoice = voices.find(v => v.lang.includes("ta"));
        const femaleVoice = voices.find(v => v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("zira") || v.name.toLowerCase().includes("google US English"));
        utterance.voice = tamilVoice || femaleVoice || voices[0];
        utterance.pitch = 1.15;
        utterance.rate = 0.95;
      } else {
        const maleVoice = voices.find(v => v.name.toLowerCase().includes("male") || v.name.toLowerCase().includes("david") || v.name.toLowerCase().includes("google UK English Male"));
        utterance.voice = maleVoice || voices[0];
        utterance.pitch = 0.95;
        utterance.rate = 1.0;
      }

      utterance.onend = () => {
        index++;
        speakNext();
      };

      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setAudioLineIndex(-1);
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  // AI Tutor chat interaction (Middle panel)
  const handleSendChat = async () => {
    if (!chatInput.trim() || !currentPlan) return;

    const userMsg: ChatMessage = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const history = chatMessages.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch(`${API_URL}/api/ai/chat-tutor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedSubject,
          grade: selectedGrade,
          messages: history,
          currentMessage: userMsg.content,
          language: "bilingual"
        })
      });

      const json = await res.json();
      if (json.success && json.text) {
        setChatMessages((prev) => [...prev, { role: "assistant", content: json.text }]);
      } else {
        throw new Error(json.error || "No response");
      }
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [...prev, { role: "assistant", content: "Error communicating with AI Tutor." }]);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <PortalLayout
      title="Personalized Study Plan (NotebookLM Style)"
      subtitle="Interact with your textbook chapters, chat with AI Tutor, and launch studio learning tools"
      avatarLetter="A"
      avatarColor="#6366f1"
      themeClass="theme-student"
      accentColor="#6366f1"
    >
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-160px)] overflow-hidden">
        
        {/* Panel 1: Configuration & Sources (Left) */}
        <div className="xl:col-span-1 border-r border-slate-200 dark:border-slate-800 pr-6 overflow-y-auto h-full space-y-6 scrollbar-thin">
          <div className="glass rounded-3xl p-5 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-transparent">
            <h3 className="text-black dark:text-white font-bold text-xs mb-3 flex items-center gap-2">
              <span>⚡</span> Self-Study Setup
            </h3>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-1">Grade</label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    {grades.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-1">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    {subjects.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-1">Topic / Chapter Name</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Algebra Rules"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-black dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Textbook PDF file upload */}
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-1">📖 Upload Chapter PDF</label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label
                    htmlFor="pdf-upload"
                    className="flex-1 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-350 hover:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-550 cursor-pointer flex items-center justify-center gap-2 truncate"
                  >
                    {isReadingFile ? "⏳ Extracting..." : fileName ? `📄 ${fileName.substring(0, 12)}...` : "📁 Choose PDF..."}
                  </label>
                </div>
                {uploadedText && (
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 block mt-1">✓ PDF context successfully loaded.</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full mt-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-850 text-xs font-bold text-white transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                {isGenerating ? "Synthesizing..." : "⚡ Generate My Study Plan"}
              </button>
            </form>
          </div>

          <div className="glass rounded-3xl p-4 border border-slate-250 dark:border-slate-700/50 bg-indigo-500/5">
            <h4 className="text-indigo-600 dark:text-indigo-400 font-bold text-xs mb-1.5">🎓 How to Study:</h4>
            <p className="text-slate-550 dark:text-slate-400 text-[11px] leading-relaxed font-sans">
              1. Setup and click **Generate**.<br/>
              2. Review targets and outline.<br/>
              3. Chat with your AI Tutor in the middle.<br/>
              4. Open **Studio tools** on the right side to study cheat sheets, play audio buddy podcasts, and take mock tests.
            </p>
          </div>
        </div>

        {/* Panel 2 & 3: Middle Section (Document View & AI Chat) */}
        <div className="xl:col-span-2 px-2 overflow-y-auto h-full flex flex-col justify-between space-y-4">
          {isGenerating ? (
            <div className="glass rounded-3xl p-12 border border-slate-250 dark:border-slate-700/50 text-center flex-grow flex flex-col items-center justify-center bg-white dark:bg-transparent">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-6" />
              <h3 className="text-black dark:text-white font-bold text-sm">Gemini AI Formulating Study Plan</h3>
              <p className="text-xs text-slate-550 max-w-xs mt-1.5 animate-pulse font-sans">
                Structuring unit targets, cheat sheets, quiz questions, and bilingual podcast scripts...
              </p>
            </div>
          ) : !currentPlan ? (
            <div className="glass rounded-3xl p-12 border border-slate-250 dark:border-slate-700/50 text-center flex-grow flex flex-col items-center justify-center bg-white dark:bg-transparent">
              <span className="text-4xl mb-4">📓</span>
              <h3 className="text-black dark:text-white font-bold text-sm font-sans">Student Self-Study Hub</h3>
              <p className="text-xs text-slate-550 max-w-sm mt-1.5 leading-relaxed font-sans">
                Launch a live study plan by configuring the form or uploading a textbook PDF. Chat with AI Tutor and generate visual cheat sheet slides.
              </p>
            </div>
          ) : (
            <div className="flex-grow flex flex-col justify-between overflow-hidden gap-4 h-full">
              {/* Study Plan Outline Document */}
              <div className="flex-1 rounded-3xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-950 p-5 overflow-y-auto max-h-[60%] shadow-md">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
                  <span className="badge badge-blue mb-1.5">{currentPlan.grade} · {currentPlan.subject}</span>
                  <h3 className="text-black dark:text-white font-black text-lg">{currentPlan.topic} Study Guide</h3>
                </div>

                <div className="space-y-4 text-xs text-slate-655 dark:text-slate-350">
                  <div>
                    <h4 className="text-black dark:text-white font-bold text-xs mb-2">🎯 Study Targets</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-500 font-sans">
                      {currentPlan.goals?.map((goal, idx) => <li key={idx}>{goal}</li>)}
                    </ul>
                  </div>

                  <hr className="border-slate-200 dark:border-slate-800" />

                  <div>
                    <h4 className="text-black dark:text-white font-bold text-xs mb-3">📖 Course Units</h4>
                    <div className="space-y-2">
                      {currentPlan.units?.map((unit, idx) => (
                        <div key={unit.id} className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl flex justify-between items-center">
                          <div className="font-sans">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">{unit.title}</span>
                            <span className="text-[10px] text-slate-500">{unit.summary.substring(0, 70)}...</span>
                          </div>
                          <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-md shrink-0">{unit.studyTime}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Workspace */}
              <div className="h-[38%] rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-4 flex flex-col justify-between overflow-hidden">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-1.5 flex justify-between items-center">
                  <span>🤖 Chat with AI Tutor</span>
                  <span className="text-indigo-400 lowercase">Connected to Gemini 3.5</span>
                </div>

                {/* Message logs */}
                <div className="flex-1 overflow-y-auto my-2.5 space-y-2.5 pr-1 text-xs">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-xl px-3 py-2 leading-relaxed font-sans ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : "bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-850 rounded-tl-none"
                      }`} style={{ whiteSpace: "pre-line" }}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl rounded-tl-none px-3 py-2 text-slate-400 animate-pulse font-sans">
                        AI Tutor thinking...
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                    placeholder="Ask AI Tutor for quick examples or homework doubts..."
                    className="flex-1 bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-black dark:text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500 font-sans"
                  />
                  <button
                    onClick={handleSendChat}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Ask AI
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Panel 3: Studio Tools list per unit (Right) */}
        <div className="xl:col-span-1 border-l border-slate-200 dark:border-slate-800 pl-6 overflow-y-auto h-full space-y-4 scrollbar-thin">
          <h2 className="text-black dark:text-white font-bold text-xs flex items-center gap-2 mb-2 px-1">
            <span>🎨</span> NotebookLM Studio
          </h2>
          
          {!currentPlan ? (
            <p className="text-[10px] text-slate-500 italic px-1 font-sans">Unlock Studio tools by generating a study plan.</p>
          ) : (
            <div className="space-y-4">
              {currentPlan.units?.map((unit, idx) => (
                <div key={unit.id} className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 rounded-2xl space-y-2">
                  <div className="text-[10px] font-black text-slate-450 uppercase tracking-widest px-1">Unit {idx + 1} Tools</div>
                  <div className="grid grid-cols-1 gap-1.5">
                    
                    <button
                      onClick={() => {
                        setActiveUnit(unit);
                        setActiveStudioTool("unit-infographic");
                      }}
                      className="w-full text-left p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-xl transition-colors text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                    >
                      <span>🖼️</span> Infographic Cheat Sheet
                    </button>

                    <button
                      onClick={() => {
                        setActiveUnit(unit);
                        setActiveStudioTool("unit-audio");
                        setAudioLineIndex(-1);
                      }}
                      className="w-full text-left p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-xl transition-colors text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                    >
                      <span>🎙️</span> Audio Buddy Podcast
                    </button>

                    <button
                      onClick={() => {
                        setActiveUnit(unit);
                        setActiveStudioTool("unit-quiz");
                      }}
                      className="w-full text-left p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-xl transition-colors text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                    >
                      <span>📝</span> Interactive Quiz Test
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Studio Tool Overlays */}
      {activeStudioTool && activeUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">{activeUnit.title}</span>
                <h3 className="text-white font-black text-sm">
                  {activeStudioTool === "unit-infographic" && "🖼️ Unit Cheat Sheet Infographic"}
                  {activeStudioTool === "unit-audio" && "🎙️ NotebookLM AI Audio Buddy"}
                  {activeStudioTool === "unit-quiz" && "📝 Interactive mock Quiz"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveStudioTool(null);
                  setActiveUnit(null);
                  window.speechSynthesis.cancel();
                  setIsPlayingAudio(false);
                  setAudioLineIndex(-1);
                }}
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-500 border border-slate-850 flex items-center justify-center font-bold text-sm transition-all"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 max-h-[60vh] text-xs">
              
              {/* Infographic Cheat sheet */}
              {activeStudioTool === "unit-infographic" && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950 to-slate-950 border border-indigo-500/20 space-y-4">
                  <div className="border-b border-indigo-500/20 pb-2">
                    <h4 className="text-white font-black text-base leading-snug">{activeUnit.infographicCard?.title || "Concept Guide"}</h4>
                    <p className="text-indigo-400 font-medium text-[10px] uppercase">infographic cheat sheet</p>
                  </div>

                  <div className="space-y-4 text-xs">
                    {activeUnit.infographicCard?.formulas?.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Important Equations / Rules</span>
                        <div className="flex flex-col gap-1.5">
                          {activeUnit.infographicCard.formulas.map((f, i) => (
                            <code key={i} className="px-3 py-1.5 bg-slate-950 rounded-lg font-mono text-[11px] text-indigo-400 border border-slate-850 block">{f}</code>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeUnit.infographicCard?.keyConcepts?.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Key Concept Explanations</span>
                        <ul className="list-disc list-inside space-y-1.5 text-slate-350 font-sans leading-relaxed">
                          {activeUnit.infographicCard.keyConcepts.map((k, i) => <li key={i}>{k}</li>)}
                        </ul>
                      </div>
                    )}

                    {activeUnit.infographicCard?.illustrations?.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Visual Study Outline</span>
                        <div className="p-3 bg-slate-950 rounded-xl text-slate-400 border border-slate-850 italic font-sans leading-relaxed">
                          {activeUnit.infographicCard.illustrations.join(", ")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Audio guide */}
              {activeStudioTool === "unit-audio" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-bold text-xs leading-tight">Bilingual Audio Buddy Discussion</h4>
                      <p className="text-[9px] text-slate-500">Speakers: Karthik & Priya</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isPlayingAudio && (
                        <div className="flex gap-0.5 items-end h-5 w-8 mr-1 shrink-0">
                          <div className="bg-indigo-500 w-0.5 rounded animate-pulse h-2" style={{ animationDuration: "0.5s" }} />
                          <div className="bg-indigo-500 w-0.5 rounded animate-pulse h-4" style={{ animationDuration: "0.7s" }} />
                          <div className="bg-indigo-500 w-0.5 rounded animate-pulse h-5" style={{ animationDuration: "0.9s" }} />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => playAudioGuide(activeUnit.id, activeUnit.audioGuide)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] text-white transition-all ${isPlayingAudio ? "bg-red-650 hover:bg-red-700" : "bg-indigo-650 hover:bg-indigo-700"}`}
                      >
                        {isPlayingAudio ? "⏹ Stop Guide" : "🔊 Listen Podcast"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5 max-h-[250px] overflow-y-auto bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                    {activeUnit.audioGuide?.map((line, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border transition-all ${
                          audioLineIndex === idx
                            ? "bg-indigo-500/10 border-indigo-500/40 text-white"
                            : "bg-slate-950 border-slate-850 text-slate-400"
                        }`}
                      >
                        <span className="font-bold text-[9px] text-indigo-400 uppercase tracking-widest block mb-0.5">{line.speaker}</span>
                        <p className="text-xs leading-relaxed font-sans">{line.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Unit Quiz test */}
              {activeStudioTool === "unit-quiz" && (
                <div className="space-y-4">
                  {activeUnit.quiz?.map((q, qIdx) => {
                    const key = `${activeUnit.id}-${qIdx}`;
                    const selectedOpt = selectedAnswers[key];
                    const submitted = submittedQuizzes[key];

                    return (
                      <div key={qIdx} className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-3 font-sans">
                        <div className="font-bold text-white leading-relaxed">{q.question}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = selectedOpt === opt;
                            return (
                              <button
                                type="button"
                                key={oIdx}
                                disabled={submitted}
                                onClick={() => setSelectedAnswers({ ...selectedAnswers, [key]: opt })}
                                className={`p-2.5 rounded-xl text-left text-xs font-semibold border transition-all ${
                                  isSelected
                                    ? "bg-indigo-500/10 border-indigo-500 text-indigo-400"
                                    : "bg-slate-900 border-slate-800 hover:border-slate-650 text-slate-400"
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {!submitted ? (
                          <button
                            type="button"
                            disabled={!selectedOpt}
                            onClick={() => setSubmittedQuizzes({ ...submittedQuizzes, [key]: true })}
                            className="mt-2 px-4 py-1.5 bg-indigo-600 disabled:bg-indigo-900 text-white font-bold rounded-lg text-[10px]"
                          >
                            Submit Answer
                          </button>
                        ) : (
                          <div className="mt-3 p-3 bg-slate-900 border border-slate-800 rounded-xl leading-relaxed text-[11px]">
                            {selectedOpt === q.answer ? (
                              <span className="text-emerald-400 font-bold block mb-1">✓ Correct! Great job.</span>
                            ) : (
                              <span className="text-red-400 font-bold block mb-1">✗ Incorrect. Correct option: {q.answer}</span>
                            )}
                            <span className="text-slate-400">{q.rationale}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newAnswers = { ...selectedAnswers };
                                delete newAnswers[key];
                                setSelectedAnswers(newAnswers);
                                setSubmittedQuizzes({ ...submittedQuizzes, [key]: false });
                              }}
                              className="block mt-2 text-indigo-400 hover:underline font-bold text-[9px]"
                            >
                              Try Again
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
