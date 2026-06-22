// "use client";

// import PortalLayout from "@/components/PortalLayout";
// import Link from "next/link";
// import { useState } from "react";

// const books = [
//   { id: 1, title: "The Cosmic Journey", author: "Dr. APJ Abdul Kalam", genre: "Science", progress: 85, cover: "🚀", color: "from-blue-600 to-indigo-600", language: "Bilingual" },
//   { id: 2, title: "Tales of the Cholas", author: "History Dept", genre: "History", progress: 0, cover: "👑", color: "from-amber-500 to-orange-600", language: "Tamil" },
//   { id: 3, title: "Mystery of the Banyan Tree", author: "R. K. Narayan", genre: "Fiction", progress: 40, cover: "🌳", color: "from-emerald-500 to-teal-600", language: "English" },
//   { id: 4, title: "Everyday Magic (Science)", author: "Science Society", genre: "Science", progress: 100, cover: "✨", color: "from-purple-500 to-fuchsia-600", language: "Bilingual" },
// ];

// export default function StoryBooksPage() {
//   const [filter, setFilter] = useState("All");

//   return (
//     <PortalLayout
//       title="Interactive Digital Library"
//       subtitle="Read, listen, and explore magical worlds. Earn XP for every chapter you complete!"
//       avatarLetter="A"
//       avatarColor="#10b981"
//       themeClass="theme-student"
//       accentColor="#10b981"
//     >
//       <div className="mb-6 flex items-center justify-between">
//          <Link href="/student/middle-school" className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
//             <span>←</span> Back to Dashboard
//          </Link>
         
//          <div className="bg-slate-900/80 border border-emerald-500/30 px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg shadow-emerald-500/10">
//             <span className="text-2xl">📚</span>
//             <div>
//                <span className="block text-[10px] uppercase font-bold text-emerald-500 leading-none">Reading Level</span>
//                <span className="block text-lg font-black text-white leading-none mt-1">Avid Reader (Lvl 4)</span>
//             </div>
//          </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
//         {/* Left Column: Categories & Stats */}
//         <div className="lg:col-span-1 space-y-6">
           
//            <div className="glass rounded-3xl p-6 border border-slate-700/50">
//               <h3 className="font-bold text-white mb-4">Genres</h3>
//               <div className="space-y-2">
//                  {["All", "Fiction", "History", "Science", "Folklore"].map((cat) => (
//                    <button 
//                      key={cat}
//                      onClick={() => setFilter(cat)}
//                      className={`w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
//                        filter === cat 
//                          ? "bg-slate-800 text-white border border-slate-600" 
//                          : "text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent"
//                      }`}
//                    >
//                      {cat}
//                    </button>
//                  ))}
//               </div>
//            </div>

//            <div className="glass rounded-3xl p-6 border border-slate-700/50">
//               <h3 className="font-bold text-white mb-4">My Reading Stats</h3>
//               <div className="space-y-4">
//                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700">
//                     <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Books Finished</span>
//                     <span className="block text-2xl font-black text-emerald-400 mt-1">12</span>
//                  </div>
//                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700">
//                     <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Words Read</span>
//                     <span className="block text-2xl font-black text-amber-400 mt-1">45,200</span>
//                  </div>
//               </div>
//            </div>

//            {/* Audio Books Callout */}
//            <div className="glass rounded-3xl p-6 border border-indigo-500/30 bg-gradient-to-b from-indigo-900/20 to-transparent">
//               <div className="text-3xl mb-3">🎧</div>
//               <h3 className="font-bold text-white mb-2">Listen & Learn</h3>
//               <p className="text-xs text-slate-400 mb-4 leading-relaxed">
//                 Tired of reading? Switch to "Read Aloud" mode! Our AI tutor will read the story to you in perfect English or Tamil.
//               </p>
//            </div>

//         </div>

//         {/* Right Column: Book Shelf */}
//         <div className="lg:col-span-3">
//            <div className="glass rounded-3xl p-6 border border-slate-700/50 min-h-[600px]">
              
//               <div className="flex items-center justify-between mb-8">
//                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
//                    <span className="text-2xl">📖</span> Currently Reading
//                  </h2>
//                  <div className="flex items-center gap-2">
//                     <input 
//                       type="text" 
//                       placeholder="Search books..." 
//                       className="bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
//                     />
//                  </div>
//               </div>

//               {/* Books Grid */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
//                  {books.map((book) => (
//                    <div key={book.id} className="bg-slate-900/40 p-4 rounded-2xl border border-slate-700/50 hover:-translate-y-1 hover:border-emerald-500/50 transition-all group flex flex-col h-full cursor-pointer">
                      
//                       {/* Book Cover Graphic */}
//                       <div className={`w-full aspect-[3/4] rounded-xl bg-gradient-to-br ${book.color} flex items-center justify-center text-7xl shadow-lg mb-4 relative overflow-hidden`}>
//                          <div className="absolute inset-0 bg-black/10"></div>
//                          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 blur-xl rounded-full"></div>
//                          <div className="relative z-10 group-hover:scale-110 transition-transform">{book.cover}</div>
                         
//                          {book.progress === 100 && (
//                            <div className="absolute top-2 right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm border-2 border-white shadow-lg">
//                              ✓
//                            </div>
//                          )}
//                       </div>

//                       <div className="flex-1 flex flex-col">
//                          <div className="flex justify-between items-start mb-1">
//                             <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{book.genre}</span>
//                             <span className="text-[10px] font-bold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded">{book.language}</span>
//                          </div>
//                          <h3 className="font-bold text-white text-lg mt-2 leading-tight">{book.title}</h3>
//                          <p className="text-xs text-slate-500 mt-1 mb-4">By {book.author}</p>
                         
//                          <div className="mt-auto">
//                             <div className="flex justify-between items-end mb-1">
//                                <span className="text-[10px] font-bold text-slate-400">
//                                  {book.progress === 0 ? "Not Started" : book.progress === 100 ? "Completed" : "In Progress"}
//                                </span>
//                                {book.progress > 0 && <span className="text-[10px] text-emerald-400 font-black">{book.progress}%</span>}
//                             </div>
                            
//                             <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
//                                <div 
//                                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" 
//                                  style={{ width: `${book.progress}%` }}
//                                ></div>
//                             </div>
//                          </div>
//                       </div>
//                    </div>
//                  ))}
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
import { useState } from "react";

const books = [
  { id: 1, title: "The Cosmic Journey", author: "Dr. APJ Abdul Kalam", genre: "Science", progress: 85, cover: "🚀", color: "from-blue-600 to-indigo-600", language: "Bilingual" },
  { id: 2, title: "Tales of the Cholas", author: "History Dept", genre: "History", progress: 0, cover: "👑", color: "from-amber-500 to-orange-600", language: "Tamil" },
  { id: 3, title: "Mystery of the Banyan Tree", author: "R. K. Narayan", genre: "Fiction", progress: 40, cover: "🌳", color: "from-emerald-500 to-teal-600", language: "English" },
  { id: 4, title: "Everyday Magic (Science)", author: "Science Society", genre: "Science", progress: 100, cover: "✨", color: "from-purple-500 to-fuchsia-600", language: "Bilingual" },
];

export default function StoryBooksPage() {
  const [filter, setFilter] = useState("All");

  return (
    <PortalLayout
      title="Interactive Digital Library"
      subtitle="Read, listen, and explore magical worlds. Earn XP for every chapter you complete!"
      avatarLetter="A"
      avatarColor="#10b981"
      themeClass="theme-student"
      accentColor="#10b981"
    >
      <div className="mb-6 flex items-center justify-between">
         <Link href="/student/middle-school" className="text-sm font-bold text-black dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-2 transition-colors">
            <span>←</span> Back to Dashboard
         </Link>
         
         <div className="bg-white dark:bg-slate-900/80 border border-emerald-500/30 px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg shadow-emerald-500/10">
            <span className="text-2xl">📚</span>
            <div>
               <span className="block text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-500 leading-none">Reading Level</span>
               <span className="block text-lg font-black text-black dark:text-white leading-none mt-1">Avid Reader (Lvl 4)</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Categories & Stats */}
        <div className="lg:col-span-1 space-y-6">
           
           <div className="glass rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-transparent">
              <h3 className="font-bold text-black dark:text-white mb-4">Genres</h3>
              <div className="space-y-2">
                 {["All", "Fiction", "History", "Science", "Folklore"].map((cat) => (
                   <button 
                     key={cat}
                     onClick={() => setFilter(cat)}
                     className={`w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                       filter === cat 
                         ? "bg-slate-100 dark:bg-slate-800 text-black dark:text-white border border-slate-300 dark:border-slate-600" 
                         : "text-black dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-emerald-600 dark:hover:text-emerald-400 border border-transparent"
                     }`}
                   >
                     {cat}
                   </button>
                 ))}
              </div>
           </div>

           <div className="glass rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-transparent">
              <h3 className="font-bold text-black dark:text-white mb-4">My Reading Stats</h3>
              <div className="space-y-4">
                 <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-black dark:text-white uppercase font-bold tracking-wider">Books Finished</span>
                    <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">12</span>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-black dark:text-white uppercase font-bold tracking-wider">Total Words Read</span>
                    <span className="block text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">45,200</span>
                 </div>
              </div>
           </div>

           {/* Audio Books Callout */}
           <div className="glass rounded-3xl p-6 border border-indigo-500/30 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-900/20 dark:to-transparent">
              <div className="text-3xl mb-3">🎧</div>
              <h3 className="font-bold text-black dark:text-white mb-2">Listen & Learn</h3>
              <p className="text-xs text-black dark:text-white mb-4 leading-relaxed">
                Tired of reading? Switch to "Read Aloud" mode! Our AI tutor will read the story to you in perfect English or Tamil.
              </p>
           </div>

        </div>

        {/* Right Column: Book Shelf */}
        <div className="lg:col-span-3">
           <div className="glass rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 min-h-[600px] bg-white dark:bg-transparent">
              
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                   <span className="text-2xl">📖</span> Currently Reading
                 </h2>
                 <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder="Search books..." 
                      className="bg-white dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-black dark:text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                 </div>
              </div>

              {/* Books Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                 {books.map((book) => (
                   <div key={book.id} className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50 hover:-translate-y-1 hover:border-emerald-500/50 transition-all group flex flex-col h-full cursor-pointer">
                      
                      {/* Book Cover Graphic */}
                      <div className={`w-full aspect-[3/4] rounded-xl bg-gradient-to-br ${book.color} flex items-center justify-center text-7xl shadow-lg mb-4 relative overflow-hidden`}>
                         <div className="absolute inset-0 bg-black/10"></div>
                         <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 blur-xl rounded-full"></div>
                         <div className="relative z-10 group-hover:scale-110 transition-transform">{book.cover}</div>
                         
                         {book.progress === 100 && (
                           <div className="absolute top-2 right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm border-2 border-white shadow-lg">
                             ✓
                           </div>
                         )}
                      </div>

                      <div className="flex-1 flex flex-col">
                         <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] uppercase font-black tracking-widest text-black dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{book.genre}</span>
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded">{book.language}</span>
                         </div>
                         <h3 className="font-bold text-black dark:text-white text-lg mt-2 leading-tight">{book.title}</h3>
                         <p className="text-xs text-black dark:text-white mt-1 mb-4">By {book.author}</p>
                         
                         <div className="mt-auto">
                            <div className="flex justify-between items-end mb-1">
                               <span className="text-[10px] font-bold text-black dark:text-white">
                                 {book.progress === 0 ? "Not Started" : book.progress === 100 ? "Completed" : "In Progress"}
                               </span>
                               {book.progress > 0 && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black">{book.progress}%</span>}
                            </div>
                            
                            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                               <div 
                                 className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" 
                                 style={{ width: `${book.progress}%` }}
                               ></div>
                            </div>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>

           </div>
        </div>

      </div>
    </PortalLayout>
  );
}
