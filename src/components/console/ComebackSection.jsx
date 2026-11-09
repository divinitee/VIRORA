import BrandLoader from "@/components/BrandLoader";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Repeat, Flame, CalendarCheck, Users, Search } from "lucide-react";
import { consoleApi, errorText } from "@/lib/consoleApi";

// Comeback: who used VIRORA one day and came back the next (Comeback Revamp,
// Phase 1). Read-only. A day counts only when the student FINISHED something
// (a round or a lesson answer), on Tashkent time. "Opened" = was in the app
// but finished nothing. The future student streak reads the same log.

const WINDOWS = [7, 14, 30];
const WD = ["S", "M", "T", "W", "T", "F", "S"];

function Tile({ icon: Icon, label, value, note, accent = "text-white" }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#11122A] p-4">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/50">
        <Icon className="h-4 w-4" /> {label}
      </div>
      <div className={`mt-2 text-2xl font-bold tabular-nums ${accent}`}>{value}</div>
      {note && <div className="mt-1 text-xs text-white/50">{note}</div>}
    </div>
  );
}

function Cell({ code, isToday }) {
  const base = "mx-auto h-5 w-5 rounded-md";
  const ring = isToday ? " ring-1 ring-[#E9D29A]/60 ring-offset-1 ring-offset-[#11122A]" : "";
  if (code === "L") return <div className={`${base} bg-violet-500${ring}`} title="Learned" />;
  if (code === "O") return <div className={`${base} border border-violet-400/60${ring}`} title="Opened only" />;
  return <div className={`${base} bg-white/5${ring}`} title="Nothing" />;
}

export default function ComebackSection({ onSessionLost }) {
  const [windowDays, setWindowDays] = useState(14);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [q, setQ] = useState("");

  const load = useCallback(async (days) => {
    setLoading(true); setError(null);
    try { setData(await consoleApi("comeback", { days })); }
    catch (e) { if (e.isSessionError) onSessionLost(e); else setError(e); }
    finally { setLoading(false); }
  }, [onSessionLost]);

  useEffect(() => { load(windowDays); }, [load, windowDays]);

  const rows = useMemo(() => {
    if (!data) return [];
    const needle = q.trim().toLowerCase();
    return data.rows.filter((r) =>
      (showAll || r.days.some(Boolean)) &&
      (!needle || r.name.toLowerCase().includes(needle) || r.email.toLowerCase().includes(needle)));
  }, [data, showAll, q]);

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        {error ? <p className="text-sm text-rose-300">{errorText(error)}</p> : <BrandLoader size={48} />}
      </div>
    );
  }

  const s = data.summary;
  const hidden = data.rows.length - data.rows.filter((r) => r.days.some(Boolean)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Comeback</h2>
          <p className="text-xs text-white/50">Who learned one day and came back the next · Tashkent time · as of {new Date(data.as_of).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-white/15 p-0.5">
            {WINDOWS.map((w) => (
              <button key={w} onClick={() => setWindowDays(w)}
                className={`rounded-lg px-3 py-1.5 text-sm select-none ${windowDays === w ? "bg-violet-600/40 text-white" : "text-white/60 hover:text-white"}`}>
                {w}d
              </button>
            ))}
          </div>
          <button onClick={() => load(windowDays)} disabled={loading} className="flex h-9 items-center gap-2 rounded-xl border border-white/15 px-3 text-sm hover:bg-white/5 select-none disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile icon={Repeat} label="Back today" value={`${s.yesterday_back_today} / ${s.yesterday_active}`}
          note="Learned yesterday → learned again today" accent="text-[#E9D29A]" />
        <Tile icon={CalendarCheck} label={`Next-day return (${data.window_days}d)`}
          value={s.next_day_rate === null ? "–" : `${s.next_day_rate}%`}
          note={`${s.next_day_returns} of ${s.next_day_chances} learning days were followed by another`} />
        <Tile icon={Flame} label="Learned today" value={s.learned_today} note={`${s.on_streak} on a 2+ day streak`} accent="text-violet-300" />
        <Tile icon={Users} label={`Active (${data.window_days}d)`} value={`${s.active_students} / ${s.students}`}
          note={s.opened_only_students ? `+${s.opened_only_students} opened but finished nothing` : "Students who finished something"} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#11122A]">
        <div className="flex flex-wrap items-center gap-3 border-b border-white/10 px-4 py-3">
          <h3 className="flex-1 font-semibold">Day by day</h3>
          <div className="flex items-center gap-3 text-xs text-white/60">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-violet-500" /> Learned</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-violet-400/60" /> Opened only</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 border-b border-white/10 px-4 py-2.5">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/10 px-2.5">
            <Search className="h-4 w-4 shrink-0 text-white/40" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email"
              className="h-8 w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-white/30" />
          </div>
          {hidden > 0 && (
            <label className="flex items-center gap-2 text-xs text-white/60 select-none">
              <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />
              Show {hidden} with no activity
            </label>
          )}
        </div>

        {rows.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-white/50">No student activity in this window.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-white/40">
                  <th className="sticky left-0 z-[1] bg-[#11122A] px-4 py-2 text-left font-medium">Student</th>
                  <th className="px-2 py-2 text-center font-medium" title="Current streak">🔥</th>
                  {data.days.map((d) => {
                    const dt = new Date(d + "T00:00:00Z");
                    const isToday = d === data.today;
                    return (
                      <th key={d} className={`px-1 py-2 text-center font-medium ${isToday ? "text-[#E9D29A]" : ""}`}>
                        <div>{WD[dt.getUTCDay()]}</div>
                        <div className="tabular-nums">{dt.getUTCDate()}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.user_id} className="border-t border-white/5">
                    <td className="sticky left-0 z-[1] max-w-[11rem] bg-[#11122A] px-4 py-2">
                      <p className="truncate font-medium">{r.name}</p>
                      <p className="truncate text-xs text-white/40">{r.learned_days} day{r.learned_days === 1 ? "" : "s"}{r.best_streak > 1 ? ` · best ${r.best_streak}` : ""}</p>
                    </td>
                    <td className={`px-2 py-2 text-center font-semibold tabular-nums ${r.current_streak >= 2 ? "text-amber-300" : r.current_streak === 1 ? "text-white/80" : "text-white/30"}`}>
                      {r.current_streak}
                    </td>
                    {r.days.map((c, i) => (
                      <td key={data.days[i]} className="px-1 py-2"><Cell code={c} isToday={data.days[i] === data.today} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-white/40">
        A day counts when the student finishes a round or a lesson answer. Opening the app alone doesn't count.
        A streak stays alive until the end of today.
      </p>
    </div>
  );
}
