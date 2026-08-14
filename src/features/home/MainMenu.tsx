import { BookOpen, Brain, Calculator, TrendingUp } from 'lucide-react';
import type { Section } from '../../app/navigation';
import FloatingParticles from '../../shared/components/FloatingParticles';

interface MainMenuProps {
  onNavigate: (section: Section) => void;
}

const MainMenu = ({ onNavigate }: MainMenuProps) => {
  return (
      <section className="flex items-center justify-center min-h-screen bg-slate-900 pt-16 relative overflow-hidden" role="main" aria-labelledby="main-menu-heading">
        <FloatingParticles />
        <div className="text-center space-y-12 p-8 relative z-10 max-w-5xl mx-auto">
          {/* Header Principal */}
          <div className="space-y-6">
            <h1 id="main-menu-heading" className="text-4xl font-bold text-white">
              <span className="text-orange-500">Hipoteca</span>Lab
            </h1>
            <div className="w-16 h-0.5 mx-auto rounded-full bg-orange-500"></div>
            <div className="space-y-2">
              <p className="text-xl text-slate-300 font-medium">Te damos la bienvenida</p>
            </div>
          </div>

          {/* Separador Visual */}
          <div className="flex items-center justify-center my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
          </div>

          {/* Grid de Herramientas */}
          <div className="space-y-8">
            {/* Primera fila - 2 elementos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Simulador */}
              <button
                onClick={() => onNavigate('simulator')}
                className="group relative bg-slate-800/50 border border-slate-700/60 hover:border-orange-500/50 p-6 rounded-xl transition-all duration-300 ease-out backdrop-blur-sm overflow-hidden focus:outline-none focus:ring-2 focus:ring-orange-500/40 hover:shadow-[0_4px_18px_-6px_rgba(0,0,0,0.6)] hover:-translate-y-1"
                aria-label="Ir al simulador para calcular cuotas y costes totales de hipotecas"
                type="button"
              >
                <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(230,140,3,0.12), transparent 65%)' }} />
                <div className="relative flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-lg bg-slate-700/40 border border-slate-600/50 group-hover:border-orange-500/40 transition-colors">
                    <Calculator size={32} className="text-slate-300 group-hover:text-orange-500 transition-colors duration-300" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white tracking-wide group-hover:text-orange-500 transition-colors duration-300">Simulador</h3>
                    <p className="text-sm leading-snug text-slate-400 group-hover:text-slate-300 transition-colors duration-300">Simula tu préstamo hipotecario</p>
                  </div>
                </div>
              </button>

              {/* Viabilidad */}
              <button
                onClick={() => onNavigate('viability')}
                className="group relative bg-slate-800/50 border border-slate-700/60 hover:border-orange-500/50 p-6 rounded-xl transition-all duration-300 ease-out backdrop-blur-sm overflow-hidden focus:outline-none focus:ring-2 focus:ring-orange-500/40 hover:shadow-[0_4px_18px_-6px_rgba(0,0,0,0.6)] hover:-translate-y-1"
                aria-label="Ir al análisis de viabilidad para evaluar tu capacidad financiera"
                type="button"
              >
                <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(230,140,3,0.12), transparent 65%)' }} />
                <div className="relative flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-lg bg-slate-700/40 border border-slate-600/50 group-hover:border-orange-500/40 transition-colors">
                    <TrendingUp size={32} className="text-slate-300 group-hover:text-orange-500 transition-colors duration-300" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white tracking-wide group-hover:text-orange-500 transition-colors duration-300">Viabilidad</h3>
                    <p className="text-sm leading-snug text-slate-400 group-hover:text-slate-300 transition-colors duration-300">Evalúa tu capacidad financiera</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Segunda fila - 2 elementos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Recursos */}
              <button
                onClick={() => onNavigate('resources')}
                className="group relative bg-slate-800/50 border border-slate-700/60 hover:border-orange-500/50 p-6 rounded-xl transition-all duration-300 ease-out backdrop-blur-sm overflow-hidden focus:outline-none focus:ring-2 focus:ring-orange-500/40 hover:shadow-[0_4px_18px_-6px_rgba(0,0,0,0.6)] hover:-translate-y-1"
                aria-label="Ir a recursos para acceder a guías y conceptos clave"
                type="button"
              >
                <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(230,140,3,0.12), transparent 65%)' }} />
                <div className="relative flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-lg bg-slate-700/40 border border-slate-600/50 group-hover:border-orange-500/40 transition-colors">
                    <BookOpen size={32} className="text-slate-300 group-hover:text-orange-500 transition-colors duration-300" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white tracking-wide group-hover:text-orange-500 transition-colors duration-300">Recursos</h3>
                    <p className="text-sm leading-snug text-slate-400 group-hover:text-slate-300 transition-colors duration-300">Tu diccionario hipotecario</p>
                  </div>
                </div>
              </button>

              {/* Aprende */}
              <button
                onClick={() => onNavigate('learning')}
                className="group relative bg-slate-800/50 border border-slate-700/60 hover:border-orange-500/50 p-6 rounded-xl transition-all duration-300 ease-out backdrop-blur-sm overflow-hidden focus:outline-none focus:ring-2 focus:ring-orange-500/40 hover:shadow-[0_4px_18px_-6px_rgba(0,0,0,0.6)] hover:-translate-y-1"
                aria-label="Ir a la sección de aprendizaje con quiz y minijuegos educativos"
                type="button"
              >
                <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(230,140,3,0.12), transparent 65%)' }} />
                <div className="relative flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-lg bg-slate-700/40 border border-slate-600/50 group-hover:border-orange-500/40 transition-colors">
                    <Brain size={32} className="text-slate-300 group-hover:text-orange-500 transition-colors duration-300" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white tracking-wide group-hover:text-orange-500 transition-colors duration-300">Aprende</h3>
                    <p className="text-sm leading-snug text-slate-400 group-hover:text-slate-300 transition-colors duration-300">Quiz y minijuegos</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
};

export default MainMenu;

