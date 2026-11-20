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
