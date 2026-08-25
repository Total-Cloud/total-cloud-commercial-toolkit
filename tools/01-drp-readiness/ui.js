/**
 * DRP Readiness — UI Rendering
 * Version: 2.0.0
 *
 * Renders all screens: welcome, question cards, progress bar, results.
 * No Web Components framework — plain DOM creation with CSS classes.
 * All styles rely on tokens.css and base.css variables.
 */

import { CLASSIFICATION_LABELS } from './scoring.js';

// ─── Utility: Create element ─────────────────────────────────────────────────

function el(tag, attrs = {}, children = []) {
  const element = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'className') element.className = value;
    else if (key === 'textContent') element.textContent = value;
    else if (key === 'innerHTML') element.innerHTML = value;
    else if (key.startsWith('on')) element.addEventListener(key.slice(2).toLowerCase(), value);
    else if (key === 'style' && typeof value === 'object') Object.assign(element.style, value);
    else element.setAttribute(key, value);
  }
  for (const child of children) {
    if (typeof child === 'string') element.appendChild(document.createTextNode(child));
    else if (child) element.appendChild(child);
  }
  return element;
}

// ─── Welcome Screen ──────────────────────────────────────────────────────────

export function renderWelcome(onStart, onDemo) {
  const container = el('div', { className: 'welcome-screen' }, [
    el('div', { className: 'welcome-card' }, [
      el('h2', { textContent: 'Diagnóstico de Preparación ante Desastres (DRP)', tabindex: '-1' }),
      el('p', { textContent: 'Esta herramienta evalúa de forma preliminar la postura de recuperación ante desastres de una organización. El resultado orienta la conversación y el handoff a preventa.' }),
      el('div', { className: 'welcome-details' }, [
        el('p', {}, [
          el('strong', { textContent: 'Duración: ' }),
          document.createTextNode('10–15 minutos')
        ]),
        el('p', {}, [
          el('strong', { textContent: 'Preguntas: ' }),
          document.createTextNode('17 principales + contexto')
        ]),
        el('p', {}, [
          el('strong', { textContent: 'Resultado: ' }),
          document.createTextNode('Semáforo por dimensión + resumen para preventa')
        ]),
      ]),
      el('div', { className: 'welcome-disclaimer' }, [
        el('p', { textContent: 'Este diagnóstico es preliminar. No certifica, no garantiza ni sustituye un assessment técnico.' })
      ]),
      el('div', { className: 'welcome-actions' }, [
        el('button', { className: 'btn-primary btn-large', onClick: onStart, textContent: 'Iniciar diagnóstico' }),
        el('button', { className: 'btn-secondary', onClick: onDemo, textContent: 'Cargar escenario de demostración' })
      ])
    ])
  ]);
  return container;
}

// ─── Progress Bar ────────────────────────────────────────────────────────────

export function renderProgressBar(current, total) {
  const pct = Math.round((current / total) * 100);
  const container = el('div', { className: 'progress-container no-print', role: 'progressbar', 'aria-valuenow': String(current), 'aria-valuemin': '0', 'aria-valuemax': String(total), 'aria-label': `Progreso: pregunta ${current + 1} de ${total}` }, [
    el('div', { className: 'progress-text' }, [
      el('span', { textContent: `Pregunta ${current + 1} de ${total}` })
    ]),
    el('div', { className: 'progress-bar-track' }, [
      el('div', { className: 'progress-bar-fill', style: { width: `${pct}%` } })
    ])
  ]);
  return container;
}

// ─── Question Card ───────────────────────────────────────────────────────────

export function renderQuestion(question, currentAnswer, onAnswer, onBack, canGoBack) {
  const isContext = question.type === 'context';
  const isInformational = question.type === 'informational';

  const card = el('div', { className: 'question-card' });

  // Dimension badge (for scored questions)
  if (!isContext && !isInformational && question.dimension) {
    const badge = el('span', { className: 'dimension-badge', textContent: getDimensionLabel(question.dimension) });
    card.appendChild(badge);
  }

  if (isContext) {
    const badge = el('span', { className: 'dimension-badge dimension-badge--context', textContent: '🔵 Contexto' });
    card.appendChild(badge);
  }

  if (isInformational) {
    const badge = el('span', { className: 'dimension-badge dimension-badge--info', textContent: 'ℹ️ Informativa' });
    card.appendChild(badge);
  }

  // Question text
  const heading = el('h2', { className: 'question-text', tabindex: '-1', textContent: question.text });
  card.appendChild(heading);

  // Help text
  if (question.help) {
    const help = el('p', { className: 'question-help', textContent: question.help });
    card.appendChild(help);
  }

  // Options
  const optionsContainer = el('fieldset', { className: 'question-options' }, [
    el('legend', { className: 'sr-only', textContent: question.text })
  ]);

  // State for "No aplica" reason
  let naReasonValue = '';

  for (const option of question.options) {
    const optionId = `opt-${question.id}-${option.label.replace(/\s+/g, '-').slice(0, 20)}`;
    const isSelected = currentAnswer !== undefined && (
      (typeof option.value === 'number' && option.value === currentAnswer) ||
      (option.value === null && currentAnswer === null) ||
      (option.value === 'skip' && currentAnswer === 'skip') ||
      (option.value === 'info' && currentAnswer === option.label)
    );

    const optionEl = el('label', { className: `option-label${isSelected ? ' option-label--selected' : ''}`, 'for': optionId }, [
      el('input', {
        type: 'radio',
        name: `q-${question.id}`,
        id: optionId,
        value: String(option.value),
        ...(isSelected ? { checked: '' } : {})
      }),
      el('span', { className: 'option-text', textContent: option.label })
    ]);

    // Click handler on the label
    optionEl.addEventListener('click', () => {
      // Update visual selection
      optionsContainer.querySelectorAll('.option-label').forEach(l => l.classList.remove('option-label--selected'));
      optionEl.classList.add('option-label--selected');
    });

    optionsContainer.appendChild(optionEl);
  }

  card.appendChild(optionsContainer);

  // "No aplica" reason input (if applicable)
  let naReasonInput = null;
  if (question.allowNA && question.naPrompt) {
    naReasonInput = el('div', { className: 'na-reason-container', style: { display: 'none' } }, [
      el('label', { 'for': `na-reason-${question.id}`, textContent: question.naPrompt }),
      el('input', {
        type: 'text',
        id: `na-reason-${question.id}`,
        className: 'na-reason-input',
        maxlength: '100',
        placeholder: 'Máx. 100 caracteres'
      })
    ]);
    card.appendChild(naReasonInput);

    // Show/hide based on selection
    optionsContainer.addEventListener('change', (e) => {
      const selected = e.target.value;
      if (selected === 'skip') {
        naReasonInput.style.display = 'block';
      } else {
        naReasonInput.style.display = 'none';
      }
    });
  }

  // Navigation buttons
  const navActions = el('div', { className: 'question-nav' });

  if (canGoBack) {
    navActions.appendChild(el('button', {
      className: 'btn-secondary',
      textContent: '← Anterior',
      onClick: onBack
    }));
  }

  const nextBtn = el('button', {
    className: 'btn-primary',
    textContent: 'Siguiente →',
    onClick: () => {
      const selected = optionsContainer.querySelector('input[type="radio"]:checked');
      if (!selected) {
        // Highlight that an answer is needed
        optionsContainer.classList.add('question-options--error');
        return;
      }
      optionsContainer.classList.remove('question-options--error');

      let value;
      const rawValue = selected.value;

      if (rawValue === 'null') value = null;
      else if (rawValue === 'skip') value = 'skip';
      else if (rawValue === 'info') {
        // For informational questions, store the label
        const label = selected.closest('.option-label').querySelector('.option-text').textContent;
        value = label;
      }
      else value = parseFloat(rawValue);

      // Get NA reason if applicable
      let naReason = null;
      if (value === 'skip' && naReasonInput) {
        const input = naReasonInput.querySelector('input');
        naReason = input ? input.value.trim() : '';
      }

      onAnswer(value, naReason);
    }
  });
  navActions.appendChild(nextBtn);
  card.appendChild(navActions);

  return card;
}

// ─── Results Screen ──────────────────────────────────────────────────────────

export function renderResults(result, preventaQuestions, contextAnswers, naReasons, options) {
  const container = el('div', { className: 'results-screen' });

  // ── Print header (hidden on screen, shown on print) ──
  container.appendChild(renderPrintHeader(options));

  // ── Global result card ──
  container.appendChild(renderGlobalResult(result));

  // ── Overrides / warnings ──
  if (result.overrides.applied.length > 0) {
    container.appendChild(renderOverrides(result));
  }

  // ── Confidence indicator ──
  container.appendChild(renderConfidence(result));

  // ── Dimension breakdown ──
  container.appendChild(renderDimensionBreakdown(result));

  // ── Key findings ──
  container.appendChild(renderKeyFindings(result));

  // ── Informational data (RTO/RPO reported) ──
  if (result.informational.rtoReported || result.informational.rpoReported) {
    container.appendChild(renderInformational(result));
  }

  // ── "No aplica" justifications ──
  if (result.naJustifications.length > 0) {
    container.appendChild(renderNaJustifications(result));
  }

  // ── Preventa questions ──
  container.appendChild(renderPreventaSection(preventaQuestions));

  // ── Disclaimer ──
  container.appendChild(renderDisclaimer());

  // ── Actions (no-print) ──
  container.appendChild(renderResultActions(options));

  // ── Version footer ──
  container.appendChild(renderVersionFooter(options));

  return container;
}

// ── Sub-renderers for results ────────────────────────────────────────────────

function renderPrintHeader(options) {
  const now = new Date().toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  return el('div', { className: 'print-header' }, [
    el('h1', { textContent: 'Total Cloud · DRP Readiness Assessment' }),
    el('p', { className: 'print-date', textContent: `Generado: ${now}` })
  ]);
}

function renderGlobalResult(result) {
  const cls = result.global.classificationFinal;
  const label = CLASSIFICATION_LABELS[cls];
  const scoreStr = result.global.scoreMathematical !== null
    ? `${(result.global.scoreMathematical * 100).toFixed(0)}%`
    : '—';

  const card = el('div', { className: `result-global traffic-light--${cls}` }, [
    el('div', { className: 'result-global__icon', 'aria-hidden': 'true', textContent: label.icon }),
    el('div', { className: 'result-global__content' }, [
      el('h2', { textContent: `Resultado global: ${label.label}` }),
      el('p', { className: 'result-global__score', textContent: `Score: ${scoreStr}` }),
      el('p', { className: 'result-global__desc', textContent: label.longDescription }),
      ...(result.global.isProvisional ? [
        el('p', { className: 'result-global__provisional', textContent: '⚠️ Resultado provisional — ver notas importantes.' })
      ] : [])
    ])
  ]);
  return card;
}

function renderOverrides(result) {
  const section = el('section', { className: 'overrides-section' }, [
    el('h3', { textContent: '⚠️ Notas importantes' })
  ]);
  const list = el('ul', { className: 'overrides-list' });
  for (const ov of result.overrides.applied) {
    list.appendChild(el('li', { className: 'override-item' }, [
      el('span', { className: 'override-id', textContent: ov.id }),
      document.createTextNode(' — '),
      el('span', { textContent: ov.text })
    ]));
  }
  section.appendChild(list);

  // Show mathematical score if different from final
  if (result.global.classificationMathematical !== result.global.classificationFinal) {
    const mathLabel = CLASSIFICATION_LABELS[result.global.classificationMathematical];
    const mathScore = result.global.scoreMathematical !== null
      ? `${(result.global.scoreMathematical * 100).toFixed(0)}%`
      : '—';
    section.appendChild(el('p', { className: 'override-math-note', textContent: `Score matemático: ${mathScore} (${mathLabel.label}), ajustado por las condiciones anteriores.` }));
  }

  return section;
}

function renderConfidence(result) {
  const pct = (result.confidence.questionRatio * 100).toFixed(0);
  const dimPct = (result.confidence.dimensionRatio * 100).toFixed(0);

  return el('section', { className: 'confidence-section' }, [
    el('h3', { textContent: 'Nivel de información' }),
    el('div', { className: 'confidence-bar-container' }, [
      el('div', { className: 'confidence-bar-track' }, [
        el('div', { className: 'confidence-bar-fill', style: { width: `${pct}%` } })
      ]),
      el('span', { className: 'confidence-text', textContent: `${pct}% de preguntas respondidas (${result.confidence.questionsWithData}/${result.confidence.questionsTotal})` })
    ]),
    el('p', { className: 'confidence-dims', textContent: `Dimensiones evaluadas: ${result.confidence.dimensionsWithData}/${result.confidence.dimensionsTotal} (${dimPct}%)` })
  ]);
}

function renderDimensionBreakdown(result) {
  const section = el('section', { className: 'dimensions-section' }, [
    el('h3', { textContent: 'Desglose por dimensión' })
  ]);

  for (const dim of result.dimensions) {
    section.appendChild(renderDimensionCard(dim));
  }

  return section;
}

function renderDimensionCard(dim) {
  const cls = dim.classification;
  const label = CLASSIFICATION_LABELS[cls];
  const scoreStr = dim.score !== null ? `${(dim.score * 100).toFixed(0)}%` : '—';

  const card = el('details', { className: `dimension-card traffic-light--${cls} avoid-break` }, [
    el('summary', { className: 'dimension-summary' }, [
      el('span', { className: 'dimension-icon', 'aria-hidden': 'true', textContent: label.icon }),
      el('span', { className: 'dimension-label', textContent: dim.label }),
      el('span', { className: 'dimension-score', textContent: scoreStr }),
      el('span', { className: 'dimension-status', textContent: label.label }),
      ...(dim.critical ? [el('span', { className: 'dimension-critical-badge', textContent: 'Crítica' })] : [])
    ])
  ]);

  // Findings detail
  const detail = el('div', { className: 'dimension-detail' });

  // Confidence
  detail.appendChild(el('p', { className: 'dimension-confidence', textContent: `Confianza: ${dim.confidenceLevel} (${dim.questionsWithData}/${dim.questionsPresent} preguntas respondidas)` }));

  // Why this color?
  if (dim.score !== null) {
    const explanation = buildDimensionExplanation(dim);
    detail.appendChild(el('p', { className: 'dimension-explanation' }, [
      el('strong', { textContent: '¿Por qué este resultado? ' }),
      document.createTextNode(explanation)
    ]));
  }

  // Individual findings
  if (dim.findings.length > 0) {
    const findingsList = el('ul', { className: 'findings-list' });
    for (const f of dim.findings) {
      const impactClass = `finding--${f.impact}`;
      findingsList.appendChild(el('li', { className: `finding-item ${impactClass}` }, [
        el('span', { className: 'finding-question', textContent: `${f.questionId}: ` }),
        el('span', { className: 'finding-answer', textContent: `"${f.answer}" ` }),
        f.value !== null ? el('span', { className: 'finding-value', textContent: `(${f.value})` }) : null,
        el('span', { className: 'finding-explanation', textContent: ` — ${f.explanation}` })
      ].filter(Boolean)));
    }
    detail.appendChild(findingsList);
  }

  card.appendChild(detail);
  return card;
}

function buildDimensionExplanation(dim) {
  const cls = dim.classification;
  const score = (dim.score * 100).toFixed(0);

  switch (cls) {
    case 'green':
      return `Score ${score}% (≥ 75%). Las respuestas indican bases razonables en esta área.`;
    case 'yellow':
      return `Score ${score}% (entre 40% y 75%). Se identifican brechas o áreas parciales que ameritan revisión.`;
    case 'red':
      return `Score ${score}% (< 40%). Se identifica un riesgo que requiere atención antes de definir alcance.`;
    default:
      return 'Información insuficiente para evaluar esta dimensión.';
  }
}

function renderKeyFindings(result) {
  const allFindings = [];
  for (const dim of result.dimensions) {
    for (const f of dim.findings) {
      if (f.impact === 'negative') {
        allFindings.push({ ...f, dimensionLabel: dim.label, dimensionClassification: dim.classification });
      }
    }
  }

  if (allFindings.length === 0) {
    return el('section', { className: 'findings-section' }, [
      el('h3', { textContent: 'Hallazgos principales' }),
      el('p', { textContent: 'No se identificaron brechas confirmadas con la información proporcionada.' })
    ]);
  }

  const section = el('section', { className: 'findings-section' }, [
    el('h3', { textContent: 'Hallazgos principales' })
  ]);

  const list = el('ul', { className: 'key-findings-list' });
  for (const f of allFindings.slice(0, 10)) {
    const dimLabel = CLASSIFICATION_LABELS[f.dimensionClassification];
    list.appendChild(el('li', {}, [
      el('span', { className: `finding-badge traffic-light--${f.dimensionClassification}`, textContent: `${dimLabel.icon} ${f.dimensionLabel}` }),
      document.createTextNode(`: ${f.questionText} → "${f.answer}" — ${f.explanation}`)
    ]));
  }
  section.appendChild(list);

  return section;
}

function renderInformational(result) {
  return el('section', { className: 'informational-section' }, [
    el('h3', { textContent: 'Objetivos reportados' }),
    el('p', { className: 'informational-disclaimer', textContent: 'Estos son objetivos declarados por el interlocutor. No son tiempos verificados ni garantizados.' }),
    ...(result.informational.rtoReported ? [el('p', { textContent: `• ${result.informational.rtoReported}` })] : []),
    ...(result.informational.rpoReported ? [el('p', { textContent: `• ${result.informational.rpoReported}` })] : [])
  ]);
}

function renderNaJustifications(result) {
  return el('section', { className: 'na-section' }, [
    el('h3', { textContent: 'Preguntas marcadas como "No aplica"' }),
    ...result.naJustifications.map(na => el('div', { className: 'na-item' }, [
      el('p', {}, [
        el('strong', { textContent: `${na.questionId}: ` }),
        document.createTextNode(`"${na.reason}"`)
      ]),
      el('p', { className: 'na-validation-note', textContent: na.note })
    ]))
  ]);
}

function renderPreventaSection(preventaQuestions) {
  const section = el('section', { className: 'preventa-section' }, [
    el('h3', { textContent: '5 preguntas sugeridas para preventa' }),
    el('p', { className: 'preventa-intro', textContent: 'Estas preguntas se generaron según los resultados del diagnóstico. Ayudan al equipo de preventa a profundizar en las áreas de mayor riesgo o incertidumbre.' })
  ]);

  const list = el('ol', { className: 'preventa-list' });
  for (const pv of preventaQuestions) {
    list.appendChild(el('li', { className: 'preventa-item' }, [
      el('p', { className: 'preventa-question', textContent: pv.text }),
      el('p', { className: 'preventa-context', textContent: pv.context })
    ]));
  }
  section.appendChild(list);
  return section;
}

function renderDisclaimer() {
  return el('section', { className: 'disclaimer' }, [
    el('p', {}, [
      el('strong', { textContent: 'Aviso: ' }),
      document.createTextNode('Este resultado es preliminar y requiere validación técnica por el equipo de preventa. No constituye una certificación, garantía de recuperación, cotización ni compromiso de alcance.')
    ])
  ]);
}

function renderResultActions(options) {
  return el('div', { className: 'result-actions no-print' }, [
    el('button', { id: 'btn-copy', className: 'btn-primary', textContent: '📋 Copiar resumen', onClick: options.onCopy }),
    el('button', { className: 'btn-secondary', textContent: '🖨️ Imprimir', onClick: options.onPrint }),
    el('button', { className: 'btn-danger', textContent: '↺ Reiniciar', onClick: options.onReset })
  ]);
}

function renderVersionFooter(options) {
  return el('footer', { className: 'version-footer' }, [
    el('p', { textContent: `Herramienta v${options.toolVersion} · Scoring v${options.scoringVersion}` })
  ]);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDimensionLabel(dimensionId) {
  const labels = {
    plan_drp: 'Plan DRP',
    rto: 'RTO',
    rpo: 'RPO',
    respaldos: 'Respaldos',
    restauraciones: 'Restauraciones',
    dependencias_responsables: 'Dependencias y responsables',
    ransomware: 'Ransomware'
  };
  return labels[dimensionId] || dimensionId;
}
