// --- NAVBAR NAVIGATION CONTROLLER ---
const navDashboard = document.getElementById('navDashboard');
const navLearn = document.getElementById('navLearn');
const heroSection = document.getElementById('heroSection');
const impactMatrix = document.getElementById('impactMatrix');
const trackerCard = document.getElementById('trackerCard');
const learnSection = document.getElementById('learnSection');

navDashboard.addEventListener('click', (e) => {
    e.preventDefault();
    navDashboard.classList.add('active');
    navLearn.classList.remove('active');
    trackerCard.classList.remove('hidden');
    impactMatrix.classList.remove('hidden');
    heroSection.classList.remove('hidden');
    learnSection.classList.add('hidden');
});

navLearn.addEventListener('click', (e) => {
    e.preventDefault();
    navLearn.classList.add('active');
    navDashboard.classList.remove('active');
    trackerCard.classList.add('hidden');
    impactMatrix.classList.add('hidden');
    heroSection.classList.add('hidden');
    learnSection.classList.remove('hidden');
});


// --- OPTIMIZER CALCULATION CONTROLLER ---
const budgetSlider = document.getElementById('budgetSlider');
const budgetValue = document.getElementById('budgetValue');
const prodLotion = document.getElementById('prodLotion');
const prodCleanser = document.getElementById('prodCleanser');
const prodHandmeDown = document.getElementById('prodHandmeDown');
const prodLemonTrend = document.getElementById('prodLemonTrend');
const reportContent = document.getElementById('reportContent');

let dermaChart = null;

function calculateSkinTrajectory() {
    const budget = parseInt(budgetSlider.value);
    budgetValue.textContent = `Rp ${budget.toLocaleString('id-ID')}`;

    // Base timeline configuration
    const labels = ["Day 1", "Day 3", "Day 5", "Day 7", "Day 10", "Day 12", "Day 14"];
    let metrics = [50, 52, 54, 56, 58, 60, 62]; // Baseline
    let diagnosticReport = "STABLE EQUILIBRIUM: Maintaining baseline protection. Prioritize consistency over complex multi-step routines.";

    // Mathematical logical branches based on user constraints
    if (prodLemonTrend.checked) {
        metrics = [75, 50, 28, 18, 12, 10, 8];
        diagnosticReport = "CRITICAL DISRUPTION: Raw botanical kitchen remedies cause immediate acid mantle damage. Stopping these entirely costs Rp 0 and instantly preserves your epidermal structural layer.";
    } else if (prodLotion.checked && prodCleanser.checked && !prodHandmeDown.checked) {
        // The perfect budget-friendly minimalist routine
        metrics = [50, 62, 74, 83, 89, 92, 95];
        diagnosticReport = "OPTIMAL MINIMALIST EFFICIENCY: Perfect score! Combining a low-pH cleanser with a basic occlusive humectant shields against TEWL perfectly on a minimalist budget.";
    } else if (prodHandmeDown.checked && !prodLotion.checked) {
        metrics = [60, 42, 35, 30, 28, 25, 22];
        diagnosticReport = "BARRIER STRIPPING TRAJECTORY: Introducing high-strength hand-me-down actives without a basic moisture barrier to back them up causes cellular stripping. Pause the active until you add a basic humectant.";
    } else if (prodHandmeDown.checked && prodLotion.checked && budget < 100000) {
        metrics = [55, 58, 60, 64, 68, 70, 72];
        diagnosticReport = "MODERATE EQUILIBRIUM: The active is cushioned by your basic lotion, but high potency requires structured skin rest. Dilute active usage to twice a week to maximize your budget.";
    }

    renderVisualThresholdChart(labels, metrics);
    updateImpactMatrix();
}

function renderVisualThresholdChart(labels, metrics) {
    const ctx = document.getElementById('dermaChart').getContext('2d');
    if (dermaChart) {
        dermaChart.destroy();
    }

    dermaChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Barrier Structural Integrity Index (%)',
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
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: function(context) {
                            if (context.tick.value >= 75) return 'rgba(138, 154, 134, 0.2)'; // Homeostasis Green Grid
                            if (context.tick.value <= 40) return 'rgba(231, 76, 60, 0.15)'; // Disruption Red Grid
                            return 'rgba(0, 0, 0, 0.05)';
                        }
                    }
                }
            }
        }
    });
}

// Hook dynamic event listeners directly into your selectors
budgetSlider.addEventListener('input', calculateSkinTrajectory);
prodLotion.addEventListener('change', calculateSkinTrajectory);
prodCleanser.addEventListener('change', calculateSkinTrajectory);
prodHandmeDown.addEventListener('change', calculateSkinTrajectory);
prodLemonTrend.addEventListener('change', calculateSkinTrajectory);


// --- QUANTIFIABLE IMPACT METRICS ENGINE ---
let interactionTracker = 0;
let sectionsFiltered = 0;

function updateImpactMatrix() {
    interactionTracker++;
    
    const noiseNeutralized = Math.min(48, interactionTracker * 3); 
    const productsSaved = Math.min(14, Math.floor(interactionTracker * 0.8)); 
    const clarityIndex = Math.min(100, Math.floor(((interactionTracker * 10) / (sectionsFiltered + 2)) + 50));

    document.getElementById('noiseCount').textContent = `${noiseNeutralized}h`;
    document.getElementById('clutterCount').textContent = productsSaved;
    document.getElementById('clarityScore').textContent = `${clarityIndex}%`;
}


// --- SCIENCE HUB DYNAMIC CARDS ---
const scienceDatabase = [
    { id: 1, category: "myths", badge: "Myth Buster", badgeClass: "badge-myth", title: "The DIY Lemon Juice Trend", description: "Applying pure lemon juice destroys the skin's natural acid mantle (~4.5–5.5 pH) with its extreme acidity (2.0 pH). This results in severe chemical burns, barrier disruption, and post-inflammatory hyperpigmentation.", actionText: "Read Cellular Breakdown →" },
    { id: 2, category: "anatomy", badge: "Skin Anatomy", badgeClass: "badge-science", title: "The Epidermal Barrier Structure", description: "Analysis of the stratum corneum's 'brick and mortar' framework. Corneocytes (bricks) and extracellular lipids (mortar) work in tandem to minimize trans-epidermal water loss (TEWL) and shield against micro-pathogens.", actionText: "View Interactive Diagram →" },
    { id: 3, category: "actives", badge: "Biochemical Active", badgeClass: "badge-science", title: "L-Ascorbic Acid (Vitamin C)", description: "A potent antioxidant that neutralizes reactive oxygen species (ROS) induced by UV radiation. It acts as an essential cofactor for lysyl hydroxylase, directly stimulating intracellular collagen synthesis.", actionText: "View Formulation Guide →" },
    { id: 4, category: "actives", badge: "Biochemical Active", badgeClass: "badge-science", title: "Niacinamide (Vitamin B3)", description: "Precursor to NAD+/NADH coenzymes. Clinically proven to upregulate epidermal sphingolipid synthesis, strengthening the moisture barrier while downregulating melanosome transfer from melanocytes to keratinocytes.", actionText: "View Efficacy Data →" }
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
                <a href="#" class="read-more">${item.actionText}</a>
            </div>
        `;
    });
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        sectionsFiltered++;
        renderCards(btn.getAttribute('data-category'));
        updateImpactMatrix();
    });
});

// Initialize simulation framework and cards on load
calculateSkinTrajectory();
renderCards("all");
