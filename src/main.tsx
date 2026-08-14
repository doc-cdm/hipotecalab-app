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

const preloadSections = () => Promise.all([
  import('./features/simulator/Simulator'),
  import('./features/viability/Viability'),
  import('./features/resources/Resources'),
  import('./features/learning/Learning'),
]);

// Warm up lazy chunks when the browser is idle without delaying first render.
const scheduleWhenIdle = (window as Partial<Window>).requestIdleCallback;

if (scheduleWhenIdle) {
  scheduleWhenIdle(() => void preloadSections().catch(() => undefined), { timeout: 2500 });
} else {
  globalThis.setTimeout(() => void preloadSections().catch(() => undefined), 2500);
}
