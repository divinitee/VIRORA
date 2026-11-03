import { lazy } from "react";

// VT-39 (Claude, 2026-11-03): React.lazy for route pages, safe across deploys.
//
// After a new version is published, a student who still has the OLD page open
// asks for an old chunk file that no longer exists, and the import fails
// ("Failed to fetch dynamically imported module"). Instead of a blank screen,
// reload once to pick up the new version. A session flag stops reload loops
// if the network is really down; then the error surfaces normally.
const FLAG = "virora_chunk_reload";

export function lazyPage(load) {
  return lazy(async () => {
    try {
      const mod = await load();
      try { sessionStorage.removeItem(FLAG); } catch { /* storage blocked */ }
      return mod;
    } catch (err) {
      let already = false;
      try { already = sessionStorage.getItem(FLAG) === "1"; } catch { already = true; }
      if (!already) {
        try { sessionStorage.setItem(FLAG, "1"); } catch { /* storage blocked */ }
        window.location.reload();
        return new Promise(() => {}); // page is reloading
      }
      throw err;
    }
  });
}
