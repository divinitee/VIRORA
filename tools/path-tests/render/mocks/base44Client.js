export const base44 = {
  auth: { me: async () => ({ email: 's@test' }) },
  entities: {
    GrammarProfile: { filter: async () => globalThis.__profile || [] },
    GrammarAttempt: { filter: async () => globalThis.__attempts || [] },
    StudentProgress: { filter: async () => [{ lessons_completed_count: globalThis.__lessons ?? 1 }] },
  },
};
