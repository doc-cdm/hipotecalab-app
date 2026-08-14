export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Añadir cssnano en producción para minimizar CSS
    ...(process.env.NODE_ENV === 'production' ? { cssnano: { preset: 'default' } } : {})
  },
};
