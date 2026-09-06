import { Component, type ReactNode } from 'react';
import { WifiOff } from 'lucide-react';

export default class SectionBoundary extends Component<{ children: ReactNode; onHome: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" className="mx-auto max-w-lg px-6 py-16 text-center">
        <WifiOff className="mx-auto mb-5 text-brand" size={32} aria-hidden="true" />
        <h1 className="text-2xl font-semibold">No hemos podido abrir esta sección</h1>
        <p className="my-4 text-slate-300">Comprueba tu conexión y vuelve a cargar la app. También puedes regresar al menú y elegir otra herramienta.</p>
        <button type="button" className="primary-button w-full" onClick={() => window.location.reload()}>Volver a cargar</button>
        <button type="button" className="mt-3 px-4 py-3 text-brand" onClick={this.props.onHome}>Volver al menú principal</button>
      </div>
    );
  }
}
