/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      display: ['group-hover'],
      dropShadow: {
        glow: [
          '0 0 13px rgba(150,255,200, 0.3)',
          '0 0 15px rgba(150, 255,150, 0.2)',
        ],
      },
    },
  },
  plugins: [],
};
