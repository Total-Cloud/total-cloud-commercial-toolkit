# Escenarios de prueba — DRP Readiness v2

Versión: 2.0.0-draft
Todos los datos son sintéticos. No representan clientes reales.

---

## Escenario 1: Ambiente maduro

**Contexto ficticio:** "Manufactura Demo" — 200 empleados, 20 años, ERP y producción 24/7.

### Respuestas

| Pregunta | Respuesta | Valor | Omitida |
|----------|-----------|-------|---------|
| P01 | Sí | 1.0 | — |
| P02 | Sí, últimos 12 meses | 1.0 | — |
| P03 | Sí, accesible y conocido | 1.0 | — |
| P04 | Sí, definido y documentado | 1.0 | — |
| P05 | (RTO: 1–4h) | info | — |
| P06 | Sí, definido y documentado | 1.0 | — |
| P07 | (RPO: < 1h) | info | — |
| P08 | Sí | 1.0 | — |
| P09 | Diario o más frecuente | 1.0 | — |
| P10 | Sí, se verifican regularmente | 1.0 | — |
| P11 | Sí, ubicación separada | 1.0 | — |
| P12 | Sí, inmutables o aislados | 1.0 | — |
| P13 | Sí, últimos 12 meses | 1.0 | — |
| P14 | Sí, con detalle | 1.0 | — |
| P15 | Sí, inventario completo | 1.0 | — |
| P16 | Sí, roles definidos | 1.0 | — |
| P17 | Sí, documentado | 1.0 | — |
| P18 | Sí, MFA y credenciales separadas | 1.0 | — |
| P19 | Sí | 1.0 | — |
| P20 | Sí, procedimiento alternativo | 1.0 | — |

### Scores por dimensión

| Dimensión | Preguntas | Score | Confianza | Clasificación |
|-----------|-----------|-------|-----------|---------------|
| Plan DRP | P01(1)+P02(1)+P03(1) | 3/3 = 1.00 | 3/3 Completa | 🟢 Verde |
| RTO | P04(1) | 1/1 = 1.00 | 1/1 Completa | 🟢 Verde |
| RPO | P06(1) | 1/1 = 1.00 | 1/1 Completa | 🟢 Verde |
| Respaldos | P08(1)+P09(1)+P10(1)+P11(1)+P12(1) | 5/5 = 1.00 | 5/5 Completa | 🟢 Verde |
| Restauraciones | P13(1)+P14(1) | 2/2 = 1.00 | 2/2 Completa | 🟢 Verde |
| Dependencias/Resp. | P15(1)+P16(1)+P17(1) | 3/3 = 1.00 | 3/3 Completa | 🟢 Verde |
| Ransomware | P18(1)+P19(1)+P20(1) | 3/3 = 1.00 | 3/3 Completa | 🟢 Verde |

### Confianza global
- Dimensiones con dato: 7/7 = 100%
- Preguntas con dato: 18/18 = 100%
- Nivel: **Completa**

### Overrides evaluados
| Override | ¿Aplica? | Razón |
|----------|----------|-------|
| OV-01 | No | 0 dims grises |
| OV-02 | No | 0 dims críticas grises |
| OV-03 | No | P08 = "Sí" |
| OV-04 | No | P13 ≠ "Nunca" |
| OV-05 | No | P04 ≠ "No" |
| OV-06 | No | P06 ≠ "No" |
| OV-07 | No | 0 dims críticas rojas |

### Score global
- Matemático: (1.00×0.10 + 1.00×0.08 + 1.00×0.08 + 1.00×0.22 + 1.00×0.20 + 1.00×0.12 + 1.00×0.20) / 1.00 = **1.00**
- Override: ninguno
- **Clasificación final: 🟢 Verde**

### Hallazgos esperados
- Todas las dimensiones en verde. Bases razonables en todas las áreas.
- Texto: "Esto no equivale a certificación ni garantía de recuperación."

### 5 preguntas para preventa (dinámicas)
Ninguna condición de alta prioridad se activa. Se usa el fallback:
1. PV-01: ¿Cuál es el RTO real medido en la última prueba?
2. PV-02: ¿Qué sistemas no están cubiertos por los respaldos?
3. PV-03: ¿Los respaldos son inmutables o podrían ser cifrados?
4. PV-05: ¿Cuántas personas pueden ejecutar el plan?
5. PV-10: ¿Se puede restaurar sin acceso al AD?

*Nota: PV-03 se activa porque la condición verifica P12 ≠ "Sí" OR P19 ≠ "Sí"; en este caso ambos son "Sí" por lo que PV-03 NO se activa. Corrección: se usa fallback puro.*

**Corrección del algoritmo para este caso:** cuando el filtro produce < 5 preguntas activadas, se completa con el set de fallback en orden. En un ambiente 100% verde, el fallback completo es: PV-01, PV-02, PV-03, PV-05, PV-10.

---

## Escenario 2: Parcialmente preparado

**Contexto ficticio:** "Logística Beta" — 120 empleados, 15 años, transporte.

### Respuestas

| Pregunta | Respuesta | Valor | Omitida |
|----------|-----------|-------|---------|
| P01 | Sí | 1.0 | — |
| P02 | Se revisó hace 12–24 meses | 0.5 | — |
| P03 | Solo algunas personas | 0.5 | — |
| P04 | Idea general, no documentado | 0.5 | — |
| P05 | — | — | Skip (P04 = Parcial, no "No") → aparece. RTO: 4–12h | info |
| P06 | Idea general, no documentado | 0.5 | — |
| P07 | — | — | RPO: 12–24h | info |
| P08 | Sí | 1.0 | — |
| P09 | Semanal | 0.7 | — |
| P10 | Se verifican ocasionalmente | 0.5 | — |
| P11 | Parcialmente | 0.5 | — |
| P12 | Credenciales separadas sin MFA (nota: esto es P12 de la dim Respaldos, pregunta de inmutabilidad) | 0.5 | — |
| P13 | Prueba parcial | 0.5 | — |
| P14 | Algo básico | 0.5 | — |
| P15 | Parcialmente | 0.5 | — |
| P16 | Informalmente | 0.5 | — |
| P17 | Sobre la marcha | 0.5 | — |
| P18 | Credenciales separadas sin MFA | 0.5 | — |
| P19 | No estamos seguros | 0.5 | — |
| P20 | No estamos seguros | 0.5 | — |

### Scores por dimensión

| Dimensión | Cálculo | Score | Confianza | Clasificación |
|-----------|---------|-------|-----------|---------------|
| Plan DRP | (1.0+0.5+0.5)/3 | 0.667 | 3/3 Completa | 🟡 Amarillo |
| RTO | 0.5/1 | 0.50 | 1/1 Completa | 🟡 Amarillo |
| RPO | 0.5/1 | 0.50 | 1/1 Completa | 🟡 Amarillo |
| Respaldos | (1.0+0.7+0.5+0.5+0.5)/5 | 0.64 | 5/5 Completa | 🟡 Amarillo |
| Restauraciones | (0.5+0.5)/2 | 0.50 | 2/2 Completa | 🟡 Amarillo |
| Dependencias/Resp. | (0.5+0.5+0.5)/3 | 0.50 | 3/3 Completa | 🟡 Amarillo |
| Ransomware | (0.5+0.5+0.5)/3 | 0.50 | 3/3 Completa | 🟡 Amarillo |

### Confianza global
- Dimensiones con dato: 7/7 = 100%
- Preguntas con dato: 18/18 = 100%
- Nivel: **Completa**

### Overrides evaluados
| Override | ¿Aplica? | Razón |
|----------|----------|-------|
| OV-01 | No | 0 dims grises |
| OV-02 | No | 0 dims críticas grises |
| OV-03 | No | P08 = "Sí" |
| OV-04 | No | P13 ≠ "Nunca" |
| OV-05 | No | P04 ≠ "No" |
| OV-06 | No | P06 ≠ "No" |
| OV-07 | No | 0 dims críticas rojas |

### Score global
- Matemático: (0.667×0.10 + 0.50×0.08 + 0.50×0.08 + 0.64×0.22 + 0.50×0.20 + 0.50×0.12 + 0.50×0.20) / 1.00
- = 0.0667 + 0.04 + 0.04 + 0.1408 + 0.10 + 0.06 + 0.10 = **0.5475**
- Override: ninguno
- **Clasificación final: 🟡 Amarillo**

### Hallazgos esperados
- Todas las dimensiones en amarillo. Hay bases pero todo es parcial o informal.
- Texto: "Brechas en varias áreas que ameritan revisión y formalización."

### 5 preguntas para preventa
Condiciones activadas (prioridad 1): PV-01 (Restauraciones ≠ verde), PV-03 (P12 ≠ "Sí" y P19 ≠ "Sí").
Condiciones activadas (prioridad 2): PV-04 (Plan no verde... plan es amarillo → no, PV-04 se activa solo si Plan es rojo o gris). PV-05 (P16 ≠ "Sí" → sí). PV-06 (P04="Parcial" ≠ "Sí" → no, PV-06 requiere P04="Sí"). PV-07 (P06="Parcial" ≠ "Sí" → no).
Condiciones activadas (prioridad 3): PV-08 (P15 ≠ "Sí"), PV-09 (Responsables ≠ verde), PV-10 (P20 ≠ "Sí"), PV-11 (P14 ≠ "Sí"... P14 = "Algo básico" = 0.5 ≠ "Sí"), PV-12 (P10 ≠ "Sí").

Ordenados: PV-01, PV-03, PV-05, PV-08, PV-09.
**Resultado:** 
1. PV-01: ¿Cuál es el RTO real medido?
2. PV-03: ¿Los respaldos son inmutables o podrían ser cifrados?
3. PV-05: ¿Cuántas personas pueden ejecutar el plan?
4. PV-08: ¿Qué proveedores externos son single point of failure?
5. PV-09: ¿Existe un runbook para los primeros 30 minutos?

---

## Escenario 3: Sin respaldos

**Contexto ficticio:** "Gasolinera Demo" — 60 empleados, POS y control de combustible.

### Respuestas

| Pregunta | Respuesta | Valor | Omitida |
|----------|-----------|-------|---------|
| P01 | No | 0.0 | — |
| P02 | — | — | Skip (P01="No") |
| P03 | — | — | Skip (P01="No") |
| P04 | No | 0.0 | — |
| P05 | — | — | Skip (P04="No") |
| P06 | No | 0.0 | — |
| P07 | — | — | Skip (P06="No") |
| P08 | No | 0.0 | — |
| P09 | — | — | Skip (P08="No") |
| P10 | — | — | Skip (P08="No") |
| P11 | — | — | Skip (P08="No") |
| P12 | — | — | Skip (P08="No") |
| P13 | Nunca se ha probado | 0.0 | — |
| P14 | — | — | Skip (P13="Nunca") |
| P15 | No | 0.0 | — |
| P16 | No | 0.0 | — |
| P17 | No | 0.0 | — |
| P18 | Mismas credenciales | 0.0 | — |
| P19 | No | 0.0 | — |
| P20 | Dependemos completamente | 0.0 | — |

### Scores por dimensión

| Dimensión | Cálculo | Score | Confianza | Clasificación |
|-----------|---------|-------|-----------|---------------|
| Plan DRP | 0.0/1 (solo P01) | 0.00 | 1/1 Completa | 🔴 Rojo |
| RTO | 0.0/1 | 0.00 | 1/1 Completa | 🔴 Rojo |
| RPO | 0.0/1 | 0.00 | 1/1 Completa | 🔴 Rojo |
| Respaldos | 0.0/1 (solo P08) | 0.00 | 1/1 Completa | 🔴 Rojo |
| Restauraciones | 0.0/1 (solo P13) | 0.00 | 1/1 Completa | 🔴 Rojo |
| Dependencias/Resp. | (0+0+0)/3 | 0.00 | 3/3 Completa | 🔴 Rojo |
| Ransomware | (0+0+0)/3 | 0.00 | 3/3 Completa | 🔴 Rojo |

### Confianza global
- Dimensiones con dato: 7/7 = 100%
- Nivel: **Completa**

### Overrides evaluados
| Override | ¿Aplica? |
|----------|----------|
| OV-01 | No (0 grises) |
| OV-03 | **Sí** → Global = ROJO |
| OV-07 | **Sí** (7 dims críticas rojas ≥ 2) → Global = ROJO |

### Score global
- Matemático: 0.00
- Override: OV-03 (sin respaldos) + OV-07 (≥2 críticas rojas) → **ROJO**
- **Clasificación final: 🔴 Rojo**

### Hallazgos esperados
- "Sin respaldos, la recuperación ante un desastre no es viable."
- "Todas las áreas evaluadas presentan riesgo. Se requiere atención integral."
- Hallazgo ransomware destacado: "Sin controles ni copias aisladas ante ransomware."

### 5 preguntas para preventa
Todas las condiciones de prioridad 1 activadas: PV-01, PV-02 (P08="Parcial"? No, P08="No" → PV-02 condición es "Dim Respaldos amarillo o P08=Parcial" → NO aplica). PV-03 (P12 no existe → skip, P19="No" ≠ "Sí" → Sí aplica).
Prioridad 2: PV-04 (Plan rojo → sí), PV-05 (P16="No" ≠ "Sí" → sí), PV-06 (P04="No" ≠ "Sí" → no, PV-06 requiere P04="Sí"), PV-07 no.
Prioridad 3: PV-08 (P15="No" ≠ "Sí"), PV-09, PV-10, PV-11, PV-12.

**Resultado:**
1. PV-01: ¿Cuál es el RTO real medido?
2. PV-03: ¿Los respaldos son inmutables o podrían ser cifrados?
3. PV-04: ¿Existe un ambiente de DR separado?
4. PV-05: ¿Cuántas personas pueden ejecutar el plan?
5. PV-08: ¿Qué proveedores son single point of failure?

---

## Escenario 4: Respaldos existen pero nunca restaurados

**Contexto ficticio:** "Financiera Ejemplo" — 90 empleados, seguros y cobranza.

### Respuestas

| Pregunta | Respuesta | Valor | Omitida |
|----------|-----------|-------|---------|
| P01 | Sí | 1.0 | — |
| P02 | Sí, últimos 12 meses | 1.0 | — |
| P03 | Sí, accesible | 1.0 | — |
| P04 | Sí, definido | 1.0 | — |
| P05 | RTO: 1–4h | info | — |
| P06 | Sí, definido | 1.0 | — |
| P07 | RPO: 4–12h | info | — |
| P08 | Sí | 1.0 | — |
| P09 | Diario | 1.0 | — |
| P10 | Se verifican ocasionalmente | 0.5 | — |
| P11 | Sí, ubicación separada | 1.0 | — |
| P12 | Credenciales separadas sin MFA | 0.5 | — |
| P13 | **Nunca se ha probado** | 0.0 | — |
| P14 | — | — | Skip (P13="Nunca") |
| P15 | Sí, inventario completo | 1.0 | — |
| P16 | Sí, roles definidos | 1.0 | — |
| P17 | Sí, documentado | 1.0 | — |
| P18 | Sí, MFA y separadas | 1.0 | — |
| P19 | Sí | 1.0 | — |
| P20 | Sí, procedimiento alternativo | 1.0 | — |

### Scores por dimensión

| Dimensión | Cálculo | Score | Confianza | Clasificación |
|-----------|---------|-------|-----------|---------------|
| Plan DRP | (1+1+1)/3 | 1.00 | Completa | 🟢 Verde |
| RTO | 1/1 | 1.00 | Completa | 🟢 Verde |
| RPO | 1/1 | 1.00 | Completa | 🟢 Verde |
| Respaldos | (1+1+0.5+1+0.5)/5 | 0.80 | Completa | 🟢 Verde |
| Restauraciones | 0.0/1 (solo P13) | 0.00 | Completa | 🔴 Rojo |
| Dependencias/Resp. | (1+1+1)/3 | 1.00 | Completa | 🟢 Verde |
| Ransomware | (1+1+1)/3 | 1.00 | Completa | 🟢 Verde |

### Confianza global
- 7/7 dimensiones con dato = **Completa**

### Overrides evaluados
| Override | ¿Aplica? |
|----------|----------|
| OV-03 | No |
| OV-04 | **Sí** → Global NO puede ser VERDE |
| OV-07 | No (solo 1 dim crítica roja) |

### Score global
- Matemático: (1.00×0.10 + 1.00×0.08 + 1.00×0.08 + 0.80×0.22 + 0.00×0.20 + 1.00×0.12 + 1.00×0.20) / 1.00
- = 0.10 + 0.08 + 0.08 + 0.176 + 0.00 + 0.12 + 0.20 = **0.756**
- Clasificación matemática: 🟢 Verde (≥0.75)
- Override OV-04: "Sin pruebas de restauración" → degradar a máximo AMARILLO
- **Clasificación final: 🟡 Amarillo (provisional por OV-04)**
- Texto: "El score sugiere bases razonables, pero sin pruebas de restauración la capacidad de recuperación es incierta."

### Hallazgos esperados
- Restauraciones en ROJO: "Nunca se ha probado una restauración completa."
- Override visible: "Este resultado no puede ser verde porque no se ha probado la restauración."
- Las demás dimensiones se muestran normalmente (no se ocultan).

### 5 preguntas para preventa
Prioridad 1: PV-01 (Restauraciones ≠ verde → sí), PV-03 (P12≠"Sí" → 0.5 → sí, P19="Sí" → condición es OR → sí por P12).
Prioridad 2: PV-06 (P04="Sí" y Restauraciones ≠ verde → sí).
Prioridad 3: PV-11 (P14 skip → null → sí), PV-12 (P10≠"Sí" → 0.5 → sí).

**Resultado:**
1. PV-01: ¿Cuál es el RTO real medido?
2. PV-03: ¿Los respaldos son inmutables o podrían ser cifrados?
3. PV-06: ¿Se ha validado que el RTO declarado es alcanzable?
4. PV-11: ¿Hay evidencia documental de pruebas de restauración?
5. PV-12: ¿Qué porcentaje de sistemas tiene respaldo verificado?

---

## Escenario 5: RTO/RPO no definidos

**Contexto ficticio:** "Retail Gamma" — 150 empleados, punto de venta regional.

### Respuestas

| Pregunta | Respuesta | Valor | Omitida |
|----------|-----------|-------|---------|
| P01 | Parcial | 0.5 | — |
| P02 | No, más de 24 meses | 0.0 | — |
| P03 | Solo algunas personas | 0.5 | — |
| P04 | **No está definido** | 0.0 | — |
| P05 | — | — | Skip (P04="No") |
| P06 | **No está definido** | 0.0 | — |
| P07 | — | — | Skip (P06="No") |
| P08 | Sí | 1.0 | — |
| P09 | Semanal | 0.7 | — |
| P10 | Sí, se verifican | 1.0 | — |
| P11 | Sí, separada | 1.0 | — |
| P12 | Sí, inmutables | 1.0 | — |
| P13 | Sí, últimos 12 meses | 1.0 | — |
| P14 | Algo básico | 0.5 | — |
| P15 | Parcialmente | 0.5 | — |
| P16 | Informalmente | 0.5 | — |
| P17 | Sobre la marcha | 0.5 | — |
| P18 | Sí, MFA y separadas | 1.0 | — |
| P19 | Sí | 1.0 | — |
| P20 | No estamos seguros | 0.5 | — |

### Scores por dimensión

| Dimensión | Cálculo | Score | Confianza | Clasificación |
|-----------|---------|-------|-----------|---------------|
| Plan DRP | (0.5+0.0+0.5)/3 | 0.333 | Completa | 🔴 Rojo |
| RTO | 0.0/1 | 0.00 | Completa | 🔴 Rojo |
| RPO | 0.0/1 | 0.00 | Completa | 🔴 Rojo |
| Respaldos | (1+0.7+1+1+1)/5 | 0.94 | Completa | 🟢 Verde |
| Restauraciones | (1+0.5)/2 | 0.75 | Completa | 🟢 Verde |
| Dependencias/Resp. | (0.5+0.5+0.5)/3 | 0.50 | Completa | 🟡 Amarillo |
| Ransomware | (1+1+0.5)/3 | 0.833 | Completa | 🟢 Verde |

### Confianza global
- 7/7 = **Completa**

### Overrides evaluados
| Override | ¿Aplica? |
|----------|----------|
| OV-05 | **Sí** (P04="No") → No puede ser verde |
| OV-06 | **Sí** (P06="No") → No puede ser verde |
| OV-07 | **Sí** (RTO rojo + RPO rojo = 2 dims críticas rojas) → **ROJO** |

### Score global
- Matemático: (0.333×0.10 + 0.00×0.08 + 0.00×0.08 + 0.94×0.22 + 0.75×0.20 + 0.50×0.12 + 0.833×0.20) / 1.00
- = 0.0333 + 0 + 0 + 0.2068 + 0.15 + 0.06 + 0.1666 = **0.6167**
- Clasificación matemática: 🟡 Amarillo
- Override OV-07: 2 dims críticas (RTO, RPO) rojas → **ROJO**
- **Clasificación final: 🔴 Rojo**
- Texto: "Dos o más áreas críticas presentan riesgo. Sin RTO ni RPO definidos, no se puede dimensionar una solución."

### Hallazgos esperados
- Plan DRP rojo: desactualizado y con accesibilidad limitada.
- RTO rojo: no definido.
- RPO rojo: no definido.
- Respaldos verde: buen estado técnico.
- Override explícito: "El score matemático (0.62) sería amarillo, pero 2+ dimensiones críticas en rojo fuerzan clasificación roja."

### 5 preguntas para preventa
Prioridad 1: PV-01 (Restauraciones verde → no). PV-03 (P12="Sí" y P19="Sí" → no).
Prioridad 2: PV-04 (Plan rojo → sí). PV-05 (P16≠"Sí" → sí). PV-06 (P04≠"Sí" → no, requiere P04="Sí"). PV-07 (P06≠"Sí" → no).
Prioridad 3: PV-08 (P15≠"Sí" → sí). PV-09 (Responsables ≠ verde → sí). PV-10 (P20≠"Sí" → sí).

**Resultado:**
1. PV-04: ¿Existe un ambiente de DR separado?
2. PV-05: ¿Cuántas personas pueden ejecutar el plan?
3. PV-08: ¿Qué proveedores son single point of failure?
4. PV-09: ¿Existe un runbook para los primeros 30 minutos?
5. PV-10: ¿Se puede restaurar sin acceso al AD?

---

## Escenario 6: Protección frente a ransomware desconocida

**Contexto ficticio:** "Transporte Delta" — 75 empleados, flota y logística.

### Respuestas

| Pregunta | Respuesta | Valor | Omitida |
|----------|-----------|-------|---------|
| P01 | Sí | 1.0 | — |
| P02 | Sí | 1.0 | — |
| P03 | Sí | 1.0 | — |
| P04 | Sí | 1.0 | — |
| P05 | RTO: 4–12h | info | — |
| P06 | Sí | 1.0 | — |
| P07 | RPO: 4–12h | info | — |
| P08 | Sí | 1.0 | — |
| P09 | Diario | 1.0 | — |
| P10 | Sí | 1.0 | — |
| P11 | Sí | 1.0 | — |
| P12 | **No sé** | null | — |
| P13 | Sí, últimos 12 meses | 1.0 | — |
| P14 | Sí, con detalle | 1.0 | — |
| P15 | Sí | 1.0 | — |
| P16 | Sí | 1.0 | — |
| P17 | Sí | 1.0 | — |
| P18 | **No sé** | null | — |
| P19 | **No sé** | null | — |
| P20 | **No sé** | null | — |

### Scores por dimensión

| Dimensión | Cálculo | Score | Confianza | Clasificación |
|-----------|---------|-------|-----------|---------------|
| Plan DRP | (1+1+1)/3 | 1.00 | 3/3 Completa | 🟢 Verde |
| RTO | 1/1 | 1.00 | 1/1 Completa | 🟢 Verde |
| RPO | 1/1 | 1.00 | 1/1 Completa | 🟢 Verde |
| Respaldos | (1+1+1+1)/4 (P12=null excluida) | 1.00 | 4/5 Parcial | 🟢 Verde |
| Restauraciones | (1+1)/2 | 1.00 | 2/2 Completa | 🟢 Verde |
| Dependencias/Resp. | (1+1+1)/3 | 1.00 | 3/3 Completa | 🟢 Verde |
| Ransomware | null (P18, P19, P20 todas null) | null | 0/3 Sin info | ⚪ Gris |

### Confianza global
- Dimensiones con dato: 6/7 = 86%
- Preguntas con dato: 14/18 = 78%
- Nivel: **Parcial** (falta una dimensión crítica completa)

### Overrides evaluados
| Override | ¿Aplica? |
|----------|----------|
| OV-01 | No (solo 1 de 7 gris = 14%) |
| OV-02 | **Sí** (Ransomware es dim crítica y es gris) → No puede ser verde, marca PROVISIONAL |
| OV-07 | No (0 rojas) |

### Score global
- Peso efectivo: 1.00 - 0.20 (ransomware excluido) = 0.80
- Matemático: (1.00×0.10 + 1.00×0.08 + 1.00×0.08 + 1.00×0.22 + 1.00×0.20 + 1.00×0.12) / 0.80
- = 0.80 / 0.80 = **1.00**
- Clasificación matemática: 🟢 Verde
- Override OV-02: dim crítica (Ransomware) gris → **No puede ser verde → AMARILLO PROVISIONAL**
- **Clasificación final: 🟡 Amarillo (PROVISIONAL)**
- Texto: "El resultado es provisional. Faltan datos en áreas críticas: Protección contra ransomware."

### Hallazgos esperados
- 6 dimensiones verdes, 1 gris (ransomware).
- "La protección contra ransomware no pudo evaluarse. Preventa debe investigar."
- Override visible: "No se puede clasificar como verde sin evaluar la postura ante ransomware."

### 5 preguntas para preventa
Prioridad 1: PV-03 (P12=null ≠ "Sí" OR P19=null ≠ "Sí" → sí).
Prioridad 3: PV-10 (P20=null ≠ "Sí" → sí).
Prioridad 4: PV-15 (Ransomware rojo → no, es gris → no se activa con condición "rojo").

Fallback completa hasta 5: PV-03, PV-10, luego fallback: PV-01, PV-02, PV-05.

**Resultado:**
1. PV-03: ¿Los respaldos son inmutables o podrían ser cifrados?
2. PV-10: ¿Se puede restaurar sin acceso al AD?
3. PV-01: ¿Cuál es el RTO real medido? (fallback)
4. PV-02: ¿Qué sistemas no están cubiertos? (fallback)
5. PV-05: ¿Cuántas personas pueden ejecutar el plan? (fallback)

---

## Escenario 7: Mayoría de respuestas "No sé"

**Contexto ficticio:** "Aseguradora Ejemplo" — reunión con director comercial sin conocimiento técnico.

### Respuestas

| Pregunta | Respuesta | Valor | Omitida |
|----------|-----------|-------|---------|
| P01 | No sé | null | — |
| P02 | — | — | Skip (P01 ≠ "No" pero = null → P02 aparece) |
| P02 | No sé | null | — |
| P03 | No sé | null | — |
| P04 | No sé | null | — |
| P05 | — | — | Skip (P04 = null → "No sé" → skip) |
| P06 | No sé | null | — |
| P07 | — | — | Skip (P06 = null → skip) |
| P08 | No sé | null | — |
| P09 | — | — | Skip (P08 = null → tratado como no "No" → aparece? **Decisión: P08="No sé" → las condicionales NO aparecen porque no se confirmó que existan respaldos**) |
| P10–P12 | — | — | Skip (P08 ≠ "Sí" ni "Parcial") |
| P13 | No sé | null | — |
| P14 | — | — | Skip (P13 ≠ respuesta afirmativa) |
| P15 | No sé | null | — |
| P16 | No sé | null | — |
| P17 | No sé | null | — |
| P18 | No sé | null | — |
| P19 | No sé | null | — |
| P20 | No sé | null | — |

**Regla de dependencia para "No sé":** cuando la precondición es "No sé", las preguntas dependientes SÍ aparecen si su condición es "aparece solo si P0X ≠ No". "No sé" ≠ "No", por lo que las condicionales aparecen. **Corrección:**

| P02 | No sé | null | Aparece (P01 ≠ "No") |
| P03 | No sé | null | Aparece (P01 ≠ "No") |
| P09–P12 | No sé | null | Aparecen (P08 ≠ "No") |
| P14 | No sé | null | Aparece (P13 ≠ "Nunca") |

Todas las preguntas aparecen, todas respondidas "No sé".

### Scores por dimensión

| Dimensión | Score | Confianza | Clasificación |
|-----------|-------|-----------|---------------|
| Plan DRP | null | 0/3 Sin info | ⚪ Gris |
| RTO | null | 0/1 Sin info | ⚪ Gris |
| RPO | null | 0/1 Sin info | ⚪ Gris |
| Respaldos | null | 0/5 Sin info | ⚪ Gris |
| Restauraciones | null | 0/2 Sin info | ⚪ Gris |
| Dependencias/Resp. | null | 0/3 Sin info | ⚪ Gris |
| Ransomware | null | 0/3 Sin info | ⚪ Gris |

### Confianza global
- 0/7 dimensiones con dato = **Sin información**

### Overrides
| Override | ¿Aplica? |
|----------|----------|
| OV-01 | **Sí** (7/7 = 100% grises > 50%) → Global = GRIS |

### Score global
- Matemático: null
- Override: OV-01 → **GRIS**
- **Clasificación final: ⚪ Gris**
- Texto: "La información recopilada es insuficiente para un diagnóstico significativo. Se recomienda programar una sesión con el equipo técnico."

### 5 preguntas para preventa
Ninguna condición específica se activa (todas requieren que algo sea ≠ "Sí" en una pregunta con dato, pero todas son null). Se usa fallback completo:
1. PV-01, 2. PV-02, 3. PV-03, 4. PV-05, 5. PV-10.

---

## Escenario 8: Mixto de demostración (verde + amarillo + rojo + gris)

**Contexto ficticio:** "Distribuidora Ejemplo" — para uso en demos internas.
Diseñado para mostrar los 4 estados del semáforo.

### Respuestas

| Pregunta | Respuesta | Valor | Omitida |
|----------|-----------|-------|---------|
| P01 | Sí | 1.0 | — |
| P02 | Sí, últimos 12 meses | 1.0 | — |
| P03 | Sí, accesible | 1.0 | — |
| P04 | Sí, definido | 1.0 | — |
| P05 | RTO: 1–4h | info | — |
| P06 | Sí, definido | 1.0 | — |
| P07 | RPO: 4–12h | info | — |
| P08 | Sí | 1.0 | — |
| P09 | Semanal | 0.7 | — |
| P10 | Ocasionalmente | 0.5 | — |
| P11 | Parcialmente | 0.5 | — |
| P12 | No, atacante podría borrarlos | 0.0 | — |
| P13 | Nunca se ha probado | 0.0 | — |
| P14 | — | — | Skip (P13="Nunca") |
| P15 | No sé | null | — |
| P16 | No sé | null | — |
| P17 | No sé | null | — |
| P18 | Mismas credenciales | 0.0 | — |
| P19 | No | 0.0 | — |
| P20 | No estamos seguros | 0.5 | — |

### Scores por dimensión

| Dimensión | Cálculo | Score | Confianza | Clasificación |
|-----------|---------|-------|-----------|---------------|
| Plan DRP | (1+1+1)/3 | 1.00 | 3/3 Completa | 🟢 Verde |
| RTO | 1/1 | 1.00 | 1/1 Completa | 🟢 Verde |
| RPO | 1/1 | 1.00 | 1/1 Completa | 🟢 Verde |
| Respaldos | (1+0.7+0.5+0.5+0.0)/5 | 0.54 | 5/5 Completa | 🟡 Amarillo |
| Restauraciones | 0.0/1 | 0.00 | 1/1 Completa | 🔴 Rojo |
| Dependencias/Resp. | null (3/3 null) | null | 0/3 Sin info | ⚪ Gris |
| Ransomware | (0+0+0.5)/3 | 0.167 | 3/3 Completa | 🔴 Rojo |

### Los 4 estados visibles:
- 🟢 Verde: Plan DRP, RTO, RPO
- 🟡 Amarillo: Respaldos
- 🔴 Rojo: Restauraciones, Ransomware
- ⚪ Gris: Dependencias/Responsables

### Confianza global
- Dimensiones con dato: 6/7 = 86%
- Preguntas con dato: 15/18 = 83%
- Nivel: **Parcial**

### Overrides evaluados
| Override | ¿Aplica? |
|----------|----------|
| OV-01 | No (1/7 = 14%) |
| OV-02 | **Sí** (Dependencias no es crítica... es No. Solo RTO/RPO/Respaldos/Restauraciones/Ransomware son críticas). → No aplica. |
| OV-03 | No (P08="Sí") |
| OV-04 | **Sí** (P13="Nunca") → No puede ser verde |
| OV-07 | **Sí** (Restauraciones roja + Ransomware roja = 2 dims críticas rojas) → **ROJO** |

### Score global
- Peso efectivo: 1.00 - 0.12 (Dep/Resp gris, no crítica) = 0.88
- Matemático: (1.00×0.10 + 1.00×0.08 + 1.00×0.08 + 0.54×0.22 + 0.00×0.20 + 0.167×0.20) / 0.88
- = (0.10 + 0.08 + 0.08 + 0.1188 + 0.00 + 0.0334) / 0.88
- = 0.4122 / 0.88 = **0.4684**
- Clasificación matemática: 🟡 Amarillo
- Override OV-07: 2 dims críticas rojas → **ROJO**
- **Clasificación final: 🔴 Rojo**
- Texto override: "Score matemático 0.47 (amarillo), pero 2 áreas críticas en rojo fuerzan clasificación roja."

### Hallazgos esperados
- Plan/RTO/RPO verdes: buen nivel estratégico.
- Respaldos amarillo: existen pero falta verificación e inmutabilidad.
- Restauraciones rojo: nunca se ha probado.
- Ransomware rojo: sin controles efectivos.
- Dependencias gris: falta información.
- "Los respaldos no son inmutables y nunca se han probado restauraciones; ante ransomware, la capacidad real de recuperación es desconocida."

### 5 preguntas para preventa
Prioridad 1: PV-01 (Restauraciones ≠ verde → sí), PV-02 (Respaldos amarillo → sí), PV-03 (P12=0 ≠ "Sí" → sí).
Prioridad 2: PV-05 (P16=null... la condición es P16 ≠ "Sí" → null ≠ "Sí" → sí).
Prioridad 3: PV-10 (P20≠"Sí" → sí).

**Resultado:**
1. PV-01: ¿Cuál es el RTO real medido?
2. PV-02: ¿Qué sistemas no están cubiertos por los respaldos?
3. PV-03: ¿Los respaldos son inmutables o podrían ser cifrados?
4. PV-05: ¿Cuántas personas pueden ejecutar el plan?
5. PV-10: ¿Se puede restaurar sin acceso al AD?

---

## Escenario 9: Una dimensión crítica roja, las demás verdes

**Contexto ficticio:** "Manufactura Épsilon" — todo bien excepto ransomware.

### Respuestas

| Pregunta | Respuesta | Valor | Omitida |
|----------|-----------|-------|---------|
| P01 | Sí | 1.0 | — |
| P02 | Sí | 1.0 | — |
| P03 | Sí | 1.0 | — |
| P04 | Sí | 1.0 | — |
| P05 | RTO: < 1h | info | — |
| P06 | Sí | 1.0 | — |
| P07 | RPO: < 1h | info | — |
| P08 | Sí | 1.0 | — |
| P09 | Diario | 1.0 | — |
| P10 | Sí | 1.0 | — |
| P11 | Sí | 1.0 | — |
| P12 | Sí, inmutables | 1.0 | — |
| P13 | Sí, últimos 12 meses | 1.0 | — |
| P14 | Sí, con detalle | 1.0 | — |
| P15 | Sí | 1.0 | — |
| P16 | Sí | 1.0 | — |
| P17 | Sí | 1.0 | — |
| P18 | Mismas credenciales | **0.0** | — |
| P19 | No | **0.0** | — |
| P20 | Dependemos completamente | **0.0** | — |

### Scores por dimensión

| Dimensión | Score | Confianza | Clasificación |
|-----------|-------|-----------|---------------|
| Plan DRP | 1.00 | Completa | 🟢 Verde |
| RTO | 1.00 | Completa | 🟢 Verde |
| RPO | 1.00 | Completa | 🟢 Verde |
| Respaldos | 1.00 | Completa | 🟢 Verde |
| Restauraciones | 1.00 | Completa | 🟢 Verde |
| Dependencias/Resp. | 1.00 | Completa | 🟢 Verde |
| Ransomware | (0+0+0)/3 = 0.00 | Completa | 🔴 Rojo |

### Confianza global
- 7/7 = **Completa**

### Overrides
| Override | ¿Aplica? |
|----------|----------|
| OV-07 | No (solo 1 dim crítica roja, necesita ≥ 2) |
| Otros | No |

### Score global
- Matemático: (1×0.10 + 1×0.08 + 1×0.08 + 1×0.22 + 1×0.20 + 1×0.12 + 0×0.20) / 1.00
- = 0.80
- Clasificación matemática: 🟢 Verde
- **No hay override que aplique.** Solo hay 1 dim crítica roja (necesita ≥2 para OV-07).
- Pero... P19="No" y P12="Sí" → PV-03 condición: P12≠"Sí" OR P19≠"Sí" → P19≠"Sí" → PV-03 se activa.

**Problema identificado:** ¿Debería una sola dimensión crítica en ROJO poder dejar el global en verde?

**Evaluación:** Los overrides actuales no fuerzan rojo con solo 1 dimensión roja. El score matemático de 0.80 ≥ 0.75 → verde. Sin embargo, **Ransomware rojo es un hallazgo que se resalta prominentemente.** El resultado verde NO oculta el rojo. El desglose lo muestra con el texto: "Bases razonables en general, pero la postura ante ransomware es de alto riesgo. Un ataque podría anular todas las demás medidas."

- **Clasificación final: 🟢 Verde** (con hallazgo rojo prominente)

### 5 preguntas para preventa
PV-03 (P19≠"Sí" → sí, prioridad 1), PV-10 (P20≠"Sí" → sí, prioridad 3), PV-15 (Ransomware rojo → sí, prioridad 4).
Fallback para completar: PV-01, PV-02.

**Resultado:**
1. PV-03: ¿Los respaldos son inmutables o podrían ser cifrados?
2. PV-10: ¿Se puede restaurar sin acceso al AD?
3. PV-15: ¿Se ha considerado un seguro de ciber-riesgo?
4. PV-01: ¿Cuál es el RTO real medido? (fallback)
5. PV-02: ¿Qué sistemas no están cubiertos? (fallback)

---

## Escenario 10: "No aplica" justificado

**Contexto ficticio:** "Startup SaaS Ejemplo" — 55 empleados, toda su infraestructura es nube pública, no opera servidores físicos.

### Respuestas

| Pregunta | Respuesta | Valor | Omitida |
|----------|-----------|-------|---------|
| P01 | Sí | 1.0 | — |
| P02 | Sí | 1.0 | — |
| P03 | Sí | 1.0 | — |
| P04 | Sí | 1.0 | — |
| P05 | RTO: 1–4h | info | — |
| P06 | Sí | 1.0 | — |
| P07 | RPO: 1–4h | info | — |
| P08 | Sí | 1.0 | — |
| P09 | Diario | 1.0 | — |
| P10 | Sí | 1.0 | — |
| P11 | Sí | 1.0 | — |
| P12 | Sí, inmutables | 1.0 | — |
| P13 | Sí | 1.0 | — |
| P14 | Sí | 1.0 | — |
| P15 | Sí | 1.0 | — |
| P16 | Sí | 1.0 | — |
| P17 | **No aplica** | skip | Justificación: "Producto B2B sin clientes que requieran notificación directa; solo comunicación interna." |
| P18 | Sí, MFA y separadas | 1.0 | — |
| P19 | Sí | 1.0 | — |
| P20 | Sí | 1.0 | — |

### Scores por dimensión

| Dimensión | Cálculo | Score | Confianza | Clasificación |
|-----------|---------|-------|-----------|---------------|
| Plan DRP | (1+1+1)/3 | 1.00 | Completa | 🟢 Verde |
| RTO | 1/1 | 1.00 | Completa | 🟢 Verde |
| RPO | 1/1 | 1.00 | Completa | 🟢 Verde |
| Respaldos | (1+1+1+1+1)/5 | 1.00 | Completa | 🟢 Verde |
| Restauraciones | (1+1)/2 | 1.00 | Completa | 🟢 Verde |
| Dependencias/Resp. | (1+1)/2 (P17=skip) | 1.00 | 2/2* Completa | 🟢 Verde |
| Ransomware | (1+1+1)/3 | 1.00 | Completa | 🟢 Verde |

*P17 con "No aplica" se excluye del conteo. Quedan P15 y P16 con 2 preguntas válidas.*

### Confianza global
- 7/7 = **Completa**
- Nota: P17 marcada como "pendiente de validación por preventa" en el resumen.

### Overrides
- Ninguno aplica.

### Score global
- Matemático: 1.00
- **Clasificación final: 🟢 Verde**
- Nota en resumen: "1 pregunta marcada como 'No aplica' con justificación. Preventa debe validar: '¿Es correcto que no se requiere protocolo de comunicación a clientes?'"

### 5 preguntas para preventa
Ninguna condición prioritaria se activa. Fallback:
1. PV-01, 2. PV-02, 3. PV-03, 4. PV-05, 5. PV-10.

Además, pregunta adicional generada por "No aplica":
- "¿Es correcto que no se requiere protocolo de comunicación externa? Validar con el cliente."

---

## Validaciones de borde (resumen para pruebas unitarias)

| Caso | Resultado esperado |
|------|-------------------|
| Todas "Sí" (18 preguntas) | Global = 1.00, Verde |
| Todas "No" (con skips por dependencia) | Global = 0.00, Rojo + OV-03 + OV-07 |
| Todas "Parcial" | Global ≈ 0.50, Amarillo |
| Todas "No sé" | Global = null, Gris (OV-01) |
| Todas "No aplica" (donde está disponible) | Solo P17 puede ser NA; resto mantiene comportamiento normal |
| Umbral exacto: score = 0.75 | Verde |
| Umbral exacto: score = 0.7499 | Amarillo |
| Umbral exacto: score = 0.40 | Amarillo |
| Umbral exacto: score = 0.3999 | Rojo |
| P08="No" con todo lo demás verde | Global ROJO por OV-03 |
| P13="Nunca" con todo lo demás verde | Global máximo AMARILLO por OV-04 |
| P04="No" + P06="No" con resto verde | ROJO por OV-07 (2 dims críticas) |
| 4+ dims grises (>50%) | GRIS por OV-01 |
| 1 dim crítica gris + resto verde | AMARILLO PROVISIONAL por OV-02 |
| Score matemático alto + override | Mostrar AMBOS: score original y clasificación final con explicación |
