// Script para generar iconos PNG desde HTML Canvas
// Ejecutar en consola del navegador

function generatePNGIcons() {
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  
  sizes.forEach(size => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Background color (azul del fondo de la aplicación)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, size, size);
    
    // Configurar fuente
    const fontSize = size * 0.3;
    ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    // Dibujar la H en naranja
    ctx.fillStyle = '#f97316';
    const hWidth = ctx.measureText('H').width;
    ctx.fillText('H', size * 0.15, size * 0.5);
    
    // Dibujar "Lab" en blanco
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Lab', size * 0.15 + hWidth, size * 0.5);
    
    // Crear enlace de descarga
    const link = document.createElement('a');
    link.download = `icon-${size}x${size}.png`;
    link.href = canvas.toDataURL('image/png');
    link.style.display = 'block';
    link.style.margin = '5px';
    link.textContent = `Descargar icon-${size}x${size}.png`;
    document.body.appendChild(link);
  });
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', generatePNGIcons);
} else {
  generatePNGIcons();
}

console.log('Generador de iconos PNG cargado. Los enlaces de descarga aparecerán en la página.');
