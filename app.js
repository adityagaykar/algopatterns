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
const THEME_ORDER = ['light', 'dark', 'blue'];
const THEME_ICONS = { light: '☀️', dark: '🌙', blue: '🌊' };
const THEME_TITLES = {
    light: 'Light theme — click for Dark',
    dark: 'Dark theme — click for Blue',
    blue: 'Blue theme — click for Light'
};
function applyTheme(theme) {
    if (!THEME_ORDER.includes(theme)) theme = 'light';
    document.documentElement.setAttribute('data-theme', theme);
    const icon = THEME_ICONS[theme];
    const title = THEME_TITLES[theme];
    const t1 = document.getElementById('themeToggle');
    const t2 = document.getElementById('themeToggleMobile');
    if (t1) { t1.textContent = icon; t1.title = title; t1.setAttribute('aria-label', title); }
    if (t2) { t2.textContent = icon; t2.title = title; t2.setAttribute('aria-label', title); }
    localStorage.setItem('theme', theme);
}
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const idx = THEME_ORDER.indexOf(current);
    const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
    applyTheme(next);
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
    renderPatternGrid();
    renderProblemList();
    renderAimlGrid();
    renderBasicsGrid();
    renderDevSkillsGrid();
    renderBasicsSidebar();
    renderAimlSidebar();
    renderDevSkillsSidebar();
    updateHomeTabCounts();
    restoreHomeTab();
    updateProgress();
    bindEvents();
    bindHomeTabsScroll();
    handleHashNavigation();
}

// Toggle a `.scrolled-end` class on the .home-tabs strip when scrolled to the right edge
// (used by mobile CSS to drop the right-edge fade mask)
function bindHomeTabsScroll() {
    const strip = document.querySelector('.home-tabs');
    if (!strip) return;
    const update = () => {
        const atEnd = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 4;
        strip.classList.toggle('scrolled-end', atEnd);
    };
    strip.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
}

// ===== HOME TABS =====
function switchHomeTab(tab) {
    document.querySelectorAll('.home-tab').forEach(t => {
        const active = t.dataset.homeTab === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
        if (active && typeof t.scrollIntoView === 'function') {
            try { t.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); } catch (e) {}
        }
    });
    document.querySelectorAll('.home-section').forEach(s => {
        s.classList.toggle('active', s.dataset.homeSection === tab);
    });
    syncSidebarToTab(tab);
    try { localStorage.setItem('homeTab', tab); } catch (e) {}
    // Scroll the welcome inner back to top so the user sees the section start
    const welcome = document.getElementById('welcomeScreen');
    if (welcome) welcome.scrollTo({ top: 0, behavior: 'smooth' });
}

function restoreHomeTab() {
    let tab = 'algos';
    try { tab = localStorage.getItem('homeTab') || 'algos'; } catch (e) {}
    if (!['algos', 'basics', 'aiml', 'devskills'].includes(tab)) tab = 'algos';
    document.querySelectorAll('.home-tab').forEach(t => {
        const active = t.dataset.homeTab === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    document.querySelectorAll('.home-section').forEach(s => {
        s.classList.toggle('active', s.dataset.homeSection === tab);
    });
    syncSidebarToTab(tab);
}

function syncSidebarToTab(tab) {
    document.querySelectorAll('.sidebar-section').forEach(sec => {
        sec.style.display = sec.dataset.sidebarSection === tab ? 'flex' : 'none';
    });
}

function updateHomeTabCounts() {
    const algoC = document.querySelector('.home-tab[data-home-tab="algos"] .home-tab-count');
    if (algoC && typeof problems !== 'undefined') algoC.textContent = problems.length;
    const bc = document.getElementById('basicsTabCount');
    const ac = document.getElementById('aimlTabCount');
    const dc = document.getElementById('devskillsTabCount');
    if (bc && typeof aiMlBasics !== 'undefined') bc.textContent = aiMlBasics.length;
    if (ac && typeof aiMlProblems !== 'undefined') ac.textContent = aiMlProblems.length;
    if (dc && typeof aiDevSkills !== 'undefined') dc.textContent = aiDevSkills.length;
}

// ===== PATTERN GRID =====
const PATTERN_ICONS = {
    'Two Pointers': '👆',
    'Sliding Window': '🪟',
    'Binary Search': '🔍',
    'Stack': '📚',
    'Heap / Priority Queue': '⛰️',
    'Linked List': '🔗',
    'Trees': '🌳',
    'Graph BFS/DFS': '🕸️',
    'Topological Sort': '📊',
    'Union Find': '🤝',
    'Dynamic Programming': '🧩',
    'Backtracking': '↩️',
    'Greedy': '💰',
    'Intervals': '📏',
    'Trie': '🔤',
    'String': '📝',
    'Math / Bit Manipulation': '🔢',
    'Design': '🏗️',
    'Matrix': '⬜',
};
const PATTERN_SHORT = {
    'Heap / Priority Queue': 'Heap',
    'Math / Bit Manipulation': 'Math / Bit',
    'Topological Sort': 'Topo Sort',
};

function renderPatternGrid() {
    const grid = document.getElementById('patternGrid');
    if (!grid || typeof problems === 'undefined') return;

    // Count per category, preserving first-seen order from problems data
    const counts = {};
    const order = [];
    problems.forEach(p => {
        if (!(p.category in counts)) order.push(p.category);
        counts[p.category] = (counts[p.category] || 0) + 1;
    });

    grid.innerHTML = order.map(cat => {
        const icon = PATTERN_ICONS[cat] || '🔹';
        const label = PATTERN_SHORT[cat] || cat;
        return `
            <div class="pattern-card" data-category="${cat}">
                <span class="pattern-icon">${icon}</span>
                <span>${label}</span>
                <span class="count">${counts[cat]}</span>
            </div>`;
    }).join('');
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
            $$('#filterButtons .filter-btn').forEach(b => b.classList.remove('active'));
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
    // (Mark-as-complete UI removed; progress tracking retained for future use)

    // Pattern cards on welcome screen (delegated since rendered dynamically)
    const patternGridEl = document.getElementById('patternGrid');
    if (patternGridEl) {
        patternGridEl.addEventListener('click', (e) => {
            const card = e.target.closest('.pattern-card');
            if (!card) return;
            const category = card.dataset.category;
            $$('#filterButtons .filter-btn').forEach(b => b.classList.remove('active'));
            const matchBtn = [...$$('#filterButtons .filter-btn')].find(b => b.dataset.filter === category);
            if (matchBtn) matchBtn.classList.add('active');
            state.activeFilter = category;
            renderProblemList();

            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                const firstProblem = problems.find(p => p.category === category);
                if (firstProblem) {
                    selectProblem(firstProblem.id);
                } else {
                    toggleSidebar();
                }
            } else {
                // Desktop: scroll main + welcome view back to the top so the
                // user sees the updated sidebar list / category context.
                const main = document.getElementById('mainContent');
                if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
                const welcome = document.getElementById('welcomeScreen');
                if (welcome) welcome.scrollTo({ top: 0, behavior: 'smooth' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Also scroll the sidebar problem list back to the top so the
                // first item in the newly filtered category is visible.
                const list = document.getElementById('problemList');
                if (list) list.scrollTop = 0;
            }
        });
    }

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
    const aimlV = document.getElementById('aimlView');
    if (aimlV) aimlV.style.display = 'none';
    const basicsV = document.getElementById('basicsView');
    if (basicsV) basicsV.style.display = 'none';

    // Header
    dom.problemTitle.textContent = `${p.lcNumber}. ${p.title}`;
    dom.problemDifficulty.textContent = p.difficulty;
    dom.problemDifficulty.className = `badge difficulty ${p.difficulty}`;
    dom.problemCategory.textContent = p.category;
    dom.problemLC.textContent = `LC #${p.lcNumber}`;

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
        return;
    }
    const am = hash.match(/#aiml-(\d+)/);
    if (am) {
        const id = parseInt(am[1]);
        if (typeof aiMlProblems !== 'undefined' && aiMlProblems.find(p => p.id === id)) {
            selectAimlProblem(id);
        }
        return;
    }
    const bm = hash.match(/#basics-(\d+)/);
    if (bm) {
        const id = parseInt(bm[1]);
        if (typeof aiMlBasics !== 'undefined' && aiMlBasics.find(p => p.id === id)) {
            selectBasic(id);
        }
    } else if (hash.startsWith('#devskills-')) {
        const id = parseInt(hash.replace('#devskills-', ''), 10);
        if (typeof aiDevSkills !== 'undefined' && aiDevSkills.find(p => p.id === id)) {
            selectDevSkill(id);
        }
    }
}

// ===== PROGRESS =====
function updateProgress() {
    if (!problems || !problems.length) return;
    const pct = (state.completed.length / problems.length) * 100;
    if (dom.progressBar) dom.progressBar.style.width = pct + '%';
    if (dom.progressText) dom.progressText.textContent = `${state.completed.length} / ${problems.length} completed`;
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
    $$('#filterButtons .filter-btn').forEach(b => b.classList.remove('active'));
    const firstFilterBtn = $('#filterButtons .filter-btn');
    if (firstFilterBtn) firstFilterBtn.classList.add('active');
    $$('.diff-filter-btn').forEach(b => b.classList.remove('active'));
    $$('.diff-filter-btn')[0].classList.add('active');
    window.location.hash = '';
    dom.problemView.style.display = 'none';
    $('#flashcardView').style.display = 'none';
    $('#changelogView').style.display = 'none';
    const aimlV = document.getElementById('aimlView');
    if (aimlV) aimlV.style.display = 'none';
    const basicsV = document.getElementById('basicsView');
    if (basicsV) basicsV.style.display = 'none';
    const devSkillsV = document.getElementById('devSkillsView');
    if (devSkillsV) devSkillsV.style.display = 'none';
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
    if (fcState.mode === 'ai-ml') return aiMlFlashcards;
    if (fcState.mode === 'ai-ml-basics') return aiMlBasicsFlashcards;
    if (fcState.mode === 'ai-dev-skills') return aiDevSkillsFlashcards;
    return buildProblemCards();
}

function openFlashcards(mode) {
    fcState.mode = mode || 'patterns';
    dom.welcomeScreen.style.display = 'none';
    dom.problemView.style.display = 'none';
    const aimlV = document.getElementById('aimlView');
    if (aimlV) aimlV.style.display = 'none';
    const basicsV = document.getElementById('basicsView');
    if (basicsV) basicsV.style.display = 'none';
    const devSkillsV = document.getElementById('devSkillsView');
    if (devSkillsV) devSkillsV.style.display = 'none';
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
        'ai-ml':  'linear-gradient(90deg, #c92a92, #d6336c, #f76707)',
        'ai-ml-basics': 'linear-gradient(90deg, #0891b2, #14b8a6, #5eead4)',
        'ai-dev-skills': 'linear-gradient(90deg, #f59e0b, #ec4899, #8b5cf6)',
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

// ===== AI / ML SECTION =====
function renderAimlGrid() {
    const grid = document.getElementById('aimlGrid');
    if (!grid || typeof aiMlProblems === 'undefined') return;

    let html = '';
    aiMlProblems.forEach(p => {
        html += `
            <div class="aiml-tile" onclick="selectAimlProblem(${p.id})">
                <div class="aiml-tile-icon">${p.icon}</div>
                <div class="aiml-tile-body">
                    <div class="aiml-tile-cat">${p.category}</div>
                    <div class="aiml-tile-title">${p.title}</div>
                    <div class="aiml-tile-summary">${p.summary || ''}</div>
                    <div class="aiml-tile-meta">
                        <span class="diff-badge ${p.difficulty}">${p.difficulty}</span>
                    </div>
                </div>
            </div>`;
    });
    grid.innerHTML = html;
}

function selectAimlProblem(id) {
    const p = aiMlProblems.find(pr => pr.id === id);
    if (!p) return;
    window.location.hash = `#aiml-${id}`;
    closeSidebar();
    dom.welcomeScreen.style.display = 'none';
    dom.problemView.style.display = 'none';
    $('#flashcardView').style.display = 'none';
    $('#changelogView').style.display = 'none';
    const view = document.getElementById('aimlView');
    view.style.display = 'block';
    renderAimlDetail(p);
    renderAimlSidebar();
    window.scrollTo(0, 0);
}

function renderAimlDetail(p) {
    document.getElementById('aimlTitle').textContent = `${p.icon} ${p.title}`;
    const diff = document.getElementById('aimlDifficulty');
    diff.textContent = p.difficulty;
    diff.className = `badge difficulty ${p.difficulty}`;
    document.getElementById('aimlCategory').textContent = p.category;

    const list = (arr) => `<ul>${(arr || []).map(x => `<li>${formatText(escapeHtml(x))}</li>`).join('')}</ul>`;
    const para = (s) => s ? `<p>${formatText(escapeHtml(s)).replace(/\n/g, '<br>')}</p>` : '';

    let html = '';
    if (p.summary) html += `<div class="aiml-section aiml-summary"><p>${formatText(escapeHtml(p.summary))}</p></div>`;

    const section = (title, icon, body) => `
        <div class="aiml-section">
            <h2><span class="aiml-h-icon">${icon}</span> ${title}</h2>
            ${body}
        </div>`;

    if (p.clarifyingQuestions && p.clarifyingQuestions.length)
        html += section('Clarifying Questions', '❓', list(p.clarifyingQuestions));

    if (p.requirements) {
        html += section('Requirements', '📋', `
            <div class="aiml-two-col">
                <div><h4>Functional</h4>${list(p.requirements.functional)}</div>
                <div><h4>Non-Functional</h4>${list(p.requirements.nonFunctional)}</div>
            </div>`);
    }

    if (p.metrics) {
        html += section('Success Metrics', '📈', `
            <div class="aiml-two-col">
                <div><h4>Offline</h4>${list(p.metrics.offline)}</div>
                <div><h4>Online (Business)</h4>${list(p.metrics.online)}</div>
            </div>`);
    }

    if (p.dataAndLabels) html += section('Data & Labels', '🗄️', para(p.dataAndLabels));
    if (p.features && p.features.length) html += section('Features', '🧩', list(p.features));
    if (p.modelChoice) html += section('Model Choice', '🧠', para(p.modelChoice));
    if (p.trainingPipeline) html += section('Training Pipeline', '⚙️', para(p.trainingPipeline));
    if (p.evaluation) html += section('Evaluation Strategy', '🧪', para(p.evaluation));
    if (p.serving) html += section('Serving Architecture', '🚀', para(p.serving));
    if (p.scaling) html += section('Scaling', '📡', para(p.scaling));
    if (p.monitoring) html += section('Monitoring & Feedback Loops', '🔭', para(p.monitoring));
    if (p.risks && p.risks.length) html += section('Risks & Mitigations', '⚠️', list(p.risks));
    if (p.followups && p.followups.length) html += section('Follow-up Questions', '💬', list(p.followups));

    document.getElementById('aimlContent').innerHTML = html;
}

// ===== AI / ML BASICS =====
const basicsState = { activeTrack: 'all' };

function renderBasicsGrid() {
    if (typeof aiMlBasics === 'undefined') return;
    const tracksEl = document.getElementById('basicsTracks');
    const grid = document.getElementById('basicsGrid');
    if (!grid) return;

    // Build track filter pills
    const tracks = ['all', ...Array.from(new Set(aiMlBasics.map(b => b.track)))];
    if (tracksEl) {
        tracksEl.innerHTML = tracks.map(t => `
            <button class="basics-track-pill ${basicsState.activeTrack === t ? 'active' : ''}"
                    onclick="filterBasics('${t.replace(/'/g, "\\'")}')">${t === 'all' ? 'All' : t}</button>
        `).join('');
    }

    const visible = basicsState.activeTrack === 'all'
        ? aiMlBasics
        : aiMlBasics.filter(b => b.track === basicsState.activeTrack);

    grid.innerHTML = visible.map(b => `
        <div class="basics-tile" onclick="selectBasic(${b.id})">
            <div class="basics-tile-icon">${b.icon}</div>
            <div class="basics-tile-body">
                <div class="basics-tile-track">${b.track}</div>
                <div class="basics-tile-title">${b.title}</div>
                <div class="basics-tile-summary">${b.summary || ''}</div>
                <div class="basics-tile-meta">
                    <span class="diff-badge ${b.difficulty}">${b.difficulty}</span>
                </div>
            </div>
        </div>`).join('');
}

function filterBasics(track) {
    basicsState.activeTrack = track;
    renderBasicsGrid();
}

function selectBasic(id) {
    const b = aiMlBasics.find(x => x.id === id);
    if (!b) return;
    window.location.hash = `#basics-${id}`;
    closeSidebar();
    dom.welcomeScreen.style.display = 'none';
    dom.problemView.style.display = 'none';
    $('#flashcardView').style.display = 'none';
    $('#changelogView').style.display = 'none';
    const aimlV = document.getElementById('aimlView');
    if (aimlV) aimlV.style.display = 'none';
    document.getElementById('basicsView').style.display = 'block';
    renderBasicDetail(b);
    renderBasicsSidebar();
    window.scrollTo(0, 0);
}

function renderBasicDetail(b) {
    document.getElementById('basicsTitle').textContent = `${b.icon} ${b.title}`;
    const diff = document.getElementById('basicsDifficulty');
    diff.textContent = b.difficulty;
    diff.className = `badge difficulty ${b.difficulty}`;
    document.getElementById('basicsTrack').textContent = b.track;

    const list = (arr) => `<ul>${(arr || []).map(x => `<li>${formatText(escapeHtml(x))}</li>`).join('')}</ul>`;
    const para = (s) => s ? `<p>${formatText(escapeHtml(s))}</p>` : '';
    const codeList = (arr) => `<div class="basics-formulas">${(arr || []).map(x => `<code>${escapeHtml(x)}</code>`).join('')}</div>`;

    const section = (title, icon, body) => `
        <div class="basics-section">
            <h2><span class="basics-h-icon">${icon}</span> ${title}</h2>
            ${body}
        </div>`;

    let html = '';
    if (b.summary) html += `<div class="basics-section basics-summary"><p>${formatText(escapeHtml(b.summary))}</p></div>`;
    if (b.keyPoints && b.keyPoints.length) html += section('Key Concepts', '🎯', list(b.keyPoints));
    if (b.formulas && b.formulas.length) html += section('Key Formulas', '📐', codeList(b.formulas));
    if (b.whenToUse) html += section('When to Use', '✅', para(b.whenToUse));
    if (b.commonPitfalls && b.commonPitfalls.length) html += section('Common Pitfalls', '⚠️', list(b.commonPitfalls));
    if (b.relatedConcepts && b.relatedConcepts.length)
        html += section('Related Concepts', '🔗',
            `<div class="basics-tags">${b.relatedConcepts.map(c => `<span class="basics-tag">${escapeHtml(c)}</span>`).join('')}</div>`);
    if (b.interviewQs && b.interviewQs.length) html += section('Interview Questions to Practice', '💬', list(b.interviewQs));

    document.getElementById('basicsContent').innerHTML = html;
}

// ===== SIDEBAR LISTS: BASICS & AI/ML =====
const basicsSidebarState = { search: '', track: 'all' };
const aimlSidebarState   = { search: '', category: 'all' };

function renderBasicsSidebar() {
    if (typeof aiMlBasics === 'undefined') return;
    const filtersEl = document.getElementById('basicsTrackFilters');
    const listEl = document.getElementById('basicsList');
    if (!listEl) return;

    // Track filter pills
    const tracks = ['all', ...Array.from(new Set(aiMlBasics.map(b => b.track)))];
    if (filtersEl) {
        filtersEl.innerHTML = tracks.map(t => `
            <button class="filter-btn ${basicsSidebarState.track === t ? 'active' : ''}"
                    onclick="setBasicsSidebarTrack('${t.replace(/'/g, "\\'")}')">${t === 'all' ? 'All' : t}</button>
        `).join('');
    }

    const q = basicsSidebarState.search.toLowerCase();
    const filtered = aiMlBasics.filter(b => {
        const matchesTrack = basicsSidebarState.track === 'all' || b.track === basicsSidebarState.track;
        const matchesQ = !q || b.title.toLowerCase().includes(q) || b.track.toLowerCase().includes(q);
        return matchesTrack && matchesQ;
    });

    let html = '';
    let currentTrack = '';
    filtered.forEach(b => {
        if (b.track !== currentTrack) {
            currentTrack = b.track;
            html += `<div class="category-header">${currentTrack}</div>`;
        }
        const isActive = (location.hash === `#basics-${b.id}`);
        html += `
            <div class="problem-list-item basics-list-item ${isActive ? 'active' : ''}"
                 onclick="selectBasic(${b.id})">
                <div class="check-mark">${b.icon}</div>
                <div class="item-info">
                    <div class="item-title">${b.title}</div>
                    <div class="item-meta">${b.track}</div>
                </div>
                <span class="diff-badge ${b.difficulty}">${b.difficulty}</span>
            </div>`;
    });
    if (!filtered.length) html = '<div class="no-results">No concepts found.</div>';
    listEl.innerHTML = html;
}

function setBasicsSidebarTrack(t) {
    basicsSidebarState.track = t;
    renderBasicsSidebar();
}

function renderAimlSidebar() {
    if (typeof aiMlProblems === 'undefined') return;
    const filtersEl = document.getElementById('aimlCategoryFilters');
    const listEl = document.getElementById('aimlList');
    if (!listEl) return;

    const cats = ['all', ...Array.from(new Set(aiMlProblems.map(p => p.category)))];
    if (filtersEl) {
        filtersEl.innerHTML = cats.map(c => `
            <button class="filter-btn ${aimlSidebarState.category === c ? 'active' : ''}"
                    onclick="setAimlSidebarCategory('${c.replace(/'/g, "\\'")}')">${c === 'all' ? 'All' : c}</button>
        `).join('');
    }

    const q = aimlSidebarState.search.toLowerCase();
    const filtered = aiMlProblems.filter(p => {
        const matchesCat = aimlSidebarState.category === 'all' || p.category === aimlSidebarState.category;
        const matchesQ = !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
        return matchesCat && matchesQ;
    });

    let html = '';
    let currentCat = '';
    filtered.forEach(p => {
        if (p.category !== currentCat) {
            currentCat = p.category;
            html += `<div class="category-header">${currentCat}</div>`;
        }
        const isActive = (location.hash === `#aiml-${p.id}`);
        html += `
            <div class="problem-list-item aiml-list-item ${isActive ? 'active' : ''}"
                 onclick="selectAimlProblem(${p.id})">
                <div class="check-mark">${p.icon}</div>
                <div class="item-info">
                    <div class="item-title">${p.title}</div>
                    <div class="item-meta">${p.category}</div>
                </div>
                <span class="diff-badge ${p.difficulty}">${p.difficulty}</span>
            </div>`;
    });
    if (!filtered.length) html = '<div class="no-results">No problems found.</div>';
    listEl.innerHTML = html;
}

function setAimlSidebarCategory(c) {
    aimlSidebarState.category = c;
    renderAimlSidebar();
}

// ===== AI for Devs =====
const devSkillsState = { activeTrack: 'all' };
const devSkillsSidebarState = { search: '', track: 'all' };

function renderDevSkillsGrid() {
    if (typeof aiDevSkills === 'undefined') return;
    const tracksEl = document.getElementById('devskillsTracks');
    const grid = document.getElementById('devskillsGrid');
    if (!grid) return;

    const tracks = ['all', ...Array.from(new Set(aiDevSkills.map(b => b.track)))];
    if (tracksEl) {
        tracksEl.innerHTML = tracks.map(t => `
            <button class="basics-track-pill ${devSkillsState.activeTrack === t ? 'active' : ''}"
                    onclick="filterDevSkills('${t.replace(/'/g, "\\'")}')">${t === 'all' ? 'All' : t}</button>
        `).join('');
    }

    const visible = devSkillsState.activeTrack === 'all'
        ? aiDevSkills
        : aiDevSkills.filter(b => b.track === devSkillsState.activeTrack);

    grid.innerHTML = visible.map(b => `
        <div class="basics-tile devskills-tile" onclick="selectDevSkill(${b.id})">
            <div class="basics-tile-icon">${b.icon}</div>
            <div class="basics-tile-body">
                <div class="basics-tile-track">${b.track}</div>
                <div class="basics-tile-title">${b.title}</div>
                <div class="basics-tile-summary">${b.summary || ''}</div>
                <div class="basics-tile-meta">
                    <span class="diff-badge ${b.difficulty}">${b.difficulty}</span>
                </div>
            </div>
        </div>`).join('');
}

function filterDevSkills(track) {
    devSkillsState.activeTrack = track;
    renderDevSkillsGrid();
}

function selectDevSkill(id) {
    const b = aiDevSkills.find(x => x.id === id);
    if (!b) return;
    window.location.hash = `#devskills-${id}`;
    closeSidebar();
    dom.welcomeScreen.style.display = 'none';
    dom.problemView.style.display = 'none';
    $('#flashcardView').style.display = 'none';
    $('#changelogView').style.display = 'none';
    const aimlV = document.getElementById('aimlView');
    if (aimlV) aimlV.style.display = 'none';
    const basicsV = document.getElementById('basicsView');
    if (basicsV) basicsV.style.display = 'none';
    document.getElementById('devSkillsView').style.display = 'block';
    renderDevSkillDetail(b);
    renderDevSkillsSidebar();
    window.scrollTo(0, 0);
}

function renderDevSkillDetail(b) {
    document.getElementById('devSkillsTitle').textContent = `${b.icon} ${b.title}`;
    const diff = document.getElementById('devSkillsDifficulty');
    diff.textContent = b.difficulty;
    diff.className = `badge difficulty ${b.difficulty}`;
    document.getElementById('devSkillsTrack').textContent = b.track;

    const list = (arr) => `<ul>${(arr || []).map(x => `<li>${formatText(escapeHtml(x))}</li>`).join('')}</ul>`;
    const para = (s) => s ? `<p>${formatText(escapeHtml(s))}</p>` : '';
    const codeList = (arr) => `<div class="basics-formulas">${(arr || []).map(x => `<code>${escapeHtml(x)}</code>`).join('')}</div>`;
    const section = (title, icon, body) => `
        <div class="basics-section">
            <h2><span class="basics-h-icon">${icon}</span> ${title}</h2>
            ${body}
        </div>`;

    let html = '';
    if (b.summary) html += `<div class="basics-section basics-summary"><p>${formatText(escapeHtml(b.summary))}</p></div>`;
    if (b.keyPoints && b.keyPoints.length) html += section('Key Concepts', '🎯', list(b.keyPoints));
    if (b.formulas && b.formulas.length) html += section('Snippets & Templates', '🧩', codeList(b.formulas));
    if (b.whenToUse) html += section('When to Use', '✅', para(b.whenToUse));
    if (b.commonPitfalls && b.commonPitfalls.length) html += section('Common Pitfalls', '⚠️', list(b.commonPitfalls));
    if (b.relatedConcepts && b.relatedConcepts.length)
        html += section('Related Concepts', '🔗',
            `<div class="basics-tags">${b.relatedConcepts.map(c => `<span class="basics-tag">${escapeHtml(c)}</span>`).join('')}</div>`);
    if (b.interviewQs && b.interviewQs.length) html += section('Interview Questions to Practice', '💬', list(b.interviewQs));
    if (b.showcaseSignals && b.showcaseSignals.length) html += section('How to Showcase This', '🎤', list(b.showcaseSignals));

    document.getElementById('devSkillsContent').innerHTML = html;
}

function renderDevSkillsSidebar() {
    if (typeof aiDevSkills === 'undefined') return;
    const filtersEl = document.getElementById('devskillsTrackFilters');
    const listEl = document.getElementById('devskillsList');
    if (!listEl) return;

    const tracks = ['all', ...Array.from(new Set(aiDevSkills.map(b => b.track)))];
    if (filtersEl) {
        filtersEl.innerHTML = tracks.map(t => `
            <button class="filter-btn ${devSkillsSidebarState.track === t ? 'active' : ''}"
                    onclick="setDevSkillsSidebarTrack('${t.replace(/'/g, "\\'")}')">${t === 'all' ? 'All' : t}</button>
        `).join('');
    }

    const q = devSkillsSidebarState.search.toLowerCase();
    const filtered = aiDevSkills.filter(b => {
        const matchesTrack = devSkillsSidebarState.track === 'all' || b.track === devSkillsSidebarState.track;
        const matchesQ = !q || b.title.toLowerCase().includes(q) || b.track.toLowerCase().includes(q);
        return matchesTrack && matchesQ;
    });

    let html = '';
    let currentTrack = '';
    filtered.forEach(b => {
        if (b.track !== currentTrack) {
            currentTrack = b.track;
            html += `<div class="category-header">${currentTrack}</div>`;
        }
        const isActive = (location.hash === `#devskills-${b.id}`);
        html += `
            <div class="problem-list-item basics-list-item ${isActive ? 'active' : ''}"
                 onclick="selectDevSkill(${b.id})">
                <div class="check-mark">${b.icon}</div>
                <div class="item-info">
                    <div class="item-title">${b.title}</div>
                    <div class="item-meta">${b.track}</div>
                </div>
                <span class="diff-badge ${b.difficulty}">${b.difficulty}</span>
            </div>`;
    });
    if (!filtered.length) html = '<div class="no-results">No skills found.</div>';
    listEl.innerHTML = html;
}

function setDevSkillsSidebarTrack(t) {
    devSkillsSidebarState.track = t;
    renderDevSkillsSidebar();
}

// Bind search inputs once DOM is ready
(function bindSidebarSearches() {
    const onReady = () => {
        const bs = document.getElementById('basicsSearchInput');
        if (bs) bs.addEventListener('input', (e) => {
            basicsSidebarState.search = e.target.value;
            renderBasicsSidebar();
        });
        const as = document.getElementById('aimlSearchInput');
        if (as) as.addEventListener('input', (e) => {
            aimlSidebarState.search = e.target.value;
            renderAimlSidebar();
        });
        const ds = document.getElementById('devskillsSearchInput');
        if (ds) ds.addEventListener('input', (e) => {
            devSkillsSidebarState.search = e.target.value;
            renderDevSkillsSidebar();
        });
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onReady);
    } else {
        onReady();
    }
})();

