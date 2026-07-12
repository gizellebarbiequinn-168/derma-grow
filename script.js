document.addEventListener("DOMContentLoaded", () => {
    // --- GLOBAL SYNCHRONIZED STATE ENGINE ---
    let userSkinProfile = {
        baseType: "Normal",     
        reactivity: "Resilient", 
        acneProne: false,
        dehydrated: false,
        isCalculated: false
    };

    // --- APPLICATION NAVIGATION ROUTING ---
    const navDashboard = document.getElementById('navDashboard');
    const navQuiz = document.getElementById('navQuiz');
    const navLearn = document.getElementById('navLearn');
    const navPeer = document.getElementById('navPeer');

    const trackerCard = document.getElementById('trackerCard');
    const quizSection = document.getElementById('quizSection');
    const learnSection = document.getElementById('learnSection');
    const peerSection = document.getElementById('peerSection');

    function clearActiveTabs() {
        [navDashboard, navQuiz, navLearn, navPeer].forEach(el => { if(el) el.classList.remove('active'); });
        [trackerCard, quizSection, learnSection, peerSection].forEach(el => { if(el) el.classList.add('hidden'); });
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
    if (navPeer) {
        navPeer.addEventListener('click', (e) => {
            e.preventDefault(); clearActiveTabs();
            navPeer.classList.add('active');
            if (peerSection) peerSection.classList.remove('hidden');
            renderPeerRegistry("all");
        });
    }

    // --- METRIC UPDATERS ---
    function updateHonestLocalMetrics(state, finalScore) {
        const itemsSavedCount = document.getElementById('itemsSavedCount');
        const optimizationDelta = document.getElementById('optimizationDelta');
        const summaryLabel = document.getElementById('impactSummaryText');

        let unsafeHaltedCount = 0;
        if (state.prodLemonTrend) unsafeHaltedCount++;
        if (state.prodScrubs) unsafeHaltedCount++;
        if (state.prodHandmeDown && !state.prodLotion) unsafeHaltedCount++;
        
        if (itemsSavedCount) itemsSavedCount.textContent = unsafeHaltedCount;

        const baselineDefaultScore = 50;
        let delta = finalScore - baselineDefaultScore;
        if (optimizationDelta) optimizationDelta.textContent = delta >= 0 ? `+${delta}%` : `${delta}%`;

        if (summaryLabel) {
            if (unsafeHaltedCount > 0) {
                summaryLabel.textContent = `🎉 Trend Avoided: Dropping ${unsafeHaltedCount} aggressive trends protects your skin barrier. You also saved roughly Rp ${(unsafeHaltedCount * 60000).toLocaleString('id-ID')} in unnecessary product costs!`;
            } else if (finalScore >= 85) {
                summaryLabel.textContent = `🎯 Core Routine Built: Your minimalist routine is complete. Your estimated skin-barrier protection baseline is at its highest rating.`;
            } else {
                summaryLabel.textContent = `💡 Routine Builder Active. Interact with the checkboxes above to see how skipping trends or adding affordable essentials impacts your score.`;
            }
        }
    }

    // --- STANDARD APP TEXT FEEDBACK SUBMISSION ---
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
                } else { alert("Oops! There was a problem submitting your feedback."); }
            }).catch(() => { alert("Oops! There was a network problem."); });
        });
    }

    // --- HEURISTIC BARRIER PROJECTION LOGIC ENGINE ---
    const budgetSlider = document.getElementById('budgetSlider');
    const budgetValue = document.getElementById('budgetValue');
    const reportContent = document.getElementById('reportContent');
    const protocolBox = document.getElementById('protocolBox');
    const amRoutineList = document.getElementById('amRoutineList');
    const pmRoutineList = document.getElementById('pmRoutineList');
    const profileSyncBadge = document.getElementById('profileSyncBadge');

    const selectors = ['prodLotion', 'prodCleanser', 'prodSunscreen', 'prodToner', 'prodNiacinamide', 'prodHandmeDown', 'prodLemonTrend', 'prodScrubs'];
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
        let summaryText = "Awaiting selections: Add affordable core essentials (Cleanser/Lotion) to see estimated trendlines.";
        
        let amSteps = ["Rinse skin with clean, lukewarm water."];
        let pmSteps = ["Rinse away daily environmental sweat or dust."];

        if (state.prodLemonTrend || state.prodScrubs) {
            metrics = [50, 35, 22, 12, 6, 4, 3]; currentEvaluatedScore = 3;
            summaryText = "BARRIER DAMAGE ALERT: High acidity or harsh friction from physical trends strips away moisture layers. Stop using these items immediately to let your skin rest.";
            if (userSkinProfile.reactivity === "Sensitive") {
                metrics = [50, 25, 12, 5, 2, 1, 1]; currentEvaluatedScore = 1;
                summaryText += " Because your assessment showed SENSITIVE traits, recovery values are heavily degraded.";
            }
            amSteps = ["SKIP UNNECESSARY REMEDIES AND SCRUBS.", "Wash gently with cool plain water only to minimize further irritation."];
            pmSteps = ["Stop using harsh physical brushes or kitchen ingredients.", "Apply basic moisturizer or glycerin if available; otherwise leave bare."];
        } 
        else if (state.prodHandmeDown && !state.prodLotion) {
            metrics = [50, 44, 36, 30, 25, 20, 15]; currentEvaluatedScore = 15;
            summaryText = "UNBUFFERED ACTIVE IRRITATION: Using high-strength active ingredients without a basic moisturizer can cause dryness and flaking. Pause the active ingredient until a baseline routine is built.";
            if (userSkinProfile.baseType === "Dry") {
                metrics = [50, 38, 28, 20, 15, 10, 8]; currentEvaluatedScore = 8;
                summaryText += " Your dry baseline skin profile accelerates active irritation and cracking.";
            }
            amSteps = ["Temporarily stop using high-potency active serums.", "Splash face with cool water to avoid stripping native moisture."];
            pmSteps = ["Skip the high-strength active product tonight.", "Focus on finding a simple, low-cost hydrating lotion when your budget allows."];
        }
        else if (state.prodLotion && state.prodCleanser && state.prodSunscreen) {
            let score = 85;
            summaryText = "COMPLETE PROTECTIVE ROUTINE: Your foundational loop is complete. Gentle cleansing, barrier hydration, and broad-spectrum UV protection work together for maximum safety.";
            
            amSteps = ["Rinse with water or an ultra-mild splash.", "Apply your basic moisturizer/lotion.", "Apply Broad-Spectrum Sunscreen (Crucial daily protection)."];
            pmSteps = ["Use your Gentle Low-pH Cleanser to break down sunscreen and buildup.", "Apply basic moisturizer to damp skin within 600 seconds of drying."];
            
            if (userSkinProfile.baseType === "Oily" && state.prodLotion) {
                summaryText += " Hint: Since your profile flags Oily, check that your lotion is a lightweight non-comedogenic fluid rather than a heavy wax balm.";
            }
            if (userSkinProfile.dehydrated && state.prodToner) {
                score += 3;
                summaryText += " Your custom profile hydration metric boosted due to Toner usage on dehydrated cells.";
            }
            if (state.prodNiacinamide) { 
                score += 11; 
                summaryText += " Niacinamide supports natural lipid production."; 
                pmSteps.push("Optional: Apply Niacinamide serum before moisturizer."); 
            }
            if (state.prodToner) { 
                score += 4; 
                amSteps.splice(1, 0, "Optional: Pat gentle hydrating toner over damp skin."); 
            }
            currentEvaluatedScore = Math.min(score, 100);
            metrics = [50, 62, 72, 80, 86, 90, currentEvaluatedScore];
        }
        else if (state.prodLotion && state.prodCleanser) {
            currentEvaluatedScore = 75; metrics = [50, 55, 62, 68, 72, 74, 75];
            summaryText = "ESSENTIAL MINIMALIST HYDRATION: Excellent low-cost baseline. Your barrier health is projected to steadily improve. Adding an affordable sunscreen will complete the loop.";
            amSteps = ["Rinse face thoroughly with clean, lukewarm water.", "Apply a thin layer of basic moisturizer / glycerin."];
            pmSteps = ["Cleanse face using your Gentle Low-pH Cleanser.", "Apply basic moisturizer over damp skin to minimize transepidermal water loss."];
        }

        if (reportContent) reportContent.textContent = summaryText;
        if (protocolBox) protocolBox.classList.remove('hidden');
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
                datasets: [{ label: 'Heuristic Barrier Projection (%)', data: metrics, borderColor: '#4A5548', borderWidth: 2.5, pointBackgroundColor: '#D4AF37', tension: 0.1, fill: false }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } } }
        });
    }

    if (budgetSlider) budgetSlider.addEventListener('input', calculateSkinTrajectory);
    selectors.forEach(id => { const el = document.getElementById(id); if (el) el.addEventListener('change', calculateSkinTrajectory); });

    // --- COMPREHENSIVE 9-SET SYSTEM SKIN ASSESSMENT MATRIX ---
    const quizData = [
        { q: "1. Sebum Production: How does your skin surface feel about an hour after washing with plain water?", a: [ { text: "Tight, flaky, or visibly matte all over", type: "base:Dry" }, { text: "Slick, shiny, or greasy completely", type: "base:Oily" }, { text: "Oily on forehead/nose but tight on outer cheeks", type: "base:Combination" }, { text: "Comfortable, smooth, and well balanced", type: "base:Normal" } ] },
        { q: "2. Barrier Reactivity: How often do you feel stinging, burning, or redness from basic skin essentials?", a: [ { text: "Frequently, especially when trying simple updates or weather shifts", type: "react:Sensitive" }, { text: "Rarely or never, skin easily tolerates active changes", type: "react:Resilient" } ] },
        { q: "3. Acne & Congestion: Do you experience frequent breakouts, bumps, or blackheads in high-oil zones?", a: [ { text: "Yes, standard congestion pattern cycles continuously", type: "acne:true" }, { text: "No, blemishes are quite rare or heal rapidly", type: "acne:false" } ] },
        { q: "4. Dehydration Check: Does your skin feel tight underneath, even if there is visible grease or oil on top?", a: [ { text: "Yes, it feels pulled or crinkled but stays slick on top", type: "dehyd:true" }, { text: "No, hydration matches the surface oil signature", type: "dehyd:false" } ] },
        { q: "5. Healing Response: When you get a minor surface blemish, how long do dark marks or red spots remain?", a: [ { text: "Weeks or months, slow vascular and cell clearing time", type: "none" }, { text: "Just a few days, surface cell renewal cycle is efficient", type: "none" } ] },
        { q: "6. Weather Shifts: How does your skin layer behave when staying inside air-conditioned rooms or dry climates?", a: [ { text: "Dries out instantly, develops rough localized flakes", type: "dehyd:true" }, { text: "Maintains its current texture layer comfortably", type: "none" } ] },
        { q: "7. Mechanical Friction: Rubbing your face with a standard towel or rough washcloth causes what immediate symptom?", a: [ { text: "Flashing redness, irritation, or clear stinging", type: "react:Sensitive" }, { text: "No significant transformation or irritation", type: "react:Resilient" } ] },
        { q: "8. Pore Architecture: When examining your skin path in the mirror, how visible are your pore layouts?", a: [ { text: "Highly visible, enlarged across cheeks and center regions", type: "base:Oily" }, { text: "Virtually invisible, smooth uniform texture profile", type: "base:Dry" } ] },
        { q: "9. Active Acid Tolerances: What occurs if you use a high-strength over-the-counter retinol or peeling acid product?", a: [ { text: "Immediate burning, extreme peeling, or compromised raw skin", type: "react:Sensitive" }, { text: "Slight dry adaptation period, but skin handles it fine", type: "react:Resilient" } ] }
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

        let typeStr = `${determinedBase} Profile`; let descStr = "";

        if (determinedReact === "Sensitive") {
            typeStr = `Sensitive & ${determinedBase} Profile`;
            descStr = "Your holistic diagnostic matrix flags a highly reactive cellular skin barrier. Avoid complicated multi-step layering patterns, physical abrasives, and high-percentage unbuffered acids. Focus entirely on low-pH gentle cleansing and standard emollient lipids.";
        } else {
            if (determinedBase === "Oily") descStr = "Your profile shows active sebum synthesis. Prioritize water-based non-comedogenic hydration elements (like simple humectants or gel lotions) and avoid rich heavy wax structures.";
            else if (determinedBase === "Dry") descStr = "Your matrix tracks limited lipid matrix production. Focus heavily on dense emollients or rich moisturizers applied to damp skin to prevent environmental transepidermal moisture loss.";
            else descStr = "Your skin profile is historically well-balanced across oil and moisture channels. Maintain and preserve this pristine health by skipping trends and shielding daily with basic sunscreen.";
        }

        if (userSkinProfile.dehydrated) {
            descStr += " Note: Your profile also indicates surface dehydration (lack of bound water inside cells). Adding an affordable gentle toner or applying moisturizer over damp skin will benefit your trajectory.";
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
                clearActiveTabs();
                navDashboard.classList.add('active');
                trackerCard.classList.remove('hidden');
                calculateSkinTrajectory();
                window.scrollTo({ top: document.getElementById('impactMatrix').offsetTop - 20, behavior: 'smooth' });
            }
        });
    }
    const resetQuizBtn = document.getElementById('resetQuizBtn');
    if (resetQuizBtn) resetQuizBtn.addEventListener('click', initializeQuizEngine);

    // --- SCIENCE DATABASE WITH DIRECT SPECIFIC RESEARCH DEEP-LINKS ---
    const scienceDatabase = [
        { id: 1, category: "myths", badge: "Trend Debunker", badgeClass: "badge-myth", title: "The DIY Lemon Juice Trend", description: "Applying raw lemon juice strips your natural acid mantle (~4.5 pH) due to its extreme acidity (~2.0 pH), inducing chemical contact dermatitis and hyperpigmentation.", actionText: "View PubChem pH & Irritation Profile Data →", link: "https://pubchem.ncbi.nlm.nih.gov/compound/Citric-acid#section=Safety-and-Hazards" },
        { id: 2, category: "myths", badge: "Trend Debunker", badgeClass: "badge-myth", title: "Physical Scrubs vs. Friction", description: "Abrasives like crushed seed shells cause mechanical micro-tears in vulnerable corneal layers, disrupting crucial lipid pathways and inducing water loss.", actionText: "Read NCBI Skin Barrier Friction Study →", link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5608132/" },
        { id: 3, category: "classification", badge: "Product Category", badgeClass: "badge-class", title: "Cleansers: Low-pH Surfactants", description: "Traditional soaps feature alkaline pH profiles (>9.0) that denature structural keratin proteins. Low-pH alternatives clean effectively without depleting native intercellular lipids.", actionText: "Read PMC Surfactant Formulation Science →", link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3088928/" },
        { id: 4, category: "classification", badge: "Product Category", badgeClass: "badge-class", title: "Moisturizers: Essential Types", description: "Humectants bind moisture inside epidermal layers, while occlusives form a physical surface layout that lowers Transepidermal Water Loss (TEWL).", actionText: "Read Harvard Health Dermatological Guide →", link: "https://www.health.harvard.edu/staying-healthy/the-hype-over-skin-care-ingredients" },
        { id: 5, category: "actives", badge: "Skincare Ingredient", badgeClass: "badge-science", title: "L-Ascorbic Acid (Vitamin C)", description: "A well-studied antioxidant that neutralizes environmental free radicals caused by daily UV exposure while supporting structural matrix preservation.", actionText: "Read Cochrane Antioxidant Efficacy Review →", link: "https://www.cochrane.org/CD004135/SKIN_antioxidants-for-preventing-skin-ageing-caused-by-the-sun" },
        { id: 6, category: "actives", badge: "Skincare Ingredient", badgeClass: "badge-science", title: "Niacinamide (Vitamin B3)", description: "Extensively researched molecule shown to boost ceramide synthesis, lower baseline TEWL values, and regulate underlying sebum metrics.", actionText: "View PubMed Niacinamide Trial Data →", link: "https://pubmed.ncbi.nlm.nih.gov/12100180/" },
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

    // --- PEER-TO-PEER KNOWLEDGE REGISTRY DATABASE ---
    const peerRegistryDatabase = [
        { id: 1, skinType: "Oily", product: "Garnier Micellar Water Blue (For Oily Skin)", price: "Rp 35.000", notes: "Completely oil-free formulation. Cleanses sweat and sunscreen effectively without leaving a heavy film layer that blocks overactive sebum glands." },
        { id: 2, skinType: "Dry", product: "The Ordinary Natural Moisturizing Factors + HA", price: "Rp 120.000", notes: "Contains structural amino acids and ceramides. Implements the 'mortar' concept to lock water into flaky skin areas instantly." },
        { id: 3, skinType: "Sensitive", product: "Cetaphil Gentle Skin Cleanser", price: "Rp 65.000", notes: "Soap-free, fragrance-free formula with a perfect non-alkaline pH. Does not cause stinging or physical flashing even on a broken skin barrier." },
        { id: 4, skinType: "Normal", product: "Azarine Hydrasoothe Sunscreen Gel SPF 45", price: "Rp 65.000", notes: "Incredibly lightweight gel-like texture. Absorbs cleanly on balanced profiles without adding unnecessary greasy shine or leaving a chalky white cast." },
        { id: 5, skinType: "Oily", product: "Hada Labo Shirojyun Ultimate Whitening Lotion", price: "Rp 45.000", notes: "Watery consistency. Provides deep cellular hydration using low-weight hyaluronic acid without using occlusive oils or heavy fatty alcohols." },
        { id: 6, skinType: "Dry", product: "Viva Liquid Milk Cleanser & Face Tonic (Green Tea)", price: "Rp 12.000", notes: "An ultra-budget Indonesian holy grail. Emollient-rich milk emulsion lets dry profiles cleanse face fields gently without losing structural moisture surface levels." }
    ];

    const peerRegistryGrid = document.getElementById('peerRegistryGrid');
    const peerFilterBtns = document.querySelectorAll('.peer-filter-btn');

    function renderPeerRegistry(skinFilter) {
        if (!peerRegistryGrid) return;
        const filteredData = peerRegistryDatabase.filter(item => skinFilter === "all" || item.skinType === skinFilter);
        
        if (filteredData.length === 0) {
            peerRegistryGrid.innerHTML = `<div class="content-card"><p class="text-muted">No peer recommendations logged yet for this category.</p></div>`;
            return;
        }

        peerRegistryGrid.innerHTML = filteredData.map(item => `
            <div class="content-card tab-fade-animation" style="border-top: 3px solid var(--brand-accent);">
                <span class="badge ${item.skinType === 'Oily' ? 'badge-science' : item.skinType === 'Dry' ? 'badge-myth' : 'badge-class'}">${item.skinType} Profile Favorite</span>
                <h3 style="margin-top: 0.25rem; font-size: 1.1rem;">${item.product}</h3>
                <p style="font-size: 0.85rem; font-weight: 700; color: var(--brand-primary); margin-bottom: 0.5rem;">Est. Price: ${item.price}</p>
                <p style="font-size: 0.85rem; color: var(--color-text-main); line-height: 1.5;">"${item.notes}"</p>
            </div>
        `).join('');
    }

    peerFilterBtns.forEach(btn => btn.addEventListener('click', () => {
        peerFilterBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
        renderPeerRegistry(btn.getAttribute('data-skin'));
    }));

    // --- FORM INTERCEPTOR FOR COMMUNITY CONTRIBUTIONS ---
    const peerContributionForm = document.getElementById('peerContributionForm');
    if (peerContributionForm) {
        peerContributionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const data = new FormData(e.target);
            const responseAlert = document.getElementById('peerSuccessMessage');
            
            const selectedSkin = document.getElementById('peerSkinType').value;
            const enteredProd = document.getElementById('peerProdName').value;
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
                        price: "Verified Community Share",
                        notes: enteredNotes
                    });
                    renderPeerRegistry("all");
                    peerFilterBtns.forEach(b => b.classList.remove('active'));
                    if (peerFilterBtns[0]) peerFilterBtns[0].classList.add('active');
                    peerContributionForm.reset();
                    if (responseAlert) {
                        responseAlert.classList.remove('hidden');
                        setTimeout(() => responseAlert.classList.add('hidden'), 5000);
                    }
                } else { alert("Submission error. Please try again."); }
            }).catch(() => { alert("Network error. Please try again."); });
        });
    }

    // --- INTIALIZATION RUNTIME ---
    calculateSkinTrajectory();
    renderCards("all");
    renderPeerRegistry("all");
});
