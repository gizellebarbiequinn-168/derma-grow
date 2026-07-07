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
        description: "Analysis of the stratum corneum's 'brick and mortar' framework. Corneocytes (bricks) and extracellular lipids (mortar) work in tandem to minimize transepidermal water loss (TEWL) and shield against micro-pathogens.",
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

// DOM Elements for Filtering
const databaseGrid = document.getElementById('databaseGrid');
const filterBtns = document.querySelectorAll('.filter-btn');

// Function to render cards dynamically
function renderCards(categoryFilter) {
    // Clear out whatever is currently in the grid
    databaseGrid.innerHTML = "";
    
    // Filter the database array
    const filteredData = scienceDatabase.filter(item => {
        return categoryFilter === "all" || item.category === categoryFilter;
    });
    
    // Build the HTML strings and inject them
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

// Set up click events for the category filter buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Switch active button class
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Render matching cards
        const selectedCategory = btn.getAttribute('data-category');
        renderCards(selectedCategory);
    });
});

// Initial boot-up render to show all cards when app opens
renderCards("all");
