"use client";

import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";
import { useState } from "react";

const wellnessMetrics = [
  { label: "Daily Steps", value: "6,240", target: "8,000", icon: "🚶‍♂️", color: "from-blue-500 to-cyan-400", percent: 78 },
  { label: "Sleep Last Night", value: "7h 15m", target: "8h", icon: "😴", color: "from-indigo-500 to-purple-400", percent: 90 },
  { label: "Hydration", value: "4 Glasses", target: "8", icon: "💧", color: "from-sky-500 to-blue-400", percent: 50 },
  { label: "Mindfulness", value: "10 mins", target: "15", icon: "🧘‍♀️", color: "from-emerald-500 to-teal-400", percent: 66 },
];

const activities = [
  { title: "5-Minute Focus Breathing", category: "Mindfulness", time: "5 min", icon: "🌬️", color: "text-emerald-400", bg: "bg-emerald-900/20", border: "border-emerald-500/30", href: "/student/wellness/activity/mindfulness" },
  { title: "Study Break Stretches", category: "Physical Health", time: "10 min", icon: "🤸‍♂️", color: "text-blue-400", bg: "bg-blue-900/20", border: "border-blue-500/30", href: "/student/wellness/activity/physical-health" },
  { title: "Lofi Focus Beats", category: "Mental Focus", time: "30 min", icon: "🎧", color: "text-purple-400", bg: "bg-purple-900/20", border: "border-purple-500/30", href: "/student/wellness/activity/mental-focus" },
  { title: "Digital Detox Challenge", category: "Habit", time: "2 Hours", icon: "📵", color: "text-amber-400", bg: "bg-amber-900/20", border: "border-amber-500/30", href: "/student/wellness/activity/habit" },
];

export default function WellnessPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    { emoji: "🤩", label: "Great", color: "hover:bg-emerald-500/20 hover:border-emerald-500", active: "bg-emerald-500/30 border-emerald-500" },
    { emoji: "🙂", label: "Good", color: "hover:bg-blue-500/20 hover:border-blue-500", active: "bg-blue-500/30 border-blue-500" },
    { emoji: "😐", label: "Okay", color: "hover:bg-amber-500/20 hover:border-amber-500", active: "bg-amber-500/30 border-amber-500" },
    { emoji: "😫", label: "Stressed", color: "hover:bg-orange-500/20 hover:border-orange-500", active: "bg-orange-500/30 border-orange-500" },
    { emoji: "😴", label: "Tired", color: "hover:bg-purple-500/20 hover:border-purple-500", active: "bg-purple-500/30 border-purple-500" },
  ];

  return (
    <PortalLayout
      title="Student Wellness Hub"
      subtitle="Take a deep breath. Your mental and physical health matters just as much as your grades."
      avatarLetter="A"
      avatarColor="#10b981"
      themeClass="theme-student"
      accentColor="#10b981"
    >
      {/* Daily Check-in */}
      <div className="glass rounded-3xl p-6 mb-6 fade-in border border-emerald-500/20 bg-gradient-to-r from-emerald-900/10 to-transparent">
        <h2 className="text-lg font-bold text-white mb-2">How are you feeling today, Arjun?</h2>
        <p className="text-sm text-slate-400 mb-5">Your daily mood check-in helps us personalize your wellness recommendations.</p>
        
        <div className="flex flex-wrap gap-4">
          {moods.map((mood) => (
            <button
              key={mood.label}
              onClick={() => setSelectedMood(mood.label)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer min-w-[80px]
                ${selectedMood === mood.label ? mood.active : `border-slate-700/50 bg-slate-800/50 ${mood.color}`}
              `}
            >
              <span className="text-3xl mb-2">{mood.emoji}</span>
              <span className={`text-xs font-bold ${selectedMood === mood.label ? 'text-white' : 'text-slate-400'}`}>{mood.label}</span>
            </button>
          ))}
        </div>
        
        {selectedMood && (
          <div className="mt-5 p-4 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="text-2xl">🤖</div>
            <div>
              <p className="text-sm text-slate-300">
                {selectedMood === "Great" && "Awesome! Keep up the positive energy today!"}
                {selectedMood === "Good" && "Glad to hear it! Have a productive day."}
                {selectedMood === "Okay" && "That's perfectly fine. Take things one step at a time today."}
                {selectedMood === "Stressed" && "I hear you. Remember it's okay to take breaks. Try the 5-minute breathing exercise below."}
                {selectedMood === "Tired" && "Make sure you hydrate and try to get some early sleep tonight. Don't push too hard."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in-2">
        {wellnessMetrics.map((metric, idx) => (
          <div key={idx} className="glass rounded-2xl p-5 border border-slate-700/50 relative overflow-hidden group">
             <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${metric.color}`}></div>
             <div className="flex justify-between items-start mb-4">
                <span className="text-3xl bg-slate-800 p-2 rounded-xl group-hover:scale-110 transition-transform">{metric.icon}</span>
                <span className="text-xs font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded-lg">Goal: {metric.target}</span>
             </div>
             <h3 className="text-2xl font-black text-white mb-1">{metric.value}</h3>
             <p className="text-xs text-slate-400 font-medium">{metric.label}</p>
             <div className="mt-4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full bg-gradient-to-r ${metric.color}`} style={{ width: `${metric.percent}%` }}></div>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Recommended Activities */}
        <div className="lg:col-span-2 glass rounded-3xl p-6 fade-in-3 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-2xl">🌿</span> Wellness Activities
            </h2>
            <button className="text-sm font-bold text-emerald-400 hover:text-emerald-300">View Library →</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activities.map((act, idx) => (
              <Link href={act.href} key={idx} className={`block p-5 rounded-2xl border ${act.border} ${act.bg} hover:brightness-110 transition-all cursor-pointer group`}>
                <div className="flex justify-between items-start mb-4">
                   <div className="text-3xl bg-slate-900/50 p-2 rounded-xl group-hover:scale-110 transition-transform">{act.icon}</div>
                   <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-slate-900/50 ${act.color}`}>{act.category}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{act.title}</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-slate-300 flex items-center gap-1"><span>⏱️</span> {act.time}</span>
                  <button className={`text-sm font-bold ${act.color}`}>Start →</button>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* AI Counselor & Journal */}
        <div className="space-y-6 fade-in-4">
          
          {/* AI Companion */}
          <div className="glass rounded-3xl p-6 border border-slate-700/50 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl mb-4 shadow-lg shadow-purple-500/20">
              🫂
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Need someone to talk to?</h3>
            <p className="text-sm text-slate-400 mb-6">Our AI Wellness Companion is here to listen, completely anonymous and judgment-free.</p>
            <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold shadow-lg hover:bg-slate-200 transition-colors">
              Chat with AI Companion
            </button>
            <p className="text-[10px] text-slate-500 mt-4 text-center">
              If you are in distress, please contact the School Counselor at Ext: 204 or the National Student Helpline: 14446.
            </p>
          </div>

          {/* Gratitude Journal */}
          <div className="glass rounded-3xl p-6 border border-slate-700/50">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-xl">✍️</span> Gratitude Journal
            </h3>
            <textarea 
              placeholder="What are you thankful for today?"
              className="w-full h-24 bg-slate-900/60 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none mb-3"
            ></textarea>
            <button className="w-full py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-sm font-bold hover:bg-emerald-500/30 transition-colors">
              Save Entry
            </button>
          </div>

        </div>

      </div>
    </PortalLayout>
  );
}
