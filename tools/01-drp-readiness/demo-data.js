/**
 * DRP Readiness — Demo Data (Synthetic Scenario)
 * Version: 2.0.0
 *
 * Scenario 8 from drp-scenarios.md: "Distribuidora Ejemplo"
 * Shows all 4 traffic-light states: green, yellow, red, gray.
 * All data is fictional. Does not represent any real client.
 *
 * Expected results:
 *   - Plan DRP: 🟢 Verde (1.00)
 *   - RTO: 🟢 Verde (1.00)
 *   - RPO: 🟢 Verde (1.00)
 *   - Respaldos: 🟡 Amarillo (0.54)
 *   - Restauraciones: 🔴 Rojo (0.00)
 *   - Dependencias/Resp.: ⚪ Gris (null)
 *   - Ransomware: 🔴 Rojo (0.167)
 *   - Global: 🔴 Rojo (override OV-07: 2+ dims críticas rojas)
 */

// ─── Demo Responses (scored questions) ───────────────────────────────────────

export const demoResponses = {
  // Dimension 1: Plan DRP — Verde
  P01: 1.0,    // Sí
  P02: 1.0,    // Sí, últimos 12 meses
  P03: 1.0,    // Sí, accesible y lo conocen

  // Dimension 2: RTO — Verde
  P04: 1.0,    // Sí, definido y documentado
  P05: '1 a 4 horas',  // Informational: RTO reportado 1–4h

  // Dimension 3: RPO — Verde
  P06: 1.0,    // Sí, definido y documentado
  P07: '4 a 12 horas', // Informational: RPO reportado 4–12h

  // Dimension 4: Respaldos — Amarillo
  P08: 1.0,    // Sí
  P09: 0.7,    // Semanal
  P10: 0.5,    // Se verifican ocasionalmente
  P11: 0.5,    // Parcialmente (algunos sí, otros no)
  P12: 0.0,    // No, un atacante podría borrarlos

  // Dimension 5: Restauraciones — Rojo
  P13: 0.0,    // Nunca se ha probado
  // P14: skip por dependencia (P13 = 0.0 = "Nunca")

  // Dimension 6: Dependencias y responsables — Gris
  P15: null,   // No sé
  P16: null,   // No sé
  P17: null,   // No sé

  // Dimension 7: Ransomware — Rojo
  P18: 0.0,    // Mismas credenciales que el entorno principal
  P19: 0.0,    // No
  P20: 0.5     // No estamos seguros
};

// ─── Demo Context Answers (non-scoring) ──────────────────────────────────────

export const demoContext = {
  CTX01: '4 a 10',
  CTX02: 'Sí, 24/7',
  CTX03: 'Operación degradada con pérdida de ingresos',
  CTX04: 'Nunca se ha probado'
};

// ─── Demo "No aplica" Reasons ────────────────────────────────────────────────

export const demoNaReasons = {};
// No "No aplica" answers in this scenario
