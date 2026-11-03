// The CEFR gate list and the level below it. The one definition: both
// placementContent (the placement test) and levels (the level system) take
// them from here.
//
// VT-39 (Claude, 2026-11-03): these used to live inside placementContent.js,
// so every screen that only needed the level names also downloaded the whole
// placement test (~140 KB). Kept tiny on purpose.

export const GATES = ["A1", "A2", "B1", "B2", "C1"];

// Below the first gate — a true beginner who cannot clear A1.
export const STARTER_LEVEL = "Starter";
