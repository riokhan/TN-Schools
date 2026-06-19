"use client";

import PortalLayout from "@/components/PortalLayout";

const navItems = [
  { label: "Dashboard", href: "/student/middle-school", icon: "🏠" },
  { label: "My Badges", href: "/student/middle-school/badges", icon: "🏅" },
  { label: "Fun Quizzes", href: "/student/middle-school/quizzes", icon: "🎮" },
  { label: "Story Books", href: "/student/middle-school/stories", icon: "📚" },
  { label: "AI Helper", href: "/student/middle-school/ai", icon: "🤖" },
  
  // Common Student Menu
  { label: "---", href: "#", icon: "" },
  { label: "Common Tools", href: "#", icon: "" },
  { label: "My Subjects", href: "/student/subjects", icon: "📖" },
  { label: "Virtual Labs", href: "/student/labs", icon: "🧪" },
  { label: "Homework", href: "/student/homework", icon: "📝" },
  { label: "Digital Portfolio", href: "/student/middle-school/portfolio", icon: "🗂️" },
  { label: "Extracurriculars", href: "/student/activities", icon: "🎭" },
  { label: "Sports & Athletics", href: "/student/sports", icon: "⚽" },
  { label: "Wellness", href: "/student/wellness", icon: "💚" },
  { label: "Coding Academy", href: "/student/coding", icon: "💻" },
];

const projects = [
  { title: "Solar System Model", subject: "Science", date: "Last Week", type: "Craft", grade: "Super Star! ⭐", icon: "🪐", color: "#10b981" },
  { title: "My Favorite Animal Essay", subject: "English", date: "2 Weeks Ago", type: "Writing", grade: "Great Job! 👍", icon: "🐶", color: "#f59e0b" },
  { title: "Math Puzzle Challenge", subject: "Mathematics", date: "Last Month", type: "Game", grade: "Math Wizard! 🧙‍♂️", icon: "🧩", color: "#6366f1" },
  { title: "History of Cholas", subject: "Social Science", date: "Last Month", type: "Drawing", grade: "Creative! 🎨", icon: "👑", color: "#ec4899" }
];

const badges = [
  { name: "Super Reader", description: "Read 10 story books this month!", icon: "📖", color: "from-emerald-400 to-teal-500" },
  { name: "Math Ninja", description: "Solved all puzzles perfectly!", icon: "🥷", color: "from-indigo-400 to-purple-500" },
  { name: "Kindness Star", description: "Helped a classmate today!", icon: "⭐", color: "from-amber-400 to-orange-500" },
  { name: "Science Explorer", description: "Completed 5 virtual lab experiments", icon: "🔬", color: "from-blue-400 to-cyan-500" }
];

const skills = [
  { name: "Creativity ✨", level: 90, color: "#f59e0b" },
  { name: "Teamwork 🤝", level: 85, color: "#10b981" },
  { name: "Curiosity 🕵️‍♂️", level: 95, color: "#ec4899" },
  { name: "Focus 🎯", level: 70, color: "#3b82f6" }
];

export default function MiddleSchoolPortfolio() {
  return (
    <PortalLayout
      title="My Fun Portfolio 🎨"
      subtitle="Look at all the awesome things you have done, Arjun!"
      avatarLetter="A"
      avatarColor="#10b981"
      navItems={navItems}
      themeClass="theme-student"
      accentColor="#10b981"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Profile Summary */}
        <div className="glass rounded-3xl p-6 fade-in flex flex-col items-center text-center border-2 border-emerald-500/20 bg-emerald-900/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <div className="relative">
             <div className="w-28 h-28 rounded-full flex items-center justify-center text-5xl font-bold mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)] border-4 border-emerald-400"
                  style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white" }}>
               A
             </div>
             <div className="absolute -bottom-2 -right-2 text-4xl animate-bounce" style={{ animationDuration: '3s' }}>
                🌟
             </div>
          </div>
          <h2 className="text-2xl font-black text-white mb-1 tracking-wide">Arjun Kumar</h2>
          <p className="text-sm font-bold text-emerald-400 mb-5">Class 7B • Roll No. 12</p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <span className="px-4 py-1.5 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border-2 border-amber-500/30 shadow-sm">🚀 Space Lover</span>
            <span className="px-4 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold border-2 border-purple-500/30 shadow-sm">🎨 Artist</span>
          </div>
          <div className="w-full bg-slate-900/50 rounded-2xl p-4 border border-slate-700/50">
             <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-slate-300 flex items-center gap-2"><span>📂</span> Awesome Projects</span>
                <span className="text-base font-black text-emerald-400">18</span>
             </div>
             <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-slate-300 flex items-center gap-2"><span>🏅</span> Badges Collected</span>
                <span className="text-base font-black text-amber-400">{badges.length}</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-300 flex items-center gap-2"><span>🏆</span> Current Level</span>
                <span className="text-base font-black text-purple-400">Lvl 12</span>
             </div>
          </div>
        </div>

        {/* Featured Projects */}
        <div className="lg:col-span-2 glass rounded-3xl p-6 fade-in-2 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-white flex items-center gap-3">
              <span className="text-3xl">✨</span> Your Best Work
            </h2>
            <button className="text-sm font-bold bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-4 py-2 rounded-xl transition-colors border border-emerald-500/30">
              + Add New
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map((p, i) => (
              <div key={i} className="bg-slate-900/60 border-2 border-slate-700/50 rounded-2xl p-5 hover:border-emerald-500/50 transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-4xl bg-slate-800 p-3 rounded-2xl group-hover:scale-110 transition-transform">{p.icon}</div>
                    <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 transition-colors border border-transparent group-hover:border-emerald-500/30">{p.grade}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5">{p.title}</h3>
                  <p className="text-sm font-medium text-slate-400 mb-4">{p.subject} • {p.type}</p>
                </div>
                <div className="flex justify-between items-center text-xs mt-auto">
                  <span className="font-bold text-slate-500 bg-slate-800 px-3 py-1 rounded-lg">{p.date}</span>
                  <button className="font-bold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">Open <span className="text-lg leading-none">→</span></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Badges & Achievements */}
        <div className="glass rounded-3xl p-6 fade-in-3 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-black text-white flex items-center gap-3">
               <span className="text-3xl">🏅</span> Badge Collection
             </h2>
             <button className="text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors bg-amber-400/10 px-4 py-2 rounded-xl">See All Badges →</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map((b, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3 bg-slate-900/40 p-5 rounded-2xl border-2 border-slate-700/30 hover:bg-slate-800/50 hover:border-amber-500/30 transition-colors cursor-default">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br ${b.color} shadow-lg shrink-0 transform hover:rotate-12 transition-transform`}>
                  {b.icon}
                </div>
                <div>
                  <h3 className="text-sm font-black text-white mb-1">{b.name}</h3>
                  <p className="text-xs font-medium text-slate-400 leading-snug">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Radar / Progress */}
        <div className="glass rounded-3xl p-6 fade-in-4 flex flex-col border border-slate-700/50 bg-gradient-to-br from-transparent to-emerald-900/5">
          <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
             <span className="text-3xl">🎯</span> Super Skills
          </h2>
          <div className="space-y-6 flex-1">
            {skills.map((s, i) => (
               <div key={i} className="group">
                  <div className="flex justify-between text-sm mb-2.5">
                    <span className="text-slate-200 font-bold">{s.name}</span>
                    <span className="text-emerald-400 font-black tracking-wider text-xs bg-emerald-400/10 px-2 py-0.5 rounded-md">{s.level} XP</span>
                  </div>
                  <div className="h-3.5 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50 shadow-inner">
                    <div className="h-full rounded-full transition-all duration-1000 relative group-hover:brightness-125" style={{ width: `${s.level}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}dd)` }}>
                       <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white/30 to-transparent"></div>
                       <div className="absolute top-0 bottom-0 left-0 right-0 overflow-hidden">
                          <div className="w-full h-full opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.5) 10px, rgba(255,255,255,0.5) 20px)' }}></div>
                       </div>
                    </div>
                  </div>
               </div>
            ))}
          </div>
          <div className="mt-8 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-2xl p-5 text-center shadow-lg relative overflow-hidden">
             <div className="absolute -right-4 -bottom-4 text-6xl opacity-10">👩‍🏫</div>
             <p className="text-sm text-emerald-200 font-medium relative z-10 leading-relaxed">
                "Arjun is a fantastic learner! The solar system model was out of this world! Keep up the great reading!"
             </p>
             <p className="text-xs text-emerald-400 mt-3 font-black tracking-wide relative z-10 uppercase">— Mrs. Anjali (Class Teacher)</p>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
