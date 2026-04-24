import type { Config } from 'tailwindcss';

// ─────────────────────────────────────────────────────────────
// StandForge · 2026 Design System
// Dark-premium + accent iris (violet → cyan) gradient.
// Mobile-first, app-like.
// ─────────────────────────────────────────────────────────────

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: 'var(--ink-950)',
          900: 'var(--ink-900)',
          800: 'var(--ink-800)',
          700: 'var(--ink-700)',
          600: 'var(--ink-600)',
        },
        line: {
          DEFAULT: 'var(--line)',
          strong: 'var(--line-strong)',
          glow: 'var(--line-glow)',
        },
        fg: {
          DEFAULT: 'var(--fg)',
          soft: 'var(--fg-soft)',
          muted: 'var(--fg-muted)',
          faint: 'var(--fg-faint)',
        },
        iris: {
          DEFAULT: 'var(--iris)',
          hi: 'var(--iris-hi)',
          lo: 'var(--iris-lo)',
          glow: 'var(--iris-glow)',
        },
        cyanx: {
          DEFAULT: 'var(--cyanx)',
          hi: 'var(--cyanx-hi)',
        },
        ok: 'var(--ok)',
        warn: 'var(--warn)',
        bad: 'var(--bad)',
        info: 'var(--info)',
        hot: 'var(--hot)',
        warm: 'var(--warm)',
        cold: 'var(--cold)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
      },
      borderRadius: {
        xs: '6px',
        sm: '10px',
        DEFAULT: '14px',
        md: '14px',
        lg: '18px',
        xl: '22px',
        '2xl': '28px',
        '3xl': '34px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(0,0,0,0.3)',
        sm: '0 2px 6px rgba(0,0,0,0.35)',
        md: '0 12px 28px rgba(0,0,0,0.45)',
        lg: '0 22px 60px rgba(0,0,0,0.55)',
        xl: '0 40px 120px rgba(0,0,0,0.65)',
        glow: '0 0 0 1px rgba(129,110,255,0.22), 0 20px 60px rgba(129,110,255,0.22)',
        'glow-cyan': '0 0 0 1px rgba(96,222,255,0.22), 0 20px 60px rgba(96,222,255,0.22)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      backdropBlur: { xs: '2px' },
      animation: {
        'fade-in': 'fade-in 300ms cubic-bezier(0.22,1,0.36,1) both',
        'slide-up': 'slide-up 400ms cubic-bezier(0.22,1,0.36,1) both',
        'scale-in': 'scale-in 240ms cubic-bezier(0.22,1,0.36,1) both',
        'pulse-ring': 'pulse-ring 2.2s ease-out infinite',
        'pulse-soft': 'pulse-soft 2.5s ease-in-out infinite',
        shimmer: 'shimmer 2.2s linear infinite',
        float: 'float 5s ease-in-out infinite',
        aurora: 'aurora 8s linear infinite',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
        snappy: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
