import PortalLayout from "@/components/PortalLayout";

const navItems = [
  { label: "Dashboard", href: "/parent", icon: "🏠" },
  { label: "Child Performance", href: "/parent/performance", icon: "📊" },
  { label: "Attendance", href: "/parent/attendance", icon: "📅" },
  { label: "Homework Status", href: "/parent/homework", icon: "📝" },
  { label: "Notifications", href: "/parent/notifications", icon: "🔔" },
  { label: "AI Assistant", href: "/parent/ai-assistant", icon: "🤖" },
  { label: "Scholarship", href: "/parent/scholarship", icon: "🎓" },
  { label: "PTA Meetings", href: "/parent/pta", icon: "🤝" },
];

const notifications = [
  { type: "warning", icon: "⚠️", message: "Priya was absent on 3 days this month", time: "2 hrs ago" },
  { type: "info", icon: "📢", message: "PTA Meeting scheduled for June 25, 2025 at 10 AM", time: "Yesterday" },
  { type: "success", icon: "🏆", message: "Priya scored 92% in Mathematics unit test", time: "2 days ago" },
  { type: "info", icon: "💰", message: "Scholarship application deadline: June 30, 2025", time: "3 days ago" },
];

const subjectMarks = [
  { subject: "Mathematics", unit1: 88, unit2: 92, midterm: 85, color: "#6366f1" },
  { subject: "Science", unit1: 75, unit2: 78, midterm: 72, color: "#10b981" },
  { subject: "Tamil", unit1: 90, unit2: 88, midterm: 91, color: "#f59e0b" },
  { subject: "English", unit1: 82, unit2: 84, midterm: 80, color: "#3b82f6" },
  { subject: "Social Science", unit1: 70, unit2: 74, midterm: 68, color: "#ec4899" },
];

export default function ParentDashboard() {
  return (
    <PortalLayout
      title="Parent Portal"
      subtitle="Rajesh Kumar · Parent of Priya · Class 9B"
      avatarLetter="R"
      avatarColor="#10b981"
      navItems={navItems}
      themeClass="theme-parent"
      accentColor="#10b981"
    >
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in">
        {[
          { label: "Attendance", value: "91%", icon: "📅", color: "text-emerald-400", sub: "This month" },
          { label: "Overall Grade", value: "A", icon: "⭐", color: "text-amber-400", sub: "Above average" },
          { label: "Homework Rate", value: "87%", icon: "📝", color: "text-blue-400", sub: "Last 30 days" },
          { label: "Rank in Class", value: "#5", icon: "🏆", color: "text-purple-400", sub: "Out of 42" },
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
        {/* Marks Table */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 fade-in-2">
          <h2 className="text-base font-semibold text-white mb-5">📊 Subject-wise Marks</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Unit 1</th>
                <th>Unit 2</th>
                <th>Midterm</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {subjectMarks.map((m) => (
                <tr key={m.subject}>
                  <td className="font-medium text-white">{m.subject}</td>
                  <td>{m.unit1}</td>
                  <td>{m.unit2}</td>
                  <td>{m.midterm}</td>
                  <td>
                    <span className={`badge ${m.unit2 >= m.unit1 ? "badge-green" : "badge-red"}`}>
                      {m.unit2 >= m.unit1 ? "↑ Up" : "↓ Down"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notifications */}
        <div className="glass rounded-2xl p-6 fade-in-3">
          <h2 className="text-base font-semibold text-white mb-4">🔔 Notifications</h2>
          <div className="space-y-3">
            {notifications.map((n, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border text-sm ${
                  n.type === "warning"
                    ? "border-amber-500/30 bg-amber-500/5"
                    : n.type === "success"
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-blue-500/30 bg-blue-500/5"
                }`}
              >
                <div className="flex gap-2">
                  <span>{n.icon}</span>
                  <div>
                    <p className="text-slate-300 leading-snug text-xs">{n.message}</p>
                    <p className="text-slate-600 text-xs mt-1">{n.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Parent Assistant */}
      <div className="glass rounded-2xl p-6 fade-in-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-2xl flex-shrink-0">
            🤖
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-white mb-1">AI Parent Assistant</h2>
            <p className="text-xs text-slate-500 mb-4">Get personalised insights about your child&apos;s learning journey</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { icon: "📚", label: "Learning Recommendations", desc: "Priya needs more practice in Social Science chapters 4–6" },
                { icon: "❤️", label: "Health & Wellness", desc: "Priya's wellness score is 78/100. Encourage adequate sleep." },
                { icon: "⚠️", label: "Attendance Alert", desc: "3 absences this month. Frequent absence may affect grades." },
              ].map((card) => (
                <div key={card.label} className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/50">
                  <div className="text-xl mb-2">{card.icon}</div>
                  <div className="text-xs font-semibold text-emerald-400 mb-1">{card.label}</div>
                  <p className="text-xs text-slate-400">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
