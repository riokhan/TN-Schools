"use client";
import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

type Status = "connected" | "error" | "disabled";

interface AIService {
  id: string;
  name: string;
  provider: string;
  model: string;
  icon: string;
  portal: string;
  purpose: string;
  status: Status;
  apiKey: string;
  tokensUsed: number;
  tokenLimit: number;
  requestsToday: number;
  costUSD: number;
  color: string;
}

const GEMINI_MODELS = ["gemini-2.5-flash","gemini-2.0-flash","gemini-1.5-pro","gemini-1.5-flash"];
const OPENAI_MODELS = ["gpt-4o","gpt-4o-mini","gpt-4-turbo","gpt-3.5-turbo"];

const initialServices: AIService[] = [
  { id:"ai-tutor", name:"AI Tutor", provider:"Google Gemini", model:"gemini-2.0-flash", icon:"🤖", portal:"Student", purpose:"Personalized tutoring & doubt solving", status:"connected", apiKey:"AIza••••••••••••••••xK9m", tokensUsed:4_820_000, tokenLimit:10_000_000, requestsToday:18_420, costUSD:12.40, color:"from-cyan-600 to-blue-700" },
  { id:"lesson-planner", name:"Lesson Planner", provider:"Google Gemini", model:"gemini-1.5-flash", icon:"📋", portal:"Teacher", purpose:"Auto-generate lesson plans from syllabus", status:"connected", apiKey:"AIza••••••••••••••••xK9m", tokensUsed:1_240_000, tokenLimit:5_000_000, requestsToday:4_210, costUSD:3.20, color:"from-amber-600 to-orange-700" },
  { id:"question-gen", name:"Question Generator", provider:"Google Gemini", model:"gemini-1.5-pro", icon:"❓", portal:"Teacher", purpose:"AI-based exam question generation", status:"connected", apiKey:"AIza••••••••••••••••xK9m", tokensUsed:890_000, tokenLimit:5_000_000, requestsToday:2_100, costUSD:1.80, color:"from-violet-600 to-purple-700" },
  { id:"parent-bot", name:"Parent Assistant", provider:"Google Gemini", model:"gemini-2.0-flash", icon:"💬", portal:"Parent", purpose:"Chatbot for parent queries and guidance", status:"connected", apiKey:"AIza••••••••••••••••xK9m", tokensUsed:320_000, tokenLimit:2_000_000, requestsToday:1_840, costUSD:0.90, color:"from-emerald-600 to-teal-700" },
  { id:"analytics-ai", name:"Analytics AI", provider:"Google Gemini", model:"gemini-1.5-pro", icon:"📊", portal:"DEO/Commissioner", purpose:"Pattern detection in educational data", status:"connected", apiKey:"AIza••••••••••••••••xK9m", tokensUsed:210_000, tokenLimit:2_000_000, requestsToday:420, costUSD:0.60, color:"from-pink-600 to-rose-700" },
  { id:"openai-fallback", name:"OpenAI Fallback", provider:"OpenAI", model:"gpt-4o-mini", icon:"🔄", portal:"All", purpose:"Fallback when Gemini is unavailable", status:"disabled", apiKey:"sk-••••••••••••••••••••••••", tokensUsed:0, tokenLimit:1_000_000, requestsToday:0, costUSD:0, color:"from-slate-600 to-slate-800" },
];

const fmt = (n: number) => n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n/1_000).toFixed(0)}K` : n.toString();

export default function AIConfig() {
  const [services, setServices] = useState<AIService[]>(initialServices);
  const [editId, setEditId] = useState<string | null>(null);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [testResult, setTestResult] = useState<Record<string, "ok" | "fail" | null>>({});
  const [globalKey, setGlobalKey] = useState("AIzaSyB••••••••••••••••••");

  const editService = services.find((s) => s.id === editId);
  const [editForm, setEditForm] = useState<Partial<AIService>>({});

  const openEdit = (s: AIService) => { setEditId(s.id); setEditForm({ model:s.model, tokenLimit:s.tokenLimit, apiKey:s.apiKey }); };
  const saveEdit = () => {
    setServices((prev) => prev.map((s) => s.id === editId ? { ...s, ...editForm } : s));
    setEditId(null);
  };

  const toggleStatus = (id: string) => {
    setServices((prev) => prev.map((s) => s.id === id ? {
      ...s, status: s.status === "disabled" ? "connected" : "disabled"
    } : s));
  };

  const testAPI = (id: string) => {
    setTestResult((prev) => ({ ...prev, [id]: null }));
    setTimeout(() => {
      setTestResult((prev) => ({ ...prev, [id]: Math.random() > 0.2 ? "ok" : "fail" }));
    }, 1500);
  };

  const totalCost = services.reduce((a, s) => a + s.costUSD, 0);
  const totalRequests = services.reduce((a, s) => a + s.requestsToday, 0);
  const activeServices = services.filter((s) => s.status === "connected").length;

  return (
    <PortalLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">🤖 AI Integration & Setup</h1>
        <p className="text-xs text-slate-400 mt-1">Configure AI API keys, models, token limits, and monitor usage across all portals</p>
      </div>

      {/* Global API Key */}
      <div className="glass rounded-2xl p-5 border border-cyan-500/20 bg-cyan-500/5 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🔑</span>
          <div>
            <h3 className="text-sm font-bold text-white">Global Gemini API Key</h3>
            <p className="text-[10px] text-slate-400">Used by all Gemini-based services unless overridden per service</p>
          </div>
          <div className="ml-auto">
            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">● ACTIVE</span>
          </div>
        </div>
        <div className="flex gap-2">
          <input value={globalKey} onChange={(e) => setGlobalKey(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-cyan-500" />
          <button className="text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition">Update Key</button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label:"Active AI Services", value:`${activeServices}/${services.length}`, icon:"🤖", color:"text-cyan-400" },
          { label:"Requests Today", value:fmt(totalRequests), icon:"📡", color:"text-blue-400" },
          { label:"Total Cost Today", value:`$${totalCost.toFixed(2)}`, icon:"💰", color:"text-amber-400" },
          { label:"Tokens Used (all)", value:fmt(services.reduce((a, s) => a + s.tokensUsed, 0)), icon:"⚡", color:"text-violet-400" },
        ].map((k) => (
          <div key={k.label} className="glass rounded-xl p-4 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xl">{k.icon}</span>
              <div>
                <div className={`text-lg font-extrabold ${k.color}`}>{k.value}</div>
                <div className="text-[10px] text-slate-500">{k.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {services.map((s) => {
          const usagePct = Math.round((s.tokensUsed / s.tokenLimit) * 100);
          const tr = testResult[s.id];
          return (
            <div key={s.id} className={`glass rounded-2xl p-5 border transition-all ${
              s.status === "connected" ? "border-slate-700" : "border-slate-800/40 opacity-70"
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl shadow`}>{s.icon}</div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{s.name}</h3>
                    <p className="text-[10px] text-slate-500">{s.provider} · <span className="font-mono">{s.model}</span></p>
                    <span className="text-[9px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded mt-1 inline-block">{s.portal}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => toggleStatus(s.id)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${s.status === "connected" ? "bg-emerald-500" : "bg-slate-700"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${s.status === "connected" ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    s.status === "connected" ? "text-emerald-400" : s.status === "error" ? "text-red-400" : "text-slate-500"
                  }`}>{s.status.toUpperCase()}</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 mb-3">{s.purpose}</p>

              {/* Token Usage Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-[9px] text-slate-500 mb-1">
                  <span>Token Usage</span>
                  <span>{fmt(s.tokensUsed)} / {fmt(s.tokenLimit)} ({usagePct}%)</span>
                </div>
                <div className="bg-slate-800 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full transition-all ${usagePct > 80 ? "bg-red-500" : usagePct > 50 ? "bg-amber-500" : "bg-emerald-500"}`}
                    style={{ width:`${Math.min(usagePct, 100)}%` }} />
                </div>
              </div>

              <div className="flex justify-between text-[9px] text-slate-500 mb-4">
                <span>Today: <strong className="text-white">{fmt(s.requestsToday)}</strong> requests</span>
                <span>Cost: <strong className="text-amber-400">${s.costUSD.toFixed(2)}</strong></span>
              </div>

              {/* API Key */}
              <div className="flex gap-2 mb-3">
                <input readOnly value={showKey[s.id] ? s.apiKey.replace(/•+/, "REAL_KEY_HERE") : s.apiKey}
                  className="flex-1 bg-slate-900 border border-slate-800 text-slate-400 text-[10px] rounded-lg px-2 py-1.5 font-mono focus:outline-none" />
                <button onClick={() => setShowKey((p) => ({ ...p, [s.id]: !p[s.id] }))}
                  className="text-[10px] text-slate-400 bg-slate-800 border border-slate-700 px-2 py-1 rounded-lg hover:text-white transition">
                  {showKey[s.id] ? "Hide" : "Show"}
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => openEdit(s)} className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-lg hover:bg-blue-500/20 transition">Edit Config</button>
                <button onClick={() => testAPI(s.id)} className="text-[10px] font-bold text-slate-300 bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg hover:text-white transition">
                  {tr === null ? "⏳ Testing..." : tr === "ok" ? "✅ Connected" : tr === "fail" ? "❌ Failed" : "🔌 Test API"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editId && editService && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">⚙️ Configure {editService.name}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Model</label>
                <select value={editForm.model} onChange={(e) => setEditForm((f) => ({ ...f, model: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500">
                  {(editService.provider.includes("Gemini") ? GEMINI_MODELS : OPENAI_MODELS).map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Token Limit</label>
                <input type="number" value={editForm.tokenLimit} onChange={(e) => setEditForm((f) => ({ ...f, tokenLimit: +e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Override API Key</label>
                <input value={editForm.apiKey} onChange={(e) => setEditForm((f) => ({ ...f, apiKey: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-cyan-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditId(null)} className="flex-1 text-xs font-bold text-slate-400 bg-slate-800 py-2 rounded-lg border border-slate-700">Cancel</button>
              <button onClick={saveEdit} className="flex-1 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 py-2 rounded-lg transition">Save Config</button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
