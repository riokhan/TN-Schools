import PortalLayout from "@/components/PortalLayout";

const navItems = [
  // Subject Oriented Menu
  { label: "My Subjects (Science)", href: "/teacher", icon: "🔬" },
  { label: "Science Labs", href: "/teacher/labs", icon: "🧪" },
  { label: "Subject Analytics", href: "/teacher/subject-analytics", icon: "📊" },
  
  // Common Menu & Tools
  { label: "Admin & Tools", href: "#", icon: "" },
  { label: "My Classes", href: "/teacher/classes", icon: "🏫" },
  { label: "AI Lesson Planner", href: "/teacher/lesson-planner", icon: "📋" },
  { label: "Question Generator", href: "/teacher/questions", icon: "❓" },
  { label: "AI Evaluation", href: "/teacher/evaluation", icon: "✅" },
  
  // Student Management
  { label: "Student Management", href: "#", icon: "" },
  { label: "Student Profiles", href: "/teacher/student-profiles", icon: "👤" },
  { label: "Student Status", href: "/teacher/student-status", icon: "📈" },
  { label: "Validate Homework", href: "/teacher/validate-homework", icon: "✔️" },
  { label: "Scholarship Details", href: "/teacher/scholarships", icon: "🎓" },
  { label: "Student Analytics", href: "/teacher/analytics", icon: "📊" },
  { label: "Risk Alerts", href: "/teacher/risk-alerts", icon: "⚠️" },
  { label: "Parent Communication", href: "/teacher/communication", icon: "💬" },

  // Resources & Admin
  { label: "Resources & Admin", href: "#", icon: "" },
  { label: "Add Materials", href: "/teacher/add-materials", icon: "📚" },
  { label: "Daily Attendance", href: "/teacher/attendance", icon: "📅" },
  { label: "Announcements", href: "/teacher/announcements", icon: "📢" },
  { label: "Leave Requests", href: "/teacher/leave", icon: "📄" },
];

const classData = [
  { class: "10A - Science", students: 42, attendance: 94, homeworkRate: 88, avgScore: 76, risk: 2 },
  { class: "9B - Science", students: 40, attendance: 89, homeworkRate: 82, avgScore: 71, risk: 4 },
  { class: "8A - Science", students: 45, attendance: 96, homeworkRate: 91, avgScore: 82, risk: 1 },
];

const riskStudents = [
  { name: "Murugan S.", class: "10A", issue: "Failing Science Unit Tests", risk: "high" },
  { name: "Kavitha R.", class: "9B", issue: "Lab reports missing", risk: "medium" },
  { name: "Senthil K.", class: "8A", issue: "Low participation in Science projects", risk: "high" },
];

export default function TeacherDashboard() {
  return (
    <PortalLayout
      title="Teacher Dashboard"
      subtitle="Mr. Ramesh · Science Specialist · GHS Coimbatore"
      avatarLetter="R"
      avatarColor="#10b981"
      navItems={navItems}
      themeClass="theme-teacher"
      accentColor="#10b981"
    >
      {/* Subject Focus Header */}
      <div className="glass rounded-2xl p-4 mb-6 flex justify-between items-center border border-emerald-500/30 bg-emerald-900/10 fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-xl">🔬</div>
          <div>
            <h3 className="text-emerald-400 font-bold text-sm">Subject Focus Mode Active</h3>
            <p className="text-slate-400 text-xs">Currently viewing analytics and tasks for: Science</p>
          </div>
        </div>
        <button className="px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-xs text-white hover:bg-slate-700">Switch Subject</button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in-2">
        {[
          { label: "Total Students", value: "127", icon: "👨‍🎓", color: "text-amber-400", sub: "Across 3 classes" },
          { label: "Subject Avg", value: "76%", icon: "📊", color: "text-emerald-400", sub: "Science Average" },
          { label: "Labs Pending", value: "2", icon: "🧪", color: "text-blue-400", sub: "Needs grading" },
          { label: "Science Risk", value: "3", icon: "⚠️", color: "text-red-400", sub: "Needs attention" },
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 fade-in-3">
        {[
          { icon: "📋", label: "Smart Lesson Plan", desc: "Generate Science plans", color: "from-amber-600 to-orange-600" },
          { icon: "🧪", label: "Lab Experiment Gen", desc: "Safe experiments for kids", color: "from-violet-600 to-purple-600" },
          { icon: "📄", label: "Worksheet Generator", desc: "Printable worksheets", color: "from-blue-600 to-cyan-600" },
          { icon: "✅", label: "AI Evaluation", desc: "Auto-grade Science answers", color: "from-emerald-600 to-teal-600" },
        ].map((tool, i) => (
          <button
            key={i}
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
        <div className="lg:col-span-2 glass rounded-2xl p-6 fade-in-4">
          <h2 className="text-base font-semibold text-white mb-5">🏫 Science Class Overview</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Students</th>
                <th>Attendance</th>
                <th>Lab Work</th>
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
        <div className="glass rounded-2xl p-6 fade-in-5">
          <h2 className="text-base font-semibold text-white mb-4">⚠️ Subject Risk Alerts</h2>
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
          <button className="mt-4 w-full py-2 rounded-xl text-xs font-semibold text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 transition-all">
            Message Parents →
          </button>
        </div>
      </div>
    </PortalLayout>
  );
}

