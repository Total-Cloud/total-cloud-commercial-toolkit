# Requirements — Total Cloud Commercial Toolkit v1

Notación: EARS (Easy Approach to Requirements Syntax)

---

## 1. Requisitos de plataforma (PLATFORM)

### PLAT-01 — Operación offline
**While** el usuario no tenga conexión a internet,
**the system shall** funcionar completamente sin degradación de funcionalidad.

### PLAT-02 — Sin dependencias externas
**The system shall** operar sin frameworks, librerías externas ni recursos cargados desde CDN,
salvo que una dependencia sea aprobada explícitamente por escrito.

### PLAT-03 — Responsividad
**The system shall** ser usable en pantallas de escritorio (≥1024 px), tablet (768–1023 px) y
móvil (320–767 px) sin pérdida de funcionalidad.

### PLAT-04 — Sin persistencia
**The system shall** procesar todos los datos en memoria y eliminarlos al recargar o cerrar
la pestaña del navegador.

### PLAT-05 — Sin comunicación de red
**The system shall** no realizar llamadas HTTP, WebSocket, fetch ni cualquier forma de
comunicación de red, incluyendo analítica y telemetría.

### PLAT-06 — Accesibilidad teclado
**The system shall** permitir completar cualquier flujo usando únicamente el teclado.

### PLAT-07 — Contraste AA
**The system shall** cumplir con un ratio de contraste mínimo de 4.5:1 (WCAG 2.1 nivel AA)
para todo texto visible.

### PLAT-08 — Tamaño mínimo de texto
**The system shall** usar un tamaño mínimo de 16 px en todos los controles, labels e inputs.

### PLAT-09 — Labels visibles
**The system shall** mostrar labels visibles para todos los campos de formulario (no solo
placeholders).

---

## 2. Requisitos del launcher (LAUNCH)

### LAUNCH-01 — Índice de herramientas
**The system shall** presentar un índice visual con las 7 herramientas disponibles,
mostrando nombre, descripción breve y estado (activa/próximamente).

### LAUNCH-02 — Navegación directa
**When** el usuario selecciona una herramienta del índice,
**the system shall** navegar a la herramienta correspondiente sin recarga completa de página
si la arquitectura lo permite, o con carga inmediata si son páginas separadas.

### LAUNCH-03 — Versión visible
**The system shall** mostrar el número de versión del toolkit en el launcher.

---

## 3. Requisitos de herramientas individuales (TOOL)

### TOOL-01 — Flujo guiado
**Each tool shall** presentar un flujo lineal de preguntas agrupadas por dimensión,
con barra de progreso visible.

### TOOL-02 — Reinicio
**When** el usuario presiona el botón "Reiniciar",
**the system shall** borrar todas las respuestas de la sesión actual y regresar al inicio
del flujo.

### TOOL-03 — Score determinista
**The system shall** calcular el score final usando únicamente las reglas y pesos
documentados en `shared/scoring/scoring-rules.md`, produciendo siempre el mismo resultado
para las mismas respuestas.

### TOOL-04 — Desglose por dimensión
**The system shall** mostrar el score total y el desglose individual por cada dimensión
evaluada.

### TOOL-05 — Trazabilidad de hallazgos
**For each** hallazgo o clasificación mostrada,
**the system shall** indicar qué pregunta y respuesta específica lo originó.

### TOOL-06 — Semáforo de resultados
**The system shall** clasificar cada dimensión y el resultado global usando el modelo:
- Verde: bases razonables (no equivale a aprobación técnica).
- Amarillo: brechas o información faltante que ameritan revisión.
- Rojo: riesgo/bloqueador que requiere atención antes de definir alcance.
- Gris: información insuficiente para clasificar.

### TOOL-07 — Dato faltante ≠ rojo
**If** una pregunta no tiene respuesta o el usuario indica "no sé",
**the system shall** clasificar esa dimensión como gris (sin información), nunca como rojo.

### TOOL-08 — Resumen imprimible
**When** el usuario completa el flujo,
**the system shall** generar un resumen estructurado que pueda imprimirse o copiarse al
portapapeles mediante acción explícita del usuario.

### TOOL-09 — Disclaimer obligatorio
**The system shall** incluir en la pantalla de resultados y en el resumen imprimible el texto:
"Este resultado es preliminar y requiere validación técnica por el equipo de preventa."

### TOOL-10 — Versión visible
**Each tool shall** mostrar su número de versión en pantalla.

### TOOL-11 — Exportación solo por acción explícita
**The system shall** no iniciar descargas ni transmisiones de datos sin una acción explícita
del usuario (clic en "Copiar" o uso de la función de impresión del navegador).

---

## 4. Requisitos de componentes compartidos (SHARED)

### SHARED-01 — Encabezado consistente
**The system shall** mostrar un encabezado común con el texto "Total Cloud" (Montserrat 700,
Navy #002A42) y el nombre de la herramienta activa.

### SHARED-02 — Barra de progreso
**The system shall** mostrar una barra de progreso que refleje el avance del usuario dentro
del flujo de la herramienta.

### SHARED-03 — Tarjetas de pregunta
**The system shall** presentar cada pregunta dentro de una tarjeta visualmente diferenciada
con la pregunta, opciones de respuesta y contexto relevante.

### SHARED-04 — Componente semáforo
**The system shall** proveer un componente visual reutilizable para los 4 estados del
semáforo (verde, amarillo, rojo, gris) con etiqueta de texto accesible.

### SHARED-05 — Explicación de score
**The system shall** proveer un componente que explique cómo se calculó el score,
referenciando las reglas aplicadas.

### SHARED-06 — Resumen imprimible
**The system shall** proveer un componente de resumen con formato optimizado para impresión
(@media print), incluyendo fecha de generación y disclaimer.

### SHARED-07 — Botón reiniciar
**The system shall** proveer un botón "Reiniciar" accesible con confirmación antes de borrar
datos.

### SHARED-08 — Scoring configurable
**The system shall** leer todas las reglas y pesos de scoring desde un archivo de
configuración separado (`scoring-rules.md` y/o archivos JSON por herramienta), sin lógica
de clasificación embebida en el código de UI.

---

## 5. Requisitos de las 7 herramientas específicas

### 5.1 DRP Readiness (tools/01-drp-readiness)

#### DRP-01 — Dimensiones evaluadas
**The tool shall** evaluar como mínimo: existencia de plan DRP documentado, pruebas
realizadas en los últimos 12 meses, RTO/RPO definidos, respaldos verificados,
responsables asignados y comunicación de crisis.

#### DRP-02 — Contexto vertical
**The tool shall** incluir preguntas relevantes para las verticales objetivo (transporte,
manufactura, combustibles, financiero, retail) sin asumir un sector específico.

---

### 5.2 Migration Complexity (tools/02-migration-complexity)

#### MIG-01 — Dimensiones evaluadas
**The tool shall** evaluar como mínimo: cantidad de aplicaciones/workloads, dependencias
entre sistemas, antigüedad de la infraestructura, nivel de documentación existente,
ventanas de mantenimiento disponibles y habilidades del equipo interno.

#### MIG-02 — Complejidad relativa
**The tool shall** producir un indicador de complejidad relativa (baja/media/alta) por
workload o grupo, no un plan de migración.

---

### 5.3 FinOps Maturity (tools/03-finops-maturity)

#### FIN-01 — Dimensiones evaluadas
**The tool shall** evaluar como mínimo: visibilidad del gasto en nube, asignación de costos
a centros de costo, procesos de optimización activos, gobernanza de recursos, cultura de
responsabilidad financiera y herramientas de monitoreo de costos.

#### FIN-02 — Modelo de madurez
**The tool shall** mapear las respuestas a un nivel de madurez (inicial, básico, intermedio,
avanzado) sin prescribir acciones específicas.

---

### 5.4 MSP Operational Load (tools/04-msp-operational-load)

#### MSP-01 — Dimensiones evaluadas
**The tool shall** evaluar como mínimo: cantidad de tickets/incidentes mensuales, cobertura
horaria requerida, criticidad de servicios gestionados, procesos de escalamiento,
herramientas de monitoreo actuales y nivel de automatización.

#### MSP-02 — Indicador de carga
**The tool shall** producir un indicador de carga operativa que ayude a dimensionar
preliminarmente el esfuerzo de gestión, sin comprometer niveles de servicio.

---

### 5.5 Telemetry Integration (tools/05-telemetry-integration)

#### TEL-01 — Dimensiones evaluadas
**The tool shall** evaluar como mínimo: fuentes de datos actuales (logs, métricas, traces),
herramientas de observabilidad existentes, cobertura de monitoreo, alertas configuradas,
dashboards activos y gaps de visibilidad.

#### TEL-02 — Mapa de cobertura
**The tool shall** producir un mapa visual de cobertura de telemetría por capa
(infraestructura, aplicación, red, seguridad) indicando dónde hay gaps.

---

### 5.6 Resilience Explorer (tools/06-resilience-explorer)

#### RES-01 — Dimensiones evaluadas
**The tool shall** evaluar como mínimo: redundancia de componentes críticos, failover
automatizado, pruebas de caos/resiliencia, SLAs internos definidos, monitoreo de salud
y procesos de recuperación documentados.

#### RES-02 — Mapa de riesgo
**The tool shall** producir un mapa de riesgo por componente/servicio usando el modelo
de semáforo, sin recomendar arquitectura de solución.

---

### 5.7 Cross-sell Navigator (tools/07-cross-sell-navigator)

#### CROSS-01 — Dimensiones evaluadas
**The tool shall** evaluar como mínimo: servicios actuales contratados, gaps identificados
en conversaciones previas, iniciativas en curso del cliente, madurez tecnológica percibida
y prioridades declaradas.

#### CROSS-02 — Mapa de oportunidades
**The tool shall** producir un mapa de áreas de oportunidad donde otros servicios de Total
Cloud podrían ser relevantes, sin prometer resultados ni comprometer alcance.

#### CROSS-03 — Sin presión comercial
**The tool shall** presentar oportunidades como "áreas donde podríamos explorar valor",
nunca como recomendaciones de compra ni cross-sell agresivo.

---

## 6. Requisitos de ingeniería (ENG)

### ENG-01 — README
**The repository shall** incluir un README.md con instrucciones de instalación, uso local
y estructura del proyecto.

### ENG-02 — ADR
**The repository shall** incluir al menos un ADR (Architecture Decision Record) documentando
las decisiones clave de arquitectura.

### ENG-03 — Scoring rules documentado
**The repository shall** incluir `shared/scoring/scoring-rules.md` con todas las reglas,
pesos y umbrales usados para clasificación.

### ENG-04 — Dataset sintético
**The repository shall** incluir al menos un dataset sintético de demostración por
herramienta para facilitar pruebas y demos.

### ENG-05 — Pruebas unitarias
**The repository shall** incluir pruebas unitarias que validen los límites del score
(transiciones entre verde/amarillo/rojo/gris) y validaciones de entrada.

### ENG-06 — Prueba manual responsive
**The repository shall** documentar un checklist de prueba manual para escritorio, tablet
y móvil.

### ENG-07 — Versionamiento
**Each tool shall** mostrar una versión semántica (MAJOR.MINOR.PATCH) visible en su interfaz.

---

## 7. Requisitos de marca y guardrails (BRAND)

### BRAND-01 — Paleta de colores
**The system shall** usar Navy (#002A42) como color primario y Cyan (#00A9FA) como acento,
definidos en variables CSS centralizadas.

### BRAND-02 — Tipografía
**The system shall** usar Montserrat como familia tipográfica principal con fallback a
Arial/sans-serif, sin cargar fuentes remotas.

### BRAND-03 — Idioma
**The system shall** presentar todo el contenido en español de México.

### BRAND-04 — Sin información comercial sensible
**The system shall** no incluir precios, ROI, compromisos de tiempo, nombres de clientes
no autorizados ni métricas no verificadas en ninguna pantalla, tooltip o texto.

---

# Supuestos

| ID | Supuesto |
|----|----------|
| S-01 | Los usuarios accederán desde laptops corporativas con navegadores modernos (Chrome, Edge, Firefox, Safari últimas 2 versiones). |
| S-02 | El equipo comercial tiene familiaridad básica con herramientas web (no requiere capacitación técnica profunda). |
| S-03 | Las reuniones de diagnóstico duran entre 30 y 60 minutos; cada herramienta debe completarse en ≤15 minutos. |
| S-04 | No se requiere autenticación ni gestión de usuarios en V1. |
| S-05 | El contenido de preguntas y dimensiones será refinado con el equipo comercial después del primer prototipo funcional. |
| S-06 | Montserrat está disponible localmente en los equipos del equipo comercial, o el fallback a Arial es aceptable. |
| S-07 | El scoring se define con el input del equipo de preventa y puede evolucionar entre versiones. |
| S-08 | V1 se distribuye como archivos estáticos (zip, carpeta compartida o hosting estático simple). |

---

# Riesgos

| ID | Riesgo | Impacto | Mitigación propuesta |
|----|--------|---------|---------------------|
| R-01 | Las preguntas definidas inicialmente no reflejen lo que realmente se pregunta en reuniones comerciales. | Las herramientas no se usan o dan resultados irrelevantes. | Iterar con el equipo comercial tras el primer release funcional; diseñar para fácil modificación de preguntas. |
| R-02 | El modelo de scoring no tenga aceptación del equipo de preventa. | Preventa no confía en los handoffs y descarta los resultados. | Documentar scoring de forma transparente; involucrar preventa en la definición de pesos y umbrales. |
| R-03 | Sin persistencia, el usuario pierde todo al recargar accidentalmente. | Frustración en reuniones; datos perdidos a mitad de sesión. | Agregar confirmación antes de salir/recargar (evento `beforeunload`). No guardar datos, pero advertir. |
| R-04 | Responsividad en móvil degrada la usabilidad en reuniones presenciales con tablet. | El ejecutivo no puede mostrar resultados al cliente de forma fluida. | Priorizar el breakpoint de tablet en el diseño; probar con dispositivos reales. |
| R-05 | Sin framework, el codebase se vuelve difícil de mantener conforme crece a 7 herramientas. | Velocidad de desarrollo decrece; bugs de consistencia. | Componentizar con Web Components nativos o módulos ES; mantener shared/ como librería interna bien documentada. |
| R-06 | Equipo comercial necesita funcionar offline en zonas industriales sin WiFi. | Si olvidaron descargar la app, no pueden usarla. | Distribuir como archivos locales que abren directo en el navegador; no depender de hosting. |

---

# Decisiones que requieren aprobación

| ID | Decisión pendiente | Opciones | Recomendación |
|----|-------------------|----------|---------------|
| D-01 | **Arquitectura de componentes** — ¿Cómo estructurar los componentes compartidos sin framework? | a) Web Components nativos (Custom Elements + Shadow DOM) b) Módulos ES con template literals y DOM manual c) Archivos HTML independientes con includes mediante build step mínimo | **Opción (a)**: Web Components nativos. Encapsulan estilo, funcionan en todos los navegadores modernos, no requieren build y son la opción estándar sin dependencias. |
| D-02 | **Navegación entre herramientas** — ¿SPA con router custom o páginas HTML separadas? | a) SPA con router JS custom b) Multi-page (cada herramienta es un index.html independiente) c) Híbrido: launcher es entry point, herramientas cargan como páginas separadas | **Opción (c)**: Híbrido. Minimiza complejidad de routing, cada herramienta se puede desarrollar y probar en aislamiento, y el launcher sirve como hub. |
| D-03 | **Motor de pruebas unitarias** — ¿Se permite una dependencia de desarrollo? | a) Pruebas con script de assertions vanilla (sin deps) b) Permitir una devDependency para testing (ej. uvu, Vitest) c) Usar el test runner nativo de Node.js (node:test) | **Opción (c)**: Node.js test runner nativo (`node --test`). Cero dependencias, incluido en Node ≥18, suficiente para validar scoring y lógica. |
| D-04 | **Formato del archivo de scoring** — ¿JSON, JS o Markdown con frontmatter? | a) JSON puro (fácil de parsear, no permite comentarios) b) Módulo JS exportable (permite comentarios, importable nativamente) c) Markdown documentado + JSON adjunto por herramienta | **Opción (b)**: Módulo JS. Permite comentarios explicativos junto a los pesos, se importa nativamente en el browser con ES modules, y también sirve como documentación legible. scoring-rules.md se genera/sincroniza desde ese módulo. |
| D-05 | **Distribución V1** — ¿Cómo se entrega al equipo comercial? | a) Zip con archivos estáticos para abrir localmente b) GitHub Pages o hosting estático c) Ambos: hosting para acceso rápido + zip para offline | **Opción (c)**: Ambos. El hosting permite acceso inmediato; el zip garantiza funcionamiento offline en campo. |
| D-06 | **¿Se usa build step?** — Minificación, bundling, etc. | a) Cero build: se sirven los archivos tal cual están en el repo b) Build mínimo solo para producción (ej. esbuild para concatenar módulos) c) Build obligatorio con watch para desarrollo | **Opción (a)** para V1: Cero build. Los archivos se sirven directamente. Si en futuras versiones el rendimiento lo requiere, se evalúa un build mínimo. |
| D-07 | **Prevención de pérdida de datos** — ¿Cómo manejar recarga accidental? | a) No hacer nada (respetar privacy.md estrictamente) b) Usar `beforeunload` para advertir, sin guardar datos c) Permitir sessionStorage efímero (viola privacy.md actual) | **Opción (b)**: `beforeunload` para advertir. Cumple con privacy.md (no persiste nada) pero protege contra pérdida accidental. |
