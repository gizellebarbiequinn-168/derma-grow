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

    // Global Currency Engine Map (Covers key regions around the world)
    const currencyMap = {
        "IDR": { locale: "id-ID", symbol: "Rp ", maxBudget: 300000, step: 10000 },
        "USD": { locale: "en-US", symbol: "$", maxBudget: 30, step: 1 },
        "EUR": { locale: "de-DE", symbol: "€", maxBudget: 30, step: 1 },
        "GBP": { locale: "en-GB", symbol: "£", maxBudget: 25, step: 1 },
        "SGD": { locale: "en-SG", symbol: "S$", maxBudget: 40, step: 1 },
        "AUD": { locale: "en-AU", symbol: "A$", maxBudget: 45, step: 1 }
    };
    let currentCurrency = "IDR"; // Default

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
                summaryLabel.textContent = `🎉 Trend Avoided: Dropping ${unsafeHaltedCount} aggressive trends protects your skin surface. You also saved roughly ${formatGlobalCurrency(savingsValue, currentCurrency)} in unnecessary product costs!`;
            } else if (finalScore >= 85) {
                summaryLabel.textContent = `🎯 Core Routine Built: Your minimalist routine layout is complete. Keep up the daily consistency!`;
            } else {
                summaryLabel.textContent = `💡 Routine Builder Active. Interact with the checkboxes or hit the Starter Pack button to see layout responses.`;
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

    // Global Multi-Currency Formatting Engine
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
        let summaryText = "Awaiting selections: Add affordable core essentials (Cleanser/Lotion) to see layout response visualizers.";
        
        let amSteps = ["Rinse skin with clean, lukewarm water."];
        let pmSteps = ["Rinse away daily environmental sweat or dust."];

        if (state['chk-lemon'] || state['chk-scrubs']) {
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
            if (userSkinProfile.baseType === "Dry") {
                metrics = [50, 38, 28, 20, 15, 10, 8]; currentEvaluatedScore = 8;
                summaryText += " Having a dry skin type increases the likelihood of active irritation and cracking.";
            }
            amSteps = ["Temporarily stop using high-potency active serums.", "Splash face with cool water to avoid stripping native moisture."];
            pmSteps = ["Skip the high-strength active product tonight.", "Focus on finding a simple, low-cost hydrating lotion when your budget allows."];
        }
        else if (state['chk-moisturizer'] && state['chk-cleanser'] && state['chk-sunscreen']) {
            let score = 85;
            summaryText = "COMPLETE BASELINE ROUTINE: Your foundational loop is complete. Gentle cleansing, basic hydration, and broad-spectrum UV protection work together for maximum safety.";
            
            amSteps = ["Rinse with water or an ultra-mild splash.", "Apply your basic moisturizer/lotion.", "Apply Broad-Spectrum Sunscreen (Crucial daily protection)."];
            pmSteps = ["Use your Gentle Low-pH Cleanser to break down sunscreen and buildup.", "Apply basic moisturizer to damp skin within a few minutes of drying."];
            
            if (userSkinProfile.baseType === "Oily") {
                summaryText += " Hint: Since your skin type is Oily, check that your lotion is a lightweight fluid rather than a heavy wax cream.";
            }
            if (userSkinProfile.dehydrated && state['chk-toner']) {
                score += 3;
                summaryText += " Adding a toner helps soothe surface-level dehydration lines.";
            }
            if (state['chk-niacinamide']) { 
                score += 11; 
                summaryText += " Niacinamide supports natural skin hydration paths."; 
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
        { q: "1. Biological Age Group: Sebum and cellular cycles change dramatically across ages. What is your age category?", a: [ { text: "Teens (High hormonal sebum shifts)", type: "age:Teens" }, { text: "20s - 30s (Baseline skin turnover)", type: "age:Adult" }, { text: "40s+ (Slower lipid barrier synthesis)", type: "age:Mature" } ] },
        { q: "2. Gender Expression / Hormonal Identity: Topical product preferences and testosterone-driven skin thickness profiles vary. Select your profile:", a: [ { text: "Masculine (Typically thicker skin, higher active sebaceous counts)", type: "gender:Masculine" }, { text: "Feminine (Hormonally fluid barriers across monthly cycles)", type: "gender:Feminine" }, { text: "Neutral / Prefer Not to Say", type: "gender:Neutral" } ] },
        { q: "3. Fitzpatrick Skin Phototype Scale: How does your skin tone naturally react to direct, unprotected midday sun exposure?", a: [ { text: "Always burns, never tans (Very Fair - Phototype I/II)", type: "photo:Type I-II" }, { text: "Burns moderately, tans gradually (Medium/Olive - Phototype III/IV)", type: "photo:Type III-IV" }, { text: "Rarely burns, tans deeply/darkly (Rich/Deep - Phototype V/VI)", type: "photo:Type V-VI" } ] },
        { q: "4. Surface Oil production: How does your skin surface feel about an hour after washing with plain water?", a: [ { text: "Tight, flaky, or visibly matte all over", type: "base:Dry" }, { text: "Slick, shiny, or greasy completely", type: "base:Oily" }, { text: "Oily on forehead/nose but tight on outer cheeks", type: "base:Combination" }, { text: "Comfortable, smooth, and well balanced", type: "base:Normal" } ] },
        { q: "5. Comfort Sensitivity: How often do you feel stinging, burning, or redness from basic skin essentials?", a: [ { text: "Frequently, especially when trying simple products or weather shifts", type: "react:Sensitive" }, { text: "Rarely or never, skin easily handles adjustments", type: "react:Resilient" } ] },
        { q: "6. Breakout Tendencies: Do you experience frequent breakouts, bumps, or blackheads in high-oil zones?", a: [ { text: "Yes, standard clogged cycles occur regularly", type: "acne:true" }, { text: "No, blemishes are quite rare or heal rapidly", type: "acne:false" } ] },
        { q: "7. Surface Tightness: Does your skin feel tight underneath, even if there is visible grease or oil on top?", a: [ { text: "Yes, it feels pulled or crinkled but stays slick on top", type: "dehyd:true" }, { text: "No, skin comfort matches the surface oil level", type: "dehyd:false" } ] },
        { q: "8. Mechanical Friction: Rubbing your face with a standard towel or rough washcloth causes what immediate symptom?", a: [ { text: "Flashing redness, irritation, or clear stinging", type: "react:Sensitive" }, { text: "No significant color change or irritation", type: "react:Resilient" } ] },
        { q: "9. Active Acid Adaptation: What occurs if you use a strong over-the-counter retinol or peeling product?", a: [ { text: "Immediate burning, clear peeling, or compromised raw skin", type: "react:Sensitive" }, { text: "Slight temporary dry phase, but skin handles it fine", type: "react:Resilient" } ] }
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

    function evaluateQuizResults() {
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

        let typeStr = `${determinedBase} Profile (${selectedAge} / ${selectedPhoto})`; 
        let descStr = `Targeting a specialized solution for your assigned profile. `;

        if (selectedPhoto.includes("Type V-VI")) {
            descStr += "⚠️ Darker Phototypes heal with higher rates of Post-Inflammatory Hyperpigmentation (PIH). Avoid popping acne or picking skin surface friction boundaries to bypass dark marks.";
        }
        if (selectedAge === "Teens" && determinedBase === "Oily") {
            descStr += " Your profile matches active teenage sebaceous pathways. Do not panic and try to blast it away with heavy drying alcohols; your moisture barrier needs non-comedogenic balancing care.";
        }
        if (userSkinProfile.dehydrated) {
            descStr += " Note: Your quiz answers also suggest surface dehydration (a lack of bound water in the outer cell layers).";
        }
        
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
                window.scrollTo({ top: document.getElementById('impactMatrix').offsetTop - 20, behavior: 'smooth' });
            }
        });
    }
    const resetQuizBtn = document.getElementById('resetQuizBtn');
    if (resetQuizBtn) resetQuizBtn.addEventListener('click', initializeQuizEngine);

    // --- ACADEMY RESOURCE HUB DATA LAYER ---
    const scienceDatabase = [
        { id: 1, category: "myths", badge: "Trend Debunker", badgeClass: "badge-myth", title: "The DIY Lemon Juice Trend", description: "Applying raw lemon juice strips your natural acid mantle (~4.5 pH) due to its extreme acidity (~2.0 pH), inducing chemical irritation and hyperpigmentation.", actionText: "View PubChem Reference Data →", link: "https://pubchem.ncbi.nlm.nih.gov/compound/Citric-acid#section=Safety-and-Hazards" },
        { id: 2, category: "myths", badge: "Trend Debunker", badgeClass: "badge-myth", title: "Physical Scrubs vs. Friction", description: "Abrasives like crushed seed shells cause micro-scratches in vulnerable surface cells, disrupting moisture protection and causing water loss.", actionText: "Read NCBI Skin Friction Studies →", link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5608132/" },
        { id: 3, category: "classification", badge: "Product Category", badgeClass: "badge-class", title: "Cleansers: Low-pH Surfactants", description: "Traditional soaps feature alkaline pH profiles (>9.0) that strip structural skin components. Low-pH alternatives clean effectively without depleting native lipids.", actionText: "Read PMC Surfactant Formulation Science →", link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3088928/" },
        { id: 4, category: "classification", badge: "Product Category", badgeClass: "badge-class", title: "Moisturizers: Essential Types", description: "Humectants bind moisture inside epidermal layers, while occlusives form a physical surface layout that lowers Transepidermal Water Loss (TEWL).", actionText: "Read Harvard Health Dermatological Guide →", link: "https://www.health.harvard.edu/staying-healthy/the-hype-over-skin-care-ingredients" },
        { id: 5, category: "actives", badge: "Skincare Ingredient", badgeClass: "badge-science", title: "L-Ascorbic Acid (Vitamin C)", description: "A well-studied antioxidant that neutralizes environmental free radicals caused by daily UV exposure while supporting structural cell preservation.", actionText: "Read Cochrane Antioxidant Efficacy Review →", link: "https://www.cochrane.org/CD004135/SKIN_antioxidants-for-preventing-skin-ageing-caused-by-the-sun" },
        { id: 6, category: "actives", badge: "Skincare Ingredient", badgeClass: "badge-science", title: "Niacinamide (Vitamin B3)", description: "Extensively researched molecule shown to boost ceramide production, lower baseline TEWL values, and balance surface sebum metrics.", actionText: "View PubMed Niacinamide Trial Data →", link: "https://pubmed.ncbi.nlm.nih.gov/12100180/" },
        { id: 7, category: "anatomy", badge: "Skin Biology", badgeClass: "badge-science", title: "The Skin Barrier Frame", description: "An architectural overview of the stratum corneum's 'brick and mortar' layout: corneocytes act as protective bricks, and specialized lipids act as mortar.", actionText: "Read JID Barrier Function Literature →", link: "https://www.jidonline.org/article/S0022-202X(15)34551-7/fulltext" },
        { id: 8, category: "anatomy", badge: "Skin Biology", badgeClass: "badge-science", title: "The Protective Acid Mantle", description: "An interactive analysis of how native free fatty acids lower human surface pH to safeguard against environmental stressors and support optimal cell shedding.", actionText: "Read Wiley Hydrophilic Film Analysis →", link: "https://onlinelibrary.wiley.com/doi/10.1111/ics.12745" }
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

    // --- GLOBAL BUDGET PEER RECOMMENDATIONS REGISTRY ---
    const peerRegistryDatabase = [
        { id: 1, skinType: "Oily", product: "Garnier Micellar Water Blue", cost: "Rp 35.000 / $3", ingredients: "Water, Hexylene Glycol, Glycerin, Disodium Cocoamphodiacetate", usage: "Pour onto cotton pad, wipe skin surface gently.", definition: "Oil-free, ultra-low cost surfactant solution that cleanses away sunscreen layers without clogging active pore vents." },
        { id: 2, skinType: "Dry", product: "The Ordinary Natural Moisturizing Factors", cost: "Rp 120.000 / $8", ingredients: "Caprylic Triglyceride, Amino Acids, Ceramides, Hyaluronic Acid", usage: "Apply a pea-sized dot over damp skin right after rinsing.", definition: "A dense, clean barrier matching compound setup to resolve cellular skin flaking without adding external fragrances." },
        { id: 3, skinType: "Sensitive", product: "Cetaphil Gentle Skin Cleanser", cost: "Rp 65.000 / $6", ingredients: "Water, Cetyl Alcohol, Propylene Glycol, Stearyl Alcohol", usage: "Massage lightly over wet face, rinse completely with lukewarm water.", definition: "Classic non-foaming, dermatologist-staple emulsion structure built to cleanse surface boundaries without disrupting pH scores." },
        { id: 4, skinType: "Normal", product: "Azarine Hydrasoothe Sunscreen Gel SPF 45", cost: "Rp 65.000 / $5", ingredients: "Water, Aloe Vera, Green Tea Extract, Propolis, Niacinamide", usage: "Smooth two complete finger lengths across the skin before sun exposure.", definition: "Incredibly lightweight, organic chemical filter matrix that leaves zero white residue tracks or heavy oily sheen layers." },
        { id: 5, skinType: "Oily", product: "The Inkey List Salicylic Acid Cleanser", cost: "$11 / Rp 165.000", ingredients: "2% Salicylic Acid (BHA), Zinc PCA, Allantoin", usage: "Massage into damp skin for 60 seconds at night, then rinse.", definition: "BHA breaks through thick pore grease lines to directly target blackheads and localized acne clusters cleanly." },
        { id: 6, skinType: "Dry", product: "CeraVe Moisturizing Cream", cost: "$15 / Rp 220.000", ingredients: "Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine", usage: "Smooth into damp skin matrix directly after washing routines.", definition: "A rich, slow-release MVE delivery matrix that pumps core skin lipids back into empty cell gaps to block moisture evaporation." },
        { id: 7, skinType: "Sensitive", product: "La Roche-Posay Cicaplast Baume B5+", cost: "$19 / Rp 280.000", ingredients: "5% Panthenol (Vitamin B5), Madecassoside, Zinc, Manganese", usage: "Layer over uncomfortably raw, flaky, or red zones before bed.", definition: "The global gold-standard heavy emergency cream designed to soothe skin inflammation zones and bind moisture immediately." },
        { id: 8, skinType: "Normal", product: "Cosrx Advanced Snail 96 Mucin Power Essence", cost: "$17 / Rp 250.000", ingredients: "96.3% Snail Secretion Filtrate, Sodium Hyaluronate, Allantoin", usage: "Pat across damp surface fields right before lock-in moisturizers.", definition: "Gelatinous moisture network providing deep, weightless hydration to keep healthy barriers beautifully elastic and smooth." }
    ];

    const peerRegistryGrid = document.getElementById('peerRegistryGrid');
    const peerFilterBtns = document.querySelectorAll('.peer-filter-btn');

    function renderPeerRegistry(skinFilter) {
        if (!peerRegistryGrid) return;
        const filteredData = peerRegistryDatabase.filter(item => skinFilter === "all" || item.skinType === skinFilter);
        
        if (filteredData.length === 0) {
            peerRegistryGrid.innerHTML = `<div class="content-card"><p class="text-muted">No community recommendations logged yet for this category.</p></div>`;
            return;
        }

        peerRegistryGrid.innerHTML = filteredData.map(item => `
            <div class="content-card tab-fade-animation" style="border-top: 3px solid var(--brand-accent);">
                <span class="badge ${item.skinType === 'Oily' ? 'badge-science' : item.skinType === 'Dry' ? 'badge-myth' : 'badge-class'}">${item.skinType} Skin</span>
                <h3 style="margin-top: 0.25rem; font-size: 1.15rem; color: var(--brand-primary);">${item.product}</h3>
                <p style="font-size: 0.85rem; font-weight: 700; color: var(--brand-accent); margin-bottom: 0.5rem;">Cost: ${item.cost}</p>
                <p style="font-size: 0.85rem; color: var(--color-text-main); line-height: 1.5; margin-bottom: 0.75rem;"><strong>Notes:</strong> "${item.definition}"</p>
                <div style="background: var(--bg-main); padding: 0.6rem; border-radius: 6px; font-size: 0.8rem; border: 1px solid var(--border-subtle);">
                    <p style="margin-bottom: 0.25rem;">🧪 <strong>Ingredients:</strong> ${item.ingredients}</p>
                    <p>⚙️ <strong>Directions:</strong> ${item.usage}</p>
                </div>
            </div>
        `).join('');
    }

    peerFilterBtns.forEach(btn => btn.addEventListener('click', () => {
        peerFilterBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
        renderPeerRegistry(btn.getAttribute('data-skin'));
    }));

    // --- LOG DATA VIA FORMSPREE ---
    const peerContributionForm = document.getElementById('peerContributionForm');
    if (peerContributionForm) {
        peerContributionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const data = new FormData(e.target);
            const responseAlert = document.getElementById('peerSuccessMessage');
            
            const selectedSkin = document.getElementById('peerSkinType').value;
            const enteredProd = document.getElementById('peerProdName').value;
            const enteredPrice = document.getElementById('peerPrice').value;
            const enteredIngredients = document.getElementById('peerIngredients').value;
            const enteredUsage = document.getElementById('peerUsage').value;
            const enteredNotes = document.getElementById('peerNotes').value;

            fetch(peerContributionForm.action, {
                method: peerContributionForm.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
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
                } else { alert("Submission error. Please verify form connectivity."); }
            }).catch(() => { alert("Network error. Please check your system connection."); });
        });
    }

    // --- HIGHLY EFFICIENT DATA MATRIX DICTIONARY ---
    const categories = ["Active Component", "Product Function", "Anatomy", "Biology"];
    const matrix = [
        ["Hyaluronic Acid", 0, "A moisture-binding molecule that holds up to 1000x its weight in water to plump the skin surface.", "Apply to damp skin to prevent drawing moisture outward."],
        ["Niacinamide", 0, "Vitamin B3 compound that strengthens the barrier, limits excess sebum production, and unifies tone.", "Mixes smoothly with most actives without causing flares."],
        ["Retinol", 0, "Vitamin A derivative that accelerates cell turnover and stimulates structural collagen paths.", "Use strictly at night and wear broad-spectrum protection by day."],
        ["Salicylic Acid", 0, "Oil-soluble Beta Hydroxy Acid (BHA) that cuts through sebum inside pore walls.", "Perfect spot solution for blackheads and clogged zones."],
        ["Glycolic Acid", 0, "Alpha Hydroxy Acid (AHA) with small molecular weight for fast surface micro-exfoliation.", "Can cause mild initial stinging on sensitive complexions."],
        ["Tocopherol", 0, "Vitamin E skin-identical lipid antioxidant providing structural lipid protection.", "Synergizes perfectly with Vitamin C to double free-radical defense."],
        ["Centella Asiatica", 0, "Botanical herb concentration famous for calming tissue and reducing visual surface scaling.", "Your primary weapon for treating an over-exfoliated skin barrier."],
        ["Squalane", 0, "Saturated, highly shelf-stable emollient oil mimicking native skin lipids.", "Biocompatible fluid that won't trigger standard oily breakouts."],
        ["Benzoyl Peroxide", 0, "Antimicrobial compound that sends oxygen into pore channels to destroy acne-causing bacteria.", "Can discolor colored linens; rinse off completely if using body washes."],
        ["Titanium Dioxide", 0, "Inert mineral active that remains on top of surface layers to deflect UV wavelengths.", "Highly stable and recommended for reactive or rosacea-prone paths."],
        ["Humectant", 1, "Water-loving ingredients drawing hydration up from deeper cells or humid external environments.", "Glycerin and Hyaluronic Acid are classic functional examples."],
        ["Emollient", 1, "Smoothing oils or fatty lipids that patch structural gaps between dry shedding cells.", "Restores immediate elasticity and silkiness to flaky surfaces."],
        ["Occlusive", 1, "Hydrophobic compounds building an invisible protective seal to curb moisture loss.", "Apply as your final nighttime step to lock in lighter serums."],
        ["Lotion", 1, "Lightweight fluid emulsions combining balanced ratios of oil and water phases.", "Absorbs cleanly without forming heavy waxy residue tracks."],
        ["Moisturizer", 1, "Topical mixtures structured to maintain stratum corneum hydration levels.", "Apply within minutes after cleaning to bind maximum surface water."],
        ["Epidermis", 2, "The stratified outermost biological block shielding against dehydration and external microbes.", "The primary zone where non-prescription cosmetic topical items react."],
        ["Stratum Corneum", 2, "The thin exterior brick-and-mortar skin matrix acting as your primary moisture barrier.", "Keep this layer shielded; avoiding harsh friction preserves it best."],
        ["Melanin", 3, "Natural color pigments synthesised by melanocytes to shield cellular DNA from radiation.", "Inflammation or picking pimples accelerates localized melanin spots."],
        ["Sebum", 3, "Native waxy oil secretions layout lubricating external structural layers.", "Balanced sebum acts as a built-in age shield; don't over-strip it."],
        ["Ceramides", 0, "Crucial structural lipids making up over 50% of the natural matrix linking skin cells.", "Look for these if your moisture shield feels raw or flaky."],
        ["Glycerin", 0, "A cost-effective, time-tested humectant that pulls hydration into surface layers.", "Extremely safe, non-reactive, and perfect for strict budget configurations."],
        ["Lactic Acid", 0, "An AHA derived from milk that removes surface buildup while acting as a natural humectant.", "Gentler exfoliation alternative than Glycolic Acid for dry skin types."],
        ["Azelaic Acid", 0, "Dicarboxylic compound that reduces cellular redness and calms persistent dark marks.", "Great secondary option for handling post-acne blemishes safely."],
        ["Allantoin", 0, "Soothing botanical derivative that minimizes irritation and protects vulnerable surface cells.", "Commonly added to standard basic cleansers to offset stripping reactions."],
        ["Zinc Oxide", 0, "Mineral UV barrier providing broad-spectrum coverage while naturally soothing skin surface heat.", "Excellent protective filter choice for reactive or acne-prone profiles."],
        ["Panthenol", 0, "Provitamin B5 active that converts into pantothenic acid to accelerate barrier repair.", "Binds water efficiently to improve overall layer elasticity scores."],
        ["Peptides", 0, "Short strings of foundational amino acids acting as messengers to support structural density.", "Helps maintain bounce and firmness when used consistently over time."],
        ["Ascorbic Acid", 0, "Pure Vitamin C molecule specializing in neutralizing pollution stresses and brightening tone.", "Highly vulnerable to air degradation; store away from direct sunlight."],
        ["Sulfur", 0, "Traditional mineral active that dries excess surface oil and lifts dead cells out of pores.", "Effective targeted spot treatment for localized oily breakouts."],
        ["Tea Tree Oil", 0, "Natural botanical essential oil possessing clean anti-microbial properties.", "Must be heavily diluted to prevent localized chemical skin irritation."],
        ["Zinc PCA", 0, "Trace mineral compound designed to trace and control daily sebum output pathways.", "Helps regulate oily skin shine without over-drying subsurface cell blocks."],
        ["Urea", 0, "Dual-action ingredient that softens hardened proteins while infusing high-level hydration.", "Low concentrations gently encourage shedding without needing harsh friction."],
        ["Coenzyme Q10", 0, "Cellular antioxidant compound defending structural matrices from premature degradation.", "Supports natural skin defense loops against daily oxidation events."],
        ["Alpha Arbutin", 0, "Hydroquinone derivative that limits localized pigment spots without harsh toxicity metrics.", "Safe daily option for brightening uneven tone or acne shadows."],
        ["Kojic Acid", 0, "Fungal-derived brightening active that targets enzymes responsible for dark spot clusters.", "Best used inside low-dose serum layers to keep skin comfortable."],
        ["Ferulic Acid", 0, "Plant-based antioxidant compound that structurally reinforces and stabilizes Vitamin C molecules.", "Boosts the shelf life and performance of water-based active fluids."],
        ["Bakuchiol", 0, "Plant alternative offering similar turnover logic as retinols without their drying side effects.", "Excellent nighttime option if your skin profile reacts poorly to Vitamin A."],
        ["Green Tea Extract", 0, "Polyphenol powerhouse that targets internal oxidation signs while soothing surface redness.", "Calms active breakouts and shields skin from urban pollution dynamics."],
        ["Resveratrol", 0, "Grape-derived antioxidant fluid that works overnight to boost native renewal cycles.", "Supports structural bounce when integrated into simple nighttime layers."],
        ["Madecassoside", 0, "Purified active extract taken from Centella Asiatica specializing in tissue comfort.", "Reduces systemic tightness when skin boundaries feel compromised."],
        ["Beta-Glucan", 0, "Oat-derived sugar compound that holds hydration significantly better than hyaluronic acid.", "Creates a smooth protective cushion layer ideal for highly sensitive types."],
        ["Licorice Root Extract", 0, "Natural botanical compound that interrupts dark spot formation pathways visibly.", "Soothes internal skin flushing while unifying overall skin tone distribution."],
        ["Adenosine", 0, "Yeast-derived compound that aids energy pathways to reinforce natural cell maintenance.", "Helps smooth micro-creases across high-movement facial dynamic regions."],
        ["PHA (Polyhydroxy Acid)", 0, "Next-gen chemical exfoliant with large molecular volume that stays exclusively on the top layer.", "Ideal surface refiner for ultra-sensitive or easily flushed complexions."],
        ["Argan Oil", 0, "Rich botanical lipid concentration dense with nourishing oleic and linoleic essential acids.", "Best utilized by dry skin profiles needing immediate lipid reinforcement."],
        ["Jojoba Oil", 0, "Liquid wax ester structurally identical to human sebum profiles.", "Tricks oily skin into producing less native oil while smoothing texture."],
        ["Rosehip Seed Oil", 0, "Dry botanical oil high in natural trans-retinoic acid variants and essential lipids.", "Nourishes flaky skin zones without leaving heavy suffocating oil tracks."],
        ["Witch Hazel", 0, "Traditional botanical astringent that creates immediate temporary skin tightening reactions.", "Can cause chronic irritation if formulated alongside volatile drying alcohol carriers."],
        ["Hydroquinone", 0, "Potent pigment-correcting active that temporarily dampens melanin factory output loops.", "Requires professional medical tracking; never self-medicate for extended phases."],
        ["Clindamycin", 0, "Prescription topical antibiotic engineered to arrest deep microbial blemish populations.", "Should only be integrated under strict guidance from a certified physician."],
        ["Adapalene", 0, "Third-generation topical retinoid structured specifically to target deep acne plug cycles.", "Apply sparingly over completely dry surfaces at night to lower peeling risks."],
        ["Tretinoin", 0, "Highly active retinoic acid active that bonds immediately with cellular receptors.", "Prescription-only powerhouse requiring constant barrier support and strict daily UV screening."],
        ["BHA (Beta Hydroxy Acid)", 1, "Lipid-loving chemical refiners capable of working inside oily pore channels.", "The definitive category name for ingredients like Salicylic Acid."],
        ["AHA (Alpha Hydroxy Acid)", 1, "Water-soluble chemical exfoliants that loosen binding links between dead surface cells.", "Includes Glycolic, Lactic, and Mandelic acid variants."],
        ["Micellar Water", 1, "Suspension of microscopic cleansing oil bubbles inside pure purified water.", "Captures oil-based sunscreen remnants without breaking basic barrier layers."],
        ["Surfactant", 1, "Cleansing agents designed to lower water tension to sweep grease away easily.", "Look for gentle, non-foaming options to bypass tight post-wash metrics."],
        ["Physical Exfoliant", 1, "Manual tools or granular scrubs designed to physically friction away dead cells.", "Avoid heavy jagged fragments which risk creating microscopic surface scratches."],
        ["Chemical Exfoliant", 1, "Topical organic acids that dissolve cellular bonds to encourage natural shedding.", "Much easier to control and scale safely compared to abrasive mechanical friction."],
        ["Sun Protection Factor", 1, "Relative scale measuring how long a filter shield protects against UVB burning.", "Always choose at least SPF 30 for baseline daily defensive routines."],
        ["UVA Radiation", 3, "Long UV wavelengths that penetrate deep into structural frames, destroying collagen blocks.", "Present year-round through cloud cover and window panes; requires broad-spectrum shields."],
        ["UVB Radiation", 3, "Short UV wavelengths responsible for surface sunburn events and immediate tissue damage.", "Directly countered by standard SPF metric evaluations daily."],
        ["Transepidermal Water Loss", 1, "The biological measurement of water escaping through the epidermis into the atmosphere.", "Minimizing TEWL using proper emollients is crucial for skin comfort."],
        ["Dermis", 2, "The thick deep structural layer housed beneath the outer epidermal shield.", "Contains blood supply loops, sweat glands, and structural collagen cables."],
        ["Sebaceous Gland", 2, "Microscopic skin organs tasked with synthesizing and secreting sebum lubricants.", "Concentrated heavily around the forehead, nose, and upper back zones."],
        ["Acid Mantle", 2, "Vulnerable low-pH protective film coating your outer cellular boundary layout.", "Maintained by native sweat and sebum to repel microbial invaders."],
        ["Corneocytes", 2, "Hardened, dead skin cells forming the brick blocks of the outer barrier shield.", "Regularly shed off invisibly when skin turnover is functioning healthily."],
        ["Lipid Matrix", 2, "The mortar fluid (ceramides, cholesterol, fatty acids) holding skin cells together.", "Essential for stopping water from escaping and blocking irritants out."],
        ["pH Scale", 3, "Logarithmic numeric range detailing whether a fluid mix is acidic or basic.", "Skin prefers a slightly acidic environment hovering around 4.5 to 5.5."]
    ];

    const dictionaryListContainer = document.getElementById('dictionaryListContainer');
    const dictionarySearchInput = document.getElementById('dictionarySearchInput');

    function renderDictionaryList(searchTerm = "") {
        if (!dictionaryListContainer) return;
        const cleanSearch = searchTerm.toLowerCase().trim();
        
        const filtered = matrix.filter(row => 
            row[0].toLowerCase().includes(cleanSearch) || 
            row[2].toLowerCase().includes(cleanSearch) ||
            categories[row[1]].toLowerCase().includes(cleanSearch)
        );

        if (filtered.length === 0) {
            dictionaryListContainer.innerHTML = `<p class="text-muted" style="grid-column: 1/-1; text-align: center; padding: 2rem 0;">No vocabulary terms match your search query.</p>`;
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
        dictionarySearchInput.addEventListener('input', (e) => {
            renderDictionaryList(e.target.value);
        });
    }

    // --- DARK MODE CONFIGURATION ---
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        });
    }

    // --- BATHROOM PRINT SERVICE ---
    const printRoutineBtn = document.getElementById('printRoutineBtn');
    if (printRoutineBtn) {
        printRoutineBtn.addEventListener('click', () => { window.print(); });
    }

    // --- MULTI-CURRENCY DYNAMIC SWITCH EVENT ---
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

    // --- FIRST DEPLOYMENT PAINT SEQUENCE ---
    calculateSkinTrajectory();
    renderCards("all");
    renderDictionaryList("");
});

// --- GLOBAL ACCESS FOR INLINE HTML ONCLICK HANDLERS ---
function refreshTip() {
    const tips = [
        "Your skin is a complex, living shield protecting you from the entire world, not a flat digital filter. Give it grace.",
        "Consistency with safe, affordable elements outperforms an expensive, unstable 10-step luxury routine every single time.",
        "Skin healing is completely non-linear. An unexpected flare-up doesn't erase the deep progress your cellular barrier has made.",
        "Texture is entirely human—pores, bumps, and variance are physiological realities, not aesthetic structural flaws.",
        "Bypassing aggressive social media marketing hype is a sign of high logical intelligence. Your budget routine is brilliant science.",
        "Your skin protects you every second of the day. Treat it with structural kindness rather than punishing it with harsh trends.",
        "Your worth as an innovator, a student, and a human being remains entirely independent of your topical skin barrier state."
    ];
    const targetElement = document.getElementById('dailyTip');
    if (targetElement) {
        targetElement.textContent = tips[Math.floor(Math.random() * tips.length)];
    }
}
