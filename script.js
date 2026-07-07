// --- NAVBAR NAVIGATION CONTROLLER ---
const navDashboard = document.getElementById('navDashboard');
const navLearn = document.getElementById('navLearn');
const heroSection = document.getElementById('heroSection');
const trackerCard = document.getElementById('trackerCard');
const learnSection = document.getElementById('learnSection');

navDashboard.addEventListener('click', (e) => {
    e.preventDefault();
    navDashboard.classList.add('active');
    navLearn.classList.remove('active');
    trackerCard.classList.remove('hidden');
    heroSection.classList.remove('hidden');
    learnSection.classList.add('hidden');
});

navLearn.addEventListener('click', (e) => {
    e.preventDefault();
    navLearn.classList.add('active');
    navDashboard.classList.remove('active');
    trackerCard.classList.add('hidden');
    heroSection.classList.add('hidden');
    learnSection.classList.remove('hidden');
});


// --- LAB TRACKER CHART ENGINE ---
const plotBtn = document.getElementById('plotBtn');
const dataInput = document.getElementById('dataInput');
const chartFeedback = document.getElementById('chartFeedback');
let dermaChart = null;

plotBtn.addEventListener('click', () => {
    const rawValue = dataInput.value.trim();
    if (!rawValue) {
        chartFeedback.textContent = "Please enter numbers separated by commas.";
        return;
    }
    
    const numberArray = rawValue.split(',').map(num => parseFloat(num.trim())).filter(num => !isNaN(num));
    
    if (numberArray.length === 0) {
        chartFeedback.textContent = "Invalid entry. Use format: 45, 50, 60";
        return;
    }
    
    chartFeedback.classList.add('hidden');
    const ctx = document.getElementById('dermaChart').getContext('2d');
    
    if (dermaChart) {
        dermaChart.destroy();
    }
    
    const labelArray = numberArray.map((_, index) => `Day ${index + 1}`);
    
    dermaChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelArray,
            datasets: [{
                label: 'Skin Biometric Metrics (%)',
                data: numberArray,
                borderColor: '#8A9A86',
                backgroundColor: 'rgba(138, 154, 134, 0.1)',
                borderWidth: 3,
                tension: 0.3,
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
});


// --- CLINICAL INGREDIENT & MYTH DATABASE ---
const scienceDatabase = [
    {
        id: 1,
        category: "myths",
        badge: "Myth Buster",
        badgeClass: "badge-myth",
        title: "The DIY Lemon Juice Trend",
        description: "Applying pure lemon juice destroys the skin's natural acid mantle (~4.5–5.5 pH) with its extreme acidity (2.0 pH). This results in severe chemical burns, barrier disruption, and post-inflammatory hyperpigmentation.",
        actionText: "Read Cellular Breakdown →"
    },
    {
        id: 2,
        category: "anatomy",
        badge: "Skin Anatomy",
        badgeClass: "badge-science",
        title: "The Epidermal Barrier Structure",
        description: "Analysis of the stratum corneum's 'brick and mortar' framework. Corneocytes (bricks) and extracellular lipids (mortar) work in tandem to minimize trransepidermal water loss (TEWL) and shield against micro-pathogens.",
        actionText: "View Interactive Diagram →"
    },
    {
        id: 3,
        category: "actives",
        badge: "Biochemical Active",
        badgeClass: "badge-science",
        title: "L-Ascorbic Acid (Vitamin C)",
        description: "A potent antioxidant that neutralizes reactive oxygen species (ROS) induced by UV radiation. It acts as an essential cofactor for lysyl hydroxylase, directly stimulating intracellular collagen synthesis.",
        actionText: "View Formulation Guide →"
    },
    {
        id: 4,
        category: "actives",
        badge: "Biochemical Active",
        badgeClass: "badge-science",
        title: "Niacinamide (Vitamin B3)",
        description: "Precursor to NAD+/NADH coenzymes. Clinically proven to upregulate epidermal sphingolipid synthesis, strengthening the moisture barrier while downregulating melanosome transfer from melanocytes to keratinocytes.",
        actionText: "View Efficacy Data →"
    }
];

const databaseGrid = document.getElementById('databaseGrid');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderCards(categoryFilter) {
    databaseGrid.innerHTML = "";
    
    const filteredData = scienceDatabase.filter(item => {
        return categoryFilter === "all" || item.category === categoryFilter;
    });
    
    filteredData.forEach(item => {
        const cardHtml = `
            <div class="content-card">
                <span class="badge ${item.badgeClass}">${item.badge}</span>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <a href="#" class="read-more">${item.actionText}</a>
            </div>
        `;
        databaseGrid.innerHTML += cardHtml;
    });
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const selectedCategory = btn.getAttribute('data-category');
        renderCards(selectedCategory);
    });
});

// Run default cards rendering on boot
renderCards("all");
