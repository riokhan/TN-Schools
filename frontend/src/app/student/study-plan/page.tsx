"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import PortalLayout from "@/components/PortalLayout";
import Swal from "sweetalert2";
import InteractiveInfographic from "@/components/InteractiveInfographic";

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
  id?: string;
  subject: string;
  topic: string;
  grade: string;
  goals: string[];
  units: Unit[];
  infographic?: any;
  isTeacherPlan?: boolean;
  planData?: any;
  slides?: any[];
  podcast?: any;
  videoStoryboard?: any[];
  bilingual?: any[];
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

  // Intelligence Studio Tool Modals
  const [activeStudioTool, setActiveStudioTool] = useState<
    | "unit-infographic"
    | "unit-audio"
    | "unit-quiz"
    | "visualExplain"
    | "teacher-slides"
    | "teacher-podcast"
    | "teacher-video"
    | "teacher-bilingual"
    | "teacher-assessment"
    | null
  >(null);
  const [activeUnit, setActiveUnit] = useState<Unit | null>(null);

  // Audio Guide state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioLineIndex, setAudioLineIndex] = useState(-1);

  // Teacher plan integration states
  const [teacherPlans, setTeacherPlans] = useState<any[]>([]);
  const [loadingTeacherPlans, setLoadingTeacherPlans] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlayingPodcast, setIsPlayingPodcast] = useState(false);
  const [podcastIndex, setPodcastIndex] = useState(-1);
  const [videoScene, setVideoScene] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Interactive Quiz state per unit-question
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({}); // "unitId-qIdx" -> chosen option
  const [submittedQuizzes, setSubmittedQuizzes] = useState<Record<string, boolean>>({}); // "unitId-qIdx" -> true/false

  // Real-time Chat Tutor state (Middle panel)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Fetch teacher plans on mount
  useEffect(() => {
    const fetchTeacherPlans = async () => {
      try {
        setLoadingTeacherPlans(true);
        const res = await fetch(`${API_URL}/api/teacher/lessons`);
        const json = await res.json();
        if (json.success && json.data) {
          setTeacherPlans(json.data);
        }
      } catch (err) {
        console.error("Error fetching teacher plans", err);
      } finally {
        setLoadingTeacherPlans(false);
      }
    };
    fetchTeacherPlans();
  }, [API_URL]);

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
    reader.onload = async (event) => {
      try {
        if (file.name.endsWith(".pdf")) {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          
          // Load PDF.js from CDN dynamically
          const pdfjsLib = (window as any)['pdfjs-dist/build/pdf'];
          if (!pdfjsLib) {
            await new Promise<void>((resolve, reject) => {
              const script = document.createElement('script');
              script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
              script.onload = () => resolve();
              script.onerror = () => reject(new Error('Failed to load PDF script.'));
              document.head.appendChild(script);
            });
          }

          const pdfjs = (window as any)['pdfjs-dist/build/pdf'];
          pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

          const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
          const pdfDoc = await loadingTask.promise;
          let extractedText = "";

          for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(" ");
            extractedText += pageText + "\n";
          }

          setUploadedText(extractedText);
        } else {
          setUploadedText(event.target?.result as string);
        }

        setIsReadingFile(false);
        Swal.fire({
          icon: "success",
          title: "Study Guide PDF Uploaded!",
          text: `Successfully read and parsed ${file.name} context.`,
          timer: 1550,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error(err);
        setIsReadingFile(false);
        Swal.fire({
          icon: "error",
          title: "PDF Parsing Failed",
          text: "Could not extract text from the PDF file. Please copy-paste text instead.",
        });
      }
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
    setIsPlayingPodcast(false);
    setPodcastIndex(-1);
    setIsVideoPlaying(false);
    if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);

    // Reset active states, quiz answers, and chat logs
    setActiveUnit(null);
    setActiveStudioTool(null);
    setActiveSlide(0);
    setVideoScene(0);
    setSelectedAnswers({});
    setSubmittedQuizzes({});
    setChatInput("");
    setChatMessages([]);

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

  const loadTeacherPlan = (plan: any) => {
    window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
    setAudioLineIndex(-1);
    setIsPlayingPodcast(false);
    setPodcastIndex(-1);
    setIsVideoPlaying(false);
    if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);

    // Reset active unit, active tool modals, quiz states, and slides/video positions
    setActiveUnit(null);
    setActiveStudioTool(null);
    setActiveSlide(0);
    setVideoScene(0);
    setSelectedAnswers({});
    setSubmittedQuizzes({});
    setChatInput("");

    // Sync search configuration inputs in sidebar
    setSelectedSubject(plan.subject);
    setSelectedGrade(plan.grade);
    setTopic(plan.topic);

    // Map teacher lesson plan to study plan structure
    const mappedPlan: StudyPlan = {
      id: plan.id,
      subject: plan.subject,
      topic: plan.topic,
      grade: plan.grade,
      goals: plan.planData.objectives || [],
      units: plan.planData.timeline?.map((item: any, idx: number) => ({
        id: `t${idx}`,
        title: item.activity,
        summary: item.description,
        studyTime: item.time || "10 mins",
        infographicCard: {
          title: item.activity,
          formulas: [],
          keyConcepts: [item.description],
          illustrations: []
        },
        audioGuide: plan.planData.podcast?.script?.map((line: any) => ({
          speaker: line.speaker,
          text: line.text,
          lang: line.lang
        })) || [],
        quiz: plan.planData.exitTickets || []
      })) || [],
      infographic: plan.planData.infographic,
      isTeacherPlan: true,
      slides: plan.planData.slides || [],
      podcast: plan.planData.podcast || null,
      videoStoryboard: plan.planData.videoStoryboard || [],
      bilingual: plan.planData.bilingual || []
    };

    setCurrentPlan(mappedPlan);
    Swal.fire({
      icon: "success",
      title: "Teacher Plan Loaded!",
      text: `Loaded teacher guidelines for: ${plan.topic}`,
      timer: 1500,
      showConfirmButton: false
    });
  };

  // Intelligence Audio Podcast reader via browser SpeechSynthesis
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
      if (line.speaker.includes("Meera") || line.speaker.includes("Priya")) {
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
      if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <PortalLayout
      title="Personalized Study Plan (Intelligence Style)"
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

          {/* Teacher assigned plans list */}
          <div className="glass rounded-3xl p-5 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-transparent">
            <h3 className="text-black dark:text-white font-bold text-xs mb-3 flex items-center gap-2">
              <span>👩‍🏫</span> Teacher Assigned Lessons
            </h3>
            {loadingTeacherPlans ? (
              <div className="text-slate-400 text-xs animate-pulse font-sans">Loading assigned lessons...</div>
            ) : teacherPlans.length === 0 ? (
              <p className="text-[10px] text-slate-550 italic font-sans">No assigned lessons yet.</p>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-thin pr-1">
                {teacherPlans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => loadTeacherPlan(plan)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs font-semibold ${
                      currentPlan?.id === plan.id
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                        : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-355 hover:border-slate-350"
                    }`}
                  >
                    <span className="block truncate font-bold">{plan.topic}</span>
                    <span className="text-[9px] text-slate-450 dark:text-slate-450 block mt-0.5 font-medium">{plan.subject} · {plan.grade}</span>
                  </button>
                ))}
              </div>
            )}
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
                  <span className="text-indigo-400 lowercase">Connected to Gemini 2.5</span>
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
            <span>🎨</span> Intelligence Studio
          </h2>
          
          {!currentPlan ? (
            <p className="text-[10px] text-slate-500 italic px-1 font-sans">Unlock Studio tools by generating a study plan.</p>
          ) : (
            <div className="space-y-4">
              {/* Teacher-assigned Lesson Plan specific tools */}
              {currentPlan.isTeacherPlan && (
                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 rounded-2xl space-y-2">
                  <div className="text-[10px] font-black text-slate-450 uppercase tracking-widest px-1">Teacher Guidelines</div>
                  <div className="grid grid-cols-1 gap-1.5">
                    <button
                      onClick={() => {
                        setActiveSlide(0);
                        setActiveStudioTool("teacher-slides");
                      }}
                      className="w-full text-left p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-xl transition-colors text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                    >
                      <span>🖼️</span> Concept Slide Deck
                    </button>

                    <button
                      onClick={() => {
                        setPodcastIndex(-1);
                        setActiveStudioTool("teacher-podcast");
                      }}
                      className="w-full text-left p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-xl transition-colors text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                    >
                      <span>🎙️</span> Bilingual Audio Podcast
                    </button>

                    <button
                      onClick={() => {
                        setVideoScene(0);
                        setActiveStudioTool("teacher-video");
                      }}
                      className="w-full text-left p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-xl transition-colors text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                    >
                      <span>🎬</span> Lesson Storyboard Video
                    </button>

                    <button
                      onClick={() => {
                        setActiveStudioTool("teacher-bilingual");
                      }}
                      className="w-full text-left p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-xl transition-colors text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                    >
                      <span>🗣️</span> Bilingual Dictionary
                    </button>

                    <button
                      onClick={() => {
                        setActiveStudioTool("teacher-assessment");
                      }}
                      className="w-full text-left p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-xl transition-colors text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                    >
                      <span>🎯</span> Class Exit Tickets
                    </button>
                  </div>
                </div>
              )}

              {/* Grand Topic Infographic Visual Explain */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 rounded-2xl space-y-2">
                <div className="text-[10px] font-black text-slate-450 uppercase tracking-widest px-1">Grand Overview</div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveUnit(currentPlan.units[0] || null);
                    setActiveStudioTool("visualExplain");
                  }}
                  className="w-full text-left p-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-250 dark:border-indigo-800 hover:border-indigo-500 rounded-xl transition-all text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2"
                >
                  <span>📊</span> Topic Visual Explain
                </button>
              </div>

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
      {activeStudioTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-6xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">
                  {activeStudioTool === "visualExplain" ? "Grand Overview" : activeUnit?.title || "Lesson Guidelines"}
                </span>
                <h3 className="text-white font-black text-sm">
                  {activeStudioTool === "visualExplain" && "📊 Intelligence Visual Explain"}
                  {activeStudioTool === "unit-infographic" && "🖼️ Unit Cheat Sheet Infographic"}
                  {activeStudioTool === "unit-audio" && "🎙️ Intelligence AI Audio Buddy"}
                  {activeStudioTool === "unit-quiz" && "📝 Interactive mock Quiz"}
                  {activeStudioTool === "teacher-slides" && "🖼️ Teacher Guideline Slides"}
                  {activeStudioTool === "teacher-podcast" && "🎙️ Teacher Bilingual Podcast"}
                  {activeStudioTool === "teacher-video" && "🎬 Lesson Storyboard Video"}
                  {activeStudioTool === "teacher-bilingual" && "🗣️ Bilingual Vocabulary Dictionary"}
                  {activeStudioTool === "teacher-assessment" && "🎯 Class Exit Ticket Quiz"}
                </h3>
              </div>
            <div className="flex items-center gap-3 font-sans">
              {activeStudioTool === "visualExplain" && currentPlan && (
                <a
                  href={`/infographic-view?planId=${currentPlan.id || "temp-unsaved"}&topic=${encodeURIComponent(currentPlan.topic)}&subject=${encodeURIComponent(currentPlan.subject)}&role=student`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (!currentPlan.id || currentPlan.id === "temp-unsaved") {
                      localStorage.setItem("tempInfographicData", JSON.stringify(currentPlan.planData?.infographic || currentPlan.infographic));
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-[10.5px] uppercase tracking-wider transition-colors flex items-center gap-1 shadow-md hover:scale-105"
                >
                  ↗️ Open Separate Page
                </a>
              )}
              <button
                type="button"
                onClick={() => {
                  setActiveStudioTool(null);
                  setActiveUnit(null);
                  window.speechSynthesis.cancel();
                  setIsPlayingAudio(false);
                  setAudioLineIndex(-1);
                  setIsPlayingPodcast(false);
                  setPodcastIndex(-1);
                  setIsVideoPlaying(false);
                  if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
                }}
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-500 border border-slate-850 flex items-center justify-center font-bold text-sm transition-all"
              >
                ✕
              </button>
            </div>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 max-h-[78vh] text-xs">
              
              {/* Visual Infographic Tool */}
              {activeStudioTool === "visualExplain" && currentPlan && (
                <InteractiveInfographic 
                  key={currentPlan.topic}
                  topic={currentPlan.topic} 
                  subject={currentPlan.subject} 
                  data={currentPlan.infographic} 
                />
              )}

              {/* Teacher Slides Tool */}
              {activeStudioTool === "teacher-slides" && currentPlan && (
                <div className="space-y-4 flex flex-col justify-between h-full">
                  {(() => {
                    const slides = currentPlan.slides || [
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
                        {/* Glowing Blueprint Slide Container */}
                         <div className="bg-slate-950 border border-cyan-500/30 bg-[linear-gradient(rgba(10,15,30,0.96),rgba(10,15,30,0.96)),linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] shadow-[0_0_25px_rgba(6,182,212,0.2)] rounded-3xl relative p-6 md:p-8 text-slate-100 min-h-[350px] flex flex-col justify-between overflow-hidden">
                          <div className="absolute top-2 left-2 text-cyan-500/40 font-mono text-[8px] font-bold">+ 0.00</div>
                          <div className="absolute top-2 right-2 text-cyan-500/40 font-mono text-[8px] font-bold">+ 1.00</div>
                          <div className="absolute bottom-2 left-2 text-cyan-500/40 font-mono text-[8px] font-bold">- 1.00</div>
                          
                          {/* Slide Header */}
                          <div className="text-center border-b border-cyan-500/10 pb-4">
                            <span className="text-[9px] text-amber-500 font-mono font-bold uppercase tracking-wider block mb-1">Slide {activeSlide + 1} of {slides.length}</span>
                            <h4 className="text-amber-400 font-extrabold text-base md:text-xl font-tamil tracking-wide drop-shadow-[0_0_6px_rgba(245,158,11,0.3)]">
                              {slide.title}
                            </h4>
                            <p className="text-cyan-400 font-bold text-[10px] uppercase tracking-widest mt-1">
                              {slide.subtitle || "Concept Overview"}
                            </p>
                          </div>

                          {/* Slide Content Grid */}
                          <div className="flex flex-col md:flex-row gap-6 items-center flex-grow mt-6 z-10">
                            <div className="flex-1 space-y-4">
                              <ul className="space-y-3 font-sans list-none">
                                {slide.bullets?.map((bullet: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-2.5 text-slate-200 text-xs md:text-sm">
                                    <span className="text-cyan-400 font-extrabold mt-0.5">•</span>
                                    <span className="leading-relaxed">{bullet}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="w-full md:w-64 p-4 rounded-2xl border border-cyan-500/20 bg-slate-900/40 flex flex-col items-center justify-center text-center shadow-[0_0_15px_rgba(6,182,212,0.1)] shrink-0 min-h-[160px] relative">
                              {slide.title.toLowerCase().includes("nasa") || slide.title.toLowerCase().includes("orbiter") || slide.title.toLowerCase().includes("விண்கலம்") || slide.title.toLowerCase().includes("அலகுகள்") || slide.title.toLowerCase().includes("loss") ? (
                                <svg viewBox="0 0 100 100" className="w-24 h-24 stroke-cyan-400 fill-none">
                                  <circle cx="50" cy="50" r="10" strokeWidth="1.5" />
                                  <rect x="15" y="46" width="25" height="8" strokeWidth="1.2" fill="rgba(6,182,212,0.1)" />
                                  <rect x="60" y="46" width="25" height="8" strokeWidth="1.2" fill="rgba(6,182,212,0.1)" />
                                  <line x1="27" y1="46" x2="27" y2="54" strokeWidth="1" />
                                  <line x1="33" y1="46" x2="33" y2="54" strokeWidth="1" />
                                  <line x1="67" y1="46" x2="67" y2="54" strokeWidth="1" />
                                  <line x1="73" y1="46" x2="73" y2="54" strokeWidth="1" />
                                  <line x1="50" y1="40" x2="50" y2="20" strokeWidth="1.5" />
                                  <circle cx="50" cy="18" r="2" fill="#06b6d4" />
                                  <path d="M 45 60 L 55 60 L 58 70 L 42 70 Z" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" strokeWidth="1" />
                                  <path d="M 20 85 Q 50 75 80 85" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" />
                                </svg>
                              ) : slide.title.toLowerCase().includes("விசை") || slide.title.toLowerCase().includes("அழுத்தம்") || slide.title.toLowerCase().includes("force") || slide.title.toLowerCase().includes("pressure") || slide.title.toLowerCase().includes("பருப்பொருள்") ? (
                                <svg viewBox="0 0 100 100" className="w-24 h-24 stroke-cyan-400 fill-none">
                                  <path d="M 25 70 L 40 45 L 45 25 M 40 45 L 53 20 M 40 45 L 63 24 M 40 45 L 70 35 M 40 45 L 48 70 Z" strokeWidth="1.5" strokeLinecap="round" />
                                  <circle cx="45" cy="25" r="2.5" fill="#06b6d4" />
                                  <circle cx="53" cy="20" r="2.5" fill="#06b6d4" />
                                  <circle cx="63" cy="24" r="2.5" fill="#06b6d4" />
                                  <circle cx="70" cy="35" r="2.5" fill="#06b6d4" />
                                  <line x1="30" y1="45" x2="80" y2="45" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
                                  <polygon points="80,42 88,45 80,48" fill="#f59e0b" stroke="#f59e0b" />
                                  <circle cx="35" cy="60" r="6" strokeWidth="1" />
                                  <circle cx="45" cy="65" r="4" strokeWidth="1" />
                                </svg>
                              ) : (
                                <svg viewBox="0 0 100 100" className="w-24 h-24 stroke-cyan-400 fill-none">
                                  <circle cx="50" cy="50" r="30" strokeWidth="1" strokeDasharray="3 3" />
                                  <circle cx="50" cy="50" r="22" strokeWidth="1.5" />
                                  <circle cx="50" cy="50" r="6" fill="#06b6d4" />
                                  <line x1="15" y1="50" x2="85" y2="50" strokeWidth="1" />
                                  <line x1="50" y1="15" x2="50" y2="85" strokeWidth="1" />
                                  <circle cx="38" cy="38" r="2" fill="#f59e0b" />
                                  <circle cx="62" cy="38" r="2" fill="#f59e0b" />
                                  <circle cx="38" cy="62" r="2" fill="#f59e0b" />
                                  <circle cx="62" cy="62" r="2" fill="#f59e0b" />
                                </svg>
                              )}
                              <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest mt-2">Diagram Sandbox</span>
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-4 text-cyan-500/40 font-mono text-[9px] uppercase tracking-widest z-0 flex items-center gap-1 font-bold">
                            <span>Intelligence</span>
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

              {/* Teacher Podcast Tool */}
              {activeStudioTool === "teacher-podcast" && currentPlan && (
                <div className="space-y-4">
                  {(() => {
                    const podcast = currentPlan.podcast || {
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
                              <h4 className="text-white font-bold text-xs leading-tight">Intelligence AI Podcast Player</h4>
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
                              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] text-white transition-all ${isPlayingPodcast ? "bg-red-650 hover:bg-red-700" : "bg-amber-500 hover:bg-amber-600"}`}
                            >
                              {isPlayingPodcast ? "⏹ Stop Podcast" : "🎙 Play AI Podcast"}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2.5 max-h-[280px] overflow-y-auto bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                          {podcast.script?.map((line: any, idx: number) => (
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

              {/* Teacher Video Tool */}
              {activeStudioTool === "teacher-video" && currentPlan && (
                <div className="space-y-4">
                  {(() => {
                    const storyboard = currentPlan.videoStoryboard || [
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
                            {storyboard.map((s: any, idx: number) => (
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

              {/* Teacher Bilingual glossary */}
              {activeStudioTool === "teacher-bilingual" && currentPlan && (
                <div className="space-y-4">
                  <div className="bg-amber-500/5 p-3 rounded-xl border border-amber-500/15">
                    <p className="text-amber-400 font-medium leading-relaxed font-sans text-[11px]">
                      📢 Use these Tamil equivalent terms in transitions to assist with regional media backgrounds.
                    </p>
                  </div>

                  <table className="w-full text-left text-xs font-sans text-slate-350 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <th className="py-2.5">English Term</th>
                        <th className="py-2.5">Tamil Equivalent</th>
                        <th className="py-2.5">Phonetic / Pronunciation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 text-slate-200">
                      {currentPlan.bilingual?.map((item: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-900/60 transition-colors">
                          <td className="py-3 font-semibold text-white">{item.english}</td>
                          <td className="py-3 text-amber-450 font-semibold font-tamil">{item.tamil}</td>
                          <td className="py-3 text-slate-400">{item.pronunciation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Teacher Assessment */}
              {activeStudioTool === "teacher-assessment" && currentPlan && (
                <div className="space-y-4 text-slate-350">
                  <h4 className="text-white font-bold text-xs mb-2">🎯 Exit Ticket MCQs & Answers</h4>
                  <div className="space-y-3 font-sans">
                    {currentPlan.units?.flatMap((u: any) => u.quiz || [])?.map((ticket: any, i: number) => (
                      <div key={i} className="p-3.5 bg-slate-950 hover:bg-slate-955 rounded-xl border border-slate-850">
                        <div className="font-bold text-white mb-2 leading-relaxed">Question {i + 1}: {ticket.question}</div>
                        <div className="grid grid-cols-2 gap-2 font-mono text-[10px] text-slate-500">
                          {ticket.options?.map((opt: string, oIdx: number) => <div key={oIdx}>{opt}</div>)}
                        </div>
                        <div className="mt-2.5 text-emerald-400 font-bold text-[10px]">
                          Correct Answer: {ticket.answer}. Explanation: {ticket.rationale}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
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
                        onClick={() => playAudioGuide(activeUnit.audioGuide)}
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
