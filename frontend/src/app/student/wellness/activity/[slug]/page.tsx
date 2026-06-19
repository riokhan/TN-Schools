"use client";

import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";
import { useState, useEffect } from "react";

const activityData: Record<string, any> = {
  "mindfulness": {
    en: {
      title: "5-Minute Focus Breathing",
      category: "Mindfulness",
      instructions: [
        "Find a comfortable, quiet place to sit.",
        "Close your eyes and take a deep breath in through your nose.",
        "Hold for a few seconds, then exhale slowly through your mouth.",
        "Focus solely on the rhythm of your breath."
      ],
      whyInfo: "Taking regular breaks and practicing mindfulness helps reduce cognitive load, lowers stress hormones, and dramatically improves your ability to retain information while studying."
    },
    ta: {
      title: "5 நிமிட கவனக் குவியம் மூச்சுப்பயிற்சி",
      category: "மனதைக் குவித்தல்",
      instructions: [
        "அமைதியான, வசதியான இடத்தில் அமரவும்.",
        "கண்களை மூடி மூக்கின் வழியாக ஆழமாக மூச்சை இழுக்கவும்.",
        "சில விநாடிகள் அடக்கி வைத்து, பின்னர் வாய் வழியாக மெதுவாக மூச்சை விடவும்.",
        "உங்கள் மூச்சின் தாளத்தில் மட்டுமே கவனம் செலுத்தவும்."
      ],
      whyInfo: "தொடர்ச்சியான இடைவேளைகளை எடுத்துக்கொள்வதும், மனதைக் குவித்தல் பயிற்சி செய்வதும் அறிவாற்றல் சுமையைக் குறைக்கிறது, மன அழுத்த ஹார்மோன்களைக் குறைக்கிறது மற்றும் படிக்கும் போது தகவல்களைத் தக்கவைத்துக்கொள்ளும் உங்கள் திறனை வியத்தகு முறையில் மேம்படுத்துகிறது."
    },
    icon: "🌬️",
    duration: 300,
    theme: { bg: "from-emerald-900/50 to-emerald-900/10", border: "border-emerald-500/30", text: "text-emerald-400", button: "bg-emerald-500 hover:bg-emerald-600" }
  },
  "physical-health": {
    en: {
      title: "Study Break Stretches",
      category: "Physical Health",
      instructions: [
        "Stand up from your desk and stretch your arms high above your head.",
        "Roll your shoulders backward 5 times, then forward 5 times.",
        "Gently tilt your head from side to side to stretch your neck.",
        "Touch your toes (or as far as you can comfortably reach) and hold for 10 seconds."
      ],
      whyInfo: "Taking regular breaks and practicing physical health helps reduce cognitive load, lowers stress hormones, and dramatically improves your ability to retain information while studying."
    },
    ta: {
      title: "படிப்பு இடைவேளை நீட்சிகள்",
      category: "உடல் நலம்",
      instructions: [
        "உங்கள் மேசையிலிருந்து எழுந்து, கைகளை தலைக்கு மேலே உயர்த்தி நீட்டவும்.",
        "உங்கள் தோள்களை 5 முறை பின்னோக்கியும், 5 முறை முன்னோக்கியும் சுழற்றவும்.",
        "உங்கள் கழுத்தை நீட்ட தலையை பக்கவாட்டில் மெதுவாக சாய்க்கவும்.",
        "உங்கள் கால் விரல்களைத் தொடவும் (அல்லது முடிந்தவரை) மற்றும் 10 விநாடிகள் வைத்திருக்கவும்."
      ],
      whyInfo: "தொடர்ச்சியான இடைவேளைகளை எடுத்துக்கொள்வதும், உடல் நலம் பேணுவதும் அறிவாற்றல் சுமையைக் குறைக்கிறது, மன அழுத்த ஹார்மோன்களைக் குறைக்கிறது மற்றும் தகவல்களைத் தக்கவைத்துக்கொள்ளும் திறனை மேம்படுத்துகிறது."
    },
    icon: "🤸‍♂️",
    duration: 600,
    theme: { bg: "from-blue-900/50 to-blue-900/10", border: "border-blue-500/30", text: "text-blue-400", button: "bg-blue-500 hover:bg-blue-600" }
  },
  "mental-focus": {
    en: {
      title: "Lofi Focus Beats",
      category: "Mental Focus",
      instructions: [
        "Put on your headphones and adjust the volume to a comfortable level.",
        "Clear your workspace of any distractions.",
        "Set a specific goal for what you want to achieve during this focus session.",
        "Hit play and start working."
      ],
      whyInfo: "Listening to structured ambient sounds helps mask distracting noises, keeping your brain engaged and improving long-term mental focus."
    },
    ta: {
      title: "லோஃபி ஃபோகஸ் பீட்ஸ்",
      category: "மனக் குவிப்பு",
      instructions: [
        "உங்கள் ஹெட்ஃபோன்களை அணிந்து, ஒலியை வசதியான நிலைக்கு அமைக்கவும்.",
        "கவனச்சிதறல்களைத் தவிர்க்க உங்கள் பணியிடத்தை சுத்தம் செய்யவும்.",
        "இந்த அமர்வில் நீங்கள் என்ன சாதிக்க விரும்புகிறீர்கள் என்பதற்கான இலக்கை அமைக்கவும்.",
        "பிளே செய்து வேலை செய்யத் தொடங்குங்கள்."
      ],
      whyInfo: "சீரான சூழல் ஒலிகளைக் கேட்பது கவனச்சிதறல்களை மறைத்து, மூளையை சுறுசுறுப்பாக வைத்திருக்கவும் நீண்ட நேர கவனத்தை மேம்படுத்தவும் உதவுகிறது."
    },
    icon: "🎧",
    duration: 1800,
    theme: { bg: "from-purple-900/50 to-purple-900/10", border: "border-purple-500/30", text: "text-purple-400", button: "bg-purple-500 hover:bg-purple-600" }
  },
  "habit": {
    en: {
      title: "Digital Detox Challenge",
      category: "Habit",
      instructions: [
        "Turn off notifications on your phone and tablet.",
        "Place your devices in another room or out of sight.",
        "Engage in an offline activity: read a physical book, draw, or take a walk.",
        "Reflect on how you feel after the detox."
      ],
      whyInfo: "Taking a conscious break from screens reduces eye strain, combats digital fatigue, and encourages more mindful daily habits."
    },
    ta: {
      title: "டிஜிட்டல் டிடாக்ஸ் சவால்",
      category: "பழக்கம்",
      instructions: [
        "உங்கள் தொலைபேசி மற்றும் டேப்லெட்டில் அறிவிப்புகளை முடக்கவும்.",
        "உங்கள் சாதனங்களை வேறொரு அறையில் அல்லது பார்வையில் படாதபடி வைக்கவும்.",
        "புத்தகம் படிப்பது, வரைவது அல்லது நடப்பது போன்ற ஆஃப்லைன் செயல்களில் ஈடுபடவும்.",
        "இந்த சவாலுக்குப் பிறகு நீங்கள் எப்படி உணருகிறீர்கள் என்று சிந்திக்கவும்."
      ],
      whyInfo: "திரைகளில் இருந்து உணர்வுபூர்வமாக ஓய்வு எடுப்பது கண் சோர்வைக் குறைக்கிறது, டிஜிட்டல் சோர்வை எதிர்த்துப் போராடுகிறது மற்றும் நற்பழக்கங்களை ஊக்குவிக்கிறது."
    },
    icon: "📵",
    duration: 7200,
    theme: { bg: "from-amber-900/50 to-amber-900/10", border: "border-amber-500/30", text: "text-amber-400", button: "bg-amber-500 hover:bg-amber-600" }
  }
};

export default function ActivityPage({ params }: { params: { slug: string } }) {
  const data = activityData[params.slug] || activityData["mindfulness"];
  
  const [timeLeft, setTimeLeft] = useState(data.duration);
  const [isActive, setIsActive] = useState(false);
  const [lang, setLang] = useState<"en" | "ta">("en");

  const tData = data[lang];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev: number) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Optional: Play a sound or show a completion modal here
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(data.duration);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((data.duration - timeLeft) / data.duration) * 100;

  return (
    <PortalLayout
      title={tData.title}
      subtitle={`${lang === 'ta' ? 'வகை' : 'Category'}: ${tData.category}`}
      avatarLetter="A"
      avatarColor="#10b981"
      themeClass="theme-student"
      accentColor="#10b981"
    >
      <div className="mb-4 flex justify-between items-center">
        <Link href="/student/wellness" className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-semibold transition-colors">
          <span>←</span> {lang === 'ta' ? 'நல்வாழ்வு மையத்திற்குத் திரும்பு' : 'Back to Wellness Hub'}
        </Link>
        <button 
          onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
          className="text-xs font-bold bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
        >
          {lang === 'en' ? 'Translate to Tamil / தமிழில் மாற்றுக' : 'Translate to English'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Timer Section */}
        <div className={`glass rounded-3xl p-10 flex flex-col items-center justify-center border-2 ${data.theme.border} bg-gradient-to-br ${data.theme.bg} relative overflow-hidden shadow-2xl`}>
          
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
             <div className={`h-full ${data.theme.button} transition-all duration-1000`} style={{ width: `${progress}%` }}></div>
          </div>

          <div className={`text-8xl mb-6 ${isActive ? 'animate-pulse' : ''}`}>{data.icon}</div>
          
          <div className="text-6xl font-mono font-black text-white mb-8 tracking-wider">
            {formatTime(timeLeft)}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={toggleTimer}
              className={`px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition-transform active:scale-95 ${data.theme.button}`}
            >
              {isActive 
                 ? (lang === 'ta' ? 'இடைநிறுத்து' : 'Pause') 
                 : (timeLeft < data.duration ? (lang === 'ta' ? 'தொடர்க' : 'Resume') : (lang === 'ta' ? 'தொடங்கு' : 'Start Session'))}
            </button>
            <button 
              onClick={resetTimer}
              className="px-6 py-4 rounded-2xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-colors border border-slate-700"
            >
              {lang === 'ta' ? 'மீட்டமை' : 'Reset'}
            </button>
          </div>
          
          {timeLeft === 0 && (
            <div className="mt-6 text-emerald-400 font-bold animate-bounce text-lg text-center">
              🎉 {lang === 'ta' ? 'அமர்வு முடிந்தது! மிகச் சிறப்பு!' : 'Session Completed! Great job!'}
            </div>
          )}
        </div>

        {/* Instructions Section */}
        <div className="glass rounded-3xl p-8 border border-slate-700/50">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-2xl">📋</span> {lang === 'ta' ? 'இதை எப்படிச் செய்வது' : 'How to do this'}
          </h2>
          <ul className="space-y-6">
            {tData.instructions.map((step: string, idx: number) => (
              <li key={idx} className="flex items-start gap-4 group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${data.theme.border} ${data.theme.text} font-bold text-sm bg-slate-900 group-hover:scale-110 transition-transform`}>
                  {idx + 1}
                </div>
                <p className="text-slate-300 leading-relaxed mt-1 group-hover:text-white transition-colors">
                  {step}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-10 p-5 rounded-2xl bg-slate-900/60 border border-slate-700 flex items-start gap-4">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="text-white font-bold mb-1">{lang === 'ta' ? 'இது ஏன் முக்கியமானது?' : 'Why is this important?'}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {tData.whyInfo}
              </p>
            </div>
          </div>
        </div>

      </div>
    </PortalLayout>
  );
}
