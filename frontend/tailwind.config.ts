import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep editorial-financial dark palette
        bg: {
          base:    '#060B18',
          surface: '#0E1729',
          raised:  '#13203A',
          border:  '#1B2942',
        },
        ink: {
          primary:   '#F3F4F6',
          secondary: '#A1B0CC',
          muted:     '#6B7B9E',
        },
        // User's brief: blue for positive, red for negative
        bull: {
          DEFAULT: '#3D7BFF',
          soft:    '#2B5BD9',
          glow:    'rgba(61, 123, 255, 0.18)',
        },
        bear: {
          DEFAULT: '#FF4757',
          soft:    '#D9303F',
          glow:    'rgba(255, 71, 87, 0.18)',
        },
        accent: {
          gold:   '#F5C518',
          plasma: '#5EEAD4',
        },
      },
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },
      boxShadow: {
        'card':  '0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px rgba(0,0,0,0.35)',
        'bull':  '0 0 0 1px rgba(61,123,255,0.35), 0 12px 32px rgba(61,123,255,0.15)',
        'bear':  '0 0 0 1px rgba(255,71,87,0.35), 0 12px 32px rgba(255,71,87,0.15)',
      },
      backgroundImage: {
        'grid': 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        'noise': "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.3'/></svg>\")",
      },
    },
  },
  plugins: [],
} satisfies Config;
