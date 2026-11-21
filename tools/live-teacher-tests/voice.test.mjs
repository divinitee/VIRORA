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

test('start: greeting text, first sentence voiced, ears pass for the phone; keys never leak', async () => {
  const svc = fakeDb();
  const { fetchImpl, calls } = fakeServices({ brain: brainAnswer({ reply: '[warmly] Hi! I am Vira. How are you today?' }) });
  const r = await startVoiceLesson({ svc, user: student, body: { persona: 'vira', lang: 'uz' }, env, fetchImpl, now: T0 });
  assert.equal(r.status, 200);
  assert.equal(r.body.reply_text, 'Hi! I am Vira. How are you today?'); // tags hidden from the transcript
  assert.ok(r.body.audio_b64);
  assert.equal(r.body.stt_token, 'sutkn_batch_scribe');
  const tts = calls.filter((c) => c.url.includes('/text-to-speech/v-vira'));
  assert.equal(tts.length, 1);
  assert.match(JSON.parse(tts[0].init.body).text, /^\[warmly\] Hi! I am Vira\./); // first part voiced, tag kept
  assert.equal(r.body.rest_text, '[warmly] How are you today?'); // voice direction carries into the 2nd half
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
  assert.equal(r.body.stt_token, 'sutkn_batch_scribe');
  assert.ok(r.body.audio_b64);
  assert.equal(s2.calls.filter((c) => c.url.includes('/speech-to-text')).length, 0); // no audio went through the server
  assert.equal(s2.calls.filter((c) => c.url.includes('/text-to-speech/')).length, 1); // only the first sentence
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
  assert.equal(t.body.stt_token, 'sutkn_batch_scribe');
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
});

test('cost estimate: cached tokens are cheaper', () => {
  const a = costOf({ brainModel: 'gpt-5.6-terra', usage: { prompt_tokens: 3000, completion_tokens: 200 }, ttsModel: 'eleven_v4_turbo', ttsChars: 100 });
  const b = costOf({ brainModel: 'gpt-5.6-terra', usage: { prompt_tokens: 3000, completion_tokens: 200, prompt_tokens_details: { cached_tokens: 2500 } }, ttsModel: 'eleven_v4_turbo', ttsChars: 100 });
  assert.ok(b.total < a.total);
  assert.equal(a.tts, 0.004);
});

test('splitSpeech: first sentence (tiny ones merged), rest separate', async () => {
  const { splitSpeech } = await import('../../base44/shared/liveTeacherBrain.js');
  const r = splitSpeech('Nice! You said it well, really well. Now tell me about your weekend.');
  assert.equal(r.first, 'Nice! You said it well, really well.');
  assert.equal(r.rest, 'Now tell me about your weekend.');
  assert.deepEqual(splitSpeech('One short line.'), { first: 'One short line.', rest: '' });
});

test('brain stream: reply is handed over before the JSON is finished', async () => {
  const { think } = await import('../../base44/shared/liveTeacherVoiceEngine.js');
  const json = JSON.stringify(brainAnswer({ reply: 'Hello "friend". How are you?' }));
  const chunks = [json.slice(0, 20), json.slice(20, 90), json.slice(90)];
  const sse = chunks.map((c) => `data: ${JSON.stringify({ choices: [{ delta: { content: c } }] })}\n\n`).join('') + `data: ${JSON.stringify({ usage: { prompt_tokens: 10, completion_tokens: 5 } })}\n\ndata: [DONE]\n\n`;
  const fetchImpl = async () => ({
    ok: true, status: 200, headers: { get: () => 'text/event-stream' },
    body: new Response(sse).body,
  });
  let early = null;
  const r = await think(env, { instructions: 'x', message: 'y', onReply: (t) => { early = t; } }, fetchImpl);
  assert.equal(early, 'Hello "friend". How are you?');
  assert.equal(r.out.reply, 'Hello "friend". How are you?');
  assert.equal(r.usage.prompt_tokens, 10);
});

test('language: Russian/Uzbek speech is detected, mirrored in the prompt, and gets its own thinking sounds', async () => {
  const { speechLang, buildTurnMessage, fillerLines } = await import('../../base44/shared/liveTeacherBrain.js');
  const client = await import('../../src/lib/liveTeacher/fillerMood.js');
  for (const f of [speechLang, client.speechLang]) {
    assert.equal(f('rus', 'whatever'), 'ru');
    assert.equal(f('', 'Э-э-э, стой, стой. Я не понял это.'), 'ru');
    assert.equal(f('', 'Rahmat, men buni bilmaganman, tushuntirganingiz uchun'), 'uz');
    assert.equal(f('eng', 'The man ate ham with his men.'), 'en');
  }
  assert.match(buildTurnMessage({ persona: 'vira', studentText: 'что это значит', studentLang: 'ru' }), /STUDENT LANGUAGE: Russian/);
  assert.doesNotMatch(buildTurnMessage({ persona: 'vira', studentText: 'hello', studentLang: 'en' }), /STUDENT LANGUAGE/);
  assert.equal(fillerLines('velvet', 'neutral', 'ru')[0], 'Ммм, понятно…');
  const s = fakeServices();
  const r = await fillerClips({ user: student, body: { persona: 'vira', mood: 'question', lang: 'uz' }, env, fetchImpl: s.fetchImpl });
  assert.equal(r.body.lang, 'uz');
  assert.ok(s.calls.some((c) => c.url.includes('/text-to-speech/') && JSON.parse(c.init.body).text.includes('yaxshi savol')));
});

test('echo: repeating the asked phrase is recognised', async () => {
  const { echoScore } = await import('../../src/lib/liveTeacher/fillerMood.js');
  const teacher = 'Nice! Say: \u201cI especially enjoy drawing cars from different perspectives.\u201d Now try that sentence once.';
  assert.ok(echoScore('I especially enjoy drawing cars from different perspectives.', teacher) >= 0.8);
  assert.ok(echoScore('Uh, I erase and re-sketch.', teacher) < 0.5);
  assert.equal(echoScore('hello', 'No quotes here.'), 0);
});

test('prompt: boundaries, soap line in the settings language, question streak nudge', async () => {
  const { buildBrainInstructions, buildTurnMessage } = await import('../../base44/shared/liveTeacherBrain.js');
  assert.match(buildBrainInstructions({ persona: 'vira', uiLang: 'ru' }), /А ну помой рот с мылом.*Язык придержи/);
  assert.match(buildBrainInstructions({ persona: 'vira', uiLang: 'uz' }), /Og'zingni sovun bilan yuv!.*Tilingni tiy/);
  assert.match(buildBrainInstructions({ persona: 'vira', uiLang: 'en' }), /wash your mouth out with soap.*Watch your mouth/);
  assert.match(buildBrainInstructions({ persona: 'velvet' }), /future perfect continuous in the passive voice/);
  const history = [
    { role: 'teacher', text: 'What do you draw?' }, { role: 'student', text: 'Cars.' },
    { role: 'teacher', text: 'Nice. Now tell me one challenge you have.' }, { role: 'student', text: 'Proportions.' },
  ];
  assert.match(buildTurnMessage({ persona: 'vira', history, studentText: 'ok' }), /must NOT ask a question/);
  assert.doesNotMatch(buildTurnMessage({ persona: 'vira', history: history.slice(0, 2), studentText: 'ok' }), /must NOT ask/);
});

test('conduct: each persona has its own swearing ladder, strikes end the lesson at the limit', async () => {
  const { buildBrainInstructions, buildTurnMessage, conductAfter, brainSchema } = await import('../../base44/shared/liveTeacherBrain.js');
  assert.ok(brainSchema().required.includes('rude'));
  assert.match(buildBrainInstructions({ persona: 'vira', uiLang: 'uz' }), /I don't like your tone/);
  assert.match(buildBrainInstructions({ persona: 'velvet' }), /go clear your head/);
  const vi = buildBrainInstructions({ persona: 'violet' });
  assert.match(vi, /Get out/);
  assert.match(buildBrainInstructions({ persona: 'violet', uiLang: 'en' }), /Back so soon\? Back to your senses\?/);
  assert.match(vi, /Another curse word\? The F word\?/);
  assert.doesNotMatch(vi, /sovun/);
  assert.doesNotMatch(buildBrainInstructions({ persona: 'vira', uiLang: 'uz' }), /Siz bilan|yuving/);
  assert.match(buildBrainInstructions({ persona: 'violet', ageGroup: 'kid' }), /never "get out"/);
  assert.match(buildTurnMessage({ persona: 'vira', studentText: 'x', strikes: 1 }), /strike 2 of 3/);
  // Violet: first curse ends it. Vira: third. Velvet: second.
  assert.deepEqual(conductAfter('violet', 0, { rude: true, summary: 'x' }).end, true);
  assert.equal(conductAfter('vira', 1, { rude: true }).end, false);
  assert.equal(conductAfter('vira', 2, { rude: true }).end, true);
  assert.equal(conductAfter('velvet', 1, { rude: true }).end, true);
  assert.equal(conductAfter('velvet', 1, { rude: false }).strikes, 1);
  assert.match(conductAfter('violet', 0, { rude: true }).summary, /^ENDED EARLY FOR SWEARING \(Violet/);
});

test('rude: swearing gets no filler (EN/RU/UZ, stretched letters), normal talk is not flagged', async () => {
  const { isRude } = await import('../../src/lib/liveTeacher/fillerMood.js');
  for (const x of ['Fuck you', 'Nah, bro. What the fuck is wrong with you?', 'Бляяя, давай уже', 'иди нахуй', 'сука', 'Sen jalabsan', 'dalbayob', 'fuuuuck', 'shut up']) assert.ok(isRude(x), x);
  for (const x of ['Блин, давай что-то продуктивно', 'I like dictionaries', 'He was a good student', 'I took the bus to school', 'Assalomu alaykum', 'this is boring', 'shutter speed', 'class assessment']) assert.ok(!isRude(x), x);
});

test('casual swearing: roasted, not a strike, until it piles up', async () => {
  const { buildBrainInstructions, conductAfter, brainSchema, CASUAL_FREE, buildTurnMessage } = await import('../../base44/shared/liveTeacherBrain.js');
  assert.ok(brainSchema().required.includes('casual_swear'));
  assert.match(buildBrainInstructions({ persona: 'violet', ageGroup: 'adult' }), /You degenerate/);
  assert.match(buildBrainInstructions({ persona: 'vira' }), /so much energy/);
  assert.match(buildBrainInstructions({ persona: 'violet', ageGroup: 'kid' }), /no roast, no "degenerate"/);
  // Violet (1-strike) does NOT hang up on casual swearing
  const one = conductAfter('violet', 0, { casual_swear: true }, 0);
  assert.equal(one.end, false); assert.equal(one.casual, 1); assert.equal(one.strikes, 0);
  // ...but the one after the free ones counts as a strike
  assert.equal(conductAfter('violet', 0, { casual_swear: true }, CASUAL_FREE).end, true);
  assert.match(buildTurnMessage({ persona: 'vira', studentText: 'x', casual: CASUAL_FREE }), /treat it as rude/);
});

test('masterV0: private read comes first, Bible + If-So bank + drift rule are in the prompt', async () => {
  const { brainSchema, buildBrainInstructions } = await import('../../base44/shared/liveTeacherBrain.js');
  const sc = brainSchema();
  assert.equal(Object.keys(sc.properties)[0], 'read'); // written BEFORE the reply (streaming order)
  assert.ok(sc.required.includes('read') && sc.required.includes('lesson_focus') && sc.required.includes('stage'));
  const vira = buildBrainInstructions({ persona: 'vira' });
  assert.match(vira, /WHO YOU ARE: Vira/);
  assert.match(vira, /YOUR MOODS/);
  assert.match(vira, /IF the student trolls with bathroom, sexual or shock topics/);
  assert.match(vira, /ANYTHING NOT IN THE BANK/);
  assert.match(vira, /BRIDGE/);
  assert.match(vira, /never words to paste/);
  assert.doesNotMatch(buildBrainInstructions({ persona: 'violet' }), /WHO YOU ARE: Vira/);
});

test('masterV0: lesson state tracks drift, mood, patience and her recent lines', async () => {
  const { planAfter, cleanPlan, seedPlan, buildTurnMessage } = await import('../../base44/shared/liveTeacherBrain.js');
  let p = cleanPlan(null);
  assert.equal(p.patience, 80);
  const out = (drift, mood, reply, extra = {}) => ({ read: { drift, her_mood: mood }, reply, lesson_focus: 'past simple', stage: 'practice', addressed_to_teacher: true, ...extra });
  p = planAfter(p, out('tangent', 'amused', '[laughs] Okay, story time.'));
  p = planAfter(p, out('off_lesson', 'firm', 'Nope, not that topic.'), { rude: false });
  assert.equal(p.off_plan, 2);
  assert.equal(p.focus, 'past simple');
  assert.deepEqual(p.moods, ['amused', 'firm']);
  assert.deepEqual(p.recent, ['Okay, story time.', 'Nope, not that topic.']); // tags stripped
  const msg = buildTurnMessage({ persona: 'vira', studentText: 'so anyway', plan: p });
  assert.match(msg, /focus: "past simple"/);
  assert.match(msg, /MUST BRIDGE/);
  assert.match(msg, /amused -> firm/);
  assert.match(msg, /YOUR RECENT LINES[\s\S]*Nope, not that topic/);
  const back = planAfter(p, out('on_track', 'warm', 'Clean sentence!'));
  assert.equal(back.off_plan, 0);
  assert.ok(planAfter(back, out('on_track', 'hurt', 'x'), { rude: true }).patience < back.patience);
  // someone else talking doesn't move the drift counter
  assert.equal(planAfter(p, out('off_lesson', 'warm', 'I will wait.', { addressed_to_teacher: false })).off_plan, 2);
  // a new lesson keeps only her last lines
  const seed = seedPlan(p);
  assert.equal(seed.focus, ''); assert.equal(seed.off_plan, 0); assert.equal(seed.recent.length, 2);
});

test('masterV0: start remembers yesterday\'s lines, every turn saves the plan', async () => {
  const svc = fakeDb();
  const s1 = fakeServices({ brain: brainAnswer({ reply: 'Hi! Tea in hand, ready?' }) });
  const a = await startVoiceLesson({ svc, user: student, body: { persona: 'vira' }, env, fetchImpl: s1.fetchImpl, now: T0 });
  assert.equal(a.status, 200);
  assert.deepEqual(svc.LiveTeacherLesson.rows[0].scores.plan.recent, ['Hi! Tea in hand, ready?']);
  const s2 = fakeServices({ brain: brainAnswer({ reply: 'Story time, in the past tense.', read: { intent: 'escape_lesson', student_mood: 'playful', drift: 'tangent', her_mood: 'amused', move: 'bridge' }, lesson_focus: 'past simple', stage: 'practice' }) });
  const t = await voiceTurnText({ svc, user: student, body: { lesson_id: a.body.lesson_id, text: 'I talked to a girl yesterday.' }, env, fetchImpl: s2.fetchImpl, now: T0 + 60000 });
  assert.equal(t.status, 200);
  const plan = svc.LiveTeacherLesson.rows[0].scores.plan;
  assert.equal(plan.focus, 'past simple');
  assert.equal(plan.off_plan, 1);
  assert.equal(plan.recent.length, 2);
  // next lesson: the brain is shown yesterday's lines so it doesn't reuse them
  const s3 = fakeServices({ brain: brainAnswer({ reply: 'Welcome back!' }) });
  await startVoiceLesson({ svc, user: student, body: { persona: 'vira' }, env, fetchImpl: s3.fetchImpl, now: T0 + 86400000 });
  const greet = s3.calls.filter((c) => c.url.includes('/chat/completions')).pop();
  assert.match(JSON.parse(greet.init.body).messages[1].content, /YOUR RECENT LINES[\s\S]*Story time, in the past tense/);
});

test('masterV0: admins get her read + lesson state back, students do not', async () => {
  const svc = fakeDb();
  const s1 = fakeServices();
  const a = await startVoiceLesson({ svc, user: student, body: { persona: 'vira' }, env, fetchImpl: s1.fetchImpl, now: T0 });
  const s2 = fakeServices({ brain: brainAnswer({ read: { intent: 'learn', student_mood: 'calm', drift: 'on_track', her_mood: 'warm', move: 'praise' }, lesson_focus: 'present perfect', stage: 'practice' }) });
  const st = await voiceTurnText({ svc, user: student, body: { lesson_id: a.body.lesson_id, text: 'I have been working.' }, env, fetchImpl: s2.fetchImpl, now: T0 + 60000 });
  assert.equal(st.body.read, undefined);
  const admin = { ...student, role: 'admin' };
  const ad = await voiceTurnText({ svc, user: admin, body: { lesson_id: a.body.lesson_id, text: 'I have been working.' }, env, fetchImpl: s2.fetchImpl, now: T0 + 70000 });
  assert.equal(ad.body.read.move, 'praise');
  assert.equal(ad.body.plan.focus, 'present perfect');
});

test('masterV0 (bar test): off-plan ladder escalates, live-drama + leaving rows, test counter', async () => {
  const { buildTurnMessage, buildBrainInstructions, planAfter, cleanPlan } = await import('../../base44/shared/liveTeacherBrain.js');
  const msg = (n, tests = 0) => buildTurnMessage({ persona: 'vira', studentText: 'x', plan: { focus: 'past simple', off_plan: n, tests } });
  assert.match(msg(2), /OFF-PLAN 2: this reply MUST BRIDGE/);
  assert.match(msg(3), /OFF-PLAN 3: DROP the story/);
  assert.match(msg(5), /OFF-PLAN 5\+: your deal was already made/);
  assert.doesNotMatch(msg(1), /OFF-PLAN/);
  assert.match(msg(0, 2), /testing you or spinning stories 2 times/);
  const p = buildBrainInstructions({ persona: 'vira' });
  assert.match(p, /during OUR lesson\? suspicious/);
  assert.match(p, /never say "good luck, tell me when you are back"/);
  assert.match(p, /NOT a bridge/);
  let pl = cleanPlan(null);
  pl = planAfter(pl, { read: { intent: 'test_me', drift: 'off_lesson', her_mood: 'amused' }, reply: 'a' });
  pl = planAfter(pl, { read: { intent: 'escape_lesson', drift: 'off_lesson', her_mood: 'firm' }, reply: 'b' });
  assert.equal(pl.tests, 2);
});

test('masterV0 (shop test): deal made once, mood carries into the task, sexual remarks at her = strike', async () => {
  const { buildTurnMessage, buildBrainInstructions, brainSchema } = await import('../../base44/shared/liveTeacherBrain.js');
  const { isRude } = await import('../../src/lib/liveTeacher/fillerMood.js');
  const msg = (n, patience = 70) => buildTurnMessage({ persona: 'vira', studentText: 'x', plan: { focus: 'polite requests', off_plan: n, moods: ['firm'], patience } });
  assert.match(msg(4), /OFF-PLAN 4: name what is going on and make a DEAL/);
  assert.match(msg(6), /OFF-PLAN 5\+: your deal was already made: do NOT repeat it/);
  assert.match(msg(6, 30), /running out of patience/);
  assert.doesNotMatch(msg(6, 70), /running out of patience/);
  const p = buildBrainInstructions({ persona: 'vira' });
  assert.match(p, /shapes the TASK/);
  assert.match(p, /sexual remarks about YOU or a role-play character/);
  assert.match(p, /Never give the same task or the same example sentences two turns in a row/);
  assert.match(brainSchema().properties.rude.description, /sexual remarks/);
  assert.ok(isRude('I need this in order to penetrate you'));
  assert.ok(!isRude('Could you help me find the headphones section?'));
});

test('comeback after a conduct ending: ONLY the check-in question, in the settings language, then stop', async () => {
  const { buildBrainInstructions } = await import('../../base44/shared/liveTeacherBrain.js');
  const vira = buildBrainInstructions({ persona: 'vira', uiLang: 'en' });
  assert.match(vira, /WHOLE first reply is ONLY the comeback check-in, then STOP/);
  assert.match(vira, /Feeling better now\?/);
  assert.match(buildBrainInstructions({ persona: 'violet', uiLang: 'uz' }), /O'zingga keldingmi\?/);
  assert.match(buildBrainInstructions({ persona: 'violet', uiLang: 'ru' }), /В себя пришёл\?/);
});

test('voice direction carries into the second half of a split reply', async () => {
  const { splitSpeech, buildBrainInstructions } = await import('../../base44/shared/liveTeacherBrain.js');
  const r = splitSpeech('[quietly] You keep speaking to me this way, so I am ending the lesson now. Come back tomorrow when you are ready.');
  assert.match(r.first, /^\[quietly\]/);
  assert.equal(r.rest, '[quietly] Come back tomorrow when you are ready.');
  assert.equal(splitSpeech('[firmly] No. [warmly] Okay, try again. Good.').rest.startsWith('['), true);
  assert.equal(splitSpeech('Plain first sentence here. Plain rest.').rest, 'Plain rest.');
  assert.match(buildBrainInstructions({ persona: 'vira' }), /never bright or sunny/);
});

test('quick return after a conduct ending: she notices it was minutes, recap records the behaviour', async () => {
  const { buildTurnMessage, buildBrainInstructions } = await import('../../base44/shared/liveTeacherBrain.js');
  assert.match(buildTurnMessage({ persona: 'violet', start: true, comebackMinutes: 3 }), /3 minute\(s\) ago[\s\S]*QUICK-RETURN/);
  assert.doesNotMatch(buildTurnMessage({ persona: 'violet', start: true, comebackMinutes: 600 }), /QUICK-RETURN/);
  assert.match(buildBrainInstructions({ persona: 'violet', uiLang: 'en' }), /I know people change\. But in a few minutes\? Convince me/);
  assert.match(buildBrainInstructions({ persona: 'vira', uiLang: 'uz' }), /Ertaga degandim-ku/);
  // end-to-end: Violet ends on the first curse, the recap carries the behaviour, a quick return is noticed
  const svc = fakeDb();
  const s1 = fakeServices();
  const a = await startVoiceLesson({ svc, user: student, body: { persona: 'vira' }, env, fetchImpl: s1.fetchImpl, now: T0 });
  const rude = fakeServices({ brain: brainAnswer({ rude: true, end_lesson: true, summary: 'Ended.' }) });
  let t;
  for (let i = 0; i < 3; i++) t = await voiceTurnText({ svc, user: student, body: { lesson_id: a.body.lesson_id, text: 'rude words here' }, env, fetchImpl: rude.fetchImpl, now: T0 + 60000 * (i + 1) });
  assert.equal(t.body.ended, true);
  assert.equal(t.body.recap.conduct.ended_early, true);
  assert.equal(svc.LiveTeacherLesson.rows[0].scores.conduct_end, true);
  const s3 = fakeServices({ brain: brainAnswer({ reply: 'Back already?' }) });
  await startVoiceLesson({ svc, user: student, body: { persona: 'vira' }, env, fetchImpl: s3.fetchImpl, now: T0 + 5 * 60000 });
  const greet = s3.calls.filter((c) => c.url.includes('/chat/completions')).pop();
  assert.match(JSON.parse(greet.init.body).messages[1].content, /QUICK-RETURN/);
});
