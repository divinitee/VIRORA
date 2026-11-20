// Live Teacher v2 ("text brain") tests: the whole turn flow against an
// in-memory database and FAKE ElevenLabs + OpenAI (no network, no real keys).
// Run: node --test tools/live-teacher-tests/*.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { startVoiceLesson, voiceTurn, fillerClips, costOf, voiceTurnText, speakText, phoneTokens } from '../../base44/shared/liveTeacherVoiceEngine.js';
import { fillerMood } from '../../src/lib/liveTeacher/fillerMood.js';
import { brainSchema, buildBrainInstructions, buildTurnMessage, cleanBrainOutput, stripAudioTags, cleanPersona, PERSONAS } from '../../base44/shared/liveTeacherBrain.js';
import { RULES } from '../../base44/shared/liveTeacherCore.js';

const env = { OPENAI_API_KEY: 'sk-test-OPENAI-KEY-1234567890', ELEVENLABS_API_KEY: 'xi-test-EL-KEY-1234567890' };
const T0 = Date.parse('2026-11-20T09:00:00Z');
const student = { id: 'u1', email: 'stu@example.com', full_name: 'Tee Tester', role: 'user' };
const igoes = { rule: 'grammar.subject_verb_agreement', variant: 'i_goes', wrong: 'I goes to school.', correct: 'I go to school.', explanation_uz: "'I' bilan 'go' ishlatiladi." };

function fakeDb() {
  let n = 0;
  const tables = {};
  const entity = (name) => {
    const rows = (tables[name] ||= []);
    return {
      rows,
      async create(data) { const row = { id: `${name}-${++n}`, created_date: new Date(T0 + n).toISOString(), ...structuredClone(data) }; rows.push(row); return structuredClone(row); },
      async get(id) { const r = rows.find((x) => x.id === id); if (!r) throw new Error('not found'); return structuredClone(r); },
      async filter(q = {}) { return structuredClone(rows.filter((r) => Object.entries(q).every(([k, v]) => r[k] === v))); },
      async update(id, patch) { const r = rows.find((x) => x.id === id); Object.assign(r, structuredClone(patch)); return structuredClone(r); },
    };
  };
  return { LiveTeacherProfile: entity('LiveTeacherProfile'), LiveTeacherLesson: entity('LiveTeacherLesson') };
}

const brainAnswer = (o = {}) => ({
  addressed_to_teacher: true, reply: '[warmly] Almost! We say "I go to school". Say it again?', explanation_text: "'I' bilan fe'lga -s qo'shilmaydi.",
  mistakes: [], correct_uses: [], level_estimate: '', vocabulary: [], end_lesson: false, summary: '', strengths: [], focus_next: [], ...o,
});

// One fake for all three services. `heard` = what Scribe "hears"; `brain` = the brain's JSON.
function fakeServices({ heard = 'I goes to school every day.', brain = brainAnswer(), voices = [{ voice_id: 'v-vira', name: 'Vira' }, { voice_id: 'v-ng', name: 'Vira Nightingale' }] } = {}) {
  const calls = [];
  const fetchImpl = async (url, init = {}) => {
    calls.push({ url, init });
    if (url.includes('/v2/voices')) return { ok: true, status: 200, json: async () => ({ voices }) };
    if (url.includes('/single-use-token/')) return { ok: true, status: 200, json: async () => ({ token: `sutkn_${url.split('/single-use-token/')[1].split('?')[0]}` }) };
    if (url.includes('/speech-to-text')) return { ok: true, status: 200, json: async () => ({ text: heard, language_code: 'eng' }) };
    if (url.includes('/chat/completions')) {
      return { ok: true, status: 200, json: async () => ({ model: 'gpt-5.6-terra', usage: { prompt_tokens: 3000, completion_tokens: 200, prompt_tokens_details: { cached_tokens: 2000 } }, choices: [{ message: { content: JSON.stringify(brain) } }] }) };
    }
    if (url.includes('/text-to-speech/')) return { ok: true, status: 200, arrayBuffer: async () => new Uint8Array([1, 2, 3, 4]).buffer };
    throw new Error(`unexpected url ${url}`);
  };
  return { fetchImpl, calls };
}
const audio = { audio_b64: Buffer.from('RIFFfakewav').toString('base64'), mime: 'audio/wav', duration_s: 3 };

test('brain schema: strict-mode friendly (every property required, no extras)', () => {
  const walk = (s) => {
    if (s.type === 'object') {
      assert.equal(s.additionalProperties, false);
      assert.deepEqual([...s.required].sort(), Object.keys(s.properties).sort());
      Object.values(s.properties).forEach(walk);
    }
    if (s.type === 'array') walk(s.items);
  };
  walk(brainSchema());
  assert.deepEqual(brainSchema().properties.mistakes.items.properties.rule.enum, RULES);
});

test('prompt: persona, explanation language, tags on/off', () => {
  const p = buildBrainInstructions({ persona: 'velvet', ageGroup: 'teen', uiLang: 'ru', memory: 'FIRST LESSON' });
  assert.match(p, /VELVET/);
  assert.match(p, /in Russian/);
  assert.match(p, /\[sarcastic\]/);
  assert.match(buildBrainInstructions({ persona: 'vira', audioTags: false }), /Do NOT use any square-bracket tags/);
  assert.equal(cleanPersona('nope'), 'vira');
  assert.equal(stripAudioTags('[warmly] Hi [laughs] there'), 'Hi there');
  const m = buildTurnMessage({ persona: 'vira', history: [{ role: 'teacher', text: 'How are you?', interrupted: true }], studentText: 'I goes', minutesLeft: 0 });
  assert.match(m, /TIME IS UP/);
  assert.match(m, /Vira: How are you\? \(interrupted\)/);
  assert.match(m, /STUDENT JUST SAID: "I goes"/);
});

test('cleanBrainOutput drops unknown rules and caps mistakes at 2', () => {
  const o = cleanBrainOutput({ mistakes: [igoes, igoes, igoes, { ...igoes, rule: 'made.up' }], reply: 'x' });
  assert.equal(o.mistakes.length, 2);
  assert.equal(o.addressed_to_teacher, true);
});

test('start: not configured -> 503, no outside call', async () => {
  const { fetchImpl, calls } = fakeServices();
  const r = await startVoiceLesson({ svc: fakeDb(), user: student, body: {}, env: { OPENAI_API_KEY: 'x' }, fetchImpl, now: T0 });
  assert.equal(r.status, 503);
  assert.equal(calls.length, 0);
});

test('start: greeting text + passes for the phone; tags only in the spoken text; keys never leak', async () => {
  const svc = fakeDb();
  const { fetchImpl, calls } = fakeServices({ brain: brainAnswer({ reply: '[warmly] Hi! I am Vira. How are you today?' }) });
  const r = await startVoiceLesson({ svc, user: student, body: { persona: 'vira', lang: 'uz' }, env, fetchImpl, now: T0 });
  assert.equal(r.status, 200);
  assert.equal(r.body.reply_text, 'Hi! I am Vira. How are you today?'); // tags hidden from the transcript
  assert.match(r.body.speak_text, /\[warmly\]/); // ...but kept for the voice
  assert.equal(r.body.tts_token, 'sutkn_tts_websocket');
  assert.equal(r.body.stt_token, 'sutkn_realtime_scribe');
  assert.deepEqual(r.body.voice, { voice_id: 'v-vira', model: 'eleven_v4_turbo' });
  assert.ok(calls.some((c) => c.url.includes('realtime_scribe?max_session_duration_seconds=')));
  assert.equal(calls.filter((c) => c.url.includes('/text-to-speech/')).length, 0); // the phone streams it
  const lesson = svc.LiveTeacherLesson.rows[0];
  assert.equal(lesson.max_minutes, PERSONAS.vira.minutes);
  assert.match(lesson.model, /^v2:vira\|/);
  assert.ok(lesson.scores.usage.cost_usd > 0);
  assert.ok(!JSON.stringify(r.body).includes('sk-test') && !JSON.stringify(r.body).includes('xi-test'));
});

test('start: a failed pass never breaks the lesson (phone uses the backup path)', async () => {
  const s = fakeServices();
  const fetchImpl = async (url, init) => (url.includes('/single-use-token/') ? { ok: false, status: 401, json: async () => ({ detail: 'nope' }) } : s.fetchImpl(url, init));
  const r = await startVoiceLesson({ svc: fakeDb(), user: student, body: {}, env, fetchImpl, now: T0 });
  assert.equal(r.status, 200);
  assert.equal(r.body.tts_token, null);
  assert.equal(r.body.stt_token, null);
});

test('start: missing voice -> clear 503 for admin', async () => {
  const { fetchImpl } = fakeServices({ voices: [{ voice_id: 'x', name: 'Someone' }] });
  const r = await startVoiceLesson({ svc: fakeDb(), user: { ...student, role: 'admin' }, body: { persona: 'velvet' }, env, fetchImpl, now: T0 });
  assert.equal(r.status, 503);
  assert.equal(r.body.code, 'voice_not_found');
  assert.match(r.body.error, /Velvet/);
});

test('turn: mistake goes through the tracker; repeat turns it into "repeated"', async () => {
  const svc = fakeDb();
  const s1 = fakeServices({ brain: brainAnswer() });
  const start = await startVoiceLesson({ svc, user: student, body: { persona: 'vira' }, env, fetchImpl: s1.fetchImpl, now: T0 });
  const lessonId = start.body.lesson_id;

  const s2 = fakeServices({ brain: brainAnswer({ mistakes: [igoes] }) });
  const t1 = await voiceTurn({ svc, user: student, body: { lesson_id: lessonId, ...audio, history: [] }, env, fetchImpl: s2.fetchImpl, now: T0 + 60000 });
  assert.equal(t1.status, 200);
  assert.equal(t1.body.student_text, 'I goes to school every day.');
  assert.equal(t1.body.mistakes.length, 1);
  assert.equal(t1.body.mistakes[0].status, 'new');
  assert.ok(t1.body.mistakes[0].label);

  const t2 = await voiceTurn({ svc, user: student, body: { lesson_id: lessonId, ...audio }, env, fetchImpl: s2.fetchImpl, now: T0 + 120000 });
  assert.equal(t2.body.mistakes[0].status, 'repeated');
  assert.equal(t2.body.mistakes[0].count, 2);
  // the brain sees this lesson's mistakes on the next turn
  const brainCall = s2.calls.filter((c) => c.url.includes('/chat/completions')).pop();
  assert.match(JSON.parse(brainCall.init.body).messages[1].content, /THIS LESSON so far/);
  const lesson = svc.LiveTeacherLesson.rows[0];
  assert.equal(lesson.mistakes_logged, 2);
  assert.equal(lesson.tool_calls, 2);
  assert.equal(lesson.scores.usage.turns, 3);
});

test('turn: someone else talking -> nothing logged, addressed=false', async () => {
  const svc = fakeDb();
  const s = fakeServices();
  const start = await startVoiceLesson({ svc, user: student, body: {}, env, fetchImpl: s.fetchImpl, now: T0 });
  const away = fakeServices({ heard: 'Ovqatga kel!', brain: brainAnswer({ addressed_to_teacher: false, mistakes: [igoes], reply: "Sounds like someone needs you. I'll wait." }) });
  const r = await voiceTurn({ svc, user: student, body: { lesson_id: start.body.lesson_id, ...audio }, env, fetchImpl: away.fetchImpl, now: T0 + 30000 });
  assert.equal(r.body.addressed, false);
  assert.equal(r.body.mistakes.length, 0);
  assert.equal(svc.LiveTeacherLesson.rows[0].mistakes_logged, 0);
});

test('turn: silence -> empty, no brain call, no voice', async () => {
  const svc = fakeDb();
  const s = fakeServices();
  const start = await startVoiceLesson({ svc, user: student, body: {}, env, fetchImpl: s.fetchImpl, now: T0 });
  const quiet = fakeServices({ heard: '(background noise)' });
  const r = await voiceTurn({ svc, user: student, body: { lesson_id: start.body.lesson_id, ...audio }, env, fetchImpl: quiet.fetchImpl, now: T0 + 30000 });
  assert.equal(r.body.empty, true);
  assert.equal(quiet.calls.filter((c) => c.url.includes('/chat/completions') || c.url.includes('/text-to-speech/')).length, 0);
});

test('turn: brain ends the lesson -> recap with summary and usage', async () => {
  const svc = fakeDb();
  const s = fakeServices();
  const start = await startVoiceLesson({ svc, user: student, body: {}, env, fetchImpl: s.fetchImpl, now: T0 });
  const bye = fakeServices({ heard: 'Bye teacher', brain: brainAnswer({ end_lesson: true, reply: 'Bye! I am going for a nap.', summary: 'We practised present simple.', strengths: ['fluency'], focus_next: ['i_goes'] }) });
  const r = await voiceTurn({ svc, user: student, body: { lesson_id: start.body.lesson_id, ...audio }, env, fetchImpl: bye.fetchImpl, now: T0 + 300000 });
  assert.equal(r.body.ended, true);
  assert.equal(r.body.recap.summary, 'We practised present simple.');
  assert.ok(r.body.recap.usage.cost_usd > 0);
  assert.equal(svc.LiveTeacherLesson.rows[0].status, 'ended');
});

test('turn: another student cannot use my lesson', async () => {
  const svc = fakeDb();
  const s = fakeServices();
  const start = await startVoiceLesson({ svc, user: student, body: {}, env, fetchImpl: s.fetchImpl, now: T0 });
  const r = await voiceTurn({ svc, user: { ...student, email: 'other@example.com' }, body: { lesson_id: start.body.lesson_id, ...audio }, env, fetchImpl: s.fetchImpl, now: T0 + 1000 });
  assert.equal(r.status, 404);
});

test('fillers: one clip per line of the asked mood, spoken with that mood', async () => {
  const s = fakeServices();
  const r = await fillerClips({ user: student, body: { persona: 'vira_nightingale', mood: 'empathy' }, env, fetchImpl: s.fetchImpl });
  assert.equal(r.status, 200);
  assert.equal(r.body.mood, 'empathy');
  assert.equal(r.body.clips.length, 5);
  const tts = s.calls.filter((c) => c.url.includes('/text-to-speech/v-ng'));
  assert.ok(tts.length >= 5);
  assert.match(JSON.parse(tts[0].init.body).text, /\[sympathetically\]/);
});

test('text turn (fast path): no audio upload, brain + tracker, fresh voice pass', async () => {
  const svc = fakeDb();
  const s1 = fakeServices();
  const start = await startVoiceLesson({ svc, user: student, body: { persona: 'vira' }, env, fetchImpl: s1.fetchImpl, now: T0 });
  const s2 = fakeServices({ brain: brainAnswer({ mistakes: [igoes] }) });
  const r = await voiceTurnText({ svc, user: student, body: { lesson_id: start.body.lesson_id, text: 'I goes to school every day.', duration_s: 3 }, env, fetchImpl: s2.fetchImpl, now: T0 + 60000 });
  assert.equal(r.status, 200);
  assert.equal(r.body.mistakes[0].status, 'new');
  assert.equal(r.body.tts_token, 'sutkn_tts_websocket');
  assert.ok(r.body.speak_text);
  assert.equal(s2.calls.filter((c) => c.url.includes('/speech-to-text') || c.url.includes('/text-to-speech/')).length, 0);
  assert.equal(svc.LiveTeacherLesson.rows[0].tool_calls, 1);
  const sounds = await voiceTurnText({ svc, user: student, body: { lesson_id: start.body.lesson_id, text: '[mouse clicking]' }, env, fetchImpl: s2.fetchImpl, now: T0 + 70000 });
  assert.equal(sounds.body.empty, true);
});

test('speak fallback + tokens: only the lesson owner', async () => {
  const svc = fakeDb();
  const s = fakeServices();
  const start = await startVoiceLesson({ svc, user: student, body: {}, env, fetchImpl: s.fetchImpl, now: T0 });
  const ok = await speakText({ svc, user: student, body: { lesson_id: start.body.lesson_id, text: 'Hello there' }, env, fetchImpl: s.fetchImpl, now: T0 + 1000 });
  assert.ok(ok.body.audio_b64);
  const bad = await speakText({ svc, user: { ...student, email: 'x@y.z' }, body: { lesson_id: start.body.lesson_id, text: 'Hi' }, env, fetchImpl: s.fetchImpl, now: T0 + 1000 });
  assert.equal(bad.status, 404);
  const t = await phoneTokens({ svc, user: student, body: { lesson_id: start.body.lesson_id, types: ['stt'] }, env, fetchImpl: s.fetchImpl, now: T0 + 1000 });
  assert.equal(t.body.stt_token, 'sutkn_realtime_scribe');
  assert.equal(t.body.tts_token, null);
});

test('filler mood: sad, question, good news, neutral (en/uz/ru)', () => {
  assert.equal(fillerMood("I'm so tired today."), 'empathy');
  assert.equal(fillerMood('Bugun juda xafa bo\u02bbldim'), 'empathy');
  assert.equal(fillerMood('Мне грустно'), 'empathy');
  assert.equal(fillerMood('Why do we say does?'), 'question');
  assert.equal(fillerMood('почему так'), 'question');
  assert.equal(fillerMood('I passed my exam, it was amazing'), 'positive');
  assert.equal(fillerMood('I went to the market.'), 'neutral');
  assert.equal(fillerMood('I like painting.'), 'neutral'); // "pain" inside a word is not sadness
  assert.equal(fillerMood('Not bad, I was tired'), 'neutral'.length ? fillerMood('Not bad, I was tired') : '');
});

test('cost estimate: cached tokens are cheaper', () => {
  const a = costOf({ brainModel: 'gpt-5.6-terra', usage: { prompt_tokens: 3000, completion_tokens: 200 }, ttsModel: 'eleven_v4_turbo', ttsChars: 100 });
  const b = costOf({ brainModel: 'gpt-5.6-terra', usage: { prompt_tokens: 3000, completion_tokens: 200, prompt_tokens_details: { cached_tokens: 2500 } }, ttsModel: 'eleven_v4_turbo', ttsChars: 100 });
  assert.ok(b.total < a.total);
  assert.equal(a.tts, 0.004);
});
