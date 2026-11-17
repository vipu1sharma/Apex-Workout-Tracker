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
        apex: {
          bg: '#0D0F12',
          surface: '#15181E',
          card: '#1C2028',
          cardHover: '#232832',
          border: 'rgba(255, 255, 255, 0.08)',
          borderSubtle: 'rgba(255, 255, 255, 0.04)',
          text: '#F3F4F6',
          textMuted: '#9CA3AF',
          textDim: '#6B7280',
          lime: '#D4FF00',       // Electric lime primary
          limeHover: '#BEEE00',
          limeMuted: 'rgba(212, 255, 0, 0.12)',
          emerald: '#10B981',    // Sophisticated green
          emeraldMuted: 'rgba(16, 185, 129, 0.15)',
          amber: '#F59E0B',
          amberMuted: 'rgba(245, 158, 11, 0.15)',
          red: '#EF4444',
          redMuted: 'rgba(239, 68, 68, 0.15)',
          blue: '#3B82F6',
          purple: '#A855F7',
        },
        light: {
          bg: '#F8F9FA',
          surface: '#FFFFFF',
          card: '#FFFFFF',
          cardHover: '#F3F4F6',
          border: 'rgba(0, 0, 0, 0.08)',
          borderSubtle: 'rgba(0, 0, 0, 0.04)',
          text: '#111827',
          textMuted: '#4B5563',
          textDim: '#9CA3AF',
          accent: '#10B981',
          accentHover: '#059669',
          accentMuted: 'rgba(16, 185, 129, 0.12)',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-lime': '0 0 20px -3px rgba(212, 255, 0, 0.25)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.25)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
        'card-light': '0 2px 10px -1px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
