/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          black: '#1D1D1F',
          gray: '#6E6E73',
          lightgray: '#AEAEB2',
          border: '#D2D2D7',
          bg: '#F5F5F7',
          bgdark: '#E8E8ED',
        }
      }
    },
  },
  plugins: [],
}

