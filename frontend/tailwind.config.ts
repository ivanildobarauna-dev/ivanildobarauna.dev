import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de cores baseada no one-page-report-mvp
        primary: {
          50: '#e7f3ff',
          100: '#d1e7ff',
          200: '#a3cfff',
          300: '#75b7ff',
          400: '#479fff',
          500: '#007bff', // Azul primário
          600: '#0056b3', // Azul secundário
          700: '#004085',
          800: '#002a57',
          900: '#001529',
        },
        text: {
          primary: '#333',    // Texto principal
          secondary: '#666',  // Texto secundário
          light: '#999',      // Texto claro
        },
        background: {
          primary: '#ffffff',   // Fundo principal
          secondary: '#f8f9fa', // Fundo secundário
          accent: '#e7f3ff',    // Fundo de destaque
        },
        border: {
          default: '#dee2e6',   // Borda padrão
          focus: '#007bff',     // Borda de foco
        },
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
  future: {},
}
export default config 
