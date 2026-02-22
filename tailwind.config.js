/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif']
      },
      colors: {
        rose: 'var(--rose)',
        pink: 'var(--pink)',
        blush: 'var(--blush)',
        crimson: 'var(--crimson)',
        hot: 'var(--hot)'
      }
    }
  },
  corePlugins: {
    preflight: false
  },
  plugins: []
};
