// AI / ML System Design interview problems
// Schema: each problem has framing, metrics, data, features, model, training, eval, serving, scaling, monitoring, risks, follow-ups.
const aiMlProblems = [
{
    id: 1,
    icon: "🛡️",
    title: "Harmful Content Detection",
    category: "Trust & Safety",
    difficulty: "Hard",
    summary: "Design an ML system that detects harmful posts (hate speech, violence, sexual content, self-harm, spam) across text, images, and video on a social platform.",
    clarifyingQuestions: [
        "What modalities are in scope — text only, or also images / video / audio?",
        "Is this real-time (block before publish) or async (review after publish)? What latency budget?",
        "Are we returning a single binary label, multi-label policy categories, or a severity score?",
        "Is there a human review loop (e.g., for borderline cases)? What's the SLA for human review?",
        "What languages and locales must we support at launch?",
        "What's the upstream traffic volume (posts/sec) and the cost budget per inference?",
        "Are there regulatory requirements (DSA, COPPA, GDPR right-to-explanation)?"
    ],
    requirements: {
        functional: [
            "Classify each post into a set of policy categories (multi-label) with a confidence score.",
            "Return one of {allow, demote, soft-block (warning interstitial), hard-block, send-to-human-review}.",
            "Provide an explanation/rationale for moderator dashboards (which signals fired).",
            "Support appeals: allow re-classification with a different model snapshot."
        ],
        nonFunctional: [
            "Real-time path: p99 latency < 200 ms for text, < 1 s for images.",
            "Throughput: tens of thousands of posts/sec at peak.",
            "Recall on the most severe categories (CSAM, terrorism) must be near 100% — false negatives are catastrophic.",
            "Privacy: cannot persist raw user content beyond what policy allows."
        ]
    },
    metrics: {
        offline: [
            "Per-class precision / recall / PR-AUC (NOT plain accuracy — classes are highly imbalanced).",
            "Recall@high-precision (e.g., recall when precision >= 90%) — we tune thresholds per category by harm severity.",
            "Calibration error (ECE) — downstream actions depend on probability, not just rank.",
            "Slice metrics: by language, country, age cohort, content modality — to catch fairness gaps."
        ],
        online: [
            "Prevalence: % of impressions that contain harmful content (north-star — should trend down).",
            "Action rate (block / demote / review) and downstream user reports per 1k impressions.",
            "False-positive rate via human audit of a sampled stream of blocked content.",
            "Appeal overturn rate (how often blocked content is restored) — proxy for FP."
        ]
    },
    dataAndLabels: "Sources: (1) historical user reports, (2) human-moderator decisions on a sampled queue, (3) keyword/regex pre-filter hits used as weak labels, (4) targeted red-team / adversarial sets, (5) public datasets (Jigsaw, Hateful Memes, etc.). Labels are noisy: arbitrate via multiple raters with Cohen's κ ≥ 0.7, and use Snorkel-style label models. Build a perpetually growing eval set per language/policy area, frozen and never trained on.",
    features: [
        "Text: subword tokens (e.g., BPE), language ID, sentiment, named entities, profanity lexicon hits, URL reputation, embedding from a multilingual encoder (XLM-R or LaBSE).",
        "Image: CNN/ViT embedding, OCR text, NSFW classifier output, image hash for known-bad matches (PhotoDNA / PDQ).",
        "Video: frame-sampled image features + audio embedding (YAMNet/Whisper) + transcript text features.",
        "Author signals: account age, prior strikes, posting velocity, network reputation (carefully — fairness risk).",
        "Context: thread the post is in, audience demographics, time-of-day, platform surface."
    ],
    modelChoice: "Multi-task multi-label classifier with a shared backbone per modality and per-policy heads. Text: fine-tuned multilingual transformer (XLM-R base for latency, large for offline review). Image: ViT or EfficientNet fine-tuned. Multimodal posts: late-fusion of modality embeddings into a small MLP over per-policy heads. For ultra-high-volume cheap pre-filter: distilled student model (TinyBERT-class) running first; expensive teacher only on uncertain cases (cascaded inference).",
    trainingPipeline: "Daily fine-tune on a sliding window (last N days) + a curated 'evergreen' set. Class-imbalanced sampling: oversample rare positives, use focal loss. Weak-label denoising via Snorkel. Hard-negative mining from FN of the previous model. Continuous adversarial set updated by red team. All training jobs versioned in a model registry (MLflow / Vertex AI Model Registry).",
    evaluation: "Tiered eval: (1) frozen golden set per language/policy, (2) shadow mode on production traffic comparing to current champion, (3) human-rater audit of a stratified sample of new model's decisions before promotion. Promote only if (a) recall stays ≥ champion at the same precision, (b) no fairness regression on slices, (c) no spike in appeal overturns in shadow.",
    serving: "Two-tier: (1) lightweight rule + hash + tiny-model pre-filter at the edge (sub-50ms) handles 95% of clear cases. (2) Heavy multimodal model on GPU clusters for the remaining 5%, batched (dynamic batching, ~30ms window). Async path for video / long-form: enqueue to Kafka, workers process, write decisions back. Decisions cached by content hash so re-shares don't re-score.",
    scaling: "Horizontal: stateless inference servers behind L7 LB. GPU autoscaling on queue depth + p95 latency. Per-region deployment for data-residency compliance. Model size budget: keep p99 < SLA → use distillation, quantization (INT8), and Triton's dynamic batching. Caching: content-hash → decision (TTL = model version lifetime). Throttle / shed load on the heavy tier; fall back to pre-filter-only mode under brownout.",
    monitoring: "Track input drift (KL of feature distributions vs training), per-class score distribution shift, per-language latency, GPU utilization, queue depth. Alert on: action rate spikes/drops > X σ, calibration drift, sudden FP rate from auditor pool. Auto-rollback if shadow vs prod disagrees beyond a tolerance band.",
    risks: [
        "Adversarial evasion: bad actors leetspeak / cloak text / use image-of-text. Mitigate: OCR, character-level augmentation in training.",
        "Bias: dialect / AAVE flagged at higher rates than Standard English. Mitigate: balanced sampling, fairness slicing in eval, threshold-per-group only with care.",
        "Model staleness: novel slurs and memes appear daily. Mitigate: continuous training + human-in-the-loop labeling pipeline.",
        "Privacy: minimize raw content retention; use on-device inference where possible for sensitive surfaces (DMs).",
        "Over-blocking → user trust loss. Mitigate: severity-tiered actions, easy appeal, transparency report."
    ],
    followups: [
        "How would you handle a brand-new policy area (no labeled data)? Few-shot prompting an LLM + active learning loop.",
        "Cost optimization: how does cascaded inference change if pre-filter recall drops to 70%?",
        "How would you defend against coordinated attacks (1000s of accounts posting similar content)?",
        "Multi-language scale: do you train one big multilingual model or per-language models?"
    ]
},
{
    id: 2,
    icon: "🤖",
    title: "Bot / Fake Account Detection",
    category: "Trust & Safety",
    difficulty: "Hard",
    summary: "Identify automated / inauthentic accounts on a social network at signup time and continuously thereafter — to block fake-engagement farms, spam, scams, and astroturfing.",
    clarifyingQuestions: [
        "Are we scoring at signup (block account creation) or post-signup (limit reach / suspend)?",
        "Definition of 'bot' — pure automation, paid human farms, compromised real accounts? These have different signals.",
        "Latency for the signup gate vs the offline batch job?",
        "False-positive cost (real users locked out) vs false-negative cost (bots persist)?",
        "Do we have access to graph-level features in real time, or only offline?"
    ],
    requirements: {
        functional: [
            "Signup-time risk score (0–1) + action: {allow, friction (CAPTCHA, SMS), deny}.",
            "Continuous account-level risk update from behavioral signals.",
            "Coordinated-cluster detection: flag groups of accounts acting in concert."
        ],
        nonFunctional: [
            "Signup p99 < 300 ms; cannot add visible friction for legitimate users.",
            "Offline graph job runs daily, must process billions of edges within hours.",
            "Heavy class imbalance: bots are ~1–5% of accounts but 40%+ of bad activity."
        ]
    },
    metrics: {
        offline: [
            "Precision / recall on a labeled set of confirmed bots (from manual investigation, CAPTCHA-fail rate, payment-chargeback signal).",
            "PR-AUC and recall@high-precision (e.g., recall at FP-rate = 0.1%).",
            "Cluster purity: when we flag a coordinated network, what fraction of members are actually inauthentic?"
        ],
        online: [
            "% of new signups challenged / denied; trend of bot-attributable spam reports.",
            "Engagement-quality metric (likes-from-real-users) on flagged-vs-clean accounts.",
            "User-reported friction complaints (proxy for false positives)."
        ]
    },
    dataAndLabels: "Positive labels: accounts that (a) failed CAPTCHA / phone-verification repeatedly, (b) had payment chargebacks, (c) were caught in past sweeps, (d) reported by trusted users en masse. Negative labels: long-tenured accounts with diverse organic engagement. Beware survivorship bias — labels are biased toward bots that already triggered something.",
    features: [
        "Signup-time: IP reputation (Spur / IPQualityScore), email domain age + provider, device fingerprint, browser/OS coherence, signup velocity per IP/ASN, time-of-day, name plausibility (LLM-scored).",
        "Behavioral (post-signup): inter-action time distribution (bots are too regular), session length, ratio of follows to followers, content originality (cosine sim to existing posts), API vs UI call ratio.",
        "Graph: PageRank-like trust propagation from known-good seeds, coordination detection (shared device fingerprints, near-simultaneous follows of same target), community embeddings (Node2Vec / GraphSAGE).",
        "Content: post embedding diversity over time, presence of templated text, link-domain distributions."
    ],
    modelChoice: "Two-model architecture: (1) Real-time signup gate: gradient-boosted trees (XGBoost / LightGBM) on tabular signup features — fast, interpretable, easy to update. (2) Offline coordinated-cluster detection: Graph Neural Network (GraphSAGE or RGCN) over the user-action-target graph, run nightly to surface dense inauthentic subgraphs. (3) Per-account behavioral classifier: GBDT on streaming aggregates updated every few minutes via Flink/Kafka Streams.",
    trainingPipeline: "GBDT models retrained daily on rolling window. GNN retrained weekly with negative sampling on the bipartite user-target graph. Hard-negative mining: false negatives from past week prioritized. Counterfactual eval: hold out a slice of suspected bots, don't act on them, compare downstream activity.",
    evaluation: "Precision verified by sending a random sample of flagged accounts to manual investigators. Recall estimated via 'planted bots' (purchased from gray-market panels with known signatures) injected into traffic to see how many we catch. Lift over rule-based baseline.",
    serving: "Signup model: in-process within the auth service (sub-50ms), feature lookup from a low-latency feature store (Redis / Feast). Behavioral model: triggered by streaming aggregates; writes risk score to user profile, read by ranking / messaging services. Graph model: batch outputs persisted; downstream services read from a key-value store.",
    scaling: "Feature store needs to handle hundreds of thousands of QPS at signup peaks. GNN training distributed over multiple GPUs (DGL or PyG); use neighborhood sampling to fit billions of nodes. Coordinated-cluster output is small (hundreds of flagged clusters/day) — cheap to act on.",
    monitoring: "Track signup conversion rate (drop = false positives hurting onboarding), CAPTCHA pass rate of challenged users, distribution of risk scores over time, IP-ASN diversity of signups (sudden concentration = attack), proportion of new accounts auto-challenged.",
    risks: [
        "Adversarial adaptation: attackers test our gate, adjust device fingerprints. Mitigate: don't expose deterministic 'why blocked' messages; rotate features; keep some signals in offline-only model.",
        "Demographic bias: certain countries / mobile carriers look bot-like. Mitigate: per-segment thresholds, fairness audit.",
        "Real-user lockout: legitimate users on shared IPs (corporate VPN, dorm WiFi) get high risk. Mitigate: progressive friction (CAPTCHA before deny), generous appeal flow.",
        "Concept drift: bot tactics shift weekly; without continuous labels the model stales fast."
    ],
    followups: [
        "How would you detect 'sleeper' bots that act normally for 90 days then activate?",
        "How do you handle compromised real accounts vs purpose-built bots? Different model? Different action?",
        "Can we use LLMs to classify whether a post was AI-generated as one feature?",
        "How would you measure recall when you can never know the true bot population?"
    ]
},
{
    id: 3,
    icon: "🎬",
    title: "Video Recommendation System",
    category: "Recommender Systems",
    difficulty: "Hard",
    summary: "Design YouTube/TikTok-style video recommendations: given a user, return a personalized ranked list of videos to watch next.",
    clarifyingQuestions: [
        "Surface: home feed, watch-next, search results, or short-form vertical feed? Each has different objectives.",
        "Optimization target: watch-time, completion rate, daily-active-users, ad revenue, long-term satisfaction?",
        "Catalog size and freshness: do we recommend brand-new videos uploaded minutes ago?",
        "Cold-start expectations for new users (no history) and new videos (no engagement)?",
        "What's the latency budget end-to-end (user opens app → feed renders)?"
    ],
    requirements: {
        functional: [
            "Return K (e.g., 20) ranked video IDs for a given (user, context) request.",
            "Diversity & novelty constraints — avoid showing the same channel too often, surface fresh content.",
            "Filter ineligible items (already-watched, blocked creators, age-gated)."
        ],
        nonFunctional: [
            "p99 latency < 200 ms end-to-end.",
            "Serve hundreds of thousands of QPS.",
            "Catalog of billions of items; user history of thousands of events."
        ]
    },
    metrics: {
        offline: [
            "Recall@K and NDCG@K on held-out next-watch labels.",
            "Hit-rate@K for watch-completed videos.",
            "Coverage (fraction of catalog ever recommended), Gini coefficient (popularity bias).",
            "Calibration of predicted watch-time vs actual."
        ],
        online: [
            "Daily/Weekly Active Users, sessions per user, total watch-time.",
            "% of impressions that lead to a >30s view (engagement quality).",
            "Long-term retention (D7, D30) — guard against short-term-engagement-only models that hurt retention.",
            "Survey-based satisfaction (was this a good recommendation?) on a sampled cohort."
        ]
    },
    dataAndLabels: "Implicit feedback: views, watch-time, likes, shares, skips, dislikes, save-to-playlist. Negative samples: videos shown but not clicked (impressions without engagement). Beware position bias — position 1 always gets clicked more; correct via inverse-propensity-scoring or model the position as a feature only at training time.",
    features: [
        "User: demographic (where allowed), recent watch history (last 50 videos as embeddings), aggregated watch-time per topic/channel, language pref, device, time-of-day, day-of-week.",
        "Video: content embedding (audio + visual + transcript via multimodal encoder), topic tags, language, duration, age (recency), creator embedding, historical CTR / completion rate.",
        "Context: query (if any), surface, prior video watched in session, device.",
        "Cross features: user-creator past affinity, user-topic affinity, user-language match."
    ],
    modelChoice: "Classic two-stage architecture. Stage 1 — Candidate generation: Two-tower neural network (user tower + item tower) trained with sampled-softmax (in-batch negatives + popularity-corrected). At serve time, embed the user and ANN-search (HNSW / ScaNN / Faiss) for top ~1000 candidates from billions of items in <30ms. Stage 2 — Ranking: Multi-task DNN (DLRM, DCN, or wide-and-deep) that jointly predicts {click, completion, like, share, dwell-time, satisfaction-survey} for each (user, candidate) pair. Final score = weighted sum of heads; weights tuned to north-star metric. Add a re-ranking layer for diversity (DPP / MMR) and business rules.",
    trainingPipeline: "Two-tower retrained daily on the last 30 days of impressions. Ranker retrained every few hours on streaming logs (Kafka → training pipeline). Cold-start tower: also include content features so brand-new items get a meaningful embedding from day 0. Negative sampling strategies: in-batch + sampled popular + hard negatives (high-CTR items the user did NOT click).",
    evaluation: "Offline: recall@K of the retrieval tower, AUC and per-objective calibration of the ranker. But offline metrics are weakly correlated with online — every change runs a multi-week A/B test on a small slice (1–5%) measuring DAU, watch-time, AND retention guardrails. Counterfactual replay using IPS for quick directional checks before A/B.",
    serving: "Per-request flow: user feature lookup (Redis / online feature store, <10ms) → user-tower embedding (cached if user features unchanged, ~5ms) → ANN search (~20ms) → ranker scoring of 1000 candidates batched on GPU (~50ms) → diversity re-rank + business rules (~10ms). Item embeddings precomputed nightly + delta-updated for new uploads. Serve K=20 final results.",
    scaling: "Item embedding index: sharded by ID; each shard has its own ANN graph. User tower runs per-request — keep the model small (≤ few-million params) for latency. Ranker can be larger; use GPU inference with batching. Fan-out reduction: cache candidate sets per user-context for repeat requests within seconds.",
    monitoring: "Engagement KPIs (watch-time, completions) per cohort, candidate-set diversity (entropy of source channels), prediction calibration drift, p99 latency per stage, freshness of new uploads in serving (max age of items entering the index), creator-side fairness (long-tail creator impressions).",
    risks: [
        "Filter bubble / echo chamber: exploit-only feedback loops narrow user interests. Mitigate: explicit exploration (ε-greedy, Thompson sampling) and 'diversity' head in re-ranker.",
        "Engagement-bait loop: optimizing watch-time can favor outrage / clickbait. Mitigate: include satisfaction-survey signal in multi-task loss with positive weight.",
        "Position / selection bias in training data. Mitigate: IPS or propensity-weighted training.",
        "Cold-start for new creators starves them of impressions. Mitigate: explicit exploration budget for new content.",
        "Privacy: never train on inferred sensitive attributes; honor user opt-outs in feature pipeline."
    ],
    followups: [
        "How would you incorporate a 'why am I seeing this?' explanation feature?",
        "Bandits vs supervised — when to switch retrieval to a contextual bandit?",
        "How to handle live / breaking content with no historical engagement?",
        "How would you migrate from a 30-day batch retrain to a streaming retrain?"
    ]
},
{
    id: 4,
    icon: "📰",
    title: "News Feed Ranking",
    category: "Recommender Systems",
    difficulty: "Hard",
    summary: "Rank items in a personalized social-network feed (posts from friends/pages) to maximize meaningful interactions while respecting integrity and diversity constraints.",
    clarifyingQuestions: [
        "Is the candidate set bounded (only friends + followed pages) or unbounded (any post on the platform)?",
        "What objective: time-spent, clicks, comments, 'meaningful interactions' (long-form replies)?",
        "Are there hard constraints (no more than K posts from same author, integrity demotions)?",
        "Refresh model: pull on every open, or precomputed and cached?"
    ],
    requirements: {
        functional: [
            "For each user request, return an ordered list of N posts.",
            "Incorporate per-user preference, recency, and post-type diversity (text/photo/video/link).",
            "Apply integrity demotions (misinfo, low-quality, harmful)."
        ],
        nonFunctional: [
            "p99 < 200 ms.",
            "Candidate set per user can be tens of thousands; ranked set is ~25 visible.",
            "Ranking model retrained daily; integrity signals updated continuously."
        ]
    },
    metrics: {
        offline: [
            "AUC and calibration per action head (click, like, comment, share, hide, report, time-spent).",
            "NDCG@N on held-out interactions.",
            "Counterfactual lift estimate via IPS replay."
        ],
        online: [
            "Meaningful interaction rate (long comments, shares with text), sessions per user, hides per impression.",
            "User-reported satisfaction surveys on a sampled cohort.",
            "Integrity KPIs: prevalence of misinfo / borderline content in feed.",
            "Long-term retention guardrails."
        ]
    },
    dataAndLabels: "Logged impressions with per-action outcomes. Negative sampling from impressions-with-no-action. Use 'survey-as-ground-truth' to avoid optimizing only proxy clicks.",
    features: [
        "User: long-term affinity vectors with topics/authors, recent session behavior, dwell-time history, demographic, device.",
        "Post (item): author, age, type, embedding of text/image, engagement velocity (likes/min in last 30min), integrity scores.",
        "Edge (user, author): friendship strength (interaction history), mutual friends count, recency of last interaction.",
        "Context: time-of-day, surface, network condition (lighter content on slow networks)."
    ],
    modelChoice: "Multi-task DNN (DCN-V2 or DLRM) predicting per-action probabilities. Final ranking score = Σ wᵢ · pᵢ where weights wᵢ encode the objective (e.g., higher weight on 'meaningful comment' than 'click'). For candidate generation: hybrid of (a) social-graph candidates (friends/followed), (b) two-tower retrieval for unconnected-but-relevant content. Diversity / integrity rules applied as a post-hoc re-ranker.",
    trainingPipeline: "Train daily on last N days of impressions; use sample weights to upweight surveyed sessions. Hard-negative mining: high-score predictions that the user actually hid or reported. Continuously refresh integrity-related features.",
    evaluation: "Offline AUC + NDCG; online A/B with multiple guardrails (integrity, diversity, retention). Long holdouts (4+ weeks) before promotion to catch retention regressions.",
    serving: "Two-stage pipeline: candidate generation (~few thousand) → feature hydration via online store → ranker → diversity rules → return top N. Per-user feature vectors precomputed and cached; per-post features hot-cached for trending content.",
    scaling: "Ranker is the latency bottleneck; quantize and batch on GPU. Edge features (friendship strength) precomputed nightly. For very-active users with huge candidate sets, sample candidates with importance weighting.",
    monitoring: "Per-action calibration drift, feature freshness lag, action-rate per cohort, share of feed by post type / author cluster, integrity prevalence.",
    risks: [
        "Engagement-bait optimization → dissatisfaction. Mitigate: include negative-action heads (hide/report) with strong negative weights.",
        "Author-side fairness: small creators starved. Mitigate: explore budget, fairness constraints.",
        "Misinfo amplification: viral velocity = strong signal. Mitigate: integrity demotion before ranker."
    ],
    followups: [
        "How to handle 'sparse user' (returning user, no recent activity)?",
        "How would you A/B test a change that takes 30+ days to show retention impact?",
        "Where does an LLM fit (e.g., for summarization or for re-ranking with reasoning)?"
    ]
},
{
    id: 5,
    icon: "💸",
    title: "Ad Click-Through-Rate Prediction",
    category: "Ads / CTR",
    difficulty: "Hard",
    summary: "Predict the probability a user clicks (and converts) on a given ad in a given context — used by the auction to compute expected revenue and rank ads.",
    clarifyingQuestions: [
        "Are we predicting CTR only, or pCTR × pConversion × value?",
        "Auction format: GSP, second-price, VCG? Pricing depends on calibration accuracy.",
        "Latency budget per request? (typically <50 ms for the entire auction).",
        "What's the policy on personalization features (GDPR / opted-out users)?"
    ],
    requirements: {
        functional: [
            "Return a calibrated probability for each (user, ad, context) candidate.",
            "Support thousands of candidates per auction.",
            "Handle cold-start ads (just launched, no clicks yet)."
        ],
        nonFunctional: [
            "p99 latency: ad model contributes < 30 ms within an overall <100 ms auction.",
            "Calibration: predicted pCTR within ±5% of actual on every traffic slice (otherwise auctions misallocate)."
        ]
    },
    metrics: {
        offline: [
            "AUC, log-loss (proper scoring rule, calibration-sensitive).",
            "Calibration plots and Expected Calibration Error.",
            "Slice metrics: by advertiser size, ad age (cold-start), country, surface."
        ],
        online: [
            "Revenue per mille (RPM), advertiser ROI / conversion rate.",
            "Click yield, fill rate, ad CTR.",
            "Long-term advertiser retention (model bias against new advertisers can starve them and hurt long-term supply)."
        ]
    },
    dataAndLabels: "Server-side click logs joined with impression logs (positive = click within attribution window, negative = impression without click). Conversion data joined via attribution pipeline (often delayed by hours/days). Beware delayed-feedback: train with importance weighting or a delayed-feedback model.",
    features: [
        "User: demographic, prior ad interactions, browsing topic profile (where allowed by consent), device.",
        "Ad: creative embedding (text + image), advertiser ID, vertical, bid, landing-page features, age of ad, prior CTR.",
        "Context: page URL embedding, surface, time, session position.",
        "Cross: user-vertical affinity, user-advertiser past CTR, hashed cross features (for tabular models)."
    ],
    modelChoice: "Industry-standard architectures: Wide & Deep, DCN-V2, DeepFM, or DLRM — designed for high-cardinality categorical features (billions of unique IDs) via embedding tables. Embedding tables can be hundreds of GBs — sharded across parameter servers. For cold-start ads, lean on creative-content features via a separate sub-tower whose output is added to the ad embedding.",
    trainingPipeline: "Continuous (incremental) online learning is common: model updates every few minutes as new clicks stream in. Negative sampling not usually needed (clicks are rare; full data fits with downsampling negatives + click reweighting to preserve calibration). Watch out for label leakage from delayed conversions.",
    evaluation: "Offline log-loss + calibration is the primary gate, then small online A/B with revenue + advertiser-side metrics + long holdback for advertiser-fairness checks.",
    serving: "Embedding lookups + a small dense MLP. Embedding tables hosted on a distributed parameter store with consistent hashing; lookups batched per request. The dense part runs on CPU per request (very small model). Total inference budget 5–20 ms per candidate; batch within request.",
    scaling: "Embedding store sharded across many machines; replicate hot keys. Daily rebuild + minute-level deltas. For very wide models, use mixed-precision and quantized embeddings.",
    monitoring: "Calibration per slice (most important — miscalibration directly costs revenue), feature-distribution drift, embedding-table memory, model staleness vs latest data tail.",
    risks: [
        "Calibration drift after deploys → auction misallocation, advertiser revenue swings. Always isolation-test on holdout traffic before full ramp.",
        "Cold-start ads under-bid → advertisers churn. Mitigate: exploration budget for new ads, prior over creative-content embedding.",
        "Privacy: signed-out users / opted-out cohorts need a separate, less-personalized model.",
        "Click fraud / invalid traffic skews labels. Mitigate: IVT filter (Google IVT / GIVT) before training."
    ],
    followups: [
        "How would you redesign for Privacy-Sandbox (no third-party cookies)?",
        "How to incorporate post-click conversion signal that arrives 7 days later?",
        "What's the right exploration mechanism — Thompson sampling on the ad embedding?"
    ]
},
{
    id: 6,
    icon: "🔎",
    title: "Search Ranking (Learning-to-Rank)",
    category: "Search / IR",
    difficulty: "Hard",
    summary: "Given a query and a set of candidate documents (retrieved by lexical + semantic methods), rank them so the most relevant appear at the top.",
    clarifyingQuestions: [
        "Domain: web, e-commerce, internal enterprise, marketplace? Each has different relevance signals.",
        "Is this purely relevance, or also diversity, freshness, business rules (sponsored items)?",
        "How is relevance defined — clicks, conversions, human judgments, or a mix?",
        "Multilingual? Personalized? Voice queries (speech-to-text upstream)?"
    ],
    requirements: {
        functional: [
            "For (query, user, context) → ordered top-K from a candidate set of hundreds.",
            "Support typo tolerance, synonyms, and intent classification (navigational / informational / transactional).",
            "Mixing of organic and sponsored results with clear separation."
        ],
        nonFunctional: [
            "p99 < 200 ms end-to-end (retrieval + ranking + rendering).",
            "Index updates within minutes for breaking-news-type queries."
        ]
    },
    metrics: {
        offline: [
            "NDCG@K on human-rated query-doc judgments (gold standard).",
            "MRR, MAP for navigational queries.",
            "Counterfactual lift via IPS on click logs."
        ],
        online: [
            "CTR@K, click position distribution, abandonment rate, query reformulation rate (proxy for unsuccessful searches).",
            "Long-click / dwell-time on landing page (for web search).",
            "Conversion rate (e-commerce / marketplace)."
        ]
    },
    dataAndLabels: "Two label sources: (1) Human raters scoring relevance (Perfect / Excellent / Good / Fair / Bad) on sampled query-doc pairs — expensive but unbiased. (2) Click logs as implicit feedback, debiased via position-bias models (PBM, DBN) or randomized swap experiments. Pairwise/listwise training data assembled from these.",
    features: [
        "Query: tokenized terms, query embedding (BERT/SentenceTransformer), intent class, language, length, freshness intent (e.g., 'today').",
        "Document: title/body embeddings, BM25 score against query, entity matches, freshness, page-quality (PageRank-like), historical CTR for this query.",
        "Query-doc cross: BM25, BERT cross-encoder relevance score (expensive but powerful), coverage of query terms in title.",
        "User context: location, language, prior queries in session, device.",
        "For e-commerce: price, availability, ratings, conversion rate, image embedding similarity to query."
    ],
    modelChoice: "Classic two-stage: (1) Retrieval — lexical (BM25 via Elasticsearch) ∪ dense retrieval (bi-encoder embedding + ANN). (2) Ranking — Gradient-boosted trees (LambdaMART / XGBoost) using listwise loss (LambdaRank) on hundreds of features, OR a neural ranker (e.g., a small cross-encoder transformer scoring each query-doc pair) for top-100 only because of its cost. Often a hybrid: GBDT on cheap features for top-1000, neural cross-encoder for top-50.",
    trainingPipeline: "GBDT retrained daily/weekly on judgment + click data. Position-bias correction via inverse-propensity weighting. Cross-encoder fine-tuned monthly with hard negatives mined from the GBDT's mistakes (high-ranked but no-click).",
    evaluation: "Offline NDCG against human judgments is the gate. Online A/B measures CTR@K, abandonment, and query reformulation. Always run a 'side-by-side' rater study before full launch — show old vs new SERP and ask raters which is better.",
    serving: "Retrieval via Elasticsearch (BM25) + Faiss/Vespa (dense) merged with reciprocal-rank fusion. Ranker scores in <50 ms (GBDT is cheap; cross-encoder needs GPU + small candidate set). Cache popular query results aggressively.",
    scaling: "Index sharded by document hash; each shard runs retrieval in parallel. Ranking is per-request and scales linearly. Cache hit rate is huge for head queries → focus optimization on torso/tail.",
    monitoring: "Rater NDCG on a periodic sampling, online CTR@1 / @5, query-reformulation rate, p99 latency per stage, index freshness lag, drift in query distribution (e.g., trending entities).",
    risks: [
        "Click-bait clutter at top: optimizing CTR alone can degrade quality. Mitigate: dwell-time + rater signal in loss.",
        "Relevance vs business goals tension (sponsored items): keep separate slots, not interleaved organic.",
        "Adversarial SEO: pages farming features to game ranking. Mitigate: anomaly detection, hand-curated trust labels.",
        "Stale index for trending queries → bad UX. Mitigate: separate near-real-time index for fresh content."
    ],
    followups: [
        "When would you use an LLM as a re-ranker (GPT-style)? Cost-benefit at low query volume.",
        "How would you build a multimodal ranker for image + text queries?",
        "Personalization: how to balance personalization vs query intent (high-intent queries shouldn't be over-personalized)?"
    ]
},
{
    id: 7,
    icon: "🖼️",
    title: "Visual Similarity / Image Search",
    category: "Computer Vision / Retrieval",
    difficulty: "Medium",
    summary: "Given a query image (e.g., 'find more like this'), retrieve visually-similar images from a catalog of millions to billions.",
    clarifyingQuestions: [
        "Use case: e-commerce 'shop the look', dedup, reverse image search, or copyright/CSAM matching?",
        "What does 'similar' mean — pixel-level near-duplicate, same object/product, same style, same scene?",
        "Catalog size and update frequency? Latency budget?",
        "Is the query an image, image+text, or just text describing an image (multimodal)?"
    ],
    requirements: {
        functional: [
            "Return top-K visually-similar items for a query image (or image+text).",
            "Support filters (category, color, price range)."
        ],
        nonFunctional: [
            "p99 < 150 ms over a billion-image index.",
            "Recall@10 ≥ X% on a labeled benchmark.",
            "Index updates within hours of new uploads."
        ]
    },
    metrics: {
        offline: [
            "Recall@K and mAP on labeled near-duplicate / same-product sets.",
            "Per-category recall (catch fairness / domain-shift gaps)."
        ],
        online: [
            "CTR on returned items, conversion rate (e-commerce), 'find similar' button engagement."
        ]
    },
    dataAndLabels: "Labeled positives: same-product images (e.g., catalog has multiple photos per SKU), augmentations of the same image (treated as positives in self-supervised training). Hard negatives: visually-similar but different product (mined from initial model's confusions).",
    features: [
        "Pure visual: CNN (ResNet) or ViT embedding, typically 256–1024 dims after a projection head.",
        "Text-aligned: CLIP / SigLIP joint embeddings if text queries needed.",
        "Metadata-augmented: concatenate category one-hot, dominant color histogram, etc., for a hybrid scoring layer."
    ],
    modelChoice: "Self-supervised contrastive learning: SimCLR / MoCo / DINO for pure visual; CLIP for image+text. Fine-tune on domain-specific data with triplet or NT-Xent loss using mined hard negatives. Output: a single L2-normalized embedding per image, similarity = cosine (= dot-product after norm).",
    trainingPipeline: "Pretrain on large-scale image data (ImageNet / LAION). Fine-tune on in-domain (catalog) with augmentations as positives + hard negatives. Periodically re-mine negatives from the latest model. Validate on a frozen labeled benchmark before deploying.",
    evaluation: "Recall@K on benchmark; A/B test CTR/conversion uplift; human-rated 'is this actually similar?' on samples.",
    serving: "Index built via HNSW (Faiss / ScaNN / Vespa) — millisecond-level ANN over 100M+ vectors. Embeddings precomputed and stored in a vector DB. Query path: image → CNN inference (~30 ms on GPU) → ANN lookup (~10 ms) → metadata filter → return top-K.",
    scaling: "Vector index sharded across machines; each shard has a partial HNSW graph. Re-build periodically (HNSW supports incremental insert but degrades with many deletes — periodic full rebuild). Embedding inference batched on GPU. Pre-compute embeddings nightly for all new uploads.",
    monitoring: "Recall@K on a continuously-refreshed eval set, p99 latency, index size and freshness, click-through and conversion lift, percentage of queries with empty / low-confidence results.",
    risks: [
        "Domain shift: model trained on photos but queried with sketches → poor recall. Mitigate: domain-specific fine-tuning, multi-domain training data.",
        "Bias in retrieval: certain skin tones / cultures under-represented in training → poor performance. Audit per-slice recall.",
        "Adversarial perturbations (small noise → totally different embedding) for safety-critical use cases (CSAM matching). Mitigate: perceptual hashing as a complementary signal."
    ],
    followups: [
        "How to extend to video (per-frame embeddings + temporal aggregation)?",
        "Privacy: how to do face-similarity safely for missing-persons but not for surveillance?",
        "How to update the index when the embedding model itself changes (the dreaded re-embed-everything problem)?"
    ]
},
{
    id: 8,
    icon: "🔔",
    title: "Personalized Notification Ranking",
    category: "Recommender Systems",
    difficulty: "Medium",
    summary: "Decide which (and how many) push notifications to send each user — too few → low engagement, too many → uninstall. Goal: maximize long-term engagement, not short-term opens.",
    clarifyingQuestions: [
        "Notification types: friend activity, recommendations, promos, transactional? Each has different sensitivity.",
        "Optimization: opens, return-visits, retention, or 'meaningful sessions'?",
        "Are there delivery-time constraints (no notifications during sleep hours)?",
        "Does the user have explicit preferences we must honor?"
    ],
    requirements: {
        functional: [
            "For each candidate notification, predict probability of {open, mute, uninstall-this-app, return-session-quality}.",
            "Apply per-user frequency caps and quiet hours.",
            "Choose 'send now / send later / drop' decision."
        ],
        nonFunctional: [
            "Decisions made in batches (every few minutes) for non-urgent notifications; real-time for transactional.",
            "Throughput: hundreds of millions of users daily."
        ]
    },
    metrics: {
        offline: [
            "AUC for open / mute / uninstall heads, calibration of each.",
            "Counterfactual estimate of net engagement uplift via IPS."
        ],
        online: [
            "Daily active users, return-session rate per notification sent, notification open rate.",
            "Negative outcomes: mute rate, uninstall rate, app-settings-disable-notifications rate.",
            "Net session uplift from a hold-out group that gets no notifications (causal lift, not just open rate)."
        ]
    },
    dataAndLabels: "Logged sends with outcomes (opened / dismissed / muted / followed by uninstall within X days). Critically: maintain a permanent hold-out cohort that receives ZERO non-transactional notifications — the only way to measure causal lift, not just attribution.",
    features: [
        "User: app-open frequency, time-of-day pattern, prior notification engagement, notification mute history, recent activity in the app.",
        "Notification content: type, source, embedded entity (which friend, which video), age (how stale).",
        "Context: time-of-day for the user, last-notification-sent recency, current notification count today, device timezone."
    ],
    modelChoice: "Multi-task neural network with heads for {open, mute, return-session-quality, uninstall-risk}. Decision rule: send only if expected_session_value(send) − cost(mute_risk + uninstall_risk × LTV) > 0. For order/timing, an uplift model (causal forest or X-learner) trained on the holdout-cohort data is ideal — directly models 'what would this user do if we sent vs didn't'.",
    trainingPipeline: "Daily training on rolling window. Reserve permanent hold-out cohort (e.g., 0.5% of users) — never send them non-essential notifications, use as ground truth for causal training. Heavy class imbalance for uninstalls — focal loss or SMOTE-style upsampling.",
    evaluation: "Offline AUC + lift on the hold-out cohort. Online: incremental DAU / return-sessions vs holdout, NOT just open rate (which can rise while DAU falls if you bombard users).",
    serving: "Batch decisions: every few minutes a job scores all candidate notifications per user, applies frequency caps, and emits send actions to APNs/FCM. Real-time for transactional (e.g., DM received).",
    scaling: "Stateless scoring jobs scaled horizontally; user-feature lookups from a key-value store. Per-user state (last-sent timestamps, today's count) maintained in Redis.",
    monitoring: "Daily uninstall rate, mute rate, opt-out rate, holdout cohort drift, send volume per user, calibration of each prediction head, geographic anomalies (timezone bugs).",
    risks: [
        "Optimizing opens → over-notifying → uninstalls. Mitigate: include uninstall and mute heads with strong negative weights, monitor causal DAU lift.",
        "Habituation: users learn to ignore notifications. Mitigate: contextual bandit on notification copy / format.",
        "Privacy: never reveal sensitive content (e.g., 'message about [topic]') in notifications visible on lock screen.",
        "Delivery channel reliability (APNs/FCM) outside our control — must handle retry + dedup."
    ],
    followups: [
        "How would you A/B test a change with multi-week impact on uninstall rate?",
        "How to balance personalization vs anti-bubbles (don't only ever notify about one topic)?",
        "How to use an LLM for dynamic notification copy generation, with safety guardrails?"
    ]
},
{
    id: 9,
    icon: "👥",
    title: "Friend / Connection Recommendation (PYMK)",
    category: "Graph ML",
    difficulty: "Medium",
    summary: "'People You May Know' — recommend other users to befriend / follow on a social graph of billions of nodes.",
    clarifyingQuestions: [
        "Symmetric (friendship) or asymmetric (follow)?",
        "Optimization target: invitations sent, invitations accepted, long-term active connection?",
        "Cold start: brand-new users with zero friends?",
        "Privacy: contact-import allowed? Off-platform signals?"
    ],
    requirements: {
        functional: [
            "Return ranked list of K candidate users to invite/follow.",
            "Filter blocked, dismissed, and already-connected users.",
            "Handle new users with strong onboarding suggestions."
        ],
        nonFunctional: [
            "Latency p99 < 200 ms.",
            "Per-user candidate set generated daily (offline) + lightly re-ranked online with fresh signals."
        ]
    },
    metrics: {
        offline: [
            "Recall@K on held-out future-friendship edges (link prediction).",
            "AUC for the binary 'will-friend-next-30-days' task."
        ],
        online: [
            "Sent invitations, acceptance rate, mutual-friend-after-30-days rate (quality, not just quantity).",
            "Long-term retention of newly-connected pairs."
        ]
    },
    dataAndLabels: "Positive labels: friendships formed in the next N days. Negative samples: random non-friends + 'shown but not invited' for hard negatives. Important: don't leak future labels into features.",
    features: [
        "Mutual friends count + Adamic-Adar / Jaccard / Resource-Allocation scores.",
        "Embeddings: Node2Vec, GraphSAGE, or PinSage trained on the social graph.",
        "Profile similarity: school, employer, location, interests (with consent).",
        "Behavioral co-occurrence: viewed-each-other's-profile, messaged, tagged in same photos.",
        "Off-platform (with consent): contact-book intersection.",
        "Recency: last-seen-each-other-on-platform, recent interaction velocity."
    ],
    modelChoice: "Two-stage. (1) Candidate generation via friend-of-friend (BFS-2 in graph, capped per user) + GNN-based candidates (GraphSAGE embeddings + ANN search) — both contribute to a candidate pool of ~1000. (2) Ranking via a GBDT or DNN over hand-crafted graph + profile features predicting acceptance probability. For new users with zero edges, fall back to demographic/profile-based recommendations.",
    trainingPipeline: "Graph embeddings retrained weekly (expensive; sample subgraphs for training). Acceptance-prediction ranker retrained daily. Hard negatives mined from past invitations that were dismissed.",
    evaluation: "Offline: recall@K and ROC-AUC on link prediction. Online: invitation acceptance rate AND long-term meaningful interaction rate (don't optimize spammy invites).",
    serving: "Daily batch job pre-computes top-K candidates per user, stored in Redis/RocksDB. Online: light re-ranking with real-time signals (just-now profile views), filtering, freshness cap.",
    scaling: "Graph embedding training on distributed framework (DGL, PyG, or Pytorch BigGraph). Subgraph sampling per user — full-graph GNN inference is infeasible at billion-node scale. Candidate-store sharded by user ID.",
    monitoring: "Acceptance rate, dismiss rate, 'spam invite' reports, share of new connections that remain active after 30 days, distribution of mutual-friends count among recommended pairs.",
    risks: [
        "Privacy leak: exposing 'people who viewed your profile' as a strong signal can creep users out. Use carefully.",
        "Filter bubble: same demographic always recommended — mitigate with explicit diversity in candidate gen.",
        "Spam farming: scammers building networks. Mitigate: combine with bot-detection signals.",
        "Sensitive contexts: don't recommend ex-partners, people in restraining-order lists, employer-employee pairs without opt-in."
    ],
    followups: [
        "How would you bootstrap a brand-new user (no friends, no contacts shared)?",
        "How to balance strong-tie (close friends) vs weak-tie (acquaintances) recommendations? (Granovetter's strength of weak ties.)",
        "How to incorporate 'do not recommend' signals (user explicitly dismissed)?"
    ]
},
{
    id: 10,
    icon: "🗣️",
    title: "Speech Recognition / Real-Time Translation",
    category: "Speech / NLP",
    difficulty: "Hard",
    summary: "Transcribe speech to text in real time (and optionally translate to another language) for use cases like voice assistant, video captions, or meeting transcription.",
    clarifyingQuestions: [
        "Use case: voice command (short utterances), live captions (long-form), or async transcription (recorded files)?",
        "Languages, accents, code-switching support?",
        "Latency: streaming (token-by-token) vs offline?",
        "Domain: general, medical, legal, customer-support?",
        "Speaker diarization (who-said-what)? Profanity filter? PII redaction?"
    ],
    requirements: {
        functional: [
            "Stream audio in (16kHz PCM) → emit transcript tokens within ~300ms of utterance.",
            "Optional: translate transcript to target language with similar latency.",
            "Punctuation, casing, speaker labels."
        ],
        nonFunctional: [
            "Streaming p95 latency: first-token < 300 ms, finalization < 1 s after end-of-utterance.",
            "Word error rate (WER) ≤ X% on benchmark for each supported language.",
            "Throughput: tens of thousands of concurrent streams."
        ]
    },
    metrics: {
        offline: [
            "Word Error Rate (WER) and Character Error Rate (CER) on held-out test sets per language/accent/domain.",
            "BLEU / chrF for translation quality.",
            "Real-time factor (processing time / audio time) — must be < 1 for streaming."
        ],
        online: [
            "User satisfaction (thumbs up/down on captions), edit-rate on auto-transcripts, fallback-to-human rate.",
            "Per-locale WER and complaint rate."
        ]
    },
    dataAndLabels: "Paired (audio, transcript) data: public datasets (LibriSpeech, Common Voice), commercial data, in-house with consent. Augmentation: SpecAugment, noise injection, speed perturbation, room-impulse-response convolution. Synthetic TTS data for rare phonemes / accents. Translation pairs from parallel corpora + back-translation.",
    features: [
        "Input: 80-dim log-Mel spectrogram from raw audio (window 25ms, stride 10ms).",
        "No hand-crafted features — modern models learn from spectrogram or even raw waveform.",
        "Optional context: speaker embedding for speaker-adaptive decoding."
    ],
    modelChoice: "Streaming-friendly architectures: (a) Conformer / Squeezeformer encoder + RNN-Transducer (RNN-T) decoder — Google/Meta production standard, low-latency, no external LM needed. (b) For higher accuracy non-streaming: Whisper-style encoder-decoder transformer. For translation: cascaded ASR → MT, OR end-to-end speech-to-text translation (S2T). Modern frontier: Whisper-large + cascaded NLLB-MT, or end-to-end SeamlessM4T.",
    trainingPipeline: "Pretrain encoder self-supervised (wav2vec 2.0 / HuBERT / BEST-RQ) on huge unlabeled audio. Fine-tune with CTC + RNN-T loss (or seq2seq cross-entropy) on labeled data. Multi-task across many languages for low-resource transfer. Continuous fine-tune with newly-labeled production audio (carefully filtered).",
    evaluation: "WER per language, accent, noise condition, domain. BLEU for translation. Side-by-side human eval for naturalness. Latency profiling at p50 / p95 / p99.",
    serving: "Streaming inference: audio chunks (e.g., 320ms) sent over WebSocket / gRPC; encoder runs incrementally; decoder beam-search emits stable hypotheses. GPU inference with continuous batching (combine partial requests). Endpoint detection (VAD) to split utterances. Punctuation and casing as a post-processing model. PII redaction via NER + regex.",
    scaling: "GPU pool autoscaled on concurrent streams. Per-stream state (encoder cache) tracked; sticky-session routing keeps a stream on the same GPU. For very-high-volume voice assistants, a small on-device model handles wake-word + simple commands, with fallback to cloud for complex queries.",
    monitoring: "WER on a continuously-refreshed labeled sample, real-time factor, p99 latency, abandoned-stream rate, per-language error volume, GPU utilization.",
    risks: [
        "Bias: lower accuracy on non-mainstream accents / dialects → reinforce with targeted data collection.",
        "Privacy: recording sensitive audio → on-device inference where possible; ephemeral storage; consent flow.",
        "Hallucinations: large encoder-decoder models (Whisper) can hallucinate fluent text from silence. Mitigate: VAD gating, RNN-T architectures.",
        "Adversarial audio: ultrasonic / hidden commands. Mitigate: pre-filtering of frequencies, noise-robust training."
    ],
    followups: [
        "How would you add speaker diarization to streaming transcripts?",
        "How would you support 100+ languages with limited data per language?",
        "End-to-end vs cascaded translation — when to use which?",
        "How would you measure quality without paying human raters every week?"
    ]
}
];
