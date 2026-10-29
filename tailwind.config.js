/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ground: {
          DEFAULT: '#FAFAF8',
          dark: '#0A0A0A',
          muted: '#F0F0EC',
          subtle: '#E8E8E4',
        },
        ink: {
          DEFAULT: '#0A0A0A',
          light: '#FAFAF8',
          muted: '#6B6B68',
          faint: '#9A9A96',
        },
        accent: {
          DEFAULT: '#E54D2E',
          hover: '#D4411E',
          muted: '#FFF0ED',
          dark: '#C13A1B',
        },
        success: '#2D7A3A',
        warning: '#D4A017',
        error: '#C13A1B',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '0.92', letterSpacing: '-0.04em' }],
        'display-lg': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display-md': ['clamp(2rem, 3.5vw, 3rem)', { lineHeight: '1.0', letterSpacing: '-0.025em' }],
        'display-sm': ['clamp(1.5rem, 2.5vw, 2rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.55' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.8125rem', { lineHeight: '1.4' }],
      },
      spacing: {
        'section': 'clamp(80px, 12vw, 200px)',
        'section-sm': 'clamp(48px, 8vw, 120px)',
      },
      maxWidth: {
        'content': '1280px',
        'narrow': '720px',
        'wide': '1440px',
      },
      borderRadius: {
        'none': '0',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
};

