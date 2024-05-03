/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'move': 'move 4s linear infinite',
      }
    },
    keyframes: {
      move: {
        '0%': { transform: 'translateX(0)' },
        '100%': { transform: 'translateX(calc(-100% - 14px))' },
      }
    }
  },
  plugins: [],
}

