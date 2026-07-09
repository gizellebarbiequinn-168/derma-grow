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
const prodHandmeDown = document.getElementById('prodHandmeDown');
const prodLemonTrend = document.getElementById('prodLemonTrend');
const reportContent = document.getElementById('reportContent');

let dermaChart = null;

function calculateSkinTrajectory() {
    const budget = parseInt(budgetSlider.value);
    budgetValue.textContent = `Rp ${budget.toLocaleString('id-ID')}`;

    // Base timeline configuration
    const labels = ["Day 1", "Day 3", "Day 5", "Day 7", "Day 10", "Day 12", "Day 14"];
    let metrics = [50, 55, 62, 68, 72, 75, 78]; // Baseline trajectory
    let diagnosticReport = "STABLE EQUILIBRIUM: Your skin barrier integrity is maintaining an upward trend line. Continue tracking consistency over luxury trends.";

    // Mathematical logical branches based on user constraints
    if (prodLemonTrend.checked) {
        metrics = [75, 55, 32, 20, 15, 12, 10];
        diagnosticReport = "CRITICAL BARRIER ALERT: Utilizing unstable raw botanical ingredients (such as raw kitchen citrus alternatives) destroys your skin's natural acid mantle. Even if your current monthly budget is low, avoiding risky home remedies is completely free and instantly stops accelerated epidermal lipid thinning.";
    } else if (prodLotion.checked && !prodHandmeDown.checked && budget < 70000) {
        metrics = [50, 58, 68, 75, 82, 88, 90];
        diagnosticReport = "OPTIMAL EFFICIENCY REACHED: You are maximizing barrier recovery perfectly with zero extra budget overhead. Basic unshaded humectants (like standard mineral oil or glycerin-based body lotions) act as a secure physical shield that successfully traps trans-epidermal water loss (TEWL), allowing the skin envelope to regenerate on its own.";
    } else if (prodHandmeDown.checked && budget < 100000) {
        metrics = [60, 52, 45, 42, 48, 52, 55];
        diagnosticReport = "WARNING - STRUCTURAL MISMATCH: Integrating a high-potency hand-me-down active serum onto a dry skin foundation without an accompanying structural moisturizer causes cellular friction. High concentrations strip cells faster than a restricted budget can repair them. Consider thinning out the active usage to twice a week.";
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
                            // Visually color-code background threshold lines
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

// Hook dynamic event listeners directly into your structural selectors
budgetSlider.addEventListener('input', calculateSkinTrajectory);
prodLotion.addEventListener('change', calculateSkinTrajectory);
prodHandmeDown.addEventListener('change', calculateSkinTrajectory);
prodLemonTrend.addEventListener('change', calculateSkinTrajectory);


// --- QUANTIFIABLE IMPACT METRICS ENGINE ---
let interactionTracker = 0;
let sectionsFiltered = 0;

function updateImpactMatrix() {
    interactionTracker++;
    
    // Convert slider and toggle movements into clarity metrics
    const noiseNeutralized = Math.min(48, interactionTracker * 3); 
    const productsSaved = Math.min(14, Math.floor(interactionTracker * 0.8)); 
    
    // Calculate clarity score based on user interaction activity
    const clarityIndex = Math.min(100, Math.floor(((interactionTracker * 10) / (sectionsFiltered + 2)) + 50));

    // Inject to matrix elements
    document.getElementById('noiseCount').textContent = `${noiseNeutralized}h`;
    document.getElementById('clutterCount').textContent = productsSaved;
    document.getElementById('clarityScore').textContent = `${clarityIndex}%`;
}


// --- SCIENCE HUB DYNAMIC CARDS ---
const scienceDatabase = [
    { id: 1, category: "myths", badge: "Myth Buster", badgeClass: "badge-myth", title: "The DIY Lemon Juice Trend", description: "Applying pure lemon juice destroys the skin's natural acid mantle (~4.5–5.5 pH) with its extreme acidity (2.0 pH). This results in severe chemical burns, barrier disruption, and post-inflammatory hyperpigmentation.", actionText: "Read Cellular Breakdown →" },
    { id: 2, category: "anatomy", badge: "Skin Anatomy", badgeClass: "badge-science", title: "The Epidermal Barrier Structure", description: "Analysis of the stratum corneum's 'brick and mortar' framework. Corneocytes (bricks) and extracellular lipids (mortar) work in tandem to minimize treas-epidermal water loss (TEWL) and shield against micro-pathogens.", actionText: "View Interactive Diagram →" },
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
