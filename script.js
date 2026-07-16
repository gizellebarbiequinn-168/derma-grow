document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // === 1. NAVIGATION ENGINE =================
    // ==========================================
    const navLinks = {
        navDashboard: document.getElementById("trackerCard"),
        navQuiz: document.getElementById("quizSection"),
        navLearn: document.getElementById("learnSection"),
        navRecommendations: document.getElementById("recommendationsSection"),
        navDictionary: document.getElementById("dictionarySection")
    };
    const heroSection = document.getElementById("heroSection");
    const impactMatrix = document.getElementById("impactMatrix");

    Object.keys(navLinks).forEach(clickedId => {
        const linkEl = document.getElementById(clickedId);
        if (linkEl) {
            linkEl.addEventListener("click", (e) => {
                e.preventDefault();
                
                // Switch Active Navigation Tabs
                Object.keys(navLinks).forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.classList.remove("active");
                });
                linkEl.classList.add("active");

                // Toggle Main Element Visibilities
                Object.values(navLinks).forEach(section => {
                    if (section) section.classList.add("hidden");
                });

                if (clickedId === "navDashboard") {
                    navLinks.navDashboard.classList.remove("hidden");
                    if (heroSection) heroSection.classList.remove("hidden");
                    if (impactMatrix) impactMatrix.classList.remove("hidden");
                } else {
                    navLinks[clickedId].classList.remove("hidden");
                    if (heroSection) heroSection.classList.add("hidden");
                    if (impactMatrix) impactMatrix.classList.add("hidden");
                }
            });
        }
    });

    // ==========================================
    // === 2. CSS CUSTOM VARIABLE THEME ENGINE ===
    // ==========================================
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    let isDarkTheme = false;
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            isDarkTheme = !isDarkTheme;
            if (isDarkTheme) {
                document.documentElement.style.setProperty('--bg-main', '#1a1f1c');
                document.documentElement.style.setProperty('--bg-card', '#222824');
                document.documentElement.style.setProperty('--color-text-main', '#e2e8e4');
                document.documentElement.style.setProperty('--color-text-muted', '#a0aba3');
                document.documentElement.style.setProperty('--border-subtle', '#333b36');
            } else {
                document.documentElement.style.setProperty('--bg-main', '#fbfcfa');
                document.documentElement.style.setProperty('--bg-card', '#ffffff');
                document.documentElement.style.setProperty('--color-text-main', '#2d3631');
                document.documentElement.style.setProperty('--color-text-muted', '#68776e');
                document.documentElement.style.setProperty('--border-subtle', '#e6ebe7');
            }
        });
    }

    // ==========================================
    // === 3. BUDGET ROUTINE CONFIGURATION ======
    // ==========================================
    const budgetSlider = document.getElementById("budgetSlider");
    const budgetValue = document.getElementById("budgetValue");
    const chkMoisturizer = document.getElementById("chk-moisturizer");
    const chkCleanser = document.getElementById("chk-cleanser");
    const chkSunscreen = document.getElementById("chk-sunscreen");
    const chkToner = document.getElementById("chk-toner");
    const chkNiacinamide = document.getElementById("chk-niacinamide");
    const chkActives = document.getElementById("chk-actives");
    const chkLemon = document.getElementById("chk-lemon");
    const chkScrubs = document.getElementById("chk-scrubs");

    const protocolBox = document.getElementById("protocolBox");
    const reportContent = document.getElementById("reportContent");
    const amRoutineList = document.getElementById("amRoutineList");
    const pmRoutineList = document.getElementById("pmRoutineList");
    const itemsSavedCount = document.getElementById("itemsSavedCount");
    const optimizationDelta = document.getElementById("optimizationDelta");
    const impactSummaryText = document.getElementById("impactSummaryText");

    const checkboxes = [chkMoisturizer, chkCleanser, chkSunscreen, chkToner, chkNiacinamide, chkActives, chkLemon, chkScrubs];

    function calculateRoutineGrid() {
        let currentSelections = 0;
        let trendScore = 0;
        let dangerAlerts = [];
        
        let amArr = [];
        let pmArr = [];

        if (chkCleanser && chkCleanser.checked) {
            currentSelections++;
            amArr.push("Splash clean with lukewarm water or use Gentle Low-pH Cleanser.");
            pmArr.push("Massage Gentle Low-pH Cleanser over damp skin for 60 seconds to clear surface waste.");
        }
        if (chkToner && chkToner.checked) {
            currentSelections++;
            amArr.push("Pat Gentle Hydrating Toner down to prep absorption paths.");
            pmArr.push("Pat Gentle Hydrating Toner down for instant water-layer delivery.");
        }
        if (chkNiacinamide && chkNiacinamide.checked) {
            currentSelections++;
            amArr.push("Apply 2-3 drops of Niacinamide Serum to support environmental barrier shielding.");
            pmArr.push("Apply Niacinamide Serum to assist skin barrier lipid synthesis overnight.");
        }
        if (chkMoisturizer && chkMoisturizer.checked) {
            currentSelections++;
            amArr.push("Apply thin layer of Basic Moisturizer / Glycerin mix to lock structural fluids.");
            pmArr.push("Apply generous layer of Basic Moisturizer / Glycerin to prevent trans-epidermal water loss.");
        }
        if (chkSunscreen && chkSunscreen.checked) {
            currentSelections++;
            amArr.push("Apply a uniform layer of Broad-Spectrum Sunscreen (SPF 30+) as the vital final shield.");
        }

        // Catch Active Ingredients / Hype Trends
        if (chkActives && chkActives.checked) {
            trendScore++;
            pmArr.push("⚠️ Apply Active Serum (Retinols/Acids) cautiously. Do not apply on broken surface layers.");
        }
        if (chkLemon && chkLemon.checked) {
            trendScore++;
            dangerAlerts.push("CRITICAL HAZARD: Raw lemon application features a highly acidic pH level (~2) that risks severe chemical burns and blistering UV phytophotodermatitis.");
        }
        if (chkScrubs && chkScrubs.checked) {
            trendScore++;
            dangerAlerts.push("BARRIER THREAT: Coarse abrasive face scrubs generate physical micro-tears across delicate cell networks, causing inflammation.");
        }

        // Display Routine Output Box
        if (currentSelections > 0 || trendScore > 0) {
            if (protocolBox) protocolBox.classList.remove("hidden");
        } else {
            if (protocolBox) protocolBox.classList.add("hidden");
        }

        // Print Warning Notices
        if (reportContent) {
            if (dangerAlerts.length > 0) {
                reportContent.innerHTML = dangerAlerts.map(msg => `<div style="color:#c94c4c; font-weight:700; margin-bottom:0.5rem;">${msg}</div>`).join("");
                reportContent.style.borderColor = "#c94c4c";
            } else if (currentSelections >= 3 && chkSunscreen && chkSunscreen.checked && chkCleanser && chkCleanser.checked && chkMoisturizer && chkMoisturizer.checked) {
                reportContent.innerHTML = "✨ Optimal core structure achieved! Your clean routine balance targets essential functions smoothly.";
                reportContent.style.borderColor = "var(--brand-accent)";
            } else {
                reportContent.innerHTML = "Routine dynamic system online. Add a Cleanser, Moisturizer, and Sunscreen to lock your core framework protection.";
                reportContent.style.borderColor = "var(--border-subtle)";
            }
        }

        // Hydrate DOM lists
        if (amRoutineList) amRoutineList.innerHTML = amArr.map(li => `<li>${li}</li>`).join("");
        if (pmRoutineList) pmRoutineList.innerHTML = pmArr.map(li => `<li>${li}</li>`).join("");

        // Update Matrix Counts
        if (itemsSavedCount) itemsSavedCount.innerText = trendScore;
        
        let percentage = 0;
        if (chkCleanser && chkCleanser.checked) percentage += 30;
        if (chkMoisturizer && chkMoisturizer.checked) percentage += 30;
        if (chkSunscreen && chkSunscreen.checked) percentage += 40;
        if (chkLemon && chkLemon.checked) percentage -= 50;
        if (chkScrubs && chkScrubs.checked) percentage -= 30;
        if (percentage < 0) percentage = 0;

        if (optimizationDelta) optimizationDelta.innerText = `+${percentage}%`;

        if (impactSummaryText) {
            if (percentage >= 100) {
                impactSummaryText.innerHTML = "🎉 Excellent! Your target consistency rating is maxed out with perfect core protection elements.";
            } else if (dangerAlerts.length > 0) {
                impactSummaryText.innerHTML = "⚠️ Warning: Selected DIY remedies or harsh methods are reducing your overall structural target.";
            } else {
                impactSummaryText.innerHTML = "💡 Balancing your routine with core basics helps prevent long-term moisture loss.";
            }
        }

        updateChartData(percentage);
    }

    if (budgetSlider && budgetValue) {
        budgetSlider.addEventListener("input", (e) => {
            budgetValue.innerText = `Rp ${Number(e.target.value).toLocaleString('id-ID')}`;
        });
    }

    const starterPackBtn = document.getElementById("starterPackBtn");
    if (starterPackBtn) {
        starterPackBtn.addEventListener("click", () => {
            if (chkCleanser) chkCleanser.checked = true;
            if (chkMoisturizer) chkMoisturizer.checked = true;
            if (chkSunscreen) chkSunscreen.checked = true;
            calculateRoutineGrid();
        });
    }

    checkboxes.forEach(chk => {
        if (chk) chk.addEventListener("change", calculateRoutineGrid);
    });

    const printRoutineBtn = document.getElementById("printRoutineBtn");
    if (printRoutineBtn) {
        printRoutineBtn.addEventListener("click", () => {
            window.print();
        });
    }

    // ==========================================
    // === 4. TIMELINE LOGIC CHART DATA =========
    // ==========================================
    const ctx = document.getElementById('dermaChart');
    let dermaChartInstance = null;

    if (ctx) {
        dermaChartInstance = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Day 0', 'Day 2', 'Day 4', 'Day 6', 'Day 8', 'Day 10', 'Day 12', 'Day 14'],
                datasets: [{
                    label: 'Conceptual Skin Barrier Health',
                    data: [40, 40, 40, 40, 40, 40, 40, 40],
                    borderColor: '#5b7065',
                    backgroundColor: 'rgba(91, 112, 101, 0.05)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { min: 0, max: 100, grid: { color: 'rgba(0,0,0,0.03)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    function updateChartData(score) {
        if (!dermaChartInstance) return;
        let baseline = 40;
        let finalTarget = baseline + (score * 0.5); 
        
        let dynamicPoints = [
            baseline,
            baseline + (finalTarget - baseline) * 0.15,
            baseline + (finalTarget - baseline) * 0.35,
            baseline + (finalTarget - baseline) * 0.55,
            baseline + (finalTarget - baseline) * 0.75,
            baseline + (finalTarget - baseline) * 0.90,
            finalTarget,
            finalTarget
        ];

        dermaChartInstance.data.datasets[0].data = dynamicPoints;
        dermaChartInstance.data.datasets[0].borderColor = score >= 100 ? '#7d9c87' : (score <= 30 ? '#c94c4c' : '#5b7065');
        dermaChartInstance.update();
    }

    // ==========================================
    // === 5. FORM MANAGEMENT & FEEDBACK NOTES ==
    // ==========================================
    const feedbackForm = document.getElementById("feedbackForm");
    const feedbackSuccessMessage = document.getElementById("feedbackSuccessMessage");

    if (feedbackForm) {
        feedbackForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = new FormData(feedbackForm);
            
            try {
                const response = await fetch(feedbackForm.action, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    if (feedbackSuccessMessage) feedbackSuccessMessage.classList.remove("hidden");
                    feedbackForm.reset();
                    setTimeout(() => {
                        if (feedbackSuccessMessage) feedbackSuccessMessage.classList.add("hidden");
                    }, 4000);
                } else {
                    alert("Submission error encountered. Please verify active networks.");
                }
            } catch (error) {
                alert("Critical transmission failure occurred processing feedback.");
            }
        });
    }

    // ==========================================
    // === 6. 9-STEP DYNAMIC SKIN QUIZ ENGINE ===
    // ==========================================
    const skinQuizData = [
        { q: "How does your face surface feel 1 hour after washing with a standard soap?", a: [{t:"Tight, rough, or showing visible micro-flakes", s:"Dry"}, {t:"Shiny, slick with noticeable oil transfer", s:"Oily"}, {t:"Comfortable, flexible without excessive shine", s:"Normal"}, {t:"Prickling, itchy, or developing blotchy red patches", s:"Sensitive"}] },
        { q: "How frequently do you observe noticeable enlarged pores across your nose and inner cheeks?", a: [{t:"Rarely visible or entirely closed", s:"Dry"}, {t:"Highly visible, large, and easily clogged", s:"Oily"}, {t:"Mildly visible strictly within the central T-zone", s:"Normal"}, {t:"Unpredictable or easily inflamed by environmental shifts", s:"Sensitive"}] },
        { q: "What happens when you apply a thick, heavy protective winter moisture cream?", a: [{t:"It absorbs instantly without leaving a sticky trace", s:"Dry"}, {t:"It sits like a heavy, suffocating oil layer that spawns breakouts", s:"Oily"}, {t:"It feels hydrating but slightly excessive for daily wear", s:"Normal"}, {t:"It sometimes causes burning or instant sensory flushing", s:"Sensitive"}] },
        { q: "Under direct mid-day heat, how does your forehead layer present itself?", a: [{t:"Tight, paper-dry, and intensely dehydrated", s:"Dry"}, {t:"Completely slick with reflective surface sweat and oil", s:"Oily"}, {t:"Slightly warm but regular balanced parameters", s:"Normal"}, {t:"Easily flushed, breaking into hot patches", s:"Sensitive"}] },
        { q: "Describe your current frequency of dynamic acne breakouts or whitehead congestion clusters:", a: [{t:"Almost never, though dry patches surface frequently", s:"Dry"}, {t:"Consistent, widespread inflammatory cycles or blackheads", s:"Oily"}, {t:"Occasional isolated spot around periods of heavy stress", s:"Normal"}, {t:"Mainly small, surface bumps following new product tests", s:"Sensitive"}] },
        { q: "How does your skin profile interact with regular changes in climate or wind?", a: [{t:"Becomes rough, chapped, and severely depleted", s:"Dry"}, {t:"Produces extra protective surface oils to counter dry air", s:"Oily"}, {t:"Adapts seamlessly without radical comfort adjustments", s:"Normal"}, {t:"Becomes highly irritated, raw, or burns when windblown", s:"Sensitive"}] },
        { q: "When you wake up in the morning, what is the first baseline parameter you feel?", a: [{t:"Parched tightness prompting immediate lotion needs", s:"Dry"}, {t:"A clear layer of heavy surface oil all over the face", s:"Oily"}, {t:"A balanced, rested texture without specific problems", s:"Normal"}, {t:"Mild redness or sensitivity depending on fabric friction", s:"Sensitive"}] },
        { q: "How easily does your skin develop redness when rubbed lightly with a towel?", a: [{t:"Rarely red, but can feel more irritated or flaky", s:"Dry"}, {t:"Resilient, showing no real flush response", s:"Oily"}, {t:"Brief temporary flush that settles inside 60 seconds", s:"Normal"}, {t:"Instantly turns bright red, feeling hot for several minutes", s:"Sensitive"}] },
        { q: "What is your main structural objective regarding daily skincare adjustments?", a: [{t:"Replenishing deep surface cellular lipids and moisture", s:"Dry"}, {t:"Controlling excess oil slick and breaking acne cycles", s:"Oily"}, {t:"Maintaining steady, trouble-free longevity optimization", s:"Normal"}, {t:"Calming immediate irritation networks and protecting the barrier", s:"Sensitive"}] }
    ];

    let currentQuizIndex = 0;
    let quizScoreTracker = { Normal: 0, Oily: 0, Dry: 0, Sensitive: 0 };

    const questionText = document.getElementById("questionText");
    const answerOptions = document.getElementById("answerOptions");
    const quizProgressTracker = document.getElementById("quizProgressTracker");
    const quizProgressBar = document.getElementById("quizProgressBar");
    const quizResultBox = document.getElementById("quizResultBox");
    const questionBox = document.getElementById("questionBox");
    const skinTypeTitle = document.getElementById("skinTypeTitle");
    const skinTypeDescription = document.getElementById("skinTypeDescription");
    const resetQuizBtn = document.getElementById("resetQuizBtn");
    const syncToRoutineBtn = document.getElementById("syncToRoutineBtn");
    const profileSyncBadge = document.getElementById("profileSyncBadge");

    let finalAssessedType = "Normal";

    function launchStep() {
        if (!questionText || !answerOptions) return;
        
        if (currentQuizIndex >= skinQuizData.length) {
            tallyQuizResults();
            return;
        }

        if (quizProgressTracker) quizProgressTracker.innerText = `Step ${currentQuizIndex + 1} of 9`;
        if (quizProgressBar) quizProgressBar.style.width = `${((currentQuizIndex + 1) / 9) * 100}%`;

        const activeStep = skinQuizData[currentQuizIndex];
        questionText.innerText = activeStep.q;
        answerOptions.innerHTML = "";

        activeStep.a.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "answer-option-btn";
            btn.innerText = opt.t;
            btn.addEventListener("click", () => {
                quizScoreTracker[opt.s]++;
                currentQuizIndex++;
                launchStep();
            });
            answerOptions.appendChild(btn);
        });
    }

    function tallyQuizResults() {
        if (questionBox) questionBox.classList.add("hidden");
        if (quizResultBox) quizResultBox.classList.remove("hidden");
        if (quizProgressTracker) quizProgressTracker.innerText = "Assessment Finalized";
        if (quizProgressBar) quizProgressBar.style.width = "100%";

        let calculatedType = "Normal";
        let highestValue = -1;

        Object.keys(quizScoreTracker).forEach(key => {
            if (quizScoreTracker[key] > highestValue) {
                highestValue = quizScoreTracker[key];
                calculatedType = key;
            }
        });

        finalAssessedType = calculatedType;
        if (skinTypeTitle) skinTypeTitle.innerText = `${calculatedType.toUpperCase()} SKIN TYPE`;

        let descriptionMap = {
            Normal: "Your skin barrier profile features a balanced moisture-to-lipid ratio. Pores are small, reactivity is extremely low, and it responds beautifully to simple core maintenance routines without requiring heavy oil controls.",
            Oily: "Your sebaceous glands display increased activity, resulting in elevated surface sebum production. This profile requires lightweight hydration configurations (like toners or gels) to avoid deep follicular congestion cycles.",
            Dry: "Your skin matrix demonstrates decreased lipid production levels, leaving the outer stratum corneum vulnerable to fast evaporation. Prioritize deep emollient moisturizers and humectants to lock down vital internal hydration.",
            Sensitive: "Your skin possesses a delicate, hyper-reactive outer defense layer. It experiences accelerated reactions to fragrance, harsh chemical compounds, and rapid environmental transitions. Avoid raw elements and keep your routine minimal."
        };

        if (skinTypeDescription) skinTypeDescription.innerText = descriptionMap[calculatedType];
    }

    if (resetQuizBtn) {
        resetQuizBtn.addEventListener("click", () => {
            currentQuizIndex = 0;
            quizScoreTracker = { Normal: 0, Oily: 0, Dry: 0, Sensitive: 0 };
            if (questionBox) questionBox.classList.remove("hidden");
            if (quizResultBox) quizResultBox.classList.add("hidden");
            launchStep();
        });
    }

    if (syncToRoutineBtn) {
        syncToRoutineBtn.addEventListener("click", () => {
            if (profileSyncBadge) {
                profileSyncBadge.innerText = `Profile: ${finalAssessedType}`;
                profileSyncBadge.style.backgroundColor = "var(--brand-accent)";
                profileSyncBadge.style.color = "#ffffff";
            }
            alert(`Skin profile successfully calibrated to: ${finalAssessedType}. Your parameters have updated.`);
            
            const navDashboard = document.getElementById("navDashboard");
            if (navDashboard) navDashboard.click();
        });
    }

    launchStep();

    // ==========================================
    // === 6b. SCIENCE HUB ARTICLE DATABASE ====
    // ==========================================
    const originalArticles = [
        { title: "The pH Blueprint: Why DIY Remedies Destroy Cells", excerpt: "Evaluating how high-acidity kitchen elements disrupt the delicate acid mantle, leading to opportunistic bacterial infections.", category: "myths" },
        { title: "Glycerin vs Hyaluronic Acid: Real Cost Comparison", excerpt: "An evidence-based look at cost-effective moisture matrices proving why basic humectants regularly equal premium serum complexes.", category: "actives" },
        { title: "Decoding Your Stratum Corneum Wall Dynamics", excerpt: "Analyzing the dead cellular bricks and lipid mortar architecture keeping essential fluids sealed safe inside.", category: "anatomy" },
        { title: "The Sunscreen Mandate: UV Damage Minimization", excerpt: "Explaining why omitting protective daily shields invalidates your entire routine budget investment over time.", category: "classification" }
    ];

    const databaseGrid = document.getElementById("databaseGrid");
    const filterButtons = document.querySelectorAll(".filter-btn");

    function renderArticles(filter = "all") {
        if (!databaseGrid) return;
        databaseGrid.innerHTML = "";
        
        const filtered = originalArticles.filter(art => filter === "all" || art.category === filter);
        
        filtered.forEach(art => {
            databaseGrid.innerHTML += `
                <div class="content-card" style="display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <span style="font-size:0.65rem; background:var(--border-subtle); color:var(--color-text-muted); padding:0.25rem 0.5rem; border-radius:4px; font-weight:700; text-transform:uppercase;">${art.category}</span>
                        <h3 style="margin: 0.5rem 0 0.3rem 0; font-size:1.1rem; color:var(--brand-primary);">${art.title}</h3>
                        <p class="text-muted" style="font-size:0.8rem; line-height:1.4;">${art.excerpt}</p>
                    </div>
                    <button class="filter-btn" style="width:100%; margin-top:1rem; text-align:center;">Read Full Article Research</button>
                </div>`;
        });
    }
    renderArticles();

    filterButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            if(e.target.id === "themeToggleBtn") return; 
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderArticles(btn.getAttribute("data-category"));
        });
    });

    // ==========================================
    // === 6c. PEER PRODUCT DIRECTORY LOGS =====
    // ==========================================
    const originalPeerRegistry = [
        { name: "Wardah Aloe Hydramild Gel", skin: "Normal", cost: "Rp 32.000", ingredients: "Aloe Vera Extract, Glycerin, Panthenol", usage: "Apply thin layer as a light daytime fluid base", notes: "Very clean baseline option for humid climates. Absorbs cleanly without clogging pores." },
        { name: "Sebamed Clear Face Gel", skin: "Oily", cost: "Rp 120.000", ingredients: "Aloe Barbadensis, Allantoin, Hyaluronic Acid", usage: "Apply night and morning to dry areas", notes: "Extremely minimal composition built with zero lipid oils. Perfect option for highly sensitive, acne-prone networks." },
        { name: "Ceramedx Ultra Moisturizing Cream", skin: "Dry", cost: "Rp 240.000", ingredients: "Plant Ceramides, Glycerin, Safflower Seed Oil", usage: "Smooth down after evening toner adjustments", notes: "Thick emollient system that beautifully mimics natural skin matrix mortar cells." }
    ];

    const peerRegistryGrid = document.getElementById("peerRegistryGrid");
    const peerFilterButtons = document.querySelectorAll(".peer-filter-btn");
    const peerContributionForm = document.getElementById("peerContributionForm");
    const peerSuccessMessage = document.getElementById("peerSuccessMessage");

    function renderPeerRegistry(filter = "all") {
        if (!peerRegistryGrid) return;
        peerRegistryGrid.innerHTML = "";

        const filtered = originalPeerRegistry.filter(p => filter === "all" || p.skin === filter);

        filtered.forEach(p => {
            peerRegistryGrid.innerHTML += `
                <div class="content-card" style="border-top: 3px solid var(--brand-accent);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                        <h4 style="margin:0; color:var(--brand-primary); font-size:1.05rem;">${p.name}</h4>
                        <span style="font-size:0.65rem; font-weight:700; background:var(--border-subtle); padding:0.2rem 0.4rem; border-radius:4px;">${p.skin} Profile</span>
                    </div>
                    <div style="font-size:0.8rem; font-weight:600; color:var(--brand-accent); margin-bottom:0.5rem;">Estimated Cost: ${p.cost}</div>
                    <p style="font-size:0.75rem; margin:0 0 0.3rem 0;"><strong>Active Mix:</strong> ${p.ingredients}</p>
                    <p style="font-size:0.75rem; margin:0 0 0.5rem 0; font-style:italic; color:var(--color-text-muted);"><strong>Safe Use:</strong> ${p.usage}</p>
                    <p style="font-size:0.75rem; margin:0; line-height:1.4; background:var(--bg-main); padding:0.5rem; border-radius:4px;">${p.notes}</p>
                </div>`;
        });
    }
    renderPeerRegistry();

    peerFilterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            peerFilterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderPeerRegistry(btn.getAttribute("data-skin"));
        });
    });

    if (peerContributionForm) {
        peerContributionForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = new FormData(peerContributionForm);

            try {
                const response = await fetch(peerContributionForm.action, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    if (peerSuccessMessage) peerSuccessMessage.classList.remove("hidden");
                    peerContributionForm.reset();
                    setTimeout(() => {
                        if (peerSuccessMessage) peerSuccessMessage.classList.add("hidden");
                    }, 4000);
                } else {
                    alert("Submission error encountered. Please verify active networks.");
                }
            } catch (error) {
                alert("Critical transmission failure occurred processing feedback.");
            }
        });
    }

    // ==================================================
    // === 7. LIVE SPECIALIZED COSMETIC DICTIONARY API ===
    // ==================================================
    const searchField = document.getElementById("dictionarySearchInput");
    const listField = document.getElementById("dictionaryListContainer");

    // Comprehensive clinical cosmetic database
    const skincareGlossary = [
        { word: "Niacinamide", category: "Vitamins / Antioxidants", text: "A multi-tasking form of Vitamin B3. Strengthens skin barrier lipids, regulates excess sebum production, calms redness, and visibly fades hyperpigmentation spots." },
        { word: "Hyaluronic Acid", category: "Humectants", text: "A powerhouse structural moisture binder capable of holding up to 1,000 times its own weight in water. Plumps the stratum corneum surface layer instantly." },
        { word: "Salicylic Acid (BHA)", category: "Chemical Exfoliants", text: "An oil-soluble acid that penetrates deep within the pore lining to dissolve dead cell buildup and oxidized sebum plugs. Primary defense against blackheads." },
        { word: "Glycolic Acid (AHA)", category: "Chemical Exfoliants", text: "The smallest alpha hydroxy acid molecule. Dissolves the intercellular glue holding dead cells to the skin surface to reveal smoother, brighter skin texture." },
        { word: "Ceramides", category: "Barrier Repair / Emollients", text: "Essential lipid molecules making up roughly 50% of the natural skin barrier mortar. Repairs compromised, dry, or over-stripped skin profiles." },
        { word: "Glycerin", category: "Humectants", text: "The gold-standard cosmetic humectant. Draws ambient water into surface layers, accelerates barrier healing, and prevents trans-epidermal water loss." },
        { word: "Retinol", category: "Retinoids", text: "A powerful Vitamin A derivative that communicates directly with cells to accelerate skin turnover rates, clear deep congestion, and boost natural collagen networks." },
        { word: "Squalane", category: "Emollients / Oils", text: "A stable, saturated emollient oil that closely mimics the skin's natural sebum composition. Softens rough textures without feeling heavy or blocking pores." },
        { word: "Centella Asiatica (Cica)", category: "Botanical Extracts", text: "Rich in saponins and antioxidants. Highly praised for its intense wound-healing, anti-inflammatory, and skin-soothing properties on angry or sensitive surfaces." },
        { word: "Comedogenic", category: "Terminology", text: "A classification system measuring how likely a specific cosmetic compound or oil is to cause physical blockages, microcomedones, and subsequent acne breakouts." },
        { word: "Benzoyl Peroxide", category: "Acne Treatments", text: "An oxygenating antibacterial agent that targets acne-causing bacteria deep inside the hair follicle. Highly effective for red inflammatory pustules." },
        { word: "Sebaceous Glands", category: "Skin Anatomy", text: "Microscopic exocrine glands located in the dermis layer that naturally secrete protective, lipid-rich oils (sebum) to maintain elasticity and coating." },
        { word: "Azelaic Acid", category: "Dicarboxylic Acids", text: "A gentle, naturally occurring active that clears breakouts, manages rosacea redness, and blocks tyrosine pathways to lighten stubborn post-acne marks." },
        { word: "Panthenol (Vitamin B5)", category: "Humectants / Soothing Agents", text: "An excellent skin protectant with anti-inflammatory properties. Deeply hydrates, reduces redness, and helps calm skin under active chemical stress." },
        { word: "Dimethicone", category: "Silicones / Occlusives", text: "A smooth polymer that creates a breathable, silky barrier layer on the skin surface. Seals in internal moisture matrix layers while smoothing surface imperfections." }
    ];

    function renderDictionary(term = "") {
        if (!listField) return;
        listField.innerHTML = "";
        
        const matched = skincareGlossary.filter(i => 
            i.word.toLowerCase().includes(term.toLowerCase()) || 
            i.category.toLowerCase().includes(term.toLowerCase())
        );
        
        if (matched.length === 0) {
            listField.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--color-text-muted);">
                    <p style="font-size: 0.85rem; margin: 0;">ℹ️ Term not found in database.</p>
                    <p style="font-size: 0.75rem; margin: 0.25rem 0 0 0;">Try searching basic keys like "Acid", "Barrier", "Vitamin", or "Oil".</p>
                </div>`;
            return;
        }
        
        matched.forEach(i => {
            listField.innerHTML += `
                <div class="content-card" style="padding: 1rem; border-left: 3px solid var(--brand-accent); background: var(--bg-card); display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <span style="font-size: 0.65rem; background: var(--border-subtle); color: var(--color-text-muted); padding: 0.2/0.4rem; border-radius: 4px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em;">${i.category}</span>
                        <h4 style="color: var(--brand-primary); font-size: 1.05rem; margin: 0.4rem 0 0.3rem 0; font-weight: 700;">${i.word}</h4>
                        <p style="font-size: 0.8rem; margin: 0; line-height: 1.45; color: var(--color-text-main); font-weight: 400;">${i.text}</p>
                    </div>
                </div>`;
        });
    }

    // Initialize full glossary view
    renderDictionary();

    if (searchField) {
        searchField.addEventListener("input", (e) => {
            renderDictionary(e.target.value.trim());
        });
    }

});
