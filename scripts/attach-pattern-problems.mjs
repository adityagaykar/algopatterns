// One-off: attaches up to 5 problemIds to each pattern in data/pattern-insights.js
// by mapping each pattern's aliases -> the problems whose patternGuide technique
// matches. Preserves the file's header/footer and content; only adds problemIds.
import fs from "node:fs";

const root = new URL("..", import.meta.url).pathname;
const load = (f, name) =>
    new Function(fs.readFileSync(root + f, "utf8") + `\n;return ${name};`)();

const problems = load("problems.js", "problems");
const patternInsights = load("data/pattern-insights.js", "patternInsights");

// technique -> [problem,...]
const techMap = new Map();
for (const p of problems) {
    const m = /Use \*\*([^*]+)\*\*/.exec(p.patternGuide || "");
    if (!m) continue;
    const t = m[1].trim();
    if (!techMap.has(t)) techMap.set(t, []);
    techMap.get(t).push(p);
}

const diffRank = { Easy: 0, Medium: 1, Hard: 2 };
const byDiffThenId = (x, y) => (diffRank[x.difficulty] - diffRank[y.difficulty]) || (x.id - y.id);

// problems grouped by macro (category) for topping decks up to 5
const byMacro = new Map();
for (const p of problems) {
    if (!byMacro.has(p.category)) byMacro.set(p.category, []);
    byMacro.get(p.category).push(p);
}

for (const e of patternInsights) {
    // core = problems that genuinely use this pattern (from aliases)
    const seen = new Set();
    const core = [];
    for (const a of e.aliases) for (const p of techMap.get(a) || []) {
        if (!seen.has(p.id)) { seen.add(p.id); core.push(p); }
    }
    core.sort(byDiffThenId);

    // top up to 5 with related problems from the same macro family
    const related = (byMacro.get(e.macro) || [])
        .filter((p) => !seen.has(p.id))
        .sort(byDiffThenId);

    const deck = [...core.slice(0, 5)];
    for (const p of related) {
        if (deck.length >= 5) break;
        deck.push(p);
    }
    e.coreCount = core.length;                 // how many genuinely use the pattern
    e.problemIds = deck.map((p) => p.id);      // up to 5, core first then related
}

// ---- re-serialize, preserving header & footer ----
const src = fs.readFileSync(root + "data/pattern-insights.js", "utf8");
const head = src.slice(0, src.indexOf("const patternInsights = [") + "const patternInsights = [".length);

const q = (s) => JSON.stringify(s);
let body = "\n";
let lastMacro = null;
const macroLabel = {
    "Two Pointers": "Two Pointers", "Sliding Window": "Sliding Window",
    "Binary Search": "Binary Search", "Stack": "Stack",
    "Heap / Priority Queue": "Heap / Priority Queue", "Linked List": "Linked List",
    "Trees": "Trees", "Graph BFS/DFS": "Graph BFS/DFS",
    "Topological Sort": "Topological Sort", "Union Find": "Union Find",
    "Dynamic Programming": "Dynamic Programming", "Backtracking": "Backtracking",
    "Greedy": "Greedy", "Intervals": "Intervals", "Trie": "Trie", "String": "String",
    "Math / Bit Manipulation": "Math / Bit Manipulation", "Design": "Design", "Matrix": "Matrix",
};
for (const e of patternInsights) {
    if (e.macro !== lastMacro) {
        body += `\n    // ---- ${macroLabel[e.macro] || e.macro} ----\n`;
        lastMacro = e.macro;
    }
    body += "    {\n";
    body += `        id: ${e.id}, macro: ${q(e.macro)}, pattern: ${q(e.pattern)},\n`;
    body += `        description: ${q(e.description)},\n`;
    body += `        keyIdea: ${q(e.keyIdea)},\n`;
    body += `        aliases: [${e.aliases.map(q).join(", ")}],\n`;
    body += `        coreCount: ${e.coreCount}, problemIds: [${e.problemIds.join(", ")}]\n`;
    body += "    },\n";
}

const footer = `];

// Node/test access without polluting the browser global scope.
if (typeof module !== "undefined" && module.exports) {
    module.exports = patternInsights;
}
`;

fs.writeFileSync(root + "data/pattern-insights.js", head + body + footer);

// summary
const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 };
for (const e of patternInsights) dist[e.problemIds.length]++;
const fullDecks = patternInsights.filter((e) => e.problemIds.length === 5).length;
const coreTotal = patternInsights.reduce((s, e) => s + e.coreCount, 0);
console.log("Deck sizes after top-up (problems in deck -> #patterns):");
for (const k of [5, 4, 3, 2, 1, 0]) console.log(`  ${k}: ${dist[k]} patterns`);
console.log(`Patterns with a full 5-problem deck: ${fullDecks}/${patternInsights.length}`);
console.log(`Core (genuine) pattern→problem links preserved: ${coreTotal}`);
