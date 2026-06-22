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
      fontFamily: { sans: ["var(--font-poppins)", "sans-serif"] },
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
  plugins: [],
};
