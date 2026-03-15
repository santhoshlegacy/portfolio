/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#03050a',      // Deep space void
        neonBlue: '#00f2ff',  // Electric cyan
        neonPurple: '#bc13fe', // Plasma purple
        slate: '#64748b',
      },
      backgroundImage: {
        'tech-grid': "linear-gradient(to right, rgba(188, 19, 254, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(188, 19, 254, 0.05) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}