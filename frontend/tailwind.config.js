/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1a1008',
          dark: '#e8dfc8',
        },
        paper: {
          DEFAULT: '#f4f0e6',
          dark: '#0f0d09',
        },
        paper2: {
          DEFAULT: '#ede8d8',
          dark: '#1a1710',
        },
        paper3: {
          DEFAULT: '#e6e0cc',
          dark: '#211e14',
        },
        accent: {
          DEFAULT: '#8b1a1a',
          dark: '#c0392b',
        },
        rule: {
          DEFAULT: '#1a1008',
          dark: '#c8bea6',
        },
        muted: {
          DEFAULT: '#6b5f4a',
          dark: '#9a8e78',
        },
        ghost: {
          DEFAULT: '#b8aa8e',
          dark: '#4a4438',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        fell: ['IM Fell English', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
