import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { Menu, Home, Shield, FileText, ArrowLeft, X } from 'lucide-react';
import PrivacyPolicyModal from './features/legal/PrivacyPolicyModal';
import TermsOfUseModal from './features/legal/TermsOfUseModal';
import HomeScreen from './features/home/Home';
import MainMenu from './features/home/MainMenu';
import SectionBoundary from './shared/components/SectionBoundary';
import { NAVIGATION_SECTIONS } from './app/navigation';
import { useSectionNavigation } from './app/useSectionNavigation';

// Carga perezosa de secciones pesadas para reducir JS inicial
const Simulator = lazy(() => import('./features/simulator/Simulator'));
const Viability = lazy(() => import('./features/viability/Viability'));
const Resources = lazy(() => import('./features/resources/Resources'));
const Learning = lazy(() => import('./features/learning/Learning'));

const LoadingSpinner = () => (
  <div role="status" aria-live="polite" className="mx-auto max-w-4xl p-6">
    <p className="text-sm text-slate-300 mb-6">Preparando tu herramienta…</p>
    <div aria-hidden="true" className="space-y-5 animate-pulse">
      <div className="h-8 w-2/3 rounded-lg bg-slate-700" />
      <div className="h-52 rounded-2xl bg-slate-800" />
      <div className="h-12 rounded-xl bg-slate-700" />
    </div>
  </div>
);

function App() {
  const { activeSection, navigate: setActiveSection } = useSectionNavigation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.title = `${NAVIGATION_SECTIONS.find(section => section.id === activeSection)?.label ?? 'Inicio'} · HipotecaLab`;
    window.scrollTo(0, 0);
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [activeSection]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const trigger = menuTriggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const buttons = () => Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
    buttons()[0]?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
      if (event.key !== 'Tab') return;
      const items = buttons();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
      trigger?.focus();
    };
  }, [isMenuOpen]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeScreen onStart={() => setActiveSection('main-menu')} onOpenPrivacy={() => setIsPrivacyModalOpen(true)} onOpenTerms={() => setIsTermsModalOpen(true)} />;
      case 'main-menu':
        return <MainMenu onNavigate={setActiveSection} />;
      case 'simulator':
        return (
          <div className="relative overflow-hidden">
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
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand focus:text-white focus:rounded-md focus:no-underline"
        tabIndex={0}
      >
        Saltar al contenido principal
      </a>

      <header className="app-header">
        <div className="mx-auto max-w-5xl flex items-center justify-between gap-3">
          {activeSection !== 'home' && activeSection !== 'main-menu' ? (
            <button type="button" onClick={() => setActiveSection('main-menu')} className="flex items-center gap-2 text-sm font-medium px-2" aria-label="Volver al menú principal">
              <ArrowLeft size={20} aria-hidden="true" /> Menú principal
            </button>
          ) : (
            <img src="/icons/icon-master.svg" alt="HipotecaLab" className="h-12 w-20 object-cover" />
          )}
          <button ref={menuTriggerRef} onClick={() => setIsMenuOpen(true)} className="px-3 rounded-xl hover:bg-slate-700" aria-label="Abrir menú de navegación" aria-expanded={isMenuOpen} aria-controls="app-menu" type="button"><Menu size={22} /></button>
        </div>
      </header>

      {/* Menu Dropdown */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMenuOpen(false)}
          ></div>

          {/* Sidebar Menu */}
          <div ref={menuRef} id="app-menu" role="dialog" aria-modal="true" aria-label="Menú de navegación" className="fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-slate-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
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
                  <X size={20} aria-hidden="true" />
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
                              aria-current={isActive ? 'page' : undefined}
                    aria-label={`Ir a la sección ${label}`}
                              type="button"
                            >
                              <Icon size={18} className={isActive ? 'text-brand' : 'text-slate-400'} />
                              <span className={isActive ? 'text-brand' : 'text-white'}>{label}</span>
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
          </div>
        </>
      )}

      {/* Main Content */}
      <main id="main-content" tabIndex={-1} className={(activeSection === 'home' || activeSection === 'main-menu') ? 'min-h-screen' : 'app-content min-h-screen flex flex-col'}>
        <div className={(activeSection === 'home' || activeSection === 'main-menu') ? '' : 'flex-1 overflow-hidden'}>
          <SectionBoundary key={activeSection} onHome={() => setActiveSection('main-menu')}>{renderActiveSection()}</SectionBoundary>
        </div>

        {/* Bottom Navigation */}
        {(activeSection !== 'home' && activeSection !== 'main-menu') && (
          <nav
            className="bottom-nav"
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
                    className={`relative flex-1 min-w-0 flex flex-col items-center space-y-1 px-1 py-2 rounded-xl transition-colors ${isActive
                      ? 'bg-slate-700/60'
                      : 'hover:bg-slate-700/40'
                      }`}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={`Ir a la sección ${label}`}
                    type="button"
                  >
                    {isActive && (
                      <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-brand" />
                    )}
                    <Icon
                      size={20}
                      className={isActive ? 'text-brand' : 'text-slate-400'}
                    />
                    <span className={`text-xs whitespace-nowrap ${isActive ? 'text-brand' : 'text-slate-400'}`}>
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
