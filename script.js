const SUPABASE_URL = "https://jptovymxzysuogbkmduf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwdG92eW14enlzdW9nYmttZHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwMjUxNzcsImV4cCI6MjEwMDYwMTE3N30.PMuarfeVvwxA0nPBo9wbmr1BUq2DfyyqnV-OkwMwMOo";

// Safe Supabase Client Initialization
let supabase = null;
try {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch (err) {
    console.warn("Supabase init deferred:", err);
}

document.addEventListener("DOMContentLoaded", () => {
    // --- GLOBAL STATE ENGINE ---
    let userSkinProfile = {
        baseType: "Normal",     
        reactivity: "Resilient", 
        acneProne: false,
        dehydrated: false,
        ageGroup: "Teens",
        genderProfile: "Neutral",
        phototype: "Type III",
        isCalculated: false
    };

    const currencyMap = {
        "IDR": { locale: "id-ID", symbol: "Rp ", maxBudget: 300000, step: 10000 },
        "USD": { locale: "en-US", symbol: "$", maxBudget: 30, step: 1 },
        "EUR": { locale: "de-DE", symbol: "€", maxBudget: 30, step: 1 },
        "GBP": { locale: "en-GB", symbol: "£", maxBudget: 25, step: 1 },
        "SGD": { locale: "en-SG", symbol: "S$", maxBudget: 40, step: 1 },
        "AUD": { locale: "en-AU", symbol: "A$", maxBudget: 45, step: 1 }
    };
    let currentCurrency = "IDR"; 

    // --- NAVIGATION CONTROLLERS ---
    const navDashboard = document.getElementById('navDashboard');
    const navQuiz = document.getElementById('navQuiz');
    const navLearn = document.getElementById('navLearn');
    const navRecommendations = document.getElementById('navRecommendations');
    const navDictionary = document.getElementById('navDictionary');

    const trackerCard = document.getElementById('trackerCard');
    const quizSection = document.getElementById('quizSection');
    const learnSection = document.getElementById('learnSection');
    const recommendationsSection = document.getElementById('recommendationsSection');
    const dictionarySection = document.getElementById('dictionarySection');

    function clearActiveTabs() {
        [navDashboard, navQuiz, navLearn, navRecommendations, navDictionary].forEach(el => { if(el) el.classList.remove('active'); });
        [trackerCard, quizSection, learnSection, recommendationsSection, dictionarySection].forEach(el => { if(el) el.classList.add('hidden'); });
    }

    if (navDashboard) {
        navDashboard.addEventListener('click', (e) => {
            e.preventDefault(); clearActiveTabs();
            navDashboard.classList.add('active');
            if (trackerCard) trackerCard.classList.remove('hidden');
            calculateSkinTrajectory();
        });
    }
    if (navQuiz) {
        navQuiz.addEventListener('click', (e) => {
            e.preventDefault(); clearActiveTabs();
            navQuiz.classList.add('active');
            if (quizSection) quizSection.classList.remove('hidden');
            initializeQuizEngine();
        });
    }
    if (navLearn) {
        navLearn.addEventListener('click', (e) => {
            e.preventDefault(); clearActiveTabs();
            navLearn.classList.add('active');
            if (learnSection) learnSection.classList.remove('hidden');
            renderCards("all");
        });
    }
    if (navRecommendations) {
        navRecommendations.addEventListener('click', (e) => {
            e.preventDefault(); clearActiveTabs();
            navRecommendations.classList.add('active');
            if (recommendationsSection) recommendationsSection.classList.remove('hidden');
            renderPeerRegistry("all");
        });
    }
    if (navDictionary) {
        navDictionary.addEventListener('click', (e) => {
            e.preventDefault(); clearActiveTabs();
            navDictionary.classList.add('active');
            if (dictionarySection) dictionarySection.classList.remove('hidden');
            renderDictionaryList("");
        });
    }

    // --- TRACK MATRIX SUMMARY METRICS ---
    function updateHonestLocalMetrics(state, finalScore, unsafeHaltedCount) {
        const itemsSavedCount = document.getElementById('itemsSavedCount');
        const optimizationDelta = document.getElementById('optimizationDelta');
        const summaryLabel = document.getElementById('impactSummaryText');
        const config = currencyMap[currentCurrency];

        if (itemsSavedCount) itemsSavedCount.textContent = unsafeHaltedCount;

        const baselineDefaultScore = 50;
        let delta = finalScore - baselineDefaultScore;
        if (optimizationDelta) optimizationDelta.textContent = delta >= 0 ? `+${delta}%` : `${delta}%`;

        if (summaryLabel) {
            if (unsafeHaltedCount > 0) {
                let savingsValue = unsafeHaltedCount * (config.maxBudget * 0.2); 
                summaryLabel.textContent = `🎉 Trend Avoided: Dropping ${unsafeHaltedCount} aggressive trends protects your skin surface. You saved roughly ${formatGlobalCurrency(savingsValue, currentCurrency)}!`;
            } else if (finalScore >= 85) {
                summaryLabel.textContent = `🎯 Core Routine Built: Your minimalist routine layout is complete. Keep up consistency!`;
            } else {
                summaryLabel.textContent = `💡 Routine Builder Active. Interact with checkboxes to see updates.`;
            }
        }
    }

    // --- SUBMISSION VIA FORMSPREE ---
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const data = new FormData(e.target);
            const responseAlert = document.getElementById('feedbackSuccessMessage');
            const feedbackTextarea = document.getElementById('feedbackText');

            fetch(feedbackForm.action, {
                method: feedbackForm.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    if (feedbackTextarea) feedbackTextarea.value = "";
                    if (responseAlert) {
                        responseAlert.classList.remove('hidden');
                        setTimeout(() => responseAlert.classList.add('hidden'), 4000);
                    }
                } else { alert("Submission error. Please verify form connectivity."); }
            }).catch(() => { alert("Network error. Please try again."); });
        });
    }

    // --- HABIT VISUALIZATION MODELLING ---
    const budgetSlider = document.getElementById('budgetSlider');
    const budgetValue = document.getElementById('budgetValue');
    const reportContent = document.getElementById('reportContent');
    const protocolBox = document.getElementById('protocolBox');
    const amRoutineList = document.getElementById('amRoutineList');
    const pmRoutineList = document.getElementById('pmRoutineList');
    const profileSyncBadge = document.getElementById('profileSyncBadge');

    const selectors = ['chk-moisturizer', 'chk-cleanser', 'chk-sunscreen', 'chk-toner', 'chk-niacinamide', 'chk-actives', 'chk-lemon', 'chk-scrubs'];
    let dermaChart = null;

    function formatGlobalCurrency(amount, currencyCode) {
        const config = currencyMap[currencyCode] || { locale: "en-US", symbol: "$" };
        return new Intl.NumberFormat(config.locale, {
            style: 'currency',
            currency: currencyCode,
            maximumFractionDigits: 0
        }).format(amount);
    }

    async function syncRoutineToCloud(routineData) {
        if (!supabase) return;
        try {
            const { error } = await supabase.from('user_routines').insert([ routineData ]);
            if (!error && profileSyncBadge) {
                profileSyncBadge.textContent = "Synced: Cloud Saved";
                profileSyncBadge.style.backgroundColor = "rgba(196, 154, 69, 0.15)";
                profileSyncBadge.style.color = "var(--brand-accent)";
            }
        } catch(e) {
            console.warn("Cloud sync skipped:", e);
        }
    }

    function calculateSkinTrajectory() {
        if (!budgetSlider) return;
        
        const budget = parseInt(budgetSlider.value);
        
        if (budgetValue) {
            budgetValue.textContent = formatGlobalCurrency(budget, currentCurrency);
        }

        if (profileSyncBadge) {
            if (userSkinProfile.isCalculated) {
                profileSyncBadge.textContent = `Synced: ${userSkinProfile.baseType.toUpperCase()} | ${userSkinProfile.phototype}`;
                profileSyncBadge.style.backgroundColor = "rgba(196, 154, 69, 0.15)";
                profileSyncBadge.style.color = "var(--brand-accent)";
            } else {
                profileSyncBadge.textContent = "Profile: Unlinked";
                profileSyncBadge.style.backgroundColor = "var(--border-subtle)";
                profileSyncBadge.style.color = "var(--color-text-muted)";
            }
        }

        const state = {};
        selectors.forEach(id => { const el = document.getElementById(id); state[id] = el ? el.checked : false; });

        let unsafeHaltedCount = 0;
        if (state['chk-lemon']) unsafeHaltedCount++;
        if (state['chk-scrubs']) unsafeHaltedCount++;
        if (state['chk-actives'] && !state['chk-moisturizer']) unsafeHaltedCount++;

        const labels = ["Day 1", "Day 3", "Day 5", "Day 7", "Day 10", "Day 12", "Day 14"];
        let metrics = [50, 50, 50, 50, 50, 50, 50];
        let currentEvaluatedScore = 50;
        let summaryText = "Awaiting selections: Add core essentials (Cleanser/Lotion) to see layout response visualizers.";
        
        let amSteps = ["Rinse skin with clean, lukewarm water."];
        let pmSteps = ["Rinse away daily environmental sweat or dust."];

        if (state['chk-lemon'] || state['chk-scrubs']) {
            metrics = [50, 35, 22, 12, 6, 4, 3]; currentEvaluatedScore = 3;
            summaryText = "ROUTINE WARNING: High acidity or harsh friction from physical trends strips away moisture layers.";
            if (userSkinProfile.reactivity === "Sensitive") {
                metrics = [50, 25, 12, 5, 2, 1, 1]; currentEvaluatedScore = 1;
                summaryText += " Irritation risks are heavily elevated.";
            }
            amSteps = ["SKIP REMEDIES AND SCRUBS.", "Wash gently with cool plain water."];
            pmSteps = ["Stop using harsh physical brushes.", "Apply basic moisturizer or glycerin."];
        } 
        else if (state['chk-actives'] && !state['chk-moisturizer']) {
            metrics = [50, 44, 36, 30, 25, 20, 15]; currentEvaluatedScore = 15;
            summaryText = "ACTIVE IRRITATION: Using high-strength actives without moisturizer causes dryness.";
            amSteps = ["Temporarily stop using high-potency active serums.", "Splash face with cool water."];
            pmSteps = ["Skip high-strength active tonight.", "Focus on finding a hydrating lotion."];
        }
        else if (state['chk-moisturizer'] && state['chk-cleanser'] && state['chk-sunscreen']) {
            let score = 85;
            summaryText = "COMPLETE BASELINE ROUTINE: Foundational loop complete. Gentle cleansing, basic hydration, and UV protection work together.";
            
            amSteps = ["Rinse with water or ultra-mild splash.", "Apply basic moisturizer/lotion.", "Apply Broad-Spectrum Sunscreen."];
            pmSteps = ["Use Gentle Low-pH Cleanser.", "Apply basic moisturizer to damp skin."];
            
            if (state['chk-niacinamide']) { 
                score += 11; 
                pmSteps.push("Optional: Apply Niacinamide serum before moisturizer."); 
            }
            if (state['chk-toner']) { 
                score += 4; 
                amSteps.splice(1, 0, "Optional: Pat gentle hydrating toner over damp skin."); 
            }
            currentEvaluatedScore = Math.min(score, 100);
            metrics = [50, 62, 72, 80, 86, 90, currentEvaluatedScore];
        }
        else if (state['chk-moisturizer'] && state['chk-cleanser']) {
            currentEvaluatedScore = 75; metrics = [50, 55, 62, 68, 72, 74, 75];
            summaryText = "ESSENTIAL HYDRATION: Excellent baseline. Adding sunscreen will complete the loop.";
            amSteps = ["Rinse face thoroughly.", "Apply basic moisturizer."];
            pmSteps = ["Cleanse face using Gentle Low-pH Cleanser.", "Apply basic moisturizer."];
        }

        if (currentEvaluatedScore === 50 && !state['chk-moisturizer'] && !state['chk-cleanser']) {
            if (protocolBox) protocolBox.classList.add('hidden');
        } else {
            if (protocolBox) protocolBox.classList.remove('hidden');
        }

        if (reportContent) reportContent.textContent = summaryText;
        if (amRoutineList) amRoutineList.innerHTML = amSteps.map(s => `<li>${s}</li>`).join('');
        if (pmRoutineList) pmRoutineList.innerHTML = pmSteps.map(s => `<li>${s}</li>`).join('');

        renderVisualThresholdChart(labels, metrics);
        updateHonestLocalMetrics(state, currentEvaluatedScore, unsafeHaltedCount);

        syncRoutineToCloud({
            budget_selected: budget,
            active_checkboxes: state,
            evaluated_score: currentEvaluatedScore,
            updated_at: new Date()
        });
    }

    function renderVisualThresholdChart(labels, metrics) {
        const chartCanvas = document.getElementById('dermaChart');
        if (!chartCanvas || typeof Chart === 'undefined') return;
        
        try {
            const ctx = chartCanvas.getContext('2d');
            if (dermaChart) { dermaChart.destroy(); }
            dermaChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{ label: 'Habit Track (%)', data: metrics, borderColor: '#4A5548', borderWidth: 2.5, pointBackgroundColor: '#D4AF37', tension: 0.1, fill: false }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } } }
            });
        } catch(e) {
            console.warn("Chart render skipped:", e);
        }
    }

    if (budgetSlider) budgetSlider.addEventListener('input', calculateSkinTrajectory);
    selectors.forEach(id => { const el = document.getElementById(id); if (el) el.addEventListener('change', calculateSkinTrajectory); });

    // --- INSTANT STARTER BLOCK PRESETS ---
    const starterPackBtn = document.getElementById('starterPackBtn');
    if (starterPackBtn) {
        starterPackBtn.addEventListener('click', function() {
            const chkCleanser = document.getElementById('chk-cleanser');
            const chkMoisturizer = document.getElementById('chk-moisturizer');
            const chkSunscreen = document.getElementById('chk-sunscreen');
            
            if (chkCleanser) chkCleanser.checked = true;
            if (chkMoisturizer) chkMoisturizer.checked = true;
            if (chkSunscreen) chkSunscreen.checked = true;
            
            if (budgetSlider) {
                const config = currencyMap[currentCurrency];
                budgetSlider.value = Math.floor(config.maxBudget / 2); 
                budgetSlider.dispatchEvent(new Event('input')); 
            }
            calculateSkinTrajectory();
            this.innerText = "✅ Starter Pack Applied!";
            setTimeout(() => { this.innerText = "✨ Apply 3-Step Instant Starter Pack"; }, 2000);
        });
    }

    // --- ADVANCED DIAGNOSTIC SKIN ENGINE ---
    const quizData = [
        { q: "1. Age Group: What is your age category?", a: [ { text: "Teens", type: "age:Teens" }, { text: "20s - 30s", type: "age:Adult" }, { text: "40s+", type: "age:Mature" } ] },
        { q: "2. Gender Expression: Select your profile:", a: [ { text: "Masculine", type: "gender:Masculine" }, { text: "Feminine", type: "gender:Feminine" }, { text: "Neutral", type: "gender:Neutral" } ] },
        { q: "3. Phototype: How does your skin react to direct sun?", a: [ { text: "Always burns (Phototype I/II)", type: "photo:Type I-II" }, { text: "Burns moderately (Phototype III/IV)", type: "photo:Type III-IV" }, { text: "Rarely burns (Phototype V/VI)", type: "photo:Type V-VI" } ] },
        { q: "4. Oil production: How does skin feel an hour after washing?", a: [ { text: "Tight, flaky", type: "base:Dry" }, { text: "Slick, shiny", type: "base:Oily" }, { text: "Oily T-zone only", type: "base:Combination" }, { text: "Balanced", type: "base:Normal" } ] },
        { q: "5. Sensitivity: Stinging or redness from basic items?", a: [ { text: "Frequently", type: "react:Sensitive" }, { text: "Rarely/Never", type: "react:Resilient" } ] },
        { q: "6. Breakouts: Do you experience frequent breakouts?", a: [ { text: "Yes", type: "acne:true" }, { text: "No", type: "acne:false" } ] },
        { q: "7. Surface Tightness: Skin feels tight underneath surface oil?", a: [ { text: "Yes", type: "dehyd:true" }, { text: "No", type: "dehyd:false" } ] },
        { q: "8. Friction: Towel rubbing causes what reaction?", a: [ { text: "Redness/Stinging", type: "react:Sensitive" }, { text: "No reaction", type: "react:Resilient" } ] },
        { q: "9. Retinol Adaptation: Strong actives cause what?", a: [ { text: "Burning/Peeling", type: "react:Sensitive" }, { text: "Handles fine", type: "react:Resilient" } ] }
    ];

    let quizAnswers = []; let currentQuestionIndex = 0;

    function initializeQuizEngine() {
        quizAnswers = []; currentQuestionIndex = 0;
        const quizResultBox = document.getElementById('quizResultBox');
        const questionBox = document.getElementById('questionBox');
        if (quizResultBox) quizResultBox.classList.add('hidden');
        if (questionBox) questionBox.classList.remove('hidden');
        renderQuizQuestion();
    }

    function renderQuizQuestion() {
        const questionText = document.getElementById('questionText');
        const optionsContainer = document.getElementById('answerOptions');
        const progressTracker = document.getElementById('quizProgressTracker');
        const progressBar = document.getElementById('quizProgressBar');
        
        if (currentQuestionIndex >= quizData.length) { evaluateQuizResults(); return; }
        
        const stepNum = currentQuestionIndex + 1;
        if (progressTracker) progressTracker.textContent = `Step ${stepNum} of 9`;
        if (progressBar) progressBar.style.width = `${(stepNum / 9) * 100}%`;

        const currentQ = quizData[currentQuestionIndex];
        if (questionText) questionText.textContent = currentQ.q;
        if (optionsContainer) {
            optionsContainer.innerHTML = "";
            currentQ.a.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = "quiz-opt-btn"; btn.textContent = opt.text;
                btn.addEventListener('click', () => { quizAnswers.push(opt.type); currentQuestionIndex++; renderQuizQuestion(); });
                optionsContainer.appendChild(btn);
            });
        }
    }

    async function evaluateQuizResults() {
        const questionBox = document.getElementById('questionBox');
        const resultBox = document.getElementById('quizResultBox');
        if (questionBox) questionBox.classList.add('hidden');
        if (resultBox) resultBox.classList.remove('hidden');

        let baseTypes = { Normal: 0, Oily: 0, Dry: 0, Combination: 0 };
        let reactTypes = { Sensitive: 0, Resilient: 0 };
        let acneCount = 0; let dehydCount = 0;
        let selectedAge = "Teens"; let selectedGender = "Neutral"; let selectedPhoto = "Type III";

        quizAnswers.forEach(ans => {
            if (ans.startsWith("base:")) baseTypes[ans.split(":")[1]]++;
            if (ans.startsWith("react:")) reactTypes[ans.split(":")[1]]++;
            if (ans.startsWith("age:")) selectedAge = ans.split(":")[1];
            if (ans.startsWith("gender:")) selectedGender = ans.split(":")[1];
            if (ans.startsWith("photo:")) selectedPhoto = ans.split(":")[1];
            if (ans === "acne:true") acneCount++;
            if (ans === "dehyd:true") dehydCount++;
        });

        let determinedBase = Object.keys(baseTypes).reduce((a, b) => baseTypes[a] > baseTypes[b] ? a : b);
        let determinedReact = reactTypes.Sensitive >= reactTypes.Resilient ? "Sensitive" : "Resilient";

        userSkinProfile.baseType = determinedBase;
        userSkinProfile.reactivity = determinedReact;
        userSkinProfile.acneProne = acneCount > 0;
        userSkinProfile.dehydrated = dehydCount > 0;
        userSkinProfile.ageGroup = selectedAge;
        userSkinProfile.genderProfile = selectedGender;
        userSkinProfile.phototype = selectedPhoto;
        userSkinProfile.isCalculated = true;

        if (supabase) {
            try {
                await supabase.from('user_profiles').insert([{
                    base_type: userSkinProfile.baseType,
                    reactivity: userSkinProfile.reactivity,
                    acne_prone: userSkinProfile.acneProne,
                    dehydrated: userSkinProfile.dehydrated,
                    phototype: userSkinProfile.phototype
                }]);
            } catch(e) { console.warn("Profile cloud insert skipped:", e); }
        }

        let typeStr = `${determinedBase} Profile (${selectedAge} / ${selectedPhoto})`; 
        let descStr = `Assessed profile. `;

        if (selectedPhoto.includes("Type V-VI")) descStr += " Darker Phototypes heal with higher rates of PIH. Avoid picking acne.";
        if (userSkinProfile.dehydrated) descStr += " Quiz suggests surface dehydration.";
        
        const titleEl = document.getElementById('skinTypeTitle');
        const descEl = document.getElementById('skinTypeDescription');
        if (titleEl) titleEl.textContent = typeStr.toUpperCase();
        if (descEl) descEl.textContent = descStr;
    }

    const syncToRoutineBtn = document.getElementById('syncToRoutineBtn');
    if (syncToRoutineBtn) {
        syncToRoutineBtn.addEventListener('click', () => {
            if (navDashboard && trackerCard) {
                clearActiveTabs(); navDashboard.classList.add('active'); trackerCard.classList.remove('hidden');
                calculateSkinTrajectory();
                const matrixEl = document.getElementById('impactMatrix');
                if (matrixEl) window.scrollTo({ top: matrixEl.offsetTop - 20, behavior: 'smooth' });
            }
        });
    }
    const resetQuizBtn = document.getElementById('resetQuizBtn');
    if (resetQuizBtn) resetQuizBtn.addEventListener('click', initializeQuizEngine);

    // --- ACADEMY RESOURCE HUB DATA LAYER ---
    const scienceDatabase = [
        { id: 1, category: "myths", badge: "Trend Debunker", badgeClass: "badge-myth", title: "The DIY Lemon Juice Trend", description: "Applying raw lemon juice strips your acid mantle.", actionText: "View PubChem Data →", link: "https://pubchem.ncbi.nlm.nih.gov/compound/Citric-acid#section=Safety-and-Hazards" },
        { id: 2, category: "myths", badge: "Trend Debunker", badgeClass: "badge-myth", title: "Physical Scrubs vs. Friction", description: "Crushed seed shells cause micro-scratches in skin cells.", actionText: "Read NCBI Studies →", link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5608132/" }
    ];

    const databaseGrid = document.getElementById('databaseGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    function renderCards(categoryFilter) {
        if (!databaseGrid) return;
        databaseGrid.innerHTML = scienceDatabase.filter(item => categoryFilter === "all" || item.category === categoryFilter).map(item => `
            <div class="content-card tab-fade-animation">
                <span class="badge ${item.badgeClass}">${item.badge}</span>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <a href="${item.link}" target="_blank" class="read-more" rel="noopener noreferrer">${item.actionText}</a>
            </div>
        `).join('');
    }

    filterBtns.forEach(btn => btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
        renderCards(btn.getAttribute('data-category'));
    }));

    // --- COMMUNITY DIRECTORY & SUPABASE INSERT ---
    const peerRegistryDatabase = [
        { id: 1, skinType: "Oily", product: "Garnier Micellar Water Blue", cost: "Rp 35.000", ingredients: "Water, Glycerin", usage: "Wipe gently.", definition: "Oil-free surfactant solution." },
        { id: 2, skinType: "Dry", product: "The Ordinary NMF", cost: "Rp 120.000", ingredients: "Ceramides, HA", usage: "Apply to damp skin.", definition: "Barrier matching compound." }
    ];

    const peerRegistryGrid = document.getElementById('peerRegistryGrid');
    const peerFilterBtns = document.querySelectorAll('.peer-filter-btn');

    function renderPeerRegistry(skinFilter) {
        if (!peerRegistryGrid) return;
        const filteredData = peerRegistryDatabase.filter(item => skinFilter === "all" || item.skinType === skinFilter);
        
        if (filteredData.length === 0) {
            peerRegistryGrid.innerHTML = `<div class="content-card"><p class="text-muted">No recommendations logged yet.</p></div>`;
            return;
        }

        peerRegistryGrid.innerHTML = filteredData.map(item => `
            <div class="content-card tab-fade-animation" style="border-top: 3px solid var(--brand-accent);">
                <span class="badge badge-science">${item.skinType} Skin</span>
                <h3 style="margin-top: 0.25rem; font-size: 1.15rem; color: var(--brand-primary);">${item.product}</h3>
                <p style="font-size: 0.85rem; font-weight: 700; color: var(--brand-accent);">Cost: ${item.cost}</p>
                <p style="font-size: 0.85rem;"><strong>Notes:</strong> "${item.definition}"</p>
                <div style="background: var(--bg-main); padding: 0.6rem; border-radius: 6px; font-size: 0.8rem;">
                    <p>🧪 <strong>Ingredients:</strong> ${item.ingredients}</p>
                    <p>⚙️ <strong>Directions:</strong> ${item.usage}</p>
                </div>
            </div>
        `).join('');
    }

    peerFilterBtns.forEach(btn => btn.addEventListener('click', () => {
        peerFilterBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
        renderPeerRegistry(btn.getAttribute('data-skin'));
    }));

    const peerContributionForm = document.getElementById('peerContributionForm');
    if (peerContributionForm) {
        peerContributionForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const responseAlert = document.getElementById('peerSuccessMessage');
            
            const selectedSkin = document.getElementById('peerSkinType').value;
            const enteredProd = document.getElementById('peerProdName').value;
            const enteredPrice = document.getElementById('peerPrice').value;
            const enteredIngredients = document.getElementById('peerIngredients').value;
            const enteredUsage = document.getElementById('peerUsage').value;
            const enteredNotes = document.getElementById('peerNotes').value;

            const newEntry = {
                skin_type: selectedSkin,
                product_name: enteredProd,
                cost: enteredPrice,
                ingredients: enteredIngredients,
                usage: enteredUsage,
                notes: enteredNotes
            };

            if (supabase) {
                try {
                    await supabase.from('shared_directory').insert([newEntry]);
                } catch(e) { console.warn("Supabase directory sync issue:", e); }
            }

            peerRegistryDatabase.unshift({
                id: Date.now(),
                skinType: selectedSkin,
                product: enteredProd,
                cost: enteredPrice,
                ingredients: enteredIngredients,
                usage: enteredUsage,
                definition: enteredNotes
            });

            renderPeerRegistry("all");
            peerFilterBtns.forEach(b => b.classList.remove('active'));
            if (peerFilterBtns[0]) peerFilterBtns[0].classList.add('active');
            peerContributionForm.reset();

            if (responseAlert) {
                responseAlert.classList.remove('hidden');
                setTimeout(() => responseAlert.classList.add('hidden'), 5000);
            }
        });
    }

    // --- DICTIONARY ---
    const categories = ["Active Component", "Product Function", "Anatomy", "Biology"];
    const matrix = [
        ["Hyaluronic Acid", 0, "A moisture-binding molecule holding up to 1000x its weight in water.", "Apply to damp skin."],
        ["Niacinamide", 0, "Vitamin B3 compound strengthening the barrier and balancing sebum.", "Mixes smoothly with actives."]
    ];

    const dictionaryListContainer = document.getElementById('dictionaryListContainer');
    const dictionarySearchInput = document.getElementById('dictionarySearchInput');

    function renderDictionaryList(searchTerm = "") {
        if (!dictionaryListContainer) return;
        const cleanSearch = searchTerm.toLowerCase().trim();
        
        const filtered = matrix.filter(row => 
            row[0].toLowerCase().includes(cleanSearch) || 
            row[2].toLowerCase().includes(cleanSearch)
        );

        if (filtered.length === 0) {
            dictionaryListContainer.innerHTML = `<p class="text-muted" style="grid-column: 1/-1; text-align: center;">No vocabulary terms match.</p>`;
            return;
        }

        dictionaryListContainer.innerHTML = filtered.map(row => `
            <div class="dict-card tab-fade-animation">
                <div class="dict-header">
                    <h3>${row[0]}</h3>
                    <span class="dict-tag">${categories[row[1]]}</span>
                </div>
                <p class="dict-def">${row[2]}</p>
                <div class="dict-protip"><strong>🧠 Pro Insight:</strong> ${row[3]}</div>
            </div>
        `).join('');
    }

    if (dictionarySearchInput) {
        dictionarySearchInput.addEventListener('input', (e) => renderDictionaryList(e.target.value));
    }

    // --- OTHER INTERACTIVES ---
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.documentElement.toggleAttribute('data-theme', document.documentElement.getAttribute('data-theme') !== 'dark');
        });
    }

    const printRoutineBtn = document.getElementById('printRoutineBtn');
    if (printRoutineBtn) printRoutineBtn.addEventListener('click', () => window.print());

    const currencySelector = document.getElementById('currencySelector');
    if (currencySelector && budgetSlider) {
        currencySelector.addEventListener('change', (e) => {
            currentCurrency = e.target.value;
            const config = currencyMap[currentCurrency];
            budgetSlider.max = config.maxBudget;
            budgetSlider.step = config.step;
            budgetSlider.value = Math.floor(config.maxBudget / 2);
            calculateSkinTrajectory();
        });
    }

    // AUTO-FETCH PROFILE FROM SUPABASE ON LOAD
    async function loadSavedProfileFromCloud() {
        if (!supabase) return;
        try {
            const { data } = await supabase
                .from('user_profiles')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1);

            if (data && data.length > 0) {
                const latest = data[0];
                userSkinProfile.baseType = latest.base_type || "Normal";
                userSkinProfile.reactivity = latest.reactivity || "Resilient";
                userSkinProfile.acneProne = latest.acne_prone || false;
                userSkinProfile.dehydrated = latest.dehydrated || false;
                userSkinProfile.phototype = latest.phototype || "Type III";
                userSkinProfile.isCalculated = true;

                calculateSkinTrajectory();
            }
        } catch (err) {
            console.warn("Could not auto-fetch cloud profile:", err);
        }
    }

    // --- INITIAL RENDER ---
    calculateSkinTrajectory();
    renderCards("all");
    renderDictionaryList("");
    loadSavedProfileFromCloud();
});

// Inline helper
function refreshTip() {
    const tips = [
        "Your skin is a living shield protecting you from the world. Give it grace.",
        "Consistency with safe elements outperforms a 10-step luxury routine.",
        "Skin healing is non-linear. An unexpected flare-up doesn't erase progress."
    ];
    const targetElement = document.getElementById('dailyTip');
    if (targetElement) {
        targetElement.textContent = tips[Math.floor(Math.random() * tips.length)];
    }
}
