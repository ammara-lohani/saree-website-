/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fdf2f3',
          100: '#fbe6e8',
          200: '#f6d0d5',
          300: '#efa9b3',
          400: '#e37586',
          500: '#d2475e',
          600: '#be2e48',
          700: '#9f2038',
          800: '#5a121e',
          900: '#3d0811',
          950: '#26040a',
        },
        gold: {
          50: '#faf8f2',
          100: '#f3eedf',
          200: '#e7dcbe',
          300: '#d8c495',
          400: '#c5a059',
          500: '#b88d44',
          600: '#a37537',
          700: '#82582d',
          800: '#6c472a',
          900: '#5c3d26',
        },
        cream: {
          50: '#fdfbf7',
          100: '#f8f4ec',
          200: '#f1e9dc',
          300: '#e5d7c3',
          400: '#d5bea3',
          500: '#c5a687',
        },
        sand: {
          50: '#f9f8f6',
          100: '#f1efe9',
          200: '#e3dfd3',
          300: '#cfc9b6',
          400: '#b8b098',
          500: '#a29980',
        },
        charcoal: {
          800: '#1e1e24',
          900: '#141417',
          950: '#0c0c0e',
        }
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(90, 18, 30, 0.1)',
        'luxury-hover': '0 20px 40px -15px rgba(90, 18, 30, 0.18)',
        'gold-glow': '0 0 25px rgba(197, 160, 89, 0.25)',
      },
    },
  },
  plugins: [],
};
