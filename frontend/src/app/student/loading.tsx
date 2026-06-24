import React from 'react';

export default function StudentLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-200/50 dark:border-indigo-900/50"></div>
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" style={{ animationDuration: '1s' }}></div>
        <div className="absolute inset-2 rounded-full border-4 border-emerald-500 border-b-transparent animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
        <div className="text-5xl animate-bounce">🎓</div>
      </div>
      
      <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-widest uppercase mb-2">
        Logging In<span className="animate-pulse">...</span>
      </h2>
      <p className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        Preparing your personalized dashboard
      </p>
    </div>
  );
}
