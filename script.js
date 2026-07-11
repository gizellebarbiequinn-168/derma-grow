// --- APPLICATION ROUTING SYSTEM ---
const navDashboard = document.getElementById('navDashboard');
const navQuiz = document.getElementById('navQuiz');
const navLearn = document.getElementById('navLearn');

const trackerCard = document.getElementById('trackerCard');
const quizSection = document.getElementById('quizSection');
const learnSection = document.getElementById('learnSection');

function clearActiveTabs() {
    [navDashboard, navQuiz, navLearn].forEach(el => el.classList.remove('active'));
    [trackerCard, quizSection, learnSection].forEach(el => el.classList.add('hidden'));
}

navDashboard.addEventListener('click', (e) => {
    e.preventDefault(); clearActiveTabs();
    navDashboard.classList.add('active');
    trackerCard.classList.remove('hidden');
    calculateSkinTrajectory();
});

navQuiz.addEventListener('click', (e) => {
    e.preventDefault(); clearActiveTabs();
    navQuiz.classList.add('active');
    quizSection.classList.remove('hidden');
    initializeQuizEngine();
});

navLearn.addEventListener('click', (e) => {
    e.preventDefault(); clearActiveTabs();
    navLearn.classList.add('active');
    learnSection.classList.remove('hidden');
});

// --- STATE MANAGEMENT & COUNTERS ---
function updateHonestLocalMetrics(state, finalScore) {
    let unsafeHaltedCount = 0;
    if (state.prodLemonTrend) unsafeHaltedCount++;
    if (state.prodScrubs) unsafeHaltedCount++;
    if (state.prodHandmeDown && !state.prodLotion) unsafeHaltedCount++;
    
    document.getElementById('itemsSavedCount').textContent = unsafeHaltedCount;

    const baselineDefaultScore = 50;
    let delta = finalScore - baselineDefaultScore;
    document.getElementById('optimizationDelta').textContent = delta >= 0 ? `+${delta}%` : `${delta}%`;

    const summaryLabel = document.getElementById('impactSummaryText');
    if (unsafeHaltedCount > 0) {
        summaryLabel.textContent = `🎉 Trend Avoided: Dropping ${unsafeHaltedCount} aggressive trends protects your skin barrier. You also saved roughly Rp ${(unsafeHaltedCount * 60000).toLocaleString('id-ID')} in unnecessary product costs!`;
    } else if (finalScore >= 85) {
        summaryLabel.textContent = `🎯 Core Routine Built: Your minimalist routine is complete. Your estimated skin-barrier protection baseline is at its highest rating.`;
    } else {
        summaryLabel.textContent = `💡 Routine Builder Active. Interact with the checkboxes above to see how skipping trends or adding affordable essentials impacts your score.`;
    }
}

// --- USER FEEDBACK CAPTURE ---
document.getElementById('feedbackForm').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('feedbackText').value = "";
    const responseAlert = document.getElementById('feedbackSuccessMessage');
    responseAlert.classList.remove('hidden');
    setTimeout(() => responseAlert.classList.add('hidden'), 4000);
});

// --- RULE-BASED PROJECTION ENGINE ---
const budgetSlider = document.getElementById('budgetSlider');
const budgetValue = document.getElementById('budgetValue');
const reportContent = document.getElementById('reportContent');
const protocolBox = document.getElementById('protocolBox');
const amRoutineList = document.getElementById('amRoutineList');
const pmRoutineList = document.getElementById('pmRoutineList');

const selectors = ['prodLotion', 'prodCleanser', 'prodSunscreen', 'prodToner', 'prodNiacinamide', 'prodHandmeDown', 'prodLemonTrend', 'prodScrubs'];
let dermaChart = null;

function calculateSkinTrajectory() {
    const budget = parseInt(budgetSlider.value);
    budgetValue.textContent = `Rp ${budget.toLocaleString('id-ID')}`;

    const state = {};
    selectors.forEach(id => { state[id] = document.getElementById(id).checked; });

    const labels = ["Day 1", "Day 3", "Day 5", "Day 7", "Day 10", "Day 12", "Day 14"];
    let metrics = [50, 50, 50, 50, 50, 50, 50]; 
    let currentEvaluatedScore = 50; 
    let summaryText = "Awaiting selections: Add affordable core essentials (Cleanser/Lotion) to see estimated trendlines.";
    
    let amSteps = ["Rinse skin with clean, lukewarm water."];
    let pmSteps = ["Rinse away daily environmental sweat or dust."];

    if (state.prodLemonTrend || state.prodScrubs) {
        metrics = [50, 38, 25, 14, 8, 5, 4]; currentEvaluatedScore = 4;
        summaryText = "BARRIER DAMAGE ALERT: High acidity or harsh friction from physical trends strips away moisture layers. Stop using these items immediately to let your skin rest.";
        amSteps = ["SKIP UNNECESSARY REMEDIES AND SCRUBS.", "Wash gently with cool plain water only to minimize further irritation."];
        pmSteps = ["Stop using harsh physical brushes or kitchen ingredients.", "Apply basic moisturizer or glycerin if available; otherwise leave bare."];
    } 
    else if (state.prodHandmeDown && !state.prodLotion) {
        metrics = [50, 44, 36, 30, 25, 20, 15]; currentEvaluatedScore = 15;
        summaryText = "UNBUFFERED ACTIVE IRRITATION: Using high-strength active ingredients without a basic moisturizer can cause dryness and flaking. Pause the active ingredient until a baseline routine is built.";
        amSteps = ["Temporarily stop using high-potency active serums.", "Splash face with cool water to avoid stripping native moisture."];
        pmSteps = ["Skip the high-strength active product tonight.", "Focus on finding a simple, low-cost hydrating lotion when your budget allows."];
    }
    else if (state.prodLotion && state.prodCleanser && state.prodSunscreen) {
        let score = 85;
        summaryText = "COMPLETE PROTECTIVE ROUTINE: Your foundational loop is complete. Gentle cleansing, barrier hydration, and broad-spectrum UV protection work together for maximum safety.";
        amSteps = ["Rinse with water or an ultra-mild splash.", "Apply your basic moisturizer/lotion.", "Apply Broad-Spectrum Sunscreen (Crucial daily protection)."];
        pmSteps = ["Use your Gentle Low-pH Cleanser to break down sunscreen and buildup.", "Apply basic moisturizer to damp skin within 60 seconds of drying."];
        if (state.prodNiacinamide) { score += 11; summaryText += " Niacinamide supports natural lipid production."; pmSteps.push("Optional: Apply Niacinamide serum before moisturizer."); }
        if (state.prodToner) { score += 4; amSteps.splice(1, 0, "Optional: Pat gentle hydrating toner over damp skin."); }
        currentEvaluatedScore = score; metrics = [50, 60, 70, 78, 84, 87, score];
    }
    else if (state.prodLotion && state.prodCleanser) {
        currentEvaluatedScore = 75; metrics = [50, 55, 62, 68, 72, 74, 75];
        summaryText = "ESSENTIAL MINIMALIST HYDRATION: Excellent low-cost baseline. Your barrier health is projected to steadily improve. Adding an affordable sunscreen will complete the loop.";
        amSteps = ["Rinse face thoroughly with clean, lukewarm water.", "Apply a thin layer of basic moisturizer / glycerin."];
        pmSteps = ["Cleanse face using your Gentle Low-pH Cleanser.", "Apply basic moisturizer over damp skin to minimize transepidermal water loss."];
    }

    reportContent.textContent = summaryText;
    protocolBox.classList.remove('hidden');
    amRoutineList.innerHTML = amSteps.map(s => `<li>${s}</li>`).join('');
    pmRoutineList.innerHTML = pmSteps.map(s => `<li>${s}</li>`).join('');

    renderVisualThresholdChart(labels, metrics);
    updateHonestLocalMetrics(state, currentEvaluatedScore);
}

function renderVisualThresholdChart(labels, metrics) {
    const ctx = document.getElementById('dermaChart').getContext('2d');
    if (dermaChart) { dermaChart.destroy(); }
    dermaChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{ label: 'Heuristic Barrier Projection (%)', data: metrics, borderColor: '#4A5548', borderWidth: 2.5, pointBackgroundColor: '#D4AF37', tension: 0.1, fill: false }]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } } }
    });
}

budgetSlider.addEventListener('input', calculateSkinTrajectory);
selectors.forEach(id => document.getElementById(id).addEventListener('change', calculateSkinTrajectory));

// --- SKIN PROFILE QUIZ ENGINE ---
const quizData = [
    { q: "How does your skin feel about an hour after washing it with just plain water?", a: [ { text: "Tight, flaky, or visibly rough in some areas", type: "Dry" }, { text: "Slick, shiny, or greasy all over", type: "Oily" }, { text: "Oily down the center (forehead/nose), but tight or dry on the cheeks", type: "Combination" }, { text: "Comfortable, smooth, and neither too shiny nor dry", type: "Normal" } ] },
    { q: "How often does your skin experience burning, redness, or stinging from basic products?", a: [ { text: "Frequently, especially when trying out new things", type: "Sensitive" }, { text: "Rarely or never, regardless of changing environments", type: "Resilient" } ] }
];

let quizAnswers = [];
let currentQuestionIndex = 0;

function initializeQuizEngine() {
    quizAnswers = []; currentQuestionIndex = 0;
    document.getElementById('quizResultBox').classList.add('hidden');
    document.getElementById('questionBox').classList.remove('hidden');
    renderQuizQuestion();
}

function renderQuizQuestion() {
    if (currentQuestionIndex >= quizData.length) { evaluateQuizResults(); return; }
    const currentQ = quizData[currentQuestionIndex];
    document.getElementById('questionText').textContent = currentQ.q;
    const optionsContainer = document.getElementById('answerOptions');
    optionsContainer.innerHTML = "";
    
    currentQ.a.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "quiz-opt-btn"; btn.textContent = opt.text;
        btn.addEventListener('click', () => { quizAnswers.push(opt.type); currentQuestionIndex++; renderQuizQuestion(); });
        optionsContainer.appendChild(btn);
    });
}

function evaluateQuizResults() {
    document.getElementById('questionBox').classList.add('hidden');
    const resultBox = document.getElementById('quizResultBox'); resultBox.classList.remove('hidden');

    let primaryBase = quizAnswers[0], reactivity = quizAnswers[1], typeStr = `${primaryBase} Skin`, descStr = "";

    if (reactivity === "Sensitive") {
        typeStr = `Sensitive & ${primaryBase} Profile`;
        descStr = "Your skin profile indicates a highly reactive barrier. Avoid complicated multi-step routines, rough facial scrubs, and high-percentage harsh active acids. Focus on keeping your routine gentle, protective, and minimal.";
    } else {
        if (primaryBase === "Oily") descStr = "Your skin has active oil production. Prioritize lightweight formulas, like simple hydrating gels, over heavy or thick pore-clogging balms.";
        else if (primaryBase === "Dry") descStr = "Your skin naturally produces fewer moisturizing lipids. Prioritize rich, nourishing moisturizers to seal in hydration and prevent water loss.";
        else descStr = "Your skin profile is well-balanced. Protect this baseline by using a mild cleanser, a basic moisturizer, and a daily sunscreen shield.";
    }
    document.getElementById('skinTypeTitle').textContent = typeStr.toUpperCase();
    document.getElementById('skinTypeDescription').textContent = descStr;
}
document.getElementById('resetQuizBtn').addEventListener('click', initializeQuizEngine);

// --- RESEARCH LIBRARIES DATABASE ---
const scienceDatabase = [
    { id: 1, category: "myths", badge: "Trend Debunker", badgeClass: "badge-myth", title: "The DIY Lemon Juice Trend", description: "Applying pure lemon juice strips the skin's natural acidic mantle (~4.5–5.5 pH) due to its high acidity (~2.0 pH). This can cause chemical irritation, barrier damage, and increased sensitivity to dark spots.", actionText: "View pH Scale Chemistry Data →", link: "https://pubchem.ncbi.nlm.nih.gov/" },
    { id: 2, category: "myths", badge: "Trend Debunker", badgeClass: "badge-myth", title: "Physical Scrubs vs. Friction", description: "Abrasives like crushed walnut shells or coarse sugar crystals can disrupt soft, protective outer lipid layers, creating micro-fissures in the barrier surface.", actionText: "Read Barrier Disruption Lit →", link: "https://www.ncbi.nlm.nih.gov/pmc/" },
    { id: 3, category: "classification", badge: "Product Category", badgeClass: "badge-class", title: "Cleansers: Low-pH Surfactants", description: "Understanding the difference between soap bars and mild surfactants. Using washing agents that respect natural skin pH levels preserves essential cellular proteins during cleansing.", actionText: "Cleansing Agent Formulation Basics →", link: "https://www.sciencedirect.com/" },
    { id: 4, category: "classification", badge: "Product Category", badgeClass: "badge-class", title: "Moisturizers: Essential Types", description: "Humectants bind moisture to surface cells, while protective occlusives create a surface shield that prevents Transepidermal Water Loss (TEWL).", actionText: "Harvard Health Skin Guide →", link: "https://www.health.harvard.edu/" },
    { id: 5, category: "actives", badge: "Skincare Ingredient", badgeClass: "badge-science", title: "L-Ascorbic Acid (Vitamin C)", description: "A classic antioxidant studied for its ability to neutralize environmental free radicals caused by daily UV exposure while supporting structural proteins.", actionText: "Read Ingredient Efficacy Data →", link: "https://www.cochrane.org/" },
    { id: 6, category: "actives", badge: "Skincare Ingredient", badgeClass: "badge-science", title: "Niacinamide (Vitamin B3)", description: "A widely researched vitamin shown to help support the synthesis of protective natural lipids, reducing overall moisture loss and evening out skin appearance.", actionText: "View Niacinamide Studies →", link: "https://pubmed.ncbi.nlm.nih.gov/" },
    { id: 7, category: "anatomy", badge: "Skin Biology", badgeClass: "badge-science", title: "The Skin Barrier Frame", description: "An overview of the stratum corneum's 'brick and mortar' framework. Surface cells act as bricks, and natural lipids act as mortar to manage water loss (TEWL) and protect against particles.", actionText: "Skin Biology Literature Index →", link: "https://www.jidonline.org/" },
    { id: 8, category: "anatomy", badge: "Skin Biology", badgeClass: "badge-science", title: "The Protective Acid Mantle", description: "A look at how skin lipids, fatty acids, and sweat combine on the surface to create a natural, slightly acidic shield that functions as a first line of defense.", actionText: "Skin Shield Anatomy Basics →", link: "https://www.wiley.com/" }
];

const databaseGrid = document.getElementById('databaseGrid');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderCards(categoryFilter) {
    databaseGrid.innerHTML = scienceDatabase.filter(item => categoryFilter === "all" || item.category === categoryFilter).map(item => `
        <div class="content-card">
            <span class="badge ${item.badgeClass}">${item.badge}</span>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <a href="${item.link}" target="_blank" class="read-more">${item.actionText}</a>
        </div>
    `).join('');
}

filterBtns.forEach(btn => btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
    renderCards(btn.getAttribute('data-category'));
}));

calculateSkinTrajectory();
renderCards("all");
