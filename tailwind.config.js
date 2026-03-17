/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'italia-green': '#1a5c35',
        'italia-green-dark': '#134428',
        'italia-green-light': '#e8f2ec',
        'italia-red': '#c0392b',
        'italia-red-dark': '#922b21',
        'italia-red-light': '#fbeaea',
      },
      fontFamily: {
        'display': ['Nunito', 'sans-serif'],
        'body': ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
