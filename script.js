document.addEventListener("DOMContentLoaded", () => {
    const ENDPOINT = "https://formspree.io/f/xykrgnlq";

    // --- 1. QUIZ ENGINE (Improved Button Layout) ---
    function renderQuizButtons(options, container) {
        container.innerHTML = "";
        options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "quiz-choice-button";
            btn.innerHTML = `<span>${opt.t}</span>`;
            btn.onclick = () => handleAnswer(opt.s);
            container.appendChild(btn);
        });
    }

    // --- 2. FORM INTEGRATION (Locked Endpoints) ---
    const forms = [document.getElementById("feedbackForm"), document.getElementById("peerContributionForm")];
    forms.forEach(form => {
        if (form) {
            form.action = ENDPOINT;
            form.onsubmit = async (e) => {
                e.preventDefault();
                await fetch(ENDPOINT, { method: "POST", body: new FormData(form), headers: { 'Accept': 'application/json' } });
                alert("Submission successful.");
            };
        }
    });

    // --- 3. DICTIONARY DATA ---
    const glossary = [
        { word: "Niacinamide", category: "Vitamins", text: "Strengthens barrier lipids and regulates sebum." },
        { word: "Hyaluronic Acid", category: "Humectants", text: "Binds water for surface plumping." }
        // ... (Expand with your full list here)
    ];

    // --- 4. GLOBAL NAVIGATION LOGIC ---
    document.querySelectorAll(".nav-link").forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            document.querySelectorAll(".view-section").forEach(s => s.classList.add("hidden"));
            document.getElementById(link.id.replace("nav", "") + "Section")?.classList.remove("hidden");
        };
    });
});
