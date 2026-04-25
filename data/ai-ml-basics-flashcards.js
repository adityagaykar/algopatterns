// AI / ML Basics flashcards — fundamentals refresher deck
const aiMlBasicsFlashcards = [

// ===== Math & Stats =====
{id:1, category:"Math & Stats", icon:"🎲", front:"Conditional Probability & Bayes",
back:"P(A|B) = P(A,B) / P(B)\n\nBayes: P(θ|D) = P(D|θ)·P(θ) / P(D)\n  posterior ∝ likelihood × prior\n\nKey traps:\n• P(A|B) ≠ P(B|A) (prosecutor's fallacy)\n• Base rate matters — 99% accurate test on 1% disease still gives lots of false positives\n• Independence: P(A,B) = P(A)·P(B); rarely true in real features"},

{id:2, category:"Math & Stats", icon:"🧮", front:"MLE vs MAP",
back:"MLE: θ* = argmax P(D|θ) — pure data\nMAP: θ* = argmax P(D|θ)·P(θ) — data + prior\n\nMAP = MLE when prior is uniform.\n\nRegularization is MAP in disguise:\n• L2 ↔ Gaussian prior on weights (Ridge)\n• L1 ↔ Laplace prior (Lasso, sparsity)\n\nMLE/MAP give point estimates; full Bayesian gives posterior distribution → uncertainty."},

{id:3, category:"Math & Stats", icon:"📐", front:"Cosine Similarity & Dot Product",
back:"u·v = |u|·|v|·cos θ\n\ncos(u,v) = (u·v) / (||u||·||v||)  ∈ [-1, 1]\n\nWhy used everywhere:\n• Embeddings: direction matters more than magnitude\n• Two-tower retrieval scores u_user · v_item\n• Attention: softmax(QK^T/√d_k)·V — dot products of Q and K\n\nMust normalize vectors first or magnitude dominates."},

{id:4, category:"Math & Stats", icon:"📈", front:"Eigenvectors, SVD, PCA",
back:"Eigendecomp: Av = λv (square matrices)\nSVD: A = UΣV^T (any matrix)\n\nPCA = eigendecomp of covariance matrix:\n  1. Center data\n  2. Compute cov C = X^T X / n\n  3. Eigenvectors of C = principal components\n  4. Project: X_reduced = X·V_k\n\nTop-k SVD = best low-rank approximation (Eckart-Young).\n\nPowers: matrix factorization recsys, image compression, dim reduction."},

{id:5, category:"Math & Stats", icon:"📉", front:"Gradient Descent & Optimizers",
back:"θ ← θ − η·∇L(θ)\n\n• Batch GD: full data → slow but stable\n• SGD: 1 sample → noisy, escapes local min\n• Mini-batch (32–8192): the practical default\n\nMomentum: smooth gradient with EMA\nAdam = momentum + per-param adaptive LR (RMSProp)\nAdamW = Adam with decoupled weight decay (default for transformers)\n\nLR schedule: warmup → cosine/linear decay (critical for transformers)."},

{id:6, category:"Math & Stats", icon:"📊", front:"Entropy, Cross-Entropy, KL",
back:"H(p) = −Σ p log p   (uncertainty in p)\nH(p,q) = −Σ p log q  (cost of using q for p)\nKL(p||q) = H(p,q) − H(p) = Σ p log(p/q)\n\nProperties:\n• KL ≥ 0, = 0 iff p = q\n• KL is NOT symmetric: KL(p||q) ≠ KL(q||p)\n• Forward KL is mean-seeking, reverse KL is mode-seeking\n\nCross-entropy loss = MLE under categorical likelihood. Used in classification, distillation, decision tree splits, drift detection."},

{id:7, category:"Math & Stats", icon:"📏", front:"Central Limit Theorem & A/B Tests",
back:"CLT: mean of N iid samples → Normal(μ, σ²/N), regardless of source distribution.\n\nWhy A/B testing works even on non-normal metrics (clicks, revenue):\n• You're comparing means → Normal\n• Use z-test or t-test on the difference\n\nSample size: n ≈ 16·σ² / δ²  (per arm, 80% power, 5% significance, two-sided)\n\nWatch out for:\n• Peeking → inflated false-positive rate (use sequential tests or fixed horizon)\n• Skewed metrics with long tail → may need very large n"},

// ===== Classical ML =====
{id:8, category:"Classical ML", icon:"📈", front:"Linear vs Logistic Regression",
back:"Linear: ŷ = w·x + b, fit by MSE, closed-form (X^TX)^(-1) X^Ty\nLogistic: ŷ = σ(w·x + b), fit by log-loss (cross-entropy)\n\nBoth linear in parameters → manually engineer non-linear features.\n\nL1/L2/ElasticNet regularization controls overfitting.\nCoefficients interpretable: exp(w_i) = odds ratio in logistic.\n\nWhen to reach for: tabular baseline, regulated industries, when you need fast inference + explainability."},

{id:9, category:"Classical ML", icon:"🌲", front:"Why GBDT Dominates Tabular",
back:"Gradient Boosting (XGBoost/LightGBM/CatBoost):\n  Each new tree fits residuals (negative gradient) of current ensemble.\n\nWhy it crushes deep learning on tabular:\n• Handles mixed types, no scaling needed\n• Captures interactions automatically\n• Native missing value handling\n• Monotonic transforms don't matter\n• Few hyperparams matter (depth 3-8, n_estimators + early stop, LR 0.01-0.1)\n\nLimitation: can't extrapolate beyond training range. Tree-based feature importance is biased toward high-cardinality — use SHAP."},

{id:10, category:"Classical ML", icon:"🎯", front:"Bias-Variance Tradeoff",
back:"Total error = Bias² + Variance + Irreducible noise\n\nHigh bias (underfit): train ↑, val ↑, gap small\nHigh variance (overfit): train ↓, val ↑, big gap\n\nDiagnose with learning curves (error vs train size).\n\n↓ Bias: bigger model, more features, less regularization, longer training\n↓ Variance: more data (best!), regularization, simpler model, ensembling, early stopping\n\nModern twist: massively overparameterized models often generalize well (double descent)."},

{id:11, category:"Classical ML", icon:"🔀", front:"Cross-Validation Done Right",
back:"3-way: train (fit) / val (tune) / test (touch ONCE).\n\nk-fold (k=5 or 10): standard for limited data.\nStratified k-fold: preserves class ratios — use for imbalanced.\n\nDANGER ZONES:\n• Time-series → forward-chaining only, NEVER random shuffle\n• Repeated entities (user, patient) → group k-fold so same entity stays in one fold\n• Fitting scaler/imputer on full data before split → leakage\n• Selecting features on full data before CV → target leakage\n• Tuning on test set → it becomes your val set"},

{id:12, category:"Classical ML", icon:"⚖️", front:"Class Imbalance & Calibration",
back:"99:1 data → accuracy is meaningless.\nUse PR-AUC, recall@high-precision, F1, expected cost.\n\nFixes:\n• Data: SMOTE oversample, undersample majority, class weights\n• Loss: focal loss FL = −(1−p)^γ·log(p) — focuses on hard examples\n• Threshold tuning often beats fancy losses\n\nCalibration ≠ ranking:\n• Model can rank well (high AUC) but predict wrong probabilities\n• Critical for ads (auctions need calibrated CTR), insurance, downstream rules\n• Fix with Platt scaling (sigmoid) or isotonic regression"},

// ===== Deep Learning =====
{id:13, category:"Deep Learning", icon:"🧠", front:"Backpropagation Essentials",
back:"Forward: compute layer outputs, cache activations\nBackward: chain rule from loss back to each weight\n\n  δ_L = ∇_a L ⊙ σ'(z_L)\n  δ_l = (W_{l+1}^T · δ_{l+1}) ⊙ σ'(z_l)\n  ∂L/∂W_l = δ_l · a_{l-1}^T\n\nGotchas:\n• Forgetting optimizer.zero_grad() in PyTorch\n• Sigmoid/tanh deep → vanishing gradient (use ReLU/GELU)\n• Bad init → diverges or never starts (use He for ReLU, Xavier for tanh)"},

{id:14, category:"Deep Learning", icon:"🛡️", front:"Regularization in Deep Nets",
back:"• Weight decay (L2): AdamW decouples it from gradient (use this for transformers)\n• Dropout p=0.1–0.5 (don't combine with BN in same block)\n• BatchNorm: normalize per mini-batch, broken at batch=1 → use LayerNorm/GroupNorm\n• LayerNorm: per-sample, default in transformers\n• Data augmentation: usually highest leverage (mixup, cutout, RandAugment)\n• Early stopping: implicit cap on capacity\n• Label smoothing: improves calibration, prevents overconfidence\n\nDon't forget model.eval() at inference!"},

{id:15, category:"Deep Learning", icon:"🖼️", front:"CNNs in 60 Seconds",
back:"Conv = sliding filter → translation equivariance + huge param savings.\n\nOutput size: (W − K + 2P) / S + 1\n\nDesign rules:\n• Stack 3×3 convs > one big conv (more nonlinearity, fewer params)\n• Strided conv replaces pooling in modern nets\n• Receptive field grows with depth\n• ResNet's residual connections enable 100+ layer training\n• Depthwise separable conv (MobileNet) splits spatial + channel mixing → cheap\n\nViT beats CNN at very large scale; CNN wins on edge + low data."},

{id:16, category:"Deep Learning", icon:"🔁", front:"RNN vs LSTM vs Transformer",
back:"Vanilla RNN: h_t = tanh(W·[h_{t-1}, x_t]) — vanishing grad past ~20 steps\nLSTM: cell state + 3 gates (forget, input, output) — additive path solves vanishing\nGRU: simpler LSTM, merges forget+input into single update gate\n\nWhy transformers won:\n• Fully parallel across sequence (RNN is sequential)\n• Direct long-range dependencies via attention\n• Smooth scaling with data + params (scaling laws)\n\nRNN/LSTM still useful: streaming with O(1) memory per step, edge devices."},

// ===== NLP & LLMs =====
{id:17, category:"NLP & LLMs", icon:"🔤", front:"Tokenization: BPE, WordPiece, SentencePiece",
back:"Word: huge vocab + OOV problem\nChar: tiny vocab + very long sequences\nSubword (BPE et al): best of both → modern default\n\nBPE: start with chars, iteratively merge most-frequent adjacent pair until vocab size hit. Frequent words stay whole, rare words split.\n\nGotchas:\n• MUST use the model's own tokenizer (BERT ≠ GPT)\n• Token counts ≠ word counts — affects context budget + cost\n• Multilingual needs mBERT/XLM-R style tokenizer"},

{id:18, category:"NLP & LLMs", icon:"🎯", front:"Self-Attention Computation",
back:"For each token: project to Q, K, V (learned matrices).\n\nAttention(Q,K,V) = softmax(QK^T / √d_k) · V\n\nMulti-head: h parallel attentions with diff projections, concat → W_O.\n\nWhy √d_k: keeps softmax inputs in sane range so gradients don't vanish.\n\nCost: O(N²·d) — quadratic in sequence length.\n\nMitigations: FlashAttention (memory-efficient), sliding window (Mistral), KV cache, MoE.\n\nPositional encoding required (attention is permutation-invariant): sinusoidal, learned, or RoPE."},

{id:19, category:"NLP & LLMs", icon:"🤖", front:"Pretrain → SFT → RLHF/DPO → RAG",
back:"1. Pretrain: next-token on trillions of tokens. $10M-$100M+. Base model.\n2. SFT: train on (instruction, response) pairs. Hours-days.\n3. Preference tuning:\n   • RLHF: train reward model from human rankings, optimize with PPO\n   • DPO: closed-form alternative, no reward model needed\n   Both align with helpful/harmless/honest.\n4. RAG: retrieve relevant docs at inference → stuff in context. Best for fact-grounded private/fresh data.\n\nPEFT (LoRA/QLoRA): freeze base, train tiny adapters → 1000× less GPU mem, ~99% of full fine-tune quality. Default today."},

{id:20, category:"NLP & LLMs", icon:"🚫", front:"When to Fine-tune vs Prompt vs RAG",
back:"PROMPT — first try. One-off tasks, prototyping, when good instructions suffice.\n\nRAG — fact-grounded Q&A on private/fresh data. Knowledge that changes. Need citations.\n\nFINE-TUNE — behavior, style, format that prompting can't reliably enforce. Domain-specific outputs. Specialized small model.\n\nUsually combine: RAG + light LoRA fine-tune is common.\n\nFine-tune wastes if prompting works:\n• Locks you to a model version\n• Catastrophic forgetting risk\n• Expensive iteration loop"},

// ===== Recommenders & Ranking =====
{id:21, category:"Recommenders & Ranking", icon:"🎬", front:"Two-Tower Retrieval",
back:"User tower: f_user(user_features) → user vector\nItem tower: f_item(item_features) → item vector\nScore: dot product or cosine\n\nWhy used everywhere (YouTube, TikTok, Pinterest):\n• Pre-compute item embeddings offline\n• ANN search (FAISS, ScaNN) over millions of items in <10ms\n• User vector computed at request time\n\nTraining: in-batch negatives or sampled-softmax. Hard negative mining boosts quality.\n\nOnly used for retrieval (top-1000); ranking stage uses cross-features."},

{id:22, category:"Recommenders & Ranking", icon:"🥇", front:"Multi-Stage Ranking Architecture",
back:"Retrieval (millions → ~1000): two-tower + ANN, fast cheap features\nCoarse Rank (1000 → ~100): light model, basic cross-features\nFine Rank (100 → top 10): heavy model, full cross-features, multi-task heads\nRerank/diversify: business rules, diversity, freshness, fairness\n\nLatency budget split across stages.\n\nMetrics:\n• Offline: NDCG@k, MAP, MRR\n• Online: CTR, dwell, conversion, revenue (always A/B)\n\nLambdaMART (GBDT) still strong baseline; DLRM/DCN/MMoE win at scale."},

{id:23, category:"Recommenders & Ranking", icon:"⚠️", front:"Position Bias & Selection Bias",
back:"POSITION BIAS: top results clicked more regardless of true relevance.\nFix:\n• Position as feature at train time, set to fixed value (or drop) at inference\n• Inverse propensity weighting on labels\n• Pairwise debiasing\n\nSELECTION BIAS: only items the system showed got feedback. Retraining on logged data → policy collapse, popularity feedback loop.\nFix:\n• ε-greedy / Thompson sampling exploration\n• Counterfactual evaluation (off-policy estimators like IPS, doubly robust)\n• Diversity injection at rerank"},

// ===== MLOps & Production =====
{id:24, category:"MLOps & Production", icon:"🔧", front:"Train/Serve Skew",
back:"#1 cause of silent model failure in production.\n\nDefinition: feature values differ between training pipeline and serving pipeline.\n\nCauses:\n• Different code paths (Spark for train, Python for serve)\n• Different data sources or join keys\n• Time-of-day / freshness mismatches\n• Missing features at serve time\n\nFixes:\n• Feature store (Feast, Tecton) — single source of truth\n• Log production features → replay in training\n• Shadow scoring: serve old model, log new model's predictions, compare\n• Schema validation in CI"},

{id:25, category:"MLOps & Production", icon:"📊", front:"Drift Detection",
back:"Three flavors:\n• Data drift: input distribution P(x) shifts (seasonality, new segments)\n• Concept drift: P(y|x) shifts (fraud patterns evolve, tastes change)\n• Label drift: P(y) shifts (more positives than before)\n\nDetect with:\n• PSI (Population Stability Index): Σ (p_new − p_old) ln(p_new/p_old)\n   <0.1 stable, 0.1–0.25 moderate, >0.25 significant\n• KL divergence between train and serving feature distributions\n• KS test for continuous features\n• Monitor prediction distribution + offline-online metric correlation\n\nAlert + retrain trigger."},

{id:26, category:"MLOps & Production", icon:"🚀", front:"Online vs Batch Inference",
back:"BATCH (nightly recs, weekly scoring):\n• High throughput, no latency constraint\n• Scales easily on Spark/Beam\n• Good when input doesn't change frequently\n• Stale by design\n\nONLINE (request/response, <100ms):\n• Strict p99 latency\n• Need feature lookup at request time\n• Optimize: quantization (int8), distillation, pruning, caching popular requests, batching, GPU/TPU serving\n• Stack: TF Serving, TorchServe, Triton, BentoML, ONNX Runtime\n\nHybrid: batch precompute embeddings, online score with light model on top."},

{id:27, category:"MLOps & Production", icon:"🧪", front:"A/B Testing for ML",
back:"Sample size: n ≈ 16·σ² / δ²  per arm (80% power, 5% sig)\n\nGotchas specific to ML:\n• Novelty effect: early users behave differently, wait it out (1-2 weeks)\n• Network effects: treatment leaks via shared content (cluster-randomize, geo-test)\n• Sample ratio mismatch (SRM): unequal traffic splits → hidden bug\n• Multiple metrics → multiple testing correction (Bonferroni, FDR)\n• Long-term metrics differ from short-term (engagement vs retention)\n• Counterfactual evaluation before A/B for high-risk launches\n\nAlways: canary → shadow → A/B → ramp → hold-out."},

{id:28, category:"MLOps & Production", icon:"🔭", front:"Production ML Lifecycle",
back:"Problem framing → data collection → labeling → feature eng → training → offline eval → online experiment → ramp → MONITORING → retrain loop\n\nKeep healthy in prod:\n• Feature store kills train/serve skew\n• Drift detection on features + predictions\n• Monitor prediction distribution, latency p50/p99, error rate, online metric\n• Retraining: scheduled, drift-triggered, or continuous\n• Experiment tracking (MLflow, W&B)\n• Reproducibility: pin data (DVC), code (git), artifact, hyperparams\n\nBuilding model = 10% of the job."},

];
