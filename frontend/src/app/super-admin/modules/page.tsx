"use client";
import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

type Portal = "Student" | "Teacher" | "Parent" | "Headmaster" | "BEO" | "DEO" | "Commissioner" | "Minister";

interface Module {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  route: string;
  portals: Record<Portal, boolean>;
  dependencies: string[];
}

const ALL_PORTALS: Portal[] = ["Student","Teacher","Parent","Headmaster","BEO","DEO","Commissioner","Minister"];

const portalColors: Record<Portal, string> = {
  Student:"#6366f1", Teacher:"#f59e0b", Parent:"#10b981", Headmaster:"#3b82f6",
  BEO:"#8b5cf6", DEO:"#ec4899", Commissioner:"#06b6d4", Minister:"#ef4444",
};

const initialModules: Module[] = [
  { id:"ai-tutor", name:"AI Tutor", icon:"🤖", description:"Personalized AI tutoring with Gemini", category:"AI & Learning", route:"/student/ai-tutor", portals:{ Student:true, Teacher:false, Parent:false, Headmaster:false, BEO:false, DEO:false, Commissioner:false, Minister:false }, dependencies:[] },
  { id:"ai-lesson", name:"AI Lesson Planner", icon:"📋", description:"Auto-generate lesson plans from syllabus", category:"AI & Learning", route:"/teacher/lesson-planner", portals:{ Student:false, Teacher:true, Parent:false, Headmaster:true, BEO:false, DEO:false, Commissioner:false, Minister:false }, dependencies:["ai-tutor"] },
  { id:"attendance", name:"Attendance System", icon:"📅", description:"Daily attendance tracking and reports", category:"Academic", route:"/headmaster/attendance", portals:{ Student:true, Teacher:true, Parent:true, Headmaster:true, BEO:true, DEO:true, Commissioner:false, Minister:false }, dependencies:[] },
  { id:"virtual-labs", name:"Virtual Labs", icon:"🔬", description:"Interactive science lab simulations", category:"Content", route:"/student/labs", portals:{ Student:true, Teacher:true, Parent:false, Headmaster:false, BEO:false, DEO:false, Commissioner:false, Minister:false }, dependencies:[] },
  { id:"dropout", name:"Dropout Heatmap", icon:"📉", description:"District-level dropout risk visualization", category:"Analytics", route:"/deo/dropout", portals:{ Student:false, Teacher:false, Parent:false, Headmaster:false, BEO:true, DEO:true, Commissioner:true, Minister:true }, dependencies:[] },
  { id:"scholarships", name:"Scholarship Tracker", icon:"🎓", description:"Scholarship eligibility and status tracking", category:"Welfare", route:"/student/scholarships", portals:{ Student:true, Teacher:true, Parent:true, Headmaster:true, BEO:true, DEO:true, Commissioner:false, Minister:false }, dependencies:[] },
  { id:"mid-day-meal", name:"Mid-Day Meal", icon:"🍛", description:"Daily meal register and nutrition tracking", category:"Welfare", route:"/headmaster/midday-meal", portals:{ Student:false, Teacher:false, Parent:true, Headmaster:true, BEO:true, DEO:true, Commissioner:false, Minister:false }, dependencies:[] },
  { id:"live-state", name:"Live State View", icon:"📡", description:"Real-time state-wide education metrics", category:"Analytics", route:"/minister/live", portals:{ Student:false, Teacher:false, Parent:false, Headmaster:false, BEO:false, DEO:false, Commissioner:true, Minister:true }, dependencies:[] },
  { id:"parent-feedback", name:"Parent Feedback", icon:"💬", description:"Direct parent-to-school communication", category:"Communication", route:"/parent/feedback", portals:{ Student:false, Teacher:false, Parent:true, Headmaster:true, BEO:false, DEO:false, Commissioner:false, Minister:false }, dependencies:[] },
  { id:"announcements", name:"Announcements", icon:"📢", description:"System-wide broadcast messages", category:"Communication", route:"/announcements", portals:{ Student:true, Teacher:true, Parent:true, Headmaster:true, BEO:true, DEO:true, Commissioner:true, Minister:true }, dependencies:[] },
  { id:"budget", name:"Budget Tracker", icon:"💰", description:"Budget utilization and financial reports", category:"Finance", route:"/commissioner/budget", portals:{ Student:false, Teacher:false, Parent:false, Headmaster:false, BEO:true, DEO:true, Commissioner:true, Minister:true }, dependencies:[] },
  { id:"career-aptitude", name:"Career Aptitude", icon:"🧭", description:"AI-powered career guidance and aptitude", category:"AI & Learning", route:"/student/career", portals:{ Student:true, Teacher:false, Parent:true, Headmaster:false, BEO:false, DEO:false, Commissioner:false, Minister:false }, dependencies:["ai-tutor"] },
];

const categories = Array.from(new Set(initialModules.map((m) => m.category)));

export default function DepartmentModules() {
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [filterCat, setFilterCat] = useState("All");
  const [filterPortal, setFilterPortal] = useState<"All" | Portal>("All");
  const [showModal, setShowModal] = useState(false);
  const [newMod, setNewMod] = useState({ name:"", icon:"📌", description:"", category:"Academic", route:"", portals: Object.fromEntries(ALL_PORTALS.map((p) => [p, false])) as Record<Portal, boolean> });

  const togglePortal = (moduleId: string, portal: Portal) => {
    setModules((prev) => prev.map((m) => m.id === moduleId ? {
      ...m, portals: { ...m.portals, [portal]: !m.portals[portal] }
    } : m));
  };

  const filtered = modules.filter((m) => {
    const matchCat = filterCat === "All" || m.category === filterCat;
    const matchPortal = filterPortal === "All" || m.portals[filterPortal as Portal];
    return matchCat && matchPortal;
  });

  const enabledCount = (m: Module) => Object.values(m.portals).filter(Boolean).length;
  const addModule = () => {
    if (!newMod.name) return;
    setModules((prev) => [...prev, { ...newMod, id: newMod.name.toLowerCase().replace(/\s/g,"-"), dependencies:[] }]);
    setShowModal(false);
  };

  return (
    <PortalLayout>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-white">🗓️ Department Module Management</h1>
          <p className="text-xs text-slate-400 mt-1">Control which modules are active for each portal. Click toggle cells to enable or disable per portal.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="text-xs font-bold bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-4 py-2 rounded-lg transition">+ Add Module</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label:"Total Modules", value:modules.length, icon:"📦", color:"text-fuchsia-400" },
          { label:"Active Deployments", value:modules.reduce((a, m) => a + enabledCount(m), 0), icon:"✅", color:"text-emerald-400" },
          { label:"AI Modules", value:modules.filter((m) => m.category === "AI & Learning").length, icon:"🤖", color:"text-cyan-400" },
          { label:"Categories", value:categories.length, icon:"🗂️", color:"text-amber-400" },
        ].map((k) => (
          <div key={k.label} className="glass rounded-xl p-4 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{k.icon}</span>
              <div>
                <div className={`text-xl font-extrabold ${k.color}`}>{k.value}</div>
                <div className="text-[10px] text-slate-500">{k.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        <div className="flex gap-2 flex-wrap">
          {["All", ...categories].map((cat) => (
            <button key={cat} onClick={() => setFilterCat(cat)}
              className={`text-[10px] font-bold px-3 py-1 rounded-full transition ${
                filterCat === cat ? "bg-fuchsia-600 text-white" : "bg-slate-800 text-slate-400 border border-slate-700 hover:text-white"
              }`}>{cat}</button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap ml-4">
          {["All", ...ALL_PORTALS].map((p) => (
            <button key={p} onClick={() => setFilterPortal(p as any)}
              className={`text-[10px] font-bold px-2 py-1 rounded-full transition ${
                filterPortal === p ? "text-white" : "bg-slate-800 text-slate-500 border border-slate-700 hover:text-white"
              }`}
              style={filterPortal === p && p !== "All" ? { backgroundColor: portalColors[p as Portal] + "33", borderColor: portalColors[p as Portal] + "55", color: portalColors[p as Portal] } : {}}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Module Cards */}
      <div className="space-y-3">
        {filtered.map((mod) => (
          <div key={mod.id} className="glass rounded-2xl p-5 border border-slate-800 hover:border-slate-600 transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl shrink-0">{mod.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-bold text-white">{mod.name}</h3>
                  <span className="text-[9px] font-bold text-fuchsia-400 bg-fuchsia-500/10 border border-fuchsia-500/20 px-2 py-0.5 rounded">{mod.category}</span>
                  {mod.dependencies.length > 0 && (
                    <span className="text-[9px] text-slate-500">requires: {mod.dependencies.join(", ")}</span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400">{mod.description}</p>
                <p className="text-[9px] text-slate-600 font-mono mt-0.5">{mod.route}</p>
              </div>
              <div className="text-[10px] font-bold text-slate-500 shrink-0">{enabledCount(mod)}/{ALL_PORTALS.length} portals</div>
            </div>

            {/* Portal toggles */}
            <div className="flex flex-wrap gap-2">
              {ALL_PORTALS.map((portal) => {
                const isOn = mod.portals[portal];
                return (
                  <button key={portal} onClick={() => togglePortal(mod.id, portal)}
                    className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-xl border transition-all ${
                      isOn
                        ? "text-white border-transparent"
                        : "bg-slate-900 text-slate-600 border-slate-800 hover:border-slate-600 hover:text-slate-400"
                    }`}
                    style={isOn ? { backgroundColor: portalColors[portal] + "33", borderColor: portalColors[portal] + "66", color: portalColors[portal] } : {}}>
                    {isOn ? "✓" : "+"} {portal}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Add Module Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-base font-bold text-white mb-5">➕ Add New Module</h3>
            <div className="space-y-3">
              {[
                { label:"Module Name", key:"name", placeholder:"e.g. Student Wellness" },
                { label:"Icon (emoji)", key:"icon", placeholder:"e.g. 💚" },
                { label:"Description", key:"description", placeholder:"What does this module do?" },
                { label:"Route", key:"route", placeholder:"/portal/module-name" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">{label}</label>
                  <input value={(newMod as any)[key]} onChange={(e) => setNewMod((f) => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-fuchsia-500" />
                </div>
              ))}
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Category</label>
                <select value={newMod.category} onChange={(e) => setNewMod((f) => ({ ...f, category: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-fuchsia-500">
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-2 uppercase">Enable for Portals</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_PORTALS.map((p) => (
                    <button key={p} onClick={() => setNewMod((f) => ({ ...f, portals: { ...f.portals, [p]: !f.portals[p] } }))}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition ${
                        newMod.portals[p] ? "text-white bg-fuchsia-600 border-fuchsia-500" : "text-slate-500 bg-slate-800 border-slate-700"
                      }`}>{p}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 text-xs font-bold text-slate-400 bg-slate-800 py-2 rounded-lg border border-slate-700">Cancel</button>
              <button onClick={addModule} className="flex-1 text-xs font-bold text-white bg-fuchsia-600 hover:bg-fuchsia-500 py-2 rounded-lg transition">Add Module</button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
