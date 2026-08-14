import { useState, Suspense, lazy } from 'react';
import { Calculator, TrendingUp, BookOpen, Menu, Home, Shield, FileText, Brain, ChevronDown, MessageCircle, Scale } from 'lucide-react';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import TermsOfUseModal from './components/TermsOfUseModal';

// Carga perezosa de secciones pesadas para reducir JS inicial
const Simulator = lazy(() => import('./components/Simulator'));
const Viability = lazy(() => import('./components/Viability'));
const Resources = lazy(() => import('./components/Resources'));
const Learning = lazy(() => import('./components/Learning'));

type Section = 'simulator' | 'viability' | 'resources' | 'learning' | 'home' | 'main-menu';

const faqItems = [
  {
    question: '¿Es gratis usar HipotecaLab?',
    answer: 'Sí, HipotecaLab es una herramienta totalmente gratuita.',
  },
  {
    question: '¿Tengo que registrarme o dar mis datos personales?',
    answer: '¡No hace falta! Puedes empezar a aprender y simular tus escenarios hipotecarios de forma anónima y sin necesidad de crear una cuenta o dejarnos tu correo electrónico.',
  },
  {
    question: '¿Los resultados que obtengo son los definitivos que me dará el banco?',
    answer: 'Los resultados de HipotecaLab son estimaciones matemáticas basadas en los datos que introduces. Sin embargo, las condiciones finales siempre dependerán de la oferta comercial del banco y de su análisis de tu perfil financiero.',
  },
  {
    question: '¿Qué tipo de hipotecas puedo calcular en HipotecaLab?',
    answer: 'Actualmente, el simulador está diseñado para hipotecas a tipo fijo que utilizan el sistema de amortización francés. Este es el sistema más común en España, en el que pagas exactamente la misma cuota cada mes.',
    note: 'Por ahora no incluimos simulaciones de hipotecas variables o mixtas. Estas dependen de la evolución del Euríbor, un índice cuyo valor a futuro es imposible de predecir. En HipotecaLab preferimos ofrecerte cálculos estables y sin sorpresas para que planifiques tu futuro con seguridad.',
  },
];

// Componente de loading optimizado
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-900">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-300 text-sm">Cargando...</p>
    </div>
  </div>
);

// Componente de partículas flotantes reutilizable
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-20 left-20 w-2 h-2 rounded-full animate-float" style={{ backgroundColor: '#E68C03', opacity: 0.4 }}></div>
      <div className="absolute top-40 right-32 w-1 h-1 rounded-full animate-float-delay-1" style={{ backgroundColor: '#F6EBD9', opacity: 0.6 }}></div>
      <div className="absolute bottom-32 left-40 w-1.5 h-1.5 rounded-full animate-float-delay-2" style={{ backgroundColor: '#E68C03', opacity: 0.4 }}></div>
      <div className="absolute bottom-20 right-20 w-2 h-2 rounded-full animate-float-delay-3" style={{ backgroundColor: '#08576C', opacity: 0.5 }}></div>
      <div className="absolute top-1/3 left-2/3 w-1 h-1 rounded-full animate-float" style={{ backgroundColor: '#F6EBD9', opacity: 0.5 }}></div>
      <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full animate-float-delay-1" style={{ backgroundColor: '#E68C03', opacity: 0.4 }}></div>
      <div className="absolute top-1/2 left-10 w-1 h-1 rounded-full animate-float-delay-2" style={{ backgroundColor: '#08576C', opacity: 0.3 }}></div>
      <div className="absolute top-3/4 right-40 w-1.5 h-1.5 rounded-full animate-float-delay-3" style={{ backgroundColor: '#F6EBD9', opacity: 0.4 }}></div>
    </div>
  );
};

function App() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const sections = [
    { id: 'simulator' as Section, label: 'Simulador', icon: Calculator, color: 'orange', description: 'Juega con intereses, plazo y entrada' },
    { id: 'viability' as Section, label: 'Viabilidad', icon: TrendingUp, color: 'orange', description: '¿Qué casa te puedes permitir?' },
    { id: 'resources' as Section, label: 'Recursos', icon: BookOpen, color: 'orange', description: 'Entiende lo que te están diciendo' },
    { id: 'learning' as Section, label: 'Aprende', icon: Brain, color: 'orange', description: 'Aprende sin que se te haga bola' },
  ];

  const renderHomeSection = () => {
    return (
      <section className="min-h-screen bg-slate-900" role="main" aria-labelledby="welcome-heading">
        <div className="max-w-2xl mx-auto px-6 pt-24 pb-16">

          {/* Hero */}
          <div className="text-center mb-10">
            <h1 id="welcome-heading" className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              <span className="text-orange-500">Hipoteca</span>Lab
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-10">
              Deja de ser un espectador en la decisión financiera más importante de tu vida.
              Conviértete en director.
            </p>

            {/* CTA arriba, como NotebookLM */}
            <button
              onClick={() => setActiveSection('main-menu')}
              className="w-full py-4 bg-black hover:bg-gray-900 text-white font-semibold rounded-2xl transition-colors duration-200 text-lg mb-4"
            >
              Probar <span className="text-orange-500">Hipoteca</span>Lab
            </button>
            <p className="text-xs text-slate-500">
              Al continuar, aceptas nuestros{' '}
              <button
                onClick={() => setIsTermsModalOpen(true)}
                className="underline transition-colors"
                style={{ color: '#E68C03' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#cc7a02'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#E68C03'}
                aria-label="Ver términos de uso de la aplicación"
                type="button"
              >
                Términos de Uso
              </button>
              {' '}y confirmas que has leído nuestra{' '}
              <button
                onClick={() => setIsPrivacyModalOpen(true)}
                className="underline transition-colors"
                style={{ color: '#E68C03' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#cc7a02'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#E68C03'}
                aria-label="Ver política de privacidad de la aplicación"
                type="button"
              >
                Política de Privacidad
              </button>
            </p>
          </div>

          {/* Separador */}
          <div className="h-px bg-slate-800 mb-14"></div>

          {/* Funcionalidades */}
          <div className="space-y-14">
            {/* Item 1 */}
            <div className="flex flex-col space-y-3">
              <MessageCircle size={32} className="text-slate-300" />
              <h2 className="text-xl font-bold text-white">Claridad</h2>
              <p className="text-orange-400 italic text-sm">
                "No entiendo nada y me da vergüenza preguntar"
              </p>
              <p className="text-slate-400 leading-relaxed">
                Domina los términos bancarios y traduce los tecnicismos a tu idioma. Porque entender tu hipoteca debería ser la parte más sencilla de comprar tu casa.
              </p>
            </div>

            <div className="h-px bg-slate-800"></div>

            {/* Item 2 */}
            <div className="flex flex-col space-y-3">
              <Scale size={32} className="text-slate-300" />
              <h2 className="text-xl font-bold text-white">Certeza</h2>
              <p className="text-orange-400 italic text-sm">
                "¿Puedo permitirme una hipoteca de verdad?"
              </p>
              <p className="text-slate-400 leading-relaxed">
                Con solo cuatro datos te decimos cuánto dinero te tendría que prestar el banco, cuál sería tu cuota mensual y qué precio de vivienda es realista para ti. Claro y directo.
              </p>
            </div>

            <div className="h-px bg-slate-800"></div>

            {/* Item 3 */}
            <div className="flex flex-col space-y-3">
              <Calculator size={32} className="text-slate-300" />
              <h2 className="text-xl font-bold text-white">Control</h2>
              <p className="text-orange-400 italic text-sm">
                "¿Y si cambio algo... qué pasa?"
              </p>
              <p className="text-slate-400 leading-relaxed">
                Juega con los plazos, los tipos de interés, la entrada. Ver cómo cada decisión afecta a los próximos 30 años de tu vida lo cambia todo.
              </p>
            </div>
          </div>

          {/* Separador */}
          <div className="h-px bg-slate-800 mt-14 mb-14"></div>

          {/* FAQ */}
          <div className="pb-4">
            <h2 className="text-2xl font-bold text-white mb-2">FAQ</h2>
            <p className="text-slate-400 text-sm mb-8">Aquí tienes respuestas a las preguntas más frecuentes.</p>

            <div>
              {faqItems.map((item, index) => (
                <div key={index} className="border-b border-slate-800">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full text-left py-5 flex items-start justify-between gap-4"
                    type="button"
                    aria-expanded={openFaqIndex === index}
                  >
                    <span className="text-orange-400 font-medium leading-snug">{item.question}</span>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 flex-shrink-0 mt-0.5 transition-transform duration-200 ${openFaqIndex === index ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openFaqIndex === index && (
                    <div className="pb-5 space-y-3">
                      <p className="text-slate-400 text-sm leading-relaxed">{item.answer}</p>
                      {item.note && (
                        <p className="text-slate-500 text-sm leading-relaxed border-l-2 border-slate-700 pl-3">
                          <span className="font-medium text-slate-400">Nota: </span>{item.note}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    );
  };

  const renderMainMenuSection = () => {
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
                onClick={() => setActiveSection('simulator')}
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
                onClick={() => setActiveSection('viability')}
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
                onClick={() => setActiveSection('resources')}
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
                onClick={() => setActiveSection('learning')}
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

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'home':
        return renderHomeSection();
      case 'main-menu':
        return renderMainMenuSection();
      case 'simulator':
        return (
          <div className="relative overflow-hidden">
            <FloatingParticles />
            <div className="relative z-10">
              <Suspense fallback={<LoadingSpinner />}>
                <Simulator />
              </Suspense>
            </div>
          </div>
        );
      case 'viability':
        return (
          <div className="relative overflow-hidden">
            <FloatingParticles />
            <div className="relative z-10">
              <Suspense fallback={<LoadingSpinner />}>
                <Viability />
              </Suspense>
            </div>
          </div>
        );
      case 'resources':
        return (
          <div className="relative overflow-hidden">
            <FloatingParticles />
            <div className="relative z-10">
              <Suspense fallback={<LoadingSpinner />}>
                <Resources />
              </Suspense>
            </div>
          </div>
        );
      case 'learning':
        return (
          <div className="relative overflow-hidden">
            <FloatingParticles />
            <div className="relative z-10">
              <Suspense fallback={<LoadingSpinner />}>
                <Learning />
              </Suspense>
            </div>
          </div>
        );
      default:
        return renderHomeSection();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Skip Links for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-orange-500 focus:text-white focus:rounded-md focus:no-underline"
        tabIndex={0}
      >
        Saltar al contenido principal
      </a>

      {/* Top Bar */}
      {(activeSection !== 'home' && activeSection !== 'main-menu') && (
        <header className="bg-slate-800 border-b border-slate-700 px-4 pb-3 flex items-center justify-between" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveSection('main-menu')}
                className="font-bold text-xl text-white hover:text-orange-400 transition-colors cursor-pointer"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif' }}
                aria-label="Ir al menú principal de HipotecaLab"
                type="button"
              >
                <span className="text-orange-500">H</span>Lab
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-slate-700 rounded-md transition-colors"
            aria-label={isMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
            type="button"
          >
            <Menu size={20} />
          </button>
        </header>
      )}

      {/* Top Bar for Home and Main Menu */}
      {(activeSection === 'home' || activeSection === 'main-menu') && (
        <header className="absolute top-0 left-0 right-0 z-20 bg-transparent px-4 pb-3 flex items-center justify-between" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {activeSection === 'main-menu' && (
                <button
                  onClick={() => setActiveSection('main-menu')}
                  className="font-bold text-xl text-white hover:text-orange-400 transition-colors cursor-pointer"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif' }}
                  aria-label="Ir al menú principal de HipotecaLab"
                  type="button"
                >
                  <span className="text-orange-500">H</span>Lab
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-slate-700 rounded-md transition-colors"
            aria-label={isMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
            type="button"
          >
            <Menu size={20} />
          </button>
        </header>
      )}

      {/* Menu Dropdown */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMenuOpen(false)}
          ></div>

          {/* Sidebar Menu */}
          <aside className="fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-slate-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out" role="navigation" aria-label="Menú de navegación lateral">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-4 pb-4 border-b border-slate-700" style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
                <h2 className="text-lg font-semibold text-white">Menú</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-slate-700 rounded-md transition-colors"
                  aria-label="Cerrar menú de navegación"
                  type="button"
                >
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Solo mostrar navegación principal y secciones si NO estamos en home */}
                {activeSection !== 'home' && (
                  <>
                    {/* Navegación Principal */}
                    <div className="p-4">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          setActiveSection('main-menu');
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-700 rounded-lg transition-colors"
                        aria-label="Ir al menú principal e inicio de la aplicación"
                        type="button"
                      >
                        <Home size={20} className="text-slate-400" />
                        <span className="text-white font-medium">Inicio</span>
                      </button>
                    </div>

                    {/* Separador */}
                    <div className="border-t border-slate-700 mx-4"></div>

                    {/* Navegación */}
                    <div className="p-4">
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-4">NAVEGACIÓN</h3>
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setActiveSection('simulator');
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${activeSection === 'simulator' ? 'bg-slate-700' : 'hover:bg-slate-700'
                            }`}
                          aria-label="Ir al simulador para calcular cuotas y costes totales de hipotecas"
                          type="button"
                        >
                          <Calculator size={18} className={activeSection === 'simulator' ? '' : 'text-slate-400'} style={activeSection === 'simulator' ? { color: '#F6EBD9' } : {}} />
                          <span className={activeSection === 'simulator' ? '' : 'text-white'} style={activeSection === 'simulator' ? { color: '#F6EBD9' } : {}}>Simulador</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setActiveSection('viability');
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${activeSection === 'viability' ? 'bg-slate-700' : 'hover:bg-slate-700'
                            }`}
                          aria-label="Ir al análisis de viabilidad para evaluar tu capacidad financiera"
                          type="button"
                        >
                          <TrendingUp size={18} className={activeSection === 'viability' ? '' : 'text-slate-400'} style={activeSection === 'viability' ? { color: '#F6EBD9' } : {}} />
                          <span className={activeSection === 'viability' ? '' : 'text-white'} style={activeSection === 'viability' ? { color: '#F6EBD9' } : {}}>Viabilidad</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setActiveSection('resources');
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${activeSection === 'resources' ? 'bg-slate-700' : 'hover:bg-slate-700'
                            }`}
                          aria-label="Ir a recursos para acceder a guías y conceptos clave"
                          type="button"
                        >
                          <BookOpen size={18} className={activeSection === 'resources' ? '' : 'text-slate-400'} style={activeSection === 'resources' ? { color: '#F6EBD9' } : {}} />
                          <span className={activeSection === 'resources' ? '' : 'text-white'} style={activeSection === 'resources' ? { color: '#F6EBD9' } : {}}>Recursos</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setActiveSection('learning');
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${activeSection === 'learning' ? 'bg-slate-700' : 'hover:bg-slate-700'
                            }`}
                          aria-label="Ir a la sección de aprendizaje con quiz y minijuegos educativos"
                          type="button"
                        >
                          <Brain size={18} className={activeSection === 'learning' ? '' : 'text-slate-400'} style={activeSection === 'learning' ? { color: '#F6EBD9' } : {}} />
                          <span className={activeSection === 'learning' ? '' : 'text-white'} style={activeSection === 'learning' ? { color: '#F6EBD9' } : {}}>Aprende</span>
                        </button>
                      </div>
                    </div>

                    {/* Separador */}
                    <div className="border-t border-slate-700 mx-4"></div>
                  </>
                )}

                {/* Información */}
                <div className="p-4">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-4">INFORMACIÓN</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsPrivacyModalOpen(true);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-700 rounded-lg transition-colors"
                      aria-label="Ver política de privacidad y protección de datos"
                      type="button"
                    >
                      <Shield size={18} className="text-slate-400" />
                      <span className="text-white">Política de Privacidad</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsTermsModalOpen(true);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-700 rounded-lg transition-colors"
                      aria-label="Ver términos de uso y condiciones de la aplicación"
                      type="button"
                    >
                      <FileText size={18} className="text-slate-400" />
                      <span className="text-white">Términos de Uso</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main id="main-content" className={(activeSection === 'home' || activeSection === 'main-menu') ? 'min-h-screen' : 'min-h-screen flex flex-col'}>
        <div className={(activeSection === 'home' || activeSection === 'main-menu') ? '' : 'flex-1 overflow-hidden'}>
          {renderActiveSection()}
        </div>

        {/* Bottom Navigation */}
        {(activeSection !== 'home' && activeSection !== 'main-menu') && (
          <nav
            className="bg-slate-800 border-t border-slate-700 px-2 pt-2 overflow-x-auto no-scrollbar"
            style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
            role="navigation"
            aria-label="Navegación principal de secciones"
          >
            <div className="flex justify-center items-center gap-1 w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
              {sections.map(({ id, label, icon: Icon }) => {
                const isActive = activeSection === id;

                return (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={`relative flex-shrink-0 flex flex-col items-center space-y-1 px-3 py-2 min-w-[70px] rounded-md transition-colors ${isActive
                      ? 'bg-slate-700/60'
                      : 'hover:bg-slate-700/40'
                      }`}
                    aria-label={`Ir a la sección ${label}`}
                    type="button"
                  >
                    {isActive && (
                      <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-orange-500" />
                    )}
                    <Icon
                      size={20}
                      className={isActive ? 'text-orange-400' : 'text-slate-400'}
                    />
                    <span className={`text-xs whitespace-nowrap ${isActive ? 'text-orange-400' : 'text-slate-400'}`}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </main>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Terms of Use Modal */}
      <TermsOfUseModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </div>
  );
}

export default App;
