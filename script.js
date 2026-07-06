// Grab DOM elements
const plotBtn = document.getElementById('plotBtn');
const dataInput = document.getElementById('dataInput');
const chartFeedback = document.getElementById('chartFeedback');
const ctx = document.getElementById('dermaChart').getContext('2d');

// Grab Tab Elements
const navDashboard = document.getElementById('navDashboard');
const navLearn = document.getElementById('navLearn');
const heroSection = document.getElementById('heroSection');
const trackerCard = document.getElementById('trackerCard');
const learnSection = document.getElementById('learnSection');

let currentChart = null; 

// --- TAB SWITCHING NAVIGATION LOGIC ---
navDashboard.addEventListener('click', (e) => {
    e.preventDefault();
    navDashboard.classList.add('active');
    navLearn.classList.remove('active');
    
    // Show Dashboard, Hide Learn Hub
    heroSection.classList.remove('hidden');
    trackerCard.classList.remove('hidden');
    learnSection.classList.add('hidden');
});

navLearn.addEventListener('click', (e) => {
    e.preventDefault();
    navLearn.classList.add('active');
    navDashboard.classList.remove('active');
    
    // Hide Dashboard, Show Learn Hub
    heroSection.classList.add('hidden');
    trackerCard.classList.add('hidden');
    learnSection.classList.remove('hidden');
});


// --- SCIENTIFIC GRAPHING LOGIC ---
plotBtn.addEventListener('click', () => {
    const rawValue = dataInput.value.trim();
    
    if (rawValue === "") {
        chartFeedback.style.color = "#D9534F";
        chartFeedback.textContent = "Please enter some numbers separated by commas first!";
        return;
    }

    const dataArray = rawValue.split(',').map(num => parseFloat(num.trim()));
    const isValid = dataArray.every(num => !isNaN(num));

    if (!isValid) {
        chartFeedback.style.color = "#D9534F";
        chartFeedback.textContent = "Oops! Make sure you only enter numbers separated by commas.";
        return;
    }

    // Clear feedback block text if data is successfully validated
    chartFeedback.textContent = "";

    const labels = dataArray.map((_, index) => `Day ${index + 1}`);

    if (currentChart) {
        currentChart.destroy();
    }

    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Skin Metric (e.g., Hydration %)',
                data: dataArray,
                borderColor: '#8A9A86',       
                backgroundColor: 'rgba(138, 154, 134, 0.1)', 
                borderWidth: 3,
                tension: 0.3,                 
                pointBackgroundColor: '#4A5548',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 300,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
