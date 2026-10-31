import React from "react";
import ReactDOM from "react-dom/client";
import { MemoryRouter, Routes, Route, useNavigate } from "react-router-dom";
import "@/index.css";
import Coach from "@/pages/Coach";
import CoachTodayCard from "@/components/coach/CoachTodayCard";
import PracticeRunner from "@/components/grammar/PracticeRunner";
import { loadTopic } from "@/lib/grammarPractice";
import { useGrammarCopy } from "@/lib/grammarCopy";

// Grammar round OUTSIDE and INSIDE Coach mode (regression check D).
function PracticeHarness() {
  const mode = new URLSearchParams(location.search).get("mode") || "plain";
  const c = useGrammarCopy();
  const [items, setItems] = React.useState(null);
  const [ended, setEnded] = React.useState(null);
  React.useEffect(() => { loadTopic("tenses", "present", "simple-routine").then(setItems); }, []);
  if (!items) return <div>loading</div>;
  if (ended) return <div id="ended">{ended}</div>;
  return (
    <div className="max-w-xl mx-auto p-4">
      {mode === "coach"
        ? <PracticeRunner items={items} stage="choose" topicKey="tenses.present.simple-routine" size={3} c={c} coachSessionKey="2026-10-08:today:0"
            onFinish={() => setEnded("finish")} onExit={() => setEnded("exit")} />
        : <PracticeRunner items={items} stage="choose" topicKey="tenses.present.simple-routine" c={c}
            onAgain={() => setEnded("again")} onExit={() => setEnded("exit")} />}
    </div>);
}
// Test hook (5d audit, 31 Oct): window.__navigate(path) changes route the way the browser's
// Back / swipe-back does in the real app (BrowserRouter), so the Coach unmounts mid-run.
function NavHook() { const nav = useNavigate(); React.useEffect(() => { window.__navigate = nav; }, [nav]); return null; }
const start = new URLSearchParams(location.search).get("start") || "/coach";
try { localStorage.setItem("app_lang", new URLSearchParams(location.search).get("lang") || "en"); } catch {}
ReactDOM.createRoot(document.getElementById("root")).render(
  <MemoryRouter initialEntries={[start]}>
    <NavHook />
    <Routes>
      <Route path="/coach" element={<Coach />} />
      <Route path="/" element={<div id="home" className="max-w-xl mx-auto p-4"><CoachTodayCard /></div>} />
      <Route path="/pricing" element={<div id="pricing">PRICING</div>} />
      <Route path="/practice" element={<PracticeHarness />} />
    </Routes>
  </MemoryRouter>
);
