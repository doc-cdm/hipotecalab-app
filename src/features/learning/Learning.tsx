import type { FC } from 'react';
import { BookOpen, X } from 'lucide-react';
import { achievements } from './achievements';
import { useLearning } from './useLearning';

const Learning: FC = () => {
  const {
    progress,
    preguntaActual,
    respuestaUsuario,
    resultado,
    mostrarExplicacion,
    mostrarLogros,
    setMostrarLogros,
    achievementQueue,
    responderQuiz,
    siguiente,
    resetProgress,
    ratioAcierto,
    progresoNivel,
  } = useLearning();

  const renderContenido = () => {
    if (!preguntaActual) return <div className="text-center py-8"><BookOpen size={28} className="mx-auto mb-3 text-blue-200" aria-hidden="true" /><h3 className="text-lg font-semibold">No hay una pregunta disponible</h3><p className="my-3 text-sm text-slate-300">Vuelve a intentarlo para seguir practicando.</p><button type="button" className="primary-button" onClick={siguiente}>Buscar otra pregunta</button></div>;
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4 leading-relaxed">{preguntaActual.pregunta}</h3>
        <div className="space-y-3">
          {preguntaActual.opciones.map((op, i) => {
            const isSelected = respuestaUsuario === i;
            const isCorrect = resultado && i === preguntaActual.correcta;
            const isWrong = resultado && isSelected && !isCorrect;
            return (
              <button
                key={i}
                onClick={() => responderQuiz(i)}
                disabled={!!resultado}
                className={`w-full text-left px-4 py-3 rounded-md border transition-all duration-200 ${
                  isCorrect ? 'border-green-500 bg-green-500/10 text-green-100' :
                  isWrong ? 'border-red-500 bg-red-500/10 text-red-100' :
                  isSelected ? 'border-brand bg-brand/10' :
                  'border-slate-600 hover:border-brand-hover/60 hover:bg-slate-700/50'
                } ${resultado ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span className="block leading-relaxed">{op}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto p-4 space-y-4">
      <div className="pt-3 pb-2"><p className="brand-eyebrow mb-2">APRENDE A TU RITMO</p><h1 className="text-2xl font-semibold">Cada pregunta, más confianza</h1><p className="mt-2 text-sm text-slate-300">Elige una respuesta y descubre el porqué. Equivocarse también cuenta como aprender.</p></div>
      {/* Notificaciones de logros */}
      <div className="fixed top-4 right-4 z-50 flex flex-col space-y-3 w-72 pointer-events-none">
        {achievementQueue.slice(0,2).map((ach, idx) => (
          <div
            key={ach.id}
            className={`relative group overflow-hidden rounded-xl border border-slate-600/70 bg-slate-900/80 backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_8px_24px_-6px_rgba(0,0,0,0.5)] px-4 py-3 animate-[fadeIn_0.4s_ease] ${idx===0 ? 'ring-1 ring-brand/40' : ''}`}
            style={{ backgroundImage: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(15,23,42,0.4))' }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{background:'radial-gradient(circle at 85% 15%, rgba(246,235,217,0.15), transparent 60%)'}}
            />
            <div className="flex items-start space-x-3 relative">
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-slate-800/70 border border-slate-600 flex items-center justify-center shadow-inner">
                  <ach.icono size={20} className="text-brand drop-shadow-[0_0_4px_rgba(249,115,22,0.6)] animate-pulse" />
                </div>
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-br from-brand/30 to-transparent blur opacity-40 group-hover:opacity-70 transition" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] tracking-wide uppercase text-slate-400 font-medium mb-0.5 flex items-center space-x-1">
                  <span>Logro desbloqueado</span>
                  <span className="inline-block w-1 h-1 rounded-full bg-brand animate-ping" />
                </div>
                <div className="text-sm font-semibold text-slate-100 leading-snug">{ach.nombre}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 leading-snug line-clamp-2">{ach.descripcion}</div>
                <div className="mt-2 h-1.5 bg-slate-700/60 rounded overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand via-brand to-brand animate-[progress_3.2s_linear]" />
                </div>
              </div>
            </div>
            <div className="absolute -top-8 -right-8 w-24 h-24 opacity-10 rotate-45 bg-gradient-to-br from-brand to-transparent rounded-xl" />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform: translateY(-6px) scale(.96);} to { opacity:1; transform: translateY(0) scale(1);} }
        @keyframes progress { from { width:0%; } to { width:100%; } }
      `}</style>

      {/* Panel de estadísticas */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 flex flex-col">
          <span className="text-xs font-medium text-slate-400">Nivel</span>
          <div className="flex items-end justify-between mt-1">
            <span className="text-2xl font-bold text-brand-cream">{progress.nivel}</span>
            <span className="text-[11px] text-slate-400">XP {progress.xp}</span>
          </div>
          <div className="mt-2 h-2 bg-slate-700 rounded"><div className="h-full rounded bg-gradient-to-r from-brand to-brand-cream" style={{ width: `${progresoNivel}%` }}></div></div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 flex flex-col">
          <span className="text-xs font-medium text-slate-400">Rendimiento</span>
          <div className="flex items-end justify-between mt-1">
            <span className="text-2xl font-bold text-green-400">{ratioAcierto}%</span>
            <span className="text-[11px] text-slate-400">{progress.aciertos}/{progress.respondidas}</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">Racha: {progress.streak}</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 flex flex-col">
          <span className="text-xs font-medium text-slate-400">Logros</span>
          <div className="flex items-end justify-between mt-1">
            <span className="text-2xl font-bold text-brand">{progress.achievements.length}</span>
            <span className="text-[11px] text-slate-400">/{achievements.length}</span>
          </div>
          <button onClick={() => setMostrarLogros(!mostrarLogros)} className="mt-2 text-[11px] text-brand underline hover:text-brand-hover">Ver logros</button>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 flex flex-col">
          <span className="text-xs font-medium text-slate-400">Histórico (últ. 10)</span>
          <div className="mt-2 flex flex-wrap gap-1">{progress.historico.length === 0 && <span className="text-xs text-slate-400">Tu primera respuesta empieza el historial.</span>}{progress.historico.slice(-10).map((entry, index) => <span key={`${entry.id}-${index}`} className={`w-3 h-3 rounded-sm ${entry.correcta ? 'bg-green-500' : 'bg-red-500'}`}></span>)}</div>
          <button onClick={() => { if (confirm('¿Reiniciar progreso?')) resetProgress(); }} className="mt-auto text-[10px] text-slate-400 underline hover:text-brand-hover">Reiniciar</button>
        </div>
      </div>

      {/* Panel de logros */}
      {mostrarLogros && (
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Logros</h3>
            <button onClick={() => setMostrarLogros(false)} aria-label="Cerrar logros" className="px-3 text-slate-400 hover:text-white"><X size={20} /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {achievements.map(logro => {
              const desbloqueado = progress.achievements.includes(logro.id);
              return (
                <div key={logro.id} className={`flex items-center space-x-3 p-3 rounded-lg border ${desbloqueado ? 'border-brand/50 bg-brand/10' : 'border-slate-600 bg-slate-700/30'}`}>
                  <logro.icono size={20} className={desbloqueado ? 'text-brand' : 'text-slate-500'} />
                  <div>
                    <div className={`font-medium text-sm ${desbloqueado ? 'text-brand' : 'text-slate-400'}`}>{logro.nombre}</div>
                    <div className={`text-xs ${desbloqueado ? 'text-brand' : 'text-slate-500'}`}>{logro.descripcion}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto bg-slate-800/40 border border-slate-700 rounded-xl p-6">
        {renderContenido()}
        {resultado && preguntaActual && (
          <div role="status" className="mt-6 p-5 rounded-lg border text-sm" style={{borderColor: resultado.correcta ? '#15803d' : '#7f1d1d', backgroundColor: resultado.correcta ? 'rgba(34,197,94,0.08)' : 'rgba(248,113,113,0.08)'}}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-base">{resultado.mensaje}</span>
              <span className="text-xs text-slate-400">+{resultado.puntos} XP</span>
            </div>
            {mostrarExplicacion && preguntaActual.explicacion && (
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-md p-4 mb-4">
                <h4 className="font-medium text-slate-200 mb-2">Explicación:</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{preguntaActual.explicacion}</p>
              </div>
            )}
            <button onClick={siguiente} className="primary-button w-full sm:w-auto">
              Siguiente pregunta
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Learning;
