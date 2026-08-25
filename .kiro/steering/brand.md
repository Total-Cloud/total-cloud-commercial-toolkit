# Brand Guidelines

inclusion: always

## Paleta de colores

| Rol | Hex | Uso |
|-----|-----|-----|
| Primario (Navy) | `#002A42` | Textos principales, encabezados, fondos oscuros |
| Acento (Cyan) | `#00A9FA` | Enlaces, botones primarios, indicadores activos |

Los colores del semáforo de resultados (verde, amarillo, rojo, gris) se definen
en `shared/styles/tokens.css` y son independientes de la paleta de marca.

## Tipografía

- Familia principal: **Montserrat** (solo si está instalada localmente en el equipo del usuario).
- Fallback: `Arial, sans-serif`.
- No cargar fuentes remotas (Google Fonts, CDN, etc.) — incompatible con operación offline.
- Tamaño mínimo en controles e inputs: 16 px.

## Idioma y tono

- Español de México.
- Profesional, claro y directo.
- Sin clichés de IA ("revolucionario", "impulsado por IA", "de vanguardia").
- Sin superlativos vacíos ("el mejor", "líder indiscutible", "incomparable").
- Sin lenguaje de miedo ("si no actúas ahora…", "riesgo inminente de…").
- Sin venta dura ni urgencia artificial.

## Logo

- **No usar logo** hasta que exista un activo aprobado para fondo claro.
- En su lugar, usar el texto "Total Cloud" en Montserrat 700, color Navy.
- Cuando se apruebe un logo, se documentará aquí la ruta al activo y las reglas de uso.

## Componentes visuales

- Bordes redondeados: 8 px.
- Sombras sutiles para elevar tarjetas (box-shadow con opacidad < 0.12).
- Espaciado consistente basado en múltiplos de 8 px.
- Íconos: solo SVG inline. No icon fonts ni dependencias externas.
