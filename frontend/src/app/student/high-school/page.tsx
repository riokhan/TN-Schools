import PortalLayout from "@/components/PortalLayout";

const navItems = [
  { label: "Dashboard", href: "/student/high-school", icon: "🏠" },
  { label: "Board Prep", href: "/student/high-school/board-prep", icon: "🎯" },
  { label: "Mock Tests", href: "/student/high-school/mock-tests", icon: "📝" },
  { label: "Study Boost", href: "/student/high-school/study-boost", icon: "⚡" },
  { label: "Career Aptitude", href: "/student/high-school/career", icon: "🧭" },

  // Common Student Menu
  { label: "Common Tools", href: "#", icon: "" },
  { label: "AI Tutor", href: "/student/ai-tutor", icon: "🤖" },
  { label: "My Subjects", href: "/student/subjects", icon: "📖" },
  { label: "Virtual Labs", href: "/student/labs", icon: "🧪" },
  { label: "Homework", href: "/student/homework", icon: "📝" },
  { label: "Digital Portfolio", href: "/student/portfolio", icon: "🗂️" },
  { label: "Extracurriculars", href: "/student/activities", icon: "🎭" },
  { label: "Sports & Athletics", href: "/student/sports", icon: "⚽" },
  { label: "Wellness", href: "/student/wellness", icon: "💚" },
];

const subjects = [
  { name: "Mathematics", progress: 65, color: "#ef4444", icon: "📐" }, // Low progress to show weakness detector
  { name: "Science", progress: 78, color: "#3b82f6", icon: "🔬" },
  { name: "Tamil", progress: 88, color: "#f59e0b", icon: "📜" },
  { name: "English", progress: 85, color: "#10b981", icon: "🗣️" },
  { name: "Social Science", progress: 75, color: "#8b5cf6", icon: "🌍" },
];

const mockTestScores = [
  { test: "Midterm: Math", score: "62/100", status: "needs-work" },
  { test: "Midterm: Science", score: "80/100", status: "good" },
  { test: "Unit 4: Tamil", score: "90/100", status: "excellent" },
];

export default function HighSchoolDashboard() {
  return (
    <PortalLayout
      title="High School Dashboard (Class 9-10)"
      subtitle="Welcome, Arjun · Class 10A · Focus Area: SSLC Board Preparation"
      avatarLetter="A"
      avatarColor="#ef4444"
      navItems={navItems}
      themeClass="theme-student"
      accentColor="#ef4444"
    >
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in">
        {[
          { label: "Countdown to SSLC", value: "84 Days", icon: "⏳", color: "text-red-400", sub: "Exam starts Mar 15" },
          { label: "Overall Avg", value: "77%", icon: "📊", color: "text-blue-400", sub: "Target: 90%" },
          { label: "Mock Tests Taken", value: "4/10", icon: "📝", color: "text-amber-400", sub: "Next test: Friday" },
          { label: "Study Boost Hrs", value: "12 Hrs", icon: "⚡", color: "text-purple-400", sub: "Self-study this week" },
        ].map((kpi) => (
          <div key={kpi.label} className="kpi-card border border-slate-700 hover:border-red-500/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{kpi.icon}</span>
              <span className={`text-xs font-medium ${kpi.color}`}>{kpi.sub}</span>
            </div>
            <div className={`text-3xl font-bold ${kpi.color} mb-1`}>{kpi.value}</div>
            <div className="text-xs text-slate-400">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Subject Progress */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 fade-in-2 border border-slate-700/50">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">Subject Readiness</h2>
            <button className="text-xs text-red-400 hover:text-red-300">View Analytics →</button>
          </div>
          <div className="space-y-4">
            {subjects.map((s) => (
              <div key={s.name} className="flex items-center gap-4">
                <div className="text-xl w-8">{s.icon}</div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-300 font-medium">{s.name}</span>
                    <span className="text-slate-400">{s.progress}%</span>
                  </div>
                  <div className="progress-bar bg-slate-800">
                    <div className="progress-fill" style={{ width: `${s.progress}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}aa)` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* AI Weakness Detector */}
          <div className="glass rounded-2xl p-6 fade-in-3 border border-red-500/30 bg-red-900/10">
            <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-red-500">⚡</span> AI Weakness Alert
            </h2>
            <p className="text-sm text-slate-300 mb-4">
              Your recent scores show a drop in <strong className="text-red-400">Mathematics (Algebra)</strong>. We have generated a custom 3-day study plan to boost your score.
            </p>
            <button className="w-full py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 font-medium text-sm transition-colors border border-red-500/50">
              Start Algebra Boost Plan
            </button>
          </div>

          {/* Recent Mock Tests */}
          <div className="glass rounded-2xl p-6 fade-in-4 border border-slate-700/50">
            <h2 className="text-base font-semibold text-white mb-4">Recent Mock Tests</h2>
            <div className="space-y-3">
              {mockTestScores.map((m, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                  <span className="text-sm text-slate-300">{m.test}</span>
                  <span className={`text-sm font-mono font-bold ${
                    m.status === 'needs-work' ? 'text-red-400' : m.status === 'good' ? 'text-blue-400' : 'text-emerald-400'
                  }`}>
                    {m.score}
                  </span>
                </div>
              ))}
            </div>
            <button className="mt-4 text-xs text-center w-full text-slate-400 hover:text-white">View All Results →</button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
