import { chromium } from "playwright";
const base = "http://127.0.0.1:5288/index.html#";
const out = [];
const ok = (cond, msg) => out.push(`${cond ? "PASS" : "FAIL"} ${msg}`);
const b = await chromium.launch();
async function page(w, h) { const p = await b.newPage({ viewport: { width: w, height: h } }); p.on("pageerror", (e) => out.push("PAGEERROR " + e.message)); p.on("console", (m) => m.type() === "error" && out.push("CONSOLE " + m.text().slice(0, 200))); return p; }
const overflow = (p) => p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

// ---------- DESKTOP ----------
let p = await page(1280, 900);
await p.goto(base + "/teacher"); await p.waitForSelector("text=Assign Homework");
const btn = await p.locator("button:has-text('Assign Homework')").first().boundingBox();
ok(btn && btn.height >= 60, `desktop overview: big Assign Homework button (${Math.round(btn?.height)}px tall)`);
ok(await p.locator("text=New class").count() === 0, "overview has no New class / Add a class");
for (const t of ["Needs attention", "Recently completed", "Active homework"]) ok(await p.locator(`button:has-text('${t}')`).count() === 1, `overview card: ${t}`);
ok(await p.locator("text=Unit 4 vocabulary quiz").count() === 0, "overview has no long lists (assignment titles absent)");
const docH = await p.evaluate(() => document.documentElement.scrollHeight);
ok(docH <= 900, `overview fits without scrolling on desktop (doc ${docH}px)`);
await p.click("button:has-text('Needs attention')"); await p.waitForTimeout(200);
ok(p.url().includes("tab=students") && p.url().includes("filter=attention"), "Needs attention card → students?filter=attention");
const attnRows = await p.locator("text=/Needs attention \\(\\d+\\)/").first().textContent(); out.push("  " + attnRows);
await p.goto(base + "/teacher"); await p.click("button:has-text('Recently completed')"); await p.waitForTimeout(200);
ok(p.url().includes("tab=assignments") && p.url().includes("view=recent"), "Recently completed card → assignments?view=recent");
ok(await p.locator("text=Aziza K.").count() > 0, "recent view lists completions");
await p.goto(base + "/teacher"); await p.click("button:has-text('Active homework')"); await p.waitForTimeout(200);
ok(p.url().includes("view=active"), "Active homework card → assignments?view=active");
ok(await p.locator("text=Phrasal verbs sprint").count() === 1 && await p.locator("text=Old crossword").count() === 0, "active view shows active only");

// My Classes desktop
await p.goto(base + "/teacher?tab=classes"); await p.waitForSelector("h1:has-text('My Classes')");
await p.screenshot({ path: "/tmp/shots/desk-classes.png" });
ok(await overflow(p) <= 0, "desktop calendar: no horizontal page overflow");
const blocks = p.locator("div.hidden.md\\:block button[title]");
const nb = await blocks.count(); ok(nb === 14, `desktop: ${nb} calendar blocks (expect 3x3 MWF + 3 TTS + 2 Individual = 14)`);
const b1 = await p.locator("button[title^='B1+']").first().boundingBox(); const a1 = await p.locator("button[title^='A1 ·']").first().boundingBox();
ok(b1 && a1 && a1.y > b1.y && Math.abs(a1.x - b1.x) < 3, "B1+ 09:00 above A1 10:30 in same Mon column");
const bText = await p.locator("button[title^='B1+']").first().innerText(); out.push("  block text: " + bText.replace(/\n/g, " | "));
ok(/B1/.test(bText) && /Module 4/.test(bText) && /09:00–10:30/.test(bText) && /seats left/.test(bText), "block shows name, level, module, time, seats");
ok(await p.locator("text=No time slot yet").count() === 1 && await p.locator("button:has-text('Speaking club')").count() >= 1, "unscheduled class listed separately");
// week nav
const lbl0 = await p.locator("h1 + p").innerText();
await p.click("button[aria-label='Next week']"); const lbl1 = await p.locator("h1 + p").innerText();
await p.click("button[aria-label='Previous week']"); await p.click("button[aria-label='Previous week']"); const lblm = await p.locator("h1 + p").innerText();
out.push(`  weeks: ${lbl0} / ${lbl1} / ${lblm}`);
ok(lbl1.startsWith("Next week") && lblm.startsWith("Last week"), "prev / next week navigation");
await p.click("button:has-text('This week')"); ok((await p.locator("h1 + p").innerText()).startsWith("This week"), "back to this week");
// filter
await p.click("[aria-label='Filter by class'] button:has-text('B2')"); 
const nf = await blocks.count(); ok(nf === 3, `filter B2 → ${nf} blocks`);
await p.click("[aria-label='Filter by class'] button:has-text('All classes')");
// open details
await p.locator("button[title^='B1+']").first().click(); await p.waitForSelector("[role=dialog]");
ok(p.url().includes("class=g1"), "block click → ?class=g1");
const dlg = p.locator("[role=dialog]");
for (const s of ["Overview", "Students", "Assignments", "Settings"]) ok(await dlg.locator(`nav button:has-text('${s}')`).count() === 1, `details section ${s}`);
ok(await dlg.locator("text=Module 4").count() >= 1 && await dlg.locator("text=/8\\/12/").count() >= 1, "details overview: module + capacity 8/12");
await p.screenshot({ path: "/tmp/shots/desk-details.png" });
await dlg.locator("nav button:has-text('Students')").click(); ok(await dlg.locator("text=Aziza K.").count() === 1, "details students list");
ok(await dlg.locator("text=Show 1 removed").count() === 1, "removed students restorable");
await dlg.locator("nav button:has-text('Assignments')").click(); ok(await dlg.locator("text=Unit 4 vocabulary quiz").count() === 1 && await dlg.locator("text=Phrasal verbs sprint").count() === 0, "details assignments scoped to class");
await dlg.locator("nav button:has-text('Settings')").click();
await dlg.locator("button[aria-label='Colour rose']").click();
await dlg.locator("input[placeholder='e.g. Module 3']").fill("Module 5");
await dlg.locator("button:has-text('Save changes')").click(); await p.waitForTimeout(400);
const call = await p.evaluate(() => window.__calls.filter((c) => c.action === "updateGroup").pop());
ok(call?.p.color === "rose" && call?.p.module === "Module 5" && call?.p.start_time === "09:00" && call?.p.days.join() === "Mon,Wed,Fri", "settings save → updateGroup with colour/module, slot unchanged");
ok(await p.locator("[role=dialog]").locator("text=Module 5").count() >= 1, "details refreshed after save");
// invalid slot client-side
await dlg.locator("nav button:has-text('Settings')").click();
const times = dlg.locator("input[type=time]"); await times.nth(1).fill("08:00");
await dlg.locator("button:has-text('Save changes')").click();
ok(await dlg.locator("text=End time must be after the start time.").count() === 1, "client blocks end-before-start");
await p.keyboard.press("Escape"); await p.waitForTimeout(200);
ok(!p.url().includes("class="), "closing details clears ?class");
// assign from details
await p.locator("button[title^='B2']").first().click(); await p.waitForSelector("[role=dialog]");
await p.locator("[role=dialog] button:has-text('Assign homework to this class')").click(); await p.waitForTimeout(200);
ok(p.url().includes("/teacher/skill-hub?class=g3"), "assign from class → skill-hub?class=g3");
// create
await p.goto(base + "/teacher?tab=classes"); await p.waitForSelector("h1:has-text('My Classes')");
await p.locator("button:has-text('New class')").first().click(); await p.waitForSelector("[role=dialog]");
const cd = p.locator("[role=dialog]");
await cd.locator("input[placeholder='e.g. B2 Evening']").fill("IELTS Sat");
await cd.locator("button:has-text('Sat')").click();
await cd.locator("button:has-text('Create class')").click();
ok(await cd.locator("text=Pick a start time").count() === 1, "create: days without time blocked");
await cd.locator("input[type=time]").first().fill("11:00"); await cd.locator("input[type=time]").nth(1).fill("12:30");
await cd.locator("button:has-text('Create class')").click(); await p.waitForTimeout(500);
ok(p.url().includes("class=g7"), "create → opens new class details");
await p.keyboard.press("Escape"); await p.waitForTimeout(200);
ok(await p.locator("button[title^='IELTS Sat']").count() === 1, "new class appears on calendar");
await p.close();

// ---------- MOBILE ----------
p = await page(375, 812);
await p.goto(base + "/teacher"); await p.waitForSelector("text=Assign Homework");
ok(await overflow(p) <= 0, "mobile overview: no horizontal overflow");
const mb = await p.locator("button:has-text('Assign Homework')").first().boundingBox();
ok(mb.y < 300 && mb.height >= 60, `mobile: Assign Homework above the fold (y=${Math.round(mb.y)})`);
await p.screenshot({ path: "/tmp/shots/mob-overview.png" });
await p.goto(base + "/teacher?tab=classes"); await p.waitForSelector("h1:has-text('My Classes')");
ok(await overflow(p) <= 0, "mobile My Classes: no horizontal overflow");
ok(!(await p.locator("div.hidden.md\\:block").first().isVisible()), "mobile: weekly grid hidden");
const dayBtns = p.locator("div.md\\:hidden button[aria-pressed]"); ok(await dayBtns.count() === 7, "mobile day strip (7 days)");
await dayBtns.nth(0).click(); const monCards = await p.locator("div.md\\:hidden > button:has-text('seats left'), div.md\\:hidden > button:has-text('students')").count();
ok(monCards === 3, `mobile Monday agenda: ${monCards} classes`);
const fab = p.locator("button:has-text('Assign homework')").last(); const fb = await fab.boundingBox();
ok(await fab.isVisible() && fb.y + fb.height > 812 - 90, "mobile: sticky Assign homework at bottom");
const small = await p.evaluate(() => [...document.querySelectorAll("button")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 36).map((b) => b.innerText.trim().slice(0, 20) || b.getAttribute("aria-label")));
out.push("  small (<36px) buttons on mobile classes: " + JSON.stringify(small));
await p.screenshot({ path: "/tmp/shots/mob-classes.png", fullPage: true });
await p.locator("div.md\\:hidden > button").first().click(); await p.waitForSelector("[role=dialog]");
const db = await p.locator("[role=dialog]").boundingBox(); ok(db.x >= 0 && db.x + db.width <= 375, `mobile details fits (${Math.round(db.x)}..${Math.round(db.x + db.width)})`);
ok(await overflow(p) <= 0, "mobile details: no overflow");
await p.screenshot({ path: "/tmp/shots/mob-details.png" });
await p.locator("[role=dialog] nav button:has-text('Settings')").click(); await p.waitForTimeout(150);
const sw = await p.evaluate(() => { const d = document.querySelector("[role=dialog]"); return d.scrollWidth - d.clientWidth; }); ok(sw <= 0, "mobile settings form: no sideways scroll");
for (const t of ["students", "assignments", "materials"]) { await p.goto(base + `/teacher?tab=${t}`); await p.waitForTimeout(300); ok(await overflow(p) <= 0, `mobile ${t}: no overflow`); }
await b.close();
console.log(out.join("\n"));
