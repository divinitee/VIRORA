import React, { useState } from "react";
import { Loader2, Send, Ban, Undo2, Trash2, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { consoleApi, errorText } from "@/lib/consoleApi";

// Bulk actions on selected students (Tee, 11 Nov 2026): Nudge / Ban / Unban /
// Delete, each behind one "Are you sure?" step that names who is affected.
// The server (adminApi studentsBulk, base44/shared/adminBulk.ts) re-checks
// everything: never yourself, never an admin, max 50 per call, and it needs
// the confirm token this dialog sends.

export const BULK = {
  nudge: {
    label: "Nudge", icon: Send, btn: "border-sky-400/40 text-sky-200 hover:bg-sky-500/10",
    title: (n) => `Email ${n} ${n === 1 ? "student" : "students"} now?`,
    body: "Each gets the right email for where they are: keep your streak, come back after N days, or start your first practice. Anyone who already practised today, or was nudged in the last 20 hours, is skipped.",
    yes: (n) => `Yes, email ${n}`, yesCls: "bg-sky-500 hover:bg-sky-400",
  },
  ban: {
    label: "Ban", icon: Ban, btn: "border-amber-400/40 text-amber-200 hover:bg-amber-500/10",
    title: (n) => `Ban ${n} ${n === 1 ? "account" : "accounts"}?`,
    body: "They can still sign in, but every practice, the Coach, AI and chat refuse them. The email stays banned even if the account is deleted. You can unban later.",
    yes: (n) => `Yes, ban ${n}`, yesCls: "bg-amber-500 hover:bg-amber-400 text-black",
    note: true,
  },
  unban: {
    label: "Unban", icon: Undo2, btn: "border-white/15 text-white/70 hover:bg-white/5",
    title: (n) => `Unban ${n} ${n === 1 ? "account" : "accounts"}?`,
    body: "They get full access back straight away.",
    yes: (n) => `Yes, unban ${n}`, yesCls: "bg-violet-600 hover:bg-violet-500",
  },
  delete: {
    label: "Delete", icon: Trash2, btn: "border-rose-400/40 text-rose-200 hover:bg-rose-500/10",
    title: (n) => `Delete ${n} ${n === 1 ? "account" : "accounts"} for good?`,
    body: "Removes the account and its learning data (progress, XP, words, Coach, subscription). Payment records and bans are kept. This can't be undone from VIRORA; deleted rows sit in Base44's Recently deleted for a while.",
    yes: (n) => `Yes, delete ${n}`, yesCls: "bg-rose-600 hover:bg-rose-500",
  },
};

export default function BulkBar({ selected, onClear, onDone, onSessionLost }) {
  const [op, setOp] = useState(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const n = selected.length;
  const banned = selected.filter((r) => r.banned).length;

  const run = async () => {
    setBusy(true); setError(null);
    try {
      const res = await consoleApi("studentsBulk", { op, confirm: op, user_ids: selected.map((r) => r.user_id), note });
      setResult(res);
      onDone?.(op);
    } catch (e) {
      if (e.isSessionError) onSessionLost(e); else setError(e);
    } finally {
      setBusy(false);
    }
  };
  const close = () => { if (busy) return; setOp(null); setNote(""); setError(null); setResult(null); };

  if (!n && !op) return null;
  const cfg = op ? BULK[op] : null;

  return (
    <>
      {n > 0 && (
        <div data-testid="bulk-bar" className="sticky top-2 z-20 flex flex-wrap items-center gap-2 rounded-2xl border border-violet-400/40 bg-[#1a1640]/95 p-2.5 shadow-xl backdrop-blur">
          <span className="px-1.5 text-sm font-semibold">{n} selected</span>
          <button onClick={onClear} className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs text-white/60 hover:bg-white/5 select-none"><X className="h-3.5 w-3.5" /> Clear</button>
          <div className="ml-auto flex flex-wrap gap-1.5">
            {Object.entries(BULK).filter(([k]) => k !== "unban" || banned > 0).map(([k, c]) => (
              <button key={k} onClick={() => setOp(k)} className={`flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold select-none ${c.btn}`}>
                <c.icon className="h-3.5 w-3.5" /> {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {cfg && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3 sm:items-center" onClick={close}>
          <div role="dialog" aria-modal="true" data-testid="bulk-confirm" onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#11122A] p-5">
            {!result ? (
              <>
                <div className="flex items-start gap-3">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${op === "delete" ? "bg-rose-500/15 text-rose-300" : "bg-white/5 text-white/80"}`}>
                    <AlertTriangle className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-bold">Are you sure? {cfg.title(n)}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/60">{cfg.body}</p>
                  </div>
                </div>
                <ul className="mt-3 max-h-40 space-y-1 overflow-y-auto rounded-xl border border-white/10 bg-black/20 p-2.5 text-xs">
                  {selected.map((r) => (
                    <li key={r.user_id} className="flex justify-between gap-2"><span className="truncate">{r.name}</span><span className="truncate text-white/40">{r.email}</span></li>
                  ))}
                </ul>
                {cfg.note && (
                  <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reason (optional, kept in the audit log)" className="mt-3 h-9 w-full rounded-lg border border-white/10 bg-black/30 px-3 text-sm outline-none focus:border-violet-500" />
                )}
                {error && <p className="mt-3 text-xs text-rose-300">{errorText(error)}</p>}
                <div className="mt-4 flex gap-2">
                  <button onClick={close} disabled={busy} className="h-10 flex-1 rounded-xl border border-white/15 text-sm select-none">Cancel</button>
                  <button onClick={run} disabled={busy} className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white select-none disabled:opacity-60 ${cfg.yesCls}`}>
                    {busy && <Loader2 className="h-4 w-4 animate-spin" />}{cfg.yes(n)}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="flex items-center gap-2 font-bold"><CheckCircle2 className="h-5 w-5 text-emerald-300" /> {cfg.label}: {result.done} done{result.skipped ? `, ${result.skipped} skipped` : ""}{result.failed ? `, ${result.failed} failed` : ""}</h3>
                <ul className="mt-3 max-h-56 space-y-1 overflow-y-auto rounded-xl border border-white/10 bg-black/20 p-2.5 text-xs">
                  {result.results.map((r) => (
                    <li key={r.user_id} className="flex justify-between gap-2">
                      <span className="truncate">{r.email || r.user_id}</span>
                      <span className={`shrink-0 ${r.ok ? "text-emerald-300" : r.skipped ? "text-white/50" : "text-rose-300"}`}>{r.note}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => { close(); onClear(); }} className="mt-4 h-10 w-full rounded-xl bg-violet-600 text-sm font-semibold select-none">Done</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
