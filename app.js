// ===== APP STATE =====
const state = {
    currentProblemId: null,
    activeFilter: 'all',
    activeDifficulty: 'all',
    searchQuery: '',
    activeLang: 'python',
    completed: JSON.parse(localStorage.getItem('completedProblems') || '[]')
};

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
    dom.welcomeScreen.style.display = 'flex';
    closeSidebar();
    renderProblemList();
}

// ===== START =====
document.addEventListener('DOMContentLoaded', init);
