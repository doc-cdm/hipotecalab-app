import { ArrowUpRight } from 'lucide-react';
import { NAVIGATION_SECTIONS, type Section } from '../../app/navigation';

interface MainMenuProps {
  onNavigate: (section: Section) => void;
}

const objectives = {
  simulator: { title: 'Pon números a tu casa', detail: 'Explora cuotas, gastos y plazos.', action: 'Abrir simulador' },
  viability: { title: 'Encuentra tu presupuesto', detail: 'Descubre qué encaja con tus ingresos.', action: 'Ver mi viabilidad' },
  resources: { title: 'Entiende cada término', detail: 'Consulta conceptos y la guía de compra.', action: 'Explorar recursos' },
  learning: { title: 'Gana confianza practicando', detail: 'Resuelve preguntas y descubre lo que sabes.', action: 'Empezar a aprender' },
};

export default function MainMenu({ onNavigate }: MainMenuProps) {
  return (
    <section className="menu-screen" aria-labelledby="main-menu-heading">
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-7 sm:mb-10">
          <h1 id="main-menu-heading" className="text-[26px] sm:text-4xl font-semibold tracking-tight leading-tight">Tu próxima casa empieza<br className="hidden sm:block" /> con una buena decisión.</h1>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          {NAVIGATION_SECTIONS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => onNavigate(id)} className="tool-card group" type="button" aria-label={`${label}: ${objectives[id].action}`}>
              <span className="flex items-center justify-between gap-2">
                <span className="brand-icon"><Icon size={24} aria-hidden="true" /></span>
                <span className="text-[11px] sm:text-xs font-medium text-slate-400">{label}</span>
              </span>
              <span className="block mt-4 text-base sm:text-lg font-semibold text-white">{objectives[id].title}</span>
              <span className="block mt-2 mb-4 text-[13px] sm:text-sm leading-relaxed text-slate-300">{objectives[id].detail}</span>
              <span className="flex items-center justify-between mt-auto gap-2 text-[13px] sm:text-sm font-semibold text-brand">{objectives[id].action}<ArrowUpRight size={18} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
