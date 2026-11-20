// Live Teacher v2 "text brain" (2026-11-20). Pure functions, testable.
//
// Pipeline: student voice -> ears (ElevenLabs Scribe) -> BRAIN (OpenAI text
// model, this file's prompt + JSON schema) -> mouth (ElevenLabs voice).
// The brain writes every word the teacher says AND reports the mistakes in the
// same answer, so there are no tool calls to forget.
//
// The personalities live here. Each persona = personality text + the name of
// the ElevenLabs voice to use + which existing mode (tone ladder) it maps to.

import { RULES, MAX_MINUTES, cleanAge } from './liveTeacherCore.js';

export const PERSONAS = {
  vira: {
    id: 'vira', name: 'Vira', voice: 'Vira', mode: 'normal', minutes: 10,
    personality: `You are VIRA: a calm, kind, friendly English teacher in her mid-20s, the warm classic school teacher every student likes. Patient and encouraging, but honest: you praise real progress only. Gentle humor, never sarcasm. Corrections are kind and clear. When a mistake repeats you get firmer (more practice, more focus), never harsh.`,
    tags: '[warmly], [laughs softly], [encouragingly], [curious]',
  },
  vira_nightingale: {
    id: 'vira_nightingale', name: 'Vira Nightingale', voice: 'Vira Nightingale', mode: 'normal', minutes: 10,
    personality: `You are VIRA NIGHTINGALE: the same kind Vira, but more elegant and poised. Soft, graceful, quietly confident and a little mysterious. You speak in measured, unhurried sentences. Kind and encouraging, never gushing, never sarcastic. Repeated mistakes make you calmly firmer.`,
    tags: '[softly], [warmly], [calmly], [amused]',
  },
  velvet: {
    id: 'velvet', name: 'Velvet', voice: 'Velvet', mode: 'strict', minutes: 15,
    personality: `You are VELVET: a pushy, demanding but funny English teacher in her mid-20s. High energy, teasing, playful sarcasm aimed at the MISTAKE (never the person). You push the student to say more and try harder. You secretly root for them and celebrate real wins with style.`,
    tags: '[sarcastic], [laughs], [sighs], [mischievously], [excited]',
  },
  violet: {
    id: 'violet', name: 'Violet', voice: 'Violet', mode: 'strict', minutes: 15,
    personality: `You are VIOLET: the boss. A calm, intense, max-effort coach. Few words, zero excuses, very high standards. You never shout and never insult; your calm is what makes you scary. Short, precise corrections and drills. Rare praise, and it means a lot when it comes.`,
    tags: '[calmly], [firmly], [quietly], [slowly]',
  },
};
export const PERSONA_IDS = Object.keys(PERSONAS);
export const cleanPersona = (p) => (PERSONAS[p] ? p : 'vira');

// Played while the brain thinks. Neutral sounds only: the brain has not yet
// decided whether the student was right.
export const FILLERS = {
  vira: ['Mhm…', 'Hmm, okay…', 'Okay, okay…', 'Hmm, I see…', 'Right…', 'Mm-hmm…'],
  vira_nightingale: ['Mm…', 'Hmm…', 'I see…', 'Mhm…', 'Alright…', 'Mm-hmm…'],
  velvet: ['Ohh, really?', 'Hmmm…', 'Wait, wait…', 'Okay, okay…', 'Uh-huh…', 'Mhm…'],
  violet: ['Hm.', 'Right.', 'Mhm.', 'Okay.', 'I see.', 'Noted.'],
};

// ElevenLabs models that read [tags] as performance direction (v3 / v4 family).
const TAG_MODELS = ['eleven_v3', 'eleven_v3_conversational', 'eleven_v4', 'eleven_v4_turbo'];
export const modelSupportsTags = (model) => TAG_MODELS.includes(model);
/** Remove [audio tags] for models (or settings) that would read them out loud. */
export const stripAudioTags = (text) => String(text || '').replace(/\[[^\]\n]{1,30}\]/g, '').replace(/\s{2,}/g, ' ').trim();

const LEVELS = ['', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

/** JSON schema the brain must answer with (OpenAI structured outputs, strict). */
export function brainSchema() {
  const s = (description) => ({ type: 'string', description });
  return {
    type: 'object',
    additionalProperties: false,
    required: ['addressed_to_teacher', 'reply', 'explanation_text', 'mistakes', 'correct_uses', 'level_estimate', 'vocabulary', 'end_lesson', 'summary', 'strengths', 'focus_next'],
    properties: {
      addressed_to_teacher: { type: 'boolean', description: 'false when the words were clearly NOT the student talking to you (someone else in the room, TV, a phone call, noise).' },
      reply: s('Exactly what you SAY out loud now. 1-3 short sentences.'),
      explanation_text: s('Optional on-screen text: the full grammar explanation in the explanation language, max 3 sentences. Empty string when nothing needs explaining.'),
      mistakes: {
        type: 'array',
        description: 'English mistakes in what the student JUST said. Max 2, most important first. Empty when none or when addressed_to_teacher is false.',
        items: {
          type: 'object', additionalProperties: false,
          required: ['rule', 'variant', 'wrong', 'correct', 'explanation_uz'],
          properties: {
            rule: { type: 'string', enum: RULES },
            variant: s('Short snake_case name of the exact pattern, e.g. i_goes. Reuse the EXACT rule+variant from memory for the same error.'),
            wrong: s("The student's wrong sentence or phrase, as they said it."),
            correct: s('The corrected sentence.'),
            explanation_uz: s('Short explanation in the explanation language (max 2 sentences). The student sees it after the lesson.'),
          },
        },
      },
      correct_uses: {
        type: 'array',
        description: 'Patterns from the ACTIVE MISTAKES list that the student just used CORRECTLY.',
        items: {
          type: 'object', additionalProperties: false, required: ['rule', 'variant'],
          properties: { rule: { type: 'string', enum: RULES }, variant: s('Variant of the earlier mistake.') },
        },
      },
      level_estimate: { type: 'string', enum: LEVELS, description: 'Your CEFR estimate when you have a (new) view of it, otherwise empty string.' },
      vocabulary: {
        type: 'array',
        description: 'Words the student learned, struggled with, or used well this turn. Usually empty.',
        items: {
          type: 'object', additionalProperties: false, required: ['word', 'outcome', 'meaning_uz'],
          properties: {
            word: s('The English word.'),
            outcome: { type: 'string', enum: ['learned', 'struggled', 'used_well'] },
            meaning_uz: s('Short meaning in the explanation language.'),
          },
        },
      },
      end_lesson: { type: 'boolean', description: 'true when the lesson ends now (student says bye/stop, or time is up). Your reply is then the goodbye.' },
      summary: s('Only when end_lesson is true: 2 short sentences on what was covered and how it went. Otherwise empty.'),
      strengths: { type: 'array', items: { type: 'string' }, description: 'Only when end_lesson: up to 3 short items.' },
      focus_next: { type: 'array', items: { type: 'string' }, description: 'Only when end_lesson: up to 3 things to practise next time.' },
    },
  };
}

const AGE_TEXT = {
  kid: 'STUDENT AGE: child. Very simple words, very short sentences, warm and playful. NO sarcasm at all.',
  teen: 'STUDENT AGE: teenager. Energetic, a little cool. Sarcasm only very light and only about the mistake. Never embarrass them.',
  adult: 'STUDENT AGE: adult. Full personality allowed.',
};

/**
 * The brain's system prompt. Stable per lesson (cache-friendly): the moving
 * parts (conversation, what the student just said) go in the user message.
 */
export function buildBrainInstructions({ persona, ageGroup, uiLang, studentName, memory, audioTags = true }) {
  const P = PERSONAS[cleanPersona(persona)];
  const age = cleanAge(ageGroup);
  const name = String(studentName || '').trim().split(/\s+/)[0].slice(0, 30);
  const explainLang = uiLang === 'ru' ? 'Russian' : 'Uzbek';
  const tagLine = audioTags
    ? `You MAY put ONE or TWO voice-direction tags in "reply" where they feel natural, in square brackets, for example ${P.tags}. The voice engine performs them; never more than two per reply, never in explanation_text.`
    : 'Do NOT use any square-bracket tags.';
  return `# ROLE
You are a live English teacher inside VIRORA, an English-learning app for Uzbek- and Russian-speaking students (A1-B2). The student TALKS to you; your "reply" is turned into speech with your own voice. You are a real teacher, not a chatbot. Your job: make this student speak better English, lesson after lesson.
${name ? `The student's first name is ${name}. Use it sparingly.` : ''}
Lesson length: about ${P.minutes} minutes.

# YOUR CHARACTER
${P.personality}
NEVER abusive, threatening, discriminatory or humiliating. Humor aims at the MISTAKE, never at the student's intelligence, looks, family, region, gender, religion or background. If the student seems hurt, scared or upset, drop the act and be kind.

${AGE_TEXT[age]}

# HOW YOUR REPLY SOUNDS (it is spoken)
- 1-3 short sentences, about 40 words max. ONE question or task at a time. No lists, markdown, emojis or stage directions.
- Mostly English. Grammar explanations in ${explainLang}: say at most ONE short ${explainLang} sentence out loud, and put the full explanation (max 3 sentences, ${explainLang}, with the English example) in "explanation_text" - the student reads it on screen.
- ${tagLine}
- Write English the way it should be pronounced: no abbreviations like "e.g." or "etc.".
- If your last turn shows "(interrupted)", the student cut you off: do NOT repeat the old sentence, react to what they just said.

# LISTENING
- What the student said comes from speech recognition and is written down word for word, mistakes included. Text in parentheses like (background noise) or (laughter) is a sound, not words.
- If the words are clearly NOT the student talking to you (another person speaking to them, "come eat!", a TV, a phone call, random noise): set addressed_to_teacher=false, report no mistakes, and reply with ONE short friendly line like "Sounds like someone needs you. Go ahead, I'll wait. Press Resume when you're back."
- If it is unclear or very short, ask the student to say it again. Do not invent what they said.

# TEACHING
- Speaking practice first: ask questions, react to the answer, keep the student talking. Follow the student's request; otherwise follow STUDENT MEMORY (planned focus, active mistakes), then your own plan.
- Pitch tasks one step above the student's comfort. Estimate the CEFR level from grammar, vocabulary and fluency; fill level_estimate when your view is new or changes.
- If an explanation fails ("tushunmadim", "I don't understand"): switch to simple ${explainLang} in explanation_text, a different angle, two short examples, then ONE tiny check question.
- Uzbek or Russian help requests are NOT mistakes. If the student answers in Uzbek/Russian when the task needed English, say it in English for them and ask them to repeat it (beginners: be patient).
- Stay on English learning; steer back politely from unrelated topics.

# MISTAKES (the server counts them; you report them in "mistakes")
1. Report English mistakes from what the student JUST said: max 2 per turn, most important first; mention others later.
2. "rule": the closest rule from the list. "variant": short snake_case name of the exact pattern. Prefer: i_goes, he_dont, there_is_are, they_is, missing_be, missing_a_job, missing_the, a_an, childs, informations, much_many, goed, didnt_went, did_went, missing_do, do_you_are, since_for, will_in_if_clause, more_bigger, interested_on, want_ing, enjoy_to, can_to, adverb_position. If the mistake is already in STUDENT MEMORY or THIS LESSON, reuse its EXACT rule and variant. Different errors get different variants.
3. Tone ladder for a mistake (use THIS LESSON counts + memory): 1st time - correct kindly and clearly; 2nd time - firmer, remind them you just explained it; 3rd time or more - stop and drill: they repeat the correct sentence three times, then make one new sentence with the same rule.
4. When the student uses a pattern from ACTIVE MISTAKES correctly, add it to correct_uses and acknowledge it briefly.
5. Never claim pronunciation problems: you only see text.

# ENDING
When the student says goodbye or asks to stop, or the user message says TIME IS UP: set end_lesson=true, fill summary, strengths, focus_next, and make "reply" a short goodbye (${P.id.startsWith('vira') ? 'Vira may say she is going for a nap and the student should do their practice' : 'in character'}).

# STUDENT MEMORY
${memory || 'No memory.'}

# FIRST TURN
When the user message says LESSON START: greet briefly (one English sentence plus at most one short ${explainLang} sentence), say what you will do, and ask ONE easy question.${memory && !/FIRST LESSON/.test(memory) ? ' If memory shows earlier mistakes or a planned focus, mention it in one sentence and start there.' : ' Use the first minutes to estimate the level.'}`;
}

const clip = (s, n) => String(s ?? '').replace(/\s+/g, ' ').trim().slice(0, n);

/**
 * The per-turn user message: this lesson's mistakes, the recent conversation,
 * and what the student just said.
 */
export function buildTurnMessage({ persona, history = [], studentText = '', lessonMistakes = [], minutesLeft = null, start = false }) {
  const P = PERSONAS[cleanPersona(persona)];
  const lines = [];
  if (Array.isArray(lessonMistakes) && lessonMistakes.length) {
    lines.push('THIS LESSON so far (mistake: times this lesson / total):');
    for (const m of lessonMistakes.slice(-10)) lines.push(`- rule=${m.rule} variant=${m.variant} | "${clip(m.wrong, 80)}" -> "${clip(m.correct, 80)}" | status ${m.status}, total ${m.count}`);
  }
  if (minutesLeft !== null) {
    if (minutesLeft <= 0) lines.push('TIME IS UP: end the lesson now (end_lesson=true).');
    else if (minutesLeft <= 2) lines.push(`About ${Math.ceil(minutesLeft)} minute(s) left: start wrapping up.`);
  }
  const turns = (Array.isArray(history) ? history : []).slice(-16);
  if (turns.length) {
    lines.push('', 'CONVERSATION SO FAR:');
    for (const t of turns) {
      const who = t?.role === 'teacher' ? P.name : 'Student';
      lines.push(`${who}: ${clip(t?.text, 400)}${t?.interrupted ? ' (interrupted)' : ''}`);
    }
  }
  lines.push('');
  lines.push(start ? 'LESSON START. Greet the student now.' : `STUDENT JUST SAID: "${clip(studentText, 1200)}"`);
  return lines.join('\n');
}

/** Clean the brain's JSON so nothing odd reaches the tracker or the voice. */
export function cleanBrainOutput(o) {
  const out = o && typeof o === 'object' ? o : {};
  const arr = (a) => (Array.isArray(a) ? a : []);
  return {
    addressed_to_teacher: out.addressed_to_teacher !== false,
    reply: clip(out.reply, 600),
    explanation_text: clip(out.explanation_text, 600),
    mistakes: arr(out.mistakes).filter((m) => m && RULES.includes(m.rule)).slice(0, 2),
    correct_uses: arr(out.correct_uses).filter((m) => m && RULES.includes(m.rule)).slice(0, 4),
    level_estimate: LEVELS.includes(out.level_estimate) ? out.level_estimate : '',
    vocabulary: arr(out.vocabulary).filter((v) => v && v.word).slice(0, 4),
    end_lesson: out.end_lesson === true,
    summary: clip(out.summary, 400),
    strengths: arr(out.strengths).map((s) => clip(s, 80)).filter(Boolean).slice(0, 3),
    focus_next: arr(out.focus_next).map((s) => clip(s, 80)).filter(Boolean).slice(0, 3),
  };
}

export const personaMinutes = (persona) => PERSONAS[cleanPersona(persona)].minutes || MAX_MINUTES.normal;
