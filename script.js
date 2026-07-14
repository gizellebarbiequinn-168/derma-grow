document.addEventListener("DOMContentLoaded", () => {
    // --- GLOBAL SYNCHRONIZED STATE ENGINE ---
    let userSkinProfile = {
        baseType: "Normal",     
        reactivity: "Resilient", 
        acneProne: false,
        dehydrated: false,
        isCalculated: false
    };

    // --- APPLICATION NAVIGATION ROUTING (5 MAIN NODES) ---
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

    // --- LOCAL SAVED METRICS ---
    function updateHonestLocalMetrics(state, finalScore) {
        const itemsSavedCount = document.getElementById('itemsSavedCount');
        const optimizationDelta = document.getElementById('optimizationDelta');
        const summaryLabel = document.getElementById('impactSummaryText');

        let unsafeHaltedCount = 0;
        if (state['chk-lemon']) unsafeHaltedCount++;
        if (state['chk-scrubs']) unsafeHaltedCount++;
        if (state['chk-actives'] && !state['chk-moisturizer']) unsafeHaltedCount++;
        
        if (itemsSavedCount) itemsSavedCount.textContent = unsafeHaltedCount;

        const baselineDefaultScore = 50;
        let delta = finalScore - baselineDefaultScore;
        if (optimizationDelta) optimizationDelta.textContent = delta >= 0 ? `+${delta}%` : `${delta}%`;

        if (summaryLabel) {
            if (unsafeHaltedCount > 0) {
                summaryLabel.textContent = `🎉 Trend Avoided: Dropping ${unsafeHaltedCount} aggressive trends protects your skin surface. You also saved roughly Rp ${(unsafeHaltedCount * 60000).toLocaleString('id-ID')} in unnecessary product costs!`;
            } else if (finalScore >= 85) {
                summaryLabel.textContent = `🎯 Core Routine Built: Your minimalist routine layout is complete. Keep up the daily consistency!`;
            } else {
                summaryLabel.textContent = `💡 Routine Builder Active. Interact with the checkboxes or hit the Starter Pack button to see layout responses.`;
            }
        }
    }

    // --- LIVE FEEDBACK BOX SUBMISSION LINKED TO FORMSPREE ---
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

    // --- HABIT VISUALIZATION AND TIMELINE LOGIC ENGINE ---
    const budgetSlider = document.getElementById('budgetSlider');
    const budgetValue = document.getElementById('budgetValue');
    const reportContent = document.getElementById('reportContent');
    const protocolBox = document.getElementById('protocolBox');
    const amRoutineList = document.getElementById('amRoutineList');
    const pmRoutineList = document.getElementById('pmRoutineList');
    const profileSyncBadge = document.getElementById('profileSyncBadge');

    const selectors = ['chk-moisturizer', 'chk-cleanser', 'chk-sunscreen', 'chk-toner', 'chk-niacinamide', 'chk-actives', 'chk-lemon', 'chk-scrubs'];
    let dermaChart = null;

    function calculateSkinTrajectory() {
        if (!budgetSlider) return;
        const budget = parseInt(budgetSlider.value);
        if (budgetValue) budgetValue.textContent = `Rp ${budget.toLocaleString('id-ID')}`;

        if (profileSyncBadge) {
            if (userSkinProfile.isCalculated) {
                profileSyncBadge.textContent = `Synced: ${userSkinProfile.baseType.toUpperCase()}`;
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
        updateHonestLocalMetrics(state, currentEvaluatedScore);
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

    // --- QUICK-ADD STARTER PACK PRESET ENGINE ---
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
                budgetSlider.value = 150000; 
                budgetSlider.dispatchEvent(new Event('input')); 
            }
            
            calculateSkinTrajectory();
            
            this.innerText = "✅ Starter Pack Applied!";
            setTimeout(() => {
                this.innerText = "✨ Apply 3-Step Instant Starter Pack";
            }, 2000);
        });
    }

    // --- 9-STEP SKIN TYPE QUIZ SYSTEM ---
    const quizData = [
        { q: "1. Surface Oil: How does your skin surface feel about an hour after washing with plain water?", a: [ { text: "Tight, flaky, or visibly matte all over", type: "base:Dry" }, { text: "Slick, shiny, or greasy completely", type: "base:Oily" }, { text: "Oily on forehead/nose but tight on outer cheeks", type: "base:Combination" }, { text: "Comfortable, smooth, and well balanced", type: "base:Normal" } ] },
        { q: "2. Comfort Sensitivity: How often do you feel stinging, burning, or redness from basic skin essentials?", a: [ { text: "Frequently, especially when trying simple products or weather shifts", type: "react:Sensitive" }, { text: "Rarely or never, skin easily handles adjustments", type: "react:Resilient" } ] },
        { q: "3. Breakout Tendencies: Do you experience frequent breakouts, bumps, or blackheads in high-oil zones?", a: [ { text: "Yes, standard clogged cycles occur regularly", type: "acne:true" }, { text: "No, blemishes are quite rare or heal rapidly", type: "acne:false" } ] },
        { q: "4. Surface Tightness: Does your skin feel tight underneath, even if there is visible grease or oil on top?", a: [ { text: "Yes, it feels pulled or crinkled but stays slick on top", type: "dehyd:true" }, { text: "No, skin comfort matches the surface oil level", type: "dehyd:false" } ] },
        { q: "5. Temporary Marks: When you get a minor skin blemish, how long do dark marks or red spots remain?", a: [ { text: "Weeks or months, marking takes a while to disappear", type: "none" }, { text: "Just a few days, marks clear away efficiently", type: "none" } ] },
        { q: "6. Dry Environments: How does your skin layer behave when staying inside air-conditioned rooms or dry climates?", a: [ { text: "Dries out quickly, develops rough localized tight spots", type: "dehyd:true" }, { text: "Maintains its current texture comfortably", type: "none" } ] },
        { q: "7. Mechanical Friction: Rubbing your face with a standard towel or rough washcloth causes what immediate symptom?", a: [ { text: "Flashing redness, irritation, or clear stinging", type: "react:Sensitive" }, { text: "No significant color change or irritation", type: "react:Resilient" } ] },
        { q: "8. Visible Pores: When examining your skin path in the mirror, how visible are your pore layouts?", a: [ { text: "Highly visible, wider across cheeks and center regions", type: "base:Oily" }, { text: "Virtually invisible, smooth uniform layout", type: "base:Dry" } ] },
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

        quizAnswers.forEach(ans => {
            if (ans.startsWith("base:")) baseTypes[ans.split(":")[1]]++;
            if (ans.startsWith("react:")) reactTypes[ans.split(":")[1]]++;
            if (ans === "acne:true") acneCount++;
            if (ans === "dehyd:true") dehydCount++;
        });

        let determinedBase = Object.keys(baseTypes).reduce((a, b) => baseTypes[a] > baseTypes[b] ? a : b);
        let determinedReact = reactTypes.Sensitive >= reactTypes.Resilient ? "Sensitive" : "Resilient";

        userSkinProfile.baseType = determinedBase;
        userSkinProfile.reactivity = determinedReact;
        userSkinProfile.acneProne = acneCount > 0;
        userSkinProfile.dehydrated = dehydCount > 0;
        userSkinProfile.isCalculated = true;

        let typeStr = `${determinedBase} Skin Type`; let descStr = "";

        if (determinedReact === "Sensitive") {
            typeStr = `Sensitive & ${determinedBase} Skin`;
            descStr = "Your quiz choices point to a highly reactive skin surface. Avoid complicated multi-step layering patterns, physical abrasives, and strong unbuffered acids. Focus entirely on low-pH gentle cleansing and simple hydration options.";
        } else {
            if (determinedBase === "Oily") descStr = "Your choices show active surface oil production. Prioritize water-based lightweight hydration elements (like simple humectants or gel lotions) and avoid heavy, thick wax-based formulations.";
            else if (determinedBase === "Dry") descStr = "Your choices track limited natural surface oil production. Focus on rich moisturizers applied directly to damp skin to prevent environmental moisture loss.";
            else descStr = "Your skin type is historically well-balanced across oil and moisture levels. Maintain this balance by skipping heavy trend items and shielding daily with basic sunscreen.";
        }

        if (userSkinProfile.dehydrated) descStr += " Note: Your quiz answers also suggest surface dehydration (a lack of bound water in the outer cell layers).";
        
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

    // --- ACADEMY SCIENCE HUB REPOSITORY ---
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

    // --- PRODUCT RECOMMENDATIONS LOG DIRECTORY ---
    const peerRegistryDatabase = [
        { id: 1, skinType: "Oily", product: "Garnier Micellar Water Blue", cost: "Rp 35.000", ingredients: "Water, Hexylene Glycol, Glycerin, Disodium Cocoamphodiacetate, Poloxamer 184", usage: "Pour onto a cotton pad, wipe gently across dry face field until sunscreen layer clears.", definition: "An oil-free, water-based micellar solution structured specifically to clean away surface skin oils and daily grit cleanly." },
        { id: 2, skinType: "Dry", product: "The Ordinary Moisturizing Factors + HA", cost: "Rp 120.000", ingredients: "Caprylic Triglyceride, Cetyl Alcohol, Sodium PCA, Hyaluronic Acid, Ceramides", usage: "Apply a pea-sized dot over damp skin right after your rinsing block.", definition: "A light cream setup built to match skin's natural moisturizing factors, protecting dry cell structures from daily moisture loss." },
        { id: 3, skinType: "Sensitive", product: "Cetaphil Gentle Skin Cleanser", cost: "Rp 65.000", ingredients: "Water, Cetyl Alcohol, Propylene Glycol, Sodium Lauryl Sulfate, Stearyl Alcohol", usage: "Massage lightly over face, then wash away with tepid water or wipe off with a soft cloth.", definition: "A soap-free, non-foaming cleansing lotion designed to wipe away outer grime safely without breaking down sensitive skin boundaries." },
        { id: 4, skinType: "Normal", product: "Azarine Hydrasoothe Sunscreen Gel SPF 45", cost: "Rp 65.000", ingredients: "Water, Aloe Barbadensis Leaf Juice, Green Tea Extract, Propolis, Niacinamide", usage: "Smooth two finger lengths across entire face area 15 minutes before stepping outside.", definition: "An organic, gel-based UV filter layer that sinks in rapidly without leaving chalky lines or heavy grease layers on normal skin profiles." }
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

    // --- RECOMMENDATIONS FORM SUBMISSION ROUTED TO FORMSPREE ---
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

    // --- SKINCARE DICTIONARY SYSTEM ---
    const skinDictionaryDatabase = [
        { term: "Moisturizer", details: "A general product category designed to lock water inside the stratum corneum, smooth surface texture, and support the skin's surface layers.", category: "Product Type", proTip: "Apply to damp skin within minutes of washing to capture maximum hydration." },
        { term: "Lotion", details: "A thin, fluid emulsion that contains more water than heavy creams, absorbing quickly into the skin surface without leaving a thick oily layer.", category: "Product Type", proTip: "Ideal for combination or oily skin profiles who want lightweight skin hydration." },
        { term: "Ceramides", details: "Natural waxy components that make up a large portion of your outer skin structure. They help hold skin cells together to prevent surface evaporation.", category: "Active Component", proTip: "An excellent foundational ingredient to look out for if your face feels easily irritated." },
        { term: "Sebaceous Glands", details: "Microscopic glands inside hair follicles that produce sebum, the natural oil structure that helps lubricate your skin surface.", category: "Anatomy", proTip: "Over-washing can cause these glands to produce extra oil to compensate." },
        { term: "Humectant", details: "Water-binding elements (like Glycerin or Hyaluronic Acid) that draw moisture into your upper skin cells from deeper layers or surrounding air humidity.", category: "Functional Style", proTip: "Always lock them in with an emollient layer, or dry air can easily evaporate the moisture back out." },
        { term: "Occlusive", details: "Moisture-sealing oils or protectants (such as Petrolatum) that create a simple physical layer on top of the skin to keep water from escaping.", category: "Functional Style", proTip: "Best applied sparingly at night over dry or peeling spots to lower overnight moisture evaporation." },
        { term: "Emollient", details: "Conditioning agents that fill in tiny gaps between flaking skin cells, softening dry spots to create a smoother, more uniform texture layer.", category: "Functional Style", proTip: "Acts like a cosmetic smoothing agent between surface cells." },
        { term: "Stratum Corneum", details: "The outermost layer of the skin surface, acting as your primary protective shield against external elements and daily moisture loss.", category: "Anatomy", proTip: "This is your actual skin barrier layout; protecting it is this app's main goal." },
        { term: "Transepidermal Water Loss (TEWL)", details: "The measurable rate at which water evaporates out through the outer layers of skin when the surface path is dry or irritated.", category: "Metric Check", proTip: "High evaporation rates lead directly to fine dehydration lines and dry skin stress." },
        { term: "Surfactant", details: "Cleansing agents found in face washes that break down grease, dirt, and oils so they can be easily rinsed away with clean water.", category: "Active Component", proTip: "Look for low-pH, non-foaming versions to protect delicate skin cells from over-cleansing." },
        { term: "Hyaluronic Acid", details: "A popular humectant element naturally present in skin tissue that is capable of binding significant water molecules to surface cells.", category: "Active Component", proTip: "Pairs wonderfully underneath standard budget moisturizers for immediate superficial hydration." },
        { term: "Salicylic Acid (BHA)", details: "An oil-soluble chemical exfoliant that can travel down into pore pathways to clear away oil buildup and trapped dead skin cell plugs.", category: "Active Component", proTip: "Because it mixes easily with oils, it handles clogged pore channels much better than water-soluble AHAs." }
    ];

    const dictionaryListContainer = document.getElementById('dictionaryListContainer');
    const dictionarySearchInput = document.getElementById('dictionarySearchInput');

    function renderDictionaryList(searchTerm = "") {
        if (!dictionaryListContainer) return;
        const cleanSearch = searchTerm.toLowerCase().trim();
        
        const filteredDict = skinDictionaryDatabase.filter(item => 
            item.term.toLowerCase().includes(cleanSearch) || 
            item.details.toLowerCase().includes(cleanSearch) ||
            item.category.toLowerCase().includes(cleanSearch)
        );

        if (filteredDict.length === 0) {
            dictionaryListContainer.innerHTML = `<p class="text-muted" style="grid-column: 1/-1; text-align: center; padding: 2rem 0;">No vocabulary terms match your search query.</p>`;
            return;
        }

        dictionaryListContainer.innerHTML = filteredDict.map(item => `
            <div class="dict-card tab-fade-animation">
                <div class="dict-header">
                    <h3>${item.term}</h3>
                    <span class="dict-tag">${item.category}</span>
                </div>
                <p class="dict-def">${item.details}</p>
                <div class="dict-protip"><strong>🧠 Pro Insight:</strong> ${item.proTip}</div>
            </div>
        `).join('');
    }

    if (dictionarySearchInput) {
        dictionarySearchInput.addEventListener('input', (e) => {
            renderDictionaryList(e.target.value);
        });
    }

    // --- DARK MODE TOGGLE ENGINE ---
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

    // --- BATHROOM MIRROR PRINT ENGINE ---
    const printRoutineBtn = document.getElementById('printRoutineBtn');
    if (printRoutineBtn) {
        printRoutineBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // --- INITIALIZATION RUNTIME ---
    calculateSkinTrajectory();
    renderCards("all");
    renderDictionaryList("");
});
