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

const translations = {
  English: {
    liveConnection: "Live Connection",
    notificationsTitle: "Notifications",
    markAllRead: "Mark all read",
    noNotifications: "No new notifications",
    profileTitle: "My Profile",
    settings: "Account Settings",
    help: "Help & Support",
    signOut: "Sign Out",
    role: "Role",
    notifications: {
      TEACHER: [
        "Senthil K. (Class 8A) flagged as high dropout risk. ⚠️",
        "New lesson plan generated for Grade 10 Science. 🔬",
        "Leave request Casual Leave approved by Headmaster. ✓",
      ],
      STUDENT: [
        "New assignment added: Science Lab Report. 📝",
        "You received a 'Star Scientist' badge from Mr. Ramesh! 🏅",
        "Upcoming Mock Test: Mathematics on Monday. 📅",
      ],
      PARENT: [
        "Arjun's attendance today marked Present (98% overall). 🟢",
        "New teacher note: Please check homework submission. 💬",
        "Upcoming PTA Meeting scheduled for June 24th. 🤝",
      ],
      DEFAULT: [
        "Welcome to the Tamil Nadu Smart Education Portal. 🏛️",
        "Please verify your profile details and EMIS registry. 👤",
        "Weekly state progress reports are now available. 📊",
      ]
    }
  },
  "தமிழ்": {
    liveConnection: "நேரடி இணைப்பு",
    notificationsTitle: "அறிவிப்புகள்",
    markAllRead: "அனைத்தையும் படித்ததாகக் குறி",
    noNotifications: "புதிய அறிவிப்புகள் இல்லை",
    profileTitle: "எனது சுயவிவரம்",
    settings: "கணக்கு அமைப்புகள்",
    help: "உதவி & ஆதரவு",
    signOut: "வெளியேறு",
    role: "பங்கு",
    notifications: {
      TEACHER: [
        "செந்தில் கே. (வகுப்பு 8A) அதிக விலகல் அபாயத்தில் உள்ளார். ⚠️",
        "வகுப்பு 10 அறிவியலுக்கான புதிய பாடத்திட்டம் உருவாக்கப்பட்டது. 🔬",
        "உங்களின் தற்செயல் விடுப்பு கோரிக்கை தலைமையாசிரியரால் அங்கீகரிக்கப்பட்டது. ✓",
      ],
      STUDENT: [
        "புதிய ஒப்படைப்பு சேர்க்கப்பட்டது: அறிவியல் ஆய்வக அறிக்கை. 📝",
        "திரு. ரமேஷிடம் இருந்து 'நட்சத்திர விஞ்ஞானி' பேட்ஜ் பெற்றுள்ளீர்கள்! 🏅",
        "வரவிருக்கும் மாதிரித் தேர்வு: திங்கள் அன்று கணிதம். 📅",
      ],
      PARENT: [
        "அர்ஜுனின் இன்றைய வருகை பதிவு செய்யப்பட்டுள்ளது (ஒட்டுமொத்தமாக 98%). 🟢",
        "புதிய ஆசிரியர் குறிப்பு: வீட்டுப்பாடச் சமர்ப்பிப்பைச் சரிபார்க்கவும். 💬",
        "ஜூன் 24-ஆம் தேதி திட்டமிடப்பட்ட பெற்றோர் ஆசிரியர் கூட்டத்தில் பங்கேற்கவும். 🤝",
      ],
      DEFAULT: [
        "தமிழ்நாடு ஸ்மார்ட் கல்விப் போர்ட்டலுக்கு உங்களை வரவேற்கிறோம். 🏛️",
        "உங்கள் சுயவிவர விவரங்கள் மற்றும் EMIS பதிவைச் சரிபார்க்கவும். 👤",
        "வாராந்திர மாநில முன்னேற்ற அறிக்கைகள் இப்போது கிடைக்கின்றன. 📊",
      ]
    }
  }
};

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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<"English" | "தமிழ்">("English");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [activeStudentLevel, setActiveStudentLevel] = useState("STUDENT_HIGHER");
  const { data: session, status } = useSession();

  useEffect(() => {
    if (pathname.startsWith("/student/middle-school")) {
      localStorage.setItem("studentLevel", "STUDENT_MIDDLE");
      setActiveStudentLevel("STUDENT_MIDDLE");
    } else if (pathname.startsWith("/student/high-school")) {
      localStorage.setItem("studentLevel", "STUDENT_HIGH");
      setActiveStudentLevel("STUDENT_HIGH");
    } else if (pathname.startsWith("/student/higher-secondary")) {
      localStorage.setItem("studentLevel", "STUDENT_HIGHER");
      setActiveStudentLevel("STUDENT_HIGHER");
    } else if (pathname !== "/student") {
      const stored = localStorage.getItem("studentLevel");
      if (stored) setActiveStudentLevel(stored);
    }
  }, [pathname]);

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
    } else if (pathname === "/student") {
      // Leave as generic STUDENT for the portal landing page
    } else {
      // Default to last active level for common tools
      userRole = activeStudentLevel;
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

  const t = translations[currentLanguage];
  let roleKey: "TEACHER" | "STUDENT" | "PARENT" | "DEFAULT" = "DEFAULT";
  if (userRole.includes("TEACHER")) {
    roleKey = "TEACHER";
  } else if (userRole.includes("STUDENT")) {
    roleKey = "STUDENT";
  } else if (userRole.includes("PARENT")) {
    roleKey = "PARENT";
  }
  const roleNotifications = t.notifications[roleKey];

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
            <span>{t.signOut}</span>
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

      {/* Click outside overlays to close popups */}
      {(isNotificationsOpen || isProfileOpen || isLanguageDropdownOpen) && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => {
            setIsNotificationsOpen(false);
            setIsProfileOpen(false);
            setIsLanguageDropdownOpen(false);
          }}
        />
      )}

      {/* Main */}
      <div className="main-content">
        {/* Topbar */}
        <div className="topbar mb-8 rounded-2xl -mt-2 mx-0 relative z-30">
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
          <div className="flex items-center gap-4 relative z-50">
            {/* Live Connection badge */}
            <div className="hidden xs:flex items-center gap-1.5">
              <span className="pulse-dot"></span>
              <span className="text-xs text-slate-400 font-semibold">{t.liveConnection}</span>
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
                  setIsNotificationsOpen(false);
                  setIsProfileOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-2 glass rounded-lg hover:bg-slate-700 transition-colors text-xs font-semibold text-slate-300"
              >
                <span>🌐</span>
                <span>{currentLanguage}</span>
                <span className="text-[9px] opacity-70">▼</span>
              </button>
              {isLanguageDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-28 rounded-xl p-1 z-50"
                  style={{
                    background: "#090d16",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.05)"
                  }}
                >
                  {(["English", "தமிழ்"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setCurrentLanguage(lang);
                        setIsLanguageDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${currentLanguage === lang
                          ? "bg-amber-500 text-slate-950"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Button & Popover */}
            <div className="relative">
              <button
                id="portal-notifications-btn"
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                  setIsLanguageDropdownOpen(false);
                }}
                className="relative p-2 glass rounded-lg hover:bg-slate-700 transition-colors"
              >
                <span className="text-base">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-80 rounded-2xl p-4 z-50 text-left"
                  style={{
                    background: "#090d16",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.05)"
                  }}
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-2.5">
                    <span className="text-xs font-bold text-white">{t.notificationsTitle}</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => setUnreadCount(0)}
                        className="text-[10px] text-amber-400 hover:text-amber-300 font-bold transition-colors"
                      >
                        {t.markAllRead}
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-[250px] overflow-y-auto">
                    {unreadCount > 0 ? (
                      roleNotifications.map((notif, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-850 hover:border-slate-700 transition-colors text-xs text-slate-300 leading-relaxed"
                        >
                          {notif}
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-xs text-slate-500 italic">
                        {t.noNotifications}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Popover */}
            <div className="relative">
              <div
                className="avatar text-white text-sm font-bold cursor-pointer hover:scale-105 transition-transform"
                style={{ background: `linear-gradient(135deg, ${resolvedAccentColor}, ${resolvedAccentColor}aa)` }}
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                  setIsLanguageDropdownOpen(false);
                }}
              >
                {letter}
              </div>

              {isProfileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-64 rounded-2xl p-4 z-50 text-left"
                  style={{
                    background: "#090d16",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.05)"
                  }}
                >
                  {/* User Profile Header */}
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-3">
                    <div
                      className="avatar text-white text-sm font-bold shrink-0"
                      style={{ background: `linear-gradient(135deg, ${resolvedAccentColor}, ${resolvedAccentColor}aa)` }}
                    >
                      {letter}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white truncate">{displayName}</div>
                      <div className="text-[10px] text-slate-500 truncate">{displayEmail}</div>
                    </div>
                  </div>

                  {/* Info Roster */}
                  <div className="space-y-1.5 mb-3 text-xs">
                    <div className="flex justify-between p-1.5 rounded-lg bg-slate-900/40">
                      <span className="text-slate-400 font-semibold">{t.role}:</span>
                      <span className="text-amber-400 font-bold">{userRole}</span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-1 border-t border-slate-800 pt-3">
                    <button className="w-full text-left px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-all flex items-center gap-2">
                      <span>⚙️</span>
                      <span>{t.settings}</span>
                    </button>
                    <button className="w-full text-left px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-all flex items-center gap-2">
                      <span>❓</span>
                      <span>{t.help}</span>
                    </button>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all flex items-center gap-2 mt-2"
                    >
                      <span>🚪</span>
                      <span>{t.signOut}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
