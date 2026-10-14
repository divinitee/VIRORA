import React, { useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { Modal, Button, OwnerBadge, DeptBadge, ActorBadge, StepStatusIcon } from "./ui";
import { EvidenceItem } from "./StepList";
import { ActivityList } from "./TaskPage";
import { fmtTime, fmtDuration, elapsedMinutes, inSubtree, OWNER_LABEL, STATUS_LABEL } from "./model";

// "Receipt" for a finished task: how long it took, who did what, and the log.
// Opened from Focus → Last done → Details (Tee, 2026-10-14).
export function receiptOf(task, data, idx) {
  const tree = [task, ...idx.descendants(task)];
  const ids = new Set(tree.map((t) => t.id));
  const steps = data.steps.filter((s) => ids.has(s.task_id)).sort((a, b) => String(a.completed_at || "~").localeCompare(String(b.completed_at || "~")));
  const evidence = data.evidence.filter((e) => ids.has(e.task_id));
  const logs = (data.workLogs || []).filter((w) => ids.has(w.task_id));
  const events = data.events
    .filter((e) => inSubtree(e.task_code, task.task_code))
    .sort((a, b) => String(b.ts).localeCompare(String(a.ts)));
  const human = logs.reduce((s, w) => s + (Number(w.human_minutes) || 0), 0);
  const ai = logs.reduce((s, w) => s + (Number(w.ai_minutes) || 0), 0);

  // Who did what: finished steps per person + every logged action per person.
  const people = {};
  const bump = (who, k) => { if (!who) return; (people[who] ||= { steps: 0, actions: 0 })[k]++; };
  steps.filter((s) => s.status === "done").forEach((s) => bump(s.completed_by || s.owner || task.owner || "tee", "steps"));
  events.forEach((e) => bump(e.actor, "actions"));
  const finisher = events.find((e) => e.task_code === task.task_code && /complete/i.test(`${e.action} ${e.after || ""} ${e.details || ""}`))?.actor;

  // Time: first real activity → completed. Prefer started_at when we have it.
  const firstTs = events.length ? events[events.length - 1].ts : task.created_date;
  const start = task.started_at || firstTs;
  const wall = task.completed_at && start ? Math.max(0, (new Date(task.completed_at) - new Date(start)) / 60000) : 0;

  return { tree, steps, evidence, logs, events, human, ai, people, finisher, start, wall, exact: !!elapsedMinutes(task) };
}

export default function Receipt({ task, data, idx, onClose, onOpen }) {
  const r = useMemo(() => receiptOf(task, data, idx), [task, data, idx]);
  const subtasks = r.tree.slice(1).filter((t) => !t.archived);
  const byCode = (id) => idx.byId[id]?.task_code;

  return (
    <Modal
      title={`${task.task_code} · receipt`}
      onClose={onClose}
      wide
      footer={<Button variant="primary" icon={ArrowUpRight} onClick={() => onOpen(task)}>Open full task</Button>}
    >
      <div className="flex flex-wrap items-center gap-2">
        <DeptBadge department={task.department} />
        <OwnerBadge owner={task.owner} prefix="Owner: " />
        {r.finisher && <span className="text-xs text-slate-400">finished by <ActorBadge actor={r.finisher} /></span>}
      </div>
      <h3 className="mt-2 text-xl font-semibold text-white">{task.title}</h3>
      {task.description && <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm text-slate-400">{task.description}</p>}

      {/* Time */}
      <Section title="Time">
        <div className="grid gap-2 sm:grid-cols-3">
          <Stat label={r.exact ? "Start → finish" : "First activity → finish"} value={fmtDuration(r.wall)} />
          <Stat label="Logged work" value={r.logs.length ? `${fmtDuration(r.human)} people${r.ai ? ` · ${fmtDuration(r.ai)} AI` : ""}` : "none logged"} />
          <Stat label="Rough guess was" value={fmtDuration(task.estimate_minutes)} />
        </div>
        <div className="mt-2 text-xs text-slate-500">Started {fmtTime(r.start)} · finished {fmtTime(task.completed_at)}</div>
      </Section>

      {/* Who did what */}
      <Section title="Who did what">
        {Object.keys(r.people).length === 0 ? (
          <p className="text-sm text-slate-500">No actions recorded.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {Object.entries(r.people).sort((a, b) => b[1].steps + b[1].actions - (a[1].steps + a[1].actions)).map(([who, n]) => (
              <div key={who} className="rounded-[8px] border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm">
                <OwnerBadge owner={who} />
                <span className="ml-2 text-slate-300">{n.steps ? `${n.steps} step${n.steps > 1 ? "s" : ""} done · ` : ""}{n.actions} action{n.actions === 1 ? "" : "s"}</span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Steps */}
      {r.steps.length > 0 && (
        <Section title={`Steps (${r.steps.filter((s) => s.status === "done").length}/${r.steps.length} done)`}>
          <ul className="divide-y divide-slate-800 overflow-hidden rounded-[8px] border border-slate-800">
            {r.steps.map((s) => (
              <li key={s.id} className="bg-[#0b111b] px-3 py-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <StepStatusIcon status={s.status} />
                  {s.task_id !== task.id && <span className="font-mono text-[11px] text-blue-300">{byCode(s.task_id)}</span>}
                  <span className="min-w-0 flex-1 text-sm text-slate-200">{s.title}</span>
                  <span className="text-[11px] text-slate-500">owner {OWNER_LABEL[s.owner || idx.byId[s.task_id]?.owner || "tee"]}</span>
                  {s.completed_at && <span className="flex items-center gap-1 text-[11px] text-slate-500">· done by <ActorBadge actor={s.completed_by} /> {fmtTime(s.completed_at)}</span>}
                </div>
                {s.actual_result && <p className="mt-1 whitespace-pre-wrap pl-7 text-xs leading-5 text-slate-400">Result: {s.actual_result}</p>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Subtasks */}
      {subtasks.length > 0 && (
        <Section title={`Subtasks (${subtasks.length})`}>
          <ul className="space-y-1">
            {subtasks.map((t) => (
              <li key={t.id} className="flex items-center gap-2 text-sm">
                <span className="font-mono text-[11px] text-slate-500">{t.task_code}</span>
                <span className="min-w-0 flex-1 truncate text-slate-300">{t.title}</span>
                <OwnerBadge owner={t.owner} />
                <span className="text-[11px] text-slate-500">{STATUS_LABEL[t.status]}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Evidence */}
      {r.evidence.length > 0 && (
        <Section title={`Evidence (${r.evidence.length})`}>
          <div className="space-y-2">{r.evidence.slice(0, 8).map((e) => <EvidenceItem key={e.id} ev={e} />)}</div>
          {r.evidence.length > 8 && <p className="mt-2 text-xs text-slate-500">+{r.evidence.length - 8} more on the task page.</p>}
        </Section>
      )}

      {/* Log */}
      <Section title={`Log (${r.events.length})`}>
        <ActivityList events={r.events} currentCode={task.task_code} />
      </Section>
    </Modal>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-5">
      <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{title}</h4>
      {children}
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-[8px] border border-slate-800 bg-slate-950/50 px-3 py-2.5">
      <div className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-100">{value}</div>
    </div>
  );
}
