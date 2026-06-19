"use client";
import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";

interface Scheme {
  id: string;
  name: string;
  benefits: string;
  incomeLimit: number;
  minMarks: number;
  description: string;
  deadline: string;
}

const scholarshipSchemes: Scheme[] = [
  {
    id: "sch-01",
    name: "National Means-cum-Merit Scholarship (NMMS)",
    benefits: "₹12,000 per year (₹1,000 per month) from Class 9 to 12",
    incomeLimit: 350000,
    minMarks: 55,
    description: "Centrally sponsored scheme for meritorious students of government and government-aided schools to arrest dropout rates at Class 8.",
    deadline: "2025-06-30"
  },
  {
    id: "sch-02",
    name: "Tamil Nadu Rural Students Talent Search Scheme (TRUSTS)",
    benefits: "₹1,000 per year for 4 years (Class 9 to 12)",
    incomeLimit: 250000,
    minMarks: 50,
    description: "State-wide scholarship scheme selecting rural school students based on a competitive examination conducted in September.",
    deadline: "2025-08-15"
  },
  {
    id: "sch-03",
    name: "Pre-Matric Scholarship for SC/ST/Minority Students",
    benefits: "Tuition and maintenance fees reimbursement (up to ₹5,000/year)",
    incomeLimit: 250000,
    minMarks: 40,
    description: "Financial assistance to parents of school-going children belonging to scheduled castes, tribes, or minority groups to support pre-matriculation education.",
    deadline: "2025-07-20"
  }
];

export default function ScholarshipPage() {
  // Eligibility Checker States
  const [annualIncome, setAnnualIncome] = useState<number>(180000);
  const [marksPercentage, setMarksPercentage] = useState<number>(78);
  const [category, setCategory] = useState<string>("MBC");
  const [checkedResults, setCheckedResults] = useState<Scheme[] | null>(null);

  // File Upload Checklist State
  const [uploads, setUploads] = useState<Record<string, { uploaded: boolean; date?: string }>>({
    income: { uploaded: true, date: "2025-06-12" },
    caste: { uploaded: true, date: "2025-06-12" },
    marksheet: { uploaded: true, date: "2025-06-14" },
    bank: { uploaded: false }
  });

  const handleVerifyEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    const eligible = scholarshipSchemes.filter(
      (scheme) => annualIncome <= scheme.incomeLimit && marksPercentage >= scheme.minMarks
    );
    setCheckedResults(eligible);
  };

  const handleFileUpload = (docType: string) => {
    setUploads((prev) => ({
      ...prev,
      [docType]: {
        uploaded: true,
        date: new Date().toISOString().split("T")[0]
      }
    }));
  };

  return (
    <PortalLayout
      title="Scholarship Management"
      subtitle="View scheme details, check eligibility, and track Priya&apos;s scholarship applications"
    >
      {/* TODO: Connect backend APIs to fetch EMIS database eligibility and upload files to Cloud Storage */}

      {/* Application Tracker */}
      <div className="glass rounded-2xl p-6 mb-6 fade-in">
        <h2 className="text-base font-semibold text-white mb-2">📡 Active Application Status: NMMS (Class 9)</h2>
        <p className="text-xs text-slate-500 mb-6">Current progress tracking of application submission #NMMS-9B-2025-0043</p>
        
        {/* Progress Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            { step: "1", title: "Form Submitted", status: "completed", date: "June 14, 2025" },
            { step: "2", title: "Income Certificate Verified", status: "completed", date: "June 16, 2025" },
            { step: "3", title: "School HM Approved", status: "completed", date: "June 18, 2025" },
            { step: "4", title: "District Review", status: "in-progress", date: "Estimated: June 25" },
            { step: "5", title: "Fund Disbursal", status: "pending", date: "Pending" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold mb-3 border z-10 transition-all ${
                  item.status === "completed"
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                    : item.status === "in-progress"
                    ? "bg-blue-500/20 border-blue-500 text-blue-400 animate-pulse"
                    : "bg-slate-900 border-slate-700 text-slate-500"
                }`}
              >
                {item.status === "completed" ? "✓" : item.step}
              </div>
              <h4 className="text-xs font-semibold text-white mb-1.5">{item.title}</h4>
              <span className="text-[10px] text-slate-500">{item.date}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Available Schemes */}
        <div className="lg:col-span-2 space-y-4 fade-in-2">
          <h2 className="text-base font-semibold text-white mb-2">🎓 Available Schemes</h2>
          {scholarshipSchemes.map((scheme) => (
            <div key={scheme.id} className="glass rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-emerald-500/30 transition-colors">
              <div>
                <div className="flex justify-between items-start gap-3 mb-2">
                  <h3 className="text-sm font-semibold text-white">{scheme.name}</h3>
                  <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                    Due: {scheme.deadline}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">{scheme.description}</p>
              </div>

              <div className="flex flex-wrap gap-4 text-[10px] border-t border-slate-850 pt-3">
                <div>
                  <span className="text-slate-500">Stipend Benefits:</span> <strong className="text-emerald-400">{scheme.benefits}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Income Ceiling:</span> <strong className="text-slate-350">₹{scheme.incomeLimit.toLocaleString()}/year</strong>
                </div>
                <div>
                  <span className="text-slate-500">Min Academics:</span> <strong className="text-slate-350">{scheme.minMarks}%</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Eligibility Checker */}
        <div className="glass rounded-2xl p-6 fade-in-3">
          <h2 className="text-base font-semibold text-white mb-1">⚖️ Eligibility Check</h2>
          <p className="text-xs text-slate-500 mb-4">Evaluate which scholarships match your financial and academic status</p>

          <form onSubmit={handleVerifyEligibility} className="space-y-4">
            <div>
              <label htmlFor="chk-income" className="block text-xs font-semibold text-slate-400 mb-1.5">Annual Family Income (₹)</label>
              <input
                id="chk-income"
                type="number"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="chk-marks" className="block text-xs font-semibold text-slate-400 mb-1.5">Prior Academic Score (%)</label>
              <input
                id="chk-marks"
                type="number"
                value={marksPercentage}
                onChange={(e) => setMarksPercentage(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="chk-cat" className="block text-xs font-semibold text-slate-400 mb-1.5">Community Category</label>
              <select
                id="chk-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="General">General Category</option>
                <option value="BC">BC (Backward Classes)</option>
                <option value="MBC">MBC (Most Backward Classes)</option>
                <option value="SC">SC (Scheduled Castes)</option>
                <option value="ST">ST (Scheduled Tribes)</option>
              </select>
            </div>

            <button
              id="chk-verify-btn"
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-semibold transition-all"
            >
              Verify Eligibility
            </button>
          </form>

          {checkedResults !== null && (
            <div className="mt-5 border-t border-slate-800 pt-4" id="eligibility-results">
              <h4 className="text-xs font-semibold text-white mb-2">Eligible Schemes:</h4>
              {checkedResults.length > 0 ? (
                <ul className="space-y-2">
                  {checkedResults.map((sch) => (
                    <li key={sch.id} className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-2 rounded-lg flex items-center justify-between">
                      <span>{sch.name}</span>
                      <span className="text-[10px] font-bold text-emerald-400">Apply →</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-red-400">No schemes match these parameters. Try adjusting your numbers.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Document Checklist */}
      <div className="glass rounded-2xl p-6 fade-in-4">
        <h2 className="text-base font-semibold text-white mb-1">📁 Document Checklist</h2>
        <p className="text-xs text-slate-500 mb-4">Required uploads to verify eligibility status under the portal</p>
        
        <div className="space-y-3">
          {[
            { id: "income", label: "Annual Income Certificate", desc: "Issued by Tahsildar (valid within 6 months)" },
            { id: "caste", label: "Community Certificate", desc: "Issued by competent state revenue authority" },
            { id: "marksheet", label: "Class 8 / 9 Academic Marksheet", desc: "Signed copy by class tutor/HM" },
            { id: "bank", label: "Student Bank Account Passbook", desc: "First page showing Account Number, Name, and IFSC code" }
          ].map((doc) => {
            const hasUploaded = uploads[doc.id]?.uploaded;
            return (
              <div key={doc.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900/60 rounded-xl p-3 border border-slate-800">
                <div>
                  <h4 className="text-xs font-semibold text-white">{doc.label}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{doc.desc}</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {hasUploaded ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                      <span>✓ Verified</span>
                      <span className="text-[10px] text-slate-550">({uploads[doc.id]?.date})</span>
                    </div>
                  ) : (
                    <button
                      id={`upload-btn-${doc.id}`}
                      onClick={() => handleFileUpload(doc.id)}
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-[10px] rounded-lg transition-colors cursor-pointer"
                    >
                      Upload File
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PortalLayout>
  );
}
