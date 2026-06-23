"use client";

import React, { useState, useEffect } from "react";
import PortalLayout from "@/components/PortalLayout";

interface BEOUser {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  isActive: boolean;
  schoolId: string | null;
  createdAt: string;
  block?: string;
  passwordHash?: string;
}

interface School {
  id: string;
  name: string;
  block: string;
}

export default function ManageBEOsPage() {
  const [beos, setBeos] = useState<BEOUser[]>([]);
  const [blocks, setBlocks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [blockName, setBlockName] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchBeos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users?role=BEO`);
      const data = await res.json();
      if (data.success) {
        setBeos(data.data);
      }

      // Fetch unique blocks from schools to populate dropdown
      const schoolRes = await fetch(`${API_URL}/api/schools`);
      const schoolData = await schoolRes.json();
      if (schoolData.success) {
        const uniqueBlocks = Array.from(
          new Set(schoolData.data.map((s: School) => s.block).filter(Boolean))
        ) as string[];
        setBlocks(uniqueBlocks);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeos();
  }, []);

  const handleEditClick = (b: BEOUser, index: number) => {
    setEditingId(b.id);
    setName(b.name);
    setEmail(b.email);
    setMobile(b.mobile || "");
    setPassword(b.passwordHash || "");
    setBlockName(blocks[index % blocks.length] || "Coimbatore South");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setEditingId(null);
    setName("");
    setEmail("");
    setMobile("");
    setPassword("");
    setBlockName("");
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setToast(null);

    const endpoint = editingId ? `${API_URL}/api/users/${editingId}` : `${API_URL}/api/users`;
    const method = editingId ? "PUT" : "POST";
    const successMsg = editingId
      ? `🎉 BEO ${name} updated successfully!`
      : `🎉 BEO ${name} added successfully!`;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          mobile: mobile || undefined,
          role: "BEO",
          password: password || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToast({ message: successMsg, type: "success" });
        handleModalClose();
        fetchBeos();
      } else {
        setToast({ message: `⚠️ ${data.error || "Request failed."}`, type: "error" });
      }
    } catch (err) {
      setToast({ message: "❌ Network error. Please try again.", type: "error" });
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(null), 5000);
    }
  };

  const handleDelete = async (id: string, beoName: string) => {
    if (!confirm(`Are you sure you want to delete BEO ${beoName}?`)) return;

    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setToast({ message: `🗑️ BEO ${beoName} removed successfully!`, type: "success" });
        fetchBeos();
      } else {
        setToast({ message: `⚠️ ${data.error || "Failed to delete user."}`, type: "error" });
      }
    } catch (err) {
      setToast({ message: "❌ Error deleting user.", type: "error" });
    } finally {
      setTimeout(() => setToast(null), 5000);
    }
  };

  const filteredBeos = beos.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PortalLayout
      title="Manage BEOs"
      subtitle="DEO Officer · Coimbatore District"
      avatarLetter="D"
      avatarColor="#ec4899"
      themeClass="theme-deo"
      accentColor="#ec4899"
    >
      {/* Toast Alert */}
      {toast && (
        <div
          className={`mb-6 p-4 rounded-xl text-xs font-semibold border shadow-lg ${
            toast.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-300"
              : "bg-red-500/10 border-red-500/20 text-red-650 dark:text-red-300"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Overview stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block mb-1">Total BEOs</span>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{beos.length}</div>
          <span className="badge badge-pink mt-2">Active Hierarchy</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block mb-1">Coimbatore Blocks</span>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{blocks.length || 15}</div>
          <span className="badge badge-blue mt-2">Administrative Blocks</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block mb-1">Block Coverage</span>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">
            {Math.min(100, Math.round((beos.length / (blocks.length || 15)) * 100))}%
          </div>
          <span className="badge badge-green mt-2">Coverage Ratio</span>
        </div>
      </div>

      {/* Main List Container Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
          <div>
            <h2 className="text-base font-semibold text-slate-800 dark:text-white">🏢 Block Education Officers Registry</h2>
            <p className="text-xs text-slate-500 leading-relaxed">View, audit, and deploy block administrator credentials.</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-pink-500 transition-colors w-full sm:w-64"
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shrink-0"
            >
              + Add BEO
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-pink-500/20 border-t-pink-500 animate-spin mb-3" />
            <span className="text-xs text-slate-500">Loading BEOs...</span>
          </div>
        ) : filteredBeos.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <span className="text-3xl block mb-2">🏢</span>
            <span className="text-xs text-slate-400 font-medium">No BEOs found matching search query.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-3">BEO Name</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Mobile</th>
                  <th className="px-4 py-3">Jurisdiction</th>
                  <th className="px-4 py-3">Created Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBeos.map((b, index) => (
                  <tr key={b.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-800 dark:text-white text-xs">{b.name}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 font-mono">{b.email}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 font-mono">{b.mobile || "N/A"}</td>
                    <td className="px-4 py-3 text-xs text-pink-650 dark:text-pink-400 font-semibold">
                      {blocks[index % blocks.length] || "Coimbatore South"} Block
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500 font-medium">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(b, index)}
                          className="px-2.5 py-1 bg-pink-500/10 hover:bg-pink-500/20 text-pink-650 dark:text-pink-400 border border-pink-500/20 rounded-md font-bold text-[10px] transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(b.id, b.name)}
                          className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-650 dark:text-red-400 border border-red-500/20 rounded-md font-bold text-[10px] transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal Card */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl p-6 space-y-5 relative bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                🏢 {editingId ? "Edit BEO" : "Add Block Education Officer"}
              </h3>
              <button onClick={handleModalClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs">
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1 font-semibold">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mr. Murugesan P."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1 font-semibold">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. beo@coimbatore.tn.gov.in"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1 font-semibold">Mobile Number</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1 font-semibold">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={editingId ? "Leave blank to keep unchanged" : "Default is 123456"}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1 font-semibold">Assign Block Jurisdiction</label>
                <select
                  value={blockName}
                  onChange={(e) => setBlockName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-pink-500 transition-colors"
                >
                  <option value="">-- Select a Block --</option>
                  {blocks.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                  <option value="Coimbatore South">Coimbatore South</option>
                  <option value="Coimbatore North">Coimbatore North</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800 text-white font-bold rounded-xl text-xs transition-colors shadow-md mt-2"
              >
                {submitting ? "Processing..." : editingId ? "Save Changes" : "Add BEO"}
              </button>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
