"use client";

import React, { useState, useEffect } from "react";
import PortalLayout from "@/components/PortalLayout";

interface DEOUser {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  isActive: boolean;
  createdAt: string;
  district?: string;
  passwordHash?: string;
}

interface School {
  id: string;
  district: string;
}

export default function ManageDEOsPage() {
  const [deos, setDeos] = useState<DEOUser[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
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
  const [districtName, setDistrictName] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchDeos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users?role=DEO`);
      const data = await res.json();
      if (data.success) {
        setDeos(data.data);
      }

      // Fetch unique districts from schools to populate dropdown
      const schoolRes = await fetch(`${API_URL}/api/schools`);
      const schoolData = await schoolRes.json();
      if (schoolData.success) {
        const uniqueDistricts = Array.from(
          new Set(schoolData.data.map((s: School) => s.district).filter(Boolean))
        ) as string[];
        setDistricts(uniqueDistricts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeos();
  }, []);

  const handleEditClick = (d: DEOUser, index: number) => {
    setEditingId(d.id);
    setName(d.name);
    setEmail(d.email);
    setMobile(d.mobile || "");
    setPassword(d.passwordHash || "");
    setDistrictName(districts[index % districts.length] || "Coimbatore");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setEditingId(null);
    setName("");
    setEmail("");
    setMobile("");
    setPassword("");
    setDistrictName("");
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setToast(null);

    const endpoint = editingId ? `${API_URL}/api/users/${editingId}` : `${API_URL}/api/users`;
    const method = editingId ? "PUT" : "POST";
    const successMsg = editingId
      ? `🎉 DEO ${name} updated successfully!`
      : `🎉 DEO ${name} added successfully!`;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          mobile: mobile || undefined,
          role: "DEO",
          password: password || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToast({ message: successMsg, type: "success" });
        handleModalClose();
        fetchDeos();
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

  const handleDelete = async (id: string, deoName: string) => {
    if (!confirm(`Are you sure you want to delete DEO ${deoName}?`)) return;

    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setToast({ message: `🗑️ DEO ${deoName} removed successfully!`, type: "success" });
        fetchDeos();
      } else {
        setToast({ message: `⚠️ ${data.error || "Failed to delete user."}`, type: "error" });
      }
    } catch (err) {
      setToast({ message: "❌ Error deleting user.", type: "error" });
    } finally {
      setTimeout(() => setToast(null), 5000);
    }
  };

  const filteredDeos = deos.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PortalLayout
      title="Manage DEOs"
      subtitle="Commissioner · State Operations"
      avatarLetter="C"
      avatarColor="#06b6d4"
      themeClass="theme-commissioner"
      accentColor="#06b6d4"
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
          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block mb-1">Total DEOs</span>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{deos.length}</div>
          <span className="badge badge-cyan mt-2">Active Hierarchy</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block mb-1">TN Districts</span>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{districts.length || 38}</div>
          <span className="badge badge-blue mt-2">Revenue Districts</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block mb-1">District Coverage</span>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">
            {Math.min(100, Math.round((deos.length / (districts.length || 38)) * 100))}%
          </div>
          <span className="badge badge-green mt-2">Coverage Ratio</span>
        </div>
      </div>

      {/* Main List Container Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
          <div>
            <h2 className="text-base font-semibold text-slate-800 dark:text-white">⚖️ District Education Officers Registry</h2>
            <p className="text-xs text-slate-500 leading-relaxed">View, audit, and deploy district level administrator credentials.</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors w-full sm:w-64"
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shrink-0"
            >
              + Add DEO
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin mb-3" />
            <span className="text-xs text-slate-500">Loading DEOs...</span>
          </div>
        ) : filteredDeos.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <span className="text-3xl block mb-2">🗺️</span>
            <span className="text-xs text-slate-400 font-medium">No DEOs found matching search query.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-3">DEO Name</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Mobile</th>
                  <th className="px-4 py-3">District Jurisdiction</th>
                  <th className="px-4 py-3">Created Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeos.map((d, index) => (
                  <tr key={d.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-800 dark:text-white text-xs">{d.name}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 font-mono">{d.email}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 font-mono">{d.mobile || "N/A"}</td>
                    <td className="px-4 py-3 text-xs text-cyan-650 dark:text-cyan-400 font-semibold">
                      {districts[index % districts.length] || "Coimbatore"} District
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500 font-medium">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(d, index)}
                          className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-650 dark:text-cyan-400 border border-cyan-500/20 rounded-md font-bold text-[10px] transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(d.id, d.name)}
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
                ⚖️ {editingId ? "Edit DEO" : "Add District Education Officer"}
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
                  placeholder="e.g. Mrs. Kalaivani R."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1 font-semibold">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. deo@coimbatore.tn.gov.in"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1 font-semibold">Mobile Number</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1 font-semibold">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={editingId ? "Leave blank to keep unchanged" : "Default is 123456"}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1 font-semibold">Assign District Jurisdiction</label>
                <select
                  value={districtName}
                  onChange={(e) => setDistrictName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="">-- Select a District --</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Madurai">Madurai</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 text-white font-bold rounded-xl text-xs transition-colors shadow-md mt-2"
              >
                {submitting ? "Processing..." : editingId ? "Save Changes" : "Add DEO"}
              </button>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
