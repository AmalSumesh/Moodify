/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f3ff',
          100: '#e0e7ff',
          900: '#0f0f1e',
          950: '#0a0a14',
        },
        neon: {
          cyan: '#00d9ff',
          purple: '#7c3aed',
          green: '#00ff88',
          pink: '#ff006e',
        },
        surface: {
          dark: '#1a1a2e',
          darker: '#141428',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}