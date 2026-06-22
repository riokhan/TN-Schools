// "use client";

// import PortalLayout from "@/components/PortalLayout";
// import Link from "next/link";

// const welfareBenefits = [
//   { title: "Free Noon Meal Scheme", icon: "🍱", description: "Nutritious hot meals provided daily at school to keep you energized.", status: "Active" },
//   { title: "Free Uniforms & Footwear", icon: "👕", description: "Sets of school uniforms and comfortable shoes provided annually.", status: "Received" },
//   { title: "Free Textbooks & Notebooks", icon: "📚", description: "Complete sets of textbooks and notebooks for the academic year.", status: "Received" },
//   { title: "Free Bus Pass", icon: "🚌", description: "Travel freely between your home and school on state transport buses.", status: "Active" },
//   { title: "Free Bicycles", icon: "🚲", description: "Provided to class 11 students to help commute easily.", status: "Upcoming in Class 11" },
// ];

// export default function MiddleSchoolWelfarePage() {
//   return (
//     <PortalLayout
//       title="Student Welfare & Benefits"
//       subtitle="Learn about all the amazing benefits provided to you by the Tamil Nadu Government!"
//       avatarLetter="A"
//       avatarColor="#10b981"
//       themeClass="theme-student"
//       accentColor="#10b981"
//     >
//       <div className="mb-6">
//         <Link href="/student/middle-school" className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors w-fit">
//           <span>←</span> Back to Dashboard
//         </Link>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* Left Column: Hero Graphic */}
//         <div className="lg:col-span-1 space-y-6">
//            <div className="glass rounded-3xl p-6 border border-emerald-500/30 bg-gradient-to-br from-emerald-900/20 to-teal-900/20 text-center relative overflow-hidden h-full flex flex-col justify-center">
//               <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full"></div>
              
//               <div className="text-8xl mb-6 relative z-10 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">🎁</div>
//               <h2 className="text-2xl font-black text-white mb-4 relative z-10">You are supported!</h2>
//               <p className="text-sm text-slate-300 leading-relaxed relative z-10">
//                 The government provides these welfare schemes to ensure that you have everything you need to focus on what's most important—your education and growth!
//               </p>
//            </div>
//         </div>

//         {/* Right Column: Benefits List */}
//         <div className="lg:col-span-2">
//            <div className="glass rounded-3xl p-6 border border-slate-700/50">
//               <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
//                 <span className="text-2xl">🌟</span> Your School Benefits
//               </h2>
              
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                  {welfareBenefits.map((benefit, idx) => (
//                    <div key={idx} className="bg-slate-900/60 p-5 rounded-2xl border border-slate-700/50 hover:border-emerald-500/50 transition-colors group cursor-default">
//                       <div className="flex items-start justify-between mb-3">
//                          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
//                             {benefit.icon}
//                          </div>
//                          <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded border 
//                            ${benefit.status === 'Active' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 
//                              benefit.status === 'Received' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' : 
//                              'text-amber-400 border-amber-500/30 bg-amber-500/10'}`}>
//                            {benefit.status}
//                          </span>
//                       </div>
//                       <h3 className="font-bold text-white mb-2">{benefit.title}</h3>
//                       <p className="text-xs text-slate-400 leading-relaxed">{benefit.description}</p>
//                    </div>
//                  ))}
//               </div>
              
//               <div className="mt-6 bg-slate-900/40 border border-slate-800 p-4 rounded-xl text-center">
//                  <p className="text-xs text-slate-500">
//                    If you have any questions about these benefits or have not received them, please contact your class teacher.
//                  </p>
//               </div>

//            </div>
//         </div>

//       </div>
//     </PortalLayout>
//   );
// }


"use client";

import PortalLayout from "@/components/PortalLayout";
import Link from "next/link";

const welfareBenefits = [
  { title: "Free Noon Meal Scheme", icon: "🍱", description: "Nutritious hot meals provided daily at school to keep you energized.", status: "Active" },
  { title: "Free Uniforms & Footwear", icon: "👕", description: "Sets of school uniforms and comfortable shoes provided annually.", status: "Received" },
  { title: "Free Textbooks & Notebooks", icon: "📚", description: "Complete sets of textbooks and notebooks for the academic year.", status: "Received" },
  { title: "Free Bus Pass", icon: "🚌", description: "Travel freely between your home and school on state transport buses.", status: "Active" },
  { title: "Free Bicycles", icon: "🚲", description: "Provided to class 11 students to help commute easily.", status: "Upcoming in Class 11" },
];

export default function MiddleSchoolWelfarePage() {
  return (
    <PortalLayout
      title="Student Welfare & Benefits"
      subtitle="Learn about all the amazing benefits provided to you by the Tamil Nadu Government!"
      avatarLetter="A"
      avatarColor="#10b981"
      themeClass="theme-student"
      accentColor="#10b981"
    >
      <div className="mb-6">
        <Link href="/student/middle-school" className="text-sm font-bold text-black dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-2 transition-colors w-fit">
          <span>←</span> Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Hero Graphic */}
        <div className="lg:col-span-1 space-y-6">
           <div className="glass rounded-3xl p-6 border border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 text-center relative overflow-hidden h-full flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full"></div>
              
              <div className="text-8xl mb-6 relative z-10 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">🎁</div>
              <h2 className="text-2xl font-black text-black dark:text-white mb-4 relative z-10">You are supported!</h2>
              <p className="text-sm text-black dark:text-white leading-relaxed relative z-10">
                The government provides these welfare schemes to ensure that you have everything you need to focus on what's most important—your education and growth!
              </p>
           </div>
        </div>

        {/* Right Column: Benefits List */}
        <div className="lg:col-span-2">
           <div className="glass rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-transparent">
              <h2 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">🌟</span> Your School Benefits
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {welfareBenefits.map((benefit, idx) => (
                   <div key={idx} className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 hover:border-emerald-500/50 transition-colors group cursor-default">
                      <div className="flex items-start justify-between mb-3">
                         <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                            {benefit.icon}
                         </div>
                         <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded border 
                           ${benefit.status === 'Active' ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 
                             benefit.status === 'Received' ? 'text-blue-600 dark:text-blue-400 border-blue-500/30 bg-blue-500/10' : 
                             'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10'}`}>
                           {benefit.status}
                         </span>
                      </div>
                      <h3 className="font-bold text-black dark:text-white mb-2">{benefit.title}</h3>
                      <p className="text-xs text-black dark:text-white leading-relaxed">{benefit.description}</p>
                   </div>
                 ))}
              </div>
              
              <div className="mt-6 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-4 rounded-xl text-center">
                 <p className="text-xs text-black dark:text-white">
                   If you have any questions about these benefits or have not received them, please contact your class teacher.
                 </p>
              </div>

           </div>
        </div>

      </div>
    </PortalLayout>
  );
}