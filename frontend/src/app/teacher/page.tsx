import PortalLayout from "@/components/PortalLayout";

const navItems = [
  { label: "Dashboard", href: "/teacher", icon: "🏠" },
  { label: "My Classes", href: "/teacher/classes", icon: "🏫" },
  { label: "AI Lesson Planner", href: "/teacher/lesson-planner", icon: "📋" },
  { label: "Question Generator", href: "/teacher/questions", icon: "❓" },
  { label: "AI Evaluation", href: "/teacher/evaluation", icon: "✅" },
  { label: "Student Analytics", href: "/teacher/analytics", icon: "📊" },
  { label: "Homework Manager", href: "/teacher/homework", icon: "📝" },
  { label: "Risk Alerts", href: "/teacher/risk-alerts", icon: "⚠️" },
  { label: "Parent Communication", href: "/teacher/communication", icon: "💬" },
];

const classData = [
  { class: "10A - Mathematics", students: 42, attendance: 94, homeworkRate: 88, avgScore: 76, risk: 2 },
  { class: "10B - Mathematics", students: 40, attendance: 89, homeworkRate: 82, avgScore: 71, risk: 4 },
  { class: "9A - Mathematics", students: 45, attendance: 96, homeworkRate: 91, avgScore: 82, risk: 1 },
];

const riskStudents = [
  { name: "Murugan S.", class: "10B", issue: "3 consecutive absences", risk: "high" },
  { name: "Kavitha R.", class: "10A", issue: "Homework submission < 50%", risk: "medium" },
  { name: "Senthil K.", class: "10B", issue: "Failing last 2 unit tests", risk: "high" },
  { name: "Deepa M.", class: "9A", issue: "Declining scores in last 3 weeks", risk: "medium" },
];

export default function TeacherDashboard() {
  return (
    <PortalLayout
      title="Teacher Dashboard"
      subtitle="Mrs. Sumathi Devi · Mathematics · GHS Coimbatore"
      avatarLetter="S"
      avatarColor="#f59e0b"
      navItems={navItems}
      themeClass="theme-teacher"
      accentColor="#f59e0b"
    >
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in">
        {[
          { label: "Total Students", value: "127", icon: "👨‍🎓", color: "text-amber-400", sub: "3 classes" },
          { label: "Avg Attendance", value: "93%", icon: "📅", color: "text-emerald-400", sub: "This week" },
          { label: "Homework Checked", value: "89%", icon: "✅", color: "text-blue-400", sub: "Last batch" },
          { label: "At-Risk Students", value: "6", icon: "⚠️", color: "text-red-400", sub: "Needs attention" },
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

      {/* AI Tools */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 fade-in-2">
        {[
          { icon: "📋", label: "AI Lesson Planner", desc: "Auto-generate lesson plans", color: "from-amber-600 to-orange-600", id: "teacher-ai-lesson-planner" },
          { icon: "❓", label: "Question Generator", desc: "MCQ, Short & Long answers", color: "from-violet-600 to-purple-600", id: "teacher-question-generator" },
          { icon: "📄", label: "Worksheet Generator", desc: "Printable worksheets", color: "from-blue-600 to-cyan-600", id: "teacher-worksheet-generator" },
          { icon: "🎯", label: "AI Evaluation", desc: "Auto-grade answers", color: "from-emerald-600 to-teal-600", id: "teacher-ai-evaluation" },
        ].map((tool) => (
          <button
            key={tool.label}
            id={tool.id}
            className="glass rounded-2xl p-5 text-left hover:-translate-y-1 transition-all hover:shadow-xl group"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform`}>
              {tool.icon}
            </div>
            <div className="text-sm font-semibold text-white mb-1">{tool.label}</div>
            <div className="text-xs text-slate-500">{tool.desc}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Class Overview */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 fade-in-3">
          <h2 className="text-base font-semibold text-white mb-5">🏫 Class Overview</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Students</th>
                <th>Attendance</th>
                <th>Homework</th>
                <th>Avg Score</th>
                <th>At Risk</th>
              </tr>
            </thead>
            <tbody>
              {classData.map((c) => (
                <tr key={c.class}>
                  <td className="font-medium text-white">{c.class}</td>
                  <td>{c.students}</td>
                  <td>
                    <span className={`badge ${c.attendance >= 90 ? "badge-green" : "badge-yellow"}`}>{c.attendance}%</span>
                  </td>
                  <td>{c.homeworkRate}%</td>
                  <td>{c.avgScore}%</td>
                  <td>
                    <span className={`badge ${c.risk <= 2 ? "badge-green" : "badge-red"}`}>{c.risk} students</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Risk Alerts */}
        <div className="glass rounded-2xl p-6 fade-in-4">
          <h2 className="text-base font-semibold text-white mb-4">⚠️ Risk Alerts</h2>
          <div className="space-y-3">
            {riskStudents.map((s, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border text-xs ${
                  s.risk === "high" ? "border-red-500/30 bg-red-500/5" : "border-amber-500/30 bg-amber-500/5"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-white">{s.name}</div>
                    <div className="text-slate-500 mt-0.5">{s.class} · {s.issue}</div>
                  </div>
                  <span className={`badge ${s.risk === "high" ? "badge-red" : "badge-yellow"}`}>{s.risk}</span>
                </div>
              </div>
            ))}
          </div>
          <button
            id="teacher-view-all-risks"
            className="mt-4 w-full py-2 rounded-xl text-xs font-semibold text-amber-400 border border-amber-500/30 hover:bg-amber-500/10 transition-all"
          >
            View All Risk Students →
          </button>
        </div>
      </div>
    </PortalLayout>
  );
}
