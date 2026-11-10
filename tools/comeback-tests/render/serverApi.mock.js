let state = {
  today: '2026-11-10', xp: 1240,
  streak: { current: 2, best: 5, today_done: true, run_start: '2026-11-09' },
  bonuses: [{ id: 'streak_2', day: 2, reward: 100, done: true, claimed: false }],
  next_bonus: { day: 3, reward: 100, days_left: 1 },
  week: ['04','05','06','07','08','09','10'].map((d, i) => ({ day: `2026-11-${d}`, learned: i >= 4 })),
  missions: [
    { id: 'show_up', target: 1, reward: 50, progress: 1, done: true, claimed: false },
    { id: 'answer_20', target: 20, reward: 50, progress: 12, done: false, claimed: false },
    { id: 'correct_15', target: 15, reward: 100, progress: 15, done: true, claimed: true },
  ],
};
export const calls = [];
globalThis.__calls = calls;
export const progressApi = async (action, payload) => {
  calls.push([action, payload]);
  if (action === 'getComeback') return state;
  if (action === 'claimMission') {
    const amount = payload.mission_id === 'streak_2' ? 100 : 50;
    state = { ...state, xp: state.xp + amount, bonuses: state.bonuses.filter((b) => b.id !== payload.mission_id), missions: state.missions.map((m) => (m.id === payload.mission_id ? { ...m, claimed: true } : m)) };
    return { ...state, amount, duplicate: false };
  }
  throw new Error('unexpected ' + action);
};
export const coachApi = async () => ({ persona: 'vira', minutes: 10 });
