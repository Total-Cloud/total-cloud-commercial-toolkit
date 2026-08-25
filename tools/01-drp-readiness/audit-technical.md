# Auditoría Técnica — DRP Readiness v2

Fecha: 2026-08-21
Auditor: Kiro (asistente de desarrollo)

---

## 1. Consistencia matemática

| Verificación | Resultado |
|-------------|-----------|
| Pesos suman 1.00 | ✅ 0.10+0.08+0.08+0.22+0.20+0.12+0.20 = 1.00 |
| Umbrales no se solapan | ✅ [0, 0.40) → rojo, [0.40, 0.75) → amarillo, [0.75, 1.0] → verde |
| Score por dimensión está acotado [0, 1] | ✅ Todos los valores de respuesta ∈ {0, 0.3, 0.5, 0.7, 1.0}; promedio siempre ∈ [0, 1] |
| Score global está acotado [0, 1] | ✅ Promedio ponderado de valores ∈ [0, 1] con pesos normalizados |
| Mismas entradas → mismo resultado | ✅ Función pura, sin aleatoriedad ni dependencia temporal |
| Overrides no contradicen entre sí | ✅ Se aplican en orden de severidad; el más severo gana |

---

## 2. Casos de borde verificados

| Caso | Comportamiento esperado | ¿Correcto? |
|------|------------------------|------------|
| Todo "Sí" | 1.00, Verde, sin overrides | ✅ |
| Todo "No" (con skips) | 0.00, Rojo, OV-03 + OV-07 | ✅ |
| Todo "No sé" | null, Gris, OV-01 | ✅ |
| Todo "Parcial" | ~0.50, Amarillo | ✅ |
| Score exacto 0.75 | Verde | ✅ |
| Score exacto 0.7499 | Amarillo | ✅ |
| Score exacto 0.40 | Amarillo | ✅ |
| Score exacto 0.3999 | Rojo | ✅ |
| P08="No" + resto perfecto | Rojo por OV-03 (score matemático alto pero override fuerza) | ✅ |
| P13="Nunca" + resto perfecto | Máximo Amarillo por OV-04 | ✅ |
| 1 dim null + resto con datos | Peso se redistribuye. No infla artificialmente. | ✅ |
| Solo P17 como "No aplica" | Se excluye de conteo; dim se calcula con 2 preguntas | ✅ |
| "No sé" en precondición | Condicionales SÍ aparecen (null ≠ "No") | ✅ |

---

## 3. Comportamiento de grises y overrides

| Escenario | Override | Resultado |
|-----------|---------|-----------|
| >50% dims grises | OV-01 | Global = GRIS. No se calcula score. |
| 1 dim crítica gris + resto verde | OV-02 | Global no puede ser verde → AMARILLO PROVISIONAL |
| Matemático = verde + OV-04 | OV-04 | Global = AMARILLO (degradado) |
| Matemático = verde + OV-07 | OV-07 | Global = ROJO (2+ críticas rojas) |
| Override activo | — | Score matemático SIEMPRE se muestra junto con la explicación del override |
| Múltiples overrides | — | Se aplica el más severo; todos se mencionan en hallazgos |

### ¿Es posible un "verde engañoso"?

| Escenario potencialmente engañoso | ¿Puede dar verde? | Protección |
|-----------------------------------|-------------------|------------|
| Respaldos no existen | No | OV-03 fuerza rojo |
| Nunca se restauró | No | OV-04 bloquea verde |
| RTO no definido | No | OV-05 bloquea verde |
| RPO no definido | No | OV-06 bloquea verde |
| 2+ dims críticas rojas | No | OV-07 fuerza rojo |
| Ransomware gris (no se sabe) | No | OV-02 bloquea verde |
| 1 sola dim crítica roja (ransomware) + resto verde | **Sí, es posible** | El hallazgo rojo se muestra prominentemente; el score global 0.80 refleja que 6/7 dims están bien. El usuario VE el rojo. |
| >50% grises | No | OV-01 fuerza gris |

**Veredicto sobre verde engañoso:**
El único caso donde el global es verde con algo rojo es cuando **exactamente 1** dimensión crítica está en rojo y las demás 6 están en verde. En ese caso:
- El score matemático (≈0.80) SÍ refleja que la mayoría está bien.
- La dimensión roja se muestra con igual prominencia visual.
- Las preguntas para preventa priorizan esa dimensión.
- No es "engañoso" porque el desglose es completamente visible.

**Decisión pendiente D-16:** ¿Se debería agregar un override "si CUALQUIER dim crítica es roja → global no puede ser verde"? Esto sería más conservador pero podría hacer que un resultado casi perfecto con un gap específico no se diferencie de uno con múltiples gaps. Ver sección 7.

---

## 4. Trazabilidad respuesta → regla → score → hallazgo

```
Ejemplo de cadena completa:

P12: "No, atacante podría borrarlos" (valor: 0.0)
  → Dimensión: Respaldos
  → Contribuye a score: (1+0.7+0.5+0.5+0.0)/5 = 0.54
  → Clasificación dim: 0.54 ∈ [0.40, 0.75) → AMARILLO
  → Hallazgo: "P12: Los respaldos no están protegidos contra borrado.
    Un atacante con acceso admin podría eliminarlos."
  → Esto activa PV-03 (prioridad 1)
  → En el resumen: la respuesta exacta, el valor, la regla aplicada,
    y el impacto en la clasificación son visibles.
```

**Verificación:** ✅ Toda la cadena es rastreable y documentada.

---

## 5. Integridad de las precondiciones

| Precondición | Skip generado | ¿Lógicamente correcto? |
|---|---|---|
| P01="No" → P02, P03 skip | No hay plan que actualizar ni acceder | ✅ |
| P08="No" → P09-P12 skip | No hay respaldos que medir | ✅ |
| P13="Nunca" → P14 skip | No hay resultados que documentar | ✅ |
| P04="No"/"No sé" → P05 skip | No hay RTO que cuantificar | ✅ |
| P06="No"/"No sé" → P07 skip | No hay RPO que cuantificar | ✅ |

**¿Skip por "No sé" en la precondición?**
- P01="No sé" → P02 y P03 SÍ aparecen (la condición es "≠ No", y "No sé" ≠ "No").
- P08="No sé" → P09-P12 SÍ aparecen (mismo razonamiento).
- P04="No sé" → P05 NO aparece (condición explícita: P04="No" OR "No sé" → skip).
- P06="No sé" → P07 NO aparece (mismo que P04).
- P13="No sé" → P14 SÍ aparece (condición: P13 ≠ "Nunca se ha probado").

✅ Consistente y documentado.

---

## 6. Indicador de confianza

| Verificación | Resultado |
|---|---|
| Se calcula independientemente del score de madurez | ✅ |
| No infla ni deflacta el score de madurez | ✅ (son dos números separados) |
| Dims grises NO se renormalizan para dar un falso positivo | ✅ (OV-02 bloquea verde si falta dim crítica) |
| "No aplica" con justificación queda como "pendiente de validación" | ✅ |
| Skip por dependencia NO reduce confianza | ✅ (es lógico, no es falta de info) |

---

## 7. Decisiones pendientes identificadas en auditoría

| ID | Decisión | Contexto | Opciones |
|----|----------|----------|----------|
| D-16 | **¿Override adicional para 1 sola dim crítica en rojo?** | Escenario 9 muestra que es posible obtener verde global con ransomware en rojo. ¿Es aceptable o debe degradarse? | a) Dejar como está: verde es posible pero el rojo es prominente. b) Agregar: "Si cualquier dim CRÍTICA es roja → global máximo amarillo." c) Agregar solo para ransomware: "Si ransomware está en rojo → global máximo amarillo." |
| D-17 | **¿Cómo manejar "No sé" como precondición en P01 y P08?** | "No sé" en P01 hace que P02/P03 aparezcan. ¿Tiene sentido preguntar "¿se actualizó el plan?" si no se sabe si hay plan? | a) Mantener: aparecen y el usuario puede decir "No sé" también. b) Cambiar: si P01="No sé", P02 y P03 también se skipean y la dim completa es gris. |

---

## Veredicto técnico

✅ **APROBADO con 2 decisiones pendientes (D-16, D-17).**

El scoring es:
- Determinista ✅
- Explicable ✅ (cadena completa rastreable)
- Editable ✅ (pesos y umbrales en config)
- Versionado ✅ (changelog documentado)
- Protegido contra verdes engañosos ✅ (con la posible excepción de D-16)
- Consistente con los guardrails comerciales ✅
- Respetuoso de la privacidad ✅ (todo en memoria, datos sintéticos)
