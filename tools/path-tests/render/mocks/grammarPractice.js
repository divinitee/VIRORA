export { STAGES, FORMAT_BY_STAGE, validateItem, validateBank, variantCount } from '/app/src/lib/grammarPractice/schema.js';
import a from '/app/src/lib/grammarPractice/bank/tenses.present.simple-routine.js';
import b from '/app/src/lib/grammarPractice/bank/tenses.present.third-person-s.js';
const BANKS = { 'tenses.present.simple-routine': a, 'tenses.present.third-person-s': b };
export const topicKey = (d, br, t) => `${d}.${br}.${t}`;
export const availableTopics = () => Object.keys(BANKS).sort();
export async function loadTopic(d, br, t) { return BANKS[topicKey(d, br, t)] ?? []; }
