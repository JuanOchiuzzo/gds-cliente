import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--canvas)',
        surface: {
          DEFAULT: 'var(--surface-0)',
          0: 'var(--surface-0)',
          1: 'var(--surface-1)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
          glow: 'var(--border-glow)',
        },
        text: {
          DEFAULT: 'var(--text)',
          soft: 'var(--text-soft)',
          faint: 'var(--text-faint)',
          ghost: 'var(--text-ghost)',
        },
        solar: {
          DEFAULT: 'var(--solar)',
          hot: 'var(--solar-hot)',
          deep: 'var(--solar-deep)',
          glow: 'var(--solar-glow)',
          soft: 'var(--solar-soft)',
        },
        aurora: {
          1: 'var(--aurora-1)',
          2: 'var(--aurora-2)',
          3: 'var(--aurora-3)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        info: 'var(--info)',
        hot: 'var(--hot)',
        warm: 'var(--warm)',
        cold: 'var(--cold)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-instrument-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-geist-mono)', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],
      },
      borderRadius: {
        xs: 'var(--r-xs)',
        sm: 'var(--r-sm)',
        DEFAULT: 'var(--r)',
        md: 'var(--r)',
        lg: 'var(--r-lg)',
        xl: 'var(--r-xl)',
        '2xl': 'var(--r-2xl)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        glow: 'var(--shadow-glow)',
        inset: 'var(--shadow-inset)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-solar': 'pulse-solar 2.4s ease-out infinite',
        'pulse-soft': 'pulse-soft 2.5s ease-in-out infinite',
        float: 'float 5s ease-in-out infinite',
        shimmer: 'shimmer 2.2s linear infinite',
        'rotate-aurora': 'rotate-aurora 8s linear infinite',
        'slide-up': 'slide-up 400ms cubic-bezier(0.22,1,0.36,1) both',
        'scale-in': 'scale-in 240ms cubic-bezier(0.22,1,0.36,1) both',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
