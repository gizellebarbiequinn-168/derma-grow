// --- APP TAB SWITCHING CONTROLLER ---
const navDashboard = document.getElementById('navDashboard');
const navQuiz = document.getElementById('navQuiz');
const navLearn = document.getElementById('navLearn');

const heroSection = document.getElementById('heroSection');
const impactMatrix = document.getElementById('impactMatrix');
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
    heroSection.classList.remove('hidden');
    impactMatrix.classList.remove('hidden');
});

navQuiz.addEventListener('click', (e) => {
    e.preventDefault(); clearActiveTabs();
    navQuiz.classList.add('active');
    quizSection.classList.remove('hidden');
    heroSection.classList.add('hidden');
    impactMatrix.classList.add('hidden');
    initializeQuizEngine();
});

navLearn.addEventListener('click', (e) => {
    e.preventDefault(); clearActiveTabs();
    navLearn.classList.add('active');
    learnSection.classList.remove('hidden');
    heroSection.classList.add('hidden');
    impactMatrix.classList.add('hidden');
});


// --- FIXED/CAPPED IMPACT METRICS CONTROLLER ---
let actionsRegistered = 0;
function updateImpactMatrix() {
    actionsRegistered++;
    // Logic forces metrics to step up gradually then lock exactly at terminal values
    const noiseNeutralized = Math.min(48, actionsRegistered * 8); 
    const productsSaved = Math.min(14, Math.floor(actionsRegistered * 2.5)); 
    const clarityIndex = Math.min(100, 50 + (actionsRegistered * 10));

    document.getElementById('noiseCount').textContent = `${noiseNeutralized}h`;
    document.getElementById('clutterCount').textContent = productsSaved;
    document.getElementById('clarityScore').textContent = `${clarityIndex}%`;
}


// --- EXPANDED 8-PRODUCT COMBINATORIAL OPTIMIZER ---
const budgetSlider = document.getElementById('budgetSlider');
const budgetValue = document.getElementById('budgetValue');
const reportContent = document.getElementById('reportContent');
const protocolBox = document.getElementById('protocolBox');
const amRoutineList = document.getElementById('amRoutineList');
const pmRoutineList = document.getElementById('pmRoutineList');

const selectors = [
    'prodLotion', 'prodCleanser', 'prodSunscreen', 'prodToner',
    'prodNiacinamide', 'prodHandmeDown', 'prodLemonTrend', 'prodScrubs'
];

let dermaChart = null;

function calculateSkinTrajectory() {
    const budget = parseInt(budgetSlider.value);
    budgetValue.textContent = `Rp ${budget.toLocaleString('id-ID')}`;

    // Read all 8 input checkbox positions dynamically
    const state = {};
    selectors.forEach(id => { state[id] = document.getElementById(id).checked; });

    const labels = ["Day 1", "Day 3", "Day 5", "Day 7", "Day 10", "Day 12", "Day 14"];
    let metrics = [50, 51, 52, 53, 54, 55, 56]; // Baseline default trajectory
    let summaryText = "STATIC SYSTEM: Add core building blocks (Cleanser/Lotion) to formulate projection curves.";
    
    let amSteps = ["Rinse skin with lukewarm water."];
    let pmSteps = ["Rinse away environmental impurities."];

    // Combinatorial Rule Hierarchy Calculations
    if (state.prodLemonTrend || state.prodScrubs) {
        metrics = [65, 42, 25, 14, 8, 5, 4];
        summaryText = "ACUTE STRATIFICATION DISRUPTION: Botanical chemistry or abrasive friction is stripping layers completely. Halt mechanics instantly at Rp 0 cost overhead.";
        amSteps = ["ABSOLUTELY NO REMEDIES/SCRUBS.", "Wash gently with cool plain water only to soothe underlying tissues."];
        pmSteps = ["Cease physical/chemical mechanical adjustments.", "Apply a layer of basic glycerin/lotion if available; otherwise leave bare."];
    } 
    else if (state.prodHandmeDown && !state.prodLotion) {
        metrics = [55, 45, 36, 30, 25, 20, 15];
        summaryText = "UNBUFFERED CELLULAR ACCELERATION: High-strength actives without lipid replenishment are forcing premature desquamation. Stop active until base is established.";
        amSteps = ["Suspend usage of high-potency active formulations.", "Splash face with cool water to protect structural equilibrium."];
        pmSteps = ["Do NOT apply active serum tonight.", "Apply an accessible emollient matrix if financial boundaries expand."];
    }
    else if (state.prodLotion && state.prodCleanser && state.prodSunscreen) {
        let score = 85;
        summaryText = "OPTIMIZED HOLISTIC ARCHITECTURE: Complete defense cycle established. Cellular moisture retention and UV protection metrics are hitting peak values.";
        amSteps = ["Wash with water or an ultra-mild splash.", "Apply your Hydrating Base/Lotion.", "Apply Broad-Spectrum Sunscreen (Crucial protection checkpoint)."];
        pmSteps = ["Deploy Gentle Low-pH Cleanser for 45 seconds to dissolve lipophilic UV structural filters.", "Re-apply basic occlusive moisture layer within 60 seconds of drying."];

        if (state.prodNiacinamide) { score = 96; summaryText += " Niacinamide addition accelerates synthesis of ceramic lipids."; pmSteps.push("Integrate 2 drops of Niacinamide before your lotion layer."); }
        if (state.prodToner) { score = 98; amSteps.splice(1, 0, "Pat Hydrating Toner over damp skin layer."); }
        metrics = [50, 65, 78, 86, 92, 95, score];
    }
    else if (state.prodLotion && state.prodCleanser) {
        metrics = [50, 58, 67, 74, 80, 83, 85];
        summaryText = "SECURE MINIMALIST HYDRATION: Solid baseline established. Barrier metrics are scaling safely up, but adding an interactive UV shield will complete the loop.";
        amSteps = ["Rinse face thoroughly with clean lukewarm water.", "Apply a thin layer of Basic Body Lotion / Glycerin."];
        pmSteps = ["Cleanse face using Gentle Low-pH Cleanser.", "Apply Basic Lotion over damp surface cells to minimize transepidermal loss."];
    }

    // Update Output Containers
    reportContent.textContent = summaryText;
    protocolBox.classList.remove('hidden');
    amRoutineList.innerHTML = amSteps.map(s => `<li>${s}</li>`).join('');
    pmRoutineList.innerHTML = pmSteps.map(s => `<li>${s}</li>`).join('');

    renderVisualThresholdChart(labels, metrics);
    updateImpactMatrix();
}

function renderVisualThresholdChart(labels, metrics) {
    const ctx = document.getElementById('dermaChart').getContext('2d');
    if (dermaChart) { dermaChart.destroy(); }
    dermaChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Barrier Integrity Metric (%)',
                data: metrics,
                borderColor: '#4A5548',
                borderWidth: 3,
                pointBackgroundColor: '#D4AF37',
                tension: 0.15,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, max: 100 } }
        }
    });
}

// Hook core events
budgetSlider.addEventListener('input', calculateSkinTrajectory);
selectors.forEach(id => document.getElementById(id).addEventListener('change', calculateSkinTrajectory));


// --- STATE-DRIVEN INTERACTIVE QUIZ ENGINE ---
const quizData = [
    { q: "How does your facial surface profile feel 60 minutes after clear water rinsing?", a: [ { text: "Tight, flaky, or visibly pulling rough textures", type: "Dry" }, { text: "Slick, shiny, with noticeable lipid production uniformly", type: "Oily" }, { text: "Slick along center nose/forehead, dry or tight on outer cheeks", type: "Combination" }, { text: "Supple, comfortable, showing minimal shine or dry texturing", type: "Normal" } ] },
    { q: "How frequently does your skin show reactive flushes, heat signs, or stinging patches?", a: [ { text: "Constantly when testing topical formulations", type: "Sensitive" }, { text: "Rarely or never, regardless of changing environments", type: "Resilient" } ] }
];

let quizAnswers = [];
let currentQuestionIndex = 0;

function initializeQuizEngine() {
    quizAnswers = [];
    currentQuestionIndex = 0;
    document.getElementById('quizResultBox').classList.add('hidden');
    document.getElementById('questionBox').classList.remove('hidden');
    renderQuizQuestion();
}

function renderQuizQuestion() {
    if (currentQuestionIndex >= quizData.length) {
        evaluateQuizResults();
        return;
    }
    const currentQ = quizData[currentQuestionIndex];
    document.getElementById('questionText').textContent = currentQ.q;
    const optionsContainer = document.getElementById('answerOptions');
    optionsContainer.innerHTML = "";
    
    currentQ.a.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "quiz-opt-btn";
        btn.textContent = opt.text;
        btn.addEventListener('click', () => {
            quizAnswers.push(opt.type);
            currentQuestionIndex++;
            renderQuizQuestion();
        });
        optionsContainer.appendChild(btn);
    });
}

function evaluateQuizResults() {
    document.getElementById('questionBox').classList.add('hidden');
    const resultBox = document.getElementById('quizResultBox');
    resultBox.classList.remove('hidden');

    let primaryBase = quizAnswers[0]; 
    let reactivity = quizAnswers[1];

    let typeStr = `${primaryBase} Skin`;
    let descStr = "";

    if (reactivity === "Sensitive") {
        typeStr = `Sensitive & ${primaryBase} Dynamic Profile`;
        descStr = "Your epidermal structure features highly reactive nerve endings or micro-gaps in cell cohesion. Avoid complex multi-step chemical matrices, physical scrubs, and strong acids. Focus strictly on lipid replenishment.";
    } else {
        if (primaryBase === "Oily") descStr = "Your sebaceous glands exhibit high structural activity. Prioritize lightweight formulations like humectant gels over heavy occlusive single-ingredient petrolatums.";
        else if (primaryBase === "Dry") descStr = "Your skin displays an underlying deficiency in native lipid production. Prioritize rich occlusive moisturizers to seal in hydration.";
        else descStr = "Your skin maintains an excellent, balanced structural matrix. Protect this state using minimal cleansers and an essential UV broad-spectrum shield.";
    }

    document.getElementById('skinTypeTitle').textContent = typeStr.toUpperCase();
    document.getElementById('skinTypeDescription').textContent = descStr;
}
document.getElementById('resetQuizBtn').addEventListener('click', initializeQuizEngine);


// --- EXPANDED RESOURCE DATABASE (WITH EXTERNAL CLINICAL LINKS) ---
const scienceDatabase = [
    { id: 1, category: "myths", badge: "Myth Buster", badgeClass: "badge-myth", title: "The DIY Lemon Juice Trend", description: "Applying pure lemon juice destroys the skin's natural acid mantle (~4.5–5.5 pH) with its extreme acidity (2.0 pH). This results in severe chemical burns, barrier disruption, and post-inflammatory hyperpigmentation.", actionText: "NCBI PubChem pH Research Data →", link: "https://pubchem.ncbi.nlm.nih.gov/" },
    { id: 2, category: "myths", badge: "Myth Buster", badgeClass: "badge-myth", title: "Physical Scrubs vs Micro-tears", description: "Abrasive raw walnut shells or large sugar crystals break down soft protective lipid matrixes, generating jagged micro-fissures in cell walls.", actionText: "Dermatology Journal Reference →", link: "https://www.ncbi.nlm.nih.gov/pmc/" },
    { id: 3, category: "classification", badge: "Category", badgeClass: "badge-class", title: "Cleansers: Low-pH Surfactants", description: "Understanding syndet bars and amphoteric surfactants. Keeping products matching structural pH limits stabilizes natural enzyme balances during washing intervals.", actionText: "Cosmetic Chemistry Formulation Basics →", link: "https://www.sciencedirect.com/" },
    { id: 4, category: "classification", badge: "Category", badgeClass: "badge-class", title: "Moisturizers: Occlusives vs Humectants", description: "Humectants bind ambient moisture down into cells, while heavy occlusives form an impenetrable biological shield to arrest Trans-Epidermal Water Loss (TEWL).", actionText: "Harvard Health Science Index →", link: "https://www.health.harvard.edu/" },
    { id: 5, category: "actives", badge: "Biochemical Active", badgeClass: "badge-science", title: "L-Ascorbic Acid (Vitamin C)", description: "A potent antioxidant that neutralizes reactive oxygen species (ROS) induced by UV radiation. It acts as an essential cofactor for lysyl hydroxylase, directly stimulating intracellular collagen synthesis.", actionText: "Clinical Biochemical Efficacy Sheet →", link: "https://www.cochrane.org/" },
    { id: 6, category: "actives", badge: "Biochemical Active", badgeClass: "badge-science", title: "Niacinamide (Vitamin B3)", description: "Precursor to NAD+/NADH coenzymes. Clinically proven to upregulate epidermal sphingolipid synthesis, strengthening the moisture barrier while downregulating melanosome transfer from melanocytes to keratinocytes.", actionText: "PubMed Actives Library →", link: "https://pubmed.ncbi.nlm.nih.gov/" },
    { id: 7, category: "anatomy", badge: "Skin Anatomy", badgeClass: "badge-science", title: "The Epidermal Barrier Structure", description: "Analysis of the stratum corneum's 'brick and mortar' framework. Corneocytes (bricks) and extracellular lipids (mortar) work in tandem to minimize trans-epidermal water loss (TEWL) and shield against micro-pathogens.", actionText: "Journal of Investigative Dermatology →", link: "https://www.jidonline.org/" },
    { id: 8, category: "anatomy", badge: "Skin Anatomy", badgeClass: "badge-science", title: "The Acid Mantle & Sebum Composition", description: "Detailed look at how triglycerides, free fatty acids, and squalene create the structural surface layer that acts as the first line of cutaneous defense.", actionText: "Dermatological Anatomy Textbook →", link: "https://www.wiley.com/" }
];

const databaseGrid = document.getElementById('databaseGrid');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderCards(categoryFilter) {
    databaseGrid.innerHTML = "";
    const filteredData = scienceDatabase.filter(item => categoryFilter === "all" || item.category === categoryFilter);
    filteredData.forEach(item => {
        databaseGrid.innerHTML += `
            <div class="content-card">
                <span class="badge ${item.badgeClass}">${item.badge}</span>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <a href="${item.link}" target="_blank" class="read-more">${item.actionText}</a>
            </div>
        `;
    });
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderCards(btn.getAttribute('data-category'));
    });
});

// Initial Systems Initialization
calculateSkinTrajectory();
renderCards("all");
