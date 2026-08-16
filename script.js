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
            
            // Force redraw chart when tab becomes visible
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

    const budgetSlider = document.getElementById('budgetSlider');
    const budgetValue = document.getElementById('budgetValue');
    const reportContent = document.getElementById('reportContent');
    const protocolBox = document.getElementById('protocolBox');
    const amRoutineList = document.getElementById('amRoutineList');
    const pmRoutineList = document.getElementById('pmRoutineList');
    const profileSyncBadge = document.getElementById('profileSyncBadge');

    // Added selectors for toxic hazard checkboxes if present in HTML
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

        // Ensure canvas parent container is visible before initializing Chart.js
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
                updateTrendsAvoided();
            });
        }
    });

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

    const scienceDatabase = [
        { id: 1, category: "myths", badge: "Trend Debunker", badgeClass: "badge-myth", title: "The DIY Lemon Juice Trend", description: "Applying raw lemon juice strips your natural acid mantle (~4.5 pH) due to its extreme acidity (~2.0 pH), inducing chemical irritation and hyperpigmentation.", actionText: "View PubChem Reference Data →", link: "https://pubchem.ncbi.nlm.nih.gov/compound/Citric-acid#section=Safety-and-Hazards" },
        { id: 2, category: "myths", badge: "Trend Debunker", badgeClass: "badge-myth", title: "Physical Scrubs vs. Friction", description: "Abrasives like crushed seed shells cause micro-scratches in vulnerable surface cells, disrupting moisture protection and causing water loss.", actionText: "Read NCBI Skin Friction Studies →", link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5608132/" },
        { id: 3, category: "classification", badge: "Product Category", badgeClass: "badge-class", title: "Cleansers: Low-pH Surfactants", description: "Traditional soaps feature alkaline pH profiles (>9.0) that strip structural skin components. Low-pH alternatives clean effectively without depleting native lipids.", actionText: "Read PMC Surfactant Formulation Science →", link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3088928/" },
        { id: 4, category: "classification", badge: "Product Category", badgeClass: "badge-class", title: "Moisturizers: Essential Types", description: "Humectants bind moisture inside epidermal layers, while occlusives form a physical surface layout that lowers Transepidermal Water Loss (TEWL).", actionText: "Read Harvard Health Dermatological Guide →", link: "https://www.health.harvard.edu/staying-healthy/the-hype-over-skin-care-ingredients" },
        { id: 5, category: "actives", badge: "Skincare Ingredient", badgeClass: "badge-science", title: "L-Ascorbic Acid (Vitamin C)", description: "A well-studied antioxidant that neutralizes environmental free radicals caused by daily UV exposure while supporting structural cell preservation.", actionText: "Read Cochrane Antioxidant Efficacy Review →", link: "https://www.cochrane.org/CD004135/SKIN_antioxidants-for-preventing-skin-ageing-caused-by-the-sun" },
        { id: 6, category: "actives", badge: "Skincare Ingredient", badgeClass: "badge-science", title: "Niacinamide (Vitamin B3)", description: "Extensively researched molecule shown to boost ceramide production, lower baseline TEWL values, and balance surface sebum metrics.", actionText: "View PubMed Niacinamide Trial Data →", link: "https://pubmed.ncbi.nlm.nih.gov/12100180/" },
        { id: 7, category: "anatomy", badge: "Skin Biology", badgeClass: "badge-science", title: "The Skin Barrier Frame", description: "An architectural overview of the stratum corneum's 'brick and mortar' layout: corneocytes act as protective bricks, and specialized lipids act as mortar.", actionText: "Read JID Barrier Function Literature →", link: "https://www.jidonline.org/article/S0022-202X(15)34551-7/fulltext" },
        { id: 8, category: "anatomy", badge: "Skin Biology", badgeClass: "badge-science", title: "The Protective Acid Mantle", description: "An interactive analysis of how native free fatty acids lower human surface pH to safeguard against environmental stressors and support optimal cell shedding.", actionText: "Read Wiley Hydrophilic Film Analysis →", link: "https://onlinelibrary.wiley.com/doi/10.1111/ics.12745" },
        { id: 9, category: "myths", badge: "Toxic Hazard", badgeClass: "badge-myth", title: "Mercury (Hg) in Lightening Creams", description: "A toxic heavy metal often found in illegal whitening creams that inflicts severe damage on kidneys, nerves, and causes permanent skin discoloration.", actionText: "View PubChem Mercury Safety Data →", link: "https://pubchem.ncbi.nlm.nih.gov/compound/Mercury" },
        { id: 10, category: "myths", badge: "Toxic Hazard", badgeClass: "badge-myth", title: "Potent Corticosteroids (Dexamethasone)", description: "Unregulated topical steroids lead to severe skin thinning, visible blood vessel damage (telangiectasia), topical steroid withdrawal, and systemic organ disruption.", actionText: "Read NCBI Topical Steroid Toxicity Studies →", link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4171912/" },
        { id: 11, category: "myths", badge: "Toxic Hazard", badgeClass: "badge-myth", title: "Industrial Dyes (Red K3 & Rhodamine B)", description: "Synthetic textile dyes (CI 15585 and Rhodamine B) banned in cosmetics due to carcinogenic properties and potential liver function impairment.", actionText: "View PubChem Rhodamine B Profile →", link: "https://pubchem.ncbi.nlm.nih.gov/compound/Rhodamine-B" },
        { id: 12, category: "myths", badge: "Toxic Hazard", badgeClass: "badge-myth", title: "Heavy Metal Toxicity (Lead / Pb)", description: "Heavy metal contaminant found in unverified cosmetic formulations that accumulates in the body, damaging the central nervous system and kidney function.", actionText: "Read CDC Cosmetic Lead Exposure Data →", link: "https://www.cdc.gov/niosh/topics/lead/" }
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

    const categories = ["Active Component", "Product Function", "Anatomy", "Biology", "Hazardous Substance"];
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
        ["Mercury", 4, "A toxic heavy metal illegally added to whitening creams. Causes kidney failure, nervous system toxicity, and blotchy hyperpigmentation.", "Never use unbranded or rapidly-whitening cosmetic creams without full ingredient testing."],
        ["Dexamethasone", 4, "A potent prescription corticosteroid drug that causes rapid skin thinning, persistent redness, and steroid withdrawal when misused.", "Must strictly be prescribed by a licensed physician for short-term medical indications."],
        ["Hydroquinone", 4, "A strong pigment-inhibiting agent that can cause irreversible exogenous ochronosis (bluish-black skin darkening) and severe eye irritation when mismanaged.", "Requires strict clinical monitoring; prohibited in standard cosmetic retail formats in many regions."],
        ["Retinoic Acid", 4, "Pure Tretinoin formulation that causes severe burning, scaling, and photosensitivity, as well as severe teratogenic risks (birth defects) during pregnancy.", "Strictly a prescription pharmaceutical; never use unmonitored or during pregnancy."],
        ["Red K3 (CI 15585)", 4, "A synthetic textile dye illegally used in color cosmetics that acts as a potent carcinogen and damages liver function.", "Avoid cosmetics lacking standard laboratory batch certification or legal regulatory registration tags."],
        ["Rhodamine B (Red K10)", 4, "A fluorescent industrial dye banned in cosmetic preparations due to strong carcinogenic links and systemic cellular toxicity.", "Commonly found in counterfeit or cheap color cosmetics lacking safety compliance certificates."],
        ["Lead (Pb)", 4, "A systemic heavy metal contaminant that damages neurological networks, organ function, and blood chemistry.", "Only purchase cosmetics that pass heavy metal safety standard testing."]
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

    // --- INITIALIZATION ---
    calculateSkinTrajectory();
    renderCards("all");
    renderDictionaryList("");
});
