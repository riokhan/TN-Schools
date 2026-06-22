"use client";
import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

export default function PortalSettings() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowDemoLogin: true,
    enableAiFeatures: true,
    enableNotifications: true,
    sessionTimeout: "30",
    maxUploadSize: "10",
    defaultLanguage: "English",
  });

  const updateSetting = (key: keyof typeof settings, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <PortalLayout>
      <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
        <p className="text-xs text-cyan-300">
          ⚙️ <strong>Portal Settings</strong> — Configure global platform behavior, security, and feature defaults.
        </p>
      </div>

      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5">🔒 Security & Access</h2>
          <div className="space-y-4">
            {[
              { key: "maintenanceMode" as const, label: "Maintenance Mode", desc: "Temporarily disable all portals for maintenance" },
              { key: "allowDemoLogin" as const, label: "Allow Demo Login", desc: "Enable quick demo switchboard on login page" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between bg-slate-900/40 rounded-xl px-4 py-4 border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white">{item.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                </div>
                <button
                  onClick={() => updateSetting(item.key, !settings[item.key])}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings[item.key] ? "bg-green-500" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      settings[item.key] ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
            <div className="flex items-center justify-between bg-slate-900/40 rounded-xl px-4 py-4 border border-slate-800">
              <div>
                <div className="text-xs font-bold text-white">Session Timeout</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Auto logout after inactivity (minutes)</div>
              </div>
              <select
                value={settings.sessionTimeout}
                onChange={(e) => updateSetting("sessionTimeout", e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
              >
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="60">60 min</option>
                <option value="120">120 min</option>
              </select>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5">🤖 AI & Features</h2>
          <div className="space-y-4">
            {[
              { key: "enableAiFeatures" as const, label: "AI Features", desc: "Enable AI tutor, lesson planner, and predictions globally" },
              { key: "enableNotifications" as const, label: "Push Notifications", desc: "Send real-time alerts to parents and teachers" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between bg-slate-900/40 rounded-xl px-4 py-4 border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white">{item.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                </div>
                <button
                  onClick={() => updateSetting(item.key, !settings[item.key])}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings[item.key] ? "bg-green-500" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      settings[item.key] ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5">🌐 Localization</h2>
          <div className="flex items-center justify-between bg-slate-900/40 rounded-xl px-4 py-4 border border-slate-800">
            <div>
              <div className="text-xs font-bold text-white">Default Language</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Platform default for new users</div>
            </div>
            <select
              value={settings.defaultLanguage}
              onChange={(e) => updateSetting("defaultLanguage", e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
            >
              <option value="English">English</option>
              <option value="தமிழ்">தமிழ் (Tamil)</option>
            </select>
          </div>
        </div>

        <button className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-colors">
          💾 Save Settings
        </button>
      </div>
    </PortalLayout>
  );
}
