document.addEventListener("DOMContentLoaded", () => {
    // --- GLOBAL STATE ENGINE ---
    const userSkinProfile = {
        baseType: "Normal",
        reactivity: "Resilient",
        acneProne: false,
        dehydrated: false,
        isCalculated: false,
        age: null,
        skinTone: null
    };

    // --- PERSONALIZED QUIZ LOGIC ---
    window.initPersonalizedQuiz = function() {
        const quizSection = document.getElementById("quizSection");
        if (!quizSection) return;

        quizSection.classList.remove('hidden');
        quizSection.innerHTML = `
            <div class="content-card">
                <h3>Let's Personalize Your Plan</h3>
                <div class="input-group" style="margin-bottom: 1rem;">
                    <label>Age Range</label>
                    <select id="userAge" class="form-input-text">
                        <option value="">Select Age Range</option>
                        <option value="18-25">18-25</option>
                        <option value="26-40">26-40</option>
                        <option value="40+">40+</option>
                    </select>
                </div>
                <div class="input-group" style="margin-bottom: 1rem;">
                    <label>Skin Tone</label>
                    <input type="text" id="userSkinTone" placeholder="e.g., Fair, Medium, Deep..." class="form-input-text">
                </div>
                <button onclick="saveProfile()" class="btn-primary" style="width: 100%;">Save & Start Routine</button>
            </div>
        `;
    };

    window.saveProfile = function() {
        userSkinProfile.age = document.getElementById("userAge").value;
        userSkinProfile.skinTone = document.getElementById("userSkinTone").value;
        userSkinProfile.isCalculated = true;
        alert("Profile saved! Your routine is now being tailored for you.");
        calculateSkinTrajectory();
    };

    // --- NAVIGATION LOGIC ---
    const navItems = ['Dashboard', 'Quiz', 'Learn', 'Recommendations', 'Dictionary'];
    
    function clearActiveTabs() {
        navItems.forEach(id => {
            const nav = document.getElementById(`nav${id}`);
            const section = document.getElementById(id.toLowerCase() === 'dashboard' ? 'trackerCard' : `${id.toLowerCase()}Section`);
            if (nav) nav.classList.remove('active');
            if (section) section.classList.add('hidden');
        });
    }

    navItems.forEach(id => {
        const nav = document.getElementById(`nav${id}`);
        if (nav) {
            nav.addEventListener('click', (e) => {
                e.preventDefault();
                clearActiveTabs();
                nav.classList.add('active');
                const section = document.getElementById(id.toLowerCase() === 'dashboard' ? 'trackerCard' : `${id.toLowerCase()}Section`);
                if (section) section.classList.remove('hidden');
            });
        }
    });

    // --- CORE CALCULATION ENGINE ---
    const selectors = ['chk-moisturizer', 'chk-cleanser', 'chk-sunscreen', 'chk-toner', 'chk-niacinamide', 'chk-actives', 'chk-lemon', 'chk-scrubs'];
    const budgetSlider = document.getElementById('budgetSlider');

    window.calculateSkinTrajectory = function() {
        if (!budgetSlider) return;
        const budget = parseInt(budgetSlider.value);
        document.getElementById('budgetValue').textContent = `Rp ${budget.toLocaleString('id-ID')}`;

        const state = {};
        selectors.forEach(id => { state[id] = document.getElementById(id)?.checked || false; });

        // Logic based on userSkinProfile
        const amRoutineList = document.getElementById('amRoutineList');
        const pmRoutineList = document.getElementById('pmRoutineList');
        
        // Example logic block
        if (state['chk-lemon']) {
            amRoutineList.innerHTML = "<li>Stop using lemon juice immediately.</li>";
            pmRoutineList.innerHTML = "<li>Use only water.</li>";
        } else if (state['chk-moisturizer']) {
            amRoutineList.innerHTML = "<li>Apply Moisturizer.</li>";
            pmRoutineList.innerHTML = "<li>Apply Cleanser and Moisturizer.</li>";
        }
        
        updateHonestLocalMetrics(state, 70);
    };

    function updateHonestLocalMetrics(state, finalScore) {
        // Implementation logic...
    }

    // --- INITIALIZATION ---
    if (budgetSlider) budgetSlider.addEventListener('input', calculateSkinTrajectory);
    selectors.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', calculateSkinTrajectory);
    });

    calculateSkinTrajectory();
});
