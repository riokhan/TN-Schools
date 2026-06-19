"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

interface PortalLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  avatarLetter: string;
  avatarColor: string;
  navItems: NavItem[];
  themeClass: string;
  accentColor: string;
}

export default function PortalLayout({
  children,
  title,
  subtitle,
  avatarLetter,
  avatarColor,
  navItems,
  themeClass,
  accentColor,
}: PortalLayoutProps) {
  const pathname = usePathname();

  return (
    <div className={`min-h-screen gradient-bg ${themeClass}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="px-6 mb-6">
          <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
            <span className="text-xl">🏛️</span>
            <div>
              <div className="text-xs font-bold text-white leading-tight">TN Schools</div>
              <div className="text-xs text-slate-500">AI Ecosystem</div>
            </div>
          </Link>
        </div>

        <div className="px-4 mb-6">
          <div className="glass rounded-xl p-3 flex items-center gap-3">
            <div
              className="avatar text-white text-sm font-bold"
              style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)` }}
            >
              {avatarLetter}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">{title}</div>
              <div className="text-xs text-slate-500 truncate">{subtitle}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto">
          {navItems.map((item, index) => {
            if (item.label === "---") {
              return <div key={`sep-${index}`} className="my-4 mx-4 border-t border-slate-700/50" />;
            }
            if (item.href === "#") {
              return (
                <div key={`header-${index}`} className="px-5 mt-6 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {item.label}
                </div>
              );
            }

            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-item ${isActive ? "active" : ""}`}
                style={isActive ? { borderRightColor: accentColor, color: accentColor } : {}}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 mt-4">
          <Link
            href="/"
            className="sidebar-item text-slate-500 hover:text-red-400"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        {/* Topbar */}
        <div className="topbar mb-8 rounded-2xl -mt-2 mx-0">
          <div>
            <h1 className="text-lg font-bold text-white">{title}</h1>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="pulse-dot"></span>
              <span className="text-xs text-slate-400">Live</span>
            </div>
            <button
              id="portal-notifications-btn"
              className="relative p-2 glass rounded-lg hover:bg-slate-700 transition-colors"
            >
              <span className="text-base">🔔</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
            </button>
            <div
              className="avatar text-white text-sm font-bold"
              style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}aa)` }}
            >
              {avatarLetter}
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
