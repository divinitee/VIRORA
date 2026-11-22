# Live Teacher: AI English voice teacher

Branch: `feature/live-teacher` (NOT merged into `main`). Page: `/live-teacher`.

A real-time VOICE lesson with a strict, bilingual (English + Uzbek) AI English teacher that remembers each student's mistakes between lessons.

## What was built

| Piece | File |
|---|---|
| Teacher personality, modes, tool definitions, OpenAI session config | `base44/shared/liveTeacherPrompt.js` |
| Mistake tracker (new / repeated / relapse / mastered), tone ladder, level, pronunciation, vocabulary, memory summary | `base44/shared/liveTeacherCore.js` |
| Server steps of a lesson (start, tool, end, profile) | `base44/shared/liveTeacherEngine.js` |
| Backend function (login, ban check, daily allowance) | `base44/functions/liveTeacherApi/entry.ts` |
| Database | `base44/entities/LiveTeacherProfile.jsonc`, `LiveTeacherLesson.jsonc` (+ `live_teacher_session` bucket in `UsageReservation`, both entities added to the wipe map `userDataMap.js`) |
| Voice link (WebRTC to OpenAI) | `src/lib/liveTeacher/realtimeClient.js` |
| Screen | `src/pages/LiveTeacher.jsx`, copy in `src/lib/liveTeacher/copy.js` (uz / ru / en), route in `src/App.jsx` |
| Tests | `tools/live-teacher-tests/` |

The backend is a Base44 function (the app's existing backend), not a separate FastAPI service: login, bans, plan limits and the database are already there.

## How a lesson works

```
Browser                         liveTeacherApi (Base44)                OpenAI
  |-- start(mode, age) ------------>|  daily allowance check                |
  |                                 |-- POST /v1/realtime/client_secrets -->|  (permanent key, server only)
  |<-- short-lived secret ----------|<-- ek_... ----------------------------|
  |== WebRTC: mic + teacher voice, JSON events =========================== >|  (secret only)
  |   teacher hears a mistake -> tool call log_mistake
  |-- tool(log_mistake) ----------->|  counts it, decides tone, saves
  |<-- {status, level, tone, directive}                                      |
  |   (sent back to the model, which answers in that tone)
  |-- tool(end_lesson) / end ------>|  saves summary, progress, level
```

Why the server counts mistakes: the model hears the student and names the mistake (`rule` from a fixed list + a short `variant`, e.g. `i_goes`), but the SERVER keeps the counter and decides how strict to be, so counts cannot drift or be forgotten mid-conversation.

### Mistake tracking

- **new**: first time -> level 1, patient, explain in Uzbek.
- **repeated**: seen before. Inside one lesson the level climbs 1 -> 2 -> 3 -> 4. A mistake carried over from an earlier lesson starts at level 2.
- **relapse**: the student had mastered it (3 correct uses in a row after the last mistake) and it came back.
- Different mistakes are different: a mistake is identified by its `rule` + `variant` (stored under a dot-free key). If the model's variant name drifts but the wrong sentence is the same, it is still the same mistake. The active mistake list (exact rule + variant) is in the teacher's prompt every lesson so the model reuses the same keys.

| Level | Strict mode | Normal mode | Exam mode |
|---|---|---|---|
| 1 | patient, correct + Uzbek explanation | same | silent, no correction |
| 2 | stricter, quotes the earlier explanation, demands a repeat | firm but friendly | silent |
| 3 | playful strict, light sarcasm at the MISTAKE, repeat + extra exercise | warm, no sarcasm, repeat + exercise | silent |
| 4 | repeat 3x slowly + mini-drill, mock despair allowed | kind drill | silent |

Children never get sarcasm (the strict rungs become gentle). Strictness is never abusive: this is in the prompt and in the directives.

## Setup (once)

1. OpenAI: create an API key at platform.openai.com (add billing, set a **monthly budget limit**).
2. Base44 dashboard -> the app -> secrets: add `OPENAI_API_KEY`. Never put it in code, `.env.local` that is committed, or the browser.
3. Optional secrets (no code change): `LIVE_TEACHER_MODEL` (default `gpt-realtime-2`; `gpt-realtime-mini` is cheaper), `LIVE_TEACHER_VOICE` (default `marin`; also `cedar`), `LIVE_TEACHER_REASONING` (default `low`; set empty to omit), `LIVE_TEACHER_TRANSCRIBE_MODEL` (default `gpt-4o-transcribe`), `LIVE_TEACHER_MAX_OUTPUT` (default `1500` output tokens per response, audio + reasoning).
4. Publish the branch from the Base44 dashboard, open `/live-teacher` in Chrome or Safari, allow the microphone.

Costs: voice is billed per audio token (launch pricing was reported as about $32 per 1M audio input tokens and $64 per 1M audio output tokens for `gpt-realtime-2`; check the current OpenAI pricing page). No lesson cost has been measured yet: run a few test lessons and read the OpenAI usage dashboard before opening this to students. Limits in code (`liveTeacherCore.js`): `MAX_MINUTES` (normal 15, strict 15, exam 12) and `DAILY_SESSIONS` (free 1, learner 3, vip 10 per day; admins unlimited). These are placeholder business decisions for the owner to change.

## Privacy

Stored: CEFR estimate, mistake records (wrong/correct sentence, short Uzbek explanation), pronunciation and vocabulary notes, exam scores, per-lesson counters and a 2-sentence summary. NOT stored: audio and conversation transcripts (the transcript on screen lives only in the browser tab). During a lesson the audio is processed by OpenAI. Both new entities are in `userDataMap.js` so the existing account wipe removes them (`python3 tools/check_wipe_coverage.py` passes). The browser gets the student's own profile only. Add the Live Teacher / OpenAI processing to the Privacy page before launch.

## Tests

```
node --test tools/live-teacher-tests/*.test.mjs   # no key, no network
OPENAI_API_KEY=sk-... node tools/live-teacher-tests/scenarios.mjs                             # real model, text mode
```

`core.test.mjs` / `engine.test.mjs` (25 tests): scenarios 1, 2, 8 and the modes, mastery/relapse, memory, key safety, lesson ownership, limits, against an in-memory database and a fake OpenAI.
`scenarios.mjs`: runs scenarios 1-5 and 8 against the real model with the real prompt and tracker. Tone and humour need a human read.

### Voice checklist (needs a microphone; scenarios 6 and 7 can only be tested here)

1. Say "I goes to school." -> teacher corrects, explains in Uzbek.
2. Repeat it 3 times -> 2nd: stricter + reminds, 3rd: playful strict + asks you to repeat + extra exercise.
3. Answer in Uzbek only -> teacher gives the English version and asks you to repeat in English.
4. Say "Tushunmadim" after an explanation -> a NEW explanation in simple Uzbek, not the same words.
5. Ask "difference between present perfect and past simple?" -> a clear analytical answer.
6. Start talking while the teacher speaks -> she stops at once and reacts to you.
7. Mispronounce "think" (say "sink") -> she logs it and models the word slowly; the Mistakes panel does not break.
8. End, start again -> she greets you with your earlier mistake and level.

## Not verified yet (be honest before launch)

- **Nothing has been run against the real OpenAI voice API**: the build environment has no network. The request shapes follow the current Realtime GA docs (`/v1/realtime/client_secrets`, `/v1/realtime/calls`, data channel `oai-events`), but the first live run may reveal a rejected field (e.g. `reasoning`, `semantic_vad`, the transcription model). Admins see OpenAI's error text on the start screen to make this quick to fix. The three session knobs are env-configurable.
- **Uzbek speech understanding quality is unknown.** OpenAI has not published a full language list for the realtime model. If Uzbek recognition is weak, the fallback is to rely on typed Uzbek help or a separate transcription step.
- The front end was syntax-checked and the logic unit-tested, but `npm run build` / `npm run lint` were not run (dependencies could not be installed offline). Run them before merging.
- A voice session cannot be force-closed from the server; the page ends it at the time limit and the server stops accepting tool calls 5 minutes after the limit. A student who tampers with the page could stay connected until the token's session limit.
- Lessons whose connection never opened stay as `started` rows (harmless; not counted).
- No entry point on Home / bottom tab yet: only the `/live-teacher` route. Decide: Home quick action, or a tab.
- No admin view of Live Teacher usage yet.

## v2: "text brain" lessons (2026-11-20, page /live-teacher-v2)

Student voice -> ElevenLabs Scribe (word-for-word transcript) -> OpenAI text model
(the brain: reply AND mistakes in one strict-JSON answer) -> existing mistake
tracker -> ElevenLabs voice of the chosen persona. No tool calls to forget.

- Server: `base44/shared/liveTeacherVoiceEngine.js` (actions `v2_start`, `v2_turn`,
  `v2_fillers` in `liveTeacherApi`; `end`/`profile` shared with v1).
- Personas + prompt + JSON schema: `base44/shared/liveTeacherBrain.js`
  (Vira 10 min, Vira Nightingale 10 min, Velvet 15 min, Violet 15 min).
- Browser: `src/lib/liveTeacher/voiceLoop.js` (16 kHz WAV per turn, VAD with
  0.5 s pre-roll, interruptions, push-to-talk) + `src/pages/LiveTeacherV2.jsx`.
- Voices: an ElevenLabs voice named exactly `Vira`, `Vira Nightingale`, `Velvet`,
  `Violet` (or env `LIVE_TEACHER_VOICE_<PERSONA>` = voice id).
- Secrets/env: `OPENAI_API_KEY`, `ELEVENLABS_API_KEY` (TTS + STT + Voices read).
  Optional: `LIVE_TEACHER_BRAIN_MODEL` (default gpt-5.6-terra),
  `LIVE_TEACHER_BRAIN_REASONING` (default low), `LIVE_TEACHER_TTS_MODEL`
  (default eleven_v4_turbo), `LIVE_TEACHER_STT_MODEL` (default scribe_v3),
  `LIVE_TEACHER_AUDIO_TAGS=0` to switch off [warmly]-style voice tags.
- Cost estimate per lesson: `LiveTeacherLesson.scores.usage` (cost_usd, stt/brain/tts
  split, tokens, turns). No schema change was needed.
- Lab for comparing ears/mouth providers: `/live-teacher-lab` (admin only).

### v2 fast path (2026-11-20 evening)
- The phone streams the student's voice to ElevenLabs **Scribe Live** while they talk
  (single-use `realtime_scribe` pass from `v2_start` / `v2_tokens`), commits when the
  local VAD hears the end, and sends only TEXT to `v2_turn_text`.
- The teacher's reply is streamed straight to the phone over the ElevenLabs
  **Text to Dialogue WebSocket** (eleven_v4_turbo, raw PCM 22.05 kHz, single-use
  `tts_websocket` pass returned with every reply) and played as it arrives.
- Backups (automatic): no live transcript -> upload WAV to `v2_turn`; voice stream
  fails twice -> `v2_speak` returns an MP3. The admin sees why in a yellow note.
- Thinking sounds: 5 moods x 5 lines per persona (`FILLERS` in liveTeacherBrain.js),
  mood picked on the phone from the transcript (`src/lib/liveTeacher/fillerMood.js`),
  a "hold" line after ~2.6 s, cached in localStorage (`lt-fillers:v3:<persona>`).
- Prompt: LESSON SHAPE (warm-up, focus, practice, wrap-up), MOVES (react+share,
  mini task, game, role-play, correct+continue, question at most every second
  reply), topic budget of 2-3 follow-ups.
- Hot path skips the ban lookup (checked at v2_start) and runs DB reads/writes in parallel.

### v2 fast path, revised after the first live test (2026-11-20 night)
- Scribe Live heard natural/accented speech badly ("呃…some part of you"), and the
  Text to Dialogue WebSocket refused the `tts_websocket` pass (`invalid_token_type`).
- Ears now: the phone posts each finished turn (WAV) straight to ElevenLabs batch
  Scribe v3 with a single-use `batch_scribe` pass (a fresh one comes back with every
  reply). Same accuracy as the first version, no audio through our server.
- Voice now: the brain is streamed; the moment the "reply" field is written, the
  server voices its first sentence (in parallel with the rest of the JSON and the DB
  writes) and returns it inside the turn answer; the phone fetches `rest_text` via
  `v2_speak` while the first sentence plays.
- `liveStreams.js` still holds the live-ears / streamed-voice code (unused) for later.

## masterV0 Phase 1 (2026-11-20 night)

Plan: claude.ai doc "masterV0: Making Vira Human". Phase 1 shipped on the branch:

- `base44/shared/liveTeacherBible.js`: Vira Bible (identity, values, humour, habits with budgets, never-list),
  mood table, If-So bank (intent -> goal -> principles, no lines to copy), the 4-question improvisation rule,
  variation rules, drift = acknowledge then bridge. Personality log at the top of the file.
- Brain schema: private `read` {intent, student_mood, drift, her_mood, move} is written BEFORE `reply`;
  `lesson_focus` + `stage` after it.
- Lesson state in `LiveTeacherLesson.scores.plan`: focus, stage, off_plan, moods (last 4), patience 0-100,
  recent (her last 8 lines). The next lesson starts with the previous lesson's last 6 lines, so she does not
  reuse them. Turn message shows LESSON PLAN, YOUR MOOD SO FAR, YOUR RECENT LINES; off_plan >= 2 forces a bridge.
- Strike steps are now "gist + Tee's key phrase", built fresh each time.
- ElevenLabs 429 "system busy": one 400 ms retry for TTS (server) and direct ears (phone) before the backup path.
- Admins see her read + lesson state under the timing line.
Prompt ~4.7k tokens (cached after the first turn). Next: Phase 2 regression suite.

## masterV0 Phase 3: lesson focus picker (2026-11-22)

`base44/shared/liveTeacherFocus.js` (pure, tested in `tools/live-teacher-tests/focus.test.mjs`).
At `v2_start` the engine reads (bounded, best effort): LiveTeacherProfile.mistakes (speaking), LearnerItem
grammar rows (Coach Engine practice), AssessmentResult (AI-graded written answers), LearnerWordState
(weakest words). Everything maps to ~25 FAMILIES (each source names topics differently: rule keys,
taxonomy prefixes, subskill text). Score = frequency (recency-weighted, 60-day cut) x spread (1-3 skills)
x basics (family level vs student level) x readiness (30-80% right = 1.0) x due (last 2 lessons' focus x0.4).
Output: one focus (+ the student's own wrong->right examples) and one 1-minute warm-up review (an old
speaking mistake from another family, else a weak word). The brain gets it as TODAY'S FOCUS at LESSON START;
plan.focus_key is saved so the next lessons space it out. Lesson arc: warm_up 10% / notice 20% / practice 30% /
free_talk 30% / wrap_up 10%; each turn shows BY THE CLOCK. Admins see "focus pick: ... why ..." in the UI.
Support language by level (same day): A1-A2 instructions in Uzbek/Russian, unknown starts bilingual, B2+ English.
