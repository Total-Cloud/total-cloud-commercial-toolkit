# Design — Total Cloud Commercial Toolkit v1

Decisiones aprobadas: D-01 (Web Components nativos), D-02 (navegación híbrida),
D-03 (Node.js test runner), D-04 (módulos JS para scoring), D-05 (hosting + zip),
D-06 (cero build), D-07 (beforeunload sin persistir).

---

## 1. Arquitectura general

```
┌─────────────────────────────────────────────────────────────┐
│                        NAVEGADOR                            │
│                                                             │
│  ┌──────────┐      ┌──────────────────────────────────┐    │
│  │ LAUNCHER │─────▶│  HERRAMIENTA (página HTML propia) │    │
│  │ index.html│◀────│  tools/0X-nombre/index.html       │    │
│  └──────────┘      └──────────────────────────────────┘    │
│        │                        │                           │
│        ▼                        ▼                           │
│  ┌─────────────────────────────────────────────────┐       │
│  │            SHARED (ES Modules)                   │       │
│  │  ┌────────────┐ ┌──────────┐ ┌──────────────┐   │       │
│  │  │ components │ │  scoring │ │    export    │   │       │
│  │  │  (WC)      │ │ (engine) │ │ (print/copy)│   │       │
│  │  └────────────┘ └──────────┘ └──────────────┘   │       │
│  │  ┌────────────┐                                  │       │
│  │  │   styles   │                                  │       │
│  │  │ (CSS vars) │                                  │       │
│  │  └────────────┘                                  │       │
│  └─────────────────────────────────────────────────┘       │
│                                                             │
│  ┌─────────────────────────────────────────────────┐       │
│  │              MEMORIA DEL NAVEGADOR               │       │
│  │  (variables JS — borrado al recargar/cerrar)     │       │
│  └─────────────────────────────────────────────────┘       │
│                                                             │
│  ❌ Sin red   ❌ Sin localStorage   ❌ Sin cookies         │
│  ❌ Sin IndexedDB   ❌ Sin Service Worker cache            │
└─────────────────────────────────────────────────────────────┘
```

### Principios arquitectónicos

| Principio | Implementación |
|-----------|---------------|
| Sin framework | Web Components nativos (Custom Elements + Shadow DOM) |
| Sin build | Archivos servidos directamente; ES modules con `type="module"` |
| Sin red | Cero fetch, XMLHttpRequest, WebSocket, beacon o import remoto |
| Sin persistencia | Todo en variables JS de instancia; `beforeunload` advierte |
| Offline-first | Todo el código es local; funciona con `file://` o servidor estático |
| Determinista | Scoring es función pura: `f(respuestas, reglas) → resultado` |

---

## 2. Árbol de carpetas y archivos

```
total-cloud-commercial-toolkit/
│
├── index.html                          # Redirect o alias al launcher
├── README.md
│
├── launcher/
│   └── index.html                      # Hub: lista las 7 herramientas
│
├── tools/
│   ├── 01-drp-readiness/
│   │   ├── index.html                  # Entry point de la herramienta
│   │   ├── questions.js                # Módulo: preguntas y dimensiones
│   │   ├── scoring-config.js           # Módulo: reglas y pesos específicos
│   │   ├── app.js                      # Módulo: lógica de flujo y orquestación
│   │   └── demo-data.js               # Dataset sintético de demostración
│   │
│   ├── 02-migration-complexity/
│   │   ├── index.html
│   │   ├── questions.js
│   │   ├── scoring-config.js
│   │   ├── app.js
│   │   └── demo-data.js
│   │
│   ├── 03-finops-maturity/
│   │   └── ... (misma estructura)
│   │
│   ├── 04-msp-operational-load/
│   │   └── ...
│   │
│   ├── 05-telemetry-integration/
│   │   └── ...
│   │
│   ├── 06-resilience-explorer/
│   │   └── ...
│   │
│   └── 07-cross-sell-navigator/
│       └── ...
│
├── shared/
│   ├── styles/
│   │   ├── tokens.css                  # Variables CSS (colores, spacing, radii)
│   │   ├── base.css                    # Reset + estilos base globales
│   │   ├── components.css              # Estilos para los Web Components
│   │   └── print.css                   # Estilos @media print
│   │
│   ├── components/
│   │   ├── tc-header.js                # <tc-header> encabezado con nombre herramienta
│   │   ├── tc-progress-bar.js          # <tc-progress-bar> barra de progreso
│   │   ├── tc-question-card.js         # <tc-question-card> tarjeta de pregunta
│   │   ├── tc-traffic-light.js         # <tc-traffic-light> semáforo (V/A/R/G)
│   │   ├── tc-score-explanation.js     # <tc-score-explanation> desglose de score
│   │   ├── tc-summary.js              # <tc-summary> resumen imprimible/copiable
│   │   ├── tc-reset-button.js          # <tc-reset-button> con confirmación
│   │   ├── tc-disclaimer.js            # <tc-disclaimer> texto obligatorio
│   │   └── tc-version-badge.js         # <tc-version-badge> versión visible
│   │
│   ├── scoring/
│   │   ├── engine.js                   # Motor de scoring genérico (función pura)
│   │   ├── classifier.js              # Clasifica score → semáforo
│   │   ├── scoring-rules.md            # Documentación legible de todas las reglas
│   │   └── README.md                   # Cómo agregar/modificar reglas
│   │
│   └── export/
│       ├── print-formatter.js          # Prepara HTML optimizado para impresión
│       ├── clipboard.js                # Copia texto/markdown al portapapeles
│       └── summary-builder.js          # Construye el objeto de resumen estructurado
│
├── tests/
│   ├── scoring/
│   │   ├── engine.test.js              # Límites del motor de scoring
│   │   ├── classifier.test.js          # Transiciones V/A/R/G
│   │   └── tools/                      # Tests por herramienta
│   │       ├── drp-readiness.test.js
│   │       ├── migration-complexity.test.js
│   │       ├── finops-maturity.test.js
│   │       ├── msp-operational-load.test.js
│   │       ├── telemetry-integration.test.js
│   │       ├── resilience-explorer.test.js
│   │       └── cross-sell-navigator.test.js
│   │
│   ├── components/
│   │   └── ... (tests de Web Components con jsdom o happy-dom si se aprueba)
│   │
│   ├── validation/
│   │   └── input-validation.test.js    # Casos límite de entrada
│   │
│   ├── manual/
│   │   └── responsive-checklist.md     # Checklist de prueba manual
│   │
│   └── fixtures/
│       └── synthetic-responses/        # Fixtures de respuestas sintéticas
│           ├── all-green.js
│           ├── all-red.js
│           ├── mixed.js
│           └── all-unknown.js          # Todas "no sé" → todo gris
│
├── docs/
│   ├── adr/
│   │   └── 001-vanilla-web-components.md
│   └── scoring-rules.md               # Copia legible sincronizada
│
└── .kiro/
    ├── steering/
    │   ├── product.md
    │   ├── brand.md
    │   ├── commercial-guardrails.md
    │   └── privacy.md
    └── docs/
        ├── requirements.md
        ├── design.md                   # ← Este archivo
        └── tasks.md                    # (pendiente, no se escribe aún)
```

---

## 3. Relación entre launcher, herramientas y shared

### 3.1 Launcher → Herramientas

```
launcher/index.html
  └── Lista de tarjetas (<a href="../tools/01-drp-readiness/index.html">)
       └── Cada tarjeta muestra: nombre, descripción, icono SVG, estado
```

- El launcher es una página HTML independiente.
- Cada herramienta es un directorio autocontenido con su propio `index.html`.
- La navegación es por enlaces estándar (`<a href>`). No hay router JS.
- El botón "Volver al inicio" en cada herramienta enlaza a `../../launcher/index.html`.

### 3.2 Herramientas → Shared

Cada `index.html` de herramienta importa los módulos compartidos vía rutas relativas:

```html
<!-- tools/01-drp-readiness/index.html -->
<link rel="stylesheet" href="../../shared/styles/tokens.css">
<link rel="stylesheet" href="../../shared/styles/base.css">
<link rel="stylesheet" href="../../shared/styles/print.css" media="print">

<script type="module">
  import '../../shared/components/tc-header.js';
  import '../../shared/components/tc-progress-bar.js';
  import '../../shared/components/tc-question-card.js';
  // ... otros componentes necesarios

  import { calculateScore } from '../../shared/scoring/engine.js';
  import { classify } from '../../shared/scoring/classifier.js';
  import { buildSummary } from '../../shared/export/summary-builder.js';

  import { questions } from './questions.js';
  import { scoringConfig } from './scoring-config.js';
  import { runTool } from './app.js';

  runTool({ questions, scoringConfig, calculateScore, classify, buildSummary });
</script>
```

### 3.3 Shared → No conoce a las herramientas

Los módulos de `shared/` son genéricos. No importan ni referencian archivos de
`tools/`. La configuración específica se inyecta como parámetros.

---

## 4. Flujo de datos y controles de privacidad

### 4.1 Ciclo de vida de los datos

```
┌─────────────────────────────────────────────────────────┐
│  1. INICIO                                               │
│     Usuario abre herramienta                             │
│     → Se instancia un objeto `session` en memoria        │
│     → session = { responses: {}, startedAt: Date.now() } │
└────────────────────────────┬────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────┐
│  2. CAPTURA DE RESPUESTAS                                │
│     Usuario responde preguntas                           │
│     → session.responses[questionId] = selectedOption     │
│     → Datos viven SOLO en la variable `session`          │
└────────────────────────────┬────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────┐
│  3. CÁLCULO DE SCORE                                     │
│     Usuario llega al final o solicita resultados         │
│     → calculateScore(session.responses, scoringConfig)   │
│     → Retorna { total, dimensions[], findings[] }        │
│     → classify() asigna semáforo a cada dimensión        │
└────────────────────────────┬────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────┐
│  4. PRESENTACIÓN                                         │
│     Se renderizan componentes con el resultado           │
│     → <tc-traffic-light>, <tc-score-explanation>,        │
│       <tc-summary>, <tc-disclaimer>                      │
└────────────────────────────┬────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────┐
│  5. EXPORTACIÓN (solo si el usuario actúa)               │
│     a) Botón "Copiar resumen" → Clipboard API            │
│     b) Botón "Imprimir" → window.print()                 │
│     c) Ninguna acción → datos se quedan en memoria       │
└────────────────────────────┬────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────┐
│  6. DESTRUCCIÓN                                          │
│     a) Usuario recarga → beforeunload advierte → borra   │
│     b) Usuario cierra pestaña → garbage collected        │
│     c) Usuario presiona "Reiniciar" → confirma → borra   │
│     → session = null; re-render estado inicial           │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Controles de privacidad implementados

| Control | Mecanismo |
|---------|-----------|
| Sin red | No hay `fetch`, `XMLHttpRequest`, `navigator.sendBeacon`, ni `<img>` externo |
| Sin persistencia | No hay `localStorage`, `sessionStorage`, cookies, IndexedDB |
| Advertencia de pérdida | `window.addEventListener('beforeunload', ...)` cuando hay respuestas |
| Borrado explícito | Botón "Reiniciar" con `confirm()` antes de `session = null` |
| Sin imports remotos | Todos los `import` usan rutas relativas locales |
| Sin telemetría | Cero event tracking, pixels, beacons |
| Solo acción explícita | Clipboard y print requieren clic del usuario |

### 4.3 Qué NO se persiste jamás

- Respuestas del usuario.
- Scores calculados.
- Nombre de empresa o asistentes.
- Timestamp de la sesión (solo se usa para el encabezado del resumen, no se guarda).

---

## 5. Scoring determinista, explicable y configurable

### 5.1 Arquitectura del scoring

```
┌──────────────────────────────────────────────────────┐
│  scoring-config.js (por herramienta)                  │
│                                                      │
│  export const scoringConfig = {                       │
│    version: "1.0.0",                                 │
│    tool: "drp-readiness",                            │
│    dimensions: [                                     │
│      {                                               │
│        id: "plan_exists",                            │
│        label: "Plan DRP documentado",                │
│        weight: 0.20,                                 │
│        questions: ["q1", "q2"],                      │
│        thresholds: {                                 │
│          green: { min: 0.75 },                       │
│          yellow: { min: 0.40 },                      │
│          red: { min: 0 },                            │
│          gray: "insufficient_data"                   │
│        }                                             │
│      },                                              │
│      // ... más dimensiones                          │
│    ],                                                │
│    globalThresholds: {                               │
│      green: { min: 0.70 },                           │
│      yellow: { min: 0.40 },                          │
│      red: { min: 0 },                                │
│      gray: "insufficient_data"                       │
│    }                                                 │
│  };                                                  │
└──────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────┐
│  shared/scoring/engine.js                             │
│                                                      │
│  /**                                                 │
│   * Función pura. Sin side effects, sin estado.      │
│   * Mismas entradas → mismo resultado. Siempre.      │
│   */                                                 │
│  export function calculateScore(responses, config) { │
│    // 1. Por cada dimensión:                         │
│    //    - Recopilar respuestas de sus preguntas     │
│    //    - Si todas son "no_sabe" → gray             │
│    //    - Calcular score normalizado [0, 1]         │
│    //    - Aplicar peso de la dimensión              │
│    //                                                │
│    // 2. Score global = Σ(score_dim * weight_dim)    │
│    //    excluyendo dimensiones gray del denominador │
│    //                                                │
│    // 3. Retornar objeto detallado                   │
│    return {                                          │
│      total: 0.65,                                    │
│      totalClassification: "yellow",                  │
│      dimensions: [                                   │
│        {                                             │
│          id: "plan_exists",                          │
│          score: 0.80,                                │
│          classification: "green",                    │
│          findings: [                                 │
│            {                                         │
│              questionId: "q1",                       │
│              answer: "Sí, documentado",              │
│              impact: "positive",                     │
│              explanation: "Plan DRP documentado..."   │
│            }                                         │
│          ]                                           │
│        }                                             │
│      ],                                              │
│      metadata: {                                     │
│        configVersion: "1.0.0",                       │
│        calculatedAt: "2026-08-21T...",               │
│        questionsAnswered: 12,                        │
│        questionsSkipped: 2                           │
│      }                                              │
│    };                                                │
│  }                                                   │
└──────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────┐
│  shared/scoring/classifier.js                         │
│                                                      │
│  export function classify(score, thresholds) {        │
│    if (score === null) return "gray";                 │
│    if (score >= thresholds.green.min) return "green"; │
│    if (score >= thresholds.yellow.min) return "yellow"│
│    return "red";                                     │
│  }                                                   │
└──────────────────────────────────────────────────────┘
```

### 5.2 Reglas fundamentales del scoring

| Regla | Descripción |
|-------|-------------|
| Determinismo | `calculateScore` es función pura. Sin Math.random(), sin Date-dependent logic, sin estado externo. |
| "No sé" → gris | Si todas las preguntas de una dimensión tienen respuesta "no_sabe", esa dimensión es gris. No suma ni resta al total. |
| Dimensiones grises excluidas | El score global se calcula solo sobre dimensiones con datos suficientes. El denominador se ajusta. |
| Pesos documentados | Cada `scoring-config.js` documenta el peso de cada dimensión con comentarios. |
| Umbrales explícitos | Los umbrales de corte (green ≥ 0.75, yellow ≥ 0.40, red < 0.40) se leen del config, nunca hardcodeados en engine.js. |
| Explicabilidad | Cada finding lleva `questionId`, `answer` e `explanation` para que el usuario sepa POR QUÉ tiene ese semáforo. |

### 5.3 Opciones de respuesta y su valor

Cada pregunta en `questions.js` define sus opciones con un valor numérico normalizado:

```javascript
export const questions = [
  {
    id: "q1",
    dimension: "plan_exists",
    text: "¿Existe un plan de recuperación ante desastres documentado?",
    options: [
      { value: 1.0,  label: "Sí, documentado y actualizado en los últimos 12 meses" },
      { value: 0.6,  label: "Sí, pero tiene más de 12 meses sin actualización" },
      { value: 0.2,  label: "Existe algo informal, no documentado formalmente" },
      { value: 0.0,  label: "No existe" },
      { value: null, label: "No sé" }  // → contribuye a gray
    ]
  },
  // ...
];
```

### 5.4 Sincronización con scoring-rules.md

El archivo `shared/scoring/scoring-rules.md` es la versión legible para humanos.
Se mantiene sincronizado manualmente con los `scoring-config.js` de cada herramienta.
Incluye:

- Tabla de dimensiones y pesos por herramienta.
- Tabla de umbrales por clasificación.
- Reglas especiales (ej. "no sé" → gris).
- Changelog de modificaciones a las reglas.

---

## 6. Impresión, resumen copiable y uso offline

### 6.1 Resumen imprimible

```
┌─────────────────────────────────────────────┐
│  print-formatter.js                         │
│                                             │
│  Genera un bloque HTML con:                 │
│  - Encabezado: "Total Cloud · [Herramienta]"│
│  - Fecha y hora de generación               │
│  - Score global con semáforo (texto)        │
│  - Tabla de dimensiones con semáforo        │
│  - Hallazgos principales                    │
│  - Disclaimer obligatorio                   │
│  - Versión de la herramienta y config       │
│                                             │
│  Controlado por print.css:                  │
│  - Oculta nav, botones, elementos interacti │
│  - Fuerza fondo blanco, texto negro         │
│  - Usa colores con patron para semáforo     │
│    (accesible en impresión B/N)             │
│  - Ajusta layout a una sola columna         │
└─────────────────────────────────────────────┘
```

**Flujo de impresión:**
1. Usuario hace clic en "Imprimir resultados".
2. Se inyecta la clase `.print-mode` en el contenedor de resultados.
3. Se invoca `window.print()`.
4. El navegador muestra su diálogo nativo de impresión/PDF.
5. Al cerrar el diálogo, se remueve `.print-mode`.

### 6.2 Resumen copiable

```javascript
// shared/export/clipboard.js
export async function copyToClipboard(summaryObject) {
  const text = formatAsMarkdown(summaryObject);
  // Clipboard API requiere interacción del usuario (ya la hay: clic en botón)
  await navigator.clipboard.writeText(text);
  // Feedback visual: el botón cambia brevemente a "✓ Copiado"
}
```

**Formato del texto copiado (Markdown simplificado):**
```
# Diagnóstico: DRP Readiness
Fecha: 2026-08-21
Resultado global: 🟡 Amarillo (0.65/1.00)

## Dimensiones
| Dimensión | Score | Estado |
|-----------|-------|--------|
| Plan documentado | 0.80 | 🟢 Verde |
| Pruebas realizadas | 0.30 | 🔴 Rojo |
| RTO/RPO definidos | — | ⚪ Sin información |

## Hallazgos principales
- [Rojo] Pruebas realizadas: No se han realizado pruebas en 24+ meses (pregunta: "¿Cuándo fue la última prueba?")

## Aviso
Este resultado es preliminar y requiere validación técnica por el equipo de preventa.

---
Versión herramienta: 1.0.0 | Config scoring: 1.0.0
```

### 6.3 Uso offline

| Aspecto | Solución |
|---------|----------|
| Sin servidor requerido | Los archivos funcionan abriendo `index.html` desde el filesystem (`file://`) |
| Sin imports de red | Todos los `import` son rutas relativas (`../../shared/...`) |
| Sin fuentes remotas | Montserrat local o fallback Arial |
| Sin íconos externos | SVG inline embebido en los componentes |
| Distribución | Zip descargable con la estructura completa del repo |
| Actualización | Reemplazar el zip por una versión nueva |
| Compatibilidad file:// | ES modules funcionan en `file://` en Chrome/Edge (con flag en Firefox; se documenta) |

**Nota sobre `file://` y ES modules:**
- Chrome y Edge permiten ES modules desde `file://` sin configuración.
- Firefox bloquea ES modules en `file://` por CORS. Alternativa: usar un servidor local mínimo (`python -m http.server`) o distribuir con un launcher `.bat`/`.sh` que abra un servidor.
- Se documentará esto en el README con instrucciones claras.

---

## 7. Estrategia de pruebas

### 7.1 Pruebas unitarias (automatizadas)

**Runner:** `node --test` (Node.js ≥ 18, sin dependencias)

| Área | Archivo | Qué valida |
|------|---------|------------|
| Motor scoring | `tests/scoring/engine.test.js` | Cálculo correcto con datos completos, parciales y vacíos |
| Clasificador | `tests/scoring/classifier.test.js` | Transiciones exactas en umbrales (0.74→yellow, 0.75→green) |
| "No sé" → gris | `tests/scoring/engine.test.js` | Dimensión toda "null" → clasificación gray |
| Exclusión gray | `tests/scoring/engine.test.js` | Score global excluye dimensiones gray del denominador |
| Por herramienta | `tests/scoring/tools/*.test.js` | Cada config produce resultados esperados con fixtures |
| Validación | `tests/validation/input-validation.test.js` | Respuestas fuera de rango, tipos incorrectos, arrays vacíos |

**Fixtures:**
- `all-green.js`: respuestas que producen todas las dimensiones verdes.
- `all-red.js`: respuestas que producen todas rojas.
- `mixed.js`: combinación realista.
- `all-unknown.js`: todas "no sé" → todo gris, score global = gray.

**Ejecución:**
```bash
node --test tests/
```

### 7.2 Pruebas de componentes (pendiente decisión D-08)

Los Web Components manipulan DOM. Para testearlos sin navegador se necesita un
DOM sintético. Opciones:

- **Sin test de componentes en V1:** solo se testea la lógica pura (scoring, clasificación, export).
- **Con happy-dom:** agrega una devDependency mínima para simular DOM en Node.

→ Ver decisión D-08 más abajo.

### 7.3 Prueba manual responsive

Documentada en `tests/manual/responsive-checklist.md`:

| Dispositivo | Viewport | Verificaciones |
|-------------|----------|----------------|
| Escritorio | 1440×900, 1920×1080 | Layout completo, tarjetas en grid, tablas legibles |
| Chromebook | 1366×768 | Sin scroll horizontal, botones accesibles |
| Proyector | 1024×768 | Contraste suficiente, texto legible a distancia |
| Tablet | 768×1024 (portrait), 1024×768 (landscape) | Tarjetas apiladas, inputs tocables (≥44px tap target) |
| Móvil | 375×667, 390×844 | Una columna, sin overflow, zoom no rompe layout |

### 7.4 Prueba de accesibilidad

- Navegación completa con Tab/Shift+Tab/Enter/Space.
- Verificar con herramienta de contraste (ej. extensión del navegador).
- Labels visibles en todo campo.
- `aria-label` o `aria-describedby` donde aplique.
- Foco visible en todo elemento interactivo.

### 7.5 Prueba de privacidad

Checklist manual por PR:
1. Abrir DevTools → Network → confirmar 0 requests.
2. Abrir DevTools → Application → confirmar localStorage, sessionStorage, cookies, IndexedDB vacíos.
3. Completar un flujo, recargar → confirmar que los datos se perdieron.
4. Buscar en el código: `fetch(`, `XMLHttpRequest`, `localStorage`, `sessionStorage`, `document.cookie`, `indexedDB`.

---

## 8. Estrategia de Web Components

### 8.1 Convención de nombres

Todos los componentes usan el prefijo `tc-` (Total Cloud):

| Componente | Tag | Responsabilidad |
|------------|-----|-----------------|
| Header | `<tc-header>` | Muestra "Total Cloud · Nombre herramienta" + nav |
| Progress Bar | `<tc-progress-bar>` | Avance visual del flujo |
| Question Card | `<tc-question-card>` | Pregunta + opciones + selección |
| Traffic Light | `<tc-traffic-light>` | Indicador de semáforo con texto |
| Score Explanation | `<tc-score-explanation>` | Desglose detallado |
| Summary | `<tc-summary>` | Resumen completo para print/copy |
| Reset Button | `<tc-reset-button>` | Botón con confirmación |
| Disclaimer | `<tc-disclaimer>` | Texto legal obligatorio |
| Version Badge | `<tc-version-badge>` | Número de versión |

### 8.2 Comunicación entre componentes

```
app.js (orquestador)
  │
  ├── Escucha eventos custom de los componentes
  │     ej: tc-question-card dispara 'tc:answer-selected'
  │
  ├── Actualiza el modelo en memoria (session.responses)
  │
  └── Actualiza atributos/propiedades de otros componentes
        ej: tc-progress-bar.setAttribute('current', '5')
```

- **Eventos custom** (`CustomEvent`) fluyen de componente hijo → app.js.
- **Propiedades/atributos** fluyen de app.js → componentes (one-way binding manual).
- **No hay event bus global** ni estado compartido entre componentes.

### 8.3 Shadow DOM y estilos

- Cada componente usa Shadow DOM para encapsulación.
- Variables CSS (custom properties) de `tokens.css` penetran el Shadow DOM por diseño.
- Los componentes consumen variables, no definen colores propios directamente.
- `print.css` afecta al light DOM; los componentes definen sus propias reglas `@media print` internas si es necesario.

---

## 9. Dispositivos y viewports objetivo

| Escenario de uso | Dispositivo típico | Viewport | Prioridad |
|------------------|--------------------|----------|-----------|
| Reunión presencial con cliente | Laptop + proyector | 1024–1920 px | Alta |
| Ejecutivo muestra en tablet al cliente | iPad / tablet Android | 768–1024 px | Alta |
| Preparación pre-reunión | Laptop/desktop | 1366–1920 px | Alta |
| Consulta rápida en campo | Celular | 320–428 px | Media |
| Chromebook corporativo | Chromebook | 1366×768 | Alta |

### Breakpoints CSS

```css
/* tokens.css */
:root {
  --bp-mobile: 320px;
  --bp-tablet: 768px;
  --bp-desktop: 1024px;
  --bp-wide: 1440px;
}
```

Estrategia: Mobile-first con `min-width` media queries.

---

## 10. Riesgos técnicos

| ID | Riesgo | Probabilidad | Impacto | Mitigación |
|----|--------|--------------|---------|------------|
| RT-01 | ES modules en `file://` no funcionan en Firefox sin servidor local | Alta | Medio | Documentar en README; proveer script `.sh`/`.bat` para levantar servidor; evaluar fallback con script concatenado para Firefox |
| RT-02 | Shadow DOM complica estilos de impresión (@media print) | Media | Medio | Usar `::part()` o variables CSS que se adapten a print; testear impresión en cada componente |
| RT-03 | Web Components sin framework requieren más código boilerplate | Media | Bajo | Crear una clase base `TCComponent` que simplifique el boilerplate de registro y template |
| RT-04 | `navigator.clipboard.writeText()` requiere contexto seguro (HTTPS o localhost) | Alta | Medio | En `file://` puede no funcionar. Fallback: `document.execCommand('copy')` con textarea invisible (deprecated pero funcional) |
| RT-05 | 7 herramientas × múltiples preguntas = mucho contenido por definir | Alta | Alto | Empezar con 1-2 herramientas completas, validar con comercial, luego replicar patrón |
| RT-06 | Sin hot-reload en desarrollo (cero build) | Media | Bajo | Documentar uso de Live Server (extensión) o `python -m http.server` con recarga manual |

---

## 11. Decisiones pendientes de aprobación

| ID | Decisión | Opciones | Recomendación |
|----|----------|----------|---------------|
| D-08 | **Testing de Web Components** — ¿Se permite una devDependency para simular DOM en tests? | a) Solo testear lógica pura en V1 (scoring, classifier, export). No testear componentes. b) Agregar `happy-dom` como devDependency para testear componentes en Node. c) Testear componentes solo manualmente en el navegador. | **Opción (a)**: Solo lógica pura en V1. Los componentes se validan manualmente. Reduce dependencias y complejidad inicial. Si V2 requiere más cobertura, se evalúa happy-dom. |
| D-09 | **Fallback para `file://` en Firefox** — ¿Cómo manejar la restricción de ES modules? | a) Documentar que Firefox requiere servidor local y proveer script helper. b) Crear un build script opcional que concatene módulos en un bundle para compatibilidad file://. c) Ignorar Firefox en file:// (asumir que se usará hosting o Chrome/Edge). | **Opción (a)**: Documentar + proveer script helper (`serve.sh` / `serve.bat`). No agregar build step para un edge case. La mayoría de corporativos usa Chrome o Edge. |
| D-10 | **Clipboard en contexto no seguro (file://)** — ¿Cómo manejar la copia al portapapeles? | a) Usar `navigator.clipboard` con fallback a `execCommand('copy')`. b) Solo `execCommand('copy')` para máxima compatibilidad. c) Solo ofrecer impresión, no copia al portapapeles. | **Opción (a)**: `navigator.clipboard` primario con fallback a `execCommand('copy')`. Cubre tanto hosting (HTTPS) como file:// (fallback). |
| D-11 | **Clase base para Web Components** — ¿Se crea una clase `TCComponent` base? | a) Sí, con helpers para template, render reactivo y registro. b) No, cada componente es independiente y simple. c) Solo un mixin ligero para registro y shadow DOM setup. | **Opción (a)**: Clase base `TCComponent`. Reduce boilerplate significativamente en 9+ componentes, estandariza el patrón de render y facilita mantenimiento. No es un framework — son ~50 líneas de utilería. |
| D-12 | **Orden de desarrollo** — ¿Con cuál herramienta empezar? | a) DRP Readiness (01) — la más solicitada según prioridad numérica. b) La herramienta más simple para validar el pattern (ej. FinOps Maturity por ser un modelo de madurez lineal). c) Desarrollar shared/ completo primero, luego implementar todas en paralelo. | **Opción (b)**: Empezar con FinOps Maturity. Es un modelo de madurez con niveles claros (inicial→avanzado), ideal para validar el flujo completo sin demasiada complejidad en preguntas. Una vez validado el patrón, se replica a las demás. |

---

## Resumen visual de la arquitectura

```
                    ┌─────────────────┐
                    │    USUARIO      │
                    │ (equipo comercial)│
                    └────────┬────────┘
                             │ abre en navegador
                             ▼
                    ┌─────────────────┐
                    │    LAUNCHER     │
                    │  (índice HTML)  │
                    └────────┬────────┘
                             │ <a href>
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
     ┌──────────────┐ ┌──────────┐ ┌──────────────┐
     │ Tool 01      │ │ Tool 02  │ │  ... Tool 07 │
     │ (HTML+JS)    │ │          │ │              │
     └──────┬───────┘ └────┬─────┘ └──────┬───────┘
            │               │              │
            └───────────────┼──────────────┘
                            ▼
              ┌──────────────────────────┐
              │        SHARED/           │
              │                          │
              │  components/ → UI (WC)   │
              │  scoring/    → lógica    │
              │  export/     → print/copy│
              │  styles/     → CSS vars  │
              └──────────────────────────┘
                            │
                            ▼
              ┌──────────────────────────┐
              │     MEMORIA (RAM)        │
              │  session = { responses } │
              │  → borrado al recargar   │
              └──────────────────────────┘
```
