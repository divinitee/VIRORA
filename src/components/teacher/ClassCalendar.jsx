import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, CalendarDays, Users } from "lucide-react";
import { DAY_OPTIONS, classColor, formatSlot, seatsLabel, Pill, GROUP_STATUS_STYLES } from "@/components/teacher/panelUi";

// My Classes calendar (Teacher Panel revamp, 2026-11-12).
//
// Every class has ONE fixed weekly slot (start/end time) repeated on its
// days, so a week is just those slots laid onto Mon–Sun. Week navigation
// changes the dates shown (and "today"), not the classes.
//
// Desktop (md+): weekly grid, days across, time down.
// Mobile: day strip + agenda list for the picked day. No horizontal page
// overflow: the grid only renders at md+, and the filter row scrolls inside
// itself.

const HOUR_PX = 72; // tall enough that a 60-min class shows all five block details
const DEFAULT_MINUTES = 60; // display length when a class has no end time
const GAP_PX = 30; // height of a folded "no classes" stretch
const MIN_GAP_HOURS = 2; // only fold empty stretches at least this long
const COMPACT_KEY = "virora.teacher.calendarCompact";

const hh = (h) => `${String(h).padStart(2, "0")}:00`;

// Rows of the desktop grid, top to bottom: one row per hour, except that in
// compact mode a run of empty hours folds into a single thin "gap" row, and
// the empty hours before the first / after the last class are trimmed.
function buildRows(events, compact) {
  let first = 8;
  let last = 20;
  if (events.length) {
    const lo = Math.floor(Math.min(...events.map((e) => e.start)) / 60);
    const hi = Math.ceil(Math.max(...events.map((e) => e.end)) / 60);
    first = compact ? lo : Math.min(first, lo);
    last = compact ? hi : Math.max(last, hi);
  }
  last = Math.min(24, Math.max(last, first + 1));
  const busy = (h) => events.some((e) => e.start < (h + 1) * 60 && e.end > h * 60);
  const rows = [];
  let y = 0;
  for (let h = first; h < last;) {
    if (compact && !busy(h)) {
      let end = h;
      while (end < last && !busy(end)) end++;
      if (end - h >= MIN_GAP_HOURS) {
        rows.push({ type: "gap", from: h, to: end, top: y, height: GAP_PX });
        y += GAP_PX;
        h = end;
        continue;
      }
    }
    rows.push({ type: "hour", from: h, to: h + 1, top: y, height: HOUR_PX });
    y += HOUR_PX;
    h++;
  }
  // Minutes since midnight to a y position on this (possibly folded) grid.
  const yOf = (min) => {
    for (const r of rows) {
      if (min < r.to * 60) return r.type === "gap" ? r.top : r.top + ((Math.max(min, r.from * 60) - r.from * 60) / 60) * HOUR_PX;
    }
    return y;
  };
  return { rows, total: y, yOf };
}

function readCompact() {
  try { return localStorage.getItem(COMPACT_KEY) !== "0"; } catch { return true; }
}

const toMin = (hhmm) => {
  const [h, m] = String(hhmm || "").split(":").map(Number);
  return Number.isFinite(h) ? h * 60 + (m || 0) : null;
};

function startOfWeek(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dow = (d.getDay() + 6) % 7; // Mon = 0
  d.setDate(d.getDate() - dow);
  return d;
}
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const fmtDay = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

// Side-by-side lanes for classes that overlap on the same day.
function layoutDay(events) {
  const sorted = [...events].sort((a, b) => a.start - b.start || b.end - a.end);
  const out = [];
  let cluster = [];
  let clusterEnd = -1;
  const flush = () => {
    const lanes = [];
    for (const ev of cluster) {
      let lane = lanes.findIndex((end) => end <= ev.start);
      if (lane === -1) { lane = lanes.length; lanes.push(ev.end); } else lanes[lane] = ev.end;
      ev.lane = lane;
    }
    for (const ev of cluster) out.push({ ...ev, lanes: lanes.length });
    cluster = [];
    clusterEnd = -1;
  };
  for (const ev of sorted) {
    if (cluster.length && ev.start >= clusterEnd) flush();
    cluster.push(ev);
    clusterEnd = Math.max(clusterEnd, ev.end);
  }
  if (cluster.length) flush();
  return out;
}

export default function ClassCalendar({ groups, onOpenClass, onCreate }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [filter, setFilter] = useState("all");
  const [showEnded, setShowEnded] = useState(false);
  const today = new Date();
  const weekStart = addDays(startOfWeek(today), weekOffset * 7);
  const weekDates = DAY_OPTIONS.map((_, i) => addDays(weekStart, i));
  const todayIdx = weekDates.findIndex((d) => sameDay(d, today));
  const [mobileDay, setMobileDay] = useState(todayIdx >= 0 ? todayIdx : 0);

  const endedCount = groups.filter((g) => g.group_status === "ended").length;
  const visible = groups
    .filter((g) => showEnded || g.group_status !== "ended")
    .filter((g) => filter === "all" || g.id === filter);
  const scheduled = visible.filter((g) => g.days?.length && toMin(g.start_time) != null);
  const unscheduled = visible.filter((g) => !scheduled.includes(g));

  const byDay = useMemo(() => DAY_OPTIONS.map((day) => {
    const events = scheduled
      .filter((g) => g.days.includes(day))
      .map((g) => {
        const start = toMin(g.start_time);
        const endRaw = toMin(g.end_time);
        const end = endRaw != null && endRaw > start ? endRaw : start + DEFAULT_MINUTES;
        return { group: g, start, end };
      });
    return layoutDay(events);
  }), [scheduled]);

  // Compact (default): empty stretches fold away. Remembered per browser.
  const [compact, setCompactState] = useState(readCompact);
  const setCompact = (v) => {
    setCompactState(v);
    try { localStorage.setItem(COMPACT_KEY, v ? "1" : "0"); } catch { /* storage unavailable: in-memory only */ }
  };
  const { rows, total, yOf } = useMemo(() => buildRows(byDay.flat(), compact), [byDay, compact]);
  const hasGap = rows.some((r) => r.type === "gap");

  const goWeek = (n) => {
    setWeekOffset(n);
    if (n === 0 && todayIdx < 0) setMobileDay((today.getDay() + 6) % 7);
  };

  const weekLabel = `${fmtDay(weekDates[0])} – ${fmtDay(weekDates[6])}`;
  const weekName = weekOffset === 0 ? "This week" : weekOffset === -1 ? "Last week" : weekOffset === 1 ? "Next week" : weekOffset < 0 ? `${-weekOffset} weeks ago` : `In ${weekOffset} weeks`;

  return (
    <div className="space-y-4">
      {/* Header: title, week nav, create */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-foreground">My Classes</h1>
          <p className="text-xs text-muted-foreground">{`${weekName} · ${weekLabel}`}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-border bg-background">
            <button onClick={() => goWeek(weekOffset - 1)} className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground" aria-label="Previous week">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => goWeek(0)} disabled={weekOffset === 0}
              className="h-11 px-3 text-xs font-semibold text-foreground disabled:text-muted-foreground border-x border-border">
              This week
            </button>
            <button onClick={() => goWeek(weekOffset + 1)} className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground" aria-label="Next week">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <Button onClick={onCreate} className="h-11 gap-1.5"><Plus className="w-4 h-4" /> <span>New class</span></Button>
        </div>
      </div>

      {/* Class filter */}
      {groups.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1" role="group" aria-label="Filter by class">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>All classes</FilterChip>
          {groups.filter((g) => showEnded || g.group_status !== "ended").map((g) => (
            <FilterChip key={g.id} active={filter === g.id} onClick={() => setFilter(filter === g.id ? "all" : g.id)} color={classColor(g)}>
              {g.icon ? `${g.icon} ` : ""}{g.label || g.code}
            </FilterChip>
          ))}
          {endedCount > 0 && (
            <FilterChip active={showEnded} onClick={() => { setShowEnded((v) => !v); setFilter("all"); }}>
              {showEnded ? "Hide" : "Show"} ended ({endedCount})
            </FilterChip>
          )}
        </div>
      )}

      {groups.length === 0 ? (
        <div className="bg-background rounded-2xl border border-border p-8 text-center space-y-3">
          <CalendarDays className="w-8 h-8 text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">No classes yet. Create one to get a join code and put it on your calendar.</p>
          <Button onClick={onCreate} className="h-11 gap-1.5"><Plus className="w-4 h-4" /> Create your first class</Button>
        </div>
      ) : (
        <>
          {/* Desktop: weekly grid */}
          <div className="hidden md:flex justify-end -mt-1">
            <div className="grid grid-cols-2 gap-1 bg-muted p-1 rounded-xl" role="group" aria-label="Calendar density">
              <button onClick={() => setCompact(true)} aria-pressed={compact}
                className={`h-9 px-3 rounded-lg text-xs font-semibold ${compact ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                Compact
              </button>
              <button onClick={() => setCompact(false)} aria-pressed={!compact}
                className={`h-9 px-3 rounded-lg text-xs font-semibold ${!compact ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                Full day
              </button>
            </div>
          </div>
          <div className="hidden md:block bg-background rounded-2xl border border-border overflow-hidden">
            <div className="grid" style={{ gridTemplateColumns: "56px repeat(7, minmax(0, 1fr))" }}>
              <div className="border-b border-border" />
              {weekDates.map((d, i) => (
                <div key={i} className={`border-b border-l border-border px-2 py-2 text-center ${i === todayIdx ? "bg-primary/10" : ""}`}>
                  <p className={`text-[11px] font-semibold uppercase tracking-wide ${i === todayIdx ? "text-primary" : "text-muted-foreground"}`}>{DAY_OPTIONS[i]}</p>
                  <p className={`text-sm font-bold ${i === todayIdx ? "text-primary" : "text-foreground"}`}>{d.getDate()}</p>
                </div>
              ))}
            </div>
            <div className="grid relative" style={{ gridTemplateColumns: "56px repeat(7, minmax(0, 1fr))", height: total + 8 }}>
              <div className="relative">
                {rows.map((r) => (r.type === "hour" ? (
                  <span key={`l${r.from}`} className="absolute right-2 text-[10px] text-muted-foreground tabular-nums" style={{ top: r.top + 4 }}>
                    {hh(r.from)}
                  </span>
                ) : null))}
              </div>
              {byDay.map((events, di) => (
                <div key={di} className={`relative border-l border-border ${di === todayIdx ? "bg-primary/[0.04]" : ""}`}>
                  {rows.map((r, i) => (i === 0 || r.type === "gap" || rows[i - 1].type === "gap" ? null : (
                    <div key={`h${r.from}`} className="absolute inset-x-0 border-t border-border/40" style={{ top: r.top }} />
                  )))}
                  {events.map((ev) => (
                    <CalendarBlock key={ev.group.id} ev={ev} yOf={yOf} onOpen={() => onOpenClass(ev.group.id)} />
                  ))}
                </div>
              ))}
              {/* Folded empty stretches: one quiet band across the whole week. */}
              {rows.filter((r) => r.type === "gap").map((r) => (
                <button key={`g${r.from}`} onClick={() => setCompact(false)} title="Show the full day"
                  className="absolute left-0 right-0 flex items-center justify-center gap-2 text-[10px] font-medium text-muted-foreground hover:text-foreground bg-muted/40 border-y border-dashed border-border/70 transition-colors"
                  style={{ top: r.top, height: r.height }}>
                  <span className="tabular-nums">{hh(r.from)} – {hh(r.to)}</span>
                  <span aria-hidden="true">·</span>
                  <span>no classes</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile: day strip + agenda */}
          <div className="md:hidden space-y-3">
            <div className="grid grid-cols-7 gap-1">
              {weekDates.map((d, i) => {
                const count = byDay[i].length;
                return (
                  <button key={i} onClick={() => setMobileDay(i)} aria-pressed={mobileDay === i}
                    className={`rounded-xl py-2 flex flex-col items-center gap-0.5 min-h-[56px] transition-colors ${mobileDay === i ? "bg-primary text-primary-foreground" : i === todayIdx ? "bg-primary/10 text-primary" : "bg-background border border-border text-muted-foreground"}`}>
                    <span className="text-[10px] font-semibold uppercase">{DAY_OPTIONS[i].slice(0, 2)}</span>
                    <span className="text-sm font-bold">{d.getDate()}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${count ? (mobileDay === i ? "bg-primary-foreground" : "bg-primary") : "bg-transparent"}`} />
                  </button>
                );
              })}
            </div>
            <p className="text-xs font-semibold text-muted-foreground">
              {weekDates[mobileDay].toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            {byDay[mobileDay].length === 0 ? (
              <p className="bg-background rounded-2xl border border-border px-5 py-6 text-sm text-muted-foreground text-center">No classes on this day.</p>
            ) : (
              [...byDay[mobileDay]].sort((a, b) => a.start - b.start).map((ev) => (
                <AgendaCard key={ev.group.id} group={ev.group} onOpen={() => onOpenClass(ev.group.id)} />
              ))
            )}
          </div>

          {unscheduled.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">No time slot yet</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {unscheduled.map((g) => <AgendaCard key={g.id} group={g} onOpen={() => onOpenClass(g.id)} />)}
              </div>
            </div>
          )}
          {visible.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">No classes match this filter.</p>
          )}
        </>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, color, children }) {
  return (
    <button onClick={onClick} aria-pressed={active}
      className={`flex-shrink-0 h-9 px-3 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${active ? "bg-primary text-primary-foreground" : "bg-background border border-border text-muted-foreground hover:text-foreground"}`}>
      {color && <span className="w-2 h-2 rounded-full" style={{ background: color }} />}
      {children}
    </button>
  );
}

function CalendarBlock({ ev, yOf, onOpen }) {
  const g = ev.group;
  const color = classColor(g);
  const top = yOf(ev.start) + 2;
  const height = Math.max(28, yOf(ev.end) - yOf(ev.start) - 4);
  const width = 100 / ev.lanes;
  const showMeta = height >= 40;
  const showTime = height >= 54;
  const showSeats = height >= 66;
  return (
    <button onClick={onOpen}
      className={`absolute z-[1] rounded-lg px-1.5 py-1 text-left overflow-hidden border transition-[filter] hover:brightness-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${g.group_status === "paused" ? "opacity-60" : ""}`}
      style={{
        top,
        height,
        left: `calc(${ev.lane * width}% + 3px)`,
        width: `calc(${width}% - 6px)`,
        // Solid base under the tint, so hour lines never show through a class.
        background: `linear-gradient(${color}2e, ${color}2e), hsl(var(--background))`,
        borderColor: `${color}66`,
        borderLeft: `3px solid ${color}`,
      }}
      title={`${g.label || g.code} · ${formatSlot(g)}`}>
      <p className="text-[11px] font-bold text-foreground leading-tight truncate">{g.icon ? `${g.icon} ` : ""}{g.label || g.code}</p>
      {showMeta && (g.level || g.module) && (
        <p className="text-[10px] text-muted-foreground leading-tight truncate">
          {[g.level, g.module].filter(Boolean).join(" · ")}
        </p>
      )}
      {showTime && <p className="text-[10px] text-muted-foreground leading-tight truncate tabular-nums">{formatSlot(g)}</p>}
      {showSeats && <p className="text-[10px] font-semibold leading-tight truncate" style={{ color }}>{seatsLabel(g)}</p>}
    </button>
  );
}

function AgendaCard({ group: g, onOpen }) {
  const color = classColor(g);
  return (
    <button onClick={onOpen} className="w-full bg-background rounded-2xl border border-border p-4 text-left flex items-center gap-3 hover:border-primary/40 transition-colors min-h-[72px]"
      style={{ borderLeft: `4px solid ${color}` }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-lg" style={{ background: `${color}26` }}>
        {g.icon || <Users className="w-5 h-5" style={{ color }} />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="text-sm font-semibold text-foreground truncate">{g.label || g.code}</p>
          {g.level && <Pill cls="text-primary bg-primary/10">{g.level}</Pill>}
          {g.group_status !== "running" && <Pill cls={`capitalize ${GROUP_STATUS_STYLES[g.group_status] || ""}`}>{g.group_status}</Pill>}
        </div>
        <p className="text-xs text-muted-foreground truncate tabular-nums">
          {formatSlot(g)}{g.module ? ` · ${g.module}` : ""}
        </p>
        <p className="text-xs font-semibold" style={{ color }}>{seatsLabel(g)}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    </button>
  );
}
