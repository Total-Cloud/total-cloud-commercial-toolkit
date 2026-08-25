# Scoring Specification — DRP Readiness v2

Versión: 2.0.0-draft
Determinista: sí. Mismas respuestas → mismo resultado. Siempre.
Editable: pesos y umbrales configurables en scoring-config.js.
Versionado: cada cambio incrementa la versión del config.

---

## 1. Dos indicadores independientes

Esta herramienta produce dos indicadores separados:

### 1.1 Indicador de madurez (preparación)
Mide qué tan preparada está la organización según las respuestas concretas.
Se calcula solo con datos reales (Sí, Parcial, No).

### 1.2 Indicador de confianza (completitud de información)
Mide qué proporción de la evaluación tiene datos suficientes.
Ayuda a interpretar el indicador de madurez.

```
Si confianza es baja → el indicador de madurez puede no reflejar la realidad.
Si confianza es alta → el indicador de madurez es más representativo.
```

---

## 2. Valores de respuesta

| Respuesta | Valor numérico | Efecto en madurez | Efecto en confianza |
|-----------|---------------|-------------------|---------------------|
| **Sí** | 1.0 | Suma positivamente | Cuenta como dato |
| **Parcial** | 0.5 | Suma parcialmente | Cuenta como dato |
| **No** | 0.0 | Penaliza (brecha confirmada) | Cuenta como dato |
| **No sé** | null | Se excluye del cálculo de madurez | Reduce confianza |
| **No aplica** (con justificación) | skip | Se excluye de ambos cálculos | Marcada "pendiente de validación" |
| **Skip por dependencia** | skip | Se excluye automáticamente | No afecta confianza negativamente |

### Diferencia: "No sé" vs "No"

| | "No" | "No sé" |
|---|------|---------|
| Significado | El control NO existe | No tiene la información |
| Valor | 0.0 (penaliza madurez) | null (no penaliza) |
| Confianza | Aumenta (es un dato concreto) | Reduce (es un gap de info) |
| Señal | Brecha confirmada | Información pendiente |

### Diferencia: Rojo vs Gris

| | 🔴 Rojo | ⚪ Gris |
|---|---------|---------|
| Causa | Score bajo con datos reales | Sin datos suficientes |
| Significado | Riesgo confirmado | No se puede evaluar |
| Acción | Atender antes de definir alcance | Obtener información |
| Nunca ocurre cuando | Solo hay "No sé" | Hay respuestas concretas |
| Texto acompañante | "Requiere atención" | "Información insuficiente" |
| Ícono | ⛔ (alto) | ❓ (pendiente) |

---

## 3. Dimensiones y pesos

| # | Dimensión | Peso | Preguntas puntuables | Crítica | Justificación |
|---|-----------|------|---------------------|---------|---------------|
| 1 | Plan DRP documentado | 0.10 | P01, P02*, P03* | No | Base estratégica; sin plan hay desorden pero aún se puede recuperar si hay respaldos |
| 2 | Objetivos RTO | 0.08 | P04 | Sí | Define expectativas de tiempo; sin RTO no se puede dimensionar solución |
| 3 | Objetivos RPO | 0.08 | P06 | Sí | Define tolerancia a pérdida de datos; complemento esencial del RTO |
| 4 | Respaldos | 0.22 | P08, P09*, P10*, P11*, P12* | Sí | Fundamento operativo. Sin respaldos NO hay recuperación posible. Peso mayor porque es la capacidad real de restaurar. |
| 5 | Restauraciones probadas | 0.20 | P13, P14* | Sí | Un respaldo no probado tiene capacidad incierta. Peso cercano a respaldos porque la existencia sin prueba da falsa confianza. Sin prueba, el respaldo es solo una promesa. |
| 6 | Dependencias y responsables | 0.12 | P15, P16, P17 | No | Factor organizacional. Importante pero no bloquea la recuperación técnica directamente. |
| 7 | Protección ransomware | 0.20 | P18, P19, P20 | Sí | Vector de ataque #1 actual. Si ransomware borra los respaldos, todo lo anterior es inútil. Peso alto por su capacidad de anular las demás dimensiones. |

**Total: 1.00**

*Asterisco = pregunta condicional que puede no estar presente.*

### Justificación de pesos: Respaldos (0.22) vs Restauraciones (0.20)

- **Respaldos (0.22):** sin respaldos, la restauración es imposible. Es la precondición física. Tiene el peso más alto porque su ausencia es un bloqueador absoluto (override: si no hay respaldos → rojo global).
- **Restauraciones (0.20):** un respaldo que nunca se probó podría estar corrupto, incompleto o tardar mucho más del RTO. El peso es casi igual porque la confiabilidad del respaldo solo se demuestra restaurando. La diferencia de 0.02 refleja que al menos tener respaldos sin probar es marginalmente mejor que no tenerlos.
- **Ambos tienen override:** si no hay respaldos → rojo global. Si nunca se probó → no puede ser verde global. Esto compensa cualquier debate sobre si 0.20 vs 0.22 es suficiente.

---

## 4. Fórmulas de cálculo

### 4.1 Score por dimensión (madurez)

```
Para cada dimensión d:
  preguntas_presentes(d) = preguntas que se mostraron (no skip por dependencia)
  preguntas_con_dato(d) = preguntas donde respuesta ∈ {Sí, Parcial, No}
  preguntas_null(d) = preguntas donde respuesta = "No sé"
  
  Si preguntas_con_dato(d) == 0:
    score_madurez(d) = null → clasificación = GRIS
  Si no:
    score_madurez(d) = Σ(valores de preguntas_con_dato) / count(preguntas_con_dato)
```

### 4.2 Confianza por dimensión

```
  confianza(d) = preguntas_con_dato(d) / preguntas_presentes(d)
  
  Niveles:
    confianza = 1.0     → "Completa"
    confianza ≥ 0.5     → "Parcial"
    confianza < 0.5     → "Baja"
    confianza = 0       → "Sin información"
```

### 4.3 Clasificación por dimensión

```
Si score_madurez(d) == null:    → GRIS  ⚪ (sin información)
Si score_madurez(d) >= 0.75:    → VERDE 🟢 (bases razonables)
Si score_madurez(d) >= 0.40:    → AMARILLO 🟡 (brechas que ameritan revisión)
Si score_madurez(d) < 0.40:     → ROJO 🔴 (riesgo que requiere atención)
```

### 4.4 Score global (madurez)

```
dims_con_datos = dimensiones donde score_madurez(d) ≠ null
peso_efectivo = Σ peso(d) para d en dims_con_datos

Si dims_con_datos está vacío:
  score_global = null → GRIS

Si no:
  score_global_matematico = Σ(score_madurez(d) × peso(d)) / peso_efectivo
```

### 4.5 Confianza global

```
confianza_global = count(dims_con_datos) / count(todas_las_dimensiones)

Total de preguntas puntuables presentes = Σ preguntas_presentes(d)
Total con dato = Σ preguntas_con_dato(d)
confianza_detallada = Total con dato / Total presentes
```

---

## 5. Overrides (salvaguardas obligatorias)

Los overrides se aplican DESPUÉS del cálculo matemático. Nunca ocultan los
scores y explicaciones individuales; solo afectan la clasificación global.

| ID | Condición | Override | Texto mostrado |
|----|-----------|---------|----------------|
| OV-01 | Más del 50% de las dimensiones son GRIS | Global = GRIS | "La información recopilada es insuficiente para un diagnóstico significativo." |
| OV-02 | Cualquier dimensión CRÍTICA (RTO, RPO, Respaldos, Restauraciones, Ransomware) es GRIS | Global no puede ser VERDE; se marca "PROVISIONAL" | "El resultado es provisional. Faltan datos en áreas críticas: [lista]." |
| OV-03 | P08 (existencia de respaldos) = "No" | Global = ROJO | "Sin respaldos, la recuperación ante un desastre no es viable." |
| OV-04 | P13 = "Nunca se ha probado" | Global no puede ser VERDE | "Sin pruebas de restauración, la capacidad de recuperación es incierta." |
| OV-05 | P04 = "No" (RTO no definido) | Global no puede ser VERDE | "Sin RTO definido, no se puede dimensionar una solución de recuperación." |
| OV-06 | P06 = "No" (RPO no definido) | Global no puede ser VERDE | "Sin RPO definido, no se puede determinar la frecuencia de respaldos necesaria." |
| OV-07 | 2 o más dimensiones CRÍTICAS en ROJO | Global = ROJO | "Dos o más áreas críticas presentan riesgo. Se requiere atención integral." |

### Orden de evaluación de overrides

1. OV-01 (si aplica, el resultado es GRIS y se detiene).
2. OV-03 (si aplica, el resultado es ROJO).
3. OV-07 (si aplica, el resultado es ROJO).
4. OV-04, OV-05, OV-06 (si aplican, el resultado no puede ser VERDE → se degrada a máximo AMARILLO).
5. OV-02 (si aplica y no se aplicó un override anterior, se marca PROVISIONAL).

### Resultado final

```
clasificacion_final = max_severidad(clasificacion_matematica, overrides_aplicados)

Donde severidad: GRIS > ROJO > AMARILLO > VERDE
(GRIS es la más severa porque significa que no se puede evaluar)
```

**Nota:** un override NUNCA oculta el desglose. El usuario siempre ve todas las
dimensiones con sus scores individuales, incluso si el global es ROJO por override.

---

## 6. Reglas de precondición (skip por dependencia)

| Si... | Entonces... | Razón |
|-------|-------------|-------|
| P01 = "No" | P02 y P03 se omiten (skip) | No hay plan que actualizar ni acceder |
| P08 = "No" | P09, P10, P11, P12 se omiten (skip) | No hay respaldos que medir |
| P13 = "Nunca se ha probado" | P14 se omite (skip) | No hay resultados que documentar |
| P04 = "No" o "No sé" | P05 se omite (skip) | No hay RTO que cuantificar |
| P06 = "No" o "No sé" | P07 se omite (skip) | No hay RPO que cuantificar |

Los skip por dependencia NO reducen la confianza. Son decisiones lógicas, no
falta de información.

---

## 7. Cinco preguntas dinámicas para preventa

Las preguntas para preventa se generan de forma **determinista** usando estas reglas de prioridad:

### Banco de preguntas para preventa (15 preguntas predefinidas)

| ID | Pregunta | Se activa cuando... | Prioridad |
|----|----------|---------------------|-----------|
| PV-01 | ¿Cuál es el RTO real medido en la última prueba de restauración? | Dim Restauraciones ≠ verde | 1 (alta) |
| PV-02 | ¿Qué sistemas no están cubiertos por los respaldos actuales? | Dim Respaldos es amarillo o P08 = "Parcial" | 1 |
| PV-03 | ¿Los respaldos son inmutables o podrían ser cifrados por ransomware? | P12 ≠ "Sí" o P19 ≠ "Sí" | 1 |
| PV-04 | ¿Existe un ambiente de DR separado? | Dim Plan es rojo o gris | 2 |
| PV-05 | ¿Cuántas personas pueden ejecutar el plan de recuperación? | P16 ≠ "Sí" | 2 |
| PV-06 | ¿Se ha validado que el RTO declarado es alcanzable con la infraestructura actual? | P04 = "Sí" y Dim Restauraciones ≠ verde | 2 |
| PV-07 | ¿La frecuencia de respaldos es coherente con el RPO declarado? | P06 = "Sí" y P09 respuesta disponible | 2 |
| PV-08 | ¿Qué proveedores externos son single point of failure? | P15 ≠ "Sí" | 3 |
| PV-09 | ¿Existe un runbook paso a paso para los primeros 30 minutos de un incidente? | P01 = "Parcial" o Dim Responsables ≠ verde | 3 |
| PV-10 | ¿Se puede restaurar sin acceso al Active Directory / identidad central? | P20 ≠ "Sí" | 3 |
| PV-11 | ¿Hay evidencia documental de las pruebas de restauración? | P14 = "No" o P14 = null | 3 |
| PV-12 | ¿Qué porcentaje de los sistemas críticos tiene respaldo verificado? | P10 ≠ "Sí" | 3 |
| PV-13 | ¿El plan DRP contempla escenarios de pérdida total del sitio principal? | P01 = "Sí" y P11 ≠ "Sí" | 4 |
| PV-14 | ¿Hay acuerdos de nivel de servicio con proveedores para tiempos de respuesta en crisis? | P15 = "Parcial" | 4 |
| PV-15 | ¿Se ha considerado un seguro de ciber-riesgo? | Dim Ransomware es rojo | 4 |

### Algoritmo de selección (determinista)

```
1. Filtrar preguntas cuya condición de activación se cumple.
2. Ordenar por prioridad (1 = más alta).
3. Dentro de la misma prioridad, ordenar por ID (PV-01 antes que PV-02).
4. Seleccionar las primeras 5.
5. Si hay menos de 5 activadas, completar con las de siguiente prioridad.
6. Si aún no hay 5, usar un set fijo de fallback: PV-01, PV-02, PV-03, PV-05, PV-10.
```

Este algoritmo produce siempre el mismo resultado para las mismas respuestas.
No hay IA ni generación libre.

---

## 8. Explicabilidad

Cada dimensión en el resultado muestra:

```
┌─────────────────────────────────────────────────────┐
│ Dimensión: Respaldos                                │
│ Clasificación: 🟡 Amarillo (score: 0.55)            │
│ Confianza: Completa (4/4 preguntas respondidas)     │
│                                                     │
│ Hallazgos:                                          │
│  • P08: "Sí" (1.0) — Se realizan respaldos.        │
│  • P09: "Semanal" (0.7) — Frecuencia semanal.      │
│  • P10: "No se verifican" (0.0) — Los respaldos    │
│    no se verifican regularmente.                    │
│  • P11: "Parcialmente" (0.5) — No todos los        │
│    respaldos están en ubicación separada.           │
│                                                     │
│ ¿Por qué amarillo?                                  │
│  Score 0.55 está entre 0.40 y 0.75. Los respaldos  │
│  existen con frecuencia razonable, pero no se       │
│  verifican y su aislamiento es parcial.             │
└─────────────────────────────────────────────────────┘
```

Los colores siempre van acompañados de:
- Texto descriptivo ("Verde", "Amarillo", "Rojo", "Sin información").
- Ícono/símbolo (🟢, 🟡, 🔴, ⚪ o equivalente accesible).
- Nunca se depende únicamente del color.

---

## 9. Resultado verde: qué significa y qué NO

### Texto en pantalla para resultado verde:
> "Las respuestas indican bases razonables en las áreas evaluadas. Esto no
> equivale a una certificación, garantía de recuperación ni aprobación técnica.
> Se recomienda validación por el equipo de preventa."

### NO significa:
- No es una certificación de preparación.
- No garantiza que el plan funcione.
- No sustituye pruebas técnicas.
- No valida la calidad de la implementación.
- No es una promesa de recuperación.

---

## 10. Configuración y versionado

```javascript
// scoring-config.js (estructura esperada)
export const scoringConfig = {
  version: "2.0.0",
  tool: "drp-readiness",
  thresholds: {
    green: 0.75,
    yellow: 0.40
  },
  dimensions: [ /* ... */ ],
  overrides: [ /* ... */ ],
  preventaQuestions: [ /* ... */ ]
};
```

- Cada cambio a umbrales, pesos u overrides incrementa la versión.
- El resumen imprimible incluye: versión herramienta + versión scoring config.
- Changelog al final de este archivo.

---

## Changelog

| Versión | Fecha | Cambio |
|---------|-------|--------|
| 1.0.0-draft | 2026-08-21 | Versión inicial |
| 2.0.0-draft | 2026-08-21 | Separar RTO/RPO, desglosar respaldos, reestructurar ransomware, agregar indicador de confianza, overrides, preguntas dinámicas para preventa, justificación de pesos |
