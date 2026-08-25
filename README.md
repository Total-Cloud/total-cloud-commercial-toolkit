# Total Cloud Commercial Toolkit

Herramientas web estáticas para que el equipo comercial de Total Cloud conduzca
reuniones de diagnóstico, visualice riesgos, dimensione complejidad preliminar
y prepare un handoff ordenado al equipo de preventa.

## Estado actual

**Piloto: DRP Readiness** — en desarrollo.
Las demás herramientas están documentadas como backlog.

## Qué NO hace este toolkit

- No cotiza, no calcula dinero, no promete ahorros.
- No recomienda una arquitectura final.
- No sustituye un assessment técnico.
- No persiste datos ni se comunica con ningún servidor.

## Estructura del repositorio

```
total-cloud-commercial-toolkit/
├── tools/
│   └── 01-drp-readiness/       ← Piloto activo
├── shared/
│   └── styles/                 ← Tokens CSS, base, print
├── tests/                      ← Pruebas unitarias y manuales
├── docs/                       ← ADR, guías de piloto, backlog
└── .kiro/
    ├── steering/               ← Reglas de producto, marca, guardrails, privacy
    └── docs/                   ← Spec: requirements, design, tasks
```

## Uso local

### Chrome / Edge (recomendado)

Abrir directamente el archivo `tools/01-drp-readiness/index.html` desde el
explorador de archivos. Funciona sin servidor.

### Firefox

Firefox bloquea ES modules desde `file://`. Usar un servidor local:

```bash
# Opción 1: Python
python3 -m http.server 8080

# Opción 2: script incluido
./serve.sh
```

Luego abrir `http://localhost:8080/tools/01-drp-readiness/index.html`.

## Requisitos del navegador

- Chrome ≥ 90, Edge ≥ 90, Firefox ≥ 90, Safari ≥ 15.
- JavaScript habilitado.
- No requiere conexión a internet.

## Privacidad

- Sin backend, sin llamadas a red, sin analítica, sin telemetría.
- Sin localStorage, cookies ni IndexedDB.
- Los datos se procesan en memoria y se borran al recargar o cerrar.
- Solo datos sintéticos en código, pruebas y documentación.

## Licencia

Uso interno de Total Cloud. No redistribuir sin autorización.
