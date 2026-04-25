const changelog = [
    {
        version: "1.8.0",
        date: "2026-04-27",
        title: "AI for Devs — Agentic AI Skills for Engineers",
        changes: [
            { type: "feature", text: "New ✨ AI for Devs section — a 4th global tab curating 24 agentic-AI skill entries that employers actually look for in 2026, across 5 tracks: Prompting Mastery, Agent Architecture (Tool Use, ReAct/Reflexion, MCP, Memory, Guardrails), AI-Augmented Workflow (spec-driven dev, code review, test gen, refactoring, knowledge capture), Production AI Systems (RAG, Evals, Observability, Cost/Latency, Privacy & Compliance), and Showcasing AI Skills (internal tools, productivity stack, resume/interview, OSS contributions)" },
            { type: "feature", text: "Each entry includes an employer-perspective 'How to Showcase This' 🎤 section listing concrete artifacts (PRs, dashboards, talks, demos) that prove the skill — not just theory" },
            { type: "feature", text: "30 new agentic-AI flashcards in a dedicated deck (amber → pink → violet accent) covering prompting, agent architecture, AI-augmented workflow, production AI systems, showcasing skills, plus 6 quick-fire cards (Tool-Use vs MCP, the 3 cost levers, when NOT to use an agent, the eval triad, the 5-step daily AI loop, hiring-manager red flags)" },
            { type: "feature", text: "Track filter pills, sidebar search, grouped sidebar list, and #devskills-N hash deep links — same UX as the other tabs" },
            { type: "improved", text: "Home tab counts now show 4 sections at a glance (160 algos / 20 basics / 10 AI/ML / 24 dev skills)" },
        ]
    },
    {
        version: "1.7.0",
        date: "2026-04-25",
        title: "AI / ML Basics + Home UX Polish",
        changes: [
            { type: "feature", text: "New 📚 AI / ML Basics section with 20 bite-sized concept refreshers across Math & Stats, Classical ML, Deep Learning, NLP & LLMs, Recommenders & Ranking, and MLOps & Production — each with key concepts, formulas, when-to-use, common pitfalls, related concepts, and interview practice questions" },
            { type: "feature", text: "Track filter pills on the basics section to quickly drill into a single area (Math & Stats, Classical ML, etc.)" },
            { type: "feature", text: "Deep links to AI/ML basics via #basics-N hash routing" },
            { type: "improved", text: "Home page UX overhaul: wider container (1180px), polished pattern cards with icon chips and hover accent bars, decorative gradient pill above each section divider" },
            { type: "improved", text: "Flat AI/ML system-design grid with category chips on each tile (no more ragged rows from per-category sub-sections)" },
            { type: "improved", text: "Pill-shaped, more compact flashcard CTA buttons" },
            { type: "improved", text: "Better tablet (4-col patterns / 2-col AI/ML) and mobile (2×2 CTA grid) breakpoints" },
        ]
    },
    {
        version: "1.6.0",
        date: "2026-04-26",
        title: "AI / ML System Design Track",
        changes: [
            { type: "feature", text: "New 🤖 AI / ML System Design section on the home page (separate from algorithms and design patterns) with 10 detailed ML interview problems: Harmful Content Detection, Bot/Fake Account Detection, Video Recommendation, News Feed Ranking, Ad CTR Prediction, Search Ranking (LTR), Visual Similarity / Image Search, Personalized Notification Ranking, Friend Recommendation (PYMK), and Speech Recognition / Translation" },
            { type: "feature", text: "Each AI/ML problem follows a full ML system-design framework: clarifying questions, functional & non-functional requirements, offline & online metrics, data & labels, features, model choice, training pipeline, evaluation strategy, serving architecture, scaling, monitoring, risks, and follow-up questions" },
            { type: "feature", text: "26 new AI/ML interview flash cards across Fundamentals, Evaluation, Features, Models, NLP/LLM, Recommender Systems, MLOps, Responsible AI, and Production" },
            { type: "feature", text: "New AI/ML flash card mode with magenta/orange accent — accessible from a dedicated CTA button or the 4th tab in the flash card view" },
            { type: "improved", text: "Hash routing extended to support deep links to AI/ML problems via #aiml-N" },
        ]
    },
    {
        version: "1.5.0",
        date: "2026-04-25",
        title: "More Design Problems & OOP Pattern Cards",
        changes: [
            { type: "feature", text: "10 new Design problems (151–160) covering more design patterns: separate-chaining hash table, browser-history cursor, composite hashmaps, bucketed hit counter, object pool, deque + mirrored set, lazy TTL, hashmap + sorted multiset, ring buffer, leaderboard ranking" },
            { type: "feature", text: "10 new System Design flash cards (31–40) on classic OOP patterns (Singleton, Builder, Factory, Observer, Strategy, Decorator, Adapter) plus Circuit Breaker, Distributed Locks, Indexing, Service Discovery, and Distributed Job Scheduler" },
            { type: "fixed", text: "Removed 4 duplicate problems and replaced them with fresh ones: LC 778 Swim in Rising Water (minimax-path Dijkstra), LC 1335 Minimum Difficulty of a Job Schedule (partition DP), LC 214 Shortest Palindrome (KMP), LC 855 Exam Room (sorted set of occupied positions)" },
            { type: "improved", text: "Switched code editor font to JetBrains Mono with ligatures disabled for clearer operator rendering" },
            { type: "improved", text: "Refined dark-theme syntax highlighting with a Night Owl–inspired palette" },
            { type: "improved", text: "Fixed Key Insight callout colors in dark mode" },
            { type: "removed", text: "Removed the unused 'Mark as Complete' button from problem detail view" },
        ]
    },
    {
        version: "1.4.1",
        date: "2026-04-18",
        title: "Cross-Device Focus Mode Fixes",
        changes: [
            { type: "fixed", text: "Focus Mode now works on iPhone Safari, iPad, Android Chrome, and Samsung Browser" },
            { type: "fixed", text: "Proper viewport height using visualViewport API — no more cards hidden behind URL bars" },
            { type: "fixed", text: "iPhone notch and Dynamic Island safe area padding for controls" },
            { type: "improved", text: "Auto-resize on orientation change and virtual keyboard appearance" },
            { type: "improved", text: "Tablet-optimized layout for iPad and Android tablets (769–1024px)" },
        ]
    },
    {
        version: "1.4.0",
        date: "2026-04-18",
        title: "Focus Mode & Changelog",
        changes: [
            { type: "feature", text: "Fullscreen Focus Mode — scroll through flash cards like YouTube Shorts with vertical snap-scroll" },
            { type: "feature", text: "Changelog page accessible from welcome screen to track all updates" },
            { type: "feature", text: "Arrow Up/Down keyboard navigation and Escape to exit Focus Mode" },
            { type: "improved", text: "Focus Mode syncs with regular flashcard view — resume where you left off" },
            { type: "improved", text: "Side navigation arrows and progress bar overlay in fullscreen" },
        ]
    },
    {
        version: "1.3.0",
        date: "2026-04-18",
        title: "Dark Theme & Visual Polish",
        changes: [
            { type: "feature", text: "Added Tomorrow Night Blue dark theme with full Solarized-style syntax highlighting" },
            { type: "feature", text: "Theme toggle button in sidebar and mobile topbar — persists across sessions" },
            { type: "improved", text: "Flashcard UI revamp: accent bar, slide animations, icon badges, gradient progress bar" },
            { type: "improved", text: "Polished CTA buttons with hover shimmer, press feedback, and colored glow shadows" },
            { type: "improved", text: "Keyboard arrow keys now navigate flashcards when in flashcard view" },
            { type: "improved", text: "Added keyboard hint footer for flashcard navigation" },
        ]
    },
    {
        version: "1.2.0",
        date: "2026-04-18",
        title: "System Design Flash Cards",
        changes: [
            { type: "feature", text: "Added 30 system design flash cards covering fundamentals, caching, databases, messaging, APIs, microservices, and common design problems" },
            { type: "feature", text: "Three flashcard modes: Patterns, Problems, and Design — switchable via tabs" },
            { type: "improved", text: "Mode tabs in flashcard header for quick switching between decks" },
        ]
    },
    {
        version: "1.1.0",
        date: "2026-04-18",
        title: "Flash Cards for Quick Revision",
        changes: [
            { type: "feature", text: "Pattern flash cards — 24 concise cards covering every algorithm pattern" },
            { type: "feature", text: "Problem flash cards — one card per LeetCode problem with key insight and approach" },
            { type: "feature", text: "Category filters, shuffle mode, and swipe navigation on mobile" },
            { type: "improved", text: "Responsive flashcard UI optimized for mobile, tablet, and desktop" },
        ]
    },
    {
        version: "1.0.0",
        date: "2026-04-17",
        title: "Initial Release",
        changes: [
            { type: "feature", text: "150 curated LeetCode problems organized by 19 algorithm patterns" },
            { type: "feature", text: "Step-by-step analytical thinking process for each problem" },
            { type: "feature", text: "Python and C++ solutions with syntax highlighting" },
            { type: "feature", text: "Progress tracking with local storage persistence" },
            { type: "feature", text: "Responsive sidebar with search, category, and difficulty filters" },
            { type: "feature", text: "Mobile-friendly layout with hamburger menu and swipe support" },
        ]
    },
];
