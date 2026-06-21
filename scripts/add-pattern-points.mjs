// One-off: injects a `points` array (≤5 quick-review bullets) into each pattern
// in data/pattern-insights.js. Each point is "Label: detail" for scannability.
// Preserves the file header/footer + macro section comments; only adds `points`.
import fs from "node:fs";

const root = new URL("..", import.meta.url).pathname;
const patternInsights = new Function(
    fs.readFileSync(root + "data/pattern-insights.js", "utf8") + "\n;return patternInsights;"
)();

// id -> up to 5 quick-review points
const POINTS = {
    1: ["Spot: sorted/positional array, find the best pair or target sum", "Idea: the shorter/limiting side can never do better — discard it", "How: start at both ends, move the limiting pointer inward", "Cost: O(n) time, O(1) space (vs O(n²) brute force)"],
    2: ["Spot: find k numbers hitting a target sum (3Sum, 4Sum)", "Idea: fix one element, two-pointer the rest = nested Two-Sum", "How: sort, pin nums[i], scan inward for the remainder", "Cost: O(n^(k-1)) time, O(1) extra", "Watch: skip equal neighbours to avoid duplicate tuples"],
    3: ["Spot: partition into 3 groups in one pass (0/1/2)", "Idea: three pointers keep <p / =p / >p regions invariant", "How: low, mid, high — swap mid toward low or high", "Cost: O(n) time, O(1) space, single pass", "Watch: don't advance mid after swapping with high"],
    4: ["Spot: next/previous permutation, minimal in-place reshuffle", "Idea: the sorted suffix is already maxed — break just before it", "How: find first dip from right, swap with next-greater, reverse suffix", "Cost: O(n) time, O(1) space"],
    5: ["Spot: longest/shortest substring or subarray with a constraint", "Idea: expand to include, shrink when invalid — each item in/out once", "How: grow right; while invalid move left; track best", "Cost: O(n) time, O(k) counts map", "Watch: a 'formed vs required' counter tracks validity cheaply"],
    6: ["Spot: a property over every window of known size k", "Idea: slide by adding the new and dropping the old element", "How: keep a running sum/frequency; compare each step", "Cost: O(n) time, O(1) space"],
    7: ["Spot: min/max of every sliding window in O(n)", "Idea: drop dominated elements — smaller-and-older can't win", "How: deque of indices kept monotonic; front = extremum", "Cost: amortized O(1) per step, O(k) space"],
    8: ["Spot: search a sorted array that's been rotated", "Idea: at any mid, one half is still fully sorted", "How: find the sorted half, test if target is inside, recurse", "Cost: O(log n)", "Watch: duplicates can break the half-detection"],
    9: ["Spot: 'min/max value that satisfies X', hard to compute directly", "Idea: feasibility is monotonic — guess and verify", "How: binary-search the value with an is-feasible(x) check", "Cost: O(log(range) × check)", "Watch: needs 'works at x ⇒ works at x+1'"],
    10: ["Spot: median/kth across two sorted arrays in log time", "Idea: find a cut where all-left ≤ all-right", "How: binary-search the cut in the smaller array", "Cost: O(log min(m,n))"],
    11: ["Spot: nearest match / predecessor / successor in sorted data", "Idea: bias the search to a boundary, not exact equality", "How: keep the candidate on the matching side while narrowing", "Cost: O(log n); keep data sorted for range queries"],
    12: ["Spot: next/previous greater-or-smaller element; spans, areas", "Idea: a popped item just found its nearest bigger/smaller neighbour", "How: keep the stack monotonic; pop while order breaks", "Cost: O(n) — each index pushed/popped once"],
    13: ["Spot: validate nested brackets/tags", "Idea: LIFO mirrors nesting order exactly", "How: push openers, pop on the matching closer", "Cost: O(n) time, O(n) stack", "Watch: leftover stack or mismatch ⇒ invalid"],
    14: ["Spot: decode/evaluate nested structures (k[...], nested scores)", "Idea: the stack is the recursion you didn't write", "How: on '(' push current state, on ')' pop and merge", "Cost: O(n)"],
    15: ["Spot: evaluate arithmetic with +−×÷ precedence", "Idea: defer low-precedence, resolve high-precedence now", "How: stack of terms; ×/÷ apply immediately, +/− push", "Cost: O(n)"],
    16: ["Spot: merge k sorted lists / next-smallest across sources", "Idea: a size-k heap always surfaces the global minimum", "How: push one per source; pop, emit, push its successor", "Cost: O(N log k)"],
    17: ["Spot: running median of a stream / balanced split", "Idea: lower half in a max-heap, upper half in a min-heap", "How: push then rebalance sizes; median sits at the tops", "Cost: O(log n) insert, O(1) query"],
    18: ["Spot: k most frequent or largest elements", "Idea: counts are bounded by n ⇒ bucket by frequency", "How: bucket sort O(n), or a size-k heap O(n log k)", "Cost: O(n) bucket / O(n log k) heap"],
    19: ["Spot: scheduling with cooldown / most-frequent-first", "Idea: always serve the highest-count available item", "How: max-heap by remaining count; idle/cooldown fills gaps", "Cost: O(n log k)"],
    20: ["Spot: skyline, busiest interval, max overlap", "Idea: process sorted events; a heap holds the active set", "How: at each event add/remove, then read the running answer", "Cost: O(n log n)"],
    21: ["Spot: build or merge a linked list", "Idea: a sentinel head removes first-node edge cases", "How: append to a moving tail; return dummy.next", "Cost: O(n) time, O(1) extra"],
    22: ["Spot: reverse a list or fixed-size groups", "Idea: rewire next pointers — no node copies", "How: reverse within each k-group, then stitch groups", "Cost: O(n) time, O(1) space"],
    23: ["Spot: deep-copy a list/graph with random pointers", "Idea: map original → copy so cycles resolve", "How: pass 1 create copies, pass 2 wire pointers", "Cost: O(n) time and space"],
    24: ["Spot: find the middle / detect a cycle without length", "Idea: a 2× pointer meets slow at the middle (and inside cycles)", "How: advance slow 1, fast 2 until fast ends or they meet", "Cost: O(n) time, O(1) space"],
    25: ["Spot: sort a linked list in O(1) space", "Idea: lists split/merge with pointer surgery — no arrays", "How: split at middle, sort halves, merge", "Cost: O(n log n) time, O(1) space"],
    26: ["Spot: aggregate from children (height, diameter, subtree sums)", "Idea: compute children first, return a summary upward", "How: recurse, combine child results, update a global", "Cost: O(n)", "Watch: return one value up, track the answer separately"],
    27: ["Spot: encode a tree or rebuild it from traversals", "Idea: preorder + null markers uniquely fixes the shape", "How: the root splits inorder into left/right subtrees", "Cost: O(n)"],
    28: ["Spot: in/pre/post-order without recursion", "Idea: simulate the call stack explicitly", "How: push-left then process, or two-stack postorder", "Cost: O(n) time, O(h) stack"],
    29: ["Spot: validate/prune using allowed bounds (valid BST)", "Idea: pass (min,max) limits down to children", "How: check node against range, tighten it per child", "Cost: O(n)"],
    30: ["Spot: count smaller-to-the-right / inversions", "Idea: during a merge, count right items placed before left", "How: merge sort and tally cross-pairs as you merge", "Cost: O(n log n)"],
    31: ["Spot: islands, regions, reachable areas in a grid/graph", "Idea: DFS/BFS from each unvisited seed paints its component", "How: mark visited, recurse into neighbours", "Cost: O(V+E) / O(rows×cols)", "Watch: 'reverse from boundary' flips enclosed-region questions"],
    32: ["Spot: nearest-source distance (rotting oranges, walls/gates)", "Idea: seed all sources at once; first visit = min distance", "How: enqueue every source, then BFS layer by layer", "Cost: O(V+E)"],
    33: ["Spot: fewest moves where each configuration is a node", "Idea: unit-weight edges ⇒ plain BFS gives the minimum", "How: model the state, enqueue neighbours, track visited", "Cost: O(states × transitions)", "Watch: add extra state dims when rules require"],
    34: ["Spot: deep-copy a general graph", "Idea: memoize original → clone to handle cycles", "How: DFS; create clone on first visit, then link neighbours", "Cost: O(V+E)"],
    35: ["Spot: cheapest path with non-negative weights", "Idea: a settled node is final (no negative edges)", "How: min-heap by distance; pop, relax neighbours", "Cost: O(E log V)", "Watch: swap sum→max edge for minimax paths"],
    36: ["Spot: use-every-edge trail; bridges / SCCs", "Idea: Hierholzer splices cycles; Tarjan uses disc/low times", "How: single DFS pass", "Cost: O(V+E)"],
    37: ["Spot: order tasks under dependencies; detect cycles", "Idea: repeatedly remove zero-indegree nodes", "How: Kahn's BFS queue, or DFS post-order reversed", "Cost: O(V+E)", "Watch: leftover nodes ⇒ a cycle exists"],
    38: ["Spot: overlapping subproblems over an acyclic recursion", "Idea: no cycles ⇒ each state is computed once", "How: recurse + cache (longest path, word break)", "Cost: O(states)"],
    39: ["Spot: dynamic 'same group?' plus cycle detection", "Idea: each set is identified by a representative root", "How: union by rank + path compression", "Cost: near O(1) per op", "Watch: union whose ends share a root ⇒ cycle"],
    40: ["Spot: queries with edge removals (DSU can't delete)", "Idea: process queries backward, adding edges", "How: reverse the timeline; union instead of cut", "Cost: ~O((V+Q)·α)"],
    41: ["Spot: longest consecutive run without sorting", "Idea: only start counting where the predecessor is absent", "How: put values in a set; extend runs from their starts", "Cost: O(n)"],
    42: ["Spot: best/count built from choices on earlier states", "Idea: dp[i] depends on a few prior dp values", "How: define state + transition; iterate (sometimes backward)", "Cost: O(n) typical"],
    43: ["Spot: LCS, edit distance, string matching", "Idea: dp[i][j] over prefixes of the two strings", "How: match ⇒ diagonal+1; else best of insert/delete/replace", "Cost: O(m·n)"],
    44: ["Spot: solve a range by its split/last element (burst balloons)", "Idea: dp[i][j] picks the last item or split point", "How: fill short intervals first, expand outward", "Cost: O(n³) typical"],
    45: ["Spot: hit a target sum/capacity by include/exclude", "Idea: each item is a binary choice", "How: 2D table, then roll to 1D iterating capacity backward", "Cost: O(n × capacity)"],
    46: ["Spot: 2D max-region / multi-dim with prefix structure", "Idea: fix a row-pair (or prefix sums) → a 1D subproblem", "How: collapse a dimension, run 1D max-subarray inside", "Cost: ~O(rows² × cols)"],
    47: ["Spot: assignment / TSP / set-cover, n ≤ ~20", "Idea: a subset is just an integer of bits", "How: dp over 2^n masks; transition by adding bits", "Cost: O(2^n × n)"],
    48: ["Spot: a few named states with transitions (hold/sold/rest)", "Idea: model the states + moves, unrolled over time", "How: track each state's best at every step", "Cost: O(n × states)"],
    49: ["Spot: longest increasing subsequence-style problems", "Idea: keep the smallest possible tail per length", "How: binary-search where each element fits in tails[]", "Cost: O(n log n)"],
    50: ["Spot: enumerate all arrangements/selections", "Idea: choose → recurse → undo (backtrack)", "How: a start index (or used set) avoids duplicates", "Cost: exponential (2^n / n!)"],
    51: ["Spot: N-Queens, Sudoku, valid placements", "Idea: reject a partial solution the moment it's invalid", "How: track used rows/cols/diagonals; prune early", "Cost: exponential but pruned hard"],
    52: ["Spot: path or word search on a grid", "Idea: mark visited, explore, unmark on the way out", "How: DFS neighbours, then restore state", "Cost: exponential in path length"],
    53: ["Spot: can-you-reach / minimum jumps", "Idea: track the farthest index reachable so far", "How: one sweep updating reach — no path enumeration", "Cost: O(n)"],
    54: ["Spot: extend a run while valid, cut on a break", "Idea: greedily lengthen, start a new group at the violation", "How: single pass tracking the current segment", "Cost: O(n)"],
    55: ["Spot: order or select by a clever key", "Idea: sort so swapping any out-of-order pair only hurts", "How: pick the right comparator (cost/benefit)", "Cost: O(n log n)", "Watch: justify with an exchange argument"],
    56: ["Spot: minimum swaps to sort/arrange", "Idea: track where each value currently lives", "How: value→index map; correct positions greedily", "Cost: O(n)"],
    57: ["Spot: merge/insert intervals or find gaps", "Idea: overlap ⇔ next.start ≤ current.end", "How: sort by start; extend or emit", "Cost: O(n log n)"],
    58: ["Spot: most non-overlapping intervals / fewest removals", "Idea: always keep the earliest-finishing interval", "How: sort by end; greedily take compatible ones", "Cost: O(n log n)"],
    59: ["Spot: intersect two sorted interval lists", "Idea: an overlap is [max(starts), min(ends)]", "How: two pointers; advance whichever ends first", "Cost: O(m+n)"],
    60: ["Spot: prefix lookups, autocomplete, word sets", "Idea: shared prefixes share a path", "How: a node per char; mark word-ends, store aggregates", "Cost: O(L) per word"],
    61: ["Spot: wildcard match / Word Search II on a grid", "Idea: walk trie + input together to prune dead ends", "How: '.' tries all children; grid DFS dies when off-trie", "Cost: prunes huge search spaces"],
    62: ["Spot: count/find palindromic substrings", "Idea: every palindrome grows from a center", "How: expand outward from each of 2n−1 centers", "Cost: O(n²) time, O(1) space"],
    63: ["Spot: group equivalents (anagrams)", "Idea: map each item to a normal form", "How: sorted letters or char-counts becomes the key", "Cost: O(n·k)"],
    64: ["Spot: serialize variable-length chunks", "Idea: prefix each chunk with its length", "How: '<len>#<payload>' makes decoding unambiguous", "Cost: O(n)"],
    65: ["Spot: substring match / longest prefix = suffix", "Idea: precompute borders to skip re-matching", "How: build the LPS array; never backtrack the text", "Cost: O(n+m)"],
    66: ["Spot: word pattern / isomorphic strings", "Idea: enforce a consistent two-way mapping", "How: forward + reverse maps; any conflict ⇒ false", "Cost: O(n)"],
    67: ["Spot: text justification, palindrome-pair building", "Idea: greedily pack/format, then distribute the remainder", "How: per-line fill; split words into prefix/suffix", "Cost: O(n)"],
    68: ["Spot: a^n, or searching an unbounded range", "Idea: square the base, halve the exponent", "How: process exponent bits; double to find bounds", "Cost: O(log n)"],
    69: ["Spot: find the unique element with O(1) memory", "Idea: count each bit mod k with a tiny state machine", "How: bit ops accumulate occurrences", "Cost: O(n) time, O(1) space"],
    70: ["Spot: long division, GCD, repeating decimals", "Idea: reproduce grade-school arithmetic", "How: carries/remainders; remainder→pos map finds cycles", "Cost: O(digits)"],
    71: ["Spot: LRU / LFU / All-O(1) caches", "Idea: hash for lookup, doubly linked list for O(1) reorder", "How: move node on access; evict from the tail", "Cost: O(1) per op"],
    72: ["Spot: insert / delete / getRandom all in O(1)", "Idea: array for random access, swap the victim to the end", "How: map value→index; pop-back to delete", "Cost: O(1) average"],
    73: ["Spot: hit counter, rate limiter, TTL cache", "Idea: bucket by time slot, clean lazily on access", "How: ring buffer of slots; expire entries on read", "Cost: O(1) amortized"],
    74: ["Spot: calendars, booking, nearest-position queries", "Idea: a balanced sorted map/set gives floor/ceil + ranges", "How: insert keyed; query neighbours in log time", "Cost: O(log n) per op"],
    75: ["Spot: implement a hashmap from scratch", "Idea: bucket by hash, chain collisions in a list", "How: array of buckets; hash → bucket → scan", "Cost: O(1) average, O(n) worst"],
    76: ["Spot: pop the most-frequent (then most-recent) element", "Idea: one stack per frequency level + a max-freq cursor", "How: push raises a value's freq stack; pop the top freq", "Cost: O(1) per op"],
    77: ["Spot: keep live + finalized views in sync", "Idea: an in-progress map beside an aggregate map", "How: update both on write; reads stay O(1)", "Cost: O(1) per op"],
    78: ["Spot: two-player optimal outcomes / elimination", "Idea: maximize over the opponent's minimizing replies", "How: recurse alternating max/min (often + memo)", "Cost: depends on the state space"],
    79: ["Spot: rotate or spiral-traverse a matrix", "Idea: rotate = transpose then reverse each row", "How: spiral shrinks four boundaries inward", "Cost: O(rows×cols), O(1) extra"],
    80: ["Spot: set-matrix-zeroes style in O(1) space", "Idea: store the flags inside the matrix itself", "How: use the first row/col to mark; apply in a 2nd pass", "Cost: O(rows×cols) time, O(1) space"],
};

// validate coverage
const missing = patternInsights.filter((e) => !POINTS[e.id]).map((e) => e.id);
if (missing.length) { console.error("Missing points for ids:", missing.join(", ")); process.exit(1); }
for (const e of patternInsights) {
    e.points = POINTS[e.id].slice(0, 5);
    if (POINTS[e.id].length > 5) console.warn(`id ${e.id} has >5 points, truncated`);
}

// ---- re-serialize, preserving header & footer + macro section comments ----
const src = fs.readFileSync(root + "data/pattern-insights.js", "utf8");
const head = src.slice(0, src.indexOf("const patternInsights = [") + "const patternInsights = [".length);
const q = (s) => JSON.stringify(s);
let body = "\n";
let lastMacro = null;
for (const e of patternInsights) {
    if (e.macro !== lastMacro) { body += `\n    // ---- ${e.macro} ----\n`; lastMacro = e.macro; }
    body += "    {\n";
    body += `        id: ${e.id}, macro: ${q(e.macro)}, pattern: ${q(e.pattern)},\n`;
    body += `        description: ${q(e.description)},\n`;
    body += `        keyIdea: ${q(e.keyIdea)},\n`;
    body += `        points: [\n${e.points.map((p) => `            ${q(p)}`).join(",\n")}\n        ],\n`;
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
const total = patternInsights.reduce((s, e) => s + e.points.length, 0);
console.log(`Injected points into ${patternInsights.length} patterns (${total} bullets total).`);
