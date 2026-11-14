import { useCallback, useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { availableTopics } from "@/lib/grammarPractice";
import { passedTopics, lessonsCompleted, pathState } from "@/lib/learnerPath";

// The one learner path (src/lib/learnerPath.js) for the signed-in student.
// Reads the student's own GrammarAttempt and StudentProgress rows (both
// readable under RLS) and derives the path state. Nothing is written to the
// server from here.
//
//   state       { stops, next, total, done, unit } or null while loading / on failure
//   loading     first load still running
//   failed      the read failed: callers fall back to their old behaviour
//   passed      Set of passed topic keys (null until loaded)
//   refresh     re-read (after a lesson)
//   markPassed  (key) remember a stop the student has just passed
//   withPassed  (key) the state as it would be with `key` passed (for a render
//               that can't wait for markPassed's state update)
//
// Why markPassed exists: a practice round is saved in the background, so for a
// second or two after a round the server rows don't show it yet. Without this,
// a student who just passed a stop would go Home and see Continue still
// pointing at the same stop. The just-passed keys are kept for this browser
// tab only (sessionStorage) and merged with what the server says.
const LOCAL_KEY = "virora_path_passed";
function readLocal() {
  try {
    const v = JSON.parse(sessionStorage.getItem(LOCAL_KEY) || "[]");
    return Array.isArray(v) ? v.filter((k) => typeof k === "string") : [];
  } catch { return []; }
}
function writeLocal(keys) {
  try { sessionStorage.setItem(LOCAL_KEY, JSON.stringify(keys)); } catch { /* private mode: the server rows still arrive */ }
}

export function useLearnerPath(email) {
  const available = useMemo(() => new Set(availableTopics()), []);
  const [data, setData] = useState(null); // { passed:Set (server), lessonsDone:number }
  const [local, setLocal] = useState(readLocal);
  const [failed, setFailed] = useState(false);

  const refresh = useCallback(async () => {
    if (!email) return;
    try {
      const [attempts, progress] = await Promise.all([
        base44.entities.GrammarAttempt.filter({ user_email: email, game: "grammar_practice" }, "-round_at", 2000),
        base44.entities.StudentProgress.filter({ user_email: email }),
      ]);
      setData({ passed: passedTopics(attempts || []), lessonsDone: lessonsCompleted(progress || []) });
      setFailed(false);
    } catch (e) {
      console.error("learner path load failed", e);
      setFailed(true);
    }
  }, [email]);

  useEffect(() => { refresh(); }, [refresh]);

  const passed = useMemo(() => (data ? new Set([...data.passed, ...local]) : null), [data, local]);
  const state = useMemo(
    () => (data ? pathState({ available, passed, lessonsDone: data.lessonsDone }) : null),
    [data, passed, available]
  );

  const markPassed = useCallback((key) => {
    if (!key) return;
    const next = [...new Set([...readLocal(), key])];
    writeLocal(next);
    setLocal(next);
  }, []);

  const withPassed = useCallback((key) => {
    const p = new Set(passed || []);
    if (key) p.add(key);
    return pathState({ available, passed: p, lessonsDone: data?.lessonsDone || 0 });
  }, [passed, data, available]);

  return { state, loading: !!email && !data && !failed, failed, refresh, markPassed, withPassed, available, passed };
}
