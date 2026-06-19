"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface Material {
  id: number;
  title: string;
  category: "Notes" | "Worksheet" | "Video Reference" | "Exam Prep";
  class: string;
  format: string;
  size: string;
  date: string;
}

export default function AddMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([
    { id: 1, title: "Class 10 - Physics - Laws of Motion Notes", category: "Notes", class: "Class 10A", format: "PDF", size: "2.4 MB", date: "June 15, 2026" },
    { id: 2, title: "Grade 9 - Biology - Plant Cells Labeling Activity", category: "Worksheet", class: "Class 9B", format: "PDF", size: "1.8 MB", date: "June 18, 2026" },
    { id: 3, title: "Ohm's Law Video Tutorial (TN Kalvi TV)", category: "Video Reference", class: "Class 12B", format: "Link", size: "External", date: "June 10, 2026" },
  ]);

  // Upload Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Material["category"]>("Notes");
  const [targetClass, setTargetClass] = useState("Class 10A");
  const [simulatedFile, setSimulatedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"All" | "Notes" | "Worksheet" | "Video Reference" | "Exam Prep">("All");

  const handleSimulatedFileSelect = () => {
    setSimulatedFile("study_resource_document_draft.pdf (4.2 MB)");
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !simulatedFile) return;

    const newMaterial: Material = {
      id: Date.now(),
      title,
      category,
      class: targetClass,
      format: "PDF",
      size: "4.2 MB",
      date: "Today",
    };

    setMaterials([newMaterial, ...materials]);
    setTitle("");
    setSimulatedFile(null);
  };

  const handleDelete = (id: number) => {
    setMaterials(materials.filter((m) => m.id !== id));
  };

  const filteredMaterials = materials.filter(
    (m) => activeTab === "All" || m.category === activeTab
  );

  return (
    <PortalLayout title="Study Materials & Resources" subtitle="Upload study documents, links, and worksheets.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Upload form */}
        <div className="theme-card p-6 border border-[var(--border)]">
          <h2 className="text-base font-semibold text-[var(--text-heading)] mb-4">ðŸ“š Upload New Resource</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">Resource Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Periodic Table Reference Guide"
                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Material["category"])}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                >
                  <option value="Notes">Notes</option>
                  <option value="Worksheet">Worksheet</option>
                  <option value="Video Reference">Video Reference</option>
                  <option value="Exam Prep">Exam Prep</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">Class Section</label>
                <select
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                >
                  <option value="Class 10A">Class 10A</option>
                  <option value="Class 9B">Class 9B</option>
                  <option value="Class 8A">Class 8A</option>
                  <option value="Class 12B">Class 12B</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">File Attachment</label>
              <div
                onClick={handleSimulatedFileSelect}
                className="border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] rounded-2xl p-6 text-center cursor-pointer transition-all"
              >
                <span className="text-3xl block mb-2">ðŸ“</span>
                <span className="text-xs text-[var(--text-muted)] font-medium block">
                  {simulatedFile ? simulatedFile : "Click to select study resource file"}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] mt-1 block">Supports PDF, Doc, PPT up to 15MB</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!title || !simulatedFile}
              className="w-full py-2.5 bg-[var(--primary)] hover:bg-amber-600 disabled:bg-[var(--bg-card)] disabled:text-[var(--text-muted)] text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
            >
              Upload & Distribute to Students
            </button>
          </form>
        </div>

        {/* Directory details */}
        <div className="lg:col-span-2 theme-card p-6 border border-[var(--border)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-base font-semibold text-[var(--text-heading)]">ðŸ—‚ï¸ Study Materials Directory</h2>
            
            <div className="flex flex-wrap gap-1.5 p-1 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl">
              {(["All", "Notes", "Worksheet", "Video Reference", "Exam Prep"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab
                      ? "bg-[var(--primary)] text-white shadow-sm font-bold"
                      : "text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-card)]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((m) => (
                <div
                  key={m.id}
                  className="p-4 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] rounded-xl border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold px-2 py-0.5 bg-[var(--primary)]/10 text-amber-400 border border-[var(--primary)]/20 rounded-md">
                        {m.category}
                      </span>
                      <span className="text-xs font-bold text-[var(--text-muted)]">{m.class}</span>
                    </div>
                    <h3 className="text-sm font-bold text-[var(--text-heading)] mb-0.5">{m.title}</h3>
                    <div className="text-[10px] text-[var(--text-muted)] font-semibold">
                      Format: <span className="text-[var(--text-muted)]">{m.format}</span> Â· Size: <span className="text-[var(--text-muted)]">{m.size}</span> Â· Uploaded: <span className="text-[var(--text-muted)]">{m.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button className="p-2 bg-[var(--bg-card)] hover:bg-slate-700 text-[var(--text-heading)] rounded-lg text-xs transition-colors border border-[var(--border)]">
                      â¬‡ Download
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="p-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-lg text-xs transition-colors"
                    >
                      âœ• Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-[var(--text-muted)] text-xs italic">
                No materials uploaded in this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

