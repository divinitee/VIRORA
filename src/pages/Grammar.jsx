import PageLoader from "@/components/loading/PageLoader";
import LoadingTransition from "@/components/loading/LoadingTransition";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { DOMAINS } from "@/lib/adaptiveGrammar";
import { GRAMMAR_NAV } from "@/lib/grammarTiers";
import { DOMAIN_STATE, domainState } from "@/lib/grammarMapState";
import { loadTopic, topicKey, availableTopics } from "@/lib/grammarPractice";
import { topicStatuses } from "@/lib/grammarPathState";
import { useAppLang } from "@/hooks/useAppLang";
import GrammarPath from "@/components/grammar/path/GrammarPath";
import { topicLabel as topicLabelFor } from "@/lib/grammarCourse";
import { PRACTICE_STAGES } from "@/lib/grammarPractice/stages";
import { fromStoredProfile } from "@/lib/grammarPlacementResult";
import { useGrammarCopy } from "@/lib/grammarCopy";
import GrammarStage from "@/components/grammar/map/GrammarStage";
import PracticeRunner from "@/components/grammar/PracticeRunner";
import { GRAMMAR_ACCENT as ACCENT } from "@/components/grammar/map/tierMeta";
import { useLearnerPath } from "@/hooks/useLearnerPath";
import PathNextActions from "@/components/grammar/path/PathNextActions";
import { PASS_MIN_ITEMS, PASS_MIN_ACCURACY, pathCopy, stopHref, stopLabel } from "@/lib/learnerPath";

// Route: /grammar — the student's Grammar world.
//
// One node map, six layers, same gesture the whole way down:
//   Tier -> Cluster -> Domain -> Branch -> Topic -> Stage -> the round, in place.
// Branches were pills in a panel and practice lived on its own /grammar/practice
// screen with flat lists; both are gone. Nothing on the path between the map and
// a question is a different kind of control.
//
// The nav TREE (src/lib/grammarTiers.js) is pre-computed from the dataset and
// the practice layers come from the auto-generated manifest — nothing here
// decides what belongs where, and empty nodes are locked upstream, not hidden.
//
// Placement entry rule: no GrammarProfile row -> the assessment, EXCEPT when the
// student arrives from the one learner path (src/lib/learnerPath.js):
//   /grammar?topic=<key>&stage=choose   Home's Continue: starts that round
//   /grammar?topic=<key>                opens that topic's sheet
//   /grammar?view=path                  "See the whole path"
// A path stop must never be behind a test wall, so those three open the Path
// tab without a profile. The Free map still needs the placement (it is built
// from the placement verdicts): tapping Free without one goes to the test.

const pretty = (s) => String(s || "").replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());

// Path | Free (roadmap 05.2/05.3). Path = the ordered Foundational course
// (src/lib/grammarCourse.js); Free = the original node map, unchanged, for
// browsing by grammar family and for teachers picking homework. Same topics,
// same banks, same evidence either way.
const MODE_KEY = "virora_grammar_mode";
const MODE_STR = {
  uz: { path: "Yo'l", free: "Erkin", title: "Grammatika" },
  en: { path: "Path", free: "Free", title: "Grammar" },
  ru: { path: "Путь", free: "Свободно", title: "Грамматика" },
};
const readMode = () => { try { return localStorage.getItem(MODE_KEY) === "free" ? "free" : "path"; } catch { return "path"; } };
const splitKey = (key) => { const [d, b, ...rest] = String(key).split("."); return [d, b, rest.join(".")]; };

export default function Grammar() {
  const navigate = useNavigate();
  const c = useGrammarCopy();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [tierId, setTierId] = useState(null);
  const [clusterId, setClusterId] = useState(null);
  const [domainId, setDomainId] = useState(null);
  const [branchId, setBranchId] = useState(null);
  const [topicId, setTopicId] = useState(null);
  const [stageId, setStageId] = useState(null);
  const [items, setItems] = useState(null);
  const [runKey, setRunKey] = useState(0);
  const { lang } = useAppLang();
  const ms = MODE_STR[lang] || MODE_STR.uz;
  const pc = pathCopy(lang);
  // How the student got here, read once (the params are cleared after use so a
  // refresh or the Back button never restarts a round).
  const [searchParams, setSearchParams] = useSearchParams();
  const entry = useRef({ topic: searchParams.get("topic"), stage: searchParams.get("stage"), view: searchParams.get("view") }).current;
  const pathEntry = Boolean(entry.topic || entry.view === "path");
  const fromHome = Boolean(entry.topic); // launched by a Continue link: "Done" returns Home
  const entered = useRef(false);
  const [noProfile, setNoProfile] = useState(false);
  const [mode, setModeState] = useState(() => (pathEntry ? "path" : readMode()));
  const [statuses, setStatuses] = useState({});
  const [openKey, setOpenKey] = useState(null);
  const [email, setEmail] = useState(null);
  const available = useMemo(() => new Set(availableTopics()), []);
  const path = useLearnerPath(email);

  const backRef = useRef(null); // stage's animated back, see GrammarStage

  const names = useMemo(() => Object.fromEntries(DOMAINS.map((d) => [d.id, d.name])), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await base44.auth.me();
        const rows = await base44.entities.GrammarProfile.filter({ user_email: me?.email });
        if (cancelled) return;
        if (!rows?.length) {
          if (!pathEntry) {
            // No diagnostic yet — the assessment is the way in.
            navigate("/grammar/assessment", { replace: true });
            return;
          }
          setNoProfile(true); // a path stop: practise now, the test can wait
        } else {
          setResult(fromStoredProfile(rows[0], names));
        }
        setEmail(me?.email || null);
      } catch (e) {
        console.error("grammar home load failed", e);
        if (cancelled) return;
        if (!pathEntry) { navigate("/grammar/assessment", { replace: true }); return; }
        setNoProfile(true);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [navigate, names]);

  // A topic's bank is code-split; fetch it as soon as the topic is chosen so
  // the items are ready by the time a stage node is tapped.
  useEffect(() => {
    if (!domainId || !branchId || !topicId) { setItems(null); return; }
    let cancelled = false;
    loadTopic(domainId, branchId, topicId).then((rows) => { if (!cancelled) setItems(rows); });
    return () => { cancelled = true; };
  }, [domainId, branchId, topicId]);

  // The student's own server-graded grammar evidence -> display statuses for
  // the Path. Refetched after every round so a node updates when you return.
  const refreshStatuses = React.useCallback(async () => {
    if (!email) return;
    try {
      const rows = await base44.entities.GrammarAttempt.filter(
        { user_email: email, game: "grammar_practice" }, "-round_at", 2000);
      setStatuses(topicStatuses(rows || []));
    } catch (e) {
      console.error("grammar path statuses failed", e); // Path still renders, all New
    }
  }, [email]);
  useEffect(() => { refreshStatuses(); }, [refreshStatuses]);

  const setMode = (m) => {
    if (m === "free" && noProfile) { navigate("/grammar/assessment"); return; }
    setModeState(m);
    try { localStorage.setItem(MODE_KEY, m); } catch { /* ignore */ }
    setTierId(null); setClusterId(null); setDomainId(null); setBranchId(null); setTopicId(null); setStageId(null);
  };

  // Path -> a round, in place. The map's tier/cluster aren't needed to run.
  const startFromPath = (key, stage) => {
    const [d, b, t] = splitKey(key);
    setDomainId(d); setBranchId(b); setTopicId(t); setStageId(stage);
  };
  // Arriving from a Continue link: open the stop that was asked for, once.
  useEffect(() => {
    if (loading || entered.current || !pathEntry) return;
    entered.current = true;
    const next = new URLSearchParams(searchParams);
    ["topic", "stage", "view"].forEach((k) => next.delete(k));
    setSearchParams(next, { replace: true });
    if (!entry.topic || !available.has(entry.topic)) return;
    const stage = PRACTICE_STAGES.find((s) => s.id === entry.stage && !s.ai) ? entry.stage : null;
    if (stage) startFromPath(entry.topic, stage); else setOpenKey(entry.topic);
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // The result screen's "Next step": the next stop on the one path.
  const goNextStop = (stop) => {
    if (!stop) return;
    if (stop.kind === "lesson") { navigate(stopHref(stop)); return; }
    setItems(null); // never compose the next round from the last topic's bank
    startFromPath(stop.key, "choose");
    setRunKey((k) => k + 1);
  };

  const exitRound = () => {
    setStageId(null);
    if (mode === "path" && fromHome) { navigate("/"); return; }
    if (mode === "path") {
      const key = topicKey(domainId, branchId, topicId);
      setDomainId(null); setBranchId(null); setTopicId(null);
      setOpenKey(key);       // back to that topic's sheet, not the top of the list
      refreshStatuses();
    }
  };

  const byId = useMemo(() => Object.fromEntries((result?.domains ?? []).map((d) => [d.domain, d])), [result]);

  const tier = useMemo(() => GRAMMAR_NAV.find((t) => t.id === tierId) || null, [tierId]);
  const cluster = useMemo(() => tier?.clusters.find((cl) => cl.id === clusterId) || null, [tier, clusterId]);
  const domain = useMemo(() => cluster?.domains.find((d) => d.id === domainId) || null, [cluster, domainId]);

  const goBack = () => {
    if (stageId) exitRound();
    else if (mode === "path") navigate("/");
    else if (topicId) { setTopicId(null); setStageId(null); }
    else if (branchId) setBranchId(null);
    else if (domainId) setDomainId(null);
    else if (clusterId) setClusterId(null);
    else if (tierId) setTierId(null);
    else navigate("/");
  };

  const level = topicId ? 5 : branchId ? 4 : domainId ? 3 : clusterId ? 2 : tierId ? 1 : 0;
  const running = Boolean(stageId);
  const stageMeta = PRACTICE_STAGES.find((s) => s.id === stageId) || null;

  // The domain's placement verdict, shown as the subtitle once you're inside it
  // — it used to be the header line of the branch panel.
  const verdict = useMemo(() => {
    if (!domain) return null;
    const r = byId[domain.id];
    const state = domainState(r);
    return state === DOMAIN_STATE.FOCUS ? c("home_dom_focus", { level: r.level })
      : state === DOMAIN_STATE.STRONG ? c("home_dom_strong", { level: r.level })
        : c("home_not_assessed");
  }, [domain, byId, c]);

  // The back pill names its DESTINATION, so it reads as "where this returns to".
  const pathIdle = mode === "path" && !running;
  const backLabel = pathIdle ? c("home_back")
    : running && mode === "path" ? topicLabelFor(topicKey(domainId, branchId, topicId), lang)
    : running ? pretty(topicId)
    : level === 5 ? pretty(branchId)
      : level === 4 ? domain?.name
        : level === 3 ? cluster?.name
          : level === 2 ? tier?.name
            : level === 1 ? c("home_levels_back")
              : c("home_back");

  const title = pathIdle ? ms.title
    : running ? stageMeta?.name
    : level === 5 ? pretty(topicId)
      : level === 4 ? pretty(branchId)
        : level === 3 ? domain?.name
          : cluster ? cluster.name : tier ? tier.name : c("home_title");

  const subtitle = (running || pathIdle) ? null
    : level === 5 ? c("practice_pick_stage")
      : level === 4 ? c("practice_pick_topic")
        : level === 3 ? verdict
          : level === 2 ? c("home_hint_domain")
            : level === 1 ? c("home_hint_cluster") : c("home_pick_level");

  const eyebrow = !pathIdle && level >= 3 ? cluster?.name : c("home_eyebrow");

  if (loading) {
    return (
      <div className="premium-mesh min-h-screen flex items-center justify-center">
        <div className="text-center">
          <PageLoader size={64} className="mx-auto mb-3" label={c("home_loading")} />
          <p className="text-sm text-muted-foreground">{c("home_loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-mesh min-h-screen overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-6 pb-28">
        <div className="flex items-center justify-between mb-4 min-h-[32px]">
          <button onClick={() => (mode === "free" && level > 0 && !running && backRef.current ? backRef.current() : goBack())}
            className="neo-pill px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors select-none">
            <ArrowLeft className="w-3.5 h-3.5" /> {backLabel}
          </button>
          {result?.level && (
            <span className="neo-pill px-3 py-1.5 text-xs font-bold" style={{ color: ACCENT, borderColor: `${ACCENT}55` }}>
              {c("home_level", { level: result.level })}
            </span>
          )}
        </div>

        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-2">
          <div className="relative inline-flex mb-3">
            <span className="neo-bloom" aria-hidden="true" style={{ background: `radial-gradient(closest-side, ${ACCENT}8c, rgba(107,158,196,0.3) 55%, transparent 76%)` }} />
            <div className="relative neo-pill px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
              <Sparkles className="w-3.5 h-3.5" /> {eyebrow}
            </div>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={`${tierId}:${clusterId}:${domainId}:${branchId}:${topicId}:${stageId}`}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
            </motion.div>
          </AnimatePresence>
          {!running && (
            <div role="tablist" className="mt-3 inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1">
              {["path", "free"].map((m) => (
                <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
                  className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-colors ${mode === m ? "text-black" : "text-muted-foreground"}`}
                  style={mode === m ? { background: ACCENT } : undefined}>
                  {ms[m]}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* The round takes the map's place; the shell, header and back stay put. */}
        {running ? (
          <div className="max-w-[560px] mx-auto mt-5">
            <LoadingTransition loading={items === null}>
            {items !== null && (
              <PracticeRunner
                key={runKey}
                items={items}
                stage={stageId}
                topicKey={topicKey(domainId, branchId, topicId)}
                c={c}
                onExit={exitRound}
                onAgain={() => setRunKey((k) => k + 1)}
                resultAfter={mode === "path" ? (summary) => {
                  const key = topicKey(domainId, branchId, topicId);
                  const passedNow = summary.total >= PASS_MIN_ITEMS && summary.correct / summary.total >= PASS_MIN_ACCURACY;
                  const done = passedNow || Boolean(path.passed?.has(key));
                  const nextStop = path.withPassed(done ? key : null).next;
                  return (
                    <PathNextActions lang={lang} passed={done} nextStop={nextStop}
                      onPassed={() => path.markPassed(key)}
                      onNext={() => goNextStop(nextStop)}
                      onCoach={() => navigate("/coach")}
                      onFree={() => navigate("/?tab=skillhub")} />
                  );
                } : undefined}
              />
            )}
            </LoadingTransition>
          </div>
        ) : mode === "path" ? (
          <div className="mt-5">
            {/* "Next" and the Continue bar come from the ONE path, so this tab and
                Home always point at the same stop. Until it loads (or if it fails)
                GrammarPath falls back to its own course-order pick. */}
            <GrammarPath lang={lang} statuses={statuses} available={available}
              onStart={startFromPath} openKey={openKey} onOpenKey={setOpenKey}
              next={!path.state ? undefined : path.state.next?.kind === "grammar" ? { unitId: path.state.next.unitId, key: path.state.next.key } : null}
              continueLabel={path.state?.next?.kind === "lesson" ? `${pc.cont} · ${stopLabel(path.state.next, lang)}` : undefined}
              onContinue={path.state?.next?.kind === "lesson" ? () => navigate(stopHref(path.state.next)) : undefined} />
          </div>
        ) : (
          <div className="relative w-full aspect-square max-w-[560px] mx-auto min-h-[360px]">
            <GrammarStage
              result={result} byId={byId}
              tierId={tierId} clusterId={clusterId} domainId={domainId}
              branchId={branchId} topicId={topicId}
              onSelectTier={setTierId}
              onSelectCluster={setClusterId}
              onSelectDomain={setDomainId}
              onSelectBranch={setBranchId}
              onSelectTopic={setTopicId}
              onSelectStage={setStageId}
              onBack={goBack}
              backRef={backRef}
              c={c}
            />
          </div>
        )}
      </div>
    </div>
  );
}