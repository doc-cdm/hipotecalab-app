/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Colores de marca. `brand` es el naranja corporativo (el mismo que usan
      // los documentos exportados) y `brand-cream` el claro de apoyo.
      colors: {
        brand: {
          DEFAULT: '#f97316',
          hover: '#ea580c',
          cream: '#F6EBD9',
        },
      },
      animation: {
        'fade-in': 'fade-in 1s ease-out',
        'fade-in-up': 'fade-in-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-in': 'slide-in 1.2s ease-out 0.5s both',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          'from': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-in-up': {
          'from': {
            opacity: '0',
            transform: 'translateY(12px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slide-in': {
          'from': {
            width: '0',
            opacity: '0',
          },
          'to': {
            width: '6rem',
            opacity: '1',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            'box-shadow': '0 0 20px rgba(249, 115, 22, 0.3)',
          },
          '50%': {
            'box-shadow': '0 0 40px rgba(249, 115, 22, 0.6)',
          },
        },
      },
    },
  },
  plugins: [],
};
