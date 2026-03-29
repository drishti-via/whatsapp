/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#e9fef5',
          100: '#d2fbe8',
          300: '#7ce6b7',
          500: '#25d366',
          600: '#1daa52',
          700: '#128c7e'
        },
        ink: {
          50: '#f7f9fa',
          100: '#eef2f5',
          300: '#8696a0',
          500: '#54656f',
          700: '#111b21',
          900: '#0b141a'
        },
        chat: {
          50: '#efeae2',
          100: '#ffffff',
          200: '#202c33',
          300: '#d9fdd3'
        }
      },
    },
  },
  plugins: [],
}
