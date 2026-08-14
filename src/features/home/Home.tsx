import { useState } from 'react';
import { Calculator, ChevronDown, MessageCircle, Scale } from 'lucide-react';

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

interface HomeProps {
  onStart: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

const Home = ({ onStart, onOpenPrivacy, onOpenTerms }: HomeProps) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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
              onClick={() => onStart()}
              className="w-full py-4 bg-black hover:bg-gray-900 text-white font-semibold rounded-2xl transition-colors duration-200 text-lg mb-4"
            >
              Probar <span className="text-orange-500">Hipoteca</span>Lab
            </button>
            <p className="text-xs text-slate-500">
              Al continuar, aceptas nuestros{' '}
              <button
                onClick={() => onOpenTerms()}
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
                onClick={() => onOpenPrivacy()}
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

export default Home;

