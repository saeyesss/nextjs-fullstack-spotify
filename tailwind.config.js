/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      dropShadow: {
        glow: [
          '0 0px 20px rgba(150,255,200, 1)',
          '0 0px 45px rgba(150, 255,150, 0.8)',
        ],
      },
    },
  },
  plugins: [],
};
