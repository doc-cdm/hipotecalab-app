import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Hydrate/Render as soon as possible
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Preload chunks when idle: main menu sections and heavy vendors
if ('requestIdleCallback' in window) {
  // @ts-ignore
  requestIdleCallback(async () => {
    try {
      // Pre-cargar iconos (pequeños) y dividir vendors ya configurados
      await Promise.all([
        import('./components/Simulator'),
        import('./components/Viability'),
        import('./components/Resources'),
        import('./components/Learning'),
      ]);
    } catch (e) {
      // Ignorar errores de preload
    }
  }, { timeout: 2500 });
} else {
  setTimeout(() => {
    Promise.all([
      import('./components/Simulator'),
      import('./components/Viability'),
      import('./components/Resources'),
      import('./components/Learning'),
    ]).catch(() => { });
  }, 2500);
}
