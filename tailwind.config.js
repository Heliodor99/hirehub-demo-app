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
        primary: {
          blue: '#2B7BD3',
          teal: '#2ECDC3',
          purple: '#9B5CFF',
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#B8DCFF',
          300: '#8AC3FF',
          400: '#5DA9FF',
          500: '#2B7BD3',
          600: '#235EB0',
          700: '#1A448D',
          800: '#122D6A',
          900: '#091647',
        },
        secondary: {
          50: '#E6FDFB',
          100: '#CCFAF7',
          200: '#99F5EF',
          300: '#66F0E7',
          400: '#33EBDF',
          500: '#2ECDC3',
          600: '#25A49C',
          700: '#1C7B75',
          800: '#13524E',
          900: '#092927',
        },
        accent: {
          50: '#F5F0FF',
          100: '#EBE0FF',
          200: '#D6C1FF',
          300: '#C2A3FF',
          400: '#AD84FF',
          500: '#9B5CFF',
          600: '#7C4ACC',
          700: '#5D3799',
          800: '#3E2566',
          900: '#1F1233',
        },
        'primary-dark': '#4338CA',
        'secondary-dark': '#059669',
        border: '#e5e7eb',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 