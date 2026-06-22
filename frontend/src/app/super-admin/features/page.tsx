"use client";
import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

const initialFeatures = [
  { id: "ai-tutor", name: "AI Tutor", portal: "Student", icon: "🤖", enabled: true, desc: "Personalized AI tutoring for all student levels" },
  { id: "lesson-planner", name: "AI Lesson Planner", portal: "Teacher", icon: "📋", enabled: true, desc: "Auto-generate lesson plans from syllabus" },
  { id: "parent-assistant", name: "AI Parent Assistant", portal: "Parent", icon: "💬", enabled: true, desc: "Chatbot for parent queries and updates" },
  { id: "dropout-heatmap", name: "Dropout Heatmap", portal: "DEO", icon: "🔴", enabled: true, desc: "District-level dropout risk visualization" },
  { id: "live-state", name: "Live State View", portal: "Minister", icon: "📡", enabled: true, desc: "Real-time state education metrics" },
  { id: "feedback-form", name: "Parent Feedback Form", portal: "Parent", icon: "📝", enabled: false, desc: "Direct parent suggestion channel" },
  { id: "ai-sandbox", name: "AI Sandbox", portal: "Student", icon: "🧪", enabled: true, desc: "Experimental AI learning playground" },
  { id: "virtual-labs", name: "Virtual Labs", portal: "Student", icon: "🔬", enabled: true, desc: "Interactive science lab simulations" },
];

export default function FeatureToggles() {
  const [features, setFeatures] = useState(initialFeatures);

  const toggleFeature = (id: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const enabledCount = features.filter((f) => f.enabled).length;

  return (
    <PortalLayout>
      <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
        <p className="text-xs text-amber-300">
          🔧 <strong>Feature Toggles</strong> — Enable or disable platform features per portal. Changes take effect immediately across all users.
        </p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
          {enabledCount} ENABLED
        </span>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full">
          {features.length - enabledCount} DISABLED
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature) => (
          <div
            key={feature.id}
            className={`glass rounded-2xl p-5 border transition-all ${feature.enabled ? "border-green-500/20" : "border-slate-700/50"}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-white">{feature.name}</h3>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded mt-1 inline-block">
                    {feature.portal}
                  </span>
                  <p className="text-xs text-slate-400 mt-2">{feature.desc}</p>
                </div>
              </div>
              <button
                onClick={() => toggleFeature(feature.id)}
                className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${
                  feature.enabled ? "bg-green-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    feature.enabled ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </PortalLayout>
  );
}
