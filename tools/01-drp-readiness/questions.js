/**
 * DRP Readiness — Questionnaire Data
 * Version: 2.0.0
 *
 * Each question belongs to a dimension and has typed options.
 * Conditional questions specify a `condition` function that receives
 * the current responses map and returns true if the question should appear.
 *
 * Option values:
 *   number  → contributes to scoring
 *   null    → "No sé" (excluded from score, reduces confidence)
 *   'skip'  → "No aplica" (excluded entirely)
 *   'info'  → informational only (not scored)
 */

// ─── Dimensions ──────────────────────────────────────────────────────────────

export const dimensions = [
  {
    id: 'plan_drp',
    label: 'Plan DRP documentado',
    weight: 0.10,
    critical: false,
    questions: ['P01', 'P02', 'P03']
  },
  {
    id: 'rto',
    label: 'Objetivos de recuperación (RTO)',
    weight: 0.08,
    critical: true,
    questions: ['P04']
  },
  {
    id: 'rpo',
    label: 'Objetivos de recuperación (RPO)',
    weight: 0.08,
    critical: true,
    questions: ['P06']
  },
  {
    id: 'respaldos',
    label: 'Respaldos',
    weight: 0.22,
    critical: true,
    questions: ['P08', 'P09', 'P10', 'P11', 'P12']
  },
  {
    id: 'restauraciones',
    label: 'Restauraciones probadas',
    weight: 0.20,
    critical: true,
    questions: ['P13', 'P14']
  },
  {
    id: 'dependencias_responsables',
    label: 'Dependencias y responsables',
    weight: 0.12,
    critical: false,
    questions: ['P15', 'P16', 'P17']
  },
  {
    id: 'ransomware',
    label: 'Protección contra ransomware',
    weight: 0.20,
    critical: true,
    questions: ['P18', 'P19', 'P20']
  }
];

// ─── Context Questions (non-scoring) ─────────────────────────────────────────

export const contextQuestions = [
  {
    id: 'CTX01',
    text: '¿Aproximadamente cuántos sistemas o aplicaciones considera críticos para la operación diaria?',
    type: 'context',
    options: [
      { label: '1 a 3', value: 'info', note: 'Entorno concentrado' },
      { label: '4 a 10', value: 'info', note: 'Entorno moderado' },
      { label: 'Más de 10', value: 'info', note: 'Entorno complejo' },
      { label: 'No sé', value: 'info', note: 'Información pendiente' }
    ]
  },
  {
    id: 'CTX02',
    text: '¿Su operación depende de estos sistemas las 24 horas del día, los 7 días de la semana?',
    type: 'context',
    options: [
      { label: 'Sí, 24/7', value: 'info' },
      { label: 'Sí, pero con ventanas de mantenimiento', value: 'info' },
      { label: 'Solo en horario laboral', value: 'info' },
      { label: 'No sé', value: 'info' }
    ]
  },
  {
    id: 'CTX03',
    text: 'Si sus sistemas críticos dejaran de funcionar por 24 horas, ¿cuál sería la consecuencia principal?',
    type: 'context',
    options: [
      { label: 'Detención total de operaciones', value: 'info' },
      { label: 'Operación degradada con pérdida de ingresos', value: 'info' },
      { label: 'Incomodidad operativa pero sin pérdida directa', value: 'info' },
      { label: 'Impacto mínimo o desconocido', value: 'info' }
    ]
  },
  {
    id: 'CTX04',
    text: '¿Recuerda aproximadamente cuándo fue la última vez que se probó recuperar un sistema desde un respaldo?',
    type: 'context',
    options: [
      { label: 'En los últimos 3 meses', value: 'info' },
      { label: 'Entre 3 y 12 meses', value: 'info' },
      { label: 'Hace más de 12 meses', value: 'info' },
      { label: 'Nunca se ha probado', value: 'info' },
      { label: 'No sé', value: 'info' }
    ]
  }
];

// ─── Scored Questions ────────────────────────────────────────────────────────

export const questions = [
  // ── Dimensión 1: Plan DRP documentado ──
  {
    id: 'P01',
    dimension: 'plan_drp',
    text: '¿Cuenta la organización con un plan de recuperación ante desastres (DRP) documentado y accesible para el equipo responsable?',
    help: 'Un DRP es un documento que describe qué hacer paso a paso cuando los sistemas críticos fallan.',
    allowNA: false,
    condition: null,
    options: [
      { label: 'Sí', value: 1.0 },
      { label: 'Parcial', value: 0.5 },
      { label: 'No', value: 0.0 },
      { label: 'No sé', value: null }
    ]
  },
  {
    id: 'P02',
    dimension: 'plan_drp',
    text: '¿Se ha revisado o actualizado este plan en los últimos 12 meses?',
    help: null,
    allowNA: false,
    condition: (responses) => responses.P01 !== 0.0,
    dependsOn: 'P01',
    options: [
      { label: 'Sí, en los últimos 12 meses', value: 1.0 },
      { label: 'Se revisó hace 12–24 meses', value: 0.5 },
      { label: 'No se ha revisado en más de 24 meses', value: 0.0 },
      { label: 'No sé', value: null }
    ]
  },
  {
    id: 'P03',
    dimension: 'plan_drp',
    text: '¿Las personas que necesitarían ejecutar el plan saben dónde encontrarlo y cómo acceder a él?',
    help: null,
    allowNA: false,
    condition: (responses) => responses.P01 !== 0.0,
    dependsOn: 'P01',
    options: [
      { label: 'Sí, está accesible y lo conocen', value: 1.0 },
      { label: 'Solo algunas personas lo conocen', value: 0.5 },
      { label: 'No, o no estoy seguro', value: 0.0 },
      { label: 'No sé', value: null }
    ]
  },

  // ── Dimensión 2: Objetivos de recuperación — RTO ──
  {
    id: 'P04',
    dimension: 'rto',
    text: '¿Tiene la organización definido un tiempo máximo aceptable para restaurar la operación después de un desastre (RTO)?',
    help: 'RTO (Recovery Time Objective) es cuánto tiempo puede estar caído un sistema antes de que el impacto sea inaceptable.',
    allowNA: false,
    condition: null,
    options: [
      { label: 'Sí, definido y documentado', value: 1.0 },
      { label: 'Se tiene una idea general pero no está documentado', value: 0.5 },
      { label: 'No está definido', value: 0.0 },
      { label: 'No sé', value: null }
    ]
  },
  {
    id: 'P05',
    dimension: 'rto',
    text: '¿Cuál es el tiempo máximo de caída aceptable que manejan como referencia?',
    help: 'Este es un objetivo declarado por el interlocutor, no un tiempo verificado ni garantizado.',
    allowNA: false,
    condition: (responses) => responses.P04 !== 0.0 && responses.P04 !== null,
    dependsOn: 'P04',
    type: 'informational',
    options: [
      { label: 'Menos de 1 hora', value: 'info', reportLabel: 'RTO reportado: < 1h' },
      { label: '1 a 4 horas', value: 'info', reportLabel: 'RTO reportado: 1–4h' },
      { label: '4 a 12 horas', value: 'info', reportLabel: 'RTO reportado: 4–12h' },
      { label: '12 a 24 horas', value: 'info', reportLabel: 'RTO reportado: 12–24h' },
      { label: 'Más de 24 horas', value: 'info', reportLabel: 'RTO reportado: > 24h' }
    ]
  },

  // ── Dimensión 3: Objetivos de recuperación — RPO ──
  {
    id: 'P06',
    dimension: 'rpo',
    text: '¿Tiene la organización definida la cantidad máxima de datos que puede permitirse perder (RPO)?',
    help: 'RPO (Recovery Point Objective) es cuántos datos puede perder. Si los respaldos son cada 24 horas, el RPO es 24 horas como máximo.',
    allowNA: false,
    condition: null,
    options: [
      { label: 'Sí, definido y documentado', value: 1.0 },
      { label: 'Se tiene una idea general pero no está documentado', value: 0.5 },
      { label: 'No está definido', value: 0.0 },
      { label: 'No sé', value: null }
    ]
  },
  {
    id: 'P07',
    dimension: 'rpo',
    text: '¿Cuánta pérdida de datos consideran aceptable como máximo?',
    help: 'Este es un objetivo declarado, no un valor verificado ni garantizado.',
    allowNA: false,
    condition: (responses) => responses.P06 !== 0.0 && responses.P06 !== null,
    dependsOn: 'P06',
    type: 'informational',
    options: [
      { label: 'Menos de 1 hora', value: 'info', reportLabel: 'RPO reportado: < 1h' },
      { label: '1 a 4 horas', value: 'info', reportLabel: 'RPO reportado: 1–4h' },
      { label: '4 a 12 horas', value: 'info', reportLabel: 'RPO reportado: 4–12h' },
      { label: '12 a 24 horas', value: 'info', reportLabel: 'RPO reportado: 12–24h' },
      { label: 'Más de 24 horas', value: 'info', reportLabel: 'RPO reportado: > 24h' }
    ]
  },

  // ── Dimensión 4: Respaldos ──
  {
    id: 'P08',
    dimension: 'respaldos',
    text: '¿Se realizan respaldos de los sistemas y datos que considera críticos?',
    help: null,
    allowNA: false,
    condition: null,
    options: [
      { label: 'Sí', value: 1.0 },
      { label: 'Solo de algunos sistemas', value: 0.5 },
      { label: 'No', value: 0.0 },
      { label: 'No sé', value: null }
    ]
  },
  {
    id: 'P09',
    dimension: 'respaldos',
    text: '¿Con qué frecuencia se realizan estos respaldos?',
    help: null,
    allowNA: false,
    condition: (responses) => responses.P08 !== 0.0,
    dependsOn: 'P08',
    options: [
      { label: 'Diario o más frecuente', value: 1.0 },
      { label: 'Semanal', value: 0.7 },
      { label: 'Mensual o menos frecuente', value: 0.3 },
      { label: 'No hay frecuencia definida', value: 0.0 },
      { label: 'No sé', value: null }
    ]
  },
  {
    id: 'P10',
    dimension: 'respaldos',
    text: '¿Se verifica periódicamente que los respaldos se completaron correctamente y que los datos son recuperables?',
    help: null,
    allowNA: false,
    condition: (responses) => responses.P08 !== 0.0,
    dependsOn: 'P08',
    options: [
      { label: 'Sí, se verifican regularmente', value: 1.0 },
      { label: 'Se verifican ocasionalmente', value: 0.5 },
      { label: 'No se verifican', value: 0.0 },
      { label: 'No sé', value: null }
    ]
  },
  {
    id: 'P11',
    dimension: 'respaldos',
    text: '¿Los respaldos se almacenan en una ubicación separada del entorno principal (otra sede, otra nube, cinta offsite)?',
    help: null,
    allowNA: false,
    condition: (responses) => responses.P08 !== 0.0,
    dependsOn: 'P08',
    options: [
      { label: 'Sí, en ubicación separada', value: 1.0 },
      { label: 'Parcialmente (algunos sí, otros no)', value: 0.5 },
      { label: 'No, están en el mismo entorno', value: 0.0 },
      { label: 'No sé', value: null }
    ]
  },
  {
    id: 'P12',
    dimension: 'respaldos',
    text: '¿Los respaldos están protegidos contra modificación o borrado (inmutables, air-gapped, o con credenciales separadas)?',
    help: '"Inmutable" significa que nadie puede borrar o modificar el respaldo una vez creado, ni siquiera un administrador comprometido.',
    allowNA: false,
    condition: (responses) => responses.P08 !== 0.0,
    dependsOn: 'P08',
    options: [
      { label: 'Sí, son inmutables o están aislados', value: 1.0 },
      { label: 'Tienen credenciales separadas pero no son inmutables', value: 0.5 },
      { label: 'No, un atacante con acceso admin podría borrarlos', value: 0.0 },
      { label: 'No sé', value: null }
    ]
  },

  // ── Dimensión 5: Restauraciones probadas ──
  {
    id: 'P13',
    dimension: 'restauraciones',
    text: '¿Se ha probado restaurar completamente al menos un sistema crítico desde un respaldo en los últimos 12 meses?',
    help: '"Restauración completa" significa levantar el sistema funcional desde cero usando solo los respaldos, no una simple verificación de archivos.',
    allowNA: false,
    condition: null,
    options: [
      { label: 'Sí, en los últimos 12 meses', value: 1.0 },
      { label: 'Se hizo una prueba parcial', value: 0.5 },
      { label: 'Hace más de 12 meses', value: 0.3 },
      { label: 'Nunca se ha probado', value: 0.0 },
      { label: 'No sé', value: null }
    ]
  },
  {
    id: 'P14',
    dimension: 'restauraciones',
    text: '¿Los resultados de la última prueba de restauración están documentados (tiempo real de recuperación, problemas encontrados, acciones correctivas)?',
    help: null,
    allowNA: false,
    condition: (responses) => responses.P13 !== 0.0,
    dependsOn: 'P13',
    options: [
      { label: 'Sí, con detalle suficiente', value: 1.0 },
      { label: 'Se documentó algo básico', value: 0.5 },
      { label: 'No se documentaron', value: 0.0 },
      { label: 'No sé', value: null }
    ]
  },

  // ── Dimensión 6: Dependencias y responsables ──
  {
    id: 'P15',
    dimension: 'dependencias_responsables',
    text: '¿Tiene identificados los sistemas, proveedores y servicios de los que dependen sus aplicaciones críticas?',
    help: null,
    allowNA: false,
    condition: null,
    options: [
      { label: 'Sí, inventario completo y actualizado', value: 1.0 },
      { label: 'Parcialmente, o desactualizado', value: 0.5 },
      { label: 'No', value: 0.0 },
      { label: 'No sé', value: null }
    ]
  },
  {
    id: 'P16',
    dimension: 'dependencias_responsables',
    text: '¿Hay personas con roles específicos asignados para actuar en caso de un desastre (líder de crisis, responsables técnicos, comunicación)?',
    help: null,
    allowNA: false,
    condition: null,
    options: [
      { label: 'Sí, roles definidos y conocidos', value: 1.0 },
      { label: 'Se sabe informalmente quién actuaría', value: 0.5 },
      { label: 'No hay roles definidos', value: 0.0 },
      { label: 'No sé', value: null }
    ]
  },
  {
    id: 'P17',
    dimension: 'dependencias_responsables',
    text: '¿Existe un protocolo definido para comunicar a clientes, empleados y dirección durante un incidente mayor?',
    help: null,
    allowNA: true,
    naPrompt: '¿Por qué no aplica un protocolo de comunicación?',
    condition: null,
    options: [
      { label: 'Sí, documentado con canales y responsables', value: 1.0 },
      { label: 'Se haría sobre la marcha', value: 0.5 },
      { label: 'No existe', value: 0.0 },
      { label: 'No sé', value: null },
      { label: 'No aplica', value: 'skip' }
    ]
  },

  // ── Dimensión 7: Protección contra ransomware ──
  {
    id: 'P18',
    dimension: 'ransomware',
    text: '¿Las cuentas que administran los respaldos tienen autenticación multifactor (MFA) y credenciales diferentes a las del entorno principal?',
    help: 'MFA es un segundo factor de verificación (token, app, SMS) además de la contraseña.',
    allowNA: false,
    condition: null,
    options: [
      { label: 'Sí, MFA activo y credenciales separadas', value: 1.0 },
      { label: 'Tienen credenciales separadas pero sin MFA', value: 0.5 },
      { label: 'Usan las mismas credenciales que el entorno principal', value: 0.0 },
      { label: 'No sé', value: null }
    ]
  },
  {
    id: 'P19',
    dimension: 'ransomware',
    text: '¿Existe al menos una copia de los datos críticos que no pueda ser modificada o eliminada por un atacante que tome control del entorno principal?',
    help: 'Puede ser una cinta offline, un respaldo inmutable en nube, o una copia air-gapped.',
    allowNA: false,
    condition: null,
    options: [
      { label: 'Sí', value: 1.0 },
      { label: 'No estamos seguros', value: 0.5 },
      { label: 'No', value: 0.0 },
      { label: 'No sé', value: null }
    ]
  },
  {
    id: 'P20',
    dimension: 'ransomware',
    text: 'Si el directorio de usuarios (Active Directory, identidad central) quedara comprometido, ¿podrían restaurar sistemas sin depender de él?',
    help: 'En un ataque de ransomware sofisticado, el atacante compromete la identidad. Si la recuperación depende de esa identidad, no se puede restaurar.',
    allowNA: false,
    condition: null,
    options: [
      { label: 'Sí, tenemos procedimiento alternativo', value: 1.0 },
      { label: 'No estamos seguros', value: 0.5 },
      { label: 'No, dependemos completamente de la identidad central', value: 0.0 },
      { label: 'No sé', value: null }
    ]
  }
];

// ─── Full ordered flow (context + scored) ────────────────────────────────────

export const flowOrder = [
  // Context block
  'CTX01', 'CTX02', 'CTX03', 'CTX04',
  // Scored block (dimension order)
  'P01', 'P02', 'P03',
  'P04', 'P05',
  'P06', 'P07',
  'P08', 'P09', 'P10', 'P11', 'P12',
  'P13', 'P14',
  'P15', 'P16', 'P17',
  'P18', 'P19', 'P20'
];

// ─── Helper: get question by id ──────────────────────────────────────────────

const allQuestions = [...contextQuestions, ...questions];
const questionMap = new Map(allQuestions.map(q => [q.id, q]));

export function getQuestionById(id) {
  return questionMap.get(id) || null;
}

/**
 * Returns the list of visible questions given current responses.
 * Evaluates conditions and returns only questions that should be shown.
 */
export function getVisibleQuestions(responses) {
  const visible = [];
  for (const id of flowOrder) {
    const q = questionMap.get(id);
    if (!q) continue;
    // Context questions always visible
    if (q.type === 'context') {
      visible.push(q);
      continue;
    }
    // Scored/informational: check condition
    if (q.condition === null || q.condition(responses)) {
      visible.push(q);
    }
  }
  return visible;
}
