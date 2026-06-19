"use client";

import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AIBattlePage() {
  const [countdown, setCountdown] = useState(3);
  const [battleStarted, setBattleStarted] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);

  const questions = [
    { q: "What is 15 × 6?", options: ["80", "90", "100", "110"], answer: 1 },
    { q: "Who wrote the Thirukkural?", options: ["Kambar", "Bharathiyar", "Thiruvalluvar", "Avvaiyar"], answer: 2 },
    { q: "What is the capital of Tamil Nadu?", options: ["Madurai", "Coimbatore", "Chennai", "Trichy"], answer: 2 },
  ];

  // Start the initial countdown
  useEffect(() => {
    if (countdown > 0 && !battleStarted) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !battleStarted) {
      setBattleStarted(true);
    }
  }, [countdown, battleStarted]);

  // Simulate AI answering
  useEffect(() => {
    if (battleStarted && currentQ < questions.length) {
      // AI takes 2.5 seconds to answer
      const timer = setTimeout(() => {
        setAiScore(prev => prev + 1); // AI is smart, gets it right!
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [battleStarted, currentQ]);

  const handlePlayerAnswer = (index: number) => {
    if (index === questions[currentQ].answer) {
      setPlayerScore(prev => prev + 1);
    }
    
    if (currentQ < questions.length) {
      setCurrentQ(prev => prev + 1);
    }
  };

  return (
    <PortalLayout
      title="Rapid Fire AI Battle"
      subtitle="Race against the AI Tutor. Answer faster to win double XP!"
      avatarLetter="A"
      avatarColor="#6366f1"
      themeClass="theme-student"
      accentColor="#6366f1"
    >
      <div className="mb-6">
         <Link href="/student/middle-school/quizzes" className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors w-fit">
            <span>←</span> Flee the Battle
         </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        
        {/* Battle Arena Header */}
        <div className="flex items-center justify-between mb-10 bg-slate-900/50 p-6 rounded-3xl border border-slate-700/50 shadow-2xl">
           
           {/* Player Side */}
           <div className="flex flex-col items-center flex-1">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(99,102,241,0.5)] border-4 border-slate-800 mb-2">👦🏽</div>
              <h3 className="font-bold text-white">Arjun K.</h3>
              <div className="text-4xl font-black text-indigo-400 mt-2">{playerScore}</div>
           </div>

           {/* VS Badge */}
           <div className="px-6 flex flex-col items-center">
              <div className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-orange-500 mb-2">VS</div>
              <div className="w-0.5 h-10 bg-gradient-to-b from-transparent via-slate-500 to-transparent"></div>
           </div>

           {/* AI Side */}
           <div className="flex flex-col items-center flex-1">
              <div className="w-20 h-20 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center text-4xl mb-2 relative">
                 <span className="animate-pulse">🤖</span>
                 {battleStarted && currentQ < questions.length && (
                   <div className="absolute -top-2 -right-2 bg-indigo-500 w-4 h-4 rounded-full animate-ping"></div>
                 )}
              </div>
              <h3 className="font-bold text-slate-400">AI Tutor</h3>
              <div className="text-4xl font-black text-slate-500 mt-2">{aiScore}</div>
           </div>

        </div>

        {/* Game Stage */}
        <div className="glass rounded-3xl p-10 border border-slate-700/50 text-center min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
           
           {!battleStarted ? (
             <div className="animate-in zoom-in duration-500">
                <h2 className="text-2xl font-bold text-slate-400 mb-4">Get Ready...</h2>
                <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-600 drop-shadow-xl">
                  {countdown}
                </div>
             </div>
           ) : currentQ < questions.length ? (
             <div className="w-full max-w-2xl animate-in slide-in-from-right-8 duration-300">
                <div className="w-full bg-slate-800 h-1 rounded-full mb-8 overflow-hidden">
                   <div className="bg-indigo-500 h-full w-full animate-[shrink_5s_linear]"></div>
                </div>
                
                <h3 className="text-3xl font-black text-white mb-10">{questions[currentQ].q}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {questions[currentQ].options.map((opt, idx) => (
                     <button 
                       key={idx}
                       onClick={() => handlePlayerAnswer(idx)}
                       className="p-4 bg-slate-900/60 border border-slate-700 hover:border-indigo-500 hover:bg-slate-800 rounded-2xl text-lg font-bold text-white transition-all active:scale-95"
                     >
                       {opt}
                     </button>
                   ))}
                </div>
             </div>
           ) : (
             <div className="animate-in zoom-in duration-500">
                <div className="text-8xl mb-6">{playerScore > aiScore ? "🏆" : playerScore === aiScore ? "🤝" : "💀"}</div>
                <h2 className="text-4xl font-black text-white mb-2">
                  {playerScore > aiScore ? "You Won!" : playerScore === aiScore ? "It's a Tie!" : "AI Wins!"}
                </h2>
                <p className="text-slate-400 mb-8">
                  {playerScore > aiScore ? "You outsmarted the AI Tutor. Double XP awarded!" : "The AI was just a bit faster this time."}
                </p>
                <button 
                  onClick={() => {
                    setBattleStarted(false);
                    setCountdown(3);
                    setCurrentQ(0);
                    setPlayerScore(0);
                    setAiScore(0);
                  }}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                >
                  Rematch
                </button>
             </div>
           )}

        </div>

      </div>
    </PortalLayout>
  );
}
