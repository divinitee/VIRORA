import React, { useState } from "react";
import { Modal, Button, Field, inputCls } from "./ui";
import { STATUSES, STATUS_LABEL, PRIORITIES, PRIORITY_LABEL, CATEGORIES, DEPARTMENTS, DEPARTMENT_LABEL, OWNERS, OWNER_LABEL } from "./model";

// Create or edit a task. With `parent`, creates a subtask of that task.
export default function TaskForm({ task, parent, onSubmit, onClose, busy }) {
  const editing = !!task;
  const [f, setF] = useState(() => ({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || (parent ? "planned" : "raw_idea"),
    priority: task?.priority || parent?.priority || "medium",
    category: task?.category || parent?.category || "General",
    project: task?.project ?? parent?.project ?? "",
    tags: (task?.tags || []).join(", "),
    due_date: task?.due_date || "",
    depends_on: (task?.depends_on || []).join(", "),
    notes: task?.notes || "",
    launch_blocker: !!task?.launch_blocker,
    department: task?.department || parent?.department || "tech",
    owner: task?.owner || parent?.owner || "tee",
    estimate_minutes: task?.estimate_minutes || 30,
  }));
  const [err, setErr] = useState("");
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));

  const submit = async (e) => {
    e?.preventDefault?.();
    if (!f.title.trim()) { setErr("Give the task a title."); return; }
    setErr("");
    await onSubmit({
      ...f,
      title: f.title.trim(),
      tags: f.tags.split(",").map((x) => x.trim()).filter(Boolean),
      depends_on: f.depends_on.split(",").map((x) => x.trim()).filter(Boolean),
      due_date: f.due_date || null,
      // Older screens still read work_mode; keep it in step with the owner.
      work_mode: f.owner === "tee" ? "hands_on" : "claude",
    });
  };

  const heading = editing ? `Edit ${task.task_code}` : parent ? `New subtask of ${parent.task_code}` : "New big task";
  const cats = CATEGORIES.includes(f.category) || !f.category ? CATEGORIES : [...CATEGORIES, f.category];

  return (
    <Modal
      title={heading}
      onClose={onClose}
      wide
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit} disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : parent ? "Create subtask" : "Create task"}</Button>
        </>
      }
    >
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        {parent && !editing && (
          <div className="rounded-[8px] border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-400 sm:col-span-2">
            Parent: <span className="font-mono text-slate-300">{parent.task_code}</span> {parent.title}
          </div>
        )}
        <Field label="Title" className="sm:col-span-2">
          <input autoFocus value={f.title} onChange={(e) => set("title", e.target.value)} className={inputCls} placeholder="What outcome is this task about?" />
        </Field>
        <Field label="Description / objective" className="sm:col-span-2">
          <textarea rows={3} value={f.description} onChange={(e) => set("description", e.target.value)} className={inputCls} placeholder="What does done look like? Context, scope." />
        </Field>
        <Field label="Status">
          <select value={f.status} onChange={(e) => set("status", e.target.value)} className={inputCls}>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </Field>
        <Field label="Priority">
          <select value={f.priority} onChange={(e) => set("priority", e.target.value)} className={inputCls}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>)}
          </select>
        </Field>
        <Field label="Category">
          <select value={f.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
            {cats.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Project / area">
          <input value={f.project} onChange={(e) => set("project", e.target.value)} className={inputCls} placeholder="e.g. Teacher System" />
        </Field>
        <Field label="Tags" hint="Comma separated">
          <input value={f.tags} onChange={(e) => set("tags", e.target.value)} className={inputCls} placeholder="security, launch" />
        </Field>
        <Field label="Due date">
          <input type="date" value={f.due_date || ""} onChange={(e) => set("due_date", e.target.value)} className={inputCls + " [color-scheme:dark]"} />
        </Field>
        <Field label="Dependencies" hint="Task codes this waits on, comma separated (e.g. VT-2, VT-4.1)" className="sm:col-span-2">
          <input value={f.depends_on} onChange={(e) => set("depends_on", e.target.value)} className={inputCls} placeholder="VT-2" />
        </Field>
        <div className="sm:col-span-2 rounded-[10px] border border-blue-500/20 bg-blue-500/[0.04] p-3">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[.18em] text-blue-300">Who &amp; where</div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Section">
              <select value={f.department} onChange={(e) => set("department", e.target.value)} className={inputCls}>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{DEPARTMENT_LABEL[d]}</option>)}
              </select>
            </Field>
            <Field label="Owner" hint="Who does this task">
              <select value={f.owner} onChange={(e) => set("owner", e.target.value)} className={inputCls}>
                {OWNERS.map((o) => <option key={o} value={o}>{OWNER_LABEL[o]}</option>)}
              </select>
            </Field>
            <Field label="Rough time (min)" hint="A guess is fine">
              <input type="number" min="1" max="1440" step="5" value={f.estimate_minutes} onChange={(e) => set("estimate_minutes", e.target.value)} className={inputCls} />
            </Field>
          </div>
        </div>
        <Field label="Notes" className="sm:col-span-2">
          <textarea rows={3} value={f.notes} onChange={(e) => set("notes", e.target.value)} className={inputCls} placeholder="Working notes, decisions, references…" />
        </Field>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300 sm:col-span-2">
          <input type="checkbox" checked={f.launch_blocker} onChange={(e) => set("launch_blocker", e.target.checked)} className="h-4 w-4 accent-rose-500" />
          Launch blocker
        </label>
        {err && <div className="text-sm text-rose-300 sm:col-span-2">{err}</div>}
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  );
}
