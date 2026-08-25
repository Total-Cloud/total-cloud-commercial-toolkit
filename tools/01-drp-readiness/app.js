/**
 * DRP Readiness — Application Orchestrator
 * Version: 2.0.0
 *
 * Manages the flow: welcome → context → questions → results.
 * All data lives in memory only. Destroyed on reload/close.
 */

import { contextQuestions, questions, getVisibleQuestions, getQuestionById, dimensions } from './questions.js';
import { calculateScore, generatePreventaQuestions, CLASSIFICATION_LABELS, SCORING_VERSION } from './scoring.js';
import { renderWelcome, renderQuestion, renderResults, renderProgressBar } from './ui.js';

const TOOL_VERSION = '2.0.0';

// ─── Application State (memory only) ────────────────────────────────────────

let session = null;

function createSession() {
  return {
    responses: {},        // questionId → value (number, null, 'skip', 'info', or label for info)
    contextAnswers: {},   // CTX questionId → selected label
    naReasons: {},        // questionId → reason string (for "No aplica")
    currentIndex: 0,      // index into visible questions array
    phase: 'welcome',     // 'welcome' | 'questions' | 'results'
    startedAt: Date.now()
  };
}

// ─── DOM References ──────────────────────────────────────────────────────────

const mainContent = () => document.getElementById('main-content');
const versionBadge = () => document.getElementById('version-badge');

// ─── Flow Control ────────────────────────────────────────────────────────────

function start() {
  session = createSession();
  versionBadge().textContent = `v${TOOL_VERSION}`;
  showWelcome();
}

function showWelcome() {
  session.phase = 'welcome';
  const el = mainContent();
  el.innerHTML = '';
  el.appendChild(renderWelcome(onStartAssessment, onLoadDemo));
  updateBeforeUnload();
}

function onStartAssessment() {
  session.phase = 'questions';
  session.currentIndex = 0;
  showCurrentQuestion();
}

function onLoadDemo() {
  import('./demo-data.js').then(module => {
    session.responses = { ...module.demoResponses };
    session.contextAnswers = { ...module.demoContext };
    session.naReasons = { ...(module.demoNaReasons || {}) };
    showResults();
  }).catch(() => {
    alert('No se pudo cargar el escenario de demostración.');
  });
}

function showCurrentQuestion() {
  const visible = getVisibleQuestions(session.responses);
  const scoredVisible = visible.filter(q => q.type !== 'context' && q.type !== 'informational');
  const allVisible = visible;

  // Check if we've answered all visible questions
  if (session.currentIndex >= allVisible.length) {
    showResults();
    return;
  }

  const question = allVisible[session.currentIndex];
  const el = mainContent();
  el.innerHTML = '';

  // Progress bar
  const progressEl = renderProgressBar(session.currentIndex, allVisible.length);
  el.appendChild(progressEl);

  // Current answer (if going back)
  let currentAnswer = undefined;
  if (question.type === 'context') {
    currentAnswer = session.contextAnswers[question.id];
  } else {
    currentAnswer = session.responses[question.id];
  }

  // Question card
  const questionEl = renderQuestion(question, currentAnswer, (answer, naReason) => {
    onAnswer(question, answer, naReason);
  }, () => {
    onBack();
  }, session.currentIndex > 0);

  el.appendChild(questionEl);
  updateBeforeUnload();

  // Focus management for accessibility
  setTimeout(() => {
    const heading = el.querySelector('h2, h3');
    if (heading) heading.focus();
  }, 100);
}

function onAnswer(question, answer, naReason) {
  if (question.type === 'context') {
    session.contextAnswers[question.id] = answer;
  } else if (question.type === 'informational') {
    // Store the label for informational questions
    session.responses[question.id] = answer;
  } else {
    session.responses[question.id] = answer;
    if (answer === 'skip' && naReason) {
      session.naReasons[question.id] = naReason;
      // Also store with _reason suffix for scoring
      session.responses[`${question.id}_reason`] = naReason;
    }
  }

  // Recalculate visible questions (conditions may have changed)
  const visible = getVisibleQuestions(session.responses);

  // Move to next
  session.currentIndex++;

  // Skip questions that are no longer visible due to dependency changes
  while (session.currentIndex < visible.length) {
    const nextQ = visible[session.currentIndex];
    if (nextQ.type === 'context') break; // context always visible
    if (nextQ.condition === null || nextQ.condition(session.responses)) break;
    session.currentIndex++;
  }

  showCurrentQuestion();
}

function onBack() {
  if (session.currentIndex > 0) {
    session.currentIndex--;
    showCurrentQuestion();
  }
}

function showResults() {
  session.phase = 'results';

  // Calculate score
  const result = calculateScore(session.responses);

  // Generate dynamic preventa questions
  const preventaQuestions = generatePreventaQuestions(result.dimensions, session.responses);

  // Render
  const el = mainContent();
  el.innerHTML = '';

  const resultsEl = renderResults(result, preventaQuestions, session.contextAnswers, session.naReasons, {
    toolVersion: TOOL_VERSION,
    scoringVersion: SCORING_VERSION,
    onReset: confirmReset,
    onCopy: copyToClipboard,
    onPrint: printResults
  });

  el.appendChild(resultsEl);
  updateBeforeUnload();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── Reset ───────────────────────────────────────────────────────────────────

function confirmReset() {
  const confirmed = confirm(
    '¿Está seguro que desea reiniciar?\n\nTodas las respuestas se borrarán permanentemente.'
  );
  if (confirmed) {
    session = null;
    start();
  }
}

// ─── Export: Copy to Clipboard ───────────────────────────────────────────────

async function copyToClipboard() {
  const result = calculateScore(session.responses);
  const preventaQuestions = generatePreventaQuestions(result.dimensions, session.responses);
  const text = buildMarkdownSummary(result, preventaQuestions);

  try {
    // Modern Clipboard API (requires secure context)
    await navigator.clipboard.writeText(text);
    showCopyFeedback(true);
  } catch {
    // Fallback: execCommand
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showCopyFeedback(true);
    } catch {
      showCopyFeedback(false);
    }
  }
}

function showCopyFeedback(success) {
  const btn = document.getElementById('btn-copy');
  if (!btn) return;
  const original = btn.textContent;
  btn.textContent = success ? '✓ Copiado' : '✗ Error al copiar';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
  }, 2000);
}

// ─── Export: Print ───────────────────────────────────────────────────────────

function printResults() {
  window.print();
}

// ─── Markdown Summary Builder ────────────────────────────────────────────────

function buildMarkdownSummary(result, preventaQuestions) {
  const now = new Date().toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const globalLabel = CLASSIFICATION_LABELS[result.global.classificationFinal];
  const globalScoreStr = result.global.scoreMathematical !== null
    ? (result.global.scoreMathematical).toFixed(2)
    : '—';

  let md = `# Diagnóstico: DRP Readiness\n`;
  md += `Fecha: ${now}\n`;
  md += `Resultado global: ${globalLabel.icon} ${globalLabel.label} (${globalScoreStr}/1.00)`;
  if (result.global.isProvisional) md += ' [PROVISIONAL]';
  md += `\n\n`;

  // Confidence
  md += `Confianza: ${(result.confidence.questionRatio * 100).toFixed(0)}% de preguntas respondidas\n\n`;

  // Overrides
  if (result.overrides.applied.length > 0) {
    md += `## Notas importantes\n`;
    for (const ov of result.overrides.applied) {
      md += `- ${ov.text}\n`;
    }
    md += `\n`;
  }

  // Dimensions
  md += `## Dimensiones\n`;
  md += `| Dimensión | Score | Estado | Confianza |\n`;
  md += `|-----------|-------|--------|----------|\n`;
  for (const dim of result.dimensions) {
    const label = CLASSIFICATION_LABELS[dim.classification];
    const scoreStr = dim.score !== null ? dim.score.toFixed(2) : '—';
    md += `| ${dim.label} | ${scoreStr} | ${label.icon} ${label.label} | ${dim.confidenceLevel} |\n`;
  }
  md += `\n`;

  // Key findings
  const negativeFindings = result.dimensions
    .flatMap(d => d.findings.filter(f => f.impact === 'negative'))
    .slice(0, 10);

  if (negativeFindings.length > 0) {
    md += `## Hallazgos principales\n`;
    for (const f of negativeFindings) {
      const dim = result.dimensions.find(d => d.findings.includes(f));
      const dimLabel = dim ? dim.label : '';
      md += `- [${dimLabel}] ${f.questionText}: "${f.answer}" — ${f.explanation}\n`;
    }
    md += `\n`;
  }

  // Informational
  if (result.informational.rtoReported || result.informational.rpoReported) {
    md += `## Objetivos reportados (no verificados)\n`;
    if (result.informational.rtoReported) md += `- ${result.informational.rtoReported}\n`;
    if (result.informational.rpoReported) md += `- ${result.informational.rpoReported}\n`;
    md += `\n`;
  }

  // Preventa questions
  md += `## Preguntas sugeridas para preventa\n`;
  for (let i = 0; i < preventaQuestions.length; i++) {
    md += `${i + 1}. ${preventaQuestions[i].text}\n   (${preventaQuestions[i].context})\n`;
  }
  md += `\n`;

  // Disclaimer
  md += `---\n`;
  md += `## Aviso\n`;
  md += `Este resultado es preliminar y requiere validación técnica por el equipo de preventa.\n\n`;
  md += `---\n`;
  md += `Versión herramienta: ${TOOL_VERSION} | Scoring: ${SCORING_VERSION}\n`;

  return md;
}

// ─── Before Unload Protection ────────────────────────────────────────────────

function updateBeforeUnload() {
  if (session && session.phase === 'questions' && Object.keys(session.responses).length > 0) {
    window.onbeforeunload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
  } else {
    window.onbeforeunload = null;
  }
}

// ─── Initialize ──────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', start);
