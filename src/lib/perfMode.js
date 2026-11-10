// Lite mode for weak devices (VT-39 round 3, Claude 2026-11-10).
//
// Most students are on budget Android phones. The look that is smooth on a
// Mac (live blur, never-ending glows, particles, a tree of animated nodes)
// drops frames there, and lag quietly kills retention. Lite mode keeps the
// layout, colours and every feature, and removes only what costs frames:
// live backdrop blur, ambient/infinite animations, the particle canvas, and
// transform animations (framer-motion runs in reduced-motion mode).
//
// Who gets it:
//   1. ?perf=lite / ?perf=full in the URL (remembered) - manual override
//   2. a remembered decision from an earlier visit
//   3. the browser says so: Data Saver on, 4 GB of RAM or less, 4 CPU cores or fewer
//      (cores are ignored on iPhone/iPad, which under-report them)
//   4. the device proves it: a short frame-rate probe after load (probePerf);
//      if frames really are slow, lite switches on and is remembered
// A capable device (the Mac, a flagship phone running smoothly) never changes.

const KEY = "virora_perf";

/** Pure decision from what the browser reports. Returns "lite" | "full" | null (undecided: probe). */
export function decidePerf({ param, stored, saveData, deviceMemory, cores, appleMobile } = {}) {
  if (param === "lite" || param === "full") return param;
  if (stored === "lite" || stored === "full") return stored;
  if (saveData === true) return "lite";
  if (typeof deviceMemory === "number" && deviceMemory <= 4) return "lite";
  // iPhones/iPads under-report their cores (privacy), so the core count says
  // nothing there: they are judged by the frame-rate probe instead.
  if (!appleMobile && typeof cores === "number" && cores > 0 && cores <= 4) return "lite";
  return null;
}

/** Median frame time in ms -> is this device struggling? 28 ms = under ~36 fps. */
export const SLOW_FRAME_MS = 28;
export function isSlow(frameTimes = []) {
  if (frameTimes.length < 30) return false; // not enough evidence
  const s = [...frameTimes].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)] > SLOW_FRAME_MS;
}

function read() {
  if (typeof window === "undefined") return { mode: "full", decided: true };
  let param = null, stored = null;
  try { param = new URLSearchParams(window.location.search).get("perf"); } catch { /* ignore */ }
  try { stored = localStorage.getItem(KEY); } catch { /* private mode */ }
  const nav = window.navigator || {};
  const decision = decidePerf({
    param, stored,
    saveData: nav.connection?.saveData,
    deviceMemory: nav.deviceMemory,
    cores: nav.hardwareConcurrency,
    appleMobile: /iPhone|iPad|iPod/.test(nav.userAgent || "") || (nav.platform === "MacIntel" && nav.maxTouchPoints > 1),
  });
  if (param === "lite" || param === "full") { try { localStorage.setItem(KEY, param); } catch { /* ignore */ } }
  return { mode: decision || "full", decided: decision !== null };
}

const initial = read();
let decided = initial.decided;

/** True when this page load started in lite mode. Module constant: read it at import. */
export const PERF_LITE = initial.mode === "lite";

function apply(mode) {
  if (typeof document === "undefined") return;
  if (mode === "lite") document.documentElement.setAttribute("data-perf", "lite");
  else document.documentElement.removeAttribute("data-perf");
}
apply(initial.mode);

let probes = 0;
/**
 * Measure real frame times for ~2 s. If the device is struggling, switch lite
 * on now (CSS) and remember it (JS-side savings apply from the next load).
 * No-op once a decision exists. At most two probes per page load.
 */
export function probePerf({ delayMs = 2500, frames = 120 } = {}) {
  if (decided || probes >= 2 || typeof window === "undefined" || !window.requestAnimationFrame) return;
  probes++;
  window.setTimeout(() => {
    if (decided || document.hidden) return;
    const times = [];
    let last = 0, cancelled = false;
    const onHide = () => { cancelled = true; };
    document.addEventListener("visibilitychange", onHide, { once: true });
    const tick = (t) => {
      if (cancelled) return;
      if (last) times.push(t - last);
      last = t;
      if (times.length < frames) { window.requestAnimationFrame(tick); return; }
      document.removeEventListener("visibilitychange", onHide);
      if (isSlow(times)) {
        decided = true;
        apply("lite");
        try { localStorage.setItem(KEY, "lite"); } catch { /* ignore */ }
      }
    };
    window.requestAnimationFrame(tick);
  }, delayMs);
}
