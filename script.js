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

    // Currency Engine Map
    const currencyMap = {
        "IDR": { locale: "id-ID", symbol: "Rp ", maxBudget: 300000, step: 10000 },
        "USD": { locale: "en-US", symbol: "$", maxBudget: 30, step: 1 },
        "EUR": { locale: "de-DE", symbol: "€", maxBudget: 30, step: 1 },
        "GBP": { locale: "en-GB", symbol: "£", maxBudget: 25, step: 1 },
        "SGD": { locale: "en-SG", symbol: "S$", maxBudget: 40, step: 1 },
        "AUD": { locale: "en-AU", symbol: "A$", maxBudget: 45, step: 1 }
    };
    let currentCurrency = "IDR";

    // --- INITIALIZE PROFILE & LOCAL STORAGE ---
    const userID = getOrCreateUserID();
    const displayUserEl = document.getElementById('displayUserID');
    if (displayUserEl) displayUserEl.textContent = userID;

    const savedName = localStorage.getItem('dermaGrowUserName');
    const profileInput = document.getElementById('profileNameInput');
    if (savedName && profileInput) {
        profileInput.value = savedName;
    }
    updateProfileBadge(!!savedName);

    // Auto-save profile input changes in real-time
    profileInput?.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (val) {
            localStorage.setItem('dermaGrowUserName', val);
            updateProfileBadge(true);
        } else {
            localStorage.removeItem('dermaGrowUserName');
            updateProfileBadge(false);
        }
    });

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
            const currentSavedName = localStorage.getItem('dermaGrowUserName');
            if (currentSavedName) {
                profileSyncBadge.textContent = `Linked: ${currentSavedName}`;
                profileSyncBadge.style.backgroundColor = "rgba(76, 175, 80, 0.15)";
                profileSyncBadge.style.color = "#2e7d32";
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
            amSteps = ["Temporarily stop using high-potency active serums.", "Splash face with cool water to avoid stripping native moisture."];
            pmSteps = ["Skip the high-strength active product tonight.", "Focus on finding a simple, low-cost hydrating lotion when your budget allows."];
        }
        else if (state['chk-moisturizer'] && state['chk-cleanser'] && state['chk-sunscreen']) {
            let score = 85;
            summaryText = "COMPLETE BASELINE ROUTINE: Your foundational loop is complete. Gentle cleansing, basic hydration, and broad-spectrum UV protection work together for maximum safety.";
            amSteps = ["Rinse with water or an ultra-mild splash.", "Apply your basic moisturizer/lotion.", "Apply Broad-Spectrum Sunscreen (Crucial daily protection)."];
            pmSteps = ["Use your Gentle Low-pH Cleanser to break down sunscreen and buildup.", "Apply basic moisturizer to damp skin within a few minutes of drying."];
            currentEvaluatedScore = Math.min(score, 100);
            metrics = [50, 62, 72, 80, 86, 90, currentEvaluatedScore];
        }
        else if (state['chk-moisturizer'] && state['chk-cleanser']) {
            currentEvaluatedScore = 75; metrics = [50, 55, 62, 68, 72, 74, 75];
            summaryText = "ESSENTIAL MINIMALIST HYDRATION: Excellent low-cost baseline. Adding an affordable sunscreen will complete the loop.";
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

        // Send telemetry payload to Google Sheets
        const activeProducts = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.parentElement.innerText.trim().split('\n')[0])
            .join(', ');

        logRoutineToSheet(budget, unsafeHaltedCount, activeProducts || "None Selected");
    }

    function renderVisualThresholdChart(labels, metrics) {
        const chartCanvas = document.getElementById('dermaChart');
        if (!chartCanvas) return;
        const ctx = chartCanvas.getContext('2d');
        if (dermaChart) dermaChart.destroy();
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
        if (el) el.addEventListener('change', calculateSkinTrajectory);
    });

    // --- INSTANT STARTER PACK PRESET ---
    const starterPackBtn = document.getElementById('starterPackBtn');
    if (starterPackBtn) {
        starterPackBtn.addEventListener('click', function() {
            ['chk-cleanser', 'chk-moisturizer', 'chk-sunscreen'].forEach(id => {
                const cb = document.getElementById(id);
                if (cb) cb.checked = true;
            });
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

    // --- SKIN QUIZ ENGINE ---
    const quizData = [
        { q: "1. Biological Age Group: What is your age category?", a: [ { text: "Teens", type: "age:Teens" }, { text: "20s - 30s", type: "age:Adult" }, { text: "40s+", type: "age:Mature" } ] },
        { q: "2. Surface Oil production: How does your skin feel an hour after washing with water?", a: [ { text: "Tight / Flaky", type: "base:Dry" }, { text: "Slick / Shiny", type: "base:Oily" }, { text: "T-Zone Oil, Tight Cheeks", type: "base:Combination" }, { text: "Comfortable / Balanced", type: "base:Normal" } ] },
        { q: "3. Comfort Sensitivity: How often do you feel stinging or redness from basic items?", a: [ { text: "Frequently", type: "react:Sensitive" }, { text: "Rarely or Never", type: "react:Resilient" } ] }
    ];

    let quizAnswers = []; let currentQuestionIndex = 0;

    function initializeQuizEngine() {
        quizAnswers = []; currentQuestionIndex = 0;
        document.getElementById('quizResultBox')?.classList.add('hidden');
        document.getElementById('questionBox')?.classList.remove('hidden');
        renderQuizQuestion();
    }

    function renderQuizQuestion() {
        if (currentQuestionIndex >= quizData.length) { evaluateQuizResults(); return; }
        const currentQ = quizData[currentQuestionIndex];
        const questionText = document.getElementById('questionText');
        const optionsContainer = document.getElementById('answerOptions');
        if (questionText) questionText.textContent = currentQ.q;
        if (optionsContainer) {
            optionsContainer.innerHTML = "";
            currentQ.a.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = "btn-primary";
                btn.style.margin = "0.25rem 0";
                btn.textContent = opt.text;
                btn.addEventListener('click', () => { quizAnswers.push(opt.type); currentQuestionIndex++; renderQuizQuestion(); });
                optionsContainer.appendChild(btn);
            });
        }
    }

    function evaluateQuizResults() {
        document.getElementById('questionBox')?.classList.add('hidden');
        document.getElementById('quizResultBox')?.classList.remove('hidden');
        const titleEl = document.getElementById('skinTypeTitle');
        if (titleEl) titleEl.textContent = "QUIZ EVALUATION COMPLETE";
    }

    document.getElementById('resetQuizBtn')?.addEventListener('click', initializeQuizEngine);

    // --- ACADEMY & DICTIONARY MATRIX ---
    const categories = ["Active Component", "Product Function", "Anatomy", "Biology"];
    const matrix = [
        ["Hyaluronic Acid", 0, "Moisture-binding molecule that holds up to 1000x its weight in water.", "Apply to damp skin."],
        ["Niacinamide", 0, "Vitamin B3 compound that strengthens barrier and regulates sebum.", "Mixes well with most actives."],
        ["Salicylic Acid", 0, "Oil-soluble BHA that clears grease inside pores.", "Ideal for blackheads and acne."],
        ["Glycerin", 0, "Cost-effective humectant that pulls hydration into surface layers.", "Extremely safe and non-reactive."],
        ["Ceramides", 0, "Essential structural lipids making up over 50% of skin matrix.", "Restores raw or flaky skin."]
    ];

    function renderDictionaryList(searchTerm = "") {
        const dictionaryListContainer = document.getElementById('dictionaryListContainer');
        if (!dictionaryListContainer) return;
        const cleanSearch = searchTerm.toLowerCase().trim();
        const filtered = matrix.filter(row => row[0].toLowerCase().includes(cleanSearch) || row[2].toLowerCase().includes(cleanSearch));
        dictionaryListContainer.innerHTML = filtered.map(row => `
            <div class="content-card" style="margin-bottom: 0.75rem;">
                <h3>${row[0]} <span style="font-size: 0.75rem; color: var(--brand-accent); font-weight: normal;">(${categories[row[1]]})</span></h3>
                <p style="font-size: 0.85rem; margin: 0.25rem 0;">${row[2]}</p>
                <div style="font-size: 0.8rem; color: var(--color-text-muted);">💡 <strong>Pro Tip:</strong> ${row[3]}</div>
            </div>
        `).join('');
    }

    document.getElementById('dictionarySearchInput')?.addEventListener('input', (e) => renderDictionaryList(e.target.value));

    // Multi-Currency Listener
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

    // First Paint Execution
    calculateSkinTrajectory();
    renderDictionaryList("");
    initializeDailyMetrics();
});

// --- GLOBAL UTILITY FUNCTIONS ---

function getOrCreateUserID() {
    let userID = localStorage.getItem('dermaGrowUserID');
    if (!userID) {
        userID = 'user_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('dermaGrowUserID', userID);
    }
    return userID;
}

function updateProfileBadge(isLinked) {
    const badges = document.querySelectorAll('#profileSyncBadge, .profile-status');
    badges.forEach(badge => {
        if (isLinked) {
            badge.textContent = "PROFILE: LINKED";
            badge.style.backgroundColor = "rgba(76, 175, 80, 0.15)";
            badge.style.color = "#2e7d32";
        } else {
            badge.textContent = "PROFILE: UNLINKED";
            badge.style.backgroundColor = "var(--border-subtle)";
            badge.style.color = "var(--color-text-muted)";
        }
    });
}

function saveUserProfile() {
    const nameInput = document.getElementById('profileNameInput');
    const userName = nameInput ? nameInput.value.trim() : "";

    if (!userName) {
        alert("Please enter a name or alias.");
        return;
    }

    localStorage.setItem('dermaGrowUserName', userName);
    updateProfileBadge(true);
    logRoutineToSheet(0, 0, "Profile Saved / Synced");
    alert("Profile saved! Your name is now linked to your telemetry logs.");
}

// --- GOOGLE SHEETS TELEMETRY LOGGER ---
function logRoutineToSheet(budget, trendsAvoided, selectedProducts) {
    const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyE6HD5igg4bbMJYK3bDx6QttI3PzBF1Zvr-GZ8i5ZVRLOjF-nwpvKS3Bx1KeHBREMa/exec";
    
    const profileInput = document.getElementById('profileNameInput');
    const inputVal = profileInput ? profileInput.value.trim() : "";
    const savedName = localStorage.getItem('dermaGrowUserName');
    const finalUserName = inputVal || savedName || "Guest";

    fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userID: getOrCreateUserID(),
            userName: finalUserName,
            timestamp: new Date().toISOString(),
            budget: budget,
            trendsAvoided: trendsAvoided,
            routine: selectedProducts
        })
    }).catch(err => console.log("Silent telemetry log failure"));
}

// --- TAB SWITCHING MANAGER ---
function switchTab(tabName) {
    const sections = document.querySelectorAll('.view-section');
    sections.forEach(section => section.classList.add('hidden'));

    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));

    if (tabName === 'dashboard') {
        document.getElementById('heroSection')?.classList.remove('hidden');
        document.getElementById('trackerCard')?.classList.remove('hidden');
        document.getElementById('navDashboard')?.classList.add('active');
    } else if (tabName === 'quiz') {
        document.getElementById('quizSection')?.classList.remove('hidden');
        document.getElementById('navQuiz')?.classList.add('active');
    } else if (tabName === 'science') {
        document.getElementById('learnSection')?.classList.remove('hidden');
        document.getElementById('navLearn')?.classList.add('active');
    } else if (tabName === 'directory') {
        document.getElementById('recommendationsSection')?.classList.remove('hidden');
        document.getElementById('navRecommendations')?.classList.add('active');
    } else if (tabName === 'dictionary') {
        document.getElementById('dictionarySection')?.classList.remove('hidden');
        document.getElementById('navDictionary')?.classList.add('active');
    } else if (tabName === 'profile') {
        document.getElementById('profileSection')?.classList.remove('hidden');
        document.getElementById('navProfile')?.classList.add('active');
    }
}

// --- DAILY METRICS ENGINE ---
function initializeDailyMetrics() {
    const today = new Date().toDateString();
    let userStats = JSON.parse(localStorage.getItem('dermaGrowStats')) || {
        lastVisit: null,
        streakDays: 1,
        trendsAvoided: 0
    };

    if (userStats.lastVisit) {
        const lastDate = new Date(userStats.lastVisit);
        const currentDate = new Date(today);
        const diffDays = Math.ceil(Math.abs(currentDate - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) userStats.streakDays += 1;
        else if (diffDays > 1) userStats.streakDays = 1;
    }

    userStats.lastVisit = today;
    localStorage.setItem('dermaGrowStats', JSON.stringify(userStats));

    const activeUsersEl = document.getElementById('activeUsersCount');
    if (activeUsersEl) activeUsersEl.textContent = `${userStats.streakDays} Day Streak`;
}

function refreshTip() {
    const tips = [
        "Your skin is a complex, living shield protecting you from the world.",
        "Consistency with safe, affordable elements outperforms an expensive luxury routine.",
        "Skin healing is non-linear—unexpected flare-ups don't erase progress.",
        "Bypassing aggressive marketing hype shows great judgment. Your routine is smart science."
    ];
    const targetElement = document.getElementById('dailyTip');
    if (targetElement) targetElement.textContent = tips[Math.floor(Math.random() * tips.length)];
}
