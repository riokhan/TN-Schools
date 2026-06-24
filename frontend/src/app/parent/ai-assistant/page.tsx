"use client";
import { useState, useEffect, useCallback } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useParentChildren, getApiBase, Child } from "@/lib/useParentChildren";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  time: string;
}

function ChildSwitcher({ childList, active, onChange }: { childList: Child[]; active: Child | null; onChange: (c: Child) => void }) {
  if (childList.length <= 1) return null;
  return (
    <div className="flex items-center gap-3 mb-5 p-3 glass rounded-2xl flex-wrap">
      <span className="text-xs text-slate-400 font-semibold">👶 Chatting about:</span>
      {childList.map(c => (
        <button key={c.studentId} onClick={() => onChange(c)}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            active?.studentId === c.studentId ? "bg-emerald-600 text-white shadow-md" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}>
          {c.name.split(" ")[0]} · Class {c.class}{c.section}
        </button>
      ))}
    </div>
  );
}

export default function AIAssistantPage() {
  const { parentId, children, activeChild, setActiveChild } = useParentChildren();
  const childName = activeChild?.name?.split(" ")[0] ?? "your child";
  const childLabel = activeChild ? `${activeChild.name} - Class ${activeChild.class}${activeChild.section}` : "Select a child";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<"bilingual" | "tamil" | "english">("bilingual");

  // Reset chat when child changes
  useEffect(() => {
    setMessages([{
      role: "assistant",
      content: `வணக்கம்! 👋 I am your AI Parent Assistant. I can help you track ${childName}'s academic performance, suggest learning activities, or answer queries about school policies in English & Tamil.\n\n*(Hello! Ask me any questions about ${childName}'s progress, homework, or exam prep!)*`,
      time: "Now",
    }]);
  }, [childName]);

  const suggestedPrompts = [
    `How can ${childName} improve in Science?`,
    `Generate a weekly study schedule for ${childName}`,
    `What scholarships is ${childName} eligible for?`,
    `Check ${childName}'s academic summary`,
  ];

  // Fetch real summary data for AI context
  const generateContextualResponse = useCallback(async (query: string): Promise<string> => {
    const q = query.toLowerCase();

    // Try fetching real data for context
    if (parentId && activeChild) {
      try {
        const summaryRes = await fetch(`${getApiBase()}/api/parent/${parentId}/child/${activeChild.studentId}/summary`);
        const summaryJson = await summaryRes.json();

        if (summaryJson.success) {
          const data = summaryJson.data;
          const kpis = data.kpis;

          if (q.includes("summary") || q.includes("academic") || q.includes(childName.toLowerCase())) {
            return `Here is ${childName}'s Academic Summary Profile:\n\n` +
              `- **Current Class:** ${data.class}${data.section}\n` +
              `- **Overall Grade:** ${kpis.grade.value} (${kpis.grade.raw}%)\n` +
              `- **Rank in Class:** ${kpis.rank.value} (${kpis.rank.sub})\n` +
              `- **Attendance Rate:** ${kpis.attendance.value}\n` +
              `- **Homework Submission:** ${kpis.homework.value}\n\n` +
              `*(Data pulled from live school records)*`;
          }

          if (q.includes("attendance")) {
            const pct = kpis.attendance.raw;
            const warning = pct < 85
              ? `\n\n⚠️ **Alert:** ${childName}'s attendance is below the 85% threshold. Frequent absences may affect grades and scholarship eligibility.`
              : `\n\n✅ ${childName}'s attendance is above the recommended 85% threshold — great job!`;
            return `${childName}'s current month attendance: **${kpis.attendance.value}**${warning}`;
          }
        }
      } catch {
        // offline — fall through to simulated
      }

      // Try performance data for subject questions
      if (q.includes("science") || q.includes("improve") || q.includes("subject")) {
        try {
          const perfRes = await fetch(`${getApiBase()}/api/parent/${parentId}/child/${activeChild.studentId}/performance`);
          const perfJson = await perfRes.json();
          if (perfJson.success && perfJson.data.subjects.length > 0) {
            const subjects = perfJson.data.subjects;
            const subjectSummary = subjects.map((s: any) => {
              const exams = Object.keys(s).filter(k => k !== "subject");
              const avg = exams.length > 0
                ? Math.round(exams.reduce((sum: number, e: string) => sum + (Number(s[e]) || 0), 0) / exams.length)
                : 0;
              return `- **${s.subject}:** ${avg}% average`;
            }).join("\n");

            return `Here are ${childName}'s subject-wise averages:\n\n${subjectSummary}\n\n` +
              `**Suggestions:** Focus on the subjects below 75% with extra practice sessions, diagram work, and regular revision.`;
          }
        } catch {/* offline */}
      }
    }

    // Fallback simulated responses
    if (q.includes("schedule") || q.includes("timetable")) {
      return `Based on ${childName}'s class syllabus, here is a recommended weekly study schedule (1.5 hours daily):\n\n` +
        `- **Monday & Wednesday:** Mathematics (6:00 PM - 7:15 PM) - focus on problem sets.\n` +
        `- **Tuesday & Thursday:** Science (6:00 PM - 7:15 PM) - diagram labeling & formulas.\n` +
        `- **Friday:** Social Science & English (5:30 PM - 7:00 PM).\n` +
        `- **Saturday:** Tamil & revision (10:00 AM - 11:30 AM).\n` +
        `- **Sunday:** Relaxation & light reading.`;
    }
    if (q.includes("scholarship")) {
      return `${childName} may qualify for these schemes:\n\n` +
        `1. **National Means-cum-Merit Scholarship (NMMS)**\n` +
        `2. **TRUSTS (Tamil Nadu Rural Students Talent Search)**\n` +
        `3. **BC/MBC Scholarship** — based on caste certificate\n` +
        `4. **SC/ST Scholarship** — if applicable\n\n` +
        `Contact the school office for eligibility details and application deadlines.`;
    }

    return `Thank you for your question! 🎯\n\nI am processing your query regarding: *"${query}"*.\n\n` +
      `*(In production, this connects to Gemini AI with active school database records to retrieve exact stats and syllabus directives.)*`;
  }, [parentId, activeChild, childName]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = { role: "user", content: text, time: "Now" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const responseContent = await generateContextualResponse(text);
    const aiMsg: ChatMessage = { role: "assistant", content: responseContent, time: "Now" };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  return (
    <PortalLayout
      title="AI Parent Assistant"
      subtitle={`Bilingual AI advisor to help you stay updated and guide ${childName}'s studies`}
    >
      <ChildSwitcher childList={children} active={activeChild} onChange={setActiveChild} />

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
                {activeLanguage === "bilingual" ? "Bilingual Mode" : activeLanguage === "tamil" ? "Tamil Mode" : "English Mode"} Active
              </div>
            </div>
            <div className="ml-auto">
              <span className="badge badge-green">{childLabel}</span>
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
                      P
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
                placeholder={`Ask about ${childName}'s grades, attendance, study schedules...`}
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
