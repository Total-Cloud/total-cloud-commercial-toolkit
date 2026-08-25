# Requirements — DRP Readiness Assessment

Herramienta piloto del Total Cloud Commercial Toolkit.

## Propósito

Evaluar de forma preliminar qué tan preparada está una organización para
recuperarse ante un desastre de infraestructura tecnológica. El resultado
orienta la conversación comercial y el handoff a preventa; no certifica,
no garantiza ni reemplaza un assessment técnico formal.

## Contexto de uso

- **Quién lo usa:** ejecutivo comercial de Total Cloud en reunión con prospecto.
- **Cuándo:** reunión de diagnóstico inicial (discovery call).
- **Duración:** 10–15 minutos de la reunión dedicados a esta herramienta.
- **Dónde:** laptop + proyector en sala del cliente, o tablet en planta.
- **Conectividad:** posiblemente sin internet (zonas industriales).

## Requisitos funcionales

### DRP-F01 — Flujo guiado por dimensiones
El flujo presenta preguntas agrupadas por dimensión, una pregunta a la vez,
con barra de progreso visible.

### DRP-F02 — Opciones de respuesta estandarizadas
Cada pregunta ofrece exactamente estas opciones (salvo excepciones documentadas):
- **Sí** — existe, está vigente y es verificable.
- **Parcial** — existe pero incompleto, desactualizado o no verificado.
- **No** — no existe.
- **No sé** — el interlocutor no tiene la información.
- **No aplica** — la pregunta no corresponde al contexto del cliente.

### DRP-F03 — Score por dimensión
Cada dimensión produce un score normalizado [0, 1] y una clasificación
de semáforo (verde, amarillo, rojo o gris).

### DRP-F04 — Score global
El resultado global se calcula como promedio ponderado de las dimensiones
con información suficiente (excluyendo dimensiones grises).

### DRP-F05 — Explicación de cada hallazgo
Por cada dimensión, el resultado muestra qué pregunta y respuesta originó
la clasificación.

### DRP-F06 — Preguntas para preventa
La pantalla de resultados incluye 5 preguntas sugeridas que el equipo de
preventa debería profundizar en el assessment técnico.

### DRP-F07 — Resumen copiable e imprimible
El usuario puede copiar un resumen en texto (Markdown simplificado) al
portapapeles o imprimir/guardar como PDF.

### DRP-F08 — Reinicio con confirmación
El botón "Reiniciar" solicita confirmación antes de borrar todas las
respuestas.

### DRP-F09 — Datos solo en memoria
Ninguna respuesta se persiste en disco, red o almacenamiento del navegador.
Se borran al recargar, cerrar o reiniciar.

### DRP-F10 — Demostración sintética
Existe un escenario precargable con datos ficticios para demostrar la
herramienta sin depender de respuestas reales.

### DRP-F11 — Versión visible
La herramienta muestra su número de versión (semántico) en pantalla.

### DRP-F12 — Disclaimer obligatorio
Todo resultado incluye: "Este resultado es preliminar y requiere validación
técnica por el equipo de preventa."

## Requisitos no funcionales

### DRP-NF01 — Tiempo de completado ≤ 15 minutos.
### DRP-NF02 — Funciona sin conexión (file:// en Chrome/Edge).
### DRP-NF03 — Responsive: escritorio, Chromebook, tablet, móvil.
### DRP-NF04 — Contraste AA (4.5:1 mínimo).
### DRP-NF05 — Navegable 100% con teclado.
### DRP-NF06 — Tamaño mínimo 16 px en controles.

## Dimensiones evaluadas

1. **Plan DRP documentado** — existencia, vigencia y accesibilidad del plan.
2. **Objetivos de recuperación (RTO/RPO)** — definición y consenso organizacional.
3. **Respaldos** — existencia, frecuencia, verificación y aislamiento.
4. **Restauraciones probadas** — pruebas de restauración realizadas y documentadas.
5. **Dependencias críticas** — mapeo de sistemas, proveedores e interdependencias.
6. **Responsables y comunicación** — roles asignados, escalamiento y comunicación de crisis.
7. **Protección contra ransomware** — controles de aislamiento, detección y respuesta.

## Fuera de alcance

- No evalúa la calidad técnica del plan (eso es del assessment).
- No recomienda tecnologías ni proveedores.
- No calcula costos de downtime ni ROI de DRP.
- No genera un plan de recuperación.
- No sustituye auditorías de cumplimiento (ISO 22301, etc.).
