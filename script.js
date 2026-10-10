document.addEventListener("DOMContentLoaded", () => {
    // --- GLOBAL STATE ---
    let userSkinProfile = {
        baseType: "Normal",     
        reactivity: "Resilient", 
        acneProne: false,
        dehydrated: false,
        isCalculated: false
    };

    // Multi-Currency Engine with proportional limits
    const currencyMap = {
        "IDR": { locale: "id-ID", symbol: "Rp ", maxBudget: 300000, step: 10000, defaultVal: 150000 },
        "USD": { locale: "en-US", symbol: "$", maxBudget: 30, step: 1, defaultVal: 15 },
        "EUR": { locale: "de-DE", symbol: "€", maxBudget: 30, step: 1, defaultVal: 15 },
        "GBP": { locale: "en-GB", symbol: "£", maxBudget: 25, step: 1, defaultVal: 12 },
        "MYR": { locale: "ms-MY", symbol: "RM ", maxBudget: 135, step: 5, defaultVal: 65 },
        "SGD": { locale: "en-SG", symbol: "S$", maxBudget: 40, step: 1, defaultVal: 20 }
    };
    let currentCurrency = "IDR";

    // --- NAVIGATION ROUTING ---
    const navDashboard = document.getElementById('navDashboard');
    const navQuiz = document.getElementById('navQuiz');
    const navAi = document.getElementById('navAi');
    const navLearn = document.getElementById('navLearn');
    const navRecommendations = document.getElementById('navRecommendations');
    const navDictionary = document.getElementById('navDictionary');

    const trackerCard = document.getElementById('trackerCard');
    const quizSection = document.getElementById('quizSection');
    const aiSection = document.getElementById('aiSection');
    const learnSection = document.getElementById('learnSection');
    const recommendationsSection = document.getElementById('recommendationsSection');
    const dictionarySection = document.getElementById('dictionarySection');

    function clearActiveTabs() {
        [navDashboard, navQuiz, navAi, navLearn, navRecommendations, navDictionary].forEach(el => { if(el) el.classList.remove('active'); });
        [trackerCard, quizSection, aiSection, learnSection, recommendationsSection, dictionarySection].forEach(el => { if(el) el.classList.add('hidden'); });
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
    if (navAi) {
        navAi.addEventListener('click', (e) => {
            e.preventDefault(); clearActiveTabs();
            navAi.classList.add('active');
            if (aiSection) aiSection.classList.remove('hidden');
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

    // --- DARK MODE TOGGLE (RESTORED) ---
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        const savedTheme = localStorage.getItem('dermaTheme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggleBtn.textContent = '☀️';
        }

        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('dermaTheme', 'light');
                themeToggleBtn.textContent = '🌙';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('dermaTheme', 'dark');
                themeToggleBtn.textContent = '☀️';
            }
        });
    }

    // --- TRACK MATRIX SUMMARY METRICS ---
    function updateHonestLocalMetrics(finalScore, trendsAvoidedCount, activeHarmfulTrends) {
        const itemsSavedCount = document.getElementById('itemsSavedCount');
        const optimizationDelta = document.getElementById('optimizationDelta');
        const summaryLabel = document.getElementById('impactSummaryText');
        const config = currencyMap[currentCurrency] || currencyMap["IDR"];

        if (itemsSavedCount) itemsSavedCount.textContent = trendsAvoidedCount;

        if (optimizationDelta) {
            optimizationDelta.textContent = `${finalScore}%`;
            optimizationDelta.style.color = finalScore < 50 ? "#d9534f" : "var(--brand-accent)";
        }

        if (summaryLabel) {
            if (activeHarmfulTrends > 0) {
                summaryLabel.textContent = `⚠️ Active Irritant Warning: You have checked ${activeHarmfulTrends} product(s) that can strip your skin barrier! Consider pausing them to allow recovery.`;
                summaryLabel.style.backgroundColor = "var(--status-alert-bg)";
                summaryLabel.style.color = "var(--status-alert-text)";
            } else if (trendsAvoidedCount > 0) {
                let estimatedSavings = trendsAvoidedCount * (config.maxBudget * 0.25);
                let savingsText = ` saving approximately ${formatGlobalCurrency(estimatedSavings, currentCurrency)}`;
                summaryLabel.textContent = `🎉 Barrier Protected: By leaving ${trendsAvoidedCount} harsh trend(s) unchecked, you protect your skin barrier${savingsText}!`;
                summaryLabel.style.backgroundColor = "rgba(89, 145, 47, 0.1)";
                summaryLabel.style.color = "var(--brand-primary)";
            } else {
                summaryLabel.textContent = `💡 Select the items you use daily above to view your barrier health trajectory.`;
                summaryLabel.style.backgroundColor = "var(--bg-main)";
                summaryLabel.style.color = "var(--color-text-main)";
            }
        }
    }

    // --- ROUTINE ENGINE LOGIC ---
    const budgetSlider = document.getElementById('budgetSlider');
    const budgetValue = document.getElementById('budgetValue');
    const reportContent = document.getElementById('reportContent');
    const protocolBox = document.getElementById('protocolBox');
    const amRoutineList = document.getElementById('amRoutineList');
    const pmRoutineList = document.getElementById('pmRoutineList');

    const selectors = ['chk-moisturizer', 'chk-cleanser', 'chk-sunscreen', 'chk-toner', 'chk-niacinamide', 'chk-actives', 'chk-lemon', 'chk-scrubs'];
    let dermaChart = null;

    function formatGlobalCurrency(amount, currencyCode) {
        if (!currencyCode || !currencyMap[currencyCode]) return `Rp ${amount}`;
        const config = currencyMap[currencyCode];
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

        const state = {};
        selectors.forEach(id => { 
            const el = document.getElementById(id); 
            state[id] = el ? el.checked : false; 
        });

        let activeHarmfulTrends = 0;
        let trendsAvoidedCount = 0;

        // Checked bad products = Active Irritants
        if (state['chk-lemon']) activeHarmfulTrends++;
        if (state['chk-scrubs']) activeHarmfulTrends++;

        // Unchecked bad products = Trends Avoided
        if (!state['chk-lemon']) trendsAvoidedCount++;
        if (!state['chk-scrubs']) trendsAvoidedCount++;

        const labels = ["Day 1", "Day 3", "Day 5", "Day 7", "Day 10", "Day 12", "Day 14"];
        let metrics = [50, 50, 50, 50, 50, 50, 50];
        let currentEvaluatedScore = 50;
        
        let amSteps = [];
        let pmSteps = [];
        let warningNote = "";

        // Build gentle baseline routine steps
        if (state['chk-cleanser']) {
            pmSteps.push("Wash gently using your Low-pH Cleanser.");
        } else {
            pmSteps.push("Rinse face thoroughly with lukewarm water.");
        }

        if (state['chk-moisturizer']) {
            amSteps.push("Apply a thin layer of basic moisturizer / glycerin.");
            pmSteps.push("Apply moisturizer to damp skin after washing.");
        }

        if (state['chk-sunscreen']) {
            amSteps.push("Apply Broad-Spectrum Sunscreen (essential daily UV shield).");
        }

        if (state['chk-toner']) {
            amSteps.unshift("Optional: Pat gentle hydrating toner onto damp skin.");
        }

        if (state['chk-niacinamide']) {
            pmSteps.splice(1, 0, "Optional: Apply Niacinamide serum before moisturizer.");
        }

        // Handle Irritant Warning without erasing baseline routine
        if (state['chk-lemon'] || state['chk-scrubs']) {
            currentEvaluatedScore = Math.max(15, 50 - (activeHarmfulTrends * 20));
            metrics = [50, 40, 30, 22, 18, 16, currentEvaluatedScore];
            warningNote = "⚠️ IRRITANT ALERT: Lemon juice or physical scrubs introduce extreme acid or friction that can tear delicate surface skin. Stop using these items to let your skin barrier heal.";
        } else if (state['chk-moisturizer'] && state['chk-cleanser'] && state['chk-sunscreen']) {
            currentEvaluatedScore = 92;
            metrics = [50, 62, 72, 82, 88, 90, 92];
            warningNote = "✅ COMPLETE BASELINE ROUTINE: Gentle cleansing, hydration, and sunscreen work together for optimal barrier protection.";
        } else if (state['chk-moisturizer'] && state['chk-cleanser']) {
            currentEvaluatedScore = 75;
            metrics = [50, 58, 64, 70, 72, 74, 75];
            warningNote = "👍 GOOD MINIMALIST BASELINE: Essential cleanser and moisturizer loop configured. Add an affordable sunscreen to complete protection.";
        } else {
            currentEvaluatedScore = 50;
            metrics = [50, 50, 50, 50, 50, 50, 50];
            warningNote = "Select the products you currently use daily to generate your AM/PM routine guide.";
        }

        if (amSteps.length === 0) amSteps.push("Rinse face with clean lukewarm water.");
        if (pmSteps.length === 0) pmSteps.push("Rinse face thoroughly with clean water.");

        if (protocolBox) protocolBox.classList.remove('hidden');
        if (reportContent) {
            reportContent.textContent = warningNote;
            reportContent.style.borderColor = activeHarmfulTrends > 0 ? "var(--status-alert-border)" : "var(--border-subtle)";
        }
        
        if (amRoutineList) amRoutineList.innerHTML = amSteps.map(s => `<li>${s}</li>`).join('');
        if (pmRoutineList) pmRoutineList.innerHTML = pmSteps.map(s => `<li>${s}</li>`).join('');

        renderVisualThresholdChart(labels, metrics);
        updateHonestLocalMetrics(currentEvaluatedScore, trendsAvoidedCount, activeHarmfulTrends);
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
                datasets: [{ 
                    label: 'Barrier Health Index (%)', 
                    data: metrics, 
                    borderColor: '#59912f', 
                    borderWidth: 2.5, 
                    pointBackgroundColor: '#c49a45', 
                    tension: 0.2, 
                    fill: false 
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } } }
        });
    }

    // Currency switch preserves proportional budget
    const currencySelector = document.getElementById('currencySelector');
    if (currencySelector && budgetSlider) {
        currencySelector.addEventListener('change', (e) => {
            currentCurrency = e.target.value;
            const config = currencyMap[currentCurrency] || currencyMap["IDR"];
            
            budgetSlider.max = config.maxBudget;
            budgetSlider.step = config.step;
            budgetSlider.value = config.defaultVal;
            
            calculateSkinTrajectory();
        });
    }

    if (budgetSlider) budgetSlider.addEventListener('input', calculateSkinTrajectory);
    selectors.forEach(id => { 
        const el = document.getElementById(id); 
        if (el) el.addEventListener('change', calculateSkinTrajectory);
    });

    // --- STARTER PACK PRESET ---
    const starterPackBtn = document.getElementById('starterPackBtn');
    if (starterPackBtn) {
        starterPackBtn.addEventListener('click', function() {
            const chkCleanser = document.getElementById('chk-cleanser');
            const chkMoisturizer = document.getElementById('chk-moisturizer');
            const chkSunscreen = document.getElementById('chk-sunscreen');
            
            if (chkCleanser) chkCleanser.checked = true;
            if (chkMoisturizer) chkMoisturizer.checked = true;
            if (chkSunscreen) chkSunscreen.checked = true;
            
            calculateSkinTrajectory();
            this.innerText = "✅ Starter Routine Applied!";
            setTimeout(() => { this.innerText = "✨ Apply 3-Step Starter Routine"; }, 2000);
        });
    }

    // --- SIMPLIFIED ENGLISH SKIN TYPE QUIZ ---
    const quizData = [
        { 
            q: "1. How does your face feel 1 hour after washing with plain water?", 
            a: [ 
                { text: "Tight, dry, or flaky all over", type: "base:Dry" }, 
                { text: "Shiny, greasy, or slick all over", type: "base:Oily" }, 
                { text: "Oily on forehead/nose, but dry on cheeks", type: "base:Combination" }, 
                { text: "Comfortable and smooth", type: "base:Normal" } 
            ] 
        },
        { 
            q: "2. How often does your skin sting, burn, or turn red when trying new products?", 
            a: [ 
                { text: "Frequently — my skin gets irritated easily", type: "react:Sensitive" }, 
                { text: "Rarely — my skin handles products easily", type: "react:Resilient" } 
            ] 
        },
        { 
            q: "3. Do you get frequent breakouts, pimples, or clogged pores?", 
            a: [ 
                { text: "Yes, I get regular blemishes in high-oil areas", type: "acne:true" }, 
                { text: "No, pimples are rare for me", type: "acne:false" } 
            ] 
        },
        { 
            q: "4. Does your skin feel tight underneath even if it looks shiny on top?", 
            a: [ 
                { text: "Yes, it feels pulled or dry underneath", type: "dehyd:true" }, 
                { text: "No, my skin feels comfortable", type: "dehyd:false" } 
            ] 
        },
        { 
            q: "5. What is your main skincare goal right now?", 
            a: [ 
                { text: "Prevent breakouts & control shine", type: "base:Oily" }, 
                { text: "Fix dry, flaky, or tight skin", type: "base:Dry" }, 
                { text: "Calm redness & irritation", type: "react:Sensitive" }, 
                { text: "Maintain healthy skin on a budget", type: "base:Normal" } 
            ] 
        }
    ];

    let quizAnswers = []; 
    let currentQuestionIndex = 0;

    function initializeQuizEngine() {
        quizAnswers = []; 
        currentQuestionIndex = 0;
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
        if (progressTracker) progressTracker.textContent = `Step ${stepNum} of 5`;
        if (progressBar) progressBar.style.width = `${(stepNum / 5) * 100}%`;

        const currentQ = quizData[currentQuestionIndex];
        if (questionText) questionText.textContent = currentQ.q;
        if (optionsContainer) {
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
    }

    function evaluateQuizResults() {
        const questionBox = document.getElementById('questionBox');
        const resultBox = document.getElementById('quizResultBox');
        if (questionBox) questionBox.classList.add('hidden');
        if (resultBox) resultBox.classList.remove('hidden');

        let baseTypes = { Normal: 0, Oily: 0, Dry: 0, Combination: 0 };
        let reactTypes = { Sensitive: 0, Resilient: 0 };

        quizAnswers.forEach(ans => {
            if (ans.startsWith("base:")) baseTypes[ans.split(":")[1]]++;
            if (ans.startsWith("react:")) reactTypes[ans.split(":")[1]]++;
        });

        let determinedBase = Object.keys(baseTypes).reduce((a, b) => baseTypes[a] > baseTypes[b] ? a : b);
        let determinedReact = reactTypes.Sensitive >= reactTypes.Resilient ? "Sensitive" : "Resilient";

        userSkinProfile.baseType = determinedBase;
        userSkinProfile.reactivity = determinedReact;
        userSkinProfile.isCalculated = true;

        let typeStr = `${determinedBase} Skin (${determinedReact})`; 
        let descStr = `Your answers indicate a ${determinedBase.toLowerCase()} skin type. Focus on gentle cleansing and lightweight hydration without over-stripping your skin.`;

        if (determinedReact === "Sensitive") {
            descStr += " Since your skin reacts easily, avoid added fragrances or physical face scrubs.";
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

    // --- DERMA GROW AI & SNAP ANALYSIS ---
    window.handleImageSnap = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('imagePreview');
                const container = document.getElementById('imagePreviewContainer');
                if (preview && container) {
                    preview.src = e.target.result;
                    container.classList.remove('hidden');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    window.analyzeProductIngredients = function() {
        const input = document.getElementById('aiIngredientInput');
        const resultBox = document.getElementById('aiAnalysisResult');
        const resultTitle = document.getElementById('aiResultTitle');
        const resultBody = document.getElementById('aiResultBody');

        if (!input || !input.value.trim()) {
            alert("Please paste ingredients or select a product photo first.");
            return;
        }

        const text = input.value.toLowerCase();
        let warnings = [];
        let positives = [];

        if (text.includes("lemon") || text.includes("citric acid") || text.includes("scrub")) {
            warnings.push("Contains harsh acids or physical abrasive particles that can strip your skin barrier.");
        }
        if (text.includes("alcohol denat") || text.includes("denatured alcohol")) {
            warnings.push("Contains drying alcohol which can cause tightness or irritation.");
        }
        if (text.includes("glycerin") || text.includes("niacinamide") || text.includes("ceramide") || text.includes("hyaluronic")) {
            positives.push("Contains skin-identical moisturizing ingredients (Glycerin, Niacinamide, or Ceramides) that support barrier repair.");
        }

        if (resultBox && resultTitle && resultBody) {
            resultBox.classList.remove('hidden');
            resultTitle.textContent = warnings.length > 0 ? "⚠️ Safety Analysis: Use with Caution" : "✅ Safety Analysis: Barrier Friendly";
            
            let html = "";
            if (positives.length > 0) {
                html += `<p style="color: var(--brand-primary); margin-bottom: 0.5rem;"><strong>Benefits:</strong> ${positives.join(" ")}</p>`;
            }
            if (warnings.length > 0) {
                html += `<p style="color: var(--status-alert-text);"><strong>Potential Risks:</strong> ${warnings.join(" ")}</p>`;
            } else {
                html += `<p style="color: var(--brand-primary);">Formula appears clean and gentle for daily use!</p>`;
            }
            resultBody.innerHTML = html;
        }
    };

    // --- SCIENCE HUB DATA LAYER ---
    const scienceDatabase = [
        { id: 1, category: "myths", badge: "Trend Debunker", badgeClass: "badge-myth", title: "The DIY Lemon Juice Trend", description: "Applying raw lemon juice strips your natural skin acid mantle due to extreme acidity (~2.0 pH), inducing chemical irritation.", actionText: "Read Safety Data →", link: "https://pubchem.ncbi.nlm.nih.gov/compound/Citric-acid" },
        { id: 2, category: "myths", badge: "Trend Debunker", badgeClass: "badge-myth", title: "Physical Scrubs vs. Friction", description: "Abrasives like crushed walnut shells cause micro-scratches on surface skin cells, disrupting moisture protection.", actionText: "Read Friction Studies →", link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5608132/" },
        { id: 3, category: "classification", badge: "Product Category", badgeClass: "badge-class", title: "Cleansers: Low-pH Surfactants", description: "Low-pH cleansers clean effectively without depleting native skin lipids or causing post-wash tightness.", actionText: "Read Surfactant Science →", link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3088928/" },
        { id: 4, category: "classification", badge: "Product Category", badgeClass: "badge-class", title: "Moisturizers: Essential Types", description: "Humectants bind moisture inside epidermal layers, while occlusives form a physical surface seal that reduces water loss.", actionText: "Read Dermatological Guide →", link: "https://www.health.harvard.edu/staying-healthy/the-hype-over-skin-care-ingredients" },
        { id: 5, category: "actives", badge: "Skincare Ingredient", badgeClass: "badge-science", title: "Niacinamide (Vitamin B3)", description: "Extensively researched molecule shown to boost ceramide production and support natural hydration paths.", actionText: "View Niacinamide Trial Data →", link: "https://pubmed.ncbi.nlm.nih.gov/12100180/" },
        { id: 6, category: "anatomy", badge: "Skin Biology", badgeClass: "badge-science", title: "The Skin Barrier Structure", description: "The stratum corneum operates like a brick wall: corneocyte skin cells are bricks, and lipid ceramides act as mortar.", actionText: "Read Barrier Function Literature →", link: "https://www.jidonline.org/article/S0022-202X(15)34551-7/fulltext" }
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

    // --- SHARED DIRECTORY WITH BUY/ACTION LINKS & IMAGES ---
    const peerRegistryDatabase = [
        { id: 1, skinType: "Oily", product: "Garnier Micellar Water Blue", cost: "Rp 35.000 / $3", ingredients: "Water, Glycerin, Disodium Cocoamphodiacetate", buyUrl: "https://www.garnier.co.id/", definition: "Oil-free surfactant solution that cleanses away sunscreen layers without clogging pores." },
        { id: 2, skinType: "Dry", product: "The Ordinary Natural Moisturizing Factors", cost: "Rp 120.000 / $8", ingredients: "Amino Acids, Ceramides, Hyaluronic Acid", buyUrl: "https://theordinary.com/", definition: "A clean, Fragrance-free barrier moisturizing cream built to resolve cell flaking." },
        { id: 3, skinType: "Sensitive", product: "Cetaphil Gentle Skin Cleanser", cost: "Rp 65.000 / $6", ingredients: "Water, Cetyl Alcohol, Propylene Glycol", buyUrl: "https://www.cetaphil.com/", definition: "Non-foaming, classic dermatologist recommendation designed to cleanse without stripping pH." },
        { id: 4, skinType: "Normal", product: "Azarine Hydrasoothe Sunscreen Gel SPF 45", cost: "Rp 65.000 / $5", ingredients: "Aloe Vera, Green Tea, Niacinamide", buyUrl: "https://azarinecosmetic.com/", definition: "Lightweight organic sunscreen gel leaving zero white cast or greasy sheen." }
    ];

    const peerRegistryGrid = document.getElementById('peerRegistryGrid');
    const peerFilterBtns = document.querySelectorAll('.peer-filter-btn');

    function renderPeerRegistry(skinFilter) {
        if (!peerRegistryGrid) return;
        const filteredData = peerRegistryDatabase.filter(item => skinFilter === "all" || item.skinType === skinFilter);

        peerRegistryGrid.innerHTML = filteredData.map(item => `
            <div class="content-card tab-fade-animation" style="border-top: 3px solid var(--brand-accent);">
                <span class="badge ${item.skinType === 'Oily' ? 'badge-science' : item.skinType === 'Dry' ? 'badge-myth' : 'badge-class'}">${item.skinType} Skin</span>
                <h3 style="margin-top: 0.25rem; font-size: 1.15rem; color: var(--brand-primary);">${item.product}</h3>
                <p style="font-size: 0.85rem; font-weight: 700; color: var(--brand-accent); margin-bottom: 0.5rem;">Cost: ${item.cost}</p>
                <p style="font-size: 0.85rem; color: var(--color-text-main); line-height: 1.5; margin-bottom: 0.75rem;"><strong>Peer Notes:</strong> "${item.definition}"</p>
                <div style="background: var(--bg-main); padding: 0.6rem; border-radius: 6px; font-size: 0.8rem; border: 1px solid var(--border-subtle); margin-bottom: 0.75rem;">
                    <p>🧪 <strong>Ingredients:</strong> ${item.ingredients}</p>
                </div>
                <a href="${item.buyUrl}" target="_blank" rel="noopener noreferrer" class="btn-preset" style="text-decoration: none; display: inline-block; text-align: center;">🛍️ View Product Details</a>
            </div>
        `).join('');
    }

    peerFilterBtns.forEach(btn => btn.addEventListener('click', () => {
        peerFilterBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
        renderPeerRegistry(btn.getAttribute('data-skin'));
    }));

    // --- DICTIONARY DATA ---
    const matrix = [
        ["Hyaluronic Acid", "A moisture-binding molecule that holds water to plump the skin surface."],
        ["Niacinamide", "Vitamin B3 compound that strengthens the barrier and balances oil production."],
        ["Retinol", "Vitamin A derivative that accelerates skin cell turnover."],
        ["Salicylic Acid", "Beta Hydroxy Acid (BHA) that unclogs oil inside pore channels."],
        ["Glycerin", "A gentle, time-tested humectant that pulls moisture into surface skin cells."]
    ];

    const dictionaryListContainer = document.getElementById('dictionaryListContainer');
    const dictionarySearchInput = document.getElementById('dictionarySearchInput');

    function renderDictionaryList(searchTerm = "") {
        if (!dictionaryListContainer) return;
        const cleanSearch = searchTerm.toLowerCase().trim();
        const filtered = matrix.filter(row => row[0].toLowerCase().includes(cleanSearch) || row[1].toLowerCase().includes(cleanSearch));

        dictionaryListContainer.innerHTML = filtered.map(row => `
            <div class="dict-card tab-fade-animation">
                <h3>${row[0]}</h3>
                <p class="dict-def">${row[1]}</p>
            </div>
        `).join('');
    }

    if (dictionarySearchInput) {
        dictionarySearchInput.addEventListener('input', (e) => {
            renderDictionaryList(e.target.value);
        });
    }

    // --- PROFILE ENGINE ---
    const savedName = localStorage.getItem('dermaGrowUserName');
    const profileInput = document.getElementById('profileNameInput');
    if (savedName && profileInput) profileInput.value = savedName;

    window.saveUserProfile = function() {
        const input = document.getElementById('profileNameInput');
        if (input && input.value.trim()) {
            localStorage.setItem('dermaGrowUserName', input.value.trim());
            alert("Profile saved successfully!");
        }
    };

    window.refreshTip = function() {
        const tips = [
            "Your skin is a living organ, not a filter. Give it grace today.",
            "Consistency with a safe, simple routine beats a expensive 10-step routine every time.",
            "Pores and texture are completely natural human features, not flaws."
        ];
        const el = document.getElementById('dailyTip');
        if (el) el.textContent = tips[Math.floor(Math.random() * tips.length)];
    };

    // Initial load
    calculateSkinTrajectory();
    renderCards("all");
    renderDictionaryList("");
});
