/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: '#F97316',
          dark: '#EA580C',
          light: '#FFF7ED',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C3A0E',
        },
        safe: '#22C55E',
        warn: '#EAB308',
        danger: '#EF4444',
        warm: {
          bg: '#FFF7ED',
          card: '#FFFFFF',
          border: '#E7E5E4',
          text: '#1C1917',
          muted: '#78716C',
        },
      },
      fontSize: {
        'elder-xl': ['24px', { lineHeight: '1.6' }],
        'elder-lg': ['20px', { lineHeight: '1.6' }],
        'elder-base': ['18px', { lineHeight: '1.7' }],
        'elder-sm': ['16px', { lineHeight: '1.6' }],
        'elder-xs': ['14px', { lineHeight: '1.5' }],
      },
      spacing: {
        'safe-touch': '48px',
        'btn-h': '52px',
        'input-h': '56px',
      },
      borderRadius: {
        'elder': '16px',
        'elder-sm': '12px',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.1)',
        'btn': '0 2px 8px rgba(249,115,22,0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1.5s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
    },
  },
  plugins: [],
};
