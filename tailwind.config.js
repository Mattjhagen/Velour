/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        velour: {
          50:  '#fff8f0',
          100: '#ffefd6',
          200: '#ffd9a8',
          300: '#ffbd70',
          400: '#ff9535',
          500: '#ff750d',
          600: '#f05a03',
          700: '#c74204',
          800: '#9e350c',
          900: '#7f2e0d',
          950: '#451404',
        },
        sage: {
          50:  '#f4f9f1',
          100: '#e6f2de',
          200: '#cde4bf',
          300: '#aacd96',
          400: '#84b36a',
          500: '#65974c',
          600: '#4e7839',
          700: '#3e5f2e',
          800: '#344c27',
          900: '#2b4022',
          950: '#13220e',
        },
        cream: {
          50:  '#fdfcf7',
          100: '#faf7ec',
          200: '#f4ecd3',
          300: '#ebdcb0',
          400: '#dfc685',
          500: '#d3ae5f',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
