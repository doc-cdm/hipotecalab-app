import { Activity, Award, BadgeCheck, Flame, Rocket, Star, Target, Trophy, Zap } from 'lucide-react';
import type { Achievement } from './types';

export const achievements: Achievement[] = [
  { id: 'primera_pregunta', nombre: 'Primer Paso', descripcion: 'Responde tu primera pregunta', icono: Star, condicion: (p) => p.respondidas >= 1 },
  { id: 'racha_5', nombre: 'En Racha', descripcion: 'Consigue 5 respuestas correctas seguidas', icono: Target, condicion: (p) => p.streak >= 5 },
  { id: 'nivel_2', nombre: 'Subiendo', descripcion: 'Alcanza el nivel 2', icono: Trophy, condicion: (p) => p.nivel >= 2 },
  { id: 'experto_categoria', nombre: 'Especialista', descripcion: 'Responde 20 preguntas correctas', icono: Award, condicion: (p) => p.aciertos >= 20 },
  { id: 'veterano', nombre: 'Veterano', descripcion: 'Responde 50 preguntas en total', icono: Trophy, condicion: (p) => p.respondidas >= 50 },
  { id: 'nivel_5', nombre: 'Experto', descripcion: 'Alcanza el nivel 5', icono: Award, condicion: (p) => p.nivel >= 5 },
  { id: 'racha_10', nombre: 'Imparable', descripcion: 'Consigue 10 respuestas correctas seguidas', icono: Target, condicion: (p) => p.streak >= 10 },
  { id: 'maestro', nombre: 'Maestro', descripcion: 'Responde 100 preguntas en total', icono: Trophy, condicion: (p) => p.respondidas >= 100 },
  { id: 'preciso_50', nombre: 'Preciso', descripcion: '50% acierto tras 20 preguntas', icono: Activity, condicion: (p) => p.respondidas >= 20 && (p.aciertos / Math.max(1,p.respondidas)) >= 0.5 },
  { id: 'preciso_70', nombre: 'Sniper', descripcion: '70% acierto tras 30 preguntas', icono: Zap, condicion: (p) => p.respondidas >= 30 && (p.aciertos / Math.max(1,p.respondidas)) >= 0.7 },
  { id: 'preciso_85', nombre: 'Cirujano', descripcion: '85% acierto tras 40 preguntas', icono: BadgeCheck, condicion: (p) => p.respondidas >= 40 && (p.aciertos / Math.max(1,p.respondidas)) >= 0.85 },
  { id: 'nivel_10', nombre: 'Ascenso', descripcion: 'Alcanza el nivel 10', icono: Rocket, condicion: (p) => p.nivel >= 10 },
  { id: 'racha_15', nombre: 'Leyenda Viva', descripcion: '15 aciertos seguidos', icono: Flame, condicion: (p) => p.streak >= 15 },
  { id: 'xp_10000', nombre: 'Alto Voltaje', descripcion: 'Acumula 10.000 XP', icono: Zap, condicion: (p) => p.xp >= 10000 },
];

