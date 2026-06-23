"use client";
import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

type Role = "STUDENT" | "TEACHER" | "PARENT" | "HEADMASTER" | "BEO" | "DEO" | "COMMISSIONER" | "MINISTER" | "SUPERADMIN";

interface Module {
  id: string;
  label: string;
  icon: string;
  category: string;
}

const roles: Role[] = ["STUDENT","TEACHER","PARENT","HEADMASTER","BEO","DEO","COMMISSIONER","MINISTER","SUPERADMIN"];

const roleIcons: Record<Role, string> = {
  STUDENT:"🎓", TEACHER:"📚", PARENT:"👨‍👩‍👧", HEADMASTER:"🏫", BEO:"🏢",
  DEO:"🗺️", COMMISSIONER:"⚖️", MINISTER:"🏛️", SUPERADMIN:"🛠️",
};

const roleColors: Record<Role, string> = {
  STUDENT:"#6366f1", TEACHER:"#f59e0b", PARENT:"#10b981", HEADMASTER:"#3b82f6",
  BEO:"#8b5cf6", DEO:"#ec4899", COMMISSIONER:"#06b6d4", MINISTER:"#ef4444", SUPERADMIN:"#475569",
};

const modules: Module[] = [
  { id:"ai-tutor",       label:"AI Tutor",             icon:"🤖", category:"AI" },
  { id:"ai-lesson",      label:"AI Lesson Planner",    icon:"📋", category:"AI" },
  { id:"ai-eval",        label:"AI Evaluation",        icon:"✅", category:"AI" },
  { id:"ai-analytics",   label:"AI Analytics",         icon:"📊", category:"AI" },
  { id:"attendance",     label:"Attendance",           icon:"📅", category:"Academic" },
  { id:"timetable",      label:"Timetable",            icon:"🗓️", category:"Academic" },
  { id:"exams",          label:"Exam Management",      icon:"📝", category:"Academic" },
  { id:"syllabus",       label:"Syllabus View",        icon:"📚", category:"Academic" },
  { id:"materials",      label:"Material Library",     icon:"📦", category:"Content" },
  { id:"virtual-labs",   label:"Virtual Labs",         icon:"🔬", category:"Content" },
  { id:"scholarships",   label:"Scholarships",         icon:"🎓", category:"Welfare" },
  { id:"mid-day-meal",   label:"Mid-Day Meal",         icon:"🍛", category:"Welfare" },
  { id:"gov-schemes",    label:"Govt Schemes",         icon:"🏛️", category:"Welfare" },
  { id:"grievances",     label:"Grievances",           icon:"⚖️", category:"Admin" },
  { id:"announcements",  label:"Announcements",        icon:"📢", category:"Admin" },
  { id:"reports",        label:"Reports & Exports",    icon:"📈", category:"Admin" },
  { id:"communication",  label:"Communication",        icon:"💬", category:"Admin" },
  { id:"infrastructure", label:"Infrastructure",       icon:"🏗️", category:"Admin" },
  { id:"dropout",        label:"Dropout Tracking",     icon:"📉", category:"Analytics" },
  { id:"live-state",     label:"Live State View",      icon:"📡", category:"Analytics" },
];

// Initial permission matrix: role → moduleId → allowed
const buildDefault = () => {
  const matrix: Record<Role, Record<string, boolean>> = {} as any;
  for (const r of roles) {
    matrix[r] = {};
    for (const m of modules) {
      // sensible defaults
      const adminRoles: Role[] = ["SUPERADMIN","MINISTER","COMMISSIONER","DEO","BEO"];
      if (r === "SUPERADMIN") { matrix[r][m.id] = true; continue; }
      if (r === "STUDENT") { matrix[r][m.id] = ["ai-tutor","attendance","syllabus","materials","virtual-labs","scholarships","gov-schemes","exams","announcements"].includes(m.id); continue; }
      if (r === "TEACHER") { matrix[r][m.id] = ["ai-lesson","ai-eval","attendance","timetable","exams","syllabus","materials","scholarships","communication","announcements","reports"].includes(m.id); continue; }
      if (r === "PARENT") { matrix[r][m.id] = ["attendance","scholarships","gov-schemes","communication","announcements"].includes(m.id); continue; }
      if (r === "HEADMASTER") { matrix[r][m.id] = ["attendance","timetable","exams","syllabus","materials","scholarships","mid-day-meal","gov-schemes","grievances","announcements","reports","communication","infrastructure"].includes(m.id); continue; }
      if (adminRoles.includes(r)) { matrix[r][m.id] = !["ai-tutor","virtual-labs"].includes(m.id); continue; }
      matrix[r][m.id] = false;
    }
  }
  return matrix;
};

const categories = Array.from(new Set(modules.map((m) => m.category)));

export default function RolePermissions() {
  const [matrix, setMatrix] = useState(buildDefault);
  const [filterCat, setFilterCat] = useState("All");
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const toggle = (role: Role, moduleId: string) => {
    if (role === "SUPERADMIN") return;
    setMatrix((prev) => ({
      ...prev,
      [role]: { ...prev[role], [moduleId]: !prev[role][moduleId] },
    }));
  };

  const filteredModules = filterCat === "All" ? modules : modules.filter((m) => m.category === filterCat);

  const totalEnabled = (role: Role) => Object.values(matrix[role]).filter(Boolean).length;

  return (
    <PortalLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">🔐 Role & Permission Matrix</h1>
        <p className="text-xs text-slate-400 mt-1">Control which modules each role can access. Toggle cells to enable or disable.</p>
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 mb-6">
        {roles.map((r) => (
          <div key={r} className="bg-slate-900/60 border border-slate-800 rounded-xl p-2 text-center">
            <div className="text-lg">{roleIcons[r]}</div>
            <div className="text-[9px] font-bold text-white mt-0.5">{r.replace("SUPERADMIN","S.ADMIN")}</div>
            <div className="text-[10px] font-bold mt-1" style={{ color: roleColors[r] }}>{totalEnabled(r)}/{modules.length}</div>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["All", ...categories].map((cat) => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            className={`text-[10px] font-bold px-3 py-1 rounded-full transition ${
              filterCat === cat ? "bg-amber-500 text-slate-900" : "bg-slate-800 text-slate-400 border border-slate-700 hover:text-white"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Permission Matrix Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table min-w-[900px]">
            <thead>
              <tr>
                <th className="w-48">Module</th>
                <th className="w-24">Category</th>
                {roles.map((r) => (
                  <th key={r} className="text-center w-20">
                    <div className="text-base">{roleIcons[r]}</div>
                    <div className="text-[8px] font-bold text-slate-400 mt-0.5">{r.replace("SUPERADMIN","SA")}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredModules.map((mod) => (
                <tr key={mod.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{mod.icon}</span>
                      <span className="text-xs font-semibold text-white">{mod.label}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{mod.category}</span>
                  </td>
                  {roles.map((r) => {
                    const isOn = matrix[r][mod.id];
                    const isLocked = r === "SUPERADMIN";
                    const cellKey = `${r}-${mod.id}`;
                    return (
                      <td key={r} className="text-center">
                        <button
                          onClick={() => toggle(r, mod.id)}
                          disabled={isLocked}
                          onMouseEnter={() => setHoveredCell(cellKey)}
                          onMouseLeave={() => setHoveredCell(null)}
                          title={isLocked ? "Super Admin has full access always" : `${isOn ? "Disable" : "Enable"} ${mod.label} for ${r}`}
                          className={`w-7 h-7 rounded-lg transition-all flex items-center justify-center mx-auto text-sm ${
                            isLocked ? "bg-slate-700 cursor-not-allowed opacity-50" :
                            isOn ? "bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-400" :
                            "bg-slate-800 border border-slate-700 hover:border-red-500/30 text-slate-600"
                          } ${hoveredCell === cellKey && !isLocked ? "scale-110" : ""}`}
                        >
                          {isLocked ? "🔒" : isOn ? "✓" : "✗"}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex gap-4 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/40 inline-block" /> Enabled</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-800 border border-slate-700 inline-block" /> Disabled</span>
        <span className="flex items-center gap-1.5"><span className="text-slate-600">🔒</span> Super Admin — always full access</span>
      </div>
    </PortalLayout>
  );
}
