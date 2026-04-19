import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forge: {
          bg: '#0a0a0f',
          card: 'rgba(9,9,14,0.7)',
          cyan: '#67e8f9',
          violet: '#a855f7',
          emerald: '#34d399',
          neon: {
            cyan: 'rgb(103,232,249)',
            violet: 'rgb(168,85,247)',
          },
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        glass: '0 8px 32px rgb(0,0,0,0.4)',
        'neon-cyan': '0 0 20px rgb(103,232,249,0.3)',
        'neon-violet': '0 0 20px rgb(168,85,247,0.3)',
        'neon-emerald': '0 0 20px rgb(52,211,153,0.3)',
      },
      backdropBlur: {
        '3xl': '64px',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%': { opacity: '0.5' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

export default config;
