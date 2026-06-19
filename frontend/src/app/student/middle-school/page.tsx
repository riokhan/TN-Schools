import PortalLayout from "@/components/PortalLayout";

const navItems = [
  { label: "Dashboard", href: "/student/middle-school", icon: "🏠" },
  { label: "My Badges", href: "/student/middle-school/badges", icon: "🏅" },
  { label: "Fun Quizzes", href: "/student/middle-school/quizzes", icon: "🎮" },
  { label: "Story Books", href: "/student/middle-school/stories", icon: "📚" },
  { label: "AI Helper", href: "/student/middle-school/ai", icon: "🤖" },
  
  // Common Student Menu
  { label: "Common Tools", href: "#", icon: "" },
  { label: "My Subjects", href: "/student/subjects", icon: "📖" },
  { label: "Virtual Labs", href: "/student/labs", icon: "🧪" },
  { label: "Homework", href: "/student/homework", icon: "📝" },
  { label: "Digital Portfolio", href: "/student/portfolio", icon: "🗂️" },
  { label: "Extracurriculars", href: "/student/activities", icon: "🎭" },
  { label: "Sports & Athletics", href: "/student/sports", icon: "⚽" },
  { label: "Wellness", href: "/student/wellness", icon: "💚" },
  { label: "Coding Academy", href: "/student/coding", icon: "💻" },
];

const subjects = [
  { name: "Mathematics", progress: 85, color: "#6366f1", icon: "🧮" },
  { name: "Science Explorer", progress: 70, color: "#10b981", icon: "🌱" },
  { name: "Tamil", progress: 92, color: "#f59e0b", icon: "🗣️" },
  { name: "English", progress: 80, color: "#3b82f6", icon: "✍️" },
  { name: "Social Science", progress: 60, color: "#ec4899", icon: "🌍" },
];

const recentActivity = [
  { subject: "Mathematics", activity: "Completed 'Fractions Game'", score: "100%", time: "2 hrs ago", status: "green" },
  { subject: "Science Explorer", activity: "Watched 'Plant Life' Video", score: "—", time: "Yesterday", status: "green" },
  { subject: "Tamil", activity: "Story Reading", score: "20 min", time: "2 days ago", status: "blue" },
];

export default function MiddleSchoolDashboard() {
  return (
    <PortalLayout
      title="Middle School Dashboard (Class 6-8)"
      subtitle="Welcome back, Arjun! · Class 7B · You have 5 new badges waiting! 🌟"
      avatarLetter="A"
      avatarColor="#10b981"
      navItems={navItems}
      themeClass="theme-student"
      accentColor="#10b981"
    >
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in">
        {[
          { label: "Attendance Star", value: "98%", icon: "⭐", color: "text-amber-400", sub: "Perfect this week!" },
          { label: "Learning Points", value: "1,250", icon: "🏆", color: "text-emerald-400", sub: "+50 today" },
          { label: "Quizzes Passed", value: "12", icon: "🎯", color: "text-blue-400", sub: "2 pending" },
          { label: "Reading Time", value: "5 Hrs", icon: "📖", color: "text-purple-400", sub: "This week" },
        ].map((kpi) => (
          <div key={kpi.label} className="kpi-card bg-gradient-to-b from-slate-800/80 to-slate-900/80 border-2 border-emerald-500/20 hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{kpi.icon}</span>
              <span className={`text-xs font-bold ${kpi.color}`}>{kpi.sub}</span>
            </div>
            <div className={`text-4xl font-extrabold ${kpi.color} mb-1 drop-shadow-md`}>{kpi.value}</div>
            <div className="text-sm font-semibold text-slate-400">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Subject Progress */}
        <div className="lg:col-span-2 glass rounded-3xl p-6 fade-in-2 border border-slate-700/50 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">🚀 My Learning Journey</h2>
            <button id="ms-view-all-subjects" className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-4 py-2 rounded-xl">Explore All</button>
          </div>
          <div className="space-y-5">
            {subjects.map((s) => (
              <div key={s.name} className="flex items-center gap-5 p-3 rounded-2xl hover:bg-slate-800/50 transition-colors">
                <div className="text-3xl w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center shadow-inner">{s.icon}</div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-200 font-bold text-base">{s.name}</span>
                    <span className="text-emerald-400 font-bold">{s.progress}%</span>
                  </div>
                  <div className="progress-bar h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div className="progress-fill h-full rounded-full relative" style={{ width: `${s.progress}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}aa)` }}>
                      <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Helper for Kids */}
        <div className="glass rounded-3xl p-6 fade-in-3 flex flex-col border border-slate-700/50 shadow-2xl bg-gradient-to-b from-indigo-900/20 to-purple-900/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-2xl animate-bounce shadow-lg shadow-indigo-500/30">🤖</div>
            <h2 className="text-xl font-bold text-white">AI Learning Buddy</h2>
          </div>
          <div className="flex-1 bg-slate-900/80 rounded-2xl p-5 mb-5 text-sm text-indigo-200 italic border border-indigo-500/30 relative">
            <div className="absolute -left-2 top-4 w-4 h-4 bg-slate-900/80 border-l border-b border-indigo-500/30 rotate-45" />
            &quot;Hi Arjun! Want to learn why the sky is blue? Or maybe play a math game?&quot;
          </div>
          <div className="space-y-3">
            {["Play a Math Game", "Tell me a Science Fact", "Help with Homework"].map((q) => (
              <button
                key={q}
                className="w-full text-left text-sm font-semibold px-4 py-3 bg-indigo-500/10 rounded-xl text-indigo-300 hover:bg-indigo-500/30 hover:text-white hover:-translate-y-1 transition-all border border-indigo-500/30 shadow-sm"
              >
                ✨ {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
