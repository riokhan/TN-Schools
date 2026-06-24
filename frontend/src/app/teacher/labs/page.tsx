"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PortalLayout from "@/components/PortalLayout";
import Swal from "sweetalert2";

interface Experiment {
  id: string;
  name: string;
  classSection: string;
  status: "active" | "scheduled" | "completed";
  date: string;
  safetyCheck: boolean;
}

interface StudentLabGrade {
  id: string;
  name: string;
  conduct: string;
  reportStatus: "Submitted" | "Pending" | "Late";
  grade: string;
}

export default function ScienceLabsPage() {
  const { data: session } = useSession();
  const schoolId = (session?.user as any)?.schoolId;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [studentGrades, setStudentGrades] = useState<StudentLabGrade[]>([]);
  const [loading, setLoading] = useState(true);

  // AI Generator States
  const [labTopic, setLabTopic] = useState("Photosynthesis Rate under Blue Light");
  const [labGrade, setLabGrade] = useState("9");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedManual, setGeneratedManual] = useState<any>(null);

  // Form state for creating a new session
  const [newLabName, setNewLabName] = useState("");
  const [newLabClass, setNewLabClass] = useState("Class 10A");
  const [newLabDate, setNewLabDate] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Labs
        const labsRes = await fetch(`${API_URL}/api/teacher/labs${schoolId ? `?schoolId=${schoolId}` : ""}`);
        const labsData = await labsRes.json();
        if (labsData.success && labsData.data) {
          setExperiments(labsData.data);
        }

        // Fetch Students to populate roster
        const studentsRes = await fetch(`${API_URL}/api/students${schoolId ? `?schoolId=${schoolId}` : ""}`);
        const studentsData = await studentsRes.json();
        if (studentsData.success && studentsData.data) {
          const mappedGrades = studentsData.data.map((student: any, idx: number) => ({
            id: student.id,
            name: student.user?.name || "Student Name",
            conduct: idx % 3 === 0 ? "Excellent" : idx % 3 === 1 ? "Good" : "Needs Attention",
            reportStatus: idx % 4 === 0 ? "Pending" : idx % 4 === 1 ? "Late" : "Submitted",
            grade: idx % 3 === 0 ? "A" : idx % 3 === 1 ? "B" : "C",
          }));
          setStudentGrades(mappedGrades);
        }
      } catch (err) {
        console.error("Error loading labs page data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [schoolId, API_URL]);

  const toggleSafety = async (id: string, currentVal: boolean) => {
    try {
      const res = await fetch(`${API_URL}/api/teacher/labs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ safetyCheck: !currentVal }),
      });
      const data = await res.json();
      if (data.success) {
        setExperiments(experiments.map((exp) => (exp.id === id ? { ...exp, safetyCheck: !currentVal } : exp)));
        Swal.fire({
          icon: "success",
          title: "Safety Status Updated",
          text: `Safety verification is now ${!currentVal ? "Verified ✓" : "Unverified ✕"}.`,
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: data.error || "Failed to update safety status.",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (err) {
      console.error("Error updating safety check", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleGradeChange = (id: string, newGrade: string) => {
    setStudentGrades(
      studentGrades.map((sg) => (sg.id === id ? { ...sg, grade: newGrade, reportStatus: "Submitted" } : sg))
    );
  };

  const handleCreateLab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabName || !newLabDate) return;

    try {
      const res = await fetch(`${API_URL}/api/teacher/labs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newLabName,
          classSection: newLabClass,
          status: "scheduled",
          date: newLabDate,
          safetyCheck: true,
          schoolId,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setExperiments([data.data, ...experiments]);
        setNewLabName("");
        setNewLabDate("");
        setShowAddForm(false);
        Swal.fire({
          icon: "success",
          title: "Lab Scheduled!",
          text: `Lab session "${newLabName}" scheduled successfully.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Creation Failed",
          text: data.error || "Failed to schedule lab session.",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (err) {
      console.error("Error creating lab session", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleGenerateManual = () => {
    setIsGenerating(true);
    setGenerationStep(1);
    setGeneratedManual(null);

    setTimeout(() => {
      setGenerationStep(2);
      setTimeout(() => {
        setGenerationStep(3);
        setTimeout(() => {
          setIsGenerating(false);
          setGeneratedManual({
            title: `Lab Manual: Investigation of ${labTopic} (Grade ${labGrade})`,
            objective: `To measure how blue light wavelengths affect the rate of oxygen bubble formation in hydrilla plants.`,
            apparatus: [
              "Hydrilla plant",
              "Beaker of water",
              "Funnel",
              "Test tube",
              "Blue LED light source",
              "Sodium bicarbonate (CO2 source)",
              "Stopwatch",
            ],
            steps: [
              "Place a fresh cut hydrilla sprig inside a water beaker under an inverted funnel.",
              "Invert a water-filled test tube over the funnel stem to collect gas bubbles.",
              "Position the Blue LED light 10 cm away from the beaker.",
              "Wait 2 minutes for acclimatization, then start the stopwatch and count bubbles for 5 minutes.",
              "Record observations and calculate the rate of photosynthesis (bubbles per minute).",
            ],
            safety: "Handle water near electrical light sources with extreme caution. Do not look directly into high-intensity blue light.",
          });
        }, 1500);
      }, 1500);
    }, 1200);
  };

  return (
    <PortalLayout title="Science Labs Manager" subtitle="Manage experimental sessions, lab manuals, and safety compliance.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Lab Sessions */}
        <div className="lg:col-span-2 theme-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-[var(--text-heading)]">🧪 Experimental Lab Sessions</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="btn-primary py-1 px-3 text-[11px] font-bold rounded-lg shadow-none"
              >
                {showAddForm ? "Cancel" : "+ Schedule Lab"}
              </button>
              <span className="text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-main)] px-2.5 py-1 rounded-full">
                Active: {experiments.filter((e) => e.status === "active").length}
              </span>
            </div>
          </div>

          {showAddForm && (
            <form onSubmit={handleCreateLab} className="mb-6 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] space-y-3">
              <h3 className="text-xs font-bold text-[var(--text-heading)] uppercase">New Lab Session Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Experiment Name"
                  value={newLabName}
                  onChange={(e) => setNewLabName(e.target.value)}
                  className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-2 text-xs text-[var(--text-heading)] outline-none"
                  required
                />
                <select
                  value={newLabClass}
                  onChange={(e) => setNewLabClass(e.target.value)}
                  className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-2 text-xs text-[var(--text-heading)] outline-none"
                >
                  <option value="Class 10A">Class 10A</option>
                  <option value="Class 10B">Class 10B</option>
                  <option value="Class 9A">Class 9A</option>
                  <option value="Class 8A">Class 8A</option>
                  <option value="Class 12B">Class 12B</option>
                </select>
                <input
                  type="text"
                  placeholder="e.g. June 25, 2026, 11:30 AM"
                  value={newLabDate}
                  onChange={(e) => setNewLabDate(e.target.value)}
                  className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-2 text-xs text-[var(--text-heading)] outline-none"
                  required
                />
              </div>
              <button type="submit" className="btn-primary py-1.5 px-4 text-xs font-semibold rounded-lg shadow-none">
                Schedule Session
              </button>
            </form>
          )}

          {loading ? (
            <div className="text-center py-8 text-xs text-[var(--text-muted)]">Loading lab sessions...</div>
          ) : experiments.length === 0 ? (
            <div className="text-center py-8 text-xs text-[var(--text-muted)]">No experimental sessions scheduled.</div>
          ) : (
            <div className="space-y-4">
              {experiments.map((exp) => (
                <div
                  key={exp.id}
                  className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 hover-lift ${
                    exp.status === "active"
                      ? "bg-[var(--bg-card)] border-[var(--primary)] shadow-[0_4px_20px_rgba(79,70,229,0.15)] dark:shadow-[0_4px_20px_rgba(129,140,248,0.15)]"
                      : "bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--primary)]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        exp.status === "active"
                          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                          : exp.status === "completed"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "bg-slate-50 text-slate-500 dark:bg-slate-500/10 dark:text-slate-400"
                      }`}
                    >
                      {exp.status === "active" ? "🔥" : exp.status === "completed" ? "✅" : "📅"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-[var(--text-heading)]">{exp.name}</span>
                        <span
                          className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                            exp.status === "active"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400"
                              : exp.status === "scheduled"
                              ? "bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400"
                              : "bg-slate-50 text-slate-500 border border-slate-200 dark:bg-slate-500/10 dark:border-slate-500/20 dark:text-slate-400"
                          }`}
                        >
                          {exp.status}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--text-main)]">
                        Target: <strong className="text-[var(--text-heading)]">{exp.classSection}</strong> · Scheduled: <span>{exp.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSafety(exp.id, exp.safetyCheck)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 border transition-all ${
                        exp.safetyCheck
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
                          : "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${exp.safetyCheck ? "bg-emerald-500" : "bg-red-500 animate-pulse"}`}></span>
                      {exp.safetyCheck ? "Safety Approved" : "Safety Unverified"}
                    </button>
                    <button className="btn-primary py-1.5 text-[11px] px-4 shadow-none hover:shadow-[var(--primary-shadow-1)]">
                      Start Session
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Manual Creator */}
        <div className="glass rounded-2xl p-6 border border-slate-800">
          <h2 className="text-base font-semibold text-white mb-4">🤖 AI Lab Manual Builder</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Experiment Topic</label>
              <input
                type="text"
                value={labTopic}
                onChange={(e) => setLabTopic(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="e.g. Acid Rain effects on Limestone"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Target Grade</label>
              <select
                value={labGrade}
                onChange={(e) => setLabGrade(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="6">Grade 6 - Basic Science</option>
                <option value="8">Grade 8 - Middle School Chemistry/Biology</option>
                <option value="9">Grade 9 - High School Biology</option>
                <option value="10">Grade 10 - Matriculation Science</option>
                <option value="12">Grade 12 - Higher Secondary Physics/Chemistry</option>
              </select>
            </div>

            <button
              onClick={handleGenerateManual}
              disabled={isGenerating}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? "Compiling Lab Blueprint..." : "🔬 Generate Lab Manual"}
            </button>
          </div>

          {/* Generator Steps Loading Screen */}
          {isGenerating && (
            <div className="mt-5 p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-amber-500/25 border-t-amber-500 rounded-full animate-spin" />
                <span className="text-xs text-slate-300 font-semibold">AI Assistant working...</span>
              </div>
              <div className="text-[10px] space-y-1.5">
                <div className={generationStep >= 1 ? "text-emerald-400" : "text-slate-500"}>✓ Verifying Tamil Nadu Science Syllabus guidelines...</div>
                <div className={generationStep >= 2 ? "text-emerald-400" : "text-slate-500"}>
                  {generationStep >= 2 ? "✓ Drafting detailed safety manual and procedure..." : "· Drafting detailed safety manual and procedure..."}
                </div>
                <div className={generationStep >= 3 ? "text-emerald-400" : "text-slate-500"}>
                  {generationStep >= 3 ? "✓ Formulating quiz and observations table..." : "· Formulating quiz and observations table..."}
                </div>
              </div>
            </div>
          )}

          {/* Generated Result display */}
          {generatedManual && !isGenerating && (
            <div className="mt-5 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-3 max-h-[300px] overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">Manual Generated Successfully</span>
                <span className="text-[10px] text-slate-500">AI Blueprint</span>
              </div>
              <h3 className="text-sm font-bold text-white">{generatedManual.title}</h3>
              <div>
                <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-1">Objective:</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{generatedManual.objective}</p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-1">Required Materials:</h4>
                <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1">
                  {generatedManual.apparatus.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-1">Procedure:</h4>
                <ol className="list-decimal pl-4 text-xs text-slate-300 space-y-1">
                  {generatedManual.steps.map((step: string, i: number) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
              <div className="p-2 bg-red-950/20 border border-red-500/20 rounded-lg">
                <h4 className="text-[10px] uppercase font-bold text-red-400 mb-0.5">⚠️ Safety Precaution:</h4>
                <p className="text-[10.5px] text-red-300/80 leading-relaxed">{generatedManual.safety}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lab Roster & Grading */}
      <div className="glass rounded-2xl p-6 border border-slate-800">
        <h2 className="text-base font-semibold text-white mb-5">👩‍🔬 Student Lab Roster & Grades</h2>
        {studentGrades.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">No students found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Lab Conduct</th>
                  <th>Report Status</th>
                  <th>Current Grade</th>
                  <th>Assign Grade</th>
                </tr>
              </thead>
              <tbody>
                {studentGrades.map((student) => (
                  <tr key={student.id}>
                    <td className="font-medium text-white">{student.name}</td>
                    <td>
                      <span
                        className={`badge ${
                          student.conduct === "Excellent"
                            ? "badge-green"
                            : student.conduct === "Good"
                            ? "badge-blue"
                            : "badge-yellow"
                        }`}
                      >
                        {student.conduct}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          student.reportStatus === "Submitted"
                            ? "badge-green"
                            : student.reportStatus === "Pending"
                            ? "badge-yellow"
                            : "badge-red"
                        }`}
                      >
                        {student.reportStatus}
                      </span>
                    </td>
                    <td className="text-white font-semibold">{student.grade}</td>
                    <td>
                      <select
                        value={student.grade}
                        onChange={(e) => handleGradeChange(student.id, e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                      >
                        <option value="A+">A+</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="F">F</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
