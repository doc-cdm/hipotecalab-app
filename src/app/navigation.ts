import { BookOpen, Brain, Calculator, TrendingUp, type LucideIcon } from 'lucide-react';

export type Section = 'simulator' | 'viability' | 'resources' | 'learning' | 'home' | 'main-menu';

export interface NavigationSection {
  id: Exclude<Section, 'home' | 'main-menu'>;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const NAVIGATION_SECTIONS: NavigationSection[] = [
  { id: 'simulator', label: 'Simulador', icon: Calculator, description: 'Juega con intereses, plazo y entrada' },
  { id: 'viability', label: 'Viabilidad', icon: TrendingUp, description: '¿Qué casa te puedes permitir?' },
  { id: 'resources', label: 'Recursos', icon: BookOpen, description: 'Entiende lo que te están diciendo' },
  { id: 'learning', label: 'Aprende', icon: Brain, description: 'Aprende sin que se te haga bola' },
];

