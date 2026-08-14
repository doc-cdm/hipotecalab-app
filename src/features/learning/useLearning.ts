import { useEffect, useState } from 'react';
import { achievements } from './achievements';
import { questions } from './questions';
import type { Achievement, ProgressState, Question } from './types';

const STORAGE_KEY = 'learningProgress';
const INITIAL_PROGRESS: ProgressState = {
  xp: 0,
  nivel: 1,
  streak: 0,
  respondidas: 0,
  aciertos: 0,
  historico: [],
  achievements: [],
  preguntasUsadas: [],
};

const getDifficultyMultiplier = (difficulty: Question['dificultad']): number =>
  difficulty === 'facil' ? 1 : difficulty === 'media' ? 1.5 : 2;

const getLevel = (xp: number): number => Math.floor(xp / 1_000) + 1;

const selectQuestion = (usedQuestionIds: string[]): Question | null => {
  const unusedQuestions = questions.filter((question) => !usedQuestionIds.includes(question.id));
  const availableQuestions = unusedQuestions.length > 0 ? unusedQuestions : questions;
  return availableQuestions[Math.floor(Math.random() * availableQuestions.length)] ?? null;
};

const loadProgress = (): ProgressState => {
  try {
    const rawProgress = localStorage.getItem(STORAGE_KEY);
    if (!rawProgress) return INITIAL_PROGRESS;

    const savedProgress = JSON.parse(rawProgress) as Partial<ProgressState> & { logros?: string[] };
    return {
      ...INITIAL_PROGRESS,
      ...savedProgress,
      achievements: savedProgress.achievements ?? savedProgress.logros ?? [],
      preguntasUsadas: savedProgress.preguntasUsadas ?? [],
    };
  } catch {
    return INITIAL_PROGRESS;
  }
};

export const useLearning = () => {
  const [progress, setProgress] = useState<ProgressState>(loadProgress);
  const [preguntaActual, setPreguntaActual] = useState<Question | null>(() =>
    selectQuestion(progress.preguntasUsadas)
  );
  const [respuestaUsuario, setRespuestaUsuario] = useState<number | null>(null);
  const [resultado, setResultado] = useState<{ correcta: boolean; puntos: number; mensaje: string } | null>(null);
  const [mostrarExplicacion, setMostrarExplicacion] = useState(false);
  const [mostrarLogros, setMostrarLogros] = useState(false);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    if (achievementQueue.length === 0) return;
    const timer = globalThis.setTimeout(() => {
      setAchievementQueue((queue) => queue.slice(1));
    }, 3_500);
    return () => globalThis.clearTimeout(timer);
  }, [achievementQueue]);

  const nuevaPregunta = () => {
    setResultado(null);
    setRespuestaUsuario(null);
    setMostrarExplicacion(false);

    const unusedQuestions = questions.filter((question) =>
      !progress.preguntasUsadas.includes(question.id)
    );

    if (unusedQuestions.length === 0) {
      setProgress((current) => ({ ...current, preguntasUsadas: [] }));
      setPreguntaActual(selectQuestion([]));
      return;
    }

    setPreguntaActual(selectQuestion(progress.preguntasUsadas));
  };

  const registrarResultado = (correcta: boolean, puntosBase: number): number => {
    const streak = correcta ? progress.streak + 1 : 0;
    const bonusStreak = correcta ? Math.min(streak * 0.1, 0.5) : 0;
    const puntos = Math.round(puntosBase * (1 + bonusStreak));
    const xp = progress.xp + puntos;
    const nivel = getLevel(xp);
    const aciertos = progress.aciertos + (correcta ? 1 : 0);
    const respondidas = progress.respondidas + 1;
    const historico = [
      ...progress.historico.slice(-49),
      { id: preguntaActual?.id ?? 'unknown', correcta, puntos },
    ];
    const preguntasUsadas = preguntaActual
      ? [...progress.preguntasUsadas, preguntaActual.id]
      : progress.preguntasUsadas;

    const nuevosLogros = achievements
      .filter((achievement) => !progress.achievements.includes(achievement.id))
      .filter((achievement) => achievement.condicion({
        xp,
        nivel,
        streak,
        aciertos,
        respondidas,
        historico,
        achievements: progress.achievements,
        preguntasUsadas,
      }))
      .map((achievement) => achievement.id);

    const unlockedAchievements = nuevosLogros
      .map((id) => achievements.find((achievement) => achievement.id === id))
      .filter((achievement): achievement is Achievement => Boolean(achievement));

    if (unlockedAchievements.length > 0) {
      setAchievementQueue((queue) => [...queue, ...unlockedAchievements]);
    }

    setProgress({
      xp,
      nivel,
      streak,
      aciertos,
      respondidas,
      historico,
      achievements: [...progress.achievements, ...nuevosLogros],
      preguntasUsadas,
    });

    return puntos;
  };

  const responderQuiz = (index: number) => {
    if (!preguntaActual || resultado) return;
    const correcta = index === preguntaActual.correcta;
    const puntos = registrarResultado(
      correcta,
      100 * getDifficultyMultiplier(preguntaActual.dificultad)
    );
    setRespuestaUsuario(index);
    setResultado({ correcta, puntos, mensaje: correcta ? '¡Correcto!' : 'Incorrecto' });
    setMostrarExplicacion(true);
  };

  return {
    progress,
    preguntaActual,
    respuestaUsuario,
    resultado,
    mostrarExplicacion,
    mostrarLogros,
    setMostrarLogros,
    achievementQueue,
    responderQuiz,
    siguiente: nuevaPregunta,
    resetProgress: () => setProgress(INITIAL_PROGRESS),
    ratioAcierto: progress.respondidas
      ? Math.round((progress.aciertos / progress.respondidas) * 100)
      : 0,
    progresoNivel: Math.min(100, Math.round(((progress.xp % 1_000) / 1_000) * 100)),
  };
};
