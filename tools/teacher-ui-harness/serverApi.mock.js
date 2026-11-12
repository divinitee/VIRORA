// Mock teacherApi with the overview() response shape. Fictional students.
const iso = (d) => new Date(Date.now() - d * 864e5).toISOString();
const today = new Date().toISOString().slice(0, 10);
const plus = (n) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
const groups = [
  { id: "g1", code: "RU8SL8", label: "B1+", level: "B1", module: "Module 4", max_capacity: 12, color: "violet", icon: "🎯", days: ["Mon", "Wed", "Fri"], start_time: "09:00", end_time: "10:30", group_status: "running" },
  { id: "g2", code: "AREGQ7", label: "A1", level: "A1", module: "", max_capacity: null, color: "", icon: "", days: ["Mon", "Wed", "Fri"], start_time: "10:30", end_time: "12:00", group_status: "running" },
  { id: "g3", code: "PZK9A7", label: "B2", level: "B2", module: "Unit 7", max_capacity: 10, color: "emerald", icon: "🚀", days: ["Mon", "Wed", "Fri"], start_time: "18:00", end_time: "19:30", group_status: "running" },
  { id: "g4", code: "7UN7D7", label: "A1 TTS", level: "A1", module: "Module 1", max_capacity: 8, color: "amber", icon: "", days: ["Tue", "Thu", "Sat"], start_time: "09:00", end_time: "10:30", group_status: "running" },
  { id: "g5", code: "JNV7TJ", label: "Individual", level: "", module: "", max_capacity: null, color: "", icon: "", days: ["Tue", "Thu"], start_time: "14:00", end_time: "15:00", group_status: "paused" },
  { id: "g6", code: "NEWNEW", label: "Speaking club", level: "B2", module: "", max_capacity: null, color: "rose", icon: "🗣️", days: [], start_time: "", end_time: "", group_status: "running" },
];
const names = ["Aziza K.", "Bekzod T.", "Dilnoza R.", "Javohir M.", "Kamola S.", "Laziz U.", "Madina A.", "Nodir B.", "Sevara O.", "Timur Y."];
let n = 0;
const students = groups.slice(0, 5).flatMap((g, gi) => names.slice(0, [9, 6, 4, 4, 1][gi]).map((nm, i) => ({
  subscription_id: `s${n}`, email: `student${n++}@example.com`, name: nm, group_id: g.id, group_code: g.code, group_label: g.label,
  roster_status: i === 3 && gi === 0 ? "removed" : "active", plan_kind: "free", week_minutes: (i * 7) % 40,
  activity: i % 4 === 2 ? "inactive" : i % 5 === 1 ? "new" : "active", joined_at: iso(30) })));
const rec = (email, name, status) => ({ email, name, status, best_score_pct: status === "completed" ? 80 : null, attempts: status === "completed" ? 1 : 0, completed_at: status === "completed" ? iso(1) : null, completed_late: false, still_member: true });
const mk = (id, g, title, due, st = "active") => {
  const r = students.filter((s) => s.group_code === g.code && s.roster_status === "active").map((s, i) => rec(s.email, s.name, i % 3 === 0 ? "completed" : due < today ? "overdue" : "assigned"));
  const c = (x) => r.filter((y) => y.status === x).length;
  return { id, title, skill_label: "Vocabulary", game: "quiz", due_date: due, status: st, target: "class", group_id: g.id, group_code: g.code, group_label: g.label, counts: { total: r.length, completed: c("completed"), overdue: c("overdue"), assigned: c("assigned") }, recipients: r };
};
const assignments = [mk("a1", groups[0], "Unit 4 vocabulary quiz", plus(-2)), mk("a2", groups[2], "Phrasal verbs sprint", plus(3)), mk("a3", groups[3], "Spelling bee", plus(5)), mk("a4", groups[0], "Old crossword", plus(-20), "closed")];
const recent = students.slice(0, 5).map((s, i) => ({ assignment_id: "a1", assignment_title: "Unit 4 vocabulary quiz", student_email: s.email, student_name: s.name, best_score_pct: 70 + i * 5, completed_at: iso(i * 0.3), completed_late: i === 4 }));
const count = () => groups.forEach((g) => (g.student_count = students.filter((s) => s.group_code === g.code && s.roster_status === "active").length));
window.__calls = [];
export async function teacherApi(action, p = {}) {
  window.__calls.push({ action, p });
  count();
  if (action === "overview") return { ok: true, access: "approved", today, groups: JSON.parse(JSON.stringify(groups)), students: JSON.parse(JSON.stringify(students)), assignments, recent_completions: recent };
  if (action === "updateGroup") { const g = groups.find((x) => x.id === p.group_id); Object.assign(g, p); delete g.group_id; return { ok: true, group: g }; }
  if (action === "createGroup") { const g = { ...p, id: `g${groups.length + 1}`, code: "ZZZ999", group_status: "running" }; groups.push(g); return { ok: true, group: g }; }
  if (action === "setRoster") { const s = students.find((x) => x.subscription_id === p.subscription_id); s.roster_status = p.removed ? "removed" : "active"; return { ok: true }; }
  if (action === "studentActivity") return { ok: true, sessions: [] };
  if (action === "studentProgress") return null;
  return { ok: true };
}
export const studentApi = async () => ({ ok: true });
export const coachApi = async () => ({ ok: true });
