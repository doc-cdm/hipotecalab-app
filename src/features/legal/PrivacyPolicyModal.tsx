import { X } from 'lucide-react';
import type { LegalSection } from './legalText';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LAST_UPDATED = '13 de agosto de 2026';
const POLICY_VERSION = '2.0';

const policySections: LegalSection[] = [
  {
    title: '1. Responsable y ámbito de esta política',
    paragraphs: [
      'HipotecaLab, con domicilio a estos efectos en Madrid (España), es responsable de los tratamientos que se describen en esta política. Puedes contactar en cdominguezmonferrer@gmail.com.',
      'Esta política se aplica a la aplicación móvil de HipotecaLab y a su versión web. HipotecaLab es una herramienta informativa que funciona sin registro ni cuenta de usuario.',
    ],
  },
  {
    title: '2. Información que utiliza la aplicación',
    paragraphs: [
      'HipotecaLab utiliza los datos que introduces para realizar los cálculos solicitados. No te pedimos nombre real, correo electrónico, teléfono, documento de identidad, datos bancarios ni credenciales de acceso.',
    ],
    bullets: [
      'Simulador hipotecario: nombre o etiqueta opcional de la simulación; precio del inmueble; tasación; notaría; gestoría; registro; tipo impositivo; aportación inicial; TIN; TAE; fecha de inicio; plazo; gastos mensuales adicionales y los resultados calculados, incluida la tabla de amortización.',
      'Cálculo de viabilidad: ingresos netos mensuales; tasa de endeudamiento; TIN; plazo; comunidad autónoma; indicación de vivienda nueva o usada y los importes estimados resultantes.',
      'Módulo Aprende: respuestas, preguntas utilizadas, aciertos, racha, experiencia, nivel, historial y logros. Estos datos representan progreso de uso y no identifican por sí solos a una persona.',
      'Datos técnicos de la versión web: al solicitar los archivos de la aplicación, el proveedor de alojamiento puede recibir datos habituales de conexión, como la dirección IP, fecha y hora, recurso solicitado, navegador o sistema operativo y registros de seguridad.',
    ],
  },
  {
    title: '3. Dónde se tratan y guardan los datos',
    bullets: [
      'Los datos del simulador y de viabilidad se procesan en tu dispositivo y se mantienen únicamente en la memoria de la aplicación durante la sesión. No se guardan en una cuenta ni se envían deliberadamente a HipotecaLab.',
      'El progreso de Aprende se guarda en el almacenamiento local de tu navegador o de la aplicación (localStorage) para que puedas recuperarlo al volver.',
      'La aplicación guarda en el dispositivo archivos técnicos y recursos estáticos mediante la caché del navegador o de la PWA para permitir una carga más rápida y, cuando esté disponible, el uso sin conexión.',
      'Cuando exportas una simulación, el PDF o la hoja de cálculo se generan localmente y se guardan o comparten solo mediante las opciones que elijas en tu dispositivo.',
    ],
  },
  {
    title: '4. Finalidades y bases jurídicas',
    bullets: [
      'Prestar las funciones que solicitas —cálculos, resultados, exportaciones y conservación local del progreso— sobre la base de la ejecución del servicio solicitado.',
      'Entregar y proteger la versión web, mantener su disponibilidad y prevenir usos abusivos sobre la base del interés legítimo en operar un servicio seguro y fiable.',
      'Atender consultas y solicitudes de derechos enviadas por correo electrónico sobre la base de tu solicitud y, cuando corresponda, del cumplimiento de obligaciones legales.',
    ],
  },
  {
    title: '5. Cookies, almacenamiento local y seguimiento',
    paragraphs: [
      'La versión revisada de HipotecaLab no incorpora herramientas de analítica, publicidad, perfiles comerciales ni seguimiento entre aplicaciones o sitios web. Tampoco utiliza cookies no esenciales.',
      'Sí utiliza almacenamiento local y cachés estrictamente funcionales para conservar el progreso de Aprende, preferencias técnicas y recursos de la aplicación. Puedes eliminarlos desde la configuración de datos del sitio del navegador; en la aplicación móvil, borrando sus datos o desinstalándola.',
    ],
  },
  {
    title: '6. Destinatarios y transferencias internacionales',
    paragraphs: [
      'HipotecaLab no vende ni alquila datos personales. Los datos que introduces en las calculadoras y el progreso de Aprende no se comunican a Firebase, Google Analytics ni otros servicios de analítica o almacenamiento remoto.',
      'En la versión web, el proveedor de alojamiento y distribución actúa como proveedor técnico y puede tratar los datos de conexión necesarios para entregar y proteger el servicio. Si dicho proveedor trata información fuera del Espacio Económico Europeo, deberá aplicar el mecanismo de transferencia y las garantías exigidos por la normativa aplicable. También podremos comunicar información cuando exista una obligación legal válida.',
      'Los enlaces a sitios de terceros se abren únicamente cuando decides visitarlos. Esos sitios aplican sus propias políticas de privacidad.',
    ],
  },
  {
    title: '7. Conservación',
    bullets: [
      'Datos del simulador y viabilidad: hasta que recargas, cierras o abandonas la sesión, salvo la copia que tú decidas exportar.',
      'Progreso de Aprende: hasta que elimines los datos locales del sitio o de la aplicación, o desinstales la aplicación.',
      'Cachés y preferencias técnicas: hasta que se sustituyan al actualizar la aplicación o las elimines desde el dispositivo.',
      'Consultas enviadas por correo: durante el tiempo necesario para responder y, después, durante los plazos exigidos para atender posibles responsabilidades legales.',
      'Registros técnicos del alojamiento web: durante los plazos de seguridad y conservación establecidos por el proveedor técnico correspondiente.',
    ],
  },
  {
    title: '8. Seguridad',
    paragraphs: [
      'Aplicamos medidas razonables para reducir la recopilación y exposición de información, entre ellas el procesamiento local de los cálculos, la ausencia de cuentas y el uso de conexiones seguras en la versión web. Ningún sistema puede garantizar una seguridad absoluta. Protege los archivos que exportes, especialmente si incluyen información sobre tu situación económica.',
    ],
  },
  {
    title: '9. Tus derechos',
    paragraphs: [
      'Cuando HipotecaLab trate datos personales que te conciernan, puedes solicitar acceso, rectificación, supresión, oposición, limitación o portabilidad, según corresponda, escribiendo a cdominguezmonferrer@gmail.com. También puedes retirar un consentimiento sin afectar a la licitud del tratamiento anterior, cuando esa sea la base aplicable.',
      'Los datos guardados exclusivamente en tu dispositivo no están disponibles para HipotecaLab. Puedes gestionarlos directamente borrando el almacenamiento del sitio o los datos de la aplicación. Si consideras que tus derechos no han sido atendidos, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es) u otra autoridad de control competente.',
    ],
  },
  {
    title: '10. Menores de edad',
    paragraphs: [
      'HipotecaLab no está dirigida a menores de 18 años y no solicita deliberadamente sus datos personales. Si crees que un menor nos ha enviado información personal por correo, contacta con nosotros para que podamos revisarla y eliminarla cuando corresponda.',
    ],
  },
  {
    title: '11. Cambios en esta política',
    paragraphs: [
      'Actualizaremos esta política cuando cambien las funciones de la aplicación o la forma en que se tratan los datos. La fecha y la versión indicadas al inicio permiten identificar la revisión vigente.',
    ],
  },
];

const PrivacyPolicyModal = ({ isOpen, onClose }: PrivacyPolicyModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-policy-title"
    >
      <div
        className="bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-700"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 id="privacy-policy-title" className="text-xl font-bold text-white">Política de Privacidad</h2>
            <p className="text-sm text-slate-400 mt-1">
              HipotecaLab · Actualizada el {LAST_UPDATED} · Versión {POLICY_VERSION}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Cerrar política de privacidad"
              type="button"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p className="text-base">
              Esta política explica qué información utiliza HipotecaLab, para qué se usa y qué opciones tienes.
              HipotecaLab funciona sin registro ni cuenta de usuario.
            </p>

            {policySections.map((section) => (
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
          <p className="text-xs text-slate-400">
            Información sobre privacidad y tratamiento de datos.
          </p>
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

export default PrivacyPolicyModal;
