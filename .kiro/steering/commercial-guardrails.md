# Commercial Guardrails

inclusion: always

## Reglas absolutas

Estas restricciones aplican a TODO el contenido generado para este repositorio:
código, texto en pantalla, comentarios, documentación, datos de prueba y capturas.

### 1. Cero información financiera

- No incluir precios, costos, tarifas ni rangos de precio.
- No calcular ROI, TCO, payback ni porcentajes de ahorro.
- No incluir comparativas de costo entre proveedores.
- No mencionar márgenes, descuentos ni estructuras de pricing.

### 2. Cero compromisos

- No prometer tiempos de implementación ni cronogramas.
- No definir alcances concretos de proyecto.
- No recomendar una arquitectura final ni stack específico.
- No garantizar niveles de servicio (SLA) ni uptime.

### 3. Cero referencias no autorizadas

- No mencionar nombres de clientes actuales o pasados sin autorización escrita.
- No citar casos de éxito, testimonios ni logos de terceros.
- No nombrar socios tecnológicos bajo NDA.

### 4. Cero métricas no verificadas

- No afirmar certificaciones que no estén vigentes y verificadas.
- No declarar número de clientes, proyectos completados ni años de experiencia sin fuente interna autorizada.
- No inventar estadísticas de industria ni benchmarks.

### 5. Resultados siempre preliminares

- Todo resultado, score o clasificación debe indicar de forma visible:
  > "Este resultado es preliminar y requiere validación técnica por el equipo de preventa."
- El disclaimer debe aparecer en el resumen imprimible y en la pantalla de resultados.
- No usar lenguaje que sugiera que el resultado es definitivo o vinculante.

## Criterio de revisión

Antes de merge, verificar que ningún texto en el diff viole las reglas anteriores.
En caso de duda, la regla aplica (es decir, se restringe el contenido).
