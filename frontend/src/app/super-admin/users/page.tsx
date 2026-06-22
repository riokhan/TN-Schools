"use client";
import PortalLayout from "@/components/PortalLayout";

const roles = [
  { role: "STUDENT", label: "Student", icon: "🎓", count: "47,20,400", portals: 1, status: "active" },
  { role: "TEACHER", label: "Teacher", icon: "📚", count: "2,10,000", portals: 1, status: "active" },
  { role: "PARENT", label: "Parent", icon: "👨‍👩‍👧", count: "38,00,000", portals: 1, status: "active" },
  { role: "HEADMASTER", label: "Headmaster", icon: "🏫", count: "37,404", portals: 1, status: "active" },
  { role: "BEO", label: "Block Education Officer", icon: "🏢", count: "385", portals: 1, status: "active" },
  { role: "DEO", label: "District Education Officer", icon: "🗺️", count: "38", portals: 1, status: "active" },
  { role: "COMMISSIONER", label: "Commissioner", icon: "⚖️", count: "12", portals: 1, status: "active" },
  { role: "MINISTER", label: "Minister", icon: "🏛️", count: "1", portals: 1, status: "active" },
  { role: "SUPERADMIN", label: "Super Admin", icon: "🛠️", count: "3", portals: 1, status: "active" },
];

const demoAccounts = [
  { email: "student@gmail.com", role: "STUDENT", name: "Arjun Kumar" },
  { email: "teacher@gmail.com", role: "TEACHER", name: "Mrs. Sumathi Devi" },
  { email: "parent@gmail.com", role: "PARENT", name: "Rajesh Kumar" },
  { email: "headmaster@gmail.com", role: "HEADMASTER", name: "Mr. Venkatesh R." },
  { email: "beo@gmail.com", role: "BEO", name: "Mr. Murugesan P." },
  { email: "deo@gmail.com", role: "DEO", name: "DEO Officer" },
  { email: "commissioner@gmail.com", role: "COMMISSIONER", name: "Commissioner" },
  { email: "minister@gmail.com", role: "MINISTER", name: "Minister" },
  { email: "superadmin@gmail.com", role: "SUPERADMIN", name: "Super Admin" },
];

export default function UserRoles() {
  return (
    <PortalLayout>
      <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
        <p className="text-xs text-emerald-300">
          👥 <strong>User Roles & Access</strong> — Overview of all portal roles, user counts, and demo account mappings.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {roles.map((r) => (
          <div key={r.role} className="glass rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{r.icon}</span>
              <span className="text-[9px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full uppercase">
                {r.status}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">{r.label}</h3>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{r.role}</p>
            <div className="text-2xl font-extrabold text-amber-400 mt-3">{r.count}</div>
            <div className="text-[10px] text-slate-500">registered users</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-5">🔑 Demo Account Registry</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {demoAccounts.map((account) => (
                <tr key={account.email} className="border-b border-slate-800/50 hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-3 text-xs font-semibold text-white">{account.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono">{account.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {account.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[9px] font-bold text-green-400">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PortalLayout>
  );
}
