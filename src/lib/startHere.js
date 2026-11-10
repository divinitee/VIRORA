// "Start here" inside the Skill Hub (VT-50.2, Comeback Revamp, 2026-11-10).
//
// Students said the inside of vocab was "unclear, too many options at once".
// The tree stays (it is the "see all"); this picks ONE thing to put in front
// of it. It is deliberately not a second recommender:
//   - nothing finished today  -> the Coach's practice (it already picks by
//     goal and by what the student knows)
//   - already practised today -> one gentle game from the tree, the same one
//     all day, a different one tomorrow
// Gentle = the recognition games weak students actually win (real results,
// Nov 2026: ~90% in the translation quiz vs ~12% in Related Words for the
// same student on the same day). Hard-labelled nodes are never suggested.
//
// Pure: no React, no API client.

import { SKILL_CHILDREN } from "@/lib/skillTreeData";
import { isGameUnlocked } from "@/lib/levels";

export const GENTLE_GAMES = ["definition_match", "picture_match", "memory_flip", "synonym_sprint", "quiz"];

/** Unlocked gentle vocabulary challenges, in tree order. */
export function gentleChallenges(level) {
  const out = [];
  for (const category of SKILL_CHILDREN.vocabulary || []) {
    if (category.comingSoon) continue;
    for (const ch of category.challenges || []) {
      if (!GENTLE_GAMES.includes(ch.game) || ch.difficulty === "Hard") continue;
      if (!isGameUnlocked(ch.game, ch.bank, level)) continue;
      if (out.some((o) => o.game === ch.game)) continue; // one node per game
      out.push({ game: ch.game, difficulty: ch.difficulty, bank: ch.bank, skillLabel: category.label, title: ch.name, time: ch.time, skillId: "vocabulary" });
    }
  }
  return out;
}

/**
 * { kind: "coach" } | { kind: "game", challenge } | null
 * dayIndex: any integer that changes once a day (keeps the pick stable all day).
 */
export function startHerePick({ playedToday, level, dayIndex = 0 }) {
  if (!playedToday) return { kind: "coach" };
  const pool = gentleChallenges(level);
  if (!pool.length) return null;
  const i = ((Math.trunc(dayIndex) % pool.length) + pool.length) % pool.length;
  return { kind: "game", challenge: pool[i] };
}

export const START_HERE_COPY = {
  en: { start: "Start here", next: "Next up", coach: "Today's practice, picked for you", go: "Start", play: "Play", or: "Or pick any game from the tree below." },
  uz: { start: "Shu yerdan boshlang", next: "Keyingisi", coach: "Bugungi mashg'ulot, siz uchun tanlangan", go: "Boshlash", play: "O'ynash", or: "Yoki pastdagi daraxtdan istalgan o'yinni tanlang." },
  ru: { start: "Начните здесь", next: "Дальше", coach: "Практика на сегодня, подобрана для вас", go: "Начать", play: "Играть", or: "Или выберите любую игру на дереве ниже." },
};
