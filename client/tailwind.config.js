/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6', // Mint
          600: '#0D9488',
          700: '#0F766E', // Primary Teal
          800: '#115E59', // Dark Teal
          900: '#134E4A', // Deep Teal
          950: '#042F2E',
        },
        navy: {
          50: '#F0F5FA',
          100: '#E1EBF5',
          200: '#B8CEE3',
          700: '#1E4A6D',
          800: '#1A405F',
          900: '#173B57', // Navy
          950: '#0F2639',
        },
        brand: {
          primary: '#0F766E',
          darkTeal: '#115E59',
          deepTeal: '#134E4A',
          mint: '#14B8A6',
          softMint: '#CCFBF1',
          lightMint: '#F0FDFA',
          navy: '#173B57',
          bg: '#F7FAFA',
          surface: '#FFFFFF',
          muted: '#64748B',
          border: '#E2E8F0',
          saffron: '#F59E0B',
        },
        gov: {
          primary: '#0F766E',
          navy: '#173B57',
          saffron: '#F59E0B',
          green: '#14B8A6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
