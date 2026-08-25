/**
 * Verification script: runs the scoring engine with demo data
 * and validates expected results from Scenario 8.
 */

import { calculateScore, generatePreventaQuestions, classify, CLASSIFICATION_LABELS } from '../tools/01-drp-readiness/scoring.js';
import { demoResponses, demoContext } from '../tools/01-drp-readiness/demo-data.js';
import { getVisibleQuestions, dimensions } from '../tools/01-drp-readiness/questions.js';

console.log('=== DRP Readiness — Demo Verification ===\n');

// 1. Calculate score with demo data
const result = calculateScore(demoResponses);

console.log('── Global Result ──');
console.log(`  Score (mathematical): ${result.global.scoreMathematical !== null ? result.global.scoreMathematical.toFixed(4) : 'null'}`);
console.log(`  Classification (math): ${result.global.classificationMathematical}`);
console.log(`  Classification (final): ${result.global.classificationFinal}`);
console.log(`  Is provisional: ${result.global.isProvisional}`);
console.log(`  Weight effective: ${result.global.weightEffective.toFixed(2)}`);
console.log();

console.log('── Confidence ──');
console.log(`  Dimensions with data: ${result.confidence.dimensionsWithData}/${result.confidence.dimensionsTotal}`);
console.log(`  Questions with data: ${result.confidence.questionsWithData}/${result.confidence.questionsTotal}`);
console.log(`  Question ratio: ${(result.confidence.questionRatio * 100).toFixed(0)}%`);
console.log();

console.log('── Dimensions ──');
for (const dim of result.dimensions) {
  const label = CLASSIFICATION_LABELS[dim.classification];
  const scoreStr = dim.score !== null ? dim.score.toFixed(3) : 'null';
  console.log(`  ${label.icon} ${dim.label}: ${scoreStr} → ${dim.classification} (conf: ${dim.confidenceLevel}, critical: ${dim.critical})`);
}
console.log();

console.log('── Overrides Applied ──');
if (result.overrides.applied.length === 0) {
  console.log('  (none)');
} else {
  for (const ov of result.overrides.applied) {
    console.log(`  ${ov.id}: ${ov.text}`);
  }
}
console.log();

// 2. Generate preventa questions
const pv = generatePreventaQuestions(result.dimensions, demoResponses);
console.log('── Preventa Questions ──');
for (let i = 0; i < pv.length; i++) {
  console.log(`  ${i + 1}. [${pv[i].id}] ${pv[i].text}`);
}
console.log();

// 3. Validate expected results (Scenario 8)
console.log('── Validation ──');
let pass = 0;
let fail = 0;

function assert(condition, msg) {
  if (condition) { pass++; console.log(`  ✅ ${msg}`); }
  else { fail++; console.log(`  ❌ FAIL: ${msg}`); }
}

// Dimension classifications
const dimMap = {};
for (const d of result.dimensions) { dimMap[d.dimensionId] = d; }

assert(dimMap.plan_drp.classification === 'green', 'Plan DRP → green');
assert(dimMap.rto.classification === 'green', 'RTO → green');
assert(dimMap.rpo.classification === 'green', 'RPO → green');
assert(dimMap.respaldos.classification === 'yellow', 'Respaldos → yellow');
assert(dimMap.restauraciones.classification === 'red', 'Restauraciones → red');
assert(dimMap.dependencias_responsables.classification === 'gray', 'Dependencias/Resp → gray');
assert(dimMap.ransomware.classification === 'red', 'Ransomware → red');

// Scores
assert(dimMap.plan_drp.score === 1.0, 'Plan DRP score = 1.00');
assert(dimMap.rto.score === 1.0, 'RTO score = 1.00');
assert(dimMap.rpo.score === 1.0, 'RPO score = 1.00');
assert(Math.abs(dimMap.respaldos.score - 0.54) < 0.01, `Respaldos score ≈ 0.54 (got ${dimMap.respaldos.score.toFixed(3)})`);
assert(dimMap.restauraciones.score === 0.0, 'Restauraciones score = 0.00');
assert(dimMap.dependencias_responsables.score === null, 'Dep/Resp score = null');
assert(Math.abs(dimMap.ransomware.score - 0.167) < 0.01, `Ransomware score ≈ 0.167 (got ${dimMap.ransomware.score.toFixed(3)})`);

// Global
assert(result.global.classificationFinal === 'red', 'Global final = red');
assert(result.overrides.applied.some(o => o.id === 'OV-07'), 'Override OV-07 applied (2+ critical red)');

// Confidence
assert(result.confidence.dimensionsWithData === 6, 'Dims with data = 6');
assert(result.confidence.dimensionsTotal === 7, 'Total dims = 7');

// Preventa: should have 5 questions
assert(pv.length === 5, `Preventa questions count = 5 (got ${pv.length})`);

console.log(`\n── Summary: ${pass} passed, ${fail} failed ──`);
if (fail > 0) process.exit(1);
