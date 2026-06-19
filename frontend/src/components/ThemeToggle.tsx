"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-full transition-colors"
        aria-label="Toggle theme"
        style={{ width: 36, height: 36 }}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      id="theme-toggle-btn"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative p-2 rounded-full transition-all duration-300 hover:bg-[var(--sidebar-item-hover-bg)] group"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light Mode" : "Dark Mode"}
    >
      {/* Sun Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`absolute top-1/2 left-1/2 transition-all duration-500 ease-in-out text-amber-500
          ${isDark
            ? "-translate-x-1/2 -translate-y-1/2 rotate-0 scale-100 opacity-100"
            : "-translate-x-1/2 -translate-y-1/2 rotate-90 scale-0 opacity-0"
          }`}
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>

      {/* Moon Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`absolute top-1/2 left-1/2 transition-all duration-500 ease-in-out text-indigo-500
          ${isDark
            ? "-translate-x-1/2 -translate-y-1/2 -rotate-90 scale-0 opacity-0"
            : "-translate-x-1/2 -translate-y-1/2 rotate-0 scale-100 opacity-100"
          }`}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>

      {/* Invisible spacer to maintain button size */}
      <span className="invisible block w-[18px] h-[18px]" />
    </button>
  );
}
