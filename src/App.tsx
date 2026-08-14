import { useState, Suspense, lazy } from 'react';
import { Menu, Home, Shield, FileText } from 'lucide-react';
import PrivacyPolicyModal from './features/legal/PrivacyPolicyModal';
import TermsOfUseModal from './features/legal/TermsOfUseModal';
import HomeScreen from './features/home/Home';
import MainMenu from './features/home/MainMenu';
import FloatingParticles from './shared/components/FloatingParticles';
import { NAVIGATION_SECTIONS } from './app/navigation';
import { useSectionNavigation } from './app/useSectionNavigation';

// Carga perezosa de secciones pesadas para reducir JS inicial
const Simulator = lazy(() => import('./features/simulator/Simulator'));
const Viability = lazy(() => import('./features/viability/Viability'));
const Resources = lazy(() => import('./features/resources/Resources'));
const Learning = lazy(() => import('./features/learning/Learning'));

// Componente de loading optimizado
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-900">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-300 text-sm">Cargando...</p>
    </div>
  </div>
);

function App() {
  const { activeSection, navigate: setActiveSection } = useSectionNavigation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeScreen onStart={() => setActiveSection('main-menu')} onOpenPrivacy={() => setIsPrivacyModalOpen(true)} onOpenTerms={() => setIsTermsModalOpen(true)} />;
      case 'main-menu':
        return <MainMenu onNavigate={setActiveSection} />;
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
        return <HomeScreen onStart={() => setActiveSection('main-menu')} onOpenPrivacy={() => setIsPrivacyModalOpen(true)} onOpenTerms={() => setIsTermsModalOpen(true)} />;
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
                        {NAVIGATION_SECTIONS.map(({ id, label, icon: Icon }) => {
                          const isActive = activeSection === id;
                          return (
                            <button
                              key={id}
                              onClick={() => {
                                setIsMenuOpen(false);
                                setActiveSection(id);
                              }}
                              className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${isActive ? 'bg-slate-700' : 'hover:bg-slate-700'}`}
                              aria-label={`Ir a la sección ${label}`}
                              type="button"
                            >
                              <Icon size={18} className={isActive ? 'text-orange-100' : 'text-slate-400'} />
                              <span className={isActive ? 'text-orange-100' : 'text-white'}>{label}</span>
                            </button>
                          );
                        })}
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
              {NAVIGATION_SECTIONS.map(({ id, label, icon: Icon }) => {
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
