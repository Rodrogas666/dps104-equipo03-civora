/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        civora: {
          primary: '#176449',
          primaryDark: '#12503A',
          bg: '#F6F8F4',
          surface: '#EAF1E8',
          card: '#FFFFFF',
          border: '#E1E7E0',
          text: '#1B3529',
          muted: '#6E7D75',
        },
      },
    },
  },
  plugins: [],
};
