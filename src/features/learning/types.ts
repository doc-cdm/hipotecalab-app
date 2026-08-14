import type { LucideIcon } from 'lucide-react';

export interface BaseQuestion {
  id: string;
  dificultad: 'facil' | 'media' | 'dificil';
  explicacion?: string;
}

export interface QuizQuestion extends BaseQuestion {
  tipo: 'quiz';
  pregunta: string;
  opciones: string[];
  correcta: number;
}

export type Question = QuizQuestion;

export interface ProgressState {
  xp: number;
  nivel: number;
  streak: number;
  respondidas: number;
  aciertos: number;
  historico: Array<{ id: string; correcta: boolean; puntos: number }>;
  achievements: string[];
  preguntasUsadas: string[];
}

export interface Achievement {
  id: string;
  nombre: string;
  descripcion: string;
  icono: LucideIcon;
  condicion: (progress: ProgressState) => boolean;
}
