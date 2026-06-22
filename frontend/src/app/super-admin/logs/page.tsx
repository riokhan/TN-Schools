"use client";
import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

const logs = [
  { id: 1, timestamp: "2025-06-22 10:30:15", level: "INFO", user: "superadmin@gmail.com", action: "Page toggled", detail: "Enabled 'Special AI Sandbox' for STUDENT role", ip: "192.168.1.1" },
  { id: 2, timestamp: "2025-06-22 10:28:42", level: "INFO", user: "superadmin@gmail.com", action: "Login", detail: "Successful authentication via credentials", ip: "192.168.1.1" },
  { id: 3, timestamp: "2025-06-22 10:15:03", level: "WARN", user: "teacher@gmail.com", action: "Failed login", detail: "Invalid password attempt (3rd try)", ip: "10.0.0.45" },
  { id: 4, timestamp: "2025-06-22 09:55:18", level: "INFO", user: "headmaster@gmail.com", action: "Data export", detail: "Exported student attendance report (Class 10A)", ip: "172.16.0.8" },
  { id: 5, timestamp: "2025-06-22 09:40:00", level: "ERROR", user: "system", action: "API timeout", detail: "MongoDB connection retry succeeded after 2s", ip: "localhost" },
  { id: 6, timestamp: "2025-06-22 09:22:11", level: "INFO", user: "minister@gmail.com", action: "Dashboard view", detail: "Accessed Live State View", ip: "10.0.0.12" },
  { id: 7, timestamp: "2025-06-22 08:50:33", level: "INFO", user: "superadmin@gmail.com", action: "Page created", detail: "Created 'Teacher Extra Resource Hub' at /teacher/extra-resources", ip: "192.168.1.1" },
  { id: 8, timestamp: "2025-06-22 08:30:00", level: "INFO", user: "system", action: "Scheduled backup", detail: "Daily PostgreSQL backup completed (2.4 GB)", ip: "localhost" },
];

const levelColors: Record<string, string> = {
  INFO: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  WARN: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  ERROR: "text-red-400 bg-red-500/10 border-red-500/20",
};

export default function SystemLogs() {
  const [filter, setFilter] = useState<"ALL" | "INFO" | "WARN" | "ERROR">("ALL");

  const filtered = filter === "ALL" ? logs : logs.filter((l) => l.level === filter);

  return (
    <PortalLayout>
      <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
        <p className="text-xs text-purple-300">
          📋 <strong>System Audit Logs</strong> — Track authentication, page changes, data exports, and system events across all portals.
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {(["ALL", "INFO", "WARN", "ERROR"] as const).map((level) => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
              filter === level
                ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800"
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Detail</th>
                <th className="px-4 py-3">IP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id} className="border-b border-slate-800/50 hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-3 text-[10px] text-slate-500 font-mono whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${levelColors[log.level]}`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-300">{log.user}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-white">{log.action}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 max-w-xs truncate">{log.detail}</td>
                  <td className="px-4 py-3 text-[10px] text-slate-600 font-mono">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PortalLayout>
  );
}
