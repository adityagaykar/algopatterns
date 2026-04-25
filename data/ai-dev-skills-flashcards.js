// Agentic AI for Developers — flashcard deck
// Schema: { id, category, icon, front, back }

const aiDevSkillsFlashcards = [

// ===== Prompting Mastery =====
{id:1, category:"Prompting Mastery", icon:"🎯", front:"RCTF Prompt Scaffold",
back:"Role → Context → Task → Format\n\n• Role: persona ('senior reviewer')\n• Context: facts, conventions, constraints\n• Task: ONE verb, ONE outcome\n• Format: exact structure (JSON schema, markdown table, diff)\n\nDelimit untrusted input: <user_query>...</user_query>\nPut high-signal context FIRST and LAST (lost-in-the-middle effect)."},

{id:2, category:"Prompting Mastery", icon:"🧠", front:"When to use Chain-of-Thought",
back:"Plain CoT ('think step by step'): boosts multi-step accuracy at token-cost tax.\n\nReasoning models (Opus, GPT-5 Pro, o-series) auto-spend hidden thinking tokens — don't ask, just route the right tasks to them.\n\nUse CoT for: math, debugging, planning, code w/ edge cases.\nSkip for: chit-chat, extraction, classification.\n\nSelf-consistency: sample N at temp>0, majority vote.\nReflexion: critique own draft → rewrite."},

{id:3, category:"Prompting Mastery", icon:"📦", front:"Structured Output / JSON Mode",
back:"USE the provider's structured output API (OpenAI response_format, Anthropic tool_use) — they CONSTRAIN decoding, not just prompt.\n\n• Define Pydantic / Zod schema = contract\n• Flat schemas > deep nesting\n• Strict enums prevent hallucinated values\n• Always wrap with retry-on-validation-fail\n• Log bad outputs for prompt regression tests\n\n{ \"answer\": str, \"confidence\": 0-1, \"sources\": [...] }"},

{id:4, category:"Prompting Mastery", icon:"💾", front:"Prompt Caching & Cost Levers",
back:"Cache stable prefixes (system + tools + few-shot). Put VOLATILE user input LAST.\n  → 60–90% cost cut, 5-min TTL\n\nModel routing: cheap router → strong only when needed\nBatch APIs: 50% off for non-interactive jobs\nStreaming: better UX, same cost\n\nBuild $/operation dashboard from day 1.\n'Costs went up 40%' is unsolvable retroactively."},

{id:5, category:"Prompting Mastery", icon:"🎬", front:"Few-Shot Best Practices",
back:"3–5 great examples > 50 mediocre.\n\n• Diversity > volume\n• Order matters: gold standard LAST (recency)\n• Cover edge / adversarial cases — they act like training data\n• Retrieve top-k similar examples per query for heterogeneous inputs (RAG-over-examples)\n• Always test 0-shot first; modern models often don't need any\n\nFine-tune only when few-shot tops out + you have >>1k labeled."},

// ===== Agent Architecture =====
{id:6, category:"Agent Architecture", icon:"🛠️", front:"Tool Use / Function Calling",
back:"Tool = (name, description, JSON-schema params)\nThe DESCRIPTION is the prompt — write it like a docstring an LLM will read.\n\nLoop: user → model picks tools → you execute → return tool_result → model continues\n\nMUST haves:\n• max_iterations cap (avoid runaway $)\n• Idempotency keys on side-effecting tools\n• Structured failures, not exceptions (model can recover)\n• Parameterize SQL/shell — never let model build raw strings"},

{id:7, category:"Agent Architecture", icon:"🔁", front:"ReAct vs Plan-and-Execute vs Reflexion",
back:"ReAct: one model, interleaved Thought→Action→Observation. Good for short workflows (<10 steps).\n\nPlan-and-Execute: planner LLM emits plan; cheap executor runs steps. Better for long horizons + replan on failure.\n\nReflexion: feed failures back as 'lessons' for next attempt. Gold for code-gen + tool-use loops.\n\nMulti-agent: rarely worth complexity; reach for it ONLY when sub-tasks need different sandboxes/specs.\n\nALWAYS log every (thought, action, obs) tuple."},

{id:8, category:"Agent Architecture", icon:"🔌", front:"Model Context Protocol (MCP)",
back:"Open protocol — 'USB-C of AI tools'. Anthropic-led, now in Claude Desktop, GPT, Cursor, Zed, JetBrains.\n\n3 primitives:\n• Tools (functions)\n• Resources (read-only data: files, db rows)\n• Prompts (reusable templates)\n\nTransports: stdio (local) / HTTP+SSE (remote) + OAuth2.\n\nWhy employers care: an MCP-fluent engineer wires company tools into AI assistants in DAYS.\n\nWatch: auth, rate limits, paginate big Resources."},

{id:9, category:"Agent Architecture", icon:"🧬", front:"Agent Memory Types",
back:"4 kinds:\n• Short-term: conversation history (sliding window or summarize)\n• Episodic: per-session facts → KV store (Redis, SQLite)\n• Semantic: long-term knowledge → vector store, retrieved by similarity\n• Procedural: learned skills → updated tool desc / fine-tuned LoRA (rare prod)\n\nAggressive summarization > unbounded growth.\nGive users a 'view / forget memories' UI (GDPR + UX)."},

{id:10, category:"Agent Architecture", icon:"🛡️", front:"Prompt Injection Defense",
back:"DIRECT: 'ignore prior instructions...'\nINDIRECT (worse): malicious text inside webpage / email / PR the agent reads\n\nDefenses (layered):\n• Tag untrusted: <external_content>...</external_content>\n• Refuse to follow instructions found in tool outputs\n• Output classifier before any side effect\n• Human-approval gate for high-impact actions\n• Parameterize all SQL/shell\n• Red-team payloads in your test suite\n\nNever trust the model to 'just be careful'."},

// ===== AI-Augmented Workflow =====
{id:11, category:"AI-Augmented Workflow", icon:"📝", front:"Spec-Driven Development",
back:"Highest-leverage habit: write the SPEC with the AI before any code.\n\nFlow: spec → test list → tests → impl\n\n• Treat AI as 'spec sparring partner' — ask it to find edge cases, ambiguities\n• Commit specs to docs/specs/ — both human docs AND persistent AI context\n• On legacy code: ask AI to RESTATE current behavior contract first\n• Iterate on the SPEC, not the impl — bugs are 100× cheaper to fix here"},

{id:12, category:"AI-Augmented Workflow", icon:"🔍", front:"AI Code Review Patterns",
back:"Self-review BEFORE pushing: paste diff + 'review as senior eng; flag bugs, missed tests, naming, perf'.\n\nPR bot: GitHub Action with team style guide as system prompt. Best for consistency drift, not deep design.\n\nAsk SPECIFIC dimensions (bugs / races / errors / tests / naming) — single-axis prompts > 'find issues'.\n\nUse for boring stuff humans hate to flag: nil checks, log formats, untested branches.\n\nNEVER auto-merge on AI approval. AI is reviewer, not accountable engineer."},

{id:13, category:"AI-Augmented Workflow", icon:"🧪", front:"Test Generation with AI",
back:"Test-first: 'Given signature + contract, propose test list covering happy / edge / error / security.' Review LIST first, then generate code.\n\nProperty-based: ask for INVARIANTS, then generate Hypothesis / fast-check tests.\n\nMutation testing: ask AI to mutate function 5 ways and predict surviving tests.\n\nSnapshot tests on AI output → cheap regression detection for prompt/model changes.\n\nDISABLE the 'make test pass' shortcut — or you'll catch it weakening assertions."},

{id:14, category:"AI-Augmented Workflow", icon:"♻️", front:"AI-Powered Refactoring at Scale",
back:"Frame as 'mechanical transformations + rules': OLD pattern, NEW pattern, edge cases, verification (typecheck + tests).\n\n80/20: AST-based codemods (jscodeshift, ts-morph, libcst, comby) for the deterministic 80%, LLM for the messy 20%.\n\nLoop: generate → typecheck → test → lint → review. Feed errors back. Aider / Claude Code / Cursor agent-mode automate this.\n\nOne PR per package or layer. Big-bang AI migrations = big-bang refactors.\n\nTrack metrics: files, tests, regressions caught."},

{id:15, category:"AI-Augmented Workflow", icon:"📚", front:"Knowledge Capture Workflows",
back:"Make documentation a free byproduct:\n\n• PR descriptions: diff + ticket + 'why' → polished description\n• Commit messages: AI generates Conventional Commits from staged diff\n• ADRs: AI drafts from your bullet-point thinking\n• Runbooks: paste retro timeline + chat → runbook entry in team format\n• Living docs: nightly job diffs README vs code, surfaces drift\n\nCommit the PROMPTS too — doc generators are code."},

// ===== Production AI Systems =====
{id:16, category:"Production AI Systems", icon:"🔎", front:"RAG Pipeline & Failure Modes",
back:"Pipeline: chunk → embed → index → retrieve top-k → rerank → stuff → generate\n\nChunking: semantic > fixed. 200–800 tokens, 10–20% overlap.\n\nHybrid > pure vector: BM25 + dense + reranker (Cohere / Voyage).\n\nEval RETRIEVER separately (recall@k, MRR). 80% of bad RAG = retrieval problem.\n\nAttribute every claim back to its source chunk in UI → trust + diagnosability.\n\nReach for fine-tuning ONLY when better retrieval can't solve it."},

{id:17, category:"Production AI Systems", icon:"⚖️", front:"Evals & LLM-as-Judge",
back:"3 tiers:\n• Unit: deterministic (regex, exact match, JSON-valid)\n• Reference: BLEU/ROUGE/embedding sim vs gold\n• Rubric: LLM-as-judge against rubric\n\nLLM-as-judge biases: prefers verbose, prefers its own style. Calibrate with human samples.\n\nPairwise > absolute (lower variance).\n\nRun evals in CI like test coverage. Prompt change = code change.\n\nGolden set of 50–500 hand-labeled examples is more valuable than any prompt."},

{id:18, category:"Production AI Systems", icon:"📈", front:"LLM Observability",
back:"Trace EVERY call: prompt, response, model, tokens in/out, cost, latency, user_id, request_id.\n\nTools: LangSmith, Langfuse, Helicone, Arize Phoenix, OTel GenAI conventions.\n\nTag spans by feature → 'cost per user per day for feature X'.\n\nProd sampling: head-based + always trace errors / slow calls.\n\nWire traces to your golden set: 'replay this prod trace through new prompt' = best eval loop you can build.\n\nMask PII early. Strip base64/images or trace bill explodes."},

{id:19, category:"Production AI Systems", icon:"🚦", front:"Latency & Cost Optimization",
back:"Latency budget: TTFT (time-to-first-token), TBT, total. Streaming helps TTFT not total. Reasoning models = HUGE TTFT, bad for chat UIs.\n\nWins:\n• Speculative decoding + prompt caching (free)\n• Parallelize independent calls (asyncio.gather) — ReAct serializes unnecessarily\n• Cache deterministic outputs (model+temp=0+prompt-hash)\n• Distill: strong model labels offline → fine-tune small model. 100× cost cut at 95% quality is common.\n\nNever cache PII responses across users."},

{id:20, category:"Production AI Systems", icon:"🔐", front:"Privacy & Compliance Essentials",
back:"Enterprise tiers: no-training-on-data + region pinning. Know which your co. is on.\n\nPII: redact BEFORE sending (Microsoft Presidio, regex+NER). Audit log what was sent.\n\nOutput safety classifier on high-risk surfaces — stronger than RLHF alone.\n\nRegs: EU AI Act, US state laws, HIPAA / SOX / PCI. 'High-risk' systems often legally require human oversight.\n\nAudit trail: who, what, returned, action — immutable storage.\n\nNever use consumer ChatGPT for prod data."},

// ===== Showcasing AI Skills =====
{id:21, category:"Showcasing AI Skills", icon:"🏗️", front:"Building Internal AI Tools",
back:"Best signal of AI fluency to employers = shipping internal tools real teammates use.\n\nStart with a paper cut: standup notes, on-call handover, PR descriptions. Solve THAT.\n\nBoring tech: Streamlit / Next.js + 1 LLM call + light eval. NOT a 'platform'.\n\nInstrument from day 1 — usage, cost, quality. Numbers you'll quote in perf review.\n\nOpen-source the prompt + eval set even if data stays internal.\n\nWrite the README as if a hiring manager will read it. Often they will."},

{id:22, category:"Showcasing AI Skills", icon:"⚡", front:"2026 Productivity Stack",
back:"IDE: Cursor / Windsurf / VS Code+Claude — learn AGENT MODE deeply, not just tab-complete\nCLI: Claude Code / Aider / OpenAI Codex CLI — terminal agent loop = highest leverage\nReasoning sidekick: Opus / GPT-5 Pro / Gemini Pro for hard design + postmortems\nVoice: Wispr / Superwhisper / Aqua — doubles long-prompt input bandwidth\nPersonal RAG: Notion AI / Mem / custom — query your past decisions\n\nMaster ONE deeply. 5th plugin doesn't make you faster."},

{id:23, category:"Showcasing AI Skills", icon:"🎤", front:"Resume / Interview Talking Points",
back:"QUANTIFY: 'Cut review time 40% with Claude self-review bot' > 'used Claude for code review'.\n\nLead with outcome, end with stack: 'shipped X, saved Y, using Claude + MCP + LangGraph'.\n\nShowcase an artifact: GitHub link, demo video, blog. Artifact > bullet.\n\nVocab signals (use correctly): MCP, evals, RAG, prompt caching, LLM-as-judge, distillation, function calling, structured output, agentic, guardrails.\n\nNarrate the loop INCLUDING failures: 'asked X, got Y, refined to W' shows you DRIVE the model."},

{id:24, category:"Showcasing AI Skills", icon:"🌐", front:"OSS Contributions = Strongest Signal",
back:"Highest-credibility proof of agentic AI depth — easier than people think.\n\nSweet-spot repos:\n• modelcontextprotocol/servers (MCP server collection)\n• promptfoo / langsmith examples (evals)\n• LangGraph, OpenAI Agents SDK, Pydantic-AI (frameworks)\n• provider SDKs\n\nHigh-signal contribs: new MCP server, non-trivial eval, docs PR fixing real ambiguity, reproducible bug + fix.\n\nStart YOUR OWN: 'awesome-prompts-for-X', small library for a real pain. Compound visibility.\n\nOne merged PR > 10 forks."},

// ===== Quick-fire =====
{id:25, category:"Quick-fire", icon:"⚙️", front:"Tool Use vs MCP — when each",
back:"TOOL USE: in-process function calling for THIS agent. Tightly coupled. Tools defined in same codebase as agent.\n\nMCP: out-of-process protocol. ANY MCP-compatible client can use your tools. Decoupled. OAuth + transport built in.\n\nRule of thumb:\n• 1 agent + ≤5 internal tools → plain tool use\n• Tools shared across agents / IDE clients / Claude Desktop → MCP server\n• Wrapping a 3rd-party API for org-wide reuse → MCP"},

{id:26, category:"Quick-fire", icon:"💸", front:"3 Cost Levers Ranked",
back:"1. Prompt caching — 60-90% cut on stable prefixes (free, just reorder prompts).\n2. Model routing — cheap router/triage → strong only when needed. 3-10× cut.\n3. Distillation — teacher model labels → fine-tune small student. 100× at ~95% quality.\n\nDon't optimize before measuring. Build the $/operation dashboard FIRST."},

{id:27, category:"Quick-fire", icon:"🧭", front:"When NOT to use an Agent",
back:"Single LLM call beats an agent loop when:\n• Task is single-step (classification, extraction, summarization)\n• Latency budget < 2s\n• Output is deterministic (use a tool / script directly)\n• User wants a button, not a chat\n\nAgents earn their cost when:\n• Multi-step + decisions depend on intermediate results\n• Tool surface is non-trivial\n• Replanning on failure is needed\n\n'Just a workflow' is often the right answer."},

{id:28, category:"Quick-fire", icon:"📊", front:"Eval Triad",
back:"3 things to measure for any LLM feature:\n\n1. QUALITY — golden-set scores (rubric / pairwise / unit)\n2. COST — $/request, p50/p95\n3. LATENCY — TTFT + total, p50/p95\n\nCommit ONE composite score to CI (e.g. quality > X AND cost < Y AND p95 < Z) so prompt changes auto-block on regression.\n\nWithout the triad in CI, you're shipping vibes."},

{id:29, category:"Quick-fire", icon:"🎯", front:"5-Step Daily AI Loop",
back:"For any non-trivial change:\n\n1. SPEC: collaborate with AI on a 1-page spec → commit to docs/specs/\n2. TESTS: AI proposes test list → review → write tests\n3. CODE: AI generates impl against tests → iterate green\n4. REVIEW: AI self-review the diff → fix easy stuff → human review\n5. DOCS: AI drafts PR description / ADR / runbook updates from the diff\n\nThis loop is what separates 'uses AI' from 'AI-fluent engineer'."},

{id:30, category:"Quick-fire", icon:"🚨", front:"Red Flags Hiring Managers Watch For",
back:"• 'I use ChatGPT' on resume with no specifics → reads like 'I use Google'\n• Talks about models with no engineering scaffolding (no evals, no observability, no cost numbers)\n• Names a model wrong or claims tools they clearly haven't used\n• Can't describe a failure mode of any AI workflow they describe\n• Treats prompts as throwaway, not versioned artifacts\n• Builds 'AI assistants' with no usage metrics\n\nDemonstrate engineering DISCIPLINE around AI, not just enthusiasm."},

];
