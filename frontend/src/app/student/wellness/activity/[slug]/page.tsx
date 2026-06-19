"use client";

import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";
import { useState, useEffect } from "react";

const activityData: Record<string, any> = {
  "mindfulness": {
    title: "5-Minute Focus Breathing",
    category: "Mindfulness",
    icon: "🌬️",
    duration: 300, // 5 minutes in seconds
    theme: { bg: "from-emerald-900/50 to-emerald-900/10", border: "border-emerald-500/30", text: "text-emerald-400", button: "bg-emerald-500 hover:bg-emerald-600" },
    instructions: [
      "Find a comfortable, quiet place to sit.",
      "Close your eyes and take a deep breath in through your nose.",
      "Hold for a few seconds, then exhale slowly through your mouth.",
      "Focus solely on the rhythm of your breath."
    ]
  },
  "physical-health": {
    title: "Study Break Stretches",
    category: "Physical Health",
    icon: "🤸‍♂️",
    duration: 600, // 10 minutes in seconds
    theme: { bg: "from-blue-900/50 to-blue-900/10", border: "border-blue-500/30", text: "text-blue-400", button: "bg-blue-500 hover:bg-blue-600" },
    instructions: [
      "Stand up from your desk and stretch your arms high above your head.",
      "Roll your shoulders backward 5 times, then forward 5 times.",
      "Gently tilt your head from side to side to stretch your neck.",
      "Touch your toes (or as far as you can comfortably reach) and hold for 10 seconds."
    ]
  },
  "mental-focus": {
    title: "Lofi Focus Beats",
    category: "Mental Focus",
    icon: "🎧",
    duration: 1800, // 30 minutes in seconds
    theme: { bg: "from-purple-900/50 to-purple-900/10", border: "border-purple-500/30", text: "text-purple-400", button: "bg-purple-500 hover:bg-purple-600" },
    instructions: [
      "Put on your headphones and adjust the volume to a comfortable level.",
      "Clear your workspace of any distractions.",
      "Set a specific goal for what you want to achieve during this focus session.",
      "Hit play and start working."
    ]
  },
  "habit": {
    title: "Digital Detox Challenge",
    category: "Habit",
    icon: "📵",
    duration: 7200, // 2 hours in seconds
    theme: { bg: "from-amber-900/50 to-amber-900/10", border: "border-amber-500/30", text: "text-amber-400", button: "bg-amber-500 hover:bg-amber-600" },
    instructions: [
      "Turn off notifications on your phone and tablet.",
      "Place your devices in another room or out of sight.",
      "Engage in an offline activity: read a physical book, draw, or take a walk.",
      "Reflect on how you feel after the detox."
    ]
  }
};

export default function ActivityPage({ params }: { params: { slug: string } }) {
  const data = activityData[params.slug] || activityData["mindfulness"];
  
  const [timeLeft, setTimeLeft] = useState(data.duration);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev: number) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Optional: Play a sound or show a completion modal here
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(data.duration);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((data.duration - timeLeft) / data.duration) * 100;

  return (
    <PortalLayout
      title={data.title}
      subtitle={`Category: ${data.category}`}
      avatarLetter="A"
      avatarColor="#10b981"
      themeClass="theme-student"
      accentColor="#10b981"
    >
      <div className="mb-4">
        <Link href="/student/wellness" className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-semibold transition-colors">
          <span>←</span> Back to Wellness Hub
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Timer Section */}
        <div className={`glass rounded-3xl p-10 flex flex-col items-center justify-center border-2 ${data.theme.border} bg-gradient-to-br ${data.theme.bg} relative overflow-hidden shadow-2xl`}>
          
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
             <div className={`h-full ${data.theme.button} transition-all duration-1000`} style={{ width: `${progress}%` }}></div>
          </div>

          <div className={`text-8xl mb-6 ${isActive ? 'animate-pulse' : ''}`}>{data.icon}</div>
          
          <div className="text-6xl font-mono font-black text-white mb-8 tracking-wider">
            {formatTime(timeLeft)}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={toggleTimer}
              className={`px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition-transform active:scale-95 ${data.theme.button}`}
            >
              {isActive ? 'Pause' : (timeLeft < data.duration ? 'Resume' : 'Start Session')}
            </button>
            <button 
              onClick={resetTimer}
              className="px-6 py-4 rounded-2xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-colors border border-slate-700"
            >
              Reset
            </button>
          </div>
          
          {timeLeft === 0 && (
            <div className="mt-6 text-emerald-400 font-bold animate-bounce text-lg">
              🎉 Session Completed! Great job!
            </div>
          )}
        </div>

        {/* Instructions Section */}
        <div className="glass rounded-3xl p-8 border border-slate-700/50">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-2xl">📋</span> How to do this
          </h2>
          <ul className="space-y-6">
            {data.instructions.map((step: string, idx: number) => (
              <li key={idx} className="flex items-start gap-4 group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${data.theme.border} ${data.theme.text} font-bold text-sm bg-slate-900 group-hover:scale-110 transition-transform`}>
                  {idx + 1}
                </div>
                <p className="text-slate-300 leading-relaxed mt-1 group-hover:text-white transition-colors">
                  {step}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-10 p-5 rounded-2xl bg-slate-900/60 border border-slate-700 flex items-start gap-4">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="text-white font-bold mb-1">Why is this important?</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Taking regular breaks and practicing {data.category.toLowerCase()} helps reduce cognitive load, lowers stress hormones, and dramatically improves your ability to retain information while studying.
              </p>
            </div>
          </div>
        </div>

      </div>
    </PortalLayout>
  );
}
