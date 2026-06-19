import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";


export default function StudentDashboard() {
  return (
    <PortalLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 mt-10">
        
        {/* Middle School */}
        <Link href="/student/middle-school" className="glass rounded-2xl p-6 hover:-translate-y-2 transition-all hover:shadow-xl group border border-emerald-500/30 bg-emerald-900/10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
            🌟
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Middle School</h2>
          <p className="text-emerald-400 font-semibold text-sm mb-3">Classes 6th to 8th</p>
          <p className="text-slate-400 text-sm">Focus on foundational learning, gamified badges, and interactive study buddies.</p>
          <div className="mt-6 flex items-center gap-1 text-xs text-emerald-400">
            <span>Enter Portal</span><span>→</span>
          </div>
        </Link>

        {/* High School */}
        <Link href="/student/high-school" className="glass rounded-2xl p-6 hover:-translate-y-2 transition-all hover:shadow-xl group border border-red-500/30 bg-red-900/10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
            🎯
          </div>
          <h2 className="text-xl font-bold text-white mb-2">High School</h2>
          <p className="text-red-400 font-semibold text-sm mb-3">Classes 9th to 10th</p>
          <p className="text-slate-400 text-sm">Focus on SSLC Public Exams, AI weakness detection, and study boost plans.</p>
          <div className="mt-6 flex items-center gap-1 text-xs text-red-400">
            <span>Enter Portal</span><span>→</span>
          </div>
        </Link>

        {/* Higher Secondary */}
        <Link href="/student/higher-secondary" className="glass rounded-2xl p-6 hover:-translate-y-2 transition-all hover:shadow-xl group border border-purple-500/30 bg-purple-900/10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
            🚀
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Higher Secondary</h2>
          <p className="text-purple-400 font-semibold text-sm mb-3">Classes 11th to 12th</p>
          <p className="text-slate-400 text-sm">Focus on HSC Exams, stream specialization (Science/Commerce), and NEET/JEE prep.</p>
          <div className="mt-6 flex items-center gap-1 text-xs text-purple-400">
            <span>Enter Portal</span><span>→</span>
          </div>
        </Link>

      </div>
      
      <div className="glass rounded-2xl p-6 border border-slate-700/50 mt-10">
        <h3 className="text-slate-300 font-semibold mb-2">Authentication Concept</h3>
        <p className="text-slate-400 text-sm">
          In a production environment with login, this page would not be visible. Instead, the authentication controller would check the `class` of the `Student` object in the database and automatically redirect them to `/student/middle-school`, `/student/high-school`, or `/student/higher-secondary`.
        </p>
      </div>

    </PortalLayout>
  );
}
