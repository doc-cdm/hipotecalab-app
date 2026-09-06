import { useState } from 'react';
import { Calculator, Check, ChevronDown, MessageCircle, Scale, Brain } from 'lucide-react';
import { calculateMonthlyPayment, calculateTotalInvestment } from '../../utils/calculations';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

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

const trustBadges = ['Gratis', 'Sin registro', 'Cálculos en tu dispositivo'];

/**
 * Ejemplo mostrado en la home. Usa los mismos inputs, el mismo motor de cálculo y
 * los mismos formateadores que el simulador, de modo que las cifras de la portada
 * no puedan desviarse nunca de las que el usuario verá dentro.
 *
 * Escenario: piso de 200.000 € con los gastos por defecto del simulador y una
 * aportación inicial que deja el préstamo justo en el 80% del precio.
 */
const exampleInputs = {
  propertyPrice: 200_000,
  initialContribution: 62_650,
  tin: 3,
  loanTerm: 30,
  costs: { appraisal: 350, notary: 1_200, agency: 500, registry: 600, taxRate: 10 },
};
const examplePrincipal =
  calculateTotalInvestment(exampleInputs.propertyPrice, exampleInputs.costs) - exampleInputs.initialContribution;
const exampleMonths = exampleInputs.loanTerm * 12;
const exampleMonthlyPayment = calculateMonthlyPayment(
  examplePrincipal,
  exampleInputs.tin / 100 / 12,
  exampleMonths
);
// Coincide al céntimo con la suma de la tabla de amortización que muestra el resumen,
// sin tener que generar aquí las 360 filas.
const exampleInterest = exampleMonthlyPayment * exampleMonths - examplePrincipal;
const exampleFinancedShare = (examplePrincipal / exampleInputs.propertyPrice) * 100;

const exampleFacts = [
  { label: 'Capital prestado', value: formatCurrency(examplePrincipal) },
  { label: 'TIN', value: formatPercentage(exampleInputs.tin) },
  { label: 'Plazo', value: `${exampleInputs.loanTerm} años` },
];

const exampleMetrics = [
  { label: 'Financiado', value: formatPercentage(exampleFinancedShare), color: 'text-brand' },
  { label: 'Cuota mensual', value: formatCurrency(exampleMonthlyPayment), color: 'text-green-400' },
  { label: 'Intereses totales', value: formatCurrency(exampleInterest), color: 'text-red-400' },
];

interface HomeProps {
  onStart: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

const ctaClass =
  'w-full py-4 bg-brand hover:bg-brand-hover active:scale-[0.98] text-slate-900 font-semibold rounded-2xl text-lg transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900';

const legalLinkClass =
  'underline text-brand hover:text-brand-hover transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900';

const Home = ({ onStart, onOpenPrivacy, onOpenTerms }: HomeProps) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
      <section className="welcome-screen min-h-screen bg-slate-900" aria-labelledby="welcome-heading">
        <div className="max-w-2xl mx-auto px-6 pt-10 pb-16">

          {/* Hero */}
          <div className="text-center mb-12">
            <h1
              id="welcome-heading"
              className="text-5xl md:text-6xl font-semibold text-white tracking-[-0.03em] leading-[1.05] mb-6 animate-fade-in-up"
            >
              <span className="text-brand">Hipoteca</span>Lab
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-3 animate-fade-in-up-delay-1">
              Entiende tu hipoteca. Decide con confianza.
            </p>
            <p className="text-base text-slate-400 leading-relaxed mb-8 animate-fade-in-up-delay-2">
              Simula, descubre tu presupuesto, consulta y aprende. Cuatro herramientas para acompañarte en la compra de tu casa.
            </p>

            {/* CTA principal */}
            <button onClick={() => onStart()} className={`${ctaClass} animate-fade-in-up-delay-3`} type="button">
              Explorar HipotecaLab
            </button>

            {/* Señales de confianza */}
            <ul className="flex flex-wrap justify-center gap-2 mt-5 animate-fade-in-up-delay-4">
              {trustBadges.map((badge) => (
                <li
                  key={badge}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/70 bg-slate-800/40 px-3 py-1.5 text-xs font-medium text-slate-300"
                >
                  <Check size={13} className="text-slate-400 flex-shrink-0" aria-hidden="true" />
                  {badge}
                </li>
              ))}
            </ul>
          </div>

          {/* Separador */}
          <div className="h-px bg-slate-800 mt-14 mb-14"></div>

          {/* Funcionalidades */}
          <div className="space-y-14">
            {/* Item 1 */}
            <div className="flex flex-col space-y-3">
              <MessageCircle size={32} className="text-slate-300" />
              <h2 className="text-xl font-bold text-white">Claridad</h2>
              <p className="text-slate-200 italic text-sm">
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
              <p className="text-slate-200 italic text-sm">
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
              <p className="text-slate-200 italic text-sm">
                "¿Y si cambio algo... qué pasa?"
              </p>
              <p className="text-slate-400 leading-relaxed">
                Juega con los plazos, los tipos de interés, la entrada. Ver cómo cada decisión afecta a los próximos 30 años de tu vida lo cambia todo.
              </p>
            </div>
            <div className="h-px bg-slate-800"></div>
            <div className="flex flex-col space-y-3">
              <Brain size={32} className="text-slate-300" aria-hidden="true" />
              <h2 className="text-xl font-bold text-white">Confianza</h2>
              <p className="text-slate-200 italic text-sm">"Quiero llegar al banco con las ideas claras"</p>
              <p className="text-slate-400 leading-relaxed">Pon a prueba lo que sabes con preguntas cortas, entiende cada respuesta y avanza a tu ritmo.</p>
            </div>
          </div>

          {/* Separador */}
          <div className="h-px bg-slate-800 mt-14 mb-14"></div>

          <details className="mb-10 rounded-2xl border border-slate-700 bg-slate-800/30 p-5">
            <summary className="cursor-pointer font-medium text-slate-200 py-2">Ver un ejemplo del simulador</summary>
            <div className="pt-5">
          {/* Muestra de producto: reproduce la presentación real del resumen del
              simulador (mismas tarjetas, mismos rótulos y mismo código de color).
              Se maqueta con <p>, no con <h2>/<h3>, para no ensuciar la jerarquía
              de encabezados de la página. */}
          <figure className="m-0">
            <figcaption className="text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Así se ve un resultado por dentro
            </figcaption>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
              <p className="text-lg font-bold text-brand mb-4">Resumen financiero</p>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                {exampleFacts.map((fact) => (
                  <div key={fact.label} className="bg-slate-700 rounded-lg p-3">
                    <div className="text-[11px] sm:text-xs text-slate-400 mb-1">{fact.label}</div>
                    <div className="text-sm sm:text-base font-semibold text-white">{fact.value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-sm font-semibold text-slate-200 mb-3">Métricas Clave</p>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {exampleMetrics.map((metric) => (
                    <div key={metric.label} className="text-center">
                      <div className={`text-base sm:text-xl font-bold mb-1 ${metric.color}`}>{metric.value}</div>
                      <div className="text-[11px] sm:text-sm text-slate-400">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Un piso de {formatCurrency(exampleInputs.propertyPrice)} financiado al 80% se lleva{' '}
              {formatCurrency(exampleInterest)} solo en intereses. Eso es justo lo que se mueve cuando cambias
              el plazo, el tipo o la entrada.
            </p>
          </figure>

            </div>
          </details>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">FAQ</h2>
            <p className="text-slate-400 text-sm mb-8">Aquí tienes respuestas a las preguntas más frecuentes.</p>

            <div>
              {faqItems.map((item, index) => {
                const isOpen = openFaqIndex === index;

                return (
                  <div key={index} className="border-b border-slate-800">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full text-left py-5 flex items-start justify-between gap-4 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${index}`}
                    >
                      <span className="text-white font-medium leading-snug">{item.question}</span>
                      <ChevronDown
                        size={18}
                        className={`text-slate-400 flex-shrink-0 mt-0.5 transition-transform duration-300 ease-out ${isOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                    {/* La rejilla 1fr/0fr permite animar la altura sin conocerla de antemano */}
                    <div
                      id={`faq-panel-${index}`}
                      aria-hidden={!isOpen}
                      className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                    >
                      <div className="overflow-hidden">
                        <div className="pb-5 space-y-3">
                          <p className="text-slate-400 text-sm leading-relaxed">{item.answer}</p>
                          {item.note && (
                            <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-slate-700 pl-3">
                              <span className="font-medium text-slate-300">Nota: </span>{item.note}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cierre: quien ha llegado hasta aquí es quien más cerca está de entrar */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-[-0.02em] mb-3">
              ¿Vamos con los números?
            </h2>
            <button onClick={() => onStart()} className={ctaClass} type="button">
              Explorar HipotecaLab
            </button>
          </div>

          {/* Pie legal */}
          <footer className="mt-16 pt-8 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400 leading-relaxed">
              Al usar HipotecaLab aceptas nuestros{' '}
              <button
                onClick={() => onOpenTerms()}
                className={legalLinkClass}
                aria-label="Ver términos de uso de la aplicación"
                type="button"
              >
                Términos de Uso
              </button>
              {' '}y confirmas que has leído nuestra{' '}
              <button
                onClick={() => onOpenPrivacy()}
                className={legalLinkClass}
                aria-label="Ver política de privacidad de la aplicación"
                type="button"
              >
                Política de Privacidad
              </button>
            </p>
          </footer>

        </div>
      </section>
    );
};

export default Home;
