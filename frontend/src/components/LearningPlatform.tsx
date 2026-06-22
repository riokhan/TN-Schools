// "use client";

// import PortalLayout from "@/components/PortalLayout";
// import { useState } from "react";
// import {
//   Music2,
//   Trophy,
//   Sparkles as DanceSparkle,
//   Cpu,
//   Users2,
//   Globe2,
//   Loader2,
//   RefreshCw,
//   Newspaper,
//   PlayCircle,
//   BookOpen,
//   ChevronRight,
//   Sparkles,
//   GraduationCap,
//   type LucideIcon,
// } from "lucide-react";

// /* ------------------------------------------------------------------ */
// /*  Types & level meta                                                */
// /* ------------------------------------------------------------------ */

// type Level = "middle" | "high" | "higher-secondary";
// type LevelFilter = Level | "all";

// type DeptId =
//   | "music"
//   | "sports"
//   | "dance"
//   | "ai-tech"
//   | "non-tech"
//   | "general"
//   | "career-exams";

// const LEVEL_META: Record<Level, { label: string; sub: string }> = {
//   middle: { label: "Middle School", sub: "Classes 6th – 8th" },
//   high: { label: "High School", sub: "Classes 9th – 10th" },
//   "higher-secondary": { label: "Higher Secondary", sub: "Classes 11th – 12th" },
// };

// interface LevelContent {
//   title: string;
//   summary: string;
//   resourceCount: number;
//   resourceType: "Videos" | "Articles" | "Lessons" | "Workshops";
//   videoId: string;
// }

// interface Department {
//   id: DeptId;
//   name: string;
//   icon: LucideIcon;
//   color: string;
//   tagline: string;
//   byLevel: Partial<Record<Level, LevelContent>>;
// }

// const DEPARTMENTS: Department[] = [
//   {
//     id: "music",
//     name: "Music",
//     icon: Music2,
//     color: "#a78bfa",
//     tagline: "Carnatic, Western, and instrument basics",
//     byLevel: {
//       middle: {
//         title: "Sing-along basics & rhythm games",
//         summary:
//           "Fun intro to swaras, clapping rhythm games, and recognizing simple ragas by ear.",
//         resourceCount: 12,
//         resourceType: "Videos",
//         videoId: "2ePf9rue1Ao",
//       },
//       high: {
//         title: "Carnatic vocal technique & notation",
//         summary:
//           "Reading basic notation, varnam practice, and the structure behind popular kritis.",
//         resourceCount: 18,
//         resourceType: "Lessons",
//         videoId: "2ePf9rue1Ao",
//       },
//       "higher-secondary": {
//         title: "Music theory for composition & exams",
//         summary:
//           "Raga-thala theory in depth, composition basics, and prep for music certification exams.",
//         resourceCount: 9,
//         resourceType: "Workshops",
//         videoId: "2ePf9rue1Ao",
//       },
//     },
//   },
//   {
//     id: "sports",
//     name: "Sports & Athletics",
//     icon: Trophy,
//     color: "#fb923c",
//     tagline: "Fitness, technique, and match strategy",
//     byLevel: {
//       middle: {
//         title: "Movement games & basic fitness",
//         summary:
//           "Fun warm-ups, basic kabaddi and badminton rules, and why daily movement matters.",
//         resourceCount: 15,
//         resourceType: "Videos",
//         videoId: "2ePf9rue1Ao",
//       },
//       high: {
//         title: "Technique drills for district trials",
//         summary:
//           "Position-specific drills, nutrition basics for young athletes, injury prevention.",
//         resourceCount: 22,
//         resourceType: "Lessons",
//         videoId: "2ePf9rue1Ao",
//       },
//       "higher-secondary": {
//         title: "Sports science & performance analytics",
//         summary:
//           "Training periodization, sports psychology under pressure, and scholarship pathways.",
//         resourceCount: 11,
//         resourceType: "Articles",
//         videoId: "2ePf9rue1Ao",
//       },
//     },
//   },
//   {
//     id: "dance",
//     name: "Traditional Dance",
//     icon: DanceSparkle,
//     color: "#f472b6",
//     tagline: "Bharatanatyam, folk forms & cultural roots",
//     byLevel: {
//       middle: {
//         title: "Adavus & storytelling through dance",
//         summary:
//           "Basic adavus, hand gestures (mudras), and the stories behind popular folk dances.",
//         resourceCount: 10,
//         resourceType: "Videos",
//         videoId: "2ePf9rue1Ao",
//       },
//       high: {
//         title: "Bharatanatyam technique & history",
//         summary:
//           "Margam structure, regional variations, and the history of Tamil temple dance traditions.",
//         resourceCount: 14,
//         resourceType: "Lessons",
//         videoId: "2ePf9rue1Ao",
//       },
//       "higher-secondary": {
//         title: "Choreography & cultural curation",
//         summary:
//           "Choreographing original pieces, curating cultural programs, and dance as a career path.",
//         resourceCount: 7,
//         resourceType: "Workshops",
//         videoId: "2ePf9rue1Ao",
//       },
//     },
//   },
//   {
//     id: "ai-tech",
//     name: "AI & Technology",
//     icon: Cpu,
//     color: "#2dd4bf",
//     tagline: "From block coding to real AI tools",
//     byLevel: {
//       middle: {
//         title: "What is AI? Block-coding & robots",
//         summary:
//           "Scratch-style block coding, simple robot logic, and what makes AI different from a calculator.",
//         resourceCount: 20,
//         resourceType: "Videos",
//         videoId: "2ePf9rue1Ao",
//       },
//       high: {
//         title: "Python basics & how AI models learn",
//         summary:
//           "Intro to Python, what training data means, and building a simple chatbot project.",
//         resourceCount: 25,
//         resourceType: "Lessons",
//         videoId: "2ePf9rue1Ao",
//       },
//       "higher-secondary": {
//         title: "ML foundations & JEE-relevant CS",
//         summary:
//           "Neural network basics, real-world AI ethics cases, and CS fundamentals for JEE/NEET-adjacent tracks.",
//         resourceCount: 16,
//         resourceType: "Workshops",
//         videoId: "2ePf9rue1Ao",
//       },
//     },
//   },
//   {
//     id: "non-tech",
//     name: "Non-Tech & Soft Skills",
//     icon: Users2,
//     color: "#60a5fa",
//     tagline: "Communication, leadership, money sense",
//     byLevel: {
//       middle: {
//         title: "Speaking up & teamwork basics",
//         summary:
//           "Confidence-building exercises, simple public speaking, and working well in groups.",
//         resourceCount: 9,
//         resourceType: "Videos",
//         videoId: "2ePf9rue1Ao",
//       },
//       high: {
//         title: "Debate, leadership & time management",
//         summary:
//           "Structured debate formats, student leadership roles, and exam-time scheduling skills.",
//         resourceCount: 13,
//         resourceType: "Lessons",
//         videoId: "2ePf9rue1Ao",
//       },
//       "higher-secondary": {
//         title: "Interview skills & personal finance",
//         summary:
//           "Mock interviews, resume basics, budgeting, and understanding how scholarships work.",
//         resourceCount: 12,
//         resourceType: "Workshops",
//         videoId: "2ePf9rue1Ao",
//       },
//     },
//   },
//   {
//     id: "general",
//     name: "General Knowledge",
//     icon: Globe2,
//     color: "#facc15",
//     tagline: "History, current affairs, civics & health",
//     byLevel: {
//       middle: {
//         title: "Stories from history & how news works",
//         summary:
//           "Bite-sized history stories, basic geography, and a kid-safe intro to how news is reported.",
//         resourceCount: 16,
//         resourceType: "Articles",
//         videoId: "2ePf9rue1Ao",
//       },
//       high: {
//         title: "Current affairs & civics for board exams",
//         summary:
//           "Weekly current affairs digest, Indian polity basics, and board-exam-relevant history topics.",
//         resourceCount: 21,
//         resourceType: "Articles",
//         videoId: "2ePf9rue1Ao",
//       },
//       "higher-secondary": {
//         title: "Politics, policy & health literacy",
//         summary:
//           "In-depth political/economic context, public health awareness, and competitive-exam GK prep.",
//         resourceCount: 19,
//         resourceType: "Articles",
//         videoId: "2ePf9rue1Ao",
//       },
//     },
//   },
//   {
//     id: "career-exams",
//     name: "Career & Competitive Exams",
//     icon: GraduationCap,
//     color: "#34d399",
//     tagline: "AI-matched streams, colleges & entrance prep",
//     byLevel: {
//       "higher-secondary": {
//         title: "AI stream & college matching",
//         summary:
//           "AI-driven suggestions on streams (Science/Commerce/Arts), entrance exam timelines (NEET/JEE/CUET), and college shortlists based on your scores.",
//         resourceCount: 14,
//         resourceType: "Workshops",
//         videoId: "2ePf9rue1Ao",
//       },
//     },
//   },
// ];

// const LEVEL_DEPARTMENTS: Record<Level, DeptId[]> = {
//   middle: ["music", "sports", "dance", "general"],
//   high: ["sports", "ai-tech", "non-tech", "general"],
//   "higher-secondary": ["ai-tech", "non-tech", "general", "career-exams"],
// };

// /* ------------------------------------------------------------------ */
// /*  Mocked AI daily-brief generator                                   */
// /* ------------------------------------------------------------------ */

// const AI_BRIEFS: Record<DeptId, Partial<Record<Level, string>>> = {
//   music: {
//     middle:
//       "Today's pick: try clapping the rhythm of 'Sa Re Ga Ma' three times fast, then slow — that's how musicians warm up their ears!",
//     high:
//       "Spotlight: this week's varnam practice focuses on Adi talam — a great one to record yourself singing and compare.",
//     "higher-secondary":
//       "Exam tip: music theory papers often ask you to identify a raga from notation alone — practice with 5 ragas a day.",
//   },
//   sports: {
//     middle:
//       "Fun fact for today: Tamil Nadu has produced national-level kabaddi champions from school teams just like yours!",
//     high:
//       "District trial dates were just announced for badminton and athletics — check the Sports & Athletics tab for your slot.",
//     "higher-secondary":
//       "Today's focus: recovery matters as much as training. A 10-minute stretch routine after practice cuts injury risk significantly.",
//   },
//   dance: {
//     middle:
//       "Did you know? The mudra for 'flower' in Bharatanatyam is also used to represent a lotus in temple sculptures across Tamil Nadu.",
//     high:
//       "This week: explore how Bharatanatyam's Alarippu (opening piece) trains your body for the entire performance ahead.",
//     "higher-secondary":
//       "Career note: several Tamil Nadu universities now offer dance as a full-time fine arts degree — worth exploring for the arts stream.",
//   },
//   "ai-tech": {
//     middle:
//       "Today in tech: AI chatbots like this one learn from huge amounts of text — kind of like reading a million storybooks!",
//     high:
//       "Quick build idea: try making a simple Python quiz game this week — it uses the same logic as bigger AI projects.",
//     "higher-secondary":
//       "Today's AI news: more Indian companies are hiring for 'AI prompt engineering' roles — a useful skill alongside core CS.",
//   },
//   "non-tech": {
//     middle:
//       "Try this today: introduce yourself to one new classmate using only three sentences — great practice for confidence.",
//     high:
//       "Debate topic of the week: 'Should homework be optional?' — pick a side and list 3 strong points before tomorrow.",
//     "higher-secondary":
//       "Interview tip: practice answering 'Tell me about yourself' in under 60 seconds — recruiters decide fast.",
//   },
//   general: {
//     middle:
//       "On this day in history: many freedom fighters from Tamil Nadu played key roles in India's independence movement — ask your teacher who from your district!",
//     high:
//       "Current affairs digest: this week's national news focused on education policy updates — check the General Knowledge tab for a simplified summary.",
//     "higher-secondary":
//       "Today's brief: a major policy discussion is underway on public health access — relevant background reading for competitive exam GK sections.",
//   },
//   "career-exams": {
//     "higher-secondary":
//       "AI insight: based on common score patterns this term, students strong in Biology + Chemistry are seeing the best fit with Medical-stream colleges — check your own AI match in this section.",
//   },
// };

// /* Interesting "did-you-know" style points per department/level — shown in the info tab */
// const AI_POINTS: Record<DeptId, Partial<Record<Level, string[]>>> = {
//   music: {
//     middle: [
//       "Clapping in rhythm trains the same part of your brain used in maths!",
//       "Carnatic music has 72 base ragas called 'melakarta' — like building blocks for songs.",
//       "Tamil Nadu's December 'Margazhi' season is the world's biggest classical music festival.",
//     ],
//     high: [
//       "Adi talam (8 beats) is the most common rhythm cycle in Carnatic music.",
//       "Notating a song by ear is a skill professional musicians practice daily.",
//       "Many film composers started by learning classical Carnatic technique first.",
//     ],
//     "higher-secondary": [
//       "Music theory exams often test raga identification from written notation alone.",
//       "Composition basics you learn now map directly to electronic/film scoring later.",
//       "Several universities offer music as a full performance-arts degree pathway.",
//     ],
//   },
//   sports: {
//     middle: [
//       "Just 20 minutes of daily movement measurably improves focus in class.",
//       "Kabaddi is one of the few sports that began in rural Tamil Nadu and went international.",
//       "Warm-up games build coordination just as much as 'serious' drills do.",
//     ],
//     high: [
//       "District trial selections often look at consistency over single best performances.",
//       "Proper hydration affects reaction time more than most athletes realize.",
//       "Cross-training in a second sport reduces injury risk in your main sport.",
//     ],
//     "higher-secondary": [
//       "Sports psychology — staying calm under pressure — is now studied like physical training.",
//       "Several state universities offer direct sports quota admissions for state-rank athletes.",
//       "Recovery (sleep + stretching) is statistically as important as practice hours.",
//     ],
//   },
//   dance: {
//     middle: [
//       "Each Bharatanatyam mudra (hand gesture) tells a specific part of a story.",
//       "Folk dances across Tamil Nadu districts each carry a unique local history.",
//       "Dance technique training improves posture and discipline beyond the dance floor.",
//     ],
//     high: [
//       "The 'Margam' is the traditional 7-part structure of a full Bharatanatyam performance.",
//       "Temple dance traditions in Tamil Nadu date back over a thousand years.",
//       "Regional variations of the same dance form often tell completely different stories.",
//     ],
//     "higher-secondary": [
//       "Several Tamil Nadu universities now offer dance as a full fine-arts degree.",
//       "Choreographing an original piece is treated like a capstone project in performing arts.",
//       "Cultural program curation is a real career path in event and arts management.",
//     ],
//   },
//   "ai-tech": {
//     middle: [
//       "AI doesn't 'think' — it finds patterns in huge amounts of example data.",
//       "Block coding (like Scratch) uses the exact same logic as real programming languages.",
//       "Simple robot logic (if-this-then-that) is the foundation of all automation.",
//     ],
//     high: [
//       "Python is the most-used language for AI because it reads almost like English.",
//       "'Training data' is just lots of examples — the more varied, the smarter the model.",
//       "A simple chatbot project teaches the same core logic as large AI systems.",
//     ],
//     "higher-secondary": [
//       "AI prompt engineering is now a real, growing job role in Indian tech companies.",
//       "Neural networks are loosely inspired by how neurons connect in the human brain.",
//       "AI ethics (bias, fairness) is now a required topic in most CS entrance exams.",
//     ],
//   },
//   "non-tech": {
//     middle: [
//       "Speaking in just 3 confident sentences is a real public-speaking technique.",
//       "Working well in a team is one of the most-requested skills by employers, ever.",
//       "Active listening (not just talking) is half of good communication.",
//     ],
//     high: [
//       "Structured debate format forces you to argue both sides — sharpens critical thinking.",
//       "Time-blocking your study schedule reduces exam-week stress significantly.",
//       "Student leadership roles look strong on college applications later.",
//     ],
//     "higher-secondary": [
//       "Recruiters often decide their first impression within 60 seconds of an answer.",
//       "A clear personal budget habit started now compounds hugely by your 20s.",
//       "Scholarship applications often reward extracurricular leadership, not just marks.",
//     ],
//   },
//   general: {
//     middle: [
//       "Many freedom fighters from Tamil Nadu played key roles in India's independence.",
//       "News reporters double-check facts with multiple sources before publishing.",
//       "Geography shapes culture — coastal vs. hill-district festivals look very different.",
//     ],
//     high: [
//       "Indian polity basics (constitution, rights) show up in almost every board exam.",
//       "Reading one current-affairs digest a week beats cramming before exams.",
//       "Local district history often connects directly to national-level events.",
//     ],
//     "higher-secondary": [
//       "Competitive exam GK sections reward consistent weekly reading over last-minute cramming.",
//       "Public health policy literacy is increasingly tested in general studies papers.",
//       "Understanding policy context (not just facts) is what separates top GK scorers.",
//     ],
//   },
//   "career-exams": {
//     "higher-secondary": [
//       "AI-based stream matching looks at your subject strengths, not just overall percentage.",
//       "NEET, JEE, and CUET timelines are now consolidated — missing one date can cost a year.",
//       "College shortlists based on past cutoffs help you target realistic, not just dream, options.",
//     ],
//   },
// };

// /* ------------------------------------------------------------------ */
// /*  Small UI atoms                                                    */
// /* ------------------------------------------------------------------ */

// function ResourceTypeIcon({ type }: { type: LevelContent["resourceType"] }) {
//   if (type === "Videos") return <PlayCircle className="h-3.5 w-3.5" />;
//   if (type === "Articles") return <Newspaper className="h-3.5 w-3.5" />;
//   return <BookOpen className="h-3.5 w-3.5" />;
// }

// function DepartmentCard({
//   dept,
//   level,
//   onExplore,
// }: {
//   dept: Department;
//   level: Level;
//   onExplore: () => void;
// }) {
//   const content = dept.byLevel[level];
//   if (!content) return null;
//   const Icon = dept.icon;

//   return (
//     <div className="group relative rounded-2xl border border-white/[0.06] bg-[#111a2c] p-5 transition-colors hover:border-white/[0.12] hover:bg-[#141f35]">
//       <div className="flex items-start justify-between">
//         <div
//           className="flex h-10 w-10 items-center justify-center rounded-xl"
//           style={{ backgroundColor: `${dept.color}1f`, color: dept.color }}
//         >
//           <Icon className="h-5 w-5" />
//         </div>
//         <span
//           className="rounded-full px-2 py-0.5 text-[10.5px] font-semibold"
//           style={{ backgroundColor: `${dept.color}1f`, color: dept.color }}
//         >
//           {LEVEL_META[level].label}
//         </span>
//       </div>

//       <h3 className="mt-3 text-[15px] font-semibold text-slate-100">
//         {dept.name}
//       </h3>
//       <p className="text-[12px] text-slate-500">{dept.tagline}</p>

//       <div className="mt-3 rounded-xl border border-white/[0.06] bg-[#0d1626] p-3">
//         <p className="text-[13px] font-medium text-slate-200">
//           {content.title}
//         </p>
//         <p className="mt-1 text-[12.5px] leading-relaxed text-slate-400">
//           {content.summary}
//         </p>
//       </div>

//       <div className="mt-3 flex items-center justify-between">
//         <span className="flex items-center gap-1.5 text-[12px] text-slate-500">
//           <ResourceTypeIcon type={content.resourceType} />
//           {content.resourceCount} {content.resourceType}
//         </span>
//         <button
//           onClick={onExplore}
//           className="flex items-center gap-1 text-[12.5px] font-semibold transition-colors"
//           style={{ color: dept.color }}
//         >
//           Explore
//           <ChevronRight className="h-3.5 w-3.5" />
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Explore modal: Video / Key Points toggle                          */
// /* ------------------------------------------------------------------ */

// function ExploreModal({
//   dept,
//   level,
//   onClose,
// }: {
//   dept: Department;
//   level: Level;
//   onClose: () => void;
// }) {
//   const [tab, setTab] = useState<"video" | "points">("points");
//   const content = dept.byLevel[level];
//   const points = AI_POINTS[dept.id]?.[level] ?? [];
//   const Icon = dept.icon;

//   if (!content) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
//       <div className="relative w-full max-w-2xl rounded-2xl border border-white/[0.08] bg-[#0c1322] p-5">
//         <button
//           onClick={onClose}
//           className="absolute right-4 top-4 text-slate-400 hover:text-white"
//         >
//           ✕
//         </button>

//         <div className="flex items-center gap-3 pr-8">
//           <div
//             className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
//             style={{ backgroundColor: `${dept.color}1f`, color: dept.color }}
//           >
//             <Icon className="h-5 w-5" />
//           </div>
//           <div>
//             <p
//               className="text-[12px] font-semibold"
//               style={{ color: dept.color }}
//             >
//               {dept.name} · {LEVEL_META[level].label}
//             </p>
//             <h3 className="text-[16px] font-semibold text-slate-100">
//               {content.title}
//             </h3>
//           </div>
//         </div>

//         {/* Toggle */}
//         <div className="mt-4 flex gap-2">
//           <button
//             onClick={() => setTab("points")}
//             className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
//               tab === "points"
//                 ? "bg-teal-400/15 text-teal-300 ring-1 ring-inset ring-teal-400/30"
//                 : "bg-white/[0.04] text-slate-400 hover:bg-white/[0.07]"
//             }`}
//           >
//             Key Points
//           </button>
//           <button
//             onClick={() => setTab("video")}
//             className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
//               tab === "video"
//                 ? "bg-teal-400/15 text-teal-300 ring-1 ring-inset ring-teal-400/30"
//                 : "bg-white/[0.04] text-slate-400 hover:bg-white/[0.07]"
//             }`}
//           >
//             Video
//           </button>
//         </div>

//         <div className="mt-4">
//           {tab === "points" ? (
//             <div className="space-y-2.5">
//               <p className="text-[12px] text-slate-500">
//                 A few interesting things worth knowing today:
//               </p>
//               {points.length > 0 ? (
//                 points.map((pt, i) => (
//                   <div
//                     key={i}
//                     className="flex gap-3 rounded-xl border border-white/[0.06] bg-[#111a2c] p-3"
//                   >
//                     <span
//                       className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
//                       style={{
//                         backgroundColor: `${dept.color}1f`,
//                         color: dept.color,
//                       }}
//                     >
//                       {i + 1}
//                     </span>
//                     <p className="text-[13px] leading-relaxed text-slate-300">
//                       {pt}
//                     </p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-[13px] text-slate-500">
//                   No points available for this section yet.
//                 </p>
//               )}
//             </div>
//           ) : (
//             <div className="overflow-hidden rounded-xl border border-white/[0.06]">
//               <iframe
//                 width="100%"
//                 height="360"
//                 src={`https://www.youtube.com/embed/${content.videoId}`}
//                 title={content.title}
//                 allowFullScreen
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  AI Daily Brief panel                                              */
// /* ------------------------------------------------------------------ */

// function AiDailyBrief({
//   deptId,
//   setDeptId,
//   level,
//   availableDepts,
// }: {
//   deptId: DeptId;
//   setDeptId: (id: DeptId) => void;
//   level: Level;
//   availableDepts: Department[];
// }) {
//   const [brief, setBrief] = useState<string | null>(
//     AI_BRIEFS[deptId]?.[level] ?? null
//   );
//   const [loading, setLoading] = useState(false);

//   const refresh = (nextDept?: DeptId) => {
//     const target = nextDept ?? deptId;
//     setLoading(true);
//     setBrief(null);
//     window.setTimeout(() => {
//       setBrief(AI_BRIEFS[target]?.[level] ?? null);
//       setLoading(false);
//     }, 900);
//   };

//   return (
//     <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-b from-violet-500/[0.08] to-transparent p-5">
//       <div className="flex items-center gap-3">
//         <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
//           <Sparkles className="h-[18px] w-[18px]" />
//         </div>
//         <div>
//           <h3 className="text-[14px] font-semibold text-slate-100">
//             AI Daily Brief
//           </h3>
//           <p className="text-[12px] text-slate-400">
//             A fresh nugget for {LEVEL_META[level].label.toLowerCase()}, picked
//             per department.
//           </p>
//         </div>
//       </div>

//       <div className="mt-4 flex flex-wrap gap-1.5">
//         {availableDepts.map((d) => {
//           const Icon = d.icon;
//           const active = d.id === deptId;
//           return (
//             <button
//               key={d.id}
//               onClick={() => {
//                 setDeptId(d.id);
//                 refresh(d.id);
//               }}
//               className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-medium ring-1 ring-inset transition-colors"
//               style={
//                 active
//                   ? {
//                       backgroundColor: `${d.color}1f`,
//                       color: d.color,
//                       boxShadow: `inset 0 0 0 1px ${d.color}4d`,
//                     }
//                   : {
//                       backgroundColor: "rgba(255,255,255,0.04)",
//                       color: "#94a3b8",
//                       boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
//                     }
//               }
//             >
//               <Icon className="h-3 w-3" />
//               {d.name}
//             </button>
//           );
//         })}
//       </div>

//       <div className="mt-3 rounded-xl border border-white/[0.06] bg-[#0d1626] p-3.5">
//         {loading ? (
//           <div className="flex items-center gap-2 text-[13px] text-slate-400">
//             <Loader2 className="h-4 w-4 animate-spin text-violet-300" />
//             Pulling today's update…
//           </div>
//         ) : (
//           <p className="text-[13px] leading-relaxed text-slate-300">
//             {brief ?? "No update available for this section yet."}
//           </p>
//         )}
//       </div>

//       <button
//         onClick={() => refresh()}
//         disabled={loading}
//         className="mt-3 flex items-center gap-1.5 text-[12px] font-medium text-violet-300 hover:text-violet-200 disabled:opacity-50"
//       >
//         <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
//         Get a new update
//       </button>
//     </div>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Page                                                               */
// /* ------------------------------------------------------------------ */

// export default function LearningPlatform({ level }: { level: Level }) {
//   const [briefDept, setBriefDept] = useState<DeptId>(LEVEL_DEPARTMENTS[level]?.[0] || "general");
//   const [openDeptId, setOpenDeptId] = useState<DeptId | null>(null);

//   const effectiveLevel: Level = level;

//   const visibleDepartments = DEPARTMENTS.filter((dept) =>
//     LEVEL_DEPARTMENTS[effectiveLevel].includes(dept.id)
//   );

//   const openDept = visibleDepartments.find((d) => d.id === openDeptId) ?? null;

//   return (
//     <PortalLayout
//       title="Learning Platform"
//       subtitle="One place for every department — music, sports, dance, tech, and the world around you."
//       avatarLetter="A"
//       avatarColor="#2dd4bf"
//       themeClass="theme-student"
//       accentColor="#2dd4bf"
//     >
//       <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
//         {/* Department grid */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//           {visibleDepartments.map((dept) => (
//             <DepartmentCard
//               key={dept.id}
//               dept={dept}
//               level={effectiveLevel}
//               onExplore={() => setOpenDeptId(dept.id)}
//             />
//           ))}
//         </div>

//         {/* AI Daily Brief, sticky on large screens */}
//         <div className="lg:sticky lg:top-6 lg:self-start">
//           <AiDailyBrief
//             deptId={briefDept}
//             setDeptId={setBriefDept}
//             level={effectiveLevel}
//             availableDepts={visibleDepartments}
//           />
//         </div>
//       </div>

//       {openDept && (
//         <ExploreModal
//           dept={openDept}
//           level={effectiveLevel}
//           onClose={() => setOpenDeptId(null)}
//         />
//       )}
//     </PortalLayout>
//   );
// }


"use client";

import PortalLayout from "@/components/PortalLayout";
import { useState } from "react";
import {
  Music2,
  Trophy,
  Sparkles as DanceSparkle,
  Cpu,
  Users2,
  Globe2,
  Loader2,
  RefreshCw,
  Newspaper,
  PlayCircle,
  BookOpen,
  ChevronRight,
  Sparkles,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & level meta                                                */
/* ------------------------------------------------------------------ */

type Level = "middle" | "high" | "higher-secondary";
type LevelFilter = Level | "all";

type DeptId =
  | "music"
  | "sports"
  | "dance"
  | "ai-tech"
  | "non-tech"
  | "general"
  | "career-exams";

const LEVEL_META: Record<Level, { label: string; sub: string }> = {
  middle: { label: "Middle School", sub: "Classes 6th – 8th" },
  high: { label: "High School", sub: "Classes 9th – 10th" },
  "higher-secondary": { label: "Higher Secondary", sub: "Classes 11th – 12th" },
};

interface LevelContent {
  title: string;
  summary: string;
  resourceCount: number;
  resourceType: "Videos" | "Articles" | "Lessons" | "Workshops";
  videoId: string;
}

interface Department {
  id: DeptId;
  name: string;
  icon: LucideIcon;
  color: string;
  tagline: string;
  byLevel: Partial<Record<Level, LevelContent>>;
}

const DEPARTMENTS: Department[] = [
  {
    id: "music",
    name: "Music",
    icon: Music2,
    color: "#a78bfa",
    tagline: "Carnatic, Western, and instrument basics",
    byLevel: {
      middle: {
        title: "Sing-along basics & rhythm games",
        summary:
          "Fun intro to swaras, clapping rhythm games, and recognizing simple ragas by ear.",
        resourceCount: 12,
        resourceType: "Videos",
        videoId: "2ePf9rue1Ao",
      },
      high: {
        title: "Carnatic vocal technique & notation",
        summary:
          "Reading basic notation, varnam practice, and the structure behind popular kritis.",
        resourceCount: 18,
        resourceType: "Lessons",
        videoId: "2ePf9rue1Ao",
      },
      "higher-secondary": {
        title: "Music theory for composition & exams",
        summary:
          "Raga-thala theory in depth, composition basics, and prep for music certification exams.",
        resourceCount: 9,
        resourceType: "Workshops",
        videoId: "2ePf9rue1Ao",
      },
    },
  },
  {
    id: "sports",
    name: "Sports & Athletics",
    icon: Trophy,
    color: "#fb923c",
    tagline: "Fitness, technique, and match strategy",
    byLevel: {
      middle: {
        title: "Movement games & basic fitness",
        summary:
          "Fun warm-ups, basic kabaddi and badminton rules, and why daily movement matters.",
        resourceCount: 15,
        resourceType: "Videos",
        videoId: "2ePf9rue1Ao",
      },
      high: {
        title: "Technique drills for district trials",
        summary:
          "Position-specific drills, nutrition basics for young athletes, injury prevention.",
        resourceCount: 22,
        resourceType: "Lessons",
        videoId: "2ePf9rue1Ao",
      },
      "higher-secondary": {
        title: "Sports science & performance analytics",
        summary:
          "Training periodization, sports psychology under pressure, and scholarship pathways.",
        resourceCount: 11,
        resourceType: "Articles",
        videoId: "2ePf9rue1Ao",
      },
    },
  },
  {
    id: "dance",
    name: "Traditional Dance",
    icon: DanceSparkle,
    color: "#f472b6",
    tagline: "Bharatanatyam, folk forms & cultural roots",
    byLevel: {
      middle: {
        title: "Adavus & storytelling through dance",
        summary:
          "Basic adavus, hand gestures (mudras), and the stories behind popular folk dances.",
        resourceCount: 10,
        resourceType: "Videos",
        videoId: "2ePf9rue1Ao",
      },
      high: {
        title: "Bharatanatyam technique & history",
        summary:
          "Margam structure, regional variations, and the history of Tamil temple dance traditions.",
        resourceCount: 14,
        resourceType: "Lessons",
        videoId: "2ePf9rue1Ao",
      },
      "higher-secondary": {
        title: "Choreography & cultural curation",
        summary:
          "Choreographing original pieces, curating cultural programs, and dance as a career path.",
        resourceCount: 7,
        resourceType: "Workshops",
        videoId: "2ePf9rue1Ao",
      },
    },
  },
  {
    id: "ai-tech",
    name: "AI & Technology",
    icon: Cpu,
    color: "#2dd4bf",
    tagline: "From block coding to real AI tools",
    byLevel: {
      middle: {
        title: "What is AI? Block-coding & robots",
        summary:
          "Scratch-style block coding, simple robot logic, and what makes AI different from a calculator.",
        resourceCount: 20,
        resourceType: "Videos",
        videoId: "2ePf9rue1Ao",
      },
      high: {
        title: "Python basics & how AI models learn",
        summary:
          "Intro to Python, what training data means, and building a simple chatbot project.",
        resourceCount: 25,
        resourceType: "Lessons",
        videoId: "2ePf9rue1Ao",
      },
      "higher-secondary": {
        title: "ML foundations & JEE-relevant CS",
        summary:
          "Neural network basics, real-world AI ethics cases, and CS fundamentals for JEE/NEET-adjacent tracks.",
        resourceCount: 16,
        resourceType: "Workshops",
        videoId: "2ePf9rue1Ao",
      },
    },
  },
  {
    id: "non-tech",
    name: "Non-Tech & Soft Skills",
    icon: Users2,
    color: "#60a5fa",
    tagline: "Communication, leadership, money sense",
    byLevel: {
      middle: {
        title: "Speaking up & teamwork basics",
        summary:
          "Confidence-building exercises, simple public speaking, and working well in groups.",
        resourceCount: 9,
        resourceType: "Videos",
        videoId: "2ePf9rue1Ao",
      },
      high: {
        title: "Debate, leadership & time management",
        summary:
          "Structured debate formats, student leadership roles, and exam-time scheduling skills.",
        resourceCount: 13,
        resourceType: "Lessons",
        videoId: "2ePf9rue1Ao",
      },
      "higher-secondary": {
        title: "Interview skills & personal finance",
        summary:
          "Mock interviews, resume basics, budgeting, and understanding how scholarships work.",
        resourceCount: 12,
        resourceType: "Workshops",
        videoId: "2ePf9rue1Ao",
      },
    },
  },
  {
    id: "general",
    name: "General Knowledge",
    icon: Globe2,
    color: "#facc15",
    tagline: "History, current affairs, civics & health",
    byLevel: {
      middle: {
        title: "Stories from history & how news works",
        summary:
          "Bite-sized history stories, basic geography, and a kid-safe intro to how news is reported.",
        resourceCount: 16,
        resourceType: "Articles",
        videoId: "2ePf9rue1Ao",
      },
      high: {
        title: "Current affairs & civics for board exams",
        summary:
          "Weekly current affairs digest, Indian polity basics, and board-exam-relevant history topics.",
        resourceCount: 21,
        resourceType: "Articles",
        videoId: "2ePf9rue1Ao",
      },
      "higher-secondary": {
        title: "Politics, policy & health literacy",
        summary:
          "In-depth political/economic context, public health awareness, and competitive-exam GK prep.",
        resourceCount: 19,
        resourceType: "Articles",
        videoId: "2ePf9rue1Ao",
      },
    },
  },
  {
    id: "career-exams",
    name: "Career & Competitive Exams",
    icon: GraduationCap,
    color: "#34d399",
    tagline: "AI-matched streams, colleges & entrance prep",
    byLevel: {
      "higher-secondary": {
        title: "AI stream & college matching",
        summary:
          "AI-driven suggestions on streams (Science/Commerce/Arts), entrance exam timelines (NEET/JEE/CUET), and college shortlists based on your scores.",
        resourceCount: 14,
        resourceType: "Workshops",
        videoId: "2ePf9rue1Ao",
      },
    },
  },
];

const LEVEL_DEPARTMENTS: Record<Level, DeptId[]> = {
  middle: ["music", "sports", "dance", "general"],
  high: ["sports", "ai-tech", "non-tech", "general"],
  "higher-secondary": ["ai-tech", "non-tech", "general", "career-exams"],
};

/* ------------------------------------------------------------------ */
/*  Mocked AI daily-brief generator                                   */
/* ------------------------------------------------------------------ */

const AI_BRIEFS: Record<DeptId, Partial<Record<Level, string>>> = {
  music: {
    middle:
      "Today's pick: try clapping the rhythm of 'Sa Re Ga Ma' three times fast, then slow — that's how musicians warm up their ears!",
    high:
      "Spotlight: this week's varnam practice focuses on Adi talam — a great one to record yourself singing and compare.",
    "higher-secondary":
      "Exam tip: music theory papers often ask you to identify a raga from notation alone — practice with 5 ragas a day.",
  },
  sports: {
    middle:
      "Fun fact for today: Tamil Nadu has produced national-level kabaddi champions from school teams just like yours!",
    high:
      "District trial dates were just announced for badminton and athletics — check the Sports & Athletics tab for your slot.",
    "higher-secondary":
      "Today's focus: recovery matters as much as training. A 10-minute stretch routine after practice cuts injury risk significantly.",
  },
  dance: {
    middle:
      "Did you know? The mudra for 'flower' in Bharatanatyam is also used to represent a lotus in temple sculptures across Tamil Nadu.",
    high:
      "This week: explore how Bharatanatyam's Alarippu (opening piece) trains your body for the entire performance ahead.",
    "higher-secondary":
      "Career note: several Tamil Nadu universities now offer dance as a full-time fine arts degree — worth exploring for the arts stream.",
  },
  "ai-tech": {
    middle:
      "Today in tech: AI chatbots like this one learn from huge amounts of text — kind of like reading a million storybooks!",
    high:
      "Quick build idea: try making a simple Python quiz game this week — it uses the same logic as bigger AI projects.",
    "higher-secondary":
      "Today's AI news: more Indian companies are hiring for 'AI prompt engineering' roles — a useful skill alongside core CS.",
  },
  "non-tech": {
    middle:
      "Try this today: introduce yourself to one new classmate using only three sentences — great practice for confidence.",
    high:
      "Debate topic of the week: 'Should homework be optional?' — pick a side and list 3 strong points before tomorrow.",
    "higher-secondary":
      "Interview tip: practice answering 'Tell me about yourself' in under 60 seconds — recruiters decide fast.",
  },
  general: {
    middle:
      "On this day in history: many freedom fighters from Tamil Nadu played key roles in India's independence movement — ask your teacher who from your district!",
    high:
      "Current affairs digest: this week's national news focused on education policy updates — check the General Knowledge tab for a simplified summary.",
    "higher-secondary":
      "Today's brief: a major policy discussion is underway on public health access — relevant background reading for competitive exam GK sections.",
  },
  "career-exams": {
    "higher-secondary":
      "AI insight: based on common score patterns this term, students strong in Biology + Chemistry are seeing the best fit with Medical-stream colleges — check your own AI match in this section.",
  },
};

/* Interesting "did-you-know" style points per department/level — shown in the info tab */
const AI_POINTS: Record<DeptId, Partial<Record<Level, string[]>>> = {
  music: {
    middle: [
      "Clapping in rhythm trains the same part of your brain used in maths!",
      "Carnatic music has 72 base ragas called 'melakarta' — like building blocks for songs.",
      "Tamil Nadu's December 'Margazhi' season is the world's biggest classical music festival.",
    ],
    high: [
      "Adi talam (8 beats) is the most common rhythm cycle in Carnatic music.",
      "Notating a song by ear is a skill professional musicians practice daily.",
      "Many film composers started by learning classical Carnatic technique first.",
    ],
    "higher-secondary": [
      "Music theory exams often test raga identification from written notation alone.",
      "Composition basics you learn now map directly to electronic/film scoring later.",
      "Several universities offer music as a full performance-arts degree pathway.",
    ],
  },
  sports: {
    middle: [
      "Just 20 minutes of daily movement measurably improves focus in class.",
      "Kabaddi is one of the few sports that began in rural Tamil Nadu and went international.",
      "Warm-up games build coordination just as much as 'serious' drills do.",
    ],
    high: [
      "District trial selections often look at consistency over single best performances.",
      "Proper hydration affects reaction time more than most athletes realize.",
      "Cross-training in a second sport reduces injury risk in your main sport.",
    ],
    "higher-secondary": [
      "Sports psychology — staying calm under pressure — is now studied like physical training.",
      "Several state universities offer direct sports quota admissions for state-rank athletes.",
      "Recovery (sleep + stretching) is statistically as important as practice hours.",
    ],
  },
  dance: {
    middle: [
      "Each Bharatanatyam mudra (hand gesture) tells a specific part of a story.",
      "Folk dances across Tamil Nadu districts each carry a unique local history.",
      "Dance technique training improves posture and discipline beyond the dance floor.",
    ],
    high: [
      "The 'Margam' is the traditional 7-part structure of a full Bharatanatyam performance.",
      "Temple dance traditions in Tamil Nadu date back over a thousand years.",
      "Regional variations of the same dance form often tell completely different stories.",
    ],
    "higher-secondary": [
      "Several Tamil Nadu universities now offer dance as a full fine-arts degree.",
      "Choreographing an original piece is treated like a capstone project in performing arts.",
      "Cultural program curation is a real career path in event and arts management.",
    ],
  },
  "ai-tech": {
    middle: [
      "AI doesn't 'think' — it finds patterns in huge amounts of example data.",
      "Block coding (like Scratch) uses the exact same logic as real programming languages.",
      "Simple robot logic (if-this-then-that) is the foundation of all automation.",
    ],
    high: [
      "Python is the most-used language for AI because it reads almost like English.",
      "'Training data' is just lots of examples — the more varied, the smarter the model.",
      "A simple chatbot project teaches the same core logic as large AI systems.",
    ],
    "higher-secondary": [
      "AI prompt engineering is now a real, growing job role in Indian tech companies.",
      "Neural networks are loosely inspired by how neurons connect in the human brain.",
      "AI ethics (bias, fairness) is now a required topic in most CS entrance exams.",
    ],
  },
  "non-tech": {
    middle: [
      "Speaking in just 3 confident sentences is a real public-speaking technique.",
      "Working well in a team is one of the most-requested skills by employers, ever.",
      "Active listening (not just talking) is half of good communication.",
    ],
    high: [
      "Structured debate format forces you to argue both sides — sharpens critical thinking.",
      "Time-blocking your study schedule reduces exam-week stress significantly.",
      "Student leadership roles look strong on college applications later.",
    ],
    "higher-secondary": [
      "Recruiters often decide their first impression within 60 seconds of an answer.",
      "A clear personal budget habit started now compounds hugely by your 20s.",
      "Scholarship applications often reward extracurricular leadership, not just marks.",
    ],
  },
  general: {
    middle: [
      "Many freedom fighters from Tamil Nadu played key roles in India's independence.",
      "News reporters double-check facts with multiple sources before publishing.",
      "Geography shapes culture — coastal vs. hill-district festivals look very different.",
    ],
    high: [
      "Indian polity basics (constitution, rights) show up in almost every board exam.",
      "Reading one current-affairs digest a week beats cramming before exams.",
      "Local district history often connects directly to national-level events.",
    ],
    "higher-secondary": [
      "Competitive exam GK sections reward consistent weekly reading over last-minute cramming.",
      "Public health policy literacy is increasingly tested in general studies papers.",
      "Understanding policy context (not just facts) is what separates top GK scorers.",
    ],
  },
  "career-exams": {
    "higher-secondary": [
      "AI-based stream matching looks at your subject strengths, not just overall percentage.",
      "NEET, JEE, and CUET timelines are now consolidated — missing one date can cost a year.",
      "College shortlists based on past cutoffs help you target realistic, not just dream, options.",
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Small UI atoms                                                    */
/* ------------------------------------------------------------------ */

function ResourceTypeIcon({ type }: { type: LevelContent["resourceType"] }) {
  if (type === "Videos") return <PlayCircle className="h-3.5 w-3.5" />;
  if (type === "Articles") return <Newspaper className="h-3.5 w-3.5" />;
  return <BookOpen className="h-3.5 w-3.5" />;
}

function DepartmentCard({
  dept,
  level,
  onExplore,
}: {
  dept: Department;
  level: Level;
  onExplore: () => void;
}) {
  const content = dept.byLevel[level];
  if (!content) return null;
  const Icon = dept.icon;

  return (
    <div className="group relative rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#111a2c] p-5 transition-colors hover:border-slate-300 dark:hover:border-white/[0.12] hover:bg-slate-50 dark:hover:bg-[#141f35]">
      <div className="flex items-start justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${dept.color}1f`, color: dept.color }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span
          className="rounded-full px-2 py-0.5 text-[10.5px] font-semibold"
          style={{ backgroundColor: `${dept.color}1f`, color: dept.color }}
        >
          {LEVEL_META[level].label}
        </span>
      </div>

      <h3 className="mt-3 text-[15px] font-semibold text-black dark:text-slate-100">
        {dept.name}
      </h3>
      <p className="text-[12px] text-black dark:text-slate-500">{dept.tagline}</p>

      <div className="mt-3 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#0d1626] p-3">
        <p className="text-[13px] font-medium text-black dark:text-slate-200">
          {content.title}
        </p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-black dark:text-slate-400">
          {content.summary}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[12px] text-black dark:text-slate-500">
          <ResourceTypeIcon type={content.resourceType} />
          {content.resourceCount} {content.resourceType}
        </span>
        <button
          onClick={onExplore}
          className="flex items-center gap-1 text-[12.5px] font-semibold transition-colors"
          style={{ color: dept.color }}
        >
          Explore
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Explore modal: Video / Key Points toggle                          */
/* ------------------------------------------------------------------ */

function ExploreModal({
  dept,
  level,
  onClose,
}: {
  dept: Department;
  level: Level;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"video" | "points">("points");
  const content = dept.byLevel[level];
  const points = AI_POINTS[dept.id]?.[level] ?? [];
  const Icon = dept.icon;

  if (!content) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0c1322] p-5">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-black dark:text-slate-400 hover:text-rose-600 dark:hover:text-white"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 pr-8">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${dept.color}1f`, color: dept.color }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p
              className="text-[12px] font-semibold"
              style={{ color: dept.color }}
            >
              {dept.name} · {LEVEL_META[level].label}
            </p>
            <h3 className="text-[16px] font-semibold text-black dark:text-slate-100">
              {content.title}
            </h3>
          </div>
        </div>

        {/* Toggle */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setTab("points")}
            className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
              tab === "points"
                ? "bg-teal-400/15 text-teal-600 dark:text-teal-300 ring-1 ring-inset ring-teal-400/30"
                : "bg-slate-100 dark:bg-white/[0.04] text-black dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/[0.07]"
            }`}
          >
            Key Points
          </button>
          <button
            onClick={() => setTab("video")}
            className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
              tab === "video"
                ? "bg-teal-400/15 text-teal-600 dark:text-teal-300 ring-1 ring-inset ring-teal-400/30"
                : "bg-slate-100 dark:bg-white/[0.04] text-black dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/[0.07]"
            }`}
          >
            Video
          </button>
        </div>

        <div className="mt-4">
          {tab === "points" ? (
            <div className="space-y-2.5">
              <p className="text-[12px] text-black dark:text-slate-500">
                A few interesting things worth knowing today:
              </p>
              {points.length > 0 ? (
                points.map((pt, i) => (
                  <div
                    key={i}
                    className="flex gap-3 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#111a2c] p-3"
                  >
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                      style={{
                        backgroundColor: `${dept.color}1f`,
                        color: dept.color,
                      }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-[13px] leading-relaxed text-black dark:text-slate-300">
                      {pt}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-[13px] text-black dark:text-slate-500">
                  No points available for this section yet.
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.06]">
              <iframe
                width="100%"
                height="360"
                src={`https://www.youtube.com/embed/${content.videoId}`}
                title={content.title}
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AI Daily Brief panel                                              */
/* ------------------------------------------------------------------ */

function AiDailyBrief({
  deptId,
  setDeptId,
  level,
  availableDepts,
}: {
  deptId: DeptId;
  setDeptId: (id: DeptId) => void;
  level: Level;
  availableDepts: Department[];
}) {
  const [brief, setBrief] = useState<string | null>(
    AI_BRIEFS[deptId]?.[level] ?? null
  );
  const [loading, setLoading] = useState(false);

  const refresh = (nextDept?: DeptId) => {
    const target = nextDept ?? deptId;
    setLoading(true);
    setBrief(null);
    window.setTimeout(() => {
      setBrief(AI_BRIEFS[target]?.[level] ?? null);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-b from-violet-50 dark:from-violet-500/[0.08] to-white dark:to-transparent p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-600 dark:text-violet-300">
          <Sparkles className="h-[18px] w-[18px]" />
        </div>
        <div>
          <h3 className="text-[14px] font-semibold text-black dark:text-slate-100">
            AI Daily Brief
          </h3>
          <p className="text-[12px] text-black dark:text-slate-400">
            A fresh nugget for {LEVEL_META[level].label.toLowerCase()}, picked
            per department.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {availableDepts.map((d) => {
          const Icon = d.icon;
          const active = d.id === deptId;
          return (
            <button
              key={d.id}
              onClick={() => {
                setDeptId(d.id);
                refresh(d.id);
              }}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-medium ring-1 ring-inset transition-colors"
              style={
                active
                  ? {
                      backgroundColor: `${d.color}1f`,
                      color: d.color,
                      boxShadow: `inset 0 0 0 1px ${d.color}4d`,
                    }
                  : {
                      backgroundColor: "rgba(0,0,0,0.04)",
                      color: "#000000",
                      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
                    }
              }
            >
              <Icon className="h-3 w-3" />
              {d.name}
            </button>
          );
        })}
      </div>

      <div className="mt-3 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#0d1626] p-3.5">
        {loading ? (
          <div className="flex items-center gap-2 text-[13px] text-black dark:text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin text-violet-600 dark:text-violet-300" />
            Pulling today's update…
          </div>
        ) : (
          <p className="text-[13px] leading-relaxed text-black dark:text-slate-300">
            {brief ?? "No update available for this section yet."}
          </p>
        )}
      </div>

      <button
        onClick={() => refresh()}
        disabled={loading}
        className="mt-3 flex items-center gap-1.5 text-[12px] font-medium text-violet-600 dark:text-violet-300 hover:text-violet-700 dark:hover:text-violet-200 disabled:opacity-50"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        Get a new update
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function LearningPlatform({ level }: { level: Level }) {
  const [briefDept, setBriefDept] = useState<DeptId>(LEVEL_DEPARTMENTS[level]?.[0] || "general");
  const [openDeptId, setOpenDeptId] = useState<DeptId | null>(null);

  const effectiveLevel: Level = level;

  const visibleDepartments = DEPARTMENTS.filter((dept) =>
    LEVEL_DEPARTMENTS[effectiveLevel].includes(dept.id)
  );

  const openDept = visibleDepartments.find((d) => d.id === openDeptId) ?? null;

  return (
    <PortalLayout
      title="Learning Platform"
      subtitle="One place for every department — music, sports, dance, tech, and the world around you."
      avatarLetter="A"
      avatarColor="#2dd4bf"
      themeClass="theme-student"
      accentColor="#2dd4bf"
    >
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        {/* Department grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {visibleDepartments.map((dept) => (
            <DepartmentCard
              key={dept.id}
              dept={dept}
              level={effectiveLevel}
              onExplore={() => setOpenDeptId(dept.id)}
            />
          ))}
        </div>

        {/* AI Daily Brief, sticky on large screens */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <AiDailyBrief
            deptId={briefDept}
            setDeptId={setBriefDept}
            level={effectiveLevel}
            availableDepts={visibleDepartments}
          />
        </div>
      </div>

      {openDept && (
        <ExploreModal
          dept={openDept}
          level={effectiveLevel}
          onClose={() => setOpenDeptId(null)}
        />
      )}
    </PortalLayout>
  );
}