/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter var"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Fira Code"', 'JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      colors: {
        slate: {
          850: '#1e293b'
        },
        brand: {
          400: '#38bdf8', // Sky 400
          500: '#0ea5e9', // Sky 500
          600: '#0284c7'  // Sky 600
        },
        accent: {
          purple: '#a855f7',
          red: '#f43f5e',
          orange: '#f97316' // Colab Orange
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
