import PortalLayout from "@/components/PortalLayout";

const navItems = [
  { label: "Dashboard", href: "/student", icon: "🏠" },
  { label: "AI Tutor", href: "/student/ai-tutor", icon: "🤖" },
  { label: "My Subjects", href: "/student/subjects", icon: "📖" },
  { label: "Homework", href: "/student/homework", icon: "📝" },
  { label: "Practice Tests", href: "/student/tests", icon: "✅" },
  { label: "Career Guidance", href: "/student/career", icon: "🚀" },
  { label: "Digital Portfolio", href: "/student/portfolio", icon: "🗂️" },
  { label: "Wellness", href: "/student/wellness", icon: "💚" },
  { label: "Coding Academy", href: "/student/coding", icon: "💻" },
];

const careers = [
  { title: "Doctor / MBBS", icon: "🩺", path: "NEET → MBBS → MD", color: "from-red-600 to-rose-600", subjects: ["Biology", "Chemistry", "Physics"], category: "Medical" },
  { title: "Engineer", icon: "⚙️", path: "JEE → B.Tech → M.Tech", color: "from-blue-600 to-cyan-600", subjects: ["Mathematics", "Physics", "Chemistry"], category: "Engineering" },
  { title: "IAS / IPS Officer", icon: "🏛️", path: "Graduation → UPSC → Training", color: "from-amber-600 to-orange-600", subjects: ["History", "Polity", "Geography"], category: "Civil Services" },
  { title: "TNPSC / State PSC", icon: "📋", path: "Graduation → TNPSC Group → Service", color: "from-violet-600 to-purple-600", subjects: ["General Studies", "Tamil", "English"], category: "Civil Services" },
  { title: "Police / Armed Forces", icon: "👮", path: "12th → Police Exam → Training", color: "from-slate-600 to-gray-600", subjects: ["Physical Training", "General Knowledge"], category: "Defence" },
  { title: "Banking / Finance", icon: "🏦", path: "B.Com/BBA → IBPS → Bank PO", color: "from-emerald-600 to-teal-600", subjects: ["Mathematics", "Economics", "English"], category: "Finance" },
  { title: "Agriculture Officer", icon: "🌾", path: "B.Sc Agri → TNAU → Agri Officer", color: "from-green-600 to-lime-600", subjects: ["Biology", "Chemistry", "Botany"], category: "Agriculture" },
  { title: "IT / Software", icon: "💻", path: "B.Tech CS → FAANG / Startup", color: "from-indigo-600 to-blue-600", subjects: ["Mathematics", "Computer Science"], category: "Technology" },
];

export default function CareerGuidancePage() {
  return (
    <PortalLayout
      title="Career Guidance"
      subtitle="AI-powered career mapping for Class 9–12"
      avatarLetter="A"
      avatarColor="#6366f1"
      navItems={navItems}
      themeClass="theme-student"
      accentColor="#6366f1"
    >
      {/* AI Analysis Banner */}
      <div className="glass rounded-2xl p-6 mb-6 fade-in border border-indigo-500/20" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))" }}>
        <div className="flex items-center gap-4">
          <div className="text-4xl">🤖</div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-white mb-1">Your AI Career Analysis</h2>
            <p className="text-sm text-slate-400">
              Based on your performance in <strong className="text-indigo-400">Mathematics (78%)</strong> and <strong className="text-indigo-400">Science (65%)</strong>, the AI recommends careers in <strong className="text-purple-400">Engineering</strong> or <strong className="text-purple-400">Technology</strong>.
            </p>
          </div>
          <div className="flex-shrink-0 text-center">
            <div className="text-3xl font-bold text-indigo-400">82%</div>
            <div className="text-xs text-slate-500">Career Match Score</div>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          {["Engineering 82%", "IT / Software 79%", "Banking 71%"].map((rec) => (
            <div key={rec} className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-3 py-1.5 text-xs text-indigo-300">
              ⭐ {rec}
            </div>
          ))}
        </div>
      </div>

      {/* Career Cards */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white fade-in-2">Explore Career Paths</h2>
          <div className="flex gap-2">
            {["All", "Medical", "Engineering", "Civil Services", "Technology", "Finance"].map((cat) => (
              <button key={cat} className="text-xs px-3 py-1.5 glass rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 fade-in-3">
          {careers.map((career) => (
            <button
              key={career.title}
              id={`career-${career.title.toLowerCase().replace(/\s+\/\s+/g, "-").replace(/\s+/g, "-")}`}
              className="glass rounded-2xl p-5 text-left hover:-translate-y-1 transition-all hover:shadow-xl group border border-transparent hover:border-indigo-500/20"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${career.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                {career.icon}
              </div>
              <div className="text-sm font-semibold text-white mb-1">{career.title}</div>
              <div className="text-xs text-slate-500 mb-3">{career.path}</div>
              <div className="flex flex-wrap gap-1">
                {career.subjects.map((s) => (
                  <span key={s} className="badge badge-blue text-slate-400" style={{ background: "rgba(99,102,241,0.1)", color: "#a5b4fc" }}>
                    {s}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Roadmap Section */}
      <div className="glass rounded-2xl p-6 fade-in-4">
        <h2 className="text-base font-semibold text-white mb-5">🗺️ Your Personalized Roadmap — Engineering Track</h2>
        <div className="flex items-start gap-0 overflow-x-auto pb-2">
          {[
            { step: "Now", label: "Class 10", desc: "Focus on Math & Science. Score 85%+ in Board", icon: "🎓" },
            { step: "2025", label: "Class 11–12", desc: "Choose Maths-Physics-Chemistry (MPC) stream", icon: "📚" },
            { step: "2026", label: "JEE Preparation", desc: "Coaching + NCERT mastery. Target JEE Main", icon: "🎯" },
            { step: "2027", label: "JEE Mains / TNEA", desc: "Appear for JEE or TNEA for Tamil Nadu colleges", icon: "📝" },
            { step: "2027–31", label: "B.Tech", desc: "4-year degree in CS / EEE / Mech / Civil", icon: "🏫" },
            { step: "2031+", label: "Career", desc: "FAANG / Core Engineering / GATE / M.Tech", icon: "🚀" },
          ].map((step, i) => (
            <div key={step.step} className="flex items-start gap-0 min-w-0">
              <div className="flex flex-col items-center min-w-[140px]">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 ${i === 0 ? "bg-indigo-600" : "bg-slate-800 border border-slate-700"}`}>
                  {step.icon}
                </div>
                <div className={`text-xs font-bold mb-0.5 ${i === 0 ? "text-indigo-400" : "text-slate-400"}`}>{step.step}</div>
                <div className="text-xs font-semibold text-white text-center">{step.label}</div>
                <div className="text-xs text-slate-500 text-center mt-1 leading-relaxed px-1">{step.desc}</div>
              </div>
              {i < 5 && (
                <div className="flex items-start pt-5 mx-1">
                  <div className="w-8 h-0.5 bg-slate-700 mt-0.5" />
                  <div className="text-slate-600 -mt-2 text-lg">›</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
