/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B4A24', // Dark Olive
        secondary: '#F0F2EB', // Light Sage/Cream
        accent: '#C5A059', // Bronze/Gold
        'text-dark': '#1A2F1A', // Very Dark Green
        'olive-light': '#556B2F', // Standard Olive for gradients
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
