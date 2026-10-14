import React, { useMemo, useState } from "react";
import {
  ArrowDown, ArrowUp, Check, CheckCircle2, ChevronRight, Crosshair, Flag, LayoutGrid, Plus, Receipt as ReceiptIcon, Search, Sparkles, X, Zap,
} from "lucide-react";
import { Button, PriorityBadge, ProgressBar, Modal, inputCls, OwnerBadge, DeptBadge } from "./ui";
import Receipt, { receiptOf } from "./Receipt";
import { PRIORITY_RANK, STATUS_LABEL, relative, dependencyState, fmtDuration, DEPARTMENTS, DEPARTMENT_LABEL, DEPARTMENT_STYLE } from "./model";

// Focus: the Taskboard's front page. Three things only (Tee, 2026-10-14 —
// "run it like a company … Last task completed, Current task, Next task"):
//   LAST DONE  — what just finished, with a receipt (time, who did what, log)
//   NOW        — the one task being worked on, with its step roadmap
//   NEXT       — what comes after, then a short queue
// One company queue; every task shows its section and its owner.

export const ROADMAP_MAX = 6;

// Tasks on the roadmap, in order. Complete / archived ones (or ones under an
// archived parent) are skipped, so finishing a task never leaves a ghost.
export function roadmapOf(data, idx) {
  return data.tasks
    .filter((t) => (Number(t.focus_rank) || 0) > 0 && !t.archived && t.status !== "complete")
    .filter((t) => !idx.path(t).slice(0, -1).some((a) => a.archived))
    .filter((t) => !dependencyState(t, idx.byCode).blocked)
    .sort((a, b) => a.focus_rank - b.focus_rank);
}

// The "Now" task's own path: its steps, then its open subtasks, in order.
function pathOf(task, idx) {
  const steps = (idx.stepsByTask[task.id] || [])
    .filter((s) => s.status !== "skipped")
    .map((s) => ({ kind: "step", id: s.id, code: s.step_code, title: s.title, done: s.status === "done", active: s.status === "in_progress", owner: s.owner || task.owner, raw: s }));
  const kids = (idx.children[task.id] || [])
    .filter((k) => !k.archived)
    .map((k) => ({ kind: "task", id: k.id, code: k.task_code, title: k.title, done: k.status === "complete", active: k.status === "in_progress", owner: k.owner, raw: k, pct: idx.progress(k).percent }));
  return [...steps, ...kids];
}

export default function Focus({ data, idx, busy, onOpen, onBacklog, onNew, handlers }) {
  const [picker, setPicker] = useState(null); // null | "next" | "now"
  const [showDone, setShowDone] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const roadmap = useMemo(() => roadmapOf(data, idx), [data, idx]);
  const now = roadmap[0] || null;
  const next = roadmap.slice(1);
  const ids = roadmap.map((t) => t.id);

  const visible = data.tasks.filter((t) => !t.archived && !idx.path(t).slice(0, -1).some((a) => a.archived));
  const open = visible.filter((t) => t.status !== "complete");
  const backlogCount = open.filter((t) => !ids.includes(t.id)).length;
  const finished = visible
    .filter((t) => t.status === "complete" && t.completed_at)
    .sort((a, b) => String(b.completed_at).localeCompare(String(a.completed_at)));
  const lastDone = finished[0] || null;
  const earlier = finished.slice(1, 6);
  const sectionCounts = DEPARTMENTS.map((d) => [d, open.filter((t) => (t.department || "tech") === d).length]);

  const path = now ? pathOf(now, idx) : [];
  const done = path.filter((p) => p.done);
  const todo = path.filter((p) => !p.done);
  const current = todo.find((p) => p.active) || todo[0] || null;
  const upcoming = todo.filter((p) => p !== current);
  const pct = now ? idx.progress(now).percent : 0;

  const save = (list, msg) => handlers.setRoadmap(list.map((t) => t.id), msg);
  const move = (i, dir) => {
    const list = [...roadmap];
    const j = i + dir;
    if (j < 1 || j >= list.length) return; // "Now" only changes via "Do now"
    [list[i], list[j]] = [list[j], list[i]];
    save(list, "Queue reordered");
  };
  const doNow = (t) => save([t, ...roadmap.filter((x) => x.id !== t.id)], `${t.task_code} is now the current task`);
  const drop = (t) => save(roadmap.filter((x) => x.id !== t.id), `${t.task_code} moved back to the backlog`);
  const finishNow = async () => {
    const ok = await handlers.move(now.id, "complete");
    if (ok !== false) await save(next, next[0] ? `Done: ${now.task_code}. ${next[0].task_code} is up` : `Done: ${now.task_code}`);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100">
      <header className="border-b border-slate-800 bg-[#080d16]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-4 px-4 py-5 sm:px-6">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[.2em] text-blue-400">VIRORA · Company taskboard</div>
            <h1 className="mt-1 flex items-center gap-2 text-2xl font-semibold tracking-tight"><Crosshair className="h-5 w-5 text-blue-300" /> Last · Now · Next</h1>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-500">Open by section:</span>
              {sectionCounts.map(([d, n]) => (
                <button key={d} type="button" onClick={() => onBacklog(d)} className={`rounded-[6px] border px-2 py-0.5 font-semibold hover:brightness-125 ${DEPARTMENT_STYLE[d]}`}>
                  {DEPARTMENT_LABEL[d]} {n}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button icon={LayoutGrid} onClick={() => onBacklog()}>Backlog · {backlogCount}</Button>
            <Button variant="primary" icon={Plus} onClick={onNew}>New task</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1400px] gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)_320px]">
        {/* ───────── LAST DONE ───────── */}
        <aside className="flex flex-col gap-4 lg:order-none order-2">
          <section className="rounded-[14px] border border-emerald-500/30 bg-gradient-to-b from-emerald-500/[0.06] to-[#0b111b] p-4">
            <ColumnLabel tone="text-emerald-300" icon={CheckCircle2}>Last done</ColumnLabel>
            {!lastDone ? (
              <p className="mt-3 text-sm text-slate-500">Nothing finished yet. The first one lands here.</p>
            ) : (
              <LastDoneCard task={lastDone} data={data} idx={idx} onReceipt={() => setReceipt(lastDone)} />
            )}
          </section>
          {earlier.length > 0 && (
            <section className="rounded-[14px] border border-slate-800 bg-[#0b111b] p-4">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Before that</h2>
              <ul className="flex flex-col gap-1">
                {earlier.map((t) => (
                  <li key={t.id}>
                    <button type="button" onClick={() => setReceipt(t)} className="flex w-full items-center gap-2 rounded-[6px] px-1.5 py-1.5 text-left text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white">
                      <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-400 text-[9px] font-bold text-slate-950">✓</span>
                      <span className="min-w-0 flex-1 truncate">{t.title}</span>
                      <OwnerBadge owner={t.owner} />
                      <span className="shrink-0 text-[11px] text-slate-500">{relative(t.completed_at)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* ───────── NOW ───────── */}
        <section className="order-1 rounded-[14px] border border-blue-500/40 bg-gradient-to-b from-blue-500/[0.08] to-[#0b111b] p-5 shadow-[0_0_60px_rgba(59,130,246,0.10)] sm:p-6 lg:order-none">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.2em] text-blue-300">
            <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-400" /></span>
            Now
          </div>

          {!now ? (
            <div className="flex flex-col items-center gap-3 py-14 text-center">
              <Sparkles className="h-8 w-8 text-blue-300" />
              <h2 className="text-xl font-semibold">Nothing in progress</h2>
              <p className="max-w-sm text-sm text-slate-400">Pick the one task the company is working on right now.</p>
              <Button variant="primary" size="lg" icon={Crosshair} onClick={() => setPicker("now")}>Pick current task</Button>
            </div>
          ) : (
            <>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm text-slate-400">{now.task_code}</span>
                <DeptBadge department={now.department} />
                <OwnerBadge owner={now.owner} prefix="Owner: " />
                <PriorityBadge priority={now.priority} />
                {now.launch_blocker && <span className="rounded border border-rose-500/50 bg-rose-500/10 px-2 py-0.5 text-[11px] font-bold uppercase text-rose-300">Launch blocker</span>}
              </div>
              <button type="button" onClick={() => onOpen(now)} className="mt-1.5 text-left text-2xl font-semibold tracking-tight hover:text-blue-200 sm:text-[28px]">
                {now.title}
              </button>
              {now.description && <p className="mt-2 line-clamp-3 max-w-2xl whitespace-pre-wrap text-[15px] leading-7 text-slate-300">{now.description}</p>}
              <div className="mt-4 flex items-center gap-3">
                <ProgressBar percent={pct} className="h-2 flex-1" />
                <span className="w-10 text-right text-sm font-semibold text-slate-300">{pct}%</span>
              </div>
              {now.started_at && <div className="mt-1.5 text-xs text-slate-500">Started {relative(now.started_at)}</div>}

              {/* the task's own steps */}
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Steps</h3>
                  {done.length > 0 && (
                    <button type="button" onClick={() => setShowDone((v) => !v)} className="text-xs text-emerald-300 hover:underline">
                      {showDone ? "Hide" : "Show"} {done.length} done ✓
                    </button>
                  )}
                </div>

                {path.length === 0 ? (
                  <div className="rounded-[10px] border border-dashed border-slate-700 p-5 text-center text-sm text-slate-400">
                    No steps yet. Break it into small steps and say who does each one.
                    <div className="mt-3"><Button size="sm" icon={Plus} onClick={() => onOpen(now)}>Add steps</Button></div>
                  </div>
                ) : (
                  <ol className="relative ml-3 border-l-2 border-slate-800">
                    {showDone && done.map((p) => (
                      <li key={p.id} className="relative pb-3 pl-6">
                        <span className="absolute -left-[11px] top-0.5 grid h-5 w-5 place-items-center rounded-full bg-emerald-400 text-[11px] font-bold text-slate-950">✓</span>
                        <span className="text-sm text-slate-500 line-through">{p.title}</span>
                      </li>
                    ))}
                    {current && (
                      <li className="relative pb-5 pl-6">
                        <span className="absolute -left-[13px] top-0 grid h-6 w-6 place-items-center rounded-full border-2 border-blue-400 bg-[#0b111b]"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-400" /></span>
                        <div className="rounded-[10px] border border-blue-500/40 bg-blue-500/[0.07] p-3.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-[.18em] text-blue-300">Do this next</span>
                            <OwnerBadge owner={current.owner} />
                          </div>
                          <div className="mt-1 text-[15px] font-semibold text-white">{current.title}</div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {current.kind === "step" ? (
                              <Button size="sm" variant="success" icon={Check} disabled={busy} onClick={() => handlers.updateStep(current.id, { status: "done" })}>Mark done</Button>
                            ) : (
                              <Button size="sm" variant="primary" icon={ChevronRight} onClick={() => onOpen(current.raw)}>Open {current.code} · {current.pct}%</Button>
                            )}
                          </div>
                        </div>
                      </li>
                    )}
                    {upcoming.slice(0, 4).map((p) => (
                      <li key={p.id} className="relative flex items-center gap-2 pb-3 pl-6">
                        <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-slate-600 bg-[#0b111b]" />
                        <span className="min-w-0 flex-1 text-sm text-slate-300">{p.title}{p.kind === "task" && <span className="ml-2 font-mono text-[11px] text-slate-500">{p.code}</span>}</span>
                        <OwnerBadge owner={p.owner} />
                      </li>
                    ))}
                    {upcoming.length > 4 && (
                      <li className="relative pl-6 text-xs text-slate-500">
                        <button type="button" onClick={() => onOpen(now)} className="hover:text-slate-300 hover:underline">+{upcoming.length - 4} more steps</button>
                      </li>
                    )}
                    {!current && (
                      <li className="relative pl-6 text-sm text-emerald-300">Every step is done. Finish it below.</li>
                    )}
                  </ol>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-4">
                <Button variant="success" icon={Flag} disabled={busy} onClick={finishNow}>
                  Finish {now.task_code}{next[0] ? ` → start ${next[0].task_code}` : ""}
                </Button>
                <Button icon={ChevronRight} onClick={() => onOpen(now)}>Open task</Button>
                <Button variant="ghost" icon={X} disabled={busy} onClick={() => drop(now)}>Not now</Button>
              </div>
            </>
          )}
        </section>

        {/* ───────── NEXT ───────── */}
        <aside className="order-3 flex flex-col gap-4 lg:order-none">
          <section className="rounded-[14px] border border-violet-500/30 bg-gradient-to-b from-violet-500/[0.06] to-[#0b111b] p-4">
            <div className="flex items-center justify-between">
              <ColumnLabel tone="text-violet-300" icon={ChevronRight}>Next</ColumnLabel>
              <span className="text-[11px] text-slate-500">{roadmap.length}/{ROADMAP_MAX} in queue</span>
            </div>
            {!next[0] ? (
              <p className="mt-3 text-sm text-slate-500">Nothing queued. Finish the one in front of you, or pull one in below.</p>
            ) : (
              <div className="mt-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-[11px] text-slate-500">{next[0].task_code}</span>
                  <DeptBadge department={next[0].department} />
                  <OwnerBadge owner={next[0].owner} />
                </div>
                <button type="button" onClick={() => onOpen(next[0])} className="mt-1.5 text-left text-lg font-semibold leading-snug hover:text-violet-200">{next[0].title}</button>
                {next[0].description && <p className="mt-1 line-clamp-3 text-sm text-slate-400">{next[0].description}</p>}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="primary" icon={Zap} disabled={busy} onClick={() => doNow(next[0])}>Start now</Button>
                  <Button size="sm" variant="ghost" icon={ArrowDown} disabled={busy || roadmap.length < 3} onClick={() => move(1, 1)}>Later</Button>
                  <Button size="sm" variant="ghost" icon={X} disabled={busy} onClick={() => drop(next[0])}>Drop</Button>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-[14px] border border-slate-800 bg-[#0b111b] p-4">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">After that</h2>
            {next.length <= 1 ? (
              <p className="text-sm text-slate-500">Empty.</p>
            ) : (
              <ol className="flex flex-col gap-1.5">
                {next.slice(1).map((t, i) => {
                  const pos = i + 2; // index in roadmap
                  return (
                    <li key={t.id} className="group rounded-[8px] border border-slate-800 bg-slate-900/40 px-2.5 py-2">
                      <button type="button" onClick={() => onOpen(t)} className="flex w-full items-center gap-2 text-left">
                        <span className="min-w-0 flex-1 truncate text-sm text-slate-200 group-hover:text-white">{t.title}</span>
                        <OwnerBadge owner={t.owner} />
                      </button>
                      <div className="mt-1 flex items-center gap-1">
                        <span className="font-mono text-[10px] text-slate-500">{t.task_code} · {STATUS_LABEL[t.status]}</span>
                        <button type="button" aria-label="Move up" disabled={busy} onClick={() => move(pos, -1)} className="ml-auto rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-white disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
                        <button type="button" aria-label="Move down" disabled={busy || pos === roadmap.length - 1} onClick={() => move(pos, 1)} className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-white disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
                        <button type="button" aria-label="Back to backlog" title="Back to backlog" disabled={busy} onClick={() => drop(t)} className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-rose-300"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
            <button
              type="button"
              disabled={busy || roadmap.length >= ROADMAP_MAX}
              onClick={() => setPicker(now ? "next" : "now")}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[8px] border border-dashed border-slate-700 py-2.5 text-sm text-slate-400 hover:border-blue-400/60 hover:text-blue-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-4 w-4" /> {roadmap.length >= ROADMAP_MAX ? "Queue full — finish something first" : "Pull from backlog"}
            </button>
          </section>
        </aside>
      </main>

      {receipt && <Receipt task={receipt} data={data} idx={idx} onClose={() => setReceipt(null)} onOpen={(t) => { setReceipt(null); onOpen(t); }} />}

      {picker && (
        <Picker
          mode={picker}
          data={data}
          idx={idx}
          exclude={ids}
          onClose={() => setPicker(null)}
          onPick={async (t) => {
            const list = picker === "now" ? [t, ...roadmap] : [...roadmap, t];
            const ok = await save(list.slice(0, ROADMAP_MAX), picker === "now" ? `${t.task_code} is now the current task` : `${t.task_code} added to the queue`);
            if (ok !== false) setPicker(null);
          }}
        />
      )}
    </div>
  );
}

function ColumnLabel({ children, tone, icon: Icon }) {
  return <div className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.2em] ${tone}`}><Icon className="h-3.5 w-3.5" />{children}</div>;
}

function LastDoneCard({ task, data, idx, onReceipt }) {
  const r = useMemo(() => receiptOf(task, data, idx), [task, data, idx]);
  const who = Object.entries(r.people).sort((a, b) => b[1].steps + b[1].actions - (a[1].steps + a[1].actions)).map(([k]) => k);
  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="font-mono text-[11px] text-slate-500">{task.task_code}</span>
        <DeptBadge department={task.department} />
        <OwnerBadge owner={task.owner} />
      </div>
      <button type="button" onClick={onReceipt} className="mt-1.5 text-left text-lg font-semibold leading-snug hover:text-emerald-200">{task.title}</button>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-[8px] border border-slate-800 bg-slate-950/50 px-2.5 py-2">
          <dt className="text-slate-500">Took</dt>
          <dd className="mt-0.5 text-sm font-semibold text-slate-100">{fmtDuration(r.wall)}</dd>
        </div>
        <div className="rounded-[8px] border border-slate-800 bg-slate-950/50 px-2.5 py-2">
          <dt className="text-slate-500">Finished</dt>
          <dd className="mt-0.5 text-sm font-semibold text-slate-100">{relative(task.completed_at)}</dd>
        </div>
      </dl>
      {who.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1 text-xs text-slate-500">Worked on by {who.slice(0, 4).map((w) => <OwnerBadge key={w} owner={w} />)}</div>
      )}
      <Button size="sm" className="mt-3 w-full" icon={ReceiptIcon} onClick={onReceipt}>Details · time, who, log</Button>
    </div>
  );
}

function Picker({ mode, data, idx, exclude, onClose, onPick }) {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("");
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return data.tasks
      .filter((t) => !t.archived && t.status !== "complete" && !exclude.includes(t.id))
      .filter((t) => !idx.path(t).slice(0, -1).some((a) => a.archived))
      .filter((t) => !dept || (t.department || "tech") === dept)
      .filter((t) => !needle || `${t.task_code} ${t.title}`.toLowerCase().includes(needle))
      .sort((a, b) =>
        (b.status === "in_progress") - (a.status === "in_progress") ||
        (PRIORITY_RANK[a.priority] ?? 2) - (PRIORITY_RANK[b.priority] ?? 2) ||
        String(a.task_code).localeCompare(String(b.task_code), undefined, { numeric: true }))
      .slice(0, 60);
  }, [data.tasks, idx, exclude, q, dept]);

  return (
    <Modal title={mode === "now" ? "What is the company working on now?" : "Add to the queue"} onClose={onClose} wide>
      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 mt-0.5 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tasks…" className={inputCls + " pl-9"} />
      </label>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <button type="button" onClick={() => setDept("")} className={`rounded-[6px] border px-2 py-0.5 text-[11px] font-semibold ${!dept ? "border-slate-400 text-white" : "border-slate-700 text-slate-400"}`}>All</button>
        {DEPARTMENTS.map((d) => (
          <button key={d} type="button" onClick={() => setDept(d)} className={`rounded-[6px] border px-2 py-0.5 text-[11px] font-semibold ${dept === d ? DEPARTMENT_STYLE[d] : "border-slate-700 text-slate-400"}`}>{DEPARTMENT_LABEL[d]}</button>
        ))}
      </div>
      <ul className="mt-3 flex flex-col gap-1.5">
        {rows.length === 0 && <li className="py-6 text-center text-sm text-slate-500">No open tasks match.</li>}
        {rows.map((t) => (
          <li key={t.id}>
            <button type="button" onClick={() => onPick(t)} className="flex w-full items-center gap-3 rounded-[8px] border border-slate-800 px-3 py-2.5 text-left hover:border-blue-400/50 hover:bg-blue-500/[0.06]">
              <span className="w-20 shrink-0 font-mono text-xs text-slate-500">{t.task_code}</span>
              <span className="min-w-0 flex-1 truncate text-sm text-slate-100">{t.title}</span>
              <span className="hidden sm:inline"><DeptBadge department={t.department} /></span>
              <OwnerBadge owner={t.owner} />
              <PriorityBadge priority={t.priority} />
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
