"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import { portals } from "@/lib/navConfig";

const stats = [
  { label: "Total Students", value: "47.2L", icon: "👨‍🎓", color: "text-indigo-400" },
  { label: "Schools", value: "37,000+", icon: "🏫", color: "text-emerald-400" },
  { label: "Teachers", value: "2.1L", icon: "📚", color: "text-amber-400" },
  { label: "Districts", value: "38", icon: "🗺️", color: "text-cyan-400" },
];

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
          {/* TN Emblem Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 fade-in">
            <span className="pulse-dot"></span>
            <span className="text-sm text-slate-300 font-medium">Tamil Nadu Government — Live Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 fade-in-2 leading-tight">
            <span className="gradient-text">AI Smart Learning</span>
            <br />
            <span className="text-white">Ecosystem</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-6 fade-in-3">
            State-wide digital learning, governance &amp; student success platform for Tamil Nadu Government Schools, Class 6 – 12.
          </p>

          {/* Authentication State Button */}
          {session ? (
            <div className="flex gap-4 justify-center items-center mb-10 fade-in-3">
              <span className="text-xs text-slate-400 font-medium bg-slate-900/60 border border-slate-800 px-3.5 py-1.5 rounded-full">
                Welcome back, <strong className="text-white">{(session.user as any)?.name}</strong> ({(session.user as any)?.role})
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all"
              >
                🚪 Sign Out
              </button>
            </div>
          ) : (
            <div className="flex justify-center mb-10 fade-in-3">
              <Link
                href="/login"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/10 hover:-translate-y-0.5"
              >
                🔒 Sign In to Portal
              </Link>
            </div>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16 fade-in-4">
            {stats.map((s) => (
              <div key={s.label} className="kpi-card text-center">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Portal Selection */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Select Your Portal</h2>
          <p className="text-slate-400">Role-based access to the platform</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {portals.map((portal, i) => (
            <Link
              key={portal.href}
              href={portal.href}
              id={`portal-link-${portal.href.replace(/\//g, "").replace(/-/g, "_")}`}
              className={`glass rounded-2xl p-6 flex flex-col gap-3 border ${portal.border} ${portal.bg} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${portal.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}
              >
                {portal.icon}
              </div>
              <div>
                <div className="font-semibold text-white text-sm mb-1">{portal.label}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{portal.desc}</div>
              </div>
              <div className="mt-auto flex items-center gap-1 text-xs text-slate-500 group-hover:text-slate-300 transition-colors">
                <span>Enter Portal</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 py-8 text-center text-slate-600 text-sm">
        © {new Date().getFullYear()} Tamil Nadu School Education Department · AI Smart Learning Ecosystem
      </div>
    </div>
  );
}
