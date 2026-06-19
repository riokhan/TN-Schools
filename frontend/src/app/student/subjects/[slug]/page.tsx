"use client";

import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";

const subjectDetails: Record<string, any> = {
  "mathematics": {
    name: "Mathematics",
    teacher: "Mrs. Revathi",
    progress: 78,
    color: "#6366f1",
    bgClass: "from-indigo-600 to-indigo-400",
    icon: "📐",
    chapters: [
      { title: "Algebraic Expressions", status: "Completed", score: "92%" },
      { title: "Linear Equations", status: "Completed", score: "88%" },
      { title: "Understanding Quadrilaterals", status: "In Progress", score: "-" },
      { title: "Data Handling", status: "Not Started", score: "-" },
    ],
    assignments: [
      { title: "Algebra Worksheet", due: "Today, 11:59 PM", status: "Pending" },
      { title: "Chapter 2 Quiz Prep", due: "Tomorrow, 08:00 AM", status: "Pending" },
    ]
  },
  "science": {
    name: "Science",
    teacher: "Mr. Karthik",
    progress: 65,
    color: "#10b981",
    bgClass: "from-emerald-600 to-emerald-400",
    icon: "🔬",
    chapters: [
      { title: "Crop Production and Management", status: "Completed", score: "85%" },
      { title: "Microorganisms", status: "Completed", score: "90%" },
      { title: "Synthetic Fibres", status: "In Progress", score: "-" },
      { title: "Materials: Metals and Non-Metals", status: "Not Started", score: "-" },
    ],
    assignments: [
      { title: "Lab Report on Microorganisms", due: "Wednesday, 10:00 AM", status: "Pending" },
    ]
  },
  "tamil": {
    name: "Tamil",
    teacher: "Mr. Saravanan",
    progress: 88,
    color: "#f59e0b",
    bgClass: "from-amber-600 to-amber-400",
    icon: "📜",
    chapters: [
      { title: "தமிழ் மொழி மரபு", status: "Completed", score: "95%" },
      { title: "வினா வகைகள்", status: "Completed", score: "94%" },
      { title: "கவிதை பேழை", status: "Completed", score: "88%" },
      { title: "உரைநடை உலகம்", status: "In Progress", score: "-" },
    ],
    assignments: []
  },
  "english": {
    name: "English",
    teacher: "Ms. Priya",
    progress: 72,
    color: "#3b82f6",
    bgClass: "from-blue-600 to-blue-400",
    icon: "🗣️",
    chapters: [
      { title: "The Best Christmas Present", status: "Completed", score: "88%" },
      { title: "The Ant and the Cricket", status: "Completed", score: "82%" },
      { title: "Macavity: The Mystery Cat", status: "In Progress", score: "-" },
      { title: "The Summit Within", status: "Not Started", score: "-" },
    ],
    assignments: [
      { title: "Essay: My Inspiration", due: "Friday, 11:59 PM", status: "Pending" },
      { title: "Poem Recitation Video", due: "Next Monday", status: "Pending" },
      { title: "Grammar Quiz 4", due: "Next Tuesday", status: "Pending" }
    ]
  },
  "social-science": {
    name: "Social Science",
    teacher: "Mrs. Geetha",
    progress: 55,
    color: "#ec4899",
    bgClass: "from-pink-600 to-pink-400",
    icon: "🌍",
    chapters: [
      { title: "How, When and Where", status: "Completed", score: "78%" },
      { title: "From Trade to Territory", status: "Completed", score: "80%" },
      { title: "Ruling the Countryside", status: "In Progress", score: "-" },
      { title: "Tribals, Dikus", status: "Not Started", score: "-" },
    ],
    assignments: [
      { title: "Map Pointing Exercise", due: "Tomorrow, 05:00 PM", status: "Pending" },
    ]
  }
};

export default function SubjectDetailPage({ params }: { params: { slug: string } }) {
  const subject = subjectDetails[params.slug];

  if (!subject) {
    return (
      <PortalLayout title="Subject Not Found" subtitle="" avatarLetter="A">
         <div className="text-white">Subject details not found.</div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout
      title={`${subject.name} Workspace`}
      subtitle={`Teacher: ${subject.teacher}`}
      avatarLetter="A"
      avatarColor={subject.color}
      themeClass="theme-student"
      accentColor={subject.color}
    >
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/student/subjects" className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-semibold transition-colors w-fit">
          <span>←</span> Back to All Subjects
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Progress & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Header Card */}
          <div className="glass rounded-3xl p-6 border border-slate-700/50 relative overflow-hidden">
             <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${subject.bgClass} opacity-20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2`}></div>
             
             <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${subject.bgClass} flex items-center justify-center text-3xl shadow-lg`}>
                  {subject.icon}
                </div>
                <div>
                   <h2 className="text-2xl font-black text-white">{subject.name}</h2>
                   <p className="text-sm text-slate-400">{subject.progress}% Syllabus Completed</p>
                </div>
             </div>

             <div className="h-2 bg-slate-800/80 rounded-full overflow-hidden shadow-inner mb-6">
                <div 
                  className="h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${subject.progress}%`, background: `linear-gradient(90deg, ${subject.color}, ${subject.color}dd)` }}
                ></div>
             </div>

             <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-white font-bold transition-colors flex items-center justify-center gap-2">
                <span className="text-xl">🤖</span> Ask AI Tutor
             </button>
          </div>

          {/* Pending Assignments */}
          <div className="glass rounded-3xl p-6 border border-slate-700/50">
             <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
               <span className="text-xl">📝</span> Pending Tasks
             </h3>
             
             {subject.assignments.length === 0 ? (
               <div className="text-center py-6 bg-slate-900/50 rounded-xl border border-emerald-500/20">
                  <span className="text-3xl block mb-2">🎉</span>
                  <p className="text-emerald-400 font-bold text-sm">All caught up!</p>
                  <p className="text-xs text-slate-400 mt-1">No pending assignments.</p>
               </div>
             ) : (
               <ul className="space-y-3">
                 {subject.assignments.map((task: any, idx: number) => (
                   <li key={idx} className="bg-slate-900/60 p-4 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors group cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{task.title}</h4>
                        <span className="text-[10px] font-black uppercase px-2 py-1 bg-amber-500/20 text-amber-400 rounded-md">Pending</span>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1"><span>⏳</span> Due: {task.due}</p>
                   </li>
                 ))}
               </ul>
             )}
          </div>
          
        </div>

        {/* Right Column: Chapters & Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Syllabus/Chapters Tracker */}
          <div className="glass rounded-3xl p-6 border border-slate-700/50">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold text-white flex items-center gap-2">
                 <span className="text-xl">📚</span> Chapters & Modules
               </h3>
               <button className="text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 transition-colors">
                 Download Syllabus
               </button>
             </div>

             <div className="space-y-4">
               {subject.chapters.map((chapter: any, idx: number) => (
                 <div key={idx} className="bg-slate-900/40 p-4 rounded-2xl border border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0
                         ${chapter.status === 'Completed' ? `bg-emerald-500/20 text-emerald-400` : 
                           chapter.status === 'In Progress' ? `bg-blue-500/20 text-blue-400` : 
                           `bg-slate-800 text-slate-500`}`}
                       >
                         {idx + 1}
                       </div>
                       <div>
                          <h4 className={`text-sm font-bold ${chapter.status === 'Completed' ? 'text-white' : 'text-slate-300'}`}>
                            {chapter.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1">Status: <span className={chapter.status === 'Completed' ? 'text-emerald-400' : ''}>{chapter.status}</span></p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3 sm:ml-auto">
                       {chapter.status === 'Completed' && (
                         <div className="text-right mr-2">
                            <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Test Score</span>
                            <span className="text-sm font-black text-emerald-400">{chapter.score}</span>
                         </div>
                       )}
                       <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95
                         ${chapter.status === 'Not Started' 
                           ? 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700' 
                           : 'text-white bg-slate-700 hover:bg-slate-600 border border-slate-600'}`}
                         style={chapter.status === 'In Progress' ? { background: `linear-gradient(135deg, ${subject.color}, ${subject.color}dd)` } : {}}
                       >
                         {chapter.status === 'Completed' ? 'Review' : chapter.status === 'In Progress' ? 'Continue →' : 'Start'}
                       </button>
                    </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Learning Resources */}
          <div className="glass rounded-3xl p-6 border border-slate-700/50">
             <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
               <span className="text-xl">📁</span> Recommended Resources
             </h3>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700 flex flex-col items-center justify-center text-center cursor-pointer hover:border-slate-500 hover:bg-slate-800/80 transition-all group">
                   <div className="text-3xl mb-2 group-hover:-translate-y-1 transition-transform">📄</div>
                   <span className="text-xs font-bold text-slate-300">Class Notes</span>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700 flex flex-col items-center justify-center text-center cursor-pointer hover:border-slate-500 hover:bg-slate-800/80 transition-all group">
                   <div className="text-3xl mb-2 group-hover:-translate-y-1 transition-transform">🎥</div>
                   <span className="text-xs font-bold text-slate-300">Video Lectures</span>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700 flex flex-col items-center justify-center text-center cursor-pointer hover:border-slate-500 hover:bg-slate-800/80 transition-all group">
                   <div className="text-3xl mb-2 group-hover:-translate-y-1 transition-transform">📝</div>
                   <span className="text-xs font-bold text-slate-300">Previous Papers</span>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700 flex flex-col items-center justify-center text-center cursor-pointer hover:border-slate-500 hover:bg-slate-800/80 transition-all group">
                   <div className="text-3xl mb-2 group-hover:-translate-y-1 transition-transform">🧠</div>
                   <span className="text-xs font-bold text-slate-300">Flashcards</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </PortalLayout>
  );
}
