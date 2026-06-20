"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { roleConfigs, NavItem } from "@/lib/navConfig";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "next-themes";

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
  
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      <div className="min-h-screen bg-[var(--bg-main)] flex flex-col items-center justify-center text-center p-6">
        <div className="w-10 h-10 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin mb-4" />
        <p className="text-xs text-[var(--text-muted)]">Checking credentials...</p>
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
  const isDark = mounted && theme === "dark";
  const resolvedAccentColor = isDark ? "#2dce89" : (accentColor || currentConfig?.accentColor || "#6366f1");
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
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-6 text-center">
        <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border)] p-8 rounded-3xl space-y-5 flex flex-col items-center shadow-lg">
          <span className="text-4xl text-red-500">⚠️</span>
          <h2 className="text-[var(--text-heading)] text-lg font-bold">Unauthorized Portal Access</h2>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Your authenticated role is <strong className="text-red-400 font-bold">{userRole}</strong>.
            You are not authorized to view the <strong className="text-amber-500 font-bold">{expectedRole}</strong> dashboard pages.
          </p>
          <div className="flex gap-3 w-full pt-3">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex-1 py-2.5 rounded-xl border border-[var(--border-light)] text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-card-hover)] transition-all"
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
    <div className={`min-h-screen bg-[var(--bg-main)] ${resolvedThemeClass}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}>
        {/* Logo Section */}
        <div className="px-6 mb-6 flex items-center gap-3 mt-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl shrink-0">🏛️</span>
            <div className="leading-tight text-left">
              <span className="block text-base font-black text-[var(--text-heading)]">TN Schools</span>
              <span className="block text-[10px] font-semibold text-[var(--text-muted)] tracking-wider">AI Ecosystem</span>
            </div>
          </Link>
        </div>

        {/* User Profile Section */}
        <div className="mx-4 p-3 border border-[var(--border)] rounded-2xl flex items-center gap-3 mb-6 bg-slate-50/50 dark:bg-slate-900/20">
          <div className="relative shrink-0">
             <div
               className="w-10 h-10 rounded-full text-white text-base font-bold flex items-center justify-center shadow-sm"
               style={{ background: `linear-gradient(135deg, ${resolvedAccentColor}, ${resolvedAccentColor}dd)` }}
             >
               {letter}
             </div>
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[var(--bg-sidebar)] rounded-full"></div>
          </div>
          <div className="min-w-0 text-left">
            <div className="text-sm font-bold text-[var(--text-heading)] truncate">{displayName}</div>
            <div className="text-[10px] text-[var(--text-muted)] truncate">{displayEmail || (userRole === "TEACHER" ? "Teacher" : "Student")}</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <div className="px-5 mb-2 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
            MAIN
          </div>
          {resolvedNavItems.map((item, index) => {
            if (item.label === "---") {
              return <div key={`sep-${index}`} className="my-4 mx-4 border-t border-[var(--border)]" />;
            }
            if (item.href === "#") {
              return (
                <div key={`header-${index}`} className="px-5 mt-6 mb-2 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
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
              >
                <span className="text-lg opacity-80">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 mt-4 mb-4">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="sidebar-item text-[var(--text-muted)] hover:text-red-500 text-left w-full flex items-center gap-2"
          >
            <span className="text-lg opacity-80">🚪</span>
            <span>{t.signOut}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-30 md:hidden"
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

      {/* Main Content Area */}
      <div className="main-content relative min-h-screen">
        {/* Argon Header Background Gradient */}
        <div 
          className="absolute top-0 left-0 right-0 h-[300px] z-0 transition-all duration-300 pointer-events-none main-content-header-bg"
          style={{
            background: `linear-gradient(87deg, ${resolvedAccentColor} 0%, ${resolvedAccentColor}dd 100%)`
          }}
        />

        {/* Topbar */}
        <div className="topbar mb-6 -mt-2 mx-0 relative z-30 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button
              className="md:hidden text-[var(--text-main)] p-2 rounded-lg hover:bg-[var(--sidebar-item-hover-bg)]"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              ☰
            </button>
            <button className="hidden md:block text-[var(--text-main)] p-2 hover:bg-[var(--sidebar-item-hover-bg)] rounded-lg text-lg">
              ☰
            </button>
            
            {/* If title is provided, display title and subtitle like the screenshot, otherwise show search bar */}
            {resolvedTitle ? (
              <div className="ml-2 text-left">
                <h1 className="text-lg md:text-xl font-bold text-[var(--text-heading)] leading-tight">{resolvedTitle}</h1>
                {resolvedSubtitle && (
                  <p className="text-xs text-[var(--text-muted)] font-medium mt-0.5">{resolvedSubtitle}</p>
                )}
              </div>
            ) : (
              <div className="relative hidden md:block max-w-md w-full ml-2">
                 <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]">🔍</span>
                 <input 
                   type="text" 
                   placeholder="Search pages, settings or... Ctrl K" 
                   className="w-full pl-10 pr-4 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-full text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                 />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 relative z-50">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Expand Icon - hidden in light theme card design for simplicity, keeping in dark layout */}
            <button className="p-2 text-[var(--text-main)] hover:bg-[var(--sidebar-item-hover-bg)] rounded-full transition-colors hidden sm:block dark:block">
              ⛶
            </button>

            {/* Language Selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => {
                  setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
                  setIsNotificationsOpen(false);
                  setIsProfileOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border)] rounded-xl text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--sidebar-item-hover-bg)] transition-colors"
                title="Language"
              >
                <span className="text-sm">🌐</span>
                <span>{currentLanguage}</span>
                <span className="text-[10px] opacity-60">▼</span>
              </button>
              {isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-lg z-50 py-1">
                  <button
                    onClick={() => {
                      setCurrentLanguage("English");
                      setIsLanguageDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-[var(--text-main)] hover:bg-[var(--sidebar-item-hover-bg)] transition-colors"
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      setCurrentLanguage("தமிழ்");
                      setIsLanguageDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-[var(--text-main)] hover:bg-[var(--sidebar-item-hover-bg)] transition-colors"
                  >
                    தமிழ்
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Button */}
            <div className="relative">
              <button
                id="portal-notifications-btn"
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                  setIsLanguageDropdownOpen(false);
                }}
                className="relative p-2 text-[var(--text-main)] hover:bg-[var(--sidebar-item-hover-bg)] rounded-full transition-colors"
              >
                <span className="text-lg">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold border-2 border-[var(--bg-card)]">
                    {unreadCount}
                  </span>
                )}
              </button>
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-[var(--border)] flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/10">
                    <span className="text-xs font-bold text-[var(--text-heading)]">{t.notificationsTitle}</span>
                    <button 
                      onClick={() => setUnreadCount(0)}
                      className="text-[10px] text-[var(--primary)] hover:underline font-semibold"
                    >
                      {t.markAllRead}
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {roleNotifications.length > 0 && unreadCount > 0 ? (
                      roleNotifications.map((notif: string, i: number) => (
                        <div key={i} className="p-3.5 text-xs text-[var(--text-main)] border-b border-[var(--border)] hover:bg-[var(--bg-card-hover)] transition-colors">
                          {notif}
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-xs text-[var(--text-muted)]">
                        {t.noNotifications}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar Mini */}
            <div className="relative ml-1 flex items-center">
               <div
                  className="w-9 h-9 rounded-full text-white text-xs font-bold flex items-center justify-center cursor-pointer shadow-sm border border-[var(--border)]"
                  style={{ background: `linear-gradient(135deg, ${resolvedAccentColor}, ${resolvedAccentColor}dd)` }}
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsNotificationsOpen(false);
                    setIsLanguageDropdownOpen(false);
                  }}
               >
                  {letter}
               </div>
               {isProfileOpen && (
                 <div className="absolute right-0 mt-12 top-0 w-56 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-xl z-50 py-2">
                   <div className="px-4 py-2 border-b border-[var(--border)] mb-1">
                     <div className="text-xs font-bold text-[var(--text-heading)] truncate">{displayName}</div>
                     <div className="text-[10px] text-[var(--text-muted)] truncate">{displayEmail}</div>
                   </div>
                   <Link href="#" className="flex items-center gap-2 px-4 py-2 text-xs text-[var(--text-main)] hover:bg-[var(--sidebar-item-hover-bg)] transition-colors">
                     👤 {t.profileTitle}
                   </Link>
                   <Link href="#" className="flex items-center gap-2 px-4 py-2 text-xs text-[var(--text-main)] hover:bg-[var(--sidebar-item-hover-bg)] transition-colors">
                     ⚙️ {t.settings}
                   </Link>
                   <Link href="#" className="flex items-center gap-2 px-4 py-2 text-xs text-[var(--text-main)] hover:bg-[var(--sidebar-item-hover-bg)] transition-colors">
                     ❓ {t.help}
                   </Link>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Children content relative to sit above absolute background */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
