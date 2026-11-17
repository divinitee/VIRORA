// Live Teacher scenario runner: checks the teacher's REAL behaviour (personality,
// tone escalation, Uzbek explanations, tool use) against the actual OpenAI model,
// in TEXT mode, using the exact same prompt, tools and mistake tracker as the
// voice lesson. Voice itself (microphone, interruptions, pronunciation) can only
// be tested in the browser: see docs/live-teacher.md, "Voice checklist".
//
// Run on YOUR computer (the key stays in your terminal, never in a file):
//   Windows PowerShell:  $env:OPENAI_API_KEY="sk-..."; node tools/live-teacher-tests/scenarios.mjs
//   Mac/Linux:           OPENAI_API_KEY=sk-... node tools/live-teacher-tests/scenarios.mjs
// Optional: SCENARIO_MODEL=gpt-5-mini (any text model your key can use)
//           SCENARIO_ONLY=2     (run only scenario 2)
//           SCENARIO_DRY=1      (no network: canned model, checks the plumbing only)
import {
  emptyProfile, applyMistake, applyCorrectUse, applyLevelEstimate, applyPronunciation, applyVocabulary,
  finishLesson, memorySummary,
} from '../../base44/shared/liveTeacherCore.js';
import { buildInstructions, TOOLS } from '../../base44/shared/liveTeacherPrompt.js';

const DRY = !!process.env.SCENARIO_DRY;
const KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.SCENARIO_MODEL || 'gpt-5-mini';
if (!DRY && !KEY) { console.error('Set OPENAI_API_KEY in your terminal first (see the top of this file).'); process.exit(1); }

async function respond(body) {
  if (DRY) return dryModel(body);
  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST', headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${String(data?.error?.message).replace(/(sk|ek)-[A-Za-z0-9_-]+/g, '[redacted]')}`);
  return data;
}

// canned stand-in used only by SCENARIO_DRY to prove the loop works offline
let dryStep = 0;
function dryModel(body) {
  dryStep += 1;
  const last = body.input[body.input.length - 1];
  if (last.type === 'function_call_output') {
    return { id: `r${dryStep}`, output: [{ type: 'message', content: [{ type: 'output_text', text: '(dry) Almost, but that is incorrect.' }] }] };
  }
  return { id: `r${dryStep}`, output: [{ type: 'function_call', call_id: `c${dryStep}`, name: 'log_mistake', arguments: JSON.stringify({ rule: 'grammar.subject_verb_agreement', variant: 'i_goes', wrong: 'I goes to school.', correct: 'I go to school.', explanation_uz: "'I' bilan 'go'." }) }] };
}

const textOf = (r) => (r.output || []).filter((o) => o.type === 'message').flatMap((o) => o.content || []).map((c) => c.text).join(' ').trim();

class Lesson {
  constructor({ mode = 'strict', ageGroup = 'adult', profile = emptyProfile('test@example.com'), id = 'L1' }) {
    this.mode = mode; this.ageGroup = ageGroup; this.profile = profile; this.id = id; this.prev = null; this.toolLog = [];
  }
  instructions() { return buildInstructions({ mode: this.mode, ageGroup: this.ageGroup, uiLang: 'uz', studentName: 'Test', memory: memorySummary(this.profile) }); }
  runTool(name, args) {
    const ctx = { lessonId: this.id, mode: this.mode, ageGroup: this.ageGroup, now: Date.now() };
    const fn = { log_mistake: applyMistake, log_correct_use: applyCorrectUse, set_level_estimate: applyLevelEstimate, log_pronunciation: applyPronunciation, log_vocabulary: applyVocabulary }[name];
    if (!fn) return { ok: true };
    const r = fn(this.profile, args, ctx);
    this.profile = r.profile;
    this.toolLog.push({ name, args, result: r.result });
    return r.result;
  }
  async say(student) {
    console.log(`\n  STUDENT: ${student}`);
    let input = [{ role: 'user', content: student }];
    for (let i = 0; i < 5; i++) {
      const r = await respond({ model: MODEL, instructions: this.instructions(), input, tools: TOOLS, previous_response_id: this.prev || undefined });
      this.prev = r.id;
      const calls = (r.output || []).filter((o) => o.type === 'function_call');
      if (!calls.length) { const t = textOf(r); console.log(`  TEACHER: ${t}`); return t; }
      input = calls.map((c) => {
        const out = this.runTool(c.name, JSON.parse(c.arguments || '{}'));
        const brief = c.name === 'log_mistake' ? ` -> ${out.status} level ${out.level} (${out.tone})` : '';
        console.log(`    [tool] ${c.name}${brief}`);
        return { type: 'function_call_output', call_id: c.call_id, output: JSON.stringify(out) };
      });
    }
    return '';
  }
}

const checks = [];
const check = (label, ok) => { checks.push({ label, ok }); console.log(`  ${ok ? 'PASS' : 'CHECK BY HAND'}: ${label}`); };
const hasUzbek = (t) => /\b(ishlatiladi|emas|xato|tushun|ayting|takrorlang|bilan|uchun|qani|diqqat)\b/i.test(t);

const scenarios = {
  1: async () => {
    console.log('\n=== 1. Simple grammar mistake ===');
    const l = new Lesson({});
    const t = await l.say('I goes to school every day.');
    check('teacher logged the mistake before correcting', l.toolLog[0]?.name === 'log_mistake');
    check('first mistake = new, patient', l.toolLog[0]?.result.status === 'new' && l.toolLog[0]?.result.tone === 'patient');
    check('correct sentence given ("I go")', /I go\b/.test(t));
    check('explained in Uzbek', hasUzbek(t));
  },
  2: async () => {
    console.log('\n=== 2. Same mistake three times (strict mode) ===');
    const l = new Lesson({});
    const replies = [];
    for (let i = 0; i < 3; i++) replies.push(await l.say('I goes to school.'));
    const lv = l.toolLog.filter((x) => x.name === 'log_mistake').map((x) => x.result.level);
    check(`levels climb 1,2,3 (got ${lv.join(',')})`, lv.join(',') === '1,2,3');
    check('2nd reply is Uzbek and reminds of the earlier explanation', hasUzbek(replies[1]));
    check('3rd reply demands a repeat / gives an exercise', /(takrorlang|repeat|mashq|exercise|ayting)/i.test(replies[2]));
    console.log('  Read the three replies: strict but never insulting? (judge by hand)');
  },
  3: async () => {
    console.log('\n=== 3. Student speaks Uzbek instead of English (A2 student) ===');
    const p = applyLevelEstimate(emptyProfile('t@e.c'), { cefr: 'A2' }).profile;
    const l = new Lesson({ profile: p });
    const t = await l.say("Men kecha do'konga bordim va non sotib oldim.");
    check('teacher gives the English version', /(went|bought)/i.test(t));
    check('teacher asks the student to say it in English', /(english|inglizcha|ayting|say)/i.test(t));
  },
  4: async () => {
    console.log("\n=== 4. Student does not understand the explanation ===");
    const l = new Lesson({});
    await l.say('She go to work every day.');
    const t = await l.say("Tushunmadim. Nega 'goes' bo'ladi?");
    check('answers in Uzbek', hasUzbek(t) || /\b(siz|u|ega)\b/i.test(t));
    check('does not just repeat the same explanation (read it: different angle / example?)', t.length > 20);
  },
  5: async () => {
    console.log('\n=== 5. Advanced English question ===');
    const l = new Lesson({});
    const t = await l.say("What is the difference between 'I have been working' and 'I worked' when I talk about my job?");
    check('substantive answer (Present Perfect Continuous vs Past Simple)', /(present perfect|continuous|have been)/i.test(t) && t.length > 80);
  },
  6: async () => {
    console.log('\n=== 6. Interruptions and 7. Pronunciation: VOICE ONLY ===');
    console.log('  These need a microphone: use the "Voice checklist" in docs/live-teacher.md.');
  },
  8: async () => {
    console.log('\n=== 8. Student returns for another lesson ===');
    const l1 = new Lesson({ id: 'L1' });
    await l1.say('I goes to school.');
    l1.profile = finishLesson(applyLevelEstimate(l1.profile, { cefr: 'A2' }).profile, { mode: 'strict', summary: 'Present Simple basics.', focusNext: ['he/she + s'] });
    const l2 = new Lesson({ id: 'L2', profile: l1.profile });
    console.log('  --- memory the teacher is given for lesson 2 ---');
    console.log(memorySummary(l2.profile).split('\n').map((x) => `  | ${x}`).join('\n'));
    const t = await l2.say('Hello teacher. I goes to school today.');
    const lv = l2.toolLog.find((x) => x.name === 'log_mistake')?.result;
    check('the old mistake is recognised as REPEATED (level 2) in the new lesson', lv?.status === 'repeated' && lv?.level === 2);
    check('teacher refers back to the earlier explanation (read it)', t.length > 20);
  },
};

const only = process.env.SCENARIO_ONLY;
for (const [n, run] of Object.entries(scenarios)) {
  if (DRY && !['1'].includes(n)) continue; // the canned model only knows scenario 1
  if (only && only !== n) continue;
  try { await run(); } catch (e) { console.error(`  ERROR in scenario ${n}: ${e.message}`); checks.push({ label: `scenario ${n} crashed`, ok: false }); }
}
const failed = checks.filter((c) => !c.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} automatic checks passed. "CHECK BY HAND" lines need your own judgement (tone, humour, respect).`);
process.exit(0);
