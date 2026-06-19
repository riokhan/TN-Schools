"use client";
import PortalLayout from "@/components/PortalLayout";


const staffList = [
  { name: "Mrs. Sumathi Devi", subject: "Mathematics", attendance: 96, performance: "Excellent", leave: 1 },
  { name: "Mr. Rajan K.", subject: "Science", attendance: 92, performance: "Good", leave: 0 },
  { name: "Mrs. Kavitha S.", subject: "Tamil", attendance: 98, performance: "Excellent", leave: 0 },
  { name: "Mr. Prakash R.", subject: "Social Science", attendance: 88, performance: "Average", leave: 3 },
  { name: "Ms. Deepa N.", subject: "English", attendance: 94, performance: "Good", leave: 1 },
];

export default function HeadmasterDashboard() {
  return (
    <PortalLayout>
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in">
        {[
          { label: "Total Enrollment", value: "1,247", icon: "👨‍🎓", color: "text-blue-400", sub: "Classes 6–12" },
          { label: "Today's Attendance", value: "96.2%", icon: "📅", color: "text-emerald-400", sub: "1,199 present" },
          { label: "Teaching Staff", value: "42", icon: "👩‍🏫", color: "text-amber-400", sub: "38 present today" },
          { label: "Dropout Risk", value: "8", icon: "⚠️", color: "text-red-400", sub: "Needs intervention" },
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
        {/* Staff Table */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 fade-in-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">👩‍🏫 Staff Performance</h2>
            <button id="headmaster-add-staff" className="text-xs text-blue-400 hover:text-blue-300">+ Add Staff</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Subject</th>
                <th>Attendance</th>
                <th>Performance</th>
                <th>Leave Days</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((s) => (
                <tr key={s.name}>
                  <td className="font-medium text-white">{s.name}</td>
                  <td>{s.subject}</td>
                  <td>
                    <span className={`badge ${s.attendance >= 95 ? "badge-green" : s.attendance >= 90 ? "badge-yellow" : "badge-red"}`}>{s.attendance}%</span>
                  </td>
                  <td>
                    <span className={`badge ${s.performance === "Excellent" ? "badge-green" : s.performance === "Good" ? "badge-blue" : "badge-yellow"}`}>{s.performance}</span>
                  </td>
                  <td className={s.leave >= 3 ? "text-red-400" : "text-slate-400"}>{s.leave}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* School Resources */}
        <div className="glass rounded-2xl p-6 fade-in-3">
          <h2 className="text-base font-semibold text-white mb-4">🏗️ School Resources</h2>
          <div className="space-y-3">
            {[
              { label: "Smart Classrooms", value: "8/12", icon: "🖥️", status: "good" },
              { label: "Computer Lab", value: "48 systems", icon: "💻", status: "good" },
              { label: "Library Books", value: "4,200", icon: "📚", status: "good" },
              { label: "Sports Equipment", value: "Needs Repair", icon: "⚽", status: "warn" },
              { label: "Mid-Day Meal Stock", value: "12 days left", icon: "🍛", status: "warn" },
              { label: "Sanitation Blocks", value: "4/4 functional", icon: "🚻", status: "good" },
            ].map((res) => (
              <div key={res.label} className="flex items-center justify-between py-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span>{res.icon}</span>
                  <span className="text-sm text-slate-300">{res.label}</span>
                </div>
                <span className={`text-xs font-medium ${res.status === "good" ? "text-emerald-400" : "text-amber-400"}`}>{res.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mid-Day Meal & Scholarship */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-in-4">
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">🍛 Mid-Day Meal Today</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Students Served", value: "1,180", color: "text-emerald-400" },
              { label: "Food Stock (kg)", value: "245", color: "text-blue-400" },
              { label: "Menu", value: "Rice + Sambar", color: "text-amber-400" },
              { label: "Waste %", value: "3.2%", color: "text-slate-400" },
            ].map((m) => (
              <div key={m.label} className="bg-slate-900/60 rounded-xl p-3">
                <div className={`text-lg font-bold ${m.color}`}>{m.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">🎓 Scholarship Status</h2>
          <div className="space-y-3">
            {[
              { scheme: "BC/MBC Scholarship", eligible: 340, approved: 312, pending: 28 },
              { scheme: "SC/ST Scholarship", eligible: 210, approved: 205, pending: 5 },
              { scheme: "Minority Scholarship", eligible: 45, approved: 38, pending: 7 },
            ].map((sc) => (
              <div key={sc.scheme} className="p-3 bg-slate-900/60 rounded-xl">
                <div className="text-xs font-semibold text-blue-300 mb-2">{sc.scheme}</div>
                <div className="flex gap-4 text-xs text-slate-400">
                  <span>Eligible: <strong className="text-white">{sc.eligible}</strong></span>
                  <span>Approved: <strong className="text-emerald-400">{sc.approved}</strong></span>
                  <span>Pending: <strong className="text-amber-400">{sc.pending}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
