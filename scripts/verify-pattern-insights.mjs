// Verifies data/pattern-insights.js covers every patternGuide technique in
// problems.js exactly once — no duplicates, no gaps.
import fs from "node:fs";

const root = new URL("..", import.meta.url).pathname;
const load = (f) => new Function(fs.readFileSync(root + f, "utf8") + "\n;return typeof patternInsights!=='undefined'?patternInsights:problems;");

const problems = load("problems.js")();
const patternInsights = load("data/pattern-insights.js")();

// 1. Collect every distinct technique tagged in problems.js
const techniques = new Set();
for (const p of problems) {
    const m = /Use \*\*([^*]+)\*\*/.exec(p.patternGuide || "");
    if (m) techniques.add(m[1].trim());
}

// 2. Collect every alias claimed by the catalog, flagging duplicates
const claimed = new Map(); // alias -> [patternIds]
for (const e of patternInsights) {
    for (const a of e.aliases) {
        if (!claimed.has(a)) claimed.set(a, []);
        claimed.get(a).push(e.id);
    }
}

const missing = [...techniques].filter((t) => !claimed.has(t)).sort();
const extra = [...claimed.keys()].filter((a) => !techniques.has(a)).sort();
const duplicated = [...claimed.entries()].filter(([, ids]) => ids.length > 1);

console.log(`Patterns in catalog        : ${patternInsights.length}`);
console.log(`Distinct techniques in data: ${techniques.size}`);
console.log(`Aliases claimed            : ${claimed.size}`);
console.log("");

let ok = true;
if (missing.length) { ok = false; console.log("❌ UNCOVERED techniques:\n  " + missing.join("\n  ")); }
if (extra.length)   { ok = false; console.log("❌ Aliases not present in data (typo?):\n  " + extra.join("\n  ")); }
if (duplicated.length) { ok = false; console.log("❌ Techniques claimed by >1 pattern:\n  " + duplicated.map(([a, ids]) => `${a} -> ${ids}`).join("\n  ")); }

console.log(ok ? "\n✅ Comprehensive & non-repeating: every technique maps to exactly one pattern." : "\n⚠️  Fix the issues above.");
process.exit(ok ? 0 : 1);
