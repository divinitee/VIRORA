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

const HOUR_PX = 56;
const DEFAULT_MINUTES = 60; // display length when a class has no end time

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

  const allEvents = byDay.flat();
  const firstHour = allEvents.length ? Math.max(0, Math.min(8, Math.floor(Math.min(...allEvents.map((e) => e.start)) / 60))) : 8;
  const lastHour = allEvents.length ? Math.min(24, Math.max(20, Math.ceil(Math.max(...allEvents.map((e) => e.end)) / 60))) : 20;
  const hours = Array.from({ length: lastHour - firstHour }, (_, i) => firstHour + i);

  const goWeek = (n) => {
    setWeekOffset(n);
    if (n === 0 && todayIdx < 0) setMobileDay((today.getDay() + 6) % 7);
  };

  const weekLabel = `${fmtDay(weekDates[0])} – ${fmtDay(weekDates[6])}`;
  const weekName = weekOffset === 0 ? "This week" : weekOffset === -1 ? "Last week" : weekOffset === 1 ? "Next week" : weekLabel;

  return (
    <div className="space-y-4">
      {/* Header: title, week nav, create */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-foreground">My Classes</h1>
          <p className="text-xs text-muted-foreground">{weekName}{weekOffset !== 0 || true ? ` · ${weekLabel}` : ""}</p>
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
            <div className="grid relative" style={{ gridTemplateColumns: "56px repeat(7, minmax(0, 1fr))", height: hours.length * HOUR_PX }}>
              <div className="relative">
                {hours.map((h, i) => (
                  <span key={h} className="absolute right-2 text-[10px] text-muted-foreground tabular-nums -translate-y-1/2" style={{ top: i * HOUR_PX }}>
                    {i === 0 ? "" : `${String(h).padStart(2, "0")}:00`}
                  </span>
                ))}
              </div>
              {byDay.map((events, di) => (
                <div key={di} className={`relative border-l border-border ${di === todayIdx ? "bg-primary/[0.04]" : ""}`}>
                  {hours.map((h, i) => (
                    <div key={h} className="absolute inset-x-0 border-t border-border/50" style={{ top: i * HOUR_PX }} />
                  ))}
                  {events.map((ev) => (
                    <CalendarBlock key={ev.group.id} ev={ev} firstHour={firstHour} onOpen={() => onOpenClass(ev.group.id)} />
                  ))}
                </div>
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

function CalendarBlock({ ev, firstHour, onOpen }) {
  const g = ev.group;
  const color = classColor(g);
  const top = ((ev.start - firstHour * 60) / 60) * HOUR_PX;
  const height = Math.max(28, ((ev.end - ev.start) / 60) * HOUR_PX - 2);
  const width = 100 / ev.lanes;
  const roomy = height >= 84;
  const medium = height >= 52;
  return (
    <button onClick={onOpen}
      className={`absolute rounded-lg px-1.5 py-1 text-left overflow-hidden border transition-[filter] hover:brightness-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${g.group_status === "paused" ? "opacity-60" : ""}`}
      style={{
        top: top + 1,
        height,
        left: `calc(${ev.lane * width}% + 2px)`,
        width: `calc(${width}% - 4px)`,
        background: `${color}26`,
        borderColor: `${color}66`,
        borderLeft: `3px solid ${color}`,
      }}
      title={`${g.label || g.code} · ${formatSlot(g)}`}>
      <p className="text-[11px] font-bold text-foreground leading-tight truncate">{g.icon ? `${g.icon} ` : ""}{g.label || g.code}</p>
      {medium && (
        <p className="text-[10px] text-muted-foreground leading-tight truncate">
          {[g.level, g.module].filter(Boolean).join(" · ") || formatSlot(g)}
        </p>
      )}
      {roomy && <p className="text-[10px] text-muted-foreground leading-tight truncate tabular-nums">{formatSlot(g)}</p>}
      {roomy && <p className="text-[10px] font-semibold leading-tight truncate" style={{ color }}>{seatsLabel(g)}</p>}
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
