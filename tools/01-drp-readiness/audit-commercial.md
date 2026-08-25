# Auditoría Comercial — DRP Readiness v2

Fecha: 2026-08-21
Auditor: Kiro (asistente de desarrollo)

---

## 1. Duración estimada

| Segmento | Preguntas | Tiempo estimado |
|----------|-----------|-----------------|
| Contexto (no puntúan) | CTX-01 a CTX-04 | 2 min |
| Plan DRP | P01 + P02* + P03* | 1.5 min |
| RTO | P04 + P05* | 1 min |
| RPO | P06 + P07* | 1 min |
| Respaldos | P08 + P09* + P10* + P11* + P12* | 3 min |
| Restauraciones | P13 + P14* | 1 min |
| Dependencias/Resp. | P15 + P16 + P17 | 2 min |
| Ransomware | P18 + P19 + P20 | 2 min |
| **Total** | **17–21 visibles** | **13.5 min** |

**Veredicto:** ✅ Dentro del límite de 15 minutos. Los skips por dependencia
reducen la duración en entornos poco preparados (menos preguntas).

---

## 2. Claridad de las preguntas

| Criterio | Evaluación |
|----------|-----------|
| ¿Usa lenguaje comprensible para un director de TI? | ✅ Sí. Evita jerga excesiva. |
| ¿Incluye ayuda para términos técnicos? | ✅ Sí. RTO, RPO, inmutabilidad y restauración completa tienen ayuda inline. |
| ¿Cada pregunta tiene una sola interpretación? | ✅ Sí. Se separaron las que antes mezclaban dos controles. |
| ¿Las opciones son mutuamente excluyentes? | ✅ Sí. Cada opción describe un nivel distinto. |
| ¿El orden fluye naturalmente en conversación? | ✅ Sí. De lo estratégico a lo táctico, cierra con ransomware. |

**Observaciones:**
- P12 (inmutabilidad) podría necesitar reformulación si el interlocutor no es técnico. La ayuda inline mitiga esto.
- P20 (recuperación sin identidad) es la más técnica. Se recomienda que el ejecutivo pueda decir "esto lo vemos con su equipo técnico" y usar "No sé".

---

## 3. Utilidad durante una reunión

| Criterio | Evaluación |
|----------|-----------|
| ¿Genera conversación productiva? | ✅ Las preguntas abren temas que el cliente necesita considerar. |
| ¿Evita que el cliente se sienta interrogado? | ✅ Las preguntas de contexto abren suavemente; "No sé" siempre es válido. |
| ¿El resultado es útil para cerrar la reunión? | ✅ El semáforo da un resumen visual inmediato para discutir. |
| ¿Ayuda a identificar siguiente paso? | ✅ Las 5 preguntas para preventa orientan la siguiente conversación. |
| ¿Es demasiado largo para una primera reunión? | ✅ No. 13.5 min es razonable dentro de una reunión de 45–60 min. |

---

## 4. Calidad del handoff a preventa

| Criterio | Evaluación |
|----------|-----------|
| ¿El resumen contiene información accionable? | ✅ Score + hallazgos + preguntas dinámicas. |
| ¿Preventa puede priorizar sin repetir preguntas? | ✅ Las preguntas PV se activan según gaps identificados. |
| ¿Se distingue "brecha confirmada" de "falta info"? | ✅ Rojo vs Gris + indicador de confianza. |
| ¿Incluye los objetivos reportados (RTO/RPO)? | ✅ Se muestran como "objetivo declarado, no verificado". |
| ¿Evita que preventa asuma algo que no se preguntó? | ✅ Gris y "provisional" lo señalan explícitamente. |

---

## 5. Ausencia de venta dura o conclusiones automáticas

| Criterio | Evaluación |
|----------|-----------|
| ¿Se evitan precios, costos o ROI? | ✅ Cero mención de dinero en todo el flujo. |
| ¿Se evitan promesas de recuperación? | ✅ Verde dice "bases razonables", no "garantía". |
| ¿Se evita lenguaje de miedo? | ✅ Rojo dice "requiere atención", no "desastre inminente". |
| ¿Se evitan recomendaciones de producto? | ✅ No se sugiere ningún servicio específico de Total Cloud. |
| ¿Se evita presión para contratar? | ✅ El resultado es diagnóstico, no prescriptivo. |
| ¿El disclaimer es visible? | ✅ "Preliminar y requiere validación técnica." |
| ¿Se evitan superlativos? | ✅ Sin "el mejor", "líder", etc. |

---

## Veredicto comercial

✅ **APROBADO** — El cuestionario cumple las restricciones comerciales. Es útil
para una reunión de diagnóstico sin cruzar las líneas de guardrails.

**Recomendación:** validar con un ejecutivo comercial real que el flujo se
siente natural y las preguntas de ransomware no generan ansiedad excesiva.
