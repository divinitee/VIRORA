import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Activity, Copy, Sparkles, UserMinus, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import ClassForm from "@/components/teacher/ClassForm";
import {
  ACTIVITY_STYLES, HW_STYLES, GROUP_STATUS_STYLES, Pill, classColor, formatDate, formatDayPattern, formatSlot, seatsLabel,
} from "@/components/teacher/panelUi";

// Class details (Teacher Panel revamp, 2026-11-12): Overview, Students,
// Assignments, Settings. Every write still goes through teacherApi via the
// handlers passed in from TeacherDashboard (updateGroup / setRoster), so the
// server ownership checks are unchanged.

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "students", label: "Students" },
  { id: "assignments", label: "Assignments" },
  { id: "settings", label: "Settings" },
];

export default function ClassDetails({ group, students, assignments, hwByStudent, onClose, onSave, onRoster, onActivity, onAssign, onCopy }) {
  const [section, setSection] = useState("overview");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const open = !!group;

  const members = group ? students.filter((s) => s.group_code === group.code) : [];
  const active = members.filter((s) => s.roster_status === "active");
  const removed = members.filter((s) => s.roster_status === "removed");
  const classAssignments = group ? assignments.filter((a) => a.group_code === group.code) : [];
  const color = classColor(group);

  const save = async (fields) => {
    setSaving(true);
    setError("");
    try {
      await onSave(group.id, fields);
      setSection("overview");
    } catch (e) {
      setError(e?.message || "Couldn't save the class.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { setSection("overview"); setError(""); onClose(); } }}>
      <DialogContent className="max-h-[92vh] overflow-y-auto overflow-x-hidden w-[calc(100vw-1rem)] sm:max-w-2xl rounded-2xl p-0 gap-0">
        {group && (
          <>
            <DialogHeader className="px-5 pt-5 pb-3 text-left space-y-1" style={{ borderTop: `4px solid ${color}` }}>
              <DialogTitle className="flex items-center gap-2 pr-6 text-lg">
                <span className="text-xl">{group.icon || ""}</span>
                <span className="truncate">{group.label || group.code}</span>
                {group.level && <Pill cls="text-primary bg-primary/10">{group.level}</Pill>}
              </DialogTitle>
              <DialogDescription className="tabular-nums">
                {group.days?.length ? `${formatDayPattern(group.days)} · ${formatSlot(group)}` : "No time slot yet"}
                {group.module ? ` · ${group.module}` : ""}
              </DialogDescription>
            </DialogHeader>

            <nav className="grid grid-cols-4 gap-1 bg-muted p-1 mx-5 rounded-xl" aria-label="Class sections">
              {SECTIONS.map((s) => (
                <button key={s.id} onClick={() => setSection(s.id)} aria-current={section === s.id ? "page" : undefined}
                  className={`h-10 rounded-lg text-[11px] sm:text-xs font-semibold transition-all px-1 ${section === s.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  {s.label}
                </button>
              ))}
            </nav>

            <div className="p-5">
              {section === "overview" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Fact label="Schedule" value={group.days?.length ? formatDayPattern(group.days) : "Not set"} sub={group.days?.length ? formatSlot(group) : "Add a time slot in Settings"} />
                    <Fact label="Level" value={group.level || "Not set"} />
                    <Fact label="Module" value={group.module || "Not set"} />
                    <Fact label="Capacity" value={group.max_capacity ? `${active.length}/${group.max_capacity}` : `${active.length} enrolled`} sub={group.max_capacity ? seatsLabel({ ...group, student_count: active.length }) : "No limit set"} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border px-4 py-3">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <Pill cls={`capitalize ${GROUP_STATUS_STYLES[group.group_status] || ""}`}>{group.group_status}</Pill>
                    <button onClick={() => onCopy(group.code)} className="ml-auto h-10 px-3 rounded-lg text-xs font-mono font-bold text-primary bg-primary/10 flex items-center gap-1.5">
                      <Copy className="w-3.5 h-3.5" /> Join code {group.code}
                    </button>
                  </div>
                  <Button onClick={() => onAssign(group.id)} disabled={group.group_status === "ended"} className="w-full h-12 gap-2 text-base">
                    <Sparkles className="w-4 h-4" /> Assign homework to this class
                  </Button>
                </div>
              )}

              {section === "students" && (
                <div className="space-y-2">
                  {active.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-6">
                      No students yet. They join by entering <span className="font-mono font-bold">{group.code}</span> at sign-up or in their profile.
                    </p>
                  ) : active.map((s) => {
                    const hw = hwByStudent[s.email] || { total: 0, completed: 0, overdue: 0 };
                    const pct = hw.total ? Math.round((hw.completed / hw.total) * 100) : 0;
                    return (
                      <div key={s.subscription_id} className="rounded-xl border border-border px-4 py-3 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <Pill cls={ACTIVITY_STYLES[s.activity]?.cls}>{ACTIVITY_STYLES[s.activity]?.label}</Pill>
                            <Button variant="outline" size="sm" onClick={() => onActivity({ email: s.email, name: s.name })} className="h-10 w-10 p-0" aria-label={`${s.name} progress`}>
                              <Activity className="w-4 h-4" />
                            </Button>
                            <button onClick={() => onRoster(s, true)} title="Remove from class" aria-label={`Remove ${s.name} from class`}
                              className="h-10 w-10 flex items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                              <UserMinus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[11px] text-muted-foreground tabular-nums whitespace-nowrap">
                            homework {hw.completed}/{hw.total}{s.week_minutes > 0 ? ` · ${s.week_minutes} min this week` : ""}
                          </span>
                          {hw.overdue > 0 && <Pill cls={HW_STYLES.overdue.cls}>{hw.overdue} overdue</Pill>}
                        </div>
                      </div>
                    );
                  })}
                  {removed.length > 0 && <RemovedList removed={removed} onRestore={(s) => onRoster(s, false)} />}
                </div>
              )}

              {section === "assignments" && (
                <div className="space-y-2">
                  <Button onClick={() => onAssign(group.id)} disabled={group.group_status === "ended"} className="w-full h-11 gap-2">
                    <Sparkles className="w-4 h-4" /> Assign homework
                  </Button>
                  {classAssignments.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-6">No homework for this class yet.</p>
                  ) : classAssignments.map((a) => {
                    const pct = a.counts.total ? Math.round((a.counts.completed / a.counts.total) * 100) : 0;
                    return (
                      <div key={a.id} className={`rounded-xl border border-border px-4 py-3 ${a.status !== "active" ? "opacity-60" : ""}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{a.title}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {a.skill_label || a.game}{a.due_date ? ` · due ${formatDate(a.due_date)}` : " · no due date"}{a.target === "students" ? " · selected students" : ""}
                            </p>
                          </div>
                          {a.status !== "active" && <Pill cls="bg-muted text-muted-foreground">Closed</Pill>}
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground tabular-nums flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />{a.counts.completed}/{a.counts.total}</span>
                          {a.counts.overdue > 0 && <span className="text-xs text-amber-600 tabular-nums flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />{a.counts.overdue}</span>}
                          {a.counts.assigned > 0 && <span className="text-xs text-muted-foreground tabular-nums flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{a.counts.assigned}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {section === "settings" && (
                <ClassForm key={group.id} initial={group} onSubmit={save} submitLabel="Save changes" submitting={saving} error={error} />
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Fact({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-border px-4 py-3 min-w-0">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground truncate">{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground truncate tabular-nums">{sub}</p>}
    </div>
  );
}

function RemovedList({ removed, onRestore }) {
  const [show, setShow] = useState(false);
  return (
    <div className="pt-2">
      <button onClick={() => setShow((v) => !v)} className="text-xs text-muted-foreground hover:text-foreground h-9">
        {show ? "Hide" : "Show"} {removed.length} removed
      </button>
      {show && removed.map((s) => (
        <div key={s.subscription_id} className="flex items-center justify-between py-2">
          <p className="text-xs text-muted-foreground">{s.name}</p>
          <button onClick={() => onRestore(s)} className="text-xs text-primary font-medium h-9 px-2">Restore</button>
        </div>
      ))}
    </div>
  );
}
