import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom']
  },
  
  // Configuración de build para optimización
  build: {
    // Minificación usando terser para mejor compresión
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Eliminar console.logs en producción
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      }
    },
    
    // Configuración de chunks para code splitting
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor';
            if (id.includes('lucide-react')) return 'icons-vendor';
            if (id.includes('jspdf')) return 'pdf-vendor';
            if (id.includes('write-excel-file')) return 'excel-vendor';
          }
        }
      }
    },
    
    // Configuración de assets
    assetsInlineLimit: 4096, // Inline assets menores a 4kb
    cssCodeSplit: true, // Separar CSS por chunks
    reportCompressedSize: false, // Deshabilitar reporte de tamaño para build más rápido
    
    // Target para mejor compatibilidad y rendimiento
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14']
  },
  
  // Configuración del servidor
  server: {
    headers: {
      // Configuración más permisiva para desarrollo local
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      // Deshabilitar CSP para desarrollo local
      'Content-Security-Policy': "default-src * data: blob: filesystem: about: ws: wss: 'unsafe-inline' 'unsafe-eval'; script-src * data: blob: 'unsafe-inline' 'unsafe-eval'; connect-src * data: blob: 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src * data: blob:; style-src * data: blob: 'unsafe-inline'; font-src * data: blob: 'unsafe-inline';"
    }
  },
  
  // Configuración de preview para testing de producción
  preview: {
    headers: {
      // Headers de cache para assets estáticos
      'Cache-Control': 'public, max-age=31536000'
    }
  }
});
