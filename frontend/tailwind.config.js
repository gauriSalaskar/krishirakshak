/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#166534',
        secondary: '#22C55E',
        accent: '#A3E635',
        background: '#FAF9F6',
        sidebar: '#0F1A0F',
        sidebarText: '#E2F5E2',
        saffron: '#F97316',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
