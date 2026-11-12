import BrandLoader from "@/components/loading/PageLoader";
import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BookOpen, LogOut, RefreshCw, ChevronDown, ChevronRight, AlertTriangle,
  Sparkles, Activity, ClipboardList, CheckCircle2, Clock, FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { resolveUserNameOrEmail } from "@/lib/profileName";
import { SUB_KIND_META } from "@/lib/subscription";
import { teacherApi } from "@/lib/serverApi";
import BetaBadge from "@/components/BetaBadge";
import ActivityReport from "@/components/ActivityReport";
import { skillRows } from "@/lib/gameSkills";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ClassCalendar from "@/components/teacher/ClassCalendar";
import ClassDetails from "@/components/teacher/ClassDetails";
import ClassForm from "@/components/teacher/ClassForm";
import { ACTIVITY_STYLES, HW_STYLES, Pill, Section, Row, formatDate, timeAgo } from "@/components/teacher/panelUi";

// Teacher Panel (rebuilt 2026-09-23, phase 1; revamped 2026-11-12).
//
// Everything on this page reads and writes through teacherApi
// (base44/functions/teacherApi), which scopes every query to the calling
// teacher server-side. Nothing here talks to StudentSubscription /
// TeacherReferral / HomeworkAssignment directly any more.
//
// Revamp 2026-11-12 (VIRORA Teacher Panel executive order):
//   Overview = one big Assign Homework button + three compact summary cards
//     that link to their filtered views (no long lists, no "New class").
//   My Classes = weekly calendar (agenda on mobile), class filter, class
//     creation, and Class Details (Overview / Students / Assignments /
//     Settings). Each class has ONE fixed weekly time slot.
//
// URL state (so every card/link is a real, shareable view):
//   ?tab=classes&class=<id>   open a class's details
//   ?tab=classes&new=1        open the create-class form
//   ?tab=students&filter=attention
//   ?tab=assignments&view=active|recent|closed

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "classes", label: "My Classes" },
  { id: "students", label: "Students" },
  { id: "assignments", label: "Assignments" },
  { id: "materials", label: "Materials" },
];

function greetingWord() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = TABS.some((t) => t.id === searchParams.get("tab")) ? searchParams.get("tab") : "overview";
  // Replace the query string with exactly these params (tab + its filters).
  const go = (id, extra = {}) => {
    const next = new URLSearchParams();
    if (id !== "overview") next.set("tab", id);
    for (const [k, v] of Object.entries(extra)) if (v != null && v !== "") next.set(k, v);
    setSearchParams(next, { replace: false });
    window.scrollTo?.({ top: 0 });
  };
  const setParam = (k, v) => {
    const next = new URLSearchParams(searchParams);
    if (v == null || v === "") next.delete(k); else next.set(k, v);
    setSearchParams(next, { replace: true });
  };

  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [access, setAccess] = useState("loading"); // loading | approved | pending | rejected | none | error
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState("");
  const [activityStudent, setActivityStudent] = useState(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSaving, setCreateSaving] = useState(false);

  const flash = (msg) => { setNotice(msg); setTimeout(() => setNotice(""), 2500); };

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const me = await base44.auth.me();
      setUser(me);
      const res = await teacherApi("overview");
      if (res?.access !== "approved") {
        setAccess(res?.access || "none");
        if (!["pending", "rejected"].includes(res?.access) && me.role !== "admin") navigate("/");
        return;
      }
      setData(res);
      setAccess("approved");
    } catch (e) {
      console.error("teacher overview failed", e);
      setAccess((prev) => (prev === "approved" ? prev : "error"));
    } finally {
      setRefreshing(false);
    }
  };
  useEffect(() => { load(); }, []);

  // Per-student homework tallies, derived from the assignment recipients.
  const hwByStudent = useMemo(() => {
    const map = {};
    for (const a of data?.assignments || []) {
      if (a.status !== "active") continue;
      for (const r of a.recipients) {
        const m = (map[r.email] ||= { total: 0, completed: 0, overdue: 0 });
        m.total += 1;
        if (r.status === "completed") m.completed += 1;
        if (r.status === "overdue") m.overdue += 1;
      }
    }
    return map;
  }, [data]);

  if (access === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <BrandLoader size={64} />
      </div>
    );
  }

  const header = (
    <header className="bg-background border-b border-border px-4 pb-3 flex items-center justify-between safe-header sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary select-none" />
        <span className="font-bold text-foreground">Teacher Panel</span>
        <BetaBadge className="ml-1" />
      </div>
      <div className="flex items-center gap-1">
        {access === "approved" && (
          <button onClick={() => load(true)} className="text-muted-foreground hover:text-foreground transition-colors p-2.5" aria-label="Refresh">
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        )}
        <button onClick={() => base44.auth.logout("/login")} className="text-muted-foreground hover:text-foreground transition-colors p-2.5" aria-label="Log out">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );

  if (access !== "approved") {
    const copy = {
      pending: ["Your teacher application is being reviewed", "We'll switch on your Teacher Panel as soon as it's approved. Nothing to do until then."],
      rejected: ["Your teacher application wasn't approved", user?.teacher_status_note || "Contact us if you think this is a mistake."],
      error: ["Couldn't load your Teacher Panel", "Check your connection and try again."],
    }[access] || ["Teacher access required", ""];
    return (
      <div className="min-h-screen bg-muted/40 flex flex-col">
        {header}
        <div className="max-w-md mx-auto px-4 py-16 text-center space-y-3">
          <h1 className="text-xl font-bold text-foreground">{copy[0]}</h1>
          <p className="text-sm text-muted-foreground">{copy[1]}</p>
          {access === "error" && <Button onClick={() => load()} className="mt-2">Try again</Button>}
        </div>
      </div>
    );
  }

  const groups = data.groups || [];
  const students = data.students || [];
  const assignments = data.assignments || [];
  const activeStudents = students.filter((s) => s.roster_status === "active");
  const activeAssignments = assignments.filter((a) => a.status === "active");
  const attention = activeStudents
    .map((s) => ({ ...s, overdue: hwByStudent[s.email]?.overdue || 0 }))
    .filter((s) => s.overdue > 0 || s.activity === "inactive");
  const assignable = groups.filter((g) => g.group_status !== "ended");

  // Assign Homework: straight into the Skill Hub picker, with the class
  // preselected when we know it. No classes yet means create one first.
  const assign = (groupId) => {
    if (!assignable.length) { go("classes", { new: "1" }); return; }
    navigate(groupId ? `/teacher/skill-hub?class=${encodeURIComponent(groupId)}` : "/teacher/skill-hub");
  };

  const openClassId = tab === "classes" ? searchParams.get("class") : null;
  const openClass = openClassId ? groups.find((g) => g.id === openClassId) || null : null;
  const showCreate = creating || (tab === "classes" && searchParams.get("new") === "1");
  const closeCreate = () => { setCreating(false); setCreateError(""); if (searchParams.get("new")) setParam("new", null); };

  const saveClass = async (groupId, fields) => {
    await teacherApi("updateGroup", { group_id: groupId, ...fields });
    flash("Class updated.");
    await load(true);
  };
  const createClass = async (fields) => {
    setCreateSaving(true);
    setCreateError("");
    try {
      const res = await teacherApi("createGroup", fields);
      closeCreate();
      flash("Class created. Share its code with your students.");
      await load(true);
      if (res?.group?.id) go("classes", { class: res.group.id });
    } catch (e) {
      setCreateError(e?.message || "Couldn't create the class.");
    } finally {
      setCreateSaving(false);
    }
  };
  const setRoster = async (student, removed) => {
    try {
      await teacherApi("setRoster", { subscription_id: student.subscription_id, removed });
      flash(removed ? `${student.name} removed from the class.` : `${student.name} restored.`);
      await load(true);
    } catch (e) {
      flash(e?.message || "Couldn't update the roster.");
    }
  };
  const copyCode = (code) => {
    navigator.clipboard?.writeText(code);
    flash(`Code copied: ${code}`);
  };

  const wide = tab === "classes";

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col">
      {header}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className={`${wide ? "max-w-6xl" : "max-w-3xl"} mx-auto px-4 py-5 space-y-5 pb-28 sm:pb-8`}>
          <nav className="grid grid-cols-5 gap-1 bg-muted p-1 rounded-xl max-w-3xl" aria-label="Teacher Panel sections">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => go(t.id)}
                aria-current={tab === t.id ? "page" : undefined}
                className={`min-h-[44px] rounded-lg text-[11px] sm:text-xs font-semibold transition-all select-none px-1 leading-tight ${tab === t.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {notice && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-sm text-emerald-700 dark:text-emerald-400 font-medium">{notice}</div>
          )}

          {tab === "overview" && (
            <OverviewTab
              user={user}
              hasClasses={assignable.length > 0}
              activeAssignments={activeAssignments}
              attention={attention}
              recent={data.recent_completions || []}
              go={go}
              onAssign={() => assign()}
            />
          )}
          {tab === "classes" && (
            <ClassCalendar
              groups={groups}
              onOpenClass={(id) => setParam("class", id)}
              onCreate={() => { setCreateError(""); setCreating(true); }}
            />
          )}
          {tab === "students" && (
            <StudentsTab
              groups={groups}
              students={students}
              attention={attention}
              hwByStudent={hwByStudent}
              onlyAttention={searchParams.get("filter") === "attention"}
              setOnlyAttention={(on) => setParam("filter", on ? "attention" : null)}
              onActivity={setActivityStudent}
            />
          )}
          {tab === "assignments" && (
            <AssignmentsTab
              assignments={assignments}
              recent={data.recent_completions || []}
              view={["active", "recent", "closed"].includes(searchParams.get("view")) ? searchParams.get("view") : "active"}
              setView={(v) => setParam("view", v === "active" ? null : v)}
              onAssign={() => assign()}
              onChanged={() => load(true)}
              flash={flash}
            />
          )}
          {tab === "materials" && <MaterialsTab onOpen={() => navigate("/teacher/materials")} />}
        </div>
      </div>

      {/* Mobile: Assign Homework always one tap away (Overview has its own big button). */}
      {tab !== "overview" && (
        <div className="sm:hidden fixed inset-x-0 bottom-0 z-30 px-4 pt-3 bg-gradient-to-t from-background via-background/95 to-transparent" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
          <Button onClick={() => assign()} className="w-full h-12 gap-2 text-base shadow-lg shadow-primary/30">
            <Sparkles className="w-4 h-4" /> Assign homework
          </Button>
        </div>
      )}

      <ClassDetails
        group={openClass}
        students={students}
        assignments={assignments}
        hwByStudent={hwByStudent}
        onClose={() => setParam("class", null)}
        onSave={saveClass}
        onRoster={setRoster}
        onActivity={setActivityStudent}
        onAssign={(id) => assign(id)}
        onCopy={copyCode}
      />

      <Dialog open={showCreate} onOpenChange={(o) => { if (!o) closeCreate(); }}>
        <DialogContent className="max-h-[92vh] overflow-y-auto overflow-x-hidden w-[calc(100vw-1rem)] sm:max-w-xl rounded-2xl">
          <DialogHeader className="text-left">
            <DialogTitle>New class</DialogTitle>
            <DialogDescription>Each class gets a join code your students enter, and one fixed weekly time slot.</DialogDescription>
          </DialogHeader>
          {showCreate && <ClassForm onSubmit={createClass} onCancel={closeCreate} submitLabel="Create class" submitting={createSaving} error={createError} />}
        </DialogContent>
      </Dialog>

      <StudentActivityDialog student={activityStudent} onClose={() => setActivityStudent(null)} />
    </div>
  );
}

/* ------------------------------------------------------------ Overview */

function OverviewTab({ user, hasClasses, activeAssignments, attention, recent, go, onAssign }) {
  const overdueCount = attention.filter((s) => s.overdue > 0).length;
  const inactiveCount = attention.filter((s) => s.activity === "inactive").length;
  const latest = recent[0];
  const nextDue = activeAssignments
    .filter((a) => a.due_date)
    .sort((a, b) => a.due_date.localeCompare(b.due_date))[0];
  const cards = [
    {
      key: "attention",
      title: "Needs attention",
      value: attention.length,
      icon: AlertTriangle,
      warn: attention.length > 0,
      sub: attention.length
        ? [overdueCount && `${overdueCount} with overdue work`, inactiveCount && `${inactiveCount} inactive 14d+`].filter(Boolean).join(" · ")
        : "Nobody is behind",
      onClick: () => go("students", { filter: "attention" }),
    },
    {
      key: "recent",
      title: "Recently completed",
      value: recent.length,
      icon: CheckCircle2,
      sub: latest ? `Latest: ${latest.student_name} · ${timeAgo(latest.completed_at)}` : "No completions yet",
      onClick: () => go("assignments", { view: "recent" }),
    },
    {
      key: "active",
      title: "Active homework",
      value: activeAssignments.length,
      icon: ClipboardList,
      sub: nextDue ? `Next due ${formatDate(nextDue.due_date)}` : activeAssignments.length ? "No due dates set" : "No homework out",
      onClick: () => go("assignments", { view: "active" }),
    },
  ];
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-2xl border border-primary/25 p-5 space-y-4">
        <div>
          <p className="text-xs text-muted-foreground">{greetingWord()},</p>
          <h1 className="text-xl font-bold text-foreground">{resolveUserNameOrEmail(user)?.split(" ")[0] || "Teacher"}</h1>
        </div>
        <Button onClick={onAssign} className="w-full h-16 gap-3 text-lg font-bold rounded-2xl shadow-lg shadow-primary/30">
          <Sparkles className="w-5 h-5" /> Assign Homework
        </Button>
        {!hasClasses && (
          <p className="text-xs text-muted-foreground">
            You need a class first.{" "}
            <button onClick={() => go("classes", { new: "1" })} className="text-primary font-semibold underline-offset-2 hover:underline">Create one in My Classes</button>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cards.map((c) => (
          <button key={c.key} onClick={c.onClick}
            className="group bg-background rounded-2xl border border-border p-4 text-left hover:border-primary/40 transition-colors flex sm:flex-col items-center sm:items-start gap-3 min-h-[72px]">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.warn ? "bg-amber-500/10" : "bg-primary/10"}`}>
              <c.icon className={`w-5 h-5 ${c.warn ? "text-amber-500" : "text-primary"}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <p className={`text-2xl font-bold tabular-nums ${c.warn ? "text-amber-600" : "text-foreground"}`}>{c.value}</p>
                <p className="text-sm font-semibold text-foreground">{c.title}</p>
              </div>
              <p className="text-xs text-muted-foreground truncate">{c.sub}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 sm:hidden" />
            <span className="hidden sm:inline text-xs font-semibold text-primary group-hover:underline">View all →</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Students */

function StudentsTab({ groups, students, attention, hwByStudent, onlyAttention, setOnlyAttention, onActivity }) {
  const [groupFilter, setGroupFilter] = useState("all");
  const attentionEmails = new Set(attention.map((s) => s.email));
  const rows = students
    .filter((s) => s.roster_status === "active")
    .filter((s) => !onlyAttention || attentionEmails.has(s.email))
    .filter((s) => groupFilter === "all" || s.group_code === groupFilter);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <div className="grid grid-cols-2 gap-1 bg-muted p-1 rounded-xl">
          <button onClick={() => setOnlyAttention(false)} aria-pressed={!onlyAttention}
            className={`h-10 px-3 rounded-lg text-xs font-semibold ${!onlyAttention ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>All students</button>
          <button onClick={() => setOnlyAttention(true)} aria-pressed={onlyAttention}
            className={`h-10 px-3 rounded-lg text-xs font-semibold ${onlyAttention ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>Needs attention ({attention.length})</button>
        </div>
        {groups.length > 1 && (
          <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)} aria-label="Filter by class"
            className="flex-1 min-w-[160px] h-12 px-3 border border-input rounded-xl text-sm bg-background text-foreground">
            <option value="all">All classes</option>
            {groups.map((g) => <option key={g.id} value={g.code}>{g.label || g.code}</option>)}
          </select>
        )}
      </div>
      <Section
        title={`${onlyAttention ? "Needs attention" : "Students"} (${rows.length})`}
        empty={rows.length === 0 ? (onlyAttention ? "Nobody is behind. Overdue homework and students inactive for 14+ days show up here." : "No students yet. Share a class code to get started.") : null}
      >
        {rows.map((s) => {
          const hw = hwByStudent[s.email] || { total: 0, completed: 0, overdue: 0 };
          const kind = SUB_KIND_META[s.plan_kind];
          return (
            <div key={s.subscription_id} className="flex items-center justify-between px-5 py-3 border-b border-border last:border-0 gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {s.group_label || s.group_code}
                  {` · homework ${hw.completed}/${hw.total}`}
                  {s.week_minutes > 0 && ` · ${s.week_minutes} min this week`}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {hw.overdue > 0 && <Pill cls={HW_STYLES.overdue.cls}>{hw.overdue} overdue</Pill>}
                <Pill cls={ACTIVITY_STYLES[s.activity]?.cls}>{ACTIVITY_STYLES[s.activity]?.label}</Pill>
                {kind && <span className="hidden sm:inline"><Pill cls={kind.cls}>{kind.label}</Pill></span>}
                <Button variant="outline" size="sm" onClick={() => onActivity({ email: s.email, name: s.name })} className="h-10 w-10 p-0" aria-label={`${s.name} progress`}>
                  <Activity className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </Section>
    </div>
  );
}

/* ------------------------------------------------------------ Assignments */

function AssignmentsTab({ assignments, recent, view, setView, onAssign, onChanged, flash }) {
  const [expanded, setExpanded] = useState(null);
  const active = assignments.filter((a) => a.status === "active");
  const closed = assignments.filter((a) => a.status !== "active");

  const toggleClosed = async (a) => {
    try {
      await teacherApi("closeAssignment", { assignment_id: a.id, reopen: a.status !== "active" });
      flash(a.status === "active" ? "Homework closed. Students no longer see it." : "Homework reopened.");
      await onChanged();
    } catch (e) {
      flash(e?.message || "Couldn't update the homework.");
    }
  };

  const views = [
    { id: "active", label: `Active (${active.length})` },
    { id: "recent", label: "Recently completed" },
    { id: "closed", label: `Closed (${closed.length})` },
  ];

  return (
    <div className="space-y-4">
      <Button onClick={onAssign} className="hidden sm:flex w-full h-12 gap-2 text-base"><Sparkles className="w-4 h-4" /> Assign homework</Button>
      <div className="grid grid-cols-3 gap-1 bg-muted p-1 rounded-xl" role="group" aria-label="Homework view">
        {views.map((v) => (
          <button key={v.id} onClick={() => setView(v.id)} aria-pressed={view === v.id}
            className={`min-h-[44px] rounded-lg text-[11px] sm:text-xs font-semibold px-1 leading-tight ${view === v.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            {v.label}
          </button>
        ))}
      </div>

      {view === "active" && (
        active.length === 0
          ? <p className="text-center text-sm text-muted-foreground py-6">No active homework.</p>
          : active.map((a) => (
            <AssignmentCard key={a.id} a={a} expanded={expanded === a.id} onToggle={() => setExpanded(expanded === a.id ? null : a.id)} onClose={() => toggleClosed(a)} />
          ))
      )}

      {view === "recent" && (
        <Section title="Recently completed" empty={recent.length === 0 ? "Completed homework will appear here as students finish it." : null}>
          {recent.map((r) => (
            <Row key={`${r.assignment_id}-${r.student_email}`} title={r.student_name} sub={`${r.assignment_title} · ${timeAgo(r.completed_at)}`}>
              {r.best_score_pct != null && <span className="text-sm font-bold text-emerald-600 tabular-nums">{r.best_score_pct}%</span>}
              {r.completed_late && <Pill cls={HW_STYLES.overdue.cls}>late</Pill>}
            </Row>
          ))}
        </Section>
      )}

      {view === "closed" && (
        closed.length === 0
          ? <p className="text-center text-sm text-muted-foreground py-6">No closed homework.</p>
          : closed.map((a) => (
            <AssignmentCard key={a.id} a={a} expanded={expanded === a.id} onToggle={() => setExpanded(expanded === a.id ? null : a.id)} onClose={() => toggleClosed(a)} />
          ))
      )}
    </div>
  );
}

function AssignmentCard({ a, expanded, onToggle, onClose }) {
  const pct = a.counts.total ? Math.round((a.counts.completed / a.counts.total) * 100) : 0;
  return (
    <div className={`bg-background rounded-2xl border border-border overflow-hidden ${a.status !== "active" ? "opacity-70" : ""}`}>
      <button onClick={onToggle} className="w-full px-5 py-4 text-left hover:bg-muted/30 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{a.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {a.group_label || a.group_code}
              {a.target === "students" ? " · selected students" : ""}
              {a.skill_label ? ` · ${a.skill_label}` : ""}
              {a.due_date ? ` · due ${formatDate(a.due_date)}` : " · no due date"}
            </p>
          </div>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 mt-0.5 ${expanded ? "rotate-180" : ""}`} />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />{a.counts.completed}/{a.counts.total}</span>
          {a.counts.overdue > 0 && <span className="text-xs text-amber-600 tabular-nums flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />{a.counts.overdue}</span>}
          {a.counts.assigned > 0 && <span className="text-xs text-muted-foreground tabular-nums flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{a.counts.assigned}</span>}
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t border-border">
            {a.recipients.length === 0 ? (
              <p className="text-center text-xs text-muted-foreground py-6">No students in this class yet.</p>
            ) : a.recipients.map((r) => (
              <div key={r.email} className="flex items-center justify-between px-5 py-2.5 border-b border-border last:border-0 gap-2">
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">{r.name}{!r.still_member && <span className="text-xs text-muted-foreground"> (left class)</span>}</p>
                  {r.completed_at && <p className="text-[11px] text-muted-foreground">{formatDate(r.completed_at)}{r.attempts > 1 ? ` · ${r.attempts} attempts` : ""}</p>}
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {r.best_score_pct != null && <span className="text-sm font-bold text-emerald-600 tabular-nums">{r.best_score_pct}%</span>}
                  {r.completed_late && <Pill cls={HW_STYLES.overdue.cls}>late</Pill>}
                  <Pill cls={HW_STYLES[r.status].cls}>{HW_STYLES[r.status].label}</Pill>
                </div>
              </div>
            ))}
            <div className="px-5 py-2 bg-muted/20 flex justify-end">
              <button onClick={onClose} className="h-10 px-2 text-xs font-medium text-muted-foreground hover:text-foreground">
                {a.status === "active" ? "Close homework" : "Reopen homework"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------ Materials */

function MaterialsTab({ onOpen }) {
  return (
    <div className="bg-background rounded-2xl border border-border p-5 space-y-3">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Material Library</h3>
        <BetaBadge />
      </div>
      <p className="text-sm text-muted-foreground">
        Upload or paste your own teaching material. VIRORA stores it and writes a short summary. You can't turn materials into homework or share them with students yet.
      </p>
      <Button onClick={onOpen} variant="outline" className="gap-2 h-11"><FileText className="w-4 h-4" /> Open Material Library</Button>
    </div>
  );
}

/* ------------------------------------------------------------ Activity dialog */

// VT-2.3.3 (Claude, 2026-11-03): the student's five skills, from the same
// server SkillState they see themselves (teacherApi.studentProgress checks the
// roster first). Read-only; nothing here is computed in the browser.
const SKILL_NAME = { vocabulary: "Vocabulary", grammar: "Grammar", spelling: "Spelling", comprehension: "Comprehension", creativity: "Creativity" };
const CONFIDENCE_NAME = { low: "low confidence", medium: "medium confidence", high: "high confidence" };

function StudentSkills({ state }) {
  if (!state) return null;
  const rows = skillRows(state);
  if (!rows.some((r) => r.evidence_count)) {
    return <p className="rounded-xl border border-border/60 px-3 py-3 text-sm text-muted-foreground">No graded practice yet, so there are no skill levels to show.</p>;
  }
  return (
    <div className="space-y-2.5">
      {rows.map((r) => (
        <div key={r.key}>
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium text-foreground">{r.emoji} {SKILL_NAME[r.key] || r.key}</span>
            <span className="text-xs text-muted-foreground">
              {r.evidence_count ? `${r.current_mastery}% · ${CONFIDENCE_NAME[r.confidence] || r.confidence} · ${r.round_count || r.evidence_count} rounds` : "not practised yet"}
            </span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full" style={{ width: `${r.evidence_count ? r.current_mastery : 0}%`, background: r.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function StudentActivityDialog({ student, onClose }) {
  const [sessions, setSessions] = useState([]);
  const [skills, setSkills] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!student) return;
    let active = true;
    setLoading(true);
    setSkills(null);
    Promise.all([
      teacherApi("studentActivity", { email: student.email })
        .then((res) => { if (active) setSessions(res?.sessions || []); })
        .catch((error) => { console.error("Student activity load failed:", error); if (active) setSessions([]); }),
      teacherApi("studentProgress", { email: student.email })
        .then((res) => { if (active) setSkills(res || null); })
        .catch((error) => { console.error("Student progress load failed:", error); }),
    ]).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [student?.email]);
  return (
    <Dialog open={!!student} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto w-[calc(100vw-1rem)] sm:max-w-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>{student?.name || "Student"} · Progress</DialogTitle>
          <DialogDescription>Skill levels from graded practice, and active learning time recorded in VIRORA.</DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center py-12"><RefreshCw className="w-5 h-5 animate-spin text-primary" /></div>
        ) : (
          <div className="space-y-5">
            {skills && (
              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Skills</h3>
                <StudentSkills state={skills} />
              </section>
            )}
            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Activity</h3>
              <ActivityReport sessions={sessions} compact />
            </section>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
