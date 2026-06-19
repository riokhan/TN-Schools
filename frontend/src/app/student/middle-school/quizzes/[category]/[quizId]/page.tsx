"use client";

import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function ActiveQuizPage() {
  const params = useParams();
  const slug = params?.category as string;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const questions = [
    {
      q: "What is the largest planet in our Solar System?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"],
      correct: 2
    },
    {
      q: "Which force keeps the planets in orbit around the Sun?",
      options: ["Magnetism", "Gravity", "Friction", "Electricity"],
      correct: 1
    },
    {
      q: "How many moons does Mars have?",
      options: ["1", "2", "14", "79"],
      correct: 1
    }
  ];

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <PortalLayout
      title="Quiz Gameplay"
      subtitle="The Solar System Speed Run"
      avatarLetter="A"
      avatarColor="#10b981"
      themeClass="theme-student"
      accentColor="#10b981"
    >
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
           <Link href={`/student/middle-school/quizzes/${slug}`} className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
              <span>←</span> Quit Quiz
           </Link>
           <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-700 font-bold text-emerald-400">
             Score: {score} / {questions.length}
           </div>
        </div>

        {!isFinished ? (
          <div className="glass rounded-3xl p-8 border border-slate-700/50 relative overflow-hidden">
             {/* Progress Bar */}
             <div className="w-full bg-slate-800 h-2 rounded-full mb-8 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
                ></div>
             </div>

             <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Question {currentQuestion + 1} of {questions.length}</h2>
             <h3 className="text-2xl font-black text-white mb-8">{questions[currentQuestion].q}</h3>

             <div className="space-y-4 mb-8">
                {questions[currentQuestion].options.map((opt, idx) => {
                  let btnClass = "bg-slate-900/60 border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800 text-white";
                  
                  if (isAnswered) {
                    if (idx === questions[currentQuestion].correct) {
                      btnClass = "bg-emerald-500/20 border-emerald-500 text-emerald-400"; // Correct answer is always highlighted
                    } else if (idx === selectedAnswer) {
                      btnClass = "bg-red-500/20 border-red-500 text-red-400"; // Wrong selected answer
                    } else {
                      btnClass = "bg-slate-900/30 border-slate-800 text-slate-500 opacity-50"; // Other unselected answers fade out
                    }
                  }

                  return (
                    <button 
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={`w-full text-left px-6 py-4 rounded-2xl border-2 font-bold text-lg transition-all ${btnClass}`}
                    >
                      {opt}
                    </button>
                  );
                })}
             </div>

             {isAnswered && (
               <div className="flex justify-end animate-in fade-in slide-in-from-bottom-4">
                  <button 
                    onClick={nextQuestion}
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-colors"
                  >
                    {currentQuestion === questions.length - 1 ? "See Results" : "Next Question →"}
                  </button>
               </div>
             )}
          </div>
        ) : (
          <div className="glass rounded-3xl p-10 border border-emerald-500/30 text-center bg-gradient-to-b from-emerald-900/20 to-transparent">
             <div className="text-8xl mb-6">🏆</div>
             <h2 className="text-3xl font-black text-white mb-2">Quiz Complete!</h2>
             <p className="text-slate-400 mb-8">You scored {score} out of {questions.length}</p>
             
             <div className="flex justify-center gap-6 mb-10">
                <div className="bg-slate-900/60 px-6 py-4 rounded-2xl border border-amber-500/30">
                   <span className="block text-xs uppercase font-bold text-slate-400 mb-1">XP Earned</span>
                   <span className="block text-3xl font-black text-amber-400">+{score * 50}</span>
                </div>
                <div className="bg-slate-900/60 px-6 py-4 rounded-2xl border border-emerald-500/30">
                   <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Accuracy</span>
                   <span className="block text-3xl font-black text-emerald-400">{Math.round((score / questions.length) * 100)}%</span>
                </div>
             </div>

             <div className="flex justify-center gap-4">
                <Link href={`/student/middle-school/quizzes/${slug}`} className="px-6 py-3 border border-slate-600 hover:bg-slate-800 rounded-xl font-bold text-white transition-colors">
                  Back to Topic
                </Link>
                <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-white shadow-lg shadow-emerald-500/20 transition-colors">
                  Play Again
                </button>
             </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
