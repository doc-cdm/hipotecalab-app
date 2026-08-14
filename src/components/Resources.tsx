import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, MapPin } from 'lucide-react';

type ResourceSection = 'dictionary' | 'guide';

const Resources: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ResourceSection>('dictionary');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const sections = [
    { id: 'dictionary' as const, label: 'Diccionario', icon: BookOpen },
    { id: 'guide' as const, label: 'Guía de compra', icon: MapPin },
  ];

  const dictionaryCategories = [
    {
      title: 'Tipos de interés y medidas financieras',
      terms: [
        {
          id: 'tin',
          term: 'TIN (Tipo de Interés Nominal)',
          definition: 'Es el porcentaje anual que el banco cobra por prestarte dinero, sin incluir gastos ni comisiones. Solo refleja el coste de los intereses.',
          utility: 'Se calcula sobre el capital pendiente del préstamo. Aunque es anual, se aplica mensualmente en las cuotas.',
          importance: 'Te ayuda a saber qué parte de la cuota son intereses puros. Distingue entre intereses y amortización de capital.',
          example: 'Préstamo: 100.000€, TIN: 3% anual (0,25% mensual). Interés primer mes: 250€ (100.000€ × 0,25%). Cada mes, la parte de intereses baja a medida que devuelves capital.',
          notes: 'El TIN siempre aparece en las condiciones, pero no refleja el coste total como la TAE, que sí incluye comisiones y otros gastos.'
        },
        {
          id: 'tae',
          term: 'TAE (Tasa Anual Equivalente)',
          definition: 'Porcentaje anual que resume todo lo que te cuesta la hipoteca (intereses TIN, comisiones y seguros obligatorios).',
          utility: 'Se calcula con el TIN + comisiones + gastos asociados. Siempre se expresa en % anual, aunque pagues mes a mes.',
          importance: 'Es la forma más fiable de comparar dos hipotecas, porque revela el coste real total.',
          example: 'Dos ofertas al 2,5% TIN: Hipoteca A: TIN 2,5%, comisión apertura 1%, seguro hogar obligatorio (150€/año) → TAE más alta. Hipoteca B: TIN 2,5%, sin comisión, seguro hogar opcional → TAE más baja.',
          notes: 'La TAE es una referencia anual del coste total, no se paga mensualmente. La normativa obliga a mostrarla en la publicidad.'
        },
        {
          id: 'tipo-interes-referencia',
          term: 'Tipo de interés de referencia (BCE)',
          definition: 'Es el porcentaje que el Banco Central Europeo (BCE) cobra a los bancos por prestarles dinero. Influye directamente en el coste de las hipotecas.',
          utility: 'Si el BCE sube este tipo, los bancos suelen subir el TIN de las hipotecas. Afecta tanto a hipotecas nuevas (fijas y variables) como a las revisiones de las variables existentes.',
          importance: 'Una subida encarece las cuotas de hipotecas variables. Puede hacer que las nuevas hipotecas fijas se ofrezcan con tipos más altos.',
          example: 'Si el tipo de referencia sube, un banco podría ofrecer una hipoteca fija al 3% en lugar del 2,5% anterior.',
          notes: 'Valor actual: 2,40% (Fuente: datosmacro.expansion.com, Abril 2025)'
        },
        {
          id: 'euribor',
          term: 'Euríbor (Euro Interbank Offered Rate)',
          definition: 'Es el tipo de interés promedio al que los principales bancos europeos se prestan dinero entre sí. Es el índice más usado para calcular hipotecas variables en España.',
          utility: 'Se publica diariamente. El más común en hipotecas es el Euríbor a 12 meses. En hipotecas variables, el TIN = Euríbor + diferencial pactado.',
          importance: 'Determina directamente tu cuota en una hipoteca variable. Si sube, pagas más; si baja, pagas menos. Es sensible a la economía y a las decisiones del BCE.',
          example: 'Hipoteca: Euríbor 12m + 1%. Si Euríbor = 2,5%, TIN = 3,5%. Si Euríbor sube a 3%, TIN = 4%.',
          notes: 'Consulta valores en euribor-rates.eu o Banco de España. Cambia según el entorno económico.'
        }
      ]
    },
    {
      title: 'Operaciones hipotecarias',
      terms: [
        {
          id: 'novacion',
          term: 'Novación',
          definition: 'Modificar las condiciones de tu hipoteca sin cambiar de banco. Permite adaptar el préstamo a tus nuevas circunstancias.',
          utility: 'Puedes negociar con tu banco para cambiar: tipo de interés (fijo/variable, porcentaje), plazo (ampliar/reducir), importe (ampliar capital), eliminar productos vinculados o comisiones.',
          importance: 'Permite mejorar tu hipoteca (bajar interés, reducir cuota) sin los gastos de cancelar y abrir una nueva. Es más económico que una subrogación o nueva hipoteca.',
          example: 'Tienes hipoteca a 30 años al 3,5% TIN. Novas para ampliar a 35 años y bajar el TIN al 3,2%, reduciendo la cuota mensual.',
          notes: 'Requiere firma ante notario. Puede tener comisión por novación (revisa tu contrato).'
        },
        {
          id: 'subrogacion',
          term: 'Subrogación',
          definition: 'Cambiar elementos clave de la hipoteca: el banco (acreedor) o el titular (deudor).',
          utility: 'Subrogación de acreedor: Llevas tu hipoteca a otro banco para mejorar condiciones (interés, comisiones). Subrogación de deudor: Cambias el titular del préstamo (ej: al vender una casa con hipoteca, el comprador asume la deuda).',
          importance: 'Permite ahorrar dinero (subrogación de acreedor) o facilitar una venta (subrogación de deudor) sin cancelar la hipoteca original.',
          example: 'Tu hipoteca en Banco A tiene TIN 3,2%. Banco B te ofrece 2,8%. Subrogas a Banco B para pagar menos intereses.',
          notes: 'Tiene gastos (notario, registro, posible comisión), pero suelen ser menores que cancelar y abrir una nueva hipoteca. Compara siempre la TAE.'
        },
        {
          id: 'amortizacion',
          term: 'Amortización',
          definition: 'Es el proceso de devolver el dinero prestado (capital) más los intereses, mediante cuotas periódicas.',
          utility: 'Amortización normal: Pago de las cuotas mensuales pactadas. Amortización anticipada (parcial o total): Realizar pagos extra para reducir la deuda pendiente. Sistemas comunes: Francés (cuota fija, más común en España) y Alemán (amortizas la misma cantidad de capital siempre).',
          importance: 'Amortizar anticipadamente te permite ahorrar intereses a largo plazo o reducir tu carga financiera mensual.',
          example: 'Tienes una hipoteca y recibes un dinero extra. Haces una amortización parcial de 10.000€. Puedes elegir mantener la cuota y acabar antes, o bajar la cuota y mantener el plazo.',
          notes: 'Revisa si tu hipoteca tiene comisión por amortización anticipada. Si los tipos de interés son muy bajos, a veces compensa más invertir el dinero que amortizar.'
        },
        {
          id: 'carencia',
          term: 'Carencia',
          definition: 'Periodo temporal durante el cual pagas una cuota reducida (solo intereses) o no pagas nada (ni intereses ni capital).',
          utility: 'Carencia parcial: Solo pagas intereses. El capital pendiente no disminuye. Carencia total: No pagas nada. Los intereses no pagados se suman al capital pendiente (la deuda crece).',
          importance: 'Puede ser un alivio temporal si tienes problemas para pagar la cuota completa.',
          example: 'Durante la crisis del Covid-19, se ofrecieron carencias a personas afectadas por ERTEs o pérdida de empleo.',
          notes: 'La carencia encarece el coste total del préstamo, ya que aplazas la devolución del capital y pagas intereses durante más tiempo o sobre una deuda mayor.'
        },
        {
          id: 'dacion-pago',
          term: 'Dación en pago',
          definition: 'Entregar la vivienda hipotecada al banco para saldar completamente la deuda pendiente, aunque el valor de la casa sea inferior a la deuda.',
          utility: 'El deudor propone entregar la vivienda al banco. El banco debe aceptar la operación (no está obligado por ley general, salvo casos específicos). Si se acepta, la deuda queda cancelada al entregar las llaves.',
          importance: 'Es una solución definitiva si no puedes pagar la hipoteca y quieres evitar que la deuda siga creciendo tras perder la casa (ejecución hipotecaria).',
          example: 'Requisitos habituales: Ser vivienda habitual. Demostrar insolvencia y situación de vulnerabilidad (regulado por ley).',
          notes: 'Regulada en Art. 140 Ley Hipotecaria y RDL 6/2012 para deudores vulnerables. Puede tener costes fiscales.'
        },
        {
          id: 'transferencia-omf',
          term: 'Transferencia OMF',
          definition: 'Orden de Movimiento de Fondos (OMF). Es una transferencia bancaria específica, habitual en notarías para el pago en compraventas de inmuebles o formalización de hipotecas.',
          utility: 'Se emite desde la cuenta del comprador (o del banco que concede la hipoteca) a la cuenta del vendedor. Se realiza habitualmente en el momento de la firma ante notario. Garantiza que el pago se realiza de forma segura y trazable.',
          importance: 'Aporta seguridad y transparencia al pago en la compraventa. Asegura que los fondos se mueven correctamente entre las partes.',
          example: 'Al firmar la compraventa en la notaría, el banco del comprador emite una OMF por el importe del precio de la vivienda a la cuenta del vendedor.',
          notes: 'Es un mecanismo estándar regulado por normativa bancaria para operaciones de alto importe como las inmobiliarias.'
        },
        {
          id: 'provision-fondos',
          term: 'Provisión de Fondos',
          definition: 'Cantidad de dinero que el comprador (o el banco) entrega por adelantado a la gestoría o notaría para cubrir los gastos e impuestos asociados a la compraventa y/o hipoteca.',
          utility: 'Antes de la firma, se estima el coste de notaría, registro, gestoría, impuestos (ITP/AJD), etc. El comprador deposita esa cantidad estimada. La gestoría/notaría usa esos fondos para pagar todos los trámites.',
          importance: 'Asegura que todos los gastos e impuestos se pagarán a tiempo. Simplifica el proceso para el comprador, que no tiene que hacer cada pago individualmente.',
          example: 'Para una compraventa, la gestoría estima 5.000€ en gastos (notario, registro, ITP). Pides una provisión de fondos por ese importe. Tras pagar todo (4.800€), te devuelven los 200€ sobrantes.',
          notes: 'Es importante pedir una liquidación detallada al final para verificar todos los pagos realizados con la provisión.'
        }
      ]
    },
    {
      title: 'Documentación e información precontractual',
      terms: [
        {
          id: 'fipte-fiper',
          term: 'FIPTE / FIPER (Obsoleto)',
          definition: 'La Ficha de Información Precontractual (FIPTE) y la Ficha de Información Personalizada (FIPER) eran documentos informativos previos a la Ley Hipotecaria 5/2019.',
          utility: 'Fueron sustituidos por la Ficha Europea de Información Normalizada (FEIN) y la Ficha de Advertencias Estandarizadas (FiAE).',
          importance: 'Documentos históricos que ya no se utilizan.',
          example: '',
          notes: 'Fueron sustituidos por documentos que ofrecen información más completa y estandarizada.'
        },
        {
          id: 'fein',
          term: 'FEIN (Ficha Europea de Información Normalizada)',
          definition: 'Es el documento clave y vinculante con la oferta de la hipoteca. Contiene todas las condiciones personalizadas de tu préstamo.',
          utility: 'El banco te la entrega al menos 10 días antes de la firma. Tiene un formato estándar europeo para facilitar la comparación. Incluye: tipo de interés, TAE, importe total a devolver, plazo, comisiones, cuotas, productos vinculados, consecuencias de impago.',
          importance: 'Es la oferta oficial del banco. Te permite estudiar a fondo las condiciones antes de firmar y compararla con otras ofertas de forma clara.',
          example: 'Recibes la FEIN con un TIN fijo del 3%, TAE 3,5%, plazo 30 años, cuota 600€/mes, y la obligación de contratar un seguro de hogar.',
          notes: 'Junto con la FEIN, recibirás la FiAE. Debes revisar ambos documentos con calma y acudir al notario para resolver dudas antes de la firma definitiva.'
        },
        {
          id: 'fiae',
          term: 'FIAE (Ficha de Advertencias Estandarizadas)',
          definition: 'Documento que acompaña a la FEIN y resalta las cláusulas o riesgos más relevantes de tu hipoteca de forma clara y sencilla.',
          utility: 'Se entrega junto a la FEIN, al menos 10 días antes de la firma. Advierte sobre: cláusulas potencialmente sensibles, riesgos de hipotecas variables, costes de cancelación anticipada, consecuencias del impago, distribución de gastos hipotecarios.',
          importance: 'Te ayuda a entender los puntos más delicados del contrato y los posibles problemas futuros, reforzando tu protección como consumidor.',
          example: 'La FIAE te recordará que si tienes una hipoteca variable y el Euríbor sube mucho, tu cuota mensual también lo hará.',
          notes: 'Es obligatorio revisarla con el notario días antes de la firma de la hipoteca para asegurar que comprendes todos los puntos.'
        },
        {
          id: 'nota-simple',
          term: 'Nota simple',
          definition: 'Documento informativo emitido por el Registro de la Propiedad que resume la situación jurídica de un inmueble.',
          utility: 'Contiene: descripción del inmueble, titularidad (quién es el dueño actual), cargas y gravámenes (hipotecas, embargos, usufructos, servidumbres), posibles limitaciones o afecciones.',
          importance: 'Imprescindible antes de comprar: verifica que el vendedor es el dueño real y si la vivienda tiene cargas ocultas. El banco la pide siempre antes de conceder una hipoteca.',
          example: 'Pides la nota simple de una casa que quieres comprar y descubres que tiene una hipoteca pendiente que el vendedor debe cancelar antes de la venta.',
          notes: 'Se solicita en el Registro de la Propiedad (presencial u online). Es barata y rápida de obtener. No tiene valor de certificación oficial.'
        },
        {
          id: 'escritura-propiedad',
          term: 'Escritura de Propiedad',
          definition: 'Documento público firmado ante notario que acredita la propiedad de un inmueble y las condiciones de la compraventa.',
          utility: 'La firman comprador y vendedor en la notaría. El notario da fe de la identidad de las partes, la legalidad del acto y el contenido del acuerdo. Es el documento necesario para inscribir la propiedad.',
          importance: 'Es la prueba legal de que eres el propietario de la vivienda. Necesaria para cualquier trámite futuro (vender, hipotecar, heredar). Ofrece máxima seguridad jurídica.',
          example: 'Tras acordar la compra, vas al notario con el vendedor, firmáis la escritura y, una vez inscrita en el Registro, eres oficialmente el dueño.',
          notes: 'La escritura de hipoteca es un documento separado, aunque a menudo se firman juntas. Guarda bien tu copia de la escritura.'
        },
        {
          id: 'numero-finca',
          term: 'Número de Finca Registral',
          definition: 'Identificador único que el Registro de la Propiedad asigna a cada inmueble al inscribirlo por primera vez.',
          utility: 'Permite localizar inequívocamente una propiedad en el Registro. Aparece en la Nota Simple y en la Escritura de Propiedad. Es diferente de la Referencia Catastral.',
          importance: 'Asegura que estás consultando o realizando trámites sobre la propiedad correcta. Fundamental para cualquier gestión en el Registro de la Propiedad.',
          example: 'Al pedir una nota simple online, necesitas el número de finca registral (o datos del titular/dirección) para identificar la propiedad.',
          notes: 'Cada Registro de la Propiedad tiene su propia numeración. Una finca puede tener varios números si ha sufrido modificaciones.'
        },
        {
          id: 'firma-poder',
          term: 'Firma con poder notarial',
          definition: 'Acto por el cual una persona (apoderado) firma un documento oficial en nombre de otra (poderdante), utilizando un poder notarial que le autoriza a ello.',
          utility: 'El poderdante acude a un notario para otorgar un poder. El apoderado presenta el poder notarial válido en el momento de la firma. El notario verifica la validez del poder.',
          importance: 'Permite realizar trámites importantes sin estar presente físicamente. Útil si vives en el extranjero, tienes problemas de movilidad o no puedes asistir el día de la firma.',
          example: 'Vives fuera de España y quieres comprar un piso. Otorgas un poder notarial a un familiar para que firme la escritura de compraventa e hipoteca en tu nombre.',
          notes: 'Existen distintos tipos de poderes (generales, especiales). Es crucial definir bien las facultades otorgadas. El poder puede revocarse en cualquier momento ante notario.'
        }
      ]
    },
    {
      title: 'Impuestos y gastos asociados a la compraventa',
      terms: [
        {
          id: 'itp',
          term: 'Impuesto de Transmisiones Patrimoniales (ITP)',
          definition: 'Impuesto que paga el comprador al adquirir una vivienda de segunda mano (o cualquier bien usado).',
          utility: 'Es un porcentaje sobre el precio de compraventa (o el valor de referencia de Hacienda, si es mayor). El porcentaje varía según la Comunidad Autónoma (entre 4% y 11% aprox.). Se paga una sola vez, tras la firma de la escritura.',
          importance: 'Es uno de los gastos más importantes al comprar una vivienda usada. Debes tenerlo en cuenta en tu presupuesto.',
          example: 'Compras un piso de segunda mano por 200.000€ en una C.A. con un ITP del 8%. Pagarás 16.000€ de ITP.',
          notes: 'Si compras vivienda nueva, pagas IVA (10% o 4% VPO) en lugar de ITP. Consulta el tipo exacto de ITP en tu C.A., ya que hay tipos reducidos para jóvenes, familias numerosas, etc.'
        },
        {
          id: 'ajd',
          term: 'Impuesto sobre Actos Jurídicos Documentados (AJD)',
          definition: 'Impuesto que grava ciertos documentos notariales, registrales y mercantiles.',
          utility: 'En la compraventa con hipoteca, se aplica principalmente sobre la escritura de hipoteca. Lo paga el banco (desde la Ley 5/2019) por la constitución de la hipoteca. Si compras vivienda nueva, también pagas AJD por la escritura de compraventa.',
          importance: 'Aunque el AJD de la hipoteca lo paga el banco, si compras obra nueva, debes sumar el AJD de la compraventa a tus gastos.',
          example: 'Compras piso nuevo por 250.000€ en una C.A. con AJD del 1,5%. Pagarás 3.750€ de AJD por la compraventa (además del IVA).',
          notes: 'Consulta el tipo de AJD en tu C.A. Hay tipos reducidos en algunos casos según el tipo de operación y las circunstancias específicas.'
        },
        {
          id: 'ibi',
          term: 'Impuesto sobre Bienes Inmuebles (IBI)',
          definition: 'Impuesto municipal anual que grava la propiedad de un inmueble (piso, casa, local, garaje...).',
          utility: 'Lo paga quien sea propietario a 1 de enero de cada año. Se calcula aplicando un tipo (%) fijado por el ayuntamiento al valor catastral del inmueble. Cada ayuntamiento decide el tipo y el calendario de pago.',
          importance: 'Es un gasto fijo anual que tendrás como propietario. Al comprar, es habitual pactar el prorrateo del IBI del año de la compraventa entre comprador y vendedor según la fecha de la firma.',
          example: 'Valor catastral: 80.000€. Tipo IBI ayuntamiento: 0,6%. IBI anual = 480€.',
          notes: 'Puedes consultar el valor catastral en la Sede Electrónica del Catastro o en un recibo antiguo del IBI. El impago genera recargos.'
        },
        {
          id: 'plusvalia',
          term: 'Plusvalía Municipal (IIVTNU)',
          definition: 'Impuesto municipal sobre el Incremento de Valor de los Terrenos de Naturaleza Urbana (IIVTNU). Grava el aumento de valor del suelo durante el tiempo que has sido propietario.',
          utility: 'Se paga al transmitir un inmueble urbano (venta, herencia, donación). Lo paga el vendedor (en compraventas) o quien recibe el bien. El cálculo depende del valor catastral del suelo, los años de tenencia y los coeficientes del ayuntamiento.',
          importance: 'Si vendes una propiedad, es un coste a tener en cuenta. Si heredas o recibes una donación, también. IMPORTANTE: Si no ha habido incremento de valor real del suelo (demostrable), no se paga.',
          example: 'Vendes un piso que compraste hace 15 años. El ayuntamiento calculará la plusvalía en función del aumento de valor del suelo en ese periodo.',
          notes: 'La normativa ha cambiado varias veces tras sentencias del Tribunal Constitucional. Consulta en tu ayuntamiento o con un asesor fiscal para el cálculo exacto y verificar si procede el pago.'
        }
      ]
    },
    {
      title: 'Conceptos relacionados con la vivienda y su valoración',
      terms: [
        {
          id: 'ite-iee',
          term: 'ITE / IEE (Inspección Técnica / Evaluación de Edificios)',
          definition: 'Inspección obligatoria para edificios con cierta antigüedad (normalmente >50 años) para evaluar su estado de conservación, seguridad, accesibilidad y, en el caso del IEE, eficiencia energética.',
          utility: 'La periodicidad y obligatoriedad dependen de la normativa autonómica y municipal. Un técnico cualificado revisa estructura, fachadas, cubiertas, instalaciones. El Informe de Evaluación de Edificios (IEE) es más completo que la antigua ITE.',
          importance: 'Si compras en un edificio que debe tener ITE/IEE, verifica que esté en regla y que no requiera obras urgentes. Puede afectar al precio de la vivienda y a futuras derramas.',
          example: 'Un edificio de 1960 en Madrid debe pasar IEE cada 10 años. Si el informe detecta deficiencias en la fachada, la comunidad debe hacer obras y pagar una derrama.',
          notes: 'La normativa varía por comunidades autónomas y municipios. Consulta en tu ayuntamiento la obligatoriedad y periodicidad en tu zona.'
        },
        {
          id: 'certificado-energetico',
          term: 'Certificado de Eficiencia Energética (CEE)',
          definition: 'Documento oficial que califica la eficiencia energética de un inmueble mediante una escala de letras (A=más eficiente, G=menos eficiente) y proporciona recomendaciones de mejora.',
          utility: 'Obligatorio para vender o alquilar una vivienda. Debe realizarlo un técnico competente e inscribirse en el registro autonómico. Tiene validez de 10 años.',
          importance: 'Te informa sobre el consumo energético esperado y los costes de climatización. Una calificación baja puede indicar gastos futuros en calefacción/refrigeración.',
          example: 'Una vivienda con calificación G puede tener facturas de luz/gas muy altas. Una con calificación A tendrá consumos mínimos.',
          notes: 'Es obligatorio desde 2013. El vendedor debe entregártelo antes de la firma. Si no lo tiene, puede ser multado. Las mejoras energéticas pueden aumentar el valor de la vivienda.'
        },
        {
          id: 'nuda-propiedad',
          term: 'Nuda propiedad y Usufructo',
          definition: 'División de la propiedad en dos derechos: nuda propiedad (derecho a disponer del bien) y usufructo (derecho a usar y obtener frutos del bien).',
          utility: 'El nudopropietario tiene la titularidad pero no puede usar el inmueble. El usufructuario puede vivir en él o alquilarlo, pero no venderlo. El usufructo puede ser temporal o vitalicio.',
          importance: 'Permite operaciones como la venta con reserva de usufructo (vender pero seguir viviendo) o la inversión en nuda propiedad (comprar más barato esperando a que termine el usufructo).',
          example: 'Una persona mayor vende su casa pero se reserva el usufructo vitalicio. El comprador paga menos pero no puede usar la vivienda hasta que fallezca el vendedor.',
          notes: 'Es una figura compleja que requiere asesoramiento jurídico. Los precios de nuda propiedad se calculan según la edad del usufructuario y las tablas oficiales.'
        }
      ]
    },
    {
      title: 'Riesgos y protecciones para el consumidor',
      terms: [
        {
          id: 'clausula-suelo',
          term: 'Cláusula suelo',
          definition: 'Cláusula (declarada abusiva si no fue transparente) en hipotecas variables antiguas que establecía un tipo de interés mínimo a pagar, impidiendo beneficiarse de las bajadas del Euríbor por debajo de ese límite.',
          utility: 'Si tu hipoteca era Euríbor + 1% y tenía un suelo del 3%, aunque el Euríbor bajara a 0,5% (resultando en 1,5%), tú seguías pagando el 3%. El Tribunal Supremo las declaró nulas en 2013 por falta de transparencia en su comercialización.',
          importance: 'Si firmaste tu hipoteca variable antes de 2013-2015, revisa si la tenía. Si la tuvo y fue declarada nula (o la eliminaste por acuerdo), puedes reclamar la devolución de lo pagado de más. Las hipotecas nuevas ya no suelen incluirla o, si lo hacen, debe ser negociada y transparente.',
          example: 'Tenías suelo del 2,5%. El Euríbor + diferencial bajó al 1% durante años, pero tú seguiste pagando el 2,5%. Podrías reclamar la diferencia.',
          notes: 'Aunque la Ley Hipotecaria de 2019 no las prohíbe expresamente, la exigencia de transparencia hace muy difícil su inclusión válida hoy en día. Consulta con un abogado si crees que te afecta.'
        }
      ]
    },
    {
      title: 'Términos financieros y bancarios',
      terms: [
        {
          id: 'ltv',
          term: 'LTV (Loan to Value)',
          definition: 'Ratio que indica el porcentaje del valor del inmueble que financia el banco.',
          utility: 'Determina cuánto dinero prestará el banco en relación al valor de tasación.',
          importance: 'A menor LTV, mejores condiciones de financiación.',
          example: 'LTV del 80% significa que el banco financia el 80% del valor tasado.',
          notes: 'La mayoría de bancos financian hasta el 80% del valor de tasación.'
        },
        {
          id: 'prestamos-vs-credito',
          term: 'Préstamos vs Crédito',
          definition: 'Aunque se usan como sinónimos, son diferentes: Préstamo: Te dan una cantidad fija de dinero de golpe, que devuelves en cuotas periódicas (capital + intereses) en un plazo pactado. Ejemplo: préstamo hipotecario, préstamo coche. Crédito: Te conceden un límite de dinero disponible. Usas solo lo que necesitas y pagas intereses solo por la cantidad usada. Conforme devuelves, vuelve a estar disponible. Ejemplo: tarjeta de crédito, línea de crédito.',
          utility: 'Préstamo: Operación cerrada. Para una necesidad concreta y planificada. Crédito: Operación abierta y flexible. Para necesidades puntuales o recurrentes de liquidez.',
          importance: 'Entender la diferencia te ayuda a elegir el producto adecuado. Un préstamo suele tener intereses más bajos que un crédito, pero es menos flexible.',
          example: 'Para comprar una casa necesitas un préstamo hipotecario (cantidad fija a devolver). Para gastos variables mensuales, mejor una línea de crédito.',
          notes: 'Elige préstamo para compras importantes y planificadas. Usa crédito para flexibilidad en gastos variables.'
        },
        {
          id: 'scoring-bancario',
          term: 'Scoring bancario',
          definition: 'Puntuación que el banco te asigna para medir tu riesgo como cliente al solicitar financiación (préstamo, hipoteca).',
          utility: 'Un sistema automático analiza tu perfil: ingresos, estabilidad laboral, deudas existentes, historial de pagos (CIRBE), edad, etc. Asigna una puntuación: a mayor puntuación, menor riesgo percibe el banco. El resultado influye en si te conceden el préstamo y en qué condiciones (tipo de interés, importe).',
          importance: 'Un buen scoring facilita el acceso a financiación y mejora las condiciones. Un mal scoring puede llevar a la denegación o a condiciones peores. Factores clave: No tener impagos registrados (ASNEF, RAI). Tener ingresos estables y suficientes. Nivel de endeudamiento bajo (ratio cuotas/ingresos < 35-40%). Antigüedad laboral. Buen historial de pagos en otros préstamos (CIRBE).',
          example: 'Cliente A: ingresos estables, sin deudas, antigüedad laboral → scoring alto → mejores condiciones. Cliente B: ingresos irregulares, deudas previas → scoring bajo → condiciones peores o denegación.',
          notes: 'Puedes mejorar tu scoring pagando deudas, evitando descubiertos y manteniendo un buen historial financiero.'
        },
        {
          id: 'aval',
          term: 'Aval',
          definition: 'Garantía adicional por la cual una tercera persona o entidad (avalista) se compromete a pagar la deuda si el titular principal (avalado) no lo hace.',
          utility: 'El banco puede pedir un aval si considera que el solicitante tiene un perfil de riesgo (ingresos justos, poca antigüedad, LTV alto...). El avalista responde con todo su patrimonio presente y futuro. Puede ser un aval personal (un familiar o amigo) o un aval bancario (otra entidad lo garantiza, a cambio de un coste).',
          importance: 'Como solicitante: Puede permitirte acceder a una hipoteca que de otro modo te denegarían. Como avalista: Es una responsabilidad muy grande. Si el titular falla, tú asumes la deuda íntegra.',
          example: 'Un joven con contrato temporal pide hipoteca. El banco le pide que sus padres le avalen como garantía adicional.',
          notes: 'Ser avalista afecta a tu propia capacidad de endeudamiento. Piénsalo muy bien antes de avalar a alguien.'
        },
        {
          id: 'ppa',
          term: 'Plan de Previsión Asegurado (PPA)',
          definition: 'Producto de ahorro para la jubilación similar a un plan de pensiones, pero estructurado como un seguro de vida-ahorro.',
          utility: 'Realizas aportaciones periódicas o únicas. La aseguradora garantiza un tipo de interés mínimo (rentabilidad asegurada), aunque puede ser bajo. Tiene las mismas ventajas fiscales que los planes de pensiones (reducción en IRPF por aportaciones). El rescate solo es posible en casos tasados (jubilación, invalidez, desempleo de larga duración, enfermedad grave...).',
          importance: 'Ofrece seguridad: sabes que al menos recuperarás el capital aportado más un interés mínimo garantizado. Ideal para perfiles muy conservadores que priorizan la seguridad sobre la rentabilidad. Permite traspasar el dinero desde/hacia planes de pensiones sin coste fiscal.',
          example: 'Contratas un PPA y aportas 100€/mes. La aseguradora te garantiza un 0,5% anual. Al jubilarte, recibirás el capital acumulado.',
          notes: 'La rentabilidad suele ser menor que la potencial de los planes de pensiones (que invierten en renta variable/fija). Compara condiciones y comisiones.'
        },
        {
          id: 'plan-pensiones',
          term: 'Plan de pensiones',
          definition: 'Producto de ahorro a largo plazo diseñado para complementar la pensión pública de jubilación.',
          utility: 'Realizas aportaciones periódicas o únicas a un fondo de pensiones. El dinero se invierte según la política del fondo (renta fija, mixta, variable), buscando rentabilidad. La rentabilidad no está garantizada y puedes tener pérdidas. Tiene ventajas fiscales: las aportaciones reducen tu base imponible en el IRPF (hasta un límite anual). El rescate está restringido a contingencias específicas (jubilación, invalidez, dependencia, fallecimiento, y supuestos excepcionales como desempleo de larga duración o enfermedad grave).',
          importance: 'Fomenta el ahorro para la jubilación con beneficios fiscales. Permite elegir el nivel de riesgo de la inversión según tu perfil. Puedes traspasar tu plan entre entidades sin coste fiscal.',
          example: 'Aportas 150€/mes a un plan de pensiones de renta variable mixta. El valor de tu ahorro fluctuará con el mercado. Al jubilarte, rescatas el capital acumulado (pagando impuestos en ese momento).',
          notes: 'Al rescatarlo, el dinero tributa como rendimiento del trabajo en el IRPF. Existen distintas formas de rescate (capital, renta, mixta) con diferente impacto fiscal. Asesórate bien.'
        }
      ]
    },
    {
      title: 'Otros conceptos',
      terms: [
        {
          id: 'contrato-arras',
          term: 'Contrato de arras',
          definition: 'Acuerdo privado entre comprador y vendedor previo a la escritura de compraventa, donde se pactan las condiciones de la operación y el comprador entrega una cantidad de dinero (señal o arras) como garantía.',
          utility: 'Existen varios tipos, las más comunes son las arras penitenciales (Art. 1454 Código Civil): El comprador entrega una cantidad (normalmente 5-10% del precio). Si el comprador se echa atrás, pierde las arras entregadas. Si el vendedor se echa atrás, debe devolver las arras duplicadas. Se fija un plazo máximo para firmar la escritura pública.',
          importance: 'Da seguridad a ambas partes de que la operación se realizará en las condiciones pactadas, estableciendo penalizaciones claras si alguien incumple.',
          example: 'Firmas arras para comprar un piso de 150.000€, entregando 15.000€. Si te echas atrás, pierdes los 15.000€. Si se echa atrás el vendedor, te devuelve 30.000€.',
          notes: 'Es crucial redactar bien el contrato de arras, especificando todos los detalles (precio, plazo, descripción inmueble, reparto de gastos, tipo de arras). Asesórate legalmente.'
        },
        {
          id: 'derecho-tanteo-retracto',
          term: 'Derecho de tanteo y retracto',
          definition: 'Derecho de adquisición preferente que permite a una persona o entidad comprar un bien (ej. vivienda) con prioridad sobre un tercero, en las mismas condiciones.',
          utility: 'Tanteo: Se ejerce antes de la venta. El propietario debe notificar al titular del derecho su intención de vender y las condiciones, para que este decida si compra o no. Retracto: Se ejerce después de la venta (si no se respetó el tanteo o las condiciones cambiaron). El titular puede "deshacer" la venta al tercero y quedarse él con el bien, pagando el mismo precio. Suele aplicarse en casos como alquileres (inquilino tiene tanteo/retracto si el casero vende), copropiedad, colindantes de fincas rústicas, o a favor de Administraciones Públicas (VPO).',
          importance: 'Si eres titular del derecho (ej. inquilino): Te da preferencia para comprar la vivienda si el dueño la vende. Si eres comprador: Verifica si la vivienda está sujeta a algún derecho de tanteo/retracto que pueda afectar tu compra. Si eres vendedor: Debes respetar estos derechos notificando correctamente para evitar problemas legales.',
          example: 'Eres inquilino y tu casero decide vender el piso. Tiene que notificarte primero las condiciones por si quieres comprarlo tú (tanteo). Si lo vende a otro sin notificarte, podrías ejercer el retracto.',
          notes: 'Los plazos para ejercer estos derechos son cortos (normalmente 30 días para tanteo, 30 días para retracto desde la notificación o inscripción). Regulado en Código Civil y Ley de Arrendamientos Urbanos.'
        }
      ]
    }
  ];

  const buyingGuideSteps = [
    {
      id: 'financial-evaluation',
      title: 'Evaluación financiera personal',
      status: 'complete',
      content: {
        summary: 'Antes de comprar, analiza tu situación financiera para saber cuánto puedes destinar a una hipoteca sin riesgos. Adaptamos recomendaciones de Dave Ramsey al mercado español. Esta es nuestra visión; tus decisiones financieras son tu responsabilidad.',
        details: [
          {
            title: 'Analiza tus ingresos y gastos',
            description: 'Detalla tus ingresos netos mensuales y todos tus gastos (fijos y variables: comida, transporte, ocio...). Saber dónde va tu dinero te ayuda a calcular cuánto puedes dedicar a la hipoteca.'
          },
          {
            title: 'Calcula tu capacidad de endeudamiento',
            description: 'Los bancos recomiendan que la cuota no supere el 30-35% de tus ingresos netos. Nosotros sugerimos un máximo del 25% (+/- 1%) para tener más margen. Usa nuestra sección Viabilidad para estimar qué hipoteca podrías permitirte.'
          },
          {
            title: 'Presupuesta la entrada y gastos iniciales',
            description: 'Además del precio, calcula los gastos de compra (impuestos, notaría, registro...). Necesitarás ahorrar entre un 10% y 30% del valor de la vivienda para la entrada y estos gastos. Considera también un extra para pequeñas adecuaciones (pintura, muebles básicos).'
          },
          {
            title: 'Crea un fondo de emergencia',
            description: 'Recomendamos tener ahorrados 3-6 meses de tus gastos mensuales, aparte de la entrada y otros costes. Este colchón te protege ante imprevistos (pérdida de empleo, reparaciones...) y evita que falles en los pagos de la hipoteca.'
          }
        ]
      }
    },
    {
      id: 'market-research',
      title: 'Investigación del mercado inmobiliario',
      status: 'complete',
      content: {
        summary: 'Conocer el mercado te ayuda a tomar mejores decisiones y negociar. Investiga a fondo antes de comprar.',
        details: [
          {
            title: 'Explora portales y agencias',
            description: 'Usa webs como Idealista, Fotocasa o Pisos.com. Filtra por zona, precio y características. No descartes agencias locales, a veces tienen exclusivas.'
          },
          {
            title: 'Analiza la ubicación',
            description: 'Es clave para el valor y la revalorización. Investiga servicios (supermercados, hospitales, parques), transporte (metro, bus, carreteras), educación (colegios, institutos), urbanismo (proyectos futuros) y orientación (sur, sureste o suroeste suelen ser más valoradas). Usa Shademap para ver la luz solar anual.'
          },
          {
            title: 'Compara precios',
            description: 'Investiga el precio/m² de la zona y compara con pisos similares. Usa informes como el de Idealista para ver tendencias.'
          },
          {
            title: 'Obra nueva vs. Segunda mano',
            description: 'Obra nueva es más eficiente pero más cara y a menudo en zonas nuevas. Segunda mano es más asequible, en zonas consolidadas, pero puede necesitar reformas (presupuesta posibles costes).'
          },
          {
            title: 'Consulta el Registro de la Propiedad',
            description: 'Pide una nota simple en Registradores.org. Verifica quién es el dueño y si hay cargas (hipotecas, embargos).'
          },
          {
            title: 'Habla con vecinos e infórmate de la comunidad',
            description: 'Pregunta sobre el barrio (ruido, ambiente...). Si es un piso, infórmate de la cuota de comunidad, estado del edificio y posibles derramas futuras.'
          },
          {
            title: 'Busca asesoramiento profesional',
            description: 'Un agente inmobiliario o asesor legal puede ayudarte a identificar riesgos, revisar documentos y negociar.'
          }
        ]
      }
    },
    {
      id: 'mortgage-preapproval',
      title: 'Preaprobación hipotecaria',
      status: 'complete',
      content: {
        summary: 'Saber cuánto te presta el banco y en qué condiciones te da poder de negociación y agiliza la compra. Demuestra que eres un comprador solvente.',
        details: [
          {
            title: 'Reúne la documentación',
            description: 'DNI/NIE, 3 últimas nóminas, última declaración de la renta, vida laboral, movimientos bancarios de los últimos 6 meses y contrato laboral.'
          },
          {
            title: 'Tipos de hipotecas',
            description: 'Fija (interés constante), Variable (interés ligado al Euríbor + diferencial), Mixta (tramo inicial fijo, luego variable). Elige según tu tolerancia al riesgo.'
          },
          {
            title: 'Usa nuestro simulador',
            description: 'En la sección Simulador puedes calcular escenarios de hipoteca fija (sistema francés). Ajusta TIN, TAE y plazo para ver cuotas y coste total.'
          },
          {
            title: 'Compara ofertas de varios bancos',
            description: 'No te quedes con la primera. Compara principalmente el Tipo de Interés Nominal (TIN) y las posibles bonificaciones a aplicar. Aunque la TAE incluye gastos, cada banco calcula los productos vinculados de forma diferente (algunos incluyen seguros opcionales, otros no), lo que hace que no sea comparable entre entidades. El TIN es más objetivo. Ten en cuenta que las ofertas online son orientativas; negociando en persona se pueden conseguir mejores condiciones.'
          },
          {
            title: 'Bonificaciones útiles',
            description: 'De forma general, las más interesantes son la domiciliación de la nómina, seguro de hogar y seguro de vida. Cuidado con otras vinculaciones, como aportaciones a planes de pensiones o a fondos de inversión, que pueden no ser rentables por las comisiones que cobra el banco.'
          },
          {
            title: 'Negocia comisiones de amortización',
            description: 'Cuanto más bajas, más flexibilidad tendrás para adelantar pagos sin penalización. Por ley se establece el 2%, tanto el amortización parcial como total, pero son negociables.'
          },
          {
            title: 'Mantén tu perfil estable',
            description: 'Entre la preaprobación y la firma, evita nuevas deudas o cambios laborales que podrían alterar la oferta del banco.'
          }
        ]
      }
    },
    {
      id: 'earnest-contract',
      title: 'Contrato de arras',
      status: 'complete',
      content: {
        summary: 'Asegura la operación y fija reglas claras mientras preparas la firma en notaría. Lo importante es especificar qué tipo de arras son y atar plazos y condiciones.',
        details: [
          {
            title: 'Tipos de arras (indícalo expresamente)',
            description: 'Penitenciales (art. 1454 CC, las más usadas): si el comprador desiste, pierde las arras; si desiste el vendedor, las devuelve duplicadas.'
          },
          {
            title: 'Importe y forma de pago',
            description: 'Suele ser un 5–10% del precio. Realiza el pago por transferencia o cheque bancario, con recibo. Evita efectivo.'
          },
          {
            title: 'Cláusulas imprescindibles',
            description: 'Precio total de compra, importe de las arras entregadas y plazo máximo para firmar la escritura (mínimo recomendado: 2 meses para dar tiempo a obtener la hipoteca). Incluye condición suspensiva de financiación: si no consigues oferta vinculante del banco en X días, se anulan las arras y se devuelve el dinero sin penalización. Incluye un anexo con los elementos que se quedan en el inmueble (electrodomésticos, armarios, muebles).'
          },
          {
            title: 'Identificación del inmueble',
            description: 'Dirección, nº de finca registral, referencia catastral y anejos (plaza de garaje, trastero). Estado jurídico: "libre de cargas y arrendatarios" salvo lo pactado.'
          },
          {
            title: 'Gastos e impuestos',
            description: 'Quién paga plusvalía, derramas aprobadas, IBI prorrateado, honorarios de agencia. '
          },
          {
            title: 'Documentación previa recomendada',
            description: 'Nota simple reciente, certificado de deuda 0 de la comunidad, CEE (certificado energético), último recibo IBI.'
          },
          {
            title: 'Errores a evitar',
            description: 'No indicar el tipo de arras, no poner condición suspensiva de hipoteca, no identificar bien la finca o sus anejos, pagar sin recibo/trazabilidad.'
          }
        ]
      }
    },
    {
      id: 'appraisal',
      title: 'Tasación',
      status: 'complete',
      content: {
        summary: 'Sirve para que el banco determine el valor del inmueble y, por tanto, cuánto te presta. Normalmente financian hasta el 80% del menor entre precio y tasación.',
        details: [
          {
            title: 'Quién la hace y validez',
            description: 'La realiza una sociedad de tasación homologada. Puedes aportar tu propia tasación si la está homologada por el Banco de España. Vigencia habitual: 6 meses.'
          },
          {
            title: 'Coste y pago',
            description: 'Coste orientativo 300–500€ según zona y superficie. Lo paga normalmente el solicitante (no suele ser reembolsable).'
          },
          {
            title: 'Qué revisa el tasador',
            description: 'Ubicación, superficie útil/construida, estado de conservación, antigüedad, eficiencia energética, comparables de mercado, cargas urbanísticas. Comprueba datos registrales y catastrales.'
          },
          {
            title: 'Tasación vs. otros valores',
            description: 'No confundir con "valor de referencia catastral" (efectos fiscales) ni con estimaciones de portales (no vinculantes para el banco).'
          },
          {
            title: 'Pide siempre',
            description: 'Informe completo en PDF con su código/verificación y fecha de validez.'
          }
        ]
      }
    },
    {
      id: 'public-deed',
      title: 'Escritura pública',
      status: 'complete',
      content: {
        summary: 'La compraventa (y la hipoteca, si la hay) se formalizan ante notario. El notario garantiza la legalidad y te asesora gratuitamente.',
        details: [
          {
            title: 'Antes de la firma',
            description: 'Revisa con tu notaría la FEIN y FiAE (hipoteca) y resuelve dudas (acta de transparencia previa). Pide borrador de las escrituras y la minuta de gastos.'
          },
          {
            title: 'Elección de notario',
            description: 'El comprador tiene derecho a elegir notario. Indícalo a la parte vendedora/banco con antelación.'
          },
          {
            title: 'Quién acude',
            description: 'Comprador/es, vendedor/es (o apoderados), representante del banco y gestoría.'
          },
          {
            title: 'Documentación habitual',
            description: 'DNI/NIE, cheques/OMF preparados, certificado de comunidad (deuda 0), último IBI, CEE, llaves, inventario, borrador FEIN/FiAE.'
          },
          {
            title: 'El día de la firma (orden típico)',
            description: 'Lectura de la escritura de compraventa, pago seguro (cheques bancarios/OMF), entrega de llaves y posesión, firma de la hipoteca (si aplica), la gestoría se lleva documentación para trámites.'
          },
          {
            title: 'Gastos de notaría',
            description: 'Compraventa los paga normalmente el comprador. Hipoteca (desde 2019) los asume el banco, salvo tasación y copias adicionales.'
          },
          {
            title: 'Qué te llevas',
            description: 'Copia simple de la compraventa (y de la hipoteca, si aplica) y justificantes; la copia autorizada suele quedar para trámites posteriores.'
          }
        ]
      }
    },
    {
      id: 'taxes-registry',
      title: 'Impuestos y registro',
      status: 'complete',
      content: {
        summary: 'Tras firmar, toca liquidar impuestos e inscribir. Suele gestionarlo una gestoría con una provisión de fondos.',
        details: [
          {
            title: 'Compra de segunda mano',
            description: 'ITP (Modelo autonómico) se liquida en tu Comunidad Autónoma (~30 días hábiles). El tipo depende de la C.A. y características del comprador/inmueble.'
          },
          {
            title: 'Obra nueva',
            description: 'IVA (general 10%; VPO puede ser 4%) se paga al vendedor en la notaría. AJD de la compraventa (tipo autonómico) se liquida en Hacienda autonómica tras la firma.'
          },
          {
            title: 'Hipoteca',
            description: 'AJD del préstamo y gastos de notaría/registro/gestoría de la hipoteca los asume generalmente el banco (régimen posterior a 2019), salvo excepciones pactadas.'
          },
          {
            title: 'Registro de la Propiedad',
            description: 'La gestoría presenta la escritura y, tras calificación, queda inscrita. Plazo orientativo: 2–6 semanas. Después te entregan facturas justificadas y liquidación final.'
          },
          {
            title: 'Trámites post–compra',
            description: 'Cambio de suministros (luz, gas, agua), domiciliar IBI y basuras, comunicar cambio de titularidad en Catastro, seguro de hogar (imprescindible si hay hipoteca), comunicar a la comunidad de propietarios.'
          },
          {
            title: 'Bonificaciones y tipos reducidos',
            description: 'Revisa si cumples requisitos (jóvenes, familias numerosas, discapacidad, vivienda habitual, zonas rurales, etc.). Son autonómicos.'
          },
          {
            title: 'Checklist final',
            description: 'Recoge copias y facturas, guarda bancos/OMF/cheques y el inventario firmado, verifica inscripción y que Catastro/IBI reflejan al nuevo titular.'
          }
        ]
      }
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Section Navigation */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-2">
        <div className="flex justify-around max-w-md mx-auto">
          {sections.map(({ id, label }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-slate-700'
                    : 'hover:bg-slate-700'
                }`}
              >
                <span className={`text-xs ${isActive ? '' : 'text-slate-400 hover:text-white'}`} style={isActive ? {color: '#F6EBD9'} : {}}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {activeSection === 'dictionary' ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-orange-500 mb-6">Diccionario hipotecario</h2>
              
              {dictionaryCategories.map((category) => (
                <div key={category.title} className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4">{category.title}</h3>
                  
                  <div className="space-y-3">
                    {category.terms.map((termData) => (
                      <div key={termData.id} className="border border-slate-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleExpanded(termData.id)}
                          className="w-full px-4 py-3 text-left bg-slate-700 hover:bg-slate-600 transition-colors flex items-center justify-between"
                        >
                          <span className="font-medium text-white">{termData.term}</span>
                          {expandedItems.includes(termData.id) ? (
                            <ChevronDown size={20} className="text-slate-400" />
                          ) : (
                            <ChevronRight size={20} className="text-slate-400" />
                          )}
                        </button>
                        
                        {expandedItems.includes(termData.id) && (
                          <div className="p-4 bg-slate-750 space-y-3">
                            <div>
                              <h4 className="font-semibold text-orange-400 mb-1">Definición</h4>
                              <p className="text-slate-300 text-sm">{termData.definition}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-orange-400 mb-1">Utilidad</h4>
                              <p className="text-slate-300 text-sm">{termData.utility}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-orange-400 mb-1">Por qué es importante</h4>
                              <p className="text-slate-300 text-sm">{termData.importance}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-orange-400 mb-1">Ejemplo</h4>
                              <p className="text-slate-300 text-sm">{termData.example}</p>
                            </div>
                            
                            {termData.notes && (
                              <div>
                                <h4 className="font-semibold text-orange-400 mb-1">Notas adicionales</h4>
                                <p className="text-slate-300 text-sm">{termData.notes}</p>
                                
                                {/* Tabla específica para ITP */}
                                {termData.id === 'itp' && (
                                  <div className="mt-4">
                                    <h5 className="font-medium text-orange-300 mb-2">Tipos de ITP por Comunidad Autónoma (2024)</h5>
                                    <div className="overflow-x-auto">
                                      <table className="min-w-full bg-slate-600 border border-slate-500 rounded-lg text-xs">
                                        <thead>
                                          <tr className="bg-slate-500">
                                            <th className="px-3 py-2 text-left text-orange-200 font-medium border-b border-slate-400">Comunidad Autónoma</th>
                                            <th className="px-3 py-2 text-left text-orange-200 font-medium border-b border-slate-400">Tipo (%)</th>
                                          </tr>
                                        </thead>
                                        <tbody className="text-slate-200">
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Andalucía</td><td className="px-3 py-1 border-b border-slate-500">7%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Aragón</td><td className="px-3 py-1 border-b border-slate-500">8-10%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Asturias</td><td className="px-3 py-1 border-b border-slate-500">8-10%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Baleares</td><td className="px-3 py-1 border-b border-slate-500">8-13%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Canarias</td><td className="px-3 py-1 border-b border-slate-500">6,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Cantabria</td><td className="px-3 py-1 border-b border-slate-500">9%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Castilla-La Mancha</td><td className="px-3 py-1 border-b border-slate-500">9%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Castilla y León</td><td className="px-3 py-1 border-b border-slate-500">8-10%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Cataluña</td><td className="px-3 py-1 border-b border-slate-500">10-11%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Ceuta</td><td className="px-3 py-1 border-b border-slate-500">6%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Madrid</td><td className="px-3 py-1 border-b border-slate-500">6%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">C. Valenciana</td><td className="px-3 py-1 border-b border-slate-500">10-11%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Extremadura</td><td className="px-3 py-1 border-b border-slate-500">8-11%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Galicia</td><td className="px-3 py-1 border-b border-slate-500">8%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">La Rioja</td><td className="px-3 py-1 border-b border-slate-500">7%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Melilla</td><td className="px-3 py-1 border-b border-slate-500">6%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Murcia</td><td className="px-3 py-1 border-b border-slate-500">8%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Navarra</td><td className="px-3 py-1 border-b border-slate-500">6%</td></tr>
                                          <tr><td className="px-3 py-1">País Vasco</td><td className="px-3 py-1">7%</td></tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2">
                                      Fuente: REAF 2024. Los tipos pueden variar según el valor del inmueble y circunstancias específicas.
                                    </p>
                                  </div>
                                )}

                                {/* Tabla específica para AJD */}
                                {termData.id === 'ajd' && (
                                  <div className="mt-4">
                                    <h5 className="font-medium text-orange-300 mb-2">Tipos de AJD por Comunidad Autónoma (2024)</h5>
                                    <div className="overflow-x-auto">
                                      <table className="min-w-full bg-slate-600 border border-slate-500 rounded-lg text-xs">
                                        <thead>
                                          <tr className="bg-slate-500">
                                            <th className="px-3 py-2 text-left text-orange-200 font-medium border-b border-slate-400">Comunidad Autónoma</th>
                                            <th className="px-3 py-2 text-left text-orange-200 font-medium border-b border-slate-400">Tipo (%)</th>
                                          </tr>
                                        </thead>
                                        <tbody className="text-slate-200">
                                          <tr><td className="px-3 py-1 border-b border-slate-500">País Vasco</td><td className="px-3 py-1 border-b border-slate-500">0,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Navarra</td><td className="px-3 py-1 border-b border-slate-500">0,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Ceuta</td><td className="px-3 py-1 border-b border-slate-500">0,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Melilla</td><td className="px-3 py-1 border-b border-slate-500">0,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Canarias</td><td className="px-3 py-1 border-b border-slate-500">0,75%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Madrid</td><td className="px-3 py-1 border-b border-slate-500">0,75%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">La Rioja</td><td className="px-3 py-1 border-b border-slate-500">1%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Andalucía</td><td className="px-3 py-1 border-b border-slate-500">1,2%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Asturias</td><td className="px-3 py-1 border-b border-slate-500">1,2%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Aragón</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Baleares</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Cantabria</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Castilla-La Mancha</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Castilla y León</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Cataluña</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">C. Valenciana</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Extremadura</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Galicia</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1">Murcia</td><td className="px-3 py-1">1,5%</td></tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2">
                                      Fuente: REAF 2024 / AEAT. Los tipos pueden tener reducciones según el tipo de operación.
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-orange-500 mb-6">Guía de compra de vivienda</h2>
              
              <div className="space-y-4">
                {buyingGuideSteps.map((step, index) => (
                  <div key={step.id} className="bg-slate-800 rounded-lg overflow-hidden">
                    <button
                      onClick={() => step.status === 'complete' ? toggleExpanded(step.id) : null}
                      disabled={step.status === 'coming-soon'}
                      className={`w-full px-6 py-4 text-left flex items-center justify-between transition-colors ${
                        step.status === 'complete' 
                          ? 'hover:bg-slate-700 cursor-pointer' 
                          : 'cursor-not-allowed'
                      }`}
                    >
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            step.status === 'complete' ? 'bg-green-600' : 'bg-slate-600'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{step.title}</h3>
                            {step.status === 'coming-soon' && (
                              <span className="text-sm text-orange-400">Próximamente</span>
                            )}
                          </div>
                        </div>                      {step.status === 'complete' && (
                        <div>
                          {expandedItems.includes(step.id) ? (
                            <ChevronDown size={20} className="text-slate-400" />
                          ) : (
                            <ChevronRight size={20} className="text-slate-400" />
                          )}
                        </div>
                      )}
                    </button>
                    
                    {expandedItems.includes(step.id) && step.content && (
                      <div className="px-6 pb-4 space-y-4">
                        <p className="text-slate-300 text-sm">{step.content.summary}</p>
                        <div className="space-y-3">
                          {step.content.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="bg-slate-700 rounded-lg p-4">
                              <h4 className="font-medium text-orange-300 mb-2">{detail.title}</h4>
                              <p className="text-slate-300 text-sm leading-relaxed">{detail.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resources;