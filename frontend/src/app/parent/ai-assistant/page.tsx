"use client";
import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  time: string;
}

const suggestedPrompts = [
  "How can Priya improve in Science?",
  "Generate a weekly study schedule for Priya",
  "What scholarships is Priya eligible for?",
  "Check Priya's academic summary",
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "வணக்கம்! 👋 I am your AI Parent Assistant. I can help you track Priya's academic performance, suggest learning activities, or answer queries about school policies in English & Tamil.\n\n*(Hello! Ask me any questions about Priya's progress, homework, or exam prep!)*",
      time: "Now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<"bilingual" | "tamil" | "english">("bilingual");

  const simulatedResponses = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("science") || q.includes("improve")) {
      return `Priya has a solid average score in Mathematics (92%) and Tamil (93%). However, her score in **Science** was 72% in the midterm, though it improved to 81% in the half-yearly exam.\n\n**Suggestions for improvement:**\n1. Focus on drawing scientific diagrams (digestive system, electricity circuits).\n2. Practice Unit 3 (Structure of Atom) quizzes. I can recommend some modules.\n3. Make sure she reviews the feedback provided by Mr. Rajendran.`;
    }
    if (q.includes("schedule") || q.includes("timetable")) {
      return `Based on Priya's class syllabus and current strengths, here is a recommended weekly study schedule (1.5 hours daily):\n\n- **Monday & Wednesday:** Mathematics (6:00 PM - 7:15 PM) - focus on practicing problem sets.\n- **Tuesday & Thursday:** Science (6:00 PM - 7:15 PM) - focus on diagram labeling and formula reviews.\n- **Friday:** Social Science & English (5:30 PM - 7:00 PM).\n- **Saturday:** Tamil & revision of weak spots (10:00 AM - 11:30 AM).\n- **Sunday:** Complete relaxation & light reading.`;
    }
    if (q.includes("scholarship")) {
      return `Priya qualifies for two major schemes:\n\n1. **National Means-cum-Merit Scholarship (NMMS):** Requires score above 55% in Class 8 exams (Priya had 79%) and parents' annual income under ₹3.5 Lakhs.\n2. **TRUSTS (Tamil Nadu Rural Students Talent Search):** For government school students. Exam happens in September.\n\n**Action required:** The deadline to submit the application form and upload the income certificate is **June 30, 2025**.`;
    }
    if (q.includes("summary") || q.includes("academic") || q.includes("priya")) {
      return `Here is Priya's Academic Summary Profile:\n\n- **Current Class:** 9B\n- **Overall Grade:** A (Above average)\n- **Rank in Class:** #5 out of 42\n- **Attendance Rate:** 91%\n- **Top Subjects:** Tamil (93%), Mathematics (94%)\n- **Action Items:** Submit leave certificates for June 10-11 absence, and practice Science diagrams.`;
    }
    return `Thank you for your question! 🎯\n\nI am processing your query regarding: *"${query}"*.\n\n*(In production, this connects to Gemini AI with active school database records to retrieve exact stats and syllabus directives.)*`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = { role: "user", content: text, time: "Now" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate response delay
    setTimeout(() => {
      const responseContent = simulatedResponses(text);
      const aiMsg: ChatMessage = {
        role: "assistant",
        content: responseContent,
        time: "Now",
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <PortalLayout
      title="AI Parent Assistant"
      subtitle="Bilingual AI advisor to help you stay updated and guide Priya's studies"
    >
      {/* TODO: Connect to backend LLM chat controller API with Parent / Student system context */}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-180px)]">
        {/* Left Control Column */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Quick Language Toggle */}
          <div className="glass rounded-2xl p-4 fade-in">
            <div className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Assistant Language</div>
            <div className="flex flex-col gap-1">
              {(["bilingual", "tamil", "english"] as const).map((lang) => (
                <button
                  key={lang}
                  id={`ai-lang-${lang}`}
                  onClick={() => setActiveLanguage(lang)}
                  className={`text-left text-xs px-3 py-2 rounded-lg transition-all ${
                    activeLanguage === lang ? "bg-emerald-600 text-white" : "text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {lang === "bilingual" ? "🌐 Tamil + English" : lang === "tamil" ? "📜 Tamil Only" : "🗣️ English Only"}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions / Prompts */}
          <div className="glass rounded-2xl p-4 fade-in-2 flex-1 overflow-y-auto">
            <div className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Suggested Questions</div>
            <div className="flex flex-col gap-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-left text-xs px-3 py-2.5 rounded-xl text-slate-350 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all border border-slate-800 hover:border-emerald-500/20 leading-relaxed"
                >
                  💬 {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Interface Column */}
        <div className="lg:col-span-3 flex flex-col glass rounded-2xl overflow-hidden fade-in">
          {/* Chat Workspace Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-900/40">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-lg flex-shrink-0">
              🤖
            </div>
            <div>
              <div className="text-sm font-semibold text-white">AI Parent Assistant</div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="pulse-dot w-2 h-2"></span>
                Bilingual Mode Active
              </div>
            </div>
            <div className="ml-auto">
              <span className="badge badge-green">Priya - Class 9B</span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg, i) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div key={i} className={`flex gap-3 ${isAssistant ? "justify-start" : "justify-end"}`}>
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                      🤖
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      isAssistant
                        ? "bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700/80"
                        : "bg-emerald-600 text-white rounded-tr-sm"
                    }`}
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {msg.content}
                  </div>
                  {!isAssistant && (
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      R
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-sm">
                  🤖
                </div>
                <div className="bg-slate-800 border border-slate-700/80 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          {/* Message Input Form */}
          <div className="px-5 py-4 border-t border-slate-800 bg-slate-900/40">
            <div className="flex gap-3">
              <input
                id="ai-assistant-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask about grades, attendance, study schedules..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                id="ai-assistant-send-btn"
                onClick={() => handleSendMessage()}
                className="px-5 py-3 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-600 transition-all active:scale-95 flex-shrink-0"
              >
                Send
              </button>
            </div>
            <div className="flex gap-3 mt-2 text-[10px] text-slate-500">
              <button id="ai-assistant-voice-btn" className="hover:text-emerald-400 transition-colors">🎤 Voice Input</button>
              <span>·</span>
              <button id="ai-assistant-clear-btn" onClick={() => setMessages([messages[0]])} className="hover:text-red-400 transition-colors">🗑️ Clear Chat History</button>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
