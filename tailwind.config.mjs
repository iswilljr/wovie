import scrollbarHide from 'tailwind-scrollbar-hide'
import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      screens: {
        xs: '450px',
      },
      colors: {
        primary: colors.blue,
        surface: {
          DEFAULT: '#050508',
          raised: '#0c0d12',
          overlay: '#14151c',
        },
        accent: {
          DEFAULT: '#3b82f6',
          bright: '#60a5fa',
          muted: '#2563eb',
          foreground: '#ffffff',
        },
        border: {
          subtle: 'rgba(255,255,255,0.06)',
          DEFAULT: 'rgba(255,255,255,0.1)',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1rem',
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(59, 130, 246, 0.25)',
        card: '0 8px 32px -8px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'hero-vignette':
          'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 60%)',
        'card-shine':
          'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)',
      },
    },
  },
  plugins: [scrollbarHide, require('tailwindcss-animate')],
}
