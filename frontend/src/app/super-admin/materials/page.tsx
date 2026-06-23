"use client";
import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

type ContentType = "PDF" | "Video" | "Slides" | "Audio" | "Image";
type Portal = "Student" | "Teacher" | "Parent" | "Headmaster" | "All";

interface Material {
  id: number;
  title: string;
  type: ContentType;
  subject: string;
  class: string;
  chapter: string;
  portal: Portal;
  size: string;
  uploadedBy: string;
  date: string;
  status: "active" | "draft" | "archived";
  aiTagged: boolean;
}

const typeIcons: Record<ContentType, string> = { PDF:"📄", Video:"🎥", Slides:"📊", Audio:"🎵", Image:"🖼️" };
const typeColors: Record<ContentType, string> = {
  PDF:"text-red-400 bg-red-500/10 border-red-500/30",
  Video:"text-blue-400 bg-blue-500/10 border-blue-500/30",
  Slides:"text-amber-400 bg-amber-500/10 border-amber-500/30",
  Audio:"text-green-400 bg-green-500/10 border-green-500/30",
  Image:"text-pink-400 bg-pink-500/10 border-pink-500/30",
};
const statusColors: Record<Material["status"], string> = {
  active:"text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  draft:"text-amber-400 bg-amber-500/10 border-amber-500/30",
  archived:"text-slate-400 bg-slate-700 border-slate-600",
};

const initialMaterials: Material[] = [
  { id:1, title:"Class 10 Maths — Algebra Complete Notes", type:"PDF", subject:"Mathematics", class:"Class 10", chapter:"Algebra", portal:"Student", size:"2.4 MB", uploadedBy:"Super Admin", date:"Jun 10, 2026", status:"active", aiTagged:true },
  { id:2, title:"Photosynthesis Explained — Video Lesson", type:"Video", subject:"Science", class:"Class 9", chapter:"Biology", portal:"Student", size:"48 MB", uploadedBy:"Sumathi Devi", date:"Jun 8, 2026", status:"active", aiTagged:true },
  { id:3, title:"Tamil Grammar — Ezhuthu Vagai Slides", type:"Slides", subject:"Tamil", class:"Class 7", chapter:"Grammar", portal:"Teacher", size:"5.2 MB", uploadedBy:"Super Admin", date:"Jun 5, 2026", status:"active", aiTagged:false },
  { id:4, title:"Class 12 Physics — Wave Optics PDF", type:"PDF", subject:"Physics", class:"Class 12", chapter:"Wave Optics", portal:"Student", size:"3.1 MB", uploadedBy:"Super Admin", date:"Jun 3, 2026", status:"active", aiTagged:true },
  { id:5, title:"Parent Guide — Understanding SSLC Results", type:"PDF", subject:"General", class:"Class 10", chapter:"—", portal:"Parent", size:"1.2 MB", uploadedBy:"Super Admin", date:"May 30, 2026", status:"active", aiTagged:false },
  { id:6, title:"English — Prose Reading Audio Set", type:"Audio", subject:"English", class:"Class 6", chapter:"Prose", portal:"Student", size:"12 MB", uploadedBy:"Anitha R.", date:"May 25, 2026", status:"draft", aiTagged:false },
  { id:7, title:"Chemistry Lab Safety Infographic", type:"Image", subject:"Chemistry", class:"Class 11", chapter:"Lab Basics", portal:"All", size:"800 KB", uploadedBy:"Super Admin", date:"May 20, 2026", status:"active", aiTagged:true },
  { id:8, title:"School Admin Manual 2026 Edition", type:"PDF", subject:"Administration", class:"—", chapter:"—", portal:"Headmaster", size:"4.5 MB", uploadedBy:"Super Admin", date:"May 15, 2026", status:"archived", aiTagged:false },
];

const SUBJECTS = ["All Subjects","Mathematics","Science","Physics","Chemistry","Biology","Tamil","English","Social Science","Computer Science","General","Administration"];
const CLASSES = ["All Classes","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"];
const PORTALS: Portal[] = ["Student","Teacher","Parent","Headmaster","All"];

const emptyForm = { title:"", type:"PDF" as ContentType, subject:"Mathematics", class:"Class 10", chapter:"", portal:"Student" as Portal };

export default function MaterialLibrary() {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("All Subjects");
  const [filterClass, setFilterClass] = useState("All Classes");
  const [filterType, setFilterType] = useState<"All" | ContentType>("All");
  const [filterStatus, setFilterStatus] = useState<"All" | Material["status"]>("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [viewTab, setViewTab] = useState<"grid" | "list">("list");

  const filtered = materials.filter((m) => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase());
    const matchSubject = filterSubject === "All Subjects" || m.subject === filterSubject;
    const matchClass = filterClass === "All Classes" || m.class === filterClass;
    const matchType = filterType === "All" || m.type === filterType;
    const matchStatus = filterStatus === "All" || m.status === filterStatus;
    return matchSearch && matchSubject && matchClass && matchType && matchStatus;
  });

  const toggleStatus = (id: number) => {
    setMaterials((prev) => prev.map((m) => m.id === id ? {
      ...m, status: m.status === "active" ? "archived" : m.status === "archived" ? "draft" : "active"
    } : m));
  };
  const toggleAI = (id: number) => setMaterials((prev) => prev.map((m) => m.id === id ? { ...m, aiTagged: !m.aiTagged } : m));
  const deleteMaterial = (id: number) => setMaterials((prev) => prev.filter((m) => m.id !== id));
  const addMaterial = () => {
    if (!form.title) return;
    setMaterials((prev) => [...prev, {
      id: Date.now(), ...form, size:"—", uploadedBy:"Super Admin",
      date: new Date().toLocaleDateString("en-IN", { month:"short", day:"numeric", year:"numeric" }),
      status:"draft", aiTagged:false,
    }]);
    setShowModal(false);
    setForm(emptyForm);
  };

  const byType = (t: ContentType) => materials.filter((m) => m.type === t).length;
  const totalSize = "128 MB";

  return (
    <PortalLayout>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-white">📦 Material Library</h1>
          <p className="text-xs text-slate-400 mt-1">Upload and manage learning materials — PDFs, videos, slides, and audio across all portals</p>
        </div>
        <div className="flex gap-2">
          <button className="text-xs font-bold bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg hover:bg-slate-600 transition">⬆️ Bulk Upload</button>
          <button onClick={() => setShowModal(true)} className="text-xs font-bold bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-lg transition">+ Add Material</button>
        </div>
      </div>

      {/* Type Summary */}
      <div className="grid grid-cols-5 gap-2 mb-5">
        {(["PDF","Video","Slides","Audio","Image"] as ContentType[]).map((t) => (
          <button key={t} onClick={() => setFilterType(filterType === t ? "All" : t)}
            className={`rounded-xl p-3 text-center border transition-all ${
              filterType === t ? typeColors[t] + " ring-1" : "bg-slate-900/60 border-slate-800 hover:border-slate-600"
            }`}>
            <div className="text-xl">{typeIcons[t]}</div>
            <div className="text-[9px] font-bold text-white mt-0.5">{t}</div>
            <div className="text-[9px] text-slate-500">{byType(t)} files</div>
          </button>
        ))}
      </div>

      {/* Stats Bar */}
      <div className="flex gap-4 mb-4 text-[10px] text-slate-500">
        <span>📚 <strong className="text-white">{materials.length}</strong> total items</span>
        <span>✅ <strong className="text-emerald-400">{materials.filter((m) => m.status === "active").length}</strong> active</span>
        <span>🤖 <strong className="text-cyan-400">{materials.filter((m) => m.aiTagged).length}</strong> AI-tagged</span>
        <span>💾 <strong className="text-slate-300">{totalSize}</strong> total</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Search materials..."
          className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 w-52 focus:outline-none focus:border-pink-500" />
        <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-pink-500">
          {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-pink-500">
          {CLASSES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}
          className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-pink-500">
          <option value="All">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <span className="text-[10px] text-slate-500 ml-auto">{filtered.length} items</span>
      </div>

      {/* Materials Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-800 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">Material</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Subject / Class</th>
                <th className="px-4 py-3">Portal</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">AI</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-slate-800/40 hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-xs font-semibold text-white max-w-[220px] truncate">{m.title}</div>
                    <div className="text-[9px] text-slate-500">{m.uploadedBy} · {m.date}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${typeColors[m.type]}`}>
                      {typeIcons[m.type]} {m.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[10px] text-slate-400">
                    <div>{m.subject}</div>
                    <div className="text-slate-600">{m.class}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{m.portal}</span>
                  </td>
                  <td className="px-4 py-3 text-[10px] text-slate-500">{m.size}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleAI(m.id)}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border transition ${
                        m.aiTagged ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" : "text-slate-600 bg-slate-800 border-slate-700"
                      }`}>🤖 {m.aiTagged ? "ON" : "OFF"}</button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(m.id)}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border transition ${statusColors[m.status]}`}>
                      {m.status.toUpperCase()}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => deleteMaterial(m.id)} className="text-[10px] text-red-400 hover:text-red-300 font-semibold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-base font-bold text-white mb-5">📦 Add New Material</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Title</label>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Material title"
                  className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-pink-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label:"Type", key:"type", options:(["PDF","Video","Slides","Audio","Image"] as ContentType[]) },
                  { label:"Portal", key:"portal", options:PORTALS },
                ].map(({ label, key, options }) => (
                  <div key={key}>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">{label}</label>
                    <select value={(form as any)[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-pink-500">
                      {options.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Subject</label>
                  <select value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-pink-500">
                    {SUBJECTS.slice(1).map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Class</label>
                  <select value={form.class} onChange={(e) => setForm((f) => ({ ...f, class: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-pink-500">
                    {CLASSES.slice(1).map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Chapter</label>
                <input value={form.chapter} onChange={(e) => setForm((f) => ({ ...f, chapter: e.target.value }))} placeholder="Chapter name"
                  className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-pink-500" />
              </div>
              <div className="border border-dashed border-slate-700 rounded-xl p-4 text-center text-slate-500 text-xs">
                📎 Click to upload file (simulation only)
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 text-xs font-bold text-slate-400 bg-slate-800 py-2 rounded-lg border border-slate-700">Cancel</button>
              <button onClick={addMaterial} className="flex-1 text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 py-2 rounded-lg transition">Add Material</button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
