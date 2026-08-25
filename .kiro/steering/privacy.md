# Privacy & Data Handling

inclusion: always

## Principio rector

V1 es una aplicación 100 % client-side, sin persistencia y sin comunicación de
red. Los datos del usuario existen únicamente en memoria durante la sesión activa.

## Reglas de implementación

### Sin backend ni red

- No realizar llamadas HTTP, fetch, WebSocket ni cualquier comunicación de red.
- No incluir SDKs de analítica (Google Analytics, Mixpanel, Hotjar, etc.).
- No incluir pixels de tracking, beacons ni scripts de terceros.
- No cargar recursos externos (CDN, fuentes remotas, imágenes externas).

### Sin persistencia local

- No guardar datos en `localStorage`.
- No guardar datos en `sessionStorage`.
- No usar cookies (ni de sesión ni persistentes).
- No usar IndexedDB ni WebSQL.
- No usar la API de Cache (Service Worker cache).
- Toda la información se procesa en memoria (variables JS) y se pierde al recargar o cerrar la pestaña.

### Datos sintéticos obligatorios

- Código fuente, pruebas automatizadas, capturas de pantalla y documentación deben usar exclusivamente datos sintéticos (ficticios).
- Los datos sintéticos no deben parecerse a empresas, personas o situaciones reales identificables.
- Usar nombres genéricos: "Empresa Demo", "Usuario Ejemplo", "Proyecto Alfa".

### Información prohibida en el repositorio

Nunca incluir en ningún archivo del repositorio (código, docs, issues, PRs):

- Credenciales, tokens o API keys (reales o de prueba que apunten a servicios reales).
- Nombres reales de clientes de Total Cloud.
- Minutas de reuniones, correos electrónicos o conversaciones internas.
- Márgenes de ganancia, tarifas internas o estructuras de comisión.
- Nombres de proveedores bajo NDA.
- Datos personales reales (nombres, teléfonos, correos de personas reales).

## Acciones explícitas del usuario

- La única forma de "exportar" datos es mediante acción explícita del usuario:
  copiar al portapapeles o imprimir/guardar como PDF desde el navegador.
- El sistema no debe iniciar ninguna descarga automática ni transmisión de datos.

## Verificación

En cada PR, confirmar que:
1. No hay llamadas a red en el código nuevo.
2. No hay uso de APIs de persistencia del navegador.
3. No hay datos reales de clientes, empleados o socios.
4. Cualquier dataset es verificablemente sintético.
