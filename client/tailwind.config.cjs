// tailwind.config.cjs
module.exports = {
  darkMode: 'class', // enable class-based dark mode
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(210, 100%, 55%)',
        secondary: 'hsl(340, 80%, 60%)',
      },
    },
  },
  plugins: [],
};
