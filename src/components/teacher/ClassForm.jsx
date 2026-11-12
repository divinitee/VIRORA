import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DAY_OPTIONS, LEVEL_OPTIONS, CLASS_COLORS } from "@/components/teacher/panelUi";

// Create / edit a class (revamp 2026-11-12).
//
// Fixed weekly slot rule: one start/end time shared by every day the class
// meets. There is deliberately no per-day time input. teacherApi enforces the
// same rule (assertFixedSlot), this form only mirrors it for fast feedback.

const EMOJI_PRESETS = ["📘", "🎯", "🚀", "🌟", "🧠", "🗣️", "✏️", "🎧"];
const inputCls = "w-full h-11 px-3 border border-input rounded-xl text-sm bg-background text-foreground focus:border-primary focus:outline-none transition-colors";

export default function ClassForm({ initial, onSubmit, onCancel, submitLabel, submitting, error }) {
  const [label, setLabel] = useState(initial?.label || "");
  const [level, setLevel] = useState(initial?.level || "");
  const [module, setModule] = useState(initial?.module || "");
  const [capacity, setCapacity] = useState(initial?.max_capacity ? String(initial.max_capacity) : "");
  const [days, setDays] = useState(initial?.days || []);
  const [startTime, setStartTime] = useState(initial?.start_time || "");
  const [endTime, setEndTime] = useState(initial?.end_time || "");
  const [color, setColor] = useState(initial?.color || "");
  const [icon, setIcon] = useState(initial?.icon || "");
  const [groupStatus, setGroupStatus] = useState(initial?.group_status || "running");
  const [localError, setLocalError] = useState("");

  const toggleDay = (d) => setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : DAY_OPTIONS.filter((x) => x === d || prev.includes(x))));

  const submit = () => {
    setLocalError("");
    if (days.length && !startTime) return setLocalError("Pick a start time for the days this class meets.");
    if (startTime && endTime && endTime <= startTime) return setLocalError("End time must be after the start time.");
    const cap = capacity.trim();
    if (cap && (!/^\d+$/.test(cap) || Number(cap) < 1 || Number(cap) > 200)) return setLocalError("Capacity must be a number from 1 to 200.");
    const fields = {
      label: label.trim(),
      level: level || null,
      module: module.trim(),
      max_capacity: cap ? Number(cap) : null,
      days,
      start_time: startTime || null,
      end_time: endTime || null,
      color: color || null,
      icon: icon.trim(),
    };
    if (initial) fields.group_status = groupStatus;
    onSubmit(fields);
  };

  const shownError = localError || error;

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="sm:col-span-2 space-y-1.5 block">
          <span className="text-xs text-muted-foreground">Class name</span>
          <input type="text" placeholder="e.g. B2 Evening" value={label} onChange={(e) => setLabel(e.target.value)} maxLength={80} className={inputCls} />
        </label>
        <label className="space-y-1.5 block">
          <span className="text-xs text-muted-foreground">Level</span>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className={inputCls}>
            <option value="">Not set</option>
            {LEVEL_OPTIONS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>
        <label className="space-y-1.5 block">
          <span className="text-xs text-muted-foreground">Module</span>
          <input type="text" placeholder="e.g. Module 3" value={module} onChange={(e) => setModule(e.target.value)} maxLength={80} className={inputCls} />
        </label>
        <label className="space-y-1.5 block">
          <span className="text-xs text-muted-foreground">Max students</span>
          <input type="number" inputMode="numeric" min={1} max={200} placeholder="e.g. 12" value={capacity} onChange={(e) => setCapacity(e.target.value)} className={inputCls} />
        </label>
      </div>

      <div className="rounded-2xl border border-border p-4 space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Weekly time slot</p>
          <p className="text-xs text-muted-foreground">One fixed time for every day this class meets.</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {DAY_OPTIONS.map((d) => (
            <button key={d} type="button" onClick={() => toggleDay(d)} aria-pressed={days.includes(d)}
              className={`min-w-[44px] h-11 px-2 rounded-xl text-xs font-bold select-none transition-colors ${days.includes(d) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
              {d}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <label className="space-y-1.5 block">
            <span className="text-xs text-muted-foreground">Starts</span>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputCls} />
          </label>
          <label className="space-y-1.5 block">
            <span className="text-xs text-muted-foreground">Ends</span>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputCls} />
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-border p-4 space-y-3">
        <p className="text-sm font-semibold text-foreground">Appearance</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CLASS_COLORS).map(([key, hex]) => (
            <button key={key} type="button" onClick={() => setColor(color === key ? "" : key)} aria-label={`Colour ${key}`} aria-pressed={color === key}
              className={`w-10 h-10 rounded-full transition-transform ${color === key ? "ring-2 ring-offset-2 ring-offset-background ring-foreground scale-105" : "hover:scale-105"}`}
              style={{ background: hex }} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {EMOJI_PRESETS.map((e) => (
            <button key={e} type="button" onClick={() => setIcon(icon === e ? "" : e)} aria-pressed={icon === e}
              className={`w-10 h-10 rounded-xl text-lg transition-colors ${icon === e ? "bg-primary/20 ring-1 ring-primary" : "bg-muted hover:bg-muted/70"}`}>
              {e}
            </button>
          ))}
          <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="Own emoji" aria-label="Class emoji"
            className="w-24 h-10 px-3 border border-input rounded-xl text-sm bg-background text-foreground focus:border-primary focus:outline-none" />
        </div>
      </div>

      {initial && (
        <div>
          <p className="text-xs text-muted-foreground mb-1.5">Status</p>
          <div className="grid grid-cols-3 gap-1.5">
            {["running", "paused", "ended"].map((st) => (
              <button key={st} type="button" onClick={() => setGroupStatus(st)}
                className={`h-11 rounded-xl text-xs font-semibold select-none capitalize transition-colors ${groupStatus === st ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
                {st}
              </button>
            ))}
          </div>
          {groupStatus === "ended" && <p className="text-[11px] text-muted-foreground mt-1.5">Ended classes stop accepting new students and new homework.</p>}
        </div>
      )}

      {shownError && <p className="text-sm text-destructive">{shownError}</p>}

      <div className="flex gap-2 pt-1">
        <Button onClick={submit} disabled={submitting} className="flex-1 h-11">{submitting ? "Saving..." : submitLabel}</Button>
        {onCancel && <Button variant="outline" onClick={onCancel} className="h-11">Cancel</Button>}
      </div>
    </div>
  );
}
