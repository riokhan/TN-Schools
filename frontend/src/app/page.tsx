"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { portals } from "@/lib/navConfig";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

/* ─── Translations Dictionary ─── */
const t = {
  en: {
    navLive: "Live Platform",
    navFeatures: "Features",
    navPortals: "Portals",
    navImpact: "Impact",
    navTestimonials: "Testimonials",
    navSignIn: "🔒 Sign In",
    navSignOut: "Sign Out",
    
    heroBadge: "Tamil Nadu Government — Live Platform",
    heroTitle1: "AI Smart Learning",
    heroTitle2: "Ecosystem",
    heroSub: "State-wide digital learning, governance & student success platform for Tamil Nadu Government Schools",
    heroType1: "Class 6–12 · 37,000+ Schools · 47.2 Lakh Students",
    heroType2: "AI Tutoring · Adaptive Learning · Real-time Analytics",
    heroType3: "8 Role-based Portals · State-wide Governance",
    heroBtnGo: "🚀 Go to Your Portal",
    heroBtnSignIn: "🚀 Get Started — Sign In",
    heroBtnExplore: "Explore Portals ↓",
    heroScroll: "Scroll to explore",

    statTitleSub: "Our Impact",
    statTitle1: "Transforming Education at",
    statTitle2: "Scale",
    statDesc: "Real numbers. Real impact. Powering the entire Tamil Nadu education ecosystem.",
    stats: [
      { label: "Total Students", value: "47.2L" },
      { label: "Government Schools", value: "37,000+" },
      { label: "Dedicated Teachers", value: "2.1L" },
      { label: "Districts Covered", value: "38" },
    ],

    featTitleSub: "Platform Features",
    featTitle1: "Everything You Need for",
    featTitle2: "Smart Education",
    featDesc: "Built with cutting-edge AI and real-time data for every stakeholder in the education ecosystem.",
    features: [
      { title: "AI-Powered Tutoring", desc: "Personalized learning pathways using advanced AI for every student across Class 6–12." },
      { title: "Real-time Analytics", desc: "Live dashboards tracking attendance, performance, and learning outcomes at every level." },
      { title: "Adaptive Assessments", desc: "Smart question generation and AI-evaluated tests with instant feedback and guidance." },
      { title: "Multi-Role Governance", desc: "8 dedicated portals from Student to Minister, each with role-specific insights." },
      { title: "Live State Monitoring", desc: "Real-time command center for state-wide education health and KPI tracking." },
      { title: "Career & Scholarship", desc: "AI-driven career guidance, college admissions support, and scholarship tracking." },
    ],

    portalTitleSub: "Role-Based Access",
    portalTitle1: "Select Your",
    portalTitle2: "Portal",
    portalDesc: "8 dedicated portals designed for every role in the education hierarchy.",
    portalEnter: "Enter Portal",

    testTitleSub: "Testimonials",
    testTitle1: "Trusted by",
    testTitle2: "Thousands",
    testDesc: "Hear from the educators, students, and parents transforming education in Tamil Nadu.",

    ctaBadge: "Platform is Live",
    ctaTitle: "Ready to Transform Education?",
    ctaDesc: "Join 47.2 lakh students and 2.1 lakh teachers already using the platform across Tamil Nadu.",
    ctaBtnIn: "🚀 Sign In to Portal",
    ctaBtnBrowse: "Browse Portals",

    ftPortals: "Portals",
    ftAdmin: "Administration",
    ftRes: "Resources",
    ftHelp: "Help Center",
    ftDoc: "Documentation",
    ftPrivacy: "Privacy Policy",
    ftTerms: "Terms of Service",
    ftCopy: "Tamil Nadu School Education Department · AI Smart Learning Ecosystem",
    ftStatus: "All Systems Operational"
  },
  ta: {
    navLive: "நேரடி தளம்",
    navFeatures: "அம்சங்கள்",
    navPortals: "இணையதளங்கள்",
    navImpact: "தாக்கம்",
    navTestimonials: "சான்றளிப்புகள்",
    navSignIn: "🔒 உள்நுழைக",
    navSignOut: "வெளியேறு",

    heroBadge: "தமிழ்நாடு அரசு — நேரடி தளம்",
    heroTitle1: "செயற்கை நுண்ணறிவு ஸ்மார்ட்",
    heroTitle2: "கற்றல் சூழல்",
    heroSub: "தமிழ்நாடு அரசுப் பள்ளிகளுக்கான மாநில அளவிலான டிஜிட்டல் கற்றல், நிர்வாகம் மற்றும் மாணவர் வெற்றித் தளம்",
    heroType1: "வகுப்பு 6–12 · 37,000+ பள்ளிகள் · 47.2 லட்சம் மாணவர்கள்",
    heroType2: "AI பயிற்சி · தழுவல் கற்றல் · நிகழ்நேர பகுப்பாய்வு",
    heroType3: "8 பங்கு அடிப்படையிலான இணையதளங்கள் · மாநில அளவிலான நிர்வாகம்",
    heroBtnGo: "🚀 உங்கள் தளத்திற்கு செல்க",
    heroBtnSignIn: "🚀 தொடங்குங்கள் — உள்நுழைக",
    heroBtnExplore: "இணையதளங்களை ஆராய்க ↓",
    heroScroll: "மேலும் அறிய கீழே உருட்டவும்",

    statTitleSub: "எங்கள் தாக்கம்",
    statTitle1: "பெரிய அளவில்",
    statTitle2: "கல்வி மாற்றம்",
    statDesc: "உண்மையான எண்கள். உண்மையான தாக்கம். முழு தமிழ்நாடு கல்வி அமைப்பையும் இயக்குகிறது.",
    stats: [
      { label: "மொத்த மாணவர்கள்", value: "47.2L" },
      { label: "அரசு பள்ளிகள்", value: "37,000+" },
      { label: "அர்ப்பணிப்புள்ள ஆசிரியர்கள்", value: "2.1L" },
      { label: "உள்ளடக்கிய மாவட்டங்கள்", value: "38" },
    ],

    featTitleSub: "தளத்தின் அம்சங்கள்",
    featTitle1: "ஸ்மார்ட் கல்விக்கு தேவையான",
    featTitle2: "அனைத்தும்",
    featDesc: "மேம்பட்ட AI மற்றும் நிகழ்நேர தரவுடன் அனைத்து கல்வி பங்குதாரர்களுக்காகவும் உருவாக்கப்பட்டது.",
    features: [
      { title: "AI-ஆதரவு பயிற்சி", desc: "வகுப்பு 6 முதல் 12 வரையிலான அனைத்து மாணவர்களுக்கும் மேம்பட்ட AI மூலம் தனிப்பயனாக்கப்பட்ட கற்றல் வழிகள்." },
      { title: "நிகழ்நேர பகுப்பாய்வு", desc: "ஒவ்வொரு நிலையிலும் வருகை, செயல்திறன் மற்றும் கற்றல் முடிவுகளைக் கண்காணிக்கும் நேரடி டாஷ்போர்டுகள்." },
      { title: "தழுவல் மதிப்பீடுகள்", desc: "உடனடி கருத்துக்களுடன் கூடிய சிறந்த கேள்வி உருவாக்கம் மற்றும் AI மதிப்பீடு செய்யும் தேர்வுகள்." },
      { title: "பல-பங்கு நிர்வாகம்", desc: "மாணவர் முதல் அமைச்சர் வரை 8 பிரத்யேக இணையதளங்கள்." },
      { title: "நேரடி மாநில கண்காணிப்பு", desc: "மாநில அளவிலான கல்வி சுகாதாரம் மற்றும் KPI கண்காணிப்புக்கான நிகழ்நேர கட்டுப்பாட்டு மையம்." },
      { title: "தொழில் & உதவித்தொகை", desc: "AI வழிகாட்டுதல், கல்லூரி சேர்க்கை ஆதரவு மற்றும் உதவித்தொகை கண்காணிப்பு." },
    ],

    portalTitleSub: "பங்கு-அடிப்படையிலான அணுகல்",
    portalTitle1: "உங்கள் இணையதளத்தை",
    portalTitle2: "தேர்வு செய்க",
    portalDesc: "கல்விப் படிநிலையில் உள்ள ஒவ்வொரு பொறுப்புக்கும் வடிவமைக்கப்பட்ட 8 இணையதளங்கள்.",
    portalEnter: "உள்ளே நுழைய",

    testTitleSub: "சான்றளிப்புகள்",
    testTitle1: "ஆயிரக்கணக்கானோரால்",
    testTitle2: "நம்பப்படுகிறது",
    testDesc: "தமிழ்நாட்டில் கல்வியை மாற்றிவரும் கல்வியாளர்கள், மாணவர்கள் மற்றும் பெற்றோர்களிடம் கேளுங்கள்.",

    ctaBadge: "தளம் நேரலையில் உள்ளது",
    ctaTitle: "கல்வியை மாற்ற தயாரா?",
    ctaDesc: "தமிழ்நாடு முழுவதும் இந்த தளத்தை பயன்படுத்தும் 47.2 லட்சம் மாணவர்கள் மற்றும் 2.1 லட்சம் ஆசிரியர்களுடன் நீங்களும் சேருங்கள்.",
    ctaBtnIn: "🚀 தளத்தில் உள்நுழைக",
    ctaBtnBrowse: "இணையதளங்களை உலாவு",

    ftPortals: "இணையதளங்கள்",
    ftAdmin: "நிர்வாகம்",
    ftRes: "வளங்கள்",
    ftHelp: "உதவி மையம்",
    ftDoc: "ஆவணங்கள்",
    ftPrivacy: "தனியுரிமை கொள்கை",
    ftTerms: "சேவை விதிமுறைகள்",
    ftCopy: "தமிழ்நாடு பள்ளிக்கல்வி துறை · AI ஸ்மார்ட் கற்றல் சூழல்",
    ftStatus: "அனைத்து அமைப்புகளும் செயல்படுகின்றன"
  }
};

/* ─── Static Data ─── */
const statsData = [
  { icon: "👨‍🎓", color: "from-indigo-500 to-purple-500", textColor: "text-indigo-400" },
  { icon: "🏫", color: "from-emerald-500 to-teal-500", textColor: "text-emerald-400" },
  { icon: "📚", color: "from-amber-500 to-orange-500", textColor: "text-amber-400" },
  { icon: "🗺️", color: "from-cyan-500 to-blue-500", textColor: "text-cyan-400" },
];

const featuresData = [
  { icon: "🤖", gradient: "from-indigo-600 to-purple-600" },
  { icon: "📊", gradient: "from-emerald-600 to-teal-600" },
  { icon: "🎯", gradient: "from-amber-600 to-orange-600" },
  { icon: "🛡️", gradient: "from-rose-600 to-pink-600" },
  { icon: "📡", gradient: "from-cyan-600 to-blue-600" },
  { icon: "🎓", gradient: "from-violet-600 to-indigo-600" },
];

const testimonials = [
  { name: "Mrs. Sumathi Devi", role: "Mathematics Teacher, GHS Coimbatore", text: "The AI Lesson Planner has transformed how I prepare classes. My students' engagement has increased by 40% this semester.", avatar: "S", color: "#f59e0b" },
  { name: "Arjun Kumar", role: "Class 10 Student, GHSS Madurai", text: "The adaptive quizzes and AI tutor helped me understand concepts I struggled with. I scored 95% in my board exams!", avatar: "A", color: "#6366f1" },
  { name: "Mr. Rajesh", role: "Parent, Chennai District", text: "I can track my daughter's progress in real-time. The notifications keep me connected with her school activities.", avatar: "R", color: "#10b981" },
  { name: "Mr. Venkatesh R.", role: "Headmaster, GHS Coimbatore", text: "Managing 1200+ students has never been this efficient. The dashboard gives me a complete 360° view of the school.", avatar: "V", color: "#3b82f6" },
];

const partners = [
  "Tamil Nadu Government", "EMIS Portal", "Samagra Shiksha", "NCERT", "CBSE", "NTA",
  "Tamil Nadu Government", "EMIS Portal", "Samagra Shiksha", "NCERT", "CBSE", "NTA"
];

/* ─── Framer Motion Variants ─── */
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, duration: 1, bounce: 0.3 } }
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { type: "spring" as const, duration: 1, bounce: 0.3 } }
};

/* ─── Typed Text Effect ─── */
function TypedText({ texts, speed = 60, pause = 2000 }: { texts: string[]; speed?: number; pause?: number }) {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentText.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
        if (charIndex + 1 === currentText.length) {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        setDisplayText(currentText.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          setTextIndex((textIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, speed, pause]);

  return (
    <span>
      {displayText}
      <span className="typing-cursor" />
    </span>
  );
}

/* ─── Floating Particles Component ─── */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            left: `${Math.random() * 100}%`,
            bottom: '-10px',
            background: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#60a5fa'][Math.floor(Math.random() * 5)],
            animationDuration: `${Math.random() * 15 + 10}s`,
            animationDelay: `${Math.random() * 10}s`,
            opacity: Math.random() * 0.5 + 0.1,
          }}
        />
      ))}
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function HomePage() {
  const { data: session } = useSession();
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [lang, setLang] = useState<"en" | "ta">("en");
  
  const text = t[lang];

  const { scrollYProgress } = useScroll();
  const yHeroBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  /* Navbar scroll detection */
  useEffect(() => {
    const handleScroll = () => setIsNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Testimonial auto-rotation */
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen gradient-bg">
      {/* ═══════════════ FIXED NAVBAR ═══════════════ */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`landing-nav ${isNavScrolled ? "scrolled" : ""}`} id="main-nav"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" id="nav-logo">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
              🏛️
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-wide">TN Schools</div>
              <div className="text-[10px] text-slate-500 font-medium">AI Smart Ecosystem</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-xs text-slate-400 hover:text-white transition-colors font-medium">{text.navFeatures}</a>
            <a href="#portals" className="text-xs text-slate-400 hover:text-white transition-colors font-medium">{text.navPortals}</a>
            <a href="#stats" className="text-xs text-slate-400 hover:text-white transition-colors font-medium">{text.navImpact}</a>
            <a href="#testimonials" className="text-xs text-slate-400 hover:text-white transition-colors font-medium">{text.navTestimonials}</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
              <button 
                onClick={() => setLang('en')}
                className={`text-xs px-3 py-1 rounded-md transition-colors ${lang === 'en' ? 'bg-indigo-500 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('ta')}
                className={`text-xs px-3 py-1 rounded-md transition-colors ${lang === 'ta' ? 'bg-indigo-500 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                தமிழ்
              </button>
            </div>
            {session ? (
              <>
                <span className="hidden sm:inline-flex text-xs text-slate-400 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-full items-center gap-2">
                  <span className="pulse-dot" style={{ width: 6, height: 6 }} />
                  <strong className="text-white">{(session.user as any)?.name}</strong>
                </span>
                <button
                  id="nav-signout"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all"
                >
                  {text.navSignOut}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                id="nav-signin"
                className="btn-glow btn-glow-amber text-xs !py-2 !px-5"
              >
                {text.navSignIn}
              </Link>
            )}
          </div>
        </div>
      </motion.nav>

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="hero-gradient relative min-h-screen flex items-center justify-center pt-20 overflow-hidden" id="hero">
        <motion.div style={{ y: yHeroBg }} className="absolute inset-0 z-0">
            <div className="mesh-overlay" />
            <FloatingParticles />
            {/* Glow orbs */}
            <div className="absolute top-1/4 left-1/5 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[150px] pointer-events-none" />
        </motion.div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 glass-strong px-5 py-2.5 rounded-full mb-8"
          >
            <span className="pulse-dot" />
            <span className="text-sm text-slate-300 font-medium">{text.heroBadge}</span>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-semibold">2026</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-[1.05] tracking-tight"
          >
            <span className="gradient-text-hero">{text.heroTitle1}</span>
            <br />
            <span className="text-white">{text.heroTitle2}</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-4 leading-relaxed"
          >
            {text.heroSub}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base text-slate-500 mb-10 h-7"
          >
            <TypedText
              key={lang} // Reset typing effect on language change
              texts={[
                text.heroType1,
                text.heroType2,
                text.heroType3,
              ]}
              speed={45}
              pause={2500}
            />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            {session ? (
              <Link href={`/${(session.user as any)?.role?.toLowerCase() || 'student'}`} className="btn-glow btn-glow-primary" id="hero-goto-portal">
                {text.heroBtnGo}
              </Link>
            ) : (
              <Link href="/login" className="btn-glow btn-glow-primary" id="hero-signin">
                {text.heroBtnSignIn}
              </Link>
            )}
            <a href="#portals" className="btn-glow btn-glow-secondary" id="hero-explore">
              {text.heroBtnExplore}
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            <a href="#stats" className="inline-flex flex-col items-center gap-2 text-slate-600 hover:text-slate-400 transition-colors">
              <span className="text-[10px] uppercase tracking-widest font-medium">{text.heroScroll}</span>
              <div className="w-5 h-8 border-2 border-slate-700 rounded-full flex justify-center pt-1.5">
                <motion.div 
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-1 h-2 bg-slate-500 rounded-full" 
                />
              </div>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ PARTNER MARQUEE ═══════════════ */}
      <div className="border-y border-slate-800/60 py-5 overflow-hidden bg-slate-900/30">
        <div className="marquee-track">
          {partners.map((p, i) => (
            <div key={i} className="flex items-center gap-3 px-10">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">{p}</span>
              <span className="text-slate-800">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════ STATS SECTION ═══════════════ */}
      <section className="py-24 relative" id="stats">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3 block">{text.statTitleSub}</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
              {text.statTitle1} <span className="gradient-text">{text.statTitle2}</span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              {text.statDesc}
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {text.stats.map((s, index) => (
              <motion.div key={s.label} variants={fadeInScale} className="stat-card group">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${statsData[index].color} flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {statsData[index].icon}
                </div>
                <div className={`text-3xl md:text-4xl font-extrabold ${statsData[index].textColor} mb-2`}>
                  {s.value}
                </div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════ FEATURES SECTION ═══════════════ */}
      <section className="py-24 relative" id="features">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3 block">{text.featTitleSub}</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
              {text.featTitle1} <span className="gradient-text">{text.featTitle2}</span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              {text.featDesc}
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {text.features.map((f, index) => (
              <motion.div 
                key={f.title} 
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                className="feature-card group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${featuresData[index].gradient} flex items-center justify-center text-3xl mx-auto mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {featuresData[index].icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════ PORTALS SECTION ═══════════════ */}
      <section className="py-24 relative" id="portals">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3 block">{text.portalTitleSub}</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
              {text.portalTitle1} <span className="gradient-text">{text.portalTitle2}</span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              {text.portalDesc}
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {portals.map((portal) => (
              <motion.div key={portal.href} variants={fadeInUp} whileHover={{ y: -6, scale: 1.03 }}>
                <Link
                  href={portal.href}
                  id={`portal-link-${portal.href.replace(/\//g, "").replace(/-/g, "_")}`}
                  className="portal-card h-full"
                  style={{ '--card-accent': `linear-gradient(90deg, ${portal.color.includes('indigo') ? '#6366f1' : portal.color.includes('emerald') ? '#10b981' : portal.color.includes('amber') ? '#f59e0b' : portal.color.includes('blue') ? '#3b82f6' : portal.color.includes('violet') ? '#8b5cf6' : portal.color.includes('pink') ? '#ec4899' : portal.color.includes('cyan') ? '#06b6d4' : '#ef4444'}, transparent)` } as any}
                >
                  <div
                    className={`portal-icon-wrap w-14 h-14 rounded-xl bg-gradient-to-br ${portal.color} flex items-center justify-center text-2xl shadow-lg`}
                  >
                    {portal.icon}
                  </div>
                  <div>
                    {/* Translate label using mapping if needed, but since portals comes from navConfig, we might just display it or a hardcoded translation here. For now, keep the navConfig label but ideally this should be translated. */}
                    <div className="font-semibold text-white text-sm mb-1.5">{portal.label}</div>
                    <div className="text-xs text-slate-500 leading-relaxed">{portal.desc}</div>
                  </div>
                  <div className="mt-auto pt-2 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span>{text.portalEnter}</span>
                    <span className="portal-arrow">→</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════ TESTIMONIALS SECTION ═══════════════ */}
      <section className="py-24 relative overflow-hidden" id="testimonials">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3 block">{text.testTitleSub}</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
              {text.testTitle1} <span className="gradient-text-gold">{text.testTitle2}</span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              {text.testDesc}
            </p>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  className={`testimonial-card transition-all duration-500 ${
                    i === activeTestimonial ? "border-indigo-500/30 shadow-lg shadow-indigo-500/5 scale-[1.02]" : "opacity-70"
                  }`}
                  onMouseEnter={() => setActiveTestimonial(i)}
                  layout
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ background: t.color }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.role}</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed italic">"{t.text}"</p>
                  <div className="flex gap-1 mt-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-amber-400 text-sm">★</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Testimonial dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === activeTestimonial ? "bg-indigo-500 w-6" : "bg-slate-700 hover:bg-slate-600"
                  }`}
                  aria-label={`View testimonial ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════ CTA SECTION ═══════════════ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/8 rounded-full blur-[150px]" />
        </div>

        <motion.div 
          variants={fadeInScale}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mx-auto px-6 text-center"
        >
          <div className="glass-strong rounded-3xl p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 pointer-events-none" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 text-xs bg-indigo-500/10 text-indigo-300 px-4 py-1.5 rounded-full font-semibold mb-6">
                <span className="pulse-dot" style={{ width: 6, height: 6 }} />
                {text.ctaBadge}
              </span>

              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
                {text.ctaTitle}
              </h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                {text.ctaDesc}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login" className="btn-glow btn-glow-primary" id="cta-signin">
                  {text.ctaBtnIn}
                </Link>
                <a href="#portals" className="btn-glow btn-glow-secondary" id="cta-explore">
                  {text.ctaBtnBrowse}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t border-slate-800/60 relative" id="footer">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-lg">
                  🏛️
                </div>
                <div>
                  <div className="text-sm font-bold text-white">TN Schools</div>
                  <div className="text-[10px] text-slate-500">AI Smart Ecosystem</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {text.heroSub}
              </p>
            </div>

            {/* Portals */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">{text.ftPortals}</h4>
              <div className="space-y-2.5">
                {portals.slice(0, 4).map((p) => (
                  <Link key={p.href} href={p.href} className="block text-xs text-slate-500 hover:text-indigo-400 transition-colors">
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Administration */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">{text.ftAdmin}</h4>
              <div className="space-y-2.5">
                {portals.slice(4).map((p) => (
                  <Link key={p.href} href={p.href} className="block text-xs text-slate-500 hover:text-indigo-400 transition-colors">
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">{text.ftRes}</h4>
              <div className="space-y-2.5">
                <a href="#" className="block text-xs text-slate-500 hover:text-indigo-400 transition-colors">{text.ftHelp}</a>
                <a href="#" className="block text-xs text-slate-500 hover:text-indigo-400 transition-colors">{text.ftDoc}</a>
                <a href="#" className="block text-xs text-slate-500 hover:text-indigo-400 transition-colors">{text.ftPrivacy}</a>
                <a href="#" className="block text-xs text-slate-500 hover:text-indigo-400 transition-colors">{text.ftTerms}</a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} {text.ftCopy}
            </p>
            <div className="flex items-center gap-6">
              <span className="inline-flex items-center gap-2 text-xs text-slate-600">
                <span className="pulse-dot" style={{ width: 6, height: 6 }} />
                {text.ftStatus}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
