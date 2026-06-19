import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";

const kpiData = [
  { title: "ACTIVE ALUMNI", value: "2,840+", subtitle: "â†‘ 14% this year", icon: "ðŸ‘¥", color: "blue", subColor: "text-blue-500", iconBg: "bg-blue-100 dark:bg-blue-500/15", iconColor: "text-blue-600 dark:text-blue-400", borderColor: "border-t-blue-500" },
  { title: "EMPLOYMENT RATE", value: "94.2%", subtitle: "Global top tier", icon: "ðŸ’¼", color: "green", subColor: "text-green-500", iconBg: "bg-green-100 dark:bg-green-500/15", iconColor: "text-green-600 dark:text-green-400", borderColor: "border-t-green-500" },
  { title: "FUNDS DONATED", value: "$342.5K", subtitle: "For library upgrade", icon: "ðŸª™", color: "orange", subColor: "text-orange-500", iconBg: "bg-orange-100 dark:bg-orange-500/15", iconColor: "text-orange-600 dark:text-orange-400", borderColor: "border-t-orange-500" },
  { title: "ACTIVE MENTORS", value: "187 Staff", subtitle: "Providing career prep", icon: "ðŸŽ“", color: "pink", subColor: "text-pink-500", iconBg: "bg-pink-100 dark:bg-pink-500/15", iconColor: "text-pink-600 dark:text-pink-400", borderColor: "border-t-pink-500" },
];

const notices = [
  { id: 1, initials: "PJ", bg: "bg-indigo-600", badge: "CRITICAL", badgeColor: "text-pink-600 bg-pink-100 border-pink-200 dark:text-pink-400 dark:bg-pink-500/15 dark:border-pink-500/30", category: "Administrative", date: "May 20, 2026 Â· Today", title: "School Closure Due to Weather", desc: "Due to severe weather conditions, the school will remain closed on Monday, May 25th. All classes and activities are cancelled.", author: "By Principal Johnson" },
  { id: 2, initials: "SD", bg: "bg-green-500", badge: "MEDIUM", badgeColor: "text-orange-600 bg-orange-100 border-orange-200 dark:text-orange-400 dark:bg-orange-500/15 dark:border-orange-500/30", category: "Events", date: "May 18, 2026 Â· 2 days ago", title: "Annual Sports Day Schedule", desc: "The annual sports day will be held on June 15th. All students are required to participate in at least one event. Registration closes...", author: "By Sports Dept" },
];

export default function TeacherDashboard() {
  return (
    <PortalLayout
      title="Dashboard 2"
      subtitle=""
    >
      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {kpiData.map((kpi, i) => (
          <div key={i} className={`theme-card border-t-4 ${kpi.borderColor} p-6 flex justify-between items-start relative overflow-hidden group`}>
            <div>
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">{kpi.title}</p>
              <h3 className="text-3xl font-bold text-[var(--text-heading)] mb-2">{kpi.value}</h3>
              <p className={`text-xs ${kpi.subColor}`}>{kpi.subtitle}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${kpi.iconBg} ${kpi.iconColor} group-hover:scale-110 transition-transform`}>
              {kpi.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Student Attendance */}
        <div className="lg:col-span-1 theme-card p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[var(--text-heading)] flex items-center gap-2">
              <span className="text-blue-500">ðŸ‘¤</span> Student Attendance
            </h2>
            <button className="text-xs bg-[var(--input-bg)] hover:bg-[var(--bg-card-hover)] text-[var(--text-main)] px-3 py-1.5 rounded-md font-medium border border-[var(--input-border)] flex items-center gap-1">
              All Classes <span>â–¼</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-green-50 dark:bg-green-500/10 rounded-xl p-3 text-center border border-green-100 dark:border-green-500/20">
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">Present</p>
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1 flex items-center justify-center gap-1">
                <span>âœ“</span> 342
              </h3>
              <p className="text-xs text-green-500 dark:text-green-400/70">89%</p>
            </div>
            <div className="bg-red-50 dark:bg-red-500/10 rounded-xl p-3 text-center border border-red-100 dark:border-red-500/20">
              <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">Absent</p>
              <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1 flex items-center justify-center gap-1">
                <span>âœ•</span> 18
              </h3>
              <p className="text-xs text-red-500 dark:text-red-400/70">5%</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-500/10 rounded-xl p-3 text-center border border-orange-100 dark:border-orange-500/20">
              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">Late</p>
              <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1 flex items-center justify-center gap-1">
                <span>â±</span> 24
              </h3>
              <p className="text-xs text-orange-500 dark:text-orange-400/70">6%</p>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="flex-1 min-h-[200px] relative mt-auto border-b border-l border-[var(--border-light)]">
             {/* Mock Chart Lines */}
             <div className="absolute left-0 bottom-[20%] w-full border-t border-[var(--border)]"></div>
             <div className="absolute left-0 bottom-[40%] w-full border-t border-[var(--border)]"></div>
             <div className="absolute left-0 bottom-[60%] w-full border-t border-[var(--border)]"></div>
             <div className="absolute left-0 bottom-[80%] w-full border-t border-[var(--border)]"></div>
             
             {/* Y Axis labels */}
             <div className="absolute -left-8 bottom-[18%] text-[10px] text-[var(--text-muted)]">200</div>
             <div className="absolute -left-8 bottom-[38%] text-[10px] text-[var(--text-muted)]">300</div>
             <div className="absolute -left-8 bottom-[58%] text-[10px] text-[var(--text-muted)]">400</div>

             {/* SVG Mock Line */}
             <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0,70 Q10,65 20,68 T40,75 T60,65 T80,72 T100,60" fill="none" stroke="#22c55e" strokeWidth="2" />
                <circle cx="0" cy="70" r="2" fill="#22c55e" />
                <circle cx="20" cy="68" r="2" fill="#22c55e" />
                <circle cx="40" cy="75" r="2" fill="#22c55e" />
                <circle cx="60" cy="65" r="2" fill="#22c55e" />
                <circle cx="80" cy="72" r="2" fill="#22c55e" />
                <circle cx="100" cy="60" r="2" fill="#22c55e" />
             </svg>
             <div className="absolute bottom-10 -left-12 transform -rotate-90 text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
               Number of Students
             </div>
          </div>
        </div>

        {/* Noticeboard */}
        <div className="lg:col-span-2 theme-card p-0 flex flex-col relative overflow-hidden">
          <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
            <h2 className="text-lg font-bold text-[var(--text-heading)] flex items-center gap-2">
              <span className="text-blue-500">ðŸ“¢</span> Noticeboard & Announcements
              <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20 px-2 py-0.5 rounded-full ml-2">4 New</span>
            </h2>
            <button className="text-[var(--text-muted)] hover:text-[var(--text-heading)]">
              <span className="text-xl">â‰¡</span>
            </button>
          </div>

          <div className="flex border-b border-[var(--border)]">
            <button className="flex-1 py-3 text-sm font-bold text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400">All (7)</button>
            <button className="flex-1 py-3 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-heading)]">Unread (4)</button>
            <button className="flex-1 py-3 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-heading)]">Urgent (4)</button>
          </div>

          <div className="p-6 space-y-4">
            {notices.map((notice) => (
              <div key={notice.id} className="border border-[var(--border)] rounded-xl p-4 hover:shadow-md transition-shadow bg-[var(--bg-card)] flex gap-4">
                <div className={`w-10 h-10 rounded-full text-[var(--text-heading)] font-bold flex items-center justify-center shrink-0 ${notice.bg}`}>
                  {notice.initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${notice.badgeColor}`}>{notice.badge}</span>
                    <span className="text-xs text-[var(--text-muted)] bg-[var(--input-bg)] px-2 py-0.5 rounded">{notice.category}</span>
                    <span className="text-xs text-[var(--text-muted)] ml-auto flex items-center gap-1">ðŸ“… {notice.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--text-heading)] mb-1 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">{notice.title}</h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3 line-clamp-2">{notice.desc}</p>
                  <div className="text-[10px] font-medium text-[var(--text-muted)] flex items-center gap-1">
                    ðŸ‘¤ {notice.author}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Action Button */}
          <button className="absolute bottom-6 right-6 w-12 h-12 bg-purple-600 hover:bg-purple-700 text-[var(--text-heading)] rounded-full shadow-lg flex items-center justify-center text-2xl transition-transform hover:scale-110">
            +
          </button>
        </div>
      </div>
    </PortalLayout>
  );
}

