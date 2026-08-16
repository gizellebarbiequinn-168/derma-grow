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

    // --- QUIZ ENGINE STATE & DATA ---
    let currentQuizStep = 0;
    const quizQuestions = [
        {
            title: "Skin Feeling",
            question: "How does your skin feel 30 minutes after washing without applying moisturizer?",
            options: [
                { text: "Tight and rough", type: "Dry" },
                { text: "Shiny and oily all over", type: "Oily" },
                { text: "Oily on T-zone, normal elsewhere", type: "Combination" },
                { text: "Comfortable and balanced", type: "Normal" }
            ]
        },
        {
            title: "Reactivity",
            question: "How easily does your skin flush, sting, or burn when trying new products?",
            options: [
                { text: "Frequently stings or flushes", reactivity: "Sensitive" },
                { text: "Rarely reacts or burns", reactivity: "Resilient" }
            ]
        }
    ];

    // --- MAIN CORE NAVIGATION ROUTING ---
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
            e.preventDefault(); 
            clearActiveTabs();
            navDashboard.classList.add('active');
            if (trackerCard) trackerCard.classList.remove('hidden');
            
            calculateSkinTrajectory();
            if (dermaChart) {
                dermaChart.resize();
            }
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

    // --- QUIZ RENDER ENGINE ---
    function initializeQuizEngine() {
        currentQuizStep = 0;
        renderQuizStep();
    }

    function renderQuizStep() {
        if (!quizSection) return;
        
        if (currentQuizStep >= quizQuestions.length) {
            userSkinProfile.isCalculated = true;
            quizSection.innerHTML = `
                <div class="content-card text-center" style="padding: 2rem;">
                    <h3>🎉 Assessment Complete!</h3>
                    <p>Your profile is synced as: <strong>${userSkinProfile.baseType}</strong> (${userSkinProfile.reactivity})</p>
                    <button id="btnReturnDashboard" class="filter-btn active" style="margin-top: 1rem;">Go to Routine Builder</button>
                </div>
            `;
            const btnReturn = document.getElementById('btnReturnDashboard');
            if (btnReturn && navDashboard) btnReturn.addEventListener('click', () => navDashboard.click());
            return;
        }

        const q = quizQuestions[currentQuizStep];
        quizSection.innerHTML = `
            <div class="content-card tab-fade-animation">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3 style="margin: 0;">${q.title}</h3>
                    <span style="font-size: 0.85rem; color: var(--brand-accent);">Step ${currentQuizStep + 1} of ${quizQuestions.length}</span>
                </div>
                <p>${q.question}</p>
                <div id="quizOptionsContainer" style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.5rem;">
                    ${q.options.map((opt, idx) => `
                        <button class="quiz-opt-btn filter-btn" data-index="${idx}" style="width: 100%; text-align: left; padding: 0.8rem 1rem;">
                            ${opt.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        const optionButtons = quizSection.querySelectorAll('.quiz-opt-btn');
        optionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selectedOpt = q.options[parseInt(e.currentTarget.getAttribute('data-index'))];
                if (selectedOpt.type) userSkinProfile.baseType = selectedOpt.type;
                if (selectedOpt.reactivity) userSkinProfile.reactivity = selectedOpt.reactivity;
                
                currentQuizStep++;
                renderQuizStep();
            });
        });
    }

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
                summaryLabel.textContent = `🎉 Trend/Hazard Avoided: Halting ${unsafeHaltedCount} risky ingredients protects your skin surface. Estimated savings: ${formatGlobalCurrency(savingsValue, currentCurrency)}!`;
            } else if (finalScore >= 85) {
                summaryLabel.textContent = `🎯 Core Routine Built: Your minimalist routine layout is complete. Keep up the daily consistency!`;
            } else {
                summaryLabel.textContent = `💡 Routine Builder Active. Interact with checkboxes or hit Starter Pack to see layout updates.`;
            }
        }
    }

    const budgetSlider = document.getElementById('budgetSlider');
    const budgetValue = document.getElementById('budgetValue');
    const reportContent = document.getElementById('reportContent');
    const protocolBox = document.getElementById('protocolBox');
    const amRoutineList = document.getElementById('amRoutineList');
    const pmRoutineList = document.getElementById('pmRoutineList');
    const profileSyncBadge = document.getElementById('profileSyncBadge');

    const selectors = ['chk-moisturizer', 'chk-cleanser', 'chk-sunscreen', 'chk-toner', 'chk-niacinamide', 'chk-actives', 'chk-lemon', 'chk-scrubs', 'chk-mercury', 'chk-steroids', 'chk-dyes', 'chk-lead'];
    let dermaChart = null;

    function formatGlobalCurrency(amount, currencyCode) {
        const config = currencyMap[currencyCode] || { locale: "en-US", symbol: "$" };
        return new Intl.NumberFormat(config.locale, {
            style: 'currency',
            currency: currencyCode,
            maximumFractionDigits: 0
        }).format(amount);
    }

    function calculateSkinTrajectory() {
        if (!budgetSlider) return;
        
        const budget = parseInt(budgetSlider.value);
        if (budgetValue) budgetValue.textContent = formatGlobalCurrency(budget, currentCurrency);

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
        selectors.forEach(id => { 
            const el = document.getElementById(id); 
            state[id] = el ? el.checked : false; 
        });

        let unsafeHaltedCount = 0;
        if (state['chk-lemon']) unsafeHaltedCount++;
        if (state['chk-scrubs']) unsafeHaltedCount++;
        if (state['chk-mercury']) unsafeHaltedCount++;
        if (state['chk-steroids']) unsafeHaltedCount++;
        if (state['chk-dyes']) unsafeHaltedCount++;
        if (state['chk-lead']) unsafeHaltedCount++;
        if (state['chk-actives'] && !state['chk-moisturizer']) unsafeHaltedCount++;

        const labels = ["Day 1", "Day 3", "Day 5", "Day 7", "Day 10", "Day 12", "Day 14"];
        let metrics = [50, 50, 50, 50, 50, 50, 50];
        let currentEvaluatedScore = 50;
        let summaryText = "Awaiting selections: Add affordable core essentials (Cleanser/Lotion) to see layout response visualizers.";
        
        let amSteps = ["Rinse skin with clean, lukewarm water."];
        let pmSteps = ["Rinse away daily environmental sweat or dust."];

        if (state['chk-mercury'] || state['chk-steroids'] || state['chk-dyes'] || state['chk-lead']) {
            metrics = [50, 20, 10, 5, 2, 1, 0]; currentEvaluatedScore = 0;
            summaryText = "HAZARD CRITICAL WARNING: Dangerous unverified/banned substances (Mercury, Steroids, Toxic Dyes, or Lead) detected. Discontinue use immediately to prevent severe organ and barrier damage.";
            amSteps = ["HALT ALL UNVERIFIED PRODUCTS IMMEDIATELY.", "Wash gently with cool plain water."];
            pmSteps = ["Do not apply uncertified creams or steroids.", "Consult a medical professional if suffering from skin thinning or discolored patches."];
        }
        else if (state['chk-lemon'] || state['chk-scrubs']) {
            metrics = [50, 35, 22, 12, 6, 4, 3]; currentEvaluatedScore = 3;
            summaryText = "ROUTINE WARNING: High acidity or harsh friction from physical trends strips away moisture layers. Stop using these items immediately to let your skin rest.";
            if (userSkinProfile.reactivity === "Sensitive") {
                metrics = [50, 25, 12, 5, 2, 1, 1]; currentEvaluatedScore = 1;
                summaryText += " Because your quiz responses showed sensitive traits, irritation risks are heavily elevated.";
            }
            amSteps = ["SKIP UNNECESSARY REMEDIES AND SCRUBS.", "Wash gently with cool plain water only to minimize further irritation."];
            pmSteps = ["Stop using harsh physical brushes or kitchen ingredients.", "Apply basic moisturizer or glycerin if available; otherwise leave bare."];
        } 
        else if (state['chk-actives'] && !state['chk-moisturizer']) {
            metrics = [50, 44, 36, 30, 25, 20, 15]; currentEvaluatedScore = 15;
            summaryText = "ACTIVE INGREDIENT IRRITATION: Using high-strength active ingredients without a basic moisturizer can cause dryness and flaking. Pause the active ingredient until a baseline routine is built.";
            amSteps = ["Temporarily stop using high-potency active serums.", "Splash face with cool water to avoid stripping native moisture."];
            pmSteps = ["Skip the high-strength active product tonight.", "Focus on finding a simple, low-cost hydrating lotion when your budget allows."];
        }
        else if (state['chk-moisturizer'] && state['chk-cleanser'] && state['chk-sunscreen']) {
            let score = 85;
            summaryText = "COMPLETE BASELINE ROUTINE: Your foundational loop is complete. Gentle cleansing, basic hydration, and broad-spectrum UV protection work together for maximum safety.";
            
            amSteps = ["Rinse with water or an ultra-mild splash.", "Apply your basic moisturizer/lotion.", "Apply Broad-Spectrum Sunscreen (Crucial daily protection)."];
            pmSteps = ["Use your Gentle Low-pH Cleanser to break down sunscreen and buildup.", "Apply basic moisturizer to damp skin within a few minutes of drying."];

            if (state['chk-niacinamide']) { score += 11; pmSteps.push("Optional: Apply Niacinamide serum before moisturizer."); }
            if (state['chk-toner']) { score += 4; amSteps.splice(1, 0, "Optional: Pat gentle hydrating toner over damp skin."); }
            currentEvaluatedScore = Math.min(score, 100);
            metrics = [50, 62, 72, 80, 86, 90, currentEvaluatedScore];
        }
        else if (state['chk-moisturizer'] && state['chk-cleanser']) {
            currentEvaluatedScore = 75; metrics = [50, 55, 62, 68, 72, 74, 75];
            summaryText = "ESSENTIAL MINIMALIST HYDRATION: Excellent low-cost baseline. Your routine consistency is projected to show steady benefits. Adding an affordable sunscreen will complete the loop.";
            amSteps = ["Rinse face thoroughly with clean, lukewarm water.", "Apply a thin layer of basic moisturizer / glycerin."];
            pmSteps = ["Cleanse face using your Gentle Low-pH Cleanser.", "Apply basic moisturizer over damp skin to prevent surface moisture loss."];
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
    }

    function renderVisualThresholdChart(labels, metrics) {
        const chartCanvas = document.getElementById('dermaChart');
        if (!chartCanvas) return;

        if (chartCanvas.offsetWidth === 0 || chartCanvas.offsetHeight === 0) {
            return;
        }

        const ctx = chartCanvas.getContext('2d');
        if (dermaChart) { dermaChart.destroy(); }
        dermaChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{ label: 'Illustrative Habit Track (%)', data: metrics, borderColor: '#4A5548', borderWidth: 2.5, pointBackgroundColor: '#D4AF37', tension: 0.1, fill: false }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } } }
        });
    }

    if (budgetSlider) budgetSlider.addEventListener('input', calculateSkinTrajectory);
    selectors.forEach(id => { 
        const el = document.getElementById(id); 
        if (el) {
            el.addEventListener('change', () => {
                calculateSkinTrajectory();
            });
        }
    });

    // --- INITIALIZATION ---
    calculateSkinTrajectory();
});
