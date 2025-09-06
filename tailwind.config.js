// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        darkBg: '#0f172a',  // Example: slate-900
        darkText: '#f1f5f9', // Example: slate-100
      },
    },
  },
  plugins: [],
};
