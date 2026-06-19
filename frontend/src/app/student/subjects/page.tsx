"use client";

import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";

const subjectsData = [
  { 
    name: "Mathematics", 
    teacher: "Mrs. Revathi", 
    progress: 78, 
    color: "#6366f1", 
    gradient: "from-indigo-600 to-indigo-400",
    icon: "📐",
    nextClass: "Today, 10:30 AM",
    assignments: 2,
    chaptersCompleted: 11,
    totalChapters: 15
  },
  { 
    name: "Science", 
    teacher: "Mr. Karthik", 
    progress: 65, 
    color: "#10b981", 
    gradient: "from-emerald-600 to-emerald-400",
    icon: "🔬",
    nextClass: "Today, 01:15 PM",
    assignments: 1,
    chaptersCompleted: 9,
    totalChapters: 14
  },
  { 
    name: "Tamil", 
    teacher: "Mr. Saravanan", 
    progress: 88, 
    color: "#f59e0b", 
    gradient: "from-amber-600 to-amber-400",
    icon: "📜",
    nextClass: "Tomorrow, 09:00 AM",
    assignments: 0,
    chaptersCompleted: 12,
    totalChapters: 14
  },
  { 
    name: "English", 
    teacher: "Ms. Priya", 
    progress: 72, 
    color: "#3b82f6", 
    gradient: "from-blue-600 to-blue-400",
    icon: "🗣️",
    nextClass: "Tomorrow, 11:00 AM",
    assignments: 3,
    chaptersCompleted: 8,
    totalChapters: 12
  },
  { 
    name: "Social Science", 
    teacher: "Mrs. Geetha", 
    progress: 55, 
    color: "#ec4899", 
    gradient: "from-pink-600 to-pink-400",
    icon: "🌍",
    nextClass: "Wednesday, 10:00 AM",
    assignments: 1,
    chaptersCompleted: 7,
    totalChapters: 16
  },
  { 
    name: "Computer Science", 
    teacher: "Mr. Anand", 
    progress: 95, 
    color: "#8b5cf6", 
    gradient: "from-purple-600 to-purple-400",
    icon: "💻",
    nextClass: "Thursday, 02:00 PM",
    assignments: 0,
    chaptersCompleted: 9,
    totalChapters: 10
  },
];

export default function SubjectsPage() {
  return (
    <PortalLayout
      title="My Subjects"
      subtitle="Track your syllabus progress and access learning materials."
      avatarLetter="A"
      avatarColor="#6366f1"
      themeClass="theme-student"
      accentColor="#6366f1"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {subjectsData.map((subject, index) => (
          <div key={index} className="glass rounded-3xl p-6 border border-slate-700/50 hover:border-slate-500/50 hover:-translate-y-1 transition-all group relative overflow-hidden flex flex-col h-full">
            
            {/* Background Glow Effect */}
            <div 
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40"
              style={{ backgroundColor: subject.color }}
            ></div>

            {/* Header */}
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                {subject.icon}
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-white">{subject.progress}%</span>
                <span className="block text-xs text-slate-400 font-medium uppercase tracking-wider">Completed</span>
              </div>
            </div>

            {/* Subject Info */}
            <div className="mb-6 relative z-10">
              <h2 className="text-xl font-bold text-white mb-1">{subject.name}</h2>
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <span>👨‍🏫</span> {subject.teacher}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6 relative z-10">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-300 font-medium">Syllabus Progress</span>
                <span className="text-slate-400">{subject.chaptersCompleted} of {subject.totalChapters} Ch</span>
              </div>
              <div className="h-2 bg-slate-800/80 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full rounded-full transition-all duration-1000 relative" 
                  style={{ width: `${subject.progress}%`, background: `linear-gradient(90deg, ${subject.color}, ${subject.color}dd)` }}
                >
                   <div className="absolute top-0 right-0 bottom-0 w-6 bg-gradient-to-l from-white/30 to-transparent"></div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6 relative z-10 mt-auto">
               <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-700/50 flex flex-col justify-center">
                  <span className="text-xs text-slate-500 mb-1">Next Class</span>
                  <span className="text-sm font-semibold text-slate-200">{subject.nextClass}</span>
               </div>
               <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-700/50 flex flex-col justify-center">
                  <span className="text-xs text-slate-500 mb-1">Pending Tasks</span>
                  <span className={`text-sm font-semibold ${subject.assignments > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {subject.assignments > 0 ? `${subject.assignments} Assignments` : 'All caught up!'}
                  </span>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 relative z-10">
              <Link 
                href={`/student/subjects/${subject.name.toLowerCase().replace(" ", "-")}`}
                className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all active:scale-95 text-center flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${subject.color}, ${subject.color}dd)` }}
              >
                Go to Subject →
              </Link>
              <button 
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors tooltip-trigger relative group/btn"
              >
                🤖
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Ask AI Tutor
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended Focus Area */}
      <div className="glass rounded-3xl p-6 border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl shadow-lg shrink-0">
               🎯
            </div>
            <div>
               <h3 className="text-lg font-bold text-white mb-1">Recommended Focus: Social Science</h3>
               <p className="text-sm text-slate-300 leading-relaxed">
                 You are slightly behind in Social Science (55% completed). You have a pending assignment due this Wednesday.
               </p>
            </div>
         </div>
         <button className="whitespace-nowrap px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg active:scale-95">
            Start Learning Now
         </button>
      </div>

    </PortalLayout>
  );
}
