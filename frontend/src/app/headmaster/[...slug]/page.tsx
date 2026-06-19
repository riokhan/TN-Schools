"use client";

import React from "react";
import PortalLayout from "@/components/PortalLayout";
import { useParams } from "next/navigation";


export default function HeadmasterPortal() {
  const params = useParams();
  // params.slug is an array if present
  const slugArray = Array.isArray(params?.slug) ? params.slug : [];
  const currentPath = slugArray.length > 0 ? slugArray[0] : "dashboard";

  let content = null;
  let title = "Headmaster Portal";

  switch (currentPath) {
    case "dashboard":
      content = <DashboardView />;
      title = "Headmaster Dashboard";
      break;
    case "students":
      content = <PlaceholderView icon="👨‍🎓" title="Student Monitoring" desc="Track student enrollment, attendance trends, and dropout risks across all classes." />;
      title = "Student Monitoring";
      break;
    case "staff":
      content = <StaffView />;
      title = "Staff Management";
      break;
    case "temporary-staff":
      content = <TemporaryStaffView />;
      title = "Temporary Staff";
      break;
    case "parents":
      content = <ParentsView />;
      title = "Parents & PTA Details";
      break;
    case "alumni":
      content = <AlumniView />;
      title = "Alumni Network";
      break;
    case "attendance":
      content = <PlaceholderView icon="📅" title="School Attendance" desc="Daily attendance analytics for students and staff." />;
      title = "Attendance";
      break;
    case "timetable":
      content = <PlaceholderView icon="🗓️" title="Master Timetable" desc="Manage and view the master class timetable and staff allocations." />;
      title = "Timetable";
      break;
    case "exams":
      content = <PlaceholderView icon="📋" title="Exam Schedule" desc="Upcoming term exams, public exams, and practicals schedule." />;
      title = "Exam Schedule";
      break;
    case "model-exams":
      content = <ModelExamsView />;
      title = "Model Exam Results";
      break;
    case "resources":
      content = <ResourcesView />;
      title = "School Resources";
      break;
    case "midday-meal":
      content = <PlaceholderView icon="🍛" title="Mid-Day Meal Program" desc="Daily food stock, menu tracking, and student meal consumption data." />;
      title = "Mid-Day Meal";
      break;
    case "scholarship":
      content = <PlaceholderView icon="🏅" title="Scholarship Status" desc="Manage applications for state and central government scholarship schemes." />;
      title = "Scholarships";
      break;
    case "gov-schemes":
      content = <GovSchemesView />;
      title = "Government Schemes";
      break;
    case "events":
      content = <EventsView />;
      title = "School Events";
      break;
    case "gallery":
      content = <GalleryView />;
      title = "Media Gallery";
      break;
    case "rewards":
      content = <RewardsView />;
      title = "Rewards & Honors";
      break;
    case "history":
      content = <HistoryView />;
      title = "School History";
      break;
    default:
      content = <PlaceholderView icon="🚧" title={currentPath} desc="This module is currently under development." />;
      title = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);
  }

  return (
    <PortalLayout
      title={title}
      subtitle="Mr. Venkatesh R. · GHS Coimbatore · DISE: 33012345"
      avatarLetter="V"
      avatarColor="#3b82f6"
      themeClass="theme-headmaster"
      accentColor="#3b82f6"
    >
      {content}
    </PortalLayout>
  );
}

// ==========================================
// VIEW COMPONENTS
// ==========================================

function DashboardView() {
  const staffList = [
    { name: "Mrs. Sumathi Devi", subject: "Mathematics", attendance: 96, performance: "Excellent", leave: 1 },
    { name: "Mr. Rajan K.", subject: "Science", attendance: 92, performance: "Good", leave: 0 },
    { name: "Mrs. Kavitha S.", subject: "Tamil", attendance: 98, performance: "Excellent", leave: 0 },
    { name: "Mr. Prakash R.", subject: "Social Science", attendance: 88, performance: "Average", leave: 3 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 fade-in">
        {[
          { label: "Total Enrollment", value: "1,247", icon: "👨‍🎓", color: "text-blue-400", sub: "Classes 6–12" },
          { label: "Today's Attendance", value: "96.2%", icon: "📅", color: "text-emerald-400", sub: "1,199 present" },
          { label: "Teaching Staff", value: "42", icon: "👩‍🏫", color: "text-amber-400", sub: "38 present today" },
          { label: "Dropout Risk", value: "8", icon: "⚠️", color: "text-red-400", sub: "Needs intervention" },
        ].map((kpi) => (
          <div key={kpi.label} className="kpi-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{kpi.icon}</span>
              <span className={`text-xs font-medium ${kpi.color}`}>{kpi.sub}</span>
            </div>
            <div className={`text-3xl font-bold ${kpi.color} mb-1`}>{kpi.value}</div>
            <div className="text-xs text-slate-500">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6 fade-in-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">👩‍🏫 Staff Performance Overview</h2>
            <button className="text-xs text-blue-400 hover:text-blue-300">+ View All</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Subject</th>
                <th>Attendance</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((s) => (
                <tr key={s.name}>
                  <td className="font-medium text-white">{s.name}</td>
                  <td>{s.subject}</td>
                  <td>
                    <span className={`badge ${s.attendance >= 95 ? "badge-green" : s.attendance >= 90 ? "badge-yellow" : "badge-red"}`}>{s.attendance}%</span>
                  </td>
                  <td>
                    <span className={`badge ${s.performance === "Excellent" ? "badge-green" : s.performance === "Good" ? "badge-blue" : "badge-yellow"}`}>{s.performance}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass rounded-2xl p-6 fade-in-3">
          <h2 className="text-base font-semibold text-white mb-4">🏛️ Quick Government Updates</h2>
          <div className="space-y-4">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-blue-500/20">
              <div className="text-xs font-bold text-blue-400 mb-1">Pudhumai Penn Scheme</div>
              <div className="text-sm text-slate-300">Verification deadline extended to 15th July. Please submit all pending bank details.</div>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-emerald-500/20">
              <div className="text-xs font-bold text-emerald-400 mb-1">Illam Thedi Kalvi</div>
              <div className="text-sm text-slate-300">New volunteer mapping required for Zone 3 and 4. Update the district portal.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StaffView() {
  return <PlaceholderView icon="👩‍🏫" title="Staff Management" desc="Full list of teaching and non-teaching staff, payroll info, and leave requests." />;
}

function TemporaryStaffView() {
  const temps = [
    { name: "Mr. Karthick M.", role: "Guest Teacher (Math)", agency: "Direct", joined: "Jan 2026", status: "Active" },
    { name: "Mrs. Revathi P.", role: "Cleaning Staff", agency: "TN Outsourcing Ltd", joined: "Aug 2025", status: "Active" },
    { name: "Mr. Selvam T.", role: "Night Watchman", agency: "Direct", joined: "May 2024", status: "Active" },
    { name: "Ms. Anitha K.", role: "Data Entry Operator", agency: "Govt Scheme Contract", joined: "Feb 2026", status: "Active" },
  ];

  return (
    <div className="space-y-6 fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <div className="text-slate-400 text-sm mb-2">Total Temporary Staff</div>
          <div className="text-3xl font-bold text-blue-400">14</div>
        </div>
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <div className="text-slate-400 text-sm mb-2">Agency Outsourced</div>
          <div className="text-3xl font-bold text-emerald-400">8</div>
        </div>
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <div className="text-slate-400 text-sm mb-2">Pending Contract Renewals</div>
          <div className="text-3xl font-bold text-amber-400">2</div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">Temporary & Contract Staff Directory</h2>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700">Add Staff</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Source/Agency</th>
              <th>Joined</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {temps.map((t, i) => (
              <tr key={i}>
                <td className="font-medium text-white">{t.name}</td>
                <td>{t.role}</td>
                <td>{t.agency}</td>
                <td>{t.joined}</td>
                <td><span className="badge badge-green">{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ParentsView() {
  return (
    <div className="space-y-6 fade-in">
      <div className="glass rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Parents Teachers Association (PTA)</h2>
          <p className="text-sm text-slate-400">Active committee members and recent meeting minutes.</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Next PTA Meeting</div>
          <div className="text-lg font-bold text-amber-400">24th July 2026</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">PTA Core Committee</h3>
          <div className="space-y-4">
            {[
              { name: "Mr. R. Kumar", role: "President (Parent)", phone: "+91 9876543210" },
              { name: "Mrs. N. Lakshmi", role: "Vice President (Parent)", phone: "+91 9876543211" },
              { name: "Mr. Venkatesh R.", role: "Secretary (Headmaster)", phone: "School Office" },
            ].map((p, i) => (
              <div key={i} className="flex justify-between items-center p-3 border border-slate-700/50 rounded-xl bg-slate-800/50">
                <div>
                  <div className="font-medium text-white text-sm">{p.name}</div>
                  <div className="text-xs text-blue-400">{p.role}</div>
                </div>
                <div className="text-xs text-slate-400">{p.phone}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Recent Parental Grievances</h3>
          <div className="space-y-3">
            <div className="p-3 border-l-2 border-amber-500 bg-amber-500/10 rounded-r-xl">
              <div className="text-sm font-medium text-amber-400">Transport facility delays in Zone B</div>
              <div className="text-xs text-slate-400 mt-1">Raised by: 12 parents • Status: Under Review</div>
            </div>
            <div className="p-3 border-l-2 border-emerald-500 bg-emerald-500/10 rounded-r-xl">
              <div className="text-sm font-medium text-emerald-400">Request for extra special classes for 10th</div>
              <div className="text-xs text-slate-400 mt-1">Raised by: PTA Committee • Status: Approved</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlumniView() {
  return (
    <div className="space-y-6 fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">🎓</div>
          <div className="text-2xl font-bold text-white mb-1">1,840</div>
          <div className="text-sm text-slate-400">Registered Alumni</div>
        </div>
        <div className="glass rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">💰</div>
          <div className="text-2xl font-bold text-emerald-400 mb-1">₹12.5 Lakhs</div>
          <div className="text-sm text-slate-400">Donations Received (This Year)</div>
        </div>
        <div className="glass rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">🏗️</div>
          <div className="text-2xl font-bold text-blue-400 mb-1">4</div>
          <div className="text-sm text-slate-400">Projects Funded by Alumni</div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Notable Alumni Contributions</h2>
        <div className="space-y-4">
          {[
            { name: "Dr. S. Ramakrishnan", batch: "1994", contribution: "Donated 20 computers to the new lab", role: "Software Architect, USA" },
            { name: "Mrs. K. Meena", batch: "1988", contribution: "Sponsored yearly scholarships for 5 girls", role: "IAS Officer" },
            { name: "Mr. T. Arul", batch: "2001", contribution: "Built the new RO water purification plant", role: "Local Business Owner" },
          ].map((al, i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl gap-4">
              <div>
                <div className="font-bold text-blue-400 mb-1">{al.name} <span className="text-xs text-slate-500 font-normal ml-2">Batch of {al.batch}</span></div>
                <div className="text-sm text-white">{al.contribution}</div>
              </div>
              <div className="text-sm font-medium text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-lg whitespace-nowrap">
                {al.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ModelExamsView() {
  const results = [
    { class: "12th Standard", subject: "Mathematics", pass: "92%", avg: "78/100", top: "100/100 (2 students)" },
    { class: "12th Standard", subject: "Physics", pass: "89%", avg: "74/100", top: "98/100 (1 student)" },
    { class: "12th Standard", subject: "Chemistry", pass: "94%", avg: "81/100", top: "99/100 (3 students)" },
    { class: "10th Standard", subject: "Science", pass: "96%", avg: "85/100", top: "100/100 (5 students)" },
    { class: "10th Standard", subject: "Social Science", pass: "98%", avg: "88/100", top: "100/100 (8 students)" },
  ];

  return (
    <div className="space-y-6 fade-in">
      <div className="glass rounded-2xl p-6 border-l-4 border-blue-500">
        <h2 className="text-xl font-bold text-white mb-2">Model Exam & Revision Test Analysis</h2>
        <p className="text-slate-400 text-sm">Performance tracking for upcoming State Board Public Examinations. Focus areas identified based on subject averages below 75%.</p>
      </div>

      <div className="glass rounded-2xl p-6">
        <table className="data-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Subject</th>
              <th>Pass %</th>
              <th>Avg Score</th>
              <th>Top Score</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td className="font-medium text-white">{r.class}</td>
                <td>{r.subject}</td>
                <td>
                  <span className={`badge ${parseInt(r.pass) >= 90 ? "badge-green" : "badge-yellow"}`}>{r.pass}</span>
                </td>
                <td>{r.avg}</td>
                <td className="text-blue-400 text-sm">{r.top}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GovSchemesView() {
  const schemes = [
    { name: "Pudhumai Penn Scheme", desc: "₹1000/month for girl students pursuing higher education.", eligible: 145, registered: 142, status: "Active" },
    { name: "Tamil Puthalvan Scheme", desc: "₹1000/month for boy students progressing to higher ed.", eligible: 110, registered: 98, status: "Action Needed" },
    { name: "Free Bicycle Scheme", desc: "Free bicycles for 11th standard students.", eligible: 240, registered: 240, status: "Completed" },
    { name: "Chief Minister's Breakfast", desc: "Nutritious breakfast for primary students.", eligible: 450, registered: 450, status: "Daily Monitoring" },
  ];

  return (
    <div className="space-y-6 fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schemes.map((sc, i) => (
          <div key={i} className="glass rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{sc.name}</h3>
                <p className="text-xs text-slate-400">{sc.desc}</p>
              </div>
              <span className={`badge ${sc.status === "Completed" ? "badge-green" : sc.status === "Action Needed" ? "badge-red" : "badge-blue"}`}>
                {sc.status}
              </span>
            </div>

            <div className="mt-4 bg-slate-900/50 rounded-xl p-3 flex justify-around">
              <div className="text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Eligible</div>
                <div className="text-xl font-bold text-white">{sc.eligible}</div>
              </div>
              <div className="w-px bg-slate-700"></div>
              <div className="text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Registered</div>
                <div className="text-xl font-bold text-emerald-400">{sc.registered}</div>
              </div>
              <div className="w-px bg-slate-700"></div>
              <div className="text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Coverage</div>
                <div className="text-xl font-bold text-blue-400">{Math.round((sc.registered / sc.eligible) * 100)}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventsView() {
  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center glass rounded-2xl p-4">
        <h2 className="text-white font-bold">Upcoming School Events</h2>
        <button className="text-xs bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">+ New Event</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-5 border-t-4 border-amber-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-3xl opacity-20">🏃</div>
          <div className="text-amber-400 font-bold text-xs mb-2">SPORTS</div>
          <h3 className="text-white font-semibold text-lg mb-1">Annual Sports Meet</h3>
          <div className="text-slate-400 text-sm mb-4">Inter-house athletic competitions and prize distribution.</div>
          <div className="text-xs text-slate-300 font-medium bg-slate-800/50 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg">
            <span>📅</span> 14th August, 2026
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border-t-4 border-emerald-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-3xl opacity-20">🔬</div>
          <div className="text-emerald-400 font-bold text-xs mb-2">ACADEMICS</div>
          <h3 className="text-white font-semibold text-lg mb-1">District Science Exhibition</h3>
          <div className="text-slate-400 text-sm mb-4">Showcasing student projects on renewable energy.</div>
          <div className="text-xs text-slate-300 font-medium bg-slate-800/50 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg">
            <span>📅</span> 28th September, 2026
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border-t-4 border-purple-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-3xl opacity-20">🎭</div>
          <div className="text-purple-400 font-bold text-xs mb-2">CULTURAL</div>
          <h3 className="text-white font-semibold text-lg mb-1">Pongal Celebration</h3>
          <div className="text-slate-400 text-sm mb-4">Traditional dances, rangoli competitions, and sweet pongal.</div>
          <div className="text-xs text-slate-300 font-medium bg-slate-800/50 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg">
            <span>📅</span> 13th January, 2027
          </div>
        </div>
      </div>
    </div>
  );
}

function GalleryView() {
  return (
    <div className="space-y-6 fade-in">
      <div className="glass rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white font-bold text-lg">School Media Gallery</h2>
          <div className="flex gap-2">
            <span className="badge badge-blue">All</span>
            <span className="badge badge-gray cursor-pointer">Sports</span>
            <span className="badge badge-gray cursor-pointer">Academics</span>
            <span className="badge badge-gray cursor-pointer">Infrastructure</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-square rounded-xl bg-slate-800 border border-slate-700/50 overflow-hidden relative group">
              {/* Placeholder for actual image */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-slate-700 text-4xl">
                🖼️
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">View Image</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RewardsView() {
  return (
    <div className="space-y-6 fade-in">
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Recent Honors & Recognitions</h2>

        <div className="space-y-4">
          <div className="flex gap-4 items-start p-4 bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30 rounded-xl">
            <div className="text-4xl">🏆</div>
            <div>
              <h3 className="text-lg font-bold text-amber-400">Best Performing School (District Level)</h3>
              <p className="text-slate-300 text-sm mt-1">Awarded by District Collector for achieving 100% pass rate in Class 10 public exams for 3 consecutive years.</p>
              <div className="text-xs text-slate-500 mt-2">Awarded on: 15th August 2025</div>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/30 rounded-xl">
            <div className="text-4xl">🏅</div>
            <div>
              <h3 className="text-lg font-bold text-emerald-400">State Level Science Olympiad - Gold Medal</h3>
              <p className="text-slate-300 text-sm mt-1">Won by M. Karthik (Class 11) for his project on &quot;Low-cost Water Filtration for Rural Homes&quot;.</p>
              <div className="text-xs text-slate-500 mt-2">Awarded on: 12th February 2026</div>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/30 rounded-xl">
            <div className="text-4xl">🌟</div>
            <div>
              <h3 className="text-lg font-bold text-blue-400">Dr. Radhakrishnan State Teacher Award</h3>
              <p className="text-slate-300 text-sm mt-1">Awarded to Mrs. Kavitha S. (Tamil Teacher) for her outstanding contribution to literature education.</p>
              <div className="text-xs text-slate-500 mt-2">Awarded on: 5th September 2025</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryView() {
  return (
    <div className="space-y-6 fade-in">
      <div className="glass rounded-2xl p-8 text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 text-9xl opacity-5">🏛️</div>
        <h1 className="text-3xl font-bold text-white mb-2">Government High School, Coimbatore</h1>
        <p className="text-blue-400 font-medium mb-4">Established 1955</p>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
          Our school has a rich legacy of empowering rural and semi-urban students through quality education. Over the past six decades, we have evolved from a primary learning center to a highly equipped high school that stands as a beacon of knowledge in the district.
        </p>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-white font-bold text-lg mb-6">Historical Milestones</h2>
        <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-purple-500 before:to-transparent">

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
              <span className="text-xs font-bold">55</span>
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-4 rounded-xl">
              <div className="text-blue-400 font-bold mb-1">1955</div>
              <div className="text-white font-medium text-sm">School Founded</div>
              <div className="text-xs text-slate-400 mt-1">Started as a primary school with 40 students and 2 teachers.</div>
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-purple-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
              <span className="text-xs font-bold">82</span>
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-4 rounded-xl">
              <div className="text-purple-400 font-bold mb-1">1982</div>
              <div className="text-white font-medium text-sm">Upgraded to Middle School</div>
              <div className="text-xs text-slate-400 mt-1">New block constructed and classes extended up to 8th standard.</div>
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-emerald-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
              <span className="text-xs font-bold">04</span>
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-4 rounded-xl">
              <div className="text-emerald-400 font-bold mb-1">2004</div>
              <div className="text-white font-medium text-sm">High School Status & First Lab</div>
              <div className="text-xs text-slate-400 mt-1">Recognized as a High School. The first science laboratory was inaugurated.</div>
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-amber-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
              <span className="text-xs font-bold">25</span>
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-4 rounded-xl">
              <div className="text-amber-400 font-bold mb-1">2025</div>
              <div className="text-white font-medium text-sm">Digital Transformation</div>
              <div className="text-xs text-slate-400 mt-1">Integrated into the TN AI Smart Learning Ecosystem. Hi-Tech labs operationalized.</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ResourcesView() {
  return (
    <div className="space-y-6 fade-in">
      <div className="glass rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">🏗️ School Infrastructure & Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Smart Classrooms", value: "8/12 Functional", icon: "🖥️", status: "good", desc: "Interactive panels and projectors." },
            { label: "Hi-Tech Computer Lab", value: "48 Systems", icon: "💻", status: "good", desc: "With high-speed internet & power backup." },
            { label: "Library Resources", value: "4,200 Books", icon: "📚", status: "good", desc: "Includes new digital e-book terminals." },
            { label: "Science Laboratories", value: "Fully Equipped", icon: "🧪", status: "good", desc: "Physics, Chemistry, and Bio labs." },
            { label: "Sports Equipment", value: "Needs Repair", icon: "⚽", status: "warn", desc: "Football nets and cricket kits need replacement." },
            { label: "Sanitation Blocks", value: "4/4 Functional", icon: "🚻", status: "good", desc: "Cleaned daily by contract staff." },
          ].map((res) => (
            <div key={res.label} className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-start gap-4">
              <div className="text-3xl">{res.icon}</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-bold text-sm">{res.label}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${res.status === 'good' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {res.value}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{res.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Generic Placeholder for unimplemented views
function PlaceholderView({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="glass rounded-2xl p-12 text-center fade-in flex flex-col items-center justify-center min-h-[400px]">
      <div className="text-6xl mb-4">{icon}</div>
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-slate-400 max-w-md">{desc}</p>
      <div className="mt-8 px-4 py-2 bg-slate-800 rounded-lg text-xs text-slate-500 border border-slate-700">
        Module Status: Under Active Development
      </div>
    </div>
  );
}
