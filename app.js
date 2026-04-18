// ===== APP STATE =====
const state = {
    currentProblemId: null,
    activeFilter: 'all',
    activeDifficulty: 'all',
    searchQuery: '',
    activeLang: 'python',
    completed: JSON.parse(localStorage.getItem('completedProblems') || '[]')
};



// ===== THEME =====
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = theme === 'dark' ? '☀️' : '🌙';
    const t1 = document.getElementById('themeToggle');
    const t2 = document.getElementById('themeToggleMobile');
    if (t1) t1.textContent = icon;
    if (t2) t2.textContent = icon;
    localStorage.setItem('theme', theme);
}
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
    // Re-highlight code if visible
    if (typeof Prism !== 'undefined' && state.currentProblemId) {
        setTimeout(() => Prism.highlightAll(), 50);
    }
}
// Apply saved theme immediately
(function() {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
})();

// ===== DOM REFS =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const dom = {
    sidebar: $('#sidebar'),
    problemList: $('#problemList'),
    searchInput: $('#searchInput'),
    filterButtons: $('#filterButtons'),
    welcomeScreen: $('#welcomeScreen'),
    problemView: $('#problemView'),
    progressBar: $('#progressBar'),
    progressText: $('#progressText'),
    prevBtn: $('#prevBtn'),
    nextBtn: $('#nextBtn'),
    markCompleteBtn: $('#markCompleteBtn'),
    problemTitle: $('#problemTitle'),
    problemDifficulty: $('#problemDifficulty'),
    problemCategory: $('#problemCategory'),
    problemLC: $('#problemLC'),
    problemDescription: $('#problemDescription'),
    problemExamples: $('#problemExamples'),
    thinkingSteps: $('#thinkingSteps'),
    keyInsight: $('#keyInsight'),
    approach: $('#approach'),
    solutionCode: $('#solutionCode'),
    timeComplexity: $('#timeComplexity'),
    spaceComplexity: $('#spaceComplexity'),
    patternGuide: $('#patternGuide'),
};

// ===== INIT =====
function init() {
    applyTheme(localStorage.getItem('theme') || 'light');
    renderProblemList();
    updateProgress();
    bindEvents();
    handleHashNavigation();
}

// ===== EVENT BINDINGS =====
function bindEvents() {
    // Search
    dom.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase();
        renderProblemList();
    });

    // Category filters
    dom.filterButtons.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            $$('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.activeFilter = e.target.dataset.filter;
            renderProblemList();
        }
    });

    // Difficulty filters
    $('#difficultyFilters').addEventListener('click', (e) => {
        if (e.target.classList.contains('diff-filter-btn')) {
            $$('.diff-filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.activeDifficulty = e.target.dataset.diff;
            renderProblemList();
        }
    });

    // Nav buttons
    dom.prevBtn.addEventListener('click', () => navigateProblem(-1));
    dom.nextBtn.addEventListener('click', () => navigateProblem(1));

    // Mark complete
    dom.markCompleteBtn.addEventListener('click', toggleComplete);

    // Pattern cards on welcome screen
    $$('.pattern-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            // Set filter
            $$('.filter-btn').forEach(b => b.classList.remove('active'));
            const matchBtn = [...$$('.filter-btn')].find(b => b.dataset.filter === category);
            if (matchBtn) matchBtn.classList.add('active');
            state.activeFilter = category;
            renderProblemList();

            // On mobile/tablet, jump straight to the first problem in this category
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                const firstProblem = problems.find(p => p.category === category);
                if (firstProblem) {
                    selectProblem(firstProblem.id);
                } else {
                    toggleSidebar(); // fallback: open sidebar
                }
            }
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        // Flashcard mode
        if ($('#flashcardView').style.display !== 'none') {
            if (e.key === 'ArrowLeft') fcNavigate(-1);
            if (e.key === 'ArrowRight') fcNavigate(1);
            return;
        }
        if (e.key === 'ArrowLeft' || e.key === 'k') navigateProblem(-1);
        if (e.key === 'ArrowRight' || e.key === 'j') navigateProblem(1);
    });

    // Hash navigation
    window.addEventListener('hashchange', handleHashNavigation);

    // Mobile sidebar toggle
    const hamburger = document.getElementById('hamburgerBtn');
    const overlay = document.getElementById('sidebarOverlay');
    if (hamburger) {
        hamburger.addEventListener('click', toggleSidebar);
    }
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }
}

// ===== RENDERING =====
function getFilteredProblems() {
    return problems.filter(p => {
        const matchesFilter = state.activeFilter === 'all' || p.category === state.activeFilter;
        const matchesDifficulty = state.activeDifficulty === 'all' || p.difficulty === state.activeDifficulty;
        const matchesSearch = !state.searchQuery ||
            p.title.toLowerCase().includes(state.searchQuery) ||
            p.category.toLowerCase().includes(state.searchQuery) ||
            String(p.lcNumber).includes(state.searchQuery);
        return matchesFilter && matchesDifficulty && matchesSearch;
    });
}

function renderProblemList() {
    const filtered = getFilteredProblems();
    let html = '';
    let currentCategory = '';

    filtered.forEach(p => {
        if (p.category !== currentCategory) {
            currentCategory = p.category;
            html += `<div class="category-header">${currentCategory}</div>`;
        }

        const isCompleted = state.completed.includes(p.id);
        const isActive = state.currentProblemId === p.id;

        html += `
            <div class="problem-list-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}"
                 data-id="${p.id}" onclick="selectProblem(${p.id})">
                <div class="check-mark">${isCompleted ? '✓' : ''}</div>
                <div class="item-info">
                    <div class="item-title">${p.lcNumber}. ${p.title}</div>
                    <div class="item-meta">${p.category}</div>
                </div>
                <span class="diff-badge ${p.difficulty}">${p.difficulty}</span>
            </div>
        `;
    });

    if (!filtered.length) {
        html = '<div class="no-results">No problems found.</div>';
    }

    dom.problemList.innerHTML = html;
}

function toggleSidebar() {
    dom.sidebar.classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('visible');
}

function closeSidebar() {
    dom.sidebar.classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('visible');
}

function selectProblem(id) {
    state.currentProblemId = id;
    window.location.hash = `#problem-${id}`;
    closeSidebar();
    renderProblemDetail();
    renderProblemList(); // Update active state
}

function renderProblemDetail() {
    const p = problems.find(pr => pr.id === state.currentProblemId);
    if (!p) return;

    dom.welcomeScreen.style.display = 'none';
    dom.problemView.style.display = 'block';

    // Header
    dom.problemTitle.textContent = `${p.lcNumber}. ${p.title}`;
    dom.problemDifficulty.textContent = p.difficulty;
    dom.problemDifficulty.className = `badge difficulty ${p.difficulty}`;
    dom.problemCategory.textContent = p.category;
    dom.problemLC.textContent = `LC #${p.lcNumber}`;

    // Complete button
    const isComplete = state.completed.includes(p.id);
    dom.markCompleteBtn.textContent = isComplete ? 'Completed ✓' : 'Mark as Complete ✓';
    dom.markCompleteBtn.className = isComplete ? 'complete-btn is-complete' : 'complete-btn';

    // Description
    dom.problemDescription.innerHTML = formatText(p.description);

    // Examples
    if (p.examples) {
        dom.problemExamples.innerHTML = p.examples.map(ex =>
            `<div class="example-block">${escapeHtml(ex)}</div>`
        ).join('');
        $('#examplesSection').style.display = 'block';
    } else {
        $('#examplesSection').style.display = 'none';
    }

    // Thinking steps
    dom.thinkingSteps.innerHTML = p.thinkingProcess.map((step, i) => `
        <div class="thinking-step">
            <div class="step-number">${i + 1}</div>
            <div class="step-content">
                <h3>${step.step}</h3>
                <p>${formatText(step.detail)}</p>
            </div>
        </div>
    `).join('');

    // Key insight
    dom.keyInsight.innerHTML = formatText(p.keyInsight);

    // Approach
    dom.approach.innerHTML = formatText(p.approach);

    // Code
    showSolution(p);

    // Complexity
    dom.timeComplexity.textContent = p.timeComplexity;
    dom.spaceComplexity.textContent = p.spaceComplexity;

    // Pattern guide
    if (p.patternGuide) {
        dom.patternGuide.innerHTML = formatText(p.patternGuide);
        $('#patternSection').style.display = 'block';
    } else {
        $('#patternSection').style.display = 'none';
    }

    // Scroll to top
    $('#mainContent').scrollTop = 0;
}

// ===== NAVIGATION =====
function navigateProblem(direction) {
    if (!state.currentProblemId) return;
    const filtered = getFilteredProblems();
    const idx = filtered.findIndex(p => p.id === state.currentProblemId);
    const newIdx = idx + direction;
    if (newIdx >= 0 && newIdx < filtered.length) {
        selectProblem(filtered[newIdx].id);
    }
}

function handleHashNavigation() {
    const hash = window.location.hash;
    const match = hash.match(/#problem-(\d+)/);
    if (match) {
        const id = parseInt(match[1]);
        if (problems.find(p => p.id === id)) {
            state.currentProblemId = id;
            renderProblemDetail();
            renderProblemList();
        }
    }
}

// ===== PROGRESS =====
function toggleComplete() {
    if (!state.currentProblemId) return;
    const idx = state.completed.indexOf(state.currentProblemId);
    if (idx >= 0) {
        state.completed.splice(idx, 1);
    } else {
        state.completed.push(state.currentProblemId);
    }
    localStorage.setItem('completedProblems', JSON.stringify(state.completed));
    updateProgress();
    renderProblemDetail();
    renderProblemList();
}

function updateProgress() {
    const pct = (state.completed.length / problems.length) * 100;
    dom.progressBar.style.width = pct + '%';
    dom.progressText.textContent = `${state.completed.length} / ${problems.length} completed`;
    const mp = document.getElementById('mobileProgress');
    if (mp) mp.textContent = `${state.completed.length}/${problems.length}`;
}

// ===== UTILITIES =====
function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatText(text) {
    // Convert `code` to <code> tags
    return text.replace(/`([^`]+)`/g, '<code>$1</code>');
}

function copyCode() {
    const code = dom.solutionCode.textContent;
    navigator.clipboard.writeText(code).then(() => {
        const btn = $('.copy-btn');
        btn.textContent = '✓ Copied!';
        setTimeout(() => btn.textContent = '📋 Copy', 2000);
    });
}

function showSolution(p) {
    const lang = state.activeLang;
    const code = lang === 'python' ? p.solutionPython : p.solutionCpp;
    const prismLang = lang === 'python' ? 'python' : 'cpp';

    // Set language class and content
    dom.solutionCode.className = `language-${prismLang}`;
    dom.solutionCode.textContent = code;

    // Trigger Prism highlighting
    if (typeof Prism !== 'undefined') {
        Prism.highlightElement(dom.solutionCode);
    }

    document.querySelectorAll('.lang-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.lang === lang);
    });
}

function switchLang(lang) {
    state.activeLang = lang;
    const p = problems.find(pr => pr.id === state.currentProblemId);
    if (p) showSolution(p);
}

// ===== HOME =====
function goHome() {
    state.currentProblemId = null;
    state.activeFilter = 'all';
    state.activeDifficulty = 'all';
    state.searchQuery = '';
    dom.searchInput.value = '';
    $$('.filter-btn').forEach(b => b.classList.remove('active'));
    $$('.filter-btn')[0].classList.add('active');
    $$('.diff-filter-btn').forEach(b => b.classList.remove('active'));
    $$('.diff-filter-btn')[0].classList.add('active');
    window.location.hash = '';
    dom.problemView.style.display = 'none';
    $('#flashcardView').style.display = 'none';
    $('#changelogView').style.display = 'none';
    $('#fcFullscreen').style.display = 'none';
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    dom.welcomeScreen.style.display = 'flex';
    closeSidebar();
    renderProblemList();
}

// ===== CHANGELOG =====
function openChangelog() {
    dom.welcomeScreen.style.display = 'none';
    dom.problemView.style.display = 'none';
    $('#flashcardView').style.display = 'none';
    const view = $('#changelogView');
    view.style.display = 'flex';
    renderChangelog();
}

function closeChangelog() {
    $('#changelogView').style.display = 'none';
    goHome();
}

function renderChangelog() {
    const container = $('#clContent');
    container.innerHTML = changelog.map(release => `
        <div class="cl-release">
            <div class="cl-release-header">
                <span class="cl-version">v${release.version}</span>
                <span class="cl-release-title">${release.title}</span>
                <span class="cl-date">${release.date}</span>
            </div>
            <ul class="cl-changes">
                ${release.changes.map(c => `
                    <li class="cl-change">
                        <span class="cl-type ${c.type}">${c.type}</span>
                        <span>${c.text}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('');
}

// ===== START =====
document.addEventListener('DOMContentLoaded', init);

// ===== FLASHCARD LOGIC =====
const fcState = {
    mode: 'patterns', // 'patterns', 'problems', or 'design'
    deck: [],
    index: 0,
    category: 'all',
};

function buildProblemCards() {
    const catIcons = {};
    flashcards.forEach(f => { catIcons[f.category] = f.icon; });
    return problems.map(p => ({
        id: 'p' + p.id,
        category: p.category,
        difficulty: p.difficulty,
        icon: catIcons[p.category] || '📄',
        front: `LC ${p.lcNumber}. ${p.title}`,
        back: `Key Insight:\n${p.keyInsight}\n\nApproach:\n${p.approach}\n\nTime: ${p.timeComplexity} | Space: ${p.spaceComplexity}`,
    }));
}

function getSourceDeck() {
    if (fcState.mode === 'patterns') return flashcards;
    if (fcState.mode === 'design') return designFlashcards;
    return buildProblemCards();
}

function openFlashcards(mode) {
    fcState.mode = mode || 'patterns';
    dom.welcomeScreen.style.display = 'none';
    dom.problemView.style.display = 'none';
    $('#flashcardView').style.display = 'flex';
    $$('.fc-mode-tab').forEach(t => t.classList.toggle('active', t.dataset.fcMode === fcState.mode));
    fcState.category = 'all';
    const source = getSourceDeck();
    fcState.deck = [...source];
    fcState.index = 0;
    buildFcFilters(source);
    renderFcCard();
    initFcSwipe();
}

function switchFcMode(mode) {
    fcState.mode = mode;
    $$('.fc-mode-tab').forEach(t => t.classList.toggle('active', t.dataset.fcMode === mode));
    fcState.category = 'all';
    const source = getSourceDeck();
    fcState.deck = [...source];
    fcState.index = 0;
    buildFcFilters(source);
    renderFcCard();
}

function closeFlashcards() {
    $('#flashcardView').style.display = 'none';
    goHome();
}

function buildFcFilters(source) {
    const cats = [...new Set(source.map(f => f.category))];
    const container = $('#fcFilters');
    container.innerHTML = '<button class="fc-filter active" data-fc-cat="all">All</button>' +
        cats.map(c => `<button class="fc-filter" data-fc-cat="${c}">${c}</button>`).join('');
    container.querySelectorAll('.fc-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.fc-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            fcState.category = btn.dataset.fcCat;
            fcState.deck = fcState.category === 'all' ? [...source] : source.filter(f => f.category === fcState.category);
            fcState.index = 0;
            renderFcCard();
        });
    });
}

function renderFcCard() {
    const card = fcState.deck[fcState.index];
    if (!card) return;
    const fcCard = $('#fcCard');

    // Accent color per mode
    const accentColors = {
        patterns: 'linear-gradient(90deg, #4263eb, #6c5ce7, #a855f7)',
        problems: 'linear-gradient(90deg, #2b8a3e, #37b24d, #51cf66)',
        design:   'linear-gradient(90deg, #e67700, #f59f00, #fcc419)',
    };
    $('#fcCardAccent').style.background = accentColors[fcState.mode] || accentColors.patterns;

    // Category label
    $('#fcCategoryLabel').textContent = card.category;

    // Show/hide meta badges for problem mode
    let metaEl = fcCard.querySelector('.fc-card-meta');
    if (card.difficulty) {
        if (!metaEl) {
            metaEl = document.createElement('div');
            metaEl.className = 'fc-card-meta';
            fcCard.querySelector('.fc-card-header').after(metaEl);
        }
        metaEl.innerHTML = `<span class="fc-badge ${card.difficulty}">${card.difficulty}</span><span class="fc-badge cat">${card.category}</span>`;
        metaEl.style.display = 'flex';
    } else if (metaEl) {
        metaEl.style.display = 'none';
    }

    // Re-trigger slide animation
    fcCard.style.animation = 'none';
    fcCard.offsetHeight; // reflow
    fcCard.style.animation = '';

    $('#fcIcon').textContent = card.icon;
    $('#fcFrontText').textContent = card.front;
    $('#fcBackText').textContent = card.back;
    $('#fcCounter').textContent = `${fcState.index + 1} / ${fcState.deck.length}`;
    $('#fcPrev').disabled = fcState.index === 0;
    $('#fcNext').disabled = fcState.index === fcState.deck.length - 1;
    $('#fcProgressFill').style.width = ((fcState.index + 1) / fcState.deck.length * 100) + '%';
}

function fcNavigate(dir) {
    const newIdx = fcState.index + dir;
    if (newIdx >= 0 && newIdx < fcState.deck.length) {
        fcState.index = newIdx;
        renderFcCard();
    }
}

function fcShuffle() {
    for (let i = fcState.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fcState.deck[i], fcState.deck[j]] = [fcState.deck[j], fcState.deck[i]];
    }
    fcState.index = 0;
    renderFcCard();
}

function initFcSwipe() {
    const stage = $('#fcCardWrapper');
    let startX = 0;
    stage.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', e => {
        const diff = e.changedTouches[0].clientX - startX;
        if (Math.abs(diff) > 50) fcNavigate(diff < 0 ? 1 : -1);
    }, { passive: true });
}

// ===== FULLSCREEN FLASHCARD MODE =====
function openFcFullscreen() {
    const overlay = $('#fcFullscreen');
    const track = $('#fcfsTrack');
    const accentClass = fcState.mode;

    // Render all cards in the track
    track.innerHTML = fcState.deck.map((card, i) => `
        <div class="fcfs-card" data-idx="${i}">
            <div class="fcfs-card-inner">
                <div class="fcfs-card-accent ${accentClass}"></div>
                <div class="fcfs-card-head">
                    <span class="fcfs-card-icon">${card.icon}</span>
                    <div class="fcfs-card-title-wrap">
                        <h3>${card.front}</h3>
                        <span class="fcfs-card-cat">${card.category}</span>
                    </div>
                </div>
                ${card.difficulty ? `<div class="fc-card-meta" style="padding:0 26px;margin:10px 0 0"><span class="fc-badge ${card.difficulty}">${card.difficulty}</span><span class="fc-badge cat">${card.category}</span></div>` : ''}
                <div class="fcfs-card-body">
                    <pre>${card.back}</pre>
                </div>
            </div>
            <span class="fcfs-card-num">${i + 1} / ${fcState.deck.length}</span>
        </div>
    `).join('');

    overlay.style.display = 'flex';
    // Cross-device scroll lock (iOS + Android)
    document.body.dataset.scrollY = window.scrollY;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${window.scrollY}px`;
    // Set real viewport height via JS for devices where CSS units fail
    const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    overlay.style.height = vh + 'px';
    track.querySelectorAll('.fcfs-card').forEach(c => c.style.height = vh + 'px');

    // Scroll to current card
    requestAnimationFrame(() => {
        const target = track.children[fcState.index];
        if (target) {
            // Use scrollTop for broader mobile support
            track.scrollTop = target.offsetTop;
        }
        updateFcfsChrome();
    });

    // Track scroll to update counter
    track._scrollHandler = () => {
        const scrollTop = track.scrollTop;
        const cardH = track.children[0]?.offsetHeight || window.innerHeight;
        const idx = Math.round(scrollTop / cardH);
        if (idx !== fcState.index && idx >= 0 && idx < fcState.deck.length) {
            fcState.index = idx;
            updateFcfsChrome();
            renderFcCard();
        }
    };
    track.addEventListener('scroll', track._scrollHandler, { passive: true });

    // Keyboard
    document._fcfsKeyHandler = (e) => {
        if (e.key === 'ArrowUp') { e.preventDefault(); fcfsNavigate(-1); }
        if (e.key === 'ArrowDown') { e.preventDefault(); fcfsNavigate(1); }
        if (e.key === 'Escape') closeFcFullscreen();
    };
    document.addEventListener('keydown', document._fcfsKeyHandler);

    // Handle orientation change and virtual keyboard resize
    window._fcfsResizeHandler = () => {
        const newVh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        overlay.style.height = newVh + 'px';
        track.querySelectorAll('.fcfs-card').forEach(c => c.style.height = newVh + 'px');
    };
    (window.visualViewport || window).addEventListener('resize', window._fcfsResizeHandler);
}

function closeFcFullscreen() {
    const overlay = $('#fcFullscreen');
    const track = $('#fcfsTrack');
    overlay.style.display = 'none';
    overlay.style.height = '';
    track.querySelectorAll('.fcfs-card').forEach(c => c.style.height = '');
    // Restore scroll (iOS + Android)
    const scrollY = parseInt(document.body.dataset.scrollY || '0');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
    if (track._scrollHandler) track.removeEventListener('scroll', track._scrollHandler);
    if (document._fcfsKeyHandler) document.removeEventListener('keydown', document._fcfsKeyHandler);
    // Remove resize listener
    if (window._fcfsResizeHandler) {
        (window.visualViewport || window).removeEventListener('resize', window._fcfsResizeHandler);
        window._fcfsResizeHandler = null;
    }
}

function fcfsNavigate(dir) {
    const track = $('#fcfsTrack');
    const newIdx = fcState.index + dir;
    if (newIdx >= 0 && newIdx < fcState.deck.length) {
        fcState.index = newIdx;
        const target = track.children[newIdx];
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateFcfsChrome();
        renderFcCard();
    }
}

function updateFcfsChrome() {
    $('#fcfsCounter').textContent = `${fcState.index + 1} / ${fcState.deck.length}`;
    $('#fcfsProgressFill').style.width = ((fcState.index + 1) / fcState.deck.length * 100) + '%';
}
