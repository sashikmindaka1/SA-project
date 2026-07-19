/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'talent-dark': '#1A2126',
        'talent-panel': '#27668C',
        'talent-cyan': '#0CF2F2',
        'talent-cyan-dark': '#2CBFBF',
        'talent-gold': '#D9B855',
      }
    },
  },
  plugins: [],
}