"use client";
import PortalLayout from "@/components/PortalLayout";

const navItems = [
  { label: "Dashboard", href: "/block-education-officer", icon: "🏠" },
  { label: "School Comparisons", href: "/block-education-officer/schools", icon: "🏫" },
  { label: "Attendance Analytics", href: "/block-education-officer/attendance", icon: "📅" },
  { label: "Exam Analytics", href: "/block-education-officer/exams", icon: "📊" },
  { label: "Infrastructure", href: "/block-education-officer/infrastructure", icon: "🏗️" },
  { label: "Teacher Deployment", href: "/block-education-officer/teachers", icon: "👩‍🏫" },
  { label: "Dropouts Tracking", href: "/block-education-officer/dropouts", icon: "📉" },
  { label: "Schemes Update", href: "/block-education-officer/schemes", icon: "📜" },
  { label: "Grievances", href: "/block-education-officer/grievances", icon: "⚖️" },
  { label: "Financial Reports", href: "/block-education-officer/financials", icon: "💰" },
  { label: "Circulars", href: "/block-education-officer/circulars", icon: "📢" },
];

const schools = [
  { name: "GHS Coimbatore", students: 1247, attendance: 96, exam10: 94, exam12: 89, rank: 1 },
  { name: "GHS Singanallur", students: 980, attendance: 92, exam10: 88, exam12: 82, rank: 2 },
  { name: "GHSS Ganapathy", students: 1120, attendance: 90, exam10: 85, exam12: 79, rank: 3 },
  { name: "GHS RS Puram", students: 876, attendance: 87, exam10: 81, exam12: 75, rank: 4 },
  { name: "GHS Peelamedu", students: 1050, attendance: 85, exam10: 78, exam12: 70, rank: 5 },
];

export default function BEODashboard() {
  return (
    <PortalLayout>
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in">
        {[
          { label: "Total Schools", value: "24", icon: "🏫", color: "text-violet-400", sub: "Under this block" },
          { label: "Total Students", value: "22,450", icon: "👨‍🎓", color: "text-emerald-400", sub: "Enrolled" },
          { label: "Block Attendance", value: "91%", icon: "📅", color: "text-amber-400", sub: "This week" },
          { label: "Dropout Cases", value: "17", icon: "⚠️", color: "text-red-400", sub: "This year" },
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

      {/* School Rankings */}
      <div className="glass rounded-2xl p-6 mb-6 fade-in-2">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">🏆 School Rankings — Block Level</h2>
          <button id="beo-download-report" className="text-xs text-violet-400 hover:text-violet-300 border border-violet-500/30 px-3 py-1.5 rounded-lg">
            ⬇ Download Report
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>School</th>
              <th>Students</th>
              <th>Attendance</th>
              <th>10th Pass %</th>
              <th>12th Pass %</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((s) => (
              <tr key={s.name}>
                <td>
                  <span className={`badge ${s.rank === 1 ? "badge-green" : s.rank <= 3 ? "badge-blue" : "badge-yellow"}`}>
                    #{s.rank}
                  </span>
                </td>
                <td className="font-medium text-white">{s.name}</td>
                <td>{s.students.toLocaleString()}</td>
                <td>
                  <span className={`badge ${s.attendance >= 93 ? "badge-green" : s.attendance >= 88 ? "badge-yellow" : "badge-red"}`}>{s.attendance}%</span>
                </td>
                <td>{s.exam10}%</td>
                <td>{s.exam12}%</td>
                <td>
                  <button className="text-xs text-violet-400 hover:text-violet-300">View →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Infrastructure & Teacher Deployment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-in-3">
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">🏗️ Infrastructure Status</h2>
          <div className="space-y-3">
            {[
              { label: "Schools with Smart Classrooms", value: 18, total: 24 },
              { label: "Schools with Computer Lab", value: 22, total: 24 },
              { label: "Schools with Clean Toilets", value: 24, total: 24 },
              { label: "Schools needing repairs", value: 4, total: 24 },
            ].map((inf) => (
              <div key={inf.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{inf.label}</span>
                  <span className="text-slate-300">{inf.value}/{inf.total}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(inf.value / inf.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">👩‍🏫 Teacher Deployment</h2>
          <div className="space-y-3">
            {[
              { subject: "Mathematics", required: 48, deployed: 44, shortage: 4 },
              { subject: "Science", required: 36, deployed: 35, shortage: 1 },
              { subject: "Tamil", required: 36, deployed: 36, shortage: 0 },
              { subject: "English", required: 30, deployed: 27, shortage: 3 },
            ].map((t) => (
              <div key={t.subject} className="flex items-center justify-between py-2 border-b border-slate-800">
                <span className="text-sm text-slate-300">{t.subject}</span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-500">{t.deployed}/{t.required}</span>
                  <span className={`badge ${t.shortage === 0 ? "badge-green" : t.shortage <= 2 ? "badge-yellow" : "badge-red"}`}>
                    {t.shortage === 0 ? "Filled" : `-${t.shortage} short`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
