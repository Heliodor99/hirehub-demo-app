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
          50: '#eef5fd',
          100: '#ddeafb',
          200: '#bbd6f7',
          300: '#99c1f3',
          400: '#77adee',
          500: '#5598ea',
          600: '#2B7BD3', // Our main blue
          700: '#2563b0',
          800: '#1e4b8d',
          900: '#17346a',
        },
        teal: {
          50: '#eafbfa',
          100: '#d5f7f5',
          200: '#acefeb',
          300: '#82e7e1',
          400: '#59ded7',
          500: '#2ECDC3', // Our main teal
          600: '#25a49d',
          700: '#1c7c77',
          800: '#145551',
          900: '#0b2d2b',
        },
        purple: {
          50: '#f6f2ff',
          100: '#ede5ff',
          200: '#dbcaff',
          300: '#c9b0ff',
          400: '#b795ff',
          500: '#9B5CFF', // Our main purple
          600: '#7c4acc',
          700: '#5d3799',
          800: '#3e2566',
          900: '#1f1233',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      borderRadius: {
        'xs': '0.125rem',
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      spacing: {
        '4.5': '1.125rem',
        '18': '4.5rem',
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'dropdown': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'button': '0 2px 5px rgba(43, 123, 211, 0.2)',
        'teal-button': '0 2px 5px rgba(46, 205, 195, 0.2)',
        'purple-button': '0 2px 5px rgba(155, 92, 255, 0.2)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 