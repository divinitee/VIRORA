let state = {
  today: '2026-11-10', xp: 1240,
  streak: { current: 3, best: 5, today_done: true },
  week: ['04','05','06','07','08','09','10'].map((d, i) => ({ day: `2026-11-${d}`, learned: i >= 4 })),
  missions: [
    { id: 'show_up', target: 1, reward: 50, progress: 1, done: true, claimed: false },
    { id: 'correct_20', target: 20, reward: 50, progress: 12, done: false, claimed: false },
    { id: 'score_80', target: 80, reward: 50, progress: 80, done: true, claimed: true },
  ],
};
export const calls = [];
globalThis.__calls = calls;
export const progressApi = async (action, payload) => {
  calls.push([action, payload]);
  if (action === 'getComeback') return state;
  if (action === 'claimMission') {
    state = { ...state, xp: state.xp + 50, missions: state.missions.map((m) => (m.id === payload.mission_id ? { ...m, claimed: true } : m)) };
    return { ...state, amount: 50, duplicate: false };
  }
  throw new Error('unexpected ' + action);
};
export const coachApi = async () => ({ persona: 'vira', minutes: 10 });
