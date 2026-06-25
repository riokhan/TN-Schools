/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: { 
        sans: ["var(--font-poppins)", "var(--font-tamil)", "sans-serif"],
        tamil: ["var(--font-tamil)", "sans-serif"],
      },
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        background: "var(--bg-main)",
        card: "var(--bg-card)",
        border: "var(--border)",
        "text-main": "var(--text-main)",
        "text-heading": "var(--text-heading)",
        /* Dark surface tokens */
        "surface": "var(--bg-card)",
        "surface-hover": "var(--bg-card-hover)",
        "muted": "var(--text-muted)",
      },
      boxShadow: {
        'btn-primary': '0 4px 15px 0px var(--primary-shadow-1)',
        'btn-primary-hover': '0 8px 25px var(--primary-shadow-2)',
        'theme-card': 'var(--card-shadow)',
      }
    },
  },
  safelist: [
    // Dynamic color classes used in InteractiveInfographic
    { pattern: /bg-(emerald|sky|indigo|amber|rose|teal|violet)-(50|100|400|500|600)/ },
    { pattern: /text-(emerald|sky|indigo|amber|rose|teal|violet)-(400|500|600)/ },
    { pattern: /border-(emerald|sky|indigo|amber|rose|teal|violet)-(400|500)/ },
    { pattern: /ring-(emerald|sky|indigo|amber|rose|teal|violet)-400\/20/ },
    { pattern: /from-(emerald|sky|indigo|amber|rose|teal|violet)-50/ },
    { pattern: /to-(cyan|purple|orange|pink)-50/ },
    { pattern: /hover:bg-(emerald|sky|indigo|amber|rose|teal|violet)-50/ },
    { pattern: /hover:border-(emerald|sky|indigo|amber|rose|teal|violet)-(400|500)/ },
    { pattern: /group-hover:text-(emerald|sky|indigo|amber|rose|teal|violet)-600/ },
    // Dynamic slide deck accent palette classes
    { pattern: /from-(blue|emerald|violet|rose|amber)-(500|600)/ },
    { pattern: /to-(indigo|teal|purple|pink|orange)-(600)/ },
    { pattern: /bg-(blue|emerald|violet|rose|amber)-(500|600)/ },
    { pattern: /border-(blue|emerald|violet|rose|amber)-(100|200)/ },
    { pattern: /text-(blue|emerald|violet|rose|amber)-(700|800)/ },
    { pattern: /bg-gradient-to-(br|r)/ },
  ],
  plugins: [],
};
