const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    extend: {
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      },
      colors: {
        primary: {
          100: '#0D2B59',
          200: '#00023C',
          300: '#46588B',
          400: '#E8EFFF',
          500: '#D3A518',
          600: '#00AF92',
          700: '#047857',
          800: '#46AAF7',
          900: '#00E599',
        },
        gray: {
          100: '#f7fafc',
          200: '#969696',
          300: '#e2e8f0',
          400: '#cbd5e0',
          500: '#a0aec0',
          600: '#242424',
          700: '#4a5568',
          800: '#2d3748',
          900: '#242424',
        },
      },
      lineHeight: {
        hero: '4.5rem',
      },
      minWidth: {
        400: '25rem',
      },
      spacing: {
        112: '28rem',
      },
    },
  },
  variants: {},
  plugins: [],
};
