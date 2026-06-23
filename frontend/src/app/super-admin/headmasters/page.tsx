"use client";
import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface HM {
  id: number;
  name: string;
  empId: string;
  phone: string;
  email: string;
  district: string;
  block: string;
  school: string;
  dise: string;
  joinedSchool: string;
  experience: number;
  status: "assigned" | "unassigned" | "transferred";
}

const initialHMs: HM[] = [
  { id:1, name:"Mr. Venkatesh R.", empId:"TN-HM-0001", phone:"9876543210", email:"venkatesh@tn.gov.in", district:"Coimbatore", block:"Coimbatore South", school:"GHSS Coimbatore North", dise:"33012345", joinedSchool:"Jun 2022", experience:18, status:"assigned" },
  { id:2, name:"Mrs. Anitha R.", empId:"TN-HM-0002", phone:"9876501234", email:"anitha.r@tn.gov.in", district:"Madurai", block:"Madurai East", school:"GHS Madurai East", dise:"35089012", joinedSchool:"Aug 2023", experience:15, status:"assigned" },
  { id:3, name:"Mr. Ramesh K.", empId:"TN-HM-0003", phone:"9543210987", email:"ramesh.k@tn.gov.in", district:"Salem", block:"Salem Block", school:"GHS Salem West", dise:"43002567", joinedSchool:"Jan 2024", experience:12, status:"assigned" },
  { id:4, name:"Mrs. Sujatha M.", empId:"TN-HM-0004", phone:"9432109876", email:"sujatha.m@tn.gov.in", district:"Chennai", block:"T. Nagar", school:"GHSS Chennai Anna Nagar", dise:"01078923", joinedSchool:"Mar 2021", experience:22, status:"assigned" },
  { id:5, name:"Mr. Durai S.", empId:"TN-HM-0005", phone:"9321098765", email:"durai.s@tn.gov.in", district:"Erode", block:"Erode Town", school:"Middle School Erode", dise:"21034501", joinedSchool:"Jul 2023", experience:14, status:"assigned" },
  { id:6, name:"Mr. Kiran V.", empId:"TN-HM-0006", phone:"9210987654", email:"kiran.v@tn.gov.in", district:"Vellore", block:"—", school:"Unassigned", dise:"—", joinedSchool:"—", experience:10, status:"unassigned" },
  { id:7, name:"Mrs. Kavitha P.", empId:"TN-HM-0007", phone:"9109876543", email:"kavitha.p@tn.gov.in", district:"Thanjavur", block:"Thanjavur Block", school:"GHS Thanjavur", dise:"56012300", joinedSchool:"Sep 2022", experience:16, status:"transferred" },
];

const statusColors: Record<HM["status"], string> = {
  assigned: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  unassigned: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  transferred: "text-blue-400 bg-blue-500/10 border-blue-500/30",
};

const emptyForm = { name:"", empId:"", phone:"", email:"", district:"Coimbatore", block:"", school:"", dise:"", experience:5 };

export default function HeadmasterManagement() {
  const [hms, setHMs] = useState<HM[]>(initialHMs);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | HM["status"]>("all");
  const [filterDist, setFilterDist] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editHM, setEditHM] = useState<HM | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showTransfer, setShowTransfer] = useState<HM | null>(null);
  const [transferTarget, setTransferTarget] = useState("");

  const filtered = hms.filter((h) => {
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.empId.includes(search) || h.school.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || h.status === filterStatus;
    const matchDist = filterDist === "All" || h.district === filterDist;
    return matchSearch && matchStatus && matchDist;
  });

  const openAdd = () => { setEditHM(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (h: HM) => { setEditHM(h); setForm({ name:h.name, empId:h.empId, phone:h.phone, email:h.email, district:h.district, block:h.block, school:h.school, dise:h.dise, experience:h.experience }); setShowModal(true); };
  const saveHM = () => {
    if (!form.name || !form.empId) return;
    if (editHM) {
      setHMs((prev) => prev.map((h) => h.id === editHM.id ? { ...h, ...form } : h));
    } else {
      setHMs((prev) => [...prev, { id:Date.now(), ...form, joinedSchool:"Jun 2026", status: form.school ? "assigned" : "unassigned" as any }]);
    }
    setShowModal(false);
  };

  const doTransfer = () => {
    if (!showTransfer || !transferTarget) return;
    setHMs((prev) => prev.map((h) => h.id === showTransfer.id ? { ...h, school: transferTarget, status:"transferred" } : h));
    setShowTransfer(null);
    setTransferTarget("");
  };

  const districts = Array.from(new Set(hms.map((h) => h.district)));

  return (
    <PortalLayout>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-white">👤 Headmaster Management</h1>
          <p className="text-xs text-slate-400 mt-1">Manage headmaster assignments, transfers, and school allocations across Tamil Nadu</p>
        </div>
        <button onClick={openAdd} className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition">+ Add HM</button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label:"Total HMs", value:hms.length, icon:"👤", color:"text-blue-400" },
          { label:"Assigned", value:hms.filter((h) => h.status==="assigned").length, icon:"✅", color:"text-emerald-400" },
          { label:"Unassigned", value:hms.filter((h) => h.status==="unassigned").length, icon:"⚠️", color:"text-amber-400" },
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
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search by name, ID, school..."
          className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 w-56 focus:outline-none focus:border-blue-500" />
        <div className="flex gap-2">
          {(["all","assigned","unassigned","transferred"] as const).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`text-[10px] font-bold px-3 py-1 rounded-full transition capitalize ${
                filterStatus === s ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 border border-slate-700 hover:text-white"
              }`}>{s}</button>
          ))}
        </div>
        <select value={filterDist} onChange={(e) => setFilterDist(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500">
          <option value="All">All Districts</option>
          {districts.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* HM Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((h) => (
          <div key={h.id} className="glass rounded-2xl p-5 border border-slate-800 hover:border-slate-600 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-lg font-bold text-white">
                  {h.name[0]}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{h.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{h.empId}</div>
                </div>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusColors[h.status]}`}>
                {h.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-1.5 text-[10px] mb-4">
              <div className="flex gap-2"><span className="text-slate-500 w-20">School</span><span className="text-slate-300 font-semibold">{h.school}</span></div>
              <div className="flex gap-2"><span className="text-slate-500 w-20">DISE</span><span className="text-slate-400 font-mono">{h.dise}</span></div>
              <div className="flex gap-2"><span className="text-slate-500 w-20">District</span><span className="text-slate-400">{h.district}</span></div>
              <div className="flex gap-2"><span className="text-slate-500 w-20">Experience</span><span className="text-slate-400">{h.experience} years</span></div>
              <div className="flex gap-2"><span className="text-slate-500 w-20">Phone</span><span className="text-slate-400">{h.phone}</span></div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button onClick={() => openEdit(h)} className="text-[10px] font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-lg transition">Edit</button>
              <button onClick={() => setShowTransfer(h)} className="text-[10px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg transition">Transfer</button>
              <button onClick={() => setHMs((prev) => prev.filter((x) => x.id !== h.id))} className="text-[10px] font-bold text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-lg transition">Remove</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-base font-bold text-white mb-5">{editHM ? "✏️ Edit HM" : "➕ Add Headmaster"}</h3>
            <div className="space-y-3">
              {[
                { label:"Full Name", key:"name", placeholder:"HM full name" },
                { label:"Employee ID", key:"empId", placeholder:"TN-HM-XXXX" },
                { label:"Phone", key:"phone", placeholder:"10-digit number" },
                { label:"Email", key:"email", placeholder:"hm@tn.gov.in" },
                { label:"District", key:"district", placeholder:"District name" },
                { label:"Block", key:"block", placeholder:"Block name" },
                { label:"Assigned School", key:"school", placeholder:"School name" },
                { label:"DISE Code", key:"dise", placeholder:"e.g. 33012345" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">{label}</label>
                  <input value={(form as any)[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500" />
                </div>
              ))}
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Experience (years)</label>
                <input type="number" value={form.experience} onChange={(e) => setForm((f) => ({ ...f, experience: +e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 text-xs font-bold text-slate-400 bg-slate-800 py-2 rounded-lg border border-slate-700">Cancel</button>
              <button onClick={saveHM} className="flex-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 py-2 rounded-lg transition">{editHM ? "Save" : "Add HM"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransfer && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">🔄 Transfer HM</h3>
            <p className="text-xs text-slate-400 mb-4">Transferring: <strong className="text-white">{showTransfer.name}</strong></p>
            <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">New School Name</label>
            <input value={transferTarget} onChange={(e) => setTransferTarget(e.target.value)} placeholder="Enter new school name"
              className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setShowTransfer(null)} className="flex-1 text-xs font-bold text-slate-400 bg-slate-800 py-2 rounded-lg border border-slate-700">Cancel</button>
              <button onClick={doTransfer} className="flex-1 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 py-2 rounded-lg transition">Transfer</button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
