// node tools/subscription-rls-tests/run.mjs   (from the app root)
// StudentSubscription: deletion is admin-only (GPT final decision, 2 Nov),
// while students keep reading their own row and managing it through the
// server functions. Static checks of the schema and every caller.
import fs from "node:fs";

let fails = 0, n = 0;
const eq = (got, want, msg) => {
  n++;
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(`${ok ? "PASS" : "FAIL"} ${msg}${ok ? "" : `  got ${JSON.stringify(got)} want ${JSON.stringify(want)}`}`);
  if (!ok) fails++;
};
const rls = JSON.parse(fs.readFileSync("base44/entities/StudentSubscription.jsonc", "utf8")).rls;

eq(rls.delete, { user_condition: { role: "admin" } }, "delete: admin only (was owner by created_by_id or phone=email)");
eq(rls.create, { user_condition: { role: "admin" } }, "create: admin only (unchanged)");
eq(rls.update, { user_condition: { role: "admin" } }, "update: admin only (unchanged)");
const read = JSON.stringify(rls.read);
eq(read.includes('"data.phone":"{{user.email}}"') && read.includes('"created_by_id":"{{user.id}}"'), true, "read: a student still sees their own subscription (unchanged)");

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((x) => x.isDirectory() ? walk(`${d}/${x.name}`) : /\.(js|jsx|ts)$/.test(x.name) ? [`${d}/${x.name}`] : []);
const deleters = walk("src").filter((f) => /StudentSubscription\s*\.\s*(delete|deleteMany)\s*\(/.test(fs.readFileSync(f, "utf8")));
eq(deleters, ["src/pages/AdminDashboard.jsx"], "browser code deleting subscriptions: only the admin dashboard (admins keep delete)");
const home = fs.readFileSync("src/pages/Home.jsx", "utf8");
eq(/StudentSubscription\.delete/.test(home), false, "Home 'delete account' no longer deletes the subscription row (it would now fail and block sign-out)");

// Management paths still work for students: server functions (service role), not RLS.
const studentReads = ["src/pages/Home.jsx", "src/pages/Achievements.jsx", "src/pages/PaymentComplete.jsx"]
  .filter((f) => /StudentSubscription\.filter\(\{ phone: me\.email \}\)|StudentSubscription\.filter\(\{ phone: user/.test(fs.readFileSync(f, "utf8")) || /StudentSubscription\.filter/.test(fs.readFileSync(f, "utf8")));
eq(studentReads.length, 3, "student pages that read their own subscription are unchanged (read RLS still allows them)");

console.log(fails ? `\n${fails}/${n} FAILED` : `\nALL PASS (${n})`);
process.exit(fails ? 1 : 0);
