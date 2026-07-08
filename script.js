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


// --- CLINICAL SIMULATOR SCENARIO DATABASE ---
const scenarioData = {
    lemon: {
        labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
        metrics: [85, 70, 42, 21, 15, 12, 10],
        report: "CRITICAL BARRIER DISRUPTION ALERT: Introduction of unbuffered 2.0 pH citric acid instantly caused extensive proton accumulation within the intercellular lipid lamellae. By Day 4, the acid mantle collapsed entirely, triggering premature corneocyte desquamation, accelerated trans-epidermal water loss (TEWL), and acute chemical inflammation across the stratum corneum."
    },
    repair: {
        labels: ["Day 1", "Day 3", "Day 6", "Day 9", "Day 12", "Day 14"],
        metrics: [30, 38, 52, 68, 82, 92],
        report: "OPTIMAL BIOMETRIC RECOVERY RECORDED: Sustained applications of Niacinamide (Vitamin B3) stimulated structural upregulation of NAD+/NADH coenzymes within the epidermal layers. This process significantly accelerated cell-envelope protein cross-linking and synthesized essential ceramides, successfully restoring the matrix framework to full hydration equilibrium by Day 14."
    },
    overexfoliate: {
        labels: ["Day 1", "Day 2", "Day 4", "Day 6", "Day 8", "Day 10"],
        metrics: [90, 84, 65, 40, 28, 22],
        report: "CHRONIC STRIPPING TRAJECTORY: Continuous high-percentage exfoliation stripped the surface corneocytes faster than the natural desquamation cycle could replenish them. Cellular structural integrity failed by Day 6, causing complete lipid matrix thinning and rendering the underlying live tissue highly vulnerable to environmental micro-pathogens."
    }
};

let dermaChart = null;
const scenarioBtns = document.querySelectorAll('.scenario-btn');
const labReportBox = document.getElementById('labReportBox');
const reportContent = document.getElementById('reportContent');

function runSimulation(trackKey) {
    const dataSet = scenarioData[trackKey];
    if (!dataSet) return;

    // UI Updates
    labReportBox.classList.remove('hidden');
    reportContent.textContent = dataSet.report;

    // Render/Update the Chart
    const ctx = document.getElementById('dermaChart').getContext('2d');
    if (dermaChart) {
        dermaChart.destroy();
    }

    dermaChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dataSet.labels,
            datasets: [{
                label: 'Skin Barrier Integrity Index (%)',
                data: dataSet.metrics,
                borderColor: '#8A9A86',
                backgroundColor: 'rgba(138, 154, 134, 0.1)',
                borderWidth: 3,
                tension: 0.2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 100 }
            }
        }
    });
}

// Attach click event to all track controllers
scenarioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        scenarioBtns.forEach(b => b.classList.remove('active-scenario'));
        btn.classList.add('active-scenario');
        
        const chosenTrack = btn.getAttribute('data-scenario');
        runSimulation(chosenTrack);
        updateImpactMatrix();
    });
});


// --- QUANTIFIABLE IMPACT METRICS ENGINE ---
let totalSimulationsRun = 0;
let sectionsFiltered = 0;

function updateImpactMatrix() {
    totalSimulationsRun++;
    
    // Convert simulator touches to derived consumer metrics
    const noiseNeutralized = totalSimulationsRun * 4; 
    const productsSaved = Math.floor(totalSimulationsRun * 1.5); 
    
    // Balanced equation for clarity metric progress
    const clarityIndex = Math.min(100, Math.floor(((totalSimulationsRun * 12) / (sectionsFiltered + 2)) + 45));

    // Inject to matrix components
    document.getElementById('noiseCount').textContent = `${noiseNeutralized}h`;
    document.getElementById('clutterCount').textContent = productsSaved;
    document.getElementById('clarityScore').textContent = `${clarityIndex}%`;
}


// --- SCIENCE HUB DYNAMIC CARDS ---
const scienceDatabase = [
    { id: 1, category: "myths", badge: "Myth Buster", badgeClass: "badge-myth", title: "The DIY Lemon Juice Trend", description: "Applying pure lemon juice destroys the skin's natural acid mantle (~4.5–5.5 pH) with its extreme acidity (2.0 pH). This results in severe chemical burns, barrier disruption, and post-inflammatory hyperpigmentation.", actionText: "Read Cellular Breakdown →" },
    { id: 2, category: "anatomy", badge: "Skin Anatomy", badgeClass: "badge-science", title: "The Epidermal Barrier Structure", description: "Analysis of the stratum corneum's 'brick and mortar' framework. Corneocytes (bricks) and extracellular lipids (mortar) work in tandem to minimize transepidermal water loss (TEWL) and shield against micro-pathogens.", actionText: "View Interactive Diagram →" },
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
    });
});

// Primary generation initialization
renderCards("all");
