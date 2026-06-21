// ============================================================================
// PATTERN INSIGHTS — de-duplicated catalog of recognition-level patterns.
//
// Built by clustering the 160 distinct `patternGuide` techniques tagged across
// problems.js into canonical patterns. Each entry =
//   { id, macro, pattern, description, keyIdea, aliases }
//   - description : what the pattern IS (one line)
//   - keyIdea     : the novel insight that actually cracks problems of this kind
//   - aliases     : the raw patternGuide techniques folded in (coverage proof —
//                   every one of the 160 maps to exactly ONE pattern below).
//
// `macro` matches problem.category. Verify coverage with:
//   node scripts/verify-pattern-insights.mjs
// ============================================================================
const patternInsights = [

    // ---- Two Pointers ----
    {
        id: 1, macro: "Two Pointers", pattern: "Converging pointers (both ends)",
        description: "Two indices start at opposite ends of a sorted/positional array and move inward.",
        keyIdea: "Only ever move the limiting pointer — the side that bounds the result can't be part of a better answer, so you discard O(n²) pairs and finish in one O(n) pass.",
        points: [
            "Spot: sorted/positional array, find the best pair or target sum",
            "Idea: the shorter/limiting side can never do better — discard it",
            "How: start at both ends, move the limiting pointer inward",
            "Cost: O(n) time, O(1) space (vs O(n²) brute force)"
        ],
        aliases: ["two-pointer from both ends", "two-pointer with running max"],
        coreCount: 2, problemIds: [1, 3, 2, 4, 5]
    },
    {
        id: 2, macro: "Two Pointers", pattern: "Sort + fix + two-pointer (k-Sum)",
        description: "Sort, pin one element, then two-pointer the remainder for a target sum.",
        keyIdea: "Sorting reduces k-Sum to repeated Two-Sum scans and makes duplicate-skipping free (skip equal neighbours).",
        points: [
            "Spot: find k numbers hitting a target sum (3Sum, 4Sum)",
            "Idea: fix one element, two-pointer the rest = nested Two-Sum",
            "How: sort, pin nums[i], scan inward for the remainder",
            "Cost: O(n^(k-1)) time, O(1) extra",
            "Watch: skip equal neighbours to avoid duplicate tuples"
        ],
        aliases: ["sort + fix one + two-pointer"],
        coreCount: 1, problemIds: [2, 1, 4, 5, 3]
    },
    {
        id: 3, macro: "Two Pointers", pattern: "Three-way partition (Dutch flag)",
        description: "Partition values into <pivot / =pivot / >pivot in a single in-place pass.",
        keyIdea: "Three boundary pointers (low/mid/high) keep three regions invariant while scanning once — O(1) space, one pass.",
        points: [
            "Spot: partition into 3 groups in one pass (0/1/2)",
            "Idea: three pointers keep <p / =p / >p regions invariant",
            "How: low, mid, high — swap mid toward low or high",
            "Cost: O(n) time, O(1) space, single pass",
            "Watch: don't advance mid after swapping with high"
        ],
        aliases: ["Dutch National Flag / three-way partition"],
        coreCount: 1, problemIds: [5, 1, 2, 4, 3]
    },
    {
        id: 4, macro: "Two Pointers", pattern: "In-place sequence transform",
        description: "Mutate an arrangement into its lexicographic neighbour in place.",
        keyIdea: "Scan from the right for the first dip, swap it with its next-greater element, then reverse the suffix — next permutation in O(1) space.",
        points: [
            "Spot: next/previous permutation, minimal in-place reshuffle",
            "Idea: the sorted suffix is already maxed — break just before it",
            "How: find first dip from right, swap with next-greater, reverse suffix",
            "Cost: O(n) time, O(1) space"
        ],
        aliases: ["scan-from-right + reversal"],
        coreCount: 1, problemIds: [4, 1, 2, 5, 3]
    },

    // ---- Sliding Window ----
    {
        id: 5, macro: "Sliding Window", pattern: "Variable-size sliding window",
        description: "Grow the window to stay valid, shrink it the moment a constraint breaks.",
        keyIdea: "Each element enters and leaves at most once (O(n)); a running count or 'formed vs required' tally tracks validity without re-scanning.",
        points: [
            "Spot: longest/shortest substring or subarray with a constraint",
            "Idea: expand to include, shrink when invalid — each item in/out once",
            "How: grow right; while invalid move left; track best",
            "Cost: O(n) time, O(k) counts map",
            "Watch: a 'formed vs required' counter tracks validity cheaply"
        ],
        aliases: ["sliding window with hash map", "sliding window with frequency map", "variable-size sliding window with hashmap"],
        coreCount: 3, problemIds: [6, 7, 109, 9, 10]
    },
    {
        id: 6, macro: "Sliding Window", pattern: "Fixed-size sliding window",
        description: "Slide a constant-width window, updating state incrementally.",
        keyIdea: "Add the entering element and remove the leaving one each step; fixed-length frequency arrays then compare in O(1).",
        points: [
            "Spot: a property over every window of known size k",
            "Idea: slide by adding the new and dropping the old element",
            "How: keep a running sum/frequency; compare each step",
            "Cost: O(n) time, O(1) space"
        ],
        aliases: ["fixed-size sliding window", "fixed-size sliding window with frequency array"],
        coreCount: 2, problemIds: [9, 10, 6, 7, 8]
    },
    {
        id: 7, macro: "Sliding Window", pattern: "Monotonic deque (window extremum)",
        description: "Maintain a deque of candidates in monotonic order to read the window min/max in O(1).",
        keyIdea: "Pop dominated elements from the back — anything smaller-and-older can never be the max again — giving amortized O(1) per slide.",
        points: [
            "Spot: min/max of every sliding window in O(n)",
            "Idea: drop dominated elements — smaller-and-older can't win",
            "How: deque of indices kept monotonic; front = extremum",
            "Cost: amortized O(1) per step, O(k) space"
        ],
        aliases: ["monotonic deque", "monotone deque + prefix sums", "DP + monotone deque (sliding window max)"],
        coreCount: 3, problemIds: [8, 101, 142, 6, 9]
    },

    // ---- Binary Search ----
    {
        id: 8, macro: "Binary Search", pattern: "Binary search on a rotated array",
        description: "Search a sorted-then-rotated array in O(log n).",
        keyIdea: "At any mid, one half is always sorted — test which half is sorted, then decide whether the target lies inside it.",
        points: [
            "Spot: search a sorted array that's been rotated",
            "Idea: at any mid, one half is still fully sorted",
            "How: find the sorted half, test if target is inside, recurse",
            "Cost: O(log n)",
            "Watch: duplicates can break the half-detection"
        ],
        aliases: ["modified binary search", "binary search on rotated array"],
        coreCount: 2, problemIds: [11, 12, 14, 15, 13]
    },
    {
        id: 9, macro: "Binary Search", pattern: "Binary search on the answer",
        description: "Binary-search the answer value itself when direct computation is hard.",
        keyIdea: "If feasibility is monotonic (works at x ⇒ works at x+1), guess a value and verify it — turning 'find the min/max that works' into log(range) checks.",
        points: [
            "Spot: 'min/max value that satisfies X', hard to compute directly",
            "Idea: feasibility is monotonic — guess and verify",
            "How: binary-search the value with an is-feasible(x) check",
            "Cost: O(log(range) × check)",
            "Watch: needs 'works at x ⇒ works at x+1'"
        ],
        aliases: ["binary search on answer", "binary search on the answer", "multi-phase binary search"],
        coreCount: 3, problemIds: [14, 110, 133, 11, 12]
    },
    {
        id: 10, macro: "Binary Search", pattern: "Binary search on partition",
        description: "Find a split point across two sorted arrays (e.g. median of two arrays).",
        keyIdea: "Search positions, not values: pick a cut in the smaller array so every left element ≤ every right element — O(log min(m,n)).",
        points: [
            "Spot: median/kth across two sorted arrays in log time",
            "Idea: find a cut where all-left ≤ all-right",
            "How: binary-search the cut in the smaller array",
            "Cost: O(log min(m,n))"
        ],
        aliases: ["binary search on partition"],
        coreCount: 1, problemIds: [13, 11, 12, 14, 15]
    },
    {
        id: 11, macro: "Binary Search", pattern: "Binary search for floor/ceiling",
        description: "Find the closest match (predecessor/successor) in sorted data.",
        keyIdea: "Bias the search toward the boundary instead of exact equality, so range/floor/ceil queries stay O(log n) over ordered entries.",
        points: [
            "Spot: nearest match / predecessor / successor in sorted data",
            "Idea: bias the search to a boundary, not exact equality",
            "How: keep the candidate on the matching side while narrowing",
            "Cost: O(log n); keep data sorted for range queries"
        ],
        aliases: ["binary search on sorted list"],
        coreCount: 1, problemIds: [15, 11, 12, 14, 13]
    },

    // ---- Stack ----
    {
        id: 12, macro: "Stack", pattern: "Monotonic stack (next greater/smaller)",
        description: "Keep a stack in increasing/decreasing order to find nearest larger/smaller neighbours.",
        keyIdea: "When a new element breaks the order, the elements you pop have just found their nearest greater/smaller neighbour — each element pushed/popped once (O(n)).",
        points: [
            "Spot: next/previous greater-or-smaller element; spans, areas",
            "Idea: a popped item just found its nearest bigger/smaller neighbour",
            "How: keep the stack monotonic; pop while order breaks",
            "Cost: O(n) — each index pushed/popped once"
        ],
        aliases: ["monotonic stack"],
        coreCount: 1, problemIds: [17, 16, 18, 19, 20]
    },
    {
        id: 13, macro: "Stack", pattern: "Matching stack (balanced structures)",
        description: "Validate nested brackets/tags with a stack.",
        keyIdea: "Push openers, pop on the matching closer — LIFO mirrors nesting order exactly, so a leftover/mismatch means invalid.",
        points: [
            "Spot: validate nested brackets/tags",
            "Idea: LIFO mirrors nesting order exactly",
            "How: push openers, pop on the matching closer",
            "Cost: O(n) time, O(n) stack",
            "Watch: leftover stack or mismatch ⇒ invalid"
        ],
        aliases: ["stack for matching"],
        coreCount: 1, problemIds: [16, 18, 19, 20, 17]
    },
    {
        id: 14, macro: "Stack", pattern: "Stack for nested context",
        description: "Save/restore state across nested brackets (decode strings, nested scoring).",
        keyIdea: "On '(' push the current state and start fresh; on ')' pop and merge — the stack is the recursion you didn't write.",
        points: [
            "Spot: decode/evaluate nested structures (k[...], nested scores)",
            "Idea: the stack is the recursion you didn't write",
            "How: on '(' push current state, on ')' pop and merge",
            "Cost: O(n)"
        ],
        aliases: ["stack for nested context", "stack for nested scoring/computation", "stack for nested evaluation", "recursive descent with stack", "stack of counters/maps"],
        coreCount: 5, problemIds: [18, 20, 105, 119, 125]
    },
    {
        id: 15, macro: "Stack", pattern: "Expression evaluation (precedence)",
        description: "Evaluate arithmetic expressions honouring operator precedence.",
        keyIdea: "Defer lower-precedence operators on a stack and resolve higher-precedence ones immediately (×/÷ before +−).",
        points: [
            "Spot: evaluate arithmetic with +−×÷ precedence",
            "Idea: defer low-precedence, resolve high-precedence now",
            "How: stack of terms; ×/÷ apply immediately, +/− push",
            "Cost: O(n)"
        ],
        aliases: ["stack for expression evaluation"],
        coreCount: 1, problemIds: [19, 16, 18, 20, 17]
    },

    // ---- Heap / Priority Queue ----
    {
        id: 16, macro: "Heap / Priority Queue", pattern: "K-way merge (min-heap)",
        description: "Merge k sorted sequences / stream the next-smallest across sources.",
        keyIdea: "A heap of size k always surfaces the global next-smallest in O(log k); push the successor of whatever you pop.",
        points: [
            "Spot: merge k sorted lists / next-smallest across sources",
            "Idea: a size-k heap always surfaces the global minimum",
            "How: push one per source; pop, emit, push its successor",
            "Cost: O(N log k)"
        ],
        aliases: ["min-heap for k-way merge", "k-pointer min-heap", "merge k sorted lists for feeds"],
        coreCount: 3, problemIds: [96, 21, 149, 23, 24]
    },
    {
        id: 17, macro: "Heap / Priority Queue", pattern: "Two heaps (running median)",
        description: "Maintain a balanced split of a stream for O(1) median.",
        keyIdea: "A max-heap holds the lower half and a min-heap the upper half; keep their sizes balanced so the median sits at the tops.",
        points: [
            "Spot: running median of a stream / balanced split",
            "Idea: lower half in a max-heap, upper half in a min-heap",
            "How: push then rebalance sizes; median sits at the tops",
            "Cost: O(log n) insert, O(1) query"
        ],
        aliases: ["two heaps (max + min)"],
        coreCount: 1, problemIds: [22, 23, 24, 25, 21]
    },
    {
        id: 18, macro: "Heap / Priority Queue", pattern: "Top-K by frequency (bucket / heap)",
        description: "Find the k most frequent / largest elements.",
        keyIdea: "Counts are bounded by n, so bucket by frequency for O(n) — or keep a size-k heap for O(n log k).",
        points: [
            "Spot: k most frequent or largest elements",
            "Idea: counts are bounded by n ⇒ bucket by frequency",
            "How: bucket sort O(n), or a size-k heap O(n log k)",
            "Cost: O(n) bucket / O(n log k) heap"
        ],
        aliases: ["bucket sort on frequency"],
        coreCount: 1, problemIds: [23, 24, 25, 21, 22]
    },
    {
        id: 19, macro: "Heap / Priority Queue", pattern: "Greedy scheduling with a heap",
        description: "Repeatedly serve the most urgent/frequent item via a priority queue.",
        keyIdea: "The most frequent element sets the timeline; always pop the highest-count available item (max-heap) and let idle/cooldown slots fill the gaps.",
        points: [
            "Spot: scheduling with cooldown / most-frequent-first",
            "Idea: always serve the highest-count available item",
            "How: max-heap by remaining count; idle/cooldown fills gaps",
            "Cost: O(n log k)"
        ],
        aliases: ["greedy frequency analysis", "max-heap with cooldown", "reverse simulation with max-heap", "sort + greedy replacement with heap"],
        coreCount: 4, problemIds: [24, 25, 114, 147, 23]
    },
    {
        id: 20, macro: "Heap / Priority Queue", pattern: "Sweep line with heap/multiset",
        description: "Process sorted events while a heap holds the currently-active set.",
        keyIdea: "Sort events, then a heap/multiset of 'active' items lets each event update the running answer (e.g. skyline, busiest interval) in log time.",
        points: [
            "Spot: skyline, busiest interval, max overlap",
            "Idea: process sorted events; a heap holds the active set",
            "How: at each event add/remove, then read the running answer",
            "Cost: O(n log n)"
        ],
        aliases: ["sweep line + heap/multiset"],
        coreCount: 1, problemIds: [104, 23, 24, 25, 21]
    },

    // ---- Linked List ----
    {
        id: 21, macro: "Linked List", pattern: "Dummy-head builder",
        description: "Build or merge a list behind a sentinel head node.",
        keyIdea: "A dummy head removes all first-node edge cases; append to a moving tail pointer and return dummy.next.",
        points: [
            "Spot: build or merge a linked list",
            "Idea: a sentinel head removes first-node edge cases",
            "How: append to a moving tail; return dummy.next",
            "Cost: O(n) time, O(1) extra"
        ],
        aliases: ["dummy head + simultaneous traversal"],
        coreCount: 1, problemIds: [26, 28, 29, 30, 27]
    },
    {
        id: 22, macro: "Linked List", pattern: "In-place / group reversal",
        description: "Reverse a list (or fixed-size groups) by re-pointing links.",
        keyIdea: "Rewire next pointers within each k-group and stitch groups together — O(1) extra space, no node copies.",
        points: [
            "Spot: reverse a list or fixed-size groups",
            "Idea: rewire next pointers — no node copies",
            "How: reverse within each k-group, then stitch groups",
            "Cost: O(n) time, O(1) space"
        ],
        aliases: ["recursive group processing"],
        coreCount: 1, problemIds: [27, 26, 28, 29, 30]
    },
    {
        id: 23, macro: "Linked List", pattern: "Node mapping via hash (clone)",
        description: "Deep-copy a list with arbitrary/random pointers.",
        keyIdea: "Keep an original→copy dictionary so random/next pointers resolve in a second pass even with cycles.",
        points: [
            "Spot: deep-copy a list/graph with random pointers",
            "Idea: map original → copy so cycles resolve",
            "How: pass 1 create copies, pass 2 wire pointers",
            "Cost: O(n) time and space"
        ],
        aliases: ["hash map for node mapping"],
        coreCount: 1, problemIds: [28, 26, 29, 30, 27]
    },
    {
        id: 24, macro: "Linked List", pattern: "Fast/slow pointers",
        description: "Find the middle / detect a cycle without knowing length.",
        keyIdea: "A pointer moving twice as fast reaches the end as the slow one reaches the middle (and they collide inside any cycle).",
        points: [
            "Spot: find the middle / detect a cycle without length",
            "Idea: a 2× pointer meets slow at the middle (and inside cycles)",
            "How: advance slow 1, fast 2 until fast ends or they meet",
            "Cost: O(n) time, O(1) space"
        ],
        aliases: ["find middle + reverse + merge"],
        coreCount: 1, problemIds: [29, 26, 28, 30, 27]
    },
    {
        id: 25, macro: "Linked List", pattern: "Merge sort on a list",
        description: "Sort a linked list in O(n log n) time, O(1) space.",
        keyIdea: "Lists split and merge with O(1) pointer surgery, so merge sort needs no array copies — ideal when random access is unavailable.",
        points: [
            "Spot: sort a linked list in O(1) space",
            "Idea: lists split/merge with pointer surgery — no arrays",
            "How: split at middle, sort halves, merge",
            "Cost: O(n log n) time, O(1) space"
        ],
        aliases: ["merge sort on linked list"],
        coreCount: 1, problemIds: [30, 26, 28, 29, 27]
    },

    // ---- Trees ----
    {
        id: 26, macro: "Trees", pattern: "Post-order bottom-up",
        description: "Each node returns a summary to its parent while a global answer is tracked.",
        keyIdea: "Compute children first, return one value up (height/sum/state tuple), and update a global as you unwind — the trick behind diameter, robbery, balance checks.",
        points: [
            "Spot: aggregate from children (height, diameter, subtree sums)",
            "Idea: compute children first, return a summary upward",
            "How: recurse, combine child results, update a global",
            "Cost: O(n)",
            "Watch: return one value up, track the answer separately"
        ],
        aliases: ["post-order DFS with propagation", "return vs track pattern", "return height, track global", "greedy bottom-up with state"],
        coreCount: 4, problemIds: [31, 37, 33, 129, 34]
    },
    {
        id: 27, macro: "Trees", pattern: "Serialize / reconstruct traversal",
        description: "Encode a tree to a string or rebuild it from traversals.",
        keyIdea: "Preorder + null markers uniquely encodes shape; the head of preorder is the root that splits inorder into left/right subtrees.",
        points: [
            "Spot: encode a tree or rebuild it from traversals",
            "Idea: preorder + null markers uniquely fixes the shape",
            "How: the root splits inorder into left/right subtrees",
            "Cost: O(n)"
        ],
        aliases: ["preorder with null markers", "traversal reconstruction"],
        coreCount: 2, problemIds: [34, 32, 31, 35, 36]
    },
    {
        id: 28, macro: "Trees", pattern: "Iterative traversal with a stack",
        description: "Traverse without recursion using an explicit stack.",
        keyIdea: "Simulate the call stack to emit nodes in order while controlling memory and avoiding deep-recursion limits.",
        points: [
            "Spot: in/pre/post-order without recursion",
            "Idea: simulate the call stack explicitly",
            "How: push-left then process, or two-stack postorder",
            "Cost: O(n) time, O(h) stack"
        ],
        aliases: ["iterative inorder traversal"],
        coreCount: 1, problemIds: [36, 31, 34, 35, 37]
    },
    {
        id: 29, macro: "Trees", pattern: "Top-down range propagation",
        description: "Pass allowed bounds down to children to validate/prune.",
        keyIdea: "Carry (min,max) limits downward so each node is checked against its valid range in one pass (e.g. validate BST).",
        points: [
            "Spot: validate/prune using allowed bounds (valid BST)",
            "Idea: pass (min,max) limits down to children",
            "How: check node against range, tighten it per child",
            "Cost: O(n)"
        ],
        aliases: ["range propagation"],
        coreCount: 1, problemIds: [35, 31, 34, 36, 37]
    },
    {
        id: 30, macro: "Trees", pattern: "Merge-sort counting (inversions)",
        description: "Count cross-pairs (smaller-to-the-right) while merge-sorting.",
        keyIdea: "During the merge step, every time a right element is placed before remaining left elements you've counted those inversions — O(n log n).",
        points: [
            "Spot: count smaller-to-the-right / inversions",
            "Idea: during a merge, count right items placed before left",
            "How: merge sort and tally cross-pairs as you merge",
            "Cost: O(n log n)"
        ],
        aliases: ["modified merge sort"],
        coreCount: 1, problemIds: [108, 31, 34, 35, 36]
    },

    // ---- Graph BFS/DFS ----
    {
        id: 31, macro: "Graph BFS/DFS", pattern: "Flood fill / connected components",
        description: "Explore each region from unvisited seeds (islands, regions).",
        keyIdea: "DFS/BFS from each unvisited cell paints its whole component; flipping to 'what the border reaches' isolates enclosed regions.",
        points: [
            "Spot: islands, regions, reachable areas in a grid/graph",
            "Idea: DFS/BFS from each unvisited seed paints its component",
            "How: mark visited, recurse into neighbours",
            "Cost: O(V+E) / O(rows×cols)",
            "Watch: 'reverse from boundary' flips enclosed-region questions"
        ],
        aliases: ["DFS/BFS flood fill", "DFS connected components", "island labeling + neighbor aggregation", "reverse DFS from boundary"],
        coreCount: 4, problemIds: [38, 39, 43, 45, 40]
    },
    {
        id: 32, macro: "Graph BFS/DFS", pattern: "Multi-source BFS",
        description: "Expand from many sources simultaneously.",
        keyIdea: "Seed the queue with ALL sources at once, so the first time a cell is reached is its distance to the nearest source (rotting oranges, walls-and-gates).",
        points: [
            "Spot: nearest-source distance (rotting oranges, walls/gates)",
            "Idea: seed all sources at once; first visit = min distance",
            "How: enqueue every source, then BFS layer by layer",
            "Cost: O(V+E)"
        ],
        aliases: ["multi-source BFS"],
        coreCount: 1, problemIds: [44, 38, 39, 40, 42]
    },
    {
        id: 33, macro: "Graph BFS/DFS", pattern: "BFS over a state space",
        description: "Shortest number of moves where each configuration is a node.",
        keyIdea: "Model each state as a graph node; unit-weight edges mean plain BFS gives the minimum steps (augment the node with extra state when rules require it).",
        points: [
            "Spot: fewest moves where each configuration is a node",
            "Idea: unit-weight edges ⇒ plain BFS gives the minimum",
            "How: model the state, enqueue neighbours, track visited",
            "Cost: O(states × transitions)",
            "Watch: add extra state dims when rules require"
        ],
        aliases: ["BFS with state transformation", "BFS on permutation states", "BFS with extra state dimension", "BFS on higher-level nodes"],
        coreCount: 4, problemIds: [102, 123, 130, 144, 38]
    },
    {
        id: 34, macro: "Graph BFS/DFS", pattern: "Graph clone (DFS + hashmap)",
        description: "Deep-copy a general graph.",
        keyIdea: "Memoize original→clone during DFS so shared nodes and cycles don't get duplicated or loop forever.",
        points: [
            "Spot: deep-copy a general graph",
            "Idea: memoize original → clone to handle cycles",
            "How: DFS; create clone on first visit, then link neighbours",
            "Cost: O(V+E)"
        ],
        aliases: ["DFS + hash map clone"],
        coreCount: 1, problemIds: [40, 38, 39, 42, 43]
    },
    {
        id: 35, macro: "Graph BFS/DFS", pattern: "Dijkstra / weighted shortest path",
        description: "Cheapest path on non-negative weighted edges (incl. minimax variants).",
        keyIdea: "Pop the closest unsettled node from a min-heap and relax its neighbours — a settled node is final because weights are non-negative; swap 'sum' for 'max edge' to get minimax paths.",
        points: [
            "Spot: cheapest path with non-negative weights",
            "Idea: a settled node is final (no negative edges)",
            "How: min-heap by distance; pop, relax neighbours",
            "Cost: O(E log V)",
            "Watch: swap sum→max edge for minimax paths"
        ],
        aliases: ["Dijkstra with max-relaxation (minimax path)"],
        coreCount: 1, problemIds: [138, 38, 39, 40, 42]
    },
    {
        id: 36, macro: "Graph BFS/DFS", pattern: "Euler path / bridges (advanced graph)",
        description: "Traverse-every-edge trails and critical-edge detection.",
        keyIdea: "Hierholzer splices cycles into one Eulerian trail; Tarjan finds bridges/SCCs from discovery vs low-link times in a single DFS.",
        points: [
            "Spot: use-every-edge trail; bridges / SCCs",
            "Idea: Hierholzer splices cycles; Tarjan uses disc/low times",
            "How: single DFS pass",
            "Cost: O(V+E)"
        ],
        aliases: ["Hierholzer's algorithm", "Tarjan's algorithm (disc + low)"],
        coreCount: 2, problemIds: [41, 146, 38, 39, 40]
    },

    // ---- Topological Sort ----
    {
        id: 37, macro: "Topological Sort", pattern: "Topological sort (Kahn / DFS)",
        description: "Linearize a DAG respecting dependencies; detect cycles.",
        keyIdea: "Repeatedly remove zero-indegree nodes (Kahn's BFS); if any remain, the leftover set is a cycle — also how you extract an order from constraints.",
        points: [
            "Spot: order tasks under dependencies; detect cycles",
            "Idea: repeatedly remove zero-indegree nodes",
            "How: Kahn's BFS queue, or DFS post-order reversed",
            "Cost: O(V+E)",
            "Watch: leftover nodes ⇒ a cycle exists"
        ],
        aliases: ["topological sort (Kahn's BFS)", "constraint extraction + topological sort", "Kahn's BFS topological sort"],
        coreCount: 3, problemIds: [42, 46, 47, 48]
    },
    {
        id: 38, macro: "Topological Sort", pattern: "Memoized DFS on a DAG (top-down DP)",
        description: "Cache results over an acyclic recursion (incl. memoized backtracking).",
        keyIdea: "With no cycles each state is computed once; memoizing recursion turns exponential search into polynomial DP (longest path, word break).",
        points: [
            "Spot: overlapping subproblems over an acyclic recursion",
            "Idea: no cycles ⇒ each state is computed once",
            "How: recurse + cache (longest path, word break)",
            "Cost: O(states)"
        ],
        aliases: ["DFS + memoization on DAG", "backtracking + memoization"],
        coreCount: 2, problemIds: [48, 103, 46, 47]
    },

    // ---- Union Find ----
    {
        id: 39, macro: "Union Find", pattern: "Union-Find (DSU)",
        description: "Track dynamic 'same group' relations and detect cycles.",
        keyIdea: "Path compression + union-by-rank give near-O(1) merge/find; a union whose ends already share a root reveals a cycle (add virtual nodes to union by shared factors).",
        points: [
            "Spot: dynamic 'same group?' plus cycle detection",
            "Idea: each set is identified by a representative root",
            "How: union by rank + path compression",
            "Cost: near O(1) per op",
            "Watch: union whose ends share a root ⇒ cycle"
        ],
        aliases: ["Union-Find", "Union-Find for cycle detection", "Union Find with prime factor virtual nodes"],
        coreCount: 3, problemIds: [50, 51, 140, 49, 122]
    },
    {
        id: 40, macro: "Union Find", pattern: "Offline / reverse-time Union-Find",
        description: "Handle edge removals that DSU can't do directly.",
        keyIdea: "DSU can't delete, so process queries in reverse and ADD edges instead of removing them.",
        points: [
            "Spot: queries with edge removals (DSU can't delete)",
            "Idea: process queries backward, adding edges",
            "How: reverse the timeline; union instead of cut",
            "Cost: ~O((V+Q)·α)"
        ],
        aliases: ["reverse-time Union Find"],
        coreCount: 1, problemIds: [122, 49, 50, 51, 140]
    },
    {
        id: 41, macro: "Union Find", pattern: "Run detection via hash set",
        description: "Find consecutive runs without sorting.",
        keyIdea: "Only begin counting a run at a value whose predecessor is absent, so each element is visited O(1) times — longest-consecutive in O(n).",
        points: [
            "Spot: longest consecutive run without sorting",
            "Idea: only start counting where the predecessor is absent",
            "How: put values in a set; extend runs from their starts",
            "Cost: O(n)"
        ],
        aliases: ["hash set + sequence start detection"],
        coreCount: 1, problemIds: [49, 50, 51, 122, 140]
    },

    // ---- Dynamic Programming ----
    {
        id: 42, macro: "Dynamic Programming", pattern: "1D decision DP",
        description: "dp[i] is the best/count over a few choices from earlier states.",
        keyIdea: "Define each state from a small set of prior states; sometimes it's cleaner built backward from the goal (reverse-thinking).",
        points: [
            "Spot: best/count built from choices on earlier states",
            "Idea: dp[i] depends on a few prior dp values",
            "How: define state + transition; iterate (sometimes backward)",
            "Cost: O(n) typical"
        ],
        aliases: ["1D DP with min/max over choices", "counting DP with choices", "two-walker DP", "reverse-thinking DP"],
        coreCount: 4, problemIds: [52, 64, 65, 120, 53]
    },
    {
        id: 43, macro: "Dynamic Programming", pattern: "2D DP on two sequences",
        description: "dp[i][j] over prefixes of two strings (LCS, edit distance, matching).",
        keyIdea: "On a match extend the diagonal; on a mismatch take the best of insert/delete/replace (or branch on '*'/'.' for wildcard & regex).",
        points: [
            "Spot: LCS, edit distance, string matching",
            "Idea: dp[i][j] over prefixes of the two strings",
            "How: match ⇒ diagonal+1; else best of insert/delete/replace",
            "Cost: O(m·n)"
        ],
        aliases: ["2D DP on two sequences", "edit distance DP", "2D DP for pattern matching", "2D DP for interleaving/merging", "2D DP for wildcard/regex"],
        coreCount: 5, problemIds: [54, 55, 58, 57, 61]
    },
    {
        id: 44, macro: "Dynamic Programming", pattern: "Interval DP",
        description: "Solve on ranges by choosing a splitting/last element.",
        keyIdea: "dp[i][j] picks the last-added element (or split point) in the range and combines sub-ranges; fill short intervals first, expanding outward.",
        points: [
            "Spot: solve a range by its split/last element (burst balloons)",
            "Idea: dp[i][j] picks the last item or split point",
            "How: fill short intervals first, expand outward",
            "Cost: O(n³) typical"
        ],
        aliases: ["interval DP", "interval DP (last element in range)", "interval DP on palindromes", "interval DP with k-way merge"],
        coreCount: 4, problemIds: [59, 56, 66, 132, 52]
    },
    {
        id: 45, macro: "Dynamic Programming", pattern: "Knapsack / subset DP",
        description: "Include-or-exclude items toward a target sum/capacity.",
        keyIdea: "Each item is a binary choice; roll the 2D table down to 1D by iterating capacity in reverse to reuse each item at most once.",
        points: [
            "Spot: hit a target sum/capacity by include/exclude",
            "Idea: each item is a binary choice",
            "How: 2D table, then roll to 1D iterating capacity backward",
            "Cost: O(n × capacity)"
        ],
        aliases: ["partition-into-K-groups DP"],
        coreCount: 1, problemIds: [141, 52, 53, 54, 55]
    },
    {
        id: 46, macro: "Dynamic Programming", pattern: "Dimension-reduction DP",
        description: "Collapse a 2D/3D problem by fixing a pair and solving 1D inside.",
        keyIdea: "Fix a row-pair (or use prefix sums) to turn a 2D max-region into a 1D max-subarray / sorted-set scan.",
        points: [
            "Spot: 2D max-region / multi-dim with prefix structure",
            "Idea: fix a row-pair (or prefix sums) → a 1D subproblem",
            "How: collapse a dimension, run 1D max-subarray inside",
            "Cost: ~O(rows² × cols)"
        ],
        aliases: ["fix-2D-to-1D + sorted set", "3D DP + prefix sums"],
        coreCount: 2, problemIds: [63, 137, 52, 53, 54]
    },
    {
        id: 47, macro: "Dynamic Programming", pattern: "Bitmask DP",
        description: "Encode 'which elements used' as bits for n ≤ ~20.",
        keyIdea: "A subset is an integer; dp over its 2^n values handles assignment / TSP / set-cover by transitioning between subsets.",
        points: [
            "Spot: assignment / TSP / set-cover, n ≤ ~20",
            "Idea: a subset is just an integer of bits",
            "How: dp over 2^n masks; transition by adding bits",
            "Cost: O(2^n × n)"
        ],
        aliases: ["bitmask DP", "bitmask DP (TSP variant)", "bitmask DP for set cover"],
        coreCount: 3, problemIds: [128, 139, 145, 52, 53]
    },
    {
        id: 48, macro: "Dynamic Programming", pattern: "State-machine DP",
        description: "Track a few named states and transition each step.",
        keyIdea: "Model the problem as states (hold/sold/rest, etc.) with transitions — the DP is just the state diagram unrolled over time.",
        points: [
            "Spot: a few named states with transitions (hold/sold/rest)",
            "Idea: model the states + moves, unrolled over time",
            "How: track each state's best at every step",
            "Cost: O(n × states)"
        ],
        aliases: ["state machine DP", "finite-state DP"],
        coreCount: 2, problemIds: [62, 113, 52, 53, 54]
    },
    {
        id: 49, macro: "Dynamic Programming", pattern: "LIS / patience sorting",
        description: "Longest increasing subsequence-style problems in O(n log n).",
        keyIdea: "Keep the smallest possible tail for each subsequence length and binary-search where the next element fits.",
        points: [
            "Spot: longest increasing subsequence-style problems",
            "Idea: keep the smallest possible tail per length",
            "How: binary-search where each element fits in tails[]",
            "Cost: O(n log n)"
        ],
        aliases: ["patience sorting / binary search on tails", "DP + binary search on sorted intervals"],
        coreCount: 2, problemIds: [53, 60, 52, 54, 55]
    },

    // ---- Backtracking ----
    {
        id: 50, macro: "Backtracking", pattern: "Subsets / permutations / combinations",
        description: "Enumerate all candidate arrangements incrementally.",
        keyIdea: "Choose → recurse → undo the choice; a start index (or used set) avoids generating the same combination twice.",
        points: [
            "Spot: enumerate all arrangements/selections",
            "Idea: choose → recurse → undo (backtrack)",
            "How: a start index (or used set) avoids duplicates",
            "Cost: exponential (2^n / n!)"
        ],
        aliases: ["backtracking for Cartesian products", "partition backtracking", "backtracking with pairing", "recursive reduction (pick-pair-combine)", "count-first then prune backtracking"],
        coreCount: 5, problemIds: [68, 71, 107, 111, 117]
    },
    {
        id: 51, macro: "Backtracking", pattern: "Constraint backtracking (prune-on-invalid)",
        description: "Search with early rejection (N-Queens, Sudoku).",
        keyIdea: "Track used rows/cols/diagonals (or sets) and abandon a partial solution the instant it's invalid — pruning is what makes the exponential search tractable.",
        points: [
            "Spot: N-Queens, Sudoku, valid placements",
            "Idea: reject a partial solution the moment it's invalid",
            "How: track used rows/cols/diagonals; prune early",
            "Cost: exponential but pruned hard"
        ],
        aliases: ["backtracking with validity constraints", "backtracking with constraint sets", "backtracking with precedence tracking"],
        coreCount: 3, problemIds: [67, 69, 106, 68, 70]
    },
    {
        id: 52, macro: "Backtracking", pattern: "Grid / board backtracking",
        description: "Explore paths on a grid, undoing moves on the way out.",
        keyIdea: "Mark a cell visited, recurse into neighbours, then unmark so other paths can reuse it (word search, path enumeration).",
        points: [
            "Spot: path or word search on a grid",
            "Idea: mark visited, explore, unmark on the way out",
            "How: DFS neighbours, then restore state",
            "Cost: exponential in path length"
        ],
        aliases: ["grid backtracking with visited", "DFS with physical backtracking"],
        coreCount: 2, problemIds: [70, 112, 67, 68, 71]
    },

    // ---- Greedy ----
    {
        id: 53, macro: "Greedy", pattern: "Reachability / jump greedy",
        description: "Decide feasibility/min-steps by tracking farthest reach.",
        keyIdea: "Sweep once keeping the farthest index reachable so far; you never need to enumerate individual paths.",
        points: [
            "Spot: can-you-reach / minimum jumps",
            "Idea: track the farthest index reachable so far",
            "How: one sweep updating reach — no path enumeration",
            "Cost: O(n)"
        ],
        aliases: ["greedy reachability", "greedy reset"],
        coreCount: 2, problemIds: [72, 73, 74, 75, 76]
    },
    {
        id: 54, macro: "Greedy", pattern: "Segment extension / grouping",
        description: "Extend the current segment while valid, cut when it breaks.",
        keyIdea: "Greedily lengthen the run as long as the constraint holds and start a new group at the first violation.",
        points: [
            "Spot: extend a run while valid, cut on a break",
            "Idea: greedily lengthen, start a new group at the violation",
            "How: single pass tracking the current segment",
            "Cost: O(n)"
        ],
        aliases: ["greedy interval extension", "greedy consecutive grouping"],
        coreCount: 2, problemIds: [74, 75, 72, 73, 76]
    },
    {
        id: 55, macro: "Greedy", pattern: "Exchange-argument greedy (sort by key)",
        description: "Sort by the right comparator so local choices are globally optimal.",
        keyIdea: "Pick the comparator (cost/benefit, opportunity cost) for which swapping any out-of-order pair only hurts — proving the greedy order optimal.",
        points: [
            "Spot: order or select by a clever key",
            "Idea: sort so swapping any out-of-order pair only hurts",
            "How: pick the right comparator (cost/benefit)",
            "Cost: O(n log n)",
            "Watch: justify with an exchange argument"
        ],
        aliases: ["sort by opportunity cost"],
        coreCount: 1, problemIds: [76, 72, 73, 74, 75]
    },
    {
        id: 56, macro: "Greedy", pattern: "Greedy fix-in-place with position map",
        description: "Make each greedy swap O(1) by tracking where values live.",
        keyIdea: "Keep a value→index map so the next corrective swap is constant-time (e.g. minimum swaps to sort/arrange).",
        points: [
            "Spot: minimum swaps to sort/arrange",
            "Idea: track where each value currently lives",
            "How: value→index map; correct positions greedily",
            "Cost: O(n)"
        ],
        aliases: ["greedy fix-in-place with position map"],
        coreCount: 1, problemIds: [150, 72, 73, 74, 75]
    },

    // ---- Intervals ----
    {
        id: 57, macro: "Intervals", pattern: "Merge overlapping intervals",
        description: "Combine or find gaps among intervals.",
        keyIdea: "Sort by start; intervals overlap iff next.start ≤ current.end — extend, otherwise emit and start a new one.",
        points: [
            "Spot: merge/insert intervals or find gaps",
            "Idea: overlap ⇔ next.start ≤ current.end",
            "How: sort by start; extend or emit",
            "Cost: O(n log n)"
        ],
        aliases: ["sort + merge", "flatten + sort + scan for gaps"],
        coreCount: 2, problemIds: [77, 115, 78, 79, 80]
    },
    {
        id: 58, macro: "Intervals", pattern: "Activity selection (sort by end)",
        description: "Fit the most non-overlapping intervals / fewest removals.",
        keyIdea: "Always keep the interval that finishes earliest — it leaves the most room for the rest.",
        points: [
            "Spot: most non-overlapping intervals / fewest removals",
            "Idea: always keep the earliest-finishing interval",
            "How: sort by end; greedily take compatible ones",
            "Cost: O(n log n)"
        ],
        aliases: ["greedy activity selection (sort by end)"],
        coreCount: 1, problemIds: [78, 77, 79, 80, 115]
    },
    {
        id: 59, macro: "Intervals", pattern: "Two-list interval intersection",
        description: "Intersect two sorted interval lists.",
        keyIdea: "Walk both lists with pointers; the overlap is [max(starts), min(ends)] when non-empty, then advance whichever ends first.",
        points: [
            "Spot: intersect two sorted interval lists",
            "Idea: an overlap is [max(starts), min(ends)]",
            "How: two pointers; advance whichever ends first",
            "Cost: O(m+n)"
        ],
        aliases: ["sweep line / two sorted arrays", "two-pointer interval intersection"],
        coreCount: 2, problemIds: [79, 80, 77, 78, 115]
    },

    // ---- Trie ----
    {
        id: 60, macro: "Trie", pattern: "Trie (prefix tree)",
        description: "Branch character-by-character so shared prefixes share nodes.",
        keyIdea: "Each node marks a word-end and can store aggregates (counts/values) at nodes for fast prefix lookups; reversed/suffix-wrapped keys handle suffix queries and path systems.",
        points: [
            "Spot: prefix lookups, autocomplete, word sets",
            "Idea: shared prefixes share a path",
            "How: a node per char; mark word-ends, store aggregates",
            "Cost: O(L) per word"
        ],
        aliases: ["Trie", "suffix-wrapped Trie", "reversed-word Trie", "Trie as file system", "Trie with aggregation at nodes"],
        coreCount: 5, problemIds: [81, 116, 126, 131, 136]
    },
    {
        id: 61, macro: "Trie", pattern: "Trie-guided search (wildcard / grid)",
        description: "Walk the trie alongside the input to prune the search.",
        keyIdea: "Advance trie and input together; '.' tries all children, and a grid DFS dies instantly when no trie branch matches — pruning huge search spaces.",
        points: [
            "Spot: wildcard match / Word Search II on a grid",
            "Idea: walk trie + input together to prune dead ends",
            "How: '.' tries all children; grid DFS dies when off-trie",
            "Cost: prunes huge search spaces"
        ],
        aliases: ["Trie + DFS for wildcard search", "Trie + grid DFS"],
        coreCount: 2, problemIds: [83, 82, 81, 126, 131]
    },

    // ---- String ----
    {
        id: 62, macro: "String", pattern: "Expand around center",
        description: "Find palindromic substrings by growing from centers.",
        keyIdea: "Every palindrome has a center; expand outward from each of the 2n−1 centers in O(n²) with O(1) space.",
        points: [
            "Spot: count/find palindromic substrings",
            "Idea: every palindrome grows from a center",
            "How: expand outward from each of 2n−1 centers",
            "Cost: O(n²) time, O(1) space"
        ],
        aliases: ["expand around center"],
        coreCount: 1, problemIds: [84, 85, 86, 87, 88]
    },
    {
        id: 63, macro: "String", pattern: "Canonical-form hashing",
        description: "Group equivalent items by a normalized signature.",
        keyIdea: "Map each item to a canonical form (sorted letters / character counts) so all equivalents collide in the same hash bucket.",
        points: [
            "Spot: group equivalents (anagrams)",
            "Idea: map each item to a normal form",
            "How: sorted letters or char-counts becomes the key",
            "Cost: O(n·k)"
        ],
        aliases: ["canonical form hashing"],
        coreCount: 1, problemIds: [85, 84, 86, 87, 88]
    },
    {
        id: 64, macro: "String", pattern: "Length-prefix encoding",
        description: "Serialize variable-length chunks unambiguously.",
        keyIdea: "Prefix each chunk with its length + delimiter so decoding never confuses payload bytes with separators.",
        points: [
            "Spot: serialize variable-length chunks",
            "Idea: prefix each chunk with its length",
            "How: '<len>#<payload>' makes decoding unambiguous",
            "Cost: O(n)"
        ],
        aliases: ["length-prefix encoding"],
        coreCount: 1, problemIds: [86, 84, 85, 87, 88]
    },
    {
        id: 65, macro: "String", pattern: "KMP / failure function",
        description: "Linear-time substring matching and prefix=suffix queries.",
        keyIdea: "Precompute the longest proper prefix that is also a suffix to skip re-matching; running it on s + '#' + reverse(s) yields the longest palindromic prefix.",
        points: [
            "Spot: substring match / longest prefix = suffix",
            "Idea: precompute borders to skip re-matching",
            "How: build the LPS array; never backtrack the text",
            "Cost: O(n+m)"
        ],
        aliases: ["KMP failure function on s + '#' + reverse(s)"],
        coreCount: 1, problemIds: [148, 84, 85, 86, 87]
    },
    {
        id: 66, macro: "String", pattern: "Pattern bijection (mapping consistency)",
        description: "Verify a consistent symbol-to-symbol mapping.",
        keyIdea: "Maintain forward and reverse maps; any conflict means no valid isomorphism (word pattern, cycle analysis).",
        points: [
            "Spot: word pattern / isomorphic strings",
            "Idea: enforce a consistent two-way mapping",
            "How: forward + reverse maps; any conflict ⇒ false",
            "Cost: O(n)"
        ],
        aliases: ["mapping consistency + cycle analysis"],
        coreCount: 1, problemIds: [143, 84, 85, 86, 87]
    },
    {
        id: 67, macro: "String", pattern: "Constructive string building",
        description: "Greedily assemble/justify or decompose strings.",
        keyIdea: "Pack as much as fits per line then distribute spacing; for palindrome pairs, split each word into prefix/suffix and look up the reverse.",
        points: [
            "Spot: text justification, palindrome-pair building",
            "Idea: greedily pack/format, then distribute the remainder",
            "How: per-line fill; split words into prefix/suffix",
            "Cost: O(n)"
        ],
        aliases: ["greedy packing + formatting", "hash map + palindrome prefix/suffix decomposition"],
        coreCount: 2, problemIds: [87, 88, 84, 85, 86]
    },

    // ---- Math / Bit Manipulation ----
    {
        id: 68, macro: "Math / Bit Manipulation", pattern: "Fast exponentiation / doubling",
        description: "Compute powers (or search ranges) in O(log n).",
        keyIdea: "Square the base and halve the exponent each step; the same bit-doubling finds bounds via exponential search.",
        points: [
            "Spot: a^n, or searching an unbounded range",
            "Idea: square the base, halve the exponent",
            "How: process exponent bits; double to find bounds",
            "Cost: O(log n)"
        ],
        aliases: ["binary exponentiation", "exponential search with bit shifts"],
        coreCount: 2, problemIds: [89, 90, 91, 92, 127]
    },
    {
        id: 69, macro: "Math / Bit Manipulation", pattern: "Bitwise counting / state",
        description: "Use bit tricks to isolate a unique element with O(1) memory.",
        keyIdea: "Track each bit's occurrence count mod k with a tiny bit-state machine so the non-repeating element falls out without extra storage.",
        points: [
            "Spot: find the unique element with O(1) memory",
            "Idea: count each bit mod k with a tiny state machine",
            "How: bit ops accumulate occurrences",
            "Cost: O(n) time, O(1) space"
        ],
        aliases: ["bitwise state machine"],
        coreCount: 1, problemIds: [92, 89, 90, 91, 127]
    },
    {
        id: 70, macro: "Math / Bit Manipulation", pattern: "Digit / arithmetic simulation",
        description: "Reproduce grade-school arithmetic on digits.",
        keyIdea: "Simulate long division/GCD with carries and remainders; a remainder→position map detects repeating decimals (cycle detection).",
        points: [
            "Spot: long division, GCD, repeating decimals",
            "Idea: reproduce grade-school arithmetic",
            "How: carries/remainders; remainder→pos map finds cycles",
            "Cost: O(digits)"
        ],
        aliases: ["long division simulation", "reverse + modulo (GCD-like)"],
        coreCount: 2, problemIds: [91, 127, 89, 90, 92]
    },

    // ---- Design ----
    {
        id: 71, macro: "Design", pattern: "Hash map + doubly linked list",
        description: "O(1) lookup with O(1) reordering/eviction (LRU, LFU, All-O(1)).",
        keyIdea: "The hash map finds a node in O(1); the doubly linked list moves/evicts it in O(1) — together they keep recency/frequency order at constant cost.",
        points: [
            "Spot: LRU / LFU / All-O(1) caches",
            "Idea: hash for lookup, doubly linked list for O(1) reorder",
            "How: move node on access; evict from the tail",
            "Cost: O(1) per op"
        ],
        aliases: ["hash map + doubly linked list", "doubly linked list of buckets + hashmap", "freq buckets + LRU lists + minFreq tracker"],
        coreCount: 3, problemIds: [93, 95, 135, 151, 94]
    },
    {
        id: 72, macro: "Design", pattern: "Array + hash map (O(1) random)",
        description: "Insert/delete/getRandom all in O(1).",
        keyIdea: "Keep values in an array for O(1) random access and swap the victim to the end to delete in O(1); the hash map stores each value's index.",
        points: [
            "Spot: insert / delete / getRandom all in O(1)",
            "Idea: array for random access, swap the victim to the end",
            "How: map value→index; pop-back to delete",
            "Cost: O(1) average"
        ],
        aliases: ["array + hash map with swap-to-back", "object pool (set + queue)", "array + cursor pointer"],
        coreCount: 3, problemIds: [94, 152, 155, 151, 93]
    },
    {
        id: 73, macro: "Design", pattern: "Bucketed time design (lazy expiry)",
        description: "Hit counters / rate limiters / TTL caches over time slots.",
        keyIdea: "Bucket events by timestamp slot and clean up lazily on access (don't pay until you read); a fixed ring buffer recycles slots.",
        points: [
            "Spot: hit counter, rate limiter, TTL cache",
            "Idea: bucket by time slot, clean lazily on access",
            "How: ring buffer of slots; expire entries on read",
            "Cost: O(1) amortized"
        ],
        aliases: ["bucketed circular buffer with lazy invalidation", "lazy TTL expiration", "ring buffer (array + two pointers)"],
        coreCount: 3, problemIds: [154, 157, 159, 151, 93]
    },
    {
        id: 74, macro: "Design", pattern: "Sorted-structure design",
        description: "Calendars, booking, occupied positions, per-key streams.",
        keyIdea: "Keep keys in a balanced sorted map/set so floor/ceil-neighbour and range queries stay O(log n) — the backbone of interval/booking designs.",
        points: [
            "Spot: calendars, booking, nearest-position queries",
            "Idea: a balanced sorted map/set gives floor/ceil + ranges",
            "How: insert keyed; query neighbours in log time",
            "Cost: O(log n) per op"
        ],
        aliases: ["sorted map of intervals", "sorted map for interval tracking", "sorted set of occupied positions", "hashmap + per-key sorted structure (heap or TreeSet)", "HashMap + sorted multiset/list"],
        coreCount: 5, problemIds: [153, 158, 160, 118, 134]
    },
    {
        id: 75, macro: "Design", pattern: "Custom hash table (separate chaining)",
        description: "Implement a hash map from scratch.",
        keyIdea: "Hash the key to a bucket and chain collisions in a list — the mechanics underneath every built-in hashmap.",
        points: [
            "Spot: implement a hashmap from scratch",
            "Idea: bucket by hash, chain collisions in a list",
            "How: array of buckets; hash → bucket → scan",
            "Cost: O(1) average, O(n) worst"
        ],
        aliases: ["separate chaining hash table"],
        coreCount: 1, problemIds: [151, 93, 94, 96, 97]
    },
    {
        id: 76, macro: "Design", pattern: "Frequency-grouped stacks",
        description: "Pop the most-frequent (then most-recent) element in O(1).",
        keyIdea: "Keep one stack per frequency level plus a max-frequency cursor so the hottest, newest element is always on top.",
        points: [
            "Spot: pop the most-frequent (then most-recent) element",
            "Idea: one stack per frequency level + a max-freq cursor",
            "How: push raises a value's freq stack; pop the top freq",
            "Cost: O(1) per op"
        ],
        aliases: ["frequency-grouped stacks"],
        coreCount: 1, problemIds: [121, 151, 93, 94, 96]
    },
    {
        id: 77, macro: "Design", pattern: "Streaming aggregation (two-map)",
        description: "Keep live and finalized views in sync for O(1) updates+queries.",
        keyIdea: "Maintain an 'in-progress' structure beside a finalized aggregate (or a deque mirrored by a hash set) so both writes and reads stay O(1).",
        points: [
            "Spot: keep live + finalized views in sync",
            "Idea: an in-progress map beside an aggregate map",
            "How: update both on write; reads stay O(1)",
            "Cost: O(1) per op"
        ],
        aliases: ["in-progress map + aggregation map", "deque + mirrored hash set"],
        coreCount: 2, problemIds: [97, 156, 151, 93, 94]
    },
    {
        id: 78, macro: "Design", pattern: "Minimax / optimal-play decision",
        description: "Two-player optimal outcomes / elimination.",
        keyIdea: "Assume both sides play optimally: the current player maximizes over the opponent's minimizing responses.",
        points: [
            "Spot: two-player optimal outcomes / elimination",
            "Idea: maximize over the opponent's minimizing replies",
            "How: recurse alternating max/min (often + memo)",
            "Cost: depends on the state space"
        ],
        aliases: ["minimax elimination"],
        coreCount: 1, problemIds: [124, 151, 93, 94, 96]
    },

    // ---- Matrix ----
    {
        id: 79, macro: "Matrix", pattern: "In-place matrix transforms",
        description: "Rotate / spiral-traverse a matrix with O(1) extra space.",
        keyIdea: "Rotate = transpose then reverse each row; spiral = shrink four boundaries (top/bottom/left/right) inward.",
        points: [
            "Spot: rotate or spiral-traverse a matrix",
            "Idea: rotate = transpose then reverse each row",
            "How: spiral shrinks four boundaries inward",
            "Cost: O(rows×cols), O(1) extra"
        ],
        aliases: ["transpose + reverse", "four-boundary spiral"],
        coreCount: 2, problemIds: [98, 99, 100, 138]
    },
    {
        id: 80, macro: "Matrix", pattern: "Matrix markers (first row/col flags)",
        description: "Record state in the matrix itself to save space.",
        keyIdea: "Use the first row and column as flags for which rows/cols to modify, achieving O(1) auxiliary space (set-matrix-zeroes).",
        points: [
            "Spot: set-matrix-zeroes style in O(1) space",
            "Idea: store the flags inside the matrix itself",
            "How: use the first row/col to mark; apply in a 2nd pass",
            "Cost: O(rows×cols) time, O(1) space"
        ],
        aliases: ["first row/col as markers"],
        coreCount: 1, problemIds: [100, 98, 99, 138]
    },
];

// Node/test access without polluting the browser global scope.
if (typeof module !== "undefined" && module.exports) {
    module.exports = patternInsights;
}
