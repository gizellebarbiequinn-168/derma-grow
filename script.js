document.addEventListener("DOMContentLoaded", () => {
    // 1. Personalization State
    const userProfile = { age: '', gender: '', skinTone: '', skinType: '' };

    // 2. Navigation Logic
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.view-section').forEach(s => s.classList.add('hidden'));
            document.getElementById(link.getAttribute('data-target')).classList.remove('hidden');
        });
    });

    // 3. Personalized Quiz Form
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = `
        <div class="content-card">
            <input type="number" id="ageInput" placeholder="Age">
            <select id="genderInput">
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
            <input type="text" id="toneInput" placeholder="Skin Tone">
            <button id="saveProfileBtn" class="quiz-choice-button">Save & Start My Routine</button>
        </div>
    `;

    document.getElementById('saveProfileBtn').addEventListener('click', () => {
        userProfile.age = document.getElementById('ageInput').value;
        userProfile.skinTone = document.getElementById('toneInput').value;
        alert("Profile saved! Your routine is now being tailored to you.");
    });
});
