"use client";
import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";

const systemStats = [
  { label: "Active Portals", value: "9", icon: "🏛️", color: "text-slate-400", sub: "All roles online" },
  { label: "Dynamic Pages", value: "3", icon: "📄", color: "text-blue-400", sub: "2 enabled" },
  { label: "Total Users", value: "47.2L", icon: "👥", color: "text-emerald-400", sub: "Across TN" },
  { label: "System Uptime", value: "99.9%", icon: "✅", color: "text-amber-400", sub: "Last 30 days" },
];

const quickActions = [
  { label: "Manage Pages", href: "/super-admin/pages", icon: "📄", desc: "Create & edit dynamic portal pages" },
  { label: "Feature Toggles", href: "/super-admin/features", icon: "🔧", desc: "Enable or disable platform features" },
  { label: "User Roles", href: "/super-admin/users", icon: "👥", desc: "View and manage role assignments" },
  { label: "System Logs", href: "/super-admin/logs", icon: "📋", desc: "Audit trail & activity logs" },
];

const recentActivity = [
  { action: "Page enabled", target: "Special AI Sandbox", user: "Super Admin", time: "2 min ago", type: "success" },
  { action: "Feature toggled", target: "Parent Feedback Form", user: "Super Admin", time: "15 min ago", type: "warning" },
  { action: "New page created", target: "Teacher Extra Resource Hub", user: "Super Admin", time: "1 hr ago", type: "info" },
  { action: "Role updated", target: "BEO Portal access", user: "Super Admin", time: "3 hrs ago", type: "info" },
];

export default function SuperAdminDashboard() {
  return (
    <PortalLayout>
      <div className="mb-4 p-3 bg-slate-500/10 border border-slate-500/20 rounded-xl">
        <p className="text-xs text-slate-300">
          🛠️ <strong>Super Admin Control Center</strong> — Manage dynamic pages, feature flags, user roles, and system configuration across all TN Schools portals.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in">
        {systemStats.map((kpi) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 fade-in-2">
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5">⚡ Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 rounded-xl p-4 transition-all hover:-translate-y-0.5 group"
              >
                <div className="text-2xl mb-2">{action.icon}</div>
                <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">{action.label}</div>
                <div className="text-[10px] text-slate-500 mt-1">{action.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5">📋 Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-900/40 rounded-xl px-4 py-3 border border-slate-800/60">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${item.type === "success" ? "bg-green-500" : item.type === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                  <div>
                    <div className="text-xs font-semibold text-white">{item.action}</div>
                    <div className="text-[10px] text-slate-500">{item.target}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">{item.user}</div>
                  <div className="text-[10px] text-slate-600">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 fade-in-3">
        <h2 className="text-base font-semibold text-white mb-5">🏛️ Portal Status Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { name: "Student", status: "active", users: "47.2L" },
            { name: "Teacher", status: "active", users: "2.1L" },
            { name: "Parent", status: "active", users: "38L" },
            { name: "Headmaster", status: "active", users: "37K" },
            { name: "BEO", status: "active", users: "385" },
            { name: "DEO", status: "active", users: "38" },
            { name: "Commissioner", status: "active", users: "12" },
            { name: "Minister", status: "active", users: "1" },
            { name: "Super Admin", status: "active", users: "3" },
          ].map((portal) => (
            <div key={portal.name} className="bg-slate-900/60 rounded-xl p-3 text-center border border-slate-800">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[10px] font-bold text-green-400 uppercase">{portal.status}</span>
              </div>
              <div className="text-xs font-bold text-white">{portal.name}</div>
              <div className="text-[10px] text-slate-500">{portal.users} users</div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
