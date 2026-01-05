/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'space': ['Space Grotesk', 'sans-serif'],
        'syne': ['Syne', 'sans-serif'],
      },
      colors: {
        midnight: {
          void: '#2E004F',
          pink: '#FF007F',
          cyan: '#00FFFF',
          light: '#F0F0F0',
          dark: '#0A0E27',
        },
      },
      animation: {
        glitch: 'glitch 0.3s ease-in-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { clipPath: 'inset(0)' },
          '20%': { clipPath: 'inset(0 0 0 0)' },
          '40%': { clipPath: 'inset(0 10% 0 0)' },
          '60%': { clipPath: 'inset(0 0 0 5%)' },
          '80%': { clipPath: 'inset(0 0 0 0)' },
        },
      },
    },
  },
  plugins: [],
};
