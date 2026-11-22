import { gradeItem, normalise, hasResponse, emptyResponse, scoreRound }
  from "../../src/lib/grammarPractice/grading.js";
let pass = 0, fail = 0;
const ok = (n, c, x = "") => { c ? pass++ : fail++; console.log(`  ${c ? "PASS" : "FAIL"}  ${n}${!c && x ? " -> " + x : ""}`); };

const mcq = { format: "mcq", options: ["go", "goes", "going", "gos"], key: 1 };
console.log("=== mcq ===");
ok("correct index accepted", gradeItem(mcq, 1).correct);
ok("wrong index rejected", !gradeItem(mcq, 3).correct);
ok("no answer is not correct", !gradeItem(mcq, null).correct);
ok("feedback names the right option", gradeItem(mcq, 3).expected === "goes");

const gap = { format: "gap_fill", key: "goes" };
console.log("=== typed answers: forgive typing, not grammar ===");
ok("exact match", gradeItem(gap, "goes").correct);
ok("trailing space and capital forgiven", gradeItem(gap, "  Goes ").correct);
ok("trailing full stop forgiven", gradeItem(gap, "goes.").correct);
ok("wrong form still wrong", !gradeItem(gap, "go").correct);
ok("misspelling still wrong", !gradeItem(gap, "gose").correct);
ok("over-regularised form still wrong", !gradeItem({ format: "gap_fill", key: "teaches" }, "teachs").correct);

const contracted = { format: "rewrite", key: "doesn't watch", acceptable: ["does not watch"] };
console.log("=== accepted variants ===");
ok("primary key accepted", gradeItem(contracted, "doesn't watch").correct);
ok("uncontracted variant accepted", gradeItem(contracted, "does not watch").correct);
ok("curly apostrophe accepted", gradeItem(contracted, "doesn’t watch").correct);
ok("double space forgiven", gradeItem(contracted, "does  not  watch").correct);
ok("unrelated answer rejected", !gradeItem(contracted, "don't watch").correct);

const twoBlank = { format: "rewrite", key: ["Does", "work"] };
console.log("=== multi-blank ===");
ok("both blanks right", gradeItem(twoBlank, ["Does", "work"]).correct);
ok("case-insensitive", gradeItem(twoBlank, ["does", "WORK"]).correct);
ok("one blank wrong fails", !gradeItem(twoBlank, ["Does", "works"]).correct);
ok("missing a blank fails", !gradeItem(twoBlank, ["Does"]).correct);

console.log("=== multi-blank alternatives (21 Nov 2026) ===");
const twoAlt = { format: "rewrite", key: ["would", "the next day"], acceptable: [["would", "the following day"]] };
ok("key accepted", gradeItem(twoAlt, ["would", "the next day"]).correct);
ok("listed alternative accepted", gradeItem(twoAlt, ["would", "the following day"]).correct);
ok("parts from two answers mixed wrongly still fail", !gradeItem(twoAlt, ["will", "the following day"]).correct);
ok("feedback still shows the key", gradeItem(twoAlt, ["x", "y"]).expected === "would … the next day");

console.log("=== ingest variants: 'd short forms (21 Nov 2026) ===");
const { accepted, acceptedArray } = await import("./accepted-variants.mjs");
const has = (key, v) => (accepted(key) || []).includes(v);
ok("had + participle gets 'd", has("he had left", "he'd left") && has("if I had seen", "if I'd seen"));
ok("would + verb gets 'd", has("I would come", "I'd come") && has("if I would be", "if I'd be"));
ok("had + noun phrase does not", !has("he had a dog", "he'd a dog") && !has("if we had", "if we'd"));
ok("short key is never expanded (had or would?)", !(accepted("he'd left") || []).some((v) => /had|would/.test(v)));
ok("old contractions still added", has("doesn't watch", "does not watch"));
const arr = acceptedArray(["would", "the next day"], [["would", "the following day"]]) || [];
ok("array: own alternative kept", arr.some((a) => a.join("+") === "would+the following day"));
ok("array: part contractions added", (acceptedArray(["doesn't", "work"]) || []).some((a) => a.join("+") === "does not+work"));
ok("array: no alternatives -> null", acceptedArray(["Does", "work"]) === null);

console.log("=== response state ===");
ok("mcq needs an integer", !hasResponse(mcq, null) && hasResponse(mcq, 0));
ok("typed needs non-empty", !hasResponse(gap, "   ") && hasResponse(gap, "goes"));
ok("multi-blank needs every blank", !hasResponse(twoBlank, ["Does", ""]) && hasResponse(twoBlank, ["Does", "work"]));
ok("empty response shape matches item", Array.isArray(emptyResponse(twoBlank)) && emptyResponse(mcq) === null && emptyResponse(gap) === "");

console.log("=== round score ===");
const r = scoreRound([mcq, gap, twoBlank], [1, "go", ["Does", "work"]]);
ok("counts correct answers", r.correct === 2 && r.total === 3, JSON.stringify(r.correct));
ok("percentage rounds sensibly", r.pct === 67, String(r.pct));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
