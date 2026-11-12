import React from "react";

// Shared bits for the Teacher Panel (revamp 2026-11-12). Pulled out of
// TeacherDashboard.jsx so My Classes / Class Details can reuse them.

export const DAY_OPTIONS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const LEVEL_OPTIONS = ["Starter", "A1", "A2", "B1", "B2", "C1"];

export const ACTIVITY_STYLES = {
  active: { label: "Active", cls: "bg-emerald-500/10 text-emerald-600" },
  new: { label: "New", cls: "bg-muted text-muted-foreground" },
  inactive: { label: "Inactive 14d+", cls: "bg-amber-500/10 text-amber-600" },
};
export const HW_STYLES = {
  completed: { label: "Completed", cls: "bg-emerald-500/10 text-emerald-600" },
  overdue: { label: "Overdue", cls: "bg-amber-500/10 text-amber-600" },
  assigned: { label: "Assigned", cls: "bg-muted text-muted-foreground" },
};
export const GROUP_STATUS_STYLES = {
  running: "bg-emerald-500/10 text-emerald-600",
  paused: "bg-amber-500/10 text-amber-600",
  ended: "bg-muted text-muted-foreground",
};

// Calendar colours. Keys match the server whitelist (teacherApi COLORS).
export const CLASS_COLORS = {
  violet: "#8B5CF6",
  indigo: "#6366F1",
  blue: "#3B82F6",
  cyan: "#06B6D4",
  emerald: "#10B981",
  amber: "#F59E0B",
  rose: "#F43F5E",
  fuchsia: "#D946EF",
};
const COLOR_KEYS = Object.keys(CLASS_COLORS);

// Teacher's chosen colour, or a stable default from the class id so two
// uncoloured classes still look different on the calendar.
export function classColor(group) {
  if (group?.color && CLASS_COLORS[group.color]) return CLASS_COLORS[group.color];
  const id = String(group?.id || group?.code || "");
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return CLASS_COLORS[COLOR_KEYS[h % COLOR_KEYS.length]];
}

export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function timeAgo(iso) {
  if (!iso) return "";
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const h = Math.round(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export const formatDayPattern = (days) => (days?.length ? days.map((d) => d.slice(0, 2)).join(" ") : "");

export function formatSlot(group) {
  if (!group?.start_time) return "No time set";
  return group.end_time ? `${group.start_time}–${group.end_time}` : group.start_time;
}

// "8/12 seats left" when a capacity is set, otherwise just the head count.
export function seatsLabel(group) {
  const n = group?.student_count || 0;
  if (group?.max_capacity) {
    const left = Math.max(0, group.max_capacity - n);
    return `${left}/${group.max_capacity} seats left`;
  }
  return `${n} student${n === 1 ? "" : "s"}`;
}

export function Pill({ cls, children, style }) {
  return <span style={style} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap ${cls || ""}`}>{children}</span>;
}

export function Section({ title, empty, children, action }) {
  return (
    <section className="bg-background rounded-2xl border border-border overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
        {action}
      </div>
      {empty ? <p className="px-5 py-6 text-sm text-muted-foreground text-center">{empty}</p> : children}
    </section>
  );
}

export function Row({ title, sub, children, onClick }) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp onClick={onClick} className={`w-full flex items-center justify-between gap-3 px-5 py-3 border-b border-border last:border-0 text-left ${onClick ? "hover:bg-muted/30 transition-colors" : ""}`}>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{title}</p>
        {sub && <p className="text-xs text-muted-foreground truncate">{sub}</p>}
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">{children}</div>
    </Comp>
  );
}
