import { useCallback, useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { availableTopics } from "@/lib/grammarPractice";
import { passedTopics, lessonsCompleted, pathState } from "@/lib/learnerPath";

// The one learner path (src/lib/learnerPath.js) for the signed-in student.
// Reads the student's own GrammarAttempt and StudentProgress rows (both
// readable under RLS) and derives the path state. Nothing is written.
//
//   state     { stops, next, total, done, unit } or null while loading / on failure
//   loading   first load still running
//   failed    the read failed: callers fall back to their old behaviour
//   refresh   re-read (after a round or a lesson)
//   withPassed(key)  the state as it will be once `key` is passed, for the
//                    result screen, which can't wait for the server's rows
export function useLearnerPath(email) {
  const available = useMemo(() => new Set(availableTopics()), []);
  const [data, setData] = useState(null); // { passed:Set, lessonsDone:number }
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

  const state = useMemo(() => (data ? pathState({ available, ...data }) : null), [data, available]);

  const withPassed = useCallback((key) => {
    const passed = new Set(data?.passed || []);
    if (key) passed.add(key);
    return pathState({ available, passed, lessonsDone: data?.lessonsDone || 0 });
  }, [data, available]);

  return { state, loading: !!email && !data && !failed, failed, refresh, withPassed, available, passed: data?.passed || null };
}
