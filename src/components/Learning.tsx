import React, { useEffect, useState } from 'react';
import { Trophy, Award, Star, Target, Zap, Flame, Rocket, Activity, BadgeCheck } from 'lucide-react';

// Solo Quiz
interface BaseQuestion { id: string; dificultad: 'facil' | 'media' | 'dificil'; explicacion?: string; }
interface QuizQuestion extends BaseQuestion { tipo: 'quiz'; pregunta: string; opciones: string[]; correcta: number; }

type Question = QuizQuestion;

interface Achievement {
  id: string;
  nombre: string;
  descripcion: string;
  icono: any;
  condicion: (progress: ProgressState) => boolean;
  desbloqueado?: boolean;
}

interface ProgressState { 
  xp: number; 
  nivel: number; 
  streak: number; 
  respondidas: number; 
  aciertos: number; 
  historico: { id: string; correcta: boolean; puntos: number; }[];
  logros: string[];
  preguntasUsadas: string[];
}

const LS_KEY = 'learningProgress';

// Banco de preguntas (sin LCCI y con packs añadidos) — 100 preguntas
const banco: Question[] = [
  // GASTOS DE COMPRA
  { 
    id: 'gastos_iva_nueva', 
    tipo: 'quiz', 
    dificultad: 'facil', 
    pregunta: 'Al comprar una vivienda nueva en España, ¿qué tributos se pagan en la escritura de compraventa?', 
    opciones: ['ITP (Impuesto de Transmisiones Patrimoniales)', 'IVA + AJD (Actos Jurídicos Documentados)', 'Plusvalía municipal', 'Solo IBI'], 
    correcta: 1, 
    explicacion: 'Las viviendas nuevas tributan por IVA (habitualmente 10%) y AJD (tipo autonómico). El ITP es para viviendas de segunda mano.'
  },
  { 
    id: 'gastos_itp_usada', 
    tipo: 'quiz', 
    dificultad: 'facil', 
    pregunta: '¿Qué impuesto se paga al comprar una vivienda de segunda mano?', 
    opciones: ['IVA', 'ITP (Impuesto de Transmisiones Patrimoniales)', 'Impuesto de Sociedades', 'Solo AJD'], 
    correcta: 1, 
    explicacion: 'La vivienda usada tributa por ITP (tipo autonómico). El IVA se aplica a obra nueva.'
  },
  { 
    id: 'gastos_rango_total', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'En términos generales, ¿cuál es el rango típico de gastos totales de compra (impuestos + notaría + registro + gestoría + tasación)?', 
    opciones: ['2%-4% del precio', '5%-7% del precio', '8%-12% del precio', '15%-20% del precio'], 
    correcta: 2, 
    explicacion: 'Suele oscilar entre 8%-12% según comunidad y casuística: impuestos, notaría, registro, gestoría, tasación y seguros si hay hipoteca.'
  },
  { 
    id: 'gastos_plusvalia_quien', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'En una compraventa, ¿quién paga normalmente la plusvalía municipal (IIVTNU)?', 
    opciones: ['Siempre el comprador', 'El vendedor (salvo pacto en contrario)', 'La notaría', 'El banco hipotecario'], 
    correcta: 1, 
    explicacion: 'Por defecto, el IIVTNU lo paga el vendedor, aunque se puede pactar otra cosa por escrito.'
  },
  { 
    id: 'gastos_seguro_obligatorio', 
    tipo: 'quiz', 
    dificultad: 'facil', 
    pregunta: '¿Qué seguro puede exigirte el banco al conceder una hipoteca?', 
    opciones: ['Seguro de móvil', 'Seguro de daños del inmueble (hogar/continente)', 'Seguro dental', 'Seguro de automóvil'], 
    correcta: 1, 
    explicacion: 'La entidad puede exigir un seguro de daños sobre la vivienda hipotecada; debe aceptar pólizas equivalentes si cumplen la cobertura solicitada.'
  },
  { 
    id: 'gastos_calculo_itp', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Sobre qué base se calcula el ITP en una compraventa?', 
    opciones: ['Siempre sobre el valor catastral', 'Sobre el valor declarado o el valor comprobado por Hacienda (el mayor)', 'Solo sobre el coste de reforma', 'Sobre el precio más muebles'], 
    correcta: 1, 
    explicacion: 'Se liquida sobre el mayor entre el precio escriturado y el valor de referencia/comprobado por la Administración.'
  },
  { 
    id: 'gastos_ahorro_necesario', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Cuánto ahorro se necesita típicamente para entrada + gastos al comprar con hipoteca?', 
    opciones: ['10%-15% del precio', '25%-35% del precio', '40%-50% del precio', 'Solo el 5%'], 
    correcta: 1, 
    explicacion: 'Entrada no financiada (habitual 20%) + gastos (8%-12%) ≈ 28%-32% del precio; hay excepciones con avales y ayudas.'
  },
  { 
    id: 'gastos_comision_apertura', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Cómo se cobra la comisión de apertura de la hipoteca?', 
    opciones: ['Se puede financiar con el préstamo (y entonces generará intereses)', 'Se paga cada año', 'Se descuenta de la cuota mensual', 'No existe legalmente'], 
    correcta: 0, 
    explicacion: 'Es un cargo único. Si la financias y se suma al capital, generará intereses; si la pagas al contado, no.'
  },
  { 
    id: 'gastos_eleccion_notario', 
    tipo: 'quiz', 
    dificultad: 'facil', 
    pregunta: 'En una compraventa con hipoteca, ¿quién elige al notario?', 
    opciones: ['Siempre el vendedor', 'Siempre el banco', 'El comprador/prestatario (derecho del cliente)', 'Lo decide la gestoría'], 
    correcta: 2, 
    explicacion: 'El comprador/prestatario tiene derecho a elegir notario. En la práctica, suele elegirlo el comprador.'
  },
  { 
    id: 'gastos_registro_incluye', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Qué incluyen los gastos del Registro de la Propiedad?', 
    opciones: ['Solo la inscripción de la compra', 'Inscripción de compra + hipoteca (si existe) + certificaciones', 'Solo certificados previos', 'Únicamente la tasación'], 
    correcta: 1, 
    explicacion: 'Incluye la inscripción de la compraventa, la hipoteca si procede y certificaciones/notas simples.'
  },

  // FINANCIACIÓN HIPOTECARIA (sin cálculos)
  { 
    id: 'fin_ltv_estandar', 
    tipo: 'quiz', 
    dificultad: 'facil', 
    pregunta: '¿Cuál es el LTV (Loan to Value) estándar para primera vivienda en España?', 
    opciones: ['50% del valor de tasación', '60% del valor de tasación', '70% del valor de tasación', '80% del valor de tasación'], 
    correcta: 3, 
    explicacion: 'Lo habitual es 80% para vivienda habitual (puede variar por perfil, entidad o avales).'
  },
  { 
    id: 'fin_ltv_base_menor', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Sobre qué importe calcula el banco el LTV?', 
    opciones: ['Siempre sobre el precio de compra', 'Siempre sobre la tasación', 'Sobre el menor entre precio y tasación', 'Sobre el mayor entre precio y tasación'], 
    correcta: 2, 
    explicacion: 'La financiación se calcula sobre el menor para controlar el riesgo.'
  },
  { 
    id: 'fin_ratio_esfuerzo', 
    tipo: 'quiz', 
    dificultad: 'facil', 
    pregunta: '¿Cuál es el ratio de esfuerzo máximo recomendado para la cuota hipotecaria?', 
    opciones: ['Menos del 20%', '30%-35% de ingresos netos', '45%-55% de ingresos', 'Más del 60%'], 
    correcta: 1, 
    explicacion: 'Recomendación extendida: no superar el 30%-35% de los ingresos netos del hogar.'
  },
  { 
    id: 'fin_que_es_tae', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Qué representa la TAE (Tasa Anual Equivalente) en una hipoteca?', 
    opciones: ['Solo el capital amortizado', 'El coste anual real incluyendo tipo nominal y comisiones', 'Solo los gastos notariales', 'La revalorización esperada de la vivienda'], 
    correcta: 1, 
    explicacion: 'Sirve para comparar ofertas: integra tipo nominal y costes recurrentes.'
  },
  { 
    id: 'fin_amortizacion_anticipada', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Qué reduce principalmente una amortización anticipada?', 
    opciones: ['Capital pendiente y futuros intereses', 'El tipo de interés nominal pactado', 'El IBI de la vivienda', 'El seguro de hogar'], 
    correcta: 0, 
    explicacion: 'Reduce capital pendiente y, por tanto, los intereses futuros.'
  },
  { 
    id: 'fin_plazo_largo_efecto', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Qué efecto tiene aumentar el plazo de la hipoteca?', 
    opciones: ['Baja la cuota y baja el coste total', 'Baja la cuota pero sube el coste total', 'Sube la cuota y baja el coste total', 'No cambia nada'], 
    correcta: 1, 
    explicacion: 'Más plazo reduce la cuota mensual pero aumenta los intereses totales.'
  },
  { 
    id: 'fin_sistema_frances', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'En el sistema francés (cuota constante), ¿qué se paga más al principio?', 
    opciones: ['Más capital que intereses', 'Más intereses que capital', 'Capital e intereses a partes iguales', 'Solo comisiones'], 
    correcta: 1, 
    explicacion: 'Al inicio predominan los intereses; con el tiempo, gana peso la amortización.'
  },
  { 
    id: 'fin_tipo_fijo_ventaja', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Cuál es la principal ventaja del tipo de interés fijo?', 
    opciones: ['Cuota estable y predecible', 'Siempre es más barato', 'Elimina todos los impuestos', 'No requiere tasación'], 
    correcta: 0, 
    explicacion: 'Da seguridad de cuota estable durante toda la vida del préstamo.'
  },
  { 
    id: 'fin_euribor_definicion', 
    tipo: 'quiz', 
    dificultad: 'facil', 
    pregunta: '¿Qué es el Euríbor?', 
    opciones: ['Un índice interbancario europeo', 'Un tipo fijo español', 'Un impuesto hipotecario', 'Una comisión bancaria'], 
    correcta: 0, 
    explicacion: 'Es el índice de referencia más usado en hipotecas variables.'
  },
  { 
    id: 'fin_diferencial_bancario', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Cómo funciona el diferencial bancario?', 
    opciones: ['Se suma al capital inicial', 'Se suma al índice de referencia (p. ej., Euríbor + 0,99%)', 'Se suma a las comisiones', 'Se suma al ITP'], 
    correcta: 1, 
    explicacion: 'Es el margen del banco que se añade al índice.'
  },
  { 
    id: 'fin_carencia_definicion', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Qué significa un período de carencia en una hipoteca?', 
    opciones: ['No pagar nada durante ese tiempo', 'Pagar solo intereses temporalmente', 'Congelar el tipo de interés', 'Duplicar la cuota inicial'], 
    correcta: 1, 
    explicacion: 'Durante la carencia no se amortiza capital; pueden alargarse plazos y costes.'
  },
  { 
    id: 'fin_tipo_mixto', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Qué es una hipoteca a tipo mixto?', 
    opciones: ['Tipo fijo toda la vida', 'Tipo variable toda la vida', 'Periodo inicial a tipo fijo y resto a variable', 'Un préstamo personal sin garantía'], 
    correcta: 2, 
    explicacion: 'Estabilidad al inicio; luego revisión con índice + diferencial.'
  },

  // PROCESO DE COMPRA (extra, sin cálculos)
  { 
    id: 'proc_arras_funcion', 
    tipo: 'quiz', 
    dificultad: 'facil', 
    pregunta: '¿Para qué sirven las arras penitenciales en una compraventa?', 
    opciones: ['Asegurar la financiación bancaria', 'Permitir desistir del contrato con penalización', 'Evitar el pago de impuestos', 'Garantizar un tipo de interés fijo'], 
    correcta: 1, 
    explicacion: 'Permiten desistir: el comprador las pierde; el vendedor devuelve el doble si desiste.'
  },
  { 
    id: 'proc_orden_logico', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Cuál es el orden lógico en un proceso de compra típico?', 
    opciones: ['Tasación → Arras → Búsqueda', 'Búsqueda → Arras → Tasación/Hipoteca → Escritura', 'Arras → Búsqueda → Firma → Tasación', 'Escritura → Tasación → Arras'], 
    correcta: 1, 
    explicacion: 'Buscar vivienda → arras → hipoteca/tasación → escritura.'
  },
  { 
    id: 'proc_nota_simple', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Qué documento te permite verificar las cargas de una vivienda?', 
    opciones: ['Nota simple del registro', 'Padrón municipal', 'Contrato de electricidad', 'Factura del IBI'], 
    correcta: 0, 
    explicacion: 'La nota simple muestra titularidad, hipotecas, embargos y otras cargas.'
  },
  { 
    id: 'proc_importe_arras', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Cuál es el importe típico de las arras sobre el precio de venta?', 
    opciones: ['1%-2%', '5%-10%', '20%-30%', '40% o más'], 
    correcta: 1, 
    explicacion: 'Suelen situarse entre el 5% y el 10% del precio acordado.'
  },
  { 
    id: 'proc_documentos_verificar', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Cuál de estos documentos NO es habitual verificar antes de comprar?', 
    opciones: ['Certificado energético de la vivienda', 'Título de propiedad actual', 'Contrato de trabajo del vendedor', 'Recibos de comunidad'], 
    correcta: 2, 
    explicacion: 'El contrato laboral del vendedor no es relevante para la compraventa.'
  },
  { 
    id: 'proc_tasacion_validez', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Cuánto tiempo suele ser válida una tasación hipotecaria?', 
    opciones: ['3 meses', '6 meses', '12 meses', '24 meses'], 
    correcta: 1, 
    explicacion: 'Práctica habitual: validez de 6 meses (sociedad homologada).'
  },
  { 
    id: 'proc_entrega_llaves', 
    tipo: 'quiz', 
    dificultad: 'facil', 
    pregunta: '¿Cuándo se entregan normalmente las llaves de la vivienda?', 
    opciones: ['Al firmar las arras', 'En la firma de escritura pública', 'Un mes después de la escritura', 'Solo tras el registro'], 
    correcta: 1, 
    explicacion: 'La entrega suele hacerse al firmar la escritura ante notario.'
  },
  { 
    id: 'proc_tiempo_tramite', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Cuánto tiempo suele transcurrir desde las arras hasta la escritura?', 
    opciones: ['1-2 semanas', '1-2 meses', '6 meses', '1 año completo'], 
    correcta: 1, 
    explicacion: 'Lo habitual son 1-2 meses para tramitar financiación y documentación.'
  },
  { 
    id: 'proceso_condicion_suspensiva', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'Si firmas arras sin hipoteca concedida, ¿qué cláusula te protege?', 
    opciones: ['Condición suspensiva de concesión de hipoteca', 'Cláusula suelo', 'Dación en pago', 'Pacto de silencio'], 
    correcta: 0, 
    explicacion: 'Permite resolver si no obtienes financiación dentro del plazo pactado.'
  },
  { 
    id: 'proceso_cita_notaria', 
    tipo: 'quiz', 
    dificultad: 'facil', 
    pregunta: '¿Dónde se firma la compraventa y la hipoteca?', 
    opciones: ['En el Registro de la Propiedad', 'En la notaría', 'En el banco', 'En el ayuntamiento'], 
    correcta: 1, 
    explicacion: 'Se otorgan ante notario y luego se inscriben en el Registro.'
  },
  { 
    id: 'proceso_cancelacion_cargas', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'Si el vendedor tiene una hipoteca vigente, ¿qué sucede el día de la firma?', 
    opciones: ['No se puede firmar', 'Se cancela con parte del precio y se tramita el levantamiento registral', 'El comprador la asume siempre', 'La cancela el notario con su dinero'], 
    correcta: 1, 
    explicacion: 'Se liquida la deuda con cargo al precio y se inicia la cancelación registral.'
  },
  { 
    id: 'proceso_subrogacion_promotor', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'En vivienda nueva, ¿qué significa subrogarse en la hipoteca del promotor?', 
    opciones: ['Comprar sin notario', 'Asumir el préstamo del promotor si el banco lo aprueba', 'No pagar impuestos', 'Evitar la tasación'], 
    correcta: 1, 
    explicacion: 'Pasas a ser deudor de ese préstamo, con condiciones propias de esa operación.'
  },
  { 
    id: 'proceso_reserva_vs_arras', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Cuál es una diferencia habitual entre “reserva” y “arras” en la práctica?', 
    opciones: ['La reserva es pública; las arras son privadas', 'La reserva suele inmovilizar el inmueble sin régimen de penalización típico de las arras', 'Las arras no van firmadas', 'La reserva transfiere la propiedad'], 
    correcta: 1, 
    explicacion: 'La reserva bloquea la vivienda; las arras suelen fijar penalizaciones y plazos para elevar a escritura.'
  },

  // DOCUMENTACIÓN A PEDIR AL VENDEDOR (pack nuevo)
  { 
    id: 'docvendedor_cert_comunidad', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Qué certificado debe aportar el vendedor respecto a la comunidad de propietarios?', 
    opciones: ['Certificado de eficiencia energética', 'Certificado de estar al corriente de pagos con la comunidad', 'Certificado de empadronamiento', 'Certificado de tasación'], 
    correcta: 1, 
    explicacion: 'Acredita que no existen deudas con la comunidad (o las que haya).'
  },
  { 
    id: 'docvendedor_ibi_recibo', 
    tipo: 'quiz', 
    dificultad: 'facil', 
    pregunta: '¿Por qué se solicita el último recibo del IBI?', 
    opciones: ['Para saber el color de la fachada', 'Para verificar el pago del impuesto y la referencia catastral', 'Para medir el ruido', 'Para cambiar la titularidad del agua'], 
    correcta: 1, 
    explicacion: 'Permite comprobar que el IBI está al día y la referencia catastral.'
  },
  { 
    id: 'docvendedor_cee', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Qué documento de eficiencia debe aportar el vendedor?', 
    opciones: ['Ninguno', 'Certificado de eficiencia energética', 'Una carta del banco', 'El plano de catastro'], 
    correcta: 1, 
    explicacion: 'Es obligatorio en ventas (con excepciones tasadas).'
  },
  { 
    id: 'docvendedor_nota_simple_reciente', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Para qué sirve pedir una nota simple reciente?', 
    opciones: ['Para contratar internet', 'Para comprobar titularidad y cargas del inmueble', 'Para tasar los muebles', 'Para calcular el seguro de coche'], 
    correcta: 1, 
    explicacion: 'Confirma propietario, hipotecas, embargos u otras cargas vigentes.'
  },
  { 
    id: 'docvendedor_cedula_habitabilidad', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Qué es la cédula de habitabilidad/ocupación?', 
    opciones: ['Un impuesto municipal', 'Documento que acredita condiciones mínimas para vivir (requerida en algunas CCAA)', 'Un contrato de alquiler', 'La licencia de obra nueva'], 
    correcta: 1, 
    explicacion: 'Puede exigirse para vender, alquilar o contratar suministros, según CCAA.'
  },
  { 
    id: 'docvendedor_ite_iee', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'En edificios antiguos, ¿qué informes pueden interesar?', 
    opciones: ['ITE/IEE (inspección/estado del edificio)', 'Permiso de aparcamiento', 'Contrato de telefonía', 'Carné de identidad del presidente'], 
    correcta: 0, 
    explicacion: 'Aportan información sobre el estado del edificio y posibles obras.'
  },
  { 
    id: 'docvendedor_licencia_obra_fin', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'Si hubo reformas importantes, ¿qué documentación conviene revisar?', 
    opciones: ['Licencias y, en su caso, final de obra', 'Recibos del supermercado', 'Seguro de coche', 'Contrato de gimnasio'], 
    correcta: 0, 
    explicacion: 'Verifica legalidad de las obras y su correcta finalización.'
  },
  { 
    id: 'docvendedor_boletines_suministros', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'Para altas o cambios de titular, ¿qué pueden pedir las compañías?', 
    opciones: ['Boletines o certificados de instalaciones (luz, gas, agua)', 'Una foto del salón', 'El plan de pagos del banco', 'La matrícula del vehículo'], 
    correcta: 0, 
    explicacion: 'Acreditan que las instalaciones cumplen normativa vigente.'
  },
  { 
    id: 'docvendedor_estatutos_actas', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Por qué es útil pedir estatutos y últimas actas de la comunidad?', 
    opciones: ['Para elegir color de fachada', 'Para conocer normas, obras aprobadas y derramas', 'Para negociar el IBI', 'Para cambiar al presidente'], 
    correcta: 1, 
    explicacion: 'Permite anticipar gastos comunitarios y normas internas.'
  },
  { 
    id: 'docvendedor_situacion_arrendaticia', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'Si la vivienda está alquilada, ¿qué debes revisar?', 
    opciones: ['Nada, no afecta', 'Contrato de alquiler y situación del inquilino', 'La póliza del coche del inquilino', 'El padrón del barrio'], 
    correcta: 1, 
    explicacion: 'Para conocer plazos, fianzas, prórrogas y derechos del inquilino.'
  },
  { 
    id: 'docvendedor_cert_deuda_cero', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'Si el vendedor tuvo hipoteca ya pagada, ¿qué conviene verificar?', 
    opciones: ['Que no exista deuda pendiente y tramitar cancelación registral', 'Que el banco regale muebles', 'Que el notario pague el IBI', 'Que la tasación incluya trasteros ajenos'], 
    correcta: 0, 
    explicacion: 'Hay que levantar la carga en el Registro para “limpiar” la finca.'
  },
  { 
    id: 'docvendedor_division_horizontal', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'En un edificio, ¿qué documento define elementos privativos y comunes?', 
    opciones: ['División horizontal y título constitutivo', 'Cédula de habitabilidad', 'Contrato de hipoteca', 'Factura de comunidad'], 
    correcta: 0, 
    explicacion: 'Establece cuotas y elementos comunes/privativos del inmueble.'
  },

  // SEGUROS Y VINCULACIONES (pack nuevo)
  { 
    id: 'seguro_danos_obligatorio', 
    tipo: 'quiz', 
    dificultad: 'facil', 
    pregunta: '¿Es obligatorio contratar seguro de daños sobre la vivienda hipotecada?', 
    opciones: ['Sí puede exigirse cobertura de daños', 'No, nunca', 'Solo si es segunda residencia', 'Lo decide el notario'], 
    correcta: 0, 
    explicacion: 'La entidad puede exigir cobertura de daños; no puede imponerte su aseguradora si presentas una póliza equivalente.'
  },
  { 
    id: 'seguro_vida_opcional', 
    tipo: 'quiz', 
    dificultad: 'facil', 
    pregunta: '¿Es obligatorio contratar seguro de vida con la hipoteca?', 
    opciones: ['Sí, por ley', 'No es obligatorio; puede bonificar condiciones', 'Solo mayores de 50', 'Depende del registrador'], 
    correcta: 1, 
    explicacion: 'No es obligatorio por ley. Puede ser recomendable para proteger a la familia.'
  },
  { 
    id: 'seguro_proteccion_pagos', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Qué cubre un seguro de protección de pagos (si lo contratas)?', 
    opciones: ['IBI y basura', 'Cuotas ante desempleo o incapacidad (según póliza)', 'La plusvalía municipal', 'El mantenimiento del ascensor'], 
    correcta: 1, 
    explicacion: 'Puede cubrir temporalmente cuotas en situaciones previstas en el contrato.'
  },
  { 
    id: 'vinculaciones_nomina', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Es obligatorio domiciliar la nómina para obtener hipoteca?', 
    opciones: ['Sí, por ley', 'No es obligatorio; suele bonificar el tipo', 'Solo si es vivienda nueva', 'Depende del notario'], 
    correcta: 1, 
    explicacion: 'Suele ser una vinculación voluntaria con bonificación de tipo.'
  },
  { 
    id: 'vinculaciones_tarjeta_recibos', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Puede el banco obligarte a contratar su tarjeta o domiciliar recibos?', 
    opciones: ['Siempre', 'No; puede ofrecer bonificaciones por hacerlo', 'Solo si la casa es grande', 'Solo en obra nueva'], 
    correcta: 1, 
    explicacion: 'Las vinculaciones no son obligatorias, pero suelen mejorar el tipo.'
  },
  { 
    id: 'vinculaciones_hipoteca_verde', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Qué es una hipoteca “verde”?', 
    opciones: ['Préstamo para jardinería', 'Hipoteca con incentivos si la vivienda es eficiente energéticamente', 'Hipoteca para casas rurales', 'Un seguro ecológico'], 
    correcta: 1, 
    explicacion: 'Puede bonificar a viviendas con buena calificación energética o reformas de eficiencia.'
  },
  { 
    id: 'vinculaciones_cambiar_fijo_variable', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Puedes pasar de variable a fijo con tu hipoteca existente?', 
    opciones: ['No', 'Sí, mediante novación o cambio de banco (subrogación)', 'Solo si vendes', 'Solo con aval público'], 
    correcta: 1, 
    explicacion: 'Puedes negociar con tu banco (novación) o cambiar de entidad (subrogación).'
  },

  // BUENAS PRÁCTICAS & RIESGOS (sin cálculos)
  { 
    id: 'buenas_practicas_revision_cargas', 
    tipo: 'quiz', 
    dificultad: 'facil', 
    pregunta: 'Antes de comprar, ¿qué debes revisar en el Registro?', 
    opciones: ['El color de la fachada', 'La nota simple para ver titularidad y cargas', 'La web del ayuntamiento', 'La factura del gas'], 
    correcta: 1, 
    explicacion: 'Confirma si hay hipotecas, embargos o servidumbres.'
  },
  { 
    id: 'buenas_practicas_llaves', 
    tipo: 'quiz', 
    dificultad: 'facil', 
    pregunta: '¿Cuándo se entregan normalmente las llaves?', 
    opciones: ['En las arras', 'En la escritura pública', 'Al inscribir en Registro', 'Un mes después'], 
    correcta: 1, 
    explicacion: 'La entrega suele hacerse al firmar la escritura.'
  },
  { 
    id: 'buenas_practicas_cancelacion_registral', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'Tras pagar la hipoteca por completo, ¿qué trámite queda para “limpiar” el registro?', 
    opciones: ['Ninguno', 'La cancelación registral de la hipoteca', 'Pedir una tasación nueva', 'Cambiar la calificación energética'], 
    correcta: 1, 
    explicacion: 'Hay que otorgar escritura de cancelación y presentarla al Registro.'
  },
  { 
    id: 'riesgo_tipo_variable', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Cuál es el principal riesgo de una hipoteca a tipo variable?', 
    opciones: ['Que suba la cuota con los tipos', 'No poder vender la casa', 'Pagar IBI', 'No poder cambiar de banco'], 
    correcta: 0, 
    explicacion: 'La cuota puede subir si sube el índice de referencia (p. ej., Euríbor).'
  },
  { 
    id: 'riesgo_dacion_en_pago', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Qué es la dación en pago?', 
    opciones: ['Pagar el préstamo con criptomonedas', 'Entregar la vivienda al banco para saldar la deuda si se pacta', 'Cambiar de hipoteca a alquiler', 'Un tipo de seguro'], 
    correcta: 1, 
    explicacion: 'Debe pactarse expresamente; no es automática en hipotecas ordinarias.'
  },
  { 
    id: 'figuras_arras_tipos', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'Además de penitenciales, ¿qué otros tipos de arras existen en la práctica?', 
    opciones: ['Confirmatorias y penales', 'Hipotecarias y fiscales', 'Simples y complejas', 'Municipales y notariales'], 
    correcta: 0, 
    explicacion: 'Confirmatorias refuerzan el contrato; penales fijan penalización; penitenciales permiten desistir.'
  },
  { 
    id: 'figuras_cuadro_amortizacion', 
    tipo: 'quiz', 
    dificultad: 'facil', 
    pregunta: '¿Qué es el cuadro de amortización?', 
    opciones: ['Un plano de la casa', 'Un calendario con capital e intereses de cada cuota', 'Un certificado energético', 'Un contrato de alquiler'], 
    correcta: 1, 
    explicacion: 'Detalla la evolución del préstamo mes a mes.'
  },

  // =========================
  // NUEVOS PACKS AÑADIDOS
  // =========================

  // FINANCIACIÓN (pack extra)
  { 
    id: 'fin_plazo_tipico', 
    tipo: 'quiz', 
    dificultad: 'facil', 
    pregunta: '¿Cuál es un plazo habitual de las hipotecas para vivienda habitual en España?', 
    opciones: ['5-10 años', '12-18 años', '25-30 años', '40-50 años'], 
    correcta: 2, 
    explicacion: 'Los plazos más comunes se mueven en el rango de 25-30 años, según perfil y entidad.'
  },
  { 
    id: 'fin_revision_variable', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'En una hipoteca variable, ¿cada cuánto se revisa normalmente el tipo?', 
    opciones: ['A diario', 'Cada mes', 'Cada 6 o 12 meses (según contrato)', 'Nunca se revisa'], 
    correcta: 2, 
    explicacion: 'La revisión suele ser semestral o anual, en función de lo pactado en la escritura.'
  },
  { 
    id: 'fin_diferencia_tin_tae', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Qué diferencia hay entre TIN y TAE?', 
    opciones: ['Son lo mismo', 'El TIN incluye comisiones; la TAE solo el tipo', 'El TIN es el tipo nominal; la TAE integra el coste anual efectivo con comisiones', 'La TAE solo aplica a préstamos personales'], 
    correcta: 2, 
    explicacion: 'El TIN es el tipo nominal. La TAE refleja el coste anual efectivo al incluir, además, comisiones/recurrencia.'
  },
  { 
    id: 'fin_subrogacion_acreedor', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Qué es una subrogación de acreedor en hipotecas?', 
    opciones: ['Cambiar de banco para mejorar condiciones', 'Cambiar de vivienda hipotecada', 'Cancelar y abrir un préstamo personal', 'Vender la casa con alquiler posterior'], 
    correcta: 0, 
    explicacion: 'Implica llevar la hipoteca a otra entidad que asume la deuda, habitualmente para mejorar tipo/plazo.'
  },
  { 
    id: 'fin_novacion_definicion', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Qué es una novación hipotecaria?', 
    opciones: ['Comprar sin notario', 'Modificar condiciones con tu propio banco (tipo/plazo/otras)', 'Pedir un préstamo personal adicional', 'Subrogarse en la hipoteca del promotor'], 
    correcta: 1, 
    explicacion: 'Es renegociar con la misma entidad cambios como tipo, plazo u otras condiciones.'
  },
  { 
    id: 'fin_avalistas', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Qué implica contar con avalistas en una hipoteca?', 
    opciones: ['Que bajan los impuestos', 'Que terceros garantizan el pago si el deudor no cumple', 'Que no hace falta tasación', 'Que el banco no revisa ingresos'], 
    correcta: 1, 
    explicacion: 'Los avalistas responden en defecto del deudor principal, mejorando el perfil de riesgo.'
  },
  { 
    id: 'fin_segunda_residencia_ltv', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'Para una segunda residencia, ¿cómo suele ser el LTV frente a la vivienda habitual?', 
    opciones: ['Más alto que en la habitual', 'Igual que en la habitual', 'Suele ser más bajo (p. ej., 60%-70%)', 'No existe LTV en segundas residencias'], 
    correcta: 2, 
    explicacion: 'Al tener mayor riesgo, las entidades suelen ofrecer menor porcentaje de financiación.'
  },
  { 
    id: 'fin_autopromotor', 
    tipo: 'quiz', 
    dificultad: 'dificil', 
    pregunta: '¿Qué caracteriza a una hipoteca de autopromotor?', 
    opciones: ['Se concede sin ingresos', 'Financia la compra de muebles', 'Financia la construcción por fases contra certificaciones de obra', 'No requiere proyecto técnico'], 
    correcta: 2, 
    explicacion: 'Se va desembolsando por hitos de obra, con control técnico y presupuestario.'
  },
  { 
    id: 'fin_tasacion_baja_impacto', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'Si la tasación sale por debajo del precio pactado, ¿qué ocurre normalmente?', 
    opciones: ['No afecta en nada', 'El banco financia sobre el precio igualmente', 'Baja el importe financiable al calcular sobre el menor valor', 'Se cancela la compraventa automáticamente'], 
    correcta: 2, 
    explicacion: 'El LTV se calcula sobre el menor entre precio y tasación; podrías necesitar más ahorro.'
  },
  { 
    id: 'fin_periodicidad_cuota', 
    tipo: 'quiz', 
    dificultad: 'facil', 
    pregunta: '¿Cuál es la periodicidad más habitual de las cuotas hipotecarias en España?', 
    opciones: ['Semanal', 'Mensual', 'Trimestral', 'Anual'], 
    correcta: 1, 
    explicacion: 'La cuota mensual es el estándar en hipotecas residenciales.'
  },

  // GASTOS & IMPUESTOS (pack extra)
  { 
    id: 'gastos_ajd_definicion', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'El AJD en compraventas de vivienda, ¿qué es?', 
    opciones: ['Un seguro obligatorio', 'Un impuesto autonómico sobre documentos notariales', 'Una comisión bancaria', 'Un registro privado'], 
    correcta: 1, 
    explicacion: 'El Impuesto de Actos Jurídicos Documentados grava determinados documentos notariales y es autonómico.'
  },
  { 
    id: 'gastos_itp_varia_ccaa', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'El tipo del ITP en vivienda usada, ¿es igual en toda España?', 
    opciones: ['Sí, es estatal fijo', 'No, varía por Comunidad Autónoma y circunstancias', 'Depende del notario', 'Depende del banco'], 
    correcta: 1, 
    explicacion: 'Es un tributo cedido a las CCAA, con tipos y bonificaciones propios.'
  },
  { 
    id: 'gastos_notaria_funcion', 
    tipo: 'quiz', 
    dificultad: 'facil', 
    pregunta: '¿Cuál es la función principal de la notaría en la compra?', 
    opciones: ['Pintar la vivienda', 'Dar fe pública del contrato y asesorar imparcialmente', 'Fijar el precio de venta', 'Tasarlo todo'], 
    correcta: 1, 
    explicacion: 'El notario verifica legalidad, identidad y capacidad, y eleva a escritura pública.'
  },
  { 
    id: 'gastos_gestoria_funcion', 
    tipo: 'quiz', 
    dificultad: 'facil', 
    pregunta: '¿Para qué sirve la gestoría en una compraventa con hipoteca?', 
    opciones: ['Organiza la mudanza', 'Tramita impuestos y la inscripción registral', 'Decide el tipo de interés', 'Cobra el IBI'], 
    correcta: 1, 
    explicacion: 'Se encarga de liquidar impuestos y presentar las escrituras al Registro.'
  },
  { 
    id: 'gastos_tasacion_uso', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Para qué usa el banco la tasación de la vivienda?', 
    opciones: ['Para calcular el IBI', 'Para fijar el Euríbor', 'Para estimar valor y riesgo (LTV) del préstamo', 'Para el certificado energético'], 
    correcta: 2, 
    explicacion: 'La tasación determina el valor de garantía y condiciona la financiación disponible.'
  },
  { 
    id: 'gastos_plusvalia_base', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'La plusvalía municipal (IIVTNU) grava principalmente…', 
    opciones: ['El valor de los muebles', 'El incremento del valor del terreno urbano', 'La renta del comprador', 'La tasación bancaria'], 
    correcta: 1, 
    explicacion: 'Es un tributo municipal sobre el incremento del valor del suelo urbano al transmitir.'
  },
  { 
    id: 'gastos_ibi_devengo_prorrateo', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'Sobre el IBI del año de la venta, ¿qué suele ocurrir?', 
    opciones: ['Se devenga a 1 de enero; por defecto lo paga quien sea propietario entonces (puede prorratearse por pacto)', 'Siempre lo paga el comprador', 'Siempre lo paga el banco', 'Lo paga el notario'], 
    correcta: 0, 
    explicacion: 'El devengo es a 1 de enero; en la práctica se pacta a menudo un prorrateo proporcional en la escritura.'
  },
  { 
    id: 'gastos_seguro_contenido_continente', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'En el seguro de hogar, ¿qué diferencia hay entre continente y contenido?', 
    opciones: ['Son lo mismo', 'Continente: estructura; Contenido: bienes y enseres', 'Continente: muebles; Contenido: paredes', 'Contenido solo cubre la fachada'], 
    correcta: 1, 
    explicacion: 'El continente es el inmueble (paredes, instalaciones fijas); el contenido son tus pertenencias.'
  },

  // PROCESO (pack extra)
  { 
    id: 'proc_condicion_resolutoria_escritura', 
    tipo: 'quiz', 
    dificultad: 'dificil', 
    pregunta: '¿Qué es una condición resolutoria explícita a favor del vendedor?', 
    opciones: ['Un descuento en el precio', 'Una garantía de pago aplazado inscrita en el Registro', 'Una bonificación del ITP', 'Una cláusula de alquiler con opción a compra'], 
    correcta: 1, 
    explicacion: 'Si hay precio aplazado, puede pactarse e inscribirse como garantía hasta completar el pago.'
  },
  { 
    id: 'proc_suministros_cambios', 
    tipo: 'quiz', 
    dificultad: 'facil', 
    pregunta: 'Tras la compra, ¿qué trámites de suministros suelen hacerse?', 
    opciones: ['Ninguno', 'Cambio de titularidad y, si procede, altas/boletines', 'Pedir otra tasación', 'Cambiar el color de fachada'], 
    correcta: 1, 
    explicacion: 'Conviene cambiar titularidad y aportar documentación requerida por cada compañía.'
  },
  { 
    id: 'proc_muebles_inventario', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'Si se incluyen muebles/electrodomésticos en la venta, ¿qué es recomendable?', 
    opciones: ['No mencionar nada', 'Hacer un inventario anexo firmado', 'Subir el ITP', 'Pedir una hipoteca mayor'], 
    correcta: 1, 
    explicacion: 'Un inventario anexo evita conflictos sobre qué queda en la vivienda tras la firma.'
  },
  { 
    id: 'proc_poder_notarial', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'Si firma un representante por el vendedor/comprador, ¿qué debe acreditarse?', 
    opciones: ['Nada, basta con decirlo', 'Un poder notarial válido o título de representación', 'Un correo electrónico', 'Un contrato laboral'], 
    correcta: 1, 
    explicacion: 'El notario exige acreditar la representación mediante poder o documento hábil.'
  },
  { 
    id: 'proc_licencia_primera_ocupacion', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'En vivienda nueva, ¿qué acredita la Licencia de Primera Ocupación/Comunicación equivalente?', 
    opciones: ['Que el vendedor es extranjero', 'Que la obra cumple para ser habitada y contratar suministros', 'Que no hay comunidad', 'Que el banco bonifica la hipoteca'], 
    correcta: 1, 
    explicacion: 'Es el acto administrativo que autoriza el uso residencial de la obra terminada.'
  },
  { 
    id: 'proc_metros_utiles_construidos', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Qué diferencia hay entre metros “útiles” y “construidos”?', 
    opciones: ['Útiles incluyen todo; construidos solo habitaciones', 'Útiles son superficies interiores habitables; construidos incluyen elementos comunes/muros', 'Son idénticos', 'Construidos son menos que útiles'], 
    correcta: 1, 
    explicacion: 'Los metros construidos son superiores al incluir muros y parte proporcional de comunes.'
  },
  { 
    id: 'proc_vicios_ocultos', 
    tipo: 'quiz', 
    dificultad: 'dificil', 
    pregunta: 'Tras comprar, aparece un defecto grave no visible antes. ¿Cómo se denomina en general?', 
    opciones: ['Arras confirmatorias', 'Vicio oculto', 'Cláusula suelo', 'IEE del edificio'], 
    correcta: 1, 
    explicacion: 'Los vicios ocultos son defectos no aparentes previos a la compra; pueden dar lugar a reclamación.'
  },

  // RIESGOS & BUENAS PRÁCTICAS (pack extra)
  { 
    id: 'riesgo_precio_en_b', 
    tipo: 'quiz', 
    dificultad: 'dificil', 
    pregunta: '¿Qué implica “pagar en B” (ocultar parte del precio) en una compraventa?', 
    opciones: ['Es legal si ambas partes quieren', 'No tiene consecuencias', 'Es ilegal y comporta riesgos y sanciones', 'Lo exige el banco'], 
    correcta: 2, 
    explicacion: 'Ocultar precio real constituye fraude con posibles sanciones y problemas legales serios.'
  },
  { 
    id: 'riesgo_comprar_sin_tasar', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'Si compras sin hipoteca, ¿es aconsejable prescindir de toda valoración técnica?', 
    opciones: ['Sí, siempre', 'No; conviene al menos una revisión/tasación para reducir riesgos', 'Da igual', 'Lo decide el ayuntamiento'], 
    correcta: 1, 
    explicacion: 'Una valoración técnica ayuda a detectar problemas y ajustar el precio.'
  },
  { 
    id: 'riesgo_mixto_tramo_variable', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'En hipoteca mixta, ¿qué riesgo existe al acabar el tramo fijo?', 
    opciones: ['Ninguno', 'La cuota puede subir si el índice sube', 'La hipoteca se cancela sola', 'Se pasa a tipo cero'], 
    correcta: 1, 
    explicacion: 'Al pasar a variable (índice + diferencial), la cuota dependerá de la evolución de tipos.'
  },
  { 
    id: 'figuras_clausula_suelo_techo', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Qué es una “cláusula suelo/techo” en hipotecas variables?', 
    opciones: ['Un impuesto', 'Un límite mínimo/máximo a la variación del tipo', 'Una comisión de notaría', 'Un seguro obligatorio'], 
    correcta: 1, 
    explicacion: 'Son límites contractuales que restringen bajadas/subidas del tipo aplicado.'
  },

  // FISCALIDAD & REGÍMENES ESPECIALES (alta nivel, sin números ni casuística LCCI)
  { 
    id: 'fiscal_deduccion_2013', 
    tipo: 'quiz', 
    dificultad: 'dificil', 
    pregunta: 'Respecto a la deducción estatal por compra de vivienda habitual en IRPF, ¿qué sucede con compras recientes?', 
    opciones: ['Sigue vigente para todas las compras', 'Se suprimió para compras realizadas a partir de 2013 (salvo derechos adquiridos)', 'Depende del banco', 'La gestiona la comunidad de propietarios'], 
    correcta: 1, 
    explicacion: 'Con carácter general, solo se mantiene para adquisiciones con derecho consolidado previo a 2013; pueden existir regímenes transitorios.'
  },
  { 
    id: 'vpo_limitaciones', 
    tipo: 'quiz', 
    dificultad: 'dificil', 
    pregunta: 'Al comprar una vivienda protegida (VPO), ¿qué debes tener en cuenta?', 
    opciones: ['No hay requisitos', 'Puede tener precio máximo, requisitos de acceso y limitaciones de transmisión', 'Siempre paga menos IBI', 'No se inscribe en el Registro'], 
    correcta: 1, 
    explicacion: 'Las VPO suelen estar sujetas a normativa autonómica con condiciones específicas.'
  },
  { 
    id: 'vpo_precio_maximo', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'En VPO, ¿qué suele existir respecto al precio?', 
    opciones: ['Precio libre', 'Un precio máximo legal según régimen', 'Lo fija el notario', 'Lo decide el banco'], 
    correcta: 1, 
    explicacion: 'La normativa de vivienda protegida establece topes y condiciones.'
  },

  // COMUNIDAD DE PROPIETARIOS (pack extra)
  { 
    id: 'comunidad_fondo_reserva', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Qué es el fondo de reserva de la comunidad?', 
    opciones: ['Un préstamo del banco', 'Un ahorro obligatorio para obras de conservación', 'Un seguro de hogar', 'Un impuesto municipal'], 
    correcta: 1, 
    explicacion: 'La comunidad debe contar con un fondo destinado a obras y mantenimiento.'
  },
  { 
    id: 'comunidad_derramas', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: '¿Qué es una “derrama” en una comunidad de propietarios?', 
    opciones: ['Un impuesto estatal', 'Un pago extraordinario para gastos u obras acordadas', 'La cuota mensual ordinaria', 'La penalización por vender'], 
    correcta: 1, 
    explicacion: 'Es un pago adicional aprobado en junta para cubrir gastos específicos.'
  },
  { 
    id: 'comunidad_uso_privativo', 
    tipo: 'quiz', 
    dificultad: 'dificil', 
    pregunta: 'Una terraza puede ser elemento común de uso privativo. ¿Qué significa?', 
    opciones: ['Que pertenece solo al propietario del ático', 'Que es común pero su uso exclusivo corresponde a un propietario', 'Que no puede usarse', 'Que no paga gastos'], 
    correcta: 1, 
    explicacion: 'La propiedad es de la comunidad, pero el uso se atribuye en exclusiva a un titular según la división horizontal.'
  },

  // NOTARÍA & REGISTRO (pack extra)
  { 
    id: 'notaria_copia_simple_autorizada', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'En la notaría, ¿qué diferencia hay entre copia simple y copia autorizada?', 
    opciones: ['No hay diferencia', 'La autorizada lleva firma y sello, la simple es informativa', 'La simple tiene más validez', 'La autorizada no sirve para el Registro'], 
    correcta: 1, 
    explicacion: 'La copia autorizada tiene fe pública y es la que se presenta al Registro.'
  },
  { 
    id: 'registro_plazo_inscripcion', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'Tras firmar, ¿qué sucede con la inscripción en el Registro de la Propiedad?', 
    opciones: ['Se inscribe al instante siempre', 'Puede tardar varias semanas según la tramitación', 'No hace falta inscribir', 'Lo hace el comprador a mano'], 
    correcta: 1, 
    explicacion: 'La gestoría presenta la escritura; el plazo depende de cargas, calificaciones y trámites.'
  },

  // EFICIENCIA & OTROS (pack extra)
  { 
    id: 'eficiencia_cee_validez', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'El Certificado de Eficiencia Energética (CEE) de viviendas, ¿qué validez suele tener?', 
    opciones: ['1 año', '3 años', '10 años', 'Para siempre'], 
    correcta: 2, 
    explicacion: 'Con carácter general, el CEE tiene una validez de 10 años salvo excepciones normativas.'
  },
  { 
    id: 'bonificaciones_vinculaciones_riesgo', 
    tipo: 'quiz', 
    dificultad: 'media', 
    pregunta: 'Si contratas bonificaciones (nómina, seguros, etc.) para bajar el tipo y luego las cancelas, ¿qué puede pasar?', 
    opciones: ['Nada', 'El tipo bonificado se mantiene', 'Se pierde la bonificación y sube el tipo pactado', 'Te multan siempre'], 
    correcta: 2, 
    explicacion: 'Las bonificaciones están condicionadas a mantener las vinculaciones; si se pierden, sube el TIN según contrato.'
  },
];


// Logros del sistema
const logros: Achievement[] = [
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

const dificultadMultiplicador = (d: Question['dificultad']) => d === 'facil' ? 1 : d === 'media' ? 1.5 : 2;
const calcularNivel = (xp: number) => Math.floor(xp / 1000) + 1;
const initialProgress: ProgressState = { xp: 0, nivel: 1, streak: 0, respondidas: 0, aciertos: 0, historico: [], logros: [], preguntasUsadas: [] };

const Learning: React.FC = () => {
  const [progress, setProgress] = useState<ProgressState>(() => { 
    try { 
      const raw = localStorage.getItem(LS_KEY); 
      const parsed = raw ? JSON.parse(raw) : initialProgress;
      // Migrar datos antiguos
      return { ...initialProgress, ...parsed, logros: parsed.logros || [], preguntasUsadas: parsed.preguntasUsadas || [] };
    } catch { 
      return initialProgress; 
    } 
  });
  const [preguntaActual, setPreguntaActual] = useState<Question | null>(null);
  const [respuestaUsuario, setRespuestaUsuario] = useState<number | null>(null);
  const [resultado, setResultado] = useState<{ correcta: boolean; puntos: number; mensaje: string } | null>(null);
  const [mostrarExplicacion, setMostrarExplicacion] = useState(false);
  const [mostrarLogros, setMostrarLogros] = useState(false);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);

  useEffect(() => { localStorage.setItem(LS_KEY, JSON.stringify(progress)); }, [progress]);

  // Función para seleccionar pregunta evitando repeticiones
  const nuevaPregunta = () => {
    setResultado(null);
    setRespuestaUsuario(null);
    setMostrarExplicacion(false);

    const preguntasNoUsadas = banco.filter(q => !progress.preguntasUsadas.includes(q.id));
    const preguntasDisponibles = preguntasNoUsadas.length > 0 ? preguntasNoUsadas : banco;

    if (preguntasDisponibles.length === 0) {
      setPreguntaActual(null);
      return;
    }

    if (preguntasNoUsadas.length === 0) {
      setProgress(prev => ({ ...prev, preguntasUsadas: [] }));
    }

    const idx = Math.floor(Math.random() * preguntasDisponibles.length);
    setPreguntaActual(preguntasDisponibles[idx]);
  };

  // Solo cargar la primera pregunta al montar
  useEffect(() => { nuevaPregunta(); }, []);

  const registrarResultado = (correcta: boolean, puntosBase: number) => {
    const streak = correcta ? progress.streak + 1 : 0;
    const bonusStreak = correcta ? Math.min(streak * 0.1, 0.5) : 0;
    const puntos = Math.round(puntosBase * (1 + bonusStreak));
    const xp = progress.xp + puntos;
    const nivel = calcularNivel(xp);
    const aciertos = progress.aciertos + (correcta ? 1 : 0);
    const respondidas = progress.respondidas + 1;
    const historico = [...progress.historico.slice(-49), { id: preguntaActual?.id || 'na', correcta, puntos }];
    
    // Agregar pregunta a las usadas
    const preguntasUsadas = preguntaActual ? [...progress.preguntasUsadas, preguntaActual.id] : progress.preguntasUsadas;
    
    // Verificar nuevos logros
    const nuevosLogros = logros
      .filter(logro => !progress.logros.includes(logro.id))
      .filter(logro => logro.condicion({ xp, nivel, streak, aciertos, respondidas, historico, logros: progress.logros, preguntasUsadas }))
      .map(logro => logro.id);

    const logrosActualizados = [...progress.logros, ...nuevosLogros];

    if (nuevosLogros.length > 0) {
      const nuevosObjs = nuevosLogros.map(id => logros.find(l => l.id === id)!).filter(Boolean);
      setAchievementQueue(q => [...q, ...nuevosObjs]);
    }

    setProgress({ xp, nivel, streak, aciertos, respondidas, historico, logros: logrosActualizados, preguntasUsadas });
    return puntos;
  };

  const responderQuiz = (index: number) => {
    if (!preguntaActual || resultado) return;
    const correcta = index === preguntaActual.correcta;
    const puntos = registrarResultado(correcta, 100 * dificultadMultiplicador(preguntaActual.dificultad));
    setRespuestaUsuario(index);
    setResultado({ correcta, puntos, mensaje: correcta ? '¡Correcto!' : 'Incorrecto' });
    setMostrarExplicacion(true);
  };

  const siguiente = () => { nuevaPregunta(); };

  const ratioAcierto = progress.respondidas ? Math.round((progress.aciertos / progress.respondidas) * 100) : 0;
  const progresoNivel = Math.min(100, Math.round((progress.xp % 1000) / 1000 * 100));

  const renderContenido = () => {
    if (!preguntaActual) return <div className="text-center text-slate-400 text-sm">No hay preguntas disponibles.</div>;
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
                  isSelected ? 'border-orange-500 bg-orange-500/10' : 
                  'border-slate-600 hover:border-orange-400/60 hover:bg-slate-700/50'
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

  useEffect(() => {
    if (achievementQueue.length === 0) return;
    const timer = setTimeout(() => {
      setAchievementQueue(q => q.slice(1));
    }, 3500);
    return () => clearTimeout(timer);
  }, [achievementQueue]);

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto p-4 space-y-4">
      {/* Notificaciones de logros */}
      <div className="fixed top-4 right-4 z-50 flex flex-col space-y-3 w-72 pointer-events-none">
        {achievementQueue.slice(0,2).map((ach, idx) => (
          <div
            key={ach.id}
            className={`relative group overflow-hidden rounded-xl border border-slate-600/70 bg-slate-900/80 backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_8px_24px_-6px_rgba(0,0,0,0.5)] px-4 py-3 animate-[fadeIn_0.4s_ease] ${idx===0 ? 'ring-1 ring-orange-500/40' : ''}`}
            style={{ backgroundImage: 'linear-gradient(135deg, rgba(230,140,3,0.15), rgba(15,23,42,0.4))' }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{background:'radial-gradient(circle at 85% 15%, rgba(246,235,217,0.15), transparent 60%)'}}
            />
            <div className="flex items-start space-x-3 relative">
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-slate-800/70 border border-slate-600 flex items-center justify-center shadow-inner">
                  <ach.icono size={20} className="text-orange-300 drop-shadow-[0_0_4px_rgba(230,140,3,0.6)] animate-pulse" />
                </div>
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-br from-orange-500/30 to-transparent blur opacity-40 group-hover:opacity-70 transition" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] tracking-wide uppercase text-slate-400 font-medium mb-0.5 flex items-center space-x-1">
                  <span>Logro desbloqueado</span>
                  <span className="inline-block w-1 h-1 rounded-full bg-orange-400 animate-ping" />
                </div>
                <div className="text-sm font-semibold text-slate-100 leading-snug">{ach.nombre}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 leading-snug line-clamp-2">{ach.descripcion}</div>
                <div className="mt-2 h-1.5 bg-slate-700/60 rounded overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 animate-[progress_3.2s_linear]" />
                </div>
              </div>
            </div>
            <div className="absolute -top-8 -right-8 w-24 h-24 opacity-10 rotate-45 bg-gradient-to-br from-orange-400 to-transparent rounded-xl" />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform: translateY(-6px) scale(.96);} to { opacity:1; transform: translateY(0) scale(1);} }
        @keyframes progress { from { width:0%; } to { width:100%; } }
      `}</style>

      {/* Panel de estadísticas */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 flex flex-col">
          <span className="text-xs font-medium text-slate-400">Nivel</span>
          <div className="flex items-end justify-between mt-1">
            <span className="text-2xl font-bold" style={{color:'#F6EBD9'}}>{progress.nivel}</span>
            <span className="text-[11px] text-slate-400">XP {progress.xp}</span>
          </div>
          <div className="mt-2 h-2 bg-slate-700 rounded"><div className="h-full rounded" style={{ width: `${progresoNivel}%`, background: 'linear-gradient(90deg,#E68C03,#F6EBD9)' }}></div></div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 flex flex-col">
          <span className="text-xs font-medium text-slate-400">Rendimiento</span>
          <div className="flex items-end justify-between mt-1">
            <span className="text-2xl font-bold text-green-400">{ratioAcierto}%</span>
            <span className="text-[11px] text-slate-400">{progress.aciertos}/{progress.respondidas}</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">Streak: {progress.streak}</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 flex flex-col">
          <span className="text-xs font-medium text-slate-400">Logros</span>
          <div className="flex items-end justify-between mt-1">
            <span className="text-2xl font-bold text-orange-400">{progress.logros.length}</span>
            <span className="text-[11px] text-slate-400">/{logros.length}</span>
          </div>
          <button onClick={() => setMostrarLogros(!mostrarLogros)} className="mt-2 text-[11px] text-orange-400 underline hover:text-orange-300">Ver logros</button>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 flex flex-col">
          <span className="text-xs font-medium text-slate-400">Histórico (últ. 10)</span>
          <div className="mt-2 flex flex-wrap gap-1">{progress.historico.slice(-10).map(h => <span key={h.id+Math.random()} className={`w-3 h-3 rounded-sm ${h.correcta ? 'bg-green-500' : 'bg-red-500'}`}></span>)}</div>
          <button onClick={() => { if (confirm('¿Reiniciar progreso?')) setProgress(initialProgress); }} className="mt-auto text-[10px] text-slate-400 underline hover:text-orange-400">Reiniciar</button>
        </div>
      </div>

      {/* Panel de logros */}
      {mostrarLogros && (
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Logros</h3>
            <button onClick={() => setMostrarLogros(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {logros.map(logro => {
              const desbloqueado = progress.logros.includes(logro.id);
              return (
                <div key={logro.id} className={`flex items-center space-x-3 p-3 rounded-lg border ${desbloqueado ? 'border-orange-500/50 bg-orange-500/10' : 'border-slate-600 bg-slate-700/30'}`}>
                  <logro.icono size={20} className={desbloqueado ? 'text-orange-400' : 'text-slate-500'} />
                  <div>
                    <div className={`font-medium text-sm ${desbloqueado ? 'text-orange-200' : 'text-slate-400'}`}>{logro.nombre}</div>
                    <div className={`text-xs ${desbloqueado ? 'text-orange-300' : 'text-slate-500'}`}>{logro.descripcion}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Controles */}
      <div className="flex flex-wrap gap-2 items-center justify-center">
        <button onClick={nuevaPregunta} className="px-4 py-2 rounded-md text-sm font-medium border border-slate-600 hover:border-orange-400/60 hover:bg-slate-700/50">
          Nueva Pregunta
        </button>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto bg-slate-800/40 border border-slate-700 rounded-xl p-6">
        {renderContenido()}
        {resultado && preguntaActual && (
          <div className="mt-6 p-5 rounded-lg border text-sm" style={{borderColor: resultado.correcta ? '#15803d' : '#7f1d1d', backgroundColor: resultado.correcta ? 'rgba(34,197,94,0.08)' : 'rgba(248,113,113,0.08)'}}>
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
            <button onClick={siguiente} className="px-6 py-2 rounded-md bg-orange-600 hover:bg-orange-500 text-sm font-medium transition-colors">
              Siguiente pregunta
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Learning;
