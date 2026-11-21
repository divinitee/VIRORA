# Wave C audit — MED + LOW fixes (Claude, 21 Nov 2026)

Source: VIRORA wave C (B1) grammar audit, 20 Nov 2026 (Tee's other Claude chat; pasted by Tee 21 Nov).
HIGH rows were fixed on 20 Nov (branches grammar-wave-c-fixes and grammar-wave-c-base44).
This branch (grammar-wave-c-audit-medlow) fixes the 27 MED + 46 LOW rows. No gate, test or lint file was touched.
Tool added: grammar-run/tools-claude/addacc.py (adds accepted answers to an authored file through an AUDIT_ACC block).

## Main (Claude's 37)
- didnt-use-to: "didn't used to" is a wrong option in 4 choose items only (was 20); the rest use doesn't use to / wasn't used to. t06 kept.
- timetable-simple t09: accepts "do the exams".
- past-perfect-experience: t01 accepts "had never been", t03 "had never tried"; c06 → "stayed near the shore because…"; build "boxing" → "chess".
- since-clause: c11 → "has lost five kilos since…" (no state verb); t10 accepts "ate", "my morning tea" → "a snack".
- unfinished-time t12: accepts "has drunk".
- continuous-present-result t03: accepts "have been making".
- fewer-less: why says "in careful English use fewer (people often say less in speech)".
- progressive-comparative: already fixed 20 Nov (no "more and more X" distractor; b16 / t15 accept it).
- the-more-the-more: b15 cue (quick) → (fast), key "The faster"; t13 → "As it gets later…" (The later / the more tired), because array keys cannot accept "The closer".
- must-present b03 → "She ___ (be) very good at languages"; girlfriend / clubs already gone.
- cant-present: c11 "a brother" → "three brothers"; b18 → "The tank ___ (be) empty".
- should-have c14 / unless b02: listener names are now pool names, so the inner name slot cannot clash (name-clash 0).
- have-to-past: instruction → "Complete with had to (or didn't have to)…".
- be-able-to: b10 "came over" → "came to the city"; t12 "no school" → "no car".
- modal-passive c19: "complete" → "sign" (must be signed; "must be complete" is an adjective).
- if-i-were-you: c20 / b19 crime lines → hot day / strong sun in the car; b04 → "It's your {mother}'s birthday… call her".
- second-if-clause: t04 city slot → job slot (as a guide / for that company…); b12 travel time → "arrive at the {event} much faster".
- unless: t11 accepts wear / bring / have; t12 "unless we hurry"; t13 "unless we book".
- agent-by: lock / door lines use spare key / card / hairpin (no knife, hammer, metal bar); "stolen by two young men" → "repaired by"; t04 "in the bus" → "in the square"; Nikon / Kodak / GoPro → film camera / digital camera / tablet; b17 finger → ruler.
- no-passive-intransitive t10: "safe" → "shop".
- present-perfect-passive: break and sell lines no longer offer "has broken / has sold / have sold" (intransitive, correct English); a wrong agreement or -ing form instead.
- modal-be-pp: knife → pair of scissors.
- backshift-present c17 / c20 / b17 / b20 / t11 / t13: the state is clearly over ("…but it works now", "They fixed it on Friday").
- backshift-past: instruction → "Use the past perfect (had + past participle)"; b16 language / city slots untied ("on the trip"); theft lines → "took … by mistake"; t01–t05 accept he'd / she'd / they'd forms.
- backshift-will: c07 / b07 "…They went up in June."; c12 / b14 "…But they sold it this spring."; two-gap time items t11 / t12 / t15 now use that night / that day (one answer each); "mayor" → "headteacher".
- reported-wh-question: t05 accepts "how to get"; every had / would key also accepts the 'd form (I'd bought, he'd left, I'd come…).
- reported-yes-no: same 'd forms (if I'd seen, if I'd locked, if we'd been, if I'd be, if I'd paid).

## Base44 lane (C1–C23)
- C3 each-every: why says "in careful English the verb is singular".
- C5 both-either-neither c03: "…, but not both".
- C6 question-preposition b01: accepts "with".
- C8 embedded-if-whether: t06 accepts if / whether you have finished / you've finished / you finished; b09 / b18 end with "."; "every week" dropped.
- C11 although-despite: t07 accepts "he felt tired"; t02 accepts "feeling ill".
- C15 whose c16 / t03: the city comes first ("In {city} they live in a {house} whose roof…").
- C18 another-other: boxing → basketball.
- C20 the-other-others: b14 "one of my five {keys}" (no sock pair); b15 "carry all ______".
- C22 reciprocal: c03 "met at university and have helped ______ with {homework} ever since"; c20 "slipped …, one after the other", "each other" no longer an option there; "fight about money" → "argument about money"; the "fell in love" create item → "two friends who help each other".
- Left as is: C6 t01 (instruction says everyday English), C10 harmless extra acceptables.

## Also
- stop-gerund: removed a dead draft line (it was filtered out and never reached the bank).
- Re-checked all 80 wave C topics: name-clash 0 everywhere; no mosque / girlfriend / lottery / mayor / minister / thief / boxing / brand / weapon words left in the content files.
