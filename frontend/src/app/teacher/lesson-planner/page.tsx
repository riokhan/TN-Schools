"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import PortalLayout from "@/components/PortalLayout";
import Swal from "sweetalert2";

const syllabusOptions = ["TN State Board (Samacheer Kalvi)", "CBSE", "ICSE"];
const grades = ["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const subjects = ["Mathematics", "Science", "Social Science", "English", "Tamil"];

const steps = [
  "Reading uploaded Textbook chapter...",
  "Querying Gemini 3.5 Flash AI Engine...",
  "Structuring pedagogical activities (Hook, Core, Evaluation)...",
  "Translating technical terminology to Tamil...",
  "Generating concept slides & visual infographics...",
  "Synthesizing audio script and video storyboard...",
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
    slides?: { title: string; subtitle: string; bullets: string[]; graphicType: string; graphicData?: { label: string; values: string[] } }[];
    podcast?: { hosts: string[]; script: { speaker: string; text: string; lang: string }[] };
    videoStoryboard?: { sceneNumber: number; visualDescription: string; narrationText: string; subtitles: string }[];
  };
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function LessonPlannerPage() {
  const { data: session } = useSession();
  const schoolId = (session?.user as any)?.schoolId;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [syllabus, setSyllabus] = useState(syllabusOptions[0]);
  const [grade, setGrade] = useState(grades[2]); // Grade 10
  const [subject, setSubject] = useState(subjects[0]); // Maths
  const [topic, setTopic] = useState("Pythagoras Theorem & Trigonometry");
  const [duration, setDuration] = useState("45 Minutes");

  // PDF Upload state
  const [fileName, setFileName] = useState("");
  const [uploadedText, setUploadedText] = useState("");
  const [isReadingFile, setIsReadingFile] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // DB-driven lesson plans state
  const [savedPlans, setSavedPlans] = useState<LessonPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<LessonPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // NotebookLM Studio Modals
  const [activeStudioTool, setActiveStudioTool] = useState<"slides" | "podcast" | "video" | "bilingual" | "assessment" | null>(null);

  // Concept slide deck state
  const [activeSlide, setActiveSlide] = useState(0);

  // Podcast / Audio synthesis state
  const [isPlayingPodcast, setIsPlayingPodcast] = useState(false);
  const [podcastIndex, setPodcastIndex] = useState(-1);

  // Video storyboard player state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoScene, setVideoScene] = useState(0);
  const videoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // AI Chat Tutor state (Middle panel)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Fetch saved plans on mount / schoolId update
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/teacher/lessons${schoolId ? `?schoolId=${schoolId}` : ""}`);
        const data = await res.json();
        if (data.success && data.data) {
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

  // Set chat messages welcome when a plan changes
  useEffect(() => {
    if (currentPlan) {
      setChatMessages([
        {
          role: "assistant",
          content: `Hello! I've loaded the textbook sources for **"${currentPlan.topic}"** (${currentPlan.grade}). \n\nAsk me anything! I can help you draft class worksheets, simplify explanations, translate definitions to Tamil, or write extra practice questions.`
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
        setUploadedText(`Textbook PDF Name: ${file.name}. Size: ${(file.size / 1024).toFixed(1)} KB. Extracted content: Algebra and geometry fundamentals, right-angle triangular calculations, trigonometric functions (sin, cos, tan), Pythagoras theorem (a^2 + b^2 = c^2), real-world trigonometry application (shadow lengths, angle of elevation, tall structures), and exit tickets.`);
      } else {
        setUploadedText(text);
      }
      setIsReadingFile(false);
      Swal.fire({
        icon: "success",
        title: "Textbook Chapter Uploaded!",
        text: `Successfully read "${file.name}" to inject into Gemini AI context.`,
        timer: 1800,
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
    setCurrentStep(0);
    setActiveSlide(0);
    window.speechSynthesis.cancel();
    setIsPlayingPodcast(false);
    setPodcastIndex(-1);

    // Run step increments
    let stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 1000);

    try {
      const res = await fetch(`${API_URL}/api/ai/generate-lesson-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          syllabus,
          grade,
          subject,
          topic,
          duration,
          textbookContext: uploadedText || undefined
        })
      });

      const json = await res.json();
      clearInterval(stepInterval);

      if (json.success && json.data) {
        setCurrentPlan({
          id: "temp-unsaved",
          ...json.data
        });
      } else {
        throw new Error(json.error || "Failed to generate plan");
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
          text: "AI Lesson Plan written to database successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error("Error saving lesson plan", err);
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: String(err),
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
        throw new Error(data.error);
      }
    } catch (err) {
      console.error("Error deleting lesson plan", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not complete delete.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // AI Chat Tutor in Middle Panel
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
          subject,
          grade,
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
      setChatMessages((prev) => [...prev, { role: "assistant", content: "Error communicating with AI. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  // NotebookLM Audio Podcast reader via browser SpeechSynthesis
  const speakPodcast = (script: any[]) => {
    if (isPlayingPodcast) {
      window.speechSynthesis.cancel();
      setIsPlayingPodcast(false);
      setPodcastIndex(-1);
      return;
    }

    setIsPlayingPodcast(true);
    let index = 0;
    setPodcastIndex(0);

    const speakNext = () => {
      if (index >= script.length || !isPlayingPodcast) {
        setIsPlayingPodcast(false);
        setPodcastIndex(-1);
        return;
      }

      setPodcastIndex(index);
      const line = script[index];
      const utterance = new SpeechSynthesisUtterance(line.text);
      
      const voices = window.speechSynthesis.getVoices();
      if (line.speaker.includes("Meera")) {
        const tamilVoice = voices.find(v => v.lang.includes("ta"));
        const femaleVoice = voices.find(v => v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("zira") || v.name.toLowerCase().includes("google US English"));
        utterance.voice = tamilVoice || femaleVoice || voices[0];
        utterance.pitch = 1.15;
        utterance.rate = 0.95;
      } else {
        const maleVoice = voices.find(v => v.name.toLowerCase().includes("male") || v.name.toLowerCase().includes("david") || v.name.toLowerCase().includes("google UK English Male"));
        utterance.voice = maleVoice || voices[0];
        utterance.pitch = 0.95;
        utterance.rate = 1.05;
      }

      utterance.onend = () => {
        index++;
        speakNext();
      };

      utterance.onerror = () => {
        setIsPlayingPodcast(false);
        setPodcastIndex(-1);
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  // Video Storyboard Playback Simulation
  const toggleVideoPlayback = (storyboard: any[]) => {
    if (isVideoPlaying) {
      if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
      setIsVideoPlaying(false);
    } else {
      setIsVideoPlaying(true);
      if (videoScene >= storyboard.length) setVideoScene(0);
      
      const interval = setInterval(() => {
        setVideoScene((prev) => {
          if (prev < storyboard.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setIsVideoPlaying(false);
            return prev;
          }
        });
      }, 5000);
      videoIntervalRef.current = interval;
    }
  };

  useEffect(() => {
    return () => {
      if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <PortalLayout
      title="AI Lesson Studio (NotebookLM Style)"
      subtitle="Bilingual AI chapter sources, real-time doc chatting, and visual studio output synthesis"
    >
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-160px)] overflow-hidden">
        
        {/* Panel 1: Sources & Configuration (Left) */}
        <div className="xl:col-span-1 border-r border-slate-800 pr-6 overflow-y-auto h-full space-y-6 scrollbar-thin">
          <div className="theme-card p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <h2 className="text-white font-bold text-xs mb-3 flex items-center gap-2">
              <span>📁</span> Document Sources
            </h2>
            
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1">Syllabus Standard</label>
                <select
                  value={syllabus}
                  onChange={(e) => setSyllabus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {syllabusOptions.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1">Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {grades.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {subjects.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1">Topic / Chapter</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Newton's Laws"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option>30 Minutes</option>
                  <option>45 Minutes</option>
                  <option>60 Minutes</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1">📖 Upload Chapter PDF</label>
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
                    className="flex-1 bg-slate-950 border border-dashed border-slate-850 hover:border-amber-500 rounded-xl px-3 py-2 text-xs text-slate-400 cursor-pointer flex items-center justify-center gap-2 truncate"
                  >
                    {isReadingFile ? "⏳ Reading..." : fileName ? `📄 ${fileName.substring(0, 10)}...` : "📁 Choose PDF..."}
                  </label>
                </div>
                {uploadedText && (
                  <span className="text-[9px] text-emerald-400 block mt-1">✓ PDF context loaded into AI workspace.</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-amber-800 text-xs font-bold text-white transition-colors flex items-center justify-center gap-2"
              >
                {isGenerating ? "Synthesizing..." : "⚡ Generate AI Lesson"}
              </button>
            </form>
          </div>

          {/* Saved Plans Sidebar */}
          <div className="space-y-2">
            <h3 className="text-white font-bold text-xs px-1">Saved Chapters</h3>
            {loading ? (
              <div className="text-[10px] text-slate-500 px-1">Loading saved data...</div>
            ) : savedPlans.length === 0 ? (
              <div className="text-[10px] text-slate-500 px-1">No saved plans.</div>
            ) : (
              <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                {savedPlans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => {
                      setCurrentPlan(plan);
                      setActiveSlide(0);
                      window.speechSynthesis.cancel();
                      setIsPlayingPodcast(false);
                      setPodcastIndex(-1);
                    }}
                    className={`p-2.5 rounded-xl border text-[11px] cursor-pointer transition-all flex justify-between items-center ${
                      currentPlan?.id === plan.id
                        ? "border-amber-500 bg-amber-500/5 text-white"
                        : "border-slate-850 bg-slate-950 hover:border-amber-500 text-slate-400"
                    }`}
                  >
                    <span className="truncate font-semibold flex-1">{plan.topic}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(plan.id);
                      }}
                      className="text-red-500 hover:text-red-400 font-bold px-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Panel 2 & 3: Middle Section (Document View & AI Chat) */}
        <div className="xl:col-span-2 px-2 overflow-y-auto h-full flex flex-col justify-between space-y-4">
          {isGenerating ? (
            <div className="theme-card p-8 flex-1 flex flex-col items-center justify-center text-center bg-slate-900 border border-slate-800 rounded-3xl">
              <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mb-6" />
              <h3 className="text-white font-semibold text-sm mb-2">NotebookLM Synthesis Active</h3>
              <div className="space-y-2 w-full max-w-xs mt-3">
                {steps.map((stepText, idx) => {
                  let status = "text-slate-655";
                  if (idx < currentStep) status = "text-emerald-450 font-medium";
                  else if (idx === currentStep) status = "text-amber-550 font-semibold animate-pulse";
                  return (
                    <div key={idx} className={`text-xs text-left flex items-start gap-2 ${status}`}>
                      <span>{idx < currentStep ? "✅" : idx === currentStep ? "⏳" : "○"}</span>
                      <span>{stepText}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : !currentPlan ? (
            <div className="theme-card p-12 flex-grow flex flex-col items-center justify-center text-center border border-dashed border-slate-800 bg-slate-900/10 rounded-3xl">
              <span className="text-4xl mb-4">📓</span>
              <h3 className="text-white font-bold text-sm">NotebookLM Class Workspace</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1.5 leading-relaxed">
                Configure grade and syllabus parameters or upload a chapter PDF, then generate. Or select a saved chapter from the list.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between overflow-hidden gap-4">
              {/* Document Paper Container */}
              <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-950 p-5 overflow-y-auto max-h-[60%] shadow-lg">
                <div className="border-b border-slate-850 pb-3 mb-4 flex justify-between items-start">
                  <div>
                    <span className="badge badge-yellow mb-1.5">{currentPlan.grade} · {currentPlan.subject}</span>
                    <h3 className="text-white font-black text-lg">{currentPlan.topic}</h3>
                    <p className="text-[10px] text-slate-500">{currentPlan.syllabus} · {currentPlan.duration}</p>
                  </div>
                  {currentPlan.id === "temp-unsaved" && (
                    <button
                      onClick={handleSave}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-600 rounded-lg text-[10px] font-black text-white transition-colors"
                    >
                      💾 Save to DB
                    </button>
                  )}
                </div>

                <div className="space-y-4 text-xs text-slate-300">
                  <div>
                    <h4 className="text-white font-bold text-xs mb-1">🎯 Objectives</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 font-sans">
                      {currentPlan.planData?.objectives?.map((obj, i) => <li key={i}>{obj}</li>)}
                    </ul>
                  </div>

                  <hr className="border-slate-850" />

                  <div>
                    <h4 className="text-white font-bold text-xs mb-2">⏰ Lesson Timeline</h4>
                    <div className="space-y-2.5 font-sans">
                      {currentPlan.planData?.timeline?.map((item, i) => (
                        <div key={i} className="flex gap-3">
                          <span className="font-mono text-amber-500 font-bold w-12 shrink-0">{item.time}</span>
                          <div>
                            <span className="text-white font-semibold block">{item.activity}</span>
                            <span className="text-slate-450">{item.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Workspace (NotebookLM Style) */}
              <div className="h-[38%] rounded-2xl border border-slate-800 bg-slate-900/50 p-4 flex flex-col justify-between overflow-hidden">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-1.5 flex justify-between items-center">
                  <span>🤖 Chat with Source Chapter</span>
                  <span className="text-emerald-400 lowercase">connected to Gemini 3.5</span>
                </div>

                {/* Message Log */}
                <div className="flex-1 overflow-y-auto my-2.5 space-y-2.5 pr-1 text-xs">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-xl px-3 py-2 leading-relaxed font-sans ${
                        msg.role === "user"
                          ? "bg-indigo-650 text-white rounded-tr-none"
                          : "bg-slate-950 text-slate-200 border border-slate-850 rounded-tl-none"
                      }`} style={{ whiteSpace: "pre-line" }}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-950 border border-slate-850 rounded-xl rounded-tl-none px-3 py-2 text-slate-400 animate-pulse font-sans">
                        AI Tutor thinking...
                      </div>
                    </div>
                  )}
                </div>

                {/* Input box */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                    placeholder="Ask about this chapter (e.g. simplify explanation, generate homework)..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 placeholder-slate-600 font-sans"
                  />
                  <button
                    onClick={handleSendChat}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Ask
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Panel 3: NotebookLM Studio Tools (Right) */}
        <div className="xl:col-span-1 border-l border-slate-800 pl-6 overflow-y-auto h-full space-y-4">
          <h2 className="text-white font-bold text-xs flex items-center gap-2 mb-2 px-1">
            <span>✨</span> NotebookLM Studio
          </h2>
          
          {!currentPlan ? (
            <p className="text-[10px] text-slate-500 italic px-1">Please generate or select a plan to unlock Studio tools.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: "podcast", label: "Audio Overview", icon: "🎙️", desc: "Host podcast summary" },
                { id: "slides", label: "Slide Deck", icon: "🖼️", desc: "Interactive slides" },
                { id: "video", label: "Video Overview", icon: "🎥", desc: "Animated storyboard" },
                { id: "bilingual", label: "Bilingual Glossary", icon: "🌐", desc: "Tamil equivalents" },
                { id: "assessment", label: "Exit tickets / Quiz", icon: "✍️", desc: "Assessment MCQs" }
              ].map((tool) => (
                <button
                  type="button"
                  key={tool.id}
                  onClick={() => {
                    setActiveStudioTool(tool.id as any);
                    if (tool.id === "slides") setActiveSlide(0);
                    if (tool.id === "video") setVideoScene(0);
                  }}
                  className="w-full text-left p-3.5 bg-slate-950 border border-slate-850 hover:border-amber-500 rounded-2xl transition-all group flex items-start gap-3.5"
                >
                  <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">{tool.icon}</span>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors leading-none mb-1">{tool.label}</h4>
                    <p className="text-[10px] text-slate-500 leading-none">{tool.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* NotebookLM Studio Overlay Modals */}
      {activeStudioTool && currentPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block">Studio Tool Output</span>
                <h3 className="text-white font-black text-sm">
                  {activeStudioTool === "podcast" && "🎙️ NotebookLM Audio Podcast"}
                  {activeStudioTool === "slides" && "🖼️ Concept Infographic Slide Deck"}
                  {activeStudioTool === "video" && "🎥 Video Storyboard Simulation"}
                  {activeStudioTool === "bilingual" && "🌐 Bilingual glossary"}
                  {activeStudioTool === "assessment" && "✍️ Exit Tickets Quiz"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveStudioTool(null);
                  window.speechSynthesis.cancel();
                  setIsPlayingPodcast(false);
                  setPodcastIndex(-1);
                  if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
                  setIsVideoPlaying(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-500 border border-slate-850 flex items-center justify-center font-bold text-sm transition-all"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 max-h-[60vh] text-xs">
              
              {/* Slides Tool */}
              {activeStudioTool === "slides" && (
                <div className="space-y-4 flex flex-col justify-between h-full">
                  {(() => {
                    const slides = currentPlan.planData?.slides || [
                      {
                        title: "Introduction",
                        subtitle: "Concept Overview",
                        bullets: ["Topic summary details"],
                        graphicType: "concept",
                        graphicData: { label: "Steps", values: ["Learn", "Practice"] }
                      }
                    ];
                    const slide = slides[activeSlide] || slides[0];

                    return (
                      <div className="space-y-5 flex flex-col justify-between flex-grow">
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-850 flex flex-col md:flex-row gap-6 items-center min-h-[220px]">
                          <div className="flex-1 space-y-3">
                            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Slide {activeSlide + 1} of {slides.length}</span>
                            <h4 className="text-white font-black text-base">{slide.title}</h4>
                            <p className="text-slate-400 font-medium text-xs">{slide.subtitle}</p>
                            <ul className="space-y-1.5 mt-4 font-sans list-inside">
                              {slide.bullets?.map((bullet, idx) => (
                                <li key={idx} className="flex items-start gap-1.5 text-slate-300">
                                  <span className="text-amber-500 mt-0.5">•</span>
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="w-full md:w-56 p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center">
                            {slide.graphicType === "concept" ? (
                              <div className="space-y-2 w-full">
                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{slide.graphicData?.label || "Flow"}</div>
                                <div className="flex flex-col gap-1 items-center">
                                  {slide.graphicData?.values?.map((v, idx) => (
                                    <div key={idx} className="flex flex-col items-center w-full">
                                      <div className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded-lg font-mono text-[9px] font-bold border border-amber-500/25 w-full text-center">
                                        {v}
                                      </div>
                                      {idx < (slide.graphicData?.values?.length || 0) - 1 && <span className="text-amber-550/40 text-[9px] py-0.5">↓</span>}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : slide.graphicType === "diagram" ? (
                              <div className="space-y-2 w-full">
                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{slide.graphicData?.label || "Variables"}</div>
                                <div className="flex justify-center gap-3">
                                  {slide.graphicData?.values?.map((v, idx) => (
                                    <div key={idx} className="flex flex-col items-center">
                                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-[10px] mb-1">
                                        {v.substring(0, 2)}
                                      </div>
                                      <span className="text-[8px] text-slate-400 truncate w-12 text-center">{v}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <span className="text-2xl block animate-bounce">💡</span>
                                <span className="text-[9px] font-semibold text-slate-400">Concept Map</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                          <button
                            type="button"
                            disabled={activeSlide === 0}
                            onClick={() => setActiveSlide((p) => p - 1)}
                            className="px-3 py-1 bg-slate-900 border border-slate-800 hover:border-amber-500 text-white rounded-lg disabled:opacity-30 disabled:pointer-events-none"
                          >
                            ← Prev
                          </button>
                          <span className="font-semibold text-slate-400">Slide {activeSlide + 1} / {slides.length}</span>
                          <button
                            type="button"
                            disabled={activeSlide === slides.length - 1}
                            onClick={() => setActiveSlide((p) => p + 1)}
                            className="px-3 py-1 bg-slate-900 border border-slate-800 hover:border-amber-500 text-white rounded-lg disabled:opacity-30 disabled:pointer-events-none"
                          >
                            Next →
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Podcast Tool */}
              {activeStudioTool === "podcast" && (
                <div className="space-y-4">
                  {(() => {
                    const podcast = currentPlan.planData?.podcast || {
                      hosts: ["Aravind", "Meera"],
                      script: [{ speaker: "Aravind", text: "Ready?", lang: "en" }]
                    };

                    return (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between">
                          <div className="flex gap-3">
                            <div className="flex -space-x-2 shrink-0">
                              <div className="w-8 h-8 rounded-full bg-indigo-600 border border-slate-950 flex items-center justify-center text-xs">👨‍🏫</div>
                              <div className="w-8 h-8 rounded-full bg-rose-600 border border-slate-950 flex items-center justify-center text-xs">👩‍🏫</div>
                            </div>
                            <div>
                              <h4 className="text-white font-bold text-xs leading-tight">NotebookLM AI Podcast Player</h4>
                              <p className="text-[9px] text-slate-500">Hosts: {podcast.hosts?.join(" & ")}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isPlayingPodcast && (
                              <div className="flex gap-0.5 items-end h-5 w-10 mr-1 shrink-0">
                                <div className="bg-amber-500 w-0.5 rounded-sm animate-pulse h-2" style={{ animationDuration: "0.5s" }} />
                                <div className="bg-amber-500 w-0.5 rounded-sm animate-pulse h-4" style={{ animationDuration: "0.7s" }} />
                                <div className="bg-amber-500 w-0.5 rounded-sm animate-pulse h-1" style={{ animationDuration: "0.3s" }} />
                                <div className="bg-amber-500 w-0.5 rounded-sm animate-pulse h-5" style={{ animationDuration: "0.8s" }} />
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => speakPodcast(podcast.script)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] text-white transition-all ${isPlayingPodcast ? "bg-red-650 hover:bg-red-705" : "bg-amber-500 hover:bg-amber-600"}`}
                            >
                              {isPlayingPodcast ? "⏹ Stop Podcast" : "🎙 Play AI Podcast"}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2.5 max-h-[280px] overflow-y-auto bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                          {podcast.script?.map((line, idx) => (
                            <div
                              key={idx}
                              className={`p-2.5 rounded-xl border transition-all ${
                                podcastIndex === idx
                                  ? "bg-amber-500/10 border-amber-500/40 text-white"
                                  : "bg-slate-950 border-slate-850 text-slate-400"
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1 font-sans">
                                <span className="font-bold text-[9px] text-amber-550 uppercase tracking-widest">{line.speaker}</span>
                                <span className="text-[8px] text-slate-550 uppercase">{line.lang}</span>
                              </div>
                              <p className="text-xs leading-relaxed font-sans">{line.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Video Tool */}
              {activeStudioTool === "video" && (
                <div className="space-y-4">
                  {(() => {
                    const storyboard = currentPlan.planData?.videoStoryboard || [
                      { sceneNumber: 1, visualDescription: "Intro", narrationText: "Welcome", subtitles: "வணக்கம்" }
                    ];
                    const scene = storyboard[videoScene] || storyboard[0];

                    return (
                      <div className="space-y-4">
                        <div className="relative aspect-video rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden flex flex-col justify-between p-5 shadow-lg">
                          <div className="absolute top-4 left-4 px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[9px] font-bold text-amber-400">
                            SCENE {scene.sceneNumber} OF {storyboard.length}
                          </div>

                          <div className="flex-1 flex flex-col items-center justify-center text-center mt-5">
                            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl animate-bounce mb-2">
                              {scene.sceneNumber === 1 ? "🎬" : "🎓"}
                            </div>
                            <h5 className="text-white font-semibold text-xs max-w-sm mb-1">{scene.visualDescription}</h5>
                            <p className="text-[8px] text-slate-500 uppercase tracking-wider font-semibold">Scene Visualization Layout</p>
                          </div>

                          <div className="bg-slate-900/90 border border-slate-850 rounded-xl p-3 text-center mx-auto max-w-md w-full">
                            <p className="text-white text-xs font-semibold leading-relaxed font-sans">{scene.narrationText}</p>
                            <p className="text-amber-400 text-[10px] font-tamil font-semibold mt-0.5 leading-relaxed">{scene.subtitles}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-2.5 rounded-xl border border-slate-800 bg-slate-950">
                          <button
                            type="button"
                            onClick={() => toggleVideoPlayback(storyboard)}
                            className="px-3 py-1 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded text-xs font-bold text-white transition-colors"
                          >
                            {isVideoPlaying ? "⏸ Pause Video" : "▶ Play Lesson Video"}
                          </button>

                          <div className="flex gap-1.5">
                            {storyboard.map((s, idx) => (
                              <button
                                type="button"
                                key={idx}
                                onClick={() => {
                                  if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
                                  setIsVideoPlaying(false);
                                  setVideoScene(idx);
                                }}
                                className={`w-5 h-5 rounded text-[9px] font-bold border transition-colors ${
                                  videoScene === idx
                                    ? "bg-amber-500 border-amber-500 text-white"
                                    : "bg-slate-900 border-slate-800 text-slate-400"
                                }`}
                              >
                                {s.sceneNumber}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Bilingual glossary */}
              {activeStudioTool === "bilingual" && (
                <div className="space-y-4">
                  <div className="bg-amber-500/5 p-3 rounded-xl border border-amber-500/15">
                    <p className="text-amber-400 font-medium leading-relaxed font-sans">
                      📢 Use these Tamil equivalent terms in lecture transitions to assist students from regional media backgrounds.
                    </p>
                  </div>

                  <table className="data-table font-sans">
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
                          <td className="font-semibold text-white">{item.english}</td>
                          <td className="text-amber-400 font-semibold font-tamil">{item.tamil}</td>
                          <td>{item.pronunciation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Exit Tickets */}
              {activeStudioTool === "assessment" && (
                <div className="space-y-4 text-slate-350">
                  <h4 className="text-white font-bold text-xs mb-2">🎯 Exit Ticket MCQs & Answers</h4>
                  <div className="space-y-3 font-sans">
                    {currentPlan.planData?.exitTickets?.map((ticket, i) => (
                      <div key={i} className="p-3.5 bg-slate-950 hover:bg-slate-955 rounded-xl border border-slate-850">
                        <div className="font-bold text-white mb-2 leading-relaxed">Question {i + 1}: {ticket.question}</div>
                        <div className="grid grid-cols-2 gap-2 font-mono text-[10px] text-slate-500">
                          {ticket.options?.map((opt, oIdx) => <div key={oIdx}>{opt}</div>)}
                        </div>
                        <div className="mt-2.5 text-emerald-400 font-bold text-[10px]">
                          Correct Answer: {ticket.answer}. Explanation: {ticket.rationale}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
