"use client";
import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";



interface ClassInfo {
  id: string;
  name: string;
  subject: string;
  studentsCount: number;
  attendance: number;
  homeworkRate: number;
  avgScore: number;
  riskCount: number;
  syllabus: string;
}

interface Student {
  rollNo: string;
  name: string;
  attendance: number;
  grade: number;
  status: "Good" | "Average" | "Risk";
}

const initialClasses: ClassInfo[] = [
  { id: "10a", name: "Class 10A", subject: "Mathematics", studentsCount: 42, attendance: 94, homeworkRate: 88, avgScore: 76, riskCount: 2, syllabus: "TN Board (Samacheer Kalvi)" },
  { id: "10b", name: "Class 10B", subject: "Mathematics", studentsCount: 40, attendance: 89, homeworkRate: 82, avgScore: 71, riskCount: 4, syllabus: "TN Board (Samacheer Kalvi)" },
  { id: "9a", name: "Class 9A", subject: "Mathematics", studentsCount: 45, attendance: 96, homeworkRate: 91, avgScore: 82, riskCount: 1, syllabus: "TN Board (Samacheer Kalvi)" },
];

const studentsData: Record<string, Student[]> = {
  "10a": [
    { rollNo: "10A01", name: "Aarthi V.", attendance: 98, grade: 89, status: "Good" },
    { rollNo: "10A02", name: "Balaji R.", attendance: 92, grade: 74, status: "Average" },
    { rollNo: "10A03", name: "Kavitha R.", attendance: 85, grade: 48, status: "Risk" },
    { rollNo: "10A04", name: "Manoj K.", attendance: 96, grade: 92, status: "Good" },
    { rollNo: "10A05", name: "Priya S.", attendance: 94, grade: 81, status: "Good" },
    { rollNo: "10A06", name: "Rajesh M.", attendance: 89, grade: 62, status: "Average" },
  ],
  "10b": [
    { rollNo: "10B01", name: "Dinesh K.", attendance: 91, grade: 70, status: "Average" },
    { rollNo: "10B02", name: "Murugan S.", attendance: 78, grade: 52, status: "Risk" },
    { rollNo: "10B03", name: "Nalini P.", attendance: 95, grade: 88, status: "Good" },
    { rollNo: "10B04", name: "Senthil K.", attendance: 82, grade: 41, status: "Risk" },
    { rollNo: "10B05", name: "Uma G.", attendance: 90, grade: 76, status: "Average" },
  ],
  "9a": [
    { rollNo: "9A01", name: "Deepa M.", attendance: 88, grade: 58, status: "Risk" },
    { rollNo: "9A02", name: "Ganesh A.", attendance: 97, grade: 85, status: "Good" },
    { rollNo: "9A03", name: "Janaki R.", attendance: 99, grade: 94, status: "Good" },
    { rollNo: "9A04", name: "Karthik P.", attendance: 95, grade: 79, status: "Good" },
    { rollNo: "9A05", name: "Selvi K.", attendance: 96, grade: 80, status: "Good" },
  ]
};

export default function ClassesPage() {
  const [classesList, setClassesList] = useState<ClassInfo[]>(initialClasses);
  const [selectedClassId, setSelectedClassId] = useState<string>("10a");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Class Form State
  const [newClassName, setNewClassName] = useState("");
  const [newClassSubject, setNewClassSubject] = useState("Mathematics");
  const [newClassSyllabus, setNewClassSyllabus] = useState("TN Board (Samacheer Kalvi)");
  const [newClassStudents, setNewClassStudents] = useState("40");

  const selectedClass = classesList.find((c) => c.id === selectedClassId) || classesList[0];
  const students = studentsData[selectedClass.id] || [];

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const newId = newClassName.toLowerCase().replace(/\s+/g, "-");
    const newClass: ClassInfo = {
      id: newId,
      name: newClassName,
      subject: newClassSubject,
      studentsCount: parseInt(newClassStudents) || 40,
      attendance: 100,
      homeworkRate: 100,
      avgScore: 80,
      riskCount: 0,
      syllabus: newClassSyllabus,
    };

    setClassesList([...classesList, newClass]);
    // Initialize mock student data for new class
    studentsData[newId] = [
      { rollNo: `${newClassName.toUpperCase().replace(/\s+/g, "")}01`, name: "Student A", attendance: 100, grade: 80, status: "Good" },
      { rollNo: `${newClassName.toUpperCase().replace(/\s+/g, "")}02`, name: "Student B", attendance: 95, grade: 75, status: "Average" },
    ];
    setSelectedClassId(newId);
    setShowAddModal(false);
    // Reset Form
    setNewClassName("");
  };

  return (
    <PortalLayout title="My Classes" subtitle="Manage your sections, student rosters, and schedules">
      <div className="flex flex-col gap-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
          <div>
            <h2 className="text-white font-semibold text-sm">Class Directory</h2>
            <p className="text-xs text-slate-500">Select a class to view its active student roster and analytics summary.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 transition-colors flex items-center gap-1"
          >
            <span>➕</span> Add New Class
          </button>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {classesList.map((c) => {
            const isSelected = c.id === selectedClassId;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedClassId(c.id)}
                className={`glass rounded-2xl p-5 border text-left cursor-pointer transition-all hover:scale-[1.01] ${
                  isSelected ? "border-amber-500/80 bg-amber-500/5 shadow-lg shadow-amber-500/5" : "border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-bold text-base">{c.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{c.subject}</p>
                  </div>
                  <span className="badge badge-blue text-[10px]">{c.syllabus.split(" ")[0]}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800/60 text-xs">
                  <div>
                    <span className="text-slate-500 block">Students</span>
                    <span className="text-white font-semibold">{c.studentsCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Attendance</span>
                    <span className={`font-semibold ${c.attendance >= 90 ? "text-emerald-400" : "text-amber-400"}`}>
                      {c.attendance}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Avg Score</span>
                    <span className="text-white font-semibold">{c.avgScore}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">At Risk</span>
                    <span className={`font-semibold ${c.riskCount > 2 ? "text-red-400" : c.riskCount > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                      {c.riskCount} students
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Class Details and Roster */}
        {selectedClass && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student Roster */}
            <div className="lg:col-span-2 glass rounded-2xl p-6">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="text-white font-semibold text-sm">📋 Student Roster - {selectedClass.name}</h3>
                  <p className="text-xs text-slate-500">List of students registered in this section.</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search student..."
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Roll No</th>
                      <th>Student Name</th>
                      <th>Attendance</th>
                      <th>Avg Grade</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.rollNo}>
                        <td className="font-mono text-xs">{student.rollNo}</td>
                        <td className="font-medium text-white">{student.name}</td>
                        <td>{student.attendance}%</td>
                        <td>{student.grade}%</td>
                        <td>
                          <span className={`badge ${
                            student.status === "Good" ? "badge-green" : student.status === "Average" ? "badge-yellow" : "badge-red"
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button className="text-xs font-medium text-amber-400 hover:underline">Edit</button>
                            <span className="text-slate-700">|</span>
                            <button className="text-xs font-medium text-slate-400 hover:text-white">Report</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Class Stats & Highlights */}
            <div className="glass rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-white font-semibold text-sm mb-4">🏫 Section Details</h3>
                
                <div className="space-y-4">
                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-500">Syllabus Curriculum</div>
                    <div className="text-xs text-white font-semibold mt-1">{selectedClass.syllabus}</div>
                  </div>

                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-500">Active Syllabus Progress</div>
                    <div className="flex items-center justify-between text-xs text-white mt-1 mb-1.5 font-semibold">
                      <span>Term 1 Curriculum</span>
                      <span>68% Complete</span>
                    </div>
                    <div className="progress-bar w-full">
                      <div className="progress-fill" style={{ width: "68%", background: "#f59e0b" }}></div>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-500">Homework Submissions Rate</div>
                    <div className="text-xs text-white font-semibold mt-1">{selectedClass.homeworkRate}%</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="text-xs text-slate-400 mb-3 font-medium">Quick Tasks</div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-white transition-colors text-center border border-slate-700/50">
                    📅 Attendance
                  </button>
                  <button className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-white transition-colors text-center border border-slate-700/50">
                    📝 View Grades
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl w-full max-w-md border border-slate-800 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-white font-semibold text-base">➕ Add New Class</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-500 hover:text-white text-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddClass} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Class Name (e.g. Class 11C)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 11C"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-650 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Subject</label>
                <select
                  value={newClassSubject}
                  onChange={(e) => setNewClassSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option>Mathematics</option>
                  <option>Science</option>
                  <option>English</option>
                  <option>Social Science</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Syllabus Curriculum</label>
                <select
                  value={newClassSyllabus}
                  onChange={(e) => setNewClassSyllabus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option>TN Board (Samacheer Kalvi)</option>
                  <option>CBSE Curriculum</option>
                  <option>ICSE Curriculum</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Estimated Student Count</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={newClassStudents}
                  onChange={(e) => setNewClassStudents(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-xs font-semibold text-white transition-all"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
