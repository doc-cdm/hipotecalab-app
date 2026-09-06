import { X } from 'lucide-react';
import type { LegalSection } from './legalText';

interface TermsOfUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LAST_UPDATED = '13 de agosto de 2026';
const TERMS_VERSION = '2.0';

const termsSections: LegalSection[] = [
  {
    title: '1. Titular y ámbito de los términos',
    paragraphs: [
      'HipotecaLab, con domicilio a estos efectos en Madrid (España) y correo electrónico cdominguezmonferrer@gmail.com, ofrece una aplicación móvil y web de carácter informativo y educativo.',
      'Estos términos regulan el acceso y uso de HipotecaLab. Al utilizar la aplicación aceptas estos términos. Si no estás de acuerdo, no debes continuar utilizándola. La aplicación está dirigida a personas mayores de 18 años.',
    ],
  },
  {
    title: '2. Descripción del servicio',
    paragraphs: [
      'HipotecaLab es una herramienta gratuita que funciona sin registro ni cuenta de usuario. Actualmente ofrece las siguientes funciones:',
    ],
    bullets: [
      'Simulación de préstamos hipotecarios a tipo fijo mediante el sistema de amortización francés, incluyendo cuotas, costes y tablas de amortización.',
      'Estimaciones de viabilidad a partir de ingresos, tasa de endeudamiento, tipo de interés, plazo, ubicación y tipo de vivienda.',
      'Contenidos educativos, glosario, guías y cuestionarios sobre hipotecas y compraventa de vivienda.',
      'Exportación local de determinadas simulaciones en PDF o formato de hoja de cálculo.',
    ],
  },
  {
    title: '3. Naturaleza informativa: no es asesoramiento ni una oferta',
    paragraphs: [
      'HipotecaLab no es una entidad de crédito, intermediario de crédito inmobiliario, asesor financiero, fiscal, jurídico o inmobiliario. No concede préstamos, no tramita solicitudes, no compara ofertas individualizadas y no actúa en nombre de bancos u otras entidades.',
      'Los resultados, explicaciones y recomendaciones generales son orientativos. No constituyen una oferta, aprobación, tasación, FEIN, FiAE, recomendación personalizada ni garantía de que una entidad vaya a concederte financiación en un importe o condiciones determinados.',
      'Antes de asumir compromisos económicos o jurídicos, contrasta la información con la documentación oficial y solicita asesoramiento profesional adaptado a tu situación.',
    ],
  },
  {
    title: '4. Cálculos, supuestos y exactitud',
    bullets: [
      'Los cálculos dependen de la exactitud y actualidad de los datos que introduces. Eres responsable de revisarlos antes de utilizarlos para tomar decisiones.',
      'Las cuotas y tablas se basan en modelos matemáticos y supuestos simplificados. Pueden no incluir comisiones, seguros, bonificaciones, productos vinculados, redondeos bancarios, cambios de tipos u otras condiciones contractuales.',
      'Los impuestos, gastos de compraventa, porcentajes de financiación y referencias normativas pueden variar según la fecha, territorio, inmueble y circunstancias personales.',
      'La TAE introducida o mostrada no sustituye a la calculada por una entidad conforme a la normativa y a los costes efectivos de una oferta concreta.',
      'La decisión final y las condiciones aplicables corresponden al prestamista y a los documentos contractuales que, en su caso, recibas.',
    ],
  },
  {
    title: '5. Uso permitido',
    paragraphs: [
      'Te concedemos un derecho personal, limitado, no exclusivo, revocable y no transferible para utilizar HipotecaLab con fines lícitos, principalmente personales y educativos.',
      'No debes:',
    ],
    bullets: [
      'Usar la aplicación para cometer fraudes, infringir derechos de terceros o incumplir la normativa aplicable.',
      'Interferir con su funcionamiento, introducir código malicioso, eludir medidas de seguridad o intentar acceder sin autorización a sistemas relacionados.',
      'Realizar solicitudes automatizadas que degraden o sobrecarguen el servicio.',
      'Copiar, explotar comercialmente o redistribuir de forma sustancial la aplicación o sus contenidos, salvo autorización o cuando la ley lo permita.',
      'Presentar los resultados como una oferta bancaria, aprobación de financiación o asesoramiento profesional emitido por HipotecaLab.',
    ],
  },
  {
    title: '6. Tus datos, archivos y dispositivo',
    paragraphs: [
      'La aplicación no permite publicar contenido ni compartirlo con otros usuarios. Los datos de las calculadoras se procesan en tu dispositivo y los archivos exportados quedan bajo tu control. Eres responsable de proteger, revisar y conservar las copias que generes.',
      'El progreso del módulo Aprende y ciertos recursos técnicos se guardan localmente. Borrar los datos del navegador o de la aplicación, cambiar de dispositivo o desinstalarla puede eliminar ese progreso. Consulta la Política de Privacidad para conocer el tratamiento de datos con más detalle.',
    ],
  },
  {
    title: '7. Propiedad intelectual',
    paragraphs: [
      'La aplicación, su diseño, código, marca, textos, estructura y contenidos pertenecen a HipotecaLab o se utilizan bajo las licencias correspondientes. Estos términos no transfieren derechos de propiedad intelectual, salvo el derecho limitado de uso descrito anteriormente.',
      'Las bibliotecas y componentes de terceros se rigen por sus propias licencias. Puedes utilizar para fines personales los documentos que generes con tus propios datos, sin que ello te otorgue derechos sobre la aplicación o sus contenidos de base.',
    ],
  },
  {
    title: '8. Disponibilidad, cambios y finalización',
    paragraphs: [
      'Intentamos mantener HipotecaLab disponible y actualizada, pero pueden producirse interrupciones, errores, mantenimiento o incompatibilidades. No garantizamos una disponibilidad continua ni que todas las funciones sean compatibles con cualquier dispositivo.',
      'Podemos corregir, actualizar, añadir o retirar funciones por motivos técnicos, legales o de seguridad. Si en el futuro una función pasara a ser de pago, se informaría de sus condiciones y precio antes de contratarla; el uso actual no genera por sí solo ningún cargo.',
      'Podemos restringir el acceso cuando sea razonablemente necesario para proteger el servicio, cumplir la ley o responder a un uso abusivo. Puedes dejar de usar la aplicación en cualquier momento y eliminarla de tu dispositivo.',
    ],
  },
  {
    title: '9. Enlaces y servicios de terceros',
    paragraphs: [
      'HipotecaLab puede incluir enlaces a páginas o recursos externos. Al abrirlos abandonas nuestro entorno y pasan a aplicarse las condiciones y políticas del tercero. No controlamos su disponibilidad, exactitud o contenido, aunque ello no limita la responsabilidad que legalmente pudiera correspondernos.',
    ],
  },
  {
    title: '10. Responsabilidad y derechos de consumidores',
    paragraphs: [
      'Utiliza HipotecaLab como apoyo y no como única base para una decisión financiera, fiscal, jurídica o inmobiliaria. HipotecaLab no responde de decisiones tomadas a partir de datos incorrectos introducidos por el usuario, de condiciones decididas por terceros o de acontecimientos fuera de nuestro control razonable.',
      'Nada en estos términos excluye o limita de forma indebida los derechos imperativos de consumidores y usuarios ni la responsabilidad que no pueda excluirse conforme a la ley, incluida la derivada de dolo, fraude, lesiones o daños causados por una acción u omisión cuando legalmente corresponda.',
    ],
  },
  {
    title: '11. Modificación de estos términos',
    paragraphs: [
      'Podemos actualizar estos términos para reflejar cambios en la aplicación, en la normativa o por razones de seguridad. La versión revisada se aplicará desde la fecha indicada al inicio y no tendrá efectos retroactivos en perjuicio de los derechos adquiridos. Cuando un cambio sea relevante, procuraremos comunicarlo de forma visible en la aplicación.',
    ],
  },
  {
    title: '12. Legislación aplicable y resolución de conflictos',
    paragraphs: [
      'Estos términos se rigen por la legislación española, sin privarte de la protección obligatoria que pudiera corresponderte conforme a la normativa de tu lugar de residencia.',
      'Cualquier controversia se someterá a los juzgados y tribunales que resulten competentes según la normativa aplicable. Si actúas como consumidor, no se impone una sumisión exclusiva a tribunales distintos de los que te correspondan legalmente.',
    ],
  },
  {
    title: '13. Disposiciones generales',
    paragraphs: [
      'Si una disposición se declara inválida o inaplicable, se interpretará o sustituirá en la medida necesaria y el resto continuará vigente. La falta de ejercicio de un derecho no supone una renuncia al mismo.',
    ],
  },
];

const TermsOfUseModal = ({ isOpen, onClose }: TermsOfUseModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-of-use-title"
    >
      <div
        className="bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-700"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 id="terms-of-use-title" className="text-xl font-bold text-white">Términos de Uso</h2>
            <p className="text-sm text-slate-400 mt-1">
              HipotecaLab · Actualizados el {LAST_UPDATED} · Versión {TERMS_VERSION}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Cerrar términos de uso"
              type="button"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p className="text-base">
              Lee estos términos antes de utilizar HipotecaLab. Describen el servicio, sus límites y las reglas
              aplicables a su uso.
            </p>

            {termsSections.map((section) => (
              <section key={section.title}>
                <h3 className="text-lg font-semibold text-white mb-3">{section.title}</h3>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mb-3 last:mb-0">{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul className="list-disc space-y-2 ml-6">
                    {section.bullets.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                )}
              </section>
            ))}

            <section className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
              <h3 className="text-lg font-semibold text-white mb-3">Contacto</h3>
              <p><strong>HipotecaLab</strong></p>
              <p>Madrid, España</p>
              <p>
                Email:{' '}
                <a href="mailto:cdominguezmonferrer@gmail.com" className="text-brand hover:text-brand-hover underline">
                  cdominguezmonferrer@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>

        <div className="p-6 border-t border-slate-700 flex justify-between items-center gap-4">
          <p className="text-xs text-slate-400">Condiciones aplicables al uso de HipotecaLab.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            type="button"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUseModal;
