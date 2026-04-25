/* ============================================================
 *  AI Lookup
 *  ----------------------------------------------------------
 *  Adds:
 *   • A floating "Ask AI" FAB (always visible)
 *   • A right-edge swipe gesture (touch + mouse) that opens
 *     the AI lookup panel for the current topic
 *   • A side panel listing free external AI providers
 *     (Gemini, ChatGPT, Claude, Perplexity, Phind, Google)
 *     with the current topic pre-filled in the URL
 *   • An inline "live" Gemini chat using the user's free
 *     Google AI Studio API key (stored locally in
 *     localStorage — never sent anywhere except Google).
 *
 *  This file is self-contained: it only reads from app state
 *  through a small `getCurrentTopic()` resolver and does not
 *  modify any existing app.js logic.
 * ============================================================ */

(function () {
    'use strict';

    // -------------------------------------------------------
    // 1. Resolve the "current topic" from whichever view is up
    // -------------------------------------------------------
    function visible(el) {
        return el && el.offsetParent !== null && getComputedStyle(el).display !== 'none';
    }

    function getCurrentTopic() {
        // Algorithm problem
        const problemView = document.getElementById('problemView');
        if (visible(problemView)) {
            const t = document.getElementById('problemTitle');
            const cat = document.getElementById('problemCategory');
            return {
                title: t ? t.textContent.trim() : 'Algorithm problem',
                context: cat ? `LeetCode pattern: ${cat.textContent.trim()}` : '',
                source: 'Algorithm Patterns'
            };
        }
        // AI/ML system design
        const aimlView = document.getElementById('aimlView');
        if (visible(aimlView)) {
            const t = document.getElementById('aimlTitle');
            const cat = document.getElementById('aimlCategory');
            return {
                title: t ? t.textContent.trim() : 'AI/ML system design',
                context: cat ? `ML system design — ${cat.textContent.trim()}` : 'ML system design',
                source: 'AI/ML System Design'
            };
        }
        // AI/ML basics
        const basicsView = document.getElementById('basicsView');
        if (visible(basicsView)) {
            const t = document.getElementById('basicsTitle');
            const tr = document.getElementById('basicsTrack');
            return {
                title: t ? t.textContent.trim() : 'AI/ML concept',
                context: tr ? `AI/ML basics — ${tr.textContent.trim()}` : 'AI/ML basics',
                source: 'AI / ML Basics'
            };
        }
        // AI for Devs
        const devView = document.getElementById('devSkillsView');
        if (visible(devView)) {
            const t = document.getElementById('devSkillsTitle');
            const tr = document.getElementById('devSkillsTrack');
            return {
                title: t ? t.textContent.trim() : 'AI dev skill',
                context: tr ? `AI for developers — ${tr.textContent.trim()}` : 'AI for developers',
                source: 'AI for Devs'
            };
        }
        // Flashcards
        const fcView = document.getElementById('flashcardView');
        if (visible(fcView)) {
            const front = document.getElementById('fcFrontText');
            const cat = document.getElementById('fcCategoryLabel');
            return {
                title: front ? front.textContent.trim() : 'Flashcard topic',
                context: cat ? `Flashcard — ${cat.textContent.trim()}` : 'Flashcard',
                source: 'Flashcards'
            };
        }
        // Welcome / home — fall back to active home tab
        const activeTab = document.querySelector('.home-tab.active');
        const tabLabel  = activeTab ? activeTab.textContent.replace(/\s+/g, ' ').trim() : 'AlgoPatterns';
        return {
            title: 'AlgoPatterns — ' + tabLabel,
            context: 'Technical interview prep app: algorithms, AI/ML basics, ML system design.',
            source: 'Home'
        };
    }

    // -------------------------------------------------------
    // 2. External AI providers (free, no API key needed)
    // -------------------------------------------------------
    const providers = [
        {
            id: 'gemini',
            name: 'Gemini',
            sub: 'gemini.google.com',
            icon: '✦',
            url: q => `https://gemini.google.com/app?q=${encodeURIComponent(q)}`
        },
        {
            id: 'chatgpt',
            name: 'ChatGPT',
            sub: 'chat.openai.com',
            icon: '◎',
            url: q => `https://chatgpt.com/?q=${encodeURIComponent(q)}`
        },
        {
            id: 'claude',
            name: 'Claude',
            sub: 'claude.ai',
            icon: '✶',
            url: q => `https://claude.ai/new?q=${encodeURIComponent(q)}`
        },
        {
            id: 'perplexity',
            name: 'Perplexity',
            sub: 'perplexity.ai',
            icon: '✺',
            url: q => `https://www.perplexity.ai/?q=${encodeURIComponent(q)}`
        },
        {
            id: 'phind',
            name: 'Phind',
            sub: 'phind.com (dev-focused)',
            icon: '⌬',
            url: q => `https://www.phind.com/search?q=${encodeURIComponent(q)}`
        },
        {
            id: 'google',
            name: 'Google',
            sub: 'classic search',
            icon: '🔎',
            url: q => `https://www.google.com/search?q=${encodeURIComponent(q)}`
        }
    ];

    const QUICK_CHIPS = [
        { label: 'Explain like I\'m 5',  prompt: t => `Explain "${t.title}" like I'm 5. Use a simple analogy.` },
        { label: 'Interview answer',     prompt: t => `Give me a concise, structured interview answer for: "${t.title}". ${t.context}` },
        { label: 'Common pitfalls',      prompt: t => `What are the most common pitfalls and gotchas when working with "${t.title}"?` },
        { label: 'Compare alternatives', prompt: t => `Compare "${t.title}" with the most common alternatives. Pros, cons, and when to use each.` },
        { label: 'Real-world example',   prompt: t => `Give a real-world production example of "${t.title}" with code if applicable.` },
    ];

    function buildPrompt(topic, extra) {
        const base = `Topic: ${topic.title}\nContext: ${topic.context || topic.source}`;
        return extra && extra.trim()
            ? `${base}\n\nQuestion: ${extra.trim()}`
            : `${base}\n\nPlease give a clear, structured explanation aimed at a senior engineer preparing for technical interviews. Cover intuition, key formulas / steps, tradeoffs, and a concrete example.`;
    }

    // -------------------------------------------------------
    // 3. Build & inject UI
    // -------------------------------------------------------
    function injectUI() {
        // FAB
        const fab = document.createElement('button');
        fab.className = 'ai-fab';
        fab.id = 'aiFab';
        fab.title = 'Ask AI about the current topic  (swipe right • shortcut: ?)';
        fab.setAttribute('aria-label', 'Ask AI');
        fab.innerHTML = '✨';
        fab.addEventListener('click', openModal);
        document.body.appendChild(fab);

        // Swipe ghost
        const ghost = document.createElement('div');
        ghost.className = 'ai-swipe-ghost';
        ghost.id = 'aiSwipeGhost';
        document.body.appendChild(ghost);

        // Modal
        const backdrop = document.createElement('div');
        backdrop.className = 'ai-modal-backdrop';
        backdrop.id = 'aiModalBackdrop';
        backdrop.innerHTML = `
            <div class="ai-modal" role="dialog" aria-modal="true" aria-label="Ask AI">
                <div class="ai-modal-header">
                    <div class="ai-topic-wrap">
                        <div class="ai-topic-label">Ask AI about</div>
                        <h3 id="aiModalTopic">…</h3>
                    </div>
                    <button class="ai-modal-toggle" id="aiModalToggle" aria-label="Toggle prompt panel" title="Show / hide prompt">✎</button>
                    <button class="ai-modal-close" id="aiModalClose" aria-label="Close">✕</button>
                </div>
                <div class="ai-modal-body">
                    <div class="ai-top-section">
                        <div>
                            <div class="ai-section-label">Quick prompts</div>
                            <div class="ai-prompt-actions" id="aiQuickChips"></div>
                        </div>

                        <div class="ai-prompt-wrap">
                            <div class="ai-section-label">Your question (optional)</div>
                            <textarea id="aiPromptInput" placeholder="Anything specific you want to ask about this topic…"></textarea>
                        </div>

                        <details class="ai-providers-details" id="aiProvidersDetails">
                            <summary>
                                <span class="ai-section-label" style="margin:0;">Open in an external AI assistant</span>
                                <span class="ai-providers-caret">▾</span>
                            </summary>
                            <div class="ai-providers" id="aiProviders"></div>
                        </details>
                    </div>

                    <div class="ai-inline-card" id="aiInlineCard">
                        <div class="ai-inline-head">
                            <span class="ai-inline-title">⚡ Live answer (free)</span>
                            <span class="ai-inline-model">GPT-OSS 20B</span>
                        </div>
                        <div class="ai-key-help">
                            Powered by <a href="https://pollinations.ai" target="_blank" rel="noopener">Pollinations.ai</a> — free &amp; keyless. No signup, no data stored.
                        </div>
                        <div class="ai-inline-output empty" id="aiInlineOutput">Click "Ask AI" to get a live answer here.</div>
                    </div>
                </div>
                <div class="ai-modal-footer">
                    <button class="secondary" id="aiInlineCopy" disabled>📋 Copy</button>
                    <button id="aiInlineAsk">Ask AI</button>
                </div>
            </div>`;
        document.body.appendChild(backdrop);

        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeModal();
        });
        document.getElementById('aiModalClose').addEventListener('click', closeModal);

        // Toggle prompt panel
        document.getElementById('aiModalToggle').addEventListener('click', () => {
            const top = document.querySelector('.ai-top-section');
            if (!top) return;
            const collapsed = top.style.maxHeight === '0px';
            top.style.maxHeight = collapsed ? '' : '0px';
            // Focus textarea when expanding
            if (collapsed) {
                setTimeout(() => {
                    const ta = document.getElementById('aiPromptInput');
                    if (ta) ta.focus();
                }, 320);
            }
        });

        // Quick chips
        const chipBox = document.getElementById('aiQuickChips');
        QUICK_CHIPS.forEach((c, i) => {
            const b = document.createElement('button');
            b.className = 'ai-quick-chip';
            b.textContent = c.label;
            b.addEventListener('click', () => {
                const topic = getCurrentTopic();
                document.getElementById('aiPromptInput').value = c.prompt(topic);
            });
            chipBox.appendChild(b);
        });

        // Providers
        const provBox = document.getElementById('aiProviders');
        providers.forEach(p => {
            const b = document.createElement('button');
            b.className = 'ai-provider-btn';
            b.innerHTML = `
                <span class="ai-prov-icon">${p.icon}</span>
                <span class="ai-prov-meta">
                    <span>${p.name}</span>
                    <span class="ai-prov-sub">${p.sub}</span>
                </span>`;
            b.addEventListener('click', () => {
                const topic = getCurrentTopic();
                const extra = document.getElementById('aiPromptInput').value;
                const url = p.url(buildPrompt(topic, extra));
                window.open(url, '_blank', 'noopener');
            });
            provBox.appendChild(b);
        });

        // Inline AI handling (keyless via Pollinations.ai)
        const askBtn    = document.getElementById('aiInlineAsk');
        const copyBtn   = document.getElementById('aiInlineCopy');
        const outputEl  = document.getElementById('aiInlineOutput');
        const MODEL     = 'openai'; // anonymous-tier model on Pollinations

        askBtn.addEventListener('click', async () => {
            const topic = getCurrentTopic();
            const extra = document.getElementById('aiPromptInput').value;
            const prompt = buildPrompt(topic, extra);
            askBtn.disabled = true;
            copyBtn.disabled = true;
            outputEl.classList.remove('empty');
            outputEl.textContent = '⏳ Thinking…';
            try {
                const text = await callPollinations(MODEL, prompt);
                outputEl.dataset.raw = text;
                outputEl.innerHTML = renderMarkdown(text);
                outputEl.scrollTop = 0;
                copyBtn.disabled = false;
                // Collapse the top controls so the answer gets the full panel
                const top = document.querySelector('.ai-top-section');
                if (top) top.style.maxHeight = '0px';
            } catch (err) {
                outputEl.textContent = '⚠️  ' + (err && err.message ? err.message : String(err));
            } finally {
                askBtn.disabled = false;
            }
        });

        copyBtn.addEventListener('click', () => {
            const raw = outputEl.dataset.raw || outputEl.textContent || '';
            navigator.clipboard.writeText(raw).then(() => {
                const orig = copyBtn.textContent;
                copyBtn.textContent = '✓ Copied';
                setTimeout(() => copyBtn.textContent = orig, 1500);
            });
        });
    }

    // -------------------------------------------------------
    // Lightweight Markdown → HTML renderer (no deps)
    // Supports: # H1–### H3, **bold**, *italic*, `inline code`,
    //          ```code fences```, - / * / 1. lists, > blockquote,
    //          links [text](url), tables, paragraphs.
    // -------------------------------------------------------
    function escapeHtml(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function renderInline(s) {
        // protect inline code first
        const codeSlots = [];
        s = s.replace(/`([^`]+)`/g, (_, c) => {
            codeSlots.push(c);
            return `\u0000CODE${codeSlots.length - 1}\u0000`;
        });
        s = escapeHtml(s);
        // bold + italic
        s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
        s = s.replace(/(^|[\s(])\*([^*\s][^*]*?)\*(?=[\s).,!?;:]|$)/g, '$1<em>$2</em>');
        s = s.replace(/(^|[\s(])_([^_\s][^_]*?)_(?=[\s).,!?;:]|$)/g, '$1<em>$2</em>');
        // links
        s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,
            '<a href="$2" target="_blank" rel="noopener">$1</a>');
        // restore inline code
        s = s.replace(/\u0000CODE(\d+)\u0000/g, (_, i) => `<code>${escapeHtml(codeSlots[+i])}</code>`);
        return s;
    }
    function renderMarkdown(md) {
        if (!md) return '';
        const lines = md.replace(/\r\n?/g, '\n').split('\n');
        const out = [];
        let i = 0;
        let inUL = false, inOL = false;
        const closeLists = () => {
            if (inUL) { out.push('</ul>'); inUL = false; }
            if (inOL) { out.push('</ol>'); inOL = false; }
        };
        while (i < lines.length) {
            const line = lines[i];

            // fenced code block
            const fence = line.match(/^```\s*([\w-]*)\s*$/);
            if (fence) {
                closeLists();
                const lang = fence[1] || '';
                const buf = [];
                i++;
                while (i < lines.length && !/^```\s*$/.test(lines[i])) {
                    buf.push(lines[i]);
                    i++;
                }
                i++; // skip closing fence
                out.push(`<pre class="ai-md-pre"><code class="ai-md-code${lang ? ' lang-' + lang : ''}">${escapeHtml(buf.join('\n'))}</code></pre>`);
                continue;
            }

            // headings
            const h = line.match(/^(#{1,4})\s+(.+)$/);
            if (h) {
                closeLists();
                const lvl = Math.min(h[1].length + 1, 5); // bump down a level (h2..h5)
                out.push(`<h${lvl} class="ai-md-h">${renderInline(h[2])}</h${lvl}>`);
                i++; continue;
            }

            // horizontal rule
            if (/^[-*_]{3,}\s*$/.test(line)) {
                closeLists();
                out.push('<hr class="ai-md-hr">');
                i++; continue;
            }

            // blockquote
            if (/^>\s?/.test(line)) {
                closeLists();
                const buf = [];
                while (i < lines.length && /^>\s?/.test(lines[i])) {
                    buf.push(lines[i].replace(/^>\s?/, ''));
                    i++;
                }
                out.push(`<blockquote class="ai-md-bq">${renderInline(buf.join(' '))}</blockquote>`);
                continue;
            }

            // unordered list
            if (/^\s*[-*+]\s+/.test(line)) {
                if (!inUL) { closeLists(); out.push('<ul class="ai-md-ul">'); inUL = true; }
                out.push(`<li>${renderInline(line.replace(/^\s*[-*+]\s+/, ''))}</li>`);
                i++; continue;
            }
            // ordered list
            if (/^\s*\d+\.\s+/.test(line)) {
                if (!inOL) { closeLists(); out.push('<ol class="ai-md-ol">'); inOL = true; }
                out.push(`<li>${renderInline(line.replace(/^\s*\d+\.\s+/, ''))}</li>`);
                i++; continue;
            }

            // blank line → close lists, paragraph break
            if (/^\s*$/.test(line)) {
                closeLists();
                i++; continue;
            }

            // table: | a | b |\n|---|---|\n| x | y | ...
            if (/^\s*\|.*\|\s*$/.test(line)
                && i + 1 < lines.length
                && /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(lines[i + 1])) {
                closeLists();
                const splitRow = (row) => row.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(c => c.trim());
                const header = splitRow(line);
                const aligns = splitRow(lines[i + 1]).map(spec => {
                    const l = /^:/.test(spec), r = /:$/.test(spec);
                    if (l && r) return 'center';
                    if (r)      return 'right';
                    return 'left';
                });
                i += 2;
                const rows = [];
                while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
                    rows.push(splitRow(lines[i]));
                    i++;
                }
                const th = header.map((h, idx) =>
                    `<th style="text-align:${aligns[idx] || 'left'}">${renderInline(h)}</th>`).join('');
                const trs = rows.map(r =>
                    '<tr>' + r.map((c, idx) =>
                        `<td style="text-align:${aligns[idx] || 'left'}">${renderInline(c)}</td>`).join('') + '</tr>'
                ).join('');
                out.push(`<div class="ai-md-table-wrap"><table class="ai-md-table"><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table></div>`);
                continue;
            }

            // paragraph (greedy: collect consecutive non-special lines)
            closeLists();
            const buf = [line];
            i++;
            while (i < lines.length
                && !/^\s*$/.test(lines[i])
                && !/^(#{1,4})\s+/.test(lines[i])
                && !/^```/.test(lines[i])
                && !/^>\s?/.test(lines[i])
                && !/^\s*[-*+]\s+/.test(lines[i])
                && !/^\s*\d+\.\s+/.test(lines[i])
                && !/^[-*_]{3,}\s*$/.test(lines[i])
                && !/^\s*\|.*\|\s*$/.test(lines[i])) {
                buf.push(lines[i]);
                i++;
            }
            out.push(`<p class="ai-md-p">${renderInline(buf.join(' '))}</p>`);
        }
        closeLists();
        return out.join('\n');
    }

    // -------------------------------------------------------
    // 4. Pollinations.ai — free, keyless, CORS-enabled text API
    // -------------------------------------------------------
    async function callPollinations(model, prompt) {
        const sys = 'You are a senior engineer helping with technical interview prep. Give clear, structured, concise explanations. Use markdown lists when helpful.';
        const body = {
            model: model || 'openai',
            messages: [
                { role: 'system', content: sys },
                { role: 'user',   content: prompt }
            ],
            temperature: 0.6,
            private: true,
            referrer: 'algopatterns'
        };
        const res = await fetch('https://text.pollinations.ai/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!res.ok) {
            const errText = await res.text().catch(() => '');
            throw new Error(`HTTP ${res.status}${errText ? ' — ' + errText.slice(0, 200) : ''}`);
        }
        // Pollinations returns OpenAI-compatible JSON on /openai
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
            const json = await res.json();
            const msg = json.choices && json.choices[0] && json.choices[0].message;
            const text = msg && msg.content ? msg.content : '';
            if (!text) throw new Error('Empty response.');
            return text.trim();
        }
        // Fallback: plain text
        const text = await res.text();
        if (!text) throw new Error('Empty response.');
        return text.trim();
    }

    // -------------------------------------------------------
    // 5. Modal open/close
    // -------------------------------------------------------
    function openModal() {
        const topic = getCurrentTopic();
        document.getElementById('aiModalTopic').textContent = topic.title;
        document.getElementById('aiPromptInput').value = '';
        const out = document.getElementById('aiInlineOutput');
        out.classList.add('empty');
        out.textContent = 'Click "Ask AI" to get a free, live answer here.';
        out.style.minHeight = '';
        const top = document.querySelector('.ai-top-section');
        if (top) top.style.maxHeight = '';
        document.getElementById('aiInlineCopy').disabled = true;
        document.getElementById('aiModalBackdrop').classList.add('open');
        document.body.classList.add('ai-modal-open');
        // Hide the first-run hint once used
        const hint = document.getElementById('aiHintToast');
        if (hint) hint.remove();
        localStorage.setItem('aiLookupSeen', '1');
    }
    function closeModal() {
        document.getElementById('aiModalBackdrop').classList.remove('open');
        document.body.classList.remove('ai-modal-open');
    }

    // -------------------------------------------------------
    // 6. Right-edge swipe gesture (touch + mouse)
    //    Triggered when the user starts a drag near the right
    //    edge of the screen and swipes leftward.
    //    Also: when the modal is open, swiping rightward
    //    dismisses it.
    // -------------------------------------------------------
    function bindSwipe() {
        const isTouch        = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
        const EDGE_PX        = isTouch ? 44 : 32;   // bigger zone on touch devices
        const TRIGGER_PX     = isTouch ? 60 : 70;
        const INTENT_PX      = 10;                  // px movement before we decide direction
        const ghost          = document.getElementById('aiSwipeGhost');

        let startX = 0, startY = 0;
        let active = false;        // tracking a potential open-gesture
        let dismissing = false;    // tracking a potential close-gesture (modal already open)
        let intentLocked = false;  // once true, we've decided horizontal vs vertical
        let horizontal = false;

        function modalOpen() {
            return document.getElementById('aiModalBackdrop').classList.contains('open');
        }

        function start(x, y) {
            intentLocked = false;
            horizontal = false;
            startX = x;
            startY = y;
            if (modalOpen()) {
                // close-gesture: rightward swipe anywhere on the modal
                dismissing = true;
                active = false;
            } else {
                const fromRightEdge = (window.innerWidth - x) <= EDGE_PX;
                active = fromRightEdge;
                dismissing = false;
            }
        }
        function move(x, y, e) {
            if (!active && !dismissing) return;
            const dx = startX - x;            // positive = leftward (open), negative = rightward (close)
            const adx = Math.abs(dx);
            const ady = Math.abs(y - startY);

            // Decide intent once we've moved enough
            if (!intentLocked && (adx > INTENT_PX || ady > INTENT_PX)) {
                horizontal = adx > ady;
                intentLocked = true;
                if (!horizontal) { reset(); return; }  // user is scrolling vertically
            }
            if (!intentLocked || !horizontal) return;

            // For touch: prevent the page from scrolling sideways / triggering nav
            if (e && e.cancelable) {
                try { e.preventDefault(); } catch (_) { /* passive listener */ }
            }

            if (active && dx > 0) {
                // showing the open-preview ghost
                ghost.style.width = Math.min(dx, 320) + 'px';
            } else if (dismissing && dx < 0) {
                // (no preview for dismiss — modal itself stays put; we just track distance)
            }
        }
        function end(x) {
            const dx = startX - x;
            const wasActive    = active;
            const wasDismiss   = dismissing;
            const wasHorizontal = horizontal;
            reset();
            if (!wasHorizontal) return;
            if (wasActive    && dx >=  TRIGGER_PX) openModal();
            if (wasDismiss   && dx <= -TRIGGER_PX) closeModal();
        }
        function reset() {
            active = false;
            dismissing = false;
            intentLocked = false;
            horizontal = false;
            ghost.style.width = '0px';
        }

        // Touch — use non-passive on move so we can preventDefault when needed
        window.addEventListener('touchstart', (e) => {
            const t = e.touches[0]; if (!t) return;
            start(t.clientX, t.clientY);
        }, { passive: true });
        window.addEventListener('touchmove', (e) => {
            const t = e.touches[0]; if (!t) return;
            move(t.clientX, t.clientY, e);
        }, { passive: false });
        window.addEventListener('touchend', (e) => {
            const t = (e.changedTouches && e.changedTouches[0]) || null;
            end(t ? t.clientX : startX);
        });
        window.addEventListener('touchcancel', reset);

        // Mouse (desktop demo of the same gesture)
        let mouseDown = false;
        window.addEventListener('mousedown', (e) => {
            mouseDown = true;
            start(e.clientX, e.clientY);
        });
        window.addEventListener('mousemove', (e) => {
            if (!mouseDown) return;
            move(e.clientX, e.clientY, null);
        });
        window.addEventListener('mouseup', (e) => {
            mouseDown = false;
            end(e.clientX);
        });
    }

    // -------------------------------------------------------
    // 7. Keyboard shortcut: "?" or "a" (when not typing)
    // -------------------------------------------------------
    function bindKeys() {
        document.addEventListener('keydown', (e) => {
            const tag = (e.target && e.target.tagName) || '';
            if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
            if (e.key === '?' || (e.key === 'a' && !e.metaKey && !e.ctrlKey && !e.altKey)) {
                e.preventDefault();
                if (document.getElementById('aiModalBackdrop').classList.contains('open')) {
                    closeModal();
                } else {
                    openModal();
                }
            } else if (e.key === 'Escape') {
                if (document.getElementById('aiModalBackdrop').classList.contains('open')) {
                    closeModal();
                }
            }
        });
    }

    // -------------------------------------------------------
    // 8. First-run hint
    // -------------------------------------------------------
    function maybeShowHint() {
        if (localStorage.getItem('aiLookupSeen')) return;
        const hint = document.createElement('div');
        hint.className = 'ai-hint-toast';
        hint.id = 'aiHintToast';
        hint.innerHTML = '✨ Tap the ✨ button or swipe in from the right edge to ask AI about any topic.';
        document.body.appendChild(hint);
        setTimeout(() => hint.remove(), 6500);
    }

    // -------------------------------------------------------
    // boot
    // -------------------------------------------------------
    function boot() {
        injectUI();
        bindSwipe();
        bindKeys();
        setTimeout(maybeShowHint, 1200);
        // expose for debugging / external triggers
        window.openAiLookup = openModal;
        window.closeAiLookup = closeModal;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
