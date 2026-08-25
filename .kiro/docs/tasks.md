# Tasks — Total Cloud Commercial Toolkit v1 (Piloto DRP Readiness)

29 tareas, 5 fases (0–4), 2 puntos de aprobación obligatorios. Solo DRP Readiness.

Alcance: una sola herramienta funcional validada en reuniones internas.
Las otras seis herramientas quedan como backlog documentado.

---

## Fase 0 — Base mínima y guardrails

- [ ] T-01: Crear `README.md` con descripción del proyecto, estructura mínima e instrucciones de uso local.
- [ ] T-02: Crear estructura mínima del repositorio (`tools/01-drp-readiness/`, `shared/styles/`, `tests/`, `docs/`).
- [ ] T-03: Confirmar steering aprobado en `.kiro/steering/` (product, brand, commercial-guardrails, privacy).
- [ ] T-04: Crear `shared/styles/tokens.css` — variables CSS de marca, semáforo, spacing y tipografía.
- [ ] T-05: Crear `shared/styles/base.css` — reset mínimo, estilos globales, focus visible.
- [ ] T-06: Crear `shared/styles/print.css` — reglas @media print para resumen imprimible.

## Fase 1 — Especificación funcional de DRP Readiness

- [ ] T-07: Crear `tools/01-drp-readiness/requirements.md` — requisitos específicos de la herramienta.
- [ ] T-08: Crear `tools/01-drp-readiness/questions.md` — cuestionario completo con flujo de reunión, dimensiones y opciones.
- [ ] T-09: Crear `tools/01-drp-readiness/scoring-spec.md` — matriz de scoring determinista (pesos, umbrales, reglas para RTO, RPO, respaldos, restauraciones, dependencias, personas, ransomware).
- [ ] T-10: Crear `tests/fixtures/drp-scenarios.md` — casos de prueba numéricos: escenario maduro (verde), incompleto (amarillo), crítico (rojo), sin información (gris).

> ### 🛑 GATE 1 — Aprobación del cuestionario y scoring
> Detenerse aquí. Presentar T-07 a T-10 para revisión.
> No avanzar a Fase 2 sin aprobación explícita.

## Fase 2 — MVP funcional de DRP Readiness

- [ ] T-11: Crear `tools/01-drp-readiness/index.html` — entry point con imports de estilos y módulos.
- [ ] T-12: Crear `tools/01-drp-readiness/questions.js` — datos del cuestionario aprobado (preguntas, opciones, valores, dimensiones).
- [ ] T-13: Crear `tools/01-drp-readiness/scoring.js` — motor de scoring y clasificador específico de DRP (función pura, reglas del scoring-spec aprobado).
- [ ] T-14: Crear `tools/01-drp-readiness/app.js` — orquestador del flujo: progreso, captura de respuestas en memoria, cálculo, render de resultados, beforeunload.
- [ ] T-15: Crear componentes UI inline o mínimos en `tools/01-drp-readiness/ui.js` — encabezado, barra de progreso, tarjetas de pregunta, semáforo, explicación de score, resumen, disclaimer, botón reiniciar. Solo lo que DRP necesita.
- [ ] T-16: Crear `tools/01-drp-readiness/demo-data.js` — escenario sintético de demostración precargable.
- [ ] T-17: Implementar resumen copiable (clipboard con fallback) e imprimible (window.print).
- [ ] T-18: Implementar sección "5 preguntas para preventa" en la pantalla de resultados.
- [ ] T-19: Verificación manual: flujo completo funcional en Chrome, responsive en tablet y móvil, impresión, offline (file://).

## Fase 3 — Pruebas y auditorías

- [ ] T-20: Crear `tests/scoring/drp-readiness.test.js` — pruebas unitarias del scoring (límites, transiciones, "No sé" → gris, escenarios maduro/incompleto/crítico).
- [ ] T-21: Ejecutar `node --test tests/` y verificar suite verde.
- [ ] T-22: Crear `tests/manual/drp-checklist.md` — checklist de prueba manual (Chromebook, móvil, proyector, impresión, offline, privacidad).
- [ ] T-23: Auditoría comercial: verificar que no hay precios, ROI, compromisos, nombres reales ni métricas no verificadas.
- [ ] T-24: Auditoría de privacidad: verificar cero red, cero persistencia, cero datos reales, solo datos sintéticos.

## Fase 4 — Validación interna y cierre del piloto

- [ ] T-25: Crear `docs/pilot/test-guide.md` — guía de prueba para Nestor, Yuri y Carlos (cómo abrir, qué probar, cómo reportar).
- [ ] T-26: Crear `docs/pilot/handoff-guide.md` — guía de handoff para Marcela, Jorge y Edgar (qué es, qué no es, cómo interpretar resultados).
- [ ] T-27: Crear `docs/pilot/observations-log.md` — plantilla para registrar observaciones de las pruebas internas.
- [ ] T-28: Crear `docs/pilot/reuse-assessment.md` — lista de componentes que sí conviene extraer a shared/ y recomendación sobre si avanzar a migraciones.
- [ ] T-29: Crear `docs/backlog.md` — backlog documentado de las 6 herramientas restantes (solo descripción, dimensiones previstas, prioridad relativa; cero código funcional).

> ### 🛑 GATE 2 — Cierre del piloto
> Detenerse aquí. El equipo interno prueba y valida.
> Con base en observaciones se decide si iterar DRP, avanzar a otra herramienta, o extraer shared/.

---

## Dependencias entre tareas

```
T-01 ──┐
T-02 ──┤
T-03 ──┼──▶ T-04 ──▶ T-05 ──▶ T-06 ──▶ [FASE 0 completa]
       │
       ▼
T-07 ──┐
T-08 ──┼──▶ T-09 ──▶ T-10 ──▶ 🛑 GATE 1
T-09 ──┘
       │
       ▼ (tras aprobación)
T-11 ──┐
T-12 ──┤
T-13 ──┼──▶ T-14 ──▶ T-15 ──▶ T-16 ──▶ T-17 ──▶ T-18 ──▶ T-19
       │
       ▼
T-20 ──▶ T-21 ──▶ T-22 ──▶ T-23 ──▶ T-24
       │
       ▼
T-25 ──┐
T-26 ──┼──▶ T-28 ──▶ T-29 ──▶ 🛑 GATE 2
T-27 ──┘
```

## Puntos de detención obligatorios

| Gate | Después de | Qué se revisa | Quién aprueba |
|------|-----------|---------------|---------------|
| GATE 1 | T-10 | Cuestionario DRP, flujo de reunión, matriz de scoring, escenarios de prueba | Tú (product owner) |
| GATE 2 | T-29 | Piloto funcional probado internamente, observaciones registradas, recomendación de siguiente paso | Equipo (Nestor, Yuri, Carlos + Marcela, Jorge, Edgar) |

## Lo que NO se hace en este ciclo

- No se construyen las herramientas 02 a 07.
- No se crea un launcher funcional (solo se documenta en backlog).
- No se generalizan componentes a shared/components/ hasta después del piloto.
- No se crea clase base TCComponent ni Web Components formales.
- No se despliega a hosting público.
- No se abre PR ni se hace push hasta completar Fase 3.
