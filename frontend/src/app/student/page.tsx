import PortalLayout from "@/components/PortalLayout";

const navItems = [
  { label: "Dashboard", href: "/student", icon: "🏠" },
  { label: "AI Tutor", href: "/student/ai-tutor", icon: "🤖" },
  { label: "My Subjects", href: "/student/subjects", icon: "📖" },
  { label: "Homework", href: "/student/homework", icon: "📝" },
  { label: "Practice Tests", href: "/student/tests", icon: "✅" },
  { label: "Career Guidance", href: "/student/career", icon: "🚀" },
  { label: "Digital Portfolio", href: "/student/portfolio", icon: "🗂️" },
  { label: "Wellness", href: "/student/wellness", icon: "💚" },
  { label: "Coding Academy", href: "/student/coding", icon: "💻" },
];

const subjects = [
  { name: "Mathematics", progress: 78, color: "#6366f1", icon: "📐" },
  { name: "Science", progress: 65, color: "#10b981", icon: "🔬" },
  { name: "Tamil", progress: 88, color: "#f59e0b", icon: "📜" },
  { name: "English", progress: 72, color: "#3b82f6", icon: "🗣️" },
  { name: "Social Science", progress: 55, color: "#ec4899", icon: "🌍" },
];

const recentActivity = [
  { subject: "Mathematics", activity: "Completed Chapter 5 Quiz", score: "18/20", time: "2 hrs ago", status: "green" },
  { subject: "Science", activity: "Submitted Homework", score: "—", time: "Yesterday", status: "blue" },
  { subject: "English", activity: "AI Tutor Session", score: "45 min", time: "Yesterday", status: "yellow" },
  { subject: "Tamil", activity: "Mock Test Attempt", score: "88%", time: "2 days ago", status: "green" },
];

export default function StudentDashboard() {
  return (
    <PortalLayout
      title="Student Dashboard"
      subtitle="Welcome back, Arjun Kumar · Class 10A · EMIS: 3301234567"
      avatarLetter="A"
      avatarColor="#6366f1"
      navItems={navItems}
      themeClass="theme-student"
      accentColor="#6366f1"
    >
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in">
        {[
          { label: "Attendance", value: "94%", icon: "📅", color: "text-emerald-400", sub: "+2% this week" },
          { label: "Weekly Score", value: "82/100", icon: "⭐", color: "text-amber-400", sub: "Top 15% in class" },
          { label: "Homework Done", value: "7/8", icon: "📝", color: "text-blue-400", sub: "1 pending" },
          { label: "Exam Readiness", value: "76%", icon: "🎯", color: "text-purple-400", sub: "Board Exam in 45d" },
        ].map((kpi) => (
          <div key={kpi.label} className="kpi-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{kpi.icon}</span>
              <span className={`text-xs font-medium ${kpi.color}`}>{kpi.sub}</span>
            </div>
            <div className={`text-3xl font-bold ${kpi.color} mb-1`}>{kpi.value}</div>
            <div className="text-xs text-slate-500">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Subject Progress */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 fade-in-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">Subject Progress</h2>
            <button id="student-view-all-subjects" className="text-xs text-indigo-400 hover:text-indigo-300">View All →</button>
          </div>
          <div className="space-y-4">
            {subjects.map((s) => (
              <div key={s.name} className="flex items-center gap-4">
                <div className="text-xl w-8">{s.icon}</div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-300 font-medium">{s.name}</span>
                    <span className="text-slate-500">{s.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${s.progress}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}aa)` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Tutor Quick Access */}
        <div className="glass rounded-2xl p-6 fade-in-3 flex flex-col">
          <h2 className="text-base font-semibold text-white mb-4">🤖 AI Tutor</h2>
          <div className="flex-1 bg-slate-900/60 rounded-xl p-4 mb-4 text-sm text-slate-400 italic min-h-[120px] flex items-center justify-center text-center">
            "Ask me anything about your syllabus. I speak Tamil and English!"
          </div>
          <div className="space-y-2">
            {["Explain Pythagoras Theorem", "Help with Essay Writing", "Science Doubts"].map((q) => (
              <button
                key={q}
                id={`ai-tutor-quick-${q.replace(/\s+/g, "-").toLowerCase()}`}
                className="w-full text-left text-xs px-3 py-2 glass rounded-lg text-slate-400 hover:text-indigo-300 hover:border-indigo-500/50 transition-all border border-transparent"
              >
                💬 {q}
              </button>
            ))}
          </div>
          <button
            id="student-open-ai-tutor"
            className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            Open AI Tutor →
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass rounded-2xl p-6 fade-in-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">Recent Activity</h2>
          <span className="badge badge-blue">Last 7 Days</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Activity</th>
              <th>Score / Time</th>
              <th>When</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.map((r, i) => (
              <tr key={i}>
                <td className="font-medium text-white">{r.subject}</td>
                <td>{r.activity}</td>
                <td className="font-mono text-slate-300">{r.score}</td>
                <td className="text-slate-500">{r.time}</td>
                <td>
                  <span className={`badge badge-${r.status}`}>
                    {r.status === "green" ? "Completed" : r.status === "blue" ? "Submitted" : "In Progress"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PortalLayout>
  );
}
