import PortalLayout from "@/components/PortalLayout";

const navItems = [
  { label: "Command Center", href: "/minister", icon: "🏛️" },
  { label: "Live State View", href: "/minister/live", icon: "📡" },
  { label: "KPI Monitoring", href: "/minister/kpi", icon: "📊" },
  { label: "AI Predictions", href: "/minister/predictions", icon: "🤖" },
  { label: "District Reports", href: "/minister/districts", icon: "🗺️" },
  { label: "Policy Intelligence", href: "/minister/policy", icon: "💡" },
  { label: "Budget Overview", href: "/minister/budget", icon: "💰" },
  { label: "Schemes Progress", href: "/minister/schemes", icon: "📜" },
  { label: "Infrastructure Projects", href: "/minister/infrastructure", icon: "🏗️" },
  { label: "Public Grievances", href: "/minister/grievances", icon: "⚖️" },
  { label: "Press & Media", href: "/minister/media", icon: "📰" },
];

const stateKpis = [
  { label: "10th Pass %", value: "87.4%", target: "90%", trend: "+2.1%", status: "on-track", icon: "📘" },
  { label: "12th Pass %", value: "81.2%", target: "85%", trend: "+1.8%", status: "on-track", icon: "📗" },
  { label: "Teacher Efficiency", value: "82%", target: "88%", trend: "+0.5%", status: "at-risk", icon: "👩‍🏫" },
  { label: "Scholarship Delivery", value: "94.2%", target: "98%", trend: "+3.2%", status: "on-track", icon: "🎓" },
  { label: "Dropout Rate", value: "1.8%", target: "<1.5%", trend: "-0.2%", status: "at-risk", icon: "⚠️" },
  { label: "Infrastructure Score", value: "78/100", target: "85/100", trend: "+3pts", status: "on-track", icon: "🏗️" },
];

export default function MinisterDashboard() {
  return (
    <PortalLayout
      title="Minister Dashboard"
      subtitle="Hon. Minister for School Education, Tamil Nadu"
      avatarLetter="M"
      avatarColor="#ef4444"
      navItems={navItems}
      themeClass="theme-minister"
      accentColor="#ef4444"
    >
      {/* Executive Live State View */}
      <div className="glass rounded-2xl p-6 mb-6 fade-in" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-white">🏛️ Tamil Nadu Education — Live State View</h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time data as of June 18, 2025 · 10:30 AM IST</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="pulse-dot"></span>
            <span className="text-xs text-slate-400">Live Feed</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Students", value: "47,20,400", icon: "👨‍🎓", color: "text-red-400" },
            { label: "Attendance Today", value: "88.4%", icon: "📅", color: "text-emerald-400" },
            { label: "Learning Index", value: "74.2", icon: "📈", color: "text-amber-400" },
            { label: "Dropout Forecast", value: "12,800", icon: "⚠️", color: "text-orange-400" },
          ].map((s) => (
            <div key={s.label} className="bg-slate-900/80 rounded-xl p-5 text-center border border-slate-700/50">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className={`text-2xl font-extrabold ${s.color} mb-1`}>{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Monitoring Table */}
      <div className="glass rounded-2xl p-6 mb-6 fade-in-2">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">📊 State KPI Monitoring</h2>
          <div className="flex gap-2">
            <span className="badge badge-green">On Track: 4</span>
            <span className="badge badge-yellow">At Risk: 2</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stateKpis.map((kpi) => (
            <div
              key={kpi.label}
              className={`p-5 rounded-xl border ${kpi.status === "on-track" ? "border-emerald-500/20 bg-emerald-500/5" : "border-amber-500/20 bg-amber-500/5"}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl">{kpi.icon}</span>
                <span className={`badge ${kpi.status === "on-track" ? "badge-green" : "badge-yellow"}`}>
                  {kpi.status === "on-track" ? "On Track" : "At Risk"}
                </span>
              </div>
              <div className="text-2xl font-extrabold text-white mb-0.5">{kpi.value}</div>
              <div className="text-xs text-slate-400 mb-2">{kpi.label}</div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Target: {kpi.target}</span>
                <span className={kpi.trend.startsWith("+") ? "text-emerald-400" : "text-red-400"}>{kpi.trend} YoY</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Governance Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-in-3">
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">🤖 AI Governance Predictions</h2>
          <div className="space-y-3">
            {[
              { label: "Dropout Prediction (Next Year)", value: "~14,200 students", severity: "red", icon: "📉" },
              { label: "10th Board Pass % Prediction", value: "88.9%", severity: "green", icon: "📊" },
              { label: "12th Board Pass % Prediction", value: "83.1%", severity: "green", icon: "📊" },
              { label: "Teacher Shortage by 2026", value: "4,200 positions", severity: "yellow", icon: "👩‍🏫" },
              { label: "Infrastructure Investment Needed", value: "₹820 Crore", severity: "yellow", icon: "🏗️" },
            ].map((p) => (
              <div key={p.label} className={`flex items-center justify-between p-3 rounded-xl border ${p.severity === "red" ? "border-red-500/20 bg-red-500/5" : p.severity === "green" ? "border-emerald-500/20 bg-emerald-500/5" : "border-amber-500/20 bg-amber-500/5"}`}>
                <div className="flex items-center gap-2 text-xs">
                  <span>{p.icon}</span>
                  <span className="text-slate-400">{p.label}</span>
                </div>
                <span className={`text-sm font-bold ${p.severity === "red" ? "text-red-400" : p.severity === "green" ? "text-emerald-400" : "text-amber-400"}`}>{p.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">💡 Policy Intelligence</h2>
          <div className="space-y-3">
            {[
              {
                title: "Dropout Hotspots",
                desc: "5 blocks in Tirunelveli & Krishnagiri districts show dropout risk >3%. Recommend targeted scholarship drives.",
                priority: "HIGH",
                color: "red",
              },
              {
                title: "Teacher Deployment Gap",
                desc: "Mathematics and Science teacher shortage is critical in 12 districts. Consider redeployment plan.",
                priority: "HIGH",
                color: "red",
              },
              {
                title: "Digital Lab Expansion",
                desc: "38% of rural schools lack internet access. PM-SHRI and EMIS integration recommended.",
                priority: "MEDIUM",
                color: "yellow",
              },
            ].map((p) => (
              <div key={p.title} className={`p-4 rounded-xl border ${p.color === "red" ? "border-red-500/20 bg-red-500/5" : "border-amber-500/20 bg-amber-500/5"}`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">{p.title}</span>
                  <span className={`badge ${p.color === "red" ? "badge-red" : "badge-yellow"}`}>{p.priority}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
