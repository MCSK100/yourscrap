import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        scrap: {
          gold: '#B2AC88',
          green: '#98FF98',
          dark: '#0a150a',
          surface: '#0d1a0d',
          card: '#111f11',
          border: 'rgba(152, 255, 152, 0.12)',
          'border-hover': 'rgba(152, 255, 152, 0.3)',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.05', fontWeight: '800', letterSpacing: '-0.03em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.08', fontWeight: '700', letterSpacing: '-0.025em' }],
        'display-md': ['3rem', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.02em' }],
      },
      spacing: {
        'section': '7rem',
        'section-lg': '10rem',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glow-green': '0 0 30px rgba(152, 255, 152, 0.15), 0 0 60px rgba(152, 255, 152, 0.05)',
        'glow-gold': '0 0 30px rgba(178, 172, 136, 0.15), 0 0 60px rgba(178, 172, 136, 0.05)',
        'card': '0 2px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'drift': 'drift 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(152, 255, 152, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(152, 255, 152, 0.3)' },
        },
        drift: {
          '0%': { transform: 'translateX(0) translateY(0)' },
          '25%': { transform: 'translateX(10px) translateY(-10px)' },
          '50%': { transform: 'translateX(-5px) translateY(-20px)' },
          '75%': { transform: 'translateX(-15px) translateY(-5px)' },
          '100%': { transform: 'translateX(0) translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
