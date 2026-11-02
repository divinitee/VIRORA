import React, { useMemo, useState } from "react";

// Search box + random browse chips for the Deep Mode dock.
export default function DeepModeSearch({ words, current, onPick, c }) {
  const [q, setQ] = useState("");
  const browse = useMemo(() => [...words].sort(() => Math.random() - 0.5).slice(0, 6), [words]);
  const term = q.trim().toLowerCase();
  const hits = term ? words.filter((w) => w.word.toLowerCase().startsWith(term)).slice(0, 8) : [];
  const pick = (w) => { onPick(w); setQ(""); };

  return (
    <div className="dm-search">
      <div className="dm-search-box">
        <input
          type="search" value={q} placeholder={c.searchPh} aria-label={c.searchPh}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && hits[0]) pick(hits[0]); }}
        />
        {term && (
          <div className="dm-suggest" role="listbox">
            {hits.length ? hits.map((w) => (
              <button key={w.word} type="button" role="option" aria-selected={false} onClick={() => pick(w)}>
                <b>{w.word}</b><span>{w.level}</span>
              </button>
            )) : <p>{c.notAdded}</p>}
          </div>
        )}
      </div>
      <div className="words" role="group" aria-label={c.try}>
        <span className="lbl">{c.try}</span>
        {browse.map((w) => (
          <button key={w.word} type="button" className="chip" aria-pressed={current?.word === w.word} onClick={() => pick(w)}>{w.word}</button>
        ))}
      </div>
    </div>
  );
}