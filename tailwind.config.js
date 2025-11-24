/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'morado': {
          50: '#f7f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        'hueso': {
          50: '#fefdf8',
          100: '#fdf9f0',
          200: '#f9f0e1',
          300: '#f4e6d1',
          400: '#ecd4b4',
          500: '#e4c297',
          600: '#d8b48c',
          700: '#c9a372',
          800: '#b8915a',
          900: '#a17c47',
          950: '#8b6b3a',
        },
        'azul-cielo': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      fontFamily: {
        'sans': ['Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}