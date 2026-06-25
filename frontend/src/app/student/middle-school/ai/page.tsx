"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useSession } from "next-auth/react";

export default function MiddleSchoolAIPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Student";
  const firstName = userName.split(" ")[0];

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: `Hi ${firstName}! I'm your AI Learning Buddy. 🤖 How can I help you today? You can ask me about science, math, history, or anything else you're curious about!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const predefinedPrompts = [
    "Tell me a fun science fact! 🔬",
    "How do volcanoes work? 🌋",
    "Give me a math puzzle 🧩",
    "Who built the Pyramids? 🏛️"
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const newUserMsg = {
      id: Date.now(),
      sender: "user",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        sender: "ai",
        text: "That's a great question! I'm still learning how to answer that in this demo, but you are super curious and that's awesome! Keep exploring! ✨",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1500);
  };

  return (
    <PortalLayout
      title="AI Learning Buddy 🤖"
      subtitle="Ask me anything! I'm here to help you learn and explore."
    >
      <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[500px] lg:h-[75vh] glass rounded-3xl border border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 overflow-hidden shadow-2xl relative fade-in">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10" />

        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center gap-4 z-10">
          <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30 animate-bounce-slow">
            🤖
          </div>
          <div>
            <h2 className="text-lg font-black text-black dark:text-white">SmartyBot</h2>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online & Ready
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10 scroll-smooth">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[95%] sm:max-w-[85%] lg:max-w-[75%] ${msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
            >
              <div className="flex items-end gap-2 mb-1">
                {msg.sender === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-sm border border-indigo-200 dark:border-indigo-700/50 shrink-0 mb-1">
                    🤖
                  </div>
                )}
                <div
                  className={`px-5 py-3 rounded-2xl shadow-sm relative ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-sm"
                      : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 font-medium rounded-bl-sm"
                  }`}
                >
                  <p className={`text-sm leading-relaxed ${msg.sender === "user" ? "!text-white font-medium" : "text-slate-900 dark:text-slate-50 font-medium"}`}>{msg.text}</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 px-10">{msg.time}</span>
            </div>
          ))}
          
          {/* Quick Prompts (only show if few messages) */}
          {messages.length < 3 && (
            <div className="mt-8">
              <p className="text-xs font-bold text-slate-500 mb-3 text-center uppercase tracking-wider">Try asking about...</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {predefinedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="px-4 py-2 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all hover:-translate-y-0.5 shadow-sm"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
            className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full px-2 py-2 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-inner"
          >
            <button type="button" className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
              📎
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question here..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-black dark:text-white placeholder:text-slate-400 px-2"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-10 h-10 rounded-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white flex items-center justify-center transition-colors shadow-md disabled:shadow-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1">
                <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
              </svg>
            </button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-slate-400 font-medium">SmartyBot can make mistakes. Always check with your teacher!</span>
          </div>
        </div>

      </div>
    </PortalLayout>
  );
}
