/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        parkin: ['"Parkinsans"', 'sans-serif'], // Use the correct font name from Google Fonts
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out forwards',
        draw: 'draw 1s ease-in-out forwards',
        'gradient': 'gradient 3s ease-in-out infinite',
      },
      scale: {
        '102': '1.02',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        draw: {
          '0%': {
            strokeDasharray: '60',
            strokeDashoffset: '60',
          },
          '100%': {
            strokeDasharray: '60',
            strokeDashoffset: '0',
          },
          gradient: {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        },
      },
      colors: {
        'moox-gold': '#d6af53',  // Golden Pale Yellow
        'moox-navy': '#1a2a47',  // Dark Navy Blue
        'moox-bg': '#1a1a1a',    // bg-gray-900 (very dark gray)
        'mainbg' : '#FDF8DA',
      },
      borderWidth: {
        1: '1px',
      },
      borderRadius: {
        'xl': '12px',
      },
      boxShadow:{
        'bs2': 'inset 0 2px 6px 0 rgb(0 0 0 / 0.05)',
      },
      backdropBlur: {
        'low': '10px',
      },
      fontSize: {
        'xxs': '0.8rem',
      },
      maxWidth: {
        '8xl': '84rem', // Custom max width of 800px
        'custom': '100rem', // Custom max width of 1600px
      },
      padding: {
        'c': '6rem', // Custom 480px padding
      },
    },
  },
  plugins: [],
}