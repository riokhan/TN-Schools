"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import PortalLayout from "@/components/PortalLayout";

interface Material {
  id: string;
  title: string;
  category: "Notes" | "Worksheet" | "Video Reference" | "Exam Prep";
  classSection: string;
  format: string;
  size: string;
  date: string;
}

export default function AddMaterialsPage() {
  const { data: session } = useSession();
  const schoolId = (session?.user as any)?.schoolId;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Material["category"]>("Notes");
  const [targetClass, setTargetClass] = useState("Class 10A");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFileSize, setSelectedFileSize] = useState<string>("");
  const [selectedFileFormat, setSelectedFileFormat] = useState<string>("PDF");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"All" | "Notes" | "Worksheet" | "Video Reference" | "Exam Prep">("All");

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/teacher/materials?schoolId=${schoolId || ""}`);
      const result = await res.json();
      if (result.success) {
        setMaterials(result.data);
      }
    } catch (err) {
      console.error("Error fetching materials:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [schoolId]);

  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);
      
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      setSelectedFileSize(`${sizeInMB} MB`);

      const extension = file.name.split('.').pop()?.toUpperCase() || "PDF";
      setSelectedFileFormat(extension);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedFileName) return;

    try {
      const res = await fetch(`${API_URL}/api/teacher/materials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          classSection: targetClass,
          format: selectedFileFormat,
          size: selectedFileSize,
          schoolId: schoolId || null,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setMaterials([result.data, ...materials]);
        setTitle("");
        setSelectedFileName(null);
        setSelectedFileSize("");
        setSelectedFileFormat("PDF");
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Error uploading material:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    try {
      const res = await fetch(`${API_URL}/api/teacher/materials/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        setMaterials(materials.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error("Error deleting material:", err);
    }
  };

  const filteredMaterials = materials.filter(
    (m) => activeTab === "All" || m.category === activeTab
  );

  return (
    <PortalLayout title="Study Materials & Resources" subtitle="Upload study documents, links, and worksheets.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Upload form */}
        <div className="theme-card p-6 border border-[var(--border)]">
          <h2 className="text-base font-semibold text-[var(--text-heading)] mb-4">📚 Upload New Resource</h2>
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
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".pdf,.doc,.docx,.ppt,.pptx"
              />
              <div
                onClick={handleFileSelectClick}
                className="border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] rounded-2xl p-6 text-center cursor-pointer transition-all"
              >
                <span className="text-3xl block mb-2">📁</span>
                <span className="text-xs text-[var(--text-muted)] font-medium block">
                  {selectedFileName ? `${selectedFileName} (${selectedFileSize})` : "Click to select study resource file"}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] mt-1 block">Supports PDF, Doc, PPT up to 15MB</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!title || !selectedFileName}
              className="w-full py-2.5 bg-[var(--primary)] hover:bg-amber-600 disabled:bg-[var(--bg-card)] disabled:text-[var(--text-muted)] text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
            >
              Upload & Distribute to Students
            </button>
          </form>
        </div>

        {/* Directory details */}
        <div className="lg:col-span-2 theme-card p-6 border border-[var(--border)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-base font-semibold text-[var(--text-heading)]">🗂️ Study Materials Directory</h2>
            
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
            {loading ? (
              <div className="p-12 text-center text-[var(--text-muted)] text-xs">
                Loading database directory...
              </div>
            ) : filteredMaterials.length > 0 ? (
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
                      <span className="text-xs font-bold text-[var(--text-muted)]">{m.classSection}</span>
                    </div>
                    <h3 className="text-sm font-bold text-[var(--text-heading)] mb-0.5">{m.title}</h3>
                    <div className="text-[10px] text-[var(--text-muted)] font-semibold">
                      Format: <span className="text-[var(--text-muted)]">{m.format}</span> · Size: <span className="text-[var(--text-muted)]">{m.size}</span> · Uploaded: <span className="text-[var(--text-muted)]">{m.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button className="p-2 bg-[var(--bg-card)] hover:bg-slate-700 text-[var(--text-heading)] rounded-lg text-xs transition-colors border border-[var(--border)]">
                      ⬇ Download
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="p-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-lg text-xs transition-colors"
                    >
                      ✕ Delete
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
