/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFB800',
        secondary: '#00A3FF', 
        accent: '#FF4B4B',
        background: '#0A0F1E',
        surface: '#1A1F2E',
        'surface-light': '#2A2F3E'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      }
    },
  },
  plugins: [
    require('tailwindcss-animate')
  ],
}