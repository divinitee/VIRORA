export * from '/app/src/lib/grammarPractice/composition.js';
import { composeRound as real } from '/app/src/lib/grammarPractice/composition.js';
import { gradeItem } from '/app/src/lib/grammarPractice/grading.js';
globalThis.__grade = gradeItem;
export function composeRound(args) { const r = real(args); globalThis.__round = r; return r; }
