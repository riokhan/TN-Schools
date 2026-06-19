"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { roleConfigs, NavItem } from "@/lib/navConfig";

interface PortalLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  avatarLetter?: string;
  avatarColor?: string;
  navItems?: NavItem[];
  themeClass?: string;
  accentColor?: string;
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
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  // Redirect to sign-in page if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Loading indicator screen
  if (status === "loading") {
    return (
      <div className="min-h-screen gradient-bg flex flex-col items-center justify-center text-center p-6">
        <div className="w-10 h-10 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin mb-4" />
        <p className="text-xs text-slate-500">Checking credentials...</p>
      </div>
    );
  }

  // Double check auth fallback
  if (!session) {
    return null;
  }

  // Get active role from NextAuth token
  let userRole = (session?.user as any)?.role || "STUDENT";

  // Re-map student roles to specialized configurations based on path
  if (userRole === "STUDENT") {
    if (pathname.startsWith("/student/middle-school")) {
      userRole = "STUDENT_MIDDLE";
    } else if (pathname.startsWith("/student/high-school")) {
      userRole = "STUDENT_HIGH";
    } else if (pathname.startsWith("/student/higher-secondary")) {
      userRole = "STUDENT_HIGHER";
    }
  }

  const currentConfig = roleConfigs[userRole];

  // Resolve configuration falling back to central store
  const resolvedAccentColor = accentColor || currentConfig?.accentColor || "#6366f1";
  const resolvedThemeClass = themeClass || currentConfig?.themeClass || "theme-student";
  const resolvedNavItems = navItems || currentConfig?.navItems || [];
  const resolvedTitle = title || currentConfig?.title || "Portal Dashboard";
  const resolvedSubtitle = subtitle || currentConfig?.subtitle || "";
  const resolvedAvatarLetter = avatarLetter || currentConfig?.avatarLetter || "P";

  // Enforce access mapping rules
  let isAuthorized = true;
  let expectedRole = "";
  let fallbackPath = "/student";

  if (pathname.startsWith("/teacher")) {
    isAuthorized = userRole === "TEACHER";
    expectedRole = "TEACHER";
    fallbackPath = "/teacher";
  } else if (pathname.startsWith("/student")) {
    isAuthorized = userRole === "STUDENT" || userRole === "STUDENT_MIDDLE" || userRole === "STUDENT_HIGH" || userRole === "STUDENT_HIGHER";
    expectedRole = "STUDENT";
    fallbackPath = "/student";
  } else if (pathname.startsWith("/parent")) {
    isAuthorized = userRole === "PARENT";
    expectedRole = "PARENT";
    fallbackPath = "/parent";
  } else if (pathname.startsWith("/headmaster")) {
    isAuthorized = userRole === "HEADMASTER";
    expectedRole = "HEADMASTER";
    fallbackPath = "/headmaster";
  } else if (pathname.startsWith("/block-education-officer")) {
    isAuthorized = userRole === "BEO";
    expectedRole = "BEO";
    fallbackPath = "/block-education-officer";
  } else if (pathname.startsWith("/district-education-officer")) {
    isAuthorized = userRole === "DEO";
    expectedRole = "DEO";
    fallbackPath = "/district-education-officer";
  } else if (pathname.startsWith("/commissioner")) {
    isAuthorized = userRole === "COMMISSIONER";
    expectedRole = "COMMISSIONER";
    fallbackPath = "/commissioner";
  } else if (pathname.startsWith("/minister")) {
    isAuthorized = userRole === "MINISTER";
    expectedRole = "MINISTER";
    fallbackPath = "/minister";
  }

  // Render Access Denied error sheet if unauthorized role tries to access
  if (!isAuthorized) {
    let defaultDest = "/";
    if (userRole === "STUDENT" || userRole === "STUDENT_MIDDLE" || userRole === "STUDENT_HIGH" || userRole === "STUDENT_HIGHER") defaultDest = "/student";
    else if (userRole === "TEACHER") defaultDest = "/teacher";
    else if (userRole === "PARENT") defaultDest = "/parent";
    else if (userRole === "HEADMASTER") defaultDest = "/headmaster";
    else if (userRole === "BEO") defaultDest = "/block-education-officer";
    else if (userRole === "DEO") defaultDest = "/district-education-officer";
    else if (userRole === "COMMISSIONER") defaultDest = "/commissioner";
    else if (userRole === "MINISTER") defaultDest = "/minister";

    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-6 text-center">
        <div className="w-full max-w-md glass border border-slate-800 p-8 rounded-3xl space-y-5 flex flex-col items-center">
          <span className="text-4xl text-red-500">⚠️</span>
          <h2 className="text-white text-lg font-bold">Unauthorized Portal Access</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your authenticated role is <strong className="text-red-400 font-bold">{userRole}</strong>. 
            You are not authorized to view the <strong className="text-amber-500 font-bold">{expectedRole}</strong> dashboard pages.
          </p>
          <div className="flex gap-3 w-full pt-3">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-850 transition-all"
            >
              🚪 Sign Out
            </button>
            <Link
              href={defaultDest}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-xs font-semibold text-slate-950 transition-all block text-center"
            >
              🏠 My Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Adjust avatar parameters dynamically using session profile data
  const displayName = session?.user?.name || resolvedTitle;
  const displayEmail = session?.user?.email || resolvedSubtitle;
  const letter = displayName ? displayName.charAt(0).toUpperCase() : resolvedAvatarLetter;

  return (
    <div className={`min-h-screen gradient-bg ${resolvedThemeClass}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}>
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
              style={{ background: `linear-gradient(135deg, ${resolvedAccentColor}, ${resolvedAccentColor}99)` }}
            >
              {letter}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">{displayName}</div>
              <div className="text-xs text-slate-500 truncate">{displayEmail}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto">
          {resolvedNavItems.map((item, index) => {
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
                style={isActive ? { borderRightColor: resolvedAccentColor, color: resolvedAccentColor } : {}}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 mt-4">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="sidebar-item text-slate-500 hover:text-red-400 text-left w-full flex items-center gap-2"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* Main */}
      <div className="main-content">
        {/* Topbar */}
        <div className="topbar mb-8 rounded-2xl -mt-2 mx-0">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden text-white p-2 glass rounded-lg" 
              onClick={() => setIsMobileMenuOpen(true)}
            >
              ☰
            </button>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-white">{resolvedTitle}</h1>
              <p className="text-xs text-slate-500 truncate max-w-xs md:max-w-md">{resolvedSubtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="pulse-dot"></span>
              <span className="text-xs text-slate-400 font-medium">Live Connection</span>
            </div>
            <button
              id="portal-notifications-btn"
              className="relative p-2 glass rounded-lg hover:bg-slate-700 transition-colors"
            >
              <span className="text-base">🔔</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                3
              </span>
            </button>
            <div
              className="avatar text-white text-sm font-bold"
              style={{ background: `linear-gradient(135deg, ${resolvedAccentColor}, ${resolvedAccentColor}aa)` }}
            >
              {letter}
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
