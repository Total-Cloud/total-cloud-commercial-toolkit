# Cuestionario DRP Readiness v2

Versión: 2.0.0-draft
Preguntas principales: 17
Preguntas condicionales: 4 (aparecen solo si aplican)
Preguntas de contexto (no puntuables): 4
Tiempo estimado: 12–15 minutos.

---

## Instrucciones para el ejecutivo comercial

1. Presenta: "Vamos a hacer un diagnóstico rápido sobre su postura de
   recuperación ante desastres. No es una auditoría; es una conversación
   para entender dónde están hoy y qué áreas vale la pena explorar."
2. Avanza pregunta por pregunta. Si el cliente duda, ofrece "No sé" sin presionar.
3. Las preguntas de contexto (marcadas con 🔵) no puntúan pero dan información valiosa.
4. Si una pregunta condicional no aparece (dependencia no cumplida), no la fuerces.
5. Al final, revisa el resumen con el cliente antes de cerrar.

---

## Preguntas de contexto (no puntuables)

Estas preguntas se hacen al inicio para enmarcar la conversación.

### CTX-01 — Cantidad de sistemas críticos
**¿Aproximadamente cuántos sistemas o aplicaciones considera críticos para la operación diaria?**

| Opción | Nota |
|--------|------|
| 1 a 3 | Entorno concentrado |
| 4 a 10 | Entorno moderado |
| Más de 10 | Entorno complejo |
| No sé | Información pendiente |

*No puntúa. Contextualiza la complejidad del entorno.*

### CTX-02 — Operación 24/7
**¿Su operación depende de estos sistemas las 24 horas del día, los 7 días de la semana?**

| Opción | Nota |
|--------|------|
| Sí, 24/7 | Alta criticidad horaria |
| Sí, pero con ventanas de mantenimiento | Hay espacio para intervención |
| Solo en horario laboral | Menor urgencia fuera de horario |
| No sé | Información pendiente |

*No puntúa. Dimensiona el impacto de una caída.*

### CTX-03 — Consecuencia de una interrupción
**Si sus sistemas críticos dejaran de funcionar por 24 horas, ¿cuál sería la consecuencia principal?**

| Opción | Nota |
|--------|------|
| Detención total de operaciones | Impacto máximo |
| Operación degradada con pérdida de ingresos | Impacto alto |
| Incomodidad operativa pero sin pérdida directa | Impacto medio |
| Impacto mínimo o desconocido | Impacto bajo / no evaluado |

*No puntúa. Ayuda a preventa a priorizar.*

### CTX-04 — Última prueba de recuperación
**¿Recuerda aproximadamente cuándo fue la última vez que se probó recuperar un sistema desde un respaldo?**

| Opción | Nota |
|--------|------|
| En los últimos 3 meses | Reciente |
| Entre 3 y 12 meses | Razonable |
| Hace más de 12 meses | Desactualizado |
| Nunca se ha probado | Riesgo alto |
| No sé | Información pendiente |

*No puntúa. Se cruza con las preguntas puntuables de restauración.*

---

## Dimensión 1: Plan DRP documentado (peso: 0.12)

### P01 — Existencia del plan
**¿Cuenta la organización con un plan de recuperación ante desastres (DRP) documentado y accesible para el equipo responsable?**

*Ayuda: un DRP es un documento que describe qué hacer paso a paso cuando los sistemas críticos fallan.*

| Opción | Valor |
|--------|-------|
| Sí | 1.0 |
| Parcial | 0.5 |
| No | 0.0 |
| No sé | null |

"No aplica" **no está disponible** para esta pregunta.

### P02 — Actualización del plan
**¿Se ha revisado o actualizado este plan en los últimos 12 meses?**

*Condición: aparece solo si P01 ≠ "No". Si P01 = "No", se omite automáticamente (skip por dependencia).*

| Opción | Valor |
|--------|-------|
| Sí, en los últimos 12 meses | 1.0 |
| Se revisó hace 12–24 meses | 0.5 |
| No se ha revisado en más de 24 meses | 0.0 |
| No sé | null |

### P03 — Accesibilidad del plan
**¿Las personas que necesitarían ejecutar el plan saben dónde encontrarlo y cómo acceder a él?**

*Condición: aparece solo si P01 ≠ "No".*

| Opción | Valor |
|--------|-------|
| Sí, está accesible y lo conocen | 1.0 |
| Solo algunas personas lo conocen | 0.5 |
| No, o no estoy seguro | 0.0 |
| No sé | null |

---

## Dimensión 2: Objetivos de recuperación — RTO (peso: 0.10)

### P04 — Definición de RTO
**¿Tiene la organización definido un tiempo máximo aceptable para restaurar la operación después de un desastre (RTO)?**

*Ayuda: RTO (Recovery Time Objective) es cuánto tiempo puede estar caído un sistema antes de que el impacto sea inaceptable.*

| Opción | Valor |
|--------|-------|
| Sí, definido y documentado | 1.0 |
| Se tiene una idea general pero no está documentado | 0.5 |
| No está definido | 0.0 |
| No sé | null |

"No aplica" **no está disponible** para esta pregunta.

### P05 — Rango declarado de RTO *(informativa, vinculada a P04)*
**¿Cuál es el tiempo máximo de caída aceptable que manejan como referencia?**

*Condición: aparece solo si P04 ≠ "No" y P04 ≠ "No sé".*
*No puntúa directamente pero se reporta en el resumen como "objetivo reportado" (nunca como garantía).*

| Opción | Etiqueta en resumen |
|--------|---------------------|
| Menos de 1 hora | RTO reportado: < 1h |
| 1 a 4 horas | RTO reportado: 1–4h |
| 4 a 12 horas | RTO reportado: 4–12h |
| 12 a 24 horas | RTO reportado: 12–24h |
| Más de 24 horas | RTO reportado: > 24h |

*Disclaimer en resumen: "Este es un objetivo declarado por el interlocutor, no un tiempo verificado ni garantizado."*

---

## Dimensión 3: Objetivos de recuperación — RPO (peso: 0.10)

### P06 — Definición de RPO
**¿Tiene la organización definida la cantidad máxima de datos que puede permitirse perder (RPO)?**

*Ayuda: RPO (Recovery Point Objective) es cuántos datos puede perder. Si los respaldos son cada 24 horas, el RPO es 24 horas como máximo.*

| Opción | Valor |
|--------|-------|
| Sí, definido y documentado | 1.0 |
| Se tiene una idea general pero no está documentado | 0.5 |
| No está definido | 0.0 |
| No sé | null |

"No aplica" **no está disponible** para esta pregunta.

### P07 — Rango declarado de RPO *(informativa, vinculada a P06)*
**¿Cuánta pérdida de datos consideran aceptable como máximo?**

*Condición: aparece solo si P06 ≠ "No" y P06 ≠ "No sé".*
*No puntúa directamente.*

| Opción | Etiqueta en resumen |
|--------|---------------------|
| Menos de 1 hora | RPO reportado: < 1h |
| 1 a 4 horas | RPO reportado: 1–4h |
| 4 a 12 horas | RPO reportado: 4–12h |
| 12 a 24 horas | RPO reportado: 12–24h |
| Más de 24 horas | RPO reportado: > 24h |

*Disclaimer: "Este es un objetivo declarado, no un valor verificado ni garantizado."*

---

## Dimensión 4: Respaldos (peso: 0.20)

### P08 — Existencia de respaldos
**¿Se realizan respaldos de los sistemas y datos que considera críticos?**

| Opción | Valor |
|--------|-------|
| Sí | 1.0 |
| Solo de algunos sistemas | 0.5 |
| No | 0.0 |
| No sé | null |

"No aplica" **no está disponible** para esta pregunta.

### P09 — Periodicidad de respaldos
**¿Con qué frecuencia se realizan estos respaldos?**

*Condición: aparece solo si P08 ≠ "No".*

| Opción | Valor |
|--------|-------|
| Diario o más frecuente | 1.0 |
| Semanal | 0.7 |
| Mensual o menos frecuente | 0.3 |
| No hay frecuencia definida | 0.0 |
| No sé | null |

### P10 — Verificación de respaldos
**¿Se verifica periódicamente que los respaldos se completaron correctamente y que los datos son recuperables?**

*Condición: aparece solo si P08 ≠ "No".*

| Opción | Valor |
|--------|-------|
| Sí, se verifican regularmente | 1.0 |
| Se verifican ocasionalmente | 0.5 |
| No se verifican | 0.0 |
| No sé | null |

### P11 — Almacenamiento separado
**¿Los respaldos se almacenan en una ubicación separada del entorno principal (otra sede, otra nube, cinta offsite)?**

*Condición: aparece solo si P08 ≠ "No".*

| Opción | Valor |
|--------|-------|
| Sí, en ubicación separada | 1.0 |
| Parcialmente (algunos sí, otros no) | 0.5 |
| No, están en el mismo entorno | 0.0 |
| No sé | null |

### P12 — Inmutabilidad o aislamiento
**¿Los respaldos están protegidos contra modificación o borrado (inmutables, air-gapped, o con credenciales separadas)?**

*Ayuda: "inmutable" significa que nadie puede borrar o modificar el respaldo una vez creado, ni siquiera un administrador comprometido.*
*Condición: aparece solo si P08 ≠ "No".*

| Opción | Valor |
|--------|-------|
| Sí, son inmutables o están aislados | 1.0 |
| Tienen credenciales separadas pero no son inmutables | 0.5 |
| No, un atacante con acceso admin podría borrarlos | 0.0 |
| No sé | null |

---

## Dimensión 5: Restauraciones probadas (peso: 0.18)

### P13 — Prueba de restauración completa
**¿Se ha probado restaurar completamente al menos un sistema crítico desde un respaldo en los últimos 12 meses?**

*Ayuda: "restauración completa" significa levantar el sistema funcional desde cero usando solo los respaldos, no una simple verificación de archivos.*

| Opción | Valor |
|--------|-------|
| Sí, en los últimos 12 meses | 1.0 |
| Se hizo una prueba parcial | 0.5 |
| Hace más de 12 meses | 0.3 |
| Nunca se ha probado | 0.0 |
| No sé | null |

"No aplica" **no está disponible** para esta pregunta.

### P14 — Documentación de resultados
**¿Los resultados de la última prueba de restauración están documentados (tiempo real de recuperación, problemas encontrados, acciones correctivas)?**

*Condición: aparece solo si P13 ≠ "Nunca se ha probado".*

| Opción | Valor |
|--------|-------|
| Sí, con detalle suficiente | 1.0 |
| Se documentó algo básico | 0.5 |
| No se documentaron | 0.0 |
| No sé | null |

---

## Dimensión 6: Dependencias y responsables (peso: 0.12)

### P15 — Mapeo de dependencias
**¿Tiene identificados los sistemas, proveedores y servicios de los que dependen sus aplicaciones críticas?**

| Opción | Valor |
|--------|-------|
| Sí, inventario completo y actualizado | 1.0 |
| Parcialmente, o desactualizado | 0.5 |
| No | 0.0 |
| No sé | null |

### P16 — Responsables asignados
**¿Hay personas con roles específicos asignados para actuar en caso de un desastre (líder de crisis, responsables técnicos, comunicación)?**

| Opción | Valor |
|--------|-------|
| Sí, roles definidos y conocidos | 1.0 |
| Se sabe informalmente quién actuaría | 0.5 |
| No hay roles definidos | 0.0 |
| No sé | null |

"No aplica" **no está disponible** para esta pregunta.

### P17 — Protocolo de comunicación
**¿Existe un protocolo para comunicar a clientes, empleados y dirección durante un incidente mayor?**

| Opción | Valor |
|--------|-------|
| Sí, documentado con canales y responsables | 1.0 |
| Se haría sobre la marcha | 0.5 |
| No existe | 0.0 |
| No sé | null |
| No aplica | skip (requiere justificación: "¿por qué no aplicaría?") |

---

## Dimensión 7: Protección contra ransomware (peso: 0.18)

### P18 — MFA y credenciales separadas para respaldos
**¿Las cuentas que administran los respaldos tienen autenticación multifactor (MFA) y credenciales diferentes a las del entorno principal?**

*Ayuda: MFA es un segundo factor de verificación (token, app, SMS) además de la contraseña.*

| Opción | Valor |
|--------|-------|
| Sí, MFA activo y credenciales separadas | 1.0 |
| Tienen credenciales separadas pero sin MFA | 0.5 |
| Usan las mismas credenciales que el entorno principal | 0.0 |
| No sé | null |

### P19 — Copias inmutables, offline o aisladas
**¿Existe al menos una copia de los datos críticos que no pueda ser modificada o eliminada por un atacante que tome control del entorno principal?**

*Ayuda: puede ser una cinta offline, un respaldo inmutable en nube, o una copia air-gapped.*

| Opción | Valor |
|--------|-------|
| Sí | 1.0 |
| No estamos seguros | 0.5 |
| No | 0.0 |
| No sé | null |

### P20 — Recuperación independiente de la identidad
**Si el directorio de usuarios (Active Directory, identidad central) quedara comprometido, ¿podrían restaurar sistemas sin depender de él?**

*Ayuda: en un ataque de ransomware sofisticado, el atacante compromete la identidad. Si la recuperación depende de esa identidad, no se puede restaurar.*

| Opción | Valor |
|--------|-------|
| Sí, tenemos procedimiento alternativo | 1.0 |
| No estamos seguros | 0.5 |
| No, dependemos completamente de la identidad central | 0.0 |
| No sé | null |

---

## Resumen de estructura

| Tipo | Cantidad | Detalle |
|------|----------|---------|
| Contexto (no puntúan) | 4 | CTX-01 a CTX-04 |
| Principales (puntúan) | 17 | P01–P20 (menos P05 y P07 que son informativas) |
| Condicionales | 4 | P02, P03 dependen de P01; P09–P12 dependen de P08; P14 depende de P13 |
| Informativas (no puntúan, reportan) | 2 | P05 (rango RTO), P07 (rango RPO) |
| **Total máximo de preguntas visibles** | **21** | Si todas las condiciones se cumplen |
| **Total mínimo de preguntas visibles** | **13** | Si P01="No", P08="No", P13="Nunca" |

Preguntas que puntúan (para el scoring): P01, P02, P03, P04, P06, P08, P09, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20 = **18 preguntas puntuables** (cuando todas son visibles).

---

## Disponibilidad de "No aplica"

| Pregunta | ¿"No aplica" disponible? | Razón |
|----------|--------------------------|-------|
| P01 | ❌ No | Toda organización debe considerar su continuidad |
| P04 | ❌ No | Todo sistema crítico debe tener un RTO |
| P06 | ❌ No | Todo sistema crítico debe tener un RPO |
| P08 | ❌ No | Los respaldos son fundamentales |
| P13 | ❌ No | La restauración aplica siempre que haya respaldos |
| P16 | ❌ No | Alguien debe responder ante un desastre |
| P17 | ✅ Sí | Requiere justificación breve |
| Todas las demás condicionales | ❌ No | Ya están filtradas por dependencia |

Cuando "No aplica" se selecciona en P17, el sistema solicita:
> "Brevemente, ¿por qué no aplica un protocolo de comunicación?"
La respuesta se registra como texto libre (máx 100 caracteres) y aparece en el resumen marcada como "pendiente de validación por preventa".

---

## Orden de presentación en la reunión

1. **Bloque contexto** (CTX-01 a CTX-04) — enmarcar la conversación, 2 min.
2. **Plan DRP** (P01, P02*, P03*) — empezar con lo estratégico.
3. **RTO** (P04, P05*) — cuantificar expectativas.
4. **RPO** (P06, P07*) — complementar con datos.
5. **Respaldos** (P08, P09*, P10*, P11*, P12*) — bloque más extenso pero concreto.
6. **Restauraciones** (P13, P14*) — validar que se prueba.
7. **Dependencias y responsables** (P15, P16, P17) — factor humano y organizacional.
8. **Ransomware** (P18, P19, P20) — cerrar con el riesgo más actual.

*Asterisco = condicional, puede no aparecer.*
