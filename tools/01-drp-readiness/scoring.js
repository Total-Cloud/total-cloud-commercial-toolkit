/**
 * DRP Readiness — Scoring Engine
 * Version: 2.0.0
 *
 * Pure functions. No side effects, no state, no randomness.
 * Same inputs → same outputs. Always.
 */

import { dimensions, questions, getQuestionById } from './questions.js';

// ─── Configuration ───────────────────────────────────────────────────────────

export const SCORING_VERSION = '2.0.0';

export const THRESHOLDS = {
  green: 0.75,
  yellow: 0.40
};

// ─── Classifier ──────────────────────────────────────────────────────────────

/**
 * Classifies a numeric score into a traffic-light state.
 * @param {number|null} score - Score between 0 and 1, or null.
 * @returns {'green'|'yellow'|'red'|'gray'}
 */
export function classify(score) {
  if (score === null || score === undefined) return 'gray';
  if (score >= THRESHOLDS.green) return 'green';
  if (score >= THRESHOLDS.yellow) return 'yellow';
  return 'red';
}

// ─── Dimension Score Calculator ──────────────────────────────────────────────

/**
 * Calculates the score for a single dimension.
 * @param {object} dimension - Dimension definition from questions.js
 * @param {object} responses - Map of questionId → selected value
 * @returns {object} { score, classification, confidence, findings, questionsPresent, questionsWithData }
 */
export function calculateDimensionScore(dimension, responses) {
  const findings = [];
  let questionsPresent = 0;
  let questionsWithData = 0;
  let sum = 0;

  for (const qId of dimension.questions) {
    const question = getQuestionById(qId);
    if (!question) continue;

    // Skip informational questions (P05, P07)
    if (question.type === 'informational') continue;

    // Check if the question was visible (condition met)
    const wasVisible = question.condition === null || question.condition(responses);

    if (!wasVisible) {
      // Skip by dependency — does NOT reduce confidence
      continue;
    }

    questionsPresent++;

    const answer = responses[qId];

    // "No aplica" (skip) — excluded from everything
    if (answer === 'skip') {
      // Don't count as present for scoring purposes
      questionsPresent--;
      continue;
    }

    // "No sé" (null) or not answered — reduces confidence
    if (answer === null || answer === undefined) {
      findings.push({
        questionId: qId,
        questionText: question.text,
        answer: 'No sé',
        value: null,
        impact: 'unknown',
        explanation: 'Información pendiente de obtener.'
      });
      continue;
    }

    // Numeric value — contributes to score
    questionsWithData++;
    sum += answer;

    const selectedOption = question.options.find(o => o.value === answer);
    const answerLabel = selectedOption ? selectedOption.label : String(answer);

    let impact = 'neutral';
    if (answer >= THRESHOLDS.green) impact = 'positive';
    else if (answer < THRESHOLDS.yellow) impact = 'negative';

    findings.push({
      questionId: qId,
      questionText: question.text,
      answer: answerLabel,
      value: answer,
      impact,
      explanation: buildFindingExplanation(qId, answer, answerLabel)
    });
  }

  // Calculate score
  let score = null;
  if (questionsWithData > 0) {
    score = sum / questionsWithData;
  }

  const classification = classify(score);

  // Confidence
  let confidence = 0;
  let confidenceLevel = 'none';
  if (questionsPresent > 0) {
    confidence = questionsWithData / questionsPresent;
    if (confidence >= 1.0) confidenceLevel = 'complete';
    else if (confidence >= 0.5) confidenceLevel = 'partial';
    else confidenceLevel = 'low';
  } else {
    confidenceLevel = 'none';
  }

  return {
    dimensionId: dimension.id,
    label: dimension.label,
    weight: dimension.weight,
    critical: dimension.critical,
    score,
    classification,
    confidence,
    confidenceLevel,
    questionsPresent,
    questionsWithData,
    findings
  };
}

// ─── Override Engine ──────────────────────────────────────────────────────────

/**
 * Evaluates all overrides and returns applicable ones.
 * @param {object[]} dimensionResults - Array of dimension score results
 * @param {object} responses - Raw responses map
 * @returns {object[]} Array of { id, applies, text, effect }
 */
export function evaluateOverrides(dimensionResults, responses) {
  const overrides = [];

  const totalDims = dimensionResults.length;
  const grayDims = dimensionResults.filter(d => d.classification === 'gray');
  const criticalRedDims = dimensionResults.filter(d => d.critical && d.classification === 'red');
  const criticalGrayDims = dimensionResults.filter(d => d.critical && d.classification === 'gray');

  // OV-01: >50% dimensions are gray
  overrides.push({
    id: 'OV-01',
    applies: grayDims.length > totalDims / 2,
    text: 'La información recopilada es insuficiente para un diagnóstico significativo. Se recomienda programar una sesión con el equipo técnico.',
    effect: 'force_gray',
    priority: 1
  });

  // OV-03: No backups exist
  overrides.push({
    id: 'OV-03',
    applies: responses.P08 === 0.0,
    text: 'Sin respaldos, la recuperación ante un desastre no es viable.',
    effect: 'force_red',
    priority: 2
  });

  // OV-07: 2+ critical dimensions in red
  overrides.push({
    id: 'OV-07',
    applies: criticalRedDims.length >= 2,
    text: `Dos o más áreas críticas presentan riesgo (${criticalRedDims.map(d => d.label).join(', ')}). Se requiere atención integral.`,
    effect: 'force_red',
    priority: 3
  });

  // OV-04: Never tested restoration
  overrides.push({
    id: 'OV-04',
    applies: responses.P13 === 0.0,
    text: 'Sin pruebas de restauración, la capacidad de recuperación es incierta.',
    effect: 'block_green',
    priority: 4
  });

  // OV-05: RTO not defined
  overrides.push({
    id: 'OV-05',
    applies: responses.P04 === 0.0,
    text: 'Sin RTO definido, no se puede dimensionar una solución de recuperación.',
    effect: 'block_green',
    priority: 4
  });

  // OV-06: RPO not defined
  overrides.push({
    id: 'OV-06',
    applies: responses.P06 === 0.0,
    text: 'Sin RPO definido, no se puede determinar la frecuencia de respaldos necesaria.',
    effect: 'block_green',
    priority: 4
  });

  // OV-02: Any critical dimension is gray
  overrides.push({
    id: 'OV-02',
    applies: criticalGrayDims.length > 0,
    text: `El resultado es provisional. Faltan datos en áreas críticas: ${criticalGrayDims.map(d => d.label).join(', ')}.`,
    effect: 'block_green',
    priority: 5
  });

  // D-16 (approved): If ransomware is red → block green
  const ransomwareResult = dimensionResults.find(d => d.dimensionId === 'ransomware');
  overrides.push({
    id: 'OV-08',
    applies: ransomwareResult && ransomwareResult.classification === 'red',
    text: 'La postura ante ransomware presenta riesgo alto. Un ataque podría anular todas las demás medidas de recuperación.',
    effect: 'block_green',
    priority: 4
  });

  return overrides;
}

/**
 * Applies overrides to determine the final global classification.
 * @param {string} mathematicalClassification - Classification from the math score
 * @param {object[]} overrides - Result from evaluateOverrides
 * @returns {object} { finalClassification, appliedOverrides, isProvisional }
 */
export function applyOverrides(mathematicalClassification, overrides) {
  const applied = overrides.filter(o => o.applies);

  if (applied.length === 0) {
    return {
      finalClassification: mathematicalClassification,
      appliedOverrides: [],
      isProvisional: false
    };
  }

  // Sort by priority (lower = more severe)
  applied.sort((a, b) => a.priority - b.priority);

  let finalClassification = mathematicalClassification;
  let isProvisional = false;

  for (const override of applied) {
    switch (override.effect) {
      case 'force_gray':
        finalClassification = 'gray';
        return { finalClassification, appliedOverrides: applied, isProvisional: false };

      case 'force_red':
        finalClassification = 'red';
        return { finalClassification, appliedOverrides: applied, isProvisional: false };

      case 'block_green':
        if (finalClassification === 'green') {
          finalClassification = 'yellow';
          isProvisional = true;
        }
        break;
    }
  }

  return { finalClassification, appliedOverrides: applied, isProvisional };
}

// ─── Global Score Calculator ─────────────────────────────────────────────────

/**
 * Calculates the complete scoring result.
 * @param {object} responses - Map of questionId → selected value
 * @returns {object} Full result object
 */
export function calculateScore(responses) {
  // 1. Calculate each dimension
  const dimensionResults = dimensions.map(dim => calculateDimensionScore(dim, responses));

  // 2. Calculate global mathematical score
  const dimsWithData = dimensionResults.filter(d => d.score !== null);
  let globalScore = null;
  let globalClassification = 'gray';
  let weightEffective = 0;

  if (dimsWithData.length > 0) {
    weightEffective = dimsWithData.reduce((sum, d) => sum + d.weight, 0);
    globalScore = dimsWithData.reduce((sum, d) => sum + (d.score * d.weight), 0) / weightEffective;
    globalClassification = classify(globalScore);
  }

  // 3. Evaluate overrides
  const overrides = evaluateOverrides(dimensionResults, responses);
  const { finalClassification, appliedOverrides, isProvisional } = applyOverrides(globalClassification, overrides);

  // 4. Global confidence
  const totalDims = dimensionResults.length;
  const dimsWithDataCount = dimsWithData.length;
  const globalConfidence = dimsWithDataCount / totalDims;

  const totalQuestionsPresent = dimensionResults.reduce((s, d) => s + d.questionsPresent, 0);
  const totalQuestionsWithData = dimensionResults.reduce((s, d) => s + d.questionsWithData, 0);
  const detailedConfidence = totalQuestionsPresent > 0
    ? totalQuestionsWithData / totalQuestionsPresent
    : 0;

  // 5. Collect informational data (RTO/RPO ranges)
  const informational = {};
  const p05 = getQuestionById('P05');
  if (responses.P05 !== undefined && p05) {
    const opt = p05.options.find(o => o.label === responses.P05 || o.reportLabel === responses.P05);
    informational.rtoReported = opt ? (opt.reportLabel || opt.label) : responses.P05;
  }
  const p07 = getQuestionById('P07');
  if (responses.P07 !== undefined && p07) {
    const opt = p07.options.find(o => o.label === responses.P07 || o.reportLabel === responses.P07);
    informational.rpoReported = opt ? (opt.reportLabel || opt.label) : responses.P07;
  }

  // 6. Collect "No aplica" justifications
  const naJustifications = [];
  if (responses.P17 === 'skip' && responses.P17_reason) {
    naJustifications.push({
      questionId: 'P17',
      reason: responses.P17_reason,
      note: 'Pendiente de validación por preventa.'
    });
  }

  return {
    version: SCORING_VERSION,
    calculatedAt: new Date().toISOString(),

    global: {
      scoreMathematical: globalScore,
      classificationMathematical: globalClassification,
      classificationFinal: finalClassification,
      isProvisional,
      weightEffective
    },

    confidence: {
      dimensionsTotal: totalDims,
      dimensionsWithData: dimsWithDataCount,
      dimensionRatio: globalConfidence,
      questionsTotal: totalQuestionsPresent,
      questionsWithData: totalQuestionsWithData,
      questionRatio: detailedConfidence
    },

    dimensions: dimensionResults,

    overrides: {
      evaluated: overrides,
      applied: appliedOverrides
    },

    informational,
    naJustifications,

    metadata: {
      scoringVersion: SCORING_VERSION,
      thresholds: THRESHOLDS,
      dimensionCount: totalDims,
      questionsAnswered: totalQuestionsWithData,
      questionsSkipped: totalQuestionsPresent - totalQuestionsWithData
    }
  };
}

// ─── Preventa Questions (Dynamic) ────────────────────────────────────────────

const PREVENTA_BANK = [
  {
    id: 'PV-01',
    text: '¿Cuál es el RTO real medido en la última prueba de restauración?',
    context: 'Valida si los objetivos declarados son alcanzables.',
    priority: 1,
    condition: (dimResults, responses) => {
      const rest = dimResults.find(d => d.dimensionId === 'restauraciones');
      return rest && rest.classification !== 'green';
    }
  },
  {
    id: 'PV-02',
    text: '¿Qué sistemas no están cubiertos por los respaldos actuales?',
    context: 'Identifica gaps de cobertura.',
    priority: 1,
    condition: (dimResults, responses) => {
      const resp = dimResults.find(d => d.dimensionId === 'respaldos');
      return (resp && resp.classification === 'yellow') || responses.P08 === 0.5;
    }
  },
  {
    id: 'PV-03',
    text: '¿Los respaldos son inmutables o podrían ser cifrados por ransomware?',
    context: 'Valida la resiliencia de los respaldos ante un ataque.',
    priority: 1,
    condition: (dimResults, responses) => {
      return responses.P12 !== 1.0 || responses.P19 !== 1.0;
    }
  },
  {
    id: 'PV-04',
    text: '¿Existe un ambiente de DR separado o se recuperaría sobre la misma infraestructura?',
    context: 'Determina la viabilidad de recuperación ante pérdida total del sitio.',
    priority: 2,
    condition: (dimResults) => {
      const plan = dimResults.find(d => d.dimensionId === 'plan_drp');
      return plan && (plan.classification === 'red' || plan.classification === 'gray');
    }
  },
  {
    id: 'PV-05',
    text: '¿Cuántas personas distintas pueden ejecutar el plan de recuperación?',
    context: 'Identifica riesgo de persona clave / single point of failure humano.',
    priority: 2,
    condition: (dimResults, responses) => responses.P16 !== 1.0
  },
  {
    id: 'PV-06',
    text: '¿Se ha validado que el RTO declarado es alcanzable con la infraestructura actual?',
    context: 'Contrasta objetivo vs. capacidad real.',
    priority: 2,
    condition: (dimResults, responses) => {
      const rest = dimResults.find(d => d.dimensionId === 'restauraciones');
      return responses.P04 === 1.0 && rest && rest.classification !== 'green';
    }
  },
  {
    id: 'PV-07',
    text: '¿La frecuencia de respaldos es coherente con el RPO declarado?',
    context: 'Si el RPO es 1 hora pero se respalda diario, hay un gap.',
    priority: 2,
    condition: (dimResults, responses) => {
      return responses.P06 === 1.0 && responses.P09 !== undefined && responses.P09 !== null;
    }
  },
  {
    id: 'PV-08',
    text: '¿Qué proveedores externos son single point of failure?',
    context: 'Identifica dependencias que podrían bloquear la recuperación.',
    priority: 3,
    condition: (dimResults, responses) => responses.P15 !== 1.0
  },
  {
    id: 'PV-09',
    text: '¿Existe un runbook paso a paso para los primeros 30 minutos de un incidente?',
    context: 'Los primeros minutos son críticos; sin runbook se pierde tiempo.',
    priority: 3,
    condition: (dimResults, responses) => {
      const dep = dimResults.find(d => d.dimensionId === 'dependencias_responsables');
      return responses.P01 === 0.5 || (dep && dep.classification !== 'green');
    }
  },
  {
    id: 'PV-10',
    text: '¿Se puede restaurar sin acceso al Active Directory / identidad central?',
    context: 'Valida si la estrategia resiste compromiso de identidad.',
    priority: 3,
    condition: (dimResults, responses) => responses.P20 !== 1.0
  },
  {
    id: 'PV-11',
    text: '¿Hay evidencia documental de las pruebas de restauración?',
    context: 'Sin evidencia no se puede medir mejora ni tiempos reales.',
    priority: 3,
    condition: (dimResults, responses) => responses.P14 !== 1.0
  },
  {
    id: 'PV-12',
    text: '¿Qué porcentaje de los sistemas críticos tiene respaldo verificado?',
    context: 'Cuantifica la cobertura real.',
    priority: 3,
    condition: (dimResults, responses) => responses.P10 !== 1.0
  },
  {
    id: 'PV-13',
    text: '¿El plan DRP contempla escenarios de pérdida total del sitio principal?',
    context: 'Valida si el plan cubre el peor caso.',
    priority: 4,
    condition: (dimResults, responses) => responses.P01 === 1.0 && responses.P11 !== 1.0
  },
  {
    id: 'PV-14',
    text: '¿Hay acuerdos de nivel de servicio con proveedores para tiempos de respuesta en crisis?',
    context: 'Sin SLA de proveedores, los tiempos de recuperación son inciertos.',
    priority: 4,
    condition: (dimResults, responses) => responses.P15 === 0.5
  },
  {
    id: 'PV-15',
    text: '¿Se ha considerado un seguro de ciber-riesgo?',
    context: 'Complementa las medidas técnicas con transferencia de riesgo.',
    priority: 4,
    condition: (dimResults) => {
      const ransom = dimResults.find(d => d.dimensionId === 'ransomware');
      return ransom && ransom.classification === 'red';
    }
  }
];

const FALLBACK_PV_IDS = ['PV-01', 'PV-02', 'PV-03', 'PV-05', 'PV-10'];

/**
 * Generates the 5 dynamic preventa questions based on results.
 * Deterministic: same inputs → same output.
 * @param {object[]} dimensionResults - Dimension score results
 * @param {object} responses - Raw responses
 * @returns {object[]} Array of 5 preventa question objects
 */
export function generatePreventaQuestions(dimensionResults, responses) {
  // 1. Filter questions whose condition is met
  const activated = PREVENTA_BANK.filter(pv => {
    try {
      return pv.condition(dimensionResults, responses);
    } catch {
      return false;
    }
  });

  // 2. Sort by priority (ascending), then by ID (alphabetical/stable)
  activated.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.id.localeCompare(b.id);
  });

  // 3. Take first 5
  const selected = activated.slice(0, 5);

  // 4. If less than 5, fill with fallback (in order, avoiding duplicates)
  if (selected.length < 5) {
    const selectedIds = new Set(selected.map(s => s.id));
    for (const fbId of FALLBACK_PV_IDS) {
      if (selected.length >= 5) break;
      if (!selectedIds.has(fbId)) {
        const fbQ = PREVENTA_BANK.find(pv => pv.id === fbId);
        if (fbQ) {
          selected.push(fbQ);
          selectedIds.add(fbId);
        }
      }
    }
  }

  return selected.slice(0, 5);
}

// ─── Helper: Build finding explanation ───────────────────────────────────────

function buildFindingExplanation(questionId, value, answerLabel) {
  if (value >= THRESHOLDS.green) {
    return `Respuesta favorable: "${answerLabel}".`;
  }
  if (value >= THRESHOLDS.yellow) {
    return `Respuesta parcial: "${answerLabel}". Existe pero con oportunidad de mejora.`;
  }
  if (value > 0) {
    return `Brecha identificada: "${answerLabel}". Requiere revisión.`;
  }
  return `Brecha confirmada: "${answerLabel}". No existe o no se realiza.`;
}

// ─── Classification Labels ───────────────────────────────────────────────────

export const CLASSIFICATION_LABELS = {
  green: {
    label: 'Verde',
    icon: '🟢',
    accessibleIcon: '⬤',
    description: 'Bases razonables',
    longDescription: 'Las respuestas indican bases razonables en esta área. No equivale a certificación ni garantía.'
  },
  yellow: {
    label: 'Amarillo',
    icon: '🟡',
    accessibleIcon: '◆',
    description: 'Brechas que ameritan revisión',
    longDescription: 'Se identifican brechas o información faltante que ameritan revisión y atención.'
  },
  red: {
    label: 'Rojo',
    icon: '🔴',
    accessibleIcon: '⛔',
    description: 'Requiere atención',
    longDescription: 'Se identifica riesgo o bloqueador que requiere atención antes de definir alcance.'
  },
  gray: {
    label: 'Sin información',
    icon: '⚪',
    accessibleIcon: '❓',
    description: 'Información insuficiente',
    longDescription: 'No hay información suficiente para evaluar esta área. Preventa debe obtener estos datos.'
  }
};
